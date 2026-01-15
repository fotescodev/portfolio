# CareerGating PRD
## Evidence-Based Quality Gates for Career Content

**Version**: 1.0
**Date**: 2025-12-23
**Author**: Dmitrii Fotesco
**Status**: Draft

---

## Executive Summary

CareerGating is a quality gate system for career content (resumes, cover letters, LinkedIn profiles) that catches mistakes **before** they reach recruiters. Unlike existing resume tools that provide generic advice, CareerGating is:

1. **Evidence-based**: Every rule is grounded in peer-reviewed research or large-scale surveys
2. **Transparent**: Users see the confidence level and source for each rule
3. **Developer-native**: CLI-first, integrates with CI/CD, works with any resume format

**Core insight**: 77% of resumes are rejected for typos. 40% more interviews come from quantified achievements. Yet most "resume advice" (like "use active voice" or "3-5 bullets per role") has **zero empirical support**. CareerGating separates evidence from convention.

---

## Problem Statement

### The Pain

Job seekers make preventable mistakes that cost them interviews:
- Typos and grammar errors (77% instant rejection rate)
- Missing quantified achievements (40% fewer callbacks)
- Sycophantic language ("dream job", "thrilled to apply") that signals desperation
- Cross-variant contamination (mentioning Stripe in your Google resume)
- Exposed credentials or confidential information

### The Gap

Existing solutions fail because:
| Tool | Problem |
|------|---------|
| Grammarly | Generic prose checker, not career-specific |
| Resume builders | Template-focused, no quality gates |
| ATS scanners | Keyword optimization theater, most claims unsubstantiated |
| Career coaches | Expensive, inconsistent, often wrong |

### The Opportunity

A **linter for career content** that:
- Catches evidence-backed mistakes automatically
- Is transparent about what has research support vs. what's convention
- Works with any format (Markdown, PDF, DOCX, plain text)
- Integrates into developer workflows (CLI, CI/CD, VS Code)

---

## Target Users

### Primary: Technical Job Seekers
- Software engineers, PMs, designers applying to tech roles
- Comfortable with CLI tools
- Value evidence over opinions
- Often manage multiple job-targeted resume variants

### Secondary: Career Coaches & Resume Writers
- Need scalable quality assurance
- Want to differentiate with evidence-based approach
- Serve high volumes of clients

### Tertiary: HR Tech Platforms
- ATS vendors wanting to improve candidate quality
- Job boards offering resume feedback
- Career services at universities

---

## Product Vision

### Positioning Statement

> "CareerGating is ESLint for your resume. We catch what research proves matters—typos, missing metrics, desperation signals—and we're transparent about which rules have evidence and which are just convention."

### Differentiation

| Competitor Says | CareerGating Says |
|-----------------|-------------------|
| "Use active voice" | "No RCTs exist for voice. We flag 'responsible for' because it's vague, not because of grammar." |
| "3-5 bullets per role" | "No study supports this. We don't enforce it." |
| "ATS rejects 75% of resumes" | "That stat is from a bankrupt company in 2013. Real ATS parse failure is ~3%." |

### Core Principles

1. **Evidence over opinion**: Every rule cites research
2. **Transparency over authority**: Users see confidence levels
3. **Actionable over judgmental**: Specific fixes, not vague criticism
4. **Developer-native**: CLI first, GUI second

---

## Research Foundation

### Strong Evidence Rules (Peer-reviewed, replicated)

| Rule | Finding | Source |
|------|---------|--------|
| Spelling errors | 77% rejection rate, 18.5pp penalty | Ghent University n=445, CareerBuilder n=2,153 |
| Grammar errors | 7.3pp penalty per 2 errors | Ghent University |
| Missing metrics | 40% fewer interviews | LinkedIn Talent Trends, Zety n=753 |
| Buzzword fatigue | 73% recruiter fatigue | CareerBuilder 10+ years |
| ATS format issues | 0% parse for tables/text boxes | Enhancv vendor data |
| Photo on US resume | 88% rejection | StandOut-CV |

### Moderate Evidence Rules (Single study or consensus)

| Rule | Finding | Source |
|------|---------|--------|
| Sycophancy backlash | Curvilinear effect confirmed | Gordon meta-analysis (69 studies), Baron 1986 |
| LinkedIn profile | 71% higher callback | ResumeGo n=24,570 |
| Vague quantities | Lower credibility | Industry consensus |

