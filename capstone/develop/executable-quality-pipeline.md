# Executable Quality Pipeline
## Capstone: from docs → repeatable product behavior

This capstone folder contains **two layers**:

1) **Conceptual frameworks** (rubrics, threat model)  
2) **Executable tooling** that makes those frameworks *real* and repeatable

Your goal is not just “have good docs” — it’s to build the muscle of:

> **Truth → Output → Evaluation → Red Team → Ship → Iterate**

---

## The system you built in this repo

### Canonical vs runtime artifacts

- **Canonical variants (edit these):** `content/variants/*.yaml`  
- **Runtime variants (site loads these):** `content/variants/*.json`

The website loads variants using Vite’s JSON glob import, so JSON must exist and match YAML.

That’s why we added a deterministic sync step:

```bash
npm run variants:sync
npm run variants:check
```

---

## Phase 1: Keep variants coherent
### (YAML is the source of truth)

**What you do**
- Edit YAML variants
- Generate JSON from YAML

**Commands**
```bash
npm run variants:sync          # writes/updates JSON to match YAML
npm run variants:check         # fails if YAML/JSON drift exists
```

**Artifacts**
- `content/variants/<slug>.yaml`
- `content/variants/<slug>.json`

---

## Phase 2: Make evaluation executable
### (claims ledger → machine-checkable)

Your evaluation rubric lives here:
- `capstone/develop/evaluation.md`

The executable version of “accuracy” is the **claims ledger**:
- `capstone/develop/evals/<slug>.claims.yaml`

**Generate / refresh the ledger**
```bash
npm run eval:variant -- --slug <slug>
```

This produces:
- `capstone/develop/evals/<slug>.claims.yaml`
- `capstone/develop/evals/<slug>.eval.md`

**What the ledger does**
- Extracts metric-like claims (numbers, %, $, ×, +, “billions”, “zero”, etc.)
- Suggests candidate source files from `content/knowledge/**`
- Requires you to mark each claim as VERIFIED with a source + anchors

**Gate**
```bash
npm run eval:check
```

`eval:check` fails if:
- the ledger is missing
- the variant changed since the ledger was generated (hash mismatch)
- any claim is unverified
- any verified anchor no longer exists in the source (regression)

---

## Phase 2.5: “Verified sources” write-back

You can mark a claim verified from the CLI:

```bash
npm run eval:variant -- --slug <slug> --verify <claimId>=<sourcePath>
```

This updates the ledger so your evaluation becomes **machine-checkable over time**.

---

## Phase 3: Red team as a repeatable scan
### (failure modes become checks)

Your threat model lives here:
- `capstone/develop/red-teaming.md`

The executable scan writes a report:
- `capstone/develop/redteam/<slug>.redteam.md`

**Run**
```bash
npm run redteam:variant -- --slug <slug>
```

**Gate**
```bash
npm run redteam:check
npm run redteam:check -- --strict   # WARN becomes FAIL
```

This scan is intentionally grounded to portfolio risks:
- missing/unverified claims ledger (hard fail)
- secrets / tokens in text (hard fail)
- confidentiality / NDA language (hard fail)
- sycophancy phrases (warn)
- approximation language near metrics (warn)
- prompt injection patterns inside job descriptions (warn)
- job description exposure risk (warn)
- cross-variant contamination (warn)

---

## The capstone PM loop (memorize this)

```
Truth (KB)  →  Variant (YAML)  →  Sync (JSON)  →  Evaluate (claims ledger)
   ↑                                                    ↓
   └────────────── Fix facts in KB, not in output ───────┘
                         ↓
                   Red Team (static scan)
                         ↓
                      Ship (deploy)
                         ↓
                Track results + iterate
```

---

## How to use this on future projects

This pattern generalizes:

- Replace “variants” with “prompts”, “policies”, “configs”
- Replace “knowledge base” with “source docs / requirements / specs”
- Replace “claims ledger” with any *traceability layer*
- Replace “redteam scan” with “abuse tests / threat model checks / safety checks”

The key deliverable is **the workflow** — not the scripts.

