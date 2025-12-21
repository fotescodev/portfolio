#!/usr/bin/env tsx
/**
 * Variant Evaluation CLI (Executable Framework)
 *
 * This CLI makes your capstone evaluation framework *operational*.
 *
 * Grounded to this repo:
 * - Variants live in:      content/variants/<slug>.yaml   (canonical, human-editable)
 * - Runtime artifact is:   content/variants/<slug>.json   (what the website loads)
 * - Knowledge base lives:  content/knowledge/**           (source of truth for facts)
 *
 * What this tool produces:
 * - capstone/develop/evals/<slug>.claims.yaml  (machine-checkable "claims ledger")
 * - capstone/develop/evals/<slug>.eval.md      (human checklist + scan summary)
 *
 * The claims ledger is intentionally strict:
 * - It extracts "metric-like" claims (numbers, %, $, ×, +, and quantifiers like "billions", "zero")
 * - Each claim must be VERIFIED against a source file (with anchors)
 * - eval:check will fail if a verified anchor disappears later (regression detection)
 *
 * Usage:
 *   npm run eval:variant -- --slug mysten-walrus-senior-pm
 *   npm run eval:all
 *   npm run eval:check
 *   npm run eval:variant -- --json
 */

import { existsSync, readFileSync, readdirSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import crypto from 'crypto';
import YAML from 'yaml';
import ora from 'ora';
import { VariantSchema } from '../src/lib/schemas.js';
import { theme, HEADER_COMPACT } from './cli/theme.js';

type VerifyArg = { id: string; sourcePath: string };

type Args = {
  slug?: string;
  all: boolean;
  check: boolean;
  noWrite: boolean;
  json: boolean;
  events: boolean;
  verify: VerifyArg[];
};

type CandidateSource = {
  path: string;
  score: number;
  matchedAnchors: string[];
  note?: string;
};

type VerifiedSource = {
  path: string;
  anchors: string[];
};

type ClaimEntry = {
  id: string;
  location: string;
  text: string;
  anchors: string[];
  candidateSources: CandidateSource[];
  verified: {
    status: 'unverified' | 'verified';
    sources: VerifiedSource[];
    notes?: string;
  };
};

type ClaimsLedger = {
  version: 1;
  variant: {
    slug: string;
    variantFile: string;
    contentHash: string;
    evaluatedAt: string;
  };
  claims: ClaimEntry[];
};

type EvalResult = {
  slug: string;
  status: 'ok' | 'error';
  claims: number;
  verified: number;
  unverified: number;
  message?: string;
};

function parseArgs(): Args {
  const argv = process.argv.slice(2);
  const out: Args = { all: false, check: false, noWrite: false, json: false, events: false, verify: [] };

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const n = argv[i + 1];
    if (a === '--slug') {
      out.slug = n;
      i++;
    } else if (a === '--all') {
      out.all = true;
    } else if (a === '--check') {
      out.check = true;
    } else if (a === '--no-write') {
      out.noWrite = true;
    } else if (a === '--json') {
      out.json = true;
    } else if (a === '--events') {
      out.events = true;
    } else if (a === '--verify') {
      const v = n || '';
      const [id, sourcePath] = v.split('=');
      if (!id || !sourcePath) {
        throw new Error(`Invalid --verify value '${v}'. Expected: <claimId>=<sourcePath>`);
      }
      out.verify.push({ id, sourcePath });
      i++;
    }
  }

  // Default behavior:
  // - eval:check (when called without slug) should check all variants.
  if (out.check && !out.slug) out.all = true;

  if (!out.slug && !out.all) {
    throw new Error('Provide --slug <slug> or --all');
  }
  if (out.slug && out.all) {
    throw new Error('Choose either --slug or --all, not both.');
  }

  return out;
}

function emitEvent(args: Args, event: Record<string, unknown>) {
  if (!args.events) return;
  // Important: write events to STDERR so --json stdout remains valid JSON.
  try {
    process.stderr.write(`UCV_EVENT ${JSON.stringify(event)}\n`);
  } catch {
    // ignore
  }
}

