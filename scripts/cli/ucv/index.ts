#!/usr/bin/env tsx
/**
 * ucv-cli — Universal CV interactive workflow
 *
 * Goals:
 * - One entry point: npm run ucv-cli
 * - Persistent dashboard: see sync/eval/redteam/publish state at a glance
 * - Guided workflow: create → sync → eval → redteam → publish
 * - Safer by default: store full JDs in source-data/ (gitignored); ship only excerpts
 */

import { spawn } from 'child_process';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync
} from 'fs';
import { join } from 'path';
import readline from 'readline';
import YAML from 'yaml';

import { VariantSchema } from '../../../src/lib/schemas.js';
import { HEADER_COMPACT, isInteractive, theme, fileLink } from '../theme.js';
import {
  readIssuesLedger,
  queryIssues,
  getIssueCounts,
} from '../../../scripts/lib/issues.js';

type PublishStatus = 'draft' | 'published';
type ApplicationStatus = 'not_applied' | 'applied';

// Readline keypress event key object
type KeypressKey = {
  sequence?: string;
  name?: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
};

type SyncStatus =
  | { kind: 'ok' }
  | { kind: 'error'; message: string };

type EvalStatus =
  | { kind: 'missing' }
  | { kind: 'unverified'; verified: number; claims: number }
  | { kind: 'ok'; verified: number; claims: number }
  | { kind: 'error'; message: string; verified?: number; claims?: number };

type RedteamStatus =
  | { kind: 'pass'; warns: number; fails: number }
  | { kind: 'warn'; warns: number; fails: number }
  | { kind: 'fail'; warns: number; fails: number }
  | { kind: 'error'; message: string };

type VariantMeta = {
  slug: string;
  company: string;
  role: string;
  companyKey?: string;
  roleKey?: string;
  sourceUrl?: string;
  generatedAt: string;
  jobDescription: string; // excerpt
  publishStatus: PublishStatus;
  publishedAt?: string;
  applicationStatus: ApplicationStatus;
  appliedAt?: string;
};

type VariantRow = {
  meta: VariantMeta;
  sync: SyncStatus;
  eval: EvalStatus;
  redteam: RedteamStatus;
  next: string;
  // Raw machine-readable outputs (when available) for richer UI.
  evalResult?: Record<string, unknown>;
  redteamResult?: Record<string, unknown>;
};

type BottomPanelMode = 'activity' | 'eval' | 'redteam' | 'claims' | 'issues';

type Overlay =
  | { kind: 'actions'; selected: number }
  | { kind: 'claims'; focus: 'claims' | 'sources' | 'cta'; claimIndex: number; sourceIndex: number }
  | { kind: 'help' }
  | null;

type RunnerState = {
  running: boolean;
  title: string;
  phase?: 'Sync' | 'Evaluate' | 'Verify' | 'Red Team' | 'Pipeline' | 'Publish';
  slug?: string;
  startedAt: number;
  lines: string[];
  code?: number;
  logFile?: string;
  // A single-line, demo-friendly description of what's happening right now.
  activity?: string;
  // Eval-specific progress (powered by --events)
  eval?: {
    claimsSeen: number;
    lastClaim?: {
      id: string;
      location: string;
      text: string;
      anchors: string[];
      topCandidate?: { path: string; score: number; note?: string };
    };
  };
};

type Notice = {
  kind: 'info' | 'success' | 'warning' | 'error';
  message: string;
  at: number;
};

type RunOutcome = 'ok' | 'warn' | 'fail' | 'cancel';

type RecentRun = {
  at: number;
  slug: string;
  phase: 'Create' | 'Sync' | 'Eval' | 'Verify' | 'Redteam' | 'Publish' | 'Pipeline';
  outcome: RunOutcome;
  detail?: string;
  durationMs?: number;
};

const PATHS = {
  variantsDir: process.env.UCV_VARIANTS_DIR || join(process.cwd(), 'content', 'variants'),
  jdDir: process.env.UCV_JD_DIR || join(process.cwd(), 'source-data', 'jds'),
  logsDir: process.env.UCV_LOGS_DIR || join(process.cwd(), 'capstone', 'develop', 'logs', 'ucv-cli')
};

const END_MULTILINE_TOKEN = '::end';

// -----------------------------------------------------------------------------
// Small helpers
// -----------------------------------------------------------------------------

/* eslint-disable no-control-regex */
function stripAnsi(str: string): string {
  return str
    .replace(/\x1B\[[0-9;]*m/g, '')           // CSI color codes
    .replace(/\x1B\]8;;[^\x07]*\x07/g, '')    // OSC 8 hyperlink start
    .replace(/\x1B\]8;;\x07/g, '');           // OSC 8 hyperlink end
}
/* eslint-enable no-control-regex */

function padRight(str: string, width: number): string {
  const len = stripAnsi(str).length;
  if (len >= width) return str;
  return str + ' '.repeat(width - len);
}

function truncate(str: string, max: number): string {
  const s = stripAnsi(str);
  if (s.length <= max) return str;

  // For strings with escape sequences, we need to truncate carefully.
  // Build output character by character, tracking visible length.
  let result = '';
  let visibleLen = 0;
  let i = 0;

  while (i < str.length && visibleLen < max - 1) {
    // Check for CSI escape sequence (\x1B[...m)
    if (str[i] === '\x1b' && str[i + 1] === '[') {
      const end = str.indexOf('m', i);
      if (end !== -1) {
        result += str.slice(i, end + 1);
        i = end + 1;
        continue;
      }
    }
    // Check for OSC 8 hyperlink start (\x1B]8;;...\x07)
    if (str[i] === '\x1b' && str[i + 1] === ']' && str[i + 2] === '8') {
      const end = str.indexOf('\x07', i);
      if (end !== -1) {
        result += str.slice(i, end + 1);
        i = end + 1;
        continue;
      }
    }
    // Regular character
    result += str[i];
    visibleLen++;
    i++;
  }

  // Close any open hyperlinks and add ellipsis
  result += '…';

  // Add reset codes to clean up any open sequences
  result += '\x1b]8;;\x07';  // Close hyperlink
  result += '\x1b[0m';       // Reset colors

  return result;
}

function clearScreen() {
  process.stdout.write('\x1b[2J\x1b[0;0H');
}

function setRawModeSafe(enabled: boolean) {
  try {
    if (process.stdin.isTTY) process.stdin.setRawMode(enabled);
  } catch {
    // ignore
  }
}

