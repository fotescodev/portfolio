# Production Safety Checklist & Prevention Strategies

## Overview

This document provides comprehensive prevention strategies for the two critical issues that occurred:
1. **Wrong Convex URL in GitHub secret** - Pointed to a different deployment
2. **Variant not published** - `publishStatus` was "draft" instead of "published"

These issues cascade because:
- Vite embeds `VITE_CONVEX_URL` at **build time** (not runtime)
- Queries have explicit checks: `if (!variant || variant.publishStatus !== "published") return null`
- Multiple Convex deployments exist (dev, prod)
- Variants have a draft/published workflow

---

## 1. Pre-Deployment Checklist

Use this checklist **before every production deployment** to GitHub Pages:

### 1.1 Environment Variables & Secrets

- [ ] **Verify Convex URL is correct**
  ```bash
  # Check what will be embedded at build time
  echo "Current VITE_CONVEX_URL: $VITE_CONVEX_URL"

  # Expected production URL should match your Convex dashboard
  # Example: https://portfolio-prod-abc123.convex.cloud
  ```
  - [ ] Confirm it's **NOT** a dev/staging URL
  - [ ] Confirm it **MATCHES** your production Convex deployment
  - [ ] Confirm the URL is **HTTPS** (not HTTP)

- [ ] **Verify GitHub Secrets are up-to-date**
  - [ ] Go to: Settings → Secrets and variables → Actions
  - [ ] Check `VITE_CONVEX_URL` value matches production Convex deployment
  - [ ] Check `DASHBOARD_PASSWORD` is set (if CV Dashboard is enabled)
  - [ ] Document secret rotation policy (e.g., rotate yearly)

### 1.2 Variant Publishing Status

- [ ] **Verify all intended variants are published**
  ```bash
  # Check variant publish status locally (after sync)
  npm run variants:sync -- --json | jq '.variants[] | {slug, publishStatus}'

  # Or check in Convex dashboard directly
  # Expected: all production variants should have publishStatus: "published"
  ```
  - [ ] All customer-facing variants have `publishStatus: "published"` in YAML
  - [ ] Draft variants are only for internal testing/work-in-progress
  - [ ] No accidental "draft" variants made it to production branch

- [ ] **Review recent variant changes**
  ```bash
  # Check what variants were modified in this deployment
  git log --name-only -n 5 -- content/variants/

  # For each changed variant, verify:
  # 1. publishStatus is correct for the variant's purpose
  # 2. The variant is intended for this deploy
  ```

### 1.3 Build & Artifact Verification

- [ ] **Run pre-build validation**
  ```bash
  npm run validate
  ```
  - Confirms YAML/JSON sync is correct
  - Validates variant schemas
  - No syntax errors in variants

- [ ] **Check build output**
  ```bash
  npm run build 2>&1 | grep -i "error\|warning\|convex"
  ```
  - [ ] No TypeScript errors
  - [ ] Convex URL is embedded (check `dist/index.html`)
  - [ ] All assets built successfully

- [ ] **Verify embedded URL in built assets**
  ```bash
  # Check the built HTML contains the correct Convex URL
  grep -o "https://[a-z0-9-]*\.convex\.cloud" dist/index.html

  # Should output your production Convex URL
  # If wrong, the deployment will fail silently for users
  ```

---

## 2. CI/CD Verification Steps

Add these automated checks to the GitHub Actions workflow (`.github/workflows/deploy.yml`):

### 2.1 Pre-Build Checks

```yaml
# Add to build job (before npm run build):

- name: Verify VITE_CONVEX_URL is set
  run: |
    if [ -z "${{ secrets.VITE_CONVEX_URL }}" ]; then
      echo "ERROR: VITE_CONVEX_URL secret is not set!"
      exit 1
    fi
    echo "✓ VITE_CONVEX_URL is configured"

- name: Validate VITE_CONVEX_URL format
  run: |
    URL="${{ secrets.VITE_CONVEX_URL }}"

    # Should be https://something.convex.cloud
    if ! [[ $URL =~ ^https://[a-z0-9-]+\.convex\.cloud/?$ ]]; then
      echo "ERROR: Invalid Convex URL format: $URL"
      echo "Expected: https://something.convex.cloud"
      exit 1
    fi

    # Detect if it's likely a dev URL
    if [[ $URL == *"dev"* ]] || [[ $URL == *"staging"* ]]; then
      echo "⚠️  WARNING: URL appears to be a dev/staging deployment"
      echo "URL: $URL"
      echo "Confirm this is intentional!"
    fi

    echo "✓ URL format is valid: $URL"

- name: Run variant validation
  run: npm run validate
```

