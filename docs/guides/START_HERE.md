# Production Safety: START HERE

Welcome! This directory contains comprehensive prevention strategies for the two critical production issues you experienced:

1. **Wrong Convex URL** in GitHub secret
2. **Unpublished variants** in production

---

## 30-Second Quick Start

```bash
# Before pushing to main, run these:
npm run verify:convex        # ✓ Check Convex URL is correct
npm run check:variants       # ✓ Check all variants published
npm run report:variants      # 📊 See detailed status

# If all pass → Safe to deploy!
git push main
```

---

## Which Document Should I Read?

### I just want to deploy (2 minutes)
→ Read: **QUICK_REFERENCE.md**

### I want to understand the prevention strategies (15 minutes)
→ Read: **PREVENTION_STRATEGIES.md**

### I'm setting this up for the first time (10 minutes)
→ Read: **IMPLEMENTATION_GUIDE.md**

### I need to fix a production issue NOW (5 minutes)
→ Read: **docs/CONVEX_DEPLOYMENT_GUIDE.md** → Troubleshooting

### I need complete reference material (45 minutes)
→ Read: **PRODUCTION_SAFETY_CHECKLIST.md**

---

## What Was Created?

### 5 Documentation Files
- `QUICK_REFERENCE.md` - 30-second checklist
- `PREVENTION_STRATEGIES.md` - Complete explanation
- `PRODUCTION_SAFETY_CHECKLIST.md` - Comprehensive guide
- `IMPLEMENTATION_GUIDE.md` - Step-by-step setup
- `docs/CONVEX_DEPLOYMENT_GUIDE.md` - Operational guide

### 3 Verification Scripts
- `npm run verify:convex` - Validates Convex URL
- `npm run check:variants` - Checks variant publishing
- `npm run report:variants` - Shows variant status

### 1 Git Hook
- `.githooks/pre-push` - Prevents pushing draft variants

### 1 Enhanced CI/CD Workflow
- `.github/workflows/deploy-with-safety-checks.yml` - Automated checks

---

## The Two Issues (And How They're Prevented)

### Issue 1: Wrong Convex URL
```
Problem: GitHub secret VITE_CONVEX_URL pointed to staging
Effect: All production variant routes failed silently
Prevention: npm run verify:convex (validates before push)
```

### Issue 2: Unpublished Variants  
```
Problem: Variant had publishStatus: "draft"
Effect: Variant returned null to users (404 error)
Prevention: npm run check:variants (prevents draft variants)
```

---

## Common Commands

```bash
# Verification (before pushing)
npm run verify:convex              # Check Convex URL
npm run check:variants             # Check variant publishing  
npm run report:variants            # See detailed status
npm run validate                   # Validate all content

# Variant management
npm run variants:sync              # Sync YAML to JSON
npm run variants:sync -- --json    # JSON output

# Full pre-deployment check
npm run verify:convex && npm run check:variants && npm run report:variants
```

---

## Implementation Checklist

### Phase 1: Today (5 minutes)
- [ ] Read this file
- [ ] Run `npm run verify:convex`
- [ ] Run `npm run check:variants`

### Phase 2: Next Deploy (10 minutes)
- [ ] Enable git hook: `git config core.hooksPath .githooks`
- [ ] Verify GitHub Secret: `VITE_CONVEX_URL`
- [ ] Test all scripts work

### Phase 3: This Week (15 minutes)
- [ ] Choose CI/CD workflow (existing or new)
- [ ] Share QUICK_REFERENCE.md with team
- [ ] Update team runbooks

---

## File Locations

All files are in `/Users/dfotesco/Portfolio/portfolio/`

**Documentation:**
- `QUICK_REFERENCE.md` - Quick checklist
- `PREVENTION_STRATEGIES.md` - Complete explanation  
- `PRODUCTION_SAFETY_CHECKLIST.md` - Comprehensive reference
- `IMPLEMENTATION_GUIDE.md` - Setup guide
- `docs/CONVEX_DEPLOYMENT_GUIDE.md` - Operational guide

**Scripts:**
- `scripts/verify-convex-url.ts` - URL validation
- `scripts/check-variant-publishing.ts` - Publishing check
- `scripts/variant-status-report.ts` - Status report

**Configuration:**
- `.githooks/pre-push` - Pre-push hook
- `.github/workflows/deploy-with-safety-checks.yml` - Enhanced workflow
- `package.json` - Updated with 3 new scripts

---

## Next Steps

1. **Read QUICK_REFERENCE.md** (2 min)
2. **Run verification commands** (1 min)
3. **Read PREVENTION_STRATEGIES.md** (15 min)
4. **Follow IMPLEMENTATION_GUIDE.md** (10 min)
5. **Enable git hook** (1 min)
6. **Share with team** (5 min)

---

## Need Help?

| Question | Go To |
|----------|-------|
| What's the 30-second check? | QUICK_REFERENCE.md |
| How do I fix wrong URL? | docs/CONVEX_DEPLOYMENT_GUIDE.md |
| How do I publish a variant? | docs/CONVEX_DEPLOYMENT_GUIDE.md |
| What prevention strategies exist? | PREVENTION_STRATEGIES.md |
| How do I set this up? | IMPLEMENTATION_GUIDE.md |
| What's everything about this? | PRODUCTION_SAFETY_CHECKLIST.md |

---

## Critical Rules

✓ DO:
- Run `npm run verify:convex` before pushing
- Run `npm run check:variants` before pushing  
- Keep GitHub Secrets updated
- Review CI/CD logs after deploy

✗ DON'T:
- Push draft variants to main
- Use dev/staging Convex URL in production
- Ignore CI/CD errors
- Skip the pre-deployment checks

---

## Status

✓ All prevention strategies implemented
✓ All scripts tested and ready
✓ All documentation complete
✓ Git hook ready to use
✓ CI/CD workflow enhanced

**Ready to deploy safely!**

---

**Last Updated:** 2026-01-13
**Status:** Complete and Production Ready
**Coverage:** 100% of identified issues
