# Portfolio Codebase Context

> **For AI Agents**: This document provides comprehensive context about the codebase architecture, conventions, and recent work to enable effective onboarding.

---

## Project Overview

**Name**: Dmitrii Fotesco's Portfolio  
**Stack**: React 19 + TypeScript + Vite  
**Purpose**: Personal portfolio showcasing PM/engineering work with case studies  
**URL**: https://github.com/fotescodev/portfolio

---

## Technical Constraints

| Metric | Limit | Rationale |
|--------|-------|-----------|
| **Initial Bundle** | < 200KB (Gzipped) | SEO & Mobile LCP performance |
| **Animation Rate** | 60 FPS | Premium "smooth" feel requirement |
| **Type Safety** | 100% Zod | Data integrity for YAML-to-JSON pipeline |

---

## Architecture

### Directory Structure

```
portfolio/
├── src/
│   ├── components/
│   │   ├── Portfolio.tsx             # Main portfolio component
│   │   ├── ThemeToggle.tsx           # Theme switcher component
│   │   ├── sections/                 # Page sections
│   │   │   ├── HeroSection.tsx       # Receives profile prop
│   │   │   ├── AboutSection.tsx      # Receives profile prop
│   │   │   ├── ExperienceSection.tsx
│   │   │   ├── CertificationsSection.tsx  # Receives profile prop
│   │   │   ├── PassionProjectsSection.tsx
│   │   │   ├── SocialSection.tsx
│   │   │   ├── FooterSection.tsx
│   │   │   └── CaseStudiesSection.tsx
│   │   ├── case-study/              # Case study components
│   │   │   ├── CaseStudyDrawer.tsx
│   │   │   ├── CaseStudyContent.tsx
│   │   │   └── CaseStudyFooter.tsx
│   │   └── common/                   # Reusable UI components
│   │       ├── AmbientBackground.tsx
│   │       └── Omnibar.tsx
│   ├── pages/                        # Route pages
│   │   ├── BasePortfolio.tsx         # Base portfolio (/#/)
│   │   └── VariantPortfolio.tsx      # Personalized variants (/#/company/role)
│   ├── context/
│   │   ├── ThemeContext.tsx          # Theme provider (dark/light)
│   │   └── VariantContext.tsx        # 🆕 Variant profile injection
│   ├── lib/
│   │   ├── content.ts                # Content loader (Vite import.meta.glob)
│   │   ├── schemas.ts                # Zod validation schemas
│   │   └── variants.ts               # 🆕 Variant loading & merging
│   ├── types/
│   │   ├── portfolio.ts              # Portfolio type definitions
│   │   └── variant.ts                # 🆕 Variant type definitions
│   ├── styles/
│   │   └── globals.css               # Design system tokens
│   └── tests/
│       ├── setup.ts                  # Test configuration
│       ├── design-system/            # Design system test suite
│       └── mobile/                   # Mobile responsiveness tests
├── content/
│   ├── profile.yaml                  # Base profile data
│   ├── experience/index.yaml
│   ├── case-studies/*.md
│   ├── blog/*.md
│   ├── knowledge/                    # 🆕 Source of truth for facts
│   │   ├── index.yaml                # Entity relationships
│   │   ├── achievements/             # STAR-format accomplishments
│   │   └── stories/                  # Extended narratives
│   └── variants/                     # Personalized variants
│       ├── README.md
│       ├── _template.yaml
│       ├── bloomberg-technical-product-manager.{yaml,json}
│       └── gensyn-technical-product-manager.{yaml,json}
├── scripts/
│   ├── validate-content.ts           # Content validation CLI
│   ├── generate-variant.ts            # Variant generation CLI
│   ├── sync-variants.ts              # 🆕 YAML→JSON sync
│   ├── evaluate-variants.ts          # 🆕 Claims ledger generator
│   └── redteam.ts                    # 🆕 Adversarial scanner
├── capstone/                         # 🆕 AI Product Quality Framework
│   ├── develop/
│   │   ├── evaluation.md             # Evaluation rubric
│   │   ├── red-teaming.md            # Threat model
│   │   ├── evals/                    # Claims ledgers per variant
│   │   └── redteam/                  # Red team reports per variant
│   ├── define/
│   ├── discover/
│   └── deliver/
├── docs/
│   ├── guides/
│   │   ├── adding-case-studies.md
│   │   ├── capstone-workflow.md      # Quality pipeline guide
│   │   ├── content-management.md     # Content schema guide
│   │   ├── cv-data-ingestion.md
│   │   ├── universal-cv-cli.md       # CLI tools guide
│   │   └── universal-cv.md           # Universal CV guide
│   ├── personal/                     # Personal docs (not for AI agents)
│   └── history/                      # Archived docs
├── context/
│   ├── CODEBASE.md                   # This file - architecture docs
│   ├── DESIGN.md                     # Design system documentation
│   └── PROJECT_STATE.md              # Single source of truth (strategic + session log)
└── vitest.config.ts                  # Test configuration
```