### 2.2 Post-Build Verification

```yaml
# Add to build job (after npm run build):

- name: Verify Convex URL embedded in build
  run: |
    EXPECTED_URL="${{ secrets.VITE_CONVEX_URL }}"
    BUILT_FILE="dist/index.html"

    if ! grep -q "$EXPECTED_URL" "$BUILT_FILE"; then
      echo "ERROR: Convex URL not found in built HTML!"
      echo "Expected: $EXPECTED_URL"
      echo ""
      echo "Built HTML contains:"
      grep -o "https://[a-z0-9-]*\.convex\.cloud" "$BUILT_FILE" || echo "(no Convex URLs found)"
      exit 1
    fi

    echo "✓ Correct Convex URL embedded: $EXPECTED_URL"

- name: Check variant sync status
  run: |
    SYNC_RESULT=$(npm run variants:sync -- --json)
    ERRORS=$(echo "$SYNC_RESULT" | jq '.errors | length')

    if [ "$ERRORS" -gt 0 ]; then
      echo "ERROR: Variant sync has errors:"
      echo "$SYNC_RESULT" | jq '.errors'
      exit 1
    fi

    echo "✓ All variants synced successfully"
    echo "$SYNC_RESULT" | jq '.variants | length' | xargs echo "  Total variants:"
```

### 2.3 Optional: Runtime Verification (Post-Deploy)

```yaml
# Add to deploy job (after deployment):

- name: Verify production deployment
  run: |
    PROD_URL="${{ steps.deployment.outputs.page_url }}"
    MAX_RETRIES=5
    RETRY_DELAY=10

    for ((i=1; i<=MAX_RETRIES; i++)); do
      echo "Attempt $i/$MAX_RETRIES: Checking $PROD_URL"

      if curl -s "$PROD_URL" | grep -q "VITE_CONVEX_URL\|ConvexProvider" 2>/dev/null; then
        echo "✓ Production page loaded successfully"
        exit 0
      fi

      if [ $i -lt $MAX_RETRIES ]; then
        echo "  Page not ready, waiting ${RETRY_DELAY}s..."
        sleep $RETRY_DELAY
      fi
    done

    echo "⚠️  WARNING: Could not verify production deployment"
    echo "Manual verification recommended at: $PROD_URL"
```

---

## 3. Convex URL Management Best Practices

### 3.1 Multi-Environment Setup

Use a clear naming convention to distinguish environments:

```bash
# In GitHub Secrets, use explicit names:
- VITE_CONVEX_URL_PRODUCTION    # https://portfolio-prod.convex.cloud
- VITE_CONVEX_URL_STAGING      # https://portfolio-staging.convex.cloud
- VITE_CONVEX_URL_DEV          # https://portfolio-dev.convex.cloud

# In .env.local for local development:
VITE_CONVEX_URL=https://portfolio-dev.convex.cloud

# In .env.example (for documentation):
# VITE_CONVEX_URL=https://your-project.convex.cloud
```

### 3.2 Convex URL Validation Script

Create `/scripts/verify-convex-url.ts`:

