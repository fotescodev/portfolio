# Phase 2: Polish & Features ("The Hired Metric")

**Goal**: Transform the functional portfolio into a "premium" experience with smooth animations, dynamic SEO for social sharing, and high-conversion features.

## User Review Required
> [!IMPORTANT]
> **New Dependencies**: We will install `framer-motion` and `react-helmet-async`.
> **Visual Changes**: The "Orb" effect will add a subtle background animation. The "Omnibar" will add a floating element to the screen.

## Proposed Changes

### 1. Dynamic SEO (Priority: High)
Ensure that sharing a specific case study link on LinkedIn/Twitter looks professional.

#### [NEW] [SEO.tsx](file:///Users/dfotesco/Portfolio/portfolio/src/components/common/SEO.tsx)
- Create a wrapper around `react-helmet-async`.
- Props: `title`, `description`, `image`, `url`.

#### [MODIFY] [App.tsx](file:///Users/dfotesco/Portfolio/portfolio/src/App.tsx)
- Wrap application in `<HelmetProvider>`.

#### [MODIFY] [CaseStudyModal.tsx](file:///Users/dfotesco/Portfolio/portfolio/src/components/case-study/CaseStudyModal.tsx)
- Inject `<SEO />` with case-study specific data.

### 2. Motion & Transitions (Priority: High)
Replace jerk CSS animations with physics-based transitions and switch to **Drawer** pattern.

#### [NEW] [Global Styles](file:///Users/dfotesco/Portfolio/portfolio/src/styles/globals.css)
- **Governance**: Define `--drawer-width` (e.g., 800px or 50vw), `--drawer-z-index`, and overlay colors.

#### [REFACTOR] [CaseStudyModal.tsx] -> [CaseStudyDrawer.tsx]
- **Component**: Rename to `CaseStudyDrawer`.
- **Behavior**:
    - **Desktop**: Slide in from **Right**. Cover ~50-60% of screen. Backdop blur.
    - **Mobile**: Slide up from **Bottom**. Cover 95% of screen.
- **Motion**: Use `framer-motion` for the slide effect (`x: '100%'` -> `x: 0`).
- **SEO**: Ensure URL updates to `?case-study=slug` so deep linking works perfectly.

### 3. Visual Polish ("The Orbs") (Priority: Medium)
Add the background ambient effects referenced in the Design System.

#### [NEW] [AmbientBackground.tsx](file:///Users/dfotesco/Portfolio/portfolio/src/components/effects/AmbientBackground.tsx)
- Renders the `.orb-primary`, `.orb-secondary`, and `.bg-grid` divs.
- Uses `framer-motion` to move the orbs slowly (breathing effect).

#### [MODIFY] [Portfolio.tsx](file:///Users/dfotesco/Portfolio/portfolio/src/components/Portfolio.tsx)
- Mount `<AmbientBackground />` at the top level.

### 4. Conversion Features (Priority: Medium)

#### [NEW] [TrustBattery.tsx](file:///Users/dfotesco/Portfolio/portfolio/src/components/sections/TrustBattery.tsx)
- A "Wall of Love" marquee section for testimonials.

#### [NEW] [Omnibar.tsx](file:///Users/dfotesco/Portfolio/portfolio/src/components/common/Omnibar.tsx)
- Floating action bar (Resume, Email, Calendar).
- Bottom centered on mobile, bottom-right or top-right on desktop.

## Verification Plan

### Automated Tests
- Verify `react-helmet-async` injects tags correctly (unit test).
- Verify `framer-motion` components mount without errors.

### Manual Verification
- **SEO**: Use a metadata checker tool (or inspect element head) on case study views.
- **Motion**: Verify modal opens/closes smoothly without layout shifts.
- **Visuals**: Check "Orb" visibility in Dark and Light modes.
- **Responsive**: Ensure Omnibar doesn't cover content on mobile.
