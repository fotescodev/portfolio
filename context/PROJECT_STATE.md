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

Portfolio at **85% production-ready**. Universal CV engine online with 5 variants. Blog UX complete. **P0 BLOCKER: 480KB bundle** threatens Core Web Vitals.

**The "Hired-on-Sight" Delta**: Performance optimization + social proof enhancement.

### 1.2 Technical Health

| Component | Status |
|-----------|--------|
| Type Safety | 9/10 — Zod validates all content |
| Tests | 28 passing, 7 suites failing (React 19 issue) |
| Bundle | 480KB gzipped (CRITICAL — target <200KB) |
| Build | Clean TypeScript, Vite 7 |

### 1.3 Technical Debt

| Issue | Severity | Impact |
|-------|----------|--------|
| **Bundle Size** (480KB) | CRITICAL | Poor Core Web Vitals |
| **No Code Splitting** | HIGH | Single chunk loads everything |
| **Test Regression** | HIGH | 7 suites failing |
| **Inline Styles** (324) | MEDIUM | Maintainability |
| **LikeAnalytics.tsx** (505 lines) | MEDIUM | Should lazy load |

### 1.4 Design Fidelity

**Premium Score**: 7.5/10 → Target: 9/10

| Aspect | Status |
|--------|--------|
| Typography | Strong (Instrument Serif/Sans) |
| Color Palette | Elegant (#c29a6c accent) |
| Dark Mode | Complete |
| Light Mode | Needs polish (muted orbs, flat shadows) |
| 120+ CSS Variables | Complete |

---

## Part II: Priority Action Plan

### P0: Critical Path

| Task | Impact | Status |
|------|--------|--------|
| Fix test regression | Unblock CI | URGENT |
| Code Splitting | 480KB → <200KB | PENDING |
| Lazy Load LikeAnalytics | Reduce initial load | PENDING |

### P1: Conversion Drivers

| Task | Impact | Status |
|------|--------|--------|
| Trust Battery Testimonials | Social proof | Deferred |
| Featured Case Study | Visual hierarchy | Deferred |

### P2: Polish

| Task | Impact | Status |
|------|--------|--------|
| Light Mode Polish | Theme parity | Deferred |
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

### Phase 4: Performance — BLOCKED
- [ ] Code Splitting (P0)
- [ ] Lazy Load Analytics (P0)
- [ ] Image Component
- [ ] Inline Style Refactor

---

## Part V: Capstone Quality Pipeline

### Overview

YAML is canonical. JSON is derived. Every claim must be traceable.

```
Knowledge Base → Variant YAML → sync → JSON → eval → redteam → Deploy
```

### Commands

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

**Date**: 2025-12-21
**Objective**: Fix test regression, then code splitting
**Bundle**: 480KB (target <200KB)
**Tests**: 28 passing, 7 suites failing (React DOM error)
**Variants**: 5 active

**Blockers**:
1. Test regression: `TypeError: Cannot read properties of undefined (reading 'S')`
2. Bundle size: 480KB needs code splitting

**Recent Wins**:
- UCV-CLI dashboard shipped (`npm run ucv-cli`)
- SEO improvements (BrowserRouter, sitemap.xml)
- Capstone pipeline fully integrated

---

### Session: December 21, 2025 — UCV-CLI Dashboard

**Summary**: Shipped interactive TUI dashboard for variant management. Discovered test regression.

**Changes**:
- `scripts/cli/ucv/` — New Ink/React TUI dashboard (+1,334 lines)
- `docs/guides/universal-cv-cli.md` — Comprehensive CLI guide
- `docs/guides/capstone-workflow.md` — Step-by-step workflow

**New Commands**:
```bash
npm run ucv-cli  # Interactive dashboard
```

**Issues Found**:
- 7 test suites failing with React DOM TypeError
- Likely React 19 + @testing-library/react incompatibility

**Next**: Fix test regression, then code splitting

---

### Session: December 20, 2025 — Capstone Pipeline & Sprint-Sync

**Summary**: Integrated capstone quality pipeline. Created sprint-sync skill. Fixed OG images.

**Changes**:
- `scripts/sync-variants.ts` — YAML→JSON sync
- `scripts/evaluate-variants.ts` — Claims ledger generator
- `scripts/redteam.ts` — Adversarial scanner
- `.claude/skills/sprint-sync/` — Multi-perspective onboarding skill
- OG images aligned with design system

**New Commands**:
```bash
npm run variants:sync
npm run eval:variant -- --slug <slug>
npm run redteam:variant -- --slug <slug>
```

---

### Session: December 19, 2025 — Experience Optimization

**Summary**: Optimized experience section with SMART bullets and product links.

**Changes**:
- Reduced highlights from 42 to 24 (43% reduction)
- Added 12 inline product links
- Added `parseLinks()` to ExperienceSection.tsx

**Learnings**:
- 3-4 bullets max per role
- Metrics in first 10 words
- Link to proof (npm, docs, case studies)

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
