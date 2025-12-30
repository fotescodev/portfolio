# Variant Evaluation

- Variant: `cursor-tam`
- Ledger: `capstone/develop/evals/cursor-tam.claims.yaml`
- Evaluated At: 2025-12-30T17:51:53.606Z
- Content Hash: `cc9f43e63f5f…`

## Automated Summary

- Claims detected: **4**
- Verified: **2**
- Unverified: **2**

## Claims

| Status | Claim | Location | Top candidate source |
|---|---|---|---|
| ⚠️ unverified | Most recently, at Anchorage Digital, I worked with institutional clients managing billions in AUM, ensuring zero slas… | `overrides.about.bio[0]` | `content/knowledge/achievements/eth-staking-zero-slashing.yaml` |
| ⚠️ unverified | At Ankr, I drove 15× revenue growth ($130K to $2M ARR) by repositioning RPC infrastructure from developers to protoco… | `overrides.about.bio[0]` | `content/knowledge/achievements/ankr-15x-revenue.yaml` |
| ✅ verified | 60% | `overrides.about.stats[0].value` | `content/knowledge/achievements/flow-cli-dx.yaml` |
| ✅ verified | 8+ | `overrides.about.stats[1].value` | `` |

## Human Checklist (Capstone Rubric)

Use `capstone/develop/evaluation.md` as the rubric. Fill in scores here as you review:

- Accuracy: ___ / 5
- Relevance: ___ / 5
- Tone: ___ / 5
- Safety: ___ / 5

### Gate

- To pass `npm run eval:check`: every claim must be **verified** in the claims ledger, and every verified source must still contain its anchors.