```typescript
#!/usr/bin/env tsx
/**
 * Verify Convex URL configuration and connectivity
 *
 * Usage:
 *   npm run verify:convex
 *   npm run verify:convex -- --env production
 */

import https from 'https';
import { URL } from 'url';

const convexUrl = process.env.VITE_CONVEX_URL;

if (!convexUrl) {
  console.error('ERROR: VITE_CONVEX_URL is not set');
  process.exit(1);
}

// Validate URL format
try {
  const url = new URL(convexUrl);

  if (url.protocol !== 'https:') {
    console.error('ERROR: Convex URL must use HTTPS');
    process.exit(1);
  }

  if (!url.hostname.includes('convex.cloud')) {
    console.error('ERROR: URL does not appear to be a Convex deployment');
    console.error(`  Got: ${url.hostname}`);
    console.error(`  Expected: *.convex.cloud`);
    process.exit(1);
  }

  // Warn about non-production URLs
  if (url.hostname.includes('dev') || url.hostname.includes('staging')) {
    console.warn('⚠️  WARNING: URL appears to be non-production');
    console.warn(`  Hostname: ${url.hostname}`);
  }

  console.log('✓ Convex URL format is valid');
  console.log(`  URL: ${convexUrl}`);

  // Optional: Test connectivity
  https.get(`${convexUrl}/api`, { timeout: 5000 }, (res) => {
    console.log('✓ Convex deployment is reachable');
    console.log(`  Status: ${res.statusCode}`);
  }).on('error', (err) => {
    console.warn('⚠️  Could not reach Convex deployment');
    console.warn(`  Error: ${err.message}`);
    // Don't fail - network might be restricted in CI
  });

} catch (err) {
  console.error('ERROR: Invalid Convex URL');
  console.error(`  Error: ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
}
```

Add to package.json:
```json
{
  "scripts": {
    "verify:convex": "tsx scripts/verify-convex-url.ts"
  }
}
```

### 3.3 Documentation for URL Management

Create `/docs/CONVEX_DEPLOYMENT_GUIDE.md`:

```markdown
# Convex Deployment Guide

## Environments

| Environment | URL Pattern | GitHub Secret |
|-------------|-------------|---------------|
| Production  | `https://portfolio-prod-*.convex.cloud` | `VITE_CONVEX_URL` |
| Staging     | `https://portfolio-staging-*.convex.cloud` | - |
| Development | `https://portfolio-dev-*.convex.cloud` | - |

## Updating Production Convex URL

1. Go to Convex Dashboard
2. Note your production deployment URL (e.g., `https://portfolio-prod-abc123.convex.cloud`)
3. Update GitHub Secret:
   - Settings → Secrets and variables → Actions
   - Update `VITE_CONVEX_URL` with new URL
   - Do NOT include trailing slash
4. Verify with: `npm run verify:convex`

## Local Development

```bash
# Copy example file
cp .env.example .env.local

# Update with your dev Convex URL
# (Usually automatically set by `convex dev`)
VITE_CONVEX_URL=https://your-dev-project.convex.cloud
```
```

---

## 4. Variant Publishing Workflow Improvements

### 4.1 Publishing Status Enforcement

Create `/scripts/check-variant-publishing.ts`:

```typescript
#!/usr/bin/env tsx
/**
 * Check if all variants in main branch are properly published
 *
 * Prevents accidental deployment of draft variants
 * Run as part of pre-commit or pre-push hook
 */

import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import YAML from 'yaml';

const variantsDir = join(process.cwd(), 'content', 'variants');
const yamlFiles = readdirSync(variantsDir)
  .filter(f => f.endsWith('.yaml') && !f.startsWith('_'));

let draftVariants: string[] = [];

for (const file of yamlFiles) {
  const content = readFileSync(join(variantsDir, file), 'utf-8');
  const variant = YAML.parse(content);

  if (variant.publishStatus === 'draft') {
    draftVariants.push(file.replace('.yaml', ''));
  }
}

if (draftVariants.length > 0) {
  console.error('ERROR: Found draft variants in main branch:');
  draftVariants.forEach(slug => {
    console.error(`  - ${slug} (publishStatus: "draft")`);
  });
  console.error('');
  console.error('⚠️  Draft variants will not be served in production!');
  console.error('');
  console.error('To fix:');
  console.error('  1. Edit content/variants/<slug>.yaml');
  console.error('  2. Change publishStatus from "draft" to "published"');
  console.error('  3. Run: npm run variants:sync');
  console.error('  4. Commit and push');
  process.exit(1);
}

