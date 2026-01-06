# Variant Evaluation

- Variant: `circle-pm`
- Ledger: `capstone/develop/evals/circle-pm.claims.yaml`
- Evaluated At: 2026-01-06T16:54:32.264Z
- Content Hash: `6c80e8adead0…`

## Automated Summary

- Claims detected: **5**
- Verified: **5**
- Unverified: **0**

## Claims

| Status | Claim | Location | Top candidate source |
|---|---|---|---|
| ✅ verified | Product Manager with 8+ years shipping Web3 developer tools and protocol integrations | `overrides.hero.subheadline` | `content/experience/index.yaml` |
| ✅ verified | Before that, I built Ankr's Advanced API serving 1M+ daily requests and SDK suite with 1,900+ weekly downloads | `overrides.about.bio[1]` | `content/experience/index.yaml` |
| ✅ verified | At Dapper, I improved Flow developer onboarding by 60% | `overrides.about.bio[1]` | `content/knowledge/achievements/flow-cli-dx.yaml` |
| ✅ verified | 8+ | `overrides.about.stats[0].value` | `` |
| ✅ verified | 1M+ | `overrides.about.stats[2].value` | `content/knowledge/achievements/ankr-15x-revenue.yaml` |

## Human Checklist (Capstone Rubric)

Use `capstone/develop/evaluation.md` as the rubric. Fill in scores here as you review:

- Accuracy: ___ / 5
- Relevance: ___ / 5
- Tone: ___ / 5
- Safety: ___ / 5

### Gate

- To pass `npm run eval:check`: every claim must be **verified** in the claims ledger, and every verified source must still contain its anchors.
