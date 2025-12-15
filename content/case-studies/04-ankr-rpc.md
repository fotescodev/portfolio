---
id: 4
slug: ankr-rpc-infrastructure
title: RPC Infrastructure & APIs
company: Ankr
year: 2021–22
tags: [APIs, Developer Tools, Growth, B2B]
duration: 8 months
role: Product Manager

hook:
  headline: Repositioned RPC product to target protocols as customers—15× revenue growth in 8 months
  impactMetric:
    value: "15×"
    label: revenue growth
  subMetrics:
    - value: "$2M"
      label: ARR in 6 months
    - value: "1M+"
      label: daily requests
  thumbnail: /images/case-study-ankr-rpc.png

demoUrl: https://www.ankr.com/rpc/
githubUrl: https://github.com/ankr-network/ankr.js
docsUrl: https://www.ankr.com/docs/rpc-service/overview/

media:
  - type: blog
    url: https://medium.com/ankr-network
    label: Launch Post
  - type: twitter
    url: https://twitter.com/ankaborrego
    label: Launch Thread
  - type: video
    url: https://youtube.com/watch?v=example
    label: Demo Video
  - type: linkedin
    url: https://linkedin.com/posts/example
    label: Announcement

cta:
  headline: Building developer infrastructure?
  subtext: I've learned a lot about finding PMF in crowded markets.
  action: calendly
  linkText: Let's chat →
---

Without finding product-market fit, the RPC product would be shut down or sold off. Team jobs were on the line.

## The Challenge

Ankr's RPC infrastructure was underutilized and treated as a commodity. Competing on price with Infura and Alchemy in the developer segment was a race to the bottom. The product needed differentiation and a sustainable business model.

**The constraints:**
- Limited engineering resources (5 engineers total)
- Established competitors with strong developer brand (Infura, Alchemy)
- RPC is inherently commoditized—hard to differentiate on features
- Developer segment has high churn and low willingness to pay

## The Approach

My hypothesis: blockchain protocols have different needs than individual developers—they need reliable infrastructure for their entire ecosystems, have longer sales cycles but higher LTV, and would pay premium for partnership-level support.

### Alternatives Considered

| Option | Trade-offs | Why Not |
|--------|------------|---------|
| Double down on developer DX | Large market, existing user base | Couldn't out-Alchemy Alchemy—they had 10x our resources |
| Pivot to enterprise (non-crypto) | Higher contract values | Sales cycle too long for our runway |
| Build specialized APIs | Higher margins, less commoditized | Good complement but not standalone business |

**Chosen path:** Pivot to B2B protocol sales while building Advanced APIs as differentiation. Protocols became our core customer segment; developers became their users.

## Key Decision

**B2B pivot: protocols over developers**

Team was attached to developer-first identity. Pivot felt like abandoning our roots.

Shifted primary customer from developers to protocols. Developers became users we served through protocol partnerships.

> Protocols had 10x LTV of developer accounts. One protocol deal = 100 developer signups in revenue. Unit economics finally worked.

## Execution

### Phase 1: Customer Discovery (4 weeks)
- Interviewed 15+ blockchain protocol teams about infrastructure pain points
- Identified key insight: protocols were stitching together multiple providers
- Mapped competitive landscape and pricing for protocol-tier contracts

### Phase 2: Product Repositioning (3 weeks)
- Redesigned pricing to include protocol-tier with SLA guarantees
- Created partnership program with dedicated support channels
- Built case studies from early protocol conversations

### Phase 3: Advanced APIs Development (8 weeks)
- Designed and shipped Ankr Advanced APIs (NFT, token, query APIs)
- Created Ankr.JS SDK for improved developer experience
- Built usage analytics dashboard for protocol partners

### Phase 4: Go-to-Market (Ongoing)
- Launched outbound sales motion targeting protocol BD teams
- Created content marketing around protocol infrastructure needs
- Built referral program where protocols recommended us to their developers

## Results

- **15× revenue growth** — From ~$130K to $2M ARR in 8 months
- **$2M ARR in 6 months** — Achieved target that seemed impossible at start
- **1M+ daily API requests** — Usage scaled with protocol partnerships

Proved the B2B model worked for infrastructure products. Ankr later raised additional funding citing this traction. Team avoided layoffs that hit other crypto companies.

## What I Learned

**What worked:**
- Customer interviews revealed insight competitors missed—protocols were underserved
- Protocol partnerships created network effects (their developers became our users)
- Advanced APIs gave us differentiation beyond commodity RPC
- SLA guarantees justified premium pricing that developers wouldn't pay

**What didn't:**
- Initially priced protocol tier too low. Left money on the table with first 3 deals
- Ankr.JS SDK was over-engineered. Developers wanted simple examples, not comprehensive abstraction
- Spent too much time on marketing content that didn't convert. Direct outreach was 10x more effective

> In infrastructure, your customer isn't always your user. Finding the right customer segment can transform unit economics overnight.

If I did it again, I'd have started outbound sales 4 weeks earlier. We waited for 'perfect' product when good-enough product with strong sales motion would have accelerated revenue.
