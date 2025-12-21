# Implementation Tickets: Cockpit-UCV Improvements

**Generated:** 2025-12-21
**Source:** Combined analysis + peer review feedback
**Total Tickets:** 15

---

## Priority Legend

| Priority | Meaning | Timeline |
|----------|---------|----------|
| **P0** | Blocker — Must fix before next milestone | Immediate |
| **P1** | High Impact — Significant UX/quality improvement | Next sprint |
| **P2** | Polish — Nice to have, improves experience | Backlog |
| **P3** | Strategic — Future direction | Planning |

---

## P0: Critical Path (Blockers)

### UCV-001: Implement Code Splitting for Portfolio Bundle

**Priority:** P0 (Blocker)
**Component:** Web / Vite Config
**Estimate:** 2-4 hours

#### Problem
Bundle size is 484KB gzipped (2.4× the 200KB target). This blocks the "hired-on-sight" goal where portfolio must load in <3 seconds.

#### Solution
Add `manualChunks` configuration to `vite.config.ts`:

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-animation': ['framer-motion'],
          'vendor-blog': ['react-markdown', 'react-syntax-highlighter', 'remark-gfm'],
        }
      }
    }
  }
});
```

#### Acceptance Criteria
- [ ] Main chunk < 150KB gzipped
- [ ] Vendor chunks load on demand
- [ ] No chunk size warnings in build output
- [ ] Lighthouse Performance score > 90

#### Files to Modify
- `vite.config.ts`

---

### UCV-002: One-Command Create-to-Eval Flow

**Priority:** P0 (Blocker)
**Component:** CLI / ucv-cli
**Estimate:** 4-6 hours

#### Problem
Creating a new variant requires multiple manual steps: create → sync → evaluate → verify. Users must remember to run each step and wait between them.

#### Solution
Add a "Create and Evaluate" action that chains the entire flow:

```
[c] Create variant
    └── Prompt for job URL/details
    └── Auto-run: Sync → Evaluate → (pause for verify if needed)
    └── Show summary: "Created bloomberg-tpm. Eval: 3/5 verified. Next: Verify claims"
```

#### Implementation
1. Add `--auto-eval` flag to create flow
2. After YAML is written, immediately trigger sync
3. After sync, trigger evaluation
4. Display inline summary instead of returning to dashboard
5. If unverified claims exist, prompt: "Verify now? [y/n]"

#### Acceptance Criteria
- [ ] Single action creates and evaluates variant
- [ ] User sees immediate feedback on variant quality
- [ ] No manual navigation between steps
- [ ] Errors are shown inline with guidance

#### Files to Modify
- `scripts/cli/ucv/index.ts` (createVariantFlow, main loop)

---

### UCV-003: Detailed Error Messages with Actionable Fixes

**Priority:** P0 (Blocker)
**Component:** CLI / All Scripts
**Estimate:** 6-8 hours

#### Problem
Current error handling shows generic messages like "Command failed (exit 1)" without explaining what failed or how to fix it.

#### Solution
Enhance error output with:
1. **What failed:** Specific claim, field, or file
2. **Why it failed:** Validation rule, missing source, etc.
3. **How to fix:** Actionable suggestion
4. **Where to look:** File path with line number

#### Example Output (Before)
```
❌ Evaluation failed for bloomberg-tpm
```

#### Example Output (After)
```
❌ Evaluation failed for bloomberg-tpm

  Problem: Claim "15× revenue growth" has no verified source
  Location: overrides.about.bio[0]

  Suggested fixes:
  • Add supporting evidence to content/knowledge/achievements/ankr.yaml
  • Reword the claim to match an existing achievement
  • Verify manually via: npm run eval:variant -- --slug bloomberg-tpm --verify claim-abc123=content/knowledge/achievements/ankr.yaml

  See: capstone/develop/evals/bloomberg-tpm.claims.yaml:42
