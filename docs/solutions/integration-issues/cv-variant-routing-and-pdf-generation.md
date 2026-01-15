---
title: CV Portfolio Variant System - URL Routing, PDF Generation, and Slug Fixes
category: integration-issues
components: [dashboard, variants, resume, convex, routing]
date: 2026-01-15
symptoms:
  - Variant pages return 404 for multi-word company names
  - Resume link goes to /resume.pdf instead of variant-specific page
  - New variants require manual publish step
  - PDF generation requires server-side Puppeteer
  - Slugs are excessively long (40-80 chars)
tags: [url-routing, slug-generation, pdf-generation, variant-status, client-side, convex]
---

# CV Portfolio Variant System Fixes

## Overview

This document captures five interrelated issues fixed in the CV Portfolio variant system, all related to how variants are created, routed, and displayed.

## Issues & Solutions

### 1. Dashboard URL Routing Bug

**Symptom:** Clicking "View Portfolio" for variants with multi-word company names (e.g., "Catena Labs") led to 404 errors.

**Root Cause:** The dashboard's `buildVariantUrl()` function was building URLs from metadata `company` and `role` fields, which didn't match the stored slug format.

- Stored slug: `catena-labs-senior-product-manager-ai-financial-services`
- URL built from metadata: `/catena-labs/senior-product-manager-ai-financial-services`
- Expected URL: `/catena/labs-senior-product-manager...` (split on first hyphen)

**Solution:** Changed `buildVariantUrlFromSlug()` to parse the slug directly:

```javascript
// public/cv-dashboard/index.html
function buildVariantUrlFromSlug(slug) {
  const firstDash = slug.indexOf('-');
  if (firstDash === -1) {
    return `${BASE_URL}/${slug}`;
  }
  const company = slug.substring(0, firstDash);
  const role = slug.substring(firstDash + 1);
  return `${BASE_URL}/${company}/${role}`;
}
```

**Why it works:** The frontend `VariantPortfolio.tsx` reconstructs slugs by joining URL params with a hyphen. Splitting on the first hyphen ensures the reconstruction matches.

---

### 2. Resume Link Pointing to Static PDF

**Symptom:** Clicking "Resume" on the portfolio page went to `/resume.pdf` instead of the variant-specific resume page.

**Root Cause:** `getResumeUrl()` in `VariantContext.tsx` returned the static PDF path as fallback:

```javascript
// Before
return variant.metadata.resumePath || '/resume.pdf';
```

**Solution:** Return the resume page URL instead:

```javascript
// src/context/VariantContext.tsx
const getResumeUrl = (): string => {
  if (variant) {
    const slug = variant.metadata.slug;
    const firstDash = slug.indexOf('-');
    if (firstDash === -1) {
      return `/${slug}/resume`;
    }
    const company = slug.substring(0, firstDash);
    const role = slug.substring(firstDash + 1);
    return `/${company}/${role}/resume`;
  }
  return '/resume';
};
```

**Why it works:** The resume page now renders variant-specific content with client-side PDF generation.

---

### 3. Variants Created as Draft

**Symptom:** New variants created via the dashboard wizard weren't visible until manually published.

**Root Cause:** `generateVariant` action saved with `publishStatus: "draft"`:

```javascript
// Before
publishStatus: "draft",
```

**Solution:** Auto-publish on creation:

```javascript
// convex/generate.ts
publishStatus: "published",
```

**Why it works:** For the mobile-first workflow, variants should be immediately shareable. The "PENDING" badge refers to job application status, not variant visibility.

---

### 4. No Client-Side PDF Generation

**Symptom:** Variant-specific PDF resumes required running a Puppeteer script on the server.

**Root Cause:** Architecture assumed server-side PDF generation would be available.

**Solution:** Added client-side PDF generation using html2canvas + jsPDF:

```typescript
// src/pages/VariantResumePage.tsx
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const generatePDF = async () => {
  const canvas = await html2canvas(resumeRef.current, {
    scale: 2,
    backgroundColor: '#ffffff',
  });

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'in',
    format: 'letter',
  });

  pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 8.5, 11);
  pdf.save(`${variantSlug}-resume.pdf`);
};
```

**Why it works:** The resume page already renders variant-specific content. Capturing it as an image and converting to PDF works entirely in the browser.

---

### 5. Excessively Long Slugs

**Symptom:** Slugs like `catena-labs-senior-product-manager-ai-financial-services` were hard to share and broke QR codes.

**Root Cause:** Full role titles were slugified without abbreviation.

**Solution:** Added `abbreviateRole()` function:

```javascript
// convex/generate.ts
function abbreviateRole(role: string): string {
  let abbreviated = role.toLowerCase()
    .replace(/product manager/gi, "pm")
    .replace(/program manager/gi, "tpm")
    .replace(/technical account manager/gi, "tam")
    .replace(/senior/gi, "sr")
    .replace(/principal/gi, "prin");

  // Limit to ~30 chars
  if (abbreviated.length > 30) {
    const parts = abbreviated.split("-");
    let result = "";
    for (const part of parts) {
      if ((result + "-" + part).length > 30) break;
      result = result ? result + "-" + part : part;
    }
    abbreviated = result;
  }
  return slugify(abbreviated);
}

const slug = `${slugify(args.company)}-${abbreviateRole(args.role)}`;
```

**Why it works:** Common role titles are abbreviated to standard terms (PM, TPM, TAM, etc.), and the total length is capped at ~30 characters.

---

## Files Modified

| File | Change |
|------|--------|
| `public/cv-dashboard/index.html` | URL building from slug |
| `src/context/VariantContext.tsx` | Resume URL returns page path |
| `src/pages/VariantResumePage.tsx` | Client-side PDF generation |
| `src/pages/ResumePage.css` | Button styling, spinner animation |
| `convex/generate.ts` | Auto-publish, role abbreviation |
| `package.json` | Added html2canvas, jspdf |

## Prevention Strategies

### Design Principles

1. **Single Source of Truth for Slugs** - Slug is stored in Convex; all URL construction derives from it
2. **Explicit Over Implicit** - Auto-publish is the default; draft requires explicit action
3. **Client-Side First** - PDF generation works offline/mobile without server infrastructure
4. **URL Length Constraints** - Slugs are abbreviated to stay under 30 chars

### Testing Checklist

- [ ] Create variant with multi-word company name → URL works
- [ ] Click Resume on portfolio page → Goes to `/company/role/resume`
- [ ] Create new variant → Immediately visible (published)
- [ ] Click "Download PDF" on resume page → PDF downloads
- [ ] New variant slug → Under 30 characters

### Code Review Items

When reviewing variant-related changes:

- [ ] URL construction uses slug, not metadata fields
- [ ] Resume links go to page URLs, not PDF files
- [ ] New variants default to published status
- [ ] Role titles are abbreviated in slugs
