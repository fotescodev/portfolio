---
title: "Building a Portfolio That Proves Itself"
date: "2024-12-22"
excerpt: "The best portfolio isn't one that looks good—it's one where every claim traces to proof. Here's what I learned building a system that verifies itself."
tags: ["Career", "AI", "Portfolio", "Capstone", "Web3"]
thumbnail: null
---

Found myself between roles. Sat with the question everyone asks: *what's next?*

I knew two things: I wanted to stay at the intersection of Web3 and AI, and I needed a better way to present my work. The standard resume wasn't cutting it. LinkedIn felt like shouting into the void.

So I started building. Three months later, I had something unexpected: not just a portfolio, but a system that proves its own claims.

## The Problem

Generic portfolios don't convert. Every product manager has "drove growth" and "led cross-functional teams" on their resume. Metrics help, but metrics without sources feel hollow. How do you know those numbers are real?

And here's the real problem: when you're applying for multiple roles, you need different emphasis. The infrastructure PM variant isn't the Web3 PM variant isn't the developer tools PM variant. Maintaining multiple versions by hand is a nightmare.

I wanted something that could generate targeted variants while ensuring every claim was defensible.

## What I Built

The system has four layers:

**Knowledge Base**: Every achievement lives in structured YAML, using STAR format (Situation, Task, Action, Result). Each metric traces to a source. No hallucination possible—the AI can only surface what's already documented.

**Variant Engine**: Takes a job description, matches it against my knowledge base, scores relevance, and generates a customized portfolio. Different stats, different case study ordering, same underlying facts.

**Quality Pipeline**: This is where it gets interesting. Every variant runs through:
- **Eval**: Extracts claims, finds candidate sources, verifies each metric
- **Red Team**: Scans for sycophantic language, unverified metrics, cross-variant contamination, confidential leaks

**Skills Ecosystem**: Nine Claude Code skills that codify the workflow. The AI doesn't freelance—it follows documented patterns with human approval gates.

## The Numbers

What three months of building produced:

| Metric | Value |
|--------|-------|
| CSS Variables | 124 (full design system) |
| Initial Bundle | 195KB gzip (59% reduction from 480KB) |
| Claude Code Skills | 9 (knowledge → content → variants) |
| Job-Specific Variants | 9 active |
| Claims Per Variant | ~6 (100% traceable) |
| Red Team Checks | 8 automated gates |
| Tests | 211 passing |

## What I Learned

### Tier 1: Fundamental Shifts

**Schema is law.** Zod validates everything. A typo in a YAML field doesn't silently fail—it blocks the build. Content quality compounds when you enforce it at the source.

**Voice is brand.** I created a separate skill just for writing style. Not embedded in generators—explicit and mandatory. Same facts rendered in consistent voice across every variant, email, and document.

**Verification beats trust.** Every metric in a variant traces to a knowledge base file. If the source changes, the variant fails eval. You can't accidentally ship unverified claims.

### Tier 2: Architectural Decisions

**YAML for humans, JSON for machines.** Variants live in YAML (human-reviewable), sync to JSON (runtime artifact). One canonical source, derived outputs. No drift.

**Code splitting saved 59%.** The bundle hit 480KB and I stopped everything to fix it. Lazy-loaded routes, vendor chunking, component-level splitting. Target was under 200KB—hit 195KB.

**CSS variables over CSS-in-JS.** Theme switching is instant—no React re-render needed. 124 variables covering color, spacing, layout, effects. Dark and light mode parity without JavaScript overhead.

### Tier 3: Process Insights

**Pause between phases.** The variant skill has explicit approval gates: show content → user approves → run eval → user reviews → red team → user approves → ship. No autonomous hallucination.

**Existing connections are gold.** When generating the Galaxy variant, I discovered they were already an Anchorage client (from ETH staking work). Lead with what you've already proven.

**Stats should be punchy.** "8+" beats "approximately eight." "Zero" beats "no instances of." "40%" beats "significant improvement." Every stat verifiable, every stat memorable.

### Tier 4: Meta Learnings

**ADHD patterns are predictable.** I built a skill that diagnoses drift: tooling rabbit holes, perfect setup syndrome, research loops, scope creep. The system catches me when I'm avoiding the real work.

**Multi-perspective briefings work.** Sprint sync outputs from four angles: PM (priorities), Designer (system health), Architect (dependencies), Engineer (recent changes). Different lenses, same project.

**The last 8% is applying.** The portfolio is 92% done. The remaining 8% isn't code—it's hitting submit on applications. Portfolio perfection is a form of procrastination.

## The Pipeline in Practice

Here's what generating a variant actually looks like:

```bash
# Phase 1: Job analysis
# Extract requirements, generate slug, check for existing variants

# Phase 2: Knowledge base query
npm run cv-knowledge-query -- --theme "institutional-crypto"

# Phase 3: Content generation (with writing style skill)
# Generate hero, about, stats—all from verified sources

# Phase 4: Sync and validate
npm run variants:sync -- --slug microsoft-senior-pm

# Phase 5: Evaluate claims
npm run eval:variant -- --slug microsoft-senior-pm
# Output: 6/6 claims verified

# Phase 6: Red team
npm run redteam:variant -- --slug microsoft-senior-pm
# Output: 0 FAIL, 0 WARN

# Phase 7: Visual review
open "http://localhost:5173/microsoft/senior-pm"
```

The whole flow takes about 15 minutes. Most of that is human review, not generation.

## Why This Matters

Most AI-generated content has a trust problem. It sounds plausible but might be fabricated. For a portfolio—where your professional reputation is on the line—that's unacceptable.

This system inverts the approach:
1. Start with verified source data
2. Constrain generation to that data
3. Evaluate every claim against sources
4. Red-team for tone and accuracy issues
5. Require human approval at each gate

The AI assists with targeting and presentation. The facts come from documented achievements.

## What's Next

The portfolio is live. The capstone is submitted. But the work continues:

- **More variants**: Galaxy, Microsoft, Coinbase, Gensyn all in active rotation
- **Case studies**: Documenting the portfolio build itself, the Universal CV pipeline, the AI-assisted job search
- **Open source**: Planning to release the variant generation system once it's battle-tested

## The Real Lesson

Career transitions create space. This one let me build something I wouldn't have built otherwise—a portfolio that doesn't just show my work, but demonstrates the rigor I bring to shipping.

Every claim traceable. Every variant verified. Every stat defensible in an interview.

That's the portfolio I wanted. That's the portfolio I built.

---

*The capstone is complete. If you're building in the AI evaluation space or thinking about similar problems, I'd love to hear from you.*
