# Comprehensive Code Audit, Documentation & Open Source Readiness

## Enhancement Summary

**Deepened on:** 2026-01-14
**Sections enhanced:** All major sections
**Research agents used:** 8 review agents (TypeScript, Security, Performance, Architecture, Simplicity, Patterns, Frontend Races, Agent-Native), 2 project skills (serghei-qa, technical-writer), Context7 (Convex, Playwright), 4 documented learnings

### Key Improvements from Research
1. **Simplified to 3 phases** (vs original 5) per code-simplicity-reviewer
2. **Added discriminated unions pattern** for loading states per kieran-typescript-reviewer
3. **Identified 7 race conditions** in dashboard/portfolio per julik-frontend-races-reviewer
4. **Security risk matrix** with accepted trade-offs per security-sentinel
5. **Agent-native capability gap analysis** (55% accessible) per agent-native-reviewer
6. **Convex error boundary pattern** from Context7 documentation
7. **Playwright POM fixture pattern** for E2E tests from Context7

### Applied Learnings (docs/solutions/)
- **resume-link-redirect-fallback.md**: Graceful fallback for missing PDFs - already implemented, verify in E2E
- **production-variant-routes-redirect.md**: Convex URL and publish status validation - add CI check

---

## Status
Proposed

## Overview

This initiative transforms the Universal CV Portfolio from a personal project into a polished, well-documented, and usable-by-others codebase through:

1. **Code Audit** - Identify dead code, redundant patterns, and "silly" implementations
2. **Documentation** - Document each major system component clearly
3. **Happy Path Polish** - Make CV-Dashboard → CLI flows flawless
4. **Open Source Readiness** - Enable others to fork, customize, and contribute

**Priority Order:** CV-Dashboard happy path first, then CLI, then contributor experience.

---

## Problem Statement

The project has grown organically with 22 Claude skills, 25 scripts, 8 guides, and multiple entry points. This creates:

- **Confusion**: Multiple competing docs (README vs GETTING_STARTED_GUIDE vs guides/)
- **Dead Code**: Potential unused exports, deprecated patterns, orphaned skills
- **Inconsistency**: Some tools have --help, others don't; error handling varies
- **Onboarding Friction**: New users can't easily fork and personalize
- **Technical Debt**: YAML → Convex sync is one-way, draft/publish unclear

### Research Insights: Root Causes

**From pattern-recognition-specialist:**
- `slugify()` function duplicated in 7 files with slight variations - routing failure risk
- Error handling inconsistent: some scripts use try/catch, others let errors bubble

**From architecture-strategist:**
- Single source of truth unclear (YAML vs Convex)
- State (`applicationStatus`) stored in both YAML and Convex - causes drift

**From agent-native-reviewer:**
- 45% of user-accessible features are NOT agent-accessible
- Dashboard authentication blocks agents; CLI requires TTY

---

## Proposed Solution

### Research Insight: Simplified to 3 Phases

Per code-simplicity-reviewer, the original 5-phase approach was over-engineered. Consolidated:

```
Phase 1: Bug Fixes + E2E Tests      ─────────────────►  Core stability
Phase 2: Code Audit                 ─────────────────►  Technical debt
Phase 3: Documentation + Polish     ─────────────────►  Open source ready
```

---

## Technical Approach

### Phase 1: Bug Fixes + E2E Tests

**Goal:** Critical paths work flawlessly with comprehensive test coverage.

#### 1.1 Fix Critical Bugs

| Issue | File | Fix | Severity |
|-------|------|-----|----------|
| Resume PDF 404 when not generated | `public/cv-dashboard/index.html:~380` | Check PDF existence before showing link | CRIMINAL |
| Convex timeout shows infinite loader | `src/pages/VariantPortfolio.tsx:37-49` | Add error state with retry button | CRIMINAL |
| toggleStatus operates on detached DOM | `public/cv-dashboard/index.html:1386-1414` | Re-query DOM after renderVariants() | SMELLY |
| Race: wizard generation continues after close | `public/cv-dashboard/index.html:1585-1615` | Add AbortController pattern | CRIMINAL |
| Filter state lost on re-render | `public/cv-dashboard/index.html:1429-1443` | Call filterVariants() after all renders | SMELLY |

### Research Insight: Discriminated Unions for Loading States

