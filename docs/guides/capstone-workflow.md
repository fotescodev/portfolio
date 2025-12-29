# Capstone Quality Pipeline: Step-by-Step Workflow

> **Part of Phase 4 (Quality & Deploy)** in the [Complete Workflow](../COMPLETE_WORKFLOW.md)

This guide walks you through the complete quality pipeline for a variant, using `mysten-walrus-senior-pm` as a working example.

---

## Quick Reference: File Locations

| What | Where | Purpose |
|------|-------|---------|
| **JD Analysis** | `capstone/develop/jd-analysis/<slug>.yaml` | Extracted requirements (pre-generation) |
| **Alignment Report** | `capstone/develop/alignment/<slug>.yaml` | GO/NO-GO alignment (pre-generation) |
| **Variant YAML** | `content/variants/<slug>.yaml` | Source of truth (edit this) |
| **Variant JSON** | `content/variants/<slug>.json` | Runtime artifact (auto-generated) |
| **Knowledge Base** | `content/knowledge/achievements/*.yaml` | Facts & metrics source |
| **Claims Ledger** | `capstone/develop/evals/<slug>.claims.yaml` | Extracted claims + verification status |
| **Eval Checklist** | `capstone/develop/evals/<slug>.eval.md` | Human-readable checklist |
| **Red Team Report** | `capstone/develop/redteam/<slug>.redteam.md` | Adversarial scan results |
| **Evaluation Rubric** | `capstone/develop/evaluation.md` | How claims are evaluated |
| **Threat Model** | `capstone/develop/red-teaming.md` | Red team check definitions |

---

## The Pipeline Flow

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│  0. PRE-GEN        1. SYNC          2. EVALUATE         3. RED TEAM         4. SHIP            │
│                                                                                                  │
│  JD Analysis       YAML → JSON      Extract claims      Adversarial         Deploy if          │
│  Evidence Search   (deterministic)  Find sources        scans               gates pass         │
│  Coverage Check                     Mark verified                                               │
│  (deterministic)                                                                                │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Step 0: Pre-Generation Analysis (Deterministic)

**Purpose**: Analyze JD and check alignment BEFORE spending time on variant generation.

### Step 0.1: Analyze Job Description

Save the JD to a file and run analysis:

```bash
# Save JD text to file (if not already saved)
echo "[JD TEXT]" > source-data/jd-stripe-pm.txt

# Run deterministic JD analysis
npm run analyze:jd -- --file source-data/jd-stripe-pm.txt --save
```

**What happens**:
- Filters 47+ generic phrases ("team player", "excellent communication", etc.)
- Extracts years required, technologies, domain expertise
- Generates search terms for knowledge base
- Saves analysis to `capstone/develop/jd-analysis/<slug>.yaml`

**Output**: `capstone/develop/jd-analysis/<slug>.yaml`

### Step 0.2: Search for Alignment Evidence

```bash
npm run search:evidence -- --jd-analysis capstone/develop/jd-analysis/<slug>.yaml --save
```

**What happens**:
- Searches knowledge base (achievements, stories) for matching evidence
- Calculates alignment score (0.0-1.0)
- Generates GO/NO-GO recommendation
- Identifies gaps (search terms with no matching evidence)

**Output**: `capstone/develop/alignment/<slug>.yaml`

**Decision Framework**:

| Score | Recommendation | Action |
|-------|----------------|--------|
| ≥ 0.50 + 2 strong matches | **PROCEED** | Generate variant |
| ≥ 0.30 or 1 strong match | **REVIEW** | Review gaps, decide if worth pursuing |
| < 0.30 and 0 strong | **SKIP** | Not enough alignment — don't apply |

### Step 0.3: Check Bullet Coverage (Optional)

```bash
npm run check:coverage
```

**What happens**:
- Categorizes experience bullets into 7 PM competency bundles:
  1. Product Design & Development
  2. Leadership & Execution
  3. Strategy & Planning
  4. Business & Marketing
  5. Project Management
  6. Technical & Analytical
  7. Communication
- Identifies gaps (bundles with <2 bullets) and overweight areas (5+ bullets)
- Helps balance resume presentation for target role

---

## Step 1: Sync Variants

**Purpose**: Convert YAML (human-editable) to JSON (runtime artifact).

```bash
npm run variants:sync
```

