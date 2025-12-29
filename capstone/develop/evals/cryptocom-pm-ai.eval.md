# Variant Evaluation

- Variant: `cryptocom-pm-ai`
- Ledger: `capstone/develop/evals/cryptocom-pm-ai.claims.yaml`
- Evaluated At: 2025-12-29T18:59:42.687Z
- Content Hash: `3d82c96c9ed9…`

## Automated Summary

- Claims detected: **8**
- Verified: **8**
- Unverified: **0**

## Claims

| Status | Claim | Location | Top candidate source |
|---|---|---|---|
| ✅ verified | Shipped LLM-powered support handling 1,000+ questions weekly at 98% accuracy | `overrides.hero.subheadline` | `content/experience/index.yaml` |
| ✅ verified | Eight years building for scale—from Microsoft blockchain serving 2.7B consumers to institutional crypto infrastructure. | `overrides.hero.subheadline` | `content/experience/index.yaml` |
| ✅ verified | I recently completed Product Faculty's AI Product Management certification (instructed by Miqdad Jaffer, product lead… | `overrides.about.bio[0]` | `content/experience/index.yaml` |
| ✅ verified | At Anchorage I shipped ETF-grade staking for institutional clients including Galaxy and asset managers with billions … | `overrides.about.bio[1]` | `content/knowledge/achievements/eth-staking-zero-slashing.yaml` |
| ✅ verified | I started at Microsoft building Xbox royalties on Ethereum for 2.7B gaming consumers | `overrides.about.bio[1]` | `content/experience/index.yaml` |
| ✅ verified | 98% | `overrides.about.stats[0].value` | `content/experience/index.yaml` |
| ✅ verified | 8+ | `overrides.about.stats[1].value` | `` |
| ✅ verified | 1M+ | `overrides.about.stats[2].value` | `content/knowledge/achievements/ankr-15x-revenue.yaml` |

## Human Checklist (Capstone Rubric)

Use `capstone/develop/evaluation.md` as the rubric. Fill in scores here as you review:

- Accuracy: ___ / 5
- Relevance: ___ / 5
- Tone: ___ / 5
- Safety: ___ / 5

### Gate

- To pass `npm run eval:check`: every claim must be **verified** in the claims ledger, and every verified source must still contain its anchors.
