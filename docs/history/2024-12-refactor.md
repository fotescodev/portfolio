# Portfolio Refactoring: Data-Driven Architecture

Transform the 3001-line `Portfolio.tsx` into a maintainable, pluggable system where content is managed via YAML files—optimized for AI agent parsing and community remixing.

---

## Current State Analysis

| Content Type   | Current Location          | Lines  | Items           |
|----------------|---------------------------|--------|-----------------|
| Case Studies   | Portfolio.tsx:116-285     | ~170   | 4               |
| Experience     | Portfolio.tsx:861-921     | ~60    | 5               |
| Testimonials   | Portfolio.tsx:1660-1805   | ~145   | 2               |
| Certifications | Portfolio.tsx:1064-1200   | ~136   | 1               |
| Skills         | Portfolio.tsx:1243-1289   | ~46    | 4 categories    |
| Social Links   | Portfolio.tsx:1940-1983   | ~43    | 2               |
| Hero/About     | Portfolio.tsx:510-820     | ~310   | Static text     |
| Section Flags  | Portfolio.tsx:111-114     | 4      | Boolean toggles |

**Total hardcoded content: ~900 lines embedded in JSX.**

---

## Key Decisions

| Question              | Decision                    | Rationale                                                                 |
|-----------------------|-----------------------------|---------------------------------------------------------------------------|
| **YAML vs JSON**      | ✅ YAML                     | More readable, supports comments, AI agents parse both equally well       |
| **File structure**    | ✅ Individual files         | One case study per file for easier management                             |
| **Vite plugin**       | ✅ `@rollup/plugin-yaml`    | Build-time validation, type safety, tree-shaking                          |
| **Experience source** | ✅ Manual YAML (future: PDF)| Resume PDF → YAML is future feature                                       |

---

## Directory Structure

```
content/
├── profile.yaml              # Personal info, hero, about, section flags
├── case-studies/             # One file per case study (enhanced schema)
│   ├── 01-eth-staking.yaml
│   ├── 02-protocol-integration.yaml
│   ├── 03-xbox-royalties.yaml
│   └── 04-ankr-rpc.yaml
├── experience/
│   └── index.yaml            # All jobs in one file
├── testimonials/
│   └── index.yaml
├── certifications/
│   └── index.yaml
├── skills/
│   └── index.yaml
├── social/
│   └── index.yaml
└── blog/                     # Already exists
    └── *.md
```

---

## Enhanced Case Study Schema

