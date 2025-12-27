# Develop Phase: Quality Pipeline Implementation

The core implementation of Universal CV's quality assurance system.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              INPUT                                          │
│                         Job Description                                     │
└─────────────────────────────────┬───────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      PRE-GENERATION SCRIPTS                                 │
│                                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │   analyze:jd    │  │ search:evidence │  │  check:coverage │             │
│  │                 │  │                 │  │                 │             │
│  │ Filter noise,   │  │ Query KB,       │  │ Categorize by   │             │
│  │ extract reqs    │  │ score alignment │  │ PM competency   │             │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘             │
│           │                    │                    │                       │
│           └────────────────────┴────────────────────┘                       │
│                                │                                            │
│                       GO/NO-GO GATE                                         │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         KNOWLEDGE BASE                                      │
│                       content/knowledge/                                    │
│                                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │  achievements/  │  │    stories/     │  │   index.yaml    │             │
│  │   15+ entries   │  │   narratives    │  │  relationships  │             │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘             │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       CLAUDE CODE SKILLS                                    │
│                                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │ cv-knowledge-   │  │ cv-content-     │  │ generate-       │             │
│  │ query           │  │ generator       │  │ variant         │             │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘             │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    POST-GENERATION QUALITY GATES                            │
│                                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │  variants:sync  │  │  eval:variant   │  │ redteam:variant │             │
│  │                 │  │                 │  │                 │             │
│  │ YAML → JSON     │  │ Claims ledger   │  │ Adversarial     │             │
│  │ validation      │  │ verification    │  │ threat check    │             │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘             │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           OUTPUT                                            │
│               content/variants/{company}-{role}.yaml                        │
│                                                                             │
│                    edgeoftrust.com/#/{company}/{role}                       │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Scripts Reference

### Pre-Generation (Deterministic)

| Script | Command | Purpose |
|--------|---------|---------|
| `analyze-jd.ts` | `npm run analyze:jd -- --file <jd.txt>` | Filter 47+ generic phrases, extract must-haves, generate search terms |
| `search-evidence.ts` | `npm run search:evidence -- --jd-analysis <analysis.yaml>` | Query knowledge base, calculate alignment score, GO/NO-GO recommendation |
| `check-coverage.ts` | `npm run check:coverage` | Categorize bullets into 7 PM competency bundles |

### 7 PM Competency Bundles

The coverage check categorizes experience bullets into 7 competency areas:

| # | Bundle | Keywords Detected |
|---|--------|-------------------|
| 1 | **Product Design & Development** | shipped, launched, built, designed, UX, user research, prototyped, MVP |
| 2 | **Leadership & Execution** | led, managed, coordinated, E2E, cross-functional, stakeholders, owned, drove |
| 3 | **Strategy & Planning** | strategy, vision, roadmap, prioritized, market analysis, decision, pivot |
| 4 | **Business & Marketing** | revenue, ARR, GTM, partnerships, growth, B2B, pricing, negotiated, monetization |
| 5 | **Project Management** | delivered, timeline, Agile, risk, milestone, sprint, on-time, deadline |
| 6 | **Technical & Analytical** | architecture, API, SDK, data, metrics, trade-offs, system design, integration |
| 7 | **Communication** | presented, documented, collaborated, aligned, storytelling, consensus |

**Source:** `scripts/check-coverage.ts:BUNDLES`

**Usage:**
- Balanced variants should cover 5+ bundles
- Gaps are flagged for review
- Not all variants need all 7 — depends on target role

### Post-Generation (Quality Gates)

| Script | Command | Purpose |
|--------|---------|---------|
| `sync-variants.ts` | `npm run variants:sync` | YAML → JSON conversion with Zod validation |
| `evaluate-variants.ts` | `npm run eval:variant -- --slug <slug>` | Generate claims ledger, verify traceability |
| `redteam.ts` | `npm run redteam:variant -- --slug <slug>` | Adversarial threat check, risk assessment |

---

## Quality Documents

| Document | Purpose | Status |
|----------|---------|--------|
| [evaluation.md](./evaluation.md) | Claims verification methodology | ✅ Complete |
| [red-teaming.md](./red-teaming.md) | Threat model and attack vectors | ✅ Complete |
| [evals/](./evals/) | Claims ledgers per variant | 8 of 12 |
| [redteam/](./redteam/) | Red team reports per variant | 11 of 12 |

---

## Data Schemas

### Achievement (STAR Format)
```yaml
id: string                    # Unique identifier
headline: string              # One-line resume bullet
metric:
  value: string               # The number
  unit: string                # What it measures
  context: string             # Why it matters
situation: string             # STAR: Context
task: string                  # STAR: Responsibility
action: string                # STAR: What you did
result: string                # STAR: Outcome
skills: [string]              # Skills demonstrated
themes: [string]              # Business themes
companies: [string]           # Company context
years: [number]               # Applicable years
```

### Variant
```yaml
slug: string                  # URL-safe identifier
company: string               # Target company
role: string                  # Target role
hero:
  headline: string            # Personalized tagline
  subheadline: string         # Supporting context
about:
  content: string             # Tailored summary
experience:
  - company: string
    role: string
    bullets: [string]         # Role-specific achievements
caseStudies: [string]         # Ranked by relevance
```

---

## Development Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| File-based vs Database | File-based (YAML/MD) | Version controlled, no backend, easy to edit |
| Claude Code vs External API | Claude Code Skills | Integrated workflow, no API costs |
| Achievement Format | STAR | Industry standard, complete context |
| Single Source of Truth | Knowledge Base | Prevents hallucination, ensures consistency |

---

## Current Implementation Status

| Component | Status |
|-----------|--------|
| Knowledge base structure | ✅ Complete |
| Achievement schema | ✅ Complete |
| Pre-generation scripts | ✅ Complete (3 scripts) |
| Post-generation scripts | ✅ Complete (3 scripts) |
| Claude Code skills | ✅ Complete (7 skills) |
| Claims ledger methodology | ✅ Complete |
| Red teaming methodology | ✅ Complete |
| Claims ledgers | 8 of 12 variants |
| Red team reports | 11 of 12 variants |

---

## Files in This Directory

```
develop/
├── README.md                 # This file
├── evaluation.md             # Claims verification rubric
├── red-teaming.md            # Threat model
├── executable-quality-pipeline.md  # Pipeline details
├── evals/                    # Claims ledgers
│   ├── README.md
│   ├── {variant}.claims.yaml
│   └── {variant}.eval.md
└── redteam/                  # Red team reports
    └── {variant}.redteam.md
```
