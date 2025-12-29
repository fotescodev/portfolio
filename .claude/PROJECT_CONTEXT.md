# PROJECT CONTEXT — Capstone Quality Pipeline Handoff
## For Claude / future assistants working on this repo

Dmitrii’s intent (capstone): build real muscle in **Red Teaming**, **Evaluations**, and **AI Product Lifecycle** by turning a fast-grown “vibecoded” portfolio project into a **repeatable, auditable system**.

This handoff summarizes what was added/changed so you can continue without having the chat history.

---

## What was built (high-level)

This repo already had:
- a portfolio site (Vite + React)
- structured content in `content/`
- a “Universal CV” concept: generate **variants** tailored to a job

The capstone upgrade is: **make quality checks executable**.

We implemented:

1) **Variants coherence**: YAML is canonical, JSON is runtime  
2) **Executable evaluation**: “claims ledger” that makes factual traceability machine-checkable  
3) **Executable red team**: repeatable scan + report per variant

---

## The architecture (mental model)

### Artifact flow (canonical → runtime)

- **Canonical (human/agent edits):** `content/variants/<slug>.yaml`
- **Runtime (site loads):** `content/variants/<slug>.json`

The site loads JSON via Vite glob import:

- `src/lib/variants.ts` uses `import.meta.glob('../../content/variants/*.json')`

So JSON must exist and must match YAML.

### Quality pipeline (capstone)

```
Job Description
   ↓  analyze:jd (deterministic)
JD Analysis (capstone/develop/jd-analysis/*.yaml)
   ↓  search:evidence (deterministic)
Alignment Report (capstone/develop/alignment/*.yaml)
   ↓  GO/NO-GO decision
Truth (content/knowledge/**)
   ↓
Variant (content/variants/*.yaml)
   ↓  variants:sync
Runtime artifact (content/variants/*.json)
   ↓  eval:variant
Claims ledger (capstone/develop/evals/*.claims.yaml)
   ↓  redteam:variant
Red team report (capstone/develop/redteam/*.redteam.md)
   ↓
Ship (deploy)
```

---

## Code added (scripts)

### Pre-Generation Scripts (Deterministic — No AI Required)

These scripts run BEFORE generating variants, reducing Claude judgment overhead by ~60%:

#### 1) JD Analysis
**File:** `scripts/analyze-jd.ts`
**Purpose:** Extract requirements from JD, filter 47+ generic phrases, generate search terms

Commands:
- `npm run analyze:jd -- --file source-data/jd-stripe.txt --save`
- `npm run analyze:jd -- --file jd.txt --json`

Artifacts:
- `capstone/develop/jd-analysis/<slug>.yaml`

What it filters: "team player", "excellent communication", "proven track record", etc.

#### 2) Evidence Search
**File:** `scripts/search-evidence.ts`
**Purpose:** Search knowledge base for alignment evidence, generate GO/NO-GO recommendation

Commands:
- `npm run search:evidence -- --jd-analysis capstone/develop/jd-analysis/<slug>.yaml --save`
- `npm run search:evidence -- --terms "crypto,staking,api" --threshold 0.5`

Artifacts:
- `capstone/develop/alignment/<slug>.yaml`

#### 3) Coverage Check
**File:** `scripts/check-coverage.ts`
**Purpose:** Categorize experience bullets into 7 PM competency bundles (Product Design, Leadership, Strategy, Business, Project Mgmt, Technical, Communication)

Commands:
- `npm run check:coverage`
- `npm run check:coverage -- --json`
- `npm run check:coverage -- --save`

### Post-Generation Scripts

#### 4) Variant sync
**File:** `scripts/sync-variants.ts`
**Purpose:** generate deterministic JSON from YAML; detect drift

Commands:
- `npm run variants:sync`
- `npm run variants:check`

#### 5) Executable evaluation
**File:** `scripts/evaluate-variants.ts`
**Purpose:**
- extract **metric-like claims** from variant overrides
- suggest candidate sources from `content/knowledge/**`
- write a claims ledger + human checklist
- enforce machine-checkable gates

Commands:
- `npm run eval:variant -- --slug <slug>`
- `npm run eval:all`
- `npm run eval:check`

Artifacts:
- `capstone/develop/evals/<slug>.claims.yaml`
- `capstone/develop/evals/<slug>.eval.md`

Write-back helper (optional):
- `npm run eval:variant -- --slug <slug> --verify <claimId>=<sourcePath>`

#### 6) Executable red team
**File:** `scripts/redteam.ts`
**Purpose:** scan variant content for portfolio-relevant risks

Commands:
- `npm run redteam:variant -- --slug <slug>`
- `npm run redteam:all`
- `npm run redteam:check`
- `npm run redteam:check -- --strict`

Artifact:
- `capstone/develop/redteam/<slug>.redteam.md`

---

## Key bug fix

**File:** `src/lib/variants.ts`  
**Fix:** `getVariantSlugs()` was incorrectly matching `*.yaml` even though variants are loaded from `*.json`. It now matches `*.json`.

---

## Small safety upgrade in generator

**File:** `scripts/generate-variant.ts`

Changes:
- job description in the prompt is now labeled **UNTRUSTED INPUT** and wrapped in `<JOB_DESCRIPTION>...</JOB_DESCRIPTION>` (prompt-injection hygiene)
- printed URLs now correctly use HashRouter: `/#/company/role`
- it reminds to run `npm run variants:sync`

---

## Capstone docs added/updated

New:
- `capstone/develop/executable-quality-pipeline.md`
- `capstone/develop/evals/README.md`
- `capstone/develop/redteam/README.md`

Updated:
- `capstone/develop/evaluation.md` now references the CLI
- `capstone/develop/red-teaming.md` now references the CLI

---

## package.json changes (new commands)

Added scripts:
- `predev`: `npm run variants:sync`
- `prebuild`: `npm run validate && npm run variants:sync`
- `variants:*`, `eval:*`, `redteam:*`

---

## Mentor notes for Dmitrii (what to internalize)

### 1) Treat “evaluation” as a product behavior
Not a doc. Not vibes. A behavior you can rerun and gate.

The claims ledger is the key muscle:
- extract claims
- verify against sources
- anchors make it regression-proof

### 2) Know your trust boundaries
- Knowledge base = trusted (facts)
- Job descriptions = untrusted (can contain prompt injection or nonsense)
- Variant output is publishable, so it must be defensible

### 3) Don’t fix facts in the output
If you catch a mismatch:
- fix the source of truth (knowledge files) OR remove the claim
- then regenerate / re-evaluate

### 4) Keep scope tight
This capstone is about:
- evals
- red teaming
- lifecycle gates

Not about building a full agent platform.

---

## Suggested next moves (if continuing)

1) Run `npm run eval:all`
2) Pick one variant and verify **every claim** in its ledger
3) Run `npm run redteam:variant -- --slug <slug>`
4) Only then consider CI gating (optional): `eval:check` + `redteam:check`

