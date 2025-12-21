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

Losing a single institutional client to a slashing event or compliance failure would damage reputation across the entire institutional market—a market where trust spreads by word of mouth.

## The Challenge

ETF providers and asset managers wanted ETH staking yield, but couldn't use existing solutions. Consumer staking products lacked the custody controls, audit trails, and regulatory defensibility that institutional clients require.

**The constraints were steep:**
- Full custody key ownership required (no third-party key management)
- Must pass SOC 2 and regulatory audits
- Zero tolerance for slashing events (millions at stake per incident)
- Competitive yield expectations within 0.1% of market

## The Approach

My hypothesis: we could build in-house validator infrastructure that satisfies institutional custody requirements while maintaining competitive yields—if we optimized for "boring and defensible" over "innovative and risky."

### Alternatives Considered

| Option | Trade-offs | Why Not |
|--------|------------|---------|
| Third-party provider (Figment, Blockdaemon) | Faster launch, battle-tested infra | Custody key control was non-negotiable for ETF-grade compliance |
| Single validator client | Simpler operations, unified tooling | Network centralization risk + institutional mandate for resilience |
| Maximum yield optimization | Higher APY, competitive differentiation | Introduced unpredictability that institutional clients explicitly didn't want |

**Chosen path:** In-house multi-client infrastructure with Web3Signer for air-gapped signing, prioritizing auditability and slashing prevention over yield maximization.

## Key Decision

**In-house validators vs. staking-as-a-service**

Staking providers offered 3-week launch vs our 6-month build. Leadership pressure to ship faster.

We chose in-house despite timeline. Presented compliance risk matrix showing third-party key management as audit blocker for ETF clients.

> Decision validated when Galaxy specifically cited 'full key ownership' as reason they chose us over competitors using third-party providers.

## Execution

### Phase 1: Discovery & Requirements (6 weeks)
- Conducted 12+ calls with Galaxy and prospective institutional clients to understand non-negotiables
- Mapped compliance requirements with legal and created 'custody compatibility matrix'
- Evaluated 3 staking-as-a-service providers against institutional requirements

### Phase 2: Architecture & Design (4 weeks)
- Designed multi-client validator architecture (Lighthouse 40%, Prysm 30%, Teku 20%, Nimbus 10%)
- Specified Web3Signer integration for air-gapped signing with slashing protection
- Created redundant slashing DB architecture with multiple sources of truth

### Phase 3: Build & Integration (8 weeks)
- Coordinated engineering sprints across validator infra and custody integration teams
- Built sub-second alert systems for potential slashing scenarios
- Implemented 'graceful degradation' logic—miss attestations rather than risk slashing

### Phase 4: Client Onboarding (6 weeks)
- Onboarded Galaxy as design partner, incorporating feedback into MVP
- Created operational runbooks for every failure scenario
- Documented every architecture decision for audit trail

## Results

- **Zero slashing events** — Across all validators since launch—the only metric that matters for institutional trust
- **Galaxy + institutional clients onboarded** — Including ETF-adjacent asset managers with billions in AUM
- **Yield within 0.1% of market leaders** — Proved we didn't sacrifice performance for compliance

Established Anchorage as credible institutional staking provider. Created reusable compliance framework now used for other staking products.

## What I Learned

**What worked:**
- Involving compliance from day 1, not as a checkbox at the end
- Using Galaxy as design partner—their feedback caught edge cases we missed
- Building extensive documentation as we went (invaluable for audits)
- Choosing 'boring and defensible' over clever optimizations

**What didn't:**
- Initially underestimated validator client diversity overhead—each client has different APIs, DBs, upgrade cycles
- First slashing prevention design was over-engineered. Built for scenarios that were theoretically possible but practically irrelevant
- Took too long to align legal and compliance on key custody definitions

> In regulated crypto infrastructure, the competitive moat isn't technical innovation—it's trust, auditability, and the paper trail that proves you did things right.

If I did it again, I'd run a 'compliance design review' as a formal gate before any architecture decisions. We did this informally, but making it explicit would have saved 2-3 weeks of rework.
