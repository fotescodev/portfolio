# Variant Evaluation

- Variant: `anaconda-genai-pm`
- Ledger: `capstone/develop/evals/anaconda-genai-pm.claims.yaml`
- Evaluated At: 2025-12-23T18:14:28.382Z
- Content Hash: `b225406f6adc…`

## Automated Summary

- Claims detected: **7**
- Verified: **6**
- Unverified: **1**

## Claims

| Status | Claim | Location | Top candidate source |
|---|---|---|---|
| ✅ verified | Developer tools PM with 8+ years shipping SDKs, CLIs, and infrastructure that developers actually want to use | `overrides.hero.subheadline` | `content/knowledge/achievements/ankr-15x-revenue.yaml` |
| ✅ verified | From Flow's 60% faster onboarding to Ankr.JS powering 1M+ daily API calls—I build the tools that make complex systems… | `overrides.hero.subheadline` | `content/experience/index.yaml` |
| ✅ verified | At Dapper Labs, I led the Flow CLI and Cadence Playground redesign that cut developer onboarding time by 60%—turning … | `overrides.about.bio[0]` | `content/knowledge/achievements/flow-cli-dx.yaml` |
| ✅ verified | At Ankr, I built the Ankr.JS SDK and Advanced APIs that powered 1M+ daily requests, driving 15× revenue growth by mak… | `overrides.about.bio[0]` | `content/knowledge/achievements/ankr-15x-revenue.yaml` |
| ⚠️ unverified | The opportunity to shape how 50M+ Python developers interact with AI tools is exactly where I want to be. | `overrides.about.bio[1]` | `` |
| ✅ verified | 8+ | `overrides.about.stats[0].value` | `` |
| ✅ verified | 60% | `overrides.about.stats[2].value` | `content/knowledge/achievements/flow-cli-dx.yaml` |

## Human Checklist (Capstone Rubric)

Use `capstone/develop/evaluation.md` as the rubric. Fill in scores here as you review:

- Accuracy: ___ / 5
- Relevance: ___ / 5
- Tone: ___ / 5
- Safety: ___ / 5

### Gate

- To pass `npm run eval:check`: every claim must be **verified** in the claims ledger, and every verified source must still contain its anchors.
