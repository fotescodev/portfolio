---
status: completed
priority: p2
issue_id: "015"
tags: [design-audit, code-quality, patterns]
dependencies: []
completed_at: 2026-01-11
---

# Inline Styles Anti-Pattern

## Problem Statement

The design audit document (`DESIGN_AUDIT.md`) recommends fixes using inline React styles instead of CSS classes. This creates maintenance issues, prevents reuse, and bypasses the design system.

## Findings

### Code Simplicity Reviewer
- **Location:** `DESIGN_AUDIT.md` - Multiple inline style suggestions
- Examples: `style={{ maxWidth: '65ch' }}`, `style={{ letterSpacing: '0.05em' }}`
- Inline styles bypass CSS cascade and media queries
- Cannot be reused across components
- Makes responsive design harder

### Pattern Recognition Specialist
- Mix of CSS classes and inline styles creates inconsistency
- Some components use `globals.css` classes, others use inline
- No clear pattern for when to use each approach

## Proposed Solutions

### Option A: Convert Inline Styles to CSS Classes (Recommended)
**Description:** Create reusable CSS classes in globals.css

```css
/* globals.css */
.text-readable {
  max-width: 65ch;
}

.eyebrow {
  letter-spacing: 0.05em;
  text-transform: uppercase;
  font-size: 0.75rem;
}

.bullet-list {
  max-width: 600px;
  line-height: 1.6;
}
```

Then use in components:
```tsx
<p className="text-readable">{bio}</p>
```

**Pros:**
- Consistent design system
- Reusable across components
- Supports media queries
- Easier to maintain

**Cons:**
- Requires refactoring existing code

**Effort:** Medium (3-4 hours)
**Risk:** Low

### Option B: CSS-in-JS with Styled Components
**Description:** If project uses styled-components, define styles there

**Pros:**
- Co-located styles
- Type-safe

**Cons:**
- Would require new dependency
- Major architectural change

**Effort:** High
**Risk:** Medium

## Technical Details

**Affected Files:**
- `src/styles/globals.css` - add new utility classes
- `src/components/sections/AboutSection.tsx` - bio styling
- `src/components/sections/ExperienceSection.tsx` - bullet styling
- `src/components/sections/HeroSection.tsx` - eyebrow styling
- `src/components/sections/TestimonialsSection.tsx` - quote styling

**Inline Styles to Convert:**
| Current | New Class |
|---------|-----------|
| `maxWidth: '65ch'` | `.text-readable` |
| `letterSpacing: '0.05em'` | `.eyebrow` |
| `maxWidth: '600px'` | `.bullet-list` |
| `fontSize: '0.6em', opacity: 0.3` | `.quote-mark` |

## Acceptance Criteria

- [ ] All design audit fixes use CSS classes, not inline styles
- [ ] New utility classes added to globals.css
- [ ] Existing inline styles migrated to classes
- [ ] Consistent pattern documented

## Work Log

| Date | Action | Learnings |
|------|--------|-----------|
| 2026-01-09 | Created from design audit review | Inline styles create maintenance debt |

## Resources

- Code Simplicity Reviewer Report
- Pattern Recognition Specialist Report
