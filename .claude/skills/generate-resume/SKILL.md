---
name: generate-resume
description: Generate a print-optimized, ATS-friendly single-page resume PDF from portfolio content. Use when user wants to create or regenerate their resume. (project)
---

# Resume Generator

## Overview

Generates a single-page PDF resume using Puppeteer to render the `/resume` React page. The resume is optimized for ATS (Applicant Tracking Systems) and print.

## When to Use

Activate this skill when the user:
- Asks to generate, create, or update their resume
- Says "create my resume", "make a resume", "export resume PDF"
- Wants to refresh the resume after updating portfolio content
- Asks about resume format or PDF generation

## Critical Files

| File | Purpose |
|------|---------|
| `src/pages/ResumePage.tsx` | React component for print-optimized layout |
| `src/pages/ResumePage.css` | Print/screen styles with theme isolation |
| `scripts/generate-resume.ts` | Puppeteer PDF generation script |
| `public/resume.pdf` | Default output file |

## Format Guidelines

### Layout Constants (ResumePage.tsx)

```typescript
const RESUME_CONFIG = {
  SUMMARY_SKILL_CATEGORIES: 2,   // Categories in impact summary
  SKILLS_PER_CATEGORY: 3,        // Skills per category in summary
  SUMMARY_COMPANIES: 4,          // Companies to list in summary
  MAX_JOBS: 5,                   // Maximum jobs shown (for single-page fit)
  MAX_HIGHLIGHTS_PER_JOB: 3,     // Bullets per job (action → outcome format)
};
```

### Typography (ResumePage.css)

- **Font**: Georgia / Times New Roman (ATS-safe serif)
- **Base size**: 9.5pt
- **Line height**: 1.35
- **Page**: Letter size (8.5in × 11in)
- **Margins**: 0.4in top/bottom, 0.5in left/right

### ATS-Friendly Structure

1. **Header**: Name / Role + contact info (email, location)
2. **Impact Summary**: Tagline + top skills + company names + stats
3. **Professional Experience**: Company, location, period, role, bullets
4. **Skills**: Pipe-separated categories (e.g., "TypeScript, React | Node.js, PostgreSQL")

## Known Issues & Fixes

### 1. Black Box at Bottom of PDF

**Cause:** ThemeProvider applies dark background (#08080a) to body/#root, which bleeds into the PDF outside the `.resume-page` container.

**Fix:** CSS must override parent elements in `@media print`:

```css
@media print {
  html,
  body,
  #root {
    background: white !important;
    min-height: auto !important;
    padding: 0 !important;
    margin: 0 !important;
  }
}
```

### 2. PDF Exceeds One Page

**Fix:** Reduce `MAX_JOBS` (default: 5) and `MAX_HIGHLIGHTS_PER_JOB` (default: 3) in ResumePage.tsx.

### 3. Yellow/Colored Underline on Role Title

**Fix:** Ensure `.resume-role-highlight` has no border-bottom or background-color.

### 4. Theme Colors Bleeding Through

**Fix:** Reset all children with:

```css
.resume-page * {
  background: transparent;
  color: inherit;
}
```

### 5. Fonts Not Loading in PDF

**Fix:** The script waits for `document.fonts.ready` + 500ms buffer. If fonts still don't load, increase `POST_FONT_BUFFER_MS` in `generate-resume.ts`.

## Generation Workflow

### Prerequisites

1. **Dev server running**: `npm run dev`
2. **Content files exist**:
   - `content/profile.yaml` (name, email, location)
   - `content/experience/index.yaml` (jobs with highlights)
   - `content/skills/index.yaml` (categorized skills)

### Steps

1. **Preview first** at http://localhost:5173/resume
2. **Verify** single-page fit (no vertical scrollbar)
3. **Check** content is correct and complete
4. **Generate**:

```bash
npm run generate:resume
```

5. **Verify** output at `public/resume.pdf`

### Custom Filename

```bash
npm run generate:resume -- --name "Jane Smith"
# Output: public/jane-smith.pdf
```

### Custom URL

```bash
npm run generate:resume -- --url http://localhost:3000
# Uses different dev server port
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "net::ERR_CONNECTION_REFUSED" | Start dev server: `npm run dev` |
| PDF is blank | Check browser console at /resume for React errors |
| Wrong content displayed | Verify YAML files, run `npm run validate` |
| Fonts look wrong | Increase `POST_FONT_BUFFER_MS` in script |
| Two pages instead of one | Reduce MAX_JOBS or MAX_HIGHLIGHTS_PER_JOB |
| Dark background in PDF | Verify print CSS overrides html/body/#root |

## After Generation

Update hero CTA in `content/profile.yaml` to link to the resume:

```yaml
hero:
  cta:
    secondary:
      label: "Download Resume"
      href: "/resume.pdf"
```

## Technical Details

### Puppeteer Configuration (generate-resume.ts)

```typescript
const PAGE_DIMENSIONS = {
  LETTER: {
    WIDTH_PX: 816,   // 8.5" at 96dpi
    HEIGHT_PX: 1056, // 11" at 96dpi
  },
};

const TIMING = {
  POST_FONT_BUFFER_MS: 500,    // Wait after fonts.ready
  PAGE_LOAD_TIMEOUT_MS: 30000, // Navigation timeout
};
```

### PDF Export Settings

```typescript
await page.pdf({
  path: output,
  format: 'letter',
  printBackground: true,
  margin: {
    top: '0.4in',
    right: '0.5in',
    bottom: '0.4in',
    left: '0.5in',
  },
  preferCSSPageSize: true,
});
```

## Content Sources

The resume pulls data from these content files:

| Data | Source | Field |
|------|--------|-------|
| Name | `profile.yaml` | `name` |
| Email | `profile.yaml` | `email` |
| Location | `profile.yaml` | `location` |
| Tagline | `profile.yaml` | `about.tagline` |
| Stats | `profile.yaml` | `about.stats[]` |
| Jobs | `experience/index.yaml` | `jobs[]` |
| Skills | `skills/index.yaml` | `categories[].skills[]` |

## Quality Checklist

Before generating:

- [ ] Content YAML files pass validation (`npm run validate`)
- [ ] Preview at /resume shows correct info
- [ ] Resume fits on single page (no scrollbar)
- [ ] All highlights follow "Action → Outcome" format
- [ ] Metrics are quantified (%, $, numbers)

After generating:

- [ ] Open PDF and verify visual appearance
- [ ] Check all text is selectable (ATS-friendly)
- [ ] Verify no dark backgrounds or visual artifacts
- [ ] Test PDF in an ATS simulator if available
