---
name: generate-variant
description: Generate job-targeted CV variants with built-in quality gates. Queries knowledge base, customizes content, runs eval/redteam pipeline.
---

# Generate Variant

Generate personalized portfolio variants for specific job opportunities, with full traceability and quality verification.

## When Claude Should Use This

Activate when the user:
- Provides a job description or job URL
- Asks to create a variant for a specific company/role
- Says "generate variant", "create variant", "tailor CV for [company]"
- Wants to apply for a specific position

## Critical Design Principles

**From Galaxy Variant Exercise:**
1. **Signature headline stays** — "Building at the edge of trust" is the brand
2. **companyAccent is REQUIRED** — Add inline company name (`— with {Company}`)
3. **Existing connections are gold** — Lead with what you've already proven
4. **Stats must be verifiable** — Every metric traced to knowledge base
5. **Pause between phases** — Get user approval before proceeding

---

## Phase 1: JD Analysis & Must-Have Extraction

**Goal:** Extract NON-GENERIC requirements that reveal what the hiring manager actually cares about.

### Step 1.1: Basic Identification

| Field | Extract |
|-------|---------|
| Company | Name + what they do |
| Role | Title + level |
| Team | Who you'd report to, team size |
| Slug | `{company}-{role}` (kebab-case) |

### Step 1.2: Must-Have Extraction (Critical)

**Extract 3-5 non-generic must-haves** — the unique requirements that filter out most candidates.

**IGNORE these generic phrases:**
- "Team player", "excellent communicator", "fast-paced environment"
- "Passionate about [X]", "self-starter", "attention to detail"
- Standard PM responsibilities (roadmaps, stakeholder management, Agile)

**FOCUS on specific signals:**
- Named technologies: "Experience with Kubernetes", "Rust or Go"
- Domain expertise: "Fintech background", "Healthcare regulatory experience"
- Scale indicators: "Products with 1M+ users", "Enterprise sales cycles"
- Specific achievements: "0→1 product launches", "Platform migrations"

**Output format:**
```yaml
jdAnalysis:
  company: "Company Name"
  role: "Role Title"
  slug: "company-role"

  mustHaves:  # 3-5 non-generic requirements
    - requirement: "API platform experience"
      specificity: "high"  # high/medium/low
    - requirement: "Developer tools background"
      specificity: "high"
    - requirement: "B2B SaaS experience"
      specificity: "medium"

  niceToHaves:
    - "Startup experience"
    - "Technical degree"

  ignoredGeneric:  # What you filtered out
    - "Strong communication skills"
    - "Collaborative mindset"

  domainKeywords:
    - "payments"
    - "API"
    - "developer experience"
```

### Step 1.3: Check for Existing Variants

```bash
ls content/variants/ | grep -i {company}
```

**Output:** JD analysis summary to user for confirmation before proceeding.

---

## Phase 1.5: Alignment Gate (GO/NO-GO)

**Goal:** Score alignment BEFORE investing time in content generation.

### Scoring Process

For each must-have, check against knowledge base:

```bash
# Search achievements for evidence
grep -r "{keyword}" content/knowledge/achievements/
grep -r "{keyword}" content/experience/index.yaml
```

### Alignment Calculation

```yaml
alignment:
  mustHaves:
    - requirement: "API platform experience"
      match: true
      evidence: "Ankr Advanced APIs (1M+ daily requests), Flow CLI"
      confidence: 0.9
    - requirement: "Developer tools background"
      match: true
      evidence: "Dapper Playground V2, Microsoft Xbox dev tools"
      confidence: 0.85
    - requirement: "Payments experience"
      match: false
      evidence: null
      confidence: 0.0

  score: 0.67  # (0.9 + 0.85 + 0.0) / 3
  matchedCount: 2
  totalCount: 3

  threshold: 0.50
  recommendation: "PROCEED"  # PROCEED (≥0.5) | REVIEW (0.3-0.5) | SKIP (<0.3)
```

### Decision Framework

| Score | Recommendation | Action |
|-------|----------------|--------|
| ≥ 0.50 | **PROCEED** | Generate variant |
| 0.30 - 0.49 | **REVIEW** | Show gaps, ask user if worth pursuing |
| < 0.30 | **SKIP** | Recommend not applying, show why |

### Honesty Check

For REVIEW/SKIP cases, surface:
- Which must-haves have no evidence
- Whether gaps are addressable (transferable skills) or hard blockers
- Honest assessment: "This role requires X, which isn't in your background"

