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

- [ ] **Dynamic SEO (Social Proof)**
    - **Problem**: As a SPA, sharing a Case Study link on LinkedIn currently shows the generic homepage metadata.
    - **Solution**: Install `react-helmet-async`. Update `CaseStudyModal` (or the route wrapper) to inject dynamic `<title>` and `<meta property="og:..." />` tags based on the active case study.

- [x] **Fix Missing Hero Image in Modal**
    - **Problem**: Analysis of `CaseStudyModal.tsx` reveals the "Hero area with image" comment exists, but the actual `<img>` or background render logic is missing or ineffective.
    - **Solution**: Implement a proper responsive image or standard `<Image />` component in the modal hero.

---

## 2. Strategic Features (The "Hired" Metric)

Features designed to prove seniority and competence.

- [ ] **"Trust Battery" Testimonials Section**
    - **Why**: Social proof is currently buried or static.
    - **Plan**: Implement a "Wall of Love" or Infinite Marquee section on the home page using the compiled reviews from `content/testimonials`.

- [ ] **Floating "Hire Me" Omnibar**
    - **Why**: Conversion path should be always available but unobtrusive.
    - **Plan**: A subtle, glass-morphic floating action bar on mobile (bottom) and desktop (corner) that offers "Resume", "Email", and "Calendly" without needing to scroll to the footer.

---

## 3. Design Polish (The "Wow" Factor)

Elevating the aesthetic from "Clean" to "Premium".

- [ ] **Framer Motion Integration**
    - **Problem**: `CaseStudyModal` uses inline `style={{ animation: ... }}`. This is jerky and lacks exit animations.
    - **Plan**: Replace inline CSS animations with `<AnimatePresence>` and `<motion.div>`.
    - **Effect**: Smooth layout transitions, beautiful modal entry/exit, layout promotion when opening a card.

- [ ] **Scroll-Driven Storytelling**
    - **Plan**: Add simple scroll observers to `CaseStudyModal`. As the user reads "Problem", "Approach", "Results":
        - Fade in sections.
        - Update a "Reading Progress" indicator.
        - Subtle parallax on large metrics.

- [ ] **Orb/Glow Ambient Effects**
    - **Plan**: Utilize the unused `color-orb-accent` variables. Add a background mesh gradient or "Orb" that follows the cursor subtly in the background, shifting colors based on the theme (Gold for dark mode, Green/Subtle for light mode).

---

## 4. Technical Refactoring (AI & Maintainability)

Preparing the codebase for rapid iteration and AI-assisted development.

- [x] **Refactor `CaseStudyModal` Monolith**
    - **Current**: 600+ lines, mixed concerns.
    - **Target**:
        - `src/components/case-study/CaseStudyHeader.tsx`
        - `src/components/case-study/CaseStudyMetrics.tsx`
        - `src/components/case-study/CaseStudyNarrative.tsx`
    - **Benefit**: Easier for AI to "Edit the metrics section" without context window limits or scrolling errors.

- [x] **Documentation Cleanup**
    - **Actions**: Consolidated `context/` directory, moved history to `docs/` created dashboard `README.md`.
    - **Benefit**: Clearer context for AI agents and human developers.

- [ ] **Standardized `<Image />` Component**
    - **Problem**: No lazy loading, no blur-up placeholders.
    - **Plan**: Create a primitive that handles `alt` text enforcement (accessibility), loading states, and aspect ratios.

- [ ] **AI Onboarding Scripts**
    - **Plan**: Create `scripts/validate-content.ts`.
    - **Usage**: `npm run check:content`. Verification script that ensures every YAML file matches the Zod schema and every image referenced in YAML actually exists in `public/images`. This saves the user from broken deploys.

---

## 5. Execution Strategy

**Phase 1: Foundation (Today)**
1.  Implement Zod schemas to verify what data we actually have.
2.  Fix the SEO/Head metadata so links look good.
3.  Refactor `CaseStudyModal` into smaller chunks to make subsequent design work easier.

**Phase 2: Polish (Next)**
1.  Install Framer Motion.
2.  Implement the animations and the "Orb" effect.
3.  Add the Floating CTA.