Per kieran-typescript-reviewer, replace boolean flags with explicit states:

```typescript
// BEFORE (VariantPortfolio.tsx:37-54) - Race condition prone
if (isLoading) return <LoadingState />;
if (!variant) return <Navigate to="/" replace />;

// AFTER - Explicit state machine
type VariantLoadState =
  | { status: 'loading' }
  | { status: 'error'; error: Error }
  | { status: 'not_found' }
  | { status: 'loaded'; variant: Variant };

function useVariant(slug: string): VariantLoadState {
  const result = useQuery(api.variants.getBySlug, { slug });

  if (result === undefined) return { status: 'loading' };
  if (result === null) return { status: 'not_found' };
  return { status: 'loaded', data: result as Variant };
}

// Usage - exhaustive checking
const state = useVariant(slug);
switch (state.status) {
  case 'loading': return <LoadingState />;
  case 'error': return <ErrorState error={state.error} onRetry={() => window.location.reload()} />;
  case 'not_found': return <NotFoundState slug={slug} />;  // NOT silent redirect
  case 'loaded': return <Portfolio variant={state.data} />;
}
```

### Research Insight: Convex Error Boundary Pattern

From Context7 Convex docs:

```tsx
// main.tsx - Wrap application in error boundary
<StrictMode>
  <ErrorBoundary fallback={<ErrorFallback />}>
    <ConvexProvider client={convex}>
      <App />
    </ConvexProvider>
  </ErrorBoundary>
</StrictMode>
```

#### 1.2 Race Condition Fixes (julik-frontend-races-reviewer)

**Dashboard: toggleStatus DOM Reference Fix**

```javascript
// BEFORE - Badge points to detached DOM after renderVariants()
window.toggleStatus = async function(slug, currentStatus) {
  const badge = document.querySelector(`[data-slug="${slug}"] .badge-clickable`);
  badge.disabled = true;
  await client.mutation("variants:updateApplicationStatus", { ... });
  renderVariants();  // Badge is now orphaned!
  badge.disabled = false;  // Operating on ghost element
}

// AFTER - Track state, not DOM references
const inFlightMutations = new Set();

window.toggleStatus = async function(slug, currentStatus) {
  if (inFlightMutations.has(slug)) return;
  inFlightMutations.add(slug);

  try {
    await client.mutation("variants:updateApplicationStatus", { ... });
    renderVariants();
    filterVariants();  // Reapply filter state!
  } finally {
    inFlightMutations.delete(slug);
  }
}
```

**Dashboard: Wizard Cancellation Pattern**

```javascript
// Add cancellation for wizard generation
let generationAbortController = null;

async function generateVariant() {
  if (generationAbortController) {
    generationAbortController.abort();
  }
  generationAbortController = new AbortController();
  const thisGeneration = generationAbortController;

  wizardStep = 'generating';
  updateWizardUI();

  try {
    const result = await client.action("generate:generateVariant", { ... });
    if (thisGeneration.signal.aborted) return;  // Check if still active
    // ... handle result
  } catch (error) {
    if (thisGeneration.signal.aborted) return;
    // ... handle error
  }
}

function closeWizard() {
  if (generationAbortController) {
    generationAbortController.abort();
    generationAbortController = null;
  }
  // ... rest of close logic
}
```

#### 1.3 E2E Test Coverage (Playwright POM Pattern)

### Research Insight: Page Object Model from Context7

```typescript
// e2e/pages/dashboard-page.ts
import type { Page, Locator } from '@playwright/test';

export class DashboardPage {
  private readonly passwordInput: Locator;
  private readonly submitButton: Locator;
  private readonly variantCards: Locator;
  private readonly searchInput: Locator;

  constructor(public readonly page: Page) {
    this.passwordInput = page.locator('[data-testid="password-input"]');
    this.submitButton = page.locator('[data-testid="submit-button"]');
    this.variantCards = page.locator('[data-testid="variant-card"]');
    this.searchInput = page.locator('#search');
  }

  async goto() {
    await this.page.goto('/cv-dashboard/');
  }

  async authenticate(password: string) {
    await this.passwordInput.fill(password);
    await this.submitButton.click();
    await this.page.waitForSelector('[data-testid="dashboard-content"]');
  }

  async searchVariants(query: string) {
    await this.searchInput.fill(query);
  }

  async getVariantCount(): Promise<number> {
    return await this.variantCards.count();
  }

  async openVariant(index: number) {
    await this.variantCards.nth(index).click();
  }
}
```

