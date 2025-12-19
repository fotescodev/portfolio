---
name: cv-data-ingestion
description: Ingest and organize raw career data from Obsidian notes, CSV files, zip archives, and markdown documents into the Universal CV portfolio system. Use when processing career history, work experience, testimonials, case studies, or resume data from multiple sources. Outputs structured YAML/Markdown validated against Zod schemas.
---

# Universal CV Data Ingestion & Organization

Transforms unstructured career data into the portfolio's content structure, ready for variant generation and "hired-on-sight" presentation.

## Target Output Structure

All output goes to the existing `content/` directory:

```
content/
├── profile.yaml              # Identity, hero, about, stats
├── experience/index.yaml     # Work history with rich details
├── case-studies/*.md         # Project deep-dives (frontmatter + markdown)
├── testimonials/index.yaml   # Social proof quotes
├── certifications/index.yaml # Certs and credentials
├── passion-projects/index.yaml
├── skills/index.yaml         # Technical & domain skills
└── variants/                 # Job-specific personalizations
```

## Supported Input Formats

### Obsidian Vault (.md files)
- Daily notes, project notes, work journals
- YAML frontmatter with metadata
- Tags, links, dataview syntax
- Nested folder structures

### CSV Files
- LinkedIn exports
- Spreadsheet data (experience, skills, projects)
- Any structured tabular career data

### Zip Archives
- Mixed content (CSV, text, images, videos)
- Bulk exports from tools
- Compressed vault backups

### Text Files
- Resume text dumps
- Job descriptions
- Performance reviews
- Testimonial snippets

### Images & Media
- Screenshots of achievements
- Certificates
- Project visuals
- Linked for case studies

---

## Processing Workflow

### Phase 1: Data Discovery & Inventory

**Objective**: Map all source files before processing.

```bash
# For Obsidian vault
find [VAULT_PATH] -name "*.md" -type f | head -50

# For zip archive
unzip -l [ARCHIVE_PATH] | head -50

# Categorize by type
find [SOURCE_PATH] -type f \( -name "*.md" -o -name "*.csv" -o -name "*.txt" -o -name "*.json" \)
```

Create an inventory table:
| File | Type | Category | Priority |
|------|------|----------|----------|
| work-history.md | Markdown | Experience | High |
| skills.csv | CSV | Skills | Medium |
| testimonials.txt | Text | Social Proof | High |

### Phase 2: Experience Enrichment

For each work role, extract/synthesize:

```yaml
# Target: content/experience/index.yaml
jobs:
  - company: "Company Name"
    role: "Job Title"
    period: "YYYY – YYYY"
    location: "City, State"
    logo: "/images/logos/company.svg"  # Optional
    highlights:
      - "Achievement with specific metric (e.g., 15× revenue growth)"
      - "Technical accomplishment with stack details"
      - "Cross-functional impact with scope"
      - "Decision/trade-off that shows judgment"
      - "Scale indicator (users, transactions, team size)"
    tags: ["Domain1", "Tech1", "Skill1"]
```

**Enrichment criteria**:
- 5-7 highlights per role (not 3)
- Specific metrics > vague claims
- Technologies and methodologies named
- Collaboration scope mentioned
- Key decisions with trade-offs

### Phase 3: Case Study Mining

Identify projects with case study potential:

