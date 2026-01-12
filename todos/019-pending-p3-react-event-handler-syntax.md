---
status: completed
priority: p3
issue_id: "019"
tags: [design-audit, code-quality, react]
dependencies: []
completed_at: 2026-01-11
---

# Invalid React Event Handler Syntax in Design Audit

## Problem Statement

The design audit document contains invalid React event handler syntax in the proposed code fixes. If copy-pasted directly, these would cause syntax errors.

## Findings

### Kieran TypeScript Reviewer
- **Location:** `DESIGN_AUDIT.md:198-201` - Invalid onMouseEnter syntax
- Shows object instead of function:
  ```tsx
  // INVALID (from audit)
  onMouseEnter: {
    borderLeft: '3px solid var(--color-accent)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
  }
  ```
- Should be a function that sets state or uses CSS

### Code Simplicity Reviewer
- Pattern suggests confusion between CSS pseudo-classes and JS handlers
- Better to use CSS `:hover` for these effects

## Proposed Solutions

### Option A: Use CSS Pseudo-Classes (Recommended)
**Description:** Implement hover states in CSS, not React handlers

```css
/* globals.css */
.case-study-card:hover {
  border-left: 3px solid var(--color-accent);
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
}
```

**Pros:**
- Simpler
- No JavaScript needed
- Better performance
- Works with focus states too

**Cons:**
- None

**Effort:** Small (30 minutes)
**Risk:** None

### Option B: Correct React Event Handler
**Description:** If JS is needed, use proper syntax

```tsx
const [isHovered, setIsHovered] = useState(false);

<div
  onMouseEnter={() => setIsHovered(true)}
  onMouseLeave={() => setIsHovered(false)}
  style={{
    borderLeft: isHovered ? '3px solid var(--color-accent)' : 'none',
    boxShadow: isHovered ? '0 4px 12px rgba(0,0,0,0.06)' : 'none'
  }}
>
```

**Pros:**
- Works if CSS approach isn't possible

**Cons:**
- More code
- Unnecessary for simple hover effects

**Effort:** Small
**Risk:** None

## Technical Details

**Affected Files:**
- `DESIGN_AUDIT.md` - document correction (optional)
- `src/components/sections/CaseStudiesSection.tsx` - actual implementation

**Correct Implementation:**
Use CSS classes with `:hover` and `:focus-visible` pseudo-classes rather than JavaScript event handlers for simple visual effects.

## Acceptance Criteria

- [ ] Hover effects implemented with CSS, not JS handlers
- [ ] No invalid syntax in codebase
- [ ] Effects work for both mouse and keyboard users

## Work Log

| Date | Action | Learnings |
|------|--------|-----------|
| 2026-01-09 | Created from design audit review | CSS pseudo-classes preferred for hover effects |

## Resources

- Kieran TypeScript Reviewer Report
- Code Simplicity Reviewer Report