```

#### Acceptance Criteria
- [ ] All error types have specific messages
- [ ] Every error includes a suggested fix
- [ ] File paths are formatted as `path:line:col` for editor jump
- [ ] Links to relevant documentation where applicable

#### Files to Modify
- `scripts/cli/ucv/index.ts` (error handling)
- `scripts/evaluate-variants.ts` (error messages)
- `scripts/redteam.ts` (error messages)
- `scripts/sync-variants.ts` (error messages)

---

## P1: High Impact

### UCV-004: Migrate CLI to Ink Framework

**Priority:** P1
**Component:** CLI / Architecture
**Estimate:** 16-24 hours (multi-session)

#### Problem
The `ucv/index.ts` file is 2,600 lines of raw readline/keypress handling. This is hard to maintain, test, and extend.

#### Solution
Migrate to **Ink** (React for CLI) which provides:
- Component-based UI (reusable, testable)
- Built-in support for menus, forms, spinners
- Automatic handling of window resize
- Better accessibility

#### Implementation Plan
1. **Phase 1:** Install Ink and create basic App component
2. **Phase 2:** Port dashboard rendering to Ink components
3. **Phase 3:** Port overlays (actions, claims, help) to Ink
4. **Phase 4:** Port input handling (create flow) to Ink forms
5. **Phase 5:** Remove old readline code

#### New File Structure
```
scripts/cli/ucv/
├── index.tsx           # Entry point
├── App.tsx             # Main app component
├── components/
│   ├── Dashboard.tsx   # Variants table + details
│   ├── ActionMenu.tsx  # Actions overlay
│   ├── ClaimsVerifier.tsx
│   ├── CreateFlow.tsx
│   ├── StatusBar.tsx
│   └── HelpPanel.tsx
├── hooks/
│   ├── useVariants.ts  # Data loading
│   ├── useRunner.ts    # Process execution
│   └── useKeyboard.ts  # Key bindings
└── utils/
    └── theme.ts        # Existing theme (unchanged)
```

#### Acceptance Criteria
- [ ] All existing functionality preserved
- [ ] File size reduced by 50%+ (split into components)
- [ ] Tests added for key components
- [ ] Window resize handled gracefully

#### Dependencies to Add
- `ink` (React for CLI)
- `ink-select-input` (menu component)
- `ink-spinner` (loading states)
- `ink-text-input` (forms)

---

### UCV-005: Template/Defaults for Variant Creation

**Priority:** P1
**Component:** CLI / Create Flow
**Estimate:** 3-4 hours

#### Problem
Every variant field must be entered manually. Common patterns (e.g., similar role types) require re-entering the same overrides.

#### Solution
Add template support:
1. **Base template:** Default overrides inherited by all variants
2. **Role templates:** Pre-configured for common role types (PM, Engineer, etc.)
3. **Clone existing:** Start from an existing variant

#### Implementation
```yaml
# content/variants/_templates/pm-template.yaml
overrides:
  sections:
    beyondWork: false
    blog: true
    skills: true
  about:
    stats:
      - value: "8+"
        label: "Years PM"
```

```
Create variant:
  [1] From scratch
  [2] Use template: pm-template
  [3] Clone existing: bloomberg-tpm
```

#### Acceptance Criteria
- [ ] Templates stored in `content/variants/_templates/`
- [ ] Template selection shown during create flow
- [ ] Clone preserves structure, clears company-specific content
- [ ] Default template can be set in config

#### Files to Modify
- `scripts/cli/ucv/index.ts` (createVariantFlow)
- New: `content/variants/_templates/` directory

---

### UCV-006: Status Icons and Color Coding on Dashboard

**Priority:** P1
**Component:** CLI / Dashboard
**Estimate:** 2-3 hours

#### Problem
Dashboard status is text-heavy. Users must read each column to understand variant health.

#### Solution
Add visual icons and consistent color coding:

| Status | Icon | Color |
|--------|------|-------|
| Pass | ✅ | Green |
| Fail | ❌ | Red |
| Warning | ⚠️ | Yellow |
| Pending | ○ | Gray |
| Running | ● | Blue (animated) |

#### Updated Dashboard Layout
```
╭─────────────────────────────────────────────────────────────────────────────╮
│ ◆ Universal CV Cockpit  3 variants         ✅ 2 ready · ⚠️ 1 in-flight     │
╰─────────────────────────────────────────────────────────────────────────────╯

  Slug                      Pub    Sync  Eval    RT      Next
  ─────────────────────────────────────────────────────────────
▶ bloomberg-tpm             LIVE   ✅    5/5 ✅   ✅      Live
  gensyn-researcher         DRAFT  ✅    3/5 ⚠️   ✅      Verify claims
  stripe-platform-pm        DRAFT  ❌    ○       ○       Sync