**What happens**:
- Reads all `content/variants/*.yaml` files
- Validates against Zod schema
- Writes `content/variants/*.json` files

**Check for drift**:
```bash
npm run variants:check
```
Fails if JSON doesn't match YAML (useful in CI).

**Output**: JSON files in `content/variants/`

---

## Step 2: Generate Claims Ledger

**Purpose**: Extract all metric-like claims and find candidate sources.

```bash
npm run eval:variant -- --slug mysten-walrus-senior-pm
```

**What happens**:
1. Parses the variant YAML
2. Extracts claims containing metrics (%, $, ×, numbers)
3. Searches knowledge base for matching sources
4. Generates a claims ledger with candidate sources

**Outputs created**:
- `capstone/develop/evals/mysten-walrus-senior-pm.claims.yaml` - Machine-readable ledger
- `capstone/develop/evals/mysten-walrus-senior-pm.eval.md` - Human checklist

### Understanding the Claims Ledger

Open `capstone/develop/evals/<slug>.claims.yaml`:

```yaml
claims:
  - id: metric-1080fe1903
    location: overrides.hero.subheadline    # Where in variant
    text: "Senior PM with 8 years..."       # The claim text
    anchors:
      - 8 years                              # Key metric extracted
    candidateSources:
      - path: content/knowledge/achievements/...
        score: 0.09
        matchedAnchors: []
        note: "anchors 0/1 • overlap 60%"
    verified:
      status: unverified                     # YOU EDIT THIS
      sources: []
      notes: ""
```

### Verifying Claims

For each claim, you need to:

1. **Check candidate sources** - Does a knowledge base file contain this fact?
2. **Update verified status** - Change `unverified` → `verified`
3. **Add source path** - Reference the KB file that proves the claim
4. **Add notes** - Optional context

**Example: Before**
```yaml
verified:
  status: unverified
  sources: []
  notes: ""
```

**Example: After**
```yaml
verified:
  status: verified
  sources:
    - content/knowledge/achievements/l2-protocol-integrations.yaml
  notes: "Anchor '7+ L2 integrations' matches KB exactly"
```

### If a claim has no source

Two options:

1. **Add to knowledge base** - Create/update a file in `content/knowledge/achievements/`
2. **Reword the variant** - Change the claim in `content/variants/<slug>.yaml`

**Golden Rule**: Fix facts in the knowledge base first, then regenerate.

---

## Step 3: Red Team Scan

**Purpose**: Adversarial checks for security, tone, and accuracy risks.

```bash
npm run redteam:variant -- --slug mysten-walrus-senior-pm
```

**What happens**: Runs 8 checks against your variant:

| Check | Severity | What It Catches |
|-------|----------|-----------------|
| `RT-ACC-CLAIMS` | FAIL | Missing/unverified claims ledger |
| `RT-SEC-SECRETS` | FAIL | API keys, tokens in text |
| `RT-SEC-CONFIDENTIAL` | FAIL | NDA/confidential language |
| `RT-TONE-SYCOPHANCY` | WARN | "thrilled", "dream company" |
| `RT-ACC-INFLATION` | WARN | "about 15×" near metrics |
| `RT-INPUT-INJECTION` | WARN | Prompt injection in JD |
| `RT-PRIV-JD` | WARN | Long JD exposed in public JSON |
| `RT-XVAR-CONTAM` | WARN | Mentions other target company |

**Output**: `capstone/develop/redteam/mysten-walrus-senior-pm.redteam.md`

### Fixing Red Team Failures

**RT-ACC-CLAIMS (most common)**:
```
FAIL: Missing ledger
Fix: npm run eval:variant -- --slug <slug>
     Then verify claims in the .claims.yaml file
```

**RT-TONE-SYCOPHANCY**:
```
WARN: "thrilled", "dream company" detected
Fix: Edit content/variants/<slug>.yaml
     Remove sycophantic language
```

**RT-SEC-SECRETS**:
```
FAIL: API key pattern detected
Fix: Remove the secret from variant YAML immediately
```

---

## Step 4: Gate Check (CI Mode)

**Purpose**: Pass/fail gate for deployment.

```bash
# Check all variants pass evaluation
npm run eval:check

# Check all variants pass red team (WARN ok)
npm run redteam:check

# Strict mode (WARN = FAIL)
npm run redteam:check -- --strict
```