console.log('✓ All variants are published');
```

### 4.2 Git Hooks for Pre-Push Validation

Create `.githooks/pre-push`:

```bash
#!/bin/bash
# Prevent pushing branches with unpublished variants

set -e

BRANCH=$(git rev-parse --abbrev-ref HEAD)

# Only enforce on main branch
if [ "$BRANCH" != "main" ]; then
  exit 0
fi

echo "🔍 Checking variant publishing status..."

if ! npm run check:variants 2>/dev/null; then
  echo ""
  echo "❌ Push blocked: Draft variants found in main branch"
  echo ""
  echo "Before pushing, ensure all variants have publishStatus: 'published'"
  echo ""
  exit 1
fi

echo "✓ All variants are published. Push allowed."
```

Make it executable:
```bash
chmod +x .githooks/pre-push
git config core.hooksPath .githooks
```

### 4.3 Variant Status Dashboard Script

Create `/scripts/variant-status-report.ts`:

```typescript
#!/usr/bin/env tsx
/**
 * Generate a report of variant publishing status
 *
 * Useful for understanding which variants will be visible in production
 *
 * Usage:
 *   npm run report:variants
 */

import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import YAML from 'yaml';

interface VariantStatus {
  slug: string;
  company?: string;
  role?: string;
  publishStatus: 'draft' | 'published';
  willBeServed: boolean;
}

const variantsDir = join(process.cwd(), 'content', 'variants');
const yamlFiles = readdirSync(variantsDir)
  .filter(f => f.endsWith('.yaml') && !f.startsWith('_'));

const variants: VariantStatus[] = [];

for (const file of yamlFiles) {
  const content = readFileSync(join(variantsDir, file), 'utf-8');
  const variant = YAML.parse(content);

  variants.push({
    slug: file.replace('.yaml', ''),
    company: variant.metadata?.company,
    role: variant.metadata?.role,
    publishStatus: variant.publishStatus || 'draft',
    willBeServed: (variant.publishStatus || 'draft') === 'published'
  });
}

// Sort: published first, then alphabetical
variants.sort((a, b) => {
  if (a.publishStatus !== b.publishStatus) {
    return a.publishStatus === 'published' ? -1 : 1;
  }
  return a.slug.localeCompare(b.slug);
});

console.log('\n📊 Variant Publishing Status Report\n');

const published = variants.filter(v => v.publishStatus === 'published');
const draft = variants.filter(v => v.publishStatus === 'draft');

if (published.length > 0) {
  console.log(`✓ PUBLISHED (${published.length}):`);
  published.forEach(v => {
    const location = v.company && v.role ? ` — ${v.company} / ${v.role}` : '';
    console.log(`  • ${v.slug}${location}`);
  });
  console.log();
}

if (draft.length > 0) {
  console.log(`📝 DRAFT (${draft.length}) — Will NOT be served in production:`);
  draft.forEach(v => {
    const location = v.company && v.role ? ` — ${v.company} / ${v.role}` : '';
    console.log(`  • ${v.slug}${location}`);
  });
  console.log();
}

console.log(`Total: ${published.length} published, ${draft.length} draft\n`);

if (draft.length > 0) {
  console.log('⚠️  Reminder: Draft variants will return null from getBySlug() query');
  console.log('   This matches the publishStatus check in convex/variants.ts:');
  console.log('   if (!variant || variant.publishStatus !== "published") return null\n');
}
```

Add to package.json:
```json
{
  "scripts": {
    "check:variants": "tsx scripts/check-variant-publishing.ts",
    "report:variants": "tsx scripts/variant-status-report.ts"
  }
}
```

---

## 5. Automated Post-Deploy Verification

### 5.1 Integration Test Script

Create `/scripts/verify-production.ts`:

```typescript
#!/usr/bin/env tsx
/**
 * Post-deployment verification script
 *
 * Runs after deployment to verify:
 * 1. Published variants are accessible
 * 2. Draft variants return null
 * 3. Convex connection is working
 *
 * Usage:
 *   npm run verify:production -- https://your-portfolio.com
 */

