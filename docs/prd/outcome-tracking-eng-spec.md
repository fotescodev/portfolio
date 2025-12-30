# Engineering Spec: Outcome Tracking for RL-Ready Analytics

**Status**: Draft
**Author**: Claude + Dmitrii
**Created**: 2025-12-30
**Last Updated**: 2025-12-30
**Related Research**: [RepoNavigator Paper](https://arxiv.org/abs/2512.20957) - RL for repository-level agents

---

## 1. Problem Statement

The portfolio system generates tailored CV variants but has no feedback loop to learn which content choices drive hiring outcomes. Without outcome data:

- Cannot measure variant effectiveness (response rates, interview conversion)
- Cannot identify which achievements/stats/styles resonate with employers
- Cannot apply reinforcement learning to optimize future variants
- Cannot A/B test content strategies (referral vs. cold, domain-specific vs. generic)

### Current State

| Component | Status | Gap |
|-----------|--------|-----|
| `applications.yaml` | Template exists, unused | No structured data collection |
| `cv-dashboard` | Shows applied/pending only | No funnel stages or outcomes |
| Variant YAML | No outcome fields | Cannot correlate content → results |
| Analytics | None | No insights generation |

---

## 2. Goals & Non-Goals

### Goals

1. **Track application outcomes** through the full hiring funnel
2. **Attribute outcomes to content features** (which achievements, stats, styles)
3. **Enable one-click status updates** in the dashboard
4. **Compute actionable metrics** (response rate, interview conversion, time-to-response)
5. **Structure data for future RL training** (state, action, reward triplets)

### Non-Goals (This Phase)

- Automated outcome detection (e.g., email parsing)
- Real-time notifications
- Integration with external ATS systems
- Full RL model training pipeline
- Multi-user support

---

## 3. Technical Design

### 3.1 Architecture Decision: Hybrid Storage

**Decision**: Store quick-access status in variant metadata, detailed tracking in `applications.yaml`.

```
variant.yaml                    applications.yaml
├── metadata.outcome            ├── detailed funnel data
│   ├── stage                   ├── feedback & notes
│   ├── applied_at              ├── interview details
│   └── result                  └── competition context
```

**Rationale**:
- Dashboard loads fast (reads variant metadata)
- Detailed analytics available when needed
- Clear separation of content vs. tracking
- Variant files remain portable

### 3.2 Data Flow

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  User Action    │────▶│  Dashboard UI    │────▶│  Update Script  │
│  (click button) │     │  (one-click)     │     │  (sync both)    │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                                                         │
                        ┌────────────────────────────────┼────────────────────────────────┐
                        │                                │                                │
                        ▼                                ▼                                ▼
              ┌─────────────────┐              ┌─────────────────┐              ┌─────────────────┐
              │  variant.yaml   │              │ applications.yaml│              │  Analytics DB   │
              │  (quick status) │              │  (full details)  │              │  (computed)     │
              └─────────────────┘              └─────────────────┘              └─────────────────┘
```

---

## 4. Data Schema

### 4.1 Funnel Stages (Enum)

```typescript
type FunnelStage =
  | 'not_applied'      // Variant created, not yet submitted
  | 'applied'          // Application submitted
  | 'screened_out'     // Auto-rejected (ATS/recruiter)
  | 'response'         // Any human response received
  | 'phone_screen'     // Initial recruiter call
  | 'interview_1'      // First technical/HM interview
  | 'interview_2'      // Second round / panel
  | 'final_round'      // Final interviews
  | 'offer'            // Offer received
  | 'accepted'         // Offer accepted
  | 'rejected'         // Rejected at any stage
  | 'withdrawn'        // Candidate withdrew
  | 'expired'          // Position closed/filled
```

### 4.2 RL Reward Weights

```typescript
const REWARD_WEIGHTS: Record<FunnelStage, number> = {
  not_applied: 0.0,
  applied: 0.0,
  screened_out: -0.2,    // Negative signal
  response: 0.3,
  phone_screen: 0.5,
  interview_1: 0.7,
  interview_2: 0.8,
  final_round: 0.9,
  offer: 1.0,
  accepted: 1.0,
  rejected: 0.0,         // Neutral (stage matters more)
  withdrawn: 0.0,
  expired: 0.0,
};
```

### 4.3 Variant Metadata Extension

```yaml
# content/variants/{slug}.yaml
metadata:
  company: "Galaxy"
  role: "Product Manager"
  slug: "galaxy-pm"
  generatedAt: "2025-01-15T10:00:00Z"
  sourceUrl: "https://..."

  # NEW: Outcome tracking (quick-access)
  outcome:
    stage: "interview_1"
    applied_at: "2025-01-15T10:30:00Z"
    response_at: "2025-01-18T14:00:00Z"
    result: null  # offer | rejected | withdrawn | expired
    source: "referral"  # linkedin | referral | careers | cold | recruiter
```

### 4.4 Applications.yaml Schema

```yaml
# capstone/deliver/applications.yaml

# Aggregate metrics (auto-computed)
summary:
  total_applications: 15
  by_source:
    referral: 5
    linkedin: 8
    careers: 2
  by_stage:
    applied: 3
    interviewing: 4
    concluded: 8
  metrics:
    response_rate: 0.47
    interview_rate: 0.27
    offer_rate: 0.07
    avg_days_to_response: 4.2

# Per-application detailed records
applications:
  - variant: "galaxy-pm"

    # Timeline
    timeline:
      applied_at: "2025-01-15T10:30:00Z"
      response_at: "2025-01-18T14:00:00Z"
      phone_screen_at: "2025-01-20T15:00:00Z"
      interview_1_at: "2025-01-25T14:00:00Z"
      final_outcome_at: null

    # Current state
    stage: "interview_1"
    result: null
    rejected_at_stage: null

    # Source attribution
    source: "referral"
    referrer: "Jane Smith (former Anchorage colleague)"

    # Computed metrics
    days_to_response: 3
    days_to_interview: 10
    days_in_pipeline: 15

    # Competition context
    context:
      posted_days_ago: 5
      applicant_count: null
      market_conditions: "normal"  # tight | normal | hot
      applied_same_week: 3

    # Qualitative feedback (gold for learning)
    feedback:
      recruiter_comments: "Strong crypto background"
      interviewer_feedback: |
        Technical depth on staking was impressive.
        Would like to see more consumer product experience.
      what_resonated:
        - "15x revenue growth at Ankr"
        - "Zero slashing incidents"
        - "Galaxy compliance win case study"
      what_fell_flat:
        - "Microsoft experience felt dated"
      improvement_notes: |
        Next time, lead with the compliance story for regulated finance roles.

    # Interview details
    interviews:
      - date: "2025-01-20T15:00:00Z"
        type: "phone_screen"
        interviewer: "Sarah (Recruiter)"
        duration_minutes: 30
        topics: ["background", "salary expectations", "timeline"]
        outcome: "advance"
      - date: "2025-01-25T14:00:00Z"
        type: "hiring_manager"
        interviewer: "Mike Chen (Director of Product)"
        duration_minutes: 60
        topics: ["staking architecture", "compliance", "team management"]
        outcome: "pending"
```

### 4.5 Content Features Schema (For RL Attribution)

```yaml
# In variant.yaml - tracks content choices for correlation
content_features:
  # Hero section choices
  hero:
    style: "metrics_forward"  # metrics_forward | story_forward | hybrid
    primary_stat: "15×"
    secondary_stat: "$2.3B"
    tagline_type: "domain_specific"

  # Achievement selection (IDs from knowledge base)
  achievements:
    - id: "ankr-15x-revenue"
      position: 1
      relevance_score: 0.92
    - id: "eth-staking-zero-slashing"
      position: 2
      relevance_score: 0.88
    - id: "galaxy-compliance-win"
      position: 3
      relevance_score: 0.85

  # Case studies included
  case_studies: ["galaxy-compliance-win"]

  # Skills emphasized (matched from JD)
  skills_emphasized:
    - "ethereum"
    - "staking"
    - "compliance"
    - "api-design"

  # Style choices
  tone: "technical"  # technical | business | balanced
  formality: "professional"
  resume_pages: 1
  testimonials_included: true

  # JD match metrics
  jd_match:
    company_tier: "tier_1"
    role_level: "senior"
    domain: "crypto"
    years_required: 7
    years_provided: 10
    skills_overlap: 0.85
    requirements_matched: 10
    requirements_total: 12
```

### 4.6 Zod Schemas

```typescript
// src/lib/schemas/outcome.ts

import { z } from 'zod';

export const FunnelStageSchema = z.enum([
  'not_applied',
  'applied',
  'screened_out',
  'response',
  'phone_screen',
  'interview_1',
  'interview_2',
  'final_round',
  'offer',
  'accepted',
  'rejected',
  'withdrawn',
  'expired',
]);

export const ApplicationSourceSchema = z.enum([
  'linkedin',
  'referral',
  'careers',
  'cold',
  'recruiter',
]);

export const OutcomeResultSchema = z.enum([
  'offer',
  'rejected',
  'withdrawn',
  'expired',
]).nullable();

// Quick-access outcome in variant metadata
export const VariantOutcomeSchema = z.object({
  stage: FunnelStageSchema,
  applied_at: z.string().datetime().nullable(),
  response_at: z.string().datetime().nullable(),
  result: OutcomeResultSchema,
  source: ApplicationSourceSchema.nullable(),
});

// Full application record
export const ApplicationRecordSchema = z.object({
  variant: z.string(),
  timeline: z.object({
    applied_at: z.string().datetime().nullable(),
    response_at: z.string().datetime().nullable(),
    phone_screen_at: z.string().datetime().nullable(),
    interview_1_at: z.string().datetime().nullable(),
    interview_2_at: z.string().datetime().nullable(),
    final_round_at: z.string().datetime().nullable(),
    final_outcome_at: z.string().datetime().nullable(),
  }),
  stage: FunnelStageSchema,
  result: OutcomeResultSchema,
  rejected_at_stage: FunnelStageSchema.nullable(),
  source: ApplicationSourceSchema,
  referrer: z.string().nullable(),
  days_to_response: z.number().nullable(),
  days_to_interview: z.number().nullable(),
  days_in_pipeline: z.number().nullable(),
  context: z.object({
    posted_days_ago: z.number().nullable(),
    applicant_count: z.number().nullable(),
    market_conditions: z.enum(['tight', 'normal', 'hot']),
    applied_same_week: z.number(),
  }),
  feedback: z.object({
    recruiter_comments: z.string(),
    interviewer_feedback: z.string(),
    what_resonated: z.array(z.string()),
    what_fell_flat: z.array(z.string()),
    improvement_notes: z.string(),
  }),
  interviews: z.array(z.object({
    date: z.string().datetime(),
    type: z.string(),
    interviewer: z.string(),
    duration_minutes: z.number(),
    topics: z.array(z.string()),
    outcome: z.enum(['advance', 'reject', 'pending']),
  })),
});

// Content features for RL attribution
export const ContentFeaturesSchema = z.object({
  hero: z.object({
    style: z.enum(['metrics_forward', 'story_forward', 'hybrid']),
    primary_stat: z.string(),
    secondary_stat: z.string().nullable(),
    tagline_type: z.enum(['domain_specific', 'generic', 'contrarian']),
  }),
  achievements: z.array(z.object({
    id: z.string(),
    position: z.number(),
    relevance_score: z.number(),
  })),
  case_studies: z.array(z.string()),
  skills_emphasized: z.array(z.string()),
  tone: z.enum(['technical', 'business', 'balanced']),
  formality: z.enum(['professional', 'conversational']),
  resume_pages: z.number(),
  testimonials_included: z.boolean(),
  jd_match: z.object({
    company_tier: z.enum(['tier_1', 'tier_2', 'startup']),
    role_level: z.enum(['junior', 'mid', 'senior', 'staff', 'principal']),
    domain: z.string(),
    years_required: z.number(),
    years_provided: z.number(),
    skills_overlap: z.number(),
    requirements_matched: z.number(),
    requirements_total: z.number(),
  }),
});
```

---

## 5. Dashboard UI Changes

### 5.1 New Stats Row

```
┌────────────────┬────────────────┬────────────────┬────────────────┐
│ Response Rate  │ Interview Rate │  Offer Rate    │ Avg Response   │
│     47%        │      27%       │      7%        │    4.2 days    │
│   ▲ +12%       │    ▲ +5%       │    ─ 0%        │   ▼ -1.3       │
└────────────────┴────────────────┴────────────────┴────────────────┘
```

### 5.2 Variant Card Enhancement

```
┌─────────────────────────────────────────────────────────────────────┐
│ Galaxy                                              Jan 15   ✓ Applied │
│ Product Manager                                                      │
├─────────────────────────────────────────────────────────────────────┤
│ Stage: ████████░░░░░░ Interview 1 (Day 15)                          │
│                                                                      │
│ [View Portfolio] [Resume ↓] [Job Post] [Update Status ▼]            │
└─────────────────────────────────────────────────────────────────────┘
```

### 5.3 Quick Actions Dropdown

```
┌─────────────────────────┐
│ Update Status           │
├─────────────────────────┤
│ ○ Got Response          │
│ ○ Phone Screen          │
│ ○ Interview Scheduled   │
│ ○ Advanced to Final     │
│ ○ Got Offer! 🎉         │
│ ───────────────────     │
│ ○ Rejected              │
│ ○ Withdrew              │
│ ○ Position Closed       │
└─────────────────────────┘
```

### 5.4 New Filters

```
[All] [Not Applied] [Applied] [Interviewing] [Concluded]
[All Sources ▼] [All Domains ▼]
```

### 5.5 Analytics Tab (Phase 2)

```
┌─────────────────────────────────────────────────────────────────────┐
│ INSIGHTS                                                            │
├─────────────────────────────────────────────────────────────────────┤
│ Best Performers:                                                    │
│   • Referral applications: 60% response rate (vs 30% cold)         │
│   • "15× revenue" stat: 45% response when featured                 │
│   • Crypto domain variants: 2.1× interview rate                    │
│                                                                      │
│ Underperformers:                                                    │
│   • Generic taglines: 12% response rate                            │
│   • LinkedIn Easy Apply: 8% response rate                          │
│                                                                      │
│ Recommendations:                                                    │
│   → Prioritize referral channels                                   │
│   → Lead with domain-specific achievements                         │
│   → Avoid LinkedIn Easy Apply for Tier 1 companies                 │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 6. Implementation Phases

### Phase 1: Foundation (MVP)

**Scope**: Basic tracking with one-click updates

| Task | Effort | Output |
|------|--------|--------|
| Add `outcome` schema to variant metadata | S | Zod schema, TypeScript types |
| Extend `applications.yaml` schema | S | Full tracking schema |
| Add status update script | M | `scripts/update-outcome.ts` |
| Update dashboard with stage column | M | New column + visual funnel |
| Add quick-action dropdown | M | Status update UI |
| Sync script (variant ↔ applications.yaml) | M | `scripts/sync-outcomes.ts` |

**Deliverables**:
- Track funnel stages per variant
- One-click status updates in dashboard
- Basic metrics (response rate, interview rate)

### Phase 2: Attribution

**Scope**: Connect content choices to outcomes

| Task | Effort | Output |
|------|--------|--------|
| Add `content_features` schema | S | Zod schema |
| Auto-populate features during generation | M | Update `generate-cv.ts` |
| Add JD features extraction | M | Update `analyze-jd.ts` |
| Build correlation report | L | `scripts/analyze-outcomes.ts` |

**Deliverables**:
- Every variant tracks which achievements/stats/styles were used
- Correlation report: "This achievement → X% response rate"

### Phase 3: Analytics & Insights

**Scope**: Actionable recommendations

| Task | Effort | Output |
|------|--------|--------|
| Analytics dashboard tab | L | New UI section |
| Statistical significance testing | M | Confidence intervals |
| Recommendation engine | L | Rules-based insights |
| Export for RL training | M | CSV/JSON export script |

**Deliverables**:
- Visual analytics in dashboard
- Statistically valid insights
- RL-ready data export

### Phase 4: RL Integration (Future)

**Scope**: Close the learning loop

| Task | Effort | Output |
|------|--------|--------|
| Define reward function | M | Weighted stage rewards |
| Build training data pipeline | L | Feature extraction |
| Integrate with content generation | XL | RL-guided variant creation |

---

## 7. Scripts Specification

### 7.1 `update-outcome.ts`

```bash
# Update variant stage
npm run outcome:update galaxy-pm --stage interview_1 --date 2025-01-25

# Record response
npm run outcome:update galaxy-pm --response --date 2025-01-18

# Record rejection
npm run outcome:update galaxy-pm --rejected --at-stage phone_screen

# Record offer
npm run outcome:update galaxy-pm --offer

# Add feedback
npm run outcome:feedback galaxy-pm --resonated "15x revenue growth"
```

### 7.2 `sync-outcomes.ts`

```bash
# Sync variant metadata ↔ applications.yaml
npm run outcome:sync

# Validate consistency
npm run outcome:validate
```

### 7.3 `analyze-outcomes.ts`

```bash
# Generate correlation report
npm run outcome:analyze

# Export for RL training
npm run outcome:export --format csv --output training-data.csv
```

---

## 8. API Design (Dashboard Backend)

If dashboard becomes dynamic (not static HTML):

```typescript
// POST /api/outcome/update
interface UpdateOutcomeRequest {
  variant: string;
  stage?: FunnelStage;
  result?: OutcomeResult;
  timestamp?: string;
}

// GET /api/outcome/metrics
interface MetricsResponse {
  response_rate: number;
  interview_rate: number;
  offer_rate: number;
  avg_days_to_response: number;
  by_source: Record<ApplicationSource, SourceMetrics>;
  by_domain: Record<string, DomainMetrics>;
}

// GET /api/outcome/insights
interface InsightsResponse {
  best_performers: Insight[];
  underperformers: Insight[];
  recommendations: Recommendation[];
}
```

---

## 9. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Tracking adoption | 100% of applications tracked | Count of records |
| Data completeness | >80% with source attribution | Fields filled |
| Time to update | <30 seconds per status change | UX testing |
| Insights accuracy | Validated by user | Qualitative |
| RL readiness | Export passes schema validation | Automated test |

---

## 10. Dependencies

| Dependency | Reason | Risk |
|------------|--------|------|
| Zod | Schema validation | None (already used) |
| YAML | Data storage | None (already used) |
| Dashboard rebuild | UI changes | Medium |
| User discipline | Data entry | High (mitigate with UX) |

---

## 11. Open Questions

1. **Static vs. Dynamic Dashboard**: Should dashboard call an API or regenerate static HTML?
   - Static: Simpler, current approach, works with GitHub Pages
   - Dynamic: Real-time updates, but needs backend

2. **Notification for stale applications**: Alert if no update in X days?

3. **Privacy**: Should feedback contain interviewer names? Consider anonymization.

4. **Backup**: Auto-commit applications.yaml changes?

---

## 12. References

- [RepoNavigator Paper](https://arxiv.org/abs/2512.20957) - RL for repository-level agents
- [Current Dashboard](scripts/generate-dashboard.ts)
- [Applications Template](capstone/deliver/applications.yaml)
- [Variant Schema](src/lib/schemas.ts)

---

## Appendix A: RL Training Data Format

For future RL model training, export data as:

```json
{
  "samples": [
    {
      "state": {
        "jd_features": { "domain": "crypto", "level": "senior", ... },
        "available_achievements": ["ankr-15x", "eth-staking", ...],
        "available_case_studies": ["galaxy-compliance", ...]
      },
      "action": {
        "selected_achievements": ["ankr-15x", "eth-staking"],
        "selected_case_studies": ["galaxy-compliance"],
        "hero_style": "metrics_forward",
        "primary_stat": "15×"
      },
      "reward": 0.7,
      "outcome": "interview_1",
      "metadata": {
        "variant": "galaxy-pm",
        "applied_at": "2025-01-15",
        "source": "referral"
      }
    }
  ]
}
```

---

## Appendix B: Dashboard Mockup

```
╔═══════════════════════════════════════════════════════════════════════════╗
║  CV Dashboard                                              [Logout]       ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐     ║
║  │ Response     │ │ Interview    │ │ Offer        │ │ Avg Response │     ║
║  │    47%       │ │    27%       │ │    7%        │ │   4.2 days   │     ║
║  │   ▲ +12%     │ │   ▲ +5%      │ │   ─ 0%       │ │  ▼ -1.3      │     ║
║  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘     ║
║                                                                           ║
║  [🔍 Search...                    ] [All ▼] [All Sources ▼] [Analytics]  ║
║                                                                           ║
║  ┌─────────────────────────────────────────────────────────────────────┐ ║
║  │ Galaxy                                         Jan 15    Interview 1 │ ║
║  │ Product Manager                                ████████░░ Day 15     │ ║
║  │ [View] [Resume] [JD] [Update ▼]                          via Referral│ ║
║  └─────────────────────────────────────────────────────────────────────┘ ║
║                                                                           ║
║  ┌─────────────────────────────────────────────────────────────────────┐ ║
║  │ Anthropic                                      Jan 10    Response    │ ║
║  │ AI Safety Fellow                               ████░░░░░░ Day 20     │ ║
║  │ [View] [Resume] [JD] [Update ▼]                          via LinkedIn│ ║
║  └─────────────────────────────────────────────────────────────────────┘ ║
║                                                                           ║
║  ┌─────────────────────────────────────────────────────────────────────┐ ║
║  │ Stripe                                         Jan 8     Rejected    │ ║
║  │ Platform PM                                    at Phone Screen       │ ║
║  │ [View] [Resume] [JD] [Feedback]                          via Careers │ ║
║  └─────────────────────────────────────────────────────────────────────┘ ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
```
