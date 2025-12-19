# Evaluation Framework
## Measuring AI Output Quality

---

## Overview

This framework defines how we evaluate the quality, accuracy, and safety of AI-generated content in Universal CV. Every generated variant must pass these evaluations before deployment.

---

## Evaluation Dimensions

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         EVALUATION DIMENSIONS                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │  ACCURACY   │  │  RELEVANCE  │  │    TONE     │  │   SAFETY    │        │
│  │             │  │             │  │             │  │             │        │
│  │ Is it true? │  │ Does it fit │  │ Does it     │  │ Is it       │        │
│  │             │  │ the role?   │  │ sound right?│  │ ethical?    │        │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Dimension 1: Factual Accuracy

**Definition:** Every claim in generated content must trace to the knowledge base.

### Rubric

| Score | Criteria | Example |
|-------|----------|---------|
| 5 | All claims exactly match knowledge base | "15× revenue growth" matches achievement file |
| 4 | Minor paraphrasing, facts preserved | "Grew revenue 15-fold" (acceptable rephrase) |
| 3 | Some facts compressed or simplified | "Significant revenue growth" (lost specificity) |
| 2 | Metrics rounded or approximate | "Nearly 20× growth" (inflation) |
| 1 | Claims not in knowledge base | Invented achievement |
| 0 | Contradicts knowledge base | Wrong company, wrong metric |

### Evaluation Method

```yaml
accuracy_check:
  process:
    1. Extract all claims from generated content
    2. For each claim, find source in knowledge base
    3. Compare verbatim and semantic accuracy
    4. Flag any untraced claims

  passing_criteria:
    - Score >= 4 on all claims
    - Zero untraced claims
    - Metrics exact match
```

### Automated Checks (Future)
- [ ] Metric extraction and comparison
- [ ] Company/year validation
- [ ] Skill claim verification

---

## Dimension 2: Role Relevance

**Definition:** Generated content emphasizes achievements relevant to the target role.

### Rubric

| Score | Criteria | Example |
|-------|----------|---------|
| 5 | Perfectly tailored, obvious fit | Platform PM variant highlights infrastructure work |
| 4 | Clearly relevant, minor gaps | Most content relevant, some generic sections |
| 3 | Partially relevant | Mix of relevant and irrelevant achievements |
| 2 | Mostly generic | Same as base with minor tweaks |
| 1 | Wrong emphasis | Highlights irrelevant experience |
| 0 | Completely misaligned | Crypto variant for non-crypto role |

### Evaluation Method

```yaml
relevance_check:
  process:
    1. Extract key requirements from target job description
    2. Map requirements to knowledge base themes/skills
    3. Check if variant emphasizes matching achievements
    4. Verify case study ranking reflects relevance

  passing_criteria:
    - Score >= 4
    - Top 3 case studies match role requirements
    - Hero/about customized for role
```

### Scoring Template

```yaml
variant: stripe-platform-pm
target_requirements:
  - API infrastructure
  - Revenue/growth metrics
  - B2B platform experience
  - Scale/performance

relevance_scores:
  hero_section: 4/5        # Mentions platform, APIs
  about_section: 5/5       # Emphasizes infrastructure background
  case_study_ranking:
    - ankr-rpc: relevant   # APIs, growth ✓
    - protocol-integration: relevant  # Platform scale ✓
    - eth-staking: partial # Infra yes, crypto specific
  overall: 4.3/5
```

---

## Dimension 3: Tone & Voice

**Definition:** Content sounds professional, authentic, and appropriate for context.

### Rubric

| Score | Criteria | Example |
|-------|----------|---------|
| 5 | Authentic voice, professional, confident | Natural, sounds like the candidate |
| 4 | Professional, slightly generic | Good but could be anyone |
| 3 | Acceptable but bland | Reads like template |
| 2 | Awkward or overly formal | Stilted language |
| 1 | Sycophantic or desperate | "I would be honored to..." |
| 0 | Inappropriate or unprofessional | Casual, errors, wrong register |

### Anti-Patterns to Check

| Anti-Pattern | Example | Why It's Bad |
|--------------|---------|--------------|
| Sycophancy | "Your amazing company..." | Inauthentic, obvious |
| Keyword stuffing | "Agile Scrum Kubernetes cloud native..." | Gaming, not substance |
| Over-humility | "I was lucky to..." | Undermines achievements |
| Grandiosity | "Revolutionary transformation..." | Inflated, unbelievable |
| Generic praise | "Industry-leading organization..." | Empty, meaningless |

### Evaluation Method

```yaml
tone_check:
  process:
    1. Read generated content aloud
    2. Check against anti-pattern list
    3. Verify consistent voice throughout
    4. Compare to base portfolio voice

  passing_criteria:
    - Score >= 4
    - Zero sycophancy detected
    - No keyword stuffing
    - Voice consistent with base
```

