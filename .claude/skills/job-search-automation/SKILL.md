---
name: job-search-automation
description: Deep research and identification of high-relevance Web3 and AI product management jobs. Searches across 30+ job boards, scores by profile alignment, and outputs actionable application lists.
---

# Job Search Automation

<purpose>
Systematically identify and prioritize remote Web3, AI, and infrastructure product management opportunities that align with Dmitrii's experience in institutional custody, staking, developer tools, and protocol integrations.
</purpose>

<when_to_activate>
Activate when the user:
- Asks to find new job opportunities
- Says "job search", "find jobs", "what's hiring"
- Wants to refresh the job pipeline
- Asks for companies hiring in Web3/AI/crypto

**Trigger phrases:** "job search", "find jobs", "who's hiring", "refresh job list", "apply today"
</when_to_activate>

---

## Phase 1: Profile Alignment Refresh

**Goal:** Ensure search criteria match current experience and target roles.

### Core Profile (Dmitrii Fotesco)

**Target Titles:**
- Senior Product Manager
- Staff Product Manager
- Director of Product Management
- Lead Product Manager
- Technical Program Manager
- Principal Product Manager

**Primary Domains (Highest Match):**
1. **Institutional Custody** — Anchorage, Fireblocks, BitGo, Copper, Coinbase Custody
2. **Staking Infrastructure** — Validators, liquid staking, ETF-grade infrastructure
3. **Web3 Infrastructure** — RPC, APIs, node infrastructure, developer tools
4. **Protocol Integrations** — L2s, EVM chains, cross-chain
5. **Developer Experience** — SDKs, CLIs, documentation, developer portals

**Secondary Domains (Good Match):**
1. **AI/ML Product** — LLM tooling, AI infrastructure, agent platforms
2. **Crypto Exchanges** — Trading, custody, compliance
3. **Wallets** — MPC, embedded wallets, gaming wallets
4. **Fintech/Payments** — Stablecoins, cross-border, card issuing

**Experience Signals to Search:**
- "8+ years product management"
- "crypto/blockchain experience required"
- "institutional" or "enterprise"
- "staking" or "custody"
- "API" or "SDK" or "developer"
- "remote" or "distributed"

---

## Phase 2: Job Board Strategy

### Tier 1: Web3-Specialized Boards (Check Weekly)

| Board | URL | Focus |
|-------|-----|-------|
| Web3.career | https://web3.career/product-manager+remote-jobs | Largest Web3 aggregator |
| CryptoJobsList | https://cryptojobslist.com/remote_product-manager | Curated crypto roles |
| Remote3 | https://www.remote3.co/ | Remote-first Web3 |
| CryptocurrencyJobs | https://cryptocurrencyjobs.co/ | Startup-focused |
| a16z Portfolio | https://a16zcrypto.com/jobs/ | VC portfolio jobs |
| Paradigm Portfolio | https://jobs.paradigm.xyz/ | VC portfolio jobs |
| Arbitrum Job Board | https://jobs.arbitrum.io/ | Ecosystem jobs |
| Solana Job Board | https://jobs.solana.com/jobs | Ecosystem jobs |

### Tier 2: AI/Tech Boards (Check Weekly)

| Board | URL | Focus |
|-------|-----|-------|
| AIJobs.ai | https://aijobs.ai/product-manager | AI-specific roles |
| Built In | https://builtin.com/jobs/remote/product/artificial-intelligence | Tech PM roles |
| Wellfound | https://wellfound.com/role/r/product-manager | Startup roles |
| LinkedIn Jobs | https://linkedin.com/jobs | General + alerts |

### Tier 3: Company Careers Pages (Check Bi-Weekly)

**Web3 Infrastructure:**
- Alchemy: https://www.alchemy.com/careers
- QuickNode: https://web3.career/web3-companies/quicknode
- Infura/Consensys: https://consensys.io/open-roles
- Chainlink: https://chainlinklabs.com/open-roles

**Institutional Custody:**
- Coinbase: https://www.coinbase.com/careers
- Fireblocks: https://www.fireblocks.com/careers/current-openings/
- BitGo: https://web3.career/web3-companies/bitgo
- Anchorage Digital: https://cryptocurrencyjobs.co/startups/anchorage-digital/
- Paxos: https://cryptocurrencyjobs.co/startups/paxos/

**Crypto Exchanges:**
- Kraken: https://www.kraken.com/careers
- Circle: https://www.circle.com/en/careers

**AI Companies:**
- Anthropic: https://www.anthropic.com/jobs
- OpenAI: https://openai.com/careers/search/
- Hugging Face: https://apply.workable.com/huggingface/
- Cohere: https://cohere.com/careers
- Databricks: https://www.databricks.com/company/careers

