# Universal CV CLI Guide

A complete guide to using the Universal CV quality pipeline CLI — from creating a new variant to shipping it.

---

## The Pipeline at a Glance

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        UNIVERSAL CV QUALITY PIPELINE                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌───────┐│
│   │  CREATE  │ →  │   SYNC   │ →  │ EVALUATE │ →  │ RED TEAM │ →  │ SHIP  ││
│   └──────────┘    └──────────┘    └──────────┘    └──────────┘    └───────┘│
│                                                                              │
│   Copy template     YAML→JSON     Extract claims   Adversarial   Deploy    │
│   Edit for role     Validate      Find sources     scans         variant   │
│                     schema        Verify facts     Gate check              │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Which Method Should I Use?

| Situation | Recommended Method |
|-----------|-------------------|
| Have Claude Code? | Use `/generate-variant` skill |
| No Claude Code but have API key? | Use `npm run generate:variant` CLI |
| No API key? | Manual creation: copy `content/variants/_template.yaml` |
| Day-to-day variant management? | Use `npm run ucv-cli` interactive dashboard |
| CI/CD pipelines? | Use individual commands with `--json` flag |

---

## Interactive Mode (Recommended)

The easiest way to use the pipeline is through the interactive CLI:

```bash
npm run ucv-cli
```

This launches a terminal dashboard where you can see all variants, their status, and perform actions without remembering individual commands.

> **Note:** The interactive CLI requires a terminal with TTY support. It won't work in:
> - CI/CD pipelines (use individual commands instead)
> - Non-interactive shells
> - Some IDE integrated terminals
>
> If you see "Non-interactive mode: printing variant status as JSON is not implemented yet", run the command directly in your terminal application.

### Dashboard View

```
╭─────────────────────────────────────────────────────────────────────────────╮
│  ◆ Universal CV                                          Quality Pipeline   │
╰─────────────────────────────────────────────────────────────────────────────╯

Pipeline Status

  Variant                              Sync    Eval       RedTeam    Status
  ─────────────────────────────────────────────────────────────────────────────
→ acme-senior-pm                        ✓      5/5 ✓      PASS       ✅ Ready
  bloomberg-technical-pm                ✓      0/5        1 FAIL     🔴 Blocked
  stripe-crypto                         ✓      ○          —          ⏳ Pending

  3 variants │ 1 ready │ 0 review │ 1 blocked │ 1 pending

  [↑↓] Navigate  [Enter] Actions  [c] Create  [q] Quit
```

### Status Column Meanings

| Status | Meaning |
|--------|---------|
| ✅ Ready | All checks pass, ready to ship |
| ⚠️ Review | Has warnings that should be reviewed |
| 🔴 Blocked | Has failures that must be fixed |
| ⏳ Pending | Pipeline not yet complete |

### Keyboard Controls

| Key | Action |
|-----|--------|
| `↑` `↓` | Navigate between variants |
| `Enter` | Open actions menu for selected variant |
| `c` | Create a new variant |
| `q` | Quit the CLI |

### Creating a New Variant

Press `c` from the dashboard to start the guided creation flow:

```
Create New Variant

→ Company: Coinbase
✓ Role: Product Manager II - Core Infrastructure
✓ JD Link: https://coinbase.com/careers/123
✓ JD Description: (1200 chars)

ℹ Slug: coinbase-product-manager-ii-core-infrastructure

Create coinbase-product-manager-ii-core-infrastructure.yaml?

[y] Yes  [n] No  [Esc] Cancel
```

After confirmation:
1. Creates the YAML variant file
2. Auto-syncs to JSON
3. Takes you to the Actions menu

### Variant Actions Menu

Select a variant and press `Enter` to see available actions:

```
coinbase-product-manager-ii-core-infrastructure

→ View Issues      See warnings, failures, unverified claims
  Run Pipeline     Run sync → eval → redteam
  Sync             YAML → JSON
  Evaluate         Extract & verify claims
  Red Team         Security/quality scan
  ─────────────────────────────────────
  Back             Return to dashboard

[↑↓] Navigate  [Enter] Select  [Esc/b] Back
```

### Viewing Issues

Select "View Issues" to see exactly what needs fixing:

