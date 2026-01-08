# Claude Skills Analysis: fotescodev/claude-code-config

**Date:** 2026-01-08
**Purpose:** Evaluate external Claude configurations for incorporation into the Universal CV portfolio system

---

## Executive Summary

The [fotescodev/claude-code-config](https://github.com/fotescodev/claude-code-config) repository contains **14 configuration files** across 6 categories. After comparing with our existing portfolio configuration (20+ skills), I've identified **5 high-value opportunities** and **3 medium-value additions** that would strengthen our development workflow without duplicating existing capabilities.

---

## Current Portfolio State

### What We Have
- **20+ specialized skills** (cv-content-*, generate-*, first-time-user-*, serghei-qa, gandalf-the-prompt, ultrathink, etc.)
- **Quality pipeline** with evals, red-teaming, and claims verification
- **Shared skill components** (_shared/file-locations.md, quality-gate.md, etc.)
- **Project context** documenting the capstone quality pipeline

### What We're Missing
| Component | Status | Impact |
|-----------|--------|--------|
| CLAUDE.md global instructions | Missing | High - no session-wide behavior rules |
| Agents folder | Missing | Medium - no custom subagents |
| Hooks | Missing | Medium - no automated quality gates |
| Planning workflow | Missing | High - no persistent task planning |

---

## Component Analysis

### 1. CLAUDE.md Global Instructions (**HIGH VALUE**)

**What it provides:**
```markdown
- Request classification (Phase 0) - Route work before starting
- Tool selection hierarchy - When to use agents vs direct tools
- Critical behavior rules - No status announcements, mandatory todos, LSP checks
- Delegation template - 7-section structured agent prompts
- Completion checklist - Verification before marking done
```

**Why beneficial for portfolio:**
- Our capstone emphasizes **repeatable, auditable systems** - global rules enforce this
- Would standardize how Claude approaches variant generation, evals, and red-teaming
- Prevents common mistakes (type suppressions, premature commits)

**Recommendation:** Create `/CLAUDE.md` adapted for portfolio workflows

---

### 2. Planning-with-Files Skill (**HIGH VALUE**)

**What it provides:**
```markdown
Three-file pattern for complex tasks:
- task_plan.md → Track progress and goals
- notes.md → Capture findings during investigation
- [deliverable].md → Final output

Rules:
- Never start complex tasks without task_plan.md
- Update plan after each phase
- Store large outputs in files, not context
```

**Why beneficial for portfolio:**
- Variant generation is multi-step (JD analysis → evidence search → generation → eval → redteam)
- Would create auditable artifacts for each generation session
- Complements existing `capstone/develop/` structure

**Recommendation:** Adapt as `.claude/skills/planning-with-files/SKILL.md`

---

### 3. Interview Command (**HIGH VALUE**)

**What it provides:**
```markdown
- Interactive specification development via AskUserQuestion
- Deliberately avoids obvious questions
- Iterates until planning phase completes
- Writes refined spec back to file
```

**Why beneficial for portfolio:**
- Variant generation starts with JD analysis - interview could **validate JD interpretation**
- Could pre-flight GO/NO-GO decisions before committing generation time
- Aligns with capstone goal of **reducing Claude judgment overhead**

**Recommendation:** Create `/commands/interview.md` for pre-generation spec validation

---

### 4. Media-Interpreter Agent (**MEDIUM VALUE**)

**What it provides:**
```markdown
- PDF/document analysis (text extraction, table parsing)
- Image/screenshot interpretation (UI elements, mockups)
- Diagram analysis (architecture, data flows)
```

**Why beneficial for portfolio:**
- Job descriptions sometimes come as PDFs or screenshots
- Could analyze design mockups when updating portfolio frontend
- Useful for processing career documents during data ingestion

**Recommendation:** Create `.claude/agents/media-interpreter.md`

---

### 5. Open-Source-Librarian Agent (**MEDIUM VALUE**)

**What it provides:**
```markdown
- Answers library questions with GitHub permalinks
- Request classification (conceptual vs implementation vs history)
- Parallel tool execution requirements
- Evidence standards with commit-SHA permalinks
```

**Why beneficial for portfolio:**
- Portfolio uses multiple libraries (Vite, React, Tailwind, sharp, etc.)
- Would help debug library issues with source-level evidence
- Useful when updating dependencies

**Recommendation:** Create `.claude/agents/open-source-librarian.md`

---

### 6. Codebase-Search Agent (**LOW VALUE - Already Covered**)

The built-in Explore agent already provides:
- Parallel tool execution
- Codebase exploration
- Structured result delivery

**Recommendation:** Skip - existing capability is sufficient

---

### 7. Tech-Docs-Writer Agent (**LOW VALUE - Already Covered**)

Our `technical-writer` skill already provides:
- README creation
- API documentation
- Developer-focused documentation

**Recommendation:** Skip - consider merging any unique aspects into existing skill

---

### 8. Hooks (**MEDIUM VALUE**)

**Available hooks:**
| Hook | Purpose | Portfolio Value |
|------|---------|-----------------|
| `keyword-detector.py` | Detect keywords in code/prompts | Medium - could flag sensitive content |
| `check-comments.py` | Validate comment quality | Low - we avoid over-commenting |
| `todo-enforcer.sh` | Ensure todos are documented | High - aligns with quality pipeline |

**Recommendation:** Implement `todo-enforcer.sh` pattern for claims verification

---

## Recommended Implementation Priority

### Phase 1: Foundation (Immediate)

1. **Create `/CLAUDE.md`**
   ```markdown
   # CLAUDE.md for Universal CV Portfolio

   ## Request Classification
   - Variant generation → Run quality pipeline
   - Content editing → Use cv-content-manager skill
   - Quality checks → Run evals + redteam

   ## Tool Hierarchy
   1. Direct tools for known scope
   2. Explore agent for unfamiliar areas
   3. Specialized skills for domain tasks

   ## Critical Rules
   - Never generate variants without JD analysis
   - Always run eval:variant after generation
   - Mark todos in_progress → completed immediately
   ```

2. **Add Planning-with-Files skill**
   - Location: `.claude/skills/planning-with-files/SKILL.md`
   - Use for variant generation sessions

### Phase 2: Agents (Short-term)

3. **Create agents directory structure**
   ```
   .claude/
   └── agents/
       ├── media-interpreter.md
       └── open-source-librarian.md
   ```

### Phase 3: Commands & Hooks (Medium-term)

4. **Interview command** for pre-generation validation
5. **Todo-enforcer hook** for claims verification

---

## What NOT to Incorporate

| Component | Reason |
|-----------|--------|
| Codebase-search agent | Built-in Explore agent is sufficient |
| Tech-docs-writer agent | Existing technical-writer skill covers this |
| TypeScript rules | Project already follows consistent conventions |
| Forge rules | Not applicable (no Foundry usage) |
| check-comments hook | We intentionally minimize comments |

---

## Alignment with Capstone Goals

The capstone emphasizes:
1. **Red Teaming** - Hooks could add automated quality gates
2. **Evaluations** - Planning-with-files creates audit trails
3. **AI Product Lifecycle** - CLAUDE.md standardizes workflow

Incorporating these components would strengthen the **"repeatable, auditable system"** goal without adding unnecessary complexity.

---

## Next Steps

1. Review this analysis
2. Decide which components to implement
3. Prioritize based on current pain points
4. Create implementation tasks

Would you like me to proceed with implementing any of these recommendations?
