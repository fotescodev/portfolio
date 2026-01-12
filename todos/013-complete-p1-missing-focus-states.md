---
status: complete
priority: p1
issue_id: "013"
tags: [design-audit, accessibility, focus-states]
dependencies: []
---

# Missing Focus States for Keyboard Navigation

## Problem Statement

Interactive elements (buttons, links, cards) have hover states defined but may lack corresponding focus states. Keyboard users and screen reader users cannot see which element is currently focused.

## Findings

### Security Sentinel Agent (Accessibility Focus)
- **Location:** `DESIGN_AUDIT.md` - hover states defined but focus states not mentioned
- Card hover effects: `borderLeft: '3px solid var(--color-accent)'`
- No `:focus` or `:focus-visible` equivalents documented
- Buttons with `onMouseEnter` handlers may not have focus equivalents

### Pattern Recognition Specialist
- Inconsistent interaction patterns across components
- Some components use CSS hover, others use React event handlers

## Proposed Solutions

### Option A: Add Matching Focus States (Recommended)
**Description:** Every hover effect gets a matching focus-visible effect

```css
/* globals.css */
.card:hover,
.card:focus-visible {
  border-left: 3px solid var(--color-accent);
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
  outline: none; /* Only if we have visible focus indicator */
}

button:focus-visible,
a:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
```

**Pros:**
- Consistent interaction for all input methods
- WCAG 2.1 compliant
- Simple implementation

**Cons:**
- Must audit all interactive elements

**Effort:** Medium (2-3 hours)
**Risk:** Low

### Option B: Global Focus Ring Utility
**Description:** Create utility class for focus states

```css
.focus-ring:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

.focus-accent:focus-visible {
  border-left: 3px solid var(--color-accent);
}
```

**Pros:**
- Reusable across components
- Easy to apply consistently

**Cons:**
- Requires adding classes to elements

**Effort:** Medium (2-3 hours)
**Risk:** Low

## Technical Details

**Affected Files:**
- `src/styles/globals.css` - add focus state utilities
- `src/components/sections/CaseStudiesSection.tsx` - card focus states
- `src/components/sections/ExperienceSection.tsx` - link focus states
- `src/components/sections/HeroSection.tsx` - button focus states

**WCAG Requirements:**
- Focus indicator must be visible
- 3:1 contrast ratio for focus indicator
- Must not rely solely on color change

## Acceptance Criteria

- [ ] All interactive elements have visible focus states
- [ ] Focus states match or complement hover states
- [ ] Tab navigation shows clear focus progression
- [ ] Tested with keyboard-only navigation

## Work Log

| Date | Action | Learnings |
|------|--------|-----------|
| 2026-01-09 | Created from design audit review | Focus states as important as hover states |

## Resources

- Security Sentinel Agent Report
- WCAG 2.4.7 Focus Visible
