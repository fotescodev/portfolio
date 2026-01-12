---
status: complete
priority: p1
issue_id: "012"
tags: [design-audit, accessibility, wcag]
dependencies: []
---

# Color Contrast Accessibility (WCAG 2.1 AA)

## Problem Statement

The warm industrial gray theme uses `#EBEBE8` background with `#8a6642` accent color. This combination may not meet WCAG 2.1 AA contrast requirements (4.5:1 for normal text, 3:1 for large text). Users with visual impairments may struggle to read text.

## Findings

### Security Sentinel Agent (Accessibility Focus)
- **Location:** `src/styles/globals.css` - color palette definitions
- **Location:** `DESIGN_AUDIT.md` - documents the color choices
- `#8a6642` on `#EBEBE8` needs contrast ratio verification
- Text using accent colors for emphasis may not pass AA

### Pattern Recognition Specialist
- Color variables are defined but not tested against WCAG standards
- Dark mode palette not tested for contrast compliance

## Proposed Solutions

### Option A: Darken Accent Color (Recommended)
**Description:** Adjust `#8a6642` to a darker variant that passes contrast checks

```css
/* Test these darker variants */
--color-accent: #6d5235; /* Darker gold - verify contrast ratio */
--color-accent-accessible: #5a4429; /* Even darker for small text */
```

**Pros:**
- Maintains brand identity (gold/bronze family)
- Single source change

**Cons:**
- Slightly changes visual appearance

**Effort:** Small (1 hour)
**Risk:** Low

### Option B: Use Different Colors for Text vs Decorative
**Description:** Keep `#8a6642` for decorative elements, use darker color for text

```css
--color-accent-decorative: #8a6642; /* borders, icons */
--color-accent-text: #5a4429; /* text that must be readable */
```

**Pros:**
- Preserves original aesthetic where possible
- More flexible

**Cons:**
- More variables to manage

**Effort:** Medium (2 hours)
**Risk:** Low

## Technical Details

**Affected Files:**
- `src/styles/globals.css` - color variable definitions
- Any component using `var(--color-accent)` for text

**WCAG Requirements:**
- 4.5:1 contrast ratio for normal text (< 18pt)
- 3:1 contrast ratio for large text (18pt+ or 14pt+ bold)
- 3:1 contrast ratio for UI components and graphics

## Acceptance Criteria

- [ ] Accent color on background passes 4.5:1 contrast ratio
- [ ] All text using accent color is readable
- [ ] Verified with contrast checker tool (WebAIM, etc.)
- [ ] Dark mode colors also verified

## Work Log

| Date | Action | Learnings |
|------|--------|-----------|
| 2026-01-09 | Created from design audit review | WCAG compliance critical for accessibility |

## Resources

- Security Sentinel Agent Report
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- WCAG 2.1 Guidelines
