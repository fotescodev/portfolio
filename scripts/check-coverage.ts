#!/usr/bin/env tsx
/**
 * Bullet Coverage Check CLI
 *
 * Analyzes experience highlights against 7 PM competency bundles.
 * Deterministic keyword matching - no AI required.
 *
 * Usage:
 *   npm run check:coverage              # Analyze and output report
 *   npm run check:coverage -- --json    # JSON output for scripts
 *   npm run check:coverage -- --save    # Save to capstone/develop/coverage.yaml
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import YAML from 'yaml';

// ═══════════════════════════════════════════════════════════════
// 7 PM COMPETENCY BUNDLES
// ═══════════════════════════════════════════════════════════════

const BUNDLES: Record<string, { name: string; keywords: string[] }> = {
  productDesign: {
    name: 'Product Design & Development',
    keywords: [
      'shipped', 'launched', 'built', 'designed', 'UX', 'user research',
      'prototyped', 'improved', 'ideation', 'MVP', 'feature', 'product'
    ]
  },
  leadershipExecution: {
    name: 'Leadership & Execution',
    keywords: [
      'led', 'managed', 'coordinated', 'E2E', 'cross-functional',
      'stakeholders', 'team of', 'owned', 'drove', 'spearheaded'
    ]
  },
  strategyPlanning: {
    name: 'Strategy & Planning',
    keywords: [
      'strategy', 'vision', 'roadmap', 'prioritized', 'market analysis',
      'decision', 'goal setting', 'planning', 'pivot', 'direction'
    ]
  },
  businessMarketing: {
    name: 'Business & Marketing',
    keywords: [
      'revenue', 'ARR', 'GTM', 'partnerships', 'growth', 'B2B', 'B2C',
      'pricing', 'negotiated', 'sales', 'customers', 'clients', 'monetization'
    ]
  },
  projectManagement: {
    name: 'Project Management',
    keywords: [
      'delivered', 'timeline', 'Agile', 'risk', 'on-time', 'milestone',
      'sprint', 'scrum', 'deadline', 'weeks', 'months', 'faster'
    ]
  },
  technicalAnalytical: {
    name: 'Technical & Analytical',
    keywords: [
      'architecture', 'API', 'SDK', 'data', 'metrics', 'experimentation',
      'trade-offs', 'system design', 'infrastructure', 'technical', 'integration'
    ]
  },
  communication: {
    name: 'Communication',
    keywords: [
      'presented', 'documented', 'collaborated', 'aligned', 'storytelling',
      'stakeholder', 'communication', 'consensus', 'evangelized'
    ]
  }
};

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

interface ExperienceJob {
  company: string;
  role: string;
  period: string;
  highlights: string[];
}

interface BulletMatch {
  bullet: string;
  company: string;
  matchedKeywords: string[];
}

interface BundleCoverage {
  name: string;
  count: number;
  bullets: BulletMatch[];
}

interface CoverageReport {
  generatedAt: string;
  totalBullets: number;
  bundles: Record<string, BundleCoverage>;
  gaps: string[];
  overweight: string[];
  uncategorized: string[];
}

// ═══════════════════════════════════════════════════════════════
// CORE LOGIC
// ═══════════════════════════════════════════════════════════════

function loadExperience(): ExperienceJob[] {
  const expPath = join(process.cwd(), 'content', 'experience', 'index.yaml');
  if (!existsSync(expPath)) {
    throw new Error(`Experience file not found: ${expPath}`);
  }
  const raw = readFileSync(expPath, 'utf-8');
  const parsed = YAML.parse(raw);
  return parsed.jobs || [];
}

function matchBundleKeywords(bullet: string, keywords: string[]): string[] {
  const lowerBullet = bullet.toLowerCase();
  return keywords.filter(kw => lowerBullet.includes(kw.toLowerCase()));
}

function categorizeBullet(bullet: string): { bundle: string | null; keywords: string[] } {
  let bestBundle: string | null = null;
  let bestKeywords: string[] = [];

  for (const [bundleId, bundle] of Object.entries(BUNDLES)) {
    const matched = matchBundleKeywords(bullet, bundle.keywords);
    if (matched.length > bestKeywords.length) {
      bestBundle = bundleId;
      bestKeywords = matched;
    }
  }

  return { bundle: bestBundle, keywords: bestKeywords };
}

function analyzeCoverage(jobs: ExperienceJob[]): CoverageReport {
  const bundles: Record<string, BundleCoverage> = {};

  // Initialize bundles
  for (const [bundleId, bundle] of Object.entries(BUNDLES)) {
    bundles[bundleId] = {
      name: bundle.name,
      count: 0,
      bullets: []
    };
  }

  const uncategorized: string[] = [];
  let totalBullets = 0;

  // Categorize each bullet
  for (const job of jobs) {
    for (const bullet of job.highlights || []) {
      totalBullets++;
      const { bundle, keywords } = categorizeBullet(bullet);

      if (bundle && keywords.length > 0) {
        bundles[bundle].count++;
        bundles[bundle].bullets.push({
          bullet: bullet.length > 80 ? bullet.slice(0, 77) + '...' : bullet,
          company: job.company,
          matchedKeywords: keywords
        });
      } else {
        uncategorized.push(`[${job.company}] ${bullet.slice(0, 60)}...`);
      }
    }
  }

  // Identify gaps and overweight
  const gaps: string[] = [];
  const overweight: string[] = [];

  for (const [bundleId, coverage] of Object.entries(bundles)) {
    if (coverage.count < 2) {
      gaps.push(bundleId);
    }
    if (coverage.count >= 5) {
      overweight.push(bundleId);
    }
  }

  return {
    generatedAt: new Date().toISOString(),
    totalBullets,
    bundles,
    gaps,
    overweight,
    uncategorized
  };
}

// ═══════════════════════════════════════════════════════════════
// OUTPUT FORMATTING
// ═══════════════════════════════════════════════════════════════

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  gray: '\x1b[90m',
  bold: '\x1b[1m'
};

function printReport(report: CoverageReport): void {
  console.log();
  console.log(`${colors.bold}═══════════════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.bold}  BULLET COVERAGE REPORT${colors.reset}`);
  console.log(`${colors.bold}═══════════════════════════════════════════════════════════════${colors.reset}`);
  console.log();
  console.log(`${colors.gray}Total bullets analyzed: ${report.totalBullets}${colors.reset}`);
  console.log();

  // Coverage by bundle
  console.log(`${colors.bold}Coverage by Competency Bundle:${colors.reset}`);
  console.log();

  for (const [bundleId, coverage] of Object.entries(report.bundles)) {
    const isGap = report.gaps.includes(bundleId);
    const isOverweight = report.overweight.includes(bundleId);

    let indicator = '  ';
    let color = colors.reset;

    if (isGap) {
      indicator = '⚠️';
      color = colors.yellow;
    } else if (isOverweight) {
      indicator = '📊';
      color = colors.blue;
    } else {
      indicator = '✅';
      color = colors.green;
    }

    console.log(`${indicator} ${color}${coverage.name}${colors.reset}: ${coverage.count} bullets`);

    // Show top 2 examples
    if (coverage.bullets.length > 0) {
      const examples = coverage.bullets.slice(0, 2);
      for (const ex of examples) {
        console.log(`   ${colors.gray}└─ [${ex.company}] ${ex.bullet.slice(0, 50)}...${colors.reset}`);
      }
    }
  }

  console.log();

  // Gaps
  if (report.gaps.length > 0) {
    console.log(`${colors.yellow}${colors.bold}Gaps (< 2 bullets):${colors.reset}`);
    for (const gap of report.gaps) {
      console.log(`  ${colors.yellow}• ${BUNDLES[gap].name}${colors.reset}`);
    }
    console.log();
  }

  // Overweight
  if (report.overweight.length > 0) {
    console.log(`${colors.blue}${colors.bold}Overweight (5+ bullets):${colors.reset}`);
    for (const ow of report.overweight) {
      console.log(`  ${colors.blue}• ${BUNDLES[ow].name}${colors.reset}`);
    }
    console.log();
  }

  // Uncategorized
  if (report.uncategorized.length > 0) {
    console.log(`${colors.gray}Uncategorized bullets: ${report.uncategorized.length}${colors.reset}`);
    console.log();
  }

  // Summary
  const gapCount = report.gaps.length;
  if (gapCount === 0) {
    console.log(`${colors.green}✅ Well-rounded coverage across all bundles${colors.reset}`);
  } else if (gapCount <= 2) {
    console.log(`${colors.yellow}⚠️  ${gapCount} gap(s) — consider emphasizing in bio/tagline${colors.reset}`);
  } else {
    console.log(`${colors.red}❌ ${gapCount} gaps — resume may appear unbalanced${colors.reset}`);
  }

  console.log();
}

function saveReport(report: CoverageReport): void {
  const outDir = join(process.cwd(), 'capstone', 'develop');
  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true });
  }

  const outPath = join(outDir, 'coverage.yaml');

  // Simplified output for YAML
  const yamlOutput = {
    generatedAt: report.generatedAt,
    totalBullets: report.totalBullets,
    summary: {
      gaps: report.gaps.map(g => BUNDLES[g].name),
      overweight: report.overweight.map(o => BUNDLES[o].name),
      uncategorizedCount: report.uncategorized.length
    },
    bundles: Object.fromEntries(
      Object.entries(report.bundles).map(([id, cov]) => [
        id,
        {
          name: cov.name,
          count: cov.count,
          examples: cov.bullets.slice(0, 3).map(b => b.bullet)
        }
      ])
    )
  };

  writeFileSync(outPath, YAML.stringify(yamlOutput), 'utf-8');
  console.log(`${colors.green}✅ Saved to ${outPath}${colors.reset}`);
}

// ═══════════════════════════════════════════════════════════════
// CLI
// ═══════════════════════════════════════════════════════════════

function parseArgs(): { json: boolean; save: boolean } {
  const args = process.argv.slice(2);
  return {
    json: args.includes('--json'),
    save: args.includes('--save')
  };
}

async function main() {
  const args = parseArgs();

  try {
    const jobs = loadExperience();
    const report = analyzeCoverage(jobs);

    if (args.json) {
      console.log(JSON.stringify(report, null, 2));
    } else {
      printReport(report);

      if (args.save) {
        saveReport(report);
      }
    }
  } catch (err) {
    console.error(`${colors.red}Error: ${err instanceof Error ? err.message : String(err)}${colors.reset}`);
    process.exit(1);
  }
}

main();
