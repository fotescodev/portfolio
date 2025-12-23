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

## Phase 1: Job Analysis

**Goal:** Extract key requirements from the job description.

1. Identify:
   - Company name
   - Role title
   - Must-have qualifications
   - Nice-to-have qualifications
   - Specific technologies/domains mentioned
   - Team structure and reporting

2. Generate slug: `{company}-{role}` (kebab-case, e.g., `galaxy-pm`)

3. Check for existing variants:
   ```bash
   ls content/variants/ | grep -i {company}
   ```

**Output:** Summary of requirements to user for confirmation.

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