```typescript
// e2e/dashboard-happy-path.spec.ts
import { test, expect } from '@playwright/test';
import { DashboardPage } from './pages/dashboard-page';

test.describe('Recruiter Happy Path', () => {
  test('can authenticate and view variants', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();
    await dashboard.authenticate(process.env.DASHBOARD_PASSWORD!);

    expect(await dashboard.getVariantCount()).toBeGreaterThan(0);
  });

  test('can search and filter variants', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();
    await dashboard.authenticate(process.env.DASHBOARD_PASSWORD!);

    await dashboard.searchVariants('bloomberg');
    expect(await dashboard.getVariantCount()).toBeGreaterThanOrEqual(1);
  });

  test('resume PDF exists before download', async ({ page }) => {
    // Test from documented learning: resume-link-redirect-fallback.md
    const dashboard = new DashboardPage(page);
    await dashboard.goto();
    await dashboard.authenticate(process.env.DASHBOARD_PASSWORD!);

    await dashboard.openVariant(0);

    // Check resume link doesn't 404
    const resumeLink = page.locator('[data-testid="download-resume"]');
    const href = await resumeLink.getAttribute('href');
    if (href) {
      const response = await page.request.head(href);
      // Should be 200 or fallback to default resume
      expect([200, 304]).toContain(response.status());
    }
  });
});
```

#### 1.4 CLI Happy Path Fixes

| Issue | Fix |
|-------|-----|
| `npm run generate:kb` doesn't exist | Add to package.json |
| `--help` inconsistent | Add Commander.js help to all 25 scripts |
| ucv-cli non-TTY mode incomplete | Add `--json` flag for CI |

```json
// package.json - Add missing script
{
  "scripts": {
    "generate:kb": "tsx scripts/generate-knowledge-base.ts"
  }
}
```

### Research Insight: Agent-Native CLI Gaps

Per agent-native-reviewer, add non-interactive alternatives:

```bash
# Proposed additions for agent accessibility
npm run ucv-cli -- create --company "X" --role "Y" --jd-file path/to/jd.txt
npm run ucv-cli -- status --slug company-role --json
npm run ucv-cli -- pipeline --slug company-role --phase eval
```

---

### Phase 2: Code Audit

**Goal:** Identify and remove dead code, fix anti-patterns, measure technical debt.

#### 2.1 Static Analysis Setup

```bash
# Install Knip for dead code detection
npm install -D knip
```

```json
// knip.json
{
  "$schema": "https://unpkg.com/knip@5/schema.json",
  "entry": [
    "src/main.tsx",
    "scripts/**/*.ts",
    "convex/**/*.ts"
  ],
  "project": ["src/**/*.{ts,tsx}", "scripts/**/*.ts", "convex/**/*.ts"],
  "ignore": ["**/*.test.ts", "**/*.spec.ts"],
  "ignoreDependencies": ["@types/*"],
  "ignoreExportsUsedInFile": true
}
```

#### 2.2 Serghei-QA Audit Checklist

### Research Insight: Audit Categories from serghei-qa skill

| Severity | Category | Check | Command |
|----------|----------|-------|---------|
| **WAR CRIME** | Security | Exposed secrets | `grep -r "sk-ant\|sk-" --include="*.ts"` |
| **CRIMINAL** | Async | Floating promises | `grep -rn "^\s*[a-zA-Z]*\(" --include="*.ts" \| grep -v await` |
| **CRIMINAL** | Types | Explicit `any` | `grep -rn ": any" --include="*.ts"` |
| **SMELLY** | DRY | slugify duplication | `grep -rn "function slugify\|const slugify" --include="*.ts"` |
| **SMELLY** | Deps | eslint-disable hooks | `grep -rn "eslint-disable.*hooks"` |
| **SILLY** | Naming | Magic numbers | `grep -rn "[^a-zA-Z][0-9]{3,}[^a-zA-Z]"` |
| **COSMETIC** | Dead | console.log | `grep -rn "console.log" --include="*.ts"` |

#### 2.3 TypeScript Anti-Patterns (kieran-typescript-reviewer)

