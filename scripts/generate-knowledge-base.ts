#!/usr/bin/env tsx
/**
 * Universal CV Knowledge Base Generator
 *
 * Automatically transforms raw career data into structured knowledge base files
 * using AI to extract achievements, stories, and entity relationships.
 *
 * Usage:
 *   npm run generate:kb -- --source ./source-data
 *   npm run generate:kb -- --source ./resume.md --provider gemini
 *
 * Options:
 *   --source <path>      Path to source data (file or directory)
 *   --provider <name>    AI provider: claude | openai | gemini (default: claude)
 *   --api-key <key>      API key (or use env var)
 *   --dry-run            Preview without writing files
 *   --verbose            Show detailed output
 */

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync, mkdirSync } from 'fs';
import { join, extname, basename } from 'path';
import YAML from 'yaml';

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
  bold: '\x1b[1m',
  dim: '\x1b[2m'
};

interface CLIArgs {
  sourcePath: string;
  provider: 'claude' | 'openai' | 'gemini';
  apiKey?: string;
  dryRun: boolean;
  verbose: boolean;
}

interface SourceFile {
  path: string;
  name: string;
  type: 'markdown' | 'csv' | 'text' | 'json';
  content: string;
}

interface GeneratedContent {
  entityGraph: string;
  achievements: Array<{ filename: string; content: string }>;
  stories: Array<{ filename: string; content: string }>;
  experience: string;
  skills: string;
  profile: string;
}

// Show help message
function showHelp(): void {
  console.log(`${colors.bold}${colors.blue}Universal CV Knowledge Base Generator${colors.reset}

${colors.bold}Usage:${colors.reset}
  npm run generate:kb -- --source <path>
  npm run generate:kb -- --source ./source-data --provider claude

${colors.bold}Required:${colors.reset}
  --source <path>      Path to source data (file or directory)
                       Supports: .md, .txt, .csv, .json files

${colors.bold}Optional:${colors.reset}
  --provider <name>    AI provider: claude | openai | gemini (default: claude)
  --api-key <key>      API key (or set via environment variable)
  --dry-run            Preview generated content without writing files
  --verbose            Show detailed processing output

${colors.bold}Environment Variables:${colors.reset}
  ANTHROPIC_API_KEY    For Claude provider
  OPENAI_API_KEY       For OpenAI provider
  GEMINI_API_KEY       For Gemini provider

${colors.bold}Source Data Structure:${colors.reset}
  source-data/
  ├── resume.md           # Your resume in markdown
  ├── work-notes/         # Project notes, achievements
  │   ├── company-a.md
  │   └── company-b.md
  ├── linkedin-export.csv # LinkedIn data export
  └── reviews/            # Performance reviews, testimonials

${colors.bold}Output:${colors.reset}
  content/knowledge/
  ├── index.yaml          # Entity graph (companies, themes, skills)
  ├── achievements/       # STAR-format achievements
  │   └── *.yaml
  └── stories/            # Extended narratives
      └── *.yaml

${colors.bold}Examples:${colors.reset}
  # Process all files in source-data directory
  npm run generate:kb -- --source ./source-data

  # Process a single resume file
  npm run generate:kb -- --source ./my-resume.md

  # Use Gemini (free tier)
  npm run generate:kb -- --source ./source-data --provider gemini

  # Preview without writing
  npm run generate:kb -- --source ./source-data --dry-run

${colors.bold}Need an API key?${colors.reset}
  Claude:  https://console.anthropic.com
  OpenAI:  https://platform.openai.com/api-keys
  Gemini:  https://makersuite.google.com/app/apikey (Free tier!)
`);
  process.exit(0);
}

