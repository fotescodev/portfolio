# CV Portfolio MVP Verification

Generate portfolio variants and resumes from the browser dashboard.

## Prerequisites

Set Convex environment variables (only needs to be done once):

```bash
npx convex env set ADMIN_API_KEY "your-secure-api-key"  # NOT the dashboard password
npx convex env set ANTHROPIC_API_KEY "sk-ant-xxxxx"
npx convex env list  # verify both appear
```

## Critical Bug Fix Required

**Slug mismatch in dashboard** - success URL shows wrong path after generation.

- Backend (`convex/generate.ts:150`) uses `abbreviateRole()` → slug: `google-sr-pm`
- Dashboard (`public/cv-dashboard/index.html:1669`) shows full role → `/google/senior-product-manager`
- **Result: 404**

**Fix:** Update dashboard to use same slug logic as backend, or return generated slug from action.

## Verification Checklist

### Build Check
- [ ] `npm run build` completes without errors
- [ ] `npm run test` passes

### End-to-End Test
1. [ ] Open `/cv-dashboard/` and enter password
2. [ ] Click "New Variant", paste a job description
3. [ ] Confirm company/role extraction, click "Generate Variant"
4. [ ] Wait for completion - **verify URL uses abbreviated role** (e.g., `sr-pm` not `senior-product-manager`)
5. [ ] Navigate to generated URL - verify variant content appears
6. [ ] Navigate to `/:company/:role/resume` - verify resume renders
7. [ ] Click "Download PDF" - verify PDF downloads with correct content

### Sanity Checks
- [ ] Base `/resume` page still works
- [ ] Static `/resume.pdf` is accessible
- [ ] Invalid variant URLs redirect to base portfolio (not broken page)

## Success Criteria

1. Paste job description → Generate → View at URL works end-to-end
2. All mutations require valid `ADMIN_API_KEY`
3. PDF downloads successfully

Done when all boxes checked.