function listVariantSlugs(): string[] {
  const variantsDir = join(process.cwd(), 'content', 'variants');
  if (!existsSync(variantsDir)) return [];
  return readdirSync(variantsDir)
    .filter(f => f.endsWith('.yaml'))
    .filter(f => !f.startsWith('_'))
    .map(f => f.replace(/\.yaml$/, ''));
}

function sha256(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex');
}

function stableJson(obj: unknown): string {
  return JSON.stringify(obj, null, 2) + '\n';
}

function computeVariantContentHash(validatedVariant: any): string {
  const payload = stableJson({
    slug: validatedVariant.metadata.slug,
    company: validatedVariant.metadata.company,
    role: validatedVariant.metadata.role,
    overrides: validatedVariant.overrides,
    relevance: validatedVariant.relevance ?? null
  });
  return sha256(payload);
}

function readVariantYaml(slug: string): { yamlPath: string; raw: string; validated: any } {
  const yamlPath = join(process.cwd(), 'content', 'variants', `${slug}.yaml`);
  if (!existsSync(yamlPath)) {
    throw new Error(`Variant YAML not found: ${yamlPath}`);
  }
  const raw = readFileSync(yamlPath, 'utf-8');
  const parsed = YAML.parse(raw);
  const validated = VariantSchema.parse(parsed);
  return { yamlPath, raw, validated };
}

function readVariantJsonIfExists(slug: string): { jsonPath: string; raw: string } | null {
  const jsonPath = join(process.cwd(), 'content', 'variants', `${slug}.json`);
  if (!existsSync(jsonPath)) return null;
  return { jsonPath, raw: readFileSync(jsonPath, 'utf-8') };
}

function collectStrings(value: any, path: string, out: Array<{ location: string; text: string }>) {
  if (value === null || value === undefined) return;

  if (typeof value === 'string') {
    const t = value.trim();
    if (t) out.push({ location: path, text: t });
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((v, i) => collectStrings(v, `${path}[${i}]`, out));
    return;
  }

  if (typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) {
      collectStrings(v, `${path}.${k}`, out);
    }
  }
}

function splitSentences(text: string): string[] {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (!normalized) return [];
  return normalized
    .split(/(?:\.\s+|\?\s+|!\s+|\n+)/)
    .map(s => s.trim())
    .filter(Boolean);
}

const metricWordRe = /\b(zero|billions?|millions?|thousands?|hundreds?|dozens?)\b/gi;

function extractAnchors(sentence: string): string[] {
  const anchors = new Set<string>();

  const patterns: RegExp[] = [
    /\$[0-9][0-9.,]*(?:\s?[KMB])?\+?/g,
    /\b[0-9][0-9.,]*\s?%/g,
    /\b[0-9][0-9.,]*\s?[x×]\b/gi,
    /\b[0-9]+\+/g,
    /\b[0-9][0-9.,]*\s?(?:weeks?|months?|years?|days?)\b/gi,
    /\b[0-9][0-9.,]*\s?(?:K|M|B)\b/g
  ];

  for (const re of patterns) {
    const matches = sentence.match(re);
    matches?.forEach(m => anchors.add(m.trim()));
  }

  const quant = sentence.match(metricWordRe);
  quant?.forEach(q => anchors.add(q.trim()));

  const parens = [...sentence.matchAll(/\(([A-Za-z0-9][^)]{0,80})\)/g)].map(m => m[1]);
  for (const p of parens) {
    const trimmed = p.trim();
    if (trimmed.includes(',') && /[A-Z]/.test(trimmed)) {
      anchors.add(trimmed);
    }
  }

  return [...anchors];
}

function hasMetricSignal(sentence: string): boolean {
  return /\d/.test(sentence) || /[%$×]/.test(sentence) || metricWordRe.test(sentence);
}

