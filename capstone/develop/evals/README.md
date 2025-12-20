# Evals
## Claims ledger (machine-checkable evaluation)

This folder contains the **executable form** of your evaluation rubric.

- Rubric: `capstone/develop/evaluation.md`
- Ledger output: `capstone/develop/evals/<slug>.claims.yaml`

---

## What the claims ledger is

A claims ledger is a structured file that lists **every metric-like claim** the variant makes,
and the **exact sources** that verify each claim.

This turns evaluation into a product behavior:

- you can run it repeatedly
- you can detect regressions
- you can prove traceability

---

## Commands

Generate / refresh ledger and checklist:

```bash
npm run eval:variant -- --slug <slug>
```

Verify a claim (write-back helper):

```bash
npm run eval:variant -- --slug <slug> --verify <claimId>=<sourcePath>
```

Strict gate (CI-style):

```bash
npm run eval:check
```

---

## How to verify claims

1) Run `npm run eval:variant -- --slug <slug>`  
2) Open `capstone/develop/evals/<slug>.claims.yaml`  
3) For each claim, pick a source file under `content/knowledge/**`  
4) Ensure the source contains the claim’s anchors (numbers / key phrases)  
5) Mark it verified (either manually in YAML, or with `--verify`)

**Rule:** if the claim cannot be sourced, remove or rewrite it in the variant.

---

## Why anchors matter

Anchors are the “unit test assertions”.

If a source file changes and removes an anchor, `npm run eval:check` fails.
That’s how you get **machine-checkable evaluation over time**.

