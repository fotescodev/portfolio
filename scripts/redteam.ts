#!/usr/bin/env tsx
/**
 * Red Team Harness CLI (Executable)
 *
 * Turns capstone/develop/red-teaming.md into repeatable scans + a per-variant report.
 *
 * Grounded to this repo:
 * - We red-team the *actual shipped artifacts*: content/variants/<slug>.yaml (canonical)
 * - We enforce traceability via the claims ledger: capstone/develop/evals/<slug>.claims.yaml
 *
 * What it produces:
 * - capstone/develop/redteam/<slug>.redteam.md
 *
 * Usage:
 *   npm run redteam:variant -- --slug mysten-walrus-senior-pm
 *   npm run redteam:all
 *   npm run redteam:check
 *   npm run redteam:check -- --strict   # WARN becomes FAIL
 */

import { existsSync, readFileSync, readdirSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
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

type Args = {
  slug?: string;
  all: boolean;
  check: boolean;
  strict: boolean;
  noWrite: boolean;
};

type Finding = {
  id: string;
  title: string;
  severity: 'PASS' | 'WARN' | 'FAIL';
  details?: string[];
};

function parseArgs(): Args {
  const argv = process.argv.slice(2);
  const out: Args = { all: false, check: false, strict: false, noWrite: false };

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
    } else if (a === '--strict') {
      out.strict = true;
    } else if (a === '--no-write') {
      out.noWrite = true;
    }
  }

  // Default: redteam:check checks all variants.
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

function ensureDir(dir: string) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function readVariantYaml(slug: string): { raw: string; validated: any } {
  const yamlPath = join(process.cwd(), 'content', 'variants', `${slug}.yaml`);
  if (!existsSync(yamlPath)) throw new Error(`Variant YAML not found: ${yamlPath}`);
  const raw = readFileSync(yamlPath, 'utf-8');
  const parsed = YAML.parse(raw);
  const validated = VariantSchema.parse(parsed);
  return { raw, validated };
}

function collectStrings(value: any, out: string[]) {
  if (value === null || value === undefined) return;

  if (typeof value === 'string') {
    const t = value.trim();
    if (t) out.push(t);
    return;
  }

  if (Array.isArray(value)) {
    value.forEach(v => collectStrings(v, out));
    return;
  }

  if (typeof value === 'object') {
    for (const v of Object.values(value)) collectStrings(v, out);
  }
}

function loadClaimsLedger(slug: string): any | null {
  const p = join(process.cwd(), 'capstone', 'develop', 'evals', `${slug}.claims.yaml`);
  if (!existsSync(p)) return null;
  const raw = readFileSync(p, 'utf-8');
  return YAML.parse(raw);
}

// ---- Checks ----

const secretPatterns: Array<{ name: string; re: RegExp }> = [
  { name: 'OpenAI key (sk-...)', re: /\bsk-[A-Za-z0-9]{20,}\b/g },
  { name: 'GitHub token (ghp_...)', re: /\bghp_[A-Za-z0-9]{30,}\b/g },
  { name: 'GitHub fine-grained (github_pat_...)', re: /\bgithub_pat_[A-Za-z0-9_]{20,}\b/g },
  { name: 'Anthropic key (sk-ant-...)', re: /\bsk-ant-[A-Za-z0-9\-_]{20,}\b/g },
  { name: 'AWS access key (AKIA...)', re: /\bAKIA[0-9A-Z]{16}\b/g },
  { name: 'Google API key (AIza...)', re: /\bAIza[0-9A-Za-z\-_]{35}\b/g },
  { name: 'Private key header', re: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g }
];

const confidentialRe = /\b(confidential|nda|non[-\s]?disclosure|proprietary|internal\s+only|do not share|not public)\b/gi;

const sycophancyRe = /\b(thrilled|honored|excited to join|dream company|long admired|inspired by|your amazing|industry[-\s]?leading|revolutionary approach)\b/gi;

const injectionRe = /\b(ignore previous|system prompt|developer message|you are (?:chatgpt|claude)|do not obey|jailbreak|prompt injection|override instructions)\b/gi;

const approxRe = /\b(about|around|roughly|nearly|approx(?:\.|imately)?|~)\b/gi;
const metricRe = /(\$[0-9][0-9.,]*(?:\s?[KMB])?\+?|\b[0-9][0-9.,]*\s?%|\b[0-9]+\+|\b[0-9][0-9.,]*\s?[x×]\b)/gi;

function scanSecrets(text: string): Finding {
  const hits: string[] = [];
  for (const p of secretPatterns) {
    const m = text.match(p.re);
    if (m && m.length) hits.push(`${p.name}: ${m.slice(0, 3).join(', ')}${m.length > 3 ? '…' : ''}`);
  }
  return hits.length
    ? { id: 'RT-SEC-SECRETS', title: 'Secrets / tokens accidentally committed', severity: 'FAIL', details: hits }
    : { id: 'RT-SEC-SECRETS', title: 'Secrets / tokens accidentally committed', severity: 'PASS' };
}