function makeClaimId(location: string, sentence: string): string {
  const h = crypto.createHash('sha1').update(`${location}|${sentence}`).digest('hex');
  return `metric-${h.slice(0, 10)}`;
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .map(s => s.trim())
    .filter(s => s.length >= 4)
    .filter(s => !['this', 'that', 'with', 'from', 'were', 'have', 'your', 'they', 'been', 'into', 'over', 'more', 'most', 'than', 'them'].includes(s));
}

type SourceDoc = {
  path: string;
  raw: string;
  tokens: Set<string>;
};

function loadKnowledgeSources(): SourceDoc[] {
  const roots: string[] = [
    join(process.cwd(), 'content', 'knowledge', 'achievements'),
    join(process.cwd(), 'content', 'knowledge', 'stories')
  ];

  const files: string[] = [];
  for (const r of roots) {
    if (!existsSync(r)) continue;
    for (const f of readdirSync(r)) {
      if (f.endsWith('.yaml')) files.push(join(r, f));
    }
  }

  const exp = join(process.cwd(), 'content', 'experience', 'index.yaml');
  if (existsSync(exp)) files.push(exp);

  return files.map(p => {
    const raw = readFileSync(p, 'utf-8');
    return { path: p.replace(process.cwd() + '/', ''), raw, tokens: new Set(tokenize(raw)) };
  });
}

function candidateSourcesForClaim(claim: { anchors: string[]; text: string }, sources: SourceDoc[]): CandidateSource[] {
  const claimTokens = new Set(tokenize(claim.text));
  const claimTokenList = [...claimTokens];

  const scored: CandidateSource[] = [];

  for (const src of sources) {
    const matchedAnchors = claim.anchors.filter(a => src.raw.includes(a));
    const anchorScore = matchedAnchors.length / Math.max(1, claim.anchors.length);

    let overlapScore = 0;
    if (claimTokenList.length > 0) {
      const hit = claimTokenList.filter(t => src.tokens.has(t)).length;
      overlapScore = hit / claimTokenList.length;
    }

    const score = Math.min(1, anchorScore + 0.15 * overlapScore);

    if (matchedAnchors.length > 0 || overlapScore >= 0.25) {
      scored.push({
        path: src.path,
        score: Number(score.toFixed(3)),
        matchedAnchors,
        note: `anchors ${matchedAnchors.length}/${Math.max(1, claim.anchors.length)} • overlap ${(overlapScore * 100).toFixed(0)}%`
      });
    }
  }

  return scored.sort((a, b) => b.score - a.score).slice(0, 5);
}

function ensureDir(dir: string) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function readLedgerIfExists(ledgerPath: string): ClaimsLedger | null {
  if (!existsSync(ledgerPath)) return null;
  const raw = readFileSync(ledgerPath, 'utf-8');
  const parsed = YAML.parse(raw) as ClaimsLedger;
  return parsed ?? null;
}

function writeLedger(ledgerPath: string, ledger: ClaimsLedger) {
  const yaml = YAML.stringify(ledger, { lineWidth: 120 });
  writeFileSync(ledgerPath, yaml, 'utf-8');
}