```
Issues: coinbase-product-manager-ii-core-infrastructure

Red Team Issues (1)

⚠ RT-PRIV-JD: Job description exposure risk (public JSON)
  • jobDescription length is 6926 characters.
  • Consider storing only a short excerpt in variant metadata.

Unverified Claims (3)

○ metric-abc123
  "Senior Technical PM with 8 years shipping developer-facing products"
  Location: overrides.hero.subheadline

────────────────────────────────────────────────────────────────
To fix:
  • Red Team: Edit content/variants/coinbase-product-manager-ii.yaml
  • Claims: Add sources to capstone/develop/evals/coinbase-product-manager-ii.claims.yaml

[Enter/Esc/b] Back to actions
```

### Running Pipeline Phases

Select any phase to run it with real-time progress:

```
Running: Pipeline for coinbase-product-manager-ii-core-infrastructure

████████████████████████████░░░░░░░░░░░░  70%

✓ Sync
✓ Evaluate
● Red Team...

Running...
```

### When to Use Interactive vs Commands

| Use Case | Recommended |
|----------|-------------|
| Day-to-day variant work | `npm run ucv-cli` |
| CI/CD pipelines | Individual commands |
| Scripting/automation | Individual commands with `--json` |
| Quick single-variant check | Either works |

---

## Individual Commands

For CI pipelines, scripting, or when you prefer direct commands, use the individual npm scripts documented below.

---

## Phase 1: Create a New Variant

### Step 1.1: Copy the Template

```bash
cp content/variants/_template.yaml content/variants/acme-senior-pm.yaml
```

### Step 1.2: Edit the Variant

Open `content/variants/acme-senior-pm.yaml` and customize:

```yaml
# content/variants/acme-senior-pm.yaml
metadata:
  slug: acme-senior-pm          # Must match filename!
  company: Acme Corp
  role: Senior Product Manager
  jobUrl: https://acme.com/jobs/senior-pm
  jobDescription: |
    We're looking for a Senior PM to lead our developer platform...

overrides:
  hero:
    headline: "Building Developer Platforms That Scale"
    subheadline: |
      Senior Technical PM with 8 years shipping developer-facing products—
      from enterprise APIs to Web3 infrastructure.

  about:
    bio:
      - |
        I've shipped 7+ L2 protocol integrations with consistent API patterns
        that reduced integration time by 60%.
    stats:
      - value: "8+"
        label: "Years Experience"
      - value: "$50M+"
        label: "Revenue Impact"
```

**Key Rules**:
- `metadata.slug` MUST match the filename (without `.yaml`)
- All metrics should be traceable to knowledge base entries
- Keep `jobDescription` under 1200 chars (shown publicly in JSON)

---

## Phase 2: Sync Variants

**Purpose**: Convert YAML (human-editable) → JSON (runtime artifact)

### Command

```bash
npm run variants:sync
```

### What You'll See

```
╭─────────────────────────────────────────────────────────────────────────────╮
│  ◆ Universal CV                                          Quality Pipeline  │
╰─────────────────────────────────────────────────────────────────────────────╯

⠋ Syncing variants...

Syncing variants
/Users/you/portfolio/content/variants

✓ acme-senior-pm (created)
✓ bloomberg-technical-product-manager (in sync)
✓ mysten-walrus-senior-pm (in sync)
✓ stripe-crypto (in sync)

Summary: 4 variant(s), 1 updated, 0 errors
```

### Status Icons

| Icon | Meaning |
|------|---------|
| ✓ `(created)` | New JSON file created |
| ✓ `(updated)` | JSON updated to match YAML |
| ✓ `(in sync)` | JSON already matches YAML |
| ✗ `error` | Validation failed |

### Sync a Single Variant

```bash
npm run variants:sync -- --slug acme-senior-pm
```

### Check Mode (CI)

```bash
npm run variants:check
```

Exits with code `1` if any drift detected (useful for CI pipelines).

### JSON Output

```bash
npm run variants:sync -- --json
```

```json
{
  "mode": "sync",
  "variants": [
    { "slug": "acme-senior-pm", "status": "created" },
    { "slug": "bloomberg-technical-product-manager", "status": "synced" }
  ],
  "errors": []
}
```

---

## Phase 3: Evaluate Claims

**Purpose**: Extract metrics, find sources, create verification ledger

### Command

```bash
npm run eval:variant -- --slug acme-senior-pm
```

### What You'll See

```
╭─────────────────────────────────────────────────────────────────────────────╮
│  ◆ Universal CV                                          Quality Pipeline  │
╰─────────────────────────────────────────────────────────────────────────────╯

⠋ Evaluating variants...

Evaluating variants
1 variant(s)

✓ acme-senior-pm: 5 claims, 0 verified, 5 unverified
  capstone/develop/evals/acme-senior-pm.claims.yaml

Summary: 1 variant(s), 0 verified, 5 unverified
```

