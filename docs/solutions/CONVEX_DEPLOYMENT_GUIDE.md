# Convex Deployment Guide

## Table of Contents

1. [Environment Setup](#environment-setup)
2. [Pre-Deployment Checklist](#pre-deployment-checklist)
3. [Convex URL Management](#convex-url-management)
4. [Variant Publishing](#variant-publishing)
5. [Troubleshooting](#troubleshooting)
6. [FAQ](#faq)

---

## Environment Setup

### Local Development

#### Step 1: Create .env.local

Copy the example environment file:

```bash
cp .env.example .env.local
```

#### Step 2: Set Convex URL

Get your development Convex URL from the Convex dashboard:

```bash
# Option A: Auto-configured by Convex CLI
npm install -g convex
convex dev

# Option B: Manual setup
# Copy URL from https://dashboard.convex.dev
# Example: https://portfolio-dev-abc123.convex.cloud

# Add to .env.local
VITE_CONVEX_URL=https://portfolio-dev-abc123.convex.cloud
```

#### Step 3: Verify Configuration

```bash
npm run verify:convex
```

Expected output:
```
🔍 Verifying Convex URL Configuration

✓ Protocol: HTTPS
✓ Domain: *.convex.cloud
✓ Format: Valid

✓ Convex URL is valid: https://portfolio-dev-abc123.convex.cloud
```

---

## Pre-Deployment Checklist

### Before Each Deployment to main (GitHub Pages)

Run this checklist to prevent deployment issues:

```bash
# 1. Verify environment setup
npm run verify:convex

# 2. Check variant publishing status
npm run check:variants

# 3. Generate detailed report
npm run report:variants

# 4. Validate content
npm run validate

# 5. Check variant sync
npm run variants:sync -- --json
```

### Expected Results

```bash
✓ All variants are published (15 total)
✓ Convex URL format is valid
✓ No validation errors
```

### If You See Warnings

**Warning: "URL appears to be dev/staging"**
- Double-check you're using the production Convex URL
- Confirm in Convex dashboard that the URL matches your production deployment
- Do NOT push if uncertain

**Error: "Found draft variants"**
- This is a **blocking error** - build will fail
- Edit `content/variants/<slug>.yaml`
- Change `publishStatus: draft` to `publishStatus: published`
- Run `npm run variants:sync`
- Commit and retry

---

## Convex URL Management

### Environment Reference

| Environment | URL Pattern | Location | Use Case |
|-------------|-------------|----------|----------|
| Production  | `https://portfolio-prod-*.convex.cloud` | GitHub Secrets | Public website |
| Staging     | `https://portfolio-staging-*.convex.cloud` | Local .env.local | Pre-prod testing |
| Development | `https://portfolio-dev-*.convex.cloud` | .env.local + convex dev | Local development |

### GitHub Secrets Setup

#### Step 1: Get Production Convex URL

1. Go to [Convex Dashboard](https://dashboard.convex.dev)
2. Select your **production** project
3. Copy the deployment URL from the top of the page
4. Example: `https://portfolio-prod-abc123.convex.cloud`

#### Step 2: Update GitHub Secret

1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Name: `VITE_CONVEX_URL`
5. Value: Your production Convex URL (no trailing slash)
6. Click "Add secret"

#### Step 3: Verify in Workflow

The next deploy will automatically verify the URL is correct.

---

## Variant Publishing

### Understanding Publishing Workflow

Variants have two states:

```
┌─────────────────────────────────────────────────────────┐
│ DRAFT: Not visible in production                         │
│ - Editing/work-in-progress                              │
│ - Returns null from getBySlug() query                    │
│ - Not served to users                                   │
└─────────────────────────────────────────────────────────┘

                           ↓↓↓ When ready

┌─────────────────────────────────────────────────────────┐
│ PUBLISHED: Visible in production                         │
│ - Ready for users                                        │
│ - Served from getBySlug() query                          │
│ - Visible to recruiters                                 │
└─────────────────────────────────────────────────────────┘
```

### Publishing a Variant

#### Step 1: Edit the Variant File

```bash
# Open content/variants/<slug>.yaml
nano content/variants/bloomberg-senior-swe.yaml
```

#### Step 2: Check Status

Look for the `publishStatus` field:

```yaml
metadata:
  slug: bloomberg-senior-swe
  company: Bloomberg
  role: Senior Software Engineer
  # ... other metadata

# Check this field:
publishStatus: draft  # Change to "published" when ready
```

#### Step 3: Publish

Change `draft` to `published`:

```yaml
publishStatus: published
```

#### Step 4: Sync Variants

```bash
npm run variants:sync
```

This creates/updates the JSON artifact.

#### Step 5: Commit and Push

```bash
git add content/variants/bloomberg-senior-swe.yaml
git add content/variants/bloomberg-senior-swe.json
git commit -m "publish: make bloomberg-senior-swe variant public"
git push
```

#### Step 6: Verify in CI/CD

The GitHub Actions workflow will:
1. Verify the variant is published
2. Embed the correct Convex URL
3. Deploy to production
4. Verify the deployment

---

## Troubleshooting

### Issue: "Found draft variants in main branch"

**Symptom:** Build fails with error about draft variants

**Cause:** A variant with `publishStatus: draft` was pushed to main

**Solution:**
```bash
# 1. Check which variants are draft
npm run report:variants

# 2. For each draft variant, edit the file
nano content/variants/<slug>.yaml

# 3. Change publishStatus: draft → publishStatus: published

# 4. Sync
npm run variants:sync

# 5. Commit
git add content/variants/
git commit -m "publish: activate variants"
git push
```

### Issue: "Wrong Convex URL in production"

**Symptom:** Production website shows errors, variant routes return null

**Cause:** Incorrect URL in GitHub Secret

**Solution:**
```bash
# 1. Verify current production Convex deployment
# Go to https://dashboard.convex.dev
# Select your production project
# Copy the correct URL

# 2. Update GitHub Secret
# Settings → Secrets and variables → Actions
# Edit VITE_CONVEX_URL
# Paste correct URL (no trailing slash)
# Save

# 3. Trigger rebuild
# Push any change to main:
echo "# rebuild trigger" >> .github/workflows/deploy.yml
git add .github/workflows/deploy.yml
git commit -m "chore: trigger rebuild with correct Convex URL"
git push
```

### Issue: "Convex URL format validation failed"

**Symptom:**
```
ERROR: Invalid Convex URL format
Expected: https://xxx.convex.cloud
```

**Cause:** URL has incorrect format or typo

**Check:**
- Must start with `https://` (not `http://`)
- Must end with `.convex.cloud`
- No trailing slash or path
- No query parameters

**Examples:**

```bash
# ✓ CORRECT
https://portfolio-prod-abc123.convex.cloud
https://my-project.convex.cloud

# ✗ WRONG
http://portfolio-prod.convex.cloud    # (http, not https)
https://portfolio-prod.convex.cloud/  # (trailing slash)
https://portal.convex.dev             # (wrong domain)
https://convex.cloud/portfolio-prod   # (path, not subdomain)
```

### Issue: "Convex deployment not reachable"

**Symptom:** Warning about connectivity during `npm run verify:convex`

**Possible Causes:**
- Network is restricted (common in CI environments)
- Convex deployment is down
- URL is incorrect

**Solution:**
- Verify URL manually: Visit the URL in a browser (you may see an error page, that's fine)
- Check [Convex Status Page](https://status.convex.dev)
- Verify in Convex dashboard that the deployment is running

---

## FAQ

### Q: Can I have multiple Convex deployments?

**A:** Yes! You can have:
- **Production:** `https://portfolio-prod-*.convex.cloud`
- **Staging:** `https://portfolio-staging-*.convex.cloud`
- **Development:** `https://portfolio-dev-*.convex.cloud`

Currently, the main branch always deploys to production. To support multiple deployments, you would:

1. Create separate branches (e.g., `staging`, `main`)
2. Use environment-specific secrets
3. Modify the workflow to select the correct secret based on branch

### Q: What happens if I push a draft variant?

**A:**
1. The build **will fail** in CI/CD (pre-commit check)
2. The variant **will not be served** even if the build succeeds
3. Users visiting `/variant/<slug>` will see an error

This is by design - the Convex query explicitly checks:
```typescript
if (!variant || variant.publishStatus !== "published") return null
```

### Q: How do I test a variant before publishing?

**A:**
1. Keep it as `draft` in the YAML
2. Deploy to a dev/staging environment
3. Test the variant locally at `http://localhost:5173/variant/<slug>`
4. When satisfied, change `publishStatus: published` and deploy to main

### Q: Can I revert a published variant back to draft?

**A:** Yes:
1. Edit the YAML file
2. Change `publishStatus: published` → `publishStatus: draft`
3. Run `npm run variants:sync`
4. Commit and push

The variant will immediately stop being served in production.

### Q: How often should I rotate my Convex URL?

**A:**
- **Not needed** unless you delete and recreate the Convex project
- If you migrate to a new Convex project:
  1. Set up new project and get new URL
  2. Update GitHub Secret: `VITE_CONVEX_URL`
  3. Push to trigger redeploy

### Q: What's the difference between VITE_CONVEX_URL and CONVEX_URL?

**A:**
- `VITE_CONVEX_URL` - Embedded in the frontend at build time (used in browser)
- `CONVEX_URL` - Used by backend scripts and APIs (used server-side)

For the portfolio website:
- Use `VITE_CONVEX_URL` in GitHub Secrets and `.env.local`
- The build embeds it in the JavaScript bundle

### Q: Why are environment variables embedded at build time?

**A:**
- This is how Vite works - it's a frontend build tool
- The React app needs to know which Convex deployment to connect to
- This happens once at build time, not at runtime
- This is why the **wrong secret** resulted in wrong URL being baked into the HTML

If you need to support multiple environments dynamically, you would need:
1. A backend API that returns the correct Convex URL
2. The frontend to fetch it at runtime
3. This adds complexity and is not currently needed

---

## Related Documentation

- [`PRODUCTION_SAFETY_CHECKLIST.md`](../PRODUCTION_SAFETY_CHECKLIST.md) - Complete prevention strategies
- [`/convex/variants.ts`](../convex/variants.ts) - Variant query logic
- [`/scripts/verify-convex-url.ts`](../scripts/verify-convex-url.ts) - URL verification script
- [`/scripts/check-variant-publishing.ts`](../scripts/check-variant-publishing.ts) - Publishing status check

---

**Last Updated:** 2026-01-13
**Audience:** Developers, DevOps, Portfolio Maintainers
