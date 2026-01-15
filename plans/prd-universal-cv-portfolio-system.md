# Universal CV Portfolio System - Umbrella PRD

**Version**: 1.1 (Deepened)
**Date**: 2026-01-15
**Author**: Dmitrii (with Claude)
**Status**: Draft

---

## Enhancement Summary

**Deepened on:** 2026-01-15
**Research agents used:** 10 (Architecture, TypeScript, Security, Simplicity, Race Conditions, Performance, Agent-Native, Convex, Mobile UX, CLI TUI)
**Project learnings applied:** 3

### Key Improvements from Research

1. **Security Critical Fix**: Password gate uses trivially-reversible DJB2 hash - must implement proper auth or accept as "obscurity only"
2. **Performance Win**: Replace `react-syntax-highlighter` with `prism-react-renderer` for -200KB gzipped
3. **Architecture Fix**: Delete duplicate `/dashboard/` - keep only `/public/cv-dashboard/`
4. **Type Safety**: Replace `v.any()` with typed Convex validators (currently CRIMINAL severity)
5. **Race Condition Fix**: Add cancellation token to wizard AI generation flow
6. **Simplification**: Consolidate `BlogPostModal.tsx` (1152 lines) + `BlogPostPage.tsx` (949 lines) into single component

### Critical Warnings Discovered

| Issue | Severity | Impact |
|-------|----------|--------|
| Password hash exposed in HTML source | CRITICAL | Anyone can brute-force access |
| `localStorage.setItem('dashboard_auth', 'true')` bypasses auth | CRITICAL | Zero actual security |
| Dev mode allows unprotected mutations | HIGH | Misconfigured prod = data loss |
| Two dashboards can show conflicting state | HIGH | User confusion, data inconsistency |
| PDF download links don't verify file existence | HIGH | 404 served as "successful" download |

### Estimated Impact

- **Bundle size reduction**: -200KB gzipped (47% of current vendor-markdown chunk)
- **Code reduction**: ~1,500-2,500 LOC from consolidation
- **Agent accessibility**: 75% → 90%+ with recommended MCP tools

---

## Executive Summary

The Universal CV Portfolio System enables job seekers to rapidly generate tailored portfolio variants and linked resumes from a single source of truth. The primary interface is a browser-based dashboard (mobile-responsive) for quick generation, with a secondary CLI (`ucv-cli`) for power users who need quality pipelines, evals, and redteaming. All data is stored in Convex for real-time synchronization.

**This PRD consolidates the system vision, addresses technical debt, and provides a clear path to a production-ready MVP.**

---

## Problem Statement

### The Pain

1. **Manual Resume Tailoring is Slow** - Creating job-specific resumes takes 30-60+ minutes per application
2. **Consistency Errors** - Copy-paste between variants introduces typos, outdated info, and cross-contamination
3. **No Single Source of Truth** - Experience, case studies, and skills scattered across multiple documents
4. **Quality Blind Spots** - No systematic way to verify claims, check for sycophancy, or ensure ATS compatibility

### The Gap

| Current Solution | Why It Fails |
|------------------|--------------|
| Word/Google Docs templates | Manual updates, no validation, version drift |
| Resume builders (Enhancv, etc.) | Generic, no portfolio integration, limited AI |
| LinkedIn Easy Apply | One-size-fits-all, no tailoring |
| Current system (partially built) | Scope creep, duplicate dashboards, broken docs |

### The Opportunity

Build a **focused, production-ready** variant generation system that:
- Generates tailored variants in <5 minutes from any job description
- Links portfolios to ATS-ready PDF resumes automatically
- Provides quality gates (eval, redteam) for confident submissions
- Works on mobile browsers for on-the-go applications

---

## Target Users

### Primary: Job-Seeking Product Manager (Dmitrii)

**Context**: Senior PM actively interviewing, needs to apply to 5-10 roles/week

**Jobs to be Done**:

| Job Type | Job Statement |
|----------|---------------|
| **Functional** | When I find an interesting role, I want to generate a tailored portfolio variant in under 5 minutes, so I can apply before the deadline |
| **Functional** | When I need to send a resume, I want it automatically generated from my variant, so I don't have to manually sync changes |
| **Emotional** | When I submit an application, I want to feel confident there are no embarrassing errors, so I don't sabotage my candidacy |
| **Social** | When a recruiter views my portfolio, I want to appear professional and prepared, so they see me as a serious candidate |