**L1/L2 Protocols:**
- Solana Foundation: https://jobs.solana.com/
- Polygon: https://cryptojobslist.com/companies/polygon
- Optimism: Check Web3.career
- Base/Coinbase: https://www.coinbase.com/careers

**Wallets:**
- Ledger: https://careers.ledger.com/jobs/search
- MetaMask (Consensys): https://consensys.io/open-roles

**Fintech:**
- Stripe: https://stripe.com/jobs
- Plaid: https://plaid.com/careers/

---

## Phase 3: Search Execution

### Web Search Queries

Execute these searches in parallel:

```
# Primary searches
"remote Senior Product Manager Web3 blockchain infrastructure jobs [YEAR]"
"remote AI Product Manager jobs artificial intelligence [YEAR]"
"remote Product Manager crypto custody staking institutional jobs [YEAR]"
"remote Product Manager developer tools DevEx jobs [YEAR]"
"remote Product Manager RPC API infrastructure blockchain jobs [YEAR]"

# Company-specific searches
"Alchemy Infura QuickNode Product Manager jobs remote [YEAR]"
"Fireblocks BitGo Copper crypto custody Product Manager jobs [YEAR]"
"OpenAI Anthropic AI product manager jobs [YEAR]"
"Polygon Arbitrum Optimism Base L2 Product Manager jobs remote [YEAR]"
"Coinbase Kraken Circle crypto exchange Product Manager jobs [YEAR]"
"Chainlink EigenLayer Protocol Product Manager jobs remote [YEAR]"
```

### Filtering Criteria

**Must Have (Hard Requirements):**
- [ ] Remote or EST-friendly timezone
- [ ] Product Management title (PM, TPM, Lead PM, Director PM)
- [ ] 5+ years experience requirement (not entry-level)
- [ ] Web3, crypto, blockchain, or AI domain

**Strong Preference:**
- [ ] Mentions "staking", "custody", "infrastructure", or "developer"
- [ ] B2B or institutional focus
- [ ] Series B+ or established company
- [ ] $150k+ base salary range

**Avoid:**
- [ ] Marketing-only roles disguised as PM
- [ ] Requires relocation to non-US
- [ ] Less than 2 years experience required
- [ ] Pure DeFi trading/speculation focus

---

## Phase 4: Relevance Scoring

Score each opportunity 0.0-1.0 based on profile alignment:

### Scoring Matrix

| Factor | Weight | Criteria |
|--------|--------|----------|
| Domain Match | 30% | Custody/staking=1.0, Infra=0.9, Exchange=0.7, Other=0.5 |
| Seniority Match | 20% | Senior/Lead=1.0, Director=0.9, Staff=0.8, Mid=0.5 |
| Skills Match | 25% | Count matching keywords from profile |
| Company Stage | 15% | Established=1.0, Series B+=0.8, Early=0.6 |
| Compensation | 10% | $200k+=1.0, $150k+=0.8, Unknown=0.6 |

### Relevance Tiers

| Score | Tier | Action |
|-------|------|--------|
| ≥0.80 | **PRIORITY** | Apply within 24 hours |
| 0.60-0.79 | **STRONG** | Apply within 1 week |
| 0.40-0.59 | **MODERATE** | Review JD carefully, selective apply |
| <0.40 | **LOW** | Skip unless unique opportunity |

---

## Phase 5: Output Format

### Job List Output

Save to `source-data/job-pipeline/[DATE]-jobs.yaml`:

```yaml
searchDate: "YYYY-MM-DD"
totalFound: 50
byTier:
  priority: 12
  strong: 18
  moderate: 15
  low: 5

jobs:
  - rank: 1
    company: "Company Name"
    title: "Senior Product Manager, Staking"
    location: "Remote"
    url: "https://..."
    relevanceScore: 0.92
    tier: "PRIORITY"
    domainMatch:
      - "institutional custody"
      - "staking infrastructure"
    keyRequirements:
      - "8+ years PM experience"
      - "Crypto/blockchain required"
    salaryRange: "$180k-$250k"
    notes: "Former Anchorage partner company"
    status: "new"  # new | applied | interviewing | rejected | offer

    # Hiring manager research (Phase 7)
    hiringManager:
      name: "Jane Smith"
      title: "Director of Product, Staking"
      linkedin: "https://linkedin.com/in/janesmith"
      evidence: "Posted 'hiring for my team' on LinkedIn"
      contactType: "hiring_manager"  # hiring_manager | team_contact | peer_intro

    teamContacts:
      - name: "John Doe"
        title: "Senior PM, Staking"
        linkedin: "https://linkedin.com/in/johndoe"
        contactType: "peer_intro"

  # ... more jobs
```