The case study schema is designed to drive recruiter engagement and conversions with:
- **Hook**: Grab attention in 3 seconds with impact metrics
- **Context**: Role clarity showing YOUR specific contribution
- **Problem**: Make the challenge tangible with constraints and stakes
- **Approach**: Show thinking depth with alternatives considered
- **Execution**: Concrete actions proving you can ship
- **Results**: Quantified impact with primary/secondary/tertiary metrics
- **Reflection**: Honest self-assessment (what worked AND what didn't)
- **Evidence**: Proof points (demo, github, blog, testimonials)
- **CTA**: Contextual call-to-action per case study

### Full Case Study YAML Schema

```yaml
# IDENTIFICATION
id: 1
slug: "institutional-eth-staking"
title: "Institutional ETH Staking"
company: "Anchorage Digital"
year: "2024–25"
tags: ["Staking", "Custody", "ETF-Grade"]

# HOOK - Grab attention in 3 seconds
hook:
  headline: "Built ETF-grade staking infrastructure for institutional clients"
  impactMetric:
    value: "Zero"
    label: "slashing events"
  subMetrics:
    - value: "Galaxy+"
      label: "institutional clients"
    - value: "<0.1%"
      label: "yield gap vs market"
  thumbnail: "/images/case-study-eth-staking.png"
  thumbnailAlt: "Architecture diagram"

# CONTEXT - Role clarity
context:
  myRole: "Senior Product Manager"
  teamSize: "6 engineers + compliance + legal"
  duration: "6 months"
  stakeholders:
    - "Galaxy Digital (client)"
    - "Internal compliance & legal teams"

# PROBLEM - Make them feel the pain
problem:
  businessContext: "ETF providers wanted staking yield but couldn't use consumer solutions..."
  constraints:
    - "Full custody key ownership required"
    - "Must pass SOC 2 and regulatory audits"
    - "Zero tolerance for slashing events"
  stakes: "Losing institutional client to slashing would damage reputation..."

# APPROACH - Show thinking depth
approach:
  hypothesis: "In-house validators with compliance-first design..."
  alternatives:
    - option: "Third-party staking provider"
      tradeoffs: "Faster launch but custody concerns"
      whyNot: "Key control non-negotiable for ETF compliance"
  chosenPath: "In-house multi-client with Web3Signer"

# EXECUTION - Concrete actions
execution:
  phases:
    - name: "Discovery & Requirements"
      duration: "6 weeks"
      actions:
        - "Conducted 12+ client calls"
        - "Mapped compliance requirements"
  keyDecision:
    title: "In-house vs staking-as-a-service"
    context: "Leadership wanted faster launch"
    decision: "Chose in-house for key control"
    outcome: "Galaxy cited this as why they chose us"

# RESULTS - Quantified impact
results:
  primary:
    metric: "Zero slashing events"
    context: "Since launch"
  secondary:
    metric: "Galaxy + clients onboarded"
    context: "Billions in AUM"
  qualitative: "Set internal standard for custody products"

# REFLECTION - Shows self-awareness (CRITICAL for credibility)
reflection:
  whatWorked:
    - "Compliance involvement from day 1"
    - "Galaxy as design partner"
  whatDidnt:
    - "Underestimated client diversity overhead"
    - "Over-engineered first slashing design"
  lessonLearned: "Competitive moat is trust, not innovation"
  wouldDoDifferently: "Formal compliance design review gate"

# EVIDENCE - Proof points
evidence:
  demoUrl: null
  githubUrl: null
  blogPostUrl: "/blog/etf-grade-staking"
  testimonial:
    quote: "Custody-first approach was exactly what we needed"
    author: "Institutional Client"
    role: "Head of Digital Assets"
    company: "Asset Manager"
  artifacts:
    - type: "diagram"
      src: "/images/eth-staking-architecture.png"
      alt: "Validator architecture"
      caption: "Multi-client setup"

# CTA - Drive action (contextual per case study)
cta:
  headline: "Building institutional crypto infrastructure?"
  subtext: "Let's discuss compliance-first product thinking"
  action: "calendly"
  linkText: "Let's talk →"

# TECH STACK
techStack:
  - "Ethereum"
  - "Web3Signer"
  - "MPC Custody"
```

---

## Other Content Schemas

### profile.yaml

```yaml
name: "Dmitrii Fotesco"
ens: "dmitriif.eth"
email: "dmitrii.fotesco@gmail.com"
location: "Charlotte, NC"
photo: "/images/headshot.jpg"

hero:
  status: "Open to PM roles — AI, Infrastructure, Web3"
  headline:
    - { text: "Building", style: "italic" }
    - { text: "at the edge of", style: "muted" }
    - { text: "trust", style: "accent" }
  subheadline: "Senior Technical PM shipping institutional crypto infrastructure..."
  cta:
    primary: { label: "View Work", href: "#work" }
    secondary: { label: "Download Resume", href: "/dmitrii-fotesco-resume.pdf" }

about:
  tagline: "Eight years shipping products where complexity meets compliance."
  bio:
    - "Currently at Anchorage Digital..."
    - "Started in enterprise blockchain at Microsoft..."
  stats:
    - { value: "8+", label: "Years in Product" }
    - { value: "5", label: "Years in Web3" }
    - { value: "6", label: "Companies Shipped" }

sections:
  beyondWork: false
  blog: true
  onchainIdentity: false
  skills: false
```

### experience/index.yaml

```yaml
jobs:
  - company: "Anchorage Digital"
    role: "Senior Product Manager"
    period: "2024 – Present"
    location: "Remote"
    highlights:
      - "Leading ETH staking and protocol integrations"
      - "Shipped 7+ L2 protocol integrations"
    tags: ["Staking", "L2s", "Institutional Custody"]
```

### testimonials/index.yaml

```yaml
testimonials:
  - quote: "Dmitrii has exceptional ability to translate complex requirements..."
    author: "Engineering Lead"
    role: "Former colleague"
    company: "Anchorage Digital"
    featured: true
```

### social/index.yaml

```yaml
links:
  - platform: "linkedin"
    label: "LinkedIn"
    url: "https://linkedin.com/in/dmitriifotesco"
    primary: true

contactCta:
  headline: "Let's build something together"
  subtext: "Open to PM roles in AI, Infrastructure, and Web3"
  buttons:
    - { label: "Get in Touch", href: "mailto:...", style: "primary" }
```

---

## Component Extraction Plan

| Component               | Source Lines        | Description                    |
|-------------------------|---------------------|--------------------------------|
| `HeroSection.tsx`       | 510-680            | Headline, status, CTAs         |
| `AboutSection.tsx`      | 680-860            | Photo, bio, stats              |
| `ExperienceSection.tsx` | 860-1060           | Job timeline                   |
| `CertificationsSection.tsx` | 1060-1240      | Certs and credentials          |
| `CaseStudiesSection.tsx`| 1240-1660          | Work cards grid                |
| `CaseStudyModal.tsx`    | 2200-2800          | Full-page modal (enhanced)     |
| `TestimonialsSection.tsx`| 1660-1940         | Quotes carousel                |
| `FooterSection.tsx`     | 1940-2100          | Contact CTA, social links      |

**Target: Reduce Portfolio.tsx from 3001 → ~400 lines**

---

## Implementation Progress

### Phase 1: Setup
- [x] Install `@rollup/plugin-yaml`
- [x] Create `src/types/portfolio.ts`
- [x] Configure Vite for YAML imports
- [x] Create `src/types/yaml.d.ts` (TypeScript declarations)

### Phase 2: Content Migration
- [x] Create `content/profile.yaml`
- [x] Create `content/experience/index.yaml`
- [x] Create `content/testimonials/index.yaml`
- [x] Create `content/certifications/index.yaml`
- [x] Create `content/skills/index.yaml`
- [x] Create `content/social/index.yaml`
- [x] Create case study YAML files (4) - **Enhanced with full schema**

### Phase 3: Content Loader
- [x] Create `src/lib/content.ts`

### Phase 4: Component Extraction
- [x] Extract `HeroSection.tsx`
- [x] Extract `AboutSection.tsx`
- [x] Extract `ExperienceSection.tsx`
- [x] Extract `CertificationsSection.tsx`
- [x] Extract `TestimonialsSection.tsx`
- [x] Extract `SocialSection.tsx`
- [x] Extract `CaseStudiesSection.tsx` - ✅ Done (hover state + modal triggers as props)
- [x] Extract `CaseStudyModal.tsx` - ✅ Done (~630 lines, clean UX with narrative flow)
- [x] Extract `FooterSection.tsx` - ✅ Done (~35 lines)

### Phase 5: Integration
- [x] Refactor `Portfolio.tsx` as orchestrator (~450 lines, down from 3001)
- [x] Verify build succeeds
- [ ] Verify all sections render
- [ ] Verify dark/light mode
- [ ] Verify mobile responsiveness

---

## Verification Checklist

- [x] `npm run build` succeeds
- [ ] All sections render correctly
- [ ] Case study modal works with new schema
- [ ] Adding new YAML file shows content without code changes
- [ ] Dark/light mode adapts properly
- [ ] Mobile responsive at 375px
- [ ] Blog section still works
- [ ] All links functional

---

## Files Created

### Types
- `src/types/portfolio.ts` - Full TypeScript interfaces
- `src/types/yaml.d.ts` - YAML import declarations

### Content (YAML)
- `content/profile.yaml` - Hero, about, section flags
- `content/experience/index.yaml` - 5 jobs with highlights
- `content/testimonials/index.yaml` - 2 featured testimonials
- `content/certifications/index.yaml` - Certs + credentials + onchain identity
- `content/skills/index.yaml` - 4 skill categories
- `content/social/index.yaml` - Links + contact CTA + newsletter

### Case Studies (Enhanced Schema)
- `content/case-studies/01-eth-staking.yaml`
- `content/case-studies/02-protocol-integration.yaml`
- `content/case-studies/03-xbox-royalties.yaml`
- `content/case-studies/04-ankr-rpc.yaml`

### Components
- `src/components/sections/HeroSection.tsx`
- `src/components/sections/AboutSection.tsx`
- `src/components/sections/ExperienceSection.tsx`
- `src/components/sections/CertificationsSection.tsx`
- `src/components/sections/TestimonialsSection.tsx`
- `src/components/sections/SocialSection.tsx`
- `src/components/sections/CaseStudiesSection.tsx` - Case study cards with hover state
- `src/components/sections/CaseStudyModal.tsx` - Full-page modal with 15 sections
- `src/components/sections/FooterSection.tsx` - Copyright + designer credit
- `src/components/sections/index.ts` - Barrel export

### Infrastructure
- `src/lib/content.ts` - YAML content loader with helpers
- `vite.config.ts` - Updated with YAML plugin

---

## Implementation Log

### Session 1: 2024-12-11

**Completed:**
- Full YAML infrastructure setup
- All content files created with enhanced case study schema
- 6 of 8 section components extracted
- Content loader with type-safe imports

**Key Decisions:**
- Enhanced case study schema with: Problem (constraints + stakes), Approach (alternatives + hypothesis), Reflection (whatWorked + whatDidnt), Evidence (demo/github/blog links), contextual CTAs
- Kept certifications extended with `instructor` and `instructorRole` fields
- Added `initials` field to testimonials for avatar fallback

**Remaining Work:**
- CaseStudiesSection.tsx - Complex because it manages hover state and modal triggers
- CaseStudyModal.tsx - Needs to be updated for new enhanced schema (reflection, approach alternatives, etc.)
- FooterSection.tsx - Simple extraction
- Portfolio.tsx refactor - Wire up all components
- Build verification

**Build Status:** ✅ Passing

**Next Steps:**
1. ✅ Extract CaseStudiesSection.tsx (completed)
2. Extract CaseStudyModal.tsx (needs update for enhanced schema with reflection, alternatives)
3. Extract FooterSection.tsx
4. Refactor Portfolio.tsx as thin orchestrator
5. Visual verification and testing

---

## Detailed Implementation Plan (Completed)

### Task 1: Extract CaseStudyModal.tsx (Enhanced Schema)

**File:** `src/components/sections/CaseStudyModal.tsx`

**Props Interface:**
```typescript
interface CaseStudyModalProps {
  study: CaseStudy | null;
  onClose: () => void;
  onNavigate: (study: CaseStudy) => void;
  isMobile: boolean;
}
```

**Sections to Render (in order):**

1. **Header** (existing)
   - Back button, close button
   - Case number + title + company/year

2. **Hero Artifact** (existing, enhance)
   - Display `evidence.artifacts[0]` if available
   - Show placeholder with icon based on artifact type

3. **Metrics Row** (update to new schema)
   - Primary: `results.primary.metric` + `results.primary.context`
   - Secondary: `results.secondary.metric` + `results.secondary.context`
   - Tertiary: `results.tertiary?.metric` + `results.tertiary?.context`

4. **Role & Context** (update)
   - My Role: `context.myRole`
   - Team: `context.teamSize`
   - Duration: `context.duration`
   - Stakeholders: `context.stakeholders[]` (NEW - render as pills)

5. **The Challenge** (update to new schema)
   - Render `problem.businessContext`
   - NEW: Constraints section with `problem.constraints[]`
   - NEW: Stakes callout with `problem.stakes`

6. **Key Decision Callout** (update)
   - `execution.keyDecision.title`
   - `execution.keyDecision.context`
   - `execution.keyDecision.decision`
   - `execution.keyDecision.outcome`

7. **NEW: Approach Section**
   - Hypothesis: `approach.hypothesis`
   - Alternatives Considered table:
     | Option | Tradeoffs | Why Not? |
     | --- | --- | --- |
     | `approach.alternatives[].option` | `.tradeoffs` | `.whyNot` |
   - Chosen Path: `approach.chosenPath`

8. **Execution Phases** (NEW)
   - Timeline visualization of `execution.phases[]`
   - Each phase: name, duration, actions as bullets

9. **What I Did** → Rename to "Actions" or keep but source from `execution.phases[].actions`

10. **Results** (update)
    - Primary/secondary/tertiary with context
    - `results.qualitative` as prose

11. **NEW: Reflection Section** (CRITICAL for credibility)
    ```
    ## What Worked
    - reflection.whatWorked[]

    ## What Didn't Work
    - reflection.whatDidnt[]

    ## Key Lesson
    reflection.lessonLearned

    ## What I'd Do Differently
    reflection.wouldDoDifferently
    ```

12. **Evidence Section** (NEW)
    - Testimonial quote if `evidence.testimonial` exists
    - Links row: Demo | GitHub | Blog Post (only show if not null)
    - Additional artifacts gallery

13. **Tech Stack** (existing)
    - `techStack[]`

14. **CTA Section** (NEW - per case study)
    - `cta.headline`
    - `cta.subtext`
    - Button based on `cta.action` (calendly/contact/linkedin)

15. **Navigation** (existing)
    - Previous/Next case study buttons

**Visual Design Notes:**
- Reflection section needs special styling (green checkmarks for whatWorked, amber warning for whatDidnt)
- Approach alternatives as expandable accordion or table
- Constraints as bordered pill badges
- Stakes as a subtle callout box (not alarming, but notable)

---

### Task 2: Extract FooterSection.tsx

**File:** `src/components/sections/FooterSection.tsx`

**Simple extraction from Portfolio.tsx lines 2970-2997:**
- Copyright year
- "Designed and built by Dmitrii"

**Props:**
```typescript
interface FooterSectionProps {
  isMobile: boolean;
}
```

---

### Task 3: Refactor Portfolio.tsx as Orchestrator

**Target:** Reduce from ~3000 lines to ~400 lines

**Final Structure:**
```tsx
export default function Portfolio() {
  // State
  const [hoveredCase, setHoveredCase] = useState<number | null>(null);
  const [modalCase, setModalCase] = useState<CaseStudy | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // ... other UI state

  // Responsive helpers
  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;
  const sectionPadding = ...;

  // Section visibility from YAML
  const { sections } = profile;

  return (
    <div>
      {/* Background, Navigation */}
      <Navigation ... />

      {/* Sections from components */}
      <HeroSection ... />
      <AboutSection ... />
      <ExperienceSection ... />
      <CertificationsSection ... />
      <CaseStudiesSection
        hoveredCase={hoveredCase}
        setHoveredCase={setHoveredCase}
        onCaseClick={(study) => setModalCase(study)}
        ...
      />
      <TestimonialsSection ... />
      {sections.blog && <Blog ... />}
      <SocialSection ... />
      <FooterSection ... />

      {/* Modal */}
      {modalCase && (
        <CaseStudyModal
          study={modalCase}
          onClose={() => setModalCase(null)}
          onNavigate={(study) => setModalCase(study)}
          ...
        />
      )}
    </div>
  );
}
```

**Keep in Portfolio.tsx:**
- Navigation component (could extract later)
- Background orbs/grid (could extract later)
- Mobile menu overlay
- Modal scroll lock effect
- All state management

**Delete from Portfolio.tsx:**
- All hardcoded data arrays (caseStudies, credentials, etc.)
- All section JSX (replaced by component imports)
- Old CaseStudy interface (use from types/portfolio.ts)

---

### Verification Checklist

After completing all tasks:
- [ ] `npm run build` succeeds
- [ ] All sections render correctly
- [ ] Case study modal shows ALL enhanced schema fields
- [ ] Modal shows reflection section (whatWorked/whatDidnt)
- [ ] Modal shows approach alternatives
- [ ] Modal shows evidence links (demo/github/blog)
- [ ] Dark/light mode works
- [ ] Mobile responsive (375px)
- [x] Navigation between case studies works
- [x] ESC key closes modal

---

## Session Log

### Session 2: 2024-12-12

**Completed:**
- CaseStudyModal.tsx (~630 lines) - Clean UX redesign with narrative flow:
  - Hero (meta line, title, role)
  - Full-width metrics bar
  - Story (challenge, stakes quote, approach, solution)
  - Key Decision (accent callout)
  - Execution timeline with phase actions joined by " · "
  - Results (inline format: metric — context)
  - Key Lesson quote
  - Reflection (two-column: worked/didn't)
  - Testimonial
  - Footer meta (links, stack, constraints inline)
  - CTA and navigation
- FooterSection.tsx (~39 lines) - Copyright + designer credit
- Portfolio.tsx refactored as orchestrator (~450 lines, down from 3001)
- Updated barrel export in index.ts

**UX Design Decisions:**
- Removed excessive visual boxes/borders in favor of typography hierarchy
- Execution phases use " · " separator instead of bullet lists
- Results displayed inline rather than in separate boxes
- Two-column compact reflection section
- Tech stack and constraints as inline text, not pills/badges

**Build Status:** ✅ Passing
