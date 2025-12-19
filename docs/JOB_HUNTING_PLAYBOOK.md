# Job Hunting Playbook
## Using Universal CV for Targeted Applications

---

## Quick Start

```bash
# 1. Open Claude Code in your portfolio directory
cd ~/portfolio

# 2. Ask Claude to generate a variant
> Create a variant for [Company] [Role] with this JD: [paste job description]

# 3. Review the generated files
cat content/variants/[company]-[role].yaml

# 4. Deploy
git add content/variants/ && git commit -m "Add [Company] variant" && git push

# 5. Apply with your personalized URL
https://edgeoftrust.com/#/[company]/[role]
```

---

## Complete Workflow

### Phase 1: Prepare (Do Once)

Your knowledge base is already set up at `content/knowledge/`. The more achievements you add, the better your variants will be.

**Current achievements:**
- `eth-staking-zero-slashing` (Anchorage)
- `l2-protocol-integrations` (Anchorage)
- `xbox-royalties-ethereum` (Microsoft)
- `ankr-15x-revenue` (Ankr)
- `flow-cli-dx` (Dapper)
- `forte-wallet-sdk` (Forte)

**To add more achievements:**
```
> Add a new achievement about [describe the accomplishment]
```

---

### Phase 2: Generate Variant (Per Application)

#### Option A: With Job Description
```
Create a variant for Stripe, Platform PM role.

Job Description:
[paste the full JD here]
```

#### Option B: Quick Generation
```
Create a variant for Stripe Platform PM focusing on API infrastructure and B2B platform experience
```

#### What Gets Generated

```
content/variants/stripe-platform-pm.yaml    # Human-readable source
content/variants/stripe-platform-pm.json    # Used by portfolio site
```

**Variant contents:**
- Customized hero section (status, subheadline)
- Tailored about section (tagline, bio, stats)
- Relevance-scored case studies
- Experience highlight adjustments

---

### Phase 3: Review Variant

**Quick checklist before deploying:**

```
□ Hero status mentions role appropriately (not sycophantic)
□ About section leads with relevant experience
□ Case study ranking makes sense for this role
□ No invented achievements or inflated metrics
□ Tone sounds like you, not generic AI
□ Would you defend every claim in an interview?
```

**To preview locally:**
```bash
npm run dev
# Visit http://localhost:5173/#/stripe/platform-pm
```

---

### Phase 4: Deploy

```bash
# Stage, commit, and push
git add content/variants/
git commit -m "Add Stripe Platform PM variant"
git push
```

GitHub Actions deploys automatically (~2 minutes).

**Your personalized URL:**
```
https://edgeoftrust.com/#/stripe/platform-pm
```

---

### Phase 5: Apply

Include in your application:
- **Resume:** Your standard PDF
- **Portfolio:** The personalized variant URL
- **Cover letter (optional):** Can reference specific case studies

**Example application note:**
> I've prepared a portfolio tailored to this role: https://edgeoftrust.com/#/stripe/platform-pm

---

## Command Reference

### Generating Content

| What You Want | What to Ask |
|---------------|-------------|
| New variant | "Create a variant for [Company] [Role]" |
| Variant from JD | "Create a variant for [Company] [Role] with this JD: [paste]" |
| Update variant | "Update the Stripe variant to emphasize payments experience" |

### Querying Knowledge Base

| What You Want | What to Ask |
|---------------|-------------|
| Find relevant experience | "What achievements fit a Platform PM role?" |
| Search by skill | "Show me my API design experience" |
| Search by theme | "What's my institutional crypto experience?" |
| Search by company | "List my achievements from Anchorage" |
| All achievements | "List all achievements in the knowledge base" |

### Editing Content

| What You Want | What to Ask |
|---------------|-------------|
| Update a metric | "Update the Ankr revenue to $2.5M ARR" |
| Add achievement | "Add a new achievement about [description]" |
| Fix inconsistency | "The ETH staking case study says X but knowledge base says Y" |

---

## Tracking Applications

Keep a log at `capstone/deliver/applications.yaml`:

```yaml
applications:
  - company: "Stripe"
    role: "Platform PM"
    date: 2025-01-20
    variant: stripe-platform-pm
    source: linkedin  # or referral, careers page, etc.

    funnel:
      applied: true
      response: pending  # pending, rejected, interview, offer
      interview_date: null
      notes: ""

    variant_feedback:
      # Fill in after interview if you get feedback
      what_resonated: ""
      what_to_improve: ""
```

**Quick tracking commands:**
```bash
# See all applications
cat capstone/deliver/applications.yaml

# Add new application
# (manually edit the file or ask Claude)
```

---

## Interview Prep Bonus

Your knowledge base doubles as interview prep. Query it before interviews:

```
> What's my best example of cross-functional leadership?

> Show me the full STAR story for the ETH staking achievement

> What metrics can I cite for infrastructure work?

> What challenges did I face at Ankr and how did I solve them?
```

---

## Tips for Better Variants

### 1. Be Specific in Requests
```
# Less effective
Create a variant for Coinbase

# More effective
Create a variant for Coinbase Senior PM, Infrastructure.
Focus on crypto custody, institutional clients, and compliance.
Job requires: API design, security, cross-functional leadership.
```

### 2. Review Before Deploying
Always check the generated content. The AI uses your knowledge base but may emphasize things differently than you'd prefer.

### 3. Iterate Based on Results
If a variant leads to an interview, note what worked. If rejected, consider what to adjust.

### 4. Keep Knowledge Base Fresh
After each significant interview or project, add new achievements:
```
> Add an achievement about [what you just discussed in interview]
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Variant doesn't show on site | Check if JSON file was generated and pushed |
| Content seems generic | Add more specific achievements to knowledge base |
| Wrong emphasis | Edit the variant YAML manually or regenerate with clearer instructions |
| Hallucinated content | Report to Claude, regenerate, always review before deploying |
| Build fails | Run `npm run validate` to check for schema errors |

---

## File Locations

```
portfolio/
├── content/
│   ├── knowledge/           # Your source of truth
│   │   ├── achievements/    # STAR-format achievements
│   │   ├── stories/         # Extended narratives
│   │   └── index.yaml       # Entity relationships
│   │
│   └── variants/            # Generated variants
│       ├── _template.yaml   # Template for manual creation
│       ├── company-role.yaml
│       └── company-role.json
│
├── .claude/skills/          # Claude Code skills
│   ├── cv-content-generator/
│   ├── cv-content-editor/
│   └── cv-knowledge-query/
│
└── capstone/
    └── deliver/
        └── applications.yaml  # Application tracking
```

---

## Tomorrow's Checklist

```
□ Open Claude Code in portfolio directory
□ Have job descriptions ready (copy to clipboard)
□ For each target role:
  □ Generate variant
  □ Review content (use checklist above)
  □ Deploy (git add, commit, push)
  □ Log in applications.yaml
  □ Apply with personalized URL
```

Good luck with the job hunt!