function scanConfidential(text: string): Finding {
  const m = text.match(confidentialRe);
  return m && m.length
    ? { id: 'RT-SEC-CONFIDENTIAL', title: 'Confidential / NDA language present', severity: 'FAIL', details: unique(m).slice(0, 10) }
    : { id: 'RT-SEC-CONFIDENTIAL', title: 'Confidential / NDA language present', severity: 'PASS' };
}

function scanSycophancy(text: string): Finding {
  const m = text.match(sycophancyRe);
  return m && m.length
    ? { id: 'RT-TONE-SYCOPHANCY', title: 'Sycophancy / empty praise', severity: 'WARN', details: unique(m).slice(0, 10) }
    : { id: 'RT-TONE-SYCOPHANCY', title: 'Sycophancy / empty praise', severity: 'PASS' };
}

function scanInjection(jd: string): Finding {
  if (!jd) return { id: 'RT-INPUT-INJECTION', title: 'Prompt injection patterns in job description', severity: 'PASS' };
  const m = jd.match(injectionRe);
  return m && m.length
    ? { id: 'RT-INPUT-INJECTION', title: 'Prompt injection patterns in job description', severity: 'WARN', details: unique(m).slice(0, 10) }
    : { id: 'RT-INPUT-INJECTION', title: 'Prompt injection patterns in job description', severity: 'PASS' };
}

function scanApproxNearMetrics(text: string): Finding {
  // Rough heuristic: if a sentence contains both approx word and metric token -> warn.
  const normalized = text.replace(/\s+/g, ' ').trim();
  const sentences = normalized.split(/(?:\.\s+|\?\s+|!\s+|\n+)/).map(s => s.trim()).filter(Boolean);

  const flagged: string[] = [];
  for (const s of sentences) {
    if (approxRe.test(s) && metricRe.test(s)) {
      flagged.push(s.length > 160 ? s.slice(0, 157) + '…' : s);
    }
    // reset regex state (global regex)
    approxRe.lastIndex = 0;
    metricRe.lastIndex = 0;
  }

  return flagged.length
    ? { id: 'RT-ACC-INFLATION', title: 'Approximation language near metrics (inflation risk)', severity: 'WARN', details: flagged.slice(0, 5) }
    : { id: 'RT-ACC-INFLATION', title: 'Approximation language near metrics (inflation risk)', severity: 'PASS' };
}

function scanClaimsLedger(slug: string, ledger: any | null): Finding {
  if (!ledger) {
    return {
      id: 'RT-ACC-CLAIMS',
      title: 'Claims ledger exists and is verified',
      severity: 'FAIL',
      details: [`Missing ledger: capstone/develop/evals/${slug}.claims.yaml`, 'Run: npm run eval:variant -- --slug ' + slug]
    };
  }

  const claims: any[] = ledger.claims || [];
  const unverified = claims.filter(c => c?.verified?.status !== 'verified');

  if (unverified.length) {
    return {
      id: 'RT-ACC-CLAIMS',
      title: 'Claims ledger exists and is verified',
      severity: 'FAIL',
      details: unverified.slice(0, 8).map(c => `${c.id} (${c.location})`)
    };
  }

  return { id: 'RT-ACC-CLAIMS', title: 'Claims ledger exists and is verified', severity: 'PASS' };
}

function scanPublicJobDescription(jd: string): Finding {
  if (!jd) return { id: 'RT-PRIV-JD', title: 'Job description exposure risk (public JSON)', severity: 'PASS' };
  // Your variants are shipped client-side as JSON. Long JDs are risky to publish.
  return jd.length > 1200
    ? {
        id: 'RT-PRIV-JD',
        title: 'Job description exposure risk (public JSON)',
        severity: 'WARN',
        details: [
          `jobDescription length is ${jd.length} characters.`,
          'Consider storing only a short excerpt in variant metadata (or stripping it in build).'
        ]
      }
    : { id: 'RT-PRIV-JD', title: 'Job description exposure risk (public JSON)', severity: 'PASS' };
}

function scanCrossVariantContamination(slug: string, company: string, text: string): Finding {
  const companies = listVariantCompanies();
  const others = companies.filter(c => c && c.toLowerCase() !== company.toLowerCase());

  const hits: string[] = [];
  for (const o of others) {
    const re = new RegExp(`\\b${escapeRegExp(o)}\\b`, 'i');
    if (re.test(text)) hits.push(o);
  }

  return hits.length
    ? { id: 'RT-XVAR-CONTAM', title: 'Cross-variant contamination (mentions other target companies)', severity: 'WARN', details: unique(hits) }
    : { id: 'RT-XVAR-CONTAM', title: 'Cross-variant contamination (mentions other target companies)', severity: 'PASS' };
}

