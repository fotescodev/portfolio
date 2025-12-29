# Red Team Report

- Variant: `plaid-api-devex-pm`
- Generated: 2025-12-27T18:10:24.580Z

## Summary

- FAIL: **1**
- WARN: **1**

## Checks

| ID | Result | Check |
|---|---|---|
| `RT-ACC-CLAIMS` | ❌ FAIL | Claims ledger exists and is verified |
| `RT-PRIV-JD` | ⚠️ WARN | Job description exposure risk (public JSON) |
| `RT-SEC-SECRETS` | ✅ PASS | Secrets / tokens accidentally committed |
| `RT-SEC-CONFIDENTIAL` | ✅ PASS | Confidential / NDA language present |
| `RT-TONE-SYCOPHANCY` | ✅ PASS | Sycophancy / empty praise |
| `RT-ACC-INFLATION` | ✅ PASS | Approximation language near metrics (inflation risk) |
| `RT-INPUT-INJECTION` | ✅ PASS | Prompt injection patterns in job description |
| `RT-XVAR-CONTAM` | ✅ PASS | Cross-variant contamination (mentions other target companies) |

## Details

### RT-ACC-CLAIMS — Claims ledger exists and is verified

- Missing ledger: capstone/develop/evals/plaid-api-devex-pm.claims.yaml
- Run: npm run eval:variant -- --slug plaid-api-devex-pm

### RT-PRIV-JD — Job description exposure risk (public JSON)

- jobDescription length is 1741 characters.
- Consider storing only a short excerpt in variant metadata (or stripping it in build).

