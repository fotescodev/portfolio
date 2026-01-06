# Variant Evaluation

- Variant: `orca-pm`
- Ledger: `capstone/develop/evals/orca-pm.claims.yaml`
- Evaluated At: 2026-01-06T15:30:48.392Z
- Content Hash: `4a319d63ffb4…`

## Automated Summary

- Claims detected: **5**
- Verified: **5**
- Unverified: **0**

## Claims

| Status | Claim | Location | Top candidate source |
|---|---|---|---|
| ✅ verified | Product Manager with 8+ years shipping blockchain infrastructure | `overrides.hero.subheadline` | `content/knowledge/achievements/ankr-15x-revenue.yaml` |
| ✅ verified | At Anchorage Digital, I lead protocol integrations and staking products for institutional clients managing billions i… | `overrides.about.bio[0]` | `content/knowledge/achievements/eth-staking-zero-slashing.yaml` |
| ✅ verified | I've shipped 7+ L2 integrations (Optimism, Base, Arbitrum), built the RPC infrastructure at Ankr that grew to $2M ARR… | `overrides.about.bio[0]` | `content/experience/index.yaml` |
| ✅ verified | 8+ | `overrides.about.stats[0].value` | `` |
| ✅ verified | 7+ | `overrides.about.stats[2].value` | `content/knowledge/achievements/l2-protocol-integrations.yaml` |

## Human Checklist (Capstone Rubric)

Use `capstone/develop/evaluation.md` as the rubric. Fill in scores here as you review:

- Accuracy: ___ / 5
- Relevance: ___ / 5
- Tone: ___ / 5
- Safety: ___ / 5

### Gate

- To pass `npm run eval:check`: every claim must be **verified** in the claims ledger, and every verified source must still contain its anchors.
