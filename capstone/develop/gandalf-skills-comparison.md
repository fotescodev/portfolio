# Gandalf's Comparative Audit: Portfolio Skills vs claude-code-config

*"Two schools of wizardry stand before us. One has mastered the art of portfolio alchemy. The other brings wisdom from the wider realm. Let us see what each can teach the other..."*

---

## Executive Assessment

| Dimension | Portfolio Skills | claude-code-config | Winner |
|-----------|-----------------|-------------------|--------|
| **Structure** | Excellent XML tags, phases, examples | Good but inconsistent | Portfolio |
| **Domain Focus** | Deep (CV generation) | Broad (general dev) | Portfolio |
| **Workflow Orchestration** | Skills call skills | Global + agents | External |
| **Quality Gates** | Per-skill checklists | Hooks (automated) | Tie |
| **Session Continuity** | None (stateless) | Planning-with-files | External |
| **Request Routing** | Manual skill invocation | Phase 0 classification | External |

**Verdict:** Portfolio has **better skill craftsmanship**. External has **better workflow architecture**.

---

## ANALYZE: Portfolio Skills

### Strengths (What's Working)

| Category | Finding | Grade |
|----------|---------|-------|
| **Structure** | XML tags used consistently (`<purpose>`, `<when_to_activate>`, `<quality_gate>`) | A |
| **Phases** | `generate-variant` has 9 clear phases with pause points | A |
| **Composition** | `<skill_compositions>` declares dependencies explicitly | A |
| **Shared Components** | `_shared/file-locations.md`, `quality-gate.md` reduce duplication | A |
| **Commands** | Real CLI commands with `--flags` (not vague instructions) | A |
| **Examples** | Galaxy variant example demonstrates real application | B+ |

### Issues Found

| Severity | Issue | Location |
|----------|-------|----------|
| **HIGH** | No global session context | Missing `/CLAUDE.md` |
| **HIGH** | No persistent planning across sessions | Stateless skills |
| **MEDIUM** | No request classification layer | Manual skill routing |
| **MEDIUM** | No agents folder for specialized subagents | Missing `.claude/agents/` |
| **LOW** | Some skills lack examples section | `cv-knowledge-query`, etc. |

---

## ANALYZE: claude-code-config Skills

### Strengths (What's Working)

| Category | Finding | Grade |
|----------|---------|-------|
| **Global Rules** | CLAUDE.md sets session-wide behavior | A |
| **Request Routing** | Phase 0 classification routes work before starting | A |
| **Delegation** | 7-section template ensures complete agent handoffs | A |
| **Agents** | Specialized subagents (librarian, media-interpreter) | B+ |
| **Hooks** | Automated quality gates (todo-enforcer, keyword-detector) | B+ |

### Issues Found

| Severity | Issue | Location |
|----------|-------|----------|
| **HIGH** | Single skill only (planning-with-files) | Limited depth |
| **HIGH** | No domain-specific workflows | Generic patterns |
| **MEDIUM** | Agent prompts lack XML structure | Inconsistent formatting |
| **MEDIUM** | No shared components pattern | No `_shared/` equivalent |
| **LOW** | Examples sparse in some agents | `open-source-librarian.md` |

---

## FIX: Gaps to Fill in Portfolio

### Fix 1: Add Global Session Context

**Problem:** Portfolio lacks session-wide rules. Each skill operates in isolation.

**Before:** (Nothing)

