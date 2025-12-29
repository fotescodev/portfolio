# First-Time User Experience Audit

**Date:** 2025-12-27
**Persona:** Jordan Kim, Senior Software Engineer (6 years)
**Goal:** Generate a portfolio variant for CloudTech Senior PM role

---

## Executive Summary

| Metric | Value |
|--------|-------|
| Overall Score | **8.5/10** |
| Time to First Success | ~15 minutes (manual path) |
| Critical Blockers | 0 |
| Friction Points | 3 |
| CLI Tools Working | 11/12 |

**Verdict:** The documentation improvements from the previous audit (2025-12-documentation-audit.md) are effective. A first-time user can now successfully navigate the system.

---

## Journey Map

| Step | Status | Friction | Notes |
|------|--------|----------|-------|
| 1. Find entry point | ✅ | Low | GETTING_STARTED_GUIDE.md is clear |
| 2. Understand prerequisites | ✅ | Low | Section 8.5 explains API keys |
| 3. Run analyze:jd | ✅ | None | Excellent output |
| 4. Run search:evidence | ✅ | None | Clear alignment scoring |
| 5. Run check:coverage | ✅ | None | Competency analysis works |
| 6. Run generate:cv | ⚠️ | Medium | Error message is helpful, links to API consoles |
| 7. Manual variant creation | ✅ | Low | Template well-documented |
| 8. Run variants:sync | ✅ | None | Caught slug mismatch with clear error |
| 9. Run eval:variant | ✅ | None | Claims tracking works |
| 10. Run redteam:variant | ✅ | None | Pass/fail clear |

---

## What Worked Well

### 1. CLI Tool Quality (8.5/10)
The automated audit (`npm run audit:cli`) shows excellent CLI UX:
- `analyze:jd` - Clear output, helpful formatting
- `search:evidence` - Actionable alignment scores
- `check:coverage` - Visual competency analysis
- `eval:variant` - Claims tracking with file paths
- `redteam:variant` - Clear pass/fail

### 2. Error Messages
The `generate:cv` error without API key is now **helpful**:
```
Error: No API key found.

To fix:
  1. Get a key at: https://console.anthropic.com
  2. Run: export ANTHROPIC_API_KEY="your-key"

No API key? Use manual creation:
  cp content/variants/_template.yaml content/variants/your-variant.yaml
```

### 3. Documentation Structure
- `.env.example` guides API setup
- Section 8.5 in GETTING_STARTED_GUIDE covers prerequisites
- Template YAML is well-commented
- URL format is now consistent (`/#/company/role`)

### 4. Validation & Sync
The `variants:sync` command caught my mistake (slug mismatch) with a clear error message pointing to exactly what was wrong.

---

## Remaining Friction Points

### 1. ucv-cli TTY Requirement (Medium)
**Issue:** Running `npm run ucv-cli` in non-interactive mode fails silently.
**Current behavior:**
```
Non-interactive mode: printing variant status as JSON is not implemented yet.
```
**Recommendation:** Documentation now mentions this, but the error could be more helpful.

### 2. API Key Cost Expectations (Low)
**Issue:** User doesn't know if API calls have costs or free tiers.
**Recommendation:** Add note about pricing to .env.example or docs.

### 3. Manual Path Workflow (Low)
**Issue:** After copying template, next steps aren't obvious.
**Recommendation:** Add a "Manual Variant Creation Guide" section to universal-cv.md.

---

## CLI Tool Assessment

From automated audit (`npm run audit:cli`):

| Tool | Status | Help Quality | JSON | Errors | Duration |
|------|--------|-------------|------|--------|----------|
| validate | ✅ | N/A | N/A | N/A | 2.1s |
| analyze:jd | ✅ | Good | ✅ | Helpful | 1.8s |
| search:evidence | ✅ | N/A | ✅ | N/A | 2.3s |
| check:coverage | ✅ | N/A | ✅ | N/A | 2.0s |
| generate:cv --help | ✅ | Excellent | N/A | Helpful | 1.5s |
| generate:cv (no key) | ✅ | N/A | N/A | Helpful | 1.6s |
| eval:variant | ✅ | N/A | N/A | N/A | 3.2s |
| redteam:variant | ✅ | N/A | N/A | N/A | 4.1s |
| variants:sync | ✅ | N/A | N/A | N/A | 2.8s |

**Overall CLI Score: 8.5/10**

---

## Comparison with Previous Audit (2025-12-documentation-audit.md)

| Issue | Previous Status | Current Status |
|-------|-----------------|----------------|
| No .env.example | ❌ Critical | ✅ Fixed |
| API key setup missing | ❌ Critical | ✅ Fixed (Section 8.5) |
| generate:cv --help | ❌ High | ✅ Fixed |
| URL inconsistency | ⚠️ Medium | ✅ Fixed |
| ucv-cli TTY note | ⚠️ Medium | ✅ Documented |
| Multiple entry points | ⚠️ Medium | ⚠️ Still exists |

**Score Progression:**
- Previous audit: 6/10
- Current audit: 8.5/10
- Improvement: +2.5 points

---

## Recommendations

### Priority 1 (Quick Wins)
1. Add API pricing info to .env.example comments
2. Add "Manual Variant Creation" quick-start section

### Priority 2 (Nice to Have)
3. Implement JSON output for ucv-cli non-TTY mode
4. Create root README.md with learning path
5. Add video walkthrough link

### Priority 3 (Polish)
6. Add example source-data files
7. Create visual workflow diagram

---

## Conclusion

The Universal CV system is now **accessible to first-time users**. The documentation fixes from the previous audit have resolved all critical blockers. The CLI tools are well-designed with clear output and helpful error messages.

A motivated developer can now:
1. Understand how to start (GETTING_STARTED_GUIDE.md)
2. Set up API keys (.env.example)
3. Analyze job descriptions (analyze:jd)
4. Check alignment (search:evidence)
5. Generate variants (generate:cv or manual)
6. Run quality checks (eval, redteam)

**Recommended cadence:** Run this audit after any major documentation changes to verify user experience.

---

## Artifacts Generated

| Artifact | Location |
|----------|----------|
| This audit | docs/audits/2025-12-27-first-time-user-jordan-kim.md |
| CLI audit JSON | Run `npm run audit:cli -- --save` to generate |
