# Variant Evaluation

- Variant: `anthropic-ai-safety-fellow`
- Ledger: `capstone/develop/evals/anthropic-ai-safety-fellow.claims.yaml`
- Evaluated At: 2025-12-23T12:08:15.045Z
- Content Hash: `033ad43b12f9…`

## Automated Summary

- Claims detected: **5**
- Verified: **0**
- Unverified: **5**

## Claims

| Status | Claim | Location | Top candidate source |
|---|---|---|---|
| ⚠️ unverified | At Anchorage Digital, I built ETF-grade staking infrastructure with zero tolerance for failure—the same adversarial t… | `overrides.about.bio[0]` | `content/knowledge/achievements/eth-staking-zero-slashing.yaml` |
| ⚠️ unverified | I've deployed LLM systems in production at Dapper Labs, achieving 98% accuracy on developer questions. | `overrides.about.bio[0]` | `content/experience/index.yaml` |
| ⚠️ unverified | 8+ | `overrides.about.stats[0].value` | `` |
| ⚠️ unverified | 98% | `overrides.about.stats[1].value` | `content/experience/index.yaml` |
| ⚠️ unverified | Zero | `overrides.about.stats[2].value` | `content/knowledge/achievements/eth-staking-zero-slashing.yaml` |

## Human Checklist (Capstone Rubric)

Use `capstone/develop/evaluation.md` as the rubric. Fill in scores here as you review:

- Accuracy: ___ / 5
- Relevance: ___ / 5
- Tone: ___ / 5
- Safety: ___ / 5

### Gate

- To pass `npm run eval:check`: every claim must be **verified** in the claims ledger, and every verified source must still contain its anchors.
