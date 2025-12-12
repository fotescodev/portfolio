# Strategic Roadmap: Portfolio 2.0

> **Status**: Draft
> **Owner**: AI Consultant (Antigravity)
> **Goal**: Transform the codebase into a high-conversion, "hired-on-sight" portfolio for a Director-level PM candidate.

---

## 1. Quick Wins (High Impact / Low Effort)

These tasks address immediate blocking issues for content correctness and visibility.

- [x] **Data Integrity Layer (Critical)**
    - **Problem**: `src/lib/content.ts` uses `as unknown as Type`. Missing YAML fields will cause silent runtime crashes.
    - **Solution**: Install `zod`. Create schemas for `Profile`, `CaseStudy`, etc. Validate YAML import at runtime or build time.
    - **Command**: `npm install zod`

- [x] **Dynamic SEO (Social Proof)**
    - **Problem**: As a SPA, sharing a Case Study link on LinkedIn currently shows the generic homepage metadata.
    - **Solution**: Install `react-helmet-async`. Update `CaseStudyDrawer` to inject dynamic keys.
    - **Status**: Completed in Phase 2.

- [x] **Fix Missing Hero Image in Modal**
    - **Problem**: Analysis of `CaseStudyModal.tsx` reveals the "Hero area with image" comment exists, but the actual `<img>` or background render logic is missing or ineffective.
    - **Solution**: Implemented a proper responsive image in `CaseStudyHero.tsx`.

---

## 2. Strategic Features (The "Hired" Metric)

Features designed to prove seniority and competence.

- [ ] **"Trust Battery" Testimonials Section**
    - **Why**: Social proof is currently buried or static.
    - **Plan**: Implement a "Wall of Love" or Infinite Marquee section on the home page using the compiled reviews from `content/testimonials`.

- [x] **Floating "Hire Me" Omnibar**
    - **Why**: Conversion path should be always available but unobtrusive.
    - **Plan**: A subtle, glass-morphic floating action bar on mobile (bottom) and desktop (corner) that offers "Resume", "Email", and "Calendly" without needing to scroll to the footer.
    - **Status**: Completed in Phase 2.

---

## 3. Design Polish (The "Wow" Factor)

Elevating the aesthetic from "Clean" to "Premium".

- [x] **Framer Motion Integration**
    - **Problem**: `CaseStudyModal` uses inline `style={{ animation: ... }}`. This is jerky and lacks exit animations.
    - **Plan**: Replace inline CSS animations with `<AnimatePresence>` and `<motion.div>` in `CaseStudyDrawer`.
    - **Status**: Completed in Phase 2.

- [ ] **Scroll-Driven Storytelling**
    - **Plan**: Add simple scroll observers to `CaseStudyDrawer`. As the user reads "Problem", "Approach", "Results":
        - Fade in sections.
        - Update a "Reading Progress" indicator.
        - Subtle parallax on large metrics.

- [x] **Orb/Glow Ambient Effects**
    - **Plan**: Utilize the unused `color-orb-accent` variables. Add a background mesh gradient or "Orb" that follows the cursor subtly in the background, shifting colors based on the theme.
    - **Status**: Completed in Phase 2.

---

## 4. Technical Refactoring (AI & Maintainability)

Preparing the codebase for rapid iteration and AI-assisted development.

- [x] **Refactor `CaseStudyModal` Monolith**
    - **Status**: Completed. Replaced with `CaseStudyDrawer`.

- [x] **Documentation Cleanup**
    - **Status**: Completed.

- [ ] **Standardized `<Image />` Component**
    - **Problem**: No lazy loading, no blur-up placeholders.
    - **Plan**: Create a primitive that handles `alt` text enforcement (accessibility), loading states, and aspect ratios.

- [ ] **AI Onboarding Scripts**
    - **Plan**: Create `scripts/validate-content.ts`.

---

## 5. Execution Strategy

**Phase 1: Foundation (Done)**
1.  Implement Zod schemas.
2.  Refactor `CaseStudyModal`.

**Phase 2: Polish (Done)**
1.  Install Framer Motion.
2.  Implement Animations & Ambient Orbs.
3.  Add Floating Omnibar & SEO.
4.  Fix Deployment.

**Phase 3: Social & Content (Next)**
1.  Implement "Trust Battery" Testimonials.
2.  Refine Scroll-Driven Storytelling.
