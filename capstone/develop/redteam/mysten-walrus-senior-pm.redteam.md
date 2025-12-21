# Red Team Report

- Variant: `mysten-walrus-senior-pm`
- Generated: 2025-12-21T17:11:12.937Z

## Summary

- FAIL: **1**
- WARN: **0**

## Checks

| ID | Result | Check |
|---|---|---|
| `RT-ACC-CLAIMS` | ❌ FAIL | Claims ledger exists and is verified |
| `RT-SEC-SECRETS` | ✅ PASS | Secrets / tokens accidentally committed |
| `RT-SEC-CONFIDENTIAL` | ✅ PASS | Confidential / NDA language present |
| `RT-TONE-SYCOPHANCY` | ✅ PASS | Sycophancy / empty praise |
| `RT-ACC-INFLATION` | ✅ PASS | Approximation language near metrics (inflation risk) |
| `RT-INPUT-INJECTION` | ✅ PASS | Prompt injection patterns in job description |
| `RT-PRIV-JD` | ✅ PASS | Job description exposure risk (public JSON) |
| `RT-XVAR-CONTAM` | ✅ PASS | Cross-variant contamination (mentions other target companies) |

## Details

### RT-ACC-CLAIMS — Claims ledger exists and is verified

- Missing ledger: capstone/develop/evals/mysten-walrus-senior-pm.claims.yaml
- Run: npm run eval:variant -- --slug mysten-walrus-senior-pm

