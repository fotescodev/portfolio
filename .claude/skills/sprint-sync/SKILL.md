---
name: sprint-sync
description: Multi-perspective project onboarding and sprint briefing. Simulates a cross-functional leadership team (PM, Designer, Architect, Engineer) ramping up on project status. Appends briefings to STATE_OF_THE_UNION.md Part VIII.
---

# Sprint Sync

## Overview

This skill provides comprehensive project context from four leadership perspectives, simulating how a cross-functional team would onboard to the current state of the project. All briefings are appended to `context/STATE_OF_THE_UNION.md` Part VIII for historical reference.

## When to Use This Skill

Activate when the user:
- Says "sprint sync", "/sprint-sync", or "sync me up"
- Starts a new session and needs context
- Asks "where are we?" or "what's the status?"
- Wants to understand current priorities
- Says "onboard me" or "catch me up"

## Invocation Modes

| Command | Mode | Duration | Output |
|---------|------|----------|--------|
| `/sprint-sync` | Quick | ~30 sec | Summary briefing |
| `/sprint-sync --hardcore` | Full deep dive | ~2-3 min | All ASCII diagrams + full analysis |
| `/sprint-sync --deep pm` | PM deep dive | ~1 min | Roadmap + priorities + blockers |
| `/sprint-sync --deep design` | Designer deep dive | ~1 min | Design system + theme audit |
| `/sprint-sync --deep arch` | Architect deep dive | ~1 min | Architecture + dependencies |
| `/sprint-sync --deep eng` | Engineer deep dive | ~1 min | Recent changes + hot files |

## Execution Steps

### Phase 0: Gather Context

**Always read these files first:**

| File | Extract |
|------|---------|
| `context/STATE_OF_THE_UNION.md` | Parts I-V for strategic context, Part VII for roadmap |
| `context/DEVLOG.md` | "Active Project Pulse" + last 2 session summaries |

**Always run these commands:**

```bash
git log --oneline -10                    # Recent commits
npm run test 2>&1 | tail -20             # Test status
```

---

### Phase 1: Quick Sync (Default Mode)

Generate a concise briefing covering all four perspectives in summary form.

**Output Structure:**
```
═══════════════════════════════════════════════════════════════════════════════
SPRINT BRIEFING — [YYYY-MM-DD HH:MM]
Mode: Quick
═══════════════════════════════════════════════════════════════════════════════

## Project Pulse (PM View)
- **Current Phase**: [from SOTU Part VII]
- **Last Action**: [from DEVLOG Active Pulse]
- **Next Priority**: [from SOTU Part IV P0]
- **Blockers**: [from SOTU Technical Debt]

## Design Status (Designer View)
- **Design System**: [Compliant / issues found]
- **Recent UI Changes**: [from git log]
- **Theme Parity**: [from SOTU 1.3]

## Architecture Health (Architect View)
- **Test Status**: [from npm test output]
- **Bundle Size**: [from SOTU]
- **Tech Debt**: [top 2-3 items from SOTU]

## Recent Work (Engineer View)
- **Last 5 Commits**: [from git log]
- **What's Working**: [recent completions]
- **Needs Attention**: [blockers/P0 items]

## Recommended Actions
1. [First priority from P0]
2. [Second priority]
3. [Third priority]

───────────────────────────────────────────────────────────────────────────────
```

---

### Phase 2: Deep Dive Modes

#### PM Deep Dive (`--deep pm` or `--hardcore`)

**Additional Context:**
- Full SOTU Part VII (Strategic Roadmap)
- SOTU Part IV (Priority Action Plan)
- Last 3 DEVLOG sessions
- `git log --oneline -20`

