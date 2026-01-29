# Alchemy Node Services: User Feedback & Friction Research

**Research Date:** 2026-01-29
**Purpose:** Understand real user pain points for PM interview preparation

---

## Executive Summary

Alchemy is the dominant player in the Web3 RPC/node provider space with a $10B+ valuation, powering approximately 90% of Web3 infrastructure alongside Infura. User feedback reveals generally positive sentiment around developer tooling and reliability, but significant concerns around **pricing complexity**, **rate limits**, and **centralization risks**.

---

## 1. User Reviews & Sentiment

### Overall Ratings

- **G2**: Mid-4 rating range with limited review counts
- **QuickNode comparison**: QuickNode has 4.5/5 across 70+ reviews vs. Alchemy's smaller review count
- **ProductHunt**: Generally positive - described as "The best RPC Node provider in web3"

### Positive Sentiment

**What Users Love:**

> "It's super simple to set up an account and build code from their documentation and have basic functionality working quickly." - G2 Review

> "The crypto space can move VERY quickly and Alchemy saves significant time, especially when porting a script or code between supported chains."

> "Integration is seamless, everything you hope for just works as expected."

> "Better free tier + dashboard makes debugging way easier." - Developer comparing to competitors

> "The main reason we switched to Alchemy was the flawless nonce management on Alchemy's side." - G2 Review

> "Never had a problem with it personally, and they have a ton of developer tools like Bundler and Paymaster APIs, NFT APIs, simulation tools." - ProductHunt

**Most Praised Features:**
- Free archive data access (even on free tier)
- Developer dashboard and debugging tools
- 99.99% uptime claims
- 24/7 Discord support
- Comprehensive documentation and Alchemy University

### Negative Sentiment

**Critical Reviews:**

> "Alchemy wasted hundreds of man hours of our employees." - G2 Review

> "Less limits on transactions quickly fills up daily quota. Good for testing but too costly for production use." - G2 Review

> "Spent 2hrs debugging 'transaction underpriced' before realizing my RPC was rate-limited. Never again." - Developer experience

> Users report wanting "faster response time from the support team"

> "Had a hard time the first time looking for my API key" - UX complaint

---

## 2. Most Common Friction Points

### A. Pricing Confusion / Compute Unit Complexity (THE #1 ISSUE)

**The Core Problem:**

Alchemy's compute unit (CU) model is the #1 source of developer friction.

