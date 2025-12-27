#!/usr/bin/env tsx
/**
 * Search Evidence CLI
 *
 * Searches the knowledge base (achievements, stories) for evidence
 * matching JD requirements. Works with analyze-jd.ts output.
 *
 * Deterministic search - no AI required.
 *
 * Usage:
 *   npm run search:evidence -- --jd-analysis capstone/develop/jd-analysis/stripe.yaml
 *   npm run search:evidence -- --terms "crypto,staking,infrastructure"
 *   npm run search:evidence -- --jd-analysis stripe.yaml --threshold 0.5
 *   npm run search:evidence -- --jd-analysis stripe.yaml --json
 */

import { readFileSync, readdirSync, existsSync, writeFileSync, mkdirSync } from 'fs';
import { join, basename } from 'path';
import YAML from 'yaml';
import type { JDAnalysis } from './analyze-jd.js';

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

export interface Achievement {
  id: string;
  headline: string;
  metric?: {
    value: string;
    unit: string;
    context?: string;
  };
  situation?: string;
  task?: string;
  action?: string;
  result?: string;
  skills: string[];
  themes: string[];
  companies: string[];
  years: number[];
  good_for: string[];
  evidence?: {
    case_study?: string;
    testimonial?: string;
    metrics_source?: string;
  };
}

export interface Story {
  id: string;
  title?: string;
  headline?: string;
  achievement?: string;
  themes?: string[];
  skills?: string[];
}

export interface EvidenceMatch {
  source: 'achievement' | 'story';
  id: string;
  headline: string;
  relevanceScore: number;
  matchedTerms: string[];
  matchedSkills: string[];
  matchedThemes: string[];
  snippet: string;
}

export interface AlignmentReport {
  metadata: {
    generatedAt: string;
    sourceAnalysis?: string;
    searchTerms: string[];
  };
  summary: {
    totalMatches: number;
    strongMatches: number;  // score >= 0.7
    moderateMatches: number; // score >= 0.4
    weakMatches: number;    // score < 0.4
    alignmentScore: number; // 0-1
    recommendation: 'PROCEED' | 'REVIEW' | 'SKIP';
  };
  matches: EvidenceMatch[];
  gaps: string[];  // Search terms with no matches
}

// ═══════════════════════════════════════════════════════════════
// KNOWLEDGE BASE LOADING
// ═══════════════════════════════════════════════════════════════

const CONTENT_ROOT = join(process.cwd(), 'content', 'knowledge');

export function loadAchievements(): Achievement[] {
  const achievementsDir = join(CONTENT_ROOT, 'achievements');
  if (!existsSync(achievementsDir)) return [];

  const files = readdirSync(achievementsDir).filter(f =>
    f.endsWith('.yaml') && !f.startsWith('_')
  );

  return files.map(file => {
    const content = readFileSync(join(achievementsDir, file), 'utf-8');
    return YAML.parse(content) as Achievement;
  }).filter(a => a && a.id);
}

export function loadStories(): Story[] {
  const storiesDir = join(CONTENT_ROOT, 'stories');
  if (!existsSync(storiesDir)) return [];

  const files = readdirSync(storiesDir).filter(f =>
    f.endsWith('.yaml') && !f.startsWith('_')
  );

  return files.map(file => {
    const content = readFileSync(join(storiesDir, file), 'utf-8');
    return YAML.parse(content) as Story;
  }).filter(s => s && s.id);
}

// ═══════════════════════════════════════════════════════════════
// SEARCH LOGIC
// ═══════════════════════════════════════════════════════════════