### Output Files Created

```
capstone/develop/evals/
├── acme-senior-pm.claims.yaml    ← Machine-readable claims ledger
└── acme-senior-pm.eval.md        ← Human-readable checklist
```

### Understanding the Claims Ledger

Open `capstone/develop/evals/acme-senior-pm.claims.yaml`:

```yaml
version: 1
variant:
  slug: acme-senior-pm
  evaluatedAt: 2025-12-21T18:30:00.000Z

claims:
  - id: metric-abc123
    location: overrides.hero.subheadline
    text: "Senior Technical PM with 8 years..."
    anchors:
      - "8 years"
    candidateSources:
      - path: content/experience/index.yaml
        score: 0.85
        matchedAnchors: ["8 years"]
        note: "anchors 1/1 • overlap 60%"
    verified:
      status: unverified      # ← YOU NEED TO UPDATE THIS
      sources: []
      notes: ""
```

### How to Verify Claims

For each claim, check the `candidateSources` and update `verified`:

**Before** (unverified):
```yaml
verified:
  status: unverified
  sources: []
  notes: ""
```

**After** (verified):
```yaml
verified:
  status: verified
  sources:
    - content/experience/index.yaml
  notes: "Employment dates 2017-2025 confirm 8 years"
```

### Evaluate All Variants

```bash
npm run eval:all
```

```
╭─────────────────────────────────────────────────────────────────────────────╮
│  ◆ Universal CV                                          Quality Pipeline  │
╰─────────────────────────────────────────────────────────────────────────────╯

⠋ Evaluating variants...

Evaluating variants
4 variant(s)

✓ acme-senior-pm: 5 claims, 5 verified, 0 unverified
✓ bloomberg-technical-product-manager: 8 claims, 8 verified, 0 unverified
⚠ mysten-walrus-senior-pm: 6 claims, 4 verified, 2 unverified
✓ stripe-crypto: 4 claims, 4 verified, 0 unverified

Summary: 4 variant(s), 21 verified, 2 unverified
```

---

## Phase 4: Red Team Scan

**Purpose**: Adversarial checks for security, tone, and accuracy risks

### Command

```bash
npm run redteam:variant -- --slug acme-senior-pm
```

### What You'll See

```
╭─────────────────────────────────────────────────────────────────────────────╮
│  ◆ Universal CV                                          Quality Pipeline  │
╰─────────────────────────────────────────────────────────────────────────────╯

⠋ Running red team scans...

Red Team Scan
1 variant(s)

✓ acme-senior-pm passed
  capstone/develop/redteam/acme-senior-pm.redteam.md

Summary: 1 passed, 0 warnings, 0 failed
```

### When Issues Are Found

```
╭─────────────────────────────────────────────────────────────────────────────╮
│  ◆ Universal CV                                          Quality Pipeline  │
╰─────────────────────────────────────────────────────────────────────────────╯

⠋ Running red team scans...

Red Team Scan
1 variant(s)

✗ acme-senior-pm 1 FAIL 2 WARN
  capstone/develop/redteam/acme-senior-pm.redteam.md

Summary: 0 passed, 0 warnings, 1 failed
```

### Red Team Report

Check `capstone/develop/redteam/acme-senior-pm.redteam.md`:

```markdown
# Red Team Report

- Variant: `acme-senior-pm`
- Generated: 2025-12-21T18:45:00.000Z

## Summary

- FAIL: **1**
- WARN: **2**

## Checks

| ID | Result | Check |
|---|---|---|
| `RT-ACC-CLAIMS` | ❌ FAIL | Claims ledger exists and is verified |
| `RT-SEC-SECRETS` | ✅ PASS | Secrets / tokens accidentally committed |
| `RT-TONE-SYCOPHANCY` | ⚠️ WARN | Sycophancy / empty praise |
| `RT-ACC-INFLATION` | ⚠️ WARN | Approximation language near metrics |
| ... | ... | ... |

## Details

### RT-ACC-CLAIMS — Claims ledger exists and is verified

- 2 unverified claims remain
- Run: npm run eval:variant -- --slug acme-senior-pm
```

### Red Team Checks Reference