### Convention Rules (No empirical support)

| Rule | Status | Note |
|------|--------|------|
| Active vs passive voice | NO RCTs exist | Advice conflates with action verbs |
| 3-5 bullets per role | NO studies exist | Pure convention |
| One-page rule | Context-dependent | No universal finding |

---

## Feature Specification

### MVP (Week 1-2)

**Goal**: Validate core value proposition with minimal investment

#### Features

1. **Web Scanner (Single Page App)**
   - Paste resume text into textarea
   - Click "Scan"
   - See findings with severity (FAIL/WARN/INFO)
   - Each finding shows evidence source and confidence level

2. **Core Rules (Evidence-Based Only)**
   ```
   FAIL Severity:
   - CG-ERR-001: Spelling errors
   - CG-SEC-001: Credential exposure (API keys, tokens)
   - CG-SEC-002: Confidential language (NDA, internal)

   WARN Severity:
   - CG-LNG-001: Buzzword fatigue ("synergy", "leverage")
   - CG-LNG-002: Weak verbs ("responsible for", "helped with")
   - CG-QNT-001: Low quantification (<50% bullets with metrics)
   - CG-TONE-001: Sycophancy ("dream job", "thrilled", "honored")

   INFO Severity:
   - CG-LNK-001: Missing LinkedIn URL
   ```

3. **Results Display**
   ```
   ┌─ CareerGating Scan Results ────────────────────────────────┐
   │                                                            │
   │  2 FAIL  │  3 WARN  │  1 INFO                              │
   │                                                            │
   │  ❌ CG-ERR-001: Spelling error on line 12                  │
   │     "managment" → "management"                             │
   │     Evidence: 77% rejection rate (Ghent n=445)             │
   │                                                            │
   │  ⚠️ CG-TONE-001: Sycophancy detected on line 3            │
   │     "I would be thrilled to join..."                       │
   │     Evidence: Curvilinear backlash (Gordon 1996)           │
   │     Suggestion: Remove or replace with specific interest   │
   │                                                            │
   └────────────────────────────────────────────────────────────┘
   ```

4. **Evidence Panel**
   - Expandable section showing research backing
   - Links to original studies
   - Confidence rating explanation

