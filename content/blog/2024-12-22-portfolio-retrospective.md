---
title: "Building a Universal CV Engine"
date: "2024-12-22"
excerpt: "How a career transition led to building an AI-powered portfolio system—combining Web3 experience, an AI PM certification capstone, and a lot of late nights."
tags: ["Career", "AI", "Portfolio", "Capstone"]
thumbnail: null
---

Found myself between roles. Sat with the question everyone asks: *what's next?*

I knew two things: I wanted to stay at the intersection of Web3 and AI, and I needed a better way to present my work. The standard resume wasn't cutting it. LinkedIn felt like shouting into the void.

So I started building.

## From Resume to Portfolio

First version was just a static page. More resume than portfolio—bullet points, job titles, the usual. It worked, but it didn't *differentiate*.

I needed a brand. Something that captured what I actually do: build trust infrastructure at the edge of new technology. "Edge of Trust" stuck.

The portfolio evolved. Case studies instead of bullet points. Real metrics instead of vague impact claims. A design system that didn't look like every other developer portfolio.

But I wanted more.

## The Capstone Connection

While building the portfolio, I was taking the [AI Product Management Certification](https://maven.com/product-faculty/ai-product-management-certification) from Product Faculty. The course teaches a 4D approach to building AI features: Discover, Define, Develop, Deliver.

The certification requires a capstone project. Most people build something separate. I thought: why not combine them?

What if the portfolio itself was the capstone? What if I built an AI-powered system that could generate targeted portfolio variants for specific job applications?

That's how Universal CV was born.

## What Universal CV Actually Is

The core idea is simple: create targeted portfolio pages that are accurate without embellishment, tailored to specific roles based on my actual experience data and the job description I'm applying for.

The system has three parts:

**1. Knowledge Base**
All my achievements, metrics, and stories stored in structured YAML. Every claim traceable to a source. No hallucination possible because the AI can only surface what's already documented.

**2. Variant Engine**
Takes a job description, matches it against my knowledge base, and generates a customized portfolio variant. Different emphasis for different roles—infrastructure PM vs. developer tools PM vs. Web3 PM.

**3. Quality Pipeline**
This is where it gets interesting. I built an eval and red-teaming harness:

```
Knowledge Base → Variant YAML → Sync → Eval → Red Team → Deploy
```

The eval step extracts every claim and finds candidate sources. The red team step scans for:
- Sycophantic language ("thrilled to apply")
- Unverified metrics
- Cross-variant contamination (mentioning wrong company)
- Confidential information leaks

If a variant doesn't pass the gates, it doesn't ship.

## Why This Matters

Most AI-generated content has a trust problem. It sounds plausible but might be fabricated. For a portfolio—where your professional reputation is on the line—that's unacceptable.

Universal CV inverts the approach. Instead of generating content and hoping it's accurate, it:
1. Starts with verified source data
2. Constrains generation to that data
3. Evaluates every claim against sources
4. Red-teams for tone and accuracy issues

The AI assists with targeting and presentation. The facts come from me.

## What I've Built So Far

- Portfolio site with 4 case studies, 3 blog posts, full design system
- Variant engine supporting 5 targeted variants
- Claims evaluation pipeline with source matching
- Red team scanner with 8+ automated checks
- Interactive CLI dashboard (`npm run ucv-cli`) for managing the whole flow

## What's Next

Still working on the evaluation flow. The harness is built, but I want to run proper experiments:
- How well does variant targeting match JD requirements?
- What's the false negative rate on the red team checks?
- Can I automate more of the claim verification?

Goal is to open-source this once the capstone is complete. Job searching sucks. Maybe this helps someone else.

## The Real Outcome

At the end of this, I'll have:

1. **A professional-grade portfolio** — Not a template, a system
2. **Universal CV engine** — AI-powered variant generation with quality gates
3. **Deep understanding of AI evaluation** — Not just theory, hands-on implementation

Career transitions create space. This one let me build something I wouldn't have built otherwise.

---

*The portfolio is live. The capstone is in progress. If you're building in the AI evaluation space or just want to see the CLI in action, [reach out](https://calendly.com/dmitrii-f).*
