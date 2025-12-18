# 🤖 Agent Rules & Governance

**ATTENTION ALL AI AGENTS:**
This document serves as the **Supreme Law** for contributing to this codebase. You are required to read and adhere to these rules before making any changes.

---

## 📋 0. Developer Log (DEVLOG) — MANDATORY

**Location:** `context/DEVLOG.md`

### Rules:
1. **Session Logging**: At the **end of every working session**, update `DEVLOG.md` with:
   - Summary of work completed
   - List of changes made (files, features, fixes)
   - Issues encountered and their resolutions
   - Tests added or modified
   - Follow-up items for future sessions

2. **Real-time Updates**: For significant changes during a session, log them as you go rather than waiting until the end.

3. **Issue Tracking**: Every bug or unexpected behavior encountered MUST be logged with:
   - Description of the issue
   - Root cause (if identified)
   - Resolution applied

4. **Format**: Use the template provided in `DEVLOG.md` for consistency.

---

## 🚨 1. The "Design System First" Prime Directive

**User Mandate:**
> "If you make a change outside of the design system YOU HAVE TO make sure that it is clearly outlined, reasoned and the design system is updated. That way we keep things tidy and holistic from a design / UX perspective."

### The Rules:
1.  **Single Source of Truth**: The Design System (`context/DESIGN.md` and `src/styles/globals.css`) is the absolute authority on visual style.
2.  **No "Snowflakes"**:
    *   **NEVER** use hardcoded hex codes (e.g., `#FFFFFF`), pixels (e.g., `24px`), or ad-hoc styles in components.
    *   **ALWAYS** use CSS variables defined in `globals.css` (e.g., `var(--color-text-primary)`, `var(--space-lg)`).
3.  **Theme Parity**:
    *   **Dark Mode != Light Mode**: Do not assume transparency or colors work the same.
    *   **Verify Both**: Every visual change MUST be verified in both themes. If a feature exists in Dark Mode (e.g., ambient orbs), it MUST have a Light Mode equivalent.
    If you need to introduce a new visual style, dimension, or pattern:
    *   **Step 1: Reason**: Explicitly justify to the user *why* the existing system is insufficient.
    *   **Step 2: Define**: Add the new token to `src/styles/globals.css`.
    *   **Step 3: Document**: Update `context/DESIGN.md` to reflect the new addition.
    *   **Step 4: Implement**: Only then, use the new token in your component.

## 2. Codebase Maintenance & Anti-Hallucination
*   **Documentation Alignment**: If you refactor code, you **MUST** update the corresponding section in `context/CODEBASE.md` or `context/DESIGN.md`.
*   **Anti-Hallucination**: NEVER document a feature in `CODEBASE.md` or `ROADMAP.md` as "Implemented" or "Done" unless you have verified its existence in the current branch.
*   **Data Integrity**: Always maintain Zod validation in `src/lib/content.ts` for any new content fields. Do not bypass type safety.

## 3. Documentation Governance
*   **Mission Control Sync**: Any move, rename, or deletion of a `.md` file MUST be reflected in the root `README.md` map.
*   **Deprecation Record**: If a planned feature is abandoned, move its description to a "Deprecated/Abandoned" section in `ROADMAP.md` with rationale, rather than silent deletion.

## 3. Mandatory UI/UX Verification Checklist
**MUST** be performed before finalizing any task involving UI/UX changes.

- [ ] **Token First**: Did I check `globals.css` before writing any new style?
- [ ] **No Magic Numbers**: Are all spacing/sizing values using `var(--space-*)` or `var(--layout-*)`? (Exception: 1-2px borders/offsets).
- [ ] **Documentation Sync**: If I added a new variable, did I update `context/DESIGN.md`?
- [ ] **Theme Check**: Did I verify the change works in both Dark AND Light mode? (Are ambient effects visible in both?)
- [ ] **Mobile Check**: Did I verify responsive behavior (e.g., `isMobile` logic)?
- [ ] **Honest Docs**: Did I ensure I am not "hallucinating" the completion of any feature in the docs?

## 5. "The Prime Directive" of Design
> "If it isn't in the Design System, it doesn't exist. If it needs to exist, update the Design System first."