### Application Tracker Fields

When applying, update status and add:
```yaml
    appliedDate: "YYYY-MM-DD"
    variantUsed: "coinbase-staking"  # slug of CV variant
    resumeVersion: "v2.3"
    coverLetter: true
    referral: "John Smith (former colleague)"
    nextStep: "Phone screen scheduled 2026-02-01"
```

---

## Phase 6: Variant Triggering

For PRIORITY tier jobs, automatically suggest variant generation:

1. Check if variant exists:
   ```bash
   ls content/variants/ | grep -i {company}
   ```

2. If no variant exists and score ≥0.80:
   - Save JD to `source-data/jd-{company}.txt`
   - Trigger `generate-variant` skill
   - Link variant to job entry

---

## Commands Reference

```bash
# ═══════════════════════════════════════════════════════════════
# JOB SEARCH PIPELINE
# ═══════════════════════════════════════════════════════════════

# Create job pipeline directory
mkdir -p source-data/job-pipeline

# Run JD analysis on saved job description
npm run analyze:jd -- --file source-data/jd-{company}.txt --save

# Check alignment before applying
npm run search:evidence -- --jd-analysis capstone/develop/jd-analysis/{slug}.yaml --save

# Generate variant for high-priority job
# (see generate-variant skill)
```

---

## Target Companies Watchlist

### Tier 1: Perfect Fit (Monitor Weekly)

| Company | Why | Careers URL |
|---------|-----|-------------|
| **Coinbase** | Institutional staking PM roles | coinbase.com/careers |
| **Fireblocks** | MPC custody, institutional | fireblocks.com/careers |
| **Alchemy** | Web3 infra, APIs, Solana | alchemy.com/careers |
| **Chainlink** | Staking, cross-chain, banking PM | chainlinklabs.com |
| **Anthropic** | AI product, Claude Code connection | anthropic.com/jobs |
| **Circle** | Stablecoins, institutional | circle.com/careers |

### Tier 2: Strong Fit (Monitor Bi-Weekly)

| Company | Why | Careers URL |
|---------|-----|-------------|
| Paxos | Custody, brokerage | paxos.com/careers |
| BitGo | Custody, staking | bitgo.com/careers |
| QuickNode | RPC, node infra | quicknode.com/careers |
| Kraken | Exchange, institutional | kraken.com/careers |
| Ledger | Hardware wallets, enterprise | careers.ledger.com |
| Consensys/MetaMask | Infra, wallets | consensys.io/careers |
| OpenAI | AI product | openai.com/careers |
| Databricks | Data/AI platform | databricks.com/careers |

### Tier 3: Good Fit (Monitor Monthly)

| Company | Why | Careers URL |
|---------|-----|-------------|
| Solana Foundation | Ecosystem, DevEx | jobs.solana.com |
| Hugging Face | AI/ML tools | workable.com/huggingface |
| Cohere | Enterprise AI | cohere.com/careers |
| Plaid | Fintech APIs | plaid.com/careers |
| Stripe | Crypto, payments | stripe.com/jobs |
| Uniswap Labs | DeFi, remote-first | remote.co |

---

## Phase 7: Hiring Manager Research

**CRITICAL:** For each PRIORITY tier job, identify the **actual hiring manager** — NOT executives (VP, CPO, CEO). The hiring manager is the person who will:
- Review your resume
- Conduct the hiring manager interview
- Make the final hiring decision

### Who to Find (in order of priority)

| Type | Title Pattern | Why Contact |
|------|---------------|-------------|
| **Hiring Manager** | Director of PM, Group PM, Senior PM (hiring) | Direct decision maker |
| **Team Contact** | PM on same team, Sales/BD in same area | Can intro to hiring manager |
| **Peer Intro** | PM on adjacent team | Knows hiring manager, can refer |

### Who to AVOID

- Chief Product Officer (too senior)
- VP of Product (too senior, unless <100 employees)
- CEO (unless company <50 employees or CEO was a PM)
- Recruiters (go direct to hiring manager instead)

### LinkedIn Search Strategy

For each PRIORITY job, execute these searches:

```
# Find hiring manager
site:linkedin.com/in "[Company]" "product manager" "hiring" OR "we're hiring"
site:linkedin.com/in "[Company]" "director product" OR "group product manager"
"[Company]" "[Team/Domain]" "product" LinkedIn

# Find team members
site:linkedin.com/in "[Company]" "[specific product area]" product
"[Company]" product manager [city if hybrid role]

# Find people posting about hiring
"[Company]" "hiring" "product manager" site:linkedin.com
```

