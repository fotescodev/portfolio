#!/usr/bin/env tsx
/**
 * JD Analysis CLI
 *
 * Pre-processes job descriptions to extract:
 * - Company name and role
 * - Must-have requirements (filtering out generic phrases)
 * - Domain keywords for knowledge base search
 *
 * Uses Claude API as fallback when deterministic methods fail.
 *
 * Usage:
 *   npm run analyze:jd -- --file source-data/jd-stripe.txt
 *   npm run analyze:jd -- --file source-data/jd-stripe.txt --save
 *   npm run analyze:jd -- --file source-data/jd-stripe.txt --json
 *   npm run analyze:jd -- --text "Job description text..."
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, basename, resolve } from 'path';

// Load .env.local if API key not already set
function loadEnvLocal(): void {
  if (process.env.ANTHROPIC_API_KEY) return;

  const envPath = resolve(import.meta.dirname, '..', '.env.local');
  if (existsSync(envPath)) {
    const content = readFileSync(envPath, 'utf-8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          process.env[key] = valueParts.join('=');
        }
      }
    }
  }
}

loadEnvLocal();
import { extractCompanyAndRoleAsync } from './lib/job-parsing';
import YAML from 'yaml';

// ═══════════════════════════════════════════════════════════════
// GENERIC PHRASES TO FILTER (these appear in almost every JD)
// ═══════════════════════════════════════════════════════════════

export const GENERIC_PHRASES: string[] = [
  // Soft skills everyone claims
  'team player',
  'excellent communication',
  'strong communication',
  'great communicator',
  'collaborative',
  'self-starter',
  'self-motivated',
  'detail-oriented',
  'attention to detail',
  'problem solver',
  'critical thinking',
  'analytical skills',

  // Generic personality traits
  'passionate about',
  'passionate',
  'enthusiastic',
  'fast-paced environment',
  'fast-paced',
  'dynamic environment',
  'thrive in ambiguity',
  'comfortable with ambiguity',

  // Standard PM boilerplate
  'work with cross-functional teams',
  'cross-functional collaboration',
  'stakeholder management',
  'influence without authority',
  'drive alignment',
  'build consensus',
  'manage multiple priorities',
  'prioritization skills',

  // Generic requirements
  'bachelor\'s degree',
  'bs/ba',
  'equivalent experience',
  'strong written',
  'verbal communication',
  'presentation skills',

  // Meaningless qualifiers
  'proven track record',
  'track record of success',
  'results-oriented',
  'results-driven',
  'data-driven',
  'customer-focused',
  'user-centric'
];

// ═══════════════════════════════════════════════════════════════
// SPECIFIC SIGNAL PATTERNS (these indicate real requirements)
// ═══════════════════════════════════════════════════════════════

export const SIGNAL_PATTERNS: { category: string; patterns: RegExp[] }[] = [
  {
    category: 'years_experience',
    patterns: [
      /(\d+)\+?\s*years?\s*(of\s+)?(product|pm|engineering|technical|software)/i,
      /(\d+)\+?\s*years?\s*(of\s+)?experience/i
    ]
  },
  {
    category: 'technologies',
    patterns: [
      /experience\s+with\s+([A-Z][a-zA-Z0-9]+(?:\s*,\s*[A-Z][a-zA-Z0-9]+)*)/i,
      /proficiency\s+in\s+([A-Z][a-zA-Z0-9]+)/i,
      /knowledge\s+of\s+([A-Z][a-zA-Z0-9]+)/i,
      /\b(kubernetes|docker|aws|gcp|azure|terraform|python|rust|go|typescript|react|node\.?js)\b/gi
    ]
  },
  {
    category: 'domain_expertise',
    patterns: [
      /(fintech|healthcare|crypto|blockchain|payments|e-commerce|saas|b2b|b2c|enterprise|consumer)\s*(background|experience|expertise)/i,
      /experience\s+(in|with)\s+(fintech|healthcare|crypto|blockchain|payments)/i,
      /\b(api|sdk|platform|infrastructure|developer\s*tools?|devex|dx)\s*(experience|background)/i
    ]
  },
  {
    category: 'scale_indicators',
    patterns: [
      /(\d+)([KMB])\+?\s*(users|customers|dau|mau|transactions)/i,
      /products?\s+with\s+(\d+)([KMB])\+?\s*(users|customers)/i,
      /(enterprise|startup|scale-up|growth\s*stage)/i
    ]
  },
  {
    category: 'specific_achievements',
    patterns: [
      /(0[→-]1|zero\s*to\s*one|built\s+from\s+scratch)/i,
      /(shipped|launched)\s+(multiple|several|\d+)\s+(products?|features?)/i,
      /platform\s*(migration|modernization)/i,
      /(api|sdk)\s*design/i
    ]
  }
];

// ═══════════════════════════════════════════════════════════════
// DOMAIN KEYWORDS (for knowledge base search)
// ═══════════════════════════════════════════════════════════════

export const DOMAIN_KEYWORDS: Record<string, string[]> = {
  crypto: ['crypto', 'blockchain', 'web3', 'defi', 'nft', 'ethereum', 'bitcoin', 'staking', 'custody', 'wallet'],
  fintech: ['fintech', 'payments', 'banking', 'financial', 'transactions', 'settlement', 'compliance'],
  developer_tools: ['api', 'sdk', 'developer', 'devex', 'dx', 'documentation', 'cli', 'tooling'],
  infrastructure: ['infrastructure', 'platform', 'scalability', 'reliability', 'architecture', 'system'],
  enterprise: ['enterprise', 'b2b', 'saas', 'sales', 'security', 'compliance', 'soc2'],
  consumer: ['consumer', 'b2c', 'mobile', 'app', 'ux', 'engagement', 'retention'],
  ai_ml: ['ai', 'ml', 'machine learning', 'artificial intelligence', 'llm', 'model', 'data science']
};

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

export interface ExtractedRequirement {
  text: string;
  category: string;
  specificity: 'high' | 'medium' | 'low';
  matchedPattern?: string;
}

export interface JDAnalysis {
  metadata: {
    analyzedAt: string;
    sourceFile?: string;
    slug: string;
  };
  extracted: {
    company: string | null;
    role: string | null;
    yearsRequired: number | null;
  };
  mustHaves: ExtractedRequirement[];
  niceToHaves: string[];
  ignoredGeneric: string[];
  domainKeywords: string[];
  searchTerms: string[];
}

// ═══════════════════════════════════════════════════════════════
// EXTRACTION LOGIC
// ═══════════════════════════════════════════════════════════════

function extractYearsRequired(text: string): number | null {
  // Normalize text: remove markdown formatting, arrows, and normalize whitespace
  const normalizedText = text
    .replace(/\*\*/g, '')  // Remove bold markdown
    .replace(/[*_`]/g, '') // Remove other markdown
    .replace(/[→\-–—]/g, ' ') // Normalize dashes and arrows
    .replace(/\s+/g, ' ');

  const patterns = [
    /(\d+)\+?\s*years?\s*(of\s+)?(product|pm|experience)/i,
    /minimum\s+(\d+)\s*years?/i,
    /at\s+least\s+(\d+)\s*years?/i
  ];

  for (const pattern of patterns) {
    const match = normalizedText.match(pattern);
    if (match) {
      return parseInt(match[1], 10);
    }
  }
  return null;
}

function isGenericPhrase(text: string): boolean {
  const lower = text.toLowerCase();
  return GENERIC_PHRASES.some(phrase => lower.includes(phrase.toLowerCase()));
}

function extractRequirements(text: string): { mustHaves: ExtractedRequirement[]; niceToHaves: string[]; ignoredGeneric: string[] } {
  const mustHaves: ExtractedRequirement[] = [];
  const niceToHaves: string[] = [];
  const ignoredGeneric: string[] = [];
  const seen = new Set<string>();

  // Split into lines/bullets
  const lines = text.split(/[\n•\-\*]/).map(l => l.trim()).filter(l => l.length > 10);

  for (const line of lines) {
    const lower = line.toLowerCase();

    // Skip if generic
    if (isGenericPhrase(line)) {
      if (!seen.has(lower.slice(0, 50))) {
        ignoredGeneric.push(line.slice(0, 100));
        seen.add(lower.slice(0, 50));
      }
      continue;
    }

    // Check against signal patterns
    for (const { category, patterns } of SIGNAL_PATTERNS) {
      for (const pattern of patterns) {
        const match = line.match(pattern);
        if (match && !seen.has(lower.slice(0, 50))) {
          const specificity: 'high' | 'medium' | 'low' =
            category === 'technologies' || category === 'domain_expertise' ? 'high' :
            category === 'years_experience' || category === 'specific_achievements' ? 'medium' : 'low';

          mustHaves.push({
            text: line.slice(0, 150),
            category,
            specificity,
            matchedPattern: match[0]
          });
          seen.add(lower.slice(0, 50));
          break;
        }
      }
    }
  }

  // Extract nice-to-haves (lines with "preferred", "bonus", "nice to have")
  const niceToHavePatterns = /\b(preferred|bonus|nice\s+to\s+have|ideally|plus)\b/i;
  for (const line of lines) {
    if (niceToHavePatterns.test(line) && !seen.has(line.toLowerCase().slice(0, 50))) {
      niceToHaves.push(line.slice(0, 100));
      seen.add(line.toLowerCase().slice(0, 50));
    }
  }

  return { mustHaves, niceToHaves, ignoredGeneric };
}

function extractDomainKeywords(text: string): string[] {
  const found = new Set<string>();
  const lower = text.toLowerCase();

  for (const [domain, keywords] of Object.entries(DOMAIN_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lower.includes(keyword.toLowerCase())) {
        found.add(domain);
        break;
      }
    }
  }

  return [...found];
}

function generateSearchTerms(analysis: Partial<JDAnalysis>): string[] {
  const terms = new Set<string>();

  // Add domain keywords
  analysis.domainKeywords?.forEach(kw => terms.add(kw));

  // Add specific technologies/patterns from must-haves
  analysis.mustHaves?.forEach(req => {
    if (req.matchedPattern) {
      // Extract meaningful terms
      const words = req.matchedPattern.toLowerCase().split(/\s+/);
      words.forEach(w => {
        if (w.length > 3 && !['with', 'experience', 'years', 'the'].includes(w)) {
          terms.add(w);
        }
      });
    }
  });

  return [...terms].slice(0, 15);
}

export interface AnalyzeOptions {
  filename?: string;
  rawHtml?: string;
  apiKey?: string;
}

export async function analyzeJD(text: string, options: AnalyzeOptions = {}): Promise<JDAnalysis> {
  const { filename, rawHtml, apiKey } = options;

  // Use waterfall extraction from shared library
  const extractionResult = await extractCompanyAndRoleAsync(text, rawHtml, filename, apiKey);
  const { company, role, source } = extractionResult;

  // Log extraction source for debugging
  if (source !== 'fallback') {
    console.error(`${colors.gray}Extracted company/role via ${source}${colors.reset}`);
  }

  const yearsRequired = extractYearsRequired(text);
  const { mustHaves, niceToHaves, ignoredGeneric } = extractRequirements(text);
  const domainKeywords = extractDomainKeywords(text);

  const slug = filename
    ? basename(filename, '.txt').replace(/^jd-/, '').toLowerCase()
    : (company?.toLowerCase().replace(/\s+/g, '-') || 'unknown') + '-' + (role?.toLowerCase().replace(/\s+/g, '-').slice(0, 10) || 'role');

  const analysis: JDAnalysis = {
    metadata: {
      analyzedAt: new Date().toISOString(),
      sourceFile: filename,
      slug
    },
    extracted: {
      company,
      role,
      yearsRequired
    },
    mustHaves,
    niceToHaves,
    ignoredGeneric,
    domainKeywords,
    searchTerms: []
  };

  analysis.searchTerms = generateSearchTerms(analysis);

  return analysis;
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

function printAnalysis(analysis: JDAnalysis): void {
  console.log();
  console.log(`${colors.bold}═══════════════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.bold}  JD ANALYSIS${colors.reset}`);
  console.log(`${colors.bold}═══════════════════════════════════════════════════════════════${colors.reset}`);
  console.log();

  // Extracted info
  console.log(`${colors.cyan}Company:${colors.reset} ${analysis.extracted.company || '(not detected)'}`);
  console.log(`${colors.cyan}Role:${colors.reset} ${analysis.extracted.role || '(not detected)'}`);
  console.log(`${colors.cyan}Years Required:${colors.reset} ${analysis.extracted.yearsRequired || '(not specified)'}`);
  console.log(`${colors.cyan}Slug:${colors.reset} ${analysis.metadata.slug}`);
  console.log();

  // Must-haves
  console.log(`${colors.bold}Must-Have Requirements (${analysis.mustHaves.length}):${colors.reset}`);
  if (analysis.mustHaves.length === 0) {
    console.log(`  ${colors.yellow}No specific requirements detected${colors.reset}`);
  } else {
    for (const req of analysis.mustHaves) {
      const specificityColor = req.specificity === 'high' ? colors.green : req.specificity === 'medium' ? colors.yellow : colors.gray;
      console.log(`  ${specificityColor}[${req.specificity}]${colors.reset} ${req.text.slice(0, 70)}...`);
      console.log(`       ${colors.gray}category: ${req.category}${colors.reset}`);
    }
  }
  console.log();

  // Domain keywords
  console.log(`${colors.bold}Domain Keywords:${colors.reset} ${analysis.domainKeywords.join(', ') || '(none detected)'}`);
  console.log();

  // Search terms
  console.log(`${colors.bold}Search Terms for Knowledge Base:${colors.reset}`);
  console.log(`  ${colors.blue}${analysis.searchTerms.join(', ')}${colors.reset}`);
  console.log();

  // Filtered generic
  if (analysis.ignoredGeneric.length > 0) {
    console.log(`${colors.gray}Filtered out ${analysis.ignoredGeneric.length} generic phrases${colors.reset}`);
  }
  console.log();
}

function saveAnalysis(analysis: JDAnalysis): void {
  const outDir = join(process.cwd(), 'capstone', 'develop', 'jd-analysis');
  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true });
  }

  const outPath = join(outDir, `${analysis.metadata.slug}.yaml`);
  writeFileSync(outPath, YAML.stringify(analysis), 'utf-8');
  console.log(`${colors.green}✅ Saved to ${outPath}${colors.reset}`);
}

// ═══════════════════════════════════════════════════════════════
// CLI
// ═══════════════════════════════════════════════════════════════

interface Args {
  file?: string;
  text?: string;
  url?: string;
  json: boolean;
  save: boolean;
}

function parseArgs(): Args {
  const args = process.argv.slice(2);
  const result: Args = { json: false, save: false };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--file' && args[i + 1]) {
      result.file = args[++i];
    } else if (args[i] === '--text' && args[i + 1]) {
      result.text = args[++i];
    } else if (args[i] === '--url' && args[i + 1]) {
      result.url = args[++i];
    } else if (args[i] === '--json') {
      result.json = true;
    } else if (args[i] === '--save') {
      result.save = true;
    }
  }

  return result;
}

function extractTextFromHtml(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, '\n')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n\s*\n/g, '\n\n')
    .trim();
}

interface FetchResult {
  text: string;
  rawHtml: string;
}

async function fetchWithPuppeteer(url: string): Promise<FetchResult> {
  console.error(`${colors.yellow}Using headless browser for bot-protected site...${colors.reset}`);

  const puppeteer = await import('puppeteer');
  const browser = await puppeteer.default.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    // Wait a bit for any JS rendering
    await new Promise(r => setTimeout(r, 2000));

    const rawHtml = await page.content();
    return { text: extractTextFromHtml(rawHtml), rawHtml };
  } finally {
    await browser.close();
  }
}

async function fetchJobDescription(url: string): Promise<FetchResult> {
  console.error(`${colors.cyan}Fetching job description from URL...${colors.reset}`);

  try {
    // Try simple fetch first
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none'
      }
    });

    if (response.status === 403) {
      // Site blocks simple fetch, try Puppeteer
      const result = await fetchWithPuppeteer(url);
      if (result.text.length < 100) {
        throw new Error('Fetched content too short - may not be a valid job description page');
      }
      return result;
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const rawHtml = await response.text();
    const text = extractTextFromHtml(rawHtml);

    if (text.length < 100) {
      throw new Error('Fetched content too short - may not be a valid job description page');
    }

    return { text, rawHtml };
  } catch (error) {
    if (error instanceof Error) {
      // If it's not already a "Failed to fetch" error, and we haven't tried Puppeteer yet
      if (!error.message.includes('Failed to fetch') && !error.message.includes('headless browser')) {
        try {
          const result = await fetchWithPuppeteer(url);
          if (result.text.length < 100) {
            throw new Error('Fetched content too short - may not be a valid job description page');
          }
          return result;
        } catch (puppeteerError) {
          throw new Error(`Failed to fetch URL: ${puppeteerError instanceof Error ? puppeteerError.message : String(puppeteerError)}`);
        }
      }
      throw new Error(`Failed to fetch URL: ${error.message}`);
    }
    throw error;
  }
}

async function main() {
  const args = parseArgs();

  if (!args.file && !args.text && !args.url) {
    console.error(`${colors.red}Error: Must provide --file, --text, or --url${colors.reset}`);
    console.log(`
Usage:
  npm run analyze:jd -- --file source-data/jd-stripe.txt
  npm run analyze:jd -- --text "Job description text..."
  npm run analyze:jd -- --url "https://jobs.lever.co/company/..."
  npm run analyze:jd -- --file jd.txt --save
  npm run analyze:jd -- --file jd.txt --json
`);
    process.exit(1);
  }

  let text: string;
  let rawHtml: string | undefined;
  let filename: string | undefined;

  if (args.file) {
    if (!existsSync(args.file)) {
      console.error(`${colors.red}Error: File not found: ${args.file}${colors.reset}`);
      process.exit(1);
    }
    text = readFileSync(args.file, 'utf-8');
    filename = args.file;
  } else if (args.url) {
    const result = await fetchJobDescription(args.url);
    text = result.text;
    rawHtml = result.rawHtml;
  } else {
    text = args.text!;
  }

  // Get API key for Claude fallback extraction
  const apiKey = process.env.ANTHROPIC_API_KEY;

  const analysis = await analyzeJD(text, { filename, rawHtml, apiKey });

  if (args.json) {
    console.log(JSON.stringify(analysis, null, 2));
  } else {
    printAnalysis(analysis);
    if (args.save) {
      saveAnalysis(analysis);
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
