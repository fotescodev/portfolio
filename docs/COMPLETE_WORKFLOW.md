# Universal CV: Complete Workflow Guide
## From Raw Data to Personalized Portfolio Variants

---

## Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           COMPLETE WORKFLOW                                  │
└─────────────────────────────────────────────────────────────────────────────┘

  PHASE 1              PHASE 2              PHASE 3              PHASE 4
  Gather Data          Build Knowledge      Generate Variants    Apply & Track
  ───────────          ───────────────      ─────────────────    ─────────────

  ┌─────────┐          ┌─────────┐          ┌─────────┐          ┌─────────┐
  │LinkedIn │          │ Extract │          │ Create  │          │ Deploy  │
  │Reviews  │────────▶ │Achieve- │────────▶ │Tailored │────────▶ │ & Send  │
  │Notes    │          │ments    │          │Variants │          │ Links   │
  │Articles │          │         │          │         │          │         │
  └─────────┘          └─────────┘          └─────────┘          └─────────┘
```

---

# Phase 1: Gather Your Raw Data

## What to Collect

| Source | What to Look For | Value |
|--------|------------------|-------|
| **Performance reviews** | Achievements, metrics, feedback | High - already structured |
| **LinkedIn posts** | Wins you've shared publicly | High - authentic voice |
| **Slack/email kudos** | Recognition from colleagues | Medium - social proof |
| **Project docs** | Specs, retrospectives, outcomes | High - detailed context |
| **Interview prep notes** | Stories you've practiced | High - already STAR format |
| **Resume versions** | Past bullet points | Medium - needs expansion |
| **Blog posts/articles** | Thought leadership | Medium - demonstrates expertise |
| **Presentation slides** | Key projects, metrics | Medium - visual context |
| **YouTube/videos** | Talks, demos, interviews | Medium - if transcript available |

---

## How to Get Data Into the System

### Method 1: Paste Directly (Fastest)

Just paste text into the chat:

```
Here's my performance review from 2024:

[paste the content]

Extract achievements from this and add to my knowledge base.
```

---

### Method 2: Save to Raw Directory

Save files to `content/knowledge/raw/` and ask me to process them:

```
content/knowledge/raw/
├── linkedin/
│   ├── post-2024-01-staking-launch.txt
│   └── post-2023-06-ankr-growth.txt
├── reviews/
│   ├── 2024-annual-review.txt
│   └── 2023-mid-year.txt
├── notes/
│   ├── interview-prep.md
│   └── project-retrospective.md
├── transcripts/
│   └── conference-talk-2024.txt
└── articles/
    └── blog-post-draft.md
```

Then ask:
```
Read content/knowledge/raw/reviews/2024-annual-review.txt and extract achievements
```

---

### Method 3: Give Me URLs (Public Content)

**Works:**
```
Extract achievements from this LinkedIn post:
https://www.linkedin.com/posts/dmitriifotesco_your-post-id

Summarize this article I wrote:
https://medium.com/@yourname/article-title
```

**Doesn't Work:**
```
# Private LinkedIn (requires login)
# Google Docs (requires auth)
# Internal company pages
```

---

### Method 4: YouTube Videos

**What works:**
- I can read the video title, description, and comments
- I can process a transcript if you provide it

**How to get YouTube transcripts:**
1. Open video → Click "...More" → "Show transcript"
2. Copy the transcript text
3. Paste it to me or save to `content/knowledge/raw/transcripts/`

```
Here's the transcript from my conference talk:

[paste transcript]

Extract key achievements and talking points.
```

---

## Quick Data Collection Checklist

```
□ Performance reviews (last 2-3 years)
  → Save to: content/knowledge/raw/reviews/

□ LinkedIn posts about wins
  → Save URLs or text to: content/knowledge/raw/linkedin/

□ Kudos/recognition messages
  → Save to: content/knowledge/raw/notes/kudos.txt

□ Project retrospectives
  → Save to: content/knowledge/raw/notes/

□ Interview prep notes
  → Save to: content/knowledge/raw/notes/interview-prep.md

□ Past resume bullets
  → Paste directly or save to: content/knowledge/raw/notes/resume-bullets.txt

