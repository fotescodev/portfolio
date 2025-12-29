# Red Team Report

- Variant: `anthropic-ai-safety-fellow`
- Generated: 2025-12-29T04:47:49.371Z

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

- metric-1de3c221e8 (overrides.about.bio[0])
- metric-dabf656aa7 (overrides.about.bio[0])
- metric-d07b4c9bd6 (overrides.about.stats[0].value)
- metric-4db1be37dc (overrides.about.stats[1].value)
- metric-bcd44c9028 (overrides.about.stats[2].value)

