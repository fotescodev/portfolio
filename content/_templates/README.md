# Content Templates

This directory contains templates for creating new content in the portfolio.

## Available Templates

### 1. Case Study (`case-study.md`)

**When to use:** For in-depth project writeups with rich context, metrics, and learnings.

**How to use:**
```bash
# Copy template to case-studies directory
cp content/_templates/case-study.md content/case-studies/05-my-project.md

# Edit the file and fill in:
# - Frontmatter (YAML between --- markers)
# - Markdown content below
```

**Required fields:**
- `id`: Incremental number (5, 6, 7...)
- `slug`: URL-friendly identifier
- `title`, `company`, `year`, `tags`
- `duration`, `role`
- `hook.headline`, `hook.impactMetric`, `hook.thumbnail`
- `cta.headline`, `cta.action`, `cta.linkText`

**Optional fields:**
- `demoUrl`, `githubUrl`, `docsUrl`
- `hook.subMetrics`
- `media` array
- `cta.subtext`

---

### 2. Blog Post (`blog-post.md`)

**When to use:** For articles, insights, and thoughts you want to share.

**How to use:**
```bash
# Copy template with date prefix
cp content/_templates/blog-post.md content/blog/2024-12-15-my-post-title.md

# Edit the file
```

**File naming:** `YYYY-MM-DD-slug.md` (slug extracted automatically)

**Required fields:**
- `title`: Post title
- `date`: YYYY-MM-DD format
- `excerpt`: One-line description
- `tags`: Array of tags

**Optional fields:**
- `thumbnail`: Image path or null

---

### 3. Passion Project (`passion-project-entry.yaml`)

**When to use:** For side projects, tools, and experiments.

**How to use:**
```bash
# 1. Copy the entry from the template
# 2. Edit content/passion-projects/index.yaml
# 3. Add the new entry to the projects array
```

**Required fields:**
- `id`: Next available number
- `slug`: URL-friendly identifier
- `title`: Project name
- `tagline`: One-line description
- `year`: Year created
- `tags`: Array of tags

**Optional fields:**
- `thumbnail`: Image path or null
- `githubUrl`, `liveUrl`, `docsUrl`

---

## Validation

Before committing, always validate your content:

```bash
npm run validate
```

This checks:
- All required fields are present
- Data types are correct
- Dates are properly formatted
- No duplicate IDs

## Getting Next ID

**Case Studies:**
```bash
ls content/case-studies/ | grep -oP '^\d+' | sort -n | tail -1
# Add 1 to the result
```

**Passion Projects:**
```bash
grep -oP 'id: \K\d+' content/passion-projects/index.yaml | sort -n | tail -1
# Add 1 to the result
```

## Tips

1. **Use meaningful slugs** - They become part of the URL
2. **Write compelling headlines** - They appear in card previews
3. **Validate early** - Run `npm run validate` before finishing
4. **Keep it consistent** - Follow the patterns in existing content
5. **Test locally** - Run `npm run dev` to preview changes

## Questions?

See `/docs/CONTENT.md` for comprehensive content management documentation.
