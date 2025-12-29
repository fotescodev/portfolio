# Variant Evaluation

- Variant: `cursor-tam`
- Ledger: `capstone/develop/evals/cursor-tam.claims.yaml`
- Evaluated At: 2025-12-29T02:02:00.135Z
- Content Hash: `5a11bae7a7f2…`

## Automated Summary

- Claims detected: **6**
- Verified: **6**
- Unverified: **0**

## Claims

| Status | Claim | Location | Top candidate source |
|---|---|---|---|
| ✅ verified | At Dapper Labs, I owned the Flow CLI and Cadence Playground, reducing time-to-first-deploy by 60% through relentless … | `overrides.about.bio[0]` | `content/knowledge/achievements/flow-cli-dx.yaml` |
| ✅ verified | At Anchorage Digital, I work with institutional clients managing billions—Galaxy chose us for ETH staking specificall… | `overrides.about.bio[0]` | `content/knowledge/achievements/eth-staking-zero-slashing.yaml` |
| ✅ verified | My startup experience (Ankr: 15× revenue growth, 5-person team, survival mode) means I know how to be {{accent}}scrap… | `overrides.about.bio[1]` | `content/knowledge/achievements/ankr-15x-revenue.yaml` |
| ✅ verified | 60% | `overrides.about.stats[0].value` | `content/knowledge/achievements/flow-cli-dx.yaml` |
| ✅ verified | 8+ | `overrides.about.stats[1].value` | `` |
| ✅ verified | Billions | `overrides.about.stats[2].value` | `content/knowledge/achievements/eth-staking-zero-slashing.yaml` |

## Human Checklist (Capstone Rubric)

Use `capstone/develop/evaluation.md` as the rubric. Fill in scores here as you review:

- Accuracy: ___ / 5
- Relevance: ___ / 5
- Tone: ___ / 5
- Safety: ___ / 5

### Gate

- To pass `npm run eval:check`: every claim must be **verified** in the claims ledger, and every verified source must still contain its anchors.