**Priority 1: Fix `: any` types in CLI scripts**

```typescript
// BEFORE - scripts/redteam.ts:65
function readVariantYaml(slug: string): { raw: string; validated: any }

// AFTER - Use Zod inference
import type { z } from 'zod';
import { VariantSchema } from '../src/lib/schemas';
type ValidatedVariant = z.infer<typeof VariantSchema>;

function readVariantYaml(slug: string): { raw: string; validated: ValidatedVariant }
```

**Priority 2: Add tsconfig strict options**

```json
// tsconfig.app.json additions
{
  "compilerOptions": {
    "noImplicitReturns": true,
    "exactOptionalPropertyTypes": true,
    "noPropertyAccessFromIndexSignature": true
  }
}
```

#### 2.4 Pattern Recognition Fixes

**DRY Violation: slugify() in 7 files**

```typescript
// BEFORE - Duplicated in:
// - scripts/generate-cv.ts
// - scripts/sync-variants.ts
// - scripts/generate-resume.ts
// - public/cv-dashboard/index.html
// - src/lib/variants.ts
// - convex/generate.ts
// - scripts/lib/jd-parser.ts

// AFTER - Single source in scripts/lib/utils.ts
export function slugify(company: string, role: string): string {
  const normalize = (s: string) => s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `${normalize(company)}-${normalize(role)}`;
}

// Export to client via Convex internal function if needed
```

#### 2.5 Audit Output

Create `docs/audits/2026-01-code-audit.md` following serghei-qa format:

```markdown
# QA Audit: Universal CV Portfolio

*Reviewed by: Serghei (via serghei-qa skill)*

## Summary
[2-3 sentence assessment]

## Findings
| Category | WAR CRIME | CRIMINAL | SMELLY | SILLY | COSMETIC |
|----------|-----------|----------|--------|-------|----------|
| Security | 0         | 0        | 1      | 0     | 0        |
| Types    | 0         | 10       | 5      | 0     | 0        |
| DRY      | 0         | 0        | 7      | 0     | 0        |
| ...      | ...       | ...      | ...    | ...   | ...      |

## Priority Fixes
1. **Now:** CRIMINAL fixes (any types, floating promises)
2. **This Week:** SMELLY fixes (DRY violations)
3. **Eventually:** SILLY/COSMETIC

## Grade: [B]
```

---

### Phase 3: Documentation + Open Source Polish

**Goal:** Clear documentation, fork-ready codebase.

### Research Insight: Simplified Documentation per code-simplicity-reviewer

**Original plan had 8+ new docs. Simplified to 3:**

| Original Proposal | Decision | Reason |
|-------------------|----------|--------|
| for-recruiters.md | DELETE | Dashboard is self-explanatory |
| for-users.md | MERGE | Into updated GETTING_STARTED_GUIDE.md |
| for-developers.md | SKIP | Already have CODEBASE.md |
| for-forkers.md | KEEP | Only truly new persona |
| skills-catalog.md | SKIP | Skills are self-documenting |
| ADR-001-yaml-as-source | SKIP | One sentence in CODEBASE.md suffices |
| api.md | SKIP | Keep in CODEBASE.md |
| schemas.md | SKIP | TypeScript provides this |

**Final documentation set:**
- `FORKING.md` (NEW) - How to personalize
- `CONTRIBUTING.md` (NEW) - How to contribute
- `.env.example` (NEW) - All env vars documented
- Updated `README.md` - Cleaner "Where to Start" table
- Delete 5 stale root files (IMPLEMENTATION_GUIDE.md, etc.)

#### 3.1 Create FORKING.md

### Research Insight: technical-writer skill structure