function ensureDir(dir: string) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function nowIso(): string {
  return new Date().toISOString();
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function makeExcerpt(text: string, maxChars = 900): string {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (!normalized) return '';
  if (normalized.length <= maxChars) return normalized;

  const head = normalized.slice(0, maxChars);

  // Prefer cutting at a sentence boundary, but don't cut too early.
  const minCut = Math.min(400, Math.floor(maxChars * 0.6));
  const boundary = Math.max(
    head.lastIndexOf('. ', maxChars),
    head.lastIndexOf('! ', maxChars),
    head.lastIndexOf('? ', maxChars),
    head.lastIndexOf('; ', maxChars)
  );

  if (boundary >= minCut) {
    return head.slice(0, boundary + 1).trim() + '…';
  }

  const lastSpace = head.lastIndexOf(' ');
  if (lastSpace >= minCut) return head.slice(0, lastSpace).trim() + '…';
  return head.trim() + '…';
}

function variantPathFromMeta(meta: VariantMeta): string {
  const companyKey = meta.companyKey || meta.slug.split('-')[0] || 'company';
  const roleKey = meta.roleKey || meta.slug.split('-').slice(1).join('-') || 'role';
  return `/${companyKey}/${roleKey}`;
}

function getProdBaseUrl(): string | null {
  const cnamePath = join(process.cwd(), 'public', 'CNAME');
  if (!existsSync(cnamePath)) return null;
  const host = readFileSync(cnamePath, 'utf-8').trim();
  if (!host) return null;
  return `https://${host}`;
}

function tsxBinPath(): string {
  const bin = process.platform === 'win32' ? 'tsx.cmd' : 'tsx';
  return join(process.cwd(), 'node_modules', '.bin', bin);
}

async function runTsxJson(scriptRel: string, args: string[]): Promise<{ ok: true; json: unknown } | { ok: false; error: string; raw?: string }> {
  const tsx = tsxBinPath();
  if (!existsSync(tsx)) {
    return {
      ok: false,
      error: `Missing tsx binary at ${tsx}. Run: npm install`,
    };
  }

  return await new Promise((resolve) => {
    const child = spawn(tsx, [scriptRel, ...args], {
      cwd: process.cwd(),
      env: process.env,
      stdio: ['ignore', 'pipe', 'pipe']
    });

    let out = '';
    let err = '';
    child.stdout.on('data', (d) => (out += d.toString()));
    child.stderr.on('data', (d) => (err += d.toString()));

    child.on('close', (code) => {
      if (code !== 0 && !out.trim()) {
        resolve({ ok: false, error: err.trim() || `Command failed (exit ${code})` });
        return;
      }
      try {
        const json = JSON.parse(out);
        resolve({ ok: true, json });
      } catch {
        resolve({ ok: false, error: `Failed to parse JSON output. ${err.trim()}`, raw: out });
      }
    });
  });
}

async function runTsxStreaming(
  scriptRel: string,
  args: string[],
  onLine: (line: string) => void,
  options?: {
    logFile?: string;
    onEvent?: (event: Record<string, unknown>) => void;
  }
): Promise<number> {
  const tsx = tsxBinPath();
  if (!existsSync(tsx)) {
    onLine(`ERROR: Missing tsx binary at ${tsx}. Run: npm install`);
    return 1;
  }

  ensureDir(PATHS.logsDir);

  return await new Promise((resolve) => {
    const child = spawn(tsx, [scriptRel, ...args], {
      cwd: process.cwd(),
      env: process.env,
      stdio: ['ignore', 'pipe', 'pipe']
    });

    const appendLog = (chunk: string) => {
      if (!options?.logFile) return;
      try {
        writeFileSync(options.logFile, chunk, { encoding: 'utf-8', flag: 'a' });
      } catch {
        // ignore
      }
    };

    let buffer = '';
    const handleChunk = (chunk: Buffer) => {
      const text = chunk.toString();
      appendLog(text);
      buffer += text;

      // Process full lines; keep any trailing partial line in buffer.
      while (true) {
        const idx = buffer.search(/\r?\n/);
        if (idx === -1) break;

        const line = buffer.slice(0, idx);
        buffer = buffer.slice(buffer[idx] === '\r' && buffer[idx + 1] === '\n' ? idx + 2 : idx + 1);

        if (!line) continue;
        if (line.startsWith('UCV_EVENT ')) {
          const payload = line.slice('UCV_EVENT '.length).trim();
          try {
            options?.onEvent?.(JSON.parse(payload));
          } catch {
            // If parsing fails, surface the raw line.
            onLine(line);
          }
          continue;
        }

        onLine(line);
      }
    };

    child.stdout.on('data', handleChunk);
    child.stderr.on('data', handleChunk);
    child.on('close', (code) => {
      // Flush trailing buffer as a final line.
      const tail = buffer.trim();
      if (tail) {
        if (tail.startsWith('UCV_EVENT ')) {
          const payload = tail.slice('UCV_EVENT '.length).trim();
          try {
            options?.onEvent?.(JSON.parse(payload));
          } catch {
            onLine(tail);
          }
        } else {
          onLine(tail);
        }
      }
      resolve(code ?? 0);
    });
  });
}

// -----------------------------------------------------------------------------
// Data loading
// -----------------------------------------------------------------------------

function listVariantSlugs(): string[] {
  if (!existsSync(PATHS.variantsDir)) return [];
  return readdirSync(PATHS.variantsDir)
    .filter((f) => f.endsWith('.yaml'))
    .filter((f) => !f.startsWith('_'))
    .map((f) => f.replace(/\.yaml$/, ''))
    .sort();
}

function readVariantMeta(slug: string): VariantMeta {
  const yamlPath = join(PATHS.variantsDir, `${slug}.yaml`);
  const raw = readFileSync(yamlPath, 'utf-8');
  const parsed = YAML.parse(raw);
  const validated = VariantSchema.parse(parsed);

  return {
    slug: validated.metadata.slug,
    company: validated.metadata.company,
    role: validated.metadata.role,
    companyKey: validated.metadata.companyKey,
    roleKey: validated.metadata.roleKey,
    sourceUrl: validated.metadata.sourceUrl,
    generatedAt: validated.metadata.generatedAt,
    jobDescription: validated.metadata.jobDescription,
    publishStatus: validated.metadata.publishStatus,
    publishedAt: validated.metadata.publishedAt,
    applicationStatus: validated.metadata.applicationStatus,
    appliedAt: validated.metadata.appliedAt
  };
}

async function loadStatuses(): Promise<VariantRow[]> {
  const slugs = listVariantSlugs();
  const metas: VariantMeta[] = [];
  for (const slug of slugs) {
    try {
      metas.push(readVariantMeta(slug));
    } catch {
      // Schema errors show as a row with minimal metadata
      metas.push({
        slug,
        company: slug,
        role: 'Invalid variant YAML',
        generatedAt: '',
        jobDescription: '',
        publishStatus: 'draft',
        applicationStatus: 'not_applied'
      });
    }
  }

  // Run checks once (all variants) to power the dashboard.
  const syncRes = await runTsxJson('scripts/sync-variants.ts', ['--check', '--json']);
  const evalRes = await runTsxJson('scripts/evaluate-variants.ts', ['--check', '--all', '--json']);
  const redRes = await runTsxJson('scripts/redteam.ts', ['--check', '--all', '--json']);

  const syncErrors = new Map<string, string>();
  if (syncRes.ok) {
    for (const e of syncRes.json.errors ?? []) syncErrors.set(e.slug, e.message || 'Sync error');
  }

  type EvalResultItem = { slug: string; status?: string; message?: string; verified?: number; claims?: number };
  const evalBySlug = new Map<string, EvalResultItem>();
  const evalErrors = new Map<string, string>();
  if (evalRes.ok) {
    for (const r of evalRes.json.results ?? []) {
      evalBySlug.set(r.slug, r);
      if (r.status === 'error') evalErrors.set(r.slug, r.message || 'Eval error');
    }
  }

  type RedteamResultItem = { slug: string; status?: string; message?: string; warns?: number; fails?: number };
  const redBySlug = new Map<string, RedteamResultItem>();
  const redErrors = new Map<string, string>();
  if (redRes.ok) {
    for (const r of redRes.json.results ?? []) {
      redBySlug.set(r.slug, r);
      if (r.status === 'error') redErrors.set(r.slug, r.message || 'Redteam error');
    }
  }

  const rows: VariantRow[] = [];

  for (const meta of metas) {
    const sync: SyncStatus = syncErrors.has(meta.slug)
      ? { kind: 'error', message: syncErrors.get(meta.slug)! }
      : syncRes.ok
        ? { kind: 'ok' }
        : { kind: 'error', message: syncRes.error };

    const er = evalBySlug.get(meta.slug);
    let evalStatus: EvalStatus;
    if (!evalRes.ok) {
      evalStatus = { kind: 'error', message: evalRes.error };
    } else if (!er) {
      evalStatus = { kind: 'missing' };
    } else if (er.status === 'error') {
      const msg = String(er.message || 'Eval failed');
      if (msg.toLowerCase().includes('missing claims ledger')) {
        evalStatus = { kind: 'missing' };
      } else {
        evalStatus = { kind: 'error', message: msg, verified: er.verified, claims: er.claims };
      }
    } else if (er.unverified > 0) {
      evalStatus = { kind: 'unverified', verified: er.verified, claims: er.claims };
    } else {
      evalStatus = { kind: 'ok', verified: er.verified, claims: er.claims };
    }

    const rr = redBySlug.get(meta.slug);
    let redStatus: RedteamStatus;
    if (!redRes.ok) {
      redStatus = { kind: 'error', message: redRes.error };
    } else if (!rr) {
      redStatus = { kind: 'error', message: 'Missing redteam result' };
    } else if (rr.status === 'error') {
      redStatus = { kind: 'error', message: String(rr.message || 'Redteam failed') };
    } else if (rr.status === 'fail') {
      redStatus = { kind: 'fail', warns: rr.warns ?? 0, fails: rr.fails ?? 0 };
    } else if (rr.status === 'warn') {
      redStatus = { kind: 'warn', warns: rr.warns ?? 0, fails: rr.fails ?? 0 };
    } else {
      redStatus = { kind: 'pass', warns: rr.warns ?? 0, fails: rr.fails ?? 0 };
    }

    const next = computeNext(meta, sync, evalStatus, redStatus);
    rows.push({ meta, sync, eval: evalStatus, redteam: redStatus, next, evalResult: er, redteamResult: rr });
  }

  return rows;
}

function computeNext(meta: VariantMeta, sync: SyncStatus, ev: EvalStatus, rt: RedteamStatus): string {
  if (sync.kind !== 'ok') return 'Sync';
  if (meta.publishStatus === 'draft') {
    if (ev.kind === 'missing') return 'Evaluate';
    if (ev.kind === 'unverified') return 'Verify claims';
    if (ev.kind === 'error') return 'Fix eval';
    if (rt.kind === 'fail' || rt.kind === 'error') return 'Redteam';
    if (rt.kind === 'warn') return 'Review redteam';
    return 'Publish';
  }
  // published
  if (ev.kind === 'error' || ev.kind === 'missing' || ev.kind === 'unverified') return 'Fix eval';
  if (rt.kind === 'fail' || rt.kind === 'error') return 'Fix redteam';
  if (rt.kind === 'warn') return 'Review';
  return 'Live';
}

// -----------------------------------------------------------------------------
// Rendering
// -----------------------------------------------------------------------------

function fmtPublish(meta: VariantMeta): string {
  return meta.publishStatus === 'published'
    ? theme.success('LIVE')
    : theme.warning('DRAFT');
}

function fmtEval(ev: EvalStatus): string {
  if (ev.kind === 'missing') return theme.muted('○');
  if (ev.kind === 'error') return theme.error('error');
  if (ev.kind === 'unverified') return theme.warning(`${ev.verified}/${ev.claims}`);
  return theme.success(`${ev.verified}/${ev.claims}`);
}

function fmtRedteam(rt: RedteamStatus): string {
  if (rt.kind === 'error') return theme.error('error');
  if (rt.kind === 'fail') return `${theme.badge.fail} ${theme.error(String(rt.fails))}`;
  if (rt.kind === 'warn') return `${theme.badge.warn} ${theme.warning(String(rt.warns))}`;
  return theme.badge.pass;
}

// -----------------------------------------------------------------------------
// Cockpit rendering (single-screen TUI)
// -----------------------------------------------------------------------------

type ActionId =
  | 'run-next'
  | 'pipeline'
  | 'sync'
  | 'eval'
  | 'claims'
  | 'redteam'
  | 'publish'
  | 'close';

type ActionItem = {
  id: ActionId;
  label: string;
  help?: string;
  enabled: boolean;
};

type ClaimsLedger = {
  version: number;
  variant: { slug: string; contentHash: string; evaluatedAt: string; variantFile?: string };
  claims: Array<{
    id: string;
    location: string;
    text: string;
    anchors: string[];
    candidateSources: Array<{ path: string; score: number; matchedAnchors?: string[]; note?: string }>;
    verified: {
      status: 'verified' | 'unverified';
      sources: Array<{ path: string; anchors: string[] }>;
      notes?: string;
    };
  }>;
};

type EvalLedgerSummary = {
  exists: boolean;
  total: number;
  verified: number;
  unverified: number;
  unverifiedClaims: ClaimsLedger['claims'];
  topUnverified?: ClaimsLedger['claims'][number];
  ledgerPath: string;
  evalMdPath: string;
};

function padLeft(str: string, width: number): string {
  const len = stripAnsi(str).length;
  if (len >= width) return str;
  return ' '.repeat(width - len) + str;
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function safeCols(): number {
  return Math.max(80, process.stdout.columns || 120);
}

function safeRows(): number {
  return Math.max(24, process.stdout.rows || 30);
}

function artifactPaths(slug: string) {
  return {
    yaml: `content/variants/${slug}.yaml`,
    json: `content/variants/${slug}.json`,
    jd: `source-data/jds/${slug}.md`,
    claims: `capstone/develop/evals/${slug}.claims.yaml`,
    evalMd: `capstone/develop/evals/${slug}.eval.md`,
    redteam: `capstone/develop/redteam/${slug}.redteam.md`
  };
}

function fmtPath(p: string, line?: number): string {
  // Clickable link that opens in VSCode (OSC 8 hyperlinks)
  return fileLink(p, line);
}

function readClaimsLedger(slug: string): ClaimsLedger | null {
  const p = join(process.cwd(), 'capstone', 'develop', 'evals', `${slug}.claims.yaml`);
  if (!existsSync(p)) return null;
  try {
    const raw = readFileSync(p, 'utf-8');
    return YAML.parse(raw) as ClaimsLedger;
  } catch {
    return null;
  }
}

function getEvalLedgerSummary(slug: string): EvalLedgerSummary {
  const paths = artifactPaths(slug);
  const ledger = readClaimsLedger(slug);
  if (!ledger || !Array.isArray(ledger.claims)) {
    return {
      exists: false,
      total: 0,
      verified: 0,
      unverified: 0,
      unverifiedClaims: [],
      ledgerPath: paths.claims,
      evalMdPath: paths.evalMd
    };
  }
  const total = ledger.claims.length;
  const verified = ledger.claims.filter((c) => c?.verified?.status === 'verified').length;
  const unverified = total - verified;
  const unverifiedClaims = ledger.claims.filter((c) => c?.verified?.status !== 'verified');
  return {
    exists: true,
    total,
    verified,
    unverified,
    unverifiedClaims,
    topUnverified: unverifiedClaims[0],
    ledgerPath: paths.claims,
    evalMdPath: paths.evalMd
  };
}

function computeGuidedRibbon(row: VariantRow | undefined, runner: RunnerState | null): { title: string; detail?: string; style: 'ribbon' | 'muted' } {
  if (runner?.running) {
    const slug = runner.slug ? ` · ${runner.slug}` : '';
    return {
      title: `RUNNING: ${runner.phase ?? runner.title}${slug}`,
      detail: runner.activity,
      style: 'muted'
    };
  }
  if (!row) {
    return { title: 'No variants yet', detail: 'Press [c] to create your first variant', style: 'muted' };
  }

  // Build a demo-friendly explanation of the next step.
  const ev = getEvalLedgerSummary(row.meta.slug);

  if (row.sync.kind !== 'ok') {
    return {
      title: `NEXT: Sync`,
      detail: row.sync.message ?? 'Variant YAML/JSON drift or schema error',
      style: 'ribbon'
    };
  }

  if (row.meta.publishStatus === 'published') {
    return { title: 'LIVE', detail: 'Variant is published (prod URL available)', style: 'muted' };
  }

  if (row.eval.kind === 'missing') {
    return { title: 'NEXT: Evaluate', detail: 'Generate claims ledger + evaluation report', style: 'ribbon' };
  }

  if (row.eval.kind === 'unverified') {
    return {
      title: 'NEXT: Verify claims',
      detail: `${ev.unverified} unverified metric claim(s) — pick sources + lock anchors`,
      style: 'ribbon'
    };
  }

  if (row.eval.kind === 'error') {
    return { title: 'NEXT: Fix eval', detail: row.eval.message ?? 'Evaluation check failed', style: 'ribbon' };
  }

  if (row.redteam.kind === 'fail') {
    return { title: 'NEXT: Red Team', detail: `${row.redteam.fails} FAIL finding(s) — fix before publish`, style: 'ribbon' };
  }

  if (row.redteam.kind === 'warn') {
    return { title: 'NEXT: Review redteam', detail: `${row.redteam.warns} WARN finding(s) — review tone/safety`, style: 'ribbon' };
  }

  if (row.redteam.kind === 'error') {
    return { title: 'NEXT: Red Team', detail: row.redteam.message ?? 'Redteam failed', style: 'ribbon' };
  }

  return { title: 'NEXT: Publish', detail: 'All gates pass — ship to prod (slug URL)', style: 'ribbon' };
}

// -----------------------------------------------------------------------------
// Phase timeline (demo-friendly)
// -----------------------------------------------------------------------------

type TimelineStageKey = 'CreateSync' | 'Eval' | 'Verify' | 'Redteam' | 'Publish';

function getCurrentStage(row: VariantRow, runner: RunnerState | null): TimelineStageKey {
  if (runner?.running && runner.slug === row.meta.slug) {
    if (runner.phase === 'Sync') return 'CreateSync';
    if (runner.phase === 'Verify') return 'Verify';
    if (runner.phase === 'Evaluate') return 'Eval';
    if (runner.phase === 'Red Team') return 'Redteam';
    if (runner.phase === 'Publish') return 'Publish';
  }

  const next = row.next;
  if (next === 'Sync') return 'CreateSync';
  if (next === 'Evaluate' || next === 'Fix eval') return 'Eval';
  if (next === 'Verify claims') return 'Verify';
  if (next === 'Redteam' || next === 'Review redteam' || next === 'Fix redteam' || next === 'Review') return 'Redteam';
  return 'Publish';
}

function stageStyle(status: 'pending' | 'ok' | 'warn' | 'fail', label: string): string {
  if (status === 'ok') return theme.success(label);
  if (status === 'warn') return theme.warning(label);
  if (status === 'fail') return theme.error(label);
  return theme.muted(label);
}

// Status lookup tables - clearer than nested ternaries
const EVAL_STATUS_MAP: Record<string, 'pending' | 'ok' | 'warn' | 'fail'> = {
  missing: 'pending',
  error: 'fail',
  ok: 'ok',
  unverified: 'ok'
};

const VERIFY_STATUS_MAP: Record<string, 'pending' | 'ok' | 'warn' | 'fail'> = {
  unverified: 'warn',
  ok: 'ok',
  error: 'fail',
  missing: 'pending'
};

const REDTEAM_STATUS_MAP: Record<string, 'pending' | 'ok' | 'warn' | 'fail'> = {
  pass: 'ok',
  warn: 'warn',
  fail: 'fail',
  error: 'fail',
  pending: 'pending'
};

function renderTimelineBar(row: VariantRow, runner: RunnerState | null, width: number): string {
  const current = getCurrentStage(row, runner);

  const createStatus = row.sync.kind === 'ok' ? 'ok' : 'fail';
  const evalStatus = EVAL_STATUS_MAP[row.eval.kind] ?? 'pending';
  const verifyStatus = VERIFY_STATUS_MAP[row.eval.kind] ?? 'pending';
  const redStatus = REDTEAM_STATUS_MAP[row.redteam.kind] ?? 'pending';
  const pubStatus: 'pending' | 'ok' = row.meta.publishStatus === 'published' ? 'ok' : 'pending';

  const stages: Array<{ key: TimelineStageKey; label: string; status: 'pending' | 'ok' | 'warn' | 'fail' }> = [
    { key: 'CreateSync', label: 'Create/Sync', status: createStatus },
    { key: 'Eval', label: 'Eval', status: evalStatus },
    { key: 'Verify', label: 'Verify', status: verifyStatus },
    { key: 'Redteam', label: 'Redteam', status: redStatus },
    { key: 'Publish', label: row.meta.publishStatus === 'published' ? 'Published' : 'Publish', status: pubStatus }
  ];

  const sep = theme.muted(' → ');
  const parts = stages.map((s) => {
    const base = stageStyle(s.status, s.label);
    if (s.key !== current) return base;
    // Tiny highlight: brand brackets + bolded stage name.
    return `${theme.brand('[')}${theme.bold(base)}${theme.brand(']')}`;
  });

  return truncate(`${theme.muted('Timeline:')} ${parts.join(sep)}`, width);
}

function getActionsFor(row: VariantRow | undefined): ActionItem[] {
  if (!row) {
    return [{ id: 'close', label: 'Close', enabled: true }];
  }

  const ev = getEvalLedgerSummary(row.meta.slug);
  const canPublish = row.meta.publishStatus === 'draft' && row.next === 'Publish';
  const canClaims = ev.exists && ev.unverified > 0;
  const isApplied = row.meta.applicationStatus === 'applied';

  return [
    { id: 'run-next', label: 'Run guided next step', help: 'fast path', enabled: true },
    { id: 'pipeline', label: 'Run pipeline (until publish-ready)', help: 'sync → eval → verify → redteam', enabled: true },
    { id: 'sync', label: 'Sync', help: 'YAML → JSON', enabled: true },
    { id: 'eval', label: 'Evaluate', help: 'Generate/refresh claims ledger', enabled: true },
    { id: 'claims', label: 'Verify claims', help: 'Pick sources for metric claims', enabled: canClaims },
    { id: 'redteam', label: 'Red Team', help: 'Quality/security scan', enabled: true },
    { id: 'publish', label: 'Publish', help: 'Flip draft → live, commit & push', enabled: canPublish },
    { id: 'toggle-applied', label: isApplied ? 'Mark Not Applied' : 'Mark Applied', help: isApplied ? 'Reset application status' : 'Mark as applied to this role', enabled: true },
    { id: 'close', label: 'Close', enabled: true }
  ];
}

function makeHeaderLines(
  width: number,
  rows: VariantRow[],
  runner: RunnerState | null,
  notice: Notice | null,
  demoMode: boolean
): string[] {
  const w = Math.max(60, width);
  const top = theme.brand(`╭${'─'.repeat(w - 2)}╮`);

  const ready = rows.filter((r) => r.next === 'Publish' || r.next === 'Live').length;
  const blocked = rows.filter((r) => ['Sync', 'Fix eval', 'Fix redteam'].includes(r.next)).length;
  const inProgress = rows.length - ready - blocked;

  const rightBits: string[] = [];
  rightBits.push(theme.success(`${ready} ready`));
  rightBits.push(theme.warning(`${inProgress} in-flight`));
  rightBits.push(theme.error(`${blocked} blocked`));

  if (demoMode) {
    rightBits.push(theme.warning('DEMO'));
  }

  if (runner?.running) {
    rightBits.push(theme.info(`● ${runner.phase ?? 'Running'}`));
  }
  if (notice) {
    const icon = notice.kind === 'success'
      ? theme.icons.success
      : notice.kind === 'warning'
        ? theme.icons.warning
        : notice.kind === 'error'
          ? theme.icons.error
          : theme.icons.info;
    rightBits.push(`${icon} ${theme.muted(truncate(notice.message, 28))}`);
  }

  const title = theme.brandBold('◆ Universal CV Cockpit');
  const subtitle = theme.muted(`${rows.length} variants`);
  const left = `${title} ${subtitle}`;
  const right = rightBits.join(theme.muted(' · '));

  const innerW = w - 2;
  const middleRaw = padRight(left, Math.max(0, innerW - stripAnsi(right).length)) + right;
  const middle = theme.brand('│') + truncate(middleRaw, innerW) + theme.brand('│');

  const bottom = theme.brand(`╰${'─'.repeat(w - 2)}╯`);
  return [top, middle, bottom];
}

function makeBox(title: string, width: number, height: number, contentLines: string[]): string[] {
  const w = Math.max(10, width);
  const h = Math.max(3, height);

  const innerW = w - 4; // borders + 1 padding each side
  const border = theme.brand;

  const t = ` ${title} `;
  const topLine = border(`╭${t}${'─'.repeat(Math.max(0, w - stripAnsi(t).length - 2))}╮`);
  const bottomLine = border(`╰${'─'.repeat(w - 2)}╯`);

  const body: string[] = [];
  const maxBodyLines = h - 2;

  for (let i = 0; i < maxBodyLines; i++) {
    const raw = contentLines[i] ?? '';
    const clipped = truncate(raw, innerW);
    const padded = padRight(clipped, innerW);
    body.push(`${border('│')} ${padded} ${border('│')}`);
  }

  return [topLine, ...body, bottomLine];
}

function renderCockpit(ctx: {
  rows: VariantRow[];
  selected: number;
  overlay: Overlay;
  bottomMode: BottomPanelMode;
  runner: RunnerState | null;
  notice: Notice | null;
  recentRuns: RecentRun[];
  demoMode: boolean;
}): void {
  const cols = safeCols();
  const rowsH = safeRows();

  // Layout
  const headerH = 3;
  const footerH = 1;
  let bottomH = Math.max(8, Math.min(12, Math.floor(rowsH * 0.3)));
  let mainH = rowsH - headerH - bottomH - footerH;
  if (mainH < 8) {
    bottomH = Math.max(6, bottomH - (8 - mainH));
    mainH = rowsH - headerH - bottomH - footerH;
  }

  const gutter = 1;
  const leftW = clamp(Math.floor(cols * 0.48), 44, 64);
  const rightW = Math.max(40, cols - leftW - gutter);

  const headerLines = makeHeaderLines(cols, ctx.rows, ctx.runner, ctx.notice, ctx.demoMode);

  const selectedRow = ctx.rows[ctx.selected];
  const variantsBox = makeBox(
    `Variants  ${theme.muted('[↑↓] select')}`,
    leftW,
    mainH,
    renderVariantsTable(ctx.rows, ctx.selected, leftW - 4, mainH - 2)
  );

  const detailsBox = makeBox(
    `Details  ${theme.muted('[Enter] next  [a/⌘K] actions  [p] panel')}`,
    rightW,
    mainH,
    renderDetailsPanel({
      row: selectedRow,
      overlay: ctx.overlay,
      runner: ctx.runner,
      width: rightW - 4,
      height: mainH - 2
    })
  );

  const bottomTitle = ctx.bottomMode === 'activity'
    ? 'Activity'
    : ctx.bottomMode === 'eval'
      ? 'Eval Report'
      : ctx.bottomMode === 'redteam'
        ? 'Redteam Report'
        : ctx.bottomMode === 'claims'
          ? 'Claims Ledger'
          : 'Issues';

  const bottomBox = makeBox(
    `${bottomTitle}  ${theme.muted('[p] cycle')}`,
    cols,
    bottomH,
    renderBottomPanel({
      mode: ctx.bottomMode,
      row: selectedRow,
      runner: ctx.runner,
      width: cols - 4,
      height: bottomH - 2,
      notice: ctx.notice,
      recentRuns: ctx.recentRuns
    })
  );

  const footer = renderFooter({ overlay: ctx.overlay, runner: ctx.runner, cols, demoMode: ctx.demoMode });

  const out: string[] = [];
  out.push(...headerLines);

  for (let i = 0; i < mainH; i++) {
    out.push(variantsBox[i] + ' '.repeat(gutter) + detailsBox[i]);
  }
  out.push(...bottomBox);
  out.push(footer);

  clearScreen();
  process.stdout.write(out.join('\n') + '\n');
}

function renderFooter(ctx: { overlay: Overlay; runner: RunnerState | null; cols: number; demoMode: boolean }): string {
  const accel = process.platform === 'darwin' ? '⌘' : 'Ctrl+';
  const demo = ctx.demoMode ? theme.warning('DEMO') : theme.muted('demo');

  const base = ctx.runner?.running
    ? theme.muted(`[q] quit  [Ctrl+C] force quit  [d] ${demo}`)
    : theme.muted(`[q] quit  [r] refresh  [c] create  [a] actions  [p] panel  [?] help  [d] ${demo}  ${accel}R/${accel}K`);

  const overlayHint = ctx.overlay?.kind === 'actions'
    ? theme.muted(' · actions: [↑↓] [Enter] [Esc]')
    : ctx.overlay?.kind === 'claims'
      ? theme.muted(' · verify: [Tab] switch  [Enter] verify  [Esc] close')
      : ctx.overlay?.kind === 'help'
        ? theme.muted(' · help: [Esc] close')
        : '';

  const line = `${base}${overlayHint}`;
  return padRight(truncate(line, ctx.cols), ctx.cols);
}

function renderVariantsTable(rows: VariantRow[], selected: number, width: number, height: number): string[] {
  if (rows.length === 0) {
    return [
      theme.muted('No variants found.'),
      '',
      theme.muted('Press [c] to create from a job link.'),
      '',
      theme.muted('Tip: full JD is stored locally; only excerpt ships.')
    ];
  }

  const inner = width;
  const colPub = 6;
  const colApp = 5;
  const colSync = 4;
  const colEval = 9;
  const colRT = 7;
  const colNext = 10;
  const colSlug = Math.max(12, inner - (colPub + colApp + colSync + colEval + colRT + colNext + 6));

  const header =
    padRight(theme.bold('Slug'), colSlug) +
    '  ' +
    padRight(theme.dim('Pub'), colPub) +
    padRight(theme.dim('App'), colApp) +
    padRight(theme.dim('S'), colSync) +
    padRight(theme.dim('Eval'), colEval) +
    padRight(theme.dim('RT'), colRT) +
    padRight(theme.dim('Next'), colNext);

  const lines: string[] = [header, theme.muted('─'.repeat(Math.min(inner, stripAnsi(header).length)))];

  // How many actual variant rows can we show inside this panel?
  const bodyRows = Math.max(3, height - 2 /*header+divider*/ - 1 /*room for … line*/);

  // Scroll so selection is roughly centered.
  const start = clamp(selected - Math.floor(bodyRows / 2), 0, Math.max(0, rows.length - bodyRows));
  const end = Math.min(rows.length, start + bodyRows);

  for (let i = start; i < end; i++) {
    const r = rows[i];
    const isSel = i === selected;
    const pointer = isSel ? theme.brand('▶') : ' ';
    const slug = padRight(truncate(r.meta.slug, colSlug - 1), colSlug);
    const pub = padRight(r.meta.publishStatus === 'published' ? theme.success('LIVE') : theme.warning('DRAFT'), colPub);
    const app = padRight(r.meta.applicationStatus === 'applied' ? theme.success('✓') : theme.muted('—'), colApp);
    const sync = padRight(r.sync.kind === 'ok' ? theme.success('✓') : theme.error('✗'), colSync);
    const ev = padRight(fmtEval(r.eval), colEval);
    const rt = padRight(fmtRedteam(r.redteam), colRT);
    const next = padRight(truncate(r.next, colNext - 1), colNext);

    const rowLine = `${pointer} ${slug}  ${pub}${app}${sync}${ev}${rt}${next}`;
    lines.push(isSel ? theme.inverse(truncate(rowLine, inner)) : truncate(rowLine, inner));
  }

  if (rows.length > end) {
    lines.push(theme.muted(`… +${rows.length - end} more (resize for more space)`));
  }

  return lines;
}

function renderDetailsPanel(ctx: {
  row?: VariantRow;
  overlay: Overlay;
  runner: RunnerState | null;
  width: number;
  height: number;
}): string[] {
  const row = ctx.row;

  if (ctx.overlay?.kind === 'help') {
    return renderHelpPanel(ctx.width);
  }

  if (ctx.overlay?.kind === 'actions') {
    return renderActionsOverlay(row, ctx.overlay.selected, ctx.width);
  }

  if (ctx.overlay?.kind === 'claims') {
    return renderClaimsOverlay(row, ctx.overlay, ctx.width, ctx.height);
  }

  // Default: details view
  if (!row) {
    return [
      theme.muted('No variant selected.'),
      '',
      theme.muted('Press [c] to create a new variant from a job link.'),
    ];
  }

  const ribbon = computeGuidedRibbon(row, ctx.runner);
  const ribbonLine = ribbon.style === 'ribbon' ? theme.ribbon(ribbon.title) : theme.ribbonMuted(ribbon.title);
  const lines: string[] = [truncate(ribbonLine, ctx.width)];

  if (ribbon.detail) {
    lines.push(theme.muted(truncate(ribbon.detail, ctx.width)));
  }
  lines.push('');

  // Tiny timeline bar (Create/Sync → Eval → Verify → Redteam → Publish)
  lines.push(truncate(renderTimelineBar(row, ctx.runner, ctx.width), ctx.width));
  lines.push('');

  // Meta
  lines.push(theme.bold(`${row.meta.company} — ${row.meta.role}`));
  if (row.meta.sourceUrl) {
    lines.push(`${theme.icons.bullet} ${theme.dim('Source:')} ${truncate(theme.info(row.meta.sourceUrl), ctx.width - 10)}`);
  }

  const base = getProdBaseUrl();
  const urlPath = variantPathFromMeta(row.meta);
  const fullUrl = base ? base + urlPath : urlPath;
  lines.push(`${theme.icons.bullet} ${theme.dim('URL:')} ${truncate(theme.info(fullUrl), ctx.width - 8)}`);
  lines.push(`${theme.icons.bullet} ${theme.dim('Publish:')} ${fmtPublish(row.meta)}`);
  lines.push('');

  // Pipeline snapshot
  lines.push(theme.bold('Pipeline')); 
  lines.push(`${theme.icons.bullet} ${theme.dim('Sync:')} ${row.sync.kind === 'ok' ? theme.success('OK') : theme.error('ERROR')} ${row.sync.kind === 'error' ? theme.muted(truncate(row.sync.message ?? '', ctx.width - 18)) : ''}`);

  const evSummary = getEvalLedgerSummary(row.meta.slug);
  if (row.eval.kind === 'error') {
    lines.push(`${theme.icons.bullet} ${theme.dim('Eval:')} ${theme.error('ERROR')} ${theme.muted(truncate(row.eval.message ?? '', ctx.width - 18))}`);
  } else if (row.eval.kind === 'missing') {
    lines.push(`${theme.icons.bullet} ${theme.dim('Eval:')} ${theme.muted('missing ledger')}`);
  } else {
    const badge = row.eval.kind === 'unverified' ? theme.warning('WARN') : theme.success('OK');
    lines.push(`${theme.icons.bullet} ${theme.dim('Eval:')} ${badge} ${theme.muted(`${evSummary.verified}/${evSummary.total} verified`)}`);
  }

  if (row.redteam.kind === 'error') {
    lines.push(`${theme.icons.bullet} ${theme.dim('Redteam:')} ${theme.error('ERROR')} ${theme.muted(truncate(row.redteam.message ?? '', ctx.width - 22))}`);
  } else if (row.redteam.kind === 'fail') {
    lines.push(`${theme.icons.bullet} ${theme.dim('Redteam:')} ${theme.error('FAIL')} ${theme.muted(`${row.redteam.fails} fail, ${row.redteam.warns} warn`)}`);
  } else if (row.redteam.kind === 'warn') {
    lines.push(`${theme.icons.bullet} ${theme.dim('Redteam:')} ${theme.warning('WARN')} ${theme.muted(`${row.redteam.warns} warn`)}`);
  } else {
    lines.push(`${theme.icons.bullet} ${theme.dim('Redteam:')} ${theme.success('PASS')} ${theme.muted(`${row.redteam.warns} warn`)}`);
  }

  lines.push('');

  // Eval details (for demo)
  lines.push(theme.bold('Evals (claims ledger)'));
  lines.push(theme.muted('Gate: every metric-like claim must be VERIFIED w/ anchors.'));
  lines.push(theme.muted('Scoring: score = anchors-hit + 0.15×token-overlap (top 5 sources).'));
  if (evSummary.exists) {
    lines.push(`${theme.icons.bullet} ${theme.dim('Ledger:')} ${fmtPath(evSummary.ledgerPath)}`);
    lines.push(`${theme.icons.bullet} ${theme.dim('Report:')} ${fmtPath(evSummary.evalMdPath)}`);
    if (evSummary.unverified > 0 && evSummary.topUnverified) {
      const c = evSummary.topUnverified;
      lines.push('');
      lines.push(theme.warning(`Unverified (${evSummary.unverified}) — top claim:`));
      lines.push(theme.muted(truncate(`${c.id} · ${c.location}`, ctx.width)));
      lines.push(truncate(c.text, ctx.width));
      const top = c.candidateSources?.[0];
      if (top) {
        lines.push(theme.muted(`Top candidate: ${top.path} (score ${top.score})`));
      }
      lines.push(theme.muted('Press [a] Actions → Verify claims to resolve.'));
    }
  } else {
    lines.push(`${theme.icons.bullet} ${theme.dim('Ledger:')} ${theme.muted('missing')} (${fmtPath(evSummary.ledgerPath)})`);
  }

  lines.push('');

  // Redteam details
  lines.push(theme.bold('Redteam (demo highlights)'));
  const redteamData = row.redteamResult as { findings?: { severity?: string; id?: string; summary?: string }[] } | undefined;
  const findings = Array.isArray(redteamData?.findings) ? redteamData.findings : [];

  const topFindings = findings
    .filter((f) => f && (f.severity === 'FAIL' || f.severity === 'WARN'))
    .slice(0, 3);

  if (topFindings.length === 0) {
    lines.push(theme.muted('No FAIL/WARN findings (or report missing).'));
  } else {
    for (const f of topFindings) {
      const sev = f.severity === 'FAIL' ? theme.error('FAIL') : theme.warning('WARN');
      lines.push(`${theme.icons.bullet} ${sev} ${theme.muted(f.id)} — ${truncate(f.title, Math.max(10, ctx.width - 14))}`);
    }
  }

  lines.push('');

  // Artifacts
  const paths = artifactPaths(row.meta.slug);
  lines.push(theme.bold('Artifacts'));
  lines.push(`${theme.icons.bullet} ${theme.dim('Variant:')} ${fmtPath(paths.yaml)}`);
  lines.push(`${theme.icons.bullet} ${theme.dim('Runtime:')} ${fmtPath(paths.json)}`);
  lines.push(`${theme.icons.bullet} ${theme.dim('Claims:')} ${fmtPath(paths.claims)}`);
  lines.push(`${theme.icons.bullet} ${theme.dim('Eval:')} ${fmtPath(paths.evalMd)}`);
  lines.push(`${theme.icons.bullet} ${theme.dim('Redteam:')} ${fmtPath(paths.redteam)}`);
  lines.push(`${theme.icons.bullet} ${theme.dim('Full JD:')} ${fmtPath(paths.jd)} ${theme.muted('(gitignored)')}`);
  lines.push(`${theme.icons.bullet} ${theme.dim('Logs:')} ${theme.muted(`capstone/develop/logs/ucv-cli/*`)}`);

  return lines;
}

function renderActionsOverlay(row: VariantRow | undefined, selected: number, width: number): string[] {
  const actions = getActionsFor(row);
  const lines: string[] = [];
  lines.push(theme.bold('Actions'));
  lines.push(theme.muted('Use ↑↓ and Enter. Esc closes.'));
  lines.push('');

  for (let i = 0; i < actions.length; i++) {
    const a = actions[i];
    const isSel = i === selected;
    const pointer = isSel ? theme.brand('›') : ' ';
    const label = a.enabled ? theme.bold(a.label) : theme.muted(a.label + ' (disabled)');
    const help = a.help ? theme.muted(` — ${a.help}`) : '';
    const line = `${pointer} ${label}${help}`;
    lines.push(isSel ? theme.inverse(truncate(line, width)) : truncate(line, width));
  }

  return lines;
}

function renderClaimsOverlay(row: VariantRow | undefined, overlay: Extract<Overlay, { kind: 'claims' }>, width: number, height: number): string[] {
  if (!row) {
    return [theme.muted('No variant selected.')];
  }
  const slug = row.meta.slug;
  const ev = getEvalLedgerSummary(slug);
  if (!ev.exists) {
    return [
      theme.bold('Verify claims'),
      '',
      theme.muted('Claims ledger is missing.'),
      theme.muted('Run Evaluate first.'),
    ];
  }
  if (ev.unverified === 0) {
    const ctaFocused = overlay.focus === 'cta';
    return [
      theme.bold('Verify claims'),
      '',
      theme.success(`${theme.icons.success} All ${ev.total} claims verified`),
      '',
      theme.muted(`${ev.verified}/${ev.total} claims linked to verified sources`),
      '',
      '',
      ctaFocused
        ? theme.ribbon('Continue → Red Team')
        : theme.brand('[ Continue → Red Team ]'),
      '',
      theme.muted(ctaFocused ? '[Enter] start  [Esc] close' : '[Enter] select  [Esc] close'),
    ];
  }

  const claims = ev.unverifiedClaims;
  const claimIndex = clamp(overlay.claimIndex, 0, Math.max(0, claims.length - 1));
  const claim = claims[claimIndex];
  const sources = Array.isArray(claim?.candidateSources) ? claim.candidateSources : [];
  const sourceIndex = clamp(overlay.sourceIndex, 0, Math.max(0, sources.length - 1));

  const lines: string[] = [];
  lines.push(theme.bold(`Verify claims — ${slug}`));
  lines.push(theme.muted('[Y] verify with top source  [N] skip  [Tab] switch focus  [Enter] verify'));
  lines.push('');

  const focusClaims = overlay.focus === 'claims';
  const focusSources = overlay.focus === 'sources';

  lines.push(theme.bold(`${focusClaims ? theme.brand('▸') : ' '} Unverified claims (${claims.length})`));
  const listMax = Math.max(3, Math.min(6, Math.floor((height - 8) / 2)));
  const start = clamp(claimIndex - Math.floor(listMax / 2), 0, Math.max(0, claims.length - listMax));
  const end = Math.min(claims.length, start + listMax);
  for (let i = start; i < end; i++) {
    const c = claims[i];
    const isSel = i === claimIndex;
    const line = `${isSel ? theme.brand('›') : ' '} ${c.id} ${theme.muted('· ' + c.location)}`;
    lines.push(isSel && focusClaims ? theme.inverse(truncate(line, width)) : truncate(line, width));
  }
  if (claims.length > end) lines.push(theme.muted(`… +${claims.length - end} more`));

  lines.push('');
  lines.push(truncate(theme.warning(claim.text), width));
  lines.push('');

  lines.push(theme.bold(`${focusSources ? theme.brand('▸') : ' '} Candidate sources`));
  if (sources.length === 0) {
    lines.push(theme.muted('No candidates found. Add more knowledge sources.'));
  } else {
    const srcMax = Math.max(3, Math.min(7, height - lines.length - 1));
    const srcStart = clamp(sourceIndex - Math.floor(srcMax / 2), 0, Math.max(0, sources.length - srcMax));
    const srcEnd = Math.min(sources.length, srcStart + srcMax);
    for (let i = srcStart; i < srcEnd; i++) {
      const s = sources[i];
      const isSel = i === sourceIndex;
      const score = typeof s.score === 'number' ? s.score.toFixed(3) : String(s.score ?? '');
      const line = `${isSel ? theme.brand('›') : ' '} ${theme.dim(score)} ${truncate(s.path, Math.max(10, width - 8))}`;
      lines.push(isSel && focusSources ? theme.inverse(truncate(line, width)) : truncate(line, width));
      if (isSel) {
        if (s.note) lines.push(theme.muted(truncate(`  ${s.note}`, width)));
        const anchors = Array.isArray(claim.anchors) ? claim.anchors.slice(0, 3) : [];
        if (anchors.length) lines.push(theme.muted(truncate(`  anchors: ${anchors.join(', ')}${claim.anchors.length > 3 ? '…' : ''}`, width)));
      }
    }
    if (sources.length > srcEnd) lines.push(theme.muted(`… +${sources.length - srcEnd} more`));
  }

  return lines;
}

function renderHelpPanel(width: number): string[] {
  const lines: string[] = [];
  const accel = process.platform === 'darwin' ? '⌘' : 'Ctrl+';
  lines.push(theme.bold('Help'));
  lines.push('');
  lines.push(theme.muted('Navigation'));
  lines.push(`${theme.icons.bullet} ↑↓  Select variant`);
  lines.push(`${theme.icons.bullet} Enter  Run guided next step`);
  lines.push(`${theme.icons.bullet} a  Action menu (arrow keys + Enter)`);
  lines.push(`${theme.icons.bullet} ${accel}K  Action menu (accelerator)`);
  lines.push(`${theme.icons.bullet} p  Cycle bottom panel (activity/eval/redteam/claims/issues)`);
  lines.push(`${theme.icons.bullet} ${accel}1..5  Jump panels (1=activity, 2=eval, 3=redteam, 4=claims, 5=issues)`);
  lines.push(`${theme.icons.bullet} i  Open issues panel and sync`);
  lines.push('');
  lines.push(theme.muted('Claim Verification (when overlay open)'));
  lines.push(`${theme.icons.bullet} Y  Verify claim with top source`);
  lines.push(`${theme.icons.bullet} N  Skip to next claim`);
  lines.push(`${theme.icons.bullet} Tab  Switch between claims and sources`);
  lines.push('');
  lines.push(theme.muted('Workflow'));
  lines.push(`${theme.icons.bullet} c  Create variant from job link / manual paste`);
  lines.push(`${theme.icons.bullet} ${accel}N  Create new variant (accelerator)`);
  lines.push(`${theme.icons.bullet} r  Refresh status checks`);
  lines.push(`${theme.icons.bullet} d  Toggle demo mode (slower updates for live demos)`);
  lines.push(`${theme.icons.bullet} q  Quit`);
  lines.push('');
  lines.push(theme.muted(`Note: some terminals intercept ${accel} shortcuts. If a combo doesn't fire, use the single-key version.`));
  lines.push('');
  lines.push(theme.muted('Claims verification'));
  lines.push(`${theme.icons.bullet} In Actions → Verify claims: Tab to switch focus, Enter to mark verified using selected source.`);
  lines.push('');
  lines.push(theme.muted('Tip: full JDs stay local (gitignored); only excerpts ship.'));

  return lines.map((l) => truncate(l, width));
}

function renderBottomPanel(ctx: {
  mode: BottomPanelMode;
  row?: VariantRow;
  runner: RunnerState | null;
  width: number;
  height: number;
  notice: Notice | null;
  recentRuns: RecentRun[];
}): string[] {
  const out: string[] = [];

  // -------------------------------------------------------------
  // Pinned mini-history (last 3 runs)
  // -------------------------------------------------------------
  const recent = ctx.recentRuns.slice(-3).reverse(); // newest-first
  let bodyHeight = ctx.height;

  if (recent.length > 0 && ctx.height >= 3) {
    // If the panel is small, fall back to a single concise line.
    if (ctx.height <= 6) {
      const compact = recent
        .map((r) => {
          const icon = r.outcome === 'ok'
            ? theme.icons.success
            : r.outcome === 'warn'
              ? theme.icons.warning
              : r.outcome === 'fail'
                ? theme.icons.error
                : theme.icons.info;
          return `${icon} ${r.phase} ${r.slug}`;
        })
        .join(theme.muted(' · '));
      out.push(truncate(theme.muted(`Recent: ${compact}`), ctx.width));
      out.push('');
      bodyHeight = Math.max(1, ctx.height - 2);
    } else {
      out.push(theme.muted('Recent runs'));
      for (const r of recent) {
        const icon = r.outcome === 'ok'
          ? theme.icons.success
          : r.outcome === 'warn'
            ? theme.icons.warning
            : r.outcome === 'fail'
              ? theme.icons.error
              : theme.icons.info;
        const dur = typeof r.durationMs === 'number' ? `${(r.durationMs / 1000).toFixed(1)}s` : '';
        const detail = r.detail ? theme.muted(` — ${truncate(r.detail, Math.max(10, ctx.width - 28))}`) : '';
        out.push(truncate(`${icon} ${theme.bold(r.phase)} ${r.slug} ${theme.dim(dur)}${detail}`, ctx.width));
      }
      out.push(theme.muted('─'.repeat(Math.min(ctx.width, 60))));
      bodyHeight = Math.max(1, ctx.height - out.length);
    }
  }

  if (ctx.mode === 'activity') {
    if (ctx.runner?.running) {
      out.push(theme.bold(`${ctx.runner.phase ?? 'Running'} — ${ctx.runner.slug ?? ''}`));
      if (ctx.runner.activity) out.push(theme.muted(truncate(ctx.runner.activity, ctx.width)));
      out.push('');
      const last = ctx.runner.lines.slice(-Math.max(1, bodyHeight - 3));
      for (const l of last) out.push(theme.muted(truncate(l, ctx.width)));
      if (ctx.runner.logFile) out.push(theme.muted(`log: ${ctx.runner.logFile.replace(process.cwd() + '/', '')}`));
      return out;
    }

    if (ctx.notice) {
      const icon = ctx.notice.kind === 'success'
        ? theme.icons.success
        : ctx.notice.kind === 'warning'
          ? theme.icons.warning
          : ctx.notice.kind === 'error'
            ? theme.icons.error
            : theme.icons.info;
      out.push(`${icon} ${ctx.notice.message}`);
      out.push('');
    }

    if (ctx.row) {
      const ribbon = computeGuidedRibbon(ctx.row, null);
      out.push(theme.muted(`Guided next: ${ribbon.title.replace(/^NEXT:\s*/,'')}`));
      if (ribbon.detail) out.push(theme.muted(truncate(ribbon.detail, ctx.width)));
      out.push('');
      out.push(theme.muted('This panel stays visible during runs — no more scroll hunting.'));
      out.push(theme.muted('Press [p] to peek at eval/redteam reports without leaving the cockpit.'));
    } else {
      out.push(theme.muted('Press [c] to create a variant from a job link.'));
    }
    return out;
  }

  // Issues mode: show cross-variant issues
  if (ctx.mode === 'issues') {
    try {
      const ledger = readIssuesLedger();
      const issues = queryIssues(ledger, { status: 'open', sortBy: 'severity' });
      const counts = getIssueCounts(issues);

      if (issues.length === 0) {
        out.push(theme.success('No open issues across variants.'));
        out.push(theme.muted('Run npm run issues:sync to scan for issues.'));
        return out;
      }

      const summaryParts: string[] = [];
      if (counts.critical > 0) summaryParts.push(theme.error(`${counts.critical} critical`));
      if (counts.high > 0) summaryParts.push(theme.warning(`${counts.high} high`));
      if (counts.medium > 0) summaryParts.push(theme.dim(`${counts.medium} medium`));
      out.push(summaryParts.join(' · ') + theme.muted(' — press [i] to sync'));
      out.push(theme.muted('─'.repeat(Math.min(ctx.width, 60))));

      const maxIssues = Math.max(1, bodyHeight - 3);
      for (let i = 0; i < Math.min(issues.length, maxIssues); i++) {
        const issue = issues[i];
        const icon = issue.severity === 'critical'
          ? theme.error('●')
          : issue.severity === 'high'
            ? theme.warning('○')
            : theme.muted('·');
        const typeTag = issue.type === 'claim' ? 'EVAL' : 'RT';
        const line = `${icon} [${typeTag}] ${issue.source.variant} · ${issue.title}`;
        out.push(truncate(line, ctx.width));
      }
      if (issues.length > maxIssues) {
        out.push(theme.muted(`… +${issues.length - maxIssues} more issues`));
      }

      // Show suggested fix for first issue
      if (issues.length > 0 && issues[0].suggestedFixes?.length) {
        out.push('');
        out.push(theme.bold('Suggested: ') + theme.muted(issues[0].suggestedFixes[0].description));
      }
    } catch {
      out.push(theme.muted('Run npm run issues:sync to populate issues.'));
    }
    return out;
  }

  if (!ctx.row) {
    return [theme.muted('No variant selected.')];
  }

  const slug = ctx.row.meta.slug;
  const paths = artifactPaths(slug);

  const file = ctx.mode === 'eval'
    ? paths.evalMd
    : ctx.mode === 'redteam'
      ? paths.redteam
      : paths.claims;

  const full = join(process.cwd(), file);
  if (!existsSync(full)) {
    return [theme.muted(`Missing: ${file}`), theme.muted('Run the corresponding step first.')];
  }

  const raw = readFileSync(full, 'utf-8');
  const lines = raw.split(/\r?\n/);

  // Show the most relevant slice for demo (summary-ish)
  let start = 0;
  if (ctx.mode === 'eval') {
    const idx = lines.findIndex((l) => l.includes('## Automated Summary'));
    if (idx !== -1) start = idx;
  }
  if (ctx.mode === 'redteam') {
    const idx = lines.findIndex((l) => l.includes('## Summary'));
    if (idx !== -1) start = idx;
  }
  if (ctx.mode === 'claims') {
    start = 0;
  }

  const slice = lines.slice(start, start + bodyHeight);
  out.push(theme.muted(`${file}`));
  out.push(theme.muted('─'.repeat(Math.min(ctx.width, 60))));
  for (const l of slice) {
    out.push(truncate(l, ctx.width));
  }
  return out;
}

async function gitCommitAndPush(slug: string): Promise<{ ok: boolean; message: string }> {
  // If there is no git repo (e.g., zip download), skip.
  if (!existsSync(join(process.cwd(), '.git'))) {
    return {
      ok: false,
      message: 'No .git directory found. Commit & push manually.'
    };
  }

  const files = [
    `content/variants/${slug}.yaml`,
    `content/variants/${slug}.json`,
    `capstone/develop/evals/${slug}.claims.yaml`,
    `capstone/develop/evals/${slug}.eval.md`,
    `capstone/develop/redteam/${slug}.redteam.md`
  ].filter((p) => existsSync(join(process.cwd(), p)));

  const ts = nowIso();
  const message = `ucv: publish ${slug}`;

  // Stage
  const add = await runShell('git', ['add', ...files]);
  if (add.code !== 0) {
    return { ok: false, message: add.stderr || 'git add failed' };
  }

  // Commit
  const commit = await runShell('git', ['commit', '-m', message, '--no-verify']);
  if (commit.code !== 0) {
    // If nothing to commit, treat as ok
    if ((commit.stderr || '').includes('nothing to commit')) {
      return { ok: true, message: 'Nothing to commit; already up to date.' };
    }
    return { ok: false, message: commit.stderr || 'git commit failed' };
  }

  // Push
  const push = await runShell('git', ['push']);
  if (push.code !== 0) {
    return { ok: false, message: push.stderr || 'git push failed' };
  }

  return { ok: true, message: `Committed at ${ts}` };
}

async function runShell(cmd: string, args: string[]): Promise<{ code: number; stdout: string; stderr: string }> {
  return await new Promise((resolve) => {
    const child = spawn(cmd, args, { cwd: process.cwd(), env: process.env, stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (d) => (stdout += d.toString()));
    child.stderr.on('data', (d) => (stderr += d.toString()));
    child.on('close', (code) => resolve({ code: code ?? 0, stdout: stdout.trim(), stderr: stderr.trim() }));
  });
}

// -----------------------------------------------------------------------------
// Create flow
// -----------------------------------------------------------------------------

async function confirmPrompt(question: string): Promise<boolean> {
  const answer = await promptLine(question);
  return ['y', 'yes'].includes(answer.trim().toLowerCase());
}

async function promptLine(question: string, defaultValue?: string): Promise<string> {
  // Temporarily leave raw mode so paste/edit works.
  setRawModeSafe(false);

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const q = defaultValue ? `${question}${theme.muted(`(${defaultValue}) `)}` : question;

  return await new Promise((resolve) => {
    rl.question(q, (answer) => {
      rl.close();
      setRawModeSafe(true);
      const v = answer.trim();
      if (!v && defaultValue !== undefined) resolve(defaultValue);
      else resolve(answer);
    });
  });
}

async function promptMultiline(title: string): Promise<string> {
  setRawModeSafe(false);
  console.log();
  console.log(theme.bold(title));
  console.log(theme.muted(`Paste text below. End with a line containing '${END_MULTILINE_TOKEN}'.`));
  console.log();

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  const lines: string[] = [];
  return await new Promise((resolve) => {
    rl.on('line', (line) => {
      if (line.trim() === END_MULTILINE_TOKEN) {
        rl.close();
        setRawModeSafe(true);
        resolve(lines.join('\n').trim());
      } else {
        lines.push(line);
      }
    });
  });
}

type JobExtraction = {
  ok: true;
  company?: string;
  role?: string;
  description?: string;
  url: string;
  note?: string;
} | {
  ok: false;
  url: string;
  error: string;
};

async function extractJobFromUrl(url: string): Promise<JobExtraction> {
  try {
    // Try simple fetch first
    let html: string | null = null;
    try {
      html = await fetchHtml(url);
      const parsed = await parseJobFromHtml(html, url);
      if (parsed.ok) return parsed;
    } catch {
      // Simple fetch failed (403, network error, etc.) - will try Puppeteer
    }

    // Fallback: headless render (handles bot protection, JS-heavy pages)
    const rendered = await fetchHtmlWithPuppeteer(url);
    return await parseJobFromHtml(rendered, url);
  } catch (e) {
    return { ok: false, url, error: e instanceof Error ? e.message : String(e) };
  }
}

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
    }
  });
  if (!res.ok) throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
  return await res.text();
}

async function fetchHtmlWithPuppeteer(url: string): Promise<string> {
  const puppeteerExtra = await import('puppeteer-extra');
  const StealthPlugin = await import('puppeteer-extra-plugin-stealth');

  puppeteerExtra.default.use(StealthPlugin.default());

  const browser = await puppeteerExtra.default.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  try {
    const page = await browser.newPage();

    // Set a realistic viewport
    await page.setViewport({ width: 1920, height: 1080 });

    await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });

    // Wait a bit for any JS to finish rendering
    await new Promise(r => setTimeout(r, 2000));

    return await page.content();
  } finally {
    await browser.close();
  }
}

async function parseJobFromHtml(html: string, url: string): Promise<JobExtraction> {
  const jsdom = await import('jsdom');
  const { JSDOM } = jsdom;
  const dom = new JSDOM(html);
  const doc = dom.window.document;

  const scripts = Array.from(doc.querySelectorAll('script[type="application/ld+json"]'));
  for (const s of scripts) {
    const text = s.textContent?.trim();
    if (!text) continue;
    try {
      const data = JSON.parse(text);
      const items = Array.isArray(data) ? data : [data];
      const posting = items.find((x: unknown) => {
        const obj = x as Record<string, unknown> | null;
        const t = obj?.['@type'];
        if (!t) return false;
        if (Array.isArray(t)) return t.includes('JobPosting');
        return t === 'JobPosting';
      }) as Record<string, unknown> | undefined;
      if (posting) {
        const role = posting.title || posting.jobTitle;
        const hiringOrg = posting.hiringOrganization as Record<string, unknown> | undefined;
        const empUnit = posting.employmentUnit as Record<string, unknown> | undefined;
        const company = hiringOrg?.name || empUnit?.name;
        const descHtml = posting.description;
        const description = typeof descHtml === 'string'
          ? htmlToText(descHtml)
          : '';
        if (role || company || description) {
          return {
            ok: true,
            url,
            role: role ? String(role).trim() : undefined,
            company: company ? String(company).trim() : undefined,
            description: description ? description.trim() : undefined,
            note: 'Extracted from JSON-LD JobPosting'
          };
        }
      }
    } catch {
      // ignore malformed JSON-LD
    }
  }

  // Fallback: basic heuristics
  const h1 = doc.querySelector('h1')?.textContent?.trim();
  const title = doc.querySelector('title')?.textContent?.trim();
  const og = doc.querySelector('meta[property="og:title"]')?.getAttribute('content')?.trim();
  const roleGuess = h1 || og || title;

  // Description heuristic: look for a main/article section
  const main = doc.querySelector('main') || doc.querySelector('article');
  const description = main ? htmlToText(main.innerHTML).trim() : '';

  if (roleGuess || description) {
    return {
      ok: true,
      url,
      role: roleGuess || undefined,
      description: description || undefined,
      note: 'Extracted via HTML heuristics'
    };
  }

  return { ok: false, url, error: 'Could not extract job details from the page' };
}

function htmlToText(html: string): string {
  const withoutScripts = html.replace(/<script[\s\S]*?<\/script>/gi, '');
  const withoutStyles = withoutScripts.replace(/<style[\s\S]*?<\/style>/gi, '');
  const stripped = withoutStyles
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]+>/g, '');
  return stripped
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function renderVariantYaml(meta: VariantMeta): string {
  const lines: string[] = [];
  lines.push('# ═══════════════════════════════════════════════════════════════');
  lines.push('# VARIANT METADATA');
  lines.push('# ═══════════════════════════════════════════════════════════════');
  lines.push('metadata:');
  lines.push(`  company: ${JSON.stringify(meta.company)}`);
  lines.push(`  role: ${JSON.stringify(meta.role)}`);
  lines.push(`  slug: ${JSON.stringify(meta.slug)}`);
  if (meta.companyKey) lines.push(`  companyKey: ${JSON.stringify(meta.companyKey)}`);
  if (meta.roleKey) lines.push(`  roleKey: ${JSON.stringify(meta.roleKey)}`);
  if (meta.sourceUrl) lines.push(`  sourceUrl: ${JSON.stringify(meta.sourceUrl)}`);
  lines.push(`  generatedAt: ${JSON.stringify(meta.generatedAt)}`);
  lines.push('  # NOTE: jobDescription is a SHORT EXCERPT (not the full JD).');
  lines.push('  jobDescription: |');
  const excerptLines = (meta.jobDescription || '').split(/\r?\n/);
  for (const l of excerptLines) {
    lines.push(`    ${l}`);
  }
  lines.push(`  generationModel: ${JSON.stringify('ucv-cli-scaffold-v1')}`);
  lines.push(`  publishStatus: ${JSON.stringify(meta.publishStatus)}`);
  if (meta.publishedAt) lines.push(`  publishedAt: ${JSON.stringify(meta.publishedAt)}`);
  lines.push(`  applicationStatus: ${JSON.stringify(meta.applicationStatus)}`);
  if (meta.appliedAt) lines.push(`  appliedAt: ${JSON.stringify(meta.appliedAt)}`);
  lines.push('');

  lines.push('# ═══════════════════════════════════════════════════════════════');
  lines.push('# OVERRIDES');
  lines.push('# ═══════════════════════════════════════════════════════════════');
  lines.push('overrides: {}');
  lines.push('');
  return lines.join('\n') + '\n';
}

async function createVariantFlow(): Promise<{ slug: string; jdPath: string } | null> {
  clearScreen();
  console.log(HEADER_COMPACT);
  console.log();

  console.log(theme.bold('Create new variant'));
  console.log(theme.muted('Paste a job link, or leave blank to enter details manually.'));
  console.log();

  const url = (await promptLine('Job URL (optional): ')).trim();

  let company = '';
  let role = '';
  let fullJd = '';
  let sourceUrl = url || undefined;

  if (url) {
    console.log();
    console.log(theme.muted('Extracting job details…'));
    const extracted = await extractJobFromUrl(url);
    if (extracted.ok) {
      if (extracted.note) console.log(theme.muted(`  ${extracted.note}`));
      company = extracted.company || '';
      role = extracted.role || '';
      fullJd = extracted.description || '';
    } else {
      console.log(theme.warning(`Extraction failed: ${extracted.error}`));
      console.log(theme.muted('Falling back to manual entry.'));
    }
  }

  // Manual corrections / fallback
  company = (await promptLine('Company name: ', company)).trim();
  role = (await promptLine('Role title: ', role)).trim();
  if (!sourceUrl) {
    const maybeUrl = (await promptLine('Job URL (optional): ')).trim();
    if (maybeUrl) sourceUrl = maybeUrl;
  }

  if (!fullJd) {
    fullJd = await promptMultiline('Job Description');
  } else {
    const keep = await confirmPrompt('Use extracted job description? (Y/n) ');
    if (!keep) {
      fullJd = await promptMultiline('Job Description');
    }
  }

  // URL segments
  const suggestedCompanyKey = slugify(company) || 'company';
  const suggestedRoleKey = slugify(role) || 'role';
  console.log();
  console.log(theme.muted('URL segments (controls the public URL /:company/:role)'));
  const companyKey = (await promptLine('Company key: ', suggestedCompanyKey)).trim();
  const roleKey = (await promptLine('Role key: ', suggestedRoleKey)).trim();
  const slug = `${companyKey}-${roleKey}`;

  const yamlPath = join(PATHS.variantsDir, `${slug}.yaml`);
  if (existsSync(yamlPath)) {
    console.log(theme.error(`Variant already exists: ${slug}`));
    console.log(theme.muted('Choose a different company/role key.'));
    await promptLine('Press Enter to return. ');
    return null;
  }

  ensureDir(PATHS.jdDir);
  const jdPath = join(PATHS.jdDir, `${slug}.md`);
  const jdHeader = [
    `# Job Description`,
    ``,
    `- Slug: ${slug}`,
    `- Company: ${company}`,
    `- Role: ${role}`,
    sourceUrl ? `- Source: ${sourceUrl}` : `- Source: (manual)`,
    `- Captured: ${nowIso()}`,
    ``,
    `---`,
    ``
  ].join('\n');
  writeFileSync(jdPath, jdHeader + fullJd.trim() + '\n', 'utf-8');

  const meta: VariantMeta = {
    slug,
    company,
    role,
    companyKey,
    roleKey,
    sourceUrl,
    generatedAt: nowIso(),
    jobDescription: makeExcerpt(fullJd, 900),
    publishStatus: 'draft',
    applicationStatus: 'not_applied'
  };

  ensureDir(PATHS.variantsDir);
  writeFileSync(yamlPath, renderVariantYaml(meta), 'utf-8');

  return {
    slug,
    jdPath: jdPath.replace(process.cwd() + '/', '')
  };
}