// Parse command line arguments
function parseArgs(): CLIArgs {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h') || args.length === 0) {
    showHelp();
  }

  const parsed: Partial<CLIArgs> = {
    provider: 'claude',
    dryRun: false,
    verbose: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const next = args[i + 1];

    switch (arg) {
      case '--source':
        parsed.sourcePath = next;
        i++;
        break;
      case '--provider':
        if (!['claude', 'openai', 'gemini'].includes(next)) {
          throw new Error(`Invalid provider: ${next}. Must be: claude, openai, or gemini`);
        }
        parsed.provider = next as 'claude' | 'openai' | 'gemini';
        i++;
        break;
      case '--api-key':
        parsed.apiKey = next;
        i++;
        break;
      case '--dry-run':
        parsed.dryRun = true;
        break;
      case '--verbose':
        parsed.verbose = true;
        break;
    }
  }

  if (!parsed.sourcePath) {
    throw new Error('Missing required argument: --source <path>');
  }

  // For dry-run, we don't need an API key
  if (parsed.dryRun) {
    return parsed as CLIArgs;
  }

  // Get API key from env if not provided
  if (!parsed.apiKey) {
    const envVars: Record<string, string> = {
      claude: 'ANTHROPIC_API_KEY',
      openai: 'OPENAI_API_KEY',
      gemini: 'GEMINI_API_KEY'
    };
    parsed.apiKey = process.env[envVars[parsed.provider!]];

    if (!parsed.apiKey) {
      const providerUrls: Record<string, string> = {
        claude: 'https://console.anthropic.com',
        openai: 'https://platform.openai.com/api-keys',
        gemini: 'https://makersuite.google.com/app/apikey'
      };
      throw new Error(
        `No API key found for ${parsed.provider}.\n\n` +
        `To fix:\n` +
        `  1. Get a key at: ${providerUrls[parsed.provider!]}\n` +
        `  2. Run: export ${envVars[parsed.provider!]}="your-key"\n` +
        `\n` +
        `Or use: npm run generate:kb -- --api-key "your-key" --source ...`
      );
    }
  }

  return parsed as CLIArgs;
}

// Collect source files
function collectSourceFiles(sourcePath: string, verbose: boolean): SourceFile[] {
  const files: SourceFile[] = [];
  const supportedExtensions = ['.md', '.txt', '.csv', '.json'];

  function processPath(path: string): void {
    const stat = statSync(path);

    if (stat.isDirectory()) {
      const entries = readdirSync(path);
      for (const entry of entries) {
        if (!entry.startsWith('.') && !entry.startsWith('_')) {
          processPath(join(path, entry));
        }
      }
    } else if (stat.isFile()) {
      const ext = extname(path).toLowerCase();
      if (supportedExtensions.includes(ext)) {
        const content = readFileSync(path, 'utf-8');
        const type = ext === '.md' ? 'markdown' :
                     ext === '.csv' ? 'csv' :
                     ext === '.json' ? 'json' : 'text';

        files.push({
          path,
          name: basename(path),
          type,
          content
        });

        if (verbose) {
          console.log(`${colors.gray}  Found: ${path} (${type})${colors.reset}`);
        }
      }
    }
  }

  processPath(sourcePath);
  return files;
}