> "Some methods have highly variable intensity (e.g. eth_call), so the number of compute units they consume can vary by as much as 100x. This makes things like optimizing usage or predicting monthly cost more confusing than they should be." - [Alchemy Usage Blog](https://www.alchemy.com/blog/alchemy-usage)

> "Compute unit pricing from providers like Alchemy charges different multipliers for different RPC methods. eth_call might cost 1 CU, but debug_traceTransaction costs 10+ CU. This creates unpredictable costs for development and production." - [Dwellir Blog](https://www.dwellir.com/blog/mev-arbitrage-bot-infrastructure)

**Competitor Marketing Against This:**

- **Chainstack:** "Every RPC call is simply a request, making monthly bills much more predictable."
- **Dwellir:** "Alchemy wants to lock you into their confusing compute unit system."
- **Chainnodes:** "Up to 250x price difference compared to Alchemy" at scale

**Cost Escalation Examples:**
- Heavy users can hit "$250,000 per month" on enterprise plans for archival/trace workloads
- Overage pricing can reach "nearly 10x the price of the base plan"

### B. Rate Limits / Throughput

**Key Complaints:**

> "Alchemy's rate limit is very low even on the Enterprise plan. Users would probably need to contact their Enterprise support team to increase throughput to suit 10k+ users." - [Chainnodes Analysis](https://www.chainnodes.org/blog/alchemy-vs-infura-vs-quicknode-vs-chainnodes-ethereum-rpc-provider-pricing-comparison/)

> "The Alchemy endpoint only allows 10 calls per second on the free tier. Upgrading to the next tier allows 15, still not enough." - [Internet Computer Forum](https://forum.dfinity.org/t/issues-using-a-custom-evm-rpc-provider/30746)

> "429 Too many requests" - Common GitHub issue topic

**Rate Limit Tiers:**
- Free tier: 25 RPS
- Paid plans: Up to 300 RPS
- Enterprise: Custom, requires negotiation

### C. Latency (For Performance-Critical Use Cases)

**Benchmark Findings:**

| Provider | Global Avg | US Latency |
|----------|------------|------------|
| QuickNode | 86-217ms | 45ms |
| Alchemy | 170-485ms | 115ms |
| Infura | 485-541ms | 133ms |

> "Paid service received its data approx. 0.3 seconds slower than my local node on average." - MEV developer study

**MEV/Trading Impact:**

> "Using a node service instead of your own node connection will on average cost you 0.25~0.3 seconds of lag time — which is pretty critical if you are aiming to be fast."

> "400ms of node latency was costing [one trading operation] 40% of potential arbitrage captures"

### D. Support Response Time

- Users request "faster response time from the support team"
- 24/7 engineering access only available on Enterprise plans
- Free/PAYG users rely on Discord support

---

## 3. Comparison Complaints (vs Competitors)

### Alchemy vs QuickNode

**Why People Switch TO QuickNode:**
- "QuickNode supports the most blockchains out of any RPC provider out there" - G2
- Faster automated provisioning (G2 score: 9.1 vs Alchemy's 7.8)
- Lower latency in benchmarks (2x-2.5x faster in some tests)
- Better security/privacy ratings (8.5 vs 8.0)

**Why People Stay with Alchemy:**
- Ease of use score: 9.7 vs QuickNode's 8.9
- Better developer tools, analytics, debugging
- More comprehensive free tier

### Alchemy vs Infura

**Why People Prefer Alchemy Over Infura:**
- Better historical uptime (100% vs 99.91-99.98% in 2022 comparison)
- 24/7 support vs no 24/7 support
- Important notifications/alerts
- "Better free tier + dashboard makes debugging way easier"

**Why Some Stay with Infura:**
- Longer track record (since 2016)
- Deep MetaMask integration (same parent company: ConsenSys)
- Ethereum/IPFS focus

### Alchemy vs Chainstack

**Chainstack Advantages:**
- "60% savings guaranteed" - Chainstack marketing
- 1:1 Request Unit model (no method weighting)
- "No surprise overage bills"
- 70+ chains vs Alchemy's 50+

### Alchemy vs Ankr

**Ankr's Pitch:**
- "Node hosting prices that are three times more affordable than Alchemy"
- Decentralized model with independent data centers
- 75+ blockchain coverage

**Alchemy's Counter:**
- Better data consistency: "0 incorrect pieces of data served by Alchemy vs 11 incorrect by Ankr" in benchmarks
- 99.9% uptime vs 72% reliability with standard Ankr nodes

### Alchemy vs Helius (Solana)

**Why Developers Switch to Helius for Solana:**

> "The moment we switched our RPCs to Helius and started sending transactions through staked connections, all of our problems disappeared."

- Solana-native optimization
- Staked validator priority for faster transaction landing
- ~140ms latency vs ~170ms for Alchemy Solana

---

## 4. Pain Points by Use Case

### Indie Developers

| Friction | Positive |
|----------|----------|
| Free tier fills up fast for production use | Generous free tier (300M CU/month, ~12M requests) |
| "Good for testing but too costly for production use" | Free archive data access |
| CU model hard to predict costs before building | Alchemy University for learning |

### Enterprise Users

| Friction | Positive |
|----------|----------|
| Enterprise pricing requires negotiation ("Contact sales" model) | 24/7 engineering access |
| SLAs only guaranteed on Enterprise plans | Dedicated support team |
| Need to negotiate rate limit increases for 10k+ users | Committed SLAs |
| Costs can hit $250k/month for heavy archival workloads | Potential to negotiate down to $2-3 per million CUs |

### Different Chains

**Ethereum:**
- Most mature offering
- Best-in-class tooling
- 99.99% uptime claims

**Solana:**
- "Not as advanced in feature depth as Helius"
- ~170ms average latency (slower than Helius's 140ms)
- Improved with DexterLabs acquisition for archival data
- Less specialized than Solana-native providers

**L2s (Arbitrum, Optimism, Base):**
- Full support but vulnerable during infrastructure outages
- October 2025 AWS outage caused "front-end darkouts" across L2s
- "Throughput-related errors, sometimes exceeding 20%" during high load

### DeFi Applications

- Latency matters for trading
- "Successful MEV extraction requires spotting opportunities within 200ms"
- Shared RPC environments may have "noisy-neighbor issues"

### NFT Applications

**Positives:**
- Robust NFT API with broad coverage
- "Retrieve all NFTs with a single request"

**Issues:**
- NFT metadata errors common due to off-chain storage issues
- Token URI/tokenURI problems when smart contracts don't return properly

### Trading Bots / MEV

**Critical Issues:**
- "A 50ms delay can mean the difference between a profitable backrun and a missed opportunity"
- Alchemy not recommended for serious MEV operations
- Dedicated/bare-metal nodes preferred over shared RPC

### Gaming

- Support for gaming-focused chains (Ronin, Arbitrum Nova)
- Sub-cent gas fees on specialized chains
- May require dedicated throughput for high-traffic games

---

## 5. Recent Issues & Outages (2024-2025)

### October 2025 AWS Outage (Major)

**Impact:**
- AWS US-East-1 suffered a 16-hour outage
- "RPC and API endpoints—often run by AWS-hosted infrastructure like Infura and Alchemy—failed downstream"
- "Decentralization theater" exposed - L2 sequencers and RPC providers failed
- MetaMask showed "zero-balance illusions"
- Ethereum mainnet saw "RPC latency spikes up to 10x"
- Base throughput fell 8%
- L2 transaction propagation delays increased by 380ms

### Specific Chain Incidents

**2024:**
- **June 27, 2024:** "Elevated latencies and error for Polygon Matic Mainnet"
- **March 10, 2024:** "Alchemy Dashboard experiencing gateway timeouts"

**2025-2026:**
- **January 5, 2026:** Starknet Mainnet issues (chain-wide, not Alchemy-specific)
- **January 2, 2026:** CrossFi stall investigation
- StatusGator recorded warnings spanning 8+ hours to 24 hours in early January 2026

### Historical Context

- **565+ outages tracked since August 2023** (StatusGator)
- **412 incidents since October 2022** (IsDown)
- Note: Many incidents are partial/specific to certain chains, not full outages

---

## 6. Centralization Concerns

### The Fundamental Risk

> "Infura and Alchemy are centralized services that control the data flow between your dapp and the Ethereum network. This means that a single point of failure exists in your dapp's architecture." - [DEV Community](https://dev.to/zenodavids/the-case-against-infura-and-alchemy-the-hidden-dangers-of-centralized-third-party-services-42f6)

### Key Risks Identified:

1. **Data Security:** Private keys and contract addresses transmitted to third-party servers
2. **Single Point of Failure:** If Alchemy goes down, many dApps go down
3. **AWS Dependency:** "If AWS goes down all of the dApps that depend on these nodes go down with it"
4. **Potential Censorship:** "With control concentrated in one entity, it becomes theoretically possible for transactions to be manipulated"

### Mitigation Recommendations:
- Use multiple RPC providers as fallbacks
- Consider decentralized alternatives (Ankr, dRPC)
- Run your own nodes for critical infrastructure

---

## 7. SDK / Developer Tools Issues

### SDK Deprecation Notice

> "The Alchemy SDK JS has been deprecated and will be archived January 2026."

**Migration Path:**
- Alchemy Smart Wallets SDK for transacting applications
- Viem for JS-based Ethereum development
- Solana Web3JS for Solana

### Known Technical Issues

- **Service Worker import errors** when building Chrome extensions
- **WebSocket limitations:** May miss events during 120+ block (20 min) downtime
- **zkSync compatibility:** `eth_accounts` method doesn't exist on zkSync through Alchemy

---

## 8. Summary: Key Takeaways

| Category | Verdict |
|----------|---------|
| **Best For** | Multi-chain developers wanting comprehensive tooling, startups on free tier, teams prioritizing reliability over raw speed |
| **Weakest For** | High-frequency traders, MEV bots, Solana-first projects, cost-sensitive high-volume users |
| **Biggest Complaint** | Compute Unit pricing complexity and unpredictable costs |
| **Biggest Strength** | Developer experience, tooling, free tier generosity |
| **Main Risk** | Centralization and AWS dependency |

---

## Interview Application

### Questions to Ask Michael Based on This Research:

1. "The compute unit pricing model seems to be a source of friction for some developers—how do you think about pricing simplicity vs. the flexibility CUs provide?"

2. "QuickNode is marketing heavily on latency benchmarks. Is raw latency a priority for Node Services, or do you see differentiation elsewhere?"

3. "The October 2025 AWS outage exposed some single-cloud risks. Is multi-cloud or on-prem deployment on the roadmap for enterprise customers?"

4. "I noticed the SDK is being deprecated in favor of Viem. How does Node Services think about the build vs. integrate decision for developer tools?"

### Product Opportunities You Could Propose:

1. **Pricing Transparency Tool:** CU calculator that shows estimated costs before developers commit
2. **Latency Dashboard:** Real-time latency comparison by region to address QuickNode narrative
3. **Multi-Provider Fallback:** Built-in failover to other providers (position as reliability feature, not weakness)
4. **Solana Specialization:** Close the gap with Helius for Solana-first developers

---

## Sources

- [G2 Alchemy Reviews](https://www.g2.com/products/alchemy/reviews)
- [G2 QuickNode Reviews](https://www.g2.com/products/quicknode/reviews)
- [ProductHunt Alchemy Supernode](https://www.producthunt.com/products/alchemy-supernode/reviews)
- [Alchemy Status Page](https://status.alchemy.com/)
- [StatusGator Alchemy Tracking](https://statusgator.com/services/alchemy)
- [IsDown Alchemy History](https://isdown.app/integrations/alchemy)
- [Chainstack Alchemy Comparison](https://chainstack.com/alchemy-rpc-provider-overview-2026/)
- [Chainnodes Pricing Comparison](https://www.chainnodes.org/blog/alchemy-vs-infura-vs-quicknode-vs-chainnodes-ethereum-rpc-provider-pricing-comparison/)
- [QuickNode Response Time Benchmarks](https://blog.quicknode.com/justifying-quick-in-quicknode-response-time-comparison-of-various-blockchain-node-providers/)
- [QuickNode Latency Comparison](https://blog.quicknode.com/comparisons-of-latency-across-node-service-providers-in-ethereum/)
- [Dwellir MEV Infrastructure Guide](https://www.dwellir.com/blog/mev-arbitrage-bot-infrastructure)
- [DEV Community Centralization Article](https://dev.to/zenodavids/the-case-against-infura-and-alchemy-the-hidden-dangers-of-centralized-third-party-services-42f6)
- [October 2025 AWS Outage Analysis](https://medium.com/@adejumodonsammyseun/post-mortem-report-performance-analysis-of-l1-and-l2-blockchains-during-the-october-2025-crypto-b661def7e26a)
- [GitHub Alchemy SDK Issues](https://github.com/alchemyplatform/alchemy-sdk-js/issues)
- [NomicFoundation Rate Limiting Issue](https://github.com/NomicFoundation/edr/issues/274)
- [Chainstack Best Solana RPC Providers 2025](https://chainstack.com/best-solana-rpc-providers-2025/)
- [GetBlock Best RPC Providers 2025](https://getblock.io/blog/best-rpc-node-providers-2025-the-practical-comparison-guide/)
- [Alchemy Pricing Page](https://www.alchemy.com/pricing)
- [Alchemy Compute Units Documentation](https://docs.alchemy.com/reference/compute-units)
- [Alchemy Usage Blog](https://www.alchemy.com/blog/alchemy-usage)
- [Internet Computer Forum - RPC Issues](https://forum.dfinity.org/t/issues-using-a-custom-evm-rpc-provider/30746)