**PAUSE:** Show alignment score and recommendation. Get explicit GO/NO-GO from user.

---

## Phase 2: Knowledge Base Query

**Goal:** Find matching achievements and stories.

1. Search achievements:
   ```bash
   ls content/knowledge/achievements/
   ```

2. Read relevant achievement files matching JD requirements

3. Look for existing client relationships:
   - Search for company name in achievements/stories
   - Example: Galaxy was already an Anchorage client (ETH staking)

4. Rank matches by relevance (0.0-1.0):
   - Direct skill match: 0.9-1.0
   - Related experience: 0.7-0.9
   - Transferable skills: 0.5-0.7

**Output:** List of relevant achievements with relevance scores.

---

## Phase 2.5: Bullet Coverage Check

**Goal:** Ensure experience highlights cover all 7 PM competency bundles (PCA framework).

### The 7 Competency Bundles

| Bundle | Keywords to Look For |
|--------|---------------------|
| **1. Product Design & Development** | shipped, launched, built, designed, UX, user research, prototyped, improved, ideation |
| **2. Leadership & Execution** | led, managed, coordinated, E2E, cross-functional, stakeholders, team of X |
| **3. Strategy & Planning** | strategy, vision, roadmap, prioritized, market analysis, decision, goal setting |
| **4. Business & Marketing** | revenue, ARR, GTM, partnerships, growth, B2B, pricing, negotiated |
| **5. Project Management** | delivered, timeline, Agile, risk, on-time, coordinated, milestones |
| **6. Technical & Analytical** | architecture, API, SDK, data, metrics, experimentation, trade-offs, system design |
| **7. Communication** | presented, documented, collaborated, aligned, storytelling, stakeholder |

### Coverage Check Process

1. Read experience highlights:
   ```bash
   grep -A 10 "highlights:" content/experience/index.yaml
   ```

2. Categorize each bullet by primary competency

3. Output coverage matrix:
   ```yaml
   bulletCoverage:
     productDesign:
       count: 3
       examples:
         - "Shipped Cadence Playground V2..."
         - "Built ERC20 Xpress platform..."
     leadershipExecution:
       count: 4
       examples:
         - "Led 8 protocol integrations..."
     strategyPlanning:
       count: 1
       examples:
         - "Drove 15× revenue growth through B2B pivot..."
     businessMarketing:
       count: 2
       examples:
         - "Drove 15× revenue growth to $2M ARR..."
     projectManagement:
       count: 2
       examples:
         - "Led 8 protocol integrations averaging <2 weeks per chain..."
     technicalAnalytical:
       count: 5
       examples:
         - "Architected Docker/Kubernetes infrastructure..."
     communication:
       count: 1
       examples:
         - "Consolidated docs, saving 1 engineering resource..."

     gaps: ["communication"]  # Bundles with <2 bullets
     overweight: ["technicalAnalytical"]  # Bundles with 5+ bullets
   ```

### Interpretation

| Gap Level | Action |
|-----------|--------|
| 0 gaps | Proceed — well-rounded |
| 1-2 gaps | Surface gaps to user — may want to emphasize in bio/tagline |
| 3+ gaps | Warning — resume may appear unbalanced |

### Using Coverage for This Variant

For identified gaps, consider:
1. Can the bio/tagline emphasize this competency?
2. Are there achievements in knowledge base that weren't surfaced?
3. Does this role even care about this competency? (Check JD must-haves)

**Note:** Not all variants need all 7 bundles. A technical PM role may not care about "Business & Marketing." Use the JD must-haves to determine which gaps matter.

---

## Phase 3: Content Generation

**IMPORTANT:** Invoke `dmitrii-writing-style` skill before writing bio content.

### Hero Section

```yaml
hero:
  status: "Open to Product Roles"  # Keep simple
  headline:
    - text: "Building"
      style: "italic"
    - text: "at the edge of"
      style: "muted"
    - text: "trust"
      style: "accent"
  companyAccent:  # REQUIRED
    - text: "with"
      style: "muted"
    - text: "{Company}"
      style: "accent"
  subheadline: >
    [Tailored elevator pitch mentioning company connection]
```

### About Section

```yaml
about:
  tagline: >
    [One-line positioning statement]
  bio:
    - >
      [Paragraph 1: Recent experience, relevant achievements, company connection]
    - >
      [Paragraph 2: Career arc leading to this opportunity + vision]
  stats:
    - value: "[X]+"
      label: "[Relevant metric]"
    - value: "[Y]"
      label: "[Relevant metric]"
    - value: "[Z]"
      label: "[Relevant metric]"
```