```

#### Acceptance Criteria
- [ ] Icons visible in all status columns
- [ ] Colors match theme.ts definitions
- [ ] Fallback to text in non-color terminals
- [ ] Legend available in help panel

#### Files to Modify
- `scripts/cli/ucv/index.ts` (renderVariantsTable, fmtSync, fmtEval, fmtRedteam)
- `scripts/cli/theme.ts` (add icon constants)

---

### UCV-007: Lazy Load Heavy Components

**Priority:** P1
**Component:** Web / React
**Estimate:** 2-3 hours

#### Problem
Components like `LikeAnalytics` (505 lines) and `BlogPostPage` are loaded even when not needed, inflating initial bundle.

#### Solution
Use `React.lazy()` and `Suspense` for heavy components:

```typescript
// src/App.tsx
const BlogPostPage = React.lazy(() => import('./components/BlogPostPage'));
const LikeAnalytics = React.lazy(() => import('./components/LikeAnalytics'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        {/* ... */}
      </Routes>
    </Suspense>
  );
}
```

#### Acceptance Criteria
- [ ] BlogPostPage loads only when navigating to /blog/*
- [ ] LikeAnalytics loads only when blog post is viewed
- [ ] Loading state shown during chunk fetch
- [ ] No flash of unstyled content

#### Files to Modify
- `src/App.tsx`
- `src/components/Blog.tsx`

---

## P2: Polish

### UCV-008: Add Progress Spinners with ora

**Priority:** P2
**Component:** CLI / Visual Feedback
**Estimate:** 2-3 hours

#### Problem
Long-running operations (sync, eval, redteam) show static text. Users can't tell if the CLI is working or frozen.

#### Solution
Add animated spinners using `ora`:

```typescript
import ora from 'ora';

const spinner = ora('Syncing variant...').start();
// ... do work
spinner.succeed('Sync complete');
// or
spinner.fail('Sync failed: missing YAML');
```

#### Spinner States
- **Sync:** "Syncing YAML → JSON..."
- **Evaluate:** "Extracting claims... (3/12)"
- **Red Team:** "Scanning for issues..."
- **Publish:** "Publishing to production..."

#### Acceptance Criteria
- [ ] Spinner shown for all operations > 500ms
- [ ] Progress count where applicable (e.g., claims 3/12)
- [ ] Spinner replaced with ✅/❌ on completion
- [ ] Works in non-TTY mode (falls back to static text)

#### Files to Modify
- `scripts/cli/ucv/index.ts` (runPhase)

---

### UCV-009: Light Mode Visual Polish

**Priority:** P2
**Component:** Web / CSS
**Estimate:** 2-3 hours

#### Problem
Light mode feels muted compared to dark mode. Orbs at 0.15 opacity are barely visible. Shadows lack depth.

#### Solution
1. Increase orb opacity in light mode (0.15 → 0.25)
2. Add subtle box shadows to cards
3. Increase contrast for secondary text
4. Add subtle border to testimonial cards

#### Acceptance Criteria
- [ ] Orbs visible but not distracting in light mode
- [ ] Cards have appropriate depth
- [ ] Text contrast meets WCAG AA
- [ ] Consistent feel between light and dark modes

#### Files to Modify
- `src/styles/globals.css` (CSS variables for light mode)
- `src/components/common/AmbientBackground.tsx`

---

### UCV-010: Add Contextual Help Footer

**Priority:** P2
**Component:** CLI / UX
**Estimate:** 1-2 hours

#### Problem
Users must remember keyboard shortcuts. New users may not know how to navigate.

#### Solution
Add a persistent footer showing context-sensitive shortcuts:

```
─────────────────────────────────────────────────────────────────────────────
[↑↓] navigate  [Enter] select  [c] create  [a] actions  [r] refresh  [q] quit
```

Footer changes based on context:
- **Dashboard:** navigation + create + quit
- **Actions overlay:** select + back
- **Create flow:** next + cancel
- **Running:** cancel only

#### Acceptance Criteria
- [ ] Footer visible at all times
- [ ] Shortcuts update based on context
- [ ] Muted color so it doesn't distract
- [ ] [?] key shows full help panel

#### Files to Modify
- `scripts/cli/ucv/index.ts` (renderFooter)

---

### UCV-011: Migrate Inline Styles to CSS Classes

**Priority:** P2
**Component:** Web / CSS
**Estimate:** 4-6 hours

#### Problem
324 inline styles scattered across components. Hard to maintain, no hover states, no media queries.

#### Solution
1. Audit inline styles with `grep -r "style={{"`
2. Create utility classes for common patterns
3. Migrate component-specific styles to CSS modules or styled-components

#### Priority Order
1. `Portfolio.tsx` (highest inline count)
2. `HeroSection.tsx`
3. `AboutSection.tsx`
4. Remaining components

#### Acceptance Criteria
- [ ] Inline style count reduced by 80%
- [ ] Utility classes documented
- [ ] No visual regressions
- [ ] Hover/focus states work correctly

#### Files to Modify
- Multiple component files
- `src/styles/utilities.css` (new)

---

### UCV-012: Complete Non-Interactive CLI Mode

**Priority:** P2
**Component:** CLI / Automation
**Estimate:** 3-4 hours

#### Problem
CLI requires TTY. Can't be used in CI pipelines or automation scripts.

#### Solution
Add `--json` flag that outputs machine-readable results:

```bash
# Check all variants, output JSON
npm run ucv-cli -- --json

