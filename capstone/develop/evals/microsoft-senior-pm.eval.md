# Variant Evaluation

- Variant: `microsoft-senior-pm`
- Ledger: `capstone/develop/evals/microsoft-senior-pm.claims.yaml`
- Evaluated At: 2025-12-23T00:50:12.175Z
- Content Hash: `9353e0e2b5ef…`

## Automated Summary

- Claims detected: **6**
- Verified: **6**
- Unverified: **0**

## Claims

| Status | Claim | Location | Top candidate source |
|---|---|---|---|
| ✅ verified | Senior PM with 8+ years shipping cross-functional products | `overrides.hero.subheadline` | `content/knowledge/achievements/eth-staking-zero-slashing.yaml` |
| ✅ verified | I've shipped 7+ protocol integrations using a RICE evaluation framework I built, coordinating across 4+ teams and red… | `overrides.about.bio[0]` | `content/knowledge/achievements/l2-protocol-integrations.yaml` |
| ✅ verified | Zero disputed payments post-launch | `overrides.about.bio[1]` | `content/knowledge/achievements/eth-staking-zero-slashing.yaml` |
| ✅ verified | 8+ | `overrides.about.stats[0].value` | `` |
| ✅ verified | 7+ | `overrides.about.stats[1].value` | `content/knowledge/achievements/l2-protocol-integrations.yaml` |
| ✅ verified | Zero | `overrides.about.stats[2].value` | `content/knowledge/achievements/eth-staking-zero-slashing.yaml` |

## Human Checklist (Capstone Rubric)

Use `capstone/develop/evaluation.md` as the rubric. Fill in scores here as you review:

- Accuracy: ___ / 5
- Relevance: ___ / 5
- Tone: ___ / 5
- Safety: ___ / 5

### Gate

- To pass `npm run eval:check`: every claim must be **verified** in the claims ledger, and every verified source must still contain its anchors.
