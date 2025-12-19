---
id: 2
slug: mempools-alerting-platform
title: On-Chain Alerting Platform
company: Mempools (Founder)
year: 2022–23
tags: [Founder, Web3 SaaS, Alerting, Cosmos, Ethereum, SDK]
duration: 6 months
role: Co-founder & Product Lead

hook:
  headline: Co-founded a Web3 SaaS platform delivering sub-second blockchain alerts to 200+ daily active users
  impactMetric:
    value: "200+"
    label: daily active users
  subMetrics:
    - value: "Sub-second"
      label: alert delivery
    - value: "5 chains"
      label: supported networks
  thumbnail: /images/case-study-mempools.png

media:
  - type: twitter
    url: https://x.com/MempoolsAPI/status/1675947427092656147
    label: Archway Launch Thread
  - type: twitter
    url: https://x.com/luganodes/status/1709993888101159023
    label: Luganodes Partnership

cta:
  headline: Building developer infrastructure or Web3 tooling?
  subtext: I've been through the 0→1 founder journey in crypto infrastructure.
  action: calendly
  linkText: Let's talk →
---

Every major blockchain event—liquidations, governance votes, whale movements—was invisible until it was too late. Traders missed opportunities, protocols couldn't react fast enough, and communities struggled with engagement.

## The Challenge

I identified a fundamental gap in the blockchain ecosystem: while blockchains are transparent, staying ahead of critical events required complex custom setups, constant polling, or expensive infrastructure. There was no simple way for developers or users to get real-time notifications about on-chain activity.

**The constraints were real:**
- Had to bootstrap with limited resources (solo founder initially)
- Needed to support multiple chains (Ethereum, Cosmos ecosystem)
- Sub-second latency required—alerts arriving after the fact are worthless
- Developer SDK needed to be simple enough for quick integration

## The Approach

My hypothesis: a scenario-based alerting platform with no-code configuration would democratize access to real-time blockchain monitoring—making it as easy to track whale wallets as it is to set up a Google Alert.

### Alternatives Considered

| Option | Trade-offs | Why Not |
|--------|------------|---------|
| Build for enterprise only | Higher contract values, clearer monetization | Long sales cycles, needed traction fast |
| Developer-only API | Simpler product, focused use case | Missed larger opportunity in no-code market |
| Single chain focus | Faster development, deeper integration | Multi-chain was the clear direction of the ecosystem |

**Chosen path:** Build both no-code consumer platform AND developer SDK, starting with Cosmos ecosystem where competition was thinner.

## Key Decision

**Launching as default alerting provider on Archway mainnet**

Archway (Cosmos SDK L1) was launching their mainnet. I pitched Mempools as their official alerting infrastructure.

We launched Archway-Alerts.com on the same day as their mainnet—becoming the default platform for the ecosystem.

> This partnership gave us instant distribution and credibility. Instead of competing for developers, we became the recommended solution.

## Execution

### Phase 1: Core Platform (8 weeks)
- Built real-time event monitoring infrastructure on Ethereum
- Designed scenario builder allowing AND/OR logic for complex alerts
- Implemented multi-channel delivery: Telegram, Discord, webhooks, email

### Phase 2: SDK Development (4 weeks)
- Published mempools-sdk to NPM for developer integration
- Created documentation and quickstart guides
- Built embeddable UI templates for white-label deployments

### Phase 3: Cosmos Expansion (4 weeks)
- Extended platform to support Archway, Juno, and Canto networks
- Built chain-specific event parsing for Cosmos transaction types
- Launched Archway-Alerts.com as flagship deployment

### Phase 4: Partnerships (Ongoing)
- Secured Luganodes partnership for enhanced node infrastructure
- Onboarded ecosystem projects as early adopters
- Community building through Twitter Spaces and Discord engagement

## Results

- **200+ Daily Active Users** — Organic growth through ecosystem partnerships
- **Sub-second delivery** — Alerts arriving before users could manually check
- **5 chains supported** — Ethereum, Arbitrum, Archway, Juno, Canto
- **Default Archway provider** — Launched alongside mainnet as official alerting platform

The platform enabled use cases that weren't possible before: arbitrage bots reacting to on-chain signals, portfolio trackers with instant notifications, and governance watchers alerting communities to votes.

## What I Learned

**What worked:**
- Ecosystem partnerships over raw marketing—one protocol deal was worth 100 Twitter impressions
- No-code interface dramatically expanded addressable market beyond developers
- Multi-channel delivery (especially Telegram/Discord) was table stakes for Web3 users
- Launching with a chain's mainnet gave instant distribution and credibility

**What didn't:**
- Underestimated infrastructure costs for real-time monitoring at scale
- Initially built too many features—should have shipped MVP faster
- Discord community building was slower ROI than direct partnership outreach
- Cross-chain complexity was higher than anticipated (each chain has different event formats)

> As a first-time founder, the biggest lesson was that distribution beats product. Having Archway recommend us to their ecosystem was more valuable than any feature we could have built.

If I did it again, I'd focus even more aggressively on ecosystem partnerships from day 1. The best products in crypto infrastructure win through distribution, not features.