function normalizeText(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

function getSearchableText(achievement: Achievement): string {
  return normalizeText([
    achievement.headline,
    achievement.situation,
    achievement.task,
    achievement.action,
    achievement.result,
    achievement.skills?.join(' '),
    achievement.themes?.join(' '),
    achievement.good_for?.join(' '),
    achievement.metric?.value,
    achievement.metric?.context
  ].filter(Boolean).join(' '));
}

function getStorySearchableText(story: Story): string {
  return normalizeText([
    story.title,
    story.headline,
    story.themes?.join(' '),
    story.skills?.join(' ')
  ].filter(Boolean).join(' '));
}

export function searchAchievement(
  achievement: Achievement,
  searchTerms: string[]
): EvidenceMatch | null {
  const searchableText = getSearchableText(achievement);
  const matchedTerms: string[] = [];
  const matchedSkills: string[] = [];
  const matchedThemes: string[] = [];

  // Check each search term
  for (const term of searchTerms) {
    const normalizedTerm = normalizeText(term);
    if (searchableText.includes(normalizedTerm)) {
      matchedTerms.push(term);
    }
  }

  // Check skills
  if (achievement.skills) {
    for (const skill of achievement.skills) {
      const normalizedSkill = normalizeText(skill);
      for (const term of searchTerms) {
        if (normalizedSkill.includes(normalizeText(term)) ||
            normalizeText(term).includes(normalizedSkill)) {
          matchedSkills.push(skill);
          break;
        }
      }
    }
  }

  // Check themes
  if (achievement.themes) {
    for (const theme of achievement.themes) {
      const normalizedTheme = normalizeText(theme);
      for (const term of searchTerms) {
        if (normalizedTheme.includes(normalizeText(term)) ||
            normalizeText(term).includes(normalizedTheme)) {
          matchedThemes.push(theme);
          break;
        }
      }
    }
  }

  // Calculate relevance score
  const totalMatches = matchedTerms.length + matchedSkills.length + matchedThemes.length;
  if (totalMatches === 0) return null;

  const relevanceScore = Math.min(1, totalMatches / Math.max(searchTerms.length, 1));

  // Generate snippet (first 150 chars of result or action)
  const snippet = (achievement.result || achievement.action || achievement.headline)
    .slice(0, 150)
    .trim() + '...';

  return {
    source: 'achievement',
    id: achievement.id,
    headline: achievement.headline,
    relevanceScore,
    matchedTerms,
    matchedSkills,
    matchedThemes,
    snippet
  };
}

export function searchStory(
  story: Story,
  searchTerms: string[]
): EvidenceMatch | null {
  const searchableText = getStorySearchableText(story);
  const matchedTerms: string[] = [];
  const matchedSkills: string[] = [];
  const matchedThemes: string[] = [];

  // Check each search term
  for (const term of searchTerms) {
    const normalizedTerm = normalizeText(term);
    if (searchableText.includes(normalizedTerm)) {
      matchedTerms.push(term);
    }
  }

  // Check skills
  if (story.skills) {
    for (const skill of story.skills) {
      const normalizedSkill = normalizeText(skill);
      for (const term of searchTerms) {
        if (normalizedSkill.includes(normalizeText(term))) {
          matchedSkills.push(skill);
          break;
        }
      }
    }
  }

  // Check themes
  if (story.themes) {
    for (const theme of story.themes) {
      const normalizedTheme = normalizeText(theme);
      for (const term of searchTerms) {
        if (normalizedTheme.includes(normalizeText(term))) {
          matchedThemes.push(theme);
          break;
        }
      }
    }
  }

  const totalMatches = matchedTerms.length + matchedSkills.length + matchedThemes.length;
  if (totalMatches === 0) return null;

  const relevanceScore = Math.min(1, totalMatches / Math.max(searchTerms.length, 1));

  return {
    source: 'story',
    id: story.id,
    headline: story.title || story.headline || story.id,
    relevanceScore,
    matchedTerms,
    matchedSkills,
    matchedThemes,
    snippet: story.headline || story.title || story.id
  };
}

export function searchKnowledgeBase(searchTerms: string[]): EvidenceMatch[] {
  const achievements = loadAchievements();
  const stories = loadStories();
  const matches: EvidenceMatch[] = [];

  // Search achievements
  for (const achievement of achievements) {
    const match = searchAchievement(achievement, searchTerms);
    if (match) {
      matches.push(match);
    }
  }

  // Search stories
  for (const story of stories) {
    const match = searchStory(story, searchTerms);
    if (match) {
      matches.push(match);
    }
  }

  // Sort by relevance score descending
  return matches.sort((a, b) => b.relevanceScore - a.relevanceScore);
}

// ═══════════════════════════════════════════════════════════════
// ALIGNMENT REPORT GENERATION
// ═══════════════════════════════════════════════════════════════

export function generateAlignmentReport(
  searchTerms: string[],
  threshold: number = 0.5,
  sourceAnalysis?: string
): AlignmentReport {
  const matches = searchKnowledgeBase(searchTerms);

  // Count by strength
  const strongMatches = matches.filter(m => m.relevanceScore >= 0.7).length;
  const moderateMatches = matches.filter(m => m.relevanceScore >= 0.4 && m.relevanceScore < 0.7).length;
  const weakMatches = matches.filter(m => m.relevanceScore < 0.4).length;

  // Find gaps (terms with no matches)
  const matchedTerms = new Set(matches.flatMap(m => m.matchedTerms));
  const gaps = searchTerms.filter(term => !matchedTerms.has(term));

  // Calculate overall alignment score
  // Weight: strong = 1.0, moderate = 0.5, weak = 0.2
  const weightedScore = (strongMatches * 1.0 + moderateMatches * 0.5 + weakMatches * 0.2);
  const maxPossibleScore = searchTerms.length;
  const alignmentScore = maxPossibleScore > 0
    ? Math.min(1, weightedScore / maxPossibleScore)
    : 0;

  // Determine recommendation
  let recommendation: 'PROCEED' | 'REVIEW' | 'SKIP';
  if (alignmentScore >= threshold && strongMatches >= 2) {
    recommendation = 'PROCEED';
  } else if (alignmentScore >= threshold * 0.6 || strongMatches >= 1) {
    recommendation = 'REVIEW';
  } else {
    recommendation = 'SKIP';
  }

  return {
    metadata: {
      generatedAt: new Date().toISOString(),
      sourceAnalysis,
      searchTerms
    },
    summary: {
      totalMatches: matches.length,
      strongMatches,
      moderateMatches,
      weakMatches,
      alignmentScore: Math.round(alignmentScore * 100) / 100,
      recommendation
    },
    matches,
    gaps
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
  bold: '\x1b[1m',
  cyan: '\x1b[36m'
};

function printReport(report: AlignmentReport): void {
  console.log();
  console.log(`${colors.bold}═══════════════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.bold}  EVIDENCE ALIGNMENT REPORT${colors.reset}`);
  console.log(`${colors.bold}═══════════════════════════════════════════════════════════════${colors.reset}`);
  console.log();

  // Summary
  const recColor = report.summary.recommendation === 'PROCEED' ? colors.green
    : report.summary.recommendation === 'REVIEW' ? colors.yellow
    : colors.red;

  console.log(`${colors.cyan}Alignment Score:${colors.reset} ${(report.summary.alignmentScore * 100).toFixed(0)}%`);
  console.log(`${colors.cyan}Recommendation:${colors.reset} ${recColor}${report.summary.recommendation}${colors.reset}`);
  console.log();
  console.log(`${colors.cyan}Matches:${colors.reset} ${report.summary.totalMatches} total`);
  console.log(`  ${colors.green}Strong (≥70%):${colors.reset} ${report.summary.strongMatches}`);
  console.log(`  ${colors.yellow}Moderate (40-70%):${colors.reset} ${report.summary.moderateMatches}`);
  console.log(`  ${colors.gray}Weak (<40%):${colors.reset} ${report.summary.weakMatches}`);
  console.log();

  // Top matches
  if (report.matches.length > 0) {
    console.log(`${colors.bold}Top Evidence Matches:${colors.reset}`);
    const topMatches = report.matches.slice(0, 5);
    for (const match of topMatches) {
      const scoreColor = match.relevanceScore >= 0.7 ? colors.green
        : match.relevanceScore >= 0.4 ? colors.yellow
        : colors.gray;
      console.log();
      console.log(`  ${scoreColor}[${(match.relevanceScore * 100).toFixed(0)}%]${colors.reset} ${match.headline.slice(0, 60)}...`);
      console.log(`       ${colors.gray}Source: ${match.source} | ID: ${match.id}${colors.reset}`);
      console.log(`       ${colors.blue}Matched: ${match.matchedTerms.slice(0, 5).join(', ')}${colors.reset}`);
      if (match.matchedSkills.length > 0) {
        console.log(`       ${colors.cyan}Skills: ${match.matchedSkills.join(', ')}${colors.reset}`);
      }
    }
    console.log();
  }

  // Gaps
  if (report.gaps.length > 0) {
    console.log(`${colors.bold}Coverage Gaps:${colors.reset}`);
    console.log(`  ${colors.red}No evidence found for: ${report.gaps.join(', ')}${colors.reset}`);
    console.log();
  }

  // Search terms used
  console.log(`${colors.gray}Search terms: ${report.metadata.searchTerms.join(', ')}${colors.reset}`);
  console.log();
}

function saveReport(report: AlignmentReport, slug: string): void {
  const outDir = join(process.cwd(), 'capstone', 'develop', 'alignment');
  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true });
  }

  const outPath = join(outDir, `${slug}.yaml`);
  writeFileSync(outPath, YAML.stringify(report), 'utf-8');
  console.log(`${colors.green}✅ Saved to ${outPath}${colors.reset}`);
}