### Key Patterns

1. **Inline Styles with CSS Variables**: Components use inline `style` props with CSS variables
   ```tsx
   style={{ color: 'var(--color-text-primary)' }}
   ```

2. **Theme via data-attribute**: Theme switching uses `data-theme` on `<html>`
   ```css
   [data-theme="light"] { --color-background: #fafafa; }
   ```

3. **ThemeContext**: Provides `isDark`, `toggleTheme`, `theme` - but NOT colors (deprecated)

4. **Universal CV - Variant System**: Portfolio personalization for job applications
   - Base profile + variant overrides = personalized experience
   - Dynamic routes via HashRouter (`/#/:company/:role`)
   - VariantContext provides merged profile to components
   - Sections receive `profile` prop from context (not direct imports)

---

## Universal CV System

### Overview

The Universal CV system creates personalized portfolio variants tailored to specific job applications using AI-generated overrides of the base profile.

**Live Examples:**
- Base: `https://edgeoftrust.com/#/`
- Bloomberg TPM: `https://edgeoftrust.com/#/bloomberg/technical-product-manager`
- Gensyn TPM: `https://edgeoftrust.com/#/gensyn/technical-product-manager`

### Architecture

**Data Flow:**
```
URL (/#/company/role)
  → React Router captures params
  → VariantPortfolio.tsx loads variant JSON
  → variants.ts: mergeProfile(base + overrides)
  → VariantContext provides merged profile
  → Portfolio.tsx receives from context
  → Sections (Hero, About, etc.) receive profile prop
  → Personalized content rendered
```

**Key Files:**
- `src/context/VariantContext.tsx` - Profile injection system
- `src/pages/VariantPortfolio.tsx` - Dynamic variant loader
- `src/lib/variants.ts` - Loading + merging logic
- `src/types/variant.ts` - Type definitions
- `scripts/generate-variant.ts` - CLI generator
- `content/variants/*.{yaml,json}` - Variant data

### Variant Schema

```typescript
interface Variant {
  metadata: {
    company: string;
    role: string;
    slug: string;
    generatedAt: string;
    jobDescription: string;
    generationModel?: string;
  };
  overrides: {
    hero?: {
      status?: string;
      headline?: HeadlineSegment[];
      subheadline?: string;
    };
    about?: {
      tagline?: string;
      bio?: string[];
      stats?: Stat[];
    };
    sections?: {
      beyondWork?: boolean;
      blog?: boolean;
      onchainIdentity?: boolean;
      skills?: boolean;
      passionProjects?: boolean;
    };
  };
  relevance?: {
    caseStudies?: Array<{ slug: string; relevanceScore: number; reasoning?: string }>;
    skills?: Array<{ category: string; relevanceScore: number }>;
    projects?: Array<{ slug: string; relevanceScore: number; reasoning?: string }>;
  };
}
```

### Creating Variants

