#!/usr/bin/env tsx
/**
 * Universal CV Generator CLI
 *
 * Generates personalized portfolio variants for specific job applications
 * using AI to analyze job descriptions and tailor content.
 *
 * Usage:
 *   npm run generate:cv -- --company "Bloomberg" --role "Senior Engineer" --jd "./jd.txt"
 *   npm run generate:cv -- --company "Gensyn" --role "ML Researcher" --jd-text "Job description..."
 *   npm run generate:cv -- --company "Stripe" --role "PM" --jd-url "https://jobs.lever.co/stripe/..."
 *
 * Options:
 *   --company <name>         Company name (required)
 *   --role <title>          Role title (required)
 *   --jd <file>             Path to job description file
 *   --jd-text <text>        Job description as text
 *   --jd-url <url>          URL to job description page
 *   --values <text>         Company values (optional)
 *   --context <text>        Additional context (optional)
 *   --provider <name>       AI provider: claude | openai | gemini (default: claude)
 *   --api-key <key>         API key (or use env var)
 *   --output <file>         Output file path (auto-generated if not specified)
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';
import YAML from 'yaml';
import { VariantSchema } from '../src/lib/schemas.js';
import type { Profile, Experience, CaseStudy, Skills, PassionProjects } from '../src/types/portfolio.js';

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
  bold: '\x1b[1m'
};

interface CLIArgs {
  company: string;
  role: string;
  jobDescription: string;
  companyValues?: string;
  additionalContext?: string;
  provider: 'claude' | 'openai' | 'gemini';
  apiKey?: string;
  outputFile?: string;
}

interface RawCLIArgs extends Omit<CLIArgs, 'jobDescription'> {
  jobDescription?: string;
  jdUrl?: string;
}

interface PortfolioData {
  profile: Profile;
  experience: Experience;
  caseStudies: CaseStudy[];
  skills: Skills;
  projects: PassionProjects;
}

// Show help message
function showHelp(): void {
  console.log(`${colors.bold}${colors.blue}Universal CV Generator${colors.reset}

${colors.bold}Usage:${colors.reset}
  npm run generate:cv -- --company <name> --role <title> --jd <file>
  npm run generate:cv -- --company <name> --role <title> --jd-text "..."
  npm run generate:cv -- --company <name> --role <title> --jd-url "https://..."

${colors.bold}Required:${colors.reset}
  --company <name>     Company name (e.g., "Stripe")
  --role <title>       Role title (e.g., "Senior PM")
  --jd <file>          Path to job description file
  --jd-text <text>     OR: Job description as inline text
  --jd-url <url>       OR: URL to job description page (auto-fetched)

${colors.bold}Optional:${colors.reset}
  --provider <name>    AI provider: claude | openai | gemini (default: claude)
  --api-key <key>      API key (or set via environment variable)
  --values <text>      Company values/culture info
  --context <text>     Additional context for generation
  --output <file>      Output file path (auto-generated if not specified)

${colors.bold}Environment Variables:${colors.reset}
  ANTHROPIC_API_KEY    For Claude provider
  OPENAI_API_KEY       For OpenAI provider
  GEMINI_API_KEY       For Gemini provider

${colors.bold}Examples:${colors.reset}
  npm run generate:cv -- --company "Stripe" --role "Senior PM" --jd ./stripe-jd.txt
  npm run generate:cv -- --company "Acme" --role "PM" --jd-text "Looking for PM..."
  npm run generate:cv -- --company "X" --role "Y" --jd-url "https://jobs.lever.co/x/123"
  npm run generate:cv -- --company "X" --role "Y" --jd ./jd.txt --provider openai

${colors.bold}Need an API key?${colors.reset}
  Claude:  https://console.anthropic.com
  OpenAI:  https://platform.openai.com/api-keys
  Gemini:  https://makersuite.google.com/app/apikey

${colors.bold}No API key?${colors.reset}
  Use manual creation: cp content/variants/_template.yaml content/variants/your-variant.yaml
`);
  process.exit(0);
}

// Fetch job description from URL
async function fetchJobDescription(url: string): Promise<string> {
  console.log(`${colors.cyan}Fetching job description from URL...${colors.reset}`);
  console.log(`${colors.gray}  ${url}${colors.reset}`);

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();

    // Extract text content from HTML
    // Remove script and style tags first
    let text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
      .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
      .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '');

    // Convert common HTML elements to readable format
    text = text
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<\/div>/gi, '\n')
      .replace(/<\/li>/gi, '\n')
      .replace(/<\/h[1-6]>/gi, '\n\n')
      .replace(/<[^>]+>/g, ' ')  // Remove remaining tags
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ')      // Normalize whitespace
      .replace(/\n\s+/g, '\n')   // Clean up line starts
      .replace(/\n{3,}/g, '\n\n') // Limit consecutive newlines
      .trim();

    if (text.length < 100) {
      throw new Error('Page content too short - may be blocked or require JavaScript');
    }

    console.log(`${colors.green}✓${colors.reset} Fetched ${text.length} characters of content\n`);
    return text;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('fetch failed') || error.message.includes('ENOTFOUND')) {
        throw new Error(
          `Failed to fetch URL: ${url}\n\n` +
          `Network error - check your internet connection or the URL.\n` +
          `Original error: ${error.message}`
        );
      }
      throw new Error(`Failed to fetch job description from URL:\n  ${error.message}`);
    }
    throw error;
  }
}

// Parse command line arguments (sync part)
function parseRawArgs(): RawCLIArgs {
  const args = process.argv.slice(2);

  // Check for help flag
  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
  }

  const parsed: Partial<CLIArgs> = {
    provider: 'claude'
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const next = args[i + 1];

    switch (arg) {
      case '--company':
        parsed.company = next;
        i++;
        break;
      case '--role':
        parsed.role = next;
        i++;
        break;
      case '--jd':
        parsed.jobDescription = readFileSync(next, 'utf-8');
        i++;
        break;
      case '--jd-text':
        parsed.jobDescription = next;
        i++;
        break;
      case '--jd-url':
        parsed.jdUrl = next;
        i++;
        break;
      case '--values':
        parsed.companyValues = next;
        i++;
        break;
      case '--context':
        parsed.additionalContext = next;
        i++;
        break;
      case '--provider':
        if (!['claude', 'openai', 'gemini'].includes(next)) {
          throw new Error(`Invalid provider: ${next}. Must be: claude, openai, or gemini`);
        }
        parsed.provider = next;
        i++;
        break;
      case '--api-key':
        parsed.apiKey = next;
        i++;
        break;
      case '--output':
        parsed.outputFile = next;
        i++;
        break;
    }
  }

  // Validation
  if (!parsed.company) {
    throw new Error('Missing required argument: --company');
  }
  if (!parsed.role) {
    throw new Error('Missing required argument: --role');
  }
  if (!parsed.jobDescription && !parsed.jdUrl) {
    throw new Error('Missing required argument: --jd, --jd-text, or --jd-url');
  }

  // Get API key from env if not provided
  if (!parsed.apiKey) {
    const envVars = {
      claude: 'ANTHROPIC_API_KEY',
      openai: 'OPENAI_API_KEY',
      gemini: 'GEMINI_API_KEY'
    };
    parsed.apiKey = process.env[envVars[parsed.provider]];

    if (!parsed.apiKey) {
      const providerUrls = {
        claude: 'https://console.anthropic.com',
        openai: 'https://platform.openai.com/api-keys',
        gemini: 'https://makersuite.google.com/app/apikey'
      };
      throw new Error(
        `No API key found.\n\n` +
        `To fix:\n` +
        `  1. Get a key at: ${providerUrls[parsed.provider]}\n` +
        `  2. Run: export ${envVars[parsed.provider]}="your-key"\n` +
        `\n` +
        `Or use: npm run generate:cv -- --api-key "your-key" --company ... --role ...\n` +
        `\n` +
        `No API key? Use manual creation:\n` +
        `  cp content/variants/_template.yaml content/variants/your-variant.yaml`
      );
    }
  }

  return parsed as RawCLIArgs;
}

// Parse args and resolve URL if needed
async function parseArgs(): Promise<CLIArgs> {
  const rawArgs = parseRawArgs();

  // If URL provided, fetch the job description
  if (rawArgs.jdUrl && !rawArgs.jobDescription) {
    rawArgs.jobDescription = await fetchJobDescription(rawArgs.jdUrl);
  }

  if (!rawArgs.jobDescription) {
    throw new Error('Failed to get job description content');
  }

  return {
    company: rawArgs.company,
    role: rawArgs.role,
    jobDescription: rawArgs.jobDescription,
    companyValues: rawArgs.companyValues,
    additionalContext: rawArgs.additionalContext,
    provider: rawArgs.provider,
    apiKey: rawArgs.apiKey,
    outputFile: rawArgs.outputFile
  };
}

// Load all portfolio content
function loadPortfolioData(): PortfolioData {
  const contentDir = join(process.cwd(), 'content');

  console.log(`${colors.gray}Loading portfolio content...${colors.reset}`);

  // Load YAML files
  const profile = YAML.parse(readFileSync(join(contentDir, 'profile.yaml'), 'utf-8'));
  const experience = YAML.parse(readFileSync(join(contentDir, 'experience/index.yaml'), 'utf-8'));
  const skills = YAML.parse(readFileSync(join(contentDir, 'skills/index.yaml'), 'utf-8'));
  const projects = YAML.parse(readFileSync(join(contentDir, 'passion-projects/index.yaml'), 'utf-8'));

  // Load case studies
  const caseStudiesDir = join(contentDir, 'case-studies');
  const caseStudyFiles = readdirSync(caseStudiesDir).filter(f => f.endsWith('.md'));

  const caseStudies = caseStudyFiles.map(file => {
    const content = readFileSync(join(caseStudiesDir, file), 'utf-8');
    const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

    if (match) {
      const frontmatter = YAML.parse(match[1]);
      const body = match[2].trim();
      return { ...frontmatter, content: body };
    }
    return null;
  }).filter(Boolean);

  console.log(`${colors.green}✓${colors.reset} Loaded ${experience.jobs.length} jobs, ${caseStudies.length} case studies, ${skills.categories.length} skill categories`);

  return { profile, experience, caseStudies, skills, projects };
}

// Generate the AI prompt
function generatePrompt(args: CLIArgs, data: PortfolioData): string {
  return `You are an expert career consultant helping personalize a portfolio website for a specific job application.

# Job Application
Company: ${args.company}
Role: ${args.role}

${args.companyValues ? `Company Values:\n${args.companyValues}\n` : ''}
${args.additionalContext ? `Additional Context:\n${args.additionalContext}\n` : ''}

Job Description:
${args.jobDescription}

# Portfolio Owner's Background

## Current Profile
${YAML.stringify(data.profile)}

## Experience
${YAML.stringify(data.experience)}

## Case Studies (${data.caseStudies.length} available)
${data.caseStudies.map(cs => `- ${cs.title} (${cs.slug}): ${cs.hook?.headline || 'No headline'}`).join('\n')}

## Skills
${YAML.stringify(data.skills)}

## Passion Projects
${YAML.stringify(data.projects)}

# Your Task

Generate a personalized portfolio variant as a YAML object with this exact structure:

\`\`\`yaml
metadata:
  company: "${args.company}"
  role: "${args.role}"
  slug: "company-role-slug"  # lowercase-hyphenated
  generatedAt: "${new Date().toISOString()}"
  jobDescription: |
    ${args.jobDescription.split('\n').map(line => `    ${line}`).join('\n')}
  generationModel: "your-model-name"

overrides:
  hero:
    status: "Open to [relevant role type] roles — [relevant domains]"
    # IMPORTANT: Always use this exact headline structure
    headline:
      - text: "Building"
        style: "italic"
      - text: "at the edge of"
        style: "muted"
      - text: "trust"
        style: "accent"
    # IMPORTANT: Always include companyAccent with the target company
    companyAccent:
      - text: "with"
        style: "muted"
      - text: "${args.company}"
        style: "accent"
    subheadline: |
      One-sentence pitch emphasizing most relevant experience
      for this specific role and company. Use concrete achievements.

  about:
    tagline: |
      Two-sentence professional summary highlighting the intersection
      of candidate's experience with this company's needs.
    bio:
      - |
        First paragraph: Current role and most relevant recent experience.
        Emphasize projects/technologies mentioned in the job description.
        Make it feel tailored to this opportunity.
      - |
        Second paragraph: Career journey that leads to this role making sense.
        Connect dots between past experiences and this opportunity.
        Show intentional progression toward this type of work.
    stats:
      - value: "X+"
        label: "Relevant Metric 1"
      - value: "Y"
        label: "Relevant Metric 2"
      - value: "Z"
        label: "Relevant Metric 3"

  sections:
    beyondWork: false  # true if company culture values personal interests
    blog: true         # true if technical writing is valued
    onchainIdentity: false  # true if Web3-native company
    skills: true       # true if technical skills important
    passionProjects: true   # true if side projects demonstrate relevant skills

relevance:
  caseStudies:
    - slug: "case-study-slug"
      relevanceScore: 0.0-1.0  # 1.0 = highly relevant, 0.0 = not relevant
      reasoning: "One sentence explaining why this is/isn't relevant"

  skills:
    - category: "Category Name"
      relevanceScore: 0.0-1.0

  projects:
    - slug: "project-slug"
      relevanceScore: 0.0-1.0
      reasoning: "One sentence explaining relevance"
\`\`\`

# Guidelines

1. **Be Truthful**: Only use facts from the portfolio. Don't invent achievements.
2. **Be Specific**: Use concrete numbers, technologies, and outcomes from the background.
3. **Match Language**: Mirror keywords and phrases from the job description naturally.
4. **Prioritize**: Score content by relevance - what demonstrates fit for THIS role?
5. **Tailor Stats**: Choose 3 stats that best demonstrate fit for this role.
6. **Section Visibility**: Only show sections that strengthen the application.
7. **Headline**: Make it memorable and aligned with company values.

Output ONLY the YAML. No markdown code blocks, no explanations, just valid YAML.`;
}

// Call AI API
async function callAI(provider: string, apiKey: string, prompt: string): Promise<string> {
  console.log(`${colors.cyan}Calling ${provider} API...${colors.reset}`);

  if (provider === 'claude') {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompt }]
      })
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
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  if (provider === 'gemini') {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: prompt }]
            }]
          })
        }
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Gemini API error: ${response.status} - ${error}`);
      }

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Gemini API fetch error:', error);
      throw error;
    }
  }

  throw new Error(`Unknown provider: ${provider}`);
}

// Main execution
async function main() {
  try {
    // Parse arguments (handles --help internally, fetches URL if needed)
    const args = await parseArgs();

    // Only show header if we're actually running
    console.log(`${colors.bold}${colors.blue}Universal CV Generator${colors.reset}\n`);
    console.log(`${colors.gray}Generating variant for: ${colors.reset}${colors.bold}${args.company} - ${args.role}${colors.reset}\n`);

    // Load portfolio data
    const data = loadPortfolioData();

    // Generate prompt
    const prompt = generatePrompt(args, data);

    // Call AI
    const response = await callAI(args.provider, args.apiKey!, prompt);

    // Parse response (remove code blocks if present)
    let yamlContent = response.trim();
    if (yamlContent.startsWith('```yaml')) {
      yamlContent = yamlContent.replace(/^```yaml\n/, '').replace(/\n```$/, '');
    } else if (yamlContent.startsWith('```')) {
      yamlContent = yamlContent.replace(/^```\n/, '').replace(/\n```$/, '');
    }

    // Parse and validate
    console.log(`${colors.gray}Validating generated variant...${colors.reset}`);
    const variant = YAML.parse(yamlContent);
    const validated = VariantSchema.parse(variant);

    // Generate output filenames
    const yamlFile = args.outputFile ||
      join('content', 'variants', `${validated.metadata.slug}.yaml`);
    const jsonFile = yamlFile.replace('.yaml', '.json');

    // Save to YAML (human-readable)
    writeFileSync(yamlFile, yamlContent, 'utf-8');

    // Save to JSON (client-side loading)
    writeFileSync(jsonFile, JSON.stringify(validated, null, 2), 'utf-8');

    console.log(`${colors.green}${colors.bold}✓ Variant generated successfully!${colors.reset}`);
    console.log(`${colors.gray}Saved to:${colors.reset} ${yamlFile}`);
    const variantPath = `/#/${validated.metadata.company.toLowerCase()}/${validated.metadata.slug.split('-').slice(1).join('-')}`;
    console.log(`${colors.gray}URL:${colors.reset} ${variantPath}`);

    console.log(`\n${colors.cyan}Next steps:${colors.reset}`);
    console.log(`  1. Review and edit: ${yamlFile}`);
    console.log(`  2. Run validation: npm run validate`);
    console.log(`  3. Test locally: npm run dev`);
    console.log(`  4. Visit: http://localhost:5173${variantPath}`);

  } catch (error) {
    console.error(`${colors.red}${colors.bold}Error:${colors.reset} ${error instanceof Error ? error.message : error}`);
    process.exit(1);
  }
}

main();
