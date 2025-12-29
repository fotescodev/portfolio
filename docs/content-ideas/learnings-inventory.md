# Portfolio Project: Learnings Inventory

**Created**: 2024-12-22
**Purpose**: Ranked list of learnings from portfolio build, each with a potential blog post angle.

---

## Tier 1: High Impact — Write These First

These are fundamental shifts that apply beyond this project.

| # | Learning | Blog Post Idea | Angle |
|---|----------|----------------|-------|
| 1 | **Claims verification system** | "Why Every Portfolio Metric Needs a Source" | The trust problem in AI-generated content. How claims extraction + source matching creates accountability. |
| 2 | **Writing style as separate skill** | "Your Voice is Your Brand: Codifying Writing Style" | Voice consistency across AI-generated content. Why style should be explicit, not embedded. |
| 3 | **Schema-first content** | "Zod as Content Gatekeeper" | Schema validation as quality infrastructure. Content errors caught at build time, not production. |

**Why Tier 1**: These learnings change how you think about content generation, not just how you implement it.

---

## Tier 2: Medium Impact — Strong Standalone Posts

These are solid technical narratives with clear before/after.

| # | Learning | Blog Post Idea | Angle |
|---|----------|----------------|-------|
| 4 | **Code splitting journey** | "480KB → 195KB: A React Bundle Diet" | The moment bundle size became P0. Lazy routes, vendor chunks, component splitting. 59% reduction. |
| 5 | **Variant generation workflow** | "One Portfolio, N Applications: The Universal CV" | Job-specific positioning without maintaining N separate files. Knowledge base → variant → eval → ship. |
| 6 | **Red teaming your own content** | "Adversarial Testing for Portfolio Integrity" | 8 automated checks. Sycophancy detection, secret scanning, cross-variant contamination. |
| 7 | **YAML → JSON architecture** | "Human-Editable, Machine-Consumable: Content Architecture" | Canonical source in YAML, derived artifacts in JSON. One source of truth, multiple consumers. |

**Why Tier 2**: Technical depth with measurable outcomes. Good for developer audiences.

---

## Tier 3: Niche — Valuable but Specific

These are interesting but may not resonate broadly.

| # | Learning | Blog Post Idea | Angle |
|---|----------|----------------|-------|
| 8 | **CSS variables for theming** | "Why I Chose CSS Variables Over styled-components" | 124 variables, instant theme switching, no JavaScript overhead. Trade-offs vs CSS-in-JS. |
| 9 | **ADHD-aware AI skills** | "Building AI Tools for Brains That Drift" | The `reorient` skill. Diagnosing tooling rabbit holes, perfect setup syndrome, scope creep. Hard truths that help. |
| 10 | **Multi-perspective briefings** | "Sprint Sync: PM, Designer, Architect, Engineer Views" | One project, four lenses. How different perspectives catch different issues. |
| 11 | **Phased execution with gates** | "Stop, Review, Proceed: Why AI Needs Approval Gates" | The pause points in variant generation. Human oversight prevents hallucination. |
| 12 | **Existing connections as leverage** | "Lead With Proof: Finding Hidden Connections" | Galaxy was already an Anchorage client. Mining your own history for positioning gold. |

**Why Tier 3**: Specific techniques that worked for this project. May not generalize.

---

## Case Study Queue

Separate from blog posts—deeper narratives with full project context.

| Priority | Case Study | Scope | Audience |
|----------|------------|-------|----------|
| 1 | **Portfolio Engineering** | Full build: design system, code splitting, variant system, testing | Technical PMs, engineering managers |
| 2 | **Universal CV Pipeline** | YAML→JSON→eval→redteam flow. Claims verification in depth. | AI product folks, content systems builders |
| 3 | **AI-Assisted Job Search** | Meta-story: using Claude Code for career transition | Career transitioners, AI curious |

---

## Content Calendar Suggestion

**Week 1**: Publish enhanced retrospective (already done)
**Week 2**: "Why Every Portfolio Metric Needs a Source" (Tier 1)
**Week 3**: "480KB → 195KB: A React Bundle Diet" (Tier 2)
**Week 4**: Case Study #1 — Portfolio Engineering

---

## Notes

- All blog posts should invoke `dmitrii-writing-style` skill
- Each post should have traceable metrics (link to code, show numbers)
- Case studies are longer form (1500+ words), blog posts are 500-1000 words
- Update this file as posts are published

---

## Published

| Date | Title | Tier | Link |
|------|-------|------|------|
| 2024-12-22 | Building a Portfolio That Proves Itself | Retrospective | `/blog/2024-12-22-portfolio-retrospective` |
