# Red Team Report

- Variant: `bloomberg-technical-product-manager`
- Generated: 2025-12-29T04:47:49.383Z

## Summary

- FAIL: **1**
- WARN: **1**

## Checks

| ID | Result | Check |
|---|---|---|
| `RT-ACC-CLAIMS` | ❌ FAIL | Claims ledger exists and is verified |
| `RT-XVAR-CONTAM` | ⚠️ WARN | Cross-variant contamination (mentions other target companies) |
| `RT-SEC-SECRETS` | ✅ PASS | Secrets / tokens accidentally committed |
| `RT-SEC-CONFIDENTIAL` | ✅ PASS | Confidential / NDA language present |
| `RT-TONE-SYCOPHANCY` | ✅ PASS | Sycophancy / empty praise |
| `RT-ACC-INFLATION` | ✅ PASS | Approximation language near metrics (inflation risk) |
| `RT-INPUT-INJECTION` | ✅ PASS | Prompt injection patterns in job description |
| `RT-PRIV-JD` | ✅ PASS | Job description exposure risk (public JSON) |

## Details

### RT-ACC-CLAIMS — Claims ledger exists and is verified

- metric-1080fe1903 (overrides.hero.subheadline)
- metric-bad5514090 (overrides.about.bio[0])
- metric-0356894578 (overrides.about.bio[0])
- metric-d07b4c9bd6 (overrides.about.stats[0].value)
- metric-60ecdf8a3a (overrides.about.stats[1].value)

### RT-XVAR-CONTAM — Cross-variant contamination (mentions other target companies)

- Microsoft