| Check ID | Severity | What It Catches |
|----------|----------|-----------------|
| `RT-ACC-CLAIMS` | FAIL | Missing or unverified claims |
| `RT-SEC-SECRETS` | FAIL | API keys, tokens in text |
| `RT-SEC-CONFIDENTIAL` | FAIL | NDA/confidential language |
| `RT-TONE-SYCOPHANCY` | WARN | "thrilled", "dream company", etc. |
| `RT-ACC-INFLATION` | WARN | "about 15×" near metrics |
| `RT-INPUT-INJECTION` | WARN | Prompt injection in job description |
| `RT-PRIV-JD` | WARN | Job description >1200 chars |
| `RT-XVAR-CONTAM` | WARN | Mentions other target company |

### Red Team All Variants

```bash
npm run redteam:all
```

```
╭─────────────────────────────────────────────────────────────────────────────╮
│  ◆ Universal CV                                          Quality Pipeline  │
╰─────────────────────────────────────────────────────────────────────────────╯

⠋ Running red team scans...

Red Team Scan
4 variant(s)

✓ acme-senior-pm passed
✗ bloomberg-technical-product-manager 1 FAIL 0 WARN
  capstone/develop/redteam/bloomberg-technical-product-manager.redteam.md
⚠ mysten-walrus-senior-pm 0 WARN
  capstone/develop/redteam/mysten-walrus-senior-pm.redteam.md
✓ stripe-crypto passed

Summary: 2 passed, 1 warnings, 1 failed
```

---

## Phase 5: Gate Check (Ship Decision)

**Purpose**: Pass/fail gate before deployment

### Commands

```bash
# Check all variants have verified claims
npm run eval:check

# Check all variants pass red team (WARN ok)
npm run redteam:check

# Strict mode (WARN = FAIL)
npm run redteam:check -- --strict
```

### Gate Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              GATE CHECK FLOW                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   npm run eval:check                                                         │
│         │                                                                    │
│         ▼                                                                    │
│   ┌───────────────┐                                                         │
│   │ All claims    │──── NO ────▶ Exit 1 (FAIL)                              │
│   │ verified?     │                                                         │
│   └───────────────┘                                                         │
│         │ YES                                                                │
│         ▼                                                                    │
│   npm run redteam:check                                                      │
│         │                                                                    │
│         ▼                                                                    │
│   ┌───────────────┐                                                         │
│   │ Any FAIL      │──── YES ───▶ Exit 1 (FAIL)                              │
│   │ results?      │                                                         │
│   └───────────────┘                                                         │
│         │ NO                                                                 │
│         ▼                                                                    │
│   ┌───────────────┐                                                         │
│   │ --strict and  │──── YES ───▶ Exit 1 (FAIL)                              │
│   │ any WARN?     │                                                         │
│   └───────────────┘                                                         │
│         │ NO                                                                 │
│         ▼                                                                    │
│   Exit 0 (PASS) ──────────────▶ Safe to deploy!                             │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### CI Pipeline Example

```bash
#!/bin/bash
set -e

echo "=== Syncing variants ==="
npm run variants:check

echo "=== Checking claims ==="
npm run eval:check

echo "=== Red team gate ==="
npm run redteam:check --strict

echo "=== All gates passed! Deploying... ==="
npm run build
```

---

## Complete Workflow Example

Let's walk through creating `acme-senior-pm` end-to-end:

### 1. Create

```bash
cp content/variants/_template.yaml content/variants/acme-senior-pm.yaml
# Edit the file with your customizations
```

### 2. Sync

```bash
npm run variants:sync -- --slug acme-senior-pm
```
```
✓ acme-senior-pm (created)
```

### 3. Evaluate

```bash
npm run eval:variant -- --slug acme-senior-pm
```
```
✓ acme-senior-pm: 5 claims, 0 verified, 5 unverified
```

### 4. Verify Claims

```bash
# Open and edit the claims ledger
code capstone/develop/evals/acme-senior-pm.claims.yaml
```

For each claim, update `verified.status` to `verified` and add sources.

### 5. Red Team

```bash
npm run redteam:variant -- --slug acme-senior-pm
```
```
✓ acme-senior-pm passed
```

### 6. Gate Check

```bash
npm run eval:check && npm run redteam:check
```
```
✓ All variants pass evaluation
✓ All variants pass red team
```

### 7. Ship

```bash
npm run build
# Deploy to production
```

---

## File Locations Reference