// Generate the AI prompt for knowledge base creation
function generateKnowledgeBasePrompt(sourceFiles: SourceFile[]): string {
  const fileContents = sourceFiles.map(f =>
    `### File: ${f.name} (${f.type})\n\`\`\`\n${f.content.slice(0, 15000)}\n\`\`\``
  ).join('\n\n');

  return `You are an expert career consultant transforming raw career data into a structured knowledge base for a portfolio website.

# Source Data

${fileContents}

# Your Task

Analyze this career data and generate a COMPLETE knowledge base in YAML format. Output a JSON object with these exact keys:

## 1. entityGraph
The entity relationship graph defining companies, themes, and skills.

## 2. achievements
Array of achievement objects, each with:
- filename: "slug-name.yaml" (lowercase, hyphenated)
- content: Full YAML content in STAR format

## 3. stories
Array of story objects (if material exists for extended narratives), each with:
- filename: "slug-name.yaml"
- content: Full YAML content

## 4. experience
The experience/index.yaml content

## 5. skills
The skills/index.yaml content

## 6. profile
Basic profile.yaml content

# Output Format Requirements

Return ONLY a valid JSON object (no markdown code blocks) with this structure:

{
  "entityGraph": "yaml string content for content/knowledge/index.yaml",
  "achievements": [
    {
      "filename": "achievement-slug.yaml",
      "content": "full yaml content"
    }
  ],
  "stories": [
    {
      "filename": "story-slug.yaml",
      "content": "full yaml content"
    }
  ],
  "experience": "yaml string content for content/experience/index.yaml",
  "skills": "yaml string content for content/skills/index.yaml",
  "profile": "yaml string content for content/profile.yaml"
}

# Schema Requirements

## Achievement YAML Structure:
\`\`\`yaml
id: achievement-slug
headline: "One-line achievement (resume bullet format)"
metric:
  value: "X"
  unit: "metric type"
  context: "why this matters"
situation: |
  Context and constraints
task: |
  Your responsibility
action: |
  What you actually did
result: |
  Outcomes with metrics
skills:
  - skill-id
themes:
  - theme-id
companies:
  - company-id
years:
  - 2023
good_for:
  - "Role types this resonates with"
evidence:
  case_study: null
  testimonial: null
  metrics_source: "source of the numbers"
  artifacts: []
\`\`\`

## Entity Graph Structure:
\`\`\`yaml
version: "1.0"
description: "Career knowledge base"
entities:
  companies:
    company-slug:
      name: "Company Name"
      period: "YYYY–YYYY"
      role: "Job Title"
      domain: "Industry"
  themes:
    theme-slug:
      label: "Theme Label"
      description: "What this theme means"
  skills:
    skill-slug:
      label: "Skill Name"
      category: "Category"
relationships:
  achieved_at:
    description: "Achievement occurred at company"
  demonstrates:
    description: "Achievement demonstrates skill"
  belongs_to:
    description: "Achievement belongs to theme"
\`\`\`

## Experience Structure:
\`\`\`yaml
jobs:
  - company: "Company Name"
    role: "Job Title"
    period: "YYYY – YYYY"
    location: "City, Country"
    logo: null
    url: "https://company.com"
    highlights:
      - "Achievement with metric"
      - "Another achievement"
    tags:
      - "Tag1"
      - "Tag2"
\`\`\`

## Skills Structure:
\`\`\`yaml
categories:
  - name: "Category Name"
    skills:
      - "Skill 1"
      - "Skill 2"
\`\`\`

# Guidelines

1. **Extract Real Data**: Only use facts from the source files. Never invent achievements.
2. **Find Metrics**: Look for any numbers, percentages, dollar amounts, time savings.
3. **Identify Patterns**: Group achievements by company, theme, and skill.
4. **STAR Format**: Every achievement needs Situation, Task, Action, Result.
5. **Create Relationships**: Link achievements to companies, skills, and themes.
6. **Be Thorough**: Extract EVERY achievement mentioned, even small ones.
7. **Normalize IDs**: Use lowercase-hyphenated slugs for all identifiers.

Output ONLY the JSON object. No explanations, no markdown formatting.`;
}