**Criteria**:
- Clear problem → approach → result arc
- Quantifiable impact (revenue, users, time saved)
- Decision points with reasoning
- Lessons learned (what worked, what didn't)

```yaml
# Target: content/case-studies/NN-slug.md frontmatter
---
id: [next_available_number]
slug: project-slug
title: "Project Title"
company: "Company Name"
year: "YYYY-YY"
tags: [Tag1, Tag2, Tag3]
duration: "X months"
role: "Your Role"

hook:
  headline: "One-line impact statement"
  impactMetric:
    value: "XX%"
    label: "metric label"
  subMetrics:
    - value: "YY"
      label: "secondary metric"
  thumbnail: /images/case-study-slug.png

cta:
  headline: "Call to action question"
  subtext: "Optional elaboration"
  action: calendly  # or: contact, linkedin
  linkText: "Let's talk →"
---

[Markdown body with: Challenge, Approach, Key Decision, Execution, Results, Learnings]
```

### Phase 4: Testimonial Extraction

Look for:
- Direct quotes from colleagues, managers, clients
- Performance review excerpts
- LinkedIn recommendations
- Slack/email praise snippets

```yaml
# Target: content/testimonials/index.yaml
testimonials:
  - quote: >
      Full testimonial text with specific details about
      collaboration, impact, or skills demonstrated.
    author: "Full Name"  # Or "Engineering Lead" if anonymized
    initials: "FN"
    role: "Their Role"
    company: "Company Name"
    avatar: null  # Or path to image
    featured: true  # For prominent display
```

### Phase 5: Skills Taxonomy

Build structured skills from evidence:

```yaml
# Target: content/skills/index.yaml
categories:
  - name: "Technical Leadership"
    skills:
      - name: "Platform Architecture"
        level: "expert"  # expert, advanced, intermediate
        evidence: "Designed multi-client validator infra at Anchorage"
      - name: "API Design"
        level: "advanced"
        evidence: "Shipped Ankr Advanced APIs, 1M+ daily requests"

  - name: "Web3 & Blockchain"
    skills:
      - name: "Ethereum"
        level: "expert"
        evidence: "First smart contract at Microsoft (2016)"
      - name: "Staking Infrastructure"
        level: "expert"
        evidence: "ETF-grade validator provisioning"
```

### Phase 6: Validation & Gap Analysis

```bash
# Validate all content against Zod schemas
npm run validate

# Check for gaps
```

**Gap checklist**:
- [ ] All required fields populated
- [ ] No placeholder URLs (demo.com, example.com)
- [ ] Metrics are specific, not vague ("improved" → "improved by 40%")
- [ ] Each experience has 5+ highlights
- [ ] At least 5 testimonials for "Wall of Love"
- [ ] All dates in consistent format (YYYY or YYYY–YY)

---

## Schema Reference

### Experience Entry
```typescript
{
  company: string;      // Required
  role: string;         // Required
  period: string;       // Required: "YYYY – YYYY" or "YYYY – Present"
  location: string;     // Required
  logo?: string;        // Optional: path to logo
  highlights: string[]; // Required: 3-7 items
  tags: string[];       // Required: 2-5 tags
}
```

### Case Study Frontmatter
```typescript
{
  id: number;           // Required: unique incremental
  slug: string;         // Required: URL-friendly
  title: string;        // Required
  company: string;      // Required
  year: string;         // Required: "YYYY" or "YYYY-YY"
  tags: string[];       // Required
  duration: string;     // Required
  role: string;         // Required
  hook: {
    headline: string;
    impactMetric: { value: string; label: string };
    subMetrics?: { value: string; label: string }[];
    thumbnail?: string;
  };
  cta: {
    headline: string;
    subtext?: string;
    action: "contact" | "calendly" | "linkedin";
    linkText: string;
  };
  // Optional links
  demoUrl?: string;
  githubUrl?: string;
  docsUrl?: string;
  media?: { type: string; url: string; label?: string }[];
}
```

### Testimonial Entry
```typescript
{
  quote: string;        // Required: the testimonial text
  author: string;       // Required: name or title if anonymized
  initials: string;     // Required: for avatar fallback
  role: string;         // Required
  company: string;      // Required
  avatar?: string;      // Optional: image path
  featured?: boolean;   // Optional: for prominent display
}
```

---

## Automation Outputs

After processing, generate:

1. **Data Lineage Document** (`docs/data-lineage.md`)
   - Source file → target field mapping
   - Transformation notes
   - Decisions made during processing

2. **Gap Analysis Report** (`docs/gap-analysis.md`)
   - Missing required fields
   - Thin content areas
   - Recommended improvements

3. **Processing Summary**
   - Files processed count
   - Content items created/updated
   - Validation status

---

## Example Workflows

### Workflow 1: Obsidian Vault Import

```
User: "I have an Obsidian vault at ~/Documents/Career-Notes with my work history"

Steps:
1. Scan vault for relevant files (work, projects, reviews folders)
2. Parse each markdown file, extract structured data
3. Map to experience/index.yaml format
4. Identify case study candidates
5. Extract any testimonial quotes
6. Validate and report gaps
```

### Workflow 2: LinkedIn Export + Resume

```
User: "I have a LinkedIn CSV export and my resume as text"

Steps:
1. Parse CSV for positions, skills, recommendations
2. Parse resume text for additional details
3. Merge and deduplicate
4. Enrich highlights with specific metrics
5. Create skills taxonomy
6. Validate against schemas
```

### Workflow 3: Zip Archive with Mixed Content

```
User: "I have a zip file with CSV files, text notes, and screenshots"

Steps:
1. Extract archive to temp directory
2. Inventory all files by type
3. Process CSVs for structured data
4. Process text files for testimonials/notes
5. Catalog images for case study thumbnails
6. Consolidate into content structure
7. Clean up temp files
```

---

## Quality Criteria

### "Hired-on-Sight" Standard

Every piece of content should pass this test:

- **Specific**: Numbers, names, technologies — not vague claims
- **Verified**: Can point to source data
- **Impactful**: Shows business/user value, not just activity
- **Consistent**: Formatting, dates, terminology aligned
- **Complete**: No "TODO" or placeholder content

### Validation Commands

```bash
# Full content validation
npm run validate

# Build to catch any issues
npm run build

# Preview locally
npm run dev
```

---

## Tips

- **Preserve source references**: Note which file each piece of data came from
- **Prioritize metrics**: "Shipped feature" < "Shipped feature used by 10K users"
- **Anonymize carefully**: If removing names, keep role context
- **Check dates**: Ensure no overlapping periods, consistent formatting
- **Cross-reference**: Same project might appear in experience AND as case study
- **Images**: Store in `/public/images/`, reference as `/images/filename.png`

---

## Dependencies

- Node.js (for validation scripts)
- `npm run validate` command
- Zod schemas in `src/lib/schemas.ts`

No additional packages required.
