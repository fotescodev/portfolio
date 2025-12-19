---
id: 2
slug: protocol-integration-framework
title: Protocol Integration Framework
company: Anchorage Digital
year: 2024–25
tags: [L2s, Compliance, Infrastructure, Framework]
duration: Ongoing
role: Senior Product Manager

hook:
  headline: Created scalable framework for integrating blockchain protocols into institutional custody
  impactMetric:
    value: "7+"
    label: protocols shipped
  subMetrics:
    - value: "40%"
      label: faster integration
    - value: "3"
      label: parallel launches
  thumbnail: /images/case-study-protocol-integration.png

cta:
  headline: Scaling a platform team?
  subtext: I've learned a lot about building frameworks that actually get adopted.
  action: contact
  linkText: Let's connect →
---

Without a scalable process, we'd either integrate risky protocols too fast (compliance failure) or move too slow and lose institutional clients to competitors with broader chain support.

## The Challenge

Rapid L2 ecosystem growth meant constant requests to support new chains. Each integration required coordination across 4+ internal teams and external protocol teams—with no standardized process. We were leaving revenue on the table while competitors moved faster.

**The constraints:**
- Each protocol has unique security models requiring custom evaluation
- Compliance review bottleneck—single reviewer for all protocols
- Engineering bandwidth split across maintenance and new integrations
- Client pressure to support 'hot' new chains immediately

## The Approach

My hypothesis: a standardized evaluation framework would let us say 'no' confidently to 60% of requests while fast-tracking high-value integrations—turning our bottleneck into a competitive advantage of 'institutional rigor.'

### Alternatives Considered

| Option | Trade-offs | Why Not |
|--------|------------|---------|
| Case-by-case evaluation | Flexible, context-specific | Didn't scale—each integration took 12+ weeks with no predictability |
| Outsource protocol research | Faster assessment, frees resources | Security evaluation couldn't be outsourced—clients needed our stamp of approval |
| Only support top 5 chains | Simplest approach | Client demand was for emerging chains. Top 5 only would lose differentiation |

**Chosen path:** Built RICE-based evaluation framework with parallel workstreams: security, compliance, and engineering running simultaneously rather than sequentially.

## Key Decision

**Build framework vs. hire more people**

Initial instinct was to request additional headcount. Leadership asked for process improvement first.

Built framework that reduced per-integration effort by 40%, making existing team 2x more effective without new hires.

> Framework became template for other product teams. Saved estimated $200K in hiring costs while increasing throughput.

## Execution

### Phase 1: Framework Design (3 weeks)
- Audited previous 5 integrations to identify bottlenecks and common failure modes
- Created RICE scoring criteria: Reach (client demand), Impact (revenue), Confidence (security), Effort (eng complexity)
- Designed parallel evaluation tracks so compliance doesn't block engineering research

### Phase 2: Stakeholder Alignment (2 weeks)
- Presented framework to engineering, compliance, and BD leadership
- Negotiated SLAs: 2-week initial assessment, 6-week full integration
- Created RACI matrix clarifying who owns each evaluation component

### Phase 3: Pilot & Iteration (4 weeks)
- Piloted framework with Base and Arbitrum integrations running in parallel
- Identified gaps: needed better handoff documentation between teams
- Added 'integration playbook' template based on pilot learnings

### Phase 4: Scale & Operationalize (Ongoing)
- Shipped 7+ protocols using framework (Optimism, Base, Arbitrum, Plume, Citrea, BOB, Aztec)
- Trained BD team to do initial RICE scoring before escalating to PM
- Created monthly 'protocol health' review for ongoing risk monitoring

## Results

- **7+ protocols shipped** — Optimism, Base, Arbitrum, Plume, Citrea, BOB, Aztec—mix of established and emerging chains
- **40% faster integration** — From 12+ weeks average to ~7 weeks for standard integrations
- **3 parallel launches** — First time we shipped multiple protocols simultaneously

Framework became company standard. BD team now self-serves on initial evaluation, reducing PM involvement in early stages by 60%.

## What I Learned

**What worked:**
- RICE framework gave us language to say 'no' without it feeling arbitrary
- Parallel workstreams eliminated the 'waiting on compliance' blocker
- Playbook template reduced 'how do we do this again?' overhead
- Monthly health reviews caught one protocol degradation before client impact

**What didn't:**
- Initial framework was too complex—had 15 evaluation criteria. Simplified to 8 after feedback that teams weren't using it
- Didn't involve BD early enough. They felt blindsided by framework that affected their conversations
- Underestimated documentation maintenance burden. Playbooks got stale without dedicated owner

> The best frameworks are ones people actually use. Simplicity beats comprehensiveness. If you need a training session to explain it, it's too complex.

If I did it again, I'd start with BD as co-creators of the framework, not recipients of it. Their buy-in earlier would have accelerated adoption by weeks.
