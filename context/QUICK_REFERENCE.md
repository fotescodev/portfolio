# Quick Reference: Production Safety

## 30-Second Pre-Deployment Check

Before pushing to main:

```bash
npm run verify:convex        # ✓ Convex URL is correct
npm run check:variants       # ✓ All variants are published
npm run report:variants      # 📊 Show variant status
```

If all pass: **Safe to deploy** ✓

---

## Common Commands

| Task | Command |
|------|---------|
| Verify Convex URL | `npm run verify:convex` |
| Check variant status | `npm run check:variants` |
| See all variants | `npm run report:variants` |
| Sync variants | `npm run variants:sync` |
| Validate content | `npm run validate` |
| Build locally | `npm run build` |

---

## Emergency: Wrong URL in Production

If production has the wrong Convex URL:

1. Go to **Settings → Secrets and variables → Actions**
2. Edit `VITE_CONVEX_URL`
3. Paste correct URL from Convex dashboard
4. Push any change to main to trigger redeploy

Expected time to fix: **5 minutes**

---

## Emergency: Variant Not Showing

If a variant should be published but isn't showing:

1. Check if it's draft: `npm run report:variants`
2. If draft, edit `content/variants/<slug>.yaml`
3. Change `publishStatus: draft` → `publishStatus: published`
4. Run `npm run variants:sync`
5. Commit and push

Expected time to fix: **3 minutes**

---

## One-Time Setup

### First Time Setting Up Production

```bash
# 1. Get production Convex URL from dashboard
# https://dashboard.convex.dev → Select production project → Copy URL

# 2. Add GitHub Secret
# Settings → Secrets and variables → Actions
# Name: VITE_CONVEX_URL
# Value: https://your-url.convex.cloud

# 3. Trigger first deploy
git push main
```

### Enable Git Hook (Optional but Recommended)

```bash
# Prevents accidental push of draft variants
git config core.hooksPath .githooks
chmod +x .githooks/pre-push

# Test it works
npm run check:variants
```

---

## Deployment Flowchart

```
┌─────────────────────────────────────────────────────────┐
│ Ready to deploy?                                        │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ↓
    ┌──────────────────────────────┐
    │ npm run verify:convex         │
    │ (Check Convex URL)           │
    └──────────────┬───────────────┘
                   │ ✓ Pass
                   ↓
    ┌──────────────────────────────┐
    │ npm run check:variants        │
    │ (Check all published)         │
    └──────────────┬───────────────┘
                   │ ✓ Pass
                   ↓
    ┌──────────────────────────────┐
    │ git push main                 │
    └──────────────┬───────────────┘
                   │
                   ↓
    ┌──────────────────────────────┐
    │ GitHub Actions runs checks    │
    │ - Pre-build validation        │
    │ - Build                       │
    │ - Verify URL embedded         │
    │ - Deploy                      │
    │ - Post-deploy health check    │
    └──────────────┬───────────────┘
                   │ ✓ Success
                   ↓
    ┌──────────────────────────────┐
    │ ✓ Deployed to production      │
    └──────────────────────────────┘

If ✗ fail at any step:
  → See PRODUCTION_SAFETY_CHECKLIST.md
  → Or CONVEX_DEPLOYMENT_GUIDE.md
```

---

## Monitoring

### After Each Deploy

Check:
1. Main page loads: https://your-portfolio.com
2. Variant routes work: https://your-portfolio.com/variant/<slug>
3. No console errors (check browser developer tools)

### Variant Status

Check every week:
```bash
npm run report:variants
```

---

## Key Files

| File | Purpose |
|------|---------|
| `PRODUCTION_SAFETY_CHECKLIST.md` | Comprehensive prevention strategies |
| `docs/CONVEX_DEPLOYMENT_GUIDE.md` | Detailed deployment guide |
| `.github/workflows/deploy-with-safety-checks.yml` | CI/CD with safety checks |
| `.githooks/pre-push` | Git hook to prevent draft variants |
| `scripts/verify-convex-url.ts` | Convex URL validation |
| `scripts/check-variant-publishing.ts` | Publishing status check |
| `scripts/variant-status-report.ts` | Variant status report |

---

## Support

### Questions?

1. **Convex URL issues** → See `docs/CONVEX_DEPLOYMENT_GUIDE.md`
2. **Variant publishing** → See `docs/CONVEX_DEPLOYMENT_GUIDE.md` → Variant Publishing
3. **Build failures** → See `PRODUCTION_SAFETY_CHECKLIST.md` → Section 2 (CI/CD)
4. **Troubleshooting** → See `docs/CONVEX_DEPLOYMENT_GUIDE.md` → Troubleshooting

---

## Critical Rules

```
🚫 NEVER
  - Push draft variants to main
  - Use dev/staging Convex URL in production
  - Skip the safety checks
  - Ignore CI/CD errors

✓ ALWAYS
  - Run verify:convex before pushing
  - Run check:variants before pushing
  - Review CI/CD logs
  - Keep Convex URL updated
```

---

**Last Updated:** 2026-01-13
**Status:** Active Prevention Protocol