function writeEvalMd(mdPath: string, slug: string, ledger: ClaimsLedger, notes: string[] = []) {
  const total = ledger.claims.length;
  const verified = ledger.claims.filter(c => c.verified.status === 'verified').length;
  const unverified = total - verified;

  const lines: string[] = [];
  lines.push(`# Variant Evaluation`);
  lines.push('');
  lines.push(`- Variant: \`${slug}\``);
  lines.push(`- Ledger: \`capstone/develop/evals/${slug}.claims.yaml\``);
  lines.push(`- Evaluated At: ${ledger.variant.evaluatedAt}`);
  lines.push(`- Content Hash: \`${ledger.variant.contentHash.slice(0, 12)}…\``);
  lines.push('');
  lines.push(`## Automated Summary`);
  lines.push('');
  lines.push(`- Claims detected: **${total}**`);
  lines.push(`- Verified: **${verified}**`);
  lines.push(`- Unverified: **${unverified}**`);
  if (notes.length) {
    lines.push('');
    lines.push(`### Notes`);
    for (const n of notes) lines.push(`- ${n}`);
  }
  lines.push('');
  lines.push(`## Claims`);
  lines.push('');
  lines.push(`| Status | Claim | Location | Top candidate source |`);
  lines.push(`|---|---|---|---|`);
  for (const c of ledger.claims) {
    const status = c.verified.status === 'verified' ? '✅ verified' : '⚠️ unverified';
    const top = c.candidateSources[0]?.path ?? '';
    const claimShort = c.text.length > 120 ? c.text.slice(0, 117) + '…' : c.text;
    lines.push(`| ${status} | ${escapeMdInline(claimShort)} | \`${c.location}\` | \`${top}\` |`);
  }
  lines.push('');
  lines.push(`## Human Checklist (Capstone Rubric)`);
  lines.push('');
  lines.push(`Use \`capstone/develop/evaluation.md\` as the rubric. Fill in scores here as you review:`);
  lines.push('');
  lines.push(`- Accuracy: ___ / 5`);
  lines.push(`- Relevance: ___ / 5`);
  lines.push(`- Tone: ___ / 5`);
  lines.push(`- Safety: ___ / 5`);
  lines.push('');
  lines.push(`### Gate`);
  lines.push('');
  lines.push(`- To pass \`npm run eval:check\`: every claim must be **verified** in the claims ledger, and every verified source must still contain its anchors.`);

  writeFileSync(mdPath, lines.join('\n') + '\n', 'utf-8');
}

