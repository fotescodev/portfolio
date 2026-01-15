# Test: Variant Generation Flow through CV-Dashboard

> **Status:** Planning (Deepened)
> **Type:** Feature Test + Gap Analysis
> **Created:** 2026-01-14
> **Deepened:** 2026-01-14

---

## Enhancement Summary

**Research agents used:** 8 reviewers + 3 research agents + 4 documented learnings
**Sections enhanced:** All major sections

### Key Improvements
1. **Simplified scope** - Removed Phase 3 (dashboard creation UI) per YAGNI principles
2. **Security hardening** - Added critical security recommendations for auth and SSRF
3. **Performance targets** - Added specific latency metrics and caching strategies
4. **Race condition fixes** - Identified 5 frontend race conditions with fixes
5. **Convex testing patterns** - Added convex-test examples with mocking

### Critical Findings from Research
- Dashboard is view-only (no creation capability) - this is by design for MVP
- Password hash in client HTML is a security risk (CRITICAL)
- Toggle button race condition can cause duplicate mutations
- `v.any()` in Convex schema loses type safety on reads

---

## Overview

Test and validate the end-to-end Variant Generation Flow with a focus on:
1. JD (Job Description) link ingestion via CLI
2. JD parsing and extraction
3. Variant portfolio creation
4. Tailored resume generation
5. Error surfacing in the CV-Dashboard

## Critical Finding: Dashboard Creation Gap

**The CV-Dashboard is currently VIEW-ONLY.** This is intentional for MVP.

| Capability | UCV CLI | generate-cv.ts | CV Dashboard |
|------------|---------|----------------|--------------|
| JD URL Input | Yes (stored) | Yes (fetched) | **No** |
| JD Text Input | Yes | Yes | **No** |
| AI Generation | No (manual YAML) | Yes | **No** |
| View Variants | No | No | Yes |
| Status Toggle | No | No | Yes |
| Error Display | Terminal output | Terminal output | Minimal |

### Research Insight: Simplification
Per simplicity review, the phased approach was over-engineered. **Consolidated to 2 phases:**
1. **Phase 1:** Test existing CLI generation + verify in dashboard
2. **Phase 2:** Improve dashboard error surfacing

**Removed:** Dashboard creation UI (YAGNI - feature doesn't exist, shouldn't test it)

---

## Test Environment Setup

### Prerequisites

```bash
# Verify Convex is running
npx convex dev

# Verify dev server is running (for resume generation)
npm run dev

# Verify base content is seeded
npm run seed:content

# Verify correct Convex URL (prevents production routing issues)
npx ts-node scripts/verify-convex-url.ts
```

### Research Insight: Documented Learnings
From `docs/solutions/deployment-issues/production-variant-routes-redirect.md`:
- Always verify `VITE_CONVEX_URL` matches production Convex deployment
- Variants must have `publishStatus: "published"` to be visible
- Silent redirects to home indicate variant not found or not published

### Test Data (Simplified)

| Test Case | Input | Expected Result |
|-----------|-------|-----------------|
| Valid | JD URL or text | Clean extraction and generation |
| Invalid | 404 URL or empty | Graceful error message |

---

## Phase 1: Test Existing Generation Flow (CLI)

### Test 1.1: Happy Path - generate-cv.ts

**Command:**
```bash
npm run generate:cv -- \
  --company "TestCompany" \
  --role "Senior PM" \
  --jd-url "https://example.com/job" \
  --jd-text "We're hiring a Senior PM to lead platform..."
```

**Assertions:**
- [ ] YAML created at `content/variants/testcompany-senior-pm.yaml`
- [ ] JSON artifact at `content/variants/testcompany-senior-pm.json`
- [ ] Variant appears in Convex DB with `publishStatus: "draft"`
- [ ] Manifest updated at `public/cv-dashboard/variants-manifest.json`

**Error Scenarios:**
- [ ] Invalid JD URL (404) → Shows "Failed to fetch JD URL"
- [ ] Missing API key → Shows "ANTHROPIC_API_KEY not set"

### Research Insight: Convex Testing Patterns

From Context7 Convex documentation, use `convex-test` for isolated testing:

```typescript
// convex/tests/generate.test.ts
import { convexTest } from "convex-test";
import { expect, test, vi } from "vitest";
import { api } from "./_generated/api";
import schema from "./schema";

test("generateVariant requires base content", async () => {
  const t = convexTest(schema);

  await expect(
    t.action(api.generate.generateVariant, {
      company: "TestCo",
      role: "PM",
      jobDescription: "Test job",
    })
  ).rejects.toThrowError("Base portfolio content not found");
});

test("extractJobDetails handles Claude API", async () => {
  const t = convexTest(schema);

  // Mock Claude API response
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => ({
      ok: true,
      json: async () => ({
        content: [{ text: '{"company":"Acme","role":"PM","companyValues":""}' }]
      })
    }) as Response)
  );

  const result = await t.action(api.generate.extractJobDetails, {
    jobDescription: "Acme is hiring a PM..."
  });

  expect(result.company).toBe("Acme");
  vi.unstubAllGlobals();
});
```

### Test 1.2: Resume Generation

**Command:**
```bash
npm run generate:resume -- --variant testcompany-senior-pm
```

**Assertions:**
- [ ] Dev server required (port check)
- [ ] PDF created at `public/resumes/testcompany-senior-pm.pdf`
- [ ] YAML updated with `resumePath`

### Research Insight: Resume Fallback
From `docs/solutions/ui-bugs/resume-link-redirect-fallback.md`:
- Not all variants have generated resumes
- `getResumeUrl()` now checks `metadata.resumePath` before constructing URL
- Falls back to `/resume.pdf` if variant doesn't have generated resume

---

## Phase 2: Dashboard Error Surfacing & Race Condition Fixes

### Current Error Handling (Baseline)

| Error Type | Current Behavior | Location |
|------------|------------------|----------|
| Load failure | "Failed to load variants. Please refresh." | `dashboard/index.html:447` |
| Status toggle | `alert("Failed to update status")` | `dashboard/index.html:534` |
| Wrong password | "Incorrect code" | `dashboard/index.html:422` |
| Network error | No handling | Missing |

### Research Insight: Race Conditions (CRITICAL)

From frontend races review, 5 race conditions identified:

#### Race #1: Toggle Button Re-render (CRITICAL)
**Problem:** Clicking toggle, then clicking another toggle before first mutation completes causes:
- First `renderVariants()` destroys second button's DOM reference
- `button.disabled = false` on catch operates on garbage-collected node
- Stats flicker, duplicate mutations possible

**Fix:**
```javascript
const pendingMutations = new Set();

window.toggleStatus = async function(slug, currentStatus) {
  if (pendingMutations.has(slug)) return;
  pendingMutations.add(slug);

  // Optimistic update
  const variant = variants.find(v => v.slug === slug);
  const newStatus = currentStatus === 'applied' ? 'not_applied' : 'applied';
  if (variant) variant.applicationStatus = newStatus;
  renderVariants();

  try {
    await client.mutation("variants:updateApplicationStatus", {
      slug, applicationStatus: newStatus
    });
  } catch (error) {
    // Rollback on failure
    if (variant) variant.applicationStatus = currentStatus;
    renderVariants();
    alert('Failed to update status. Please try again.');
  } finally {
    pendingMutations.delete(slug);
    renderVariants();
  }
};
```

#### Race #2: Filter During Load
**Problem:** Typing in search while variants load is silently ignored.

**Fix:** Store pending filter query, apply after render:
```javascript
let pendingFilterQuery = null;

function filterVariants() {
  const query = document.getElementById('search').value.toLowerCase();
  if (!variants.length) {
    pendingFilterQuery = query;
    return;
  }
  applyFilter(query);
}

function renderVariants() {
  // ... existing render ...
  if (pendingFilterQuery !== null) {
    applyFilter(pendingFilterQuery);
    pendingFilterQuery = null;
  }
}
```

### Test 2.1: Error Display Improvements

**Test Cases:**

1. **Network Error**
   - Disconnect network during load
   - Expected: Show "Connection lost" with retry button
   - Test with Playwright:
   ```typescript
   await page.context().setOffline(true);
   await page.reload();
   await expect(page.getByText(/connection|offline/i)).toBeVisible();
   ```

2. **Status Toggle Failure**
   - Simulate mutation error
   - Expected: Rollback to previous state, show error
   - Test:
   ```typescript
   await page.route('**/convex/**', route => {
     if (route.request().method() === 'POST') {
       route.fulfill({ status: 500, body: 'Internal Error' });
     }
   });
   ```

