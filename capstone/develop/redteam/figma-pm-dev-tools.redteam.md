# Red Team Report

- Variant: `figma-pm-dev-tools`
- Generated: 2025-12-24T19:10:44.034Z

## Summary

- FAIL: **0**
- WARN: **1**

## Checks

| ID | Result | Check |
|---|---|---|
| `RT-PRIV-JD` | ⚠️ WARN | Job description exposure risk (public JSON) |
| `RT-ACC-CLAIMS` | ✅ PASS | Claims ledger exists and is verified |
| `RT-SEC-SECRETS` | ✅ PASS | Secrets / tokens accidentally committed |
| `RT-SEC-CONFIDENTIAL` | ✅ PASS | Confidential / NDA language present |
| `RT-TONE-SYCOPHANCY` | ✅ PASS | Sycophancy / empty praise |
| `RT-ACC-INFLATION` | ✅ PASS | Approximation language near metrics (inflation risk) |
| `RT-INPUT-INJECTION` | ✅ PASS | Prompt injection patterns in job description |
| `RT-XVAR-CONTAM` | ✅ PASS | Cross-variant contamination (mentions other target companies) |

## Details

### RT-PRIV-JD — Job description exposure risk (public JSON)

- jobDescription length is 1213 characters.
- Consider storing only a short excerpt in variant metadata (or stripping it in build).

