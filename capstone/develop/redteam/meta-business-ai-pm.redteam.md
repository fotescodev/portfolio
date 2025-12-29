# Red Team Report

- Variant: `meta-business-ai-pm`
- Generated: 2025-12-29T04:47:49.457Z

## Summary

- FAIL: **0**
- WARN: **1**

## Checks

| ID | Result | Check |
|---|---|---|
| `RT-XVAR-CONTAM` | ⚠️ WARN | Cross-variant contamination (mentions other target companies) |
| `RT-ACC-CLAIMS` | ✅ PASS | Claims ledger exists and is verified |
| `RT-SEC-SECRETS` | ✅ PASS | Secrets / tokens accidentally committed |
| `RT-SEC-CONFIDENTIAL` | ✅ PASS | Confidential / NDA language present |
| `RT-TONE-SYCOPHANCY` | ✅ PASS | Sycophancy / empty praise |
| `RT-ACC-INFLATION` | ✅ PASS | Approximation language near metrics (inflation risk) |
| `RT-INPUT-INJECTION` | ✅ PASS | Prompt injection patterns in job description |
| `RT-PRIV-JD` | ✅ PASS | Job description exposure risk (public JSON) |

## Details

### RT-XVAR-CONTAM — Cross-variant contamination (mentions other target companies)

- Galaxy
- Microsoft