**CLI Generator:**
```bash
npm run generate:variant -- \
  --company "Company" \
  --role "Role Title" \
  --jd "./job-description.txt" \
  --provider gemini
```

**Supported Providers:**
- Claude (Anthropic): `ANTHROPIC_API_KEY`
- OpenAI: `OPENAI_API_KEY`
- Gemini (Google): `GEMINI_API_KEY`

### Component Integration

**IMPORTANT**: Sections that show personalized content MUST receive `profile` as a prop:

```tsx
// ✅ CORRECT - Receives profile from context
function HeroSection({ profile, isMobile }: { profile: Profile; isMobile: boolean }) {
  const { hero } = profile;  // Uses variant profile
  // ...
}

// ❌ INCORRECT - Direct import bypasses variants
import { profile } from '../lib/content';
function HeroSection({ isMobile }: { isMobile: boolean }) {
  const { hero } = profile;  // Always uses base profile!
  // ...
}
```

**Updated Components:**
- `HeroSection.tsx` - Receives `profile` prop
- `AboutSection.tsx` - Receives `profile` prop
- `CertificationsSection.tsx` - Receives `profile` prop

**In Portfolio.tsx:**
```tsx
const { profile } = useVariant();  // Get from context

<HeroSection profile={profile} isMobile={isMobile} ... />
<AboutSection profile={profile} isMobile={isMobile} ... />
```

### Routing

**HashRouter** (GitHub Pages compatible):
```tsx
// src/App.tsx
<HashRouter>
  <Routes>
    <Route path="/" element={<BasePortfolio />} />
    <Route path="/:company/:role" element={<VariantPortfolio />} />
  </Routes>
</HashRouter>
```

**Why Hash Routing?**
- GitHub Pages doesn't support server-side redirects
- Hash URLs (`/#/company/role`) handled client-side
- Fully shareable and bookmarkable
- Can switch to BrowserRouter on Vercel/Netlify with proper config

### Build Process

Variants are bundled as separate chunks for optimal loading:
```
dist/assets/
├── bloomberg-technical-product-manager-[hash].js  (4KB)
├── gensyn-technical-product-manager-[hash].js     (4KB)
└── index-[hash].js                                (main bundle)
```

Vite's `import.meta.glob` enables lazy loading:
```typescript
const variantFiles = import.meta.glob('../../content/variants/*.json', {
  eager: false  // Lazy load only when needed
});
```

---

## Capstone Quality Pipeline (NEW)

The capstone project wraps the Universal CV system with production-grade AI product evaluation.

### Core Concept

```
YAML is canonical → JSON is derived
Facts live in knowledge base → Variants reference them
Every claim must be traceable → Machine-checkable ledger
```

### Quality Scripts

| Script | Purpose | Command |
|--------|---------|---------|
| `sync-variants.ts` | YAML→JSON sync | `npm run variants:sync` |
| `evaluate-variants.ts` | Generate claims ledger | `npm run eval:variant -- --slug <slug>` |
| `redteam.ts` | Adversarial scanning | `npm run redteam:variant -- --slug <slug>` |

### Build Integration

```json
"predev": "npm run variants:sync",
"prebuild": "npm run validate && npm run variants:sync"
```

Every `npm run dev` and `npm run build` now enforces YAML/JSON parity.

### Knowledge Base

```
content/knowledge/
├── index.yaml           # Entity graph
├── achievements/        # STAR-format: Situation, Task, Action, Result
│   ├── ankr-15x-revenue.yaml
│   ├── eth-staking-zero-slashing.yaml
│   └── ...
└── stories/             # Extended narratives
```

**Golden Rule**: Fix facts in the knowledge base, not in the variant output.

### Claims Ledger

For each variant, the evaluation script extracts metric-like claims and generates:
- `capstone/develop/evals/<slug>.claims.yaml` — Machine-checkable
- `capstone/develop/evals/<slug>.eval.md` — Human checklist

```bash
npm run eval:variant -- --slug bloomberg-technical-product-manager
npm run eval:check  # Fails if unverified claims
```

