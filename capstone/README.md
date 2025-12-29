# Universal CV: AI-Powered Career Content System

**Live Product:** https://edgeoftrust.com

An AI system that generates personalized portfolio variants from a structured knowledge base. Solves the "one resume fits nobody" problem through **personalization without fabrication**.

---

## The Problem

Job seekers face a dilemma:
- Generic resumes get 2-3% response rates
- Custom tailoring takes 30-60 min per application
- Pressure to stand out leads to embellishment
- No single source of truth for career achievements

## The Solution

```
Knowledge Base  →  Claude Skills  →  Portfolio Variants
(Source Truth)     (AI Processing)   (Personalized Output)
```

Every generated claim traces back to verified achievements. No hallucination by design.

---

## Quality Pipeline

The heart of this system is a **quality pipeline** that ensures generated content is accurate, relevant, and defensible.

### Pre-Generation (Deterministic)

Before spending time on variant generation, run deterministic analysis:

```bash
# 1. Analyze job description - filter noise, extract requirements
npm run analyze:jd -- --file source-data/jd-stripe.txt --save

# 2. Search knowledge base - find alignment evidence
npm run search:evidence -- --jd-analysis capstone/develop/jd-analysis/stripe.yaml --save

# 3. Check coverage - categorize bullets by 7 PM competency bundles
npm run check:coverage
```

See [develop/README.md](./develop/README.md#7-pm-competency-bundles) for the full bundle reference (Product Design, Leadership, Strategy, Business, Project Mgmt, Technical, Communication).

**Output:** GO/NO-GO recommendation with alignment score before any AI generation.

### Generation

```bash
# Generate variant using Claude Code skill
npm run generate:variant -- --company "Stripe" --role "Platform PM" --jd "./jd.txt"
```

### Post-Generation (Quality Gates)

```bash
# 4. Evaluate claims - verify every bullet traces to knowledge base
npm run eval:variant -- --slug stripe-platform-pm

# 5. Red team - adversarial checks for risks
npm run redteam:variant -- --slug stripe-platform-pm

# 6. Sync and deploy
npm run variants:sync
```

---

## Key Documents

| Document | Purpose |
|----------|---------|
| [Evaluation Framework](./develop/evaluation.md) | Claims verification rubric |
| [Red Teaming](./develop/red-teaming.md) | Threat model and adversarial checks |
| [Claims Ledgers](./develop/evals/) | Per-variant verification results |
| [Red Team Reports](./develop/redteam/) | Per-variant adversarial scans |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        KNOWLEDGE BASE                           │
│                      content/knowledge/                         │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │  achievements/  │  │    stories/     │  │   index.yaml    │ │
│  │   STAR format   │  │   narratives    │  │  relationships  │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      CLAUDE CODE SKILLS                          │
│  cv-knowledge-query → cv-content-generator → generate-variant   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      QUALITY PIPELINE                            │
│  analyze:jd → search:evidence → eval:variant → redteam:variant  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                       PORTFOLIO VARIANTS                         │
│       edgeoftrust.com/#/stripe/platform-pm (personalized)       │
└─────────────────────────────────────────────────────────────────┘
```

---

## Current Status

| Metric | Count |
|--------|-------|
| Active Variants | 12 |
| Claims Ledgers | 8 |
| Red Team Reports | 11 |
| Knowledge Base Achievements | 15+ |

---

## Why This Demonstrates AI PM Skills

| Skill | How Demonstrated |
|-------|------------------|
| **Data Architecture** | Knowledge graph design for AI consumption |
| **Prompt Engineering** | Claude Code skills that query contextually |
| **Evaluation** | Claims ledger methodology for accuracy |
| **Red Teaming** | Adversarial threat model and checks |
| **Guardrails** | Architecture prevents hallucination |
| **Deployment** | Live product with real users |

---

## Directory Structure

```
capstone/
├── README.md                 # This file
├── discover/                 # Problem validation (complete)
├── define/                   # Solution requirements (complete)
├── develop/                  # Implementation + quality framework
│   ├── evaluation.md         # Claims verification methodology
│   ├── red-teaming.md        # Threat model
│   ├── evals/                # Claims ledgers per variant
│   └── redteam/              # Red team reports per variant
└── deliver/                  # Deployment + results tracking
```

---

## Quick Links

- **Product:** https://edgeoftrust.com
- **Knowledge Base:** [/content/knowledge/](../content/knowledge/)
- **Claude Skills:** [/.claude/skills/](../.claude/skills/)
- **Variant Example:** https://edgeoftrust.com/#/bloomberg/technical-product-manager