function escapeMdInline(s: string): string {
  return s.replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

function applyVerifyWrites(ledger: ClaimsLedger, verifyArgs: VerifyArg[]) {
  if (verifyArgs.length === 0) return;

  const byId = new Map(ledger.claims.map(c => [c.id, c]));
  for (const v of verifyArgs) {
    const claim = byId.get(v.id);
    if (!claim) throw new Error(`--verify references unknown claim id: ${v.id}`);

    const full = join(process.cwd(), v.sourcePath);
    if (!existsSync(full)) throw new Error(`--verify source path not found: ${v.sourcePath}`);

    claim.verified.status = 'verified';
    const exists = claim.verified.sources.some(s => s.path === v.sourcePath);
    if (!exists) {
      claim.verified.sources.push({ path: v.sourcePath, anchors: claim.anchors });
    }
  }
}

function checkLedgerStrict(slug: string, ledgerPath: string, ledger: ClaimsLedger, currentHash: string): string[] {
  const errors: string[] = [];

  if (ledger.variant.contentHash !== currentHash) {
    errors.push(`Ledger hash mismatch. Re-run: npm run eval:variant -- --slug ${slug}`);
  }

  for (const claim of ledger.claims) {
    if (claim.verified.status !== 'verified') {
      errors.push(`Unverified claim: ${claim.id} (${claim.location})`);
      continue;
    }
    for (const src of claim.verified.sources) {
      const full = join(process.cwd(), src.path);
      if (!existsSync(full)) {
        errors.push(`Missing source file for ${claim.id}: ${src.path}`);
        continue;
      }
      const raw = readFileSync(full, 'utf-8');
      for (const a of src.anchors) {
        if (!raw.includes(a)) {
          errors.push(`Anchor missing for ${claim.id}: '${a}' not found in ${src.path}`);
        }
      }
    }
  }

  return errors;
}

function buildLedger(
  slug: string,
  onClaim?: (claim: {
    id: string;
    location: string;
    text: string;
    anchors: string[];
    topCandidate?: { path: string; score: number; note?: string };
  }) => void
): { ledger: ClaimsLedger; ledgerPath: string; mdPath: string; notes: string[] } {
  const { yamlPath, validated } = readVariantYaml(slug);

  const json = readVariantJsonIfExists(slug);
  const nextJson = stableJson(validated);
  const notes: string[] = [];
  if (!json) {
    notes.push('Variant JSON is missing. Run `npm run variants:sync`.');
  } else if (json.raw !== nextJson) {
    notes.push('Variant YAML and JSON differ. Run `npm run variants:sync` to realign runtime artifacts.');
  }

  const contentHash = computeVariantContentHash(validated);

  const snippets: Array<{ location: string; text: string }> = [];
  collectStrings(validated.overrides, 'overrides', snippets);

  const claims: ClaimEntry[] = [];
  const seen = new Set<string>();

  const sources = loadKnowledgeSources();

  for (const snip of snippets) {
    const sentences = splitSentences(snip.text);

    for (const s of sentences) {
      if (!hasMetricSignal(s)) continue;

      const anchors = extractAnchors(s);
      if (anchors.length === 0) continue;

      const id = makeClaimId(snip.location, s);
      if (seen.has(id)) continue;
      seen.add(id);

      const cands = candidateSourcesForClaim({ anchors, text: s }, sources);

      onClaim?.({
        id,
        location: snip.location,
        text: s.length > 180 ? s.slice(0, 177) + '…' : s,
        anchors,
        topCandidate: cands[0]
          ? { path: cands[0].path, score: cands[0].score, note: cands[0].note }
          : undefined
      });

      claims.push({
        id,
        location: snip.location,
        text: s,
        anchors,
        candidateSources: cands,
        verified: {
          status: 'unverified',
          sources: [],
          notes: ''
        }
      });
    }
  }

  const evalDir = join(process.cwd(), 'capstone', 'develop', 'evals');
  ensureDir(evalDir);
  const ledgerPath = join(evalDir, `${slug}.claims.yaml`);
  const mdPath = join(evalDir, `${slug}.eval.md`);

  const existing = readLedgerIfExists(ledgerPath);
  if (existing?.claims?.length) {
    const prevById = new Map(existing.claims.map(c => [c.id, c]));
    for (const c of claims) {
      const prev = prevById.get(c.id);
      if (prev?.verified) {
        c.verified = prev.verified;
      }
    }
  }

  const ledger: ClaimsLedger = {
    version: 1,
    variant: {
      slug,
      variantFile: yamlPath.replace(process.cwd() + '/', ''),
      contentHash,
      evaluatedAt: new Date().toISOString()
    },
    claims
  };

  return { ledger, ledgerPath, mdPath, notes };
}

async function evalOne(slug: string, args: Args): Promise<EvalResult> {
  try {
    emitEvent(args, { type: 'eval.start', slug, mode: args.check ? 'check' : 'eval' });

    const { ledger, ledgerPath, mdPath, notes } = buildLedger(
      slug,
      args.check
        ? undefined
        : (c) => emitEvent(args, { type: 'eval.claim', slug, ...c })
    );

    if (args.verify.length > 0) {
      for (const v of args.verify) {
        emitEvent(args, { type: 'eval.verify', slug, id: v.id, sourcePath: v.sourcePath });
      }
    }

    applyVerifyWrites(ledger, args.verify);

    if (args.check) {
      if (!existsSync(ledgerPath)) {
        emitEvent(args, { type: 'eval.error', slug, message: 'Missing claims ledger' });
        return {
          slug,
          status: 'error',
          claims: 0,
          verified: 0,
          unverified: 0,
          message: `Missing claims ledger. Run: npm run eval:variant -- --slug ${slug}`
        };
      }
      const currentHash = ledger.variant.contentHash;
      const onDisk = readLedgerIfExists(ledgerPath);
      if (!onDisk) {
        emitEvent(args, { type: 'eval.error', slug, message: 'Missing claims ledger' });
        return {
          slug,
          status: 'error',
          claims: 0,
          verified: 0,
          unverified: 0,
          message: 'Missing claims ledger'
        };
      }
      const errors = checkLedgerStrict(slug, ledgerPath, onDisk, currentHash);
      if (errors.length > 0) {
        emitEvent(args, { type: 'eval.error', slug, message: errors.join('; ') });
        return {
          slug,
          status: 'error',
          claims: onDisk.claims.length,
          verified: onDisk.claims.filter(c => c.verified.status === 'verified').length,
          unverified: onDisk.claims.filter(c => c.verified.status !== 'verified').length,
          message: errors.join('; ')
        };
      }
      return {
        slug,
        status: 'ok',
        claims: onDisk.claims.length,
        verified: onDisk.claims.filter(c => c.verified.status === 'verified').length,
        unverified: onDisk.claims.filter(c => c.verified.status !== 'verified').length
      };
    }

    if (!args.noWrite) {
      writeLedger(ledgerPath, ledger);
      writeEvalMd(mdPath, slug, ledger, notes);
      emitEvent(args, { type: 'eval.wrote', slug, ledgerPath: ledgerPath.replace(process.cwd() + '/', ''), mdPath: mdPath.replace(process.cwd() + '/', '') });
    }

    const total = ledger.claims.length;
    const verified = ledger.claims.filter(c => c.verified.status === 'verified').length;
    const unverified = total - verified;

    emitEvent(args, { type: 'eval.done', slug, status: 'ok', claims: total, verified, unverified });
    return { slug, status: 'ok', claims: total, verified, unverified };
  } catch (err) {
    emitEvent(args, { type: 'eval.done', slug, status: 'error', message: err instanceof Error ? err.message : String(err) });
    return {
      slug,
      status: 'error',
      claims: 0,
      verified: 0,
      unverified: 0,
      message: err instanceof Error ? err.message : String(err)
    };
  }
}

async function main() {
  const args = parseArgs();

  const slugs = args.all ? listVariantSlugs() : [args.slug!];
  if (slugs.length === 0) {
    if (args.json) {
      console.log(JSON.stringify({ results: [] }));
    } else {
      console.log(theme.muted('No variants found. Nothing to evaluate.'));
    }
    process.exit(0);
  }

  // JSON output mode
  if (args.json) {
    const results: EvalResult[] = [];
    for (const slug of slugs) {
      results.push(await evalOne(slug, args));
    }
    const output = {
      mode: args.check ? 'check' : 'eval',
      results,
      errors: results.filter(r => r.status === 'error')
    };
    console.log(JSON.stringify(output, null, 2));
    process.exit(output.errors.length > 0 ? 1 : 0);
  }

  // Interactive output
  console.log(HEADER_COMPACT);
  console.log();

  const spinner = ora({
    text: args.check ? 'Checking claims ledgers...' : 'Evaluating variants...',
    color: 'yellow'
  }).start();

  const results: EvalResult[] = [];
  for (const slug of slugs) {
    results.push(await evalOne(slug, args));
  }

  spinner.stop();

  console.log(theme.bold(args.check ? 'Checking variants' : 'Evaluating variants'));
  console.log(theme.muted(`${slugs.length} variant(s)`));
  console.log();

  for (const r of results) {
    if (r.status === 'error') {
      console.log(`${theme.icons.error} ${r.slug} ${theme.error('failed')}`);
      if (r.message) console.log(theme.muted(`  ${r.message}`));
    } else {
      const statusText = r.unverified > 0
        ? theme.warning(`${r.verified}/${r.claims} verified`)
        : theme.success(`${r.verified}/${r.claims} verified`);
      console.log(`${theme.icons.success} ${r.slug}: ${statusText}`);
      if (!args.check) {
        console.log(theme.muted(`  Ledger: capstone/develop/evals/${r.slug}.claims.yaml`));
      }
    }
  }

  const errors = results.filter(r => r.status === 'error');
  if (errors.length > 0) {
    console.log();
    console.log(`${theme.icons.error} ${theme.error(`${errors.length} variant(s) failed`)}`);
    process.exit(1);
  }

  console.log();
  const totalUnverified = results.reduce((acc, r) => acc + r.unverified, 0);
  if (totalUnverified > 0) {
    console.log(theme.warning(`${theme.icons.warning} ${totalUnverified} unverified claim(s) remaining`));
  } else {
    console.log(theme.success(`${theme.icons.success} All claims verified`));
  }
}

main().catch((err) => {
  console.error(`${theme.icons.error} ${theme.error('Fatal:')} ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
});
