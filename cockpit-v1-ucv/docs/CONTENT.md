# Content Management Guide

Complete guide for managing content in the portfolio.

## Overview

The portfolio uses a **file-based content system** with:
- ✅ **Auto-discovery** - Drop files and they appear
- ✅ **Type safety** - Zod validation catches errors
- ✅ **Hot reload** - See changes instantly in development
- ✅ **Templates** - Copy-paste starter files

## Content Types

| Type | Location | Format | Auto-discovered |
|------|----------|--------|-----------------|
| Case Studies | `content/case-studies/` | Markdown + YAML | Yes |
| Passion Projects | `content/passion-projects/index.yaml` | YAML array | No |
| Blog Posts | `content/blog/` | Markdown + YAML | Yes |
| Profile | `content/profile.yaml` | YAML | No |
| Experience | `content/experience/index.yaml` | YAML | No |
| Testimonials | `content/testimonials/index.yaml` | YAML | No |
| Certifications | `content/certifications/index.yaml` | YAML | No |

---

## Adding New Content

### Case Study

1. **Copy template:**
```bash
cp content/_templates/case-study.md content/case-studies/05-my-project.md
```

2. **Edit frontmatter:**
   - Update `id` (next available: 5, 6, 7...)
   - Set unique `slug`
   - Fill all required fields
   - Remove optional fields you don't need

3. **Write content:**
   - Use markdown below the `---` delimiter
   - Follow existing structure
   - Include metrics, decisions, learnings

4. **Validate:**
```bash
npm run validate
```

5. **Preview:**
```bash
npm run dev
# Visit http://localhost:5173
```

**File naming:** `NN-slug.md` where NN is the ID padded with zeros

---

### Passion Project

1. **Copy template entry:**
```bash
cat content/_templates/passion-project-entry.yaml
```

2. **Edit `content/passion-projects/index.yaml`:**
   - Add new entry to `projects` array
   - Update `id` (next number in sequence)
   - Fill required fields
   - Set URLs to `null` if not applicable

3. **Validate:**
```bash
npm run validate
```

**Example:**
```yaml
projects:
  # ... existing projects
  - id: 10
    slug: my-new-project
    title: My Project
    tagline: What it does in one line
    year: "2024"
    tags: [CLI, Tools]
    thumbnail: null
    githubUrl: https://github.com/user/repo
    liveUrl: null
    docsUrl: null
```

---

### Blog Post

1. **Copy template:**
```bash
cp content/_templates/blog-post.md content/blog/2024-12-15-my-post.md
```

**Important:** Filename must follow `YYYY-MM-DD-slug.md` format

2. **Edit frontmatter:**
   - Update `title`
   - Set `date` (YYYY-MM-DD)
   - Write compelling `excerpt`
   - Add relevant `tags`

3. **Write content:**
   - Markdown body below `---`
   - Use headings, lists, code blocks
   - Add images if needed

4. **Validate:**
```bash
npm run validate
```

---

## Content Validation

### Automatic Validation

The build process validates all content automatically:
```bash
npm run build  # Fails if content is invalid
```

### Manual Validation

Run validation CLI anytime:
```bash
npm run validate
```

**Output:**
```
✓ Profile (profile.yaml)
✓ Case Study: 01-eth-staking.md
✗ Case Study: 05-new-project.md
  ✗ hook.impactMetric.value: Required
  ✗ year: Invalid format
```

### What Gets Validated

- ✅ **Required fields** - No missing data
- ✅ **Data types** - Strings, numbers, arrays
- ✅ **Format** - Dates, emails, URLs
- ✅ **Nested objects** - hook, cta, media
- ✅ **Arrays** - tags, subMetrics, highlights

---

## Field Reference

### Case Study Frontmatter

**Required:**
```yaml
id: 5                    # Number, unique, incremental
slug: my-project         # String, URL-friendly
title: Project Title     # String
company: Company Name    # String
year: 2024-25           # String (YYYY or YYYY-YY)
tags: [Tag1, Tag2]      # Array of strings
duration: 6 months       # String
role: Product Manager    # String

hook:
  headline: One-liner    # String
  impactMetric:
    value: "50%"        # String (can include symbols)
    label: improvement   # String
  thumbnail: /images/x.png  # String or null

cta:
  headline: CTA text     # String
  action: calendly       # Enum: contact|calendly|linkedin
  linkText: Let's talk → # String
```

**Optional:**
```yaml
demoUrl: https://...           # String or null
githubUrl: https://...         # String or null
docsUrl: https://...           # String or null

hook:
  subMetrics:                  # Array (optional)
    - value: "10K"
      label: users

media:                         # Array (optional)
  - type: blog                 # Enum: blog|twitter|linkedin|video|article|slides
    url: https://...
    label: Custom Label        # String (optional)

cta:
  subtext: Additional text     # String (optional)
```