**Forces Diagram**:
```
Push (Current Pain):
├── Manual tailoring takes 45+ min/application
├── Typos and copy-paste errors embarrass me
└── Can't remember what I told which company

Pull (New Solution):
├── AI-generated variants in <5 minutes
├── Automated quality checks catch errors
└── Single source of truth for all variants

Anxiety (Hesitation):
├── "Will AI make me sound generic/fake?"
├── "What if generation fails mid-application?"
└── "Is my data secure?"

Habit (Current Behavior):
├── "I know how to use Word/Notion"
├── "I've always done it manually"
└── "I can't trust AI with my career"
```

### Secondary: Developer/Power User

**Context**: Wants programmatic control, CI/CD integration, batch operations

**Jobs to be Done**:
- Use CLI for scripted generation and quality pipelines
- Analyze outputs with eval and redteam reports
- Integrate with existing workflows (Git, CI/CD)

---

## Feature Specification (MoSCoW)

### Must Have (MVP - This PR Cycle)

| Feature | Description | Acceptance Criteria |
|---------|-------------|---------------------|
| **Dashboard Variant Generation** | Create variants from JD paste/URL | User can generate variant in <5 min |
| **Linked Resume Generation** | Auto-generate PDF from variant | PDF accessible via dashboard link |
| **Single Dashboard** | Consolidate to one Convex-backed dashboard | Only `/cv-dashboard/` exists |
| **Publish Workflow** | Ability to publish drafts from dashboard | "Publish" button visible, functional |
| **Resume Existence Check** | Only show download if PDF exists | No broken download links |
| **Mobile Responsive** | Dashboard works on iPhone Safari | All actions completable on mobile |
| **Authentication** | Password gate (current model acceptable) | Unauthorized users see gate |

### Should Have (v1 - Next Sprint)

| Feature | Description | Priority Rationale |
|---------|-------------|-------------------|
| **ucv-cli Polish** | Clean up TUI, add keyboard shortcuts | Power user productivity |
| **Batch Resume Generation** | Generate all PDFs in one command | Deployment efficiency |
| **Application Status Tracking** | Mark applied/interviewing/rejected | Job search organization |
| **Variant Archive** | Soft-delete outdated variants | Reduce clutter |
| **Error Differentiation** | Show specific AI error types | Debug failed generations |

### Could Have (v2+)

| Feature | Description | Consideration |
|---------|-------------|---------------|
| Server-side PDF Generation | Remove dev server dependency | Simplifies CI/CD |
| Offline Dashboard | IndexedDB caching | Mobile without connectivity |
| LinkedIn Integration | Import profile data | Reduce manual entry |
| Quality Score Badge | Show eval/redteam status in dashboard | Visual trust indicator |
| Multi-user Support | Clerk auth, user isolation | If productized |

### Won't Have (Explicit Exclusions)

| Feature | Reason | Reconsider When |
|---------|--------|-----------------|
| ATS Optimization Scoring | Unsubstantiated claims, snake oil | Research validates specific techniques |
| Chrome Extension | Scope creep, browser complexity | Core features stable 6+ months |
| Team/Enterprise Features | Single-user focus | User demand appears |
| LightRAG Integration | Parked scope creep | Core variant generation stable |
| CareerGating Features | Parked scope creep | PRD validated separately |
| Obsidian Vault Integration | Unused, 16MB of images | Clear use case defined |

---

