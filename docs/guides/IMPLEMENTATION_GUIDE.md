# Implementation Guide: Production Safety

## Overview

This guide walks through implementing the production safety controls created to prevent future deployments with:
1. Wrong Convex URLs
2. Unpublished variants

---

## Phase 1: Immediate (Today)

### 1.1 Run Verification Commands

```bash
# Check current state
npm run verify:convex
npm run check:variants
npm run report:variants
```

**Expected output:** All checks pass ✓

### 1.2 Review Documentation

- [ ] Read `QUICK_REFERENCE.md` (2 min)
- [ ] Read `PRODUCTION_SAFETY_CHECKLIST.md` (10 min)
- [ ] Understand the issue and prevention strategy

---

## Phase 2: Short-term (Next Deploy)

### 2.1 Test New Scripts

The following scripts are already created and ready to use:

```bash
# Test Convex URL verification
npm run verify:convex

# Test variant publishing check
npm run check:variants

# Test variant status report
npm run report:variants

# Test variant sync
npm run variants:sync -- --json
```

All should work without errors.

### 2.2 Optional: Enable Git Hook

To prevent accidentally pushing draft variants:

```bash
# Enable git hooks
git config core.hooksPath .githooks

# Test it works
npm run check:variants
# The pre-push hook will run this when you push to main
```

Verify the hook works:
```bash
# This will pass
git push origin <feature-branch>

# This will be blocked (if main has draft variants)
git push origin main  # Would be blocked by pre-push hook
```

### 2.3 Review CI/CD Changes

Review the new workflow file:
- File: `.github/workflows/deploy-with-safety-checks.yml`
- This adds automated safety checks to GitHub Actions
- Run immediately before deploy.yml

### 2.4 Verify GitHub Secrets

```bash
# Manually verify (cannot be automated):
1. Go to: Settings → Secrets and variables → Actions
2. Check VITE_CONVEX_URL is set
3. Verify it's your production URL (not staging/dev)
4. Check DASHBOARD_PASSWORD is set (if enabled)
```

---

## Phase 3: Integration (This Week)

### 3.1 Option A: Update Existing Workflow (Recommended)

If you want to keep your current deploy workflow as-is, just add the safety checks:

**File:** `.github/workflows/deploy.yml`

Add before the build job:

```yaml
jobs:
  pre-deploy-checks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - name: Verify VITE_CONVEX_URL secret
        run: |
          if [ -z "${{ secrets.VITE_CONVEX_URL }}" ]; then
            echo "ERROR: VITE_CONVEX_URL secret not set"
            exit 1
          fi
      - run: npm run check:variants
      - run: npm run verify:convex
        env:
          VITE_CONVEX_URL: ${{ secrets.VITE_CONVEX_URL }}

  build:
    needs: pre-deploy-checks
    # ... rest of existing build job
```

### 3.2 Option B: Use New Workflow

Replace your deploy workflow with `deploy-with-safety-checks.yml`:

```bash
# Rename current workflow
mv .github/workflows/deploy.yml .github/workflows/deploy.old.yml

# Use new workflow
cp .github/workflows/deploy-with-safety-checks.yml .github/workflows/deploy.yml

# Test it works
git push main
```

### 3.3 Document in Team Wiki/Docs

Create an internal reference:
- Link to `QUICK_REFERENCE.md`
- Link to `docs/CONVEX_DEPLOYMENT_GUIDE.md`
- Share with team

---

## Phase 4: Monitoring (Ongoing)

### 4.1 Weekly Health Check

```bash
# Every Friday, run:
npm run report:variants

# Ensure:
# - All intended variants are published
# - No unexpected draft variants
```

### 4.2 Monitor Deployments

For each deploy, check:
1. GitHub Actions passes all checks ✓
2. Production site loads ✓
3. Variant routes work ✓
4. No console errors in browser ✓

### 4.3 Maintain Documentation

When you update:
- Variant publishing workflow
- Convex deployment structure
- GitHub Secrets

Update the corresponding docs.

---

## File Structure

