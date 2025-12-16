# Portfolio Codebase Context

> **For AI Agents**: This document provides comprehensive context about the codebase architecture, conventions, and recent work to enable effective onboarding.

---

## Project Overview

**Name**: Dmitrii Fotesco's Portfolio  
**Stack**: React 19 + TypeScript + Vite  
**Purpose**: Personal portfolio showcasing PM/engineering work with case studies  
**URL**: https://github.com/fotescodev/portfolio

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
│   └── variants/                     # 🆕 Personalized variants
│       ├── README.md
│       ├── _template.yaml
│       ├── bloomberg-technical-product-manager.{yaml,json}
│       └── gensyn-technical-product-manager.{yaml,json}
├── scripts/
│   ├── validate-content.ts           # Content validation CLI
│   └── generate-cv.ts                # 🆕 Variant generation CLI
├── docs/
│   ├── guides/
│   │   ├── adding-case-studies.md
│   │   └── universal-cv.md           # 🆕 Universal CV guide
│   └── CONTENT.md
├── context/
│   ├── AGENT_RULES.md                # AI agent governance rules
│   ├── CODEBASE.md                   # This file - architecture docs
│   ├── DESIGN.md                     # Design system documentation
│   ├── DEVLOG.md                     # Developer log (session history)
│   └── ROADMAP.md                    # Project roadmap
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
- `scripts/generate-cv.ts` - CLI generator (243 lines)
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
npm run generate:cv -- \
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

```bash
npm run dev              # Start dev server (port 5174)
npm run build            # Production build
npm run test:design-system  # Run design tests
npm run lint             # ESLint
```