### Research Insight: Playwright Network Testing
From Context7 Playwright docs:
```typescript
// Intercept and mock API responses
await page.route('**/api/**', route => route.fulfill({
  status: 200,
  contentType: 'application/json',
  body: JSON.stringify({ variants: [] })
}));

// Simulate network failure
await page.route('**/api/**', route => route.abort());

// Listen for failed requests
page.on('requestfailed', request => {
  console.log(request.url() + ' ' + request.failure().errorText);
});
```

---

## Security Hardening (CRITICAL)

### Research Insight: Security Sentinel Findings

#### Issue 1: Password Hash in Client HTML (CRITICAL)
**Location:** `dashboard/index.html:401`
```javascript
const HASH = 'nxt2ji'; // Visible to anyone with DevTools
```

**Risk:** Authentication bypass trivial:
```javascript
localStorage.setItem('dashboard_auth', 'true');
location.reload();
```

**Recommendation:** Move to server-side authentication or accept this is obscurity-only for personal use.

#### Issue 2: SSRF in URL Fetching (HIGH)
**Location:** `scripts/analyze-jd.ts:514-569`

**Risk:** No URL validation allows fetching internal resources:
```bash
curl -X POST localhost:3000/api/analyze-jd \
  -d '{"url": "http://169.254.169.254/latest/meta-data/"}'
```

**Fix:**
```typescript
function validateJobUrl(url: string): boolean {
  const parsed = new URL(url);

  // Only allow HTTPS
  if (parsed.protocol !== 'https:') return false;

  // Block private IPs
  const privatePatterns = [
    /^10\./, /^172\.(1[6-9]|2|3[01])\./, /^192\.168\./,
    /^127\./, /^169\.254\./, /^localhost$/i
  ];
  if (privatePatterns.some(p => p.test(parsed.hostname))) return false;

  // Allow known job boards only (optional)
  const allowedDomains = ['lever.co', 'greenhouse.io', 'linkedin.com'];
  return allowedDomains.some(d => parsed.hostname.endsWith(d));
}
```

#### Issue 3: Missing Authorization on listAll Query (HIGH)
**Location:** `convex/variants.ts:56-73`

**Risk:** Anyone can enumerate all variants without authentication.

**Recommendation:** Add authentication check or accept data is not sensitive.

---

## Performance Optimization

### Research Insight: Performance Oracle Findings

**Current Flow Timing:**
| Step | Latency | Optimization |
|------|---------|--------------|
| JD URL Fetch | 500-2000ms | Add caching layer |
| Claude Haiku (extraction) | 800-1500ms | Parallelize with content load |
| Claude Sonnet (generation) | 3-8s | Stream for perceived speed |
| Convex Mutation | 100-300ms | Already optimal |
| **Total** | **4.4-11.8s** | Target: **3-8s** |

**Recommended Optimizations:**

1. **JD Content Cache**
```typescript
const JD_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const jdCache = new Map<string, { content: string; timestamp: number }>();

async function fetchJobDescription(url: string): Promise<string> {
  const cached = jdCache.get(url);
  if (cached && Date.now() - cached.timestamp < JD_CACHE_TTL_MS) {
    return cached.content;
  }
  const content = await fetchFromNetwork(url);
  jdCache.set(url, { content, timestamp: Date.now() });
  return content;
}
```

2. **Dashboard Pagination** (for scale)
```typescript
export const listPaginated = query({
  args: {
    cursor: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 25;
    const results = await ctx.db
      .query("variants")
      .order("desc")
      .paginate({ cursor: args.cursor, numItems: limit });
    return { variants: results.page, nextCursor: results.continueCursor };
  },
});
```

**Performance Targets:**
| Metric | Current | Target |
|--------|---------|--------|
| P50 Generation | 8s | 5s |
| Dashboard Load | 500ms | <200ms |
| JD Cache Hit Rate | 0% | 80% |

---

## Architecture Improvements

### Research Insight: Centralize Shared Logic

**Problem:** `slugify()` duplicated in 3 files:
- `convex/generate.ts:24-31`
- `src/pages/VariantPortfolio.tsx:14-21`
- `scripts/cli/ucv/screens/CreateScreen.tsx:69-77`

**Risk:** Slug divergence breaks variant routing.

**Fix:** Extract to shared module:
```typescript
// src/lib/slug.ts (for frontend)
// convex/lib/utils.ts (for Convex)
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
```

### Research Insight: Structured Error Responses

