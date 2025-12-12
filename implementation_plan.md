# Implementation Plan - Case Study Modal Refactor

**Goal**: Deconstruct the monolothic `CaseStudyModal.tsx` (630 lines) into small, composable components to enable easier animation, styling, and maintenance.

## User Review Required

> [!IMPORTANT]
> This refactor will create a new directory `src/components/case-study/`.
> We will strictly maintain **feature parity** first before adding new animations.

## Proposed Changes

### Component Architecture

We will decompose `src/components/sections/CaseStudyModal.tsx` into the following structure:

```
src/components/case-study/
├── CaseStudyModal.tsx        # Main container / Orchestrator (State, Scroll, Layout)
├── CaseStudyHeader.tsx       # Navigation (Back/Close buttons)
├── CaseStudyHero.tsx         # Title, Role, Context + [NEW] Actual Image Rendering
├── CaseStudyMetrics.tsx      # The full-width stats grid
├── CaseStudyNarrative.tsx    # Problem, Approach, Execution, Key Decision
├── CaseStudyResults.tsx      # Quantitative & Qualitative results
├── CaseStudyReflection.tsx   # What worked/didn't, Lesson Learned
└── CaseStudyFooter.tsx       # Tech stack, constraints, links, CTA
```

### Detailed Component Breakdown

#### [NEW] `src/components/case-study/CaseStudyHero.tsx`
*   **Responsibilities**:
    *   Render the meta line (ID · Company · Year)
    *   Render Main Title (`h1`)
    *   Render Role/Team/Duration context
    *   **Fix**: Implement `caseStudy.hook.thumbnail` rendering (currently missing in the codebase).

#### [NEW] `src/components/case-study/CaseStudyNarrative.tsx`
*   **Responsibilities**:
    *   "The Story" sections
    *   Challenge (Business Context + Stakes)
    *   Approach (Hypothesis + Solution)
    *   Execution Phases (Timeline visualization)
*   **Why**: This is the most text-heavy section. Isolating it allows us to add "Reading Progress" observers later easily.

#### [NEW] `src/components/case-study/CaseStudyMetrics.tsx`
*   **Responsibilities**:
    *   Render the `impactMetric` (Primary)
    *   Render `subMetrics` list
    *   Handle the `bg-grid` overlay specific to this section.

### Migration Steps

1.  **Setup**: Create the directory `src/components/case-study/`.
2.  **Extract**: Move logic piece-by-piece, starting with leaf nodes (`Header`, `Footer`, `Metrics`) and ending with the core `Narrative`.
3.  **Integrate**: Update the main `CaseStudyModal` to import and compose these new components.
4.  **Verify**: Ensure all props are passed correctly and no styling regressions occur.

## Verification Plan

### Automated Tests
*   Run `npm run build` to ensure no TypeScript errors from the prop drilling.

### Manual Verification
*   Open "Institutional ETH Staking" case study.
*   Check that the **image** now appears (if we add the placeholder logic).
*   Verify the **Metrics** grid layout on Mobile vs Desktop.
*   Verify **Navigation** (Prev/Next) still works in the Footer/Header.
*   Verify **Close** button works.
