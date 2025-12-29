# Create Your Portfolio: A Recipe Book

This guide walks you through creating your own portfolio using Claude Code skills. Each step shows you the **outcome** and the **recipe** to achieve it.

---

## Table of Contents

1. [Quick Start](#1-quick-start)
   - 1.5 [Understanding Claude Code Skills](#15-understanding-claude-code-skills)
   - 1.6 [Your First Variant in 5 Minutes](#16-your-first-variant-in-5-minutes)
2. [The Vault - Dump Your Data](#2-the-vault---dump-your-data)
3. [Generate Your Portfolio](#3-generate-your-portfolio)
4. [Generate Your Resume](#4-generate-your-resume)
5. [Preview & Validate](#5-preview--validate)
6. [Host on GitHub Pages](#6-host-on-github-pages)
7. [Create Case Studies](#7-create-case-studies)
8. [Create Blog Posts](#8-create-blog-posts)
9. [Generate Job Variants](#9-generate-job-variants)
10. [Ongoing Maintenance](#10-ongoing-maintenance)
11. [Troubleshooting](#troubleshooting)
12. [What's Next?](#whats-next)

---

## 1. Quick Start

**Outcome:** Project running locally

```bash
# Clone and install
git clone <repository-url> my-portfolio
cd my-portfolio
npm install

# Start development server
npm run dev
```

Open http://localhost:5173 to see the portfolio.

---

## 1.5. Understanding Claude Code Skills

**What are skills?** Skills are pre-written prompts that automate complex workflows. This guide uses several skills like `/cv-data-ingestion` and `/generate-variant`.

### How to Use Skills

**With Claude Code** (recommended):
1. Open Claude Code in your project directory
2. Type the skill name with a slash: `/cv-data-ingestion`
3. Claude Code executes the skill's workflow automatically

**Without Claude Code** (manual path):
If you're not using Claude Code, each skill section below includes manual steps you can follow instead. Look for the "Manual Alternative" subsections.

### Available Skills

| Skill | Purpose |
|-------|---------|
| `/cv-data-ingestion` | Import career data from various sources |
| `/generate-variant` | Create job-targeted portfolio variants |
| `/generate-resume` | Generate PDF resume |
| `/cv-content-generator` | Create case studies and blog posts |

> **Note**: Skills are defined in `.claude/skills/`. Each has a `SKILL.md` file with detailed instructions.

---

## 1.6. Your First Variant in 5 Minutes

Validate your setup by creating a minimal variant before diving into the full workflow.

### Quick Steps

```bash
# 1. Copy the template
cp content/variants/_template.yaml content/variants/test-company-test-role.yaml

# 2. Edit the file - change these 3 fields:
#    - metadata.company: "Test Company"
#    - metadata.role: "Test Role"
#    - overrides.hero.headline: "Your test headline"

# 3. Sync to JSON
npm run variants:sync

# 4. Preview locally
npm run dev
# Open: http://localhost:5173/test-company/test-role
```

### Checklist

- [ ] Dependencies installed (`npm install`)
- [ ] Template copied to `content/variants/`
- [ ] YAML edited with company/role
- [ ] Synced to JSON (`npm run variants:sync`)
- [ ] Previewed at `/company/role`

If the variant loads, your setup is working. Delete the test file and continue to Section 2.

---

## 2. The Vault - Dump Your Data

**Outcome:** All your career data in one place, ready for processing

### Where to Put Your Data

Drop everything into the `source-data/` directory:

```
source-data/
├── resume.pdf              # Your existing resume
├── linkedin-export.csv     # LinkedIn data export
├── work-notes/             # Obsidian vault or markdown files
│   ├── project-alpha.md
│   └── performance-review.md
├── gemini-summary.md       # AI-generated career summary (PROCESSED FIRST)
└── screenshots/            # Project images, certificates
```

### Supported Formats

| Format | Examples |
|--------|----------|
| **Obsidian vault** | Folders with `.md` files + YAML frontmatter |
| **CSV exports** | LinkedIn, spreadsheets |
| **Text/Markdown** | Resumes, performance reviews, project notes |
| **AI summaries** | `*-review.md`, `*-summary.md` (highest priority) |
| **Images** | Screenshots, certificates, logos |

### Tips

- **AI summaries are gold** - If you have a ChatGPT/Claude/Gemini summary of your career, include it. These are processed first and provide the best structure.
- **More is better** - Include performance reviews, project docs, anything with metrics.
- **Don't organize yet** - Just dump everything. The skill will sort it out.

---

## 3. Generate Your Portfolio

**Outcome:** Complete portfolio structure populated from your raw data

### Recipe

**Skill:** `/cv-data-ingestion`

```
Input:  source-data/*.*
Output: content/profile.yaml         ← Your identity, hero, about
        content/experience/index.yaml ← Work history with highlights
        content/skills/index.yaml     ← Categorized skills
        content/testimonials/index.yaml ← Recommendations
        content/knowledge/achievements/*.yaml ← Structured achievements
```

### How to Use

1. Make sure your data is in `source-data/`
2. Start a Claude Code session
3. Say: "Process my career data from source-data/ using /cv-data-ingestion"

### What the Skill Does

1. **Discovers** all files and prioritizes AI summaries
2. **Extracts** work history with metrics-driven highlights
3. **Mines** testimonials (personal quotes, not project praise)
4. **Creates** skills taxonomy by category
5. **Builds** knowledge base of achievements (STAR format)
6. **Validates** against schemas

### Manual Follow-up

After the skill runs, you'll need to:

```bash
# Add your headshot
cp ~/your-photo.jpg public/images/headshot.jpg

# Add company logos (optional but recommended)
cp ~/logos/*.png public/images/logos/

# Review the generated content
cat content/profile.yaml
cat content/experience/index.yaml
```

---

## 4. Generate Your Resume

**Outcome:** Single-page PDF resume ready to download

### Recipe

**Command:** Use the Claude Code Skill: `generate-resume` or call the script directly: `npm run generate:resume`

```
Input:  content/profile.yaml
        content/experience/index.yaml
        content/skills/index.yaml
Process: Puppeteer renders /resume route → PDF
Output: public/resume.pdf
```

### How to Use

```bash
# Make sure dev server is running
npm run dev

# In another terminal, generate the PDF
npm run generate:resume

# With custom filename
npm run generate:resume -- --name "Jane Smith"
# Output: public/jane-smith.pdf
```

### Preview First

Before generating, preview at: http://localhost:5173/resume

The resume follows ATS-friendly format:
- Header: Name / Role + contact info
- Impact summary with metrics
- Professional experience with action → outcome bullets
- Skills section

---

## 5. Preview & Validate

**Outcome:** Working portfolio with no errors

### Commands

```bash
# Check for content errors
npm run validate

# Start local server
npm run dev

# Open in browser
open http://localhost:5173
```

### Troubleshooting

| Issue | Solution |
|-------|----------|
| "Validation failed" | Check YAML syntax - use 2 spaces, not tabs |
| "Image not showing" | Verify path starts with `/` (e.g., `/images/headshot.jpg`) |
| "Page is blank" | Open browser console (F12) for errors |

---

## 6. Host on GitHub Pages

**Outcome:** Live portfolio at `yourname.github.io`

### Step 1: Create GitHub Repository

```bash
# Initialize git if needed
git init

# Add remote
git remote add origin https://github.com/yourusername/portfolio.git

# Push code
git add .
git commit -m "Initial portfolio"
git push -u origin main
```

### Step 2: Add GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Step 3: Enable GitHub Pages

1. Go to repository Settings → Pages
2. Source: "GitHub Actions"
3. Push to main - deployment starts automatically

### Step 4: Custom Domain (Optional)

1. Buy domain from Namecheap, Cloudflare, etc.
2. In repo Settings → Pages → Custom domain
3. Add DNS records as instructed

---

## 7. Create Case Studies

**Outcome:** In-depth project writeups that showcase your work

### Recipe

**Skill:** `/cv-content-generator`

```
Input:  content/knowledge/achievements/*.yaml
Output: content/case-studies/XX-project-name.md
```

### How to Use

Start a Claude Code session and say:

```
"Write a case study about my [project name] work using /cv-content-generator"
```

The skill will:
1. Query your knowledge base for relevant achievements
2. Generate a case study with problem → approach → results structure
3. Include metrics and key decisions
4. Validate against the schema

### Alternative: Manual Creation

```bash
# Copy template
cp content/_templates/case-study.md content/case-studies/04-my-project.md

# Edit the file - fill in frontmatter + markdown body
```

### Case Study Structure

```markdown
---
id: 4
slug: my-project
title: Project Name
company: Company
year: 2024
tags: [Skill1, Skill2]
duration: 6 months
role: Your Role
hook:
  headline: Impact statement
  impactMetric:
    value: "50%"
    label: improvement
cta:
  headline: Interested?
  action: calendly
  linkText: "Let's talk"
---

## The Challenge
...

## The Approach
...

## Results
...
```

---

## 8. Create Blog Posts

**Outcome:** Articles and thought pieces

### Recipe

**Skill:** `/cv-content-generator`

```
Input:  Topic + knowledge base context
Output: content/blog/YYYY-MM-DD-slug.md
```

### How to Use

```
"Write a blog post about [topic] using /cv-content-generator"
```

### Alternative: Manual Creation

```bash
# Copy template with date prefix
cp content/_templates/blog-post.md content/blog/2024-12-26-my-topic.md

# Edit the file
```

### Enable Blog Section

In `content/profile.yaml`:

```yaml
sections:
  blog: true   # Set to true to show blog
```

---

## 8.5 Prerequisites: API Key Setup

**Outcome:** Environment configured for AI-powered variant generation

Before generating variants with AI, you need an API key from one of these providers:

### Option A: Anthropic Claude (Recommended)

1. Create an account at https://console.anthropic.com
2. Navigate to API Keys and create a new key
3. Copy the key (starts with `sk-ant-`)

**Pricing:** ~$0.01-0.05 per variant generation. See https://www.anthropic.com/pricing

### Option B: OpenAI

1. Create an account at https://platform.openai.com
2. Navigate to API Keys and create a new key
3. Copy the key (starts with `sk-`)

**Pricing:** ~$0.01-0.05 per variant generation. See https://openai.com/pricing

### Option C: Google Gemini

1. Go to https://makersuite.google.com/app/apikey
2. Create a new API key
3. Copy the key

**Pricing:** Free tier available! See https://ai.google.dev/pricing

### Setup

```bash
# Copy the example file
cp .env.example .env.local

# Edit and add your API key
# ANTHROPIC_API_KEY=sk-ant-your-key-here
```

> **No API Key?** You can still use manual variant creation by copying `content/variants/_template.yaml` and editing it directly.

---

## 9. Generate Job Variants

**Outcome:** Personalized portfolio tailored to specific job applications

This is the power feature - create targeted versions of your portfolio for each job you apply to.

### Recipe

**Skill:** `/generate-variant`

```
Input:  Job description text
        content/knowledge/achievements/*.yaml
Output: content/variants/company-role.yaml
        content/variants/company-role.json
        capstone/develop/evals/company-role.claims.yaml
        capstone/develop/redteam/company-role.redteam.md
```

### How to Use

1. Copy the job description
2. Start a Claude Code session
3. Say: "Generate a variant for this job using /generate-variant"
4. Paste the job description

### The 7-Phase Pipeline

The skill runs automatically through:

1. **Job Analysis** - Extracts requirements from JD
2. **Knowledge Query** - Finds matching achievements in your knowledge base
3. **Content Generation** - Tailors hero, about, and stats
4. **File Creation** - Creates YAML + syncs to JSON
5. **Evaluation** - Verifies all claims against knowledge base
6. **Red Team** - Scans for accuracy, tone, and security issues
7. **Review** - Visual check before publishing

### View Your Variant

```bash
# Start dev server
npm run dev

# Open variant URL
open "http://localhost:5173/company/role"
```

### Quality Gates

```bash
# Verify all claims
npm run eval:check

# Run security scan
npm run redteam:check
```

---

## 10. Ongoing Maintenance

### Query Your Knowledge Base

**Skill:** `/cv-knowledge-query`

```
"What have I done with Ethereum?"
"Show my infrastructure experience"
"Find achievements about developer tools"
```

### Edit Existing Content

**Skill:** `/cv-content-editor`

```
"Update the case study for Ankr RPC"
"Refine the Galaxy variant bio"
"Add new achievement from my latest project"
```

### Validation Commands

```bash
# Validate all content
npm run validate

# Check variant claims
npm run eval:check

# Security scan
npm run redteam:check
```

---

## Skills Reference

| Skill | When to Use |
|-------|-------------|
| `/cv-data-ingestion` | Initial setup - process raw career data |
| `/cv-content-generator` | Create new case studies, blog posts |
| `/cv-content-editor` | Edit existing content |
| `/cv-knowledge-query` | Search your achievements |
| `/generate-variant` | Create job-targeted portfolio versions |

---

## File Structure Quick Reference

```
source-data/           ← Drop raw data here (gitignored)

content/
├── profile.yaml       ← Identity, hero, about
├── experience/        ← Work history
├── skills/            ← Skill categories
├── testimonials/      ← Recommendations
├── case-studies/      ← Project deep-dives
├── blog/              ← Articles
├── variants/          ← Job-specific versions
└── knowledge/         ← Achievement database
    ├── index.yaml     ← Entity graph
    └── achievements/  ← STAR-format wins

public/
├── images/
│   ├── headshot.jpg   ← Your photo
│   └── logos/         ← Company logos
└── resume.pdf         ← Generated resume

scripts/
├── generate-resume.ts ← PDF generation
├── validate-content.ts ← Schema validation
└── sync-variants.ts   ← YAML → JSON sync
```

---

## Troubleshooting

### Variant Not Loading

**Symptom:** URL shows base portfolio instead of variant

**Fixes:**
1. Check slug matches filename: `/company/role` → `company-role.json`
2. Verify JSON exists: `ls content/variants/company-role.json`
3. Run sync: `npm run variants:sync`
4. Check console for errors in browser DevTools

### API Key Error

**Symptom:** "API key not found" or generation fails

**Fixes:**
1. Check `.env` or `.env.local` exists in project root
2. Verify variable name matches provider:
   - `ANTHROPIC_API_KEY` for Claude
   - `OPENAI_API_KEY` for OpenAI
   - `GEMINI_API_KEY` for Gemini
3. Restart dev server after changing `.env`

### Validation Failed

**Symptom:** `npm run validate` shows errors

**Fixes:**
1. Check YAML syntax (indentation, colons, quotes)
2. Verify required fields exist (see schema in `src/lib/schemas.ts`)
3. Run `npm run validate:variants` for variant-specific checks

### Skill Not Working

**Symptom:** `/skill-name` doesn't execute

**Fixes:**
1. Ensure Claude Code is active in your terminal
2. Check skill exists: `ls .claude/skills/skill-name/`
3. Try manual workflow (see each skill's SKILL.md for alternatives)

### Build Fails

**Symptom:** `npm run build` errors

**Fixes:**
1. Run `npm install` to ensure dependencies
2. Check TypeScript errors: `npx tsc --noEmit`
3. Verify all imports resolve correctly

---

## Checklist

- [ ] Dumped career data into `source-data/`
- [ ] Ran `/cv-data-ingestion` to generate portfolio
- [ ] Added headshot to `public/images/`
- [ ] Ran `npm run validate` with no errors
- [ ] Generated resume with `npm run generate:resume`
- [ ] Previewed at http://localhost:5173
- [ ] Deployed to GitHub Pages
- [ ] Created first case study
- [ ] Generated first job variant

---

## What's Next?

- [Universal CV Guide](./docs/guides/universal-cv.md) - Deep dive into variant generation
- [Capstone Workflow](./docs/guides/capstone-workflow.md) - Quality pipeline for production variants
- [Content Management](./docs/guides/content-management.md) - Schema reference for all content types

---

Good luck with your portfolio!