**Current:** Errors thrown as plain strings
```typescript
throw new Error("Variant not found: " + args.slug);
```

**Better:** Structured errors for programmatic handling
```typescript
import { ConvexError } from "convex/values";

throw new ConvexError({
  code: "VARIANT_NOT_FOUND",
  message: "Variant not found",
  slug: args.slug,
  suggestions: ["Check slug format", "List available variants"]
});
```

---

## Acceptance Criteria (Simplified)

### Must Pass
- [ ] CLI generation creates variant visible in dashboard
- [ ] Error messages are user-friendly (no technical jargon)
- [ ] Toggle race condition is fixed (no duplicate mutations)
- [ ] Retry mechanism works for load failures

### Should Pass
- [ ] Dashboard shows publishStatus badge (Draft/Published)
- [ ] Network errors show specific guidance
- [ ] Performance targets met (P50 < 8s generation)

---

## Test Files to Create

```
convex/tests/
├── generate.test.ts        # Convex action tests with mocked Claude
└── variants.test.ts        # CRUD operation tests

e2e/
├── dashboard.spec.ts       # Playwright tests for dashboard
└── fixtures/
    └── sample-jds/
        ├── valid.txt
        └── invalid.txt
```

### Convex Test Template

```typescript
// convex/tests/variants.test.ts
import { convexTest } from "convex-test";
import { expect, test } from "vitest";
import { api } from "./_generated/api";
import schema from "./schema";

test("getBySlug returns null for drafts", async () => {
  const t = convexTest(schema);

  await t.mutation(api.variants.upsert, {
    slug: "test-pm",
    publishStatus: "draft",
    data: { metadata: { company: "Test" } }
  });

  const result = await t.query(api.variants.getBySlug, { slug: "test-pm" });
  expect(result).toBeNull(); // Drafts not visible publicly
});

test("listAll requires auth when ADMIN_API_KEY set", async () => {
  const t = convexTest(schema);
  process.env.ADMIN_API_KEY = "test-key";

  // Should work for admin endpoints
  const variants = await t.query(api.variants.listAll);
  expect(Array.isArray(variants)).toBe(true);
});
```

### Playwright Test Template

```typescript
// e2e/dashboard.spec.ts
import { test, expect } from '@playwright/test';

test.describe('CV Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Authenticate
    await page.evaluate(() => {
      localStorage.setItem('dashboard_auth', 'true');
    });
    await page.goto('/cv-dashboard/');
  });

  test('should display variants after loading', async ({ page }) => {
    await expect(page.locator('#loading')).not.toBeVisible({ timeout: 10000 });
    await expect(page.locator('#variants-table')).toBeVisible();
  });

  test('should handle network failure gracefully', async ({ page }) => {
    await page.route('**/*.convex.cloud/**', route => route.abort());
    await page.reload();
    await expect(page.getByText(/failed|retry/i)).toBeVisible();
  });

  test('should prevent concurrent toggle mutations', async ({ page }) => {
    // Click two toggles rapidly
    const toggles = page.locator('.status-toggle');
    await toggles.first().click();
    await toggles.nth(1).click();

    // Second should be disabled or queued
    await expect(toggles.nth(1)).toBeDisabled();
  });
});
```

---

## References

### Internal Files
- `convex/generate.ts:37-103` - extractJobDetails action
- `convex/generate.ts:113-194` - generateVariant action
- `convex/variants.ts:12-207` - variants CRUD operations
- `dashboard/index.html:393-562` - dashboard logic

### Documented Learnings Applied
- `docs/solutions/deployment-issues/production-variant-routes-redirect.md` - Convex URL verification
- `docs/solutions/ui-bugs/resume-link-redirect-fallback.md` - Resume fallback pattern
- `docs/solutions/integration-issues/cv-dashboard-dev-port-configuration.md` - DEV mode ports

### External Resources
- [Convex Testing with convex-test](https://docs.convex.dev/testing/convex-test)
- [Vitest Mocking Guide](https://vitest.dev/guide/mocking)
- [Playwright Network Testing](https://playwright.dev/docs/network)
- [NN/g Error Message Guidelines](https://www.nngroup.com/articles/error-message-guidelines/)

---

## Next Steps

1. **Immediate:** Run existing CLI generation flow to establish baseline
2. **This Week:** Fix toggle race condition in dashboard
3. **This Week:** Add retry mechanism for load failures
4. **Later:** Implement JD caching for performance
