#!/usr/bin/env tsx
/**
 * Quick Variant Generator - One command, paste and go!
 *
 * For on-the-go variant creation: paste a job URL, get a tailored variant + resume.
 *
 * Usage:
 *   npm run quick-variant -- "https://jobs.lever.co/apple/abc123"
 *   npm run quick-variant -- "https://careers.apple.com/en-us/details/12345"
 *   npm run quick-variant -- --help
 *
 * What it does:
 *   1. Fetches and parses the job page
 *   2. Extracts company, role, and job description using AI
 *   3. Generates a tailored variant using AI
 *   4. Saves to YAML (source of truth) and JSON (runtime)
 *   5. Syncs with dashboard manifest
 *   6. Optionally generates resume PDF (if Puppeteer available)
 *
 * Environment:
 *   ANTHROPIC_API_KEY or OPENAI_API_KEY or GEMINI_API_KEY
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import YAML from 'yaml';
import { VariantSchema } from '../src/lib/schemas.js';

// Load .env.local
const envPath = join(process.cwd(), '.env.local');
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].split('#')[0].trim();
    }
  }
}

// Theme
const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

const icons = {
  success: `${c.green}✓${c.reset}`,
  error: `${c.red}✗${c.reset}`,
  info: `${c.blue}ℹ${c.reset}`,
  arrow: `${c.dim}→${c.reset}`,
  rocket: '🚀',
};

function showHelp() {
  console.log(`
${c.bold}${c.blue}Quick Variant Generator${c.reset}
${c.dim}One command to create a tailored variant from any job URL${c.reset}

${c.bold}Usage:${c.reset}
  npm run quick-variant -- "https://jobs.lever.co/company/role"
  npm run quick-variant -- "https://careers.company.com/job/12345"

${c.bold}Options:${c.reset}
  --help          Show this help message
  --skip-resume   Skip resume PDF generation
  --publish       Auto-publish the variant (default: draft)

${c.bold}What happens:${c.reset}
  1. ${icons.arrow} Fetches job page content
  2. ${icons.arrow} AI extracts company, role, and job description
  3. ${icons.arrow} AI generates tailored variant (hero, bio, relevance scores)
  4. ${icons.arrow} Saves to content/variants/{slug}.yaml
  5. ${icons.arrow} Syncs JSON artifact and dashboard manifest
  6. ${icons.arrow} Generates resume PDF (if available)

${c.bold}Environment:${c.reset}
  Set one of: ANTHROPIC_API_KEY, OPENAI_API_KEY, or GEMINI_API_KEY
  Add to .env.local or export in your shell.

${c.bold}Examples:${c.reset}
  ${c.dim}# Create an Apple PM variant${c.reset}
  npm run quick-variant -- "https://jobs.apple.com/en-us/details/200554360"

  ${c.dim}# Skip resume generation${c.reset}
  npm run quick-variant -- --skip-resume "https://jobs.lever.co/stripe/123"

  ${c.dim}# Auto-publish${c.reset}
  npm run quick-variant -- --publish "https://jobs.lever.co/company/role"
`);
  process.exit(0);
}

// Slugify helper
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 30);
}

// Excerpt helper
function makeExcerpt(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  const boundary = text.lastIndexOf('.', maxLen);
  if (boundary > maxLen * 0.5) return text.slice(0, boundary + 1);
  const space = text.lastIndexOf(' ', maxLen);
  if (space > maxLen * 0.5) return text.slice(0, space) + '…';
  return text.slice(0, maxLen) + '…';
}

// Fetch job page
async function fetchJobPage(url: string): Promise<string> {
  console.log(`${icons.info} Fetching job page...`);
  console.log(`  ${c.dim}${url}${c.reset}`);

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch: HTTP ${response.status}`);
  }

  let html = await response.text();

  // Clean HTML to text
  html = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
    .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<\/h[1-6]>/gi, '\n\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .replace(/\n\s+/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  console.log(`  ${icons.success} Fetched ${html.length} characters`);
  return html;
}

// Get API key and provider
function getApiConfig(): { provider: string; apiKey: string } {
  if (process.env.ANTHROPIC_API_KEY) {
    return { provider: 'claude', apiKey: process.env.ANTHROPIC_API_KEY };
  }
  if (process.env.OPENAI_API_KEY) {
    return { provider: 'openai', apiKey: process.env.OPENAI_API_KEY };
  }
  if (process.env.GEMINI_API_KEY) {
    return { provider: 'gemini', apiKey: process.env.GEMINI_API_KEY };
  }
  throw new Error(
    'No API key found. Set ANTHROPIC_API_KEY, OPENAI_API_KEY, or GEMINI_API_KEY in .env.local'
  );
}

// Call AI
async function callAI(provider: string, apiKey: string, prompt: string): Promise<string> {
  if (provider === 'claude') {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Claude API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return data.content[0].text;
  }

  if (provider === 'openai') {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  if (provider === 'gemini') {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  }

  throw new Error(`Unknown provider: ${provider}`);
}

// Extract job info from page content
async function extractJobInfo(
  pageContent: string,
  url: string,
  config: { provider: string; apiKey: string }
): Promise<{ company: string; role: string; jobDescription: string }> {
  console.log(`${icons.info} Extracting job details with AI...`);

  const prompt = `You are a job description parser. Extract the following from this job posting:

1. Company name (the employer)
2. Role/Job title
3. Full job description (responsibilities, requirements, qualifications, etc.)

Job posting content:
${pageContent.slice(0, 15000)}

URL: ${url}

Respond in this exact JSON format:
{
  "company": "Company Name",
  "role": "Job Title",
  "jobDescription": "Full job description text..."
}

Only output valid JSON, no markdown code blocks.`;

  const response = await callAI(config.provider, config.apiKey, prompt);

  let parsed;
  try {
    let clean = response.trim();
    if (clean.startsWith('```')) {
      clean = clean.replace(/^```json?\n?/, '').replace(/\n?```$/, '');
    }
    parsed = JSON.parse(clean);
  } catch (e) {
    throw new Error(`Failed to parse job extraction: ${e}`);
  }

  console.log(`  ${icons.success} Extracted: ${c.bold}${parsed.company}${c.reset} - ${parsed.role}`);
  return parsed;
}

// Load portfolio data
function loadPortfolioData() {
  const contentDir = join(process.cwd(), 'content');

  const profile = YAML.parse(readFileSync(join(contentDir, 'profile.yaml'), 'utf-8'));
  const experience = YAML.parse(readFileSync(join(contentDir, 'experience/index.yaml'), 'utf-8'));
  const skills = YAML.parse(readFileSync(join(contentDir, 'skills/index.yaml'), 'utf-8'));
  const projects = YAML.parse(readFileSync(join(contentDir, 'passion-projects/index.yaml'), 'utf-8'));

  return { profile, experience, skills, projects };
}

// Generate variant
async function generateVariant(
  jobInfo: { company: string; role: string; jobDescription: string },
  sourceUrl: string,
  config: { provider: string; apiKey: string }
): Promise<{ slug: string; yaml: string; data: unknown }> {
  console.log(`${icons.info} Generating tailored variant...`);

  const data = loadPortfolioData();
  const companyKey = slugify(jobInfo.company);
  const roleKey = slugify(jobInfo.role);
  const slug = `${companyKey}-${roleKey}`;

  const prompt = `You are an expert career consultant. Generate a personalized portfolio variant for this job.

# Job Application
Company: ${jobInfo.company}
Role: ${jobInfo.role}
Source: ${sourceUrl}

Job Description:
${jobInfo.jobDescription}

# Candidate Background
Profile: ${JSON.stringify(data.profile, null, 2)}
Experience: ${JSON.stringify(data.experience, null, 2)}
Skills: ${JSON.stringify(data.skills, null, 2)}

# Generate YAML variant with this structure:

metadata:
  company: "${jobInfo.company}"
  role: "${jobInfo.role}"
  slug: "${slug}"
  companyKey: "${companyKey}"
  roleKey: "${roleKey}"
  sourceUrl: "${sourceUrl}"
  generatedAt: "${new Date().toISOString()}"
  jobDescription: |
    ${makeExcerpt(jobInfo.jobDescription, 900).split('\n').join('\n    ')}
  generationModel: "${config.provider}"
  publishStatus: "draft"
  applicationStatus: "not_applied"

overrides:
  hero:
    status: "Open to [relevant role type] roles"
    headline:
      - text: "Building"
        style: "italic"
      - text: "[theme phrase]"
        style: "muted"
      - text: "[key word]"
        style: "accent"
    companyAccent:
      - text: "with"
        style: "muted"
      - text: "${jobInfo.company}"
        style: "accent"
    subheadline: "One-sentence pitch for this role"
  about:
    tagline: "Two-sentence summary"
    bio:
      - "First paragraph focused on relevant experience"
      - "Second paragraph connecting background to this opportunity"
    stats:
      - value: "X+"
        label: "Relevant Metric 1"
      - value: "Y"
        label: "Relevant Metric 2"
      - value: "Z"
        label: "Relevant Metric 3"
  sections:
    beyondWork: false
    blog: true
    onchainIdentity: false
    skills: true
    passionProjects: true

# Guidelines:
1. Be truthful - only use facts from the background
2. Match language from the job description
3. Choose stats that demonstrate fit for THIS role
4. Keep it professional and specific

Output ONLY valid YAML, no markdown code blocks.`;

  const response = await callAI(config.provider, config.apiKey, prompt);

  let yamlContent = response.trim();
  if (yamlContent.startsWith('```')) {
    yamlContent = yamlContent.replace(/^```yaml?\n?/, '').replace(/\n?```$/, '');
  }

  // Parse and validate
  const parsed = YAML.parse(yamlContent);
  const validated = VariantSchema.parse(parsed);

  console.log(`  ${icons.success} Generated variant: ${c.bold}${slug}${c.reset}`);

  return { slug, yaml: yamlContent, data: validated };
}

// Save variant files
function saveVariant(slug: string, yamlContent: string, data: unknown) {
  const variantsDir = join(process.cwd(), 'content', 'variants');
  if (!existsSync(variantsDir)) {
    mkdirSync(variantsDir, { recursive: true });
  }

  const yamlPath = join(variantsDir, `${slug}.yaml`);
  const jsonPath = join(variantsDir, `${slug}.json`);

  writeFileSync(yamlPath, yamlContent, 'utf-8');
  writeFileSync(jsonPath, JSON.stringify(data, null, 2) + '\n', 'utf-8');

  console.log(`  ${icons.success} Saved: ${c.dim}${yamlPath}${c.reset}`);
  console.log(`  ${icons.success} Saved: ${c.dim}${jsonPath}${c.reset}`);
}

// Update manifest
function updateManifest() {
  const variantsDir = join(process.cwd(), 'content', 'variants');
  const manifestDir = join(process.cwd(), 'public', 'cv-dashboard');
  const manifestPath = join(manifestDir, 'variants-manifest.json');

  if (!existsSync(manifestDir)) {
    mkdirSync(manifestDir, { recursive: true });
  }

  const files = existsSync(variantsDir)
    ? require('fs').readdirSync(variantsDir).filter((f: string) => f.endsWith('.json') && !f.startsWith('_'))
    : [];

  const variants = files.map((file: string) => {
    const content = readFileSync(join(variantsDir, file), 'utf-8');
    const data = JSON.parse(content);
    return {
      slug: file.replace('.json', ''),
      company: data.metadata?.company,
      role: data.metadata?.role,
      generatedAt: data.metadata?.generatedAt,
      applicationStatus: data.metadata?.applicationStatus || 'pending',
      resumePath: data.metadata?.resumePath,
      hasResume: !!data.metadata?.resumePath,
    };
  });

  variants.sort((a: any, b: any) => {
    const dateA = new Date(a.generatedAt || 0).getTime();
    const dateB = new Date(b.generatedAt || 0).getTime();
    return dateB - dateA;
  });

  const manifest = {
    generatedAt: new Date().toISOString(),
    count: variants.length,
    variants,
  };

  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
  console.log(`  ${icons.success} Updated manifest (${variants.length} variants)`);
}

// Main
async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h') || args.length === 0) {
    showHelp();
  }

  const skipResume = args.includes('--skip-resume');
  const autoPublish = args.includes('--publish');
  const url = args.find(a => a.startsWith('http'));

  if (!url) {
    console.error(`${icons.error} No URL provided. Use: npm run quick-variant -- "https://..."`);
    process.exit(1);
  }

  console.log(`\n${c.bold}${c.blue}Quick Variant Generator${c.reset} ${icons.rocket}\n`);

  try {
    // Get API config
    const config = getApiConfig();
    console.log(`${icons.info} Using ${c.bold}${config.provider}${c.reset} for AI\n`);

    // Fetch and extract
    const pageContent = await fetchJobPage(url);
    const jobInfo = await extractJobInfo(pageContent, url, config);

    // Generate variant
    const variant = await generateVariant(jobInfo, url, config);

    // Check if variant already exists
    const yamlPath = join(process.cwd(), 'content', 'variants', `${variant.slug}.yaml`);
    if (existsSync(yamlPath)) {
      console.log(`\n${c.yellow}Warning:${c.reset} Variant ${variant.slug} already exists.`);
      console.log(`  Overwriting...`);
    }

    // Save files
    console.log(`\n${icons.info} Saving files...`);
    saveVariant(variant.slug, variant.yaml, variant.data);
    updateManifest();

    // Show next steps
    const companyKey = slugify(jobInfo.company);
    const roleKey = slugify(jobInfo.role);

    console.log(`\n${c.bold}${c.green}✅ Variant created successfully!${c.reset}\n`);
    console.log(`${c.dim}Variant:${c.reset} ${variant.slug}`);
    console.log(`${c.dim}Company:${c.reset} ${jobInfo.company}`);
    console.log(`${c.dim}Role:${c.reset} ${jobInfo.role}`);

    console.log(`\n${c.bold}Next steps:${c.reset}`);
    console.log(`  1. Review: ${c.dim}content/variants/${variant.slug}.yaml${c.reset}`);
    console.log(`  2. Generate resume: ${c.dim}npm run generate:resume -- --variant ${variant.slug}${c.reset}`);
    console.log(`  3. Publish variant: Edit YAML, set publishStatus: "published"`);
    console.log(`  4. Update dashboard: ${c.dim}npm run generate:dashboard${c.reset}`);
    console.log(`  5. Test locally: ${c.dim}npm run dev${c.reset} → http://localhost:5173/${companyKey}/${roleKey}`);

    if (!skipResume) {
      console.log(`\n${c.dim}Tip: Run resume generation separately if Puppeteer isn't available${c.reset}`);
    }

  } catch (error) {
    console.error(`\n${icons.error} ${c.red}Error:${c.reset} ${error instanceof Error ? error.message : error}`);
    process.exit(1);
  }
}

main();
