# CV Portfolio System - Minimal PRD

## Job To Be Done
Generate portfolio variants and resumes from the browser dashboard.

## Status: Ready for MVP Implementation

### Completed (Blockers Fixed)
- [x] Delete duplicate `dashboard/index.html`
- [x] Type `v.any()` with proper Convex validators (`convex/validators.ts`)
- [x] Fix fail-open auth (ADMIN_API_KEY required)
- [x] Create solution documentation (`docs/solutions/`)

### Next: MVP Tasks
- [ ] Verify web dashboard generates variants end-to-end
- [ ] Test publish flow: draft → published → visible at /:company/:role
- [ ] Confirm resume fallback works (falls back to `/resume.pdf`)
- [ ] Set `ADMIN_API_KEY` in Convex production dashboard

### Already Built
- Web dashboard: `public/cv-dashboard/index.html`
- CLI dashboard: `npm run ucv-cli` (eval/redteam/publish)
- Convex backend: queries, mutations, AI generation
- Variant rendering: `src/pages/VariantPortfolio.tsx`

### Won't Have (v1)
- Resume PDF generation (manual for now)
- Mobile-specific UI (responsive sufficient)

## Key Files
| File | Purpose |
|------|---------|
| `public/cv-dashboard/index.html` | Web dashboard (browser) |
| `scripts/cli/ucv/index.ts` | CLI dashboard (terminal) |
| `convex/validators.ts` | Typed Convex validators |
| `convex/variants.ts` | CRUD operations |
| `convex/generate.ts` | AI variant generation |
| `src/pages/VariantPortfolio.tsx` | Render variant at /:company/:role |

## Success Criteria
1. Paste job description → Generate → Publish → View at URL
2. All mutations require valid `ADMIN_API_KEY`
3. No `v.any()` in Convex schema

## Quick Start (Next Session)
```bash
# 1. Ensure Convex is running
npx convex dev

# 2. Open web dashboard
open http://localhost:5173/cv-dashboard/index.html

# 3. Or use CLI
npm run ucv-cli
```
