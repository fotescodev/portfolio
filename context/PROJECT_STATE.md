# Portfolio Project State
**Version**: 4.0
**Last Updated**: 2025-12-21

> Single source of truth for AI agents and developers. Combines strategic context with session history.

---

## Document Map

| Part | Purpose | Update Frequency |
|------|---------|------------------|
| I | Strategic Audit | After major milestones |
| II | Priority Action Plan | Each session |
| III | Agent Governance | Rarely (rules stable) |
| IV | Roadmap | After phase completions |
| V | Capstone Pipeline | After pipeline changes |
| VI | Session Log | Every session |

---

## Part I: Strategic Audit

### 1.1 Executive Summary

Portfolio at **90% production-ready**. Universal CV engine online with 5 variants. Blog UX complete. **Code splitting shipped** — bundle reduced 59%.

**The "Hired-on-Sight" Delta**: Social proof enhancement + light mode polish.

### 1.2 Technical Health

| Component | Status |
|-----------|--------|
| Type Safety | 9/10 — Zod validates all content |
| Tests | 211 passing |
| Bundle | 195KB initial (59% reduction via code splitting) |
| Build | Clean TypeScript, Vite 7 |

### 1.3 Technical Debt

| Issue | Severity | Impact |
|-------|----------|--------|
| ~~Bundle Size~~ | ~~CRITICAL~~ | ✅ RESOLVED — 195KB initial load |
| ~~No Code Splitting~~ | ~~HIGH~~ | ✅ RESOLVED — Route + component lazy loading |
| **Inline Styles** (324) | MEDIUM | Maintainability |
| **LikeAnalytics.tsx** (505 lines) | LOW | Could lazy load (admin-only) |

### 1.4 Design Fidelity

**Premium Score**: 8.5/10 → Target: 9/10