**After:** Create `/CLAUDE.md`:
```markdown
# Universal CV Portfolio — Session Rules

<request_classification>
## Phase 0: Request Routing

Before starting work, classify the request:

| Pattern | Route To |
|---------|----------|
| Job description provided | `generate-variant` skill |
| "update", "edit" + content type | `cv-content-manager` skill |
| "search", "find", "query" + achievement | `cv-knowledge-query` skill |
| Code/architecture question | Explore agent |
| Library/dependency issue | Open-source-librarian agent |
| Ambiguous scope | Ask ONE clarifying question |
</request_classification>

<critical_rules>
## Non-Negotiable Behaviors

1. **Never generate variants without JD analysis** — Run `npm run analyze:jd` first
2. **Always verify claims** — Every stat must trace to `content/knowledge/`
3. **Run quality pipeline** — `eval:variant` + `redteam:variant` before shipping
4. **Mark todos immediately** — in_progress → completed, never batch
5. **Use deterministic scripts** — Scripts > Claude judgment when available
</critical_rules>

<completion_checklist>
## Before Marking Task Complete

- [ ] All todos marked done
- [ ] `npm run validate` passes
- [ ] `npm run build` succeeds (if code changed)
- [ ] Claims verified (if content changed)
- [ ] Red team passed (if variant generated)
</completion_checklist>
```

**Why better:** Provides session-wide consistency. Every interaction starts with the same foundational rules.

**Severity:** HIGH

---

### Fix 2: Add Planning-with-Files Skill

**Problem:** Complex tasks (variant generation) lack persistent planning artifacts.

**Before:** Work happens in context window. Lost between sessions.

