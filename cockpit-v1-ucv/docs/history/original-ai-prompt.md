# Deep Analysis Prompt for AI Agent

**Role**: You are a Senior Technical Product Manager and Principal Engineer acting as a consultant for a high-level candidate (Director/Head of Product level) in the Web3/AI space.

**Objective**: Analyze the provided portfolio codebase to identify gaps that hinder the primary business outcome: **Creating a high-impact, "hired-on-sight" impression for potential leadership roles.**

---

## 1. Context & Resources

You have access to a React 19 + TypeScript codebase that uses a custom design system (CSS variables) and YAML-based content management.

**Key Documents to Read First:**
1. `context/CODEBASE.md`: Architecture, design system tokens, and testing setup.
2. `content/profile.yaml`: The core "identity" data source.
3. `src/lib/content.ts`: The data aggregation layer (Headless CMS pattern).
4. `src/styles/globals.css`: The design system source of truth.

**Current State:**
- ✅ **Design System**: Fully migrated to CSS custom properties (`var(--color-*)`). Dark/light mode works perfectly.
- ✅ **Testing**: Vitest suite covering design tokens and components (29 tests).
- ✅ **Content**: Structured in `content/*.yaml` files.

---

## 2. Your Mission

Perform a deep-dive audit across three dimensions and provide a prioritized roadmap.

### A. Business Outcome Gaps (The "Hired" Metric)
*   **Value Proposition**: Does the `profile.yaml` content effectively sell a "Senior Technical PM"? Is the "Bio" too generic?
*   **Social Proof**: The codebase has `content/testimonials` and `content/case-studies`. Are these sufficiently prominent? Does the current UX highlight them enough?
*   **Conversion**: Is the "Call to Action" (Contact/Resume) accessible at all moments?

### B. Design & UX Gaps (The "Wow" Factor)
*   *Constraint: The user requires "Rich Aesthetics" and specific "Orb/Glow" effects.*
*   **Micro-interactions**: The codebase has basic hover states. Where can we add Framer Motion or CSS animations to make it feel "alive" without hurting performance?
*   **Visual Hierarchy**: Review `CaseStudyModal.tsx`. It's a large component (600+ lines). Is the typography hierarchy (`Instrument Serif` vs `Sans`) effective for long-form reading?
*   **Theming**: We have `globals.css` with `[data-theme]`. Are there missed opportunities for theme-specific delights (e.g., different ambient backgrounds for dark vs light)?

### C. Technical & Maintainability Gaps
*   **Architecture**: `lib/content.ts` aggregates YAMLs. Is this type-safe enough? Should we add Zod validation to prevent build breaks if a YAML field is missing?
*   **Component Hygiene**: `CaseStudyModal.tsx` is huge. Propose a refactor strategy (e.g., `ModalHeader`, `ModalMetrics`).
*   **Performance**: Are images in `content/` optimized? Should we implement a standardized `<Image />` component with lazy loading?
*   **SEO**: The portfolio needs to be shared on LinkedIn/Twitter. Check `index.html` and `App.tsx`. Are we missing dynamic OpenGraph tags for individual case studies?

---

## 3. Implementation Instructions

After your analysis, generate a **Strategic Roadmap** in `context/ROADMAP.md` with:

1.  **Quick Wins (High Impact / Low Effort)**: e.g., "Add Zod validation for profile.yaml", "Add OG tags".
2.  **Strategic Features**: e.g., "Implement 'Testimonials' marquee section", "Refactor Modal".
3.  **Design Polish**: e.g., "Add scroll-driven reveal animations to Case Studies".

**Tone**: Professional, insightful, direct. Focus on *outcomes*, not just *outputs*.
