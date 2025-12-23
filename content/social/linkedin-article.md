# LinkedIn Article

**Title**: I Built a Portfolio That Proves Itself

---

Found myself between roles a few months ago. Sat with the question everyone asks: what's next?

I knew two things. I wanted to stay at the intersection of Web3 and AI. And I needed a better way to present my work. The standard resume wasn't cutting it. LinkedIn felt like shouting into the void.

So I started building. Three months later, I had something unexpected: not just a portfolio, but a system that verifies its own claims.

## The Problem with Portfolios

Every product manager has "drove growth" and "led cross-functional teams" on their resume. Metrics help, but metrics without sources feel hollow. How do you know those numbers are real?

Here's the deeper problem: when you're applying for multiple roles, you need different emphasis. The infrastructure PM pitch isn't the Web3 PM pitch isn't the developer tools PM pitch. Maintaining multiple versions by hand is a nightmare. You either send generic content or burn hours on customization.

AI-generated content seems like the answer—until someone asks where those metrics came from. Most AI portfolios have a trust problem. They sound plausible but might be fabricated.

I wanted something that could generate targeted variants while ensuring every claim was defensible in an interview.

## What I Built

The system has four layers.

**Knowledge Base**: Every achievement lives in structured YAML using STAR format. Each metric traces to a source document. No hallucination possible—the AI can only surface what's already documented.

**Variant Engine**: Takes a job description, matches it against my knowledge base, scores relevance, and generates a customized portfolio. Different stats, different case study ordering, same underlying facts.

**Quality Pipeline**: Every variant runs through evaluation (extracting claims, finding sources, verifying each metric) and red-teaming (scanning for sycophantic language, unverified metrics, confidential leaks). Nothing ships without passing both gates.

**Skills Ecosystem**: Nine Claude Code skills that codify the workflow. The AI doesn't freelance—it follows documented patterns with human approval at each step.

## Three Learnings Worth Sharing

Building this system crystallized insights from years of shipping infrastructure products.

**Distribution beats product.** At my previous startup, we spent months building the best on-chain alerting product. Competitors with worse products still won. The difference? We eventually launched as the default alerting provider for an entire blockchain ecosystem. One partnership delivered more than a hundred marketing campaigns could. The best product doesn't win—the best-distributed product does.

**Customer isn't always user.** At Ankr, we spent eight months chasing individual developers. Made $130K ARR. Then we shifted focus to blockchain protocols as customers instead of developers. Same product, different buyer. Revenue increased 15x in six months. Sometimes the unit economics problem isn't your product—it's who you're optimizing for.

**Trust is the moat.** In institutional crypto, nobody cares about the best APY. They care about auditability, compliance, and defensibility. At Microsoft, we shipped a blockchain royalty system for 2.7 billion Xbox consumers not because it was the fastest—because it was the most defensible. This portfolio applies the same principle: every claim traces to a source. Every stat survives scrutiny.

## The Numbers

What three months of building produced:

- 124 CSS variables defining a complete design system
- 195KB initial bundle (reduced 59% from 480KB)
- 9 job-specific variants in active rotation
- 211 passing tests across 10 test suites
- 8 automated red-team checks per variant
- 100% claim traceability to source documentation

The whole variant generation flow takes about 15 minutes. Most of that is human review, not generation.

## Why This Approach Matters

Most AI-generated content requires you to trust the output. For a portfolio—where your professional reputation is on the line—that's unacceptable.

This system inverts the approach. Start with verified source data. Constrain generation to that data. Evaluate every claim against sources. Red-team for tone and accuracy issues. Require human approval at each gate.

The AI assists with targeting and presentation. The facts come from documented achievements.

## What's Next

The portfolio is live at edgeoftrust.com. Nine variants covering Bloomberg, Coinbase, Galaxy, Meta, Microsoft, and more—each tailored to the role while maintaining factual consistency.

After years building infrastructure at Microsoft (blockchain royalties for Xbox), Ankr (RPC infrastructure serving millions of requests), and Anchorage Digital (institutional crypto custody), I'm exploring what's next.

If you're building in Web3, AI infrastructure, or institutional crypto, I'd love to connect. Reach out directly or explore the portfolio to see the system in action.

---

*The best portfolio isn't one that looks good—it's one where every claim traces to proof.*

---

**Word count**: ~780
**Suggested tags**: Product Management, AI, Web3, Career Development, Portfolio