## Technical Approach

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           USER INTERFACES                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌────────────────────┐     ┌────────────────────┐     ┌─────────────────┐  │
│  │   CV Dashboard     │     │   Portfolio Site   │     │    ucv-cli      │  │
│  │   (React/Vite)     │     │   (React Router)   │     │    (Ink TUI)    │  │
│  │   /cv-dashboard/   │     │   /{company}/{role}│     │    Terminal     │  │
│  └─────────┬──────────┘     └─────────┬──────────┘     └────────┬────────┘  │
│            │                          │                          │           │
│            └──────────────────────────┼──────────────────────────┘           │
│                                       │                                      │
├───────────────────────────────────────┼──────────────────────────────────────┤
│                           CONVEX BACKEND                                     │
├───────────────────────────────────────┼──────────────────────────────────────┤
│                                       │                                      │
│  ┌────────────────────────────────────┴────────────────────────────────────┐│
│  │                         Convex Functions                                 ││
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  ││
│  │  │   Queries    │  │  Mutations   │  │   Actions    │  │   HTTP      │  ││
│  │  │  getBySlug   │  │   upsert     │  │ generateVar  │  │ uploadPDF   │  ││
│  │  │  listAll     │  │ updateStatus │  │ extractJD    │  │             │  ││
│  │  └──────────────┘  └──────────────┘  └──────────────┘  └─────────────┘  ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                       │                                      │
│  ┌────────────────────────────────────┴────────────────────────────────────┐│
│  │                         Convex Tables                                    ││
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                   ││
│  │  │   variants   │  │  baseContent │  │   _storage   │                   ││
│  │  │  (18 docs)   │  │  (1 doc)     │  │   (PDFs)     │                   ││
│  │  └──────────────┘  └──────────────┘  └──────────────┘                   ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                           EXTERNAL SERVICES                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                       │
│  │  Anthropic   │  │   OpenAI     │  │   Gemini     │                       │
│  │  Claude API  │  │   (backup)   │  │   (backup)   │                       │
│  └──────────────┘  └──────────────┘  └──────────────┘                       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Data Model

```typescript
// convex/schema.ts - Enhanced
interface Variant {
  _id: Id<"variants">;
  _creationTime: number;

  // Core identifiers
  slug: string;                    // e.g., "stripe-senior-pm"
  company: string;                 // Extracted for indexing
  role: string;                    // Extracted for indexing

  // Lifecycle
  publishStatus: "draft" | "published";
  applicationStatus?: "not_applied" | "applied" | "interviewing" | "rejected" | "offered";
  appliedAt?: string;              // ISO 8601

  // Content
  data: VariantData;               // Full variant (Zod-validated on write)

  // Resume
  hasResume: boolean;              // True if PDF exists
  resumeStorageId?: Id<"_storage">; // Convex file storage ref
  resumePath?: string;             // Legacy filesystem path

  // Audit
  updatedAt: string;
  createdBy?: string;
}
```

### Key API Endpoints

| Endpoint | Type | Auth | Purpose |
|----------|------|------|---------|
| `variants:getBySlug` | Query | Public | Load published variant by slug |
| `variants:listAll` | Query | Public | Dashboard variant list |
| `variants:upsert` | Mutation | API Key | Create/update variant |
| `variants:publish` | Mutation | API Key | Change draft → published |
| `variants:updateApplicationStatus` | Mutation | API Key | Track applications |
| `generate:generateVariant` | Action | API Key | AI-powered generation |
| `generate:extractJobDetails` | Action | API Key | Parse JD for company/role |

### Technical Constraints

| Constraint | Requirement | Rationale |
|------------|-------------|-----------|
| Initial bundle | < 200KB gzipped | Mobile performance (currently 164KB) |
| Query latency | P95 < 300ms | Real-time dashboard feel |
| AI generation | < 60s timeout | User patience limit |
| PDF size | < 500KB per resume | Email attachment limits |
| Browser support | Last 2 versions Chrome/Safari/Firefox | Modern web standards |

### Research Insights: Technical Approach

#### Convex Best Practices (from framework-docs-researcher)

**Schema Pattern**: Your use of `v.any()` with Zod validation on write is acceptable but consider promoting frequently-queried fields:

```typescript
// Recommended: Extract indexed fields from blob
variants: defineTable({
  slug: v.string(),
  company: v.string(),                    // Promoted for filtering
  role: v.string(),                       // Promoted for filtering
  applicationStatus: v.optional(v.union(
    v.literal("not_applied"),
    v.literal("applied")
  )),
  data: v.any(),                          // Keep blob for complex nested data
})
  .index("by_company", ["company"])
  .index("by_application", ["applicationStatus"])
```

**Optimistic Updates**: Add to status toggles for instant UI feedback:

```typescript
const updateStatus = useMutation(api.variants.updateStatus).withOptimisticUpdate(
  (localStore, args) => {
    const current = localStore.getQuery(api.variants.listAll, {});
    if (current) {
      const updated = current.map(v =>
        v.slug === args.slug ? { ...v, publishStatus: args.publishStatus } : v
      );
      localStore.setQuery(api.variants.listAll, {}, updated);
    }
  }
);
```

#### Mobile UX Patterns (from best-practices-researcher)

**Touch Targets**: All interactive elements must be 44x44px minimum (WCAG 2.5.8):

```css
.touch-btn { min-height: 44px; min-width: 44px; touch-manipulation; }
```

**iOS Safari Keyboard**: Use `visualViewport` API for keyboard-aware layouts:

```typescript
const handleResize = () => {
  const heightDiff = window.innerHeight - window.visualViewport.height;
  setKeyboardHeight(heightDiff > 150 ? heightDiff : 0);
};
```

**Dynamic Viewport**: Use `100dvh` instead of `100vh` for full-height layouts.

#### Performance Optimizations (from performance-oracle)

**Critical Fix**: Replace `react-syntax-highlighter` (-200KB gzipped):

```typescript
// BEFORE: 267KB vendor-markdown chunk
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

// AFTER: ~15KB with prism-react-renderer
import { Highlight } from 'prism-react-renderer';
```

**Lazy Loading Pattern**:

```typescript
const Blog = lazy(() => import('./Blog'));
const CaseStudyDrawer = lazy(() => import('./case-study/CaseStudyDrawer'));
```

**Convex Pagination**: For 50+ variants, implement cursor-based pagination:

```typescript
export const listPaginated = query({
  args: { cursor: v.optional(v.string()), limit: v.number() },
  handler: async (ctx, { cursor, limit }) => {
    return ctx.db.query("variants")
      .withIndex("by_slug")
      .paginate({ cursor, numItems: limit });
  },
});
```

---

## Technical Debt Reduction Plan

### Debt Inventory

| ID | Category | Severity | Location | Description |
|----|----------|----------|----------|-------------|
| TD-001 | DRY Violation | SMELLY | 7+ files | `slugify()` duplicated across codebase |
| TD-002 | Architecture | SMELLY | `/dashboard/`, `/public/cv-dashboard/` | Duplicate dashboard implementations |
| TD-003 | Dead Code | COSMETIC | `the-vault/` | 16MB unused Obsidian notes |
| TD-004 | Broken Docs | SMELLY | `docs/scope-creep/` | Parked features with broken links |
| TD-005 | Type Safety | CRIMINAL | `convex/schema.ts:8` | `v.any()` for variant data |
| TD-006 | Inline Styles | SMELLY | 29 files, 380+ occurrences | Maintainability concern |
| TD-007 | Large Files | SMELLY | `BlogPostModal.tsx` (1152 lines) | Monolithic component |
| TD-008 | Build Warnings | COSMETIC | Vite output | Chunks exceed 500KB |

### Cleanup Phases

#### Phase 1: Critical Consolidation (This PR)

**Goal**: Single source of truth, no duplicate implementations

- [ ] **Consolidate dashboards** - Keep `/public/cv-dashboard/`, delete `/dashboard/`
- [ ] **Extract slugify utility** - Create `src/lib/slugify.ts`, update all imports
- [ ] **Add hasResume check** - Only show download button if resume exists
- [ ] **Add publish button** - Enable draft → published from dashboard UI

**Files to Delete**:
```
/dashboard/                         # Duplicate dashboard
/the-vault/                         # Unused Obsidian notes (16MB)
```

**Files to Move**:
```
docs/scope-creep/lightrag-*.md      → docs/archive/parked/
docs/scope-creep/careergating-*.md  → docs/archive/parked/
docs/scope-creep/mastra-*.md        → docs/archive/parked/
docs/scope-creep/JOB_HUNTING_*.md   → docs/archive/parked/
```

#### Phase 2: Code Quality (Next Sprint)

- [ ] **Split BlogPostModal** - Extract shared logic to `useBlogPost` hook
- [ ] **Replace inline styles** - Top 5 offending files → CSS modules or Tailwind
- [ ] **Add return validators** - Convex mutations with explicit return types
- [ ] **Fix type safety** - Extract indexed fields from `v.any()` data blob

#### Phase 3: Documentation (Ongoing)