function listVariantCompanies(): string[] {
  const variantsDir = join(process.cwd(), 'content', 'variants');
  if (!existsSync(variantsDir)) return [];
  const slugs = readdirSync(variantsDir)
    .filter(f => f.endsWith('.yaml'))
    .filter(f => !f.startsWith('_'))
    .map(f => f.replace(/\.yaml$/, ''));

  const companies: string[] = [];
  for (const slug of slugs) {
    try {
      const { validated } = readVariantYaml(slug);
      companies.push(validated.metadata.company);
    } catch {
      // ignore
    }
  }
  return unique(companies);
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function unique(arr: string[]): string[] {
  return [...new Set(arr)];
}

function severityScore(sev: Finding['severity']): number {
  return sev === 'FAIL' ? 2 : sev === 'WARN' ? 1 : 0;
}

function writeReport(slug: string, findings: Finding[]) {
  const dir = join(process.cwd(), 'capstone', 'develop', 'redteam');
  ensureDir(dir);
  const path = join(dir, `${slug}.redteam.md`);

  const failCount = findings.filter(f => f.severity === 'FAIL').length;
  const warnCount = findings.filter(f => f.severity === 'WARN').length;

  const lines: string[] = [];
  lines.push(`# Red Team Report`);
  lines.push('');
  lines.push(`- Variant: \`${slug}\``);
  lines.push(`- Generated: ${new Date().toISOString()}`);
  lines.push('');
  lines.push(`## Summary`);
  lines.push('');
  lines.push(`- FAIL: **${failCount}**`);
  lines.push(`- WARN: **${warnCount}**`);
  lines.push('');
  lines.push(`## Checks`);
  lines.push('');
  lines.push(`| ID | Result | Check |`);
  lines.push(`|---|---|---|`);

  for (const f of findings) {
    const icon = f.severity === 'PASS' ? '✅ PASS' : f.severity === 'WARN' ? '⚠️ WARN' : '❌ FAIL';
    lines.push(`| \`${f.id}\` | ${icon} | ${f.title} |`);
  }

  lines.push('');
  lines.push(`## Details`);
  lines.push('');
  for (const f of findings.filter(x => x.details && x.details.length)) {
    lines.push(`### ${f.id} — ${f.title}`);
    lines.push('');
    for (const d of f.details!) lines.push(`- ${d}`);
    lines.push('');
  }

  writeFileSync(path, lines.join('\n') + '\n', 'utf-8');
  return path;
}

async function redteamOne(slug: string, args: Args) {
  const { validated } = readVariantYaml(slug);

  const overrideTexts: string[] = [];
  collectStrings(validated.overrides, overrideTexts);
  const text = overrideTexts.join('\n');

  const jd = validated.metadata?.jobDescription ?? '';
  const ledger = loadClaimsLedger(slug);

  const findings: Finding[] = [];

  findings.push(scanClaimsLedger(slug, ledger));
  findings.push(scanSecrets(text));
  findings.push(scanConfidential(text));
  findings.push(scanSycophancy(text));
  findings.push(scanApproxNearMetrics(text));
  findings.push(scanInjection(jd));
  findings.push(scanPublicJobDescription(jd));
  findings.push(scanCrossVariantContamination(slug, validated.metadata.company, text));

  // Sort: FAIL first, WARN, PASS (nice report)
  findings.sort((a, b) => severityScore(b.severity) - severityScore(a.severity));

  if (!args.noWrite) writeReport(slug, findings);

  // Gate behavior
  const fails = findings.filter(f => f.severity === 'FAIL');
  const warns = findings.filter(f => f.severity === 'WARN');
  const shouldFail = fails.length > 0 || (args.strict && warns.length > 0);

  if (args.check) {
    if (shouldFail) {
      console.error(`${colors.red}${colors.bold}✗ redteam check failed for ${slug}${colors.reset}`);
      for (const f of fails) console.error(`  ${colors.red}•${colors.reset} ${f.id}: ${f.title}`);
      if (args.strict) for (const w of warns) console.error(`  ${colors.yellow}•${colors.reset} ${w.id}: ${w.title}`);
      process.exit(1);
    }
    console.log(`${colors.green}✓${colors.reset} ${slug} (redteam check passed)`);
    return;
  }

  // Non-check mode: print quick summary
  const failCount = fails.length;
  const warnCount = warns.length;
  console.log(`${colors.green}✓${colors.reset} ${slug}: ${failCount} FAIL • ${warnCount} WARN`);
  console.log(`${colors.gray}  Report:${colors.reset} capstone/develop/redteam/${slug}.redteam.md`);
}

async function main() {
  const args = parseArgs();
  const slugs = args.all ? listVariantSlugs() : [args.slug!];

  if (slugs.length === 0) {
    console.log(`${colors.gray}No variants found. Nothing to red-team.${colors.reset}`);
    process.exit(0);
  }

  console.log(`${colors.bold}${colors.blue}${args.check ? 'Checking' : 'Red teaming'} variants${colors.reset}`);
  console.log(`${colors.gray}${slugs.length} variant(s)${colors.reset}\n`);

  for (const slug of slugs) {
    await redteamOne(slug, args);
  }
}

main().catch((err) => {
  console.error(`${colors.red}${colors.bold}Fatal:${colors.reset} ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
});