```markdown
# Forking the Universal CV Portfolio

Make this portfolio your own in under 30 minutes.

## Prerequisites

- Node.js 18+
- A Convex account ([sign up free](https://convex.dev))
- API key from Anthropic, OpenAI, or Google

## Step 1: Clone and Install

```bash
git clone https://github.com/yourusername/portfolio
cd portfolio
npm install
```

## Step 2: Configure Environment

```bash
cp .env.example .env.local
# Edit .env.local with your values
```

## Step 3: Set Up Convex

```bash
npx convex dev  # Creates new deployment
```

## Step 4: Replace Content

Edit these files to personalize:

| File | What to Change |
|------|---------------|
| `content/profile.yaml` | Your name, bio, links |
| `content/experience/*.yaml` | Your work history |
| `content/case-studies/*.yaml` | Your projects |

## Step 5: Deploy

```bash
npm run build
# Deploy to GitHub Pages, Vercel, or Netlify
```

## Verification

- [ ] `npm run dev` shows your content
- [ ] `/cv-dashboard/` password gate works
- [ ] Variant generation produces your profile
```

#### 3.2 Create .env.example

```bash
# .env.example
# Copy to .env.local and fill in values

# Required: Convex deployment URL
# Get from: npx convex dev (or Convex dashboard)
VITE_CONVEX_URL=https://your-project.convex.cloud

# Required for variant generation: At least one AI provider
ANTHROPIC_API_KEY=sk-ant-...
# OR
OPENAI_API_KEY=sk-...
# OR
GEMINI_API_KEY=...

# Required for dashboard protection
DASHBOARD_PASSWORD=your-secure-password

# Optional: Admin API key for Convex mutations
# If not set, mutations are allowed in dev mode only
ADMIN_API_KEY=your-admin-key

# Optional: Site URL for OG images
VITE_SITE_URL=https://yourdomain.com
```

#### 3.3 Fork-Ready Checklist

### Research Insight: Hardcoded URL removal

```bash
# Find all hardcoded Convex URLs
grep -r "scintillating-husky-549" . --include="*.ts" --include="*.tsx" --include="*.html"

# All instances should use environment variables:
# - src/main.tsx: import.meta.env.VITE_CONVEX_URL ✓
# - public/cv-dashboard/index.html: needs fix
# - scripts/seed-convex.ts: process.env.CONVEX_URL ✓
```

**Fix dashboard hardcoded URL:**

```javascript
// BEFORE - public/cv-dashboard/index.html:1211
const CONVEX_URL = "https://scintillating-husky-549.convex.cloud";

// AFTER - Injected at build time
const CONVEX_URL = "%%VITE_CONVEX_URL%%";  // Replaced by build script
```

#### 3.4 Delete Stale Files

```bash
# These files appear unused (untracked, stale)
rm IMPLEMENTATION_GUIDE.md
rm PREVENTION_STRATEGIES.md
rm PRODUCTION_SAFETY_CHECKLIST.md
rm QUICK_REFERENCE.md
rm START_HERE.md
```

---

## Security Considerations

### Research Insight: Risk Matrix from security-sentinel

| Finding | Severity | Accepted? | Mitigation |
|---------|----------|-----------|------------|
| Client-side password hash | MEDIUM | YES | Document as visibility gate, not security |
| localStorage auth bypass | MEDIUM | YES | Real protection is ADMIN_API_KEY |
| No rate limiting | LOW | NO | Add client-side attempt counter |
| ADMIN_API_KEY dev bypass | MEDIUM | NO | Add CI check for production |
| Job descriptions in Convex | LOW | YES | Document data retention policy |

**Required Actions:**

1. **Verify ADMIN_API_KEY in production** - Add CI step:
```bash
# .github/workflows/deploy.yml
- name: Verify Convex secrets
  run: |
    if [ -z "$ADMIN_API_KEY" ]; then
      echo "ERROR: ADMIN_API_KEY not configured for production"
      exit 1
    fi
```

2. **Add rate limiting:**
```javascript
// public/cv-dashboard/index.html
let attempts = 0;
const MAX_ATTEMPTS = 5;

function checkPassword() {
  if (attempts >= MAX_ATTEMPTS) {
    document.getElementById('error').textContent = 'Too many attempts. Try again later.';
    return;
  }
  attempts++;
  // ... existing logic
}
```

---

## Performance Considerations

### Research Insight: Performance Oracle Recommendations

| Action | Impact | Priority |
|--------|--------|----------|
| Add React.memo to VariantCard | Prevent cascade re-renders | HIGH |
| Debounce Convex mutations | Reduce API calls | MEDIUM |
| Use useTransition for search | Better perceived performance | MEDIUM |
| Track Core Web Vitals | Measure before optimizing | HIGH |

**Bundle Size Target:** < 200KB initial JS

```typescript
// vite.config.ts - Already has good chunking
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'vendor-react': ['react', 'react-dom', 'react-router-dom'],
        'vendor-markdown': ['react-markdown', 'react-syntax-highlighter'],
        'vendor-motion': ['framer-motion'],
      }
    }
  }
}
```

---

## Agent-Native Improvements

### Research Insight: Capability Gaps from agent-native-reviewer

**Current state:** 55% of features are agent-accessible

**Quick wins to add:**

1. **Document Convex API as agent primitives:**
```markdown
## Agent API Reference

Agents can call these Convex functions directly:

- `variants:listAll` - List all variants (no auth required)
- `variants:getBySlug` - Get published variant
- `generate:generateVariant` - Create new variant
- `variants:updateStatus` - Publish/unpublish
```

2. **Add --json to CLI scripts:**
```typescript
// scripts/eval-variant.ts
program
  .option('--json', 'Output JSON instead of human-readable')
  .action(async (options) => {
    const result = await evaluate();
    if (options.json) {
      console.log(JSON.stringify(result));
    } else {
      console.log(formatHuman(result));
    }
  });
```

---

## Acceptance Criteria

### Phase 1: Bug Fixes + E2E Tests
- [ ] No silent redirects (show NotFoundState instead)
- [ ] Error boundary catches Convex errors
- [ ] E2E tests pass for recruiter happy path
- [ ] toggleStatus doesn't operate on detached DOM
- [ ] Wizard generation cancellable

### Phase 2: Code Audit
- [ ] Knip reports zero unused exports (or documented exceptions)
- [ ] Zero `eslint-disable` comments for hooks rules
- [ ] All `: any` types reviewed and justified/fixed
- [ ] slugify() consolidated to single source
- [ ] Audit report created

### Phase 3: Documentation + Polish
- [ ] Fresh clone + npm install + npm run dev works
- [ ] FORKING.md complete
- [ ] .env.example documents all variables
- [ ] No hardcoded Convex URLs
- [ ] Stale root files deleted

### Quality Gates
- [ ] All tests pass (`npm run test && npm run test:e2e`)
- [ ] No TypeScript errors (`npm run typecheck`)
- [ ] ESLint clean (`npm run lint`)
- [ ] Build succeeds (`npm run build`)

---

## Success Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Dead code exports | Unknown | 0 |
| `: any` types | 10+ | 0-3 (documented) |
| slugify() duplications | 7 | 1 |
| E2E test coverage (critical paths) | Partial | 100% |
| Agent-accessible features | 55% | 80% |
| Time to first variant (new user) | Unknown | < 30 min |

---

## Risk Analysis & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Breaking existing functionality | Medium | High | Run full test suite after each phase |
| Race conditions in dashboard | High | Medium | Apply julik-frontend-races-reviewer fixes |
| Convex URL drift in production | Low | High | Add CI verification step |
| Documentation becomes outdated | Medium | Low | Link to code, not copy |

---

## References & Research

### Internal References
- Architecture: `context/CODEBASE.md`
- Design system: `context/DESIGN.md`, `src/styles/globals.css`
- Convex schema: `convex/schema.ts`
- Dashboard: `public/cv-dashboard/index.html`
- CLI entry: `scripts/cli/ucv/index.ts`

### Documented Learnings Applied
- `docs/solutions/ui-bugs/resume-link-redirect-fallback.md` - Graceful PDF fallback
- `docs/solutions/deployment-issues/production-variant-routes-redirect.md` - Convex URL validation

### External References
- [Knip - Dead Code Detection](https://knip.dev/)
- [Convex Error Handling](https://docs.convex.dev/functions/error-handling)
- [Playwright Page Object Model](https://playwright.dev/docs/test-fixtures)
- [Command Line Interface Guidelines](https://clig.dev/)

### Review Agents Consulted
- kieran-typescript-reviewer: TypeScript anti-patterns, discriminated unions
- security-sentinel: Risk matrix, accepted trade-offs
- performance-oracle: Bundle size, Convex optimizations
- architecture-strategist: YAML-as-source validation
- code-simplicity-reviewer: Phase consolidation, doc reduction
- pattern-recognition-specialist: DRY violations, naming
- julik-frontend-races-reviewer: 7 race conditions identified
- agent-native-reviewer: Capability gap analysis

---

*Plan created: 2026-01-14*
*Plan deepened: 2026-01-14*
*Author: Claude Code with 8 review agents + 2 skills + Context7*