| Aspect | Status |
|--------|--------|
| Typography | Strong (Instrument Serif/Sans) |
| Color Palette | Elegant (#c29a6c accent) |
| Dark Mode | Complete |
| Light Mode | ✅ Polished (boosted orbs, card shadows) |
| 120+ CSS Variables | Complete |

---

## Part II: Priority Action Plan

### P0: Critical Path

| Task | Impact | Status |
|------|--------|--------|
| ~~Code Splitting~~ | 480KB → 195KB | ✅ DONE |
| Lazy Load LikeAnalytics | Further reduce initial | LOW PRIORITY |

### P1: Conversion Drivers

| Task | Impact | Status |
|------|--------|--------|
| Trust Battery Testimonials | Social proof | Deferred |
| Featured Case Study | Visual hierarchy | Deferred |

### P2: Polish

| Task | Impact | Status |
|------|--------|--------|
| ~~Light Mode Polish~~ | ~~Theme parity~~ | ✅ DONE |
| Inline Style Refactor | Maintainability | Backlog |

---

## Part III: Agent Governance

> **ATTENTION ALL AI AGENTS**: These rules are mandatory.

### 3.1 Session Logging — MANDATORY

At **end of every session**, update Part VI (Session Log) with:
- Summary (1-2 sentences)
- Key changes (bullet list)
- Files changed
- Next actions

### 3.2 Design System First

> "If it isn't in the Design System, it doesn't exist."

| Rule | Description |
|------|-------------|
| Single Source | `context/DESIGN.md` + `src/styles/globals.css` |
| No Snowflakes | NEVER hardcode colors/pixels — use CSS variables |
| Theme Parity | Every change MUST work in Dark AND Light mode |

### 3.3 Git Workflow

| Rule | Description |
|------|-------------|
| Branch Protection | `main` is PROTECTED — no direct pushes |
| Feature Branches | Create descriptive branches |
| Pull Requests | Use `gh pr create`, squash merge |

### 3.4 Before Finalizing UI Work

- [ ] Used CSS variables from `globals.css`?
- [ ] No hardcoded hex colors or pixels?
- [ ] Tested in both Dark AND Light mode?
- [ ] Mobile responsive?

---

## Part IV: Roadmap

### Phase 1: Foundation — COMPLETE
- [x] Zod schemas for all content
- [x] CaseStudyDrawer refactor

### Phase 2: Polish — COMPLETE
- [x] Framer Motion integration
- [x] Ambient orb effects
- [x] Floating Omnibar
- [x] Dynamic SEO

### Phase 3: Social & Content — 60%
- [x] Blog UX (progress bar, TOC, sharing, likes)
- [ ] Trust Battery Testimonials (deferred)
- [ ] Scroll-Driven Storytelling (deferred)

### Phase 4: Performance — 50%
- [x] Code Splitting (195KB initial, 59% reduction)
- [ ] Lazy Load Analytics (low priority)
- [ ] Image Component
- [ ] Inline Style Refactor

---

## Part V: Capstone Quality Pipeline

### Overview

YAML is canonical. JSON is derived. Every claim must be traceable.

```
JD Analysis → Alignment Gate → Knowledge Base → Variant YAML → sync → JSON → eval → redteam → Deploy
```

### Pre-Generation Scripts (Deterministic)

These scripts run BEFORE generating variants, reducing AI judgment overhead:

```bash
# ═══════════════════════════════════════════════════════════════
# JD ANALYSIS — Extract requirements, filter generic phrases
# ═══════════════════════════════════════════════════════════════
npm run analyze:jd -- --file source-data/jd-{company}.txt --save
# Output: capstone/develop/jd-analysis/{slug}.yaml

# ═══════════════════════════════════════════════════════════════
# EVIDENCE SEARCH — Search knowledge base for alignment
# ═══════════════════════════════════════════════════════════════
npm run search:evidence -- --jd-analysis capstone/develop/jd-analysis/{slug}.yaml --save
npm run search:evidence -- --terms "crypto,staking,api" --threshold 0.5
# Output: capstone/develop/alignment/{slug}.yaml

# ═══════════════════════════════════════════════════════════════
# COVERAGE CHECK — Categorize bullets into 7 PM competency bundles
# ═══════════════════════════════════════════════════════════════
npm run check:coverage
npm run check:coverage -- --json
```

**What they do:**
| Script | Purpose | Output |
|--------|---------|--------|
| `analyze:jd` | Filters 47+ generic phrases, extracts must-haves | JD analysis YAML |
| `search:evidence` | Searches achievements/stories, scores alignment | Alignment report |
| `check:coverage` | Categorizes bullets into 7 PM competency bundles | Coverage matrix |

### Post-Generation Commands

```bash
npm run variants:sync              # YAML→JSON
npm run eval:variant -- --slug X   # Generate claims ledger
npm run redteam:variant -- --slug X # Adversarial scan
npm run ucv-cli                    # Interactive dashboard
```

### Quality Gates

| Check | Catches |
|-------|---------|
| `RT-SEC-SECRETS` | API keys, tokens |
| `RT-SEC-CONFIDENTIAL` | NDA language |
| `RT-TONE-SYCOPHANCY` | "thrilled", "dream company" |
| `RT-XVAR-CONTAM` | Mentions other target company |

### Files Reference

| Purpose | Path |
|---------|------|
| JD Analysis | `capstone/develop/jd-analysis/*.yaml` |
| Alignment Reports | `capstone/develop/alignment/*.yaml` |
| Workflow Guide | `docs/guides/capstone-workflow.md` |
| CLI Guide | `docs/guides/universal-cv-cli.md` |
| Knowledge Base | `content/knowledge/` |
| Variants | `content/variants/*.yaml` |

---

## Part VI: Session Log

### Quick Reference (Patterns to Remember)

| Pattern | Implementation |
|---------|----------------|
| Markdown links in highlights | `[Product](url)` renders as accent-colored links |
| SMART bullets | 3-4 per role: `[Action] + [What] + [Metric] + [Context]` |
| Schema-first workflow | Read `src/lib/schemas.ts` before writing content |

### Content Locations

| Content | File |
|---------|------|
| Experience | `content/experience/index.yaml` |
| Case Studies | `content/case-studies/*.md` |
| Variants | `content/variants/*.yaml` |
| Schemas | `src/lib/schemas.ts` |

### Validation Commands

```bash
npm run validate  # Check content against Zod
npm run build     # Production build
npm run test      # Run test suite
npm run dev       # Dev server at :5173
```

---

### Current Status

**Date**: 2025-12-23
**Objective**: Apply to roles — 9 variants ready, pipeline clear
**Bundle**: 143KB gzip initial (target <200KB)
**Tests**: 210 passing (ALL GREEN)
**Variants**: 9 active
**CSS Variables**: 124 defined
**Inline Styles**: 348 occurrences (debt)
**Premium Score**: 8.5/10

**Blockers**: None

**Recent Wins**:
- Fixed mobile omnibar visibility bug (observer now checks both desktop/mobile CTAs)
- REAL testimonials from Anchorage colleagues (social proof)
- Mobile UX improvements (CTA relocation, testimonial carousel)
- All 210 tests passing
- Anthropic AI Safety Fellow variant (negative example)
- generate-variant skill operational

**Next Priority**:
1. APPLY to roles with 9 ready variants
2. Generate new variants for target companies
3. Trust Battery Testimonials (deferred)

---

### Session: December 23, 2025 — Tests Fixed, Real Testimonials, Pipeline Clear

**Summary**: Fixed all 14 test regressions. Updated testimonials with REAL quotes from former colleagues at Anchorage Digital. Added serghei-qa skill for code audits. Social media launch content shipped.

**Changes**:
- `content/testimonials/index.yaml` — Real testimonials from HS and PB (Anchorage)
- `src/tests/components.test.tsx` — Fixed test expectations
- `.claude/skills/serghei-qa/` — Code quality audit skill
- `content/variants/anthropic-ai-safety-fellow.yaml` — Negative example
- Social media launch content added

**Merged PRs**: #70, #71, #72

**Next**: APPLY to roles with 9 ready variants

---

### Session: December 23, 2025 — Variant Expansion & Tooling

**Summary**: Added 2 new target company variants (Microsoft, Galaxy). Created generate-variant skill for automated variant creation. Enhanced UCV-CLI with clickable links and job extraction.

**Changes**:
- `content/variants/microsoft-senior-pm.yaml` — New variant
- `content/variants/galaxy-pm.yaml` — New variant + status fix
- `.claude/skills/generate-variant/` — Automation skill
- `scripts/cli/ucv/` — TUI improvements
- `content/experience/index.yaml` — Bio condensed, dates updated

**Merged PRs**: #68 (UCV-CLI TUI improvements)

**Next**: Fix 14 failing tests, then apply to open roles

---

### Session: December 21, 2025 — Light Mode Polish & Nav Fix

**Summary**: Enhanced light mode with boosted orb vibrancy, card shadows, and visual definition. Updated nav CTA to link to Google Calendar.

**Changes**:
- `src/styles/globals.css` — Light mode orb boost (0.22/0.15), card shadow tokens
- `src/components/sections/TestimonialsSection.tsx` — Added light-card class
- `src/pages/BlogPostPage.tsx` — Added shadows to author/thought cards
- `src/components/Portfolio.tsx` — "Get in Touch" → Google Calendar link

**Next**: Trust Battery Testimonials

---

### Session: December 21, 2025 — Code Splitting & Context Cleanup

**Summary**: Shipped code splitting (59% bundle reduction). Consolidated context files into single PROJECT_STATE.md.

**Changes**:
- `vite.config.ts` — Added manualChunks for vendor splitting
- `src/App.tsx` — Lazy loaded BlogPostPage + VariantPortfolio routes
- `src/components/Portfolio.tsx` — Lazy loaded CaseStudyDrawer
- `src/tests/code-splitting/lazy-loading.test.tsx` — 8 new tests
- `context/PROJECT_STATE.md` — Merged SOTU + DEVLOG (87% size reduction)
- Fixed React version mismatch (react & react-dom pinned to 19.2.0)

**Bundle Results**:
| Chunk | Size |
|-------|------|
| index | 53KB |
| vendor-react | 142KB |
| vendor-motion | 138KB |
| vendor-markdown | 267KB (on-demand) |

**PRs Merged**: #55 (context cleanup), #58 (code splitting)

**Next**: Trust Battery Testimonials or Light Mode Polish

---

## Appendix: Document Lineage

| Version | Date | Changes |
|---------|------|---------|
| 4.0 | 2025-12-21 | **Merged**: SOTU + DEVLOG into single file |
| 3.0 | 2025-12-20 | Consolidated AGENT_RULES + ROADMAP into SOTU |
| 2.0 | 2024-12-18 | Unified strategic + performance audit |
| 1.0 | Dec 2024 | Initial audit |

### Archived

- Sprint briefings (5 total) → `docs/history/sprint-briefings-archive.md`
- Old session logs → `docs/history/session-archive.md`
- `context/DEVLOG.md` → Merged into Part VI
- `context/STATE_OF_THE_UNION.md` → Merged into Parts I-V

---

**Next Review**: After test regression fixed