# Output:
{
  "variants": [
    {
      "slug": "bloomberg-tpm",
      "sync": "ok",
      "eval": { "status": "ok", "verified": 5, "claims": 5 },
      "redteam": { "status": "pass", "fails": 0, "warns": 1 },
      "publishStatus": "published"
    }
  ],
  "summary": { "total": 3, "ready": 2, "blocked": 1 }
}
```

#### Acceptance Criteria
- [ ] `--json` outputs valid JSON to stdout
- [ ] Exit code reflects overall status (0=ok, 1=issues)
- [ ] Works without TTY
- [ ] Documented in README

#### Files to Modify
- `scripts/cli/ucv/index.ts` (main, add JSON output path)

---

## P3: Strategic (Future)

### UCV-013: Generalize Beyond Crypto Domain

**Priority:** P3
**Component:** Architecture
**Estimate:** Planning

#### Problem
Current knowledge base and examples are crypto-focused. Limits adoption by professionals in other domains.

#### Solution
1. Abstract domain-specific content into configurable themes
2. Provide starter templates for common domains (SaaS, Fintech, Healthcare, etc.)
3. Document how to customize for any domain

#### Deliverables
- [ ] Domain configuration file
- [ ] 3 starter templates (SaaS PM, Backend Engineer, Designer)
- [ ] Migration guide for existing users

---

### UCV-014: Team Collaboration Features

**Priority:** P3
**Component:** Architecture
**Estimate:** Planning

#### Problem
UCV is single-user. Teams can't share knowledge bases or review variants.

#### Solution
1. Shared knowledge base (git-based)
2. Review workflow for variants (PR-like)
3. Role-based access (editor, reviewer, publisher)

#### Considerations
- Git-based sharing is simplest (no server needed)
- GitHub Actions for automated checks
- Comments on variants via GitHub PR comments

---

### UCV-015: Batch Evaluation ("Evaluate All")

**Priority:** P3
**Component:** CLI
**Estimate:** 2-3 hours

#### Problem
Running evaluation for each variant individually is slow when making portfolio-wide changes.

#### Solution
Add "Evaluate All" action to dashboard:

```
[a] Actions
  ├── Run guided next step
  ├── Run pipeline
  ├── ...
  └── [NEW] Evaluate all variants
```

#### Implementation
- Run `npm run eval:check` with progress
- Show summary table of results
- Highlight variants with new issues

#### Acceptance Criteria
- [ ] Single action evaluates all variants
- [ ] Progress shown during evaluation
- [ ] Summary table shows pass/fail per variant
- [ ] Dashboard refreshes after completion

---

## Summary

| Priority | Count | Estimated Hours |
|----------|-------|-----------------|
| P0 | 3 | 12-18 hours |
| P1 | 4 | 23-34 hours |
| P2 | 5 | 12-18 hours |
| P3 | 3 | Planning |

**Recommended Execution Order:**
1. UCV-001 (Code Splitting) — Unblocks performance
2. UCV-003 (Error Messages) — Quick UX win
3. UCV-002 (Create-to-Eval) — Core workflow improvement
4. UCV-006 (Status Icons) — Visual feedback
5. UCV-004 (Ink Migration) — Foundation for future CLI work

---

## Ticket Template for Issue Tracker

```markdown
## [UCV-XXX] Title

**Priority:** P0/P1/P2/P3
**Component:** CLI / Web / Architecture
**Estimate:** X hours

### Problem
[What's wrong or missing]

### Solution
[What we'll do to fix it]

### Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2

### Files to Modify
- `path/to/file.ts`
```