### Relevance Scoring

```yaml
relevance:
  caseStudies:
    - slug: "[most-relevant]"
      relevanceScore: 1.0
      reasoning: "[Why this matches JD]"
    # ... ranked list
  skills:
    - category: "[Top category]"
      relevanceScore: 1.0
    # ... ranked list
```

**PAUSE:** Show generated content to user for review before proceeding.

---

## Phase 4: Variant File Creation

1. Create variant YAML:
   ```bash
   # Write to content/variants/{slug}.yaml
   ```

2. Sync to JSON:
   ```bash
   npm run variants:sync -- --slug {slug}
   ```

3. Verify JSON created:
   ```bash
   ls content/variants/{slug}.json
   ```

---

## Phase 5: Evaluation Pipeline

1. Run evaluation:
   ```bash
   npm run eval:variant -- --slug {slug}
   ```

2. Review extracted claims (metrics with anchors)

3. For each unverified claim, verify against knowledge base:
   ```bash
   npm run eval:variant -- --slug {slug} --verify {claim-id}={source-path}
   ```

4. Target: **100% claims verified**

**PAUSE:** Show claims status to user before proceeding.

---

## Phase 6: Red Team Pipeline

1. Run red team scan:
   ```bash
   npm run redteam:variant -- --slug {slug}
   ```

2. Review findings:
   - **FAIL** — Must fix before publishing
   - **WARN** — Review and decide

3. Common issues and fixes:
   | Check | Issue | Fix |
   |-------|-------|-----|
   | RT-ACC-CLAIMS | Unverified claims | Run Phase 5 verification |
   | RT-SEC-SECRETS | Tokens in content | Remove sensitive data |
   | RT-TONE-SYCOPHANCY | Flattery detected | Rewrite objectively |
   | RT-PRIV-JD | Long JD exposed | Truncate in YAML |

**PAUSE:** Show redteam results to user for approval.

---

## Phase 7: Final Review

1. Start dev server if not running:
   ```bash
   npm run dev
   ```

2. Open variant in browser:
   ```
   http://localhost:5173/{company}/{role}
   ```

3. Visual checklist:
   - [ ] companyAccent renders inline after "trust"
   - [ ] Stats are visible and accurate
   - [ ] Bio reads naturally
   - [ ] Case studies are relevant

4. Offer to commit if approved.

---

## Quality Checklist

Before marking variant complete:

- [ ] All claims verified against knowledge base
- [ ] No hallucinated achievements
- [ ] Company connection established (existing client? industry overlap?)
- [ ] Signature headline preserved with companyAccent (REQUIRED)
- [ ] Stats are verifiable and impactful
- [ ] Red team passes (0 FAIL, minimal WARN)
- [ ] Would defend every claim in an interview
- [ ] Writing style matches dmitrii-writing-style

---

## File Locations Reference

| File | Purpose |
|------|---------|
| `content/variants/{slug}.yaml` | Variant source (canonical) |
| `content/variants/{slug}.json` | Runtime artifact |
| `content/variants/_template.yaml` | Template reference |
| `capstone/develop/evals/{slug}.claims.yaml` | Claims ledger |
| `capstone/develop/evals/{slug}.eval.md` | Eval report |
| `capstone/develop/redteam/{slug}.redteam.md` | Redteam report |
| `content/knowledge/achievements/*.yaml` | Achievement sources |
| `content/knowledge/stories/*.yaml` | Story sources |

---

## Commands Reference

```bash
# Sync variant YAML → JSON
npm run variants:sync -- --slug {slug}

# Run evaluation (extract claims)
npm run eval:variant -- --slug {slug}

# Verify a specific claim
npm run eval:variant -- --slug {slug} --verify {id}={path}

# Run red team scan
npm run redteam:variant -- --slug {slug}

# Start dev server
npm run dev

# Preview variant
open "http://localhost:5173/{company}/{role}"
```

---

## Example: Galaxy PM Variant

**Job:** Director, Technical Program Manager at Galaxy

**Key Learnings Applied:**
1. Found existing connection: Galaxy was already an Anchorage client (ETH staking)
2. Matched L2 integration framework to "cross-functional" TPM requirement
3. Used punchy stats: "8+", "7+", "Zero" (all verified)
4. companyAccent: `trust — with Galaxy` (inline, subtle)
5. Status: "Open to Product Roles" (simple, not desperate)

**Result:** All 6 claims verified, redteam passed, variant shipped.
