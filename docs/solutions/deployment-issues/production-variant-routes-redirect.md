---
title: "Production Variant Routes Redirect to Base URL"
type: "deployment-issue"
severity: "high"
status: "resolved"
date_identified: "2026-01-13"
date_resolved: "2026-01-13"

category: "deployment-issue"
component: "Variant Portfolio (src/pages/VariantPortfolio.tsx)"
subsystem: "Environment configuration & variant publishing"

symptoms:
  - "Navigating to variant URLs (e.g., edgeoftrust.com/notion/senior-product-manager) shows 'Loading...' then redirects to '/'"
  - "Console shows 404 error for the route"
  - "React app loads successfully with 200 status on all assets"
  - "Variant data exists in Convex database but is not displayed"

root_cause: |
  Two-part failure in variant delivery pipeline:
  1. GitHub Actions secret VITE_CONVEX_URL pointed to wrong Convex instance (happy-otter-123.convex.cloud instead of scintillating-husky-549.convex.cloud)
  2. Variant publishStatus was "draft" instead of "published" - the getBySlug query filters unpublished variants

affected_files:
  - path: ".github/workflows/deploy.yml"
    description: "GitHub Actions workflow referencing VITE_CONVEX_URL secret"
  - path: "src/pages/VariantPortfolio.tsx"
    description: "Page component that loads variant data via useVariant hook"
  - path: "src/lib/variants.ts"
    description: "useVariant hook that fetches variant from Convex"
  - path: "convex/variants.ts"
    description: "getBySlug query that filters by publishStatus === 'published'"

tags: [deployment, environment-configuration, convex, variant-routing, github-actions, database-status]
---

# Production Variant Routes Redirect to Base URL

## Problem

Variant portfolio routes (e.g., `edgeoftrust.com/notion/senior-product-manager`) were showing "Loading..." briefly then redirecting to the home page instead of displaying the personalized portfolio variant.

### Symptoms

1. Page shows "Loading..." text briefly
2. Immediately redirects to `/` (home page)
3. Console shows 404 error for the route itself
4. All JavaScript assets load successfully (200 status)
5. Variant data confirmed to exist in Convex database

## Investigation

### Step 1: Verify SPA Routing
```bash
# Check if 404.html exists (needed for GitHub Pages SPA routing)
curl -s "https://edgeoftrust.com/404.html" | head -20
# Result: 404.html exists and contains the SPA shell
```

### Step 2: Check Network Requests
Browser dev tools showed all assets loading correctly. The issue was not with asset delivery.

### Step 3: Verify Variant Exists in Database
```bash
npx convex run variants:listAll | grep -i "notion"
# Result: Variant exists with slug "notion-senior-product-manager"
```

### Step 4: Compare Convex URLs
```bash
# Check URL in production bundle
curl -s "https://edgeoftrust.com/assets/index-*.js" | grep -oE "https://[a-z0-9-]+\.convex\.cloud"
# Result: https://happy-otter-123.convex.cloud

# Check local .env.local
cat .env.local | grep VITE_CONVEX_URL
# Result: https://scintillating-husky-549.convex.cloud
```

**Finding**: Production bundle had wrong Convex URL!

### Step 5: Check Variant Publish Status
```bash
npx convex run variants:listAll | grep -A5 "notion"
# Result: publishStatus: "draft"
```

**Finding**: Variant was not published!

## Root Causes

### Cause 1: Wrong Convex URL in GitHub Secret

The `VITE_CONVEX_URL` GitHub Actions secret was set to an old/test Convex deployment:
- **Production had**: `https://happy-otter-123.convex.cloud`
- **Should have been**: `https://scintillating-husky-549.convex.cloud`

This caused the production app to query a different Convex database that didn't have the variant data.

### Cause 2: Variant Not Published

The `getBySlug` query in `convex/variants.ts` filters by publish status:

```typescript
// convex/variants.ts:32
if (!variant || variant.publishStatus !== "published") {
  return null;
}
```

The variant had `publishStatus: "draft"`, so the query returned `null`, triggering the redirect in `VariantPortfolio.tsx`:

```typescript
// src/pages/VariantPortfolio.tsx:52-54
if (!variant) {
  return <Navigate to="/" replace />;
}
```

## Solution

### Fix 1: Update GitHub Secret

```bash
# Delete and recreate the secret with correct URL
gh secret delete VITE_CONVEX_URL --repo fotescodev/portfolio
gh secret set VITE_CONVEX_URL --body "https://scintillating-husky-549.convex.cloud" --repo fotescodev/portfolio

# Trigger redeployment
gh workflow run "Deploy to GitHub Pages" --repo fotescodev/portfolio
```

### Fix 2: Publish the Variant

```bash
npx convex run variants:updateStatus '{"slug": "notion-senior-product-manager", "publishStatus": "published"}'
```

### Verification

```bash
# Confirm variant is now published
npx convex run variants:listAll | grep -A2 "notion"
# publishStatus: "published"

# Test production URL
curl -sI "https://edgeoftrust.com/notion/senior-product-manager"
# Page loads correctly with variant content
```

## Prevention

### 1. Pre-Deployment Checklist

- [ ] Verify `VITE_CONVEX_URL` secret matches production Convex deployment
- [ ] Run `npx convex run variants:listAll` to confirm target variants are published
- [ ] Test variant URL locally before deploying

### 2. Convex URL Validation Script

```typescript
// scripts/verify-convex-url.ts
const expectedUrl = "https://scintillating-husky-549.convex.cloud";
const envUrl = process.env.VITE_CONVEX_URL;

if (envUrl !== expectedUrl) {
  console.error(`VITE_CONVEX_URL mismatch!`);
  console.error(`Expected: ${expectedUrl}`);
  console.error(`Got: ${envUrl}`);
  process.exit(1);
}
```

### 3. Variant Status Validation

```typescript
// scripts/check-variant-publishing.ts
// Run before deployment to ensure target variants are published
const draftVariants = variants.filter(v => v.publishStatus === "draft");
if (draftVariants.length > 0) {
  console.warn("Draft variants found:", draftVariants.map(v => v.slug));
}
```

### 4. Post-Deploy Verification

After each deployment, verify:
1. Production bundle contains correct Convex URL
2. At least one variant route loads successfully
3. Resume links work (or fall back gracefully)

## Related Issues

- `docs/solutions/integration-issues/react-router-static-file-interception.md` - SPA routing issues
- `docs/solutions/integration-issues/cv-dashboard-dev-port-configuration.md` - DEV mode configuration

## Key Learnings

1. **Environment variables are embedded at build time** - Vite bakes `VITE_*` vars into the bundle. Changing a secret requires a rebuild.

2. **Two-stage variant delivery** - Variants must be both:
   - Stored in the correct Convex deployment (via `VITE_CONVEX_URL`)
   - Published (`publishStatus: "published"`)

3. **Silent failures are dangerous** - The redirect to home gave no indication of the actual problem. Consider adding error states or logging for debugging.