**Generate ASCII Diagram:**
```
┌─ ROADMAP STATUS ─────────────────────────────────────────────────────────────┐
│                                                                              │
│  Phase 1: Foundation    ████████████████████ 100%  COMPLETE                  │
│  Phase 2: Polish        ████████████████████ 100%  COMPLETE                  │
│  Phase 3: Social        ████████████░░░░░░░░  60%  IN PROGRESS               │
│  Phase 4: Performance   ░░░░░░░░░░░░░░░░░░░░   0%  PENDING                   │
│                                                                              │
│  ┌─ P0 CRITICAL ─────────────────────────────────────────────────────────┐   │
│  │  [ ] Code Splitting (467KB → <200KB)                                  │   │
│  │  [ ] Lazy Load LikeAnalytics                                          │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  Current Focus: [from DEVLOG]                                                │
│  Next Milestone: [from roadmap]                                              │
│  Risk Level: [HIGH/MEDIUM/LOW based on blockers]                             │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Analysis Includes:**
- Milestone completion percentages
- Dependency mapping between tasks
- Risk assessment (blockers, technical debt)
- Sprint velocity (commits per session)

---

#### Designer Deep Dive (`--deep design` or `--hardcore`)

**Additional Context:**
- `context/DESIGN.md`
- `src/styles/globals.css` (scan CSS variables)
- SOTU 1.2 (Design Fidelity) and 1.3 (Theme Parity)
- Recent commits touching styles

**Generate ASCII Diagram:**
```
┌─ DESIGN SYSTEM HEALTH ───────────────────────────────────────────────────────┐
│                                                                              │
│  CSS Variables Inventory:                                                    │
│  ├── Colors:     XX tokens    [✓ Complete]                                   │
│  ├── Spacing:    XX tokens    [✓ Complete]                                   │
│  ├── Typography: XX tokens    [✓ Complete]                                   │
│  └── Effects:    XX tokens    [✓ Complete]                                   │
│                                                                              │
│  Theme Parity:                                                               │
│  ┌─────────────────┬─────────────────┐                                       │
│  │    DARK MODE    │   LIGHT MODE    │                                       │
│  ├─────────────────┼─────────────────┤                                       │
│  │ ✓ Background    │ ✓ Background    │                                       │
│  │ ✓ Text Primary  │ ✓ Text Primary  │                                       │
│  │ ✓ Accent        │ ✓ Accent        │                                       │
│  │ ✓ Orbs (0.25)   │ ⚠ Orbs (0.15)   │  ← Light feels muted                  │
│  │ ✓ Card Shadows  │ ⚠ Card Shadows  │  ← Light feels flat                   │
│  └─────────────────┴─────────────────┘                                       │
│                                                                              │
│  Premium Score: 7.5/10 → Target: 9/10                                        │
│                                                                              │
│  Recent UI Changes:                                                          │
│  └── [from git log --oneline -- '*.css' '*.tsx']                             │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Analysis Includes:**
- Token inventory count
- Theme parity audit
- Recent style changes
- Premium score progress

---

#### Architect Deep Dive (`--deep arch` or `--hardcore`)

**Additional Context:**
- `context/CODEBASE.md`
- `src/lib/schemas.ts` (count Zod schemas)
- `package.json` (key dependencies)
- Test output

**Generate ASCII Diagram:**
```
┌─ ARCHITECTURE OVERVIEW ──────────────────────────────────────────────────────┐
│                                                                              │
│  DATA FLOW:                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌───────────────┐                   │
│  │ content/     │───▶│ src/lib/     │───▶│ Zod Schemas   │                   │
│  │ *.yaml *.md  │    │ content.ts   │    │ (9 schemas)   │                   │
│  └──────────────┘    └──────────────┘    └───────────────┘                   │
│                              │                                               │
│                              ▼                                               │
│  ┌──────────────┐    ┌──────────────┐    ┌───────────────┐                   │
│  │ HashRouter   │◀───│ Portfolio.tsx│───▶│ Section       │                   │
│  │ /#/:company/ │    │              │    │ Components    │                   │
│  │    :role     │    └──────────────┘    └───────────────┘                   │
│  └──────────────┘            │                                               │
│                              ▼                                               │
│                      ┌──────────────┐                                        │
│                      │ Variant      │                                        │
│                      │ Context      │                                        │
│                      └──────────────┘                                        │
│                                                                              │
│  HEALTH METRICS:                                                             │
│  ├── Tests:        XXX passing                                               │
│  ├── Bundle:       467KB (TARGET: <200KB)  ⚠ CRITICAL                        │
│  ├── Type Safety:  9/10                                                      │
│  └── Zod Coverage: 9 schemas                                                 │
│                                                                              │
│  TECH STACK:                                                                 │
│  React 19 + TypeScript + Vite + Framer Motion + Zod                          │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Analysis Includes:**
- Component relationship map
- Data flow diagram
- Test coverage summary
- Dependency health
- Bundle size analysis

---

#### Engineer Deep Dive (`--deep eng` or `--hardcore`)

**Additional Context:**
- `git log --oneline -20`
- `git diff --stat HEAD~10`
- `git log --format='%h %s' --since='7 days ago'`
- Full test output

**Generate ASCII Diagram:**
```
┌─ ENGINEERING PULSE ──────────────────────────────────────────────────────────┐
│                                                                              │
│  RECENT COMMITS (last 10):                                                   │
│  ├── 6f946f58 feat: add LinkedIn share button                                │
│  ├── 61cd9e8e Merge PR #43: ux-improvements                                  │
│  ├── 87c9f878 feat: enhance blog article UX                                  │
│  ├── 90ec467b feat: update navbar menu                                       │
│  └── ...                                                                     │
│                                                                              │
│  HOT FILES (most changed recently):                                          │
│  ├── src/components/sections/ExperienceSection.tsx    (5 changes)            │
│  ├── content/experience/index.yaml                    (4 changes)            │
│  ├── src/components/Blog.tsx                          (3 changes)            │
│  └── ...                                                                     │
│                                                                              │
│  TEST STATUS:                                                                │
│  ┌────────────────────────────────────────────────────────────────────┐      │
│  │  ✓ XXX passed  │  ✗ X failed  │  Duration: X.Xs                    │      │
│  └────────────────────────────────────────────────────────────────────┘      │
│                                                                              │
│  WORKING:                          NEEDS ATTENTION:                          │
│  ├── Blog UX features              ├── Bundle size (467KB)                   │
│  ├── Experience section            ├── Code splitting                        │
│  └── Case study drawer             └── LikeAnalytics lazy load               │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Analysis Includes:**
- Commit frequency analysis
- Hot files identification
- Test results breakdown
- What's working vs. needs attention
- Immediate action items