**Exit codes**:
- `0` = All checks pass
- `1` = At least one failure

---

## Complete Example: mysten-walrus-senior-pm

### 1. Sync

```bash
npm run variants:sync
```
```
✓ mysten-walrus-senior-pm (in sync)
```

### 2. Evaluate

```bash
npm run eval:variant -- --slug mysten-walrus-senior-pm
```
```
✓ mysten-walrus-senior-pm: 5 claims, 0 verified, 5 unverified
  capstone/develop/evals/mysten-walrus-senior-pm.claims.yaml
```

### 3. Verify Claims

Open `capstone/develop/evals/mysten-walrus-senior-pm.claims.yaml`

For each claim:
1. Check if `candidateSources` has a good match (score > 0.5)
2. Verify the anchor text matches the KB file
3. Update `verified.status` to `verified`
4. Add the source path

### 4. Red Team

```bash
npm run redteam:variant -- --slug mysten-walrus-senior-pm
```
```
✗ mysten-walrus-senior-pm 1 FAIL 0 WARN
```

Check `capstone/develop/redteam/mysten-walrus-senior-pm.redteam.md`:
```
RT-ACC-CLAIMS: FAIL - Missing/unverified claims
```

### 5. Fix & Iterate

Fix unverified claims → Re-run eval → Re-run redteam → Repeat until clean.

### 6. Final Gate

```bash
npm run eval:check && npm run redteam:check
```
```
✓ All variants pass
```

---

## Adding New Knowledge Base Entries

If a claim has no source, add it to the knowledge base:

```bash
# Create new achievement file
touch content/knowledge/achievements/my-new-achievement.yaml
```

**Template** (`content/knowledge/achievements/*.yaml`):
```yaml
id: my-new-achievement
type: achievement
title: "Short descriptive title"
company: Company Name
timeframe: "2023-2024"
situation: |
  Brief context (STAR format)
task: |
  What needed to be done
action: |
  What you specifically did
result: |
  Quantified outcomes
metrics:
  - value: "15×"
    label: "revenue increase"
    context: "Year-over-year growth"
tags:
  - web3
  - infrastructure
```

After adding, re-run evaluation to pick up the new source.

---

## JSON Output for Automation

All commands support `--json` for machine-readable output:

```bash
npm run variants:sync -- --json
npm run eval:variant -- --slug mysten-walrus-senior-pm --json
npm run redteam:all -- --json
```

Useful for CI pipelines:
```bash
npm run redteam:all -- --json | jq '.errors | length'
```

---

## Troubleshooting

### "Variant YAML not found"
Check the slug matches the filename:
```bash
ls content/variants/*.yaml
```

### "Claims ledger missing"
Run evaluation first:
```bash
npm run eval:variant -- --slug <slug>
```

### "All claims unverified"
You need to manually verify each claim in `.claims.yaml`.
The script finds candidates but doesn't auto-verify.

### "Red team fails on RT-ACC-CLAIMS"
This means claims exist but aren't verified. Open the `.claims.yaml` and update the `verified` sections.

---

## Quick Commands Reference

```bash
# ═══════════════════════════════════════════════════════════════
# PRE-GENERATION (Deterministic)
# ═══════════════════════════════════════════════════════════════
npm run analyze:jd -- --file source-data/jd-stripe.txt --save
npm run search:evidence -- --jd-analysis capstone/develop/jd-analysis/stripe.yaml --save
npm run search:evidence -- --terms "crypto,staking,api" --threshold 0.5
npm run check:coverage

# ═══════════════════════════════════════════════════════════════
# POST-GENERATION
# ═══════════════════════════════════════════════════════════════
# Sync all variants
npm run variants:sync

# Evaluate one variant
npm run eval:variant -- --slug mysten-walrus-senior-pm

# Evaluate all variants
npm run eval:all

# Red team one variant
npm run redteam:variant -- --slug mysten-walrus-senior-pm

# Red team all variants
npm run redteam:all

# CI gate checks
npm run eval:check
npm run redteam:check
npm run redteam:check -- --strict
```

---

## What's Next?

- [Universal CV Guide](./universal-cv.md) - Create new variants from job descriptions
- [Content Management](./content-management.md) - Edit knowledge base and content schemas
- [Getting Started Guide](../../GETTING_STARTED_GUIDE.md) - Full portfolio setup walkthrough