### Research Signals

**Confirmed Hiring Manager** (best):
- Posts "we're hiring" or "my team is hiring" for the specific role
- LinkedIn shows they manage PMs
- Title is Director/GPM/Senior PM in exact domain

**Likely Hiring Manager** (good):
- Title matches team (e.g., "PM, Staking" for staking role)
- 3+ years at company in same domain
- Posts about the product area frequently

**Team Contact** (backup):
- Works in same department (Sales, BD, Engineering)
- Can provide intro or name the hiring manager
- Useful when PM org structure is unclear

### Outreach Document Format

Save to `source-data/job-pipeline/[DATE]-outreach.md`:

```markdown
## [COMPANY] - [Role Name]

### HIRING MANAGER: [Name]
**Title:** [Exact title]
**LinkedIn:** [URL]
**Background:** [2-3 relevant points]
**Evidence:** [Why you think they're the hiring manager]

#### Connection Request (300 chars max):
[Short, specific message referencing role + your relevant experience]

#### Full Message (after connection accepted):
[Longer message with specific achievements that match role requirements]

---

### TEAM CONTACT: [Name] (if hiring manager unclear)
**Title:** [Title]
**LinkedIn:** [URL]
**Why contact:** [How they can help]

#### Message:
[Ask who leads product hiring for this team]
```

### Outreach Message Framework

**Connection Request (300 char limit):**
```
Hi [Name] - [saw you're hiring / noticed your work on X]. I [specific relevant achievement in 10 words]. Interested in the [Role]. Would love to connect.
```

**Full Message Structure:**
1. **Hook** (1 sentence): Reference their post/work or the specific role
2. **Proof** (3-4 bullets): Your most relevant achievements with metrics
3. **Bridge** (1 sentence): Why this role/company specifically
4. **Ask** (1 sentence): Clear next step (chat, intro to hiring manager, etc.)

**Example:**
```
Hi [Name],

Saw your post about hiring for [Role]. My background aligns directly:

- [Achievement 1 with metric]
- [Achievement 2 with metric]
- [Achievement 3 with metric]

[Why this company/role matters to you in 1 sentence].

Are you the right person to chat with, or could you point me to who's leading this search?

[Your name]
```

### Action Sequence

| Day | Action |
|-----|--------|
| 0 | Send connection requests to confirmed hiring managers |
| 0 | Apply directly to all PRIORITY roles |
| 3 | Send connection requests to team contacts |
| 3 | Apply to STRONG tier roles |
| 7 | Follow up on accepted connections with full message |
| 7 | Send connection requests to peer intros |
| 14 | Follow up on pending connections |
| 14 | Try alternate contacts if no response |

### Quality Checklist - Hiring Managers

Before sending outreach:

- [ ] Verified they're NOT a C-level/VP (unless small company)
- [ ] Found evidence they're involved in hiring (posts, title, team)
- [ ] Connection request is under 300 characters
- [ ] Message references specific role, not generic
- [ ] Included 2-3 achievements with metrics
- [ ] Clear ask at the end
- [ ] No typos in their name or company

---

## Quality Checklist

Before finalizing job list:

- [ ] All URLs verified accessible
- [ ] Relevance scores calculated consistently
- [ ] No duplicate entries
- [ ] PRIORITY jobs have JDs saved
- [ ] Salary ranges included where available
- [ ] Remote/location requirements confirmed
- [ ] Experience requirements within range (5-10+ years)

---

<skill_compositions>
## Works Well With

- **generate-variant** — Trigger for PRIORITY tier jobs
- **cv-knowledge-query** — Check alignment before applying
- **dmitrii-writing-style** — For cover letters and outreach messages
</skill_compositions>

---

## Workflow Summary

```
Phase 1: Profile Alignment    → Confirm target roles/domains
Phase 2: Job Board Strategy   → Identify sources to search
Phase 3: Search Execution     → Run searches, filter results
Phase 4: Relevance Scoring    → Score 0.0-1.0, assign tiers
Phase 5: Output Format        → Save to job-pipeline YAML
Phase 6: Variant Triggering   → Generate CV variants for PRIORITY
Phase 7: Hiring Manager Research → Find ACTUAL hiring managers (not VPs)
                               → Draft personalized outreach messages
                               → Save to outreach markdown file
```

**Key Output Files:**
- `source-data/job-pipeline/[DATE]-jobs.yaml` — Job list with scores
- `source-data/job-pipeline/[DATE]-outreach.md` — Hiring managers + messages
