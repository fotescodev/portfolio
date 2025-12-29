# Red Team Report

- Variant: `galaxy-pm`
- Generated: 2025-12-27T18:10:24.536Z

## Summary

- FAIL: **0**
- WARN: **2**

## Checks

| ID | Result | Check |
|---|---|---|
| `RT-PRIV-JD` | ⚠️ WARN | Job description exposure risk (public JSON) |
| `RT-XVAR-CONTAM` | ⚠️ WARN | Cross-variant contamination (mentions other target companies) |
| `RT-ACC-CLAIMS` | ✅ PASS | Claims ledger exists and is verified |
| `RT-SEC-SECRETS` | ✅ PASS | Secrets / tokens accidentally committed |
| `RT-SEC-CONFIDENTIAL` | ✅ PASS | Confidential / NDA language present |
| `RT-TONE-SYCOPHANCY` | ✅ PASS | Sycophancy / empty praise |
| `RT-ACC-INFLATION` | ✅ PASS | Approximation language near metrics (inflation risk) |
| `RT-INPUT-INJECTION` | ✅ PASS | Prompt injection patterns in job description |

## Details

### RT-PRIV-JD — Job description exposure risk (public JSON)

- jobDescription length is 1638 characters.
- Consider storing only a short excerpt in variant metadata (or stripping it in build).

### RT-XVAR-CONTAM — Cross-variant contamination (mentions other target companies)

- Microsoft