// ═══════════════════════════════════════════════════════════════
// CLI
// ═══════════════════════════════════════════════════════════════

interface Args {
  jdAnalysis?: string;
  terms?: string;
  threshold: number;
  json: boolean;
  save: boolean;
}

function parseArgs(): Args {
  const args = process.argv.slice(2);
  const result: Args = { threshold: 0.5, json: false, save: false };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--jd-analysis' && args[i + 1]) {
      result.jdAnalysis = args[++i];
    } else if (args[i] === '--terms' && args[i + 1]) {
      result.terms = args[++i];
    } else if (args[i] === '--threshold' && args[i + 1]) {
      result.threshold = parseFloat(args[++i]);
    } else if (args[i] === '--json') {
      result.json = true;
    } else if (args[i] === '--save') {
      result.save = true;
    }
  }

  return result;
}

async function main() {
  const args = parseArgs();

  if (!args.jdAnalysis && !args.terms) {
    console.error(`${colors.red}Error: Must provide --jd-analysis or --terms${colors.reset}`);
    console.log(`
Usage:
  npm run search:evidence -- --jd-analysis capstone/develop/jd-analysis/stripe.yaml
  npm run search:evidence -- --terms "crypto,staking,infrastructure"
  npm run search:evidence -- --jd-analysis stripe.yaml --threshold 0.5
  npm run search:evidence -- --jd-analysis stripe.yaml --save
  npm run search:evidence -- --jd-analysis stripe.yaml --json
`);
    process.exit(1);
  }

  let searchTerms: string[];
  let sourceAnalysis: string | undefined;
  let slug: string;

  if (args.jdAnalysis) {
    if (!existsSync(args.jdAnalysis)) {
      console.error(`${colors.red}Error: File not found: ${args.jdAnalysis}${colors.reset}`);
      process.exit(1);
    }

    const content = readFileSync(args.jdAnalysis, 'utf-8');
    const analysis = YAML.parse(content) as JDAnalysis;

    searchTerms = analysis.searchTerms || [];

    // Also add domain keywords
    if (analysis.domainKeywords) {
      searchTerms = [...new Set([...searchTerms, ...analysis.domainKeywords])];
    }

    // Add skills from must-haves
    analysis.mustHaves?.forEach(mh => {
      if (mh.matchedPattern) {
        const words = mh.matchedPattern.toLowerCase().split(/\s+/).filter(w => w.length > 3);
        searchTerms = [...new Set([...searchTerms, ...words])];
      }
    });

    sourceAnalysis = args.jdAnalysis;
    slug = analysis.metadata?.slug || basename(args.jdAnalysis, '.yaml');
  } else {
    searchTerms = args.terms!.split(',').map(t => t.trim()).filter(Boolean);
    slug = searchTerms.slice(0, 3).join('-').replace(/\s+/g, '-').toLowerCase();
  }

  if (searchTerms.length === 0) {
    console.error(`${colors.red}Error: No search terms found${colors.reset}`);
    process.exit(1);
  }

  const report = generateAlignmentReport(searchTerms, args.threshold, sourceAnalysis);

  if (args.json) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    printReport(report);
    if (args.save) {
      saveReport(report, slug);
    }
  }
}

// Only run main when executed directly, not when imported as module
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  main().catch(err => {
    console.error(`${colors.red}Error: ${err instanceof Error ? err.message : String(err)}${colors.reset}`);
    process.exit(1);
  });
}
