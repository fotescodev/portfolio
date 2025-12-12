# 🤖 Agent Rules & Governance

**ATTENTION ALL AI AGENTS:**
This document serves as the **Supreme Law** for contributing to this codebase. You are required to read and adhere to these rules before making any changes.

## 🚨 1. The "Design System First" Prime Directive

**User Mandate:**
> "If you make a change outside of the design system YOU HAVE TO make sure that it is clearly outlined, reasoned and the design system is updated. That way we keep things tidy and holistic from a design / UX perspective."

### The Rules:
1.  **Single Source of Truth**: The Design System (`context/DESIGN.md` and `src/styles/globals.css`) is the absolute authority on visual style.
2.  **No "Snowflakes"**:
    *   **NEVER** use hardcoded hex codes (e.g., `#FFFFFF`), pixels (e.g., `24px`), or ad-hoc styles in components.
    *   **ALWAYS** use CSS variables defined in `globals.css` (e.g., `var(--color-text-primary)`, `var(--space-lg)`).
3.  **Governance Protocol**:
    If you need to introduce a new visual style, dimension, or pattern:
    *   **Step 1: Reason**: Explicitly justify to the user *why* the existing system is insufficient.
    *   **Step 2: Define**: Add the new token to `src/styles/globals.css`.
    *   **Step 3: Document**: Update `context/DESIGN.md` to reflect the new addition.
    *   **Step 4: Implement**: Only then, use the new token in your component.

## 2. Codebase Maintenance
*   **Documentation Alignment**: If you refactor code, you **MUST** update the corresponding section in `context/CODEBASE.md` or `context/DESIGN.md`.
*   **Data Integrity**: Always maintain Zod validation in `src/lib/content.ts` for any new content fields. Do not bypass type safety.
