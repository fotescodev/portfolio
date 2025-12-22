---
id: 1
slug: institutional-eth-staking
title: Institutional ETH Staking
company: Anchorage Digital
year: 2024–25
tags: [Staking, Custody, ETF-Grade, Ethereum, Institutional]
duration: 6 months
role: Senior Product Manager

hook:
  headline: Built ETF-grade staking infrastructure for institutional clients managing billions in AUM
  impactMetric:
    value: "Zero"
    label: slashing events
  subMetrics:
    - value: "Galaxy+"
      label: institutional clients
    - value: "<0.1%"
      label: yield gap vs market
  thumbnail: /images/case-study-eth-staking.png

cta:
  headline: Building institutional-grade crypto infrastructure?
  subtext: I'd love to discuss how compliance-first product thinking applies to your challenges.
  action: calendly
  linkText: Let's talk →
---

One slashing event. That's all it takes to torch your reputation with every institutional client in the market. These firms talk to each other—trust travels by word of mouth, and so does distrust.

## The Challenge

ETF providers wanted ETH staking yield. The problem: nothing on the market was built for them. Consumer staking products don't have custody controls. They can't pass audits. They're regulatory landmines.

What institutional clients actually needed:
- Full custody key ownership (no third-party key management)
- SOC 2 and regulatory audit compliance
- Zero slashing tolerance (millions at stake per incident)
- Competitive yield—within 0.1% of market

## The Approach

The bet: build in-house validator infrastructure that satisfies institutional custody requirements while staying competitive on yield. Optimize for "boring and defensible" over "innovative and risky."

### Alternatives Considered

| Option | Trade-offs | Why Not |
|--------|------------|---------|
| Third-party provider (Figment, Blockdaemon) | Faster launch, battle-tested infra | Custody key control was non-negotiable for ETF-grade compliance |
| Single validator client | Simpler operations, unified tooling | Network centralization risk + institutional mandate for resilience |
| Maximum yield optimization | Higher APY, competitive differentiation | Introduced unpredictability that institutional clients explicitly didn't want |

We went with in-house multi-client infrastructure, Web3Signer for air-gapped signing, slashing prevention over yield maximization.

## Key Decision

**In-house validators vs. staking-as-a-service**

Staking providers offered 3-week launch. We needed 6 months. Leadership wanted to ship faster.

We chose in-house anyway. Presented a compliance risk matrix showing third-party key management as an audit blocker for ETF clients.

> Galaxy specifically cited "full key ownership" as why they chose us over competitors using third-party providers. Decision validated.

## Execution

### Phase 1: Discovery & Requirements (6 weeks)
- 12+ calls with Galaxy and prospective clients to nail down non-negotiables
- Mapped compliance requirements with legal, built a "custody compatibility matrix"
- Evaluated 3 staking-as-a-service providers against institutional requirements

### Phase 2: Architecture & Design (4 weeks)
- Multi-client validator architecture: Lighthouse 40%, Prysm 30%, Teku 20%, Nimbus 10%
- Web3Signer integration for air-gapped signing with slashing protection
- Redundant slashing DB—multiple sources of truth

### Phase 3: Build & Integration (8 weeks)
- Coordinated sprints across validator infra and custody integration teams
- Sub-second alert systems for potential slashing scenarios
- "Graceful degradation" logic—miss attestations rather than risk slashing

### Phase 4: Client Onboarding (6 weeks)
- Galaxy as design partner, feedback folded into MVP
- Operational runbooks for every failure scenario
- Every architecture decision documented for audit trail

## Results

- **Zero slashing events** — The only metric that matters for institutional trust
- **Galaxy + institutional clients onboarded** — ETF-adjacent asset managers with billions in AUM
- **Yield within 0.1% of market leaders** — Performance wasn't sacrificed for compliance

Anchorage became a credible institutional staking provider. The compliance framework we built is now used for other staking products.

## What I Learned

**What worked:**
- Compliance involved from day 1, not as a checkbox at the end
- Galaxy as design partner—their feedback caught edge cases we missed
- Documentation built as we went (invaluable for audits)
- "Boring and defensible" over clever optimizations

**What didn't:**
- Underestimated validator client diversity overhead—each client has different APIs, DBs, upgrade cycles
- First slashing prevention design was over-engineered for scenarios that were theoretically possible but practically irrelevant
- Took too long to align legal and compliance on key custody definitions

> The moat in regulated crypto isn't clever engineering—it's the paper trail that proves you did things right when the auditors come knocking.

If I did it again: formal compliance design review before any architecture decisions. We did it informally and it cost us 2-3 weeks of rework. Make it a gate, not a conversation.