```
portfolio/
├── content/
│   └── variants/
│       ├── _template.yaml              ← Start here for new variants
│       ├── acme-senior-pm.yaml         ← Your variant (EDIT THIS)
│       ├── acme-senior-pm.json         ← Generated (DON'T EDIT)
│       └── ...
│
├── content/knowledge/
│   └── achievements/                   ← Source of truth for metrics
│       ├── ankr-15x-revenue.yaml
│       ├── eth-staking-zero-slashing.yaml
│       └── ...
│
├── capstone/develop/
│   ├── evals/
│   │   ├── acme-senior-pm.claims.yaml  ← Claims ledger (VERIFY HERE)
│   │   └── acme-senior-pm.eval.md      ← Human checklist
│   │
│   ├── redteam/
│   │   └── acme-senior-pm.redteam.md   ← Red team report
│   │
│   ├── evaluation.md                   ← Evaluation rubric
│   └── red-teaming.md                  ← Threat model docs
│
└── scripts/
    ├── cli/
    │   ├── theme.ts                    ← CLI styling/colors
    │   └── ucv/                        ← Interactive CLI (npm run ucv-cli)
    │       ├── index.tsx               ← Entry point
    │       ├── App.tsx                 ← Main app & routing
    │       ├── screens/                ← Dashboard, Actions, Issues, etc.
    │       ├── components/             ← Header, etc.
    │       └── hooks/                  ← useVariants, etc.
    ├── sync-variants.ts
    ├── evaluate-variants.ts
    └── redteam.ts
```

---

## CLI Flags Reference

### All Commands Support

| Flag | Description |
|------|-------------|
| `--json` | Machine-readable JSON output |
| `--quiet` | Suppress non-essential output |
| `--slug <name>` | Target specific variant |

### Sync-Specific

| Flag | Description |
|------|-------------|
| `--check` | Verify mode (exit 1 if drift) |

### Red Team-Specific

| Flag | Description |
|------|-------------|
| `--all` | Scan all variants |
| `--check` | Gate mode (exit 1 on FAIL) |
| `--strict` | WARN becomes FAIL |
| `--no-write` | Don't write report file |

---

## Troubleshooting

### "Slug mismatch" Error

```
✗ acme-senior-pm error
  Slug mismatch: metadata.slug='acme-pm' but filename implies 'acme-senior-pm'
```

**Fix**: Ensure `metadata.slug` in YAML matches the filename exactly.

### "Variant YAML not found"

```
✗ acme-senior-pm error
  Variant YAML not found
```

**Fix**: Check the file exists at `content/variants/acme-senior-pm.yaml`

### Red Team Fails on RT-ACC-CLAIMS

```
RT-ACC-CLAIMS: FAIL - Missing/unverified claims
```

**Fix**:
1. Run `npm run eval:variant -- --slug <slug>`
2. Open the `.claims.yaml` file
3. Verify each claim and update `verified.status`

### All Claims Show "unverified"

The evaluation script finds candidates but doesn't auto-verify. You must:
1. Review each claim's `candidateSources`
2. Manually update `verified.status` to `verified`
3. Add the source path to `verified.sources`

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        UNIVERSAL CV CLI QUICK REFERENCE                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  INTERACTIVE (recommended for daily use)                                     │
│    npm run ucv-cli                          # Dashboard with all actions     │
│                                                                              │
│  CREATE                                                                      │
│    Press 'c' in ucv-cli                     # Guided creation flow           │
│    cp content/variants/_template.yaml content/variants/<slug>.yaml           │
│                                                                              │
│  SYNC                                                                        │
│    npm run variants:sync                    # Sync all                       │
│    npm run variants:sync -- --slug <slug>   # Sync one                       │
│    npm run variants:check                   # CI mode                        │
│                                                                              │
│  EVALUATE                                                                    │
│    npm run eval:variant -- --slug <slug>    # Evaluate one                   │
│    npm run eval:all                         # Evaluate all                   │
│    npm run eval:check                       # CI gate                        │
│                                                                              │
│  RED TEAM                                                                    │
│    npm run redteam:variant -- --slug <slug> # Scan one                       │
│    npm run redteam:all                      # Scan all                       │
│    npm run redteam:check                    # CI gate (WARN ok)              │
│    npm run redteam:check -- --strict        # CI gate (WARN = FAIL)          │
│                                                                              │
│  JSON OUTPUT (any command)                                                   │
│    npm run <command> -- --json              # Machine-readable               │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```