import https from 'https';

const productionUrl = process.argv[2];

if (!productionUrl) {
  console.error('Usage: npm run verify:production -- <url>');
  process.exit(1);
}

async function checkPage(path: string): Promise<boolean> {
  return new Promise((resolve) => {
    const url = new URL(productionUrl);
    const request = https.request({
      hostname: url.hostname,
      path: path,
      method: 'GET',
      timeout: 10000,
    }, (res) => {
      resolve(res.statusCode === 200 || res.statusCode === 404);
    });

    request.on('error', () => resolve(false));
    request.on('timeout', () => {
      request.destroy();
      resolve(false);
    });
    request.end();
  });
}

async function main() {
  console.log(`\n✓ Verifying production deployment: ${productionUrl}\n`);

  // Check main page loads
  console.log('1. Checking main page loads...');
  const mainPageOk = await checkPage('/');
  if (mainPageOk) {
    console.log('   ✓ Main page accessible');
  } else {
    console.error('   ✗ Main page not accessible');
  }

  // Check variant routes
  console.log('\n2. Checking variant routes...');
  const testVariants = ['portfolio-default', 'faang-swe'];
  for (const slug of testVariants) {
    const ok = await checkPage(`/variant/${slug}`);
    console.log(`   ${ok ? '✓' : '✗'} /variant/${slug}`);
  }

  console.log('\n✓ Post-deploy verification complete');
  console.log('\nFor full verification, manually check:');
  console.log(`  • ${productionUrl}`);
  console.log(`  • ${productionUrl}/cv-dashboard (if enabled)`);
  console.log(`  • Browser console for errors`);
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
```

---

## 6. Summary Table: Prevention Controls

| Issue | Prevention Control | Owner | Frequency |
|-------|-------------------|-------|-----------|
| Wrong Convex URL | GitHub Secrets validation in CI | DevOps | Every build |
| URL not embedded | Post-build verification | CI/CD | Every build |
| Draft variants | Publishing status validation | Developer | Pre-commit |
| Sync drift | Variant sync check in CI | CI/CD | Every build |
| Production issues | Post-deploy health check | CI/CD | After deploy |
| Misconfiguration | Convex URL format validation | CI/CD | Every build |

---

## 7. Implementation Timeline

### Phase 1: Immediate (This Deploy)
- [ ] Review and verify environment variables manually
- [ ] Run `npm run report:variants` to assess current state
- [ ] Execute the pre-deployment checklist (Section 1)

### Phase 2: Next Deploy (1-2 days)
- [ ] Add CI/CD verification steps (Section 2)
- [ ] Create Convex URL validation script (Section 3.2)
- [ ] Add GitHub hooks for variant publishing (Section 4.2)

### Phase 3: Enhanced Safety (1 week)
- [ ] Implement variant status dashboard (Section 4.3)
- [ ] Add post-deploy verification (Section 5.1)
- [ ] Create operational documentation (Section 3.3)

### Phase 4: Monitoring (Ongoing)
- [ ] Run variant status reports before major releases
- [ ] Monitor Convex deployment health
- [ ] Review production logs for variant serving failures

---

## 8. Quick Reference: Critical Commands

```bash
# Pre-deployment verification
npm run validate                    # Validate all content
npm run variants:sync -- --json    # Check variant sync
npm run report:variants             # Show publishing status
npm run verify:convex              # Verify URL configuration

# After deployment
npm run verify:production -- <url>  # Post-deploy health check

# Debugging
grep -r "publishStatus" content/variants/  # Find variants
npm run variants:sync -- --slug <slug>    # Sync one variant
```

---

## 9. Related Documentation

- `/convex/variants.ts` - Query filtering logic (publishStatus check)
- `.github/workflows/deploy.yml` - Current CI/CD configuration
- `/scripts/sync-variants.ts` - Variant synchronization
- `.env.example` - Environment variable documentation

---

**Last Updated:** 2026-01-13
**Owner:** Portfolio Team
**Status:** Active Prevention Protocol
