# Discover Phase
## Understanding the Problem Space

---

## Problem Statement

> **Job seekers struggle to tailor applications at scale while maintaining authenticity.**

The current state:
- Average job seeker applies to 100-200 positions
- Custom tailoring takes 30-60 minutes per application
- Generic resumes get 2-3% response rates
- Pressure to stand out leads to embellishment
- No single source of truth for career achievements

---

## User Research

### Primary User: Job Seeker (Me)

**Context:**
- Senior Technical PM with 8+ years experience
- Applying to roles across Web3, AI, and Infrastructure
- Each domain values different aspects of experience
- Need to emphasize different achievements per role

**Pain Points:**
1. Rewriting resume for each application is tedious
2. Easy to forget relevant achievements for specific roles
3. No systematic way to match experience to job requirements
4. Risk of inconsistency across application materials
5. Hard to A/B test different positioning strategies

**Current Workarounds:**
- Multiple resume versions (hard to maintain)
- Generic "master resume" (low conversion)
- Manual copy-paste from notes (error-prone)

### Secondary User: Recruiter/Hiring Manager

**Context:**
- Reviews 100+ applications per role
- Spends 6-10 seconds on initial scan
- Looking for relevant experience signals
- Values specificity over generic claims

**Pain Points:**
1. Most resumes are generic, hard to evaluate fit
2. Candidates often bury relevant experience
3. Inflated claims require verification effort
4. Hard to compare candidates with different backgrounds

**What They Value:**
- Role-relevant experience upfront
- Quantified achievements
- Clear narrative arc
- Authentic voice (not AI-generated slop)

---

## Competitive Analysis

| Solution | Approach | Limitations |
|----------|----------|-------------|
| **Resume builders** (Novoresume, Resume.io) | Templates + AI suggestions | Generic output, no personalization per role |
| **AI writers** (ChatGPT, Jasper) | Generate from scratch | Hallucination risk, no source of truth |
| **ATS optimizers** (Jobscan) | Keyword matching | Gaming the system, not genuine fit |
| **Portfolio sites** (ReadCV, Polywork) | Static showcase | Same content for every viewer |
| **Personal websites** | Custom but static | Time-consuming to update, single version |

**Gap Identified:**
No solution offers **dynamic personalization with verifiable accuracy**. Existing tools either:
- Generate content without source verification (hallucination risk)
- Optimize keywords without improving substance
- Require manual effort for each variant

---

## Opportunity Sizing

### Addressable Problem
- 50M+ active job seekers in US annually
- Average 21 weeks of job search duration
- 75% report application process as frustrating

### Specific Opportunity
For experienced professionals (PM, engineering, design):
- Higher stakes per application
- More complex experience to communicate
- Willing to invest in tools that work

### Personal ROI
If system saves 30 min per tailored application:
- 50 applications × 30 min = 25 hours saved
- If it improves conversion by 2x, reduces search time significantly
- Interview preparation benefits from structured achievement recall

---

## Key Insights

### Insight 1: The Authenticity Paradox
Candidates need to stand out but fear embellishment. AI can help with personalization while a structured knowledge base ensures every claim is defensible.

### Insight 2: Recruiters Want Relevance, Not Volume
The goal isn't to apply more—it's to present the right experience for each role. Dynamic variants solve this without increasing application count.

### Insight 3: Memory is Unreliable
After 5+ years of experience, candidates forget achievements. A structured STAR-format knowledge base serves as both content system AND interview prep.

### Insight 4: One URL, Multiple Contexts
Sending `edgeoftrust.com/#/stripe/platform-pm` signals effort and relevance. The personalized URL itself becomes a differentiator.

---

## Research Artifacts

- [User Research Notes](./user-research.md)
- [Competitive Analysis Details](./competitive-analysis.md)
- [Interview Transcripts](./interviews/) (if applicable)

---

## Discover → Define Transition

**Validated Assumptions:**
- ✅ Tailoring applications improves outcomes
- ✅ Current tools don't solve personalization + accuracy
- ✅ Structured data can prevent hallucination

**Open Questions for Define:**
- What level of personalization is enough vs. over-optimization?
- How do we measure "good" variant quality?
- What are the ethical boundaries of AI-assisted applications?

---

## Next Steps

→ Proceed to [Define Phase](../define/README.md)
