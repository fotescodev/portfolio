# AI Product Management Capstone
## Universal CV: AI-Powered Career Content System

**Author:** Dmitrii Fotesco
**Certification:** AI Product Management
**Framework:** 4D Method (Discover → Define → Develop → Deliver)

---

## Executive Summary

Universal CV is an AI-powered system that generates personalized portfolio variants for job applications without fabricating content. It solves the "one resume fits nobody" problem by dynamically re-ordering and re-emphasizing achievements based on target role requirements.

**Live Product:** https://edgeoftrust.com

**Key Innovation:** Personalization without fabrication—AI queries a structured knowledge base of real achievements, ensuring every generated claim is traceable and defensible.

---

## Project Overview

### The Problem
Job seekers face a dilemma: generic resumes get ignored, but creating custom versions for each application is time-consuming and error-prone. Worse, the pressure to stand out can lead to embellishment.

### The Solution
An AI system that:
1. Stores achievements in a structured knowledge base (STAR format)
2. Generates role-specific portfolio variants via Claude Code skills
3. Produces unique URLs per application (e.g., `/#/stripe/platform-pm`)
4. Ensures every claim traces back to source truth

### Why This Matters for AI PM
This project demonstrates the full AI product lifecycle:
- **Data Architecture:** Knowledge graph design for AI consumption
- **Prompt Engineering:** Skills that query and generate contextually
- **Evaluation:** Measuring content quality and accuracy
- **Red Teaming:** Identifying failure modes before deployment
- **Guardrails:** Preventing hallucination through architecture
- **Deployment:** Live product with real users (recruiters)

---

## 4D Framework Navigation

| Phase | Status | Key Deliverables |
|-------|--------|------------------|
| [Discover](./discover/README.md) | 🟡 In Progress | Problem validation, user research, opportunity sizing |
| [Define](./define/README.md) | 🟡 In Progress | Solution requirements, success metrics, risk assessment |
| [Develop](./develop/README.md) | 🟡 In Progress | Architecture, implementation, evaluation framework |
| [Deliver](./deliver/README.md) | ⚪ Not Started | Deployment, monitoring, iteration |

---

## AI-Specific Documentation

| Document | Purpose |
|----------|---------|
| [Evaluation Framework](./develop/evaluation.md) | How we measure AI output quality |
| [Red Teaming Report](./develop/red-teaming.md) | Failure modes and mitigations |
| [Guardrails Design](./develop/guardrails.md) | Preventing harmful outputs |
| [Human-in-the-Loop](./develop/hitl.md) | Where humans review AI decisions |

---

## Quick Links

- **Product:** https://edgeoftrust.com
- **Variant Example:** https://edgeoftrust.com/#/bloomberg/technical-product-manager
- **Knowledge Base:** [/content/knowledge/](../content/knowledge/)
- **Claude Skills:** [/.claude/skills/](../.claude/skills/)

---

## Project Timeline

```
Week 1-2: Discover
├── Problem validation
├── User interviews (self + recruiters)
└── Competitive analysis

Week 3-4: Define
├── Solution requirements
├── Success metrics
├── Risk assessment
└── Ethical considerations

Week 5-8: Develop
├── Knowledge base architecture
├── Claude skills implementation
├── Evaluation framework
├── Red teaming exercises

Week 9-10: Deliver
├── Production deployment
├── Monitoring setup
├── Initial results
└── Iteration plan
```

---

## Key Metrics

### Product Metrics
- Variant generation time
- Application-to-interview conversion rate (variants vs. base)
- Recruiter engagement (time on page, scroll depth)

### AI Quality Metrics
- Factual accuracy (claims traceable to knowledge base)
- Relevance score (variant matches target role)
- Tone appropriateness (professional, not sycophantic)

### Safety Metrics
- Hallucination rate (invented achievements)
- Metric inflation rate (exaggerated numbers)
- Privacy leak rate (cross-variant contamination)

---

## Certification Requirements Mapping

| Requirement | Where Addressed |
|-------------|-----------------|
| Problem identification | [Discover](./discover/README.md) |
| User research | [Discover: User Research](./discover/user-research.md) |
| AI use case justification | [Define: Why AI](./define/why-ai.md) |
| Technical architecture | [Develop: Architecture](./develop/architecture.md) |
| Evaluation methodology | [Develop: Evaluation](./develop/evaluation.md) |
| Red teaming | [Develop: Red Teaming](./develop/red-teaming.md) |
| Ethical considerations | [Define: Ethics](./define/ethics.md) |
| Deployment plan | [Deliver: Deployment](./deliver/deployment.md) |
| Results & learnings | [Deliver: Results](./deliver/results.md) |
