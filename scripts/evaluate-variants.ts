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
 *
 * Optional write-back helpers:
 *   npm run eval:variant -- --slug mysten-walrus-senior-pm --verify metric-abc123=content/knowledge/achievements/ankr-15x-revenue.yaml
 */

import { existsSync, readFileSync, readdirSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import crypto from 'crypto';
import YAML from 'yaml';
import { VariantSchema } from '../src/lib/schemas.js';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  gray: '\x1b[90m',
  bold: '\x1b[1m'
};

type VerifyArg = { id: string; sourcePath: string };

type Args = {
  slug?: string;
  all: boolean;
  check: boolean;
  noWrite: boolean;
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

function parseArgs(): Args {
  const argv = process.argv.slice(2);
  const out: Args = { all: false, check: false, noWrite: false, verify: [] };

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
  // Important: exclude metadata.generatedAt (and jobDescription) to avoid false positives.
  // We want the hash to change when the *output content* changes.
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
  // Simple sentence split (good enough for this workflow).
  return normalized
    .split(/(?:\.\s+|\?\s+|!\s+|\n+)/)
    .map(s => s.trim())
    .filter(Boolean);
}

const metricWordRe = /\b(zero|billions?|millions?|thousands?|hundreds?|dozens?)\b/gi;
const approxWordRe = /\b(about|around|roughly|nearly|approx(?:\.|imately)?|~)\b/gi;

function extractAnchors(sentence: string): string[] {
  const anchors = new Set<string>();

  const patterns: RegExp[] = [
    /\$[0-9][0-9.,]*(?:\s?[KMB])?\+?/g,        // $130K, $2M, $200K
    /\b[0-9][0-9.,]*\s?%/g,                   // 40%, 0.1%
    /\b[0-9][0-9.,]*\s?[x×]\b/gi,             // 15x, 15×
    /\b[0-9]+\+/g,                            // 7+
    /\b[0-9][0-9.,]*\s?(?:weeks?|months?|years?|days?)\b/gi, // 8 months, 12+ weeks
    /\b[0-9][0-9.,]*\s?(?:K|M|B)\b/g          // 1M, 2B
  ];

  for (const re of patterns) {
    const matches = sentence.match(re);
    matches?.forEach(m => anchors.add(m.trim()));
  }

  // Quantifier words like "billions", "zero"
  const quant = sentence.match(metricWordRe);
  quant?.forEach(q => anchors.add(q.trim()));

  // Parenthetical named entities like "(Optimism, Base, Arbitrum)"
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

  // Also include experience index as a fallback source of truth.
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

    // Word overlap is a weak signal; anchors are stronger.
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

    // Ensure source exists
    const full = join(process.cwd(), v.sourcePath);
    if (!existsSync(full)) throw new Error(`--verify source path not found: ${v.sourcePath}`);

    claim.verified.status = 'verified';
    const exists = claim.verified.sources.some(s => s.path === v.sourcePath);
    if (!exists) {
      claim.verified.sources.push({ path: v.sourcePath, anchors: claim.anchors });
    }
  }
}

function checkLedgerStrict(slug: string, ledgerPath: string, ledger: ClaimsLedger, currentHash: string) {
  const errors: string[] = [];

  if (ledger.variant.contentHash !== currentHash) {
    errors.push(`Ledger hash mismatch for '${slug}'. Re-run: npm run eval:variant -- --slug ${slug}`);
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

  if (errors.length) {
    console.error(`${colors.red}${colors.bold}✗ eval:check failed for ${slug}${colors.reset}`);
    errors.forEach(e => console.error(`  ${colors.red}•${colors.reset} ${e}`));
    process.exit(1);
  }
}

function buildLedger(slug: string): { ledger: ClaimsLedger; ledgerPath: string; mdPath: string; notes: string[] } {
  const { yamlPath, validated } = readVariantYaml(slug);

  // Detect YAML/JSON drift (not a hard error here, but we surface it)
  const json = readVariantJsonIfExists(slug);
  const nextJson = stableJson(validated);
  const notes: string[] = [];
  if (!json) {
    notes.push('Variant JSON is missing. Run `npm run variants:sync`.');
  } else if (json.raw !== nextJson) {
    notes.push('Variant YAML and JSON differ. Run `npm run variants:sync` to realign runtime artifacts.');
  }

  const contentHash = computeVariantContentHash(validated);

  // Extract metric-like claims from overrides only (exclude metadata.jobDescription).
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

  // Preserve existing verifications
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

async function evalOne(slug: string, args: Args) {
  const { ledger, ledgerPath, mdPath, notes } = buildLedger(slug);

  // Apply optional CLI write-back verification
  applyVerifyWrites(ledger, args.verify);

  if (args.check) {
    if (!existsSync(ledgerPath)) {
      console.error(`${colors.red}${colors.bold}✗ Missing claims ledger for ${slug}${colors.reset}`);
      console.error(`  Run: npm run eval:variant -- --slug ${slug}`);
      process.exit(1);
    }
    // In check mode, validate strictness using the *current* hash, not the one in the (rebuilt) ledger object.
    const currentHash = ledger.variant.contentHash;
    const onDisk = readLedgerIfExists(ledgerPath);
    if (!onDisk) {
      console.error(`${colors.red}${colors.bold}✗ Missing claims ledger for ${slug}${colors.reset}`);
      process.exit(1);
    }
    checkLedgerStrict(slug, ledgerPath, onDisk, currentHash);
    console.log(`${colors.green}✓${colors.reset} ${slug} (eval check passed)`);
    return;
  }

  if (!args.noWrite) {
    writeLedger(ledgerPath, ledger);
    writeEvalMd(mdPath, slug, ledger, notes);
  }

  const total = ledger.claims.length;
  const verified = ledger.claims.filter(c => c.verified.status === 'verified').length;
  const unverified = total - verified;

  console.log(`${colors.green}✓${colors.reset} ${slug}: ${total} claim(s) • ${verified} verified • ${unverified} unverified`);
  if (notes.length) {
    notes.forEach(n => console.log(`${colors.yellow}⚠${colors.reset} ${n}`));
  }
  console.log(`${colors.gray}  Ledger:${colors.reset} capstone/develop/evals/${slug}.claims.yaml`);
  console.log(`${colors.gray}  Checklist:${colors.reset} capstone/develop/evals/${slug}.eval.md`);
}

async function main() {
  const args = parseArgs();

  const slugs = args.all ? listVariantSlugs() : [args.slug!];
  if (slugs.length === 0) {
    console.log(`${colors.gray}No variants found. Nothing to evaluate.${colors.reset}`);
    process.exit(0);
  }

  console.log(`${colors.bold}${colors.blue}${args.check ? 'Checking' : 'Evaluating'} variants${colors.reset}`);
  console.log(`${colors.gray}${slugs.length} variant(s)${colors.reset}\n`);

  for (const slug of slugs) {
    await evalOne(slug, args);
  }
}

main().catch((err) => {
  console.error(`${colors.red}${colors.bold}Fatal:${colors.reset} ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
});
