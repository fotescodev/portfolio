# Universal CV: Complete Workflow Overview

Quick reference pointing to the right guide for each phase.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           COMPLETE WORKFLOW                                  │
└─────────────────────────────────────────────────────────────────────────────┘

  PHASE 1              PHASE 2              PHASE 3              PHASE 4
  Gather Data          Build Knowledge      Generate Variants    Quality & Deploy
  ───────────          ───────────────      ─────────────────    ────────────────

  ┌─────────┐          ┌─────────┐          ┌─────────┐          ┌─────────┐
  │LinkedIn │          │ Extract │          │ Create  │          │ Verify  │
  │Reviews  │────────▶ │Achieve- │────────▶ │Tailored │────────▶ │ & Ship  │
  │Notes    │          │ments    │          │Variants │          │         │
  └─────────┘          └─────────┘          └─────────┘          └─────────┘
```

---

## Phase 1: Gather Your Raw Data

**Guide:** [Getting Started Guide - Section 2](../GETTING_STARTED_GUIDE.md#2-the-vault---dump-your-data)

Collect performance reviews, LinkedIn posts, project docs, and any source material with metrics. Drop everything into `source-data/`.

---

## Phase 2: Build Your Knowledge Base

**Guide:** [CV Data Ingestion](./guides/cv-data-ingestion.md)

**Skill:** `/cv-data-ingestion`

Process raw data into structured achievements (STAR format) stored in `content/knowledge/`.

---

## Phase 3: Generate Variants

**Guide:** [Universal CV Guide](./guides/universal-cv.md)

**Skill:** `/generate-variant`

Create job-targeted variants from your knowledge base. Each variant customizes hero, about, and case study ranking for the specific role.

```bash
# Generate a variant
npm run generate:cv -- --company "Stripe" --role "PM" --jd "./jd.txt"

# Preview locally
npm run dev
# Visit http://localhost:5173/stripe/pm
```

---

## Phase 4: Quality Pipeline & Deploy

**Guide:** [Capstone Workflow](./guides/capstone-workflow.md)

Verify claims and run adversarial scans before deploying:

```bash
# Verify claims against evidence
npm run eval:variant -- --slug stripe-pm

# Run adversarial checks
npm run redteam:variant -- --slug stripe-pm

# Deploy
git add content/variants/ && git commit -m "Add Stripe PM variant" && git push
```

Your variant is live at: `https://edgeoftrust.com/stripe/pm`

---

## Quick Reference

| Phase | What | Guide | Skill |
|-------|------|-------|-------|
| 1 | Gather raw data | [Getting Started §2](../GETTING_STARTED_GUIDE.md#2-the-vault---dump-your-data) | — |
| 2 | Build knowledge base | [CV Data Ingestion](./guides/cv-data-ingestion.md) | `/cv-data-ingestion` |
| 3 | Generate variants | [Universal CV](./guides/universal-cv.md) | `/generate-variant` |
| 4 | Quality & deploy | [Capstone Workflow](./guides/capstone-workflow.md) | — |

---

## CLI Dashboard

For an interactive experience, use the CLI dashboard:

**Guide:** [Universal CV CLI](./guides/universal-cv-cli.md)

```bash
npm run ucv-cli
```
