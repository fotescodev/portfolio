# Define Phase: Solution Requirements

---

## Solution Overview

**Universal CV** generates personalized portfolio variants from a structured knowledge base.

```
Knowledge Base  →  Claude Skills  →  Portfolio Variants
(Source Truth)     (AI Processing)   (Personalized Output)
```

---

## Requirements

### Must Have
- Store achievements in STAR format
- Generate variants from job descriptions
- Every claim traces to knowledge base (zero hallucination)
- Unique URLs per variant (`/#/company/role`)

### Should Have
- Tag achievements by skill, theme, company
- Rank case studies by relevance to target role
- Consistent tone across generated content

### Nice to Have
- A/B testing framework
- Analytics integration

---

## Success Metrics

| Metric | Baseline | Target |
|--------|----------|--------|
| Application-to-interview rate | ~3% (generic) | 6%+ (variants) |
| Time to tailor application | 30-60 min | <5 min |
| Hallucination rate | N/A | 0% |

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| AI generates inaccurate content | Knowledge base as source of truth |
| Over-optimization for keywords | Focus on relevance, not gaming |
| Embellishment/exaggeration | Strict adherence to verified achievements |

---

## Why AI?

| Alternative | Why AI is Better |
|-------------|------------------|
| Manual tailoring | AI scales personalization instantly |
| Template-based | AI understands role requirements |
| Keyword stuffing | AI maintains narrative coherence |

---

→ Next: [Develop Phase](../develop/README.md)