- [ ] **Update CLAUDE.md** - Reflect actual current state
- [ ] **Archive broken links** - Remove or fix dead documentation
- [ ] **Add variant lifecycle docs** - draft → published → archived flow

### Verification Commands

```bash
# Before merging any cleanup PR:
npm run typecheck    # Zero errors
npm run lint         # Zero warnings
npm run test         # All 266 tests pass
npm run build        # Succeeds, no new warnings
```

---

## Success Metrics

### MVP Success Criteria (2 weeks)

| Metric | Target | Measurement |
|--------|--------|-------------|
| Variant generation success rate | > 95% | Convex logs |
| Time to generate variant | < 5 min | User testing |
| Dashboard mobile usability | All actions completable | Manual QA |
| Resume download success | 100% (no broken links) | E2E test |
| Technical debt items closed | 4 (Phase 1) | PR merge |

### v1 Success Criteria (6 weeks)

| Metric | Target | Measurement |
|--------|--------|-------------|
| Active variants | 25+ | Convex query |
| Resume PDFs generated | 20+ | File count |
| CLI usage sessions | 10+ | Terminal logs |
| Application tracking adoption | 50% of variants have status | Convex query |
| Remaining tech debt | < 5 items | Audit |

### Quality Gates

- [ ] Zero console errors on variant pages
- [ ] Lighthouse Performance >= 90 (mobile)
- [ ] Zero broken internal links
- [ ] All E2E tests passing

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| AI API rate limits during generation | Medium | High | Implement retry with exponential backoff |
| Convex downtime affects dashboard | Low | High | Add offline mode (v2) |
| JD URL fetch blocked by sites | High | Medium | Clear error message + manual paste fallback |
| Resume PDF generation fails | Medium | Medium | Show clear error, offer regeneration |
| Scope creep returns | High | High | Strict Won't Have list, PRD as contract |

### Research Insights: Security (from security-sentinel)

**CRITICAL FINDINGS**:

1. **Password Hash Exposure**: DJB2 hash `nxt2ji` is visible in HTML source - trivially brute-forceable
2. **Auth Bypass**: `localStorage.setItem('dashboard_auth', 'true')` grants instant access
3. **Dev Mode Fail-Open**: If `ADMIN_API_KEY` unset, all mutations are unprotected

**Immediate Actions Required**:

```bash
# Set production auth key (REQUIRED)
npx convex env set ADMIN_API_KEY "<secure-random-key>"
```

**Security Decision Required**: Accept current obscurity-based auth for personal use OR implement proper auth (Clerk, Convex Auth, Cloudflare Access).

### Research Insights: Race Conditions (from julik-frontend-races-reviewer)

**HIGH-RISK RACE CONDITIONS**:

| Flow | Risk | Fix |
|------|------|-----|
| Wizard AI generation | User closes wizard while generation in progress → duplicate variants | Add AbortController pattern |
| Two tabs open | Status toggle in tab A not reflected in tab B | Consolidate to single dashboard with real-time sync |
| PDF download | Link shown before PDF exists → 404 served as download | Check `hasResume` flag before showing button |

**Cancellation Pattern for Wizard**:

```javascript
let abortController = null;

async function generateVariant() {
  abortController = new AbortController();
  try {
    const result = await client.action("generate:generateVariant", {...});
    if (abortController.signal.aborted) return; // Wizard closed
    wizardStep = 'success';
  } catch (error) {
    if (abortController.signal.aborted) return;
    // Handle error
  }
}

function closeWizard() {
  abortController?.abort();
  abortController = null;
}
```

### Project Learnings Applied

From `docs/solutions/`:

1. **React Router Static File Interception** (`react-router-static-file-interception.md`)
   - Use explicit file extensions: `/cv-dashboard/index.html` not `/cv-dashboard/`
   - Force full page navigation with `window.location.href`

2. **Production Variant Routes Redirect** (`production-variant-routes-redirect.md`)
   - Verify `VITE_CONVEX_URL` secret matches production Convex
   - Variants must be `publishStatus: "published"` to be visible

3. **Resume Link Fallback** (`resume-link-redirect-fallback.md`)
   - Check `metadata.resumePath` before assuming PDF exists
   - Fall back to `/resume.pdf` when variant doesn't have generated resume