---

### Blog Post Frontmatter

**Required:**
```yaml
title: "Post Title"       # String (quoted)
date: "2024-12-15"        # String, YYYY-MM-DD format
excerpt: "Description"    # String (quoted)
tags: ["Tag1", "Tag2"]    # Array of strings
```

**Optional:**
```yaml
thumbnail: /images/thumb.png  # String or null
```

---

### Passion Project Entry

**Required:**
```yaml
id: 10                   # Number, unique
slug: project-slug       # String, URL-friendly
title: Project Name      # String
tagline: One-liner       # String
year: "2024"            # String (quoted)
tags: [Tag1, Tag2]      # Array
```

**Optional:**
```yaml
thumbnail: null          # String or null
githubUrl: null          # String or null
liveUrl: null            # String or null
docsUrl: null            # String or null
```

---

## Common Tasks

### Get Next Available ID

**Case Studies:**
```bash
# Count existing + 1
ls content/case-studies/*.md | wc -l
# Next ID = count + 1
```

**Passion Projects:**
```bash
# Find highest ID
grep 'id:' content/passion-projects/index.yaml | sort -n | tail -1
# Add 1
```

### Toggle Section Visibility

Edit `content/profile.yaml`:
```yaml
sections:
  beyondWork: false
  blog: true           # Show/hide blog section
  onchainIdentity: false
  skills: false
  passionProjects: true  # Show/hide passion projects
```

### Update Profile Stats

Edit `content/profile.yaml`:
```yaml
about:
  stats:
    - value: "8+"
      label: "Years in Product"
    - value: "5"
      label: "Years in Web3"
```

### Add Social Link

Edit `content/social/index.yaml`:
```yaml
links:
  - platform: GitHub
    label: "@username"
    url: https://github.com/username
    icon: github
    primary: true
```

---

## Best Practices

### Content Writing

1. **Headlines** - One sentence, active voice, metric-driven
2. **Slugs** - Lowercase, hyphens, descriptive
3. **Tags** - 3-5 relevant tags, consistent naming
4. **Metrics** - Specific numbers, context-aware labels
5. **Images** - Store in `/public/images/`, reference as `/images/name.png`

### File Organization

```
content/
├── _templates/          # Templates (don't edit originals)
├── case-studies/        # One file per case study
│   ├── 01-project.md
│   └── 02-project.md
├── blog/                # Date-prefixed files
│   └── YYYY-MM-DD-slug.md
└── passion-projects/
    └── index.yaml       # All projects in one file
```

### Validation Workflow

```bash
# 1. Make changes
vim content/case-studies/05-new-project.md

# 2. Validate
npm run validate

# 3. Fix errors if any
# 4. Preview locally
npm run dev

# 5. Commit
git add content/
git commit -m "Add new case study"
```

---

## Troubleshooting

### Validation Errors

**"Required field missing"**
- Check template for required fields
- Ensure no typos in field names

**"Invalid date format"**
- Dates must be `YYYY-MM-DD`
- Wrap in quotes: `"2024-12-15"`

**"Invalid year format"**
- Use `2024` or `2024-25` format
- No other formats accepted

**"Frontmatter parse error"**
- Check YAML syntax
- Ensure proper indentation (2 spaces)
- Quotes around strings with special chars

### Build Errors

**"Cannot find module"**
- File might be outside `content/` directory
- Check file paths in frontmatter

**"Zod validation failed"**
- Run `npm run validate` for details
- Fix indicated fields

### Hot Reload Not Working

```bash
# Restart dev server
npm run dev
```

---

## Advanced

### Custom Validation

Schemas are in `src/lib/schemas.ts`. To add custom validation:

```typescript
// Add to existing schema
export const CustomSchema = z.object({
  field: z.string().min(10).max(100),
  url: z.string().url(),
  email: z.string().email()
});
```

### Pre-commit Hook

Add validation to git hooks (optional):

```bash
# .git/hooks/pre-commit
#!/bin/sh
npm run validate || exit 1
```

---

## Quick Reference

| Task | Command |
|------|---------|
| Validate content | `npm run validate` |
| Start dev server | `npm run dev` |
| Build for production | `npm run build` |
| Run tests | `npm test` |
| Find templates | `ls content/_templates/` |

---

## Support

- **Templates**: `/content/_templates/README.md`
- **Schemas**: `/src/lib/schemas.ts`
- **Validation**: `/scripts/validate-content.ts`
- **Types**: `/src/types/portfolio.ts`

For questions, check existing content files for examples.
