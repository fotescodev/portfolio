# Red Team Report

- Variant: `cursor-tam`
- Generated: 2025-12-30T17:51:54.057Z

## Summary

- FAIL: **1**
- WARN: **2**

## Checks

| ID | Result | Check |
|---|---|---|
| `RT-ACC-CLAIMS` | ❌ FAIL | Claims ledger exists and is verified |
| `RT-PRIV-JD` | ⚠️ WARN | Job description exposure risk (public JSON) |
| `RT-XVAR-CONTAM` | ⚠️ WARN | Cross-variant contamination (mentions other target companies) |
| `RT-SEC-SECRETS` | ✅ PASS | Secrets / tokens accidentally committed |
| `RT-SEC-CONFIDENTIAL` | ✅ PASS | Confidential / NDA language present |
| `RT-TONE-SYCOPHANCY` | ✅ PASS | Sycophancy / empty praise |
| `RT-ACC-INFLATION` | ✅ PASS | Approximation language near metrics (inflation risk) |
| `RT-INPUT-INJECTION` | ✅ PASS | Prompt injection patterns in job description |

## Details

### RT-ACC-CLAIMS — Claims ledger exists and is verified

- metric-191c6ecad4 (overrides.about.bio[0])
- metric-a651386854 (overrides.about.bio[0])

### RT-PRIV-JD — Job description exposure risk (public JSON)

- jobDescription length is 1426 characters.
- Consider storing only a short excerpt in variant metadata (or stripping it in build).

### RT-XVAR-CONTAM — Cross-variant contamination (mentions other target companies)

- Microsoft

