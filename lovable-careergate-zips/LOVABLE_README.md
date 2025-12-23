# CareerGating - Context for Lovable

## Overview

These zip files contain all the context needed to build **CareerGating** - an evidence-based quality gate system for career content (resumes, cover letters, LinkedIn profiles).

**What is CareerGating?** A "linter for resumes" that catches mistakes research proves matter (typos = 77% rejection, missing metrics = 40% fewer interviews) while being transparent about which rules have evidence vs. which are just convention.

---

## Zip File Contents

### 01-prd-context.zip (49KB)
**Purpose**: Core requirements and project context

Contains:
- `docs/prd/careergating-prd.md` - **THE MAIN PRD** - Start here!
- `docs/research/careergating-research-brief.md` - Research backing the PRD
- `docs/guides/universal-cv.md` - How the variant system works
- `docs/guides/universal-cv-cli.md` - CLI usage patterns
- `docs/guides/capstone-workflow.md` - Quality pipeline walkthrough
- `context/PROJECT_STATE.md` - Strategic context
- `context/CODEBASE.md` - Architecture conventions
- `README.md` - Project overview

**Start here** - Read the PRD first, then the research brief.

---

### 02-knowledge-base.zip (52KB)
**Purpose**: Career content data structures and examples

Contains:
- `content/profile.yaml` - Identity/bio structure
- `content/experience/index.yaml` - Work history schema
- `content/skills/index.yaml` - Skills taxonomy
- `content/testimonials/index.yaml` - Social proof structure
- `content/knowledge/index.yaml` - **Entity graph** (key!)
- `content/knowledge/achievements/*.yaml` - STAR-format accomplishments
- `content/knowledge/stories/*.yaml` - Extended narratives
- `content/case-studies/*.md` - Detailed project writeups
- `content/variants/*.yaml` - Job-targeted resume variants
- `content/variants/README.md` - Variant system docs

**Key insight**: The `knowledge/` folder shows how career data can be structured for AI consumption. The variants show personalization without fabrication.

---

### 03-quality-pipeline.zip (74KB)
**Purpose**: CLI implementation and quality scripts

Contains:
- `scripts/cli/ucv/` - **ucv-cli source code** (Terminal UI dashboard)
  - `index.ts` - Main CLI orchestrator
  - `App.tsx` - React/Ink TUI app
  - `screens/*.tsx` - Dashboard, Create, PhaseRunner, Issues screens
  - `hooks/useVariants.ts` - State management
  - `lib/colors.ts` - Theme definitions
- `scripts/redteam.ts` - **Core scanning logic** (secret detection, sycophancy, etc.)
- `scripts/evaluate-variants.ts` - Claims verification runner
- `scripts/validate-content.ts` - Schema validation
- `scripts/generate-cv.ts` - AI variant generation
- `scripts/sync-variants.ts` - YAML→JSON conversion

**Key insight**: `redteam.ts` already has patterns for detecting secrets, sycophancy, buzzwords, cross-variant contamination. This is the foundation for CareerGating rules.

---

### 04-schemas-config.zip (42KB)
**Purpose**: Type definitions, schemas, and evaluation framework

Contains:
- `src/lib/schemas.ts` - **Zod validation schemas** (essential!)
- `src/types/portfolio.ts` - TypeScript types
- `src/types/variant.ts` - Variant type definitions
- `capstone/README.md` - 4D evaluation framework
- `capstone/develop/evaluation.md` - Claims verification methodology
- `capstone/develop/red-teaming.md` - Adversarial testing framework
- `capstone/develop/evals/*.claims.yaml` - Example claims ledgers
- `capstone/develop/redteam/*.md` - Example red team reports
- `package.json` - NPM scripts and dependencies
- `tsconfig.json` - TypeScript config
- `.claude/skills/generate-variant/SKILL.md` - AI automation skill

**Key insight**: The capstone framework shows how to verify claims and red-team career content - directly applicable to CareerGating's transparency model.

---

## Build Priorities for Lovable

### MVP (Week 1-2)
1. **Web Scanner SPA**
   - Textarea input for resume text
   - "Scan" button
   - Results display with FAIL/WARN/INFO severity
   - Evidence panel showing research sources

2. **Core Rules** (from PRD):
   ```
   FAIL: Spelling errors, credential exposure
   WARN: Buzzwords, weak verbs, low metrics, sycophancy
   INFO: Missing LinkedIn URL
   ```

3. **Evidence Display**
   - Each finding shows confidence level (STRONG/MODERATE/CONVENTION)
   - Links to research sources
   - Actionable suggestions

### Tech Stack Suggestion
- React + Vite (or Lovable's stack)
- Tailwind CSS
- Local state only (no backend for MVP)
- Deploy to Vercel/Netlify

---

## Key Code to Reference

### Secret Detection Pattern (from redteam.ts)
```typescript
const secretPatterns = [
  { name: 'OpenAI key', re: /\bsk-[A-Za-z0-9]{20,}\b/g },
  { name: 'GitHub token', re: /\bghp_[A-Za-z0-9]{30,}\b/g },
  { name: 'AWS key', re: /\bAKIA[0-9A-Z]{16}\b/g },
];
```

### Sycophancy Detection (from redteam.ts)
```typescript
const sycophancyRe = /\b(thrilled|honored|excited to join|dream company|long admired)\b/gi;
```

### Buzzword Detection
```typescript
const buzzwords = ['synergy', 'leverage', 'dynamic', 'proactive', 'guru', 'ninja', 'rockstar'];
```

---

## Design Tokens (from PRD)

```css
:root {
  /* Severity colors */
  --fail: #ef4444;      /* Red */
  --warn: #f59e0b;      /* Amber */
  --info: #3b82f6;      /* Blue */
  --pass: #10b981;      /* Green */

  /* Confidence colors */
  --strong: #10b981;    /* Green */
  --moderate: #f59e0b;  /* Amber */
  --convention: #6b7280; /* Gray */

  /* UI */
  --bg: #0a0a0c;
  --surface: #1a1a1e;
  --border: #2a2a2e;
  --text: #fafafa;
  --text-muted: #a1a1aa;
  --accent: #c29a6c;    /* Gold */
}
```

---

## Questions?

The PRD in `01-prd-context.zip` has comprehensive specs including:
- Complete rule catalog (Appendix A)
- TypeScript interfaces (Technical Architecture section)
- UI mockups (UI/UX Specifications section)
- Evidence sources (Appendix C)

Start with the PRD, then reference the other zips for implementation patterns.
