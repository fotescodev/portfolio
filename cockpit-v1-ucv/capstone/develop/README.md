# Develop Phase
## Architecture, Implementation & Evaluation

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SYSTEM ARCHITECTURE                                │
└─────────────────────────────────────────────────────────────────────────────┘

                              ┌─────────────────┐
                              │   User Input    │
                              │  (Job Desc/     │
                              │   Query)        │
                              └────────┬────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            CLAUDE CODE SKILLS                                │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │ cv-knowledge-   │  │ cv-content-     │  │ cv-content-     │             │
│  │ query           │  │ generator       │  │ editor          │             │
│  │                 │  │                 │  │                 │             │
│  │ "What's my      │  │ "Create variant │  │ "Update the     │             │
│  │  crypto exp?"   │  │  for Stripe"    │  │  Ankr numbers"  │             │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘             │
│           │                    │                    │                       │
└───────────┼────────────────────┼────────────────────┼───────────────────────┘
            │                    │                    │
            ▼                    ▼                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         KNOWLEDGE BASE (Source of Truth)                     │
│                            content/knowledge/                                │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                           index.yaml                                  │   │
│  │  Entities: companies, themes, skills                                  │   │
│  │  Relationships: achieved_at, demonstrates, belongs_to                 │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─────────────────────┐              ┌─────────────────────┐              │
│  │    achievements/    │              │      stories/       │              │
│  │  ┌───────────────┐  │              │  ┌───────────────┐  │              │
│  │  │ STAR Format   │  │              │  │ Narrative     │  │              │
│  │  │ • Situation   │  │──────────────│  │ • Hook        │  │              │
│  │  │ • Task        │  │   contains   │  │ • Problem     │  │              │
│  │  │ • Action      │  │              │  │ • Insight     │  │              │
│  │  │ • Result      │  │              │  │ • Outcome     │  │              │
│  │  │ • Metrics     │  │              │  │ • Reflection  │  │              │
│  │  └───────────────┘  │              │  └───────────────┘  │              │
│  └─────────────────────┘              └─────────────────────┘              │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
            │                    │                    │
            ▼                    ▼                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       PRESENTATION LAYER (Output)                            │
│                                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   content/  │  │   content/  │  │   content/  │  │   content/  │        │
│  │case-studies/│  │ experience/ │  │  variants/  │  │    blog/    │        │
│  │    /*.md    │  │ index.yaml  │  │   /*.yaml   │  │    /*.md    │        │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PORTFOLIO WEBSITE                                    │
│                                                                              │
│     edgeoftrust.com/#/              edgeoftrust.com/#/stripe/platform-pm    │
│     (Base Portfolio)                (Personalized Variant)                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Implementation Status

### Completed Components

| Component | Location | Status |
|-----------|----------|--------|
| Knowledge base structure | `content/knowledge/` | ✅ Complete |
| Entity index with relationships | `content/knowledge/index.yaml` | ✅ Complete |
| Achievement schema (STAR format) | `content/knowledge/achievements/_template.yaml` | ✅ Complete |
| Story schema | `content/knowledge/stories/_template.yaml` | ✅ Complete |
| 6 achievements extracted | `content/knowledge/achievements/*.yaml` | ✅ Complete |
| 1 story documented | `content/knowledge/stories/galaxy-compliance-win.yaml` | ✅ Complete |
| cv-knowledge-query skill | `.claude/skills/cv-knowledge-query/` | ✅ Complete |
| cv-content-generator skill | `.claude/skills/cv-content-generator/` | ✅ Complete |
| cv-content-editor skill | `.claude/skills/cv-content-editor/` | ✅ Complete |

### In Progress

| Component | Status | Next Steps |
|-----------|--------|------------|
| More achievement extraction | 🟡 6/15+ | Extract from remaining experience |
| Evaluation framework | 🟡 Designed | Implement rubrics |
| Red teaming exercises | 🟡 Planned | Execute and document |

### Not Started

| Component | Priority |
|-----------|----------|
| Analytics integration | Medium |
| A/B testing framework | Low |
| Automated validation | Medium |

---

## Data Schemas

### Achievement Schema
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
good_for: [string]            # Role fit hints
evidence:
  case_study: string | null   # Link to case study
  testimonial: string | null  # Link to testimonial
  artifacts: [string]         # Supporting evidence
```

### Relationship Types
```yaml
achieved_at:    Achievement → Company     # Where it happened
demonstrates:   Achievement → Skill       # What it proves
belongs_to:     Achievement → Theme       # Business category
contains:       Story → Achievement       # Narrative includes
generated_from: CaseStudy → Story         # Content source
```

---

## AI-Specific Documentation

| Document | Description |
|----------|-------------|
| [Evaluation Framework](./evaluation.md) | Rubrics for measuring AI output quality |
| [Red Teaming Report](./red-teaming.md) | Failure modes, attacks, and mitigations |
| [Guardrails Design](./guardrails.md) | Architectural safeguards |
| [Human-in-the-Loop](./hitl.md) | Where humans review AI decisions |

---

## Development Decisions

### Decision 1: File-based vs. Database
**Choice:** File-based (YAML/Markdown)
**Rationale:**
- Version controlled with Git
- No backend infrastructure needed
- Easy to edit manually
- Works with static site deployment

### Decision 2: Claude Code Skills vs. External API
**Choice:** Claude Code Skills
**Rationale:**
- Integrated with development workflow
- No API costs or rate limits
- Full context awareness
- Iterative development friendly

### Decision 3: STAR Format for Achievements
**Choice:** Structured STAR format
**Rationale:**
- Industry standard for behavioral interviews
- Provides complete context for generation
- Enables consistent quality
- Doubles as interview prep

### Decision 4: Knowledge Base as Single Source of Truth
**Choice:** All facts in knowledge base, presentation derived
**Rationale:**
- Prevents hallucination (can only use what exists)
- Ensures consistency across outputs
- Enables traceability for audits
- Simplifies updates (change once, sync everywhere)

---

## Testing Strategy

### Unit Testing
- Schema validation for all content files
- Relationship integrity in knowledge graph
- Skill prompt parsing

### Integration Testing
- End-to-end variant generation
- Knowledge base query accuracy
- Sync between layers

### Quality Testing
- Manual review of generated content
- Evaluation rubric scoring
- Red teaming exercises

---

## Next Steps

1. Complete evaluation framework implementation
2. Execute red teaming exercises
3. Extract remaining achievements
4. Build automated validation

---

## Supporting Documents

- [Architecture Details](./architecture.md)
- [Evaluation Framework](./evaluation.md)
- [Red Teaming Report](./red-teaming.md)
- [Guardrails Design](./guardrails.md)
- [Human-in-the-Loop](./hitl.md)

---

## Transition to Deliver

**Ready for Delivery When:**
- [ ] Evaluation framework tested
- [ ] Red teaming complete with mitigations
- [ ] 10+ achievements in knowledge base
- [ ] 3+ variants generated and reviewed
- [ ] Documentation complete

→ Proceed to [Deliver Phase](../deliver/README.md)