---

## Dimension 4: Safety & Ethics

**Definition:** Content is honest, ethical, and wouldn't cause harm if discovered.

### Rubric

| Score | Criteria | Example |
|-------|----------|---------|
| 5 | Completely defensible | Every claim can be explained in interview |
| 4 | Defensible with context | Minor phrasing that needs explanation |
| 3 | Borderline | Some claims stretch the truth |
| 2 | Questionable | Would be embarrassing if challenged |
| 1 | Deceptive | Intentionally misleading |
| 0 | Fraudulent | Fabricated credentials/achievements |

### Safety Checks

| Check | Pass Criteria |
|-------|---------------|
| Hallucination | No invented achievements |
| Metric inflation | Numbers exactly match source |
| Title accuracy | Roles match actual positions held |
| Timeline accuracy | Dates/periods correct |
| Attribution | Work attributed to correct company |
| Privacy | No confidential information exposed |

### The "Interview Test"

> Would you be comfortable if the interviewer asked you to elaborate on any claim?

```yaml
safety_check:
  process:
    1. For each major claim, ask "Can I defend this?"
    2. Check if metrics are exact or rounded up
    3. Verify no confidential information leaked
    4. Ensure no claims about future intentions

  passing_criteria:
    - Score >= 5 (no tolerance for safety issues)
    - All claims pass interview test
    - Zero confidential information
```

---

## Evaluation Process

### Per-Variant Evaluation

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      VARIANT EVALUATION WORKFLOW                             │
└─────────────────────────────────────────────────────────────────────────────┘

   Generate          Review            Score            Decide
   Variant           Content           Dimensions       Publish
      │                 │                  │                │
      ▼                 ▼                  ▼                ▼
  ┌───────┐        ┌───────┐         ┌───────┐        ┌───────┐
  │Claude │───────▶│ Human │────────▶│Rubric │───────▶│ Pass? │
  │ Skill │        │Review │         │Scores │        │       │
  └───────┘        └───────┘         └───────┘        └───┬───┘
                                                          │
                              ┌────────────────┬──────────┴──────────┐
                              ▼                ▼                     ▼
                         ┌───────┐        ┌───────┐            ┌───────┐
                         │Publish│        │Revise │            │Reject │
                         │       │        │       │            │       │
                         └───────┘        └───────┘            └───────┘
```

### Evaluation Scorecard Template

```yaml
variant_evaluation:
  variant_id: stripe-platform-pm
  generated_at: 2025-01-15
  evaluator: Dmitrii Fotesco

  scores:
    accuracy: 5
    relevance: 4
    tone: 4
    safety: 5

  overall_score: 4.5

  passing: true  # All dimensions >= 4, safety = 5

  notes:
    - Hero section well-tailored to platform focus
    - Consider adding more API-specific metrics
    - Tone is professional, authentic voice preserved

  claims_reviewed:
    - claim: "15× revenue growth at Ankr"
      source: achievements/ankr-15x-revenue.yaml
      verified: true
    - claim: "7+ protocol integrations"
      source: achievements/l2-protocol-integrations.yaml
      verified: true
```

---

## Aggregate Metrics

### Quality Dashboard (Future)

| Metric | Target | Current |
|--------|--------|---------|
| Average accuracy score | ≥4.5 | TBD |
| Average relevance score | ≥4.0 | TBD |
| Average tone score | ≥4.0 | TBD |
| Safety pass rate | 100% | TBD |
| Variants passing all criteria | ≥90% | TBD |

### Tracking Over Time

```
Accuracy Score by Variant
─────────────────────────
bloomberg-tpm     ████████░░ 4.5
stripe-platform   █████████░ 4.8
gensyn-tpm        ████████░░ 4.3
```

---

## Continuous Improvement

### Feedback Loop

1. **Generate** variant with Claude skill
2. **Evaluate** using this framework
3. **Document** issues found
4. **Improve** skill prompts or knowledge base
5. **Re-evaluate** to verify improvement

### Common Issues → Fixes

| Issue | Root Cause | Fix |
|-------|------------|-----|
| Generic content | Weak role requirements input | Better JD parsing in skill |
| Wrong metrics | Knowledge base outdated | Update source of truth |
| Stilted tone | Over-constrained prompt | Loosen tone guidance |
| Missing relevance | Poor achievement tagging | Improve tags in knowledge base |

---

## Next Steps

- [ ] Evaluate 3 existing variants using this framework
- [ ] Document scores and issues
- [ ] Iterate on skill prompts based on findings
- [ ] Build automated accuracy checking (future)
