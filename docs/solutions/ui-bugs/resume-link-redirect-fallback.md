---
title: "Resume Link Redirects to Home for Variants Without Generated PDFs"
type: "ui-bug"
severity: "medium"
status: "resolved"
date_identified: "2026-01-13"
date_resolved: "2026-01-13"

category: "ui-bug"
component: "VariantContext (src/context/VariantContext.tsx)"
subsystem: "Resume URL generation"

symptoms:
  - "Clicking 'Download Resume' on variant pages redirects to home page"
  - "Resume link points to non-existent PDF file"
  - "404 error triggers SPA routing fallback to '/'"

root_cause: |
  The getResumeUrl() function assumed every variant has a corresponding PDF at /resumes/${slug}.pdf.
  When the PDF doesn't exist, the 404 triggers React Router's catch-all, redirecting to home.

affected_files:
  - path: "src/context/VariantContext.tsx"
    description: "getResumeUrl() function that generates resume URLs"
  - path: "src/pages/VariantResumePage.tsx"
    description: "Resume page with download button"

tags: [resume, variant, fallback, 404, ui-bug, graceful-degradation]
---

# Resume Link Redirects to Home for Variants Without Generated PDFs

## Problem

Clicking the "Download Resume" link on variant portfolio pages redirected users to the home page instead of downloading a PDF.

### Symptoms

1. User visits variant page (e.g., `/notion/senior-product-manager`)
2. Clicks "Download Resume" button
3. New tab opens showing "Loading..." briefly
4. Tab redirects to home page (`/`)
5. No PDF downloaded

## Root Cause

The `getResumeUrl()` function in `VariantContext.tsx` assumed every variant has a generated PDF:

```typescript
// BEFORE - Always constructed URL from slug
const getResumeUrl = (): string => {
  if (variant) {
    return `/resumes/${variant.metadata.slug}.pdf`;
  }
  return '/resume.pdf';
};
```

When `/resumes/notion-senior-product-manager.pdf` doesn't exist:
1. Browser requests the file
2. GitHub Pages returns 404.html (SPA fallback)
3. React Router receives the path
4. No matching route → redirects to `/`

### Variant-Resume Relationship

Not all variants have generated resumes:
- Variants can be created from job descriptions
- Resume PDFs are generated separately (via Puppeteer)
- `metadata.resumePath` is only set when a resume is generated

```bash
# Check resumes directory
ls public/resumes/
# anaconda-genai-pm.pdf, bloomberg-technical-product-manager.pdf, ...
# No notion-senior-product-manager.pdf!
```

## Solution

### Updated Logic with Graceful Fallback

```typescript
// AFTER - Check for explicit resumePath, fall back to default
const getResumeUrl = (): string => {
  if (variant) {
    // Use explicit resumePath if set (indicates resume was generated)
    if (variant.metadata.resumePath) {
      return variant.metadata.resumePath;
    }
    // Graceful fallback: use default resume instead of 404
    return '/resume.pdf';
  }
  return '/resume.pdf';
};
```

### Files Changed

1. **`src/context/VariantContext.tsx`** - Updated `getResumeUrl()` function
2. **`src/pages/VariantResumePage.tsx`** - Added `resumeUrl` prop with fallback logic

### Commit

```
fix: graceful resume fallback for variants without generated PDFs

- VariantContext now checks for metadata.resumePath before assuming PDF exists
- Falls back to /resume.pdf when variant doesn't have a generated resume
- Prevents 404 redirect loop when clicking resume link on variants
```

## Variant-Resume Pairing Workflow

For variants to have custom resumes, follow this workflow:

### 1. Generate Variant
```bash
npx ts-node scripts/generate-variant.ts --company "Notion" --role "Senior PM"
# Creates variant in Convex with slug: notion-senior-pm
```

### 2. Generate Resume PDF
```bash
npx ts-node scripts/generate-resume.ts --slug notion-senior-pm
# Creates public/resumes/notion-senior-pm.pdf
```

### 3. Update Variant Metadata
```bash
npx convex run variants:upsert '{
  "slug": "notion-senior-pm",
  "data": {
    "metadata": {
      "resumePath": "/resumes/notion-senior-pm.pdf"
    }
  }
}'
```

### 4. Publish Variant
```bash
npx convex run variants:updateStatus '{
  "slug": "notion-senior-pm",
  "publishStatus": "published"
}'
```

## Prevention

### 1. Validation Test

```typescript
// src/tests/pipeline/resume-generation.test.ts
it('should have resumePath in variant YAML matching actual PDF', () => {
  variants.forEach(variant => {
    const resumePath = variant.metadata?.resumePath;
    if (resumePath) {
      const pdfPath = path.join(RESUMES_DIR, path.basename(resumePath));
      expect(fs.existsSync(pdfPath)).toBe(true);
    }
  });
});
```

### 2. Schema Enforcement

The `resumePath` field is already optional in the schema:

```typescript
// src/lib/schemas.ts:278
resumePath: z.string().optional() // Path to generated resume PDF
```

### 3. Graceful Degradation Pattern

Always provide fallbacks for optional resources:

```typescript
// Pattern: Check explicit value → Fall back to default
const resourceUrl = variant?.metadata?.resourcePath || '/default-resource.pdf';
```

## Related Files

- `docs/solutions/deployment-issues/production-variant-routes-redirect.md` - Related variant routing issue
- `src/lib/schemas.ts` - Variant metadata schema with `resumePath` field
- `public/resumes/` - Directory containing generated resume PDFs
- `public/resume.pdf` - Default fallback resume

## Key Learnings

1. **Never assume files exist** - Always validate or provide fallbacks for dynamically constructed paths

2. **SPA 404 handling masks issues** - When a file doesn't exist, the SPA fallback can make debugging harder. The user sees a redirect, not a 404.

3. **Optional metadata requires fallbacks** - If a field is optional (`resumePath?: string`), code using it must handle the undefined case.