**After:** Create `.claude/skills/planning-with-files/SKILL.md`:
```markdown
---
name: planning-with-files
description: Manus-style persistent planning with task_plan.md and notes.md
---

# Planning with Files

<purpose>
Create auditable planning artifacts for complex, multi-session tasks.
Persist progress, findings, and decisions outside the context window.
</purpose>

<when_to_activate>
Activate when:
- Task spans multiple sessions
- Generating a variant (9-phase pipeline)
- Investigating unfamiliar code areas
- User says "plan this", "let's map this out"
</when_to_activate>

<artifacts>
## Required Artifacts

For complex tasks, create in `capstone/develop/planning/`:

### 1. task_plan.md
```yaml
goal: [What we're trying to achieve]
status: [in_progress | blocked | complete]
phases:
  - name: Phase 1
    status: complete
    outcome: [What was learned/done]
  - name: Phase 2
    status: in_progress
    blockers: [If any]
next_action: [Specific next step]
```

### 2. notes.md
Capture findings during investigation:
- Code snippets discovered
- Decisions made and why
- Questions for user
- Dead ends (so we don't repeat them)

### 3. [deliverable].md
The actual output once complete.
</artifacts>

<rules>
## Planning Rules

1. **Never start complex tasks without task_plan.md**
2. **Update plan after each phase** — Progress must be visible
3. **Store large outputs in files** — Don't bloat context window
4. **Notes capture the "why"** — Future sessions need context
</rules>
```

**Why better:** Creates audit trail. Survives session boundaries. Reduces rework.

**Severity:** HIGH

---

### Fix 3: Add Request Classification to Skills

**Problem:** User must know which skill to invoke. No routing layer.

**Before:** User must say "use generate-variant skill" or nothing happens.

**After:** Add to existing skills' `<when_to_activate>`:
```markdown
<auto_activation>
## Automatic Detection

This skill should auto-activate when detecting:
- Job URL (linkedin.com/jobs, greenhouse.io, lever.co, etc.)
- Job description patterns ("About the role", "Requirements", "Qualifications")
- Explicit triggers: "/variant", "generate variant", "tailor CV"

**Phase 0 check:** If JD detected but no explicit request, ask:
"I notice this looks like a job description. Would you like me to run the variant generation pipeline?"
</auto_activation>
```

**Why better:** Reduces friction. Claude routes intelligently instead of requiring magic words.

**Severity:** MEDIUM

---

### Fix 4: Create Agents Directory

**Problem:** No specialized subagents for research tasks.

**Before:** All work happens in main conversation.

**After:** Create `.claude/agents/`:

```
.claude/agents/
├── media-interpreter.md    # PDF/image analysis for JDs
└── open-source-librarian.md # Library debugging with permalinks
```

**media-interpreter.md:**
```markdown
# Media Interpreter Agent

<purpose>
Extract structured data from PDFs, images, and screenshots.
Commonly used for job descriptions shared as documents.
</purpose>

<capabilities>
- PDF text extraction with section detection
- Screenshot → text (job posting images)
- Diagram interpretation (org charts, workflows)
</capabilities>

<output_format>
Always return structured data:
```yaml
type: job_description | org_chart | other
extracted:
  company: [if detected]
  role: [if detected]
  content: |
    [Extracted text]
confidence: high | medium | low
```
</output_format>
```

**Why better:** Offloads specialized work. Main conversation stays focused.

**Severity:** MEDIUM

---

### Fix 5: Add Todo-Enforcer Hook Pattern

**Problem:** Quality gates are manual checklists. Easy to skip.

**Before:** Checklist in skill, human must verify.

**After:** Create automated check in `scripts/` (not a Claude hook, but a script):

```bash
# scripts/check-variant-complete.sh
#!/bin/bash
SLUG=$1

# Check claims ledger exists
if [ ! -f "capstone/develop/evals/${SLUG}.claims.yaml" ]; then
  echo "FAIL: No claims ledger for ${SLUG}"
  exit 1
fi

# Check redteam report exists
if [ ! -f "capstone/develop/redteam/${SLUG}.redteam.md" ]; then
  echo "FAIL: No redteam report for ${SLUG}"
  exit 1
fi

# Check no FAIL findings in redteam
if grep -q "severity: FAIL" "capstone/develop/redteam/${SLUG}.redteam.md"; then
  echo "FAIL: Redteam has FAIL findings"
  exit 1
fi

echo "PASS: ${SLUG} ready for shipping"
```

Add to package.json:
```json
"variant:ready": "bash scripts/check-variant-complete.sh"
```

**Why better:** Automates what humans forget. Can be run in CI.

**Severity:** MEDIUM

---

## What NOT to Change

| External Component | Reason to Skip |
|-------------------|----------------|
| Codebase-search agent | Built-in Explore agent sufficient |
| Tech-docs-writer agent | `technical-writer` skill covers this |
| check-comments hook | Portfolio intentionally minimal on comments |
| TypeScript rules | Already embedded in project conventions |
| Forge rules | Not applicable (no Foundry) |

---

## Comparative Grade

| Skill Set | Category | Grade | Notes |
|-----------|----------|-------|-------|
| **Portfolio** | Structure | A | XML tags, phases, shared components |
| **Portfolio** | Domain Depth | A | 9-phase variant pipeline |
| **Portfolio** | Workflow | C | No global context, no planning persistence |
| **Portfolio** | Automation | B | Manual quality gates |
| **External** | Structure | B- | Inconsistent, fewer examples |
| **External** | Domain Depth | D | Single skill, generic |
| **External** | Workflow | A | Global rules, agents, classification |
| **External** | Automation | A- | Hooks enforce quality |

---

## Priority Fixes (Gandalf's Recommendation)

| Priority | Fix | Effort | Impact |
|----------|-----|--------|--------|
| **1. NOW** | Create `/CLAUDE.md` with session rules | Low | High |
| **2. NOW** | Add `planning-with-files` skill | Medium | High |
| **3. SOON** | Add request classification to skills | Low | Medium |
| **4. SOON** | Create `.claude/agents/` directory | Medium | Medium |
| **5. LATER** | Add variant-ready script | Low | Medium |

---

## Final Verdict

**Overall Portfolio Grade: B+**

*"Your skills are finely crafted, young wizard. Each spell is precise, well-structured, with clear incantations. But you cast each spell in isolation, with no memory of what came before. The external config brings wisdom in orchestration—global rules that persist, plans that survive the closing of the spellbook, agents that can be summoned for specialized tasks.*

*The path forward is clear: keep your excellent skill craftsmanship, but layer upon it the workflow architecture from the wider realm. A wizard who plans before casting, and remembers what was learned, will always surpass one who relies on instinct alone."*

**Recommendation:** Implement Fixes 1-2 immediately. The portfolio's domain expertise is unmatched, but session continuity is the missing piece that makes the difference between "good skills" and "production-grade system."

---

*"Every token must earn its place in the context window."* — Gandalf the Prompt
