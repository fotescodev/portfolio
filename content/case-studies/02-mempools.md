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

Liquidations, governance votes, whale movements—every major on-chain event was invisible until it was too late. Traders missed opportunities. Protocols couldn't react fast enough. Communities were always behind.

## The Challenge

Blockchains are transparent, but staying ahead of critical events required complex custom setups, constant polling, or expensive infrastructure. No simple way to get real-time notifications about what's happening on-chain.

The constraints:
- Bootstrapping solo with limited resources
- Multiple chains needed (Ethereum, Cosmos ecosystem)
- Sub-second latency or it's worthless—alerts after the fact are just news
- Developer SDK simple enough for quick integration

## The Approach

The bet: a scenario-based alerting platform with no-code configuration. Make tracking whale wallets as easy as setting up a Google Alert.

### Alternatives Considered

| Option | Trade-offs | Why Not |
|--------|------------|---------|
| Build for enterprise only | Higher contract values, clearer monetization | Long sales cycles, needed traction fast |
| Developer-only API | Simpler product, focused use case | Missed larger opportunity in no-code market |
| Single chain focus | Faster development, deeper integration | Multi-chain was the clear direction of the ecosystem |

We built both: no-code consumer platform AND developer SDK. Started with Cosmos where competition was thinner.

## Key Decision

**Launching as default alerting provider on Archway mainnet**

Archway (Cosmos SDK L1) was launching their mainnet. I pitched Mempools as their official alerting infrastructure.

Launched Archway-Alerts.com the same day as their mainnet. Became the default platform for the ecosystem.

> Instead of competing for developers, we became the recommended solution. One partnership gave us instant distribution and credibility.

## Execution

### Phase 1: Core Platform (8 weeks)
- Real-time event monitoring infrastructure on Ethereum
- Scenario builder with AND/OR logic for complex alerts
- Multi-channel delivery: Telegram, Discord, webhooks, email

### Phase 2: SDK Development (4 weeks)
- Published mempools-sdk to NPM
- Documentation and quickstart guides
- Embeddable UI templates for white-label deployments

### Phase 3: Cosmos Expansion (4 weeks)
- Extended to Archway, Juno, and Canto networks
- Chain-specific event parsing for Cosmos transaction types
- Archway-Alerts.com as flagship deployment

### Phase 4: Partnerships (Ongoing)
- Luganodes partnership for enhanced node infrastructure
- Ecosystem projects onboarded as early adopters
- Community building through Twitter Spaces and Discord

## Results

- **200+ Daily Active Users** — Organic growth through ecosystem partnerships
- **Sub-second delivery** — Alerts arriving before users could manually check
- **5 chains supported** — Ethereum, Arbitrum, Archway, Juno, Canto
- **Default Archway provider** — Launched alongside mainnet as official platform

The platform enabled use cases that weren't possible before: arbitrage bots reacting to on-chain signals, portfolio trackers with instant notifications, governance watchers alerting communities to votes.

## What I Learned

**What worked:**
- Ecosystem partnerships over raw marketing—one protocol deal worth 100 Twitter impressions
- No-code interface expanded addressable market beyond developers
- Multi-channel delivery (Telegram/Discord) was table stakes for Web3
- Launching with a chain's mainnet = instant distribution

**What didn't:**
- Underestimated infrastructure costs for real-time monitoring at scale
- Built too many features initially—should have shipped MVP faster
- Discord community building was slower ROI than direct partnership outreach
- Cross-chain complexity higher than anticipated (each chain has different event formats)

> First-time founder lesson: distribution beats product. Having Archway recommend us to their ecosystem was more valuable than any feature we could have built.

If I did it again: even more aggressive on ecosystem partnerships from day 1. In crypto infrastructure, you win through distribution, not features.