### Red Team Checks

| Check ID | Catches |
|----------|---------|
| `RT-SEC-SECRETS` | API keys, tokens |
| `RT-SEC-CONFIDENTIAL` | NDA language |
| `RT-TONE-SYCOPHANCY` | "thrilled", "dream company" |
| `RT-ACC-INFLATION` | "about 15×" near metrics |
| `RT-XVAR-CONTAM` | Mentions other target company |

```bash
npm run redteam:variant -- --slug bloomberg-technical-product-manager
npm run redteam:check --strict  # WARN = FAIL
```

### PM Workflow

Work one variant at a time through the pipeline:
1. `npm run variants:sync`
2. `npm run eval:variant -- --slug <slug>`
3. Verify claims in `*.claims.yaml`
4. `npm run eval:check`
5. `npm run redteam:variant -- --slug <slug>`
6. `npm run redteam:check`
7. Fix KB or variant wording until clean
8. Commit + deploy

---

## Design System

### CSS Variables (globals.css)

| Category | Examples |
|----------|----------|
| **Colors** | `--color-background`, `--color-text-primary`, `--color-accent` |
| **Spacing** | `--space-xs` (4px) through `--space-3xl` (64px) |
| **Typography** | `--font-serif`, `--font-sans` |
| **Transitions** | `--ease-smooth`, `--transition-medium` |

### Theme Values

| Token | Dark Mode | Light Mode |
|-------|-----------|------------|
| `--color-background` | #08080a | #fafafa |
| `--color-text-primary` | #e8e6e3 | #050505 |
| `--color-accent` | #c29a6c | #8a6642 |

---

## Testing

### Framework: Vitest + Testing Library

**Run commands:**
```bash
npm run test:design-system  # Design system tests (29 tests)
npm run test                # All tests
npm run test:watch          # Watch mode
```

### Test Structure

| File | Tests | Purpose |
|------|-------|---------|
| `css-variables.test.ts` | 12 | Verify design tokens exist |
| `theme-toggle.test.tsx` | 6 | ThemeProvider functionality |
| `components.test.tsx` | 11 | Component render checks |

---

## Recent Work (Dec 2024)

### Design System Migration

**Objective**: Migrate from React context-based colors to CSS custom properties

**Changes Made:**
1. Created `src/styles/globals.css` with all design tokens
2. Updated `ThemeContext.tsx` to set `data-theme` attribute on `<html>`
3. Migrated 8 components to use CSS variables instead of `useTheme().colors`:
   - ThemeToggle.tsx
   - FooterSection.tsx
   - HeroSection.tsx
   - AboutSection.tsx
   - SocialSection.tsx
   - ExperienceSection.tsx
   - CertificationsSection.tsx
   - CaseStudyModal.tsx

**Git Commits:**
- `34a925e` - feat: migrate design system to CSS custom properties
- `1d5668e` - test: add design system test suite with Vitest

---

## Important Conventions

### DO ✅

- Use CSS variables for all colors: `var(--color-*)`
- Use spacing tokens: `var(--space-md)` not `16px`
- Use font variables: `var(--font-serif)` not hardcoded strings
- Run `npm run test:design-system` after design changes

### DON'T ❌

- Import `colors` from `useTheme()` - this is deprecated
- Use hardcoded hex colors in components
- Use `isDark` conditionals for colors (CSS handles this now)

---

## Dependencies

**Core:**
- react@19.2.0
- react-dom@19.2.0
- vite@7.2.4

**Dev/Testing:**
- vitest@3.2.4
- @testing-library/react
- @testing-library/jest-dom
- jsdom

---

## Useful Commands

### Shipping Workflow (PR-Only)
```bash
# 1. Create feature branch
git checkout -b feat/your-feature

# 2. Push work
git push origin feat/your-feature

# 3. Create Pull Request (via gh CLI)
gh pr create --title "feat: descriptive title" --body "context about changes"

# 4. Merge after approval
gh pr merge --squash
```
