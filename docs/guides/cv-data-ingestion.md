# CV Data Ingestion Guide

## Overview

The `cv-data-ingestion` skill transforms unstructured career data (Obsidian notes, CSVs, zip archives, resumes) into the portfolio's validated content structure.

**Location**: `.claude/skills/cv-data-ingestion/SKILL.md`

---

## Quick Reference

### When to Use

- Importing career data from Obsidian vaults
- Processing LinkedIn exports
- Enriching experience entries with metrics
- Mining case study material from project docs
- Extracting testimonials from reviews/recommendations

### Key Improvements (v2 - Dec 2025)

| Feature | Description |
|---------|-------------|
| **Schema-First** | Always read `src/lib/schemas.ts` before writing ANY content |
| **Pre-Validation** | Validate structure in memory before file writes |
| **AI Summary Detection** | Use existing AI summaries as primary source |
| **Confidence Scoring** | Flag uncertain extractions for user review |
| **Link Extraction** | Extract company URLs for verification |
| **Testimonial Heuristics** | Distinguish personal vs project quotes |

---

## Critical Schema Constraints

**Read these BEFORE writing content files:**

### Skills (Most Common Error)

```yaml
# WRONG - Will fail validation
skills:
  - name: "Ethereum"
    level: "expert"

# CORRECT - Simple strings only
skills:
  - "Ethereum"
  - "Staking Infrastructure"
```

### Case Study Media Types

Only these values are allowed:
```
blog | twitter | linkedin | video | article | slides
```

### Experience Highlights

```yaml
# WRONG - Objects
highlights:
  - achievement: "Grew revenue"
    metric: "15x"

# CORRECT - Simple strings
highlights:
  - "Grew revenue 15x through API monetization"
```

---

## Workflow Phases

### Phase 0: Schema Understanding (MANDATORY)

```bash
# ALWAYS start by reading the schema
Read src/lib/schemas.ts
```

### Phase 1: Data Discovery

1. **Check for AI summaries first** (Gemini reviews, Claude outputs)
2. Inventory source files with confidence scores
3. Prioritize structured sources over raw notes

### Phase 2: Experience Enrichment

- Extract company URLs (e.g., `mempools.com`)
- Use 5-7 highlights per role (not 3)
- Flag low-confidence metrics with `[VERIFY]`

### Phase 3: Case Study Mining

- Look for problem → approach → result arcs
- Verify media type enum values before writing
- Include quantifiable metrics

### Phase 4: Testimonial Extraction

**Personal testimonials** (USE):
- "Working with [Name]..."
- "I recommend..."
- Contains personal qualities

**Project quotes** (DO NOT USE as testimonials):
- "The project delivered..."
- "The team achieved..."

### Phase 5: Skills Taxonomy

- Use simple strings (schema limitation)
- Preserve evidence in YAML comments
- Categories: Technical, Domain, Leadership, etc.

### Phase 6: Validation

```bash
npm run validate
```

---

## Confidence Scoring System

| Level | Criteria | Action |
|-------|----------|--------|
| **High** | Exact quote, verified metric | Use directly |
| **Medium** | Synthesized, approximated | Use with note |
| **Low** | Inferred, placeholder `[X%]` | Flag for review |

---

## Link Extraction

Always extract company URLs for verification:

| Company Type | URL Priority |
|-------------|--------------|
| Active startup | Official website |
| Enterprise | Careers/about page |
| Acquired | Parent company or press |
| Defunct | LinkedIn or archive.org |

---

## Common Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `Cannot read 'map'` | Object instead of string array | Use simple strings |
| `Invalid enum value` | Wrong media type | Use allowed types only |
| `Required field missing` | Forgot `featured` on testimonial | Add `featured: true/false` |

---

## Output Files

| Content Type | Target Path |
|-------------|-------------|
| Experience | `content/experience/index.yaml` |
| Skills | `content/skills/index.yaml` |
| Testimonials | `content/testimonials/index.yaml` |
| Case Studies | `content/case-studies/NN-slug.md` |
| Gap Analysis | `docs/gap-analysis.md` |

---

## Related Documentation

- **Full Skill Definition**: `.claude/skills/cv-data-ingestion/SKILL.md`
- **Templates**: `.claude/skills/cv-data-ingestion/TEMPLATES.md`
- **Process Log**: `docs/data-ingestion-process-log.md`
- **Gap Analysis**: `docs/gap-analysis.md`
- **Content Schema**: `src/lib/schemas.ts`

---

## Invoking the Skill

```
/cv-data-ingestion
```

Or describe your data source:
> "I have an Obsidian vault at ~/Career-Notes with my work history"