---

## Implementation Phases

### Phase 1: MVP Cleanup (Week 1-2)

**Deliverables**:
1. Single consolidated dashboard at `/cv-dashboard/`
2. Working publish flow (draft → published)
3. Resume existence check (no broken downloads)
4. Deleted duplicate code and unused files
5. All tech debt Phase 1 items resolved

**Success Criteria**: User can generate variant → publish → download resume entirely from dashboard

### Phase 2: Quality Polish (Week 3-4)

**Deliverables**:
1. Improved error messages for AI failures
2. Application status tracking in dashboard
3. ucv-cli stability improvements
4. Mobile UX polish (touch targets, keyboard handling)

**Success Criteria**: Zero friction in happy path, clear guidance in error states

### Phase 3: Production Hardening (Week 5-6)

**Deliverables**:
1. E2E test coverage for critical paths
2. Performance optimization (lazy loading, code splitting)
3. Documentation refresh
4. Monitoring and alerting setup

**Success Criteria**: System stable for daily use, no manual interventions needed

---

## Open Questions

### Critical (Answer Before Implementation)

| # | Question | Default Assumption |
|---|----------|-------------------|
| Q1 | Is the current password gate security sufficient? | Yes - obscurity acceptable for personal use |
| Q2 | Should variants auto-publish or require manual publish? | Manual publish for quality control |
| Q3 | Should resume generation be blocking or async? | Blocking for MVP, async for v2 |

### Important (Answer During Implementation)

| # | Question | Default Assumption |
|---|----------|-------------------|
| Q4 | What happens to existing `/dashboard/` users? | Redirect to `/cv-dashboard/` |
| Q5 | Should deleted variants be soft-delete or hard-delete? | Soft-delete (add `archived` status) |
| Q6 | How long should AI generation take before timeout? | 60 seconds |

---

## References

### Internal Documentation
- `context/CODEBASE.md` - Architecture patterns
- `context/PROJECT_STATE.md` - Strategic audit
- `context/DESIGN.md` - Design system
- `.claude/PROJECT_CONTEXT.md` - AI agent context

### Existing PRDs (Patterns)
- `docs/scope-creep/careergating-prd.md` - Evidence-based PRD example

