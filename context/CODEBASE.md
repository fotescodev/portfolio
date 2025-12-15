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
│   │   ├── ThemeToggle.tsx           # Theme switcher component
│   │   ├── sections/                 # Page sections
│   │   │   ├── HeroSection.tsx
│   │   │   ├── AboutSection.tsx
│   │   │   ├── ExperienceSection.tsx
│   │   │   ├── CertificationsSection.tsx
│   │   │   ├── SocialSection.tsx
│   │   │   ├── FooterSection.tsx
│   │   │   └── CaseStudyModal.tsx    # 634 lines, largest component
│   │   └── ui/                       # Reusable UI components
│   ├── context/
│   │   └── ThemeContext.tsx          # Theme provider (dark/light)
│   ├── styles/
│   │   └── globals.css               # Design system tokens
│   ├── tests/
│   │   ├── setup.ts                  # Test configuration
│   │   └── design-system/           # Design system test suite
│   ├── types/                        # TypeScript interfaces
│   └── lib/                          # Utilities
├── content/
│   └── profile.yaml                  # Content data
├── context/
│   ├── AGENT_RULES.md           # AI agent governance rules
│   ├── CODEBASE.md              # This file - architecture docs
│   ├── DESIGN.md                # Design system documentation
│   ├── DEVLOG.md                # Developer log (session history)
│   └── ROADMAP.md               # Project roadmap
└── vitest.config.ts                 # Test configuration
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