// Call AI API with proper error handling
async function callAI(provider: string, apiKey: string, prompt: string, verbose: boolean): Promise<string> {
  if (verbose) {
    console.log(`${colors.cyan}Calling ${provider} API...${colors.reset}`);
  }

  try {
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
          max_tokens: 16000,
          messages: [{ role: 'user', content: prompt }]
        })
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Claude API error (${response.status}): ${error}`);
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
          temperature: 0.3,
          max_tokens: 16000
        })
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`OpenAI API error (${response.status}): ${error}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    }

    if (provider === 'gemini') {
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
            }],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 16000
            }
          })
        }
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Gemini API error (${response.status}): ${error}`);
      }

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    }

    throw new Error(`Unknown provider: ${provider}`);
  } catch (error) {
    if (error instanceof Error) {
      // Network errors (DNS, timeout, etc.)
      if (error.message.includes('fetch failed') || error.message.includes('ENOTFOUND') || error.message.includes('EAI_AGAIN')) {
        throw new Error(
          `Network error connecting to ${provider} API.\n\n` +
          `Possible causes:\n` +
          `  • No internet connection\n` +
          `  • DNS resolution failed\n` +
          `  • API endpoint is down\n` +
          `  • Firewall blocking the request\n\n` +
          `Original error: ${error.message}`
        );
      }
      // Re-throw API errors as-is
      throw error;
    }
    throw new Error(`Unknown error calling ${provider} API`);
  }
}

// Parse AI response into structured content
function parseAIResponse(response: string): GeneratedContent {
  // Clean up response - remove markdown code blocks if present
  let cleaned = response.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\n/, '').replace(/\n```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\n/, '').replace(/\n```$/, '');
  }

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (error) {
    // Show helpful error with context
    const preview = cleaned.slice(0, 500);
    throw new Error(
      `Failed to parse AI response as JSON.\n\n` +
      `The AI may have returned invalid JSON or extra text.\n` +
      `Response preview:\n${preview}...\n\n` +
      `Try running the command again - AI responses can vary.`
    );
  }

  return {
    entityGraph: parsed.entityGraph,
    achievements: parsed.achievements || [],
    stories: parsed.stories || [],
    experience: parsed.experience,
    skills: parsed.skills,
    profile: parsed.profile
  };
}

// Write generated content to files
function writeContent(content: GeneratedContent, dryRun: boolean, verbose: boolean): void {
  const knowledgeDir = join(process.cwd(), 'content', 'knowledge');
  const achievementsDir = join(knowledgeDir, 'achievements');
  const storiesDir = join(knowledgeDir, 'stories');
  const contentDir = join(process.cwd(), 'content');

  // Ensure directories exist
  if (!dryRun) {
    if (!existsSync(knowledgeDir)) mkdirSync(knowledgeDir, { recursive: true });
    if (!existsSync(achievementsDir)) mkdirSync(achievementsDir, { recursive: true });
    if (!existsSync(storiesDir)) mkdirSync(storiesDir, { recursive: true });
  }

  const filesToWrite: Array<{ path: string; content: string }> = [];

  // Entity graph
  if (content.entityGraph) {
    filesToWrite.push({
      path: join(knowledgeDir, 'index.yaml'),
      content: content.entityGraph
    });
  }

  // Achievements
  for (const achievement of content.achievements) {
    filesToWrite.push({
      path: join(achievementsDir, achievement.filename),
      content: achievement.content
    });
  }

  // Stories
  for (const story of content.stories) {
    filesToWrite.push({
      path: join(storiesDir, story.filename),
      content: story.content
    });
  }

  // Experience
  if (content.experience) {
    const experienceDir = join(contentDir, 'experience');
    if (!dryRun && !existsSync(experienceDir)) {
      mkdirSync(experienceDir, { recursive: true });
    }
    filesToWrite.push({
      path: join(experienceDir, 'index.yaml'),
      content: content.experience
    });
  }

  // Skills
  if (content.skills) {
    const skillsDir = join(contentDir, 'skills');
    if (!dryRun && !existsSync(skillsDir)) {
      mkdirSync(skillsDir, { recursive: true });
    }
    filesToWrite.push({
      path: join(skillsDir, 'index.yaml'),
      content: content.skills
    });
  }

  // Profile
  if (content.profile) {
    filesToWrite.push({
      path: join(contentDir, 'profile.yaml'),
      content: content.profile
    });
  }

  // Write or preview
  console.log(`\n${colors.bold}${dryRun ? 'Files to be created:' : 'Writing files:'}${colors.reset}\n`);

  for (const file of filesToWrite) {
    const relativePath = file.path.replace(process.cwd() + '/', '');

    if (dryRun) {
      console.log(`${colors.yellow}○${colors.reset} ${relativePath}`);
      if (verbose) {
        console.log(`${colors.dim}${file.content.slice(0, 200)}...${colors.reset}\n`);
      }
    } else {
      writeFileSync(file.path, file.content, 'utf-8');
      console.log(`${colors.green}✓${colors.reset} ${relativePath}`);
    }
  }

  // Summary
  console.log(`\n${colors.bold}Summary:${colors.reset}`);
  console.log(`  Entity graph: ${content.entityGraph ? '1 file' : 'none'}`);
  console.log(`  Achievements: ${content.achievements.length} files`);
  console.log(`  Stories: ${content.stories.length} files`);
  console.log(`  Experience: ${content.experience ? '1 file' : 'none'}`);
  console.log(`  Skills: ${content.skills ? '1 file' : 'none'}`);
  console.log(`  Profile: ${content.profile ? '1 file' : 'none'}`);
}

// Main execution
async function main() {
  try {
    const args = parseArgs();

    console.log(`${colors.bold}${colors.blue}Universal CV Knowledge Base Generator${colors.reset}\n`);

    // Check source path exists
    if (!existsSync(args.sourcePath)) {
      throw new Error(`Source path not found: ${args.sourcePath}`);
    }

    // Collect source files
    console.log(`${colors.gray}Scanning source files...${colors.reset}`);
    const sourceFiles = collectSourceFiles(args.sourcePath, args.verbose);

    if (sourceFiles.length === 0) {
      throw new Error(`No supported files found in: ${args.sourcePath}\nSupported: .md, .txt, .csv, .json`);
    }

    console.log(`${colors.green}✓${colors.reset} Found ${sourceFiles.length} source files\n`);

    // List files
    for (const file of sourceFiles) {
      console.log(`  ${colors.cyan}•${colors.reset} ${file.name} ${colors.dim}(${file.type})${colors.reset}`);
    }

    // Generate prompt
    console.log(`\n${colors.gray}Generating knowledge base prompt...${colors.reset}`);
    const prompt = generateKnowledgeBasePrompt(sourceFiles);

    if (args.verbose) {
      console.log(`${colors.dim}Prompt length: ${prompt.length} characters${colors.reset}`);
    }

    // Dry-run mode: show what would happen without calling API
    if (args.dryRun) {
      console.log(`\n${colors.yellow}${colors.bold}DRY RUN MODE${colors.reset}\n`);
      console.log(`${colors.bold}Would generate:${colors.reset}`);
      console.log(`  ${colors.cyan}•${colors.reset} content/knowledge/index.yaml (entity graph)`);
      console.log(`  ${colors.cyan}•${colors.reset} content/knowledge/achievements/*.yaml (STAR-format achievements)`);
      console.log(`  ${colors.cyan}•${colors.reset} content/knowledge/stories/*.yaml (extended narratives)`);
      console.log(`  ${colors.cyan}•${colors.reset} content/experience/index.yaml`);
      console.log(`  ${colors.cyan}•${colors.reset} content/skills/index.yaml`);
      console.log(`  ${colors.cyan}•${colors.reset} content/profile.yaml`);
      console.log(`\n${colors.bold}From source files:${colors.reset}`);
      for (const file of sourceFiles) {
        console.log(`  ${colors.green}✓${colors.reset} ${file.name} (${file.content.length} chars)`);
      }
      console.log(`\n${colors.bold}AI prompt:${colors.reset} ${prompt.length} characters`);
      if (args.verbose) {
        console.log(`\n${colors.dim}${prompt.slice(0, 1000)}...${colors.reset}`);
      }
      console.log(`\n${colors.yellow}Run without --dry-run to generate files.${colors.reset}`);
      return;
    }

    // Call AI
    console.log(`\n${colors.cyan}Calling ${args.provider} API to generate knowledge base...${colors.reset}`);
    console.log(`${colors.dim}This may take 30-60 seconds...${colors.reset}\n`);

    const response = await callAI(args.provider, args.apiKey!, prompt, args.verbose);

    // Parse response
    console.log(`${colors.gray}Parsing AI response...${colors.reset}`);
    const content = parseAIResponse(response);

    // Validate parsed content
    if (!content.entityGraph && content.achievements.length === 0) {
      throw new Error('AI response did not contain valid knowledge base content. Try again or check your source data.');
    }

    console.log(`${colors.green}✓${colors.reset} Parsed ${content.achievements.length} achievements, ${content.stories.length} stories`);

    // Write content
    writeContent(content, args.dryRun, args.verbose);

    // Next steps
    console.log(`\n${colors.green}${colors.bold}✓ Knowledge base generated successfully!${colors.reset}`);
    console.log(`\n${colors.cyan}Next steps:${colors.reset}`);
    console.log(`  1. Review generated files in content/knowledge/`);
    console.log(`  2. Run validation: ${colors.bold}npm run validate${colors.reset}`);
    console.log(`  3. Generate a variant: ${colors.bold}npm run generate:cv -- --company "X" --role "Y" --jd ./jd.txt${colors.reset}`);
    console.log(`  4. Preview locally: ${colors.bold}npm run dev${colors.reset}`);

  } catch (error) {
    console.error(`\n${colors.red}${colors.bold}Error:${colors.reset} ${error instanceof Error ? error.message : error}`);
    process.exit(1);
  }
}

main();
