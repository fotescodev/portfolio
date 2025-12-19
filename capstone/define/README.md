# Define Phase
## Solution Requirements & Success Criteria

---

## Solution Overview

**Universal CV** is an AI-powered career content system that generates personalized portfolio variants from a structured knowledge base.

### Core Components

```
┌─────────────────────────────────────────────────────────────┐
│                      UNIVERSAL CV                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │  Knowledge  │───▶│   Claude    │───▶│  Portfolio  │     │
│  │    Base     │    │   Skills    │    │  Variants   │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
│                                                             │
│  Source of Truth    AI Processing     Personalized Output   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Functional Requirements

### FR1: Knowledge Base Management
| ID | Requirement | Priority |
|----|-------------|----------|
| FR1.1 | Store achievements in STAR format (Situation, Task, Action, Result) | Must Have |
| FR1.2 | Tag achievements by skill, theme, and company | Must Have |
| FR1.3 | Link achievements to case studies and experience entries | Should Have |
| FR1.4 | Support metric extraction and validation | Should Have |
| FR1.5 | Enable relationship queries (e.g., "all API design work") | Should Have |

### FR2: Content Generation
| ID | Requirement | Priority |
|----|-------------|----------|
| FR2.1 | Generate portfolio variants from job descriptions | Must Have |
| FR2.2 | Customize hero, about, and experience sections per variant | Must Have |
| FR2.3 | Score and rank case studies by relevance to target role | Must Have |
| FR2.4 | Maintain consistent tone across generated content | Should Have |
| FR2.5 | Support blog post and case study generation from achievements | Nice to Have |

### FR3: Content Editing
| ID | Requirement | Priority |
|----|-------------|----------|
| FR3.1 | Update achievements and sync to presentation layer | Must Have |
| FR3.2 | Validate consistency between knowledge base and output | Must Have |
| FR3.3 | Track changes for audit trail | Nice to Have |

### FR4: Deployment
| ID | Requirement | Priority |
|----|-------------|----------|
| FR4.1 | Serve variants via unique URLs (/#/company/role) | Must Have |
| FR4.2 | Fast loading (<3s for any variant) | Must Have |
| FR4.3 | Mobile responsive | Must Have |
| FR4.4 | Analytics on variant engagement | Should Have |

---

## Non-Functional Requirements

### NFR1: Accuracy
- **Zero hallucination tolerance:** Every generated claim must trace to knowledge base
- **Metric preservation:** Numbers must exactly match source data
- **Attribution:** Achievements must link to correct company/period

### NFR2: Quality
- **Professional tone:** Output suitable for executive review
- **No sycophancy:** Avoid excessive flattery of target companies
- **Authentic voice:** Should sound like the candidate, not generic AI

### NFR3: Performance
- **Generation time:** <30 seconds for new variant
- **Query time:** <2 seconds for knowledge base lookup
- **Page load:** <3 seconds for portfolio render

### NFR4: Maintainability
- **Schema validation:** All content validated against Zod schemas
- **Version control:** Knowledge base changes tracked in Git
- **Documentation:** Architecture and usage documented

---

## Success Metrics

### Primary Metrics (Outcome-focused)

| Metric | Baseline | Target | Measurement |
|--------|----------|--------|-------------|
| Application-to-interview rate | ~3% (generic) | 6%+ (variants) | Track per application |
| Time to tailor application | 30-60 min | <5 min | Self-reported |
| Variant accuracy | N/A | 100% | Audit sample of variants |

### Secondary Metrics (Process-focused)

| Metric | Target | Measurement |
|--------|--------|-------------|
| Variant generation time | <30 sec | System logs |
| Knowledge base coverage | 90%+ of career achievements | Audit |
| Recruiter engagement | >30 sec time on page | Analytics |

### AI Quality Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Hallucination rate | 0% | Manual audit of generated content |
| Metric accuracy | 100% | Compare to knowledge base source |
| Tone appropriateness | >4/5 rating | Self-evaluation rubric |
| Relevance to target role | >4/5 rating | Self-evaluation rubric |

---

## Risk Assessment

### Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| AI generates inaccurate content | Medium | High | Knowledge base as source of truth, human review |
| Variant URLs break | Low | Medium | Static hosting, no backend dependencies |
| Performance degrades with scale | Low | Low | Static site generation, CDN caching |

### Product Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Variants feel too similar | Medium | Medium | Ensure meaningful personalization per role type |
| Over-optimization for keywords | Medium | High | Focus on relevance, not gaming |
| Recruiter skepticism of AI content | Medium | Medium | Authentic voice, traceable claims |

### Ethical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Embellishment/exaggeration | Medium | High | Strict adherence to knowledge base |
| Unfair advantage over other candidates | Low | Low | Tool helps present truth better, not lie |
| Privacy concerns | Low | Medium | No external data, self-contained system |

→ See [Ethics Documentation](./ethics.md) for full analysis

---

## Why AI? (Justification)

### Why This Problem Needs AI

| Alternative | Limitation | Why AI is Better |
|-------------|------------|------------------|
| Manual tailoring | Time-consuming, inconsistent | AI scales personalization instantly |
| Template-based | Generic, no context awareness | AI understands role requirements |
| Keyword stuffing | Gaming without substance | AI maintains narrative coherence |
| Static portfolio | Same for all viewers | AI enables dynamic personalization |

### Why This AI Approach

| Design Choice | Rationale |
|---------------|-----------|
| Knowledge base as source | Prevents hallucination, ensures accuracy |
| Claude Code skills | Integrated with development workflow |
| STAR format | Structured data enables better generation |
| Human-in-the-loop | Review before publishing any variant |

→ See [Why AI Documentation](./why-ai.md) for full analysis

---

## Constraints & Assumptions

### Constraints
- Single user (me) initially—not building for scale
- Free/low-cost infrastructure (GitHub Pages)
- Must work with existing portfolio codebase
- Privacy: No external APIs storing career data

### Assumptions
- Quality of output depends on quality of knowledge base input
- Recruiters value personalization if it's authentic
- Variant URLs won't be flagged as suspicious
- Interview conversion is partially influenced by application materials

---

## Define → Develop Transition

**Decisions Made:**
- ✅ Knowledge base architecture (YAML + relationships)
- ✅ Three Claude skills (query, generate, edit)
- ✅ Variant URL structure (/#/company/role)
- ✅ Success metrics defined

**Ready for Development:**
- [ ] Implement full knowledge base schema
- [ ] Build evaluation framework
- [ ] Conduct red teaming exercises
- [ ] Create guardrails for content generation

---

## Supporting Documents

- [Why AI](./why-ai.md) - Justification for AI approach
- [Ethics](./ethics.md) - Ethical considerations and mitigations
- [Success Metrics Detail](./metrics.md) - Measurement methodology

---

## Next Steps

→ Proceed to [Develop Phase](../develop/README.md)
