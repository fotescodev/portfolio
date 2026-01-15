# CV Portfolio System - Minimal PRD

## Job To Be Done
Generate portfolio variants and resumes from the browser dashboard.

## MVP Scope (2 weeks max)

### Must Have
- [ ] Dashboard generates variant from job description
- [ ] Variant saves to Convex as draft
- [ ] Publish variant makes it visible at /:company/:role
- [ ] Resume link falls back to default when PDF missing

### Technical Blockers (DONE)
- [x] Delete duplicate `dashboard/index.html`
- [x] Type `v.any()` with proper Convex validators
- [x] Fix fail-open auth (ADMIN_API_KEY required)

### Won't Have (v1)
- ucv-cli (defer)
- Resume PDF generation (manual for now)
- Eval/redteam pipeline (defer)
- Mobile-specific UI (responsive sufficient)

## Files
- `public/cv-dashboard/index.html` - Dashboard
- `convex/variants.ts` - CRUD operations
- `convex/generate.ts` - AI generation
- `src/pages/VariantPortfolio.tsx` - Render variant

## Success Criteria
1. Paste job description → Generate → Publish → View at URL
2. All mutations require valid ADMIN_API_KEY
3. No v.any() in Convex schema
