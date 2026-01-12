---
status: pending
priority: p3
issue_id: "020"
tags: [design-audit, typescript, type-safety]
dependencies: []
---

# Type Safety Concerns in Design Audit Fixes

## Problem Statement

The design audit proposes inline styles using raw strings for CSS values. TypeScript's `CSSProperties` type should be used to catch errors at compile time.

## Findings

### Kieran TypeScript Reviewer
- **Location:** `DESIGN_AUDIT.md` - inline style examples
- Raw string values like `'65ch'`, `'0.05em'` lack type checking
- Typos in property names won't be caught
- Missing units won't be caught

## Proposed Solutions

### Option A: Use CSS Variables (Recommended)
**Description:** Define values as CSS custom properties with type-safe fallbacks

```css
/* globals.css */
:root {
  --text-max-width: 65ch;
  --eyebrow-letter-spacing: 0.05em;
  --bullet-max-width: 600px;
}
```

```tsx
// Component - just reference the variable
<p style={{ maxWidth: 'var(--text-max-width)' }}>
```

**Pros:**
- Single source of truth
- Consistent values
- IDE support for CSS variables

**Cons:**
- One more layer of abstraction

**Effort:** Small (1 hour)
**Risk:** None

### Option B: Type-Safe Style Objects
**Description:** Create typed style constants

```tsx
// styles.ts
import { CSSProperties } from 'react';

export const textStyles: Record<string, CSSProperties> = {
  readable: { maxWidth: '65ch' },
  eyebrow: { letterSpacing: '0.05em', textTransform: 'uppercase' },
};

// Usage
<p style={textStyles.readable}>
```

**Pros:**
- TypeScript catches errors
- Reusable

**Cons:**
- New file/pattern to maintain

**Effort:** Small
**Risk:** None

## Technical Details

**Affected Files:**
- `src/styles/globals.css` - CSS variables
- Component files using inline styles

**TypeScript Tip:**
```tsx
// Let TypeScript infer CSSProperties
const style = {
  maxWidth: '65ch',
  letterSpacing: '0.05em',
} satisfies React.CSSProperties;
```

## Acceptance Criteria

- [ ] Style values defined with type safety
- [ ] No raw magic strings in component styles
- [ ] Consistent approach across components

## Work Log

| Date | Action | Learnings |
|------|--------|-----------|
| 2026-01-09 | Created from design audit review | TypeScript can catch CSS errors |

## Resources

- Kieran TypeScript Reviewer Report