□ Conference talk transcripts
  → Save to: content/knowledge/raw/transcripts/

□ Blog posts / articles
  → Give me URLs or save to: content/knowledge/raw/articles/
```

---

# Phase 2: Build Your Knowledge Base

## Step 2.1: Process Raw Data

Once you have raw data, ask me to extract achievements:

```
Read all files in content/knowledge/raw/reviews/ and extract achievements in STAR format.
Add them to the knowledge base.
```

Or process one at a time:

```
Here's feedback from my manager:

"Dmitrii led the staking infrastructure project that onboarded Galaxy as our
first major institutional client. His focus on compliance from day one was
critical to winning their trust."

Create an achievement from this.
```

---

## Step 2.2: Review Extracted Achievements

Check what's in your knowledge base:

```
List all achievements in the knowledge base with their metrics
```

Each achievement should have:
- **Headline:** One-line resume bullet
- **Metric:** Quantified impact
- **STAR:** Full Situation/Task/Action/Result narrative
- **Tags:** Skills, themes, companies, years

---

## Step 2.3: Fill Gaps

Identify missing achievements:

```
What skills don't have strong achievements in my knowledge base?
```

Then add more:

```
Add an achievement about my work on [specific project]
```

---

## Current Knowledge Base Status

**Achievements (6):**
- `eth-staking-zero-slashing` - Anchorage, institutional staking
- `l2-protocol-integrations` - Anchorage, protocol framework
- `xbox-royalties-ethereum` - Microsoft, first smart contract
- `ankr-15x-revenue` - Ankr, revenue growth
- `flow-cli-dx` - Dapper, developer tools
- `forte-wallet-sdk` - Forte, gaming infrastructure

**To view:**
```bash
ls content/knowledge/achievements/
```

---

# Phase 3: Generate Variants

## Step 3.1: Prepare Job Description

Copy the job description. You can:
- Paste it directly
- Save to a file
- Give me the job posting URL (if public)

---

## Step 3.2: Generate Variant

**Option A: Paste JD directly**
```
Create a variant for Stripe, Platform PM role.

Job Description:
[paste full JD]
```

**Option B: From URL**
```
Create a variant for this role:
https://stripe.com/jobs/listing/platform-pm-12345
```

**Option C: Quick generation (no JD)**
```
Create a variant for Stripe Platform PM.
Focus on: API infrastructure, B2B platforms, revenue growth.
```

---

## Step 3.3: Review Before Deploying

Check the generated files:

```bash
cat content/variants/stripe-platform-pm.yaml
```

**Checklist:**
```
□ Hero section is tailored (not sycophantic)
□ About emphasizes relevant experience
□ Case study ranking makes sense
□ All claims are in knowledge base (no hallucinations)
□ Tone sounds like you
□ Would you defend every claim in interview?
```

**Preview locally:**
```bash
npm run dev
# Visit http://localhost:5173/#/stripe/platform-pm
```

---

## Step 3.4: Deploy

```bash
git add content/variants/
git commit -m "Add Stripe Platform PM variant"
git push
```

Your variant is live at:
```
https://edgeoftrust.com/#/stripe/platform-pm
```

---

# Phase 4: Apply & Track

## Step 4.1: Apply

Include in your application:
- Resume PDF
- Portfolio link: `https://edgeoftrust.com/#/stripe/platform-pm`

The personalized URL signals effort.

---

## Step 4.2: Track Results

Log each application in `capstone/deliver/applications.yaml`:

```yaml
applications:
  - company: "Stripe"
    role: "Platform PM"
    date: 2025-01-20
    variant: stripe-platform-pm
    source: linkedin
    funnel:
      applied: true
      response: pending
```

---

## Step 4.3: Learn & Iterate

After interviews, update your knowledge base:

```
Add a new achievement based on what resonated in my Stripe interview:
[describe what they responded well to]
```

---

# Quick Command Reference

## Data Collection

| Task | Command |
|------|---------|
| Process pasted text | Paste + "Extract achievements from this" |
| Process local file | "Read content/knowledge/raw/[file] and extract achievements" |
| Process URL | "Extract from this URL: [link]" |
| Process all raw files | "Process all files in content/knowledge/raw/ and add to knowledge base" |