// -----------------------------------------------------------------------------
// App loop
// -----------------------------------------------------------------------------

async function main() {
  const interactive = isInteractive();

  if (!interactive) {
    // Non-interactive mode: output JSON status for all variants
    const rows = await loadStatuses();
    const output = {
      timestamp: new Date().toISOString(),
      variants: rows.map(row => ({
        slug: row.meta.slug,
        company: row.meta.company,
        role: row.meta.role,
        generatedAt: row.meta.generatedAt,
        publishStatus: row.meta.publishStatus,
        applicationStatus: row.meta.applicationStatus,
        sync: row.sync,
        eval: row.eval,
        redteam: row.redteam,
        nextAction: row.next
      })),
      summary: {
        total: rows.length,
        published: rows.filter(r => r.meta.publishStatus === 'published').length,
        draft: rows.filter(r => r.meta.publishStatus === 'draft').length,
        applied: rows.filter(r => r.meta.applicationStatus === 'applied').length,
        syncErrors: rows.filter(r => r.sync.kind === 'error').length,
        evalPassing: rows.filter(r => r.eval.kind === 'ok').length,
        evalUnverified: rows.filter(r => r.eval.kind === 'unverified').length,
        redteamPassing: rows.filter(r => r.redteam.kind === 'pass').length,
        redteamWarning: rows.filter(r => r.redteam.kind === 'warn').length,
        redteamFailing: rows.filter(r => r.redteam.kind === 'fail').length
      }
    };
    console.log(JSON.stringify(output, null, 2));
    process.exit(0);
  }

  let rows: VariantRow[] = [];
  let selected = 0;
  let overlay: Overlay = null;
  let bottomMode: BottomPanelMode = 'activity';
  let runner: RunnerState | null = null;
  let notice: Notice | null = null;
  let busy = false;

  // Demo mode: slows cockpit updates so an audience can follow along.
  let demoMode = false;
  const demoDelayMs = Number(process.env.UCV_DEMO_DELAY_MS || 60);

  // Mini-history (last 3 runs) pinned in the bottom panel.
  let recentRuns: RecentRun[] = [];

  // When demoMode is enabled we queue UI updates to preserve order.
  let uiQueue: Promise<void> = Promise.resolve();
  let queuedUpdates = 0;
  const enqueueUi = (fn: () => void) => {
    const delay = demoMode ? demoDelayMs : 0;
    if (delay <= 0) {
      fn();
      return;
    }

    // Avoid runaway queues if a command is extremely chatty.
    if (queuedUpdates > 250) {
      fn();
      return;
    }

    queuedUpdates += 1;
    uiQueue = uiQueue.then(
      () =>
        new Promise<void>((resolve) => {
          setTimeout(() => {
            try {
              fn();
            } finally {
              queuedUpdates = Math.max(0, queuedUpdates - 1);
              resolve();
            }
          }, delay);
        })
    );
  };

  const setNotice = (kind: Notice['kind'], message: string) => {
    notice = { kind, message, at: Date.now() };
  };

  const clearNotice = () => {
    notice = null;
  };

  const recordRun = (run: RecentRun) => {
    recentRuns = [...recentRuns, run].slice(-3);
  };

  async function refresh() {
    rows = await loadStatuses();
    if (selected >= rows.length) selected = Math.max(0, rows.length - 1);
  }

  function render() {
    renderCockpit({ rows, selected, overlay, bottomMode, runner, notice, recentRuns, demoMode });
  }

  async function runPhase(
    phase: RunnerState['phase'],
    slug: string,
    scriptRel: string,
    args: string[],
    opts?: { events?: boolean }
  ): Promise<number> {
    const ts = nowIso().replace(/[:.]/g, '-');
    ensureDir(PATHS.logsDir);
    const logFileRel = join(PATHS.logsDir, `${slug}-${String(phase || 'run').toLowerCase().replace(/\s+/g, '-')}-${ts}.log`);
    const logFile = logFileRel;

    runner = {
      running: true,
      title: `Running: ${phase}`,
      phase,
      slug,
      startedAt: Date.now(),
      lines: [],
      logFile: logFile.replace(process.cwd() + '/', ''),
      activity:
        phase === 'Sync'
          ? 'Syncing YAML → JSON runtime artifacts…'
          : phase === 'Evaluate'
            ? 'Extracting metric claims + scoring candidate sources…'
            : phase === 'Verify'
              ? 'Locking verified sources into the claims ledger…'
            : phase === 'Red Team'
              ? 'Scanning for quality, safety, prompt injection, secrets…'
              : 'Running…'
    };
    render();

    const code = await runTsxStreaming(
      scriptRel,
      opts?.events ? [...args, '--events'] : args,
      (line) => {
        const safe = stripAnsi(line);
        enqueueUi(() => {
          runner?.lines.push(safe);
          // Keep the log window snappy
          if (runner && runner.lines.length > 400) runner.lines = runner.lines.slice(-300);

          // Lightweight activity inference for non-event phases
          if (runner && !opts?.events) {
            const l = safe.toLowerCase();
            if (phase === 'Sync' && l.includes('synced')) runner.activity = 'Wrote runtime JSON artifacts.';
            if (phase === 'Red Team' && (l.includes('finding') || l.includes('warn') || l.includes('fail'))) {
              runner.activity = 'Flagging findings… (see details panel)';
            }
          }

          render();
        });
      },
      {
        logFile,
        onEvent: (ev) => {
          if (!runner) return;
          enqueueUi(() => {
            if (ev?.type === 'eval.start') {
              runner.eval = { claimsSeen: 0 };
              runner.activity = 'Extracting metric claims + scoring candidate sources…';
            }
            if (ev?.type === 'eval.claim') {
              runner.eval = runner.eval ?? { claimsSeen: 0 };
              runner.eval.claimsSeen += 1;
              runner.eval.lastClaim = {
                id: ev.id,
                location: ev.location,
                text: ev.text,
                anchors: Array.isArray(ev.anchors) ? ev.anchors : [],
                topCandidate: ev.topCandidate
              };
              const top = ev.topCandidate ? ` · top: ${ev.topCandidate.path} (${Number(ev.topCandidate.score).toFixed(3)})` : '';
              runner.activity = `Claim ${runner.eval.claimsSeen}: ${ev.location} · ${truncate(ev.text, 56)}${top}`;
            }
            if (ev?.type === 'eval.verify') {
              // When we're verifying individual claims, treat it as the Verify phase.
              if (phase === 'Verify') {
                runner.activity = `Verifying ${ev.id} ← ${ev.sourcePath}`;
              } else {
                runner.activity = `Verifying ${ev.id} ← ${ev.sourcePath}`;
              }
            }
            if (ev?.type === 'eval.wrote') {
              runner.activity = `Wrote ledger + report (${ev.ledgerPath}, ${ev.mdPath})`;
            }
            if (ev?.type === 'eval.error') {
              runner.activity = `Eval issue: ${ev.message}`;
            }
            if (ev?.type === 'eval.done') {
              if (ev.status === 'ok') {
                runner.activity = `Eval done: ${ev.verified}/${ev.claims} verified (${ev.unverified} unverified)`;
              } else {
                runner.activity = `Eval failed: ${ev.message}`;
              }
            }
            render();
          });
        }
      }
    );

    if (runner) {
      runner.running = false;
      runner.code = code;
    }

    if (code === 0) setNotice('success', `${phase} completed for ${slug}`);
    else setNotice('error', `${phase} failed for ${slug} (exit ${code})`);

    const finishedAt = Date.now();

    await refresh();

    // Record run summary for the pinned mini-history.
    const rowNow = rows.find((r) => r.meta.slug === slug);
    const durationMs = finishedAt - (runner?.startedAt ?? finishedAt);
    let outcome: RunOutcome = code === 0 ? 'ok' : 'fail';
    let detail: string | undefined;

    if (code === 0 && rowNow) {
      if (phase === 'Evaluate' || phase === 'Verify') {
        const ev = getEvalLedgerSummary(slug);
        if (ev.exists && ev.unverified > 0) {
          outcome = 'warn';
          detail = `${ev.verified}/${ev.total} verified (${ev.unverified} unverified)`;
        } else if (ev.exists) {
          detail = `${ev.verified}/${ev.total} verified`;
        }
      }
      if (phase === 'Red Team') {
        if (rowNow.redteam.kind === 'warn') {
          outcome = 'warn';
          detail = `${rowNow.redteam.warns} warn`;
        }
      }
    }

    const phaseLabel: RecentRun['phase'] =
      phase === 'Sync'
        ? 'Sync'
        : phase === 'Evaluate'
          ? 'Eval'
          : phase === 'Verify'
            ? 'Verify'
            : phase === 'Red Team'
              ? 'Redteam'
              : phase === 'Publish'
                ? 'Publish'
                : 'Pipeline';

    recordRun({ at: finishedAt, slug, phase: phaseLabel, outcome, detail, durationMs });
    render();
    return code;
  }

  async function runPipeline(slug: string): Promise<void> {
    // Pipeline order: Create (auto Sync) → Eval → Verify → Redteam → Publish
    // For existing variants, "Create" is already done; we start at Sync.
    const s = await runPhase('Sync', slug, 'scripts/sync-variants.ts', ['--slug', slug]);
    if (s !== 0) return;

    const e = await runPhase('Evaluate', slug, 'scripts/evaluate-variants.ts', ['--slug', slug], { events: true });
    if (e !== 0) return;

    // If eval produced unverified claims, pause pipeline and jump straight
    // into the Verify UI so the demo audience sees the human-in-the-loop step.
    const afterEval = rows.find((r) => r.meta.slug === slug);
    if (afterEval?.next === 'Verify claims') {
      setNotice('warning', 'Pipeline paused: verify claims to continue');
      overlay = { kind: 'claims', focus: 'claims', claimIndex: 0, sourceIndex: 0 };
      bottomMode = 'claims';
      render();
      return;
    }

    const rt = await runPhase('Red Team', slug, 'scripts/redteam.ts', ['--slug', slug]);
    if (rt !== 0) {
      bottomMode = 'redteam';
      render();
      return;
    }

    const afterRt = rows.find((r) => r.meta.slug === slug);
    if (afterRt?.next === 'Review redteam' || afterRt?.next === 'Fix redteam' || afterRt?.next === 'Review') {
      bottomMode = 'redteam';
      setNotice('warning', 'Pipeline complete: redteam needs review');
      render();
      return;
    }

    if (afterRt?.next === 'Publish') {
      setNotice('success', 'Pipeline clean: ready to publish');
      render();
    }
  }

  async function publishVariant(slug: string): Promise<void> {
    const publishStartedAt = Date.now();
    const recordPublish = (outcome: RunOutcome, detail?: string) => {
      recordRun({
        at: Date.now(),
        slug,
        phase: 'Publish',
        outcome,
        detail,
        durationMs: Date.now() - publishStartedAt
      });
    };

    const row = rows.find((r) => r.meta.slug === slug);
    if (!row) {
      setNotice('error', 'Publish: variant not found');
      recordPublish('fail', 'Variant not found');
      return;
    }
    if (row.meta.publishStatus === 'published') {
      setNotice('info', 'Already published');
      recordPublish('ok', 'Already published');
      return;
    }

    runner = {
      running: true,
      title: 'Publish',
      phase: 'Publish',
      slug,
      startedAt: Date.now(),
      lines: ['Checking pipeline gates…'],
      activity: 'Checking sync/eval/redteam gates…'
    };
    render();

    // Re-check gates for this slug
    const s = await runTsxJson('scripts/sync-variants.ts', ['--check', '--json', '--slug', slug]);
    const e = await runTsxJson('scripts/evaluate-variants.ts', ['--check', '--json', '--slug', slug]);
    const r = await runTsxJson('scripts/redteam.ts', ['--check', '--json', '--slug', slug]);

    const gateProblems: string[] = [];
    if (!s.ok) gateProblems.push(`Sync check failed: ${s.error}`);
    if (s.ok) {
      type SyncError = { message?: string };
      const syncJson = s.json as { errors?: SyncError[] };
      if ((syncJson.errors?.length ?? 0) > 0) {
        gateProblems.push(`Sync not clean: ${syncJson.errors?.[0]?.message || 'error'}`);
      }
    }

    if (!e.ok) gateProblems.push(`Eval check failed: ${e.error}`);
    if (e.ok) {
      type EvalResult = { slug?: string; status?: string; message?: string; unverified?: number };
      const evalJson = e.json as { results?: EvalResult[] };
      const res = (evalJson.results || []).find((x) => x.slug === slug);
      if (!res) gateProblems.push('Eval check: missing result');
      else if (res.status === 'error') gateProblems.push(`Eval check: ${res.message || 'error'}`);
      else if ((res.unverified ?? 0) > 0) gateProblems.push(`Eval check: ${res.unverified} unverified claim(s)`);
    }

    let redWarns = 0;
    if (!r.ok) gateProblems.push(`Redteam check failed: ${r.error}`);
    if (r.ok) {
      type RedteamResult = { slug?: string; status?: string; message?: string; fails?: number; warns?: number };
      const redteamJson = r.json as { results?: RedteamResult[] };
      const res = (redteamJson.results || []).find((x) => x.slug === slug);
      if (!res) gateProblems.push('Redteam check: missing result');
      else if (res.status === 'error') gateProblems.push(`Redteam check: ${res.message || 'error'}`);
      else if (res.status === 'fail') gateProblems.push(`Redteam check: FAIL (${res.fails} fails, ${res.warns} warns)`);
      else redWarns = Number(res.warns || 0);
    }

    if (gateProblems.length > 0) {
      runner.lines.push('');
      for (const p of gateProblems) runner.lines.push(`✗ ${p}`);
      runner.running = false;
      runner.code = 1;
      setNotice('error', 'Publish blocked (see Activity panel)');
      recordPublish('fail', 'Blocked by pipeline gates');
      render();
      return;
    }

    if (redWarns > 0) {
      // Confirm in a clean prompt screen
      clearScreen();
      console.log(HEADER_COMPACT);
      console.log();
      console.log(theme.warning(`Redteam returned ${redWarns} warning(s).`));
      const ok = await confirmPrompt('Publish anyway? (y/N) ');
      if (!ok) {
        setNotice('info', 'Publish cancelled');
        runner.running = false;
        runner.code = 0;
        recordPublish('cancel', 'Cancelled (redteam warnings)');
        render();
        return;
      }
    }

    // Flip draft → published
    const yamlPath = join(PATHS.variantsDir, `${slug}.yaml`);
    const raw = readFileSync(yamlPath, 'utf-8');
    const parsed = YAML.parse(raw);
    parsed.metadata = parsed.metadata || {};
    parsed.metadata.publishStatus = 'published';
    parsed.metadata.publishedAt = nowIso();
    writeFileSync(yamlPath, YAML.stringify(parsed, { lineWidth: 0 }), 'utf-8');

    runner.lines.push('✓ publishStatus set to published');
    runner.activity = 'Syncing runtime JSON after publish…';
    render();

    const syncCode = await runPhase('Sync', slug, 'scripts/sync-variants.ts', ['--slug', slug]);
    if (syncCode !== 0) {
      setNotice('error', 'Publish failed: sync failed after flipping status');
      recordPublish('fail', 'Sync failed after flipping publishStatus');
      return;
    }

    runner = runner ?? { running: false, title: 'Publish', phase: 'Publish', slug, startedAt: Date.now(), lines: [] };
    runner.running = true;
    runner.activity = 'Committing + pushing (best-effort)…';
    runner.lines.push('');
    runner.lines.push('Git: commit + push (best-effort)');
    render();

    const commitResult = await gitCommitAndPush(slug);
    runner.lines.push(commitResult.ok ? `✓ ${commitResult.message}` : `⚠ ${commitResult.message}`);

    const base = getProdBaseUrl();
    const urlPath = variantPathFromMeta({ ...row.meta, publishStatus: 'published' });
    const fullUrl = base ? base + urlPath : urlPath;

    runner.running = false;
    runner.code = 0;
    setNotice('success', `Published: ${fullUrl}`);

    recordPublish(commitResult.ok ? 'ok' : 'warn', fullUrl);

    await refresh();
    render();
  }

  async function toggleAppliedStatus(slug: string): Promise<void> {
    const row = rows.find((r) => r.meta.slug === slug);
    if (!row) {
      setNotice('error', 'Variant not found');
      return;
    }

    const currentStatus = row.meta.applicationStatus;
    const newStatus: ApplicationStatus = currentStatus === 'applied' ? 'not_applied' : 'applied';

    // Update YAML file
    const yamlPath = join(PATHS.variantsDir, `${slug}.yaml`);
    const raw = readFileSync(yamlPath, 'utf-8');
    const parsed = YAML.parse(raw);
    parsed.metadata = parsed.metadata || {};
    parsed.metadata.applicationStatus = newStatus;
    if (newStatus === 'applied') {
      parsed.metadata.appliedAt = nowIso();
    } else {
      delete parsed.metadata.appliedAt;
    }
    writeFileSync(yamlPath, YAML.stringify(parsed, { lineWidth: 0 }), 'utf-8');

    // Sync to JSON
    await runPhase('Sync', slug, 'scripts/sync-variants.ts', ['--slug', slug]);

    setNotice('success', newStatus === 'applied' ? `Marked as applied` : `Marked as not applied`);
    await refresh();
    render();
  }

  async function runGuidedNext(): Promise<void> {
    const row = rows[selected];
    if (!row) return;
    const slug = row.meta.slug;
    clearNotice();
    overlay = null;

    if (row.next === 'Sync') {
      await runPhase('Sync', slug, 'scripts/sync-variants.ts', ['--slug', slug]);
      return;
    }
    if (row.next === 'Evaluate') {
      await runPhase('Evaluate', slug, 'scripts/evaluate-variants.ts', ['--slug', slug], { events: true });
      return;
    }
    if (row.next === 'Verify claims') {
      overlay = { kind: 'claims', focus: 'claims', claimIndex: 0, sourceIndex: 0 };
      bottomMode = 'claims';
      render();
      return;
    }
    if (row.next === 'Redteam') {
      await runPhase('Red Team', slug, 'scripts/redteam.ts', ['--slug', slug]);
      return;
    }
    if (row.next === 'Review redteam' || row.next === 'Review' || row.next === 'Fix redteam') {
      bottomMode = 'redteam';
      render();
      return;
    }
    if (row.next === 'Fix eval') {
      bottomMode = 'eval';
      render();
      return;
    }
    if (row.next === 'Publish') {
      await publishVariant(slug);
      return;
    }
    if (row.next === 'Live') {
      setNotice('info', 'Already live');
      return;
    }
  }

  async function createVariantAndAutoSync(): Promise<void> {
    const startedAt = Date.now();
    const created = await createVariantFlow();
    const finishedAt = Date.now();

    if (!created?.slug) {
      setNotice('info', 'Create cancelled');
      render();
      return;
    }

    // Record the create action (Sync will be recorded separately via runPhase).
    recordRun({
      at: finishedAt,
      slug: created.slug,
      phase: 'Create',
      outcome: 'ok',
      detail: 'Variant created',
      durationMs: finishedAt - startedAt
    });

    await refresh();

    // Select the new variant
    const idx = rows.findIndex((r) => r.meta.slug === created.slug);
    if (idx !== -1) selected = idx;

    setNotice('success', `Created ${created.slug} · syncing…`);
    render();

    await runPhase('Sync', created.slug, 'scripts/sync-variants.ts', ['--slug', created.slug]);
    setNotice('success', `Created + synced ${created.slug}`);
  }

  function cycleBottomPanel() {
    bottomMode = bottomMode === 'activity'
      ? 'eval'
      : bottomMode === 'eval'
        ? 'redteam'
        : bottomMode === 'redteam'
          ? 'claims'
          : bottomMode === 'claims'
            ? 'issues'
            : 'activity';
  }

  async function runActionFromOverlay(actionId: ActionId, slug: string) {
    if (actionId === 'close') {
      overlay = null;
      render();
      return;
    }
    if (actionId === 'run-next') {
      overlay = null;
      await runGuidedNext();
      return;
    }
    if (actionId === 'pipeline') {
      overlay = null;
      await runPipeline(slug);
      return;
    }
    if (actionId === 'sync') {
      overlay = null;
      await runPhase('Sync', slug, 'scripts/sync-variants.ts', ['--slug', slug]);
      return;
    }
    if (actionId === 'eval') {
      overlay = null;
      await runPhase('Evaluate', slug, 'scripts/evaluate-variants.ts', ['--slug', slug], { events: true });
      return;
    }
    if (actionId === 'claims') {
      // Check if all claims are already verified -> show CTA
      const ev = getEvalLedgerSummary(slug);
      const initialFocus = ev.unverified === 0 ? 'cta' : 'claims';
      overlay = { kind: 'claims', focus: initialFocus, claimIndex: 0, sourceIndex: 0 };
      bottomMode = 'claims';
      render();
      return;
    }
    if (actionId === 'redteam') {
      overlay = null;
      await runPhase('Red Team', slug, 'scripts/redteam.ts', ['--slug', slug]);
      return;
    }
    if (actionId === 'publish') {
      overlay = null;
      await publishVariant(slug);
      return;
    }
    if (actionId === 'toggle-applied') {
      overlay = null;
      await toggleAppliedStatus(slug);
      return;
    }
  }

  async function verifyClaimFromOverlay() {
    const row = rows[selected];
    if (!row) return;
    const slug = row.meta.slug;
    const ev = getEvalLedgerSummary(slug);
    if (!ev.exists || ev.unverifiedClaims.length === 0) {
      setNotice('info', 'No unverified claims');
      overlay = null;
      render();
      return;
    }
    const ov = overlay as Extract<Overlay, { kind: 'claims' }>;
    const claim = ev.unverifiedClaims[clamp(ov.claimIndex, 0, ev.unverifiedClaims.length - 1)];
    const sources = Array.isArray(claim.candidateSources) ? claim.candidateSources : [];
    const src = sources[clamp(ov.sourceIndex, 0, Math.max(0, sources.length - 1))];
    if (!src) {
      setNotice('error', 'No candidate source selected');
      return;
    }

    busy = true;
    try {
      await runPhase(
        'Verify',
        slug,
        'scripts/evaluate-variants.ts',
        ['--slug', slug, '--verify', `${claim.id}=${src.path}`],
        { events: true }
      );

      // Check if all claims are now verified -> auto-focus CTA
      const updatedEv = getEvalLedgerSummary(slug);
      if (updatedEv.unverified === 0) {
        // All done - celebrate and show CTA for smooth transition to Redteam
        setNotice('success', 'All claims verified!');
        overlay = { kind: 'claims', focus: 'cta', claimIndex: 0, sourceIndex: 0 };
      } else {
        // Keep verification mode for remaining claims
        overlay = { kind: 'claims', focus: 'claims', claimIndex: 0, sourceIndex: 0 };
      }
      bottomMode = 'claims';
      render();
    } finally {
      busy = false;
    }
  }

  await refresh();
  render();

  process.stdout.on('resize', () => {
    try { render(); } catch { /* ignore */ }
  });

  readline.emitKeypressEvents(process.stdin);
  if (process.stdin.isTTY) process.stdin.setRawMode(true);

  process.stdin.on('keypress', async (_str: string, key: KeypressKey) => {
    if (!key) return;

    if (key.sequence === '\u0003') {
      cleanupAndExit(0);
      return;
    }

    const accel = Boolean(key.meta) || Boolean(key.ctrl);

    // When we're inside a blocking prompt (create/publish confirm), don't
    // intercept keys (except Ctrl+C handled above).
    if (busy) {
      return;
    }

    // Quit with 'q' - only when not in a prompt
    if (key.name === 'q') {
      cleanupAndExit(0);
      return;
    }

    // Demo mode: slows event/render updates slightly for presentations.
    // We avoid Ctrl+D since it's commonly bound to EOF.
    if (key.name === 'd' && !key.ctrl) {
      demoMode = !demoMode;
      setNotice('info', demoMode ? `Demo mode ON (delay ${demoDelayMs}ms)` : 'Demo mode OFF');
      render();
      return;
    }

    // View-only hotkeys are allowed even while a runner is active.
    if (key.name === 'p' || (accel && key.name === 'p')) {
      cycleBottomPanel();
      render();
      return;
    }

    if (accel && ['1', '2', '3', '4', '5'].includes(key.name)) {
      bottomMode = key.name === '1'
        ? 'activity'
        : key.name === '2'
          ? 'eval'
          : key.name === '3'
            ? 'redteam'
            : key.name === '4'
              ? 'claims'
              : 'issues';
      render();
      return;
    }

    // 'i' = open issues panel and trigger sync
    if (key.name === 'i') {
      bottomMode = 'issues';
      busy = true;
      try {
        const { syncIssues } = await import('../../../scripts/lib/issue-sync.js');
        const result = await syncIssues();
        const total = result.created.length + result.updated.length;
        if (total > 0) {
          setNotice('info', `Synced ${total} issues`);
        }
      } catch {
        // Issues sync may fail if no evals exist yet
      } finally {
        busy = false;
        render();
      }
      return;
    }

    if (str === '?' || key.name === '?') {
      overlay = overlay?.kind === 'help' ? null : { kind: 'help' };
      render();
      return;
    }

    if (key.name === 'escape') {
      if (overlay) {
        overlay = null;
        render();
      }
      return;
    }

    if (runner?.running) {
      return;
    }

    // Accelerator: Cmd/Ctrl+K toggles the actions menu (demo-friendly).
    if (accel && key.name === 'k') {
      if (overlay?.kind === 'actions') overlay = null;
      else overlay = { kind: 'actions', selected: 0 };
      render();
      return;
    }

    if (key.name === 'r') {
      busy = true;
      await refresh();
      busy = false;
      render();
      return;
    }

    // (p / ? / Esc handled above)

    if (key.name === 'a') {
      if (overlay?.kind === 'actions') overlay = null;
      else overlay = { kind: 'actions', selected: 0 };
      render();
      return;
    }

    if (key.name === 'c' || (accel && key.name === 'n')) {
      // 'c' = Create. Also support Cmd/Ctrl+N as 'new'.
      busy = true;
      try {
        await createVariantAndAutoSync();
      } finally {
        busy = false;
        await refresh();
        render();
      }
      return;
    }

    // Overlay-specific navigation
    if (overlay?.kind === 'actions') {
      const row = rows[selected];
      const actions = getActionsFor(row);
      if (key.name === 'down') {
        overlay = { kind: 'actions', selected: Math.min(actions.length - 1, overlay.selected + 1) };
        render();
        return;
      }
      if (key.name === 'up') {
        overlay = { kind: 'actions', selected: Math.max(0, overlay.selected - 1) };
        render();
        return;
      }
      if (key.name === 'return') {
        const action = actions[overlay.selected];
        if (!action) return;
        if (!action.enabled && action.id !== 'close') {
          setNotice('warning', 'Action disabled');
          render();
          return;
        }
        const slug = row?.meta.slug;
        if (!slug) return;
        busy = true;
        try {
          await runActionFromOverlay(action.id, slug);
        } finally {
          busy = false;
          await refresh();
          render();
        }
        return;
      }
      return;
    }

    if (overlay?.kind === 'claims') {
      const ov = overlay;

      // CTA mode: all claims verified, Enter starts Redteam
      if (ov.focus === 'cta') {
        if (key.name === 'return') {
          const row = rows[selected];
          if (!row) return;
          const slug = row.meta.slug;

          // Close overlay and start Redteam
          overlay = null;
          busy = true;
          try {
            await runPhase('Red Team', slug, 'scripts/redteam.ts', ['--slug', slug]);
            bottomMode = 'redteam';  // Show redteam results after completion
          } finally {
            busy = false;
            await refresh();
            render();
          }
          return;
        }
        // Escape closes overlay (handled by generic handler above)
        // No other keys do anything in CTA mode
        return;
      }

      // Quick verification: Y = verify with top source, N = skip to next claim
      if (key.name === 'y') {
        busy = true;
        try {
          // Set sourceIndex to 0 (top source) before verifying
          overlay = { ...ov, sourceIndex: 0 };
          await verifyClaimFromOverlay();
        } finally {
          busy = false;
          await refresh();
          render();
        }
        return;
      }
      if (key.name === 'n') {
        // Skip to next unverified claim
        const row = rows[selected];
        if (row) {
          const ev = getEvalLedgerSummary(row.meta.slug);
          const maxIndex = Math.max(0, ev.unverifiedClaims.length - 1);
          overlay = { ...ov, claimIndex: Math.min(ov.claimIndex + 1, maxIndex), sourceIndex: 0 };
          render();
        }
        return;
      }

      if (key.name === 'tab') {
        overlay = {
          kind: 'claims',
          focus: ov.focus === 'claims' ? 'sources' : 'claims',
          claimIndex: ov.claimIndex,
          sourceIndex: ov.sourceIndex
        };
        render();
        return;
      }
      if (key.name === 'down') {
        if (ov.focus === 'claims') {
          overlay = { ...ov, claimIndex: ov.claimIndex + 1 };
        } else {
          overlay = { ...ov, sourceIndex: ov.sourceIndex + 1 };
        }
        render();
        return;
      }
      if (key.name === 'up') {
        if (ov.focus === 'claims') {
          overlay = { ...ov, claimIndex: Math.max(0, ov.claimIndex - 1) };
        } else {
          overlay = { ...ov, sourceIndex: Math.max(0, ov.sourceIndex - 1) };
        }
        render();
        return;
      }
      if (key.name === 'return') {
        if (ov.focus === 'claims') {
          overlay = { ...ov, focus: 'sources', sourceIndex: 0 };
          render();
          return;
        }
        busy = true;
        try {
          await verifyClaimFromOverlay();
        } finally {
          busy = false;
          await refresh();
          render();
        }
        return;
      }
      return;
    }

    // Default navigation
    if (key.name === 'down') {
      selected = Math.min(rows.length - 1, selected + 1);
      render();
      return;
    }
    if (key.name === 'up') {
      selected = Math.max(0, selected - 1);
      render();
      return;
    }

    if (key.name === 'return') {
      busy = true;
      try {
        await runGuidedNext();
      } finally {
        busy = false;
        await refresh();
        render();
      }
      return;
    }
  });

  function cleanupAndExit(code: number) {
    try {
      if (process.stdin.isTTY) process.stdin.setRawMode(false);
    } catch {
      // ignore
    }
    clearScreen();
    process.exit(code);
  }
}

main().catch((err) => {
  console.error(`${theme.icons.error} ${theme.error('Fatal:')} ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
});
