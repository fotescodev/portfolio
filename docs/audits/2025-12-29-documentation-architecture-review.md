# Documentation Architecture Review

**Date:** 2025-12-29
**Approach:** technical-writer + ultrathink skill composition
**Objective:** Honest assessment of documentation architecture with actionable improvements

---

## Understanding

The Universal CV Portfolio Engine has substantial documentation across multiple locations. A previous audit (2025-12-27) identified critical gaps. This review assesses the overall architecture and creates an improvement plan that prioritizes what actually matters.

### Documentation Inventory

| Location | Count | Purpose |
|----------|-------|---------|
| Root (README, GETTING_STARTED) | 2 | Entry points |
| context/*.md | 3 | AI/developer context |
| docs/guides/*.md | 6 | Reference guides |
| docs/audits/*.md | 3 | UX audits |
| docs/history/*.md | 11 | Archived docs |
| .claude/skills/*.md | 16 | Skill prompts |
| capstone/**/*.md | 20+ | Quality pipeline |

**Total:** 60+ markdown files

---

## What's Working

### 1. README.md (Strong)
- Passes the 10-second test: "job-targeted variants using Claude Code"
- Clear value proposition with the "cold-start problem" framing
- Well-structured with project structure links
- Actionable Quick Start section

### 2. GETTING_STARTED_GUIDE.md (Good Structure)
- Recipe book format is effective
- Table of contents enables scanning
- Outcome-first sections ("Outcome: Project running locally")
- File structure reference is helpful

### 3. Skill Files (Excellent)
- Consistent structure across all skills
- Clear "When to Activate" sections
- Skill compositions documented
- Actionable and complete

### 4. Context Files (Good for AI Agents)
- PROJECT_STATE.md is a true single source of truth
- CODEBASE.md provides complete technical context
- DESIGN.md captures all CSS tokens

### 5. CLI Tool Output (Excellent)
- Per the audit: colorful, clear, actionable output
- `analyze:jd` filters generic phrases automatically
- `search:evidence` gives GO/NO-GO recommendations

---

## What Would Actually Move the Needle

Applying ultrathink's hierarchy: **Usefulness > Honesty > Clarity > Completeness**

### Critical: Previously Blocking (Now Fixed)

#### 1. `.env.example` - RESOLVED
The previous audit identified this as blocking. It has been added with comprehensive documentation including:
- All three provider options (Anthropic, OpenAI, Gemini)
- Direct links to get API keys
- Pricing references
- Clear notes about alternatives if no API key

#### 2. API Key Setup in GETTING_STARTED_GUIDE.md - RESOLVED
Section 8.5 "Prerequisites: API Key Setup" was added with:
- Step-by-step setup for each provider
- Pricing information
- Clear fallback path for users without API keys

### High: Confusing Architecture

#### 3. Four Competing Entry Points
Users must decide between:
- README.md
- GETTING_STARTED_GUIDE.md
- docs/COMPLETE_WORKFLOW.md
- docs/guides/universal-cv.md

**Problem per technical-writer:** "Progressive disclosure is broken. Users discover depth when they DON'T need it."

**Fix:** Add decision tree to README.md:
```markdown
## Where to Start

| If you want to... | Read... |
|-------------------|---------|
| Understand what this is | This README |
| Build your own portfolio | [Getting Started Guide](./GETTING_STARTED_GUIDE.md) |
| Generate a job variant | [Universal CV Guide](./docs/guides/universal-cv.md) |
| Run the quality pipeline | [Capstone Workflow](./docs/guides/capstone-workflow.md) |
| Contribute code | [Codebase Context](./context/CODEBASE.md) |
```

**Effort:** 10 minutes
**Impact:** Reduces cognitive load, clear paths

#### 4. COMPLETE_WORKFLOW.md Duplicates Other Guides
This 500-line doc overlaps with:
- GETTING_STARTED_GUIDE.md (Phase 1-2)
- universal-cv.md (Phase 3)
- capstone-workflow.md (Phase 4)

**Ultrathink assessment:** This is a "completeness vs. clarity" trade-off. Having one massive doc seems complete but hurts clarity and creates maintenance burden.

**Options:**
1. **Delete it** - Point users to specific guides (recommended)
2. **Keep as index** - Reduce to 50-line overview linking to guides
3. **Keep as-is** - Accept duplication cost

**Recommendation:** Option 2 - Convert to lightweight index

### Medium: Polish Issues