## Knowledge Base

| Task | Command |
|------|---------|
| List achievements | "List all achievements in knowledge base" |
| Find by skill | "What achievements demonstrate API design?" |
| Find by company | "Show my Anchorage achievements" |
| Add achievement | "Add achievement about [description]" |
| Update metric | "Update Ankr revenue to $2.5M" |

## Variant Generation

| Task | Command |
|------|---------|
| Generate from JD | "Create variant for [Company] [Role] with this JD: [paste]" |
| Generate from URL | "Create variant for this role: [job posting URL]" |
| Quick generate | "Create variant for [Company] [Role] focusing on [skills]" |
| Update variant | "Update Stripe variant to emphasize payments" |

## Deployment

```bash
# Deploy variant
git add content/variants/ && git commit -m "Add [Company] variant" && git push

# Check status
git status

# Preview locally
npm run dev
```

---

# Data Input Examples

## Example 1: Performance Review

```
Here's my 2024 performance review:

"Dmitrii exceeded expectations this year. Key accomplishments:
- Led ETH staking infrastructure serving institutional clients with $2B+ AUM
- Zero slashing incidents across all validators
- Shipped 7 L2 integrations including Optimism, Base, and Arbitrum
- Reduced integration cycle time from 12 weeks to 7 weeks

Areas of strength: Technical depth, cross-functional leadership, compliance focus"

Extract achievements and add to knowledge base.
```

## Example 2: LinkedIn Post URL

```
Extract achievements from this post I wrote:
https://www.linkedin.com/posts/dmitriifotesco_shipped-our-institutional-staking-product-12345

Add to knowledge base with appropriate tags.
```

## Example 3: YouTube Talk

```
Here's the transcript from my talk at ETHDenver:

[0:00] "Today I want to share how we built institutional-grade staking..."
[0:45] "The key insight was that compliance couldn't be an afterthought..."
[2:30] "We chose in-house validators over third-party providers because..."

Extract key achievements and talking points.
```

## Example 4: Project Retrospective

```
Read content/knowledge/raw/notes/staking-retro.md and extract:
1. Key achievements with metrics
2. Challenges overcome
3. Lessons learned

Add as achievements to knowledge base.
```

---

# File Locations Summary

```
portfolio/
├── content/
│   ├── knowledge/
│   │   ├── achievements/        # Structured achievements (STAR format)
│   │   ├── stories/             # Extended narratives
│   │   ├── index.yaml           # Entity relationships
│   │   └── raw/                 # YOUR INPUT DATA GOES HERE
│   │       ├── linkedin/        # LinkedIn posts
│   │       ├── reviews/         # Performance reviews
│   │       ├── notes/           # Interview prep, retrospectives
│   │       ├── transcripts/     # Video/talk transcripts
│   │       └── articles/        # Blog posts, articles
│   │
│   └── variants/                # Generated variants
│
├── docs/
│   └── JOB_HUNTING_PLAYBOOK.md  # Quick reference
│
└── capstone/
    └── deliver/
        └── applications.yaml    # Application tracker
```

---

# Getting Started Tomorrow

## Morning Setup (30 min)

```
1. Gather raw data:
   □ Export performance reviews → save to content/knowledge/raw/reviews/
   □ Copy LinkedIn post URLs → save list to content/knowledge/raw/linkedin/urls.txt
   □ Gather interview prep notes → save to content/knowledge/raw/notes/

2. Open Claude Code:
   cd ~/portfolio

3. Process your data:
   > Read all files in content/knowledge/raw/ and extract achievements

4. Review what's extracted:
   > List all achievements with their metrics
```

## Per Application (10 min)

```
1. Copy job description

2. Generate variant:
   > Create variant for [Company] [Role] with this JD: [paste]

3. Review and deploy:
   git add content/variants/ && git commit -m "Add [Company] variant" && git push

4. Apply with your URL:
   https://edgeoftrust.com/#/[company]/[role]

5. Log in applications.yaml
```

---

Good luck! 🎯