### External Resources
- [Convex Documentation](https://docs.convex.dev/)
- [Product School PRD Template](https://productschool.com/blog/product-strategy/product-template-requirements-document-prd)
- [JTBD Framework](https://jtbd.info/)

---

## Appendix A: Current System State

### Working Components
- 18 active variants in Convex
- React 19 + Vite 7 frontend (195KB gzip)
- Convex backend with queries, mutations, actions
- ucv-cli with TUI screens
- 266 passing tests
- 21 Claude Code skills

### Known Issues
- Duplicate dashboards (2 implementations)
- Duplicate slugify functions (7+ locations)
- Unused the-vault directory (16MB)
- Parked scope creep docs with broken links
- BlogPostModal/BlogPostPage duplication (1152/949 lines)

### Variant Pipeline Status
```
JD → Extract → Generate → Validate → Save (Draft) → Publish → Resume PDF
     ↓          ↓          ↓          ↓              ↓         ↓
   Working   Working    Working    Working      MISSING    Manual
```

---

## Appendix B: User Flow Summary

### Dashboard (Primary JTBD)

```
1. Auth → Password gate → Dashboard
2. View → List variants → Stats (total/applied/pending)
3. Create → Paste JD → Extract details → Generate → Save draft
4. Publish → [MISSING] → Need to implement
5. Resume → Download PDF → [Broken if PDF doesn't exist]
6. Track → Toggle application status → Update stats
```

### CLI (Secondary JTBD)

```
1. Launch → npm run ucv-cli → TUI dashboard
2. Navigate → Arrow keys → Select variant
3. Actions → Enter → View/Sync/Eval/RedTeam/Resume
4. Create → 'c' → Wizard → Template → Details → Save
5. Pipeline → Run full pipeline → Sync → Eval → RedTeam → Resume
```

---

## Appendix C: Agent-Native Architecture Assessment

**Current Agent Accessibility**: 75% (17/23 capabilities)

### Agent-Accessible Actions

| Action | Tool | Status |
|--------|------|--------|
| Generate variant | `generateVariant` action + CLI | OK |
| Extract JD details | `extractJobDetails` action | OK |
| Publish variant | `updateStatus` mutation | OK |
| Update application status | `updateApplicationStatus` mutation | OK |
| Run quality pipeline | CLI scripts | OK |
| Generate resume | `generate-resume.ts` | OK |

### Agent Gaps (Need Implementation)

| Missing Capability | Recommendation |
|-------------------|----------------|
| Dashboard stats query | Add `variants.getDashboardStats` Convex query |
| Filtered variant list | Add `variants.listFiltered({ status?, company? })` |
| Delete variant documentation | Document `variants.remove` in skills |
| MCP tools | Create MCP server wrapping Convex functions |

### Quick Wins for 90%+ Agent Accessibility

```typescript
// convex/variants.ts - Add these queries
export const getDashboardStats = query({
  handler: async (ctx) => {
    const variants = await ctx.db.query("variants").collect();
    return {
      total: variants.length,
      applied: variants.filter(v => v.data?.metadata?.applicationStatus === 'applied').length,
      pending: variants.filter(v => v.data?.metadata?.applicationStatus !== 'applied').length,
    };
  }
});
```

---

## Appendix D: Simplification Recommendations

From code-simplicity-reviewer:

### Consolidate BlogPost Components (Highest Impact)

| Component | Lines | Overlap |
|-----------|-------|---------|
| `BlogPostModal.tsx` | 1152 | 80% |
| `BlogPostPage.tsx` | 949 | 80% |

**Recommendation**: Single `BlogPostView` component (~600 lines) with `mode: 'modal' | 'page'` prop.

**Duplicated logic to extract**:
- Table of contents extraction
- Scroll progress tracking
- Like/unlike functionality
- Share buttons
- Code syntax highlighting
- All CSS styles (200+ lines each)

### YAGNI Violations to Remove from Scope

| Feature | Reason | Alternative |
|---------|--------|-------------|
| Server-side PDF generation (v2) | Client-side works | Build when needed |
| Offline dashboard (v2) | Rarely used offline | Build when requested |
| LinkedIn integration (v2) | Manual copy works | Build with 100+ variants |
| Multi-user support (v2) | Single user today | Build with user demand |
| 3-phase tech debt schedule | Over-planned | Fix blocking items only |

### Timeline Simplification

**Original**: 6 weeks for "MVP"
**Recommended**: 2 weeks for true MVP

**True MVP scope**:
1. Generate variant from dashboard
2. Store in Convex
3. View in portfolio
4. Download resume

Everything else is optimization for problems you don't have yet.

---

## Appendix E: Research Sources

### Agents Used

1. **framework-docs-researcher**: Convex patterns, schema design, file storage
2. **best-practices-researcher**: Mobile UX (touch targets, keyboard), CLI TUI (Ink patterns)
3. **architecture-strategist**: Component structure, consolidation recommendations
4. **kieran-typescript-reviewer**: Type safety, DRY violations, return validators
5. **security-sentinel**: Auth vulnerabilities, OWASP compliance
6. **code-simplicity-reviewer**: YAGNI analysis, consolidation opportunities
7. **julik-frontend-races-reviewer**: Race conditions, state management
8. **performance-oracle**: Bundle analysis, lazy loading, query optimization
9. **agent-native-reviewer**: API parity, MCP potential
10. **repo-research-analyst**: Codebase structure, existing patterns

### Project Learnings Applied

1. `docs/solutions/integration-issues/react-router-static-file-interception.md`
2. `docs/solutions/deployment-issues/production-variant-routes-redirect.md`
3. `docs/solutions/ui-bugs/resume-link-redirect-fallback.md`

### External Documentation Consulted

- [Convex Documentation](https://docs.convex.dev/)
- [WCAG 2.5.8 Target Size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- [Ink CLI Documentation](https://github.com/vadimdemedes/ink)
- [Vite Build Configuration](https://vitejs.dev/guide/build.html)
- [React Router v6](https://reactrouter.com/en/main)

---

**Document Version History**

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-15 | Initial PRD based on comprehensive research |
| 1.1 | 2026-01-15 | Deepened with 10 research agents + 3 project learnings |