---

### Phase 3: Save Briefing

**CRITICAL**: All briefings MUST be appended to `context/STATE_OF_THE_UNION.md` Part VIII.

**Process:**
1. Read current STATE_OF_THE_UNION.md
2. Find Part VIII: Sprint Briefings section
3. Locate the line `*No briefings yet.*` or end of last briefing
4. Append new briefing with delimiter format
5. Write updated file

**Delimiter Format:**
```markdown

═══════════════════════════════════════════════════════════════════════════════
SPRINT BRIEFING — YYYY-MM-DD HH:MM
Mode: [Quick | Hardcore | Deep: PM/Design/Arch/Eng]
═══════════════════════════════════════════════════════════════════════════════

[Full briefing content including ASCII diagrams]

───────────────────────────────────────────────────────────────────────────────
```

---

## Hardcore Mode (`--hardcore`)

When `--hardcore` flag is present:

1. Run ALL four deep dives (PM, Design, Arch, Eng)
2. Generate ALL four ASCII diagrams
3. Cross-reference findings between perspectives
4. Generate comprehensive action plan with priorities
5. Include risk assessment matrix

**Additional ASCII Diagram for Hardcore Mode:**
```
┌─ CROSS-FUNCTIONAL RISK MATRIX ───────────────────────────────────────────────┐
│                                                                              │
│              │ LOW EFFORT │ MED EFFORT │ HIGH EFFORT │                       │
│  ────────────┼────────────┼────────────┼─────────────┤                       │
│  HIGH IMPACT │ ★ P0       │            │             │                       │
│              │ Code Split │            │             │                       │
│  ────────────┼────────────┼────────────┼─────────────┤                       │
│  MED IMPACT  │ Lazy Load  │ Testimonial│             │                       │
│              │ Analytics  │ Redesign   │             │                       │
│  ────────────┼────────────┼────────────┼─────────────┤                       │
│  LOW IMPACT  │ Dead Code  │ Style      │             │                       │
│              │ Cleanup    │ Refactor   │             │                       │
│  ────────────┴────────────┴────────────┴─────────────┘                       │
│                                                                              │
│  ★ = Start here                                                              │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## File Locations Reference

| Purpose | Path |
|---------|------|
| **Primary State** | `context/STATE_OF_THE_UNION.md` |
| **Session Log** | `context/DEVLOG.md` |
| **Codebase Docs** | `context/CODEBASE.md` |
| **Design System** | `context/DESIGN.md` |
| **CSS Tokens** | `src/styles/globals.css` |
| **Zod Schemas** | `src/lib/schemas.ts` |

---

## Example Session

```
User: /sprint-sync

Claude: [Reads SOTU, DEVLOG, runs git log and tests]

═══════════════════════════════════════════════════════════════════════════════
SPRINT BRIEFING — 2025-12-20 10:30
Mode: Quick
═══════════════════════════════════════════════════════════════════════════════

## Project Pulse (PM View)
- **Current Phase**: Phase 3 - Social & Content (60% complete)
- **Last Action**: Experience section optimization with SMART bullets
- **Next Priority**: Bundle size reduction (467KB → <200KB)
- **Blockers**: Performance (bundle size blocking LCP)

## Design Status (Designer View)
- **Design System**: Compliant (all tokens in globals.css)
- **Recent UI Changes**: LinkedIn share button, blog reading features
- **Theme Parity**: Light mode needs polish (muted orbs, flat shadows)

## Architecture Health (Architect View)
- **Test Status**: 187 passing, 0 failed
- **Bundle Size**: 467KB (CRITICAL - target <200KB)
- **Tech Debt**: Code splitting, inline styles (324 occurrences)

## Recent Work (Engineer View)
- **Last 5 Commits**: LinkedIn share, blog UX, navbar menu, blog routing
- **What's Working**: Blog, Experience, Case Studies
- **Needs Attention**: Bundle optimization, code splitting

## Recommended Actions
1. Implement code splitting in vite.config.ts
2. Lazy load LikeAnalytics component
3. Address light mode polish (P2)

───────────────────────────────────────────────────────────────────────────────

[Briefing appended to STATE_OF_THE_UNION.md Part VIII]
```

---

## Notes

- Always run tests as part of sync to catch regressions
- The DEVLOG "Active Project Pulse" section is the source of truth for current status
- Never truncate ASCII diagrams - they provide quick visual context
- Hardcore mode should complete in under 3 minutes
- Each briefing is timestamped and preserved for historical reference