```
portfolio/
├── PRODUCTION_SAFETY_CHECKLIST.md       ← Comprehensive prevention guide
├── QUICK_REFERENCE.md                   ← 30-second checklist
├── IMPLEMENTATION_GUIDE.md              ← This file
│
├── docs/
│   └── CONVEX_DEPLOYMENT_GUIDE.md       ← Detailed deployment guide
│
├── scripts/
│   ├── verify-convex-url.ts             ← ✓ Created: Verify Convex URL
│   ├── check-variant-publishing.ts      ← ✓ Created: Check publishing
│   └── variant-status-report.ts         ← ✓ Created: Status report
│
├── .githooks/
│   └── pre-push                         ← ✓ Created: Git hook
│
├── .github/workflows/
│   ├── deploy.yml                       ← Existing workflow
│   └── deploy-with-safety-checks.yml    ← ✓ Created: Enhanced workflow
│
├── package.json                          ← ✓ Updated: Added 3 new scripts
├── convex/variants.ts                   ← Existing: Query filtering logic
└── .env.example                         ← Existing: Env config
```

---

## Verification Checklist

### Verify All Changes Are Deployed

```bash
# ✓ Scripts exist
[ -f scripts/verify-convex-url.ts ]
[ -f scripts/check-variant-publishing.ts ]
[ -f scripts/variant-status-report.ts ]

# ✓ Git hook exists
[ -f .githooks/pre-push ]

# ✓ Documentation exists
[ -f PRODUCTION_SAFETY_CHECKLIST.md ]
[ -f QUICK_REFERENCE.md ]
[ -f docs/CONVEX_DEPLOYMENT_GUIDE.md ]
[ -f IMPLEMENTATION_GUIDE.md ]

# ✓ Scripts work
npm run verify:convex
npm run check:variants
npm run report:variants
```

### Verify Commands Are Registered

```bash
# Check package.json has new scripts
grep "verify:convex" package.json
grep "check:variants" package.json
grep "report:variants" package.json

# Test they run
npm run verify:convex
npm run check:variants
npm run report:variants
```

---

## Rollback Plan

If something goes wrong:

### Rollback Changes

```bash
# 1. Remove new workflow (if using it)
rm .github/workflows/deploy-with-safety-checks.yml

# 2. Keep scripts and hooks (they don't hurt)

# 3. Push to restore previous behavior
git push main
```

### Keep Documentation

Even if you don't use all automation:
- Keep `QUICK_REFERENCE.md` - reference for manual checks
- Keep `docs/CONVEX_DEPLOYMENT_GUIDE.md` - knowledge base
- Keep scripts - optional safe helpers

---

## Troubleshooting Implementation

### Issue: Scripts don't run

```bash
# Make sure tsx is installed
npm list tsx

# If missing:
npm install tsx
```

### Issue: Git hook not running

```bash
# Check core.hooksPath is set
git config core.hooksPath

# If not set:
git config core.hooksPath .githooks

# Make sure hook is executable
chmod +x .githooks/pre-push

# Test with explicit call
./.githooks/pre-push
```

### Issue: CI/CD workflow not picking up new job

```bash
# Push the new workflow file explicitly
git add .github/workflows/deploy-with-safety-checks.yml
git commit -m "chore: add production safety checks to CI/CD"
git push

# GitHub Actions will recognize it in the next push
```

---

## Next Steps

### After Implementation

1. **Test deployment** - Push to main and watch GitHub Actions
2. **Share documentation** - Team reference
3. **Train team** - Run through `QUICK_REFERENCE.md`
4. **Update runbooks** - Internal deployment procedures

### Future Enhancements

Consider adding:
- Slack notifications on deployment
- Automated rollback on health check failure
- Production monitoring dashboard
- Variant performance metrics

---

## Support

### Documentation Quick Links

| Need | Document |
|------|----------|
| Quick check before deploy | `QUICK_REFERENCE.md` |
| Complete safety guide | `PRODUCTION_SAFETY_CHECKLIST.md` |
| Convex URL troubleshooting | `docs/CONVEX_DEPLOYMENT_GUIDE.md` |
| Implementation details | This file |

### Common Questions

**Q: Do I have to use all of this?**
A: No. Minimum required: GitHub Secrets correct + variants published. Everything else is optional but recommended.

**Q: Will this slow down deployment?**
A: No. Checks add ~30 seconds to CI/CD. Manual checks take ~1 minute before pushing.

**Q: Can I disable the git hook?**
A: Yes: `git push --no-verify`. But then you're responsible for checking variants manually.

---

**Status:** ✓ Ready for Implementation
**Created:** 2026-01-13
**Owner:** Portfolio Team