#### 5. URL Format Inconsistency
Some docs use `/#/company/role`, others use `/company/role`.

**Fix:** Global find/replace to standardize on `/#/company/role` (hash router format)

#### 6. Phase Numbering Mismatch
SKILL.md uses "7-phase pipeline", capstone-workflow.md uses different structure.

**Fix:** Align terminology across docs

#### 7. Skills System Unexplained
GETTING_STARTED_GUIDE.md references `/cv-data-ingestion` skill without explaining:
- What skills are
- How to invoke them
- That they require Claude Code

**Fix:** Add brief "Skills System" section or clear prerequisite note

---

## Architecture Recommendation

### Current State
```
README.md (overview)
├── GETTING_STARTED_GUIDE.md (tutorial)
├── docs/
│   ├── COMPLETE_WORKFLOW.md (duplicative)
│   ├── guides/ (reference + how-to mixed)
│   └── history/ (archive)
├── context/ (AI context)
└── .claude/skills/ (skill prompts)
```

### Proposed State
```
README.md (overview + decision tree)
├── GETTING_STARTED_GUIDE.md (tutorial - first-time users)
├── docs/
│   ├── guides/
│   │   ├── universal-cv.md (variant generation)
│   │   ├── capstone-workflow.md (quality pipeline)
│   │   └── [other how-tos]
│   ├── reference/
│   │   ├── cli-commands.md (all CLI in one place)
│   │   └── schemas.md (content schemas)
│   └── history/ (archive)
├── context/ (AI context)
└── .claude/skills/ (skill prompts)
```

### Key Changes
1. **Delete or consolidate** COMPLETE_WORKFLOW.md
2. **Separate how-to from reference** in docs/guides
3. **Add decision tree** to README.md
4. **Create .env.example** immediately

---

## Priority Matrix

| Fix | Effort | Impact | Priority | Status |
|-----|--------|--------|----------|--------|
| Create .env.example | 5 min | BLOCKING removed | P0 | DONE |
| API key setup in Getting Started | 15 min | BLOCKING removed | P0 | DONE |
| Add decision tree to README | 10 min | High clarity | P1 | DONE |
| Add skills prerequisite note | 5 min | Medium clarity | P1 | TODO |
| Consolidate COMPLETE_WORKFLOW | 30 min | Reduce maintenance | P2 | TODO |
| Standardize URL format | 15 min | Low confusion | P2 | TODO |
| Align phase numbering | 20 min | Low confusion | P3 | TODO |
| Separate how-to/reference | 1 hour | Better structure | P3 | TODO |

---

## What I'm Uncertain About

1. **COMPLETE_WORKFLOW.md history** - Was it created for a specific purpose (demo, external audience)? If so, consolidation might break something.

2. **Skills system documentation** - Should skills be documented in user-facing docs, or kept as an "advanced" feature? The answer affects how much to explain.

3. **Target audience split** - Are there different user personas (portfolio builder vs. code contributor) that need separate paths?

---

## Recommended Next Actions

### Completed (This Session)
1. ~~Create `.env.example`~~ - Already implemented from previous audit
2. ~~Add decision tree to README.md~~ - Implemented

### Next Session
3. Add skills prerequisite note to GETTING_STARTED_GUIDE.md
4. Review COMPLETE_WORKFLOW.md purpose - consider consolidation
5. Standardize URL format across all docs (use `/#/company/role`)

### Backlog
6. Consider separating how-to from reference docs
7. Create unified CLI reference doc
8. Align phase numbering terminology

---

## Applying the Technical Writer Quality Checklist

| Criterion | Status | Notes |
|-----------|--------|-------|
| All code examples tested | PARTIAL | Some examples work, some missing context |
| Links verified | PARTIAL | Most work, some internal links outdated |
| Version numbers current | YES | |
| Prerequisites listed | NO | API key setup missing from key docs |
| All required steps included | NO | Skills invocation unexplained |
| Error cases addressed | PARTIAL | Good in CLI output, weak in docs |
| One idea per paragraph | YES | Generally good |
| Technical terms defined | PARTIAL | "Skills" undefined for new users |
| Headings descriptive | YES | |

---

## The Meta-Rule Applied

> "The best documentation disappears."

**Current state:** Users have to read multiple docs to understand how things connect.

**Ideal state:** Users read ONE doc for their use case, then the product feels intuitive.

**Gap:** The decision tree is missing. Users are left guessing which doc to read.

---

*Review complete. Proceeding to implementation of P0/P1 fixes.*