#### Tech Stack (MVP)
- **Frontend**: React + Vite (or use Lovable's stack)
- **Styling**: Tailwind CSS
- **State**: Local only (no backend)
- **Deployment**: Vercel/Netlify static

#### MVP Success Metrics
- 100 scans in first week
- 10% return visitors
- 5 shares/mentions on social

---

### V1 (Week 3-6)

**Goal**: Add utility features that drive retention

#### New Features

1. **CLI Tool**
   ```bash
   # Install
   npm install -g careergating

   # Scan a file
   careergating scan resume.md

   # Evidence-only mode (skip conventions)
   careergating scan resume.md --evidence-only

   # JSON output for CI
   careergating scan resume.md --json

   # Watch mode for editing
   careergating scan resume.md --watch
   ```

2. **GitHub Action**
   ```yaml
   # .github/workflows/resume-check.yml
   name: Resume Quality Gate
   on: [push, pull_request]
   jobs:
     scan:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: careergating/action@v1
           with:
             files: 'resumes/*.md'
             fail-on: 'error'  # or 'warning'
   ```

3. **Multi-Variant Support**
   - Detect target company from filename or frontmatter
   - Cross-variant contamination check (CG-XVAR-001)
   - Variant-specific dashboards

4. **Export/Share**
   - Generate shareable report URL
   - PDF export of findings
   - Badge for README ("CareerGating Passed")

5. **Additional Rules**
   ```
   NEW FAIL:
   - CG-FMT-001: ATS blockers (tables, text boxes)
   - CG-FMT-002: Contact in header/footer
   - CG-REG-001: Photo on US resume

   NEW WARN:
   - CG-QNT-002: Vague quantities ("several", "many")
   - CG-TONE-002: Arrogance without support ("best", "guru")
   - CG-FMT-003: Multi-column layout
   - CG-XVAR-001: Cross-variant contamination

   NEW INFO:
   - CG-GAP-001: Employment gap >3 months
   - CG-AI-001: AI-generated markers ("delve", "pivotal")
   ```

6. **User Accounts (Optional)**
   - Save scan history
   - Track improvements over time
   - Manage multiple resume versions

#### Tech Stack (V1)
- **Backend**: Node.js + Express (or serverless functions)
- **Database**: PostgreSQL or SQLite (for history)
- **Auth**: Clerk or Auth0 (if accounts needed)
- **CLI**: Commander.js + Ink for pretty output

#### V1 Success Metrics
- 500 weekly active users
- 50 CLI installs
- 10 GitHub repos using the action
- 3 blog posts/mentions

---

### V2 (Week 7-12)

**Goal**: Become the standard for career content quality

#### New Features

1. **Job URL → Tailored Scan**
   ```
   Paste job URL: [https://linkedin.com/jobs/view/12345    ]

   Extracting requirements...
   ✓ Senior PM, Stripe, Crypto Payments
   ✓ Required: payments, protocol design, stakeholder mgmt

   Scanning your resume for alignment...

   ⚠️ CG-ALIGN-001: Missing keyword "payments"
      Job mentions 4 times, your resume: 0

   ✓ CG-ALIGN-002: Strong match on "protocol"
      Job mentions 2 times, your resume: 3
   ```

2. **Knowledge Base Integration**
   - Import career data (YAML/JSON schema)
   - Generate job-targeted variants
   - Eval pipeline (claims verification)
   - Red team pipeline (adversarial scanning)

3. **Team/Enterprise Features**
   - Shared rule configurations
   - Custom rules (company-specific banned terms)
   - Bulk scanning (career services, recruiters)
   - SSO integration

4. **Chrome Extension**
   - Scan while editing Google Docs
   - LinkedIn profile scanner
   - One-click scan on any job application page

5. **API for Integrations**
   ```bash
   POST /api/v1/scan
   {
     "content": "Resume text...",
     "options": {
       "evidenceOnly": true,
       "targetCompany": "Stripe"
     }
   }

   Response:
   {
     "findings": [...],
     "score": 85,
     "passedRules": 12,
     "failedRules": 2
   }
   ```

6. **AI-Powered Suggestions**
   - Rewrite suggestions for flagged content
   - Quantification helper ("How would you measure this?")
   - Tone adjustment recommendations

7. **Regional/Industry Presets**
   ```
   Region: [US ▾]  Industry: [Tech ▾]

   Applying rules:
   ✓ CG-REG-001: Photo check (US: reject)
   ✓ CG-IND-001: Tech buzzword thresholds
   ✓ CG-IND-002: GitHub/portfolio expectations
   ```

#### Tech Stack (V2)
- **AI**: Claude API for suggestions, job parsing
- **Extension**: Chrome Extension Manifest V3
- **API**: Rate-limited, authenticated endpoints
- **Analytics**: PostHog or Mixpanel

#### V2 Success Metrics
- 5,000 weekly active users
- 500 CLI installs
- 100 GitHub repos using action
- 10 enterprise inquiries
- Revenue: $1K MRR (if monetized)

---

## Monetization Strategy

### Freemium Model

| Tier | Price | Features |
|------|-------|----------|
| **Free** | $0 | Web scanner, 10 scans/day, evidence-based rules only |
| **Pro** | $9/mo | Unlimited scans, CLI, all rules, history, variants |
| **Team** | $29/mo | 5 seats, shared rules, bulk scanning, priority support |
| **Enterprise** | Custom | SSO, API, custom rules, dedicated support |

### Alternative: Open Core
- **Open source**: CLI + core rules (MIT license)
- **Paid**: Cloud features, team management, API

---

## Technical Architecture

### Core Components

```
┌─────────────────────────────────────────────────────────────────┐
│                        CareerGating                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐       │
│  │   Scanner    │    │    Rules     │    │   Reporter   │       │
│  │              │───▶│   Engine     │───▶│              │       │
│  │  - parse     │    │              │    │  - console   │       │
│  │  - tokenize  │    │  - security  │    │  - json      │       │
│  │  - extract   │    │  - tone      │    │  - html      │       │
│  └──────────────┘    │  - quality   │    │  - markdown  │       │
│                      │  - format    │    └──────────────┘       │
│                      │  - variant   │                           │
│                      └──────────────┘                           │
│                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐       │
│  │   Parsers    │    │   Evidence   │    │   Presets    │       │
│  │              │    │   Database   │    │              │       │
│  │  - markdown  │    │              │    │  - us-tech   │       │
│  │  - pdf       │    │  - sources   │    │  - eu-tech   │       │
│  │  - docx      │    │  - confidence│    │  - finance   │       │
│  │  - text      │    │  - citations │    │  - academic  │       │
│  └──────────────┘    └──────────────┘    └──────────────┘       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Data Model

```typescript
// Core types
interface Finding {
  id: string;           // CG-ERR-001
  category: Category;   // 'security' | 'tone' | 'quality' | 'format'
  severity: Severity;   // 'fail' | 'warn' | 'info'
  title: string;        // "Spelling error detected"
  message: string;      // "managment" should be "management"
  line?: number;
  column?: number;
  suggestion?: string;  // Actionable fix
  evidence: Evidence;
}

interface Evidence {
  confidence: 'strong' | 'moderate' | 'convention';
  summary: string;      // "77% rejection rate"
  sources: Source[];
  notes?: string;       // Caveats or limitations
}

interface Source {
  title: string;        // "Ghent University Study"
  authors?: string;     // "Sterkens et al."
  year: number;
  sampleSize?: number;  // n=445
  url?: string;
  type: 'peer-reviewed' | 'survey' | 'field-experiment' | 'vendor' | 'consensus';
}

interface ScanResult {
  content: string;
  findings: Finding[];
  summary: {
    fail: number;
    warn: number;
    info: number;
    passed: number;
  };
  score?: number;       // 0-100 quality score
  scannedAt: Date;
}

interface Rule {
  id: string;
  name: string;
  category: Category;
  severity: Severity;
  evidence: Evidence;
  check: (content: string, context?: Context) => Finding[];
  enabled: boolean;
  configurable?: RuleConfig;
}
```

### Rule Implementation Example

```typescript
// rules/tone/sycophancy.ts
import type { Rule, Finding } from '../types';

const sycophancyPatterns = [
  { pattern: /\b(thrilled|honored|excited)\s+to\s+(join|apply|work)/gi, term: 'excessive enthusiasm' },
  { pattern: /\bdream\s+(job|company|role|opportunity)/gi, term: 'dream job' },
  { pattern: /\blong\s+admired/gi, term: 'long admired' },
  { pattern: /\bprivileged?\s+to/gi, term: 'privileged' },
  { pattern: /\bpassionate\s+about\s+your\s+(mission|company)/gi, term: 'passionate about your' },
];

export const sycophancyRule: Rule = {
  id: 'CG-TONE-001',
  name: 'Sycophancy Detection',
  category: 'tone',
  severity: 'warn',
  evidence: {
    confidence: 'moderate',
    summary: 'Research shows curvilinear effects—moderate self-promotion works, excessive flattery backfires',
    sources: [
      {
        title: 'Ingratiation Meta-Analysis',
        authors: 'Gordon',
        year: 1996,
        sampleSize: 69, // studies
        type: 'peer-reviewed'
      },
      {
        title: 'Too Much of a Good Thing Effect',
        authors: 'Baron',
        year: 1986,
        type: 'peer-reviewed'
      },
      {
        title: 'Pre-Interview Flattery Study',
        year: 2021,
        sampleSize: 254,
        type: 'peer-reviewed'
      }
    ],
    notes: 'Most research is on interviews, not written applications. Thresholds not quantified.'
  },
  enabled: true,

  check(content: string): Finding[] {
    const findings: Finding[] = [];
    const lines = content.split('\n');

    lines.forEach((line, lineIndex) => {
      sycophancyPatterns.forEach(({ pattern, term }) => {
        pattern.lastIndex = 0; // Reset regex
        const match = pattern.exec(line);
        if (match) {
          findings.push({
            id: this.id,
            category: this.category,
            severity: this.severity,
            title: 'Sycophantic language detected',
            message: `"${match[0]}" may signal desperation to recruiters`,
            line: lineIndex + 1,
            suggestion: `Remove or replace with specific, factual interest in the role`,
            evidence: this.evidence
          });
        }
      });
    });

    return findings;
  }
};
```

---

## UI/UX Specifications

### Web Scanner (MVP)

```
┌─────────────────────────────────────────────────────────────────┐
│  CareerGating                              [Evidence] [About]   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                                                              ││
│  │  Paste your resume here...                                   ││
│  │                                                              ││
│  │                                                              ││
│  │                                                              ││
│  │                                                              ││
│  │                                                              ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  ☑ Evidence-based rules only    ☐ Include conventions           │
│                                                                  │
│  [ Scan Resume ]                                                 │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Results                                                         │
│  ─────────────────────────────────────────────────────────────── │
│                                                                  │
│  ❌ 2 FAIL   ⚠️ 3 WARN   ℹ️ 1 INFO                               │
│                                                                  │
│  ┌─ FAIL ────────────────────────────────────────────────────┐  │
│  │ CG-ERR-001: Spelling error                          [?]   │  │
│  │ Line 12: "managment" → "management"                       │  │
│  │                                                           │  │
│  │ Evidence: 77% of hiring managers reject for typos         │  │
│  │ Source: Ghent University (n=445), CareerBuilder (n=2,153) │  │
│  │ Confidence: ✅ STRONG                                      │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌─ WARN ────────────────────────────────────────────────────┐  │
│  │ CG-TONE-001: Sycophancy detected                    [?]   │  │
│  │ Line 3: "I would be thrilled to join your team"           │  │
│  │                                                           │  │
│  │ Evidence: Excessive flattery triggers backlash            │  │
│  │ Source: Gordon 1996 meta-analysis (69 studies)            │  │
│  │ Confidence: ⚠️ MODERATE                                    │  │
│  │                                                           │  │
│  │ Suggestion: Remove or state specific interest             │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Color Scheme

```css
:root {
  /* Severity colors */
  --fail: #ef4444;      /* Red */
  --warn: #f59e0b;      /* Amber */
  --info: #3b82f6;      /* Blue */
  --pass: #10b981;      /* Green */

  /* Confidence colors */
  --strong: #10b981;    /* Green */
  --moderate: #f59e0b;  /* Amber */
  --convention: #6b7280; /* Gray */

  /* UI */
  --bg: #0a0a0c;
  --surface: #1a1a1e;
  --border: #2a2a2e;
  --text: #fafafa;
  --text-muted: #a1a1aa;
  --accent: #c29a6c;    /* Gold */
}
```

---

## Go-to-Market Strategy

### Launch Sequence

1. **Week 1**: Ship MVP, post on Twitter/LinkedIn
2. **Week 2**: Write blog post "I Built an Evidence-Based Resume Linter"
3. **Week 3**: Submit to Hacker News (Show HN)
4. **Week 4**: Product Hunt launch
5. **Week 5-6**: Reach out to career content creators for reviews

### Content Marketing

- Blog: "Most Resume Advice Is Wrong—Here's What Research Actually Says"
- Blog: "The 75% ATS Rejection Stat Is Fake"
- Blog: "Why 'Use Active Voice' Has No Research Support"
- Twitter thread: Evidence gaps in resume advice

### Partnerships

- Career coach communities
- Coding bootcamps
- University career services
- Resume template creators (Novoresume, Enhancv)

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Low adoption | Medium | High | Validate with blog post first |
| False positives annoy users | Medium | Medium | Conservative thresholds, clear explanations |
| Competitors copy approach | Medium | Low | First-mover advantage, community building |
| Research gets debunked | Low | Medium | Cite multiple sources, update rules |
| Scope creep | High | Medium | Strict MVP definition, time-box |

---

## Success Criteria

### MVP Success (Week 2)
- [ ] 100 scans completed
- [ ] 10 return visitors
- [ ] 5 social mentions
- [ ] No critical bugs

### V1 Success (Week 6)
- [ ] 500 weekly active users
- [ ] 50 CLI downloads
- [ ] 3 blog posts/mentions
- [ ] NPS > 40

### V2 Success (Week 12)
- [ ] 5,000 weekly active users
- [ ] 10 enterprise inquiries
- [ ] $1K MRR (if monetized)
- [ ] GitHub: 500 stars

---

## Appendix A: Complete Rule Catalog

### FAIL Severity (Auto-reject evidence)

| ID | Name | Pattern | Evidence |
|----|------|---------|----------|
| CG-ERR-001 | Spelling Error | Spellcheck | 77% rejection (Ghent, CareerBuilder) |
| CG-ERR-002 | Grammar Error | Grammar check | 7.3pp penalty per 2 errors (Ghent) |
| CG-SEC-001 | Credentials | API key patterns | Security red flag |
| CG-SEC-002 | Confidential | NDA, internal only | Legal/judgment risk |
| CG-FMT-001 | ATS Blocker | Tables, text boxes | 0% parse rate (Enhancv) |
| CG-FMT-002 | Contact Header | Header/footer contact | 25% missed |
| CG-REG-001 | Photo US | Image detection | 88% rejection |

### WARN Severity (Strong to moderate evidence)

| ID | Name | Pattern | Evidence |
|----|------|---------|----------|
| CG-LNG-001 | Buzzword | synergy, leverage, etc. | 73% fatigue (CareerBuilder) |
| CG-LNG-002 | Weak Verb | responsible for, helped | Dilutes impact (consensus) |
| CG-QNT-001 | Low Metrics | <50% quantified | 40% fewer interviews |
| CG-QNT-002 | Vague Quantity | several, many, various | Lower credibility |
| CG-TONE-001 | Sycophancy | dream job, thrilled | Gordon meta-analysis |
| CG-TONE-002 | Arrogance | best, guru, ninja | 72% turnoff |
| CG-FMT-003 | Multi-column | Column detection | 7% lower parse |
| CG-XVAR-001 | Contamination | Other company names | Wrong variant |

### INFO Severity (Context-dependent)

| ID | Name | Pattern | Evidence |
|----|------|---------|----------|
| CG-LNK-001 | No LinkedIn | Missing URL | 71% higher callback |
| CG-GAP-001 | Employment Gap | >3 months | Triggers questions |
| CG-AI-001 | AI Markers | delve, pivotal | 49% reject obvious AI |

### CONVENTION (Downgraded—no evidence)

| ID | Name | Why Downgraded |
|----|------|----------------|
| CG-LNG-003 | Passive Voice | No RCTs exist |
| CG-BLT-001 | Bullet Count | "3-5" is pure convention |

---

## Appendix B: Existing Code Reference

The following code in the portfolio repo can be extracted for CareerGating:

| File | Purpose | Lines |
|------|---------|-------|
| `scripts/redteam.ts` | Core scanning logic | 493 |
| `src/lib/schemas.ts` | Zod validation schemas | ~200 |
| `scripts/evaluate-variants.ts` | Claims verification | ~300 |
| `scripts/cli/theme.ts` | CLI styling | ~100 |

### Key Patterns to Extract

```typescript
// From redteam.ts - Secret detection
const secretPatterns = [
  { name: 'OpenAI key', re: /\bsk-[A-Za-z0-9]{20,}\b/g },
  { name: 'GitHub token', re: /\bghp_[A-Za-z0-9]{30,}\b/g },
  { name: 'AWS key', re: /\bAKIA[0-9A-Z]{16}\b/g },
  // ...
];

// From redteam.ts - Sycophancy detection
const sycophancyRe = /\b(thrilled|honored|excited to join|dream company|long admired)\b/gi;

// From redteam.ts - Cross-variant contamination
function scanCrossVariantContamination(slug, company, text) {
  const otherCompanies = listVariantCompanies().filter(c => c !== company);
  // ...
}
```

---

## Appendix C: Research Sources

Full citations available in: `docs/research/careergating-research-brief.md`

### Primary Academic Sources
- Sterkens et al. 2023, PLOS One (Ghent) — n=445 recruiters
- Bertrand & Mullainathan 2004 — n=5,000 resumes
- Gordon 1996 — 69 studies meta-analysis
- Baron 1986 — Journal of Applied Social Psychology
- Quillian et al. 2023 — 90 field experiments, 170K applications

### Industry Sources
- TheLadders Eye-Tracking 2018 — n=30
- CareerBuilder Surveys — n=2,153
- ResumeGo Field Experiments — n=24,570
- Zety HR Statistics 2025 — n=753

---

**Document Version History**

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-12-23 | Initial PRD |
