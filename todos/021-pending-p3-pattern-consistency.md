---
status: completed
priority: p3
issue_id: "021"
tags: [design-audit, patterns, consistency]
dependencies: ["015"]
completed_at: 2026-01-11
---

# Inconsistent Implementation Patterns

## Problem Statement

The design audit reveals inconsistent patterns across sections - some use CSS classes, others inline styles; some use React handlers, others CSS pseudo-classes. This creates maintenance burden and potential for drift.

## Findings

### Pattern Recognition Specialist
- **Location:** Various section components
- Tag styling differs between Experience and Blog sections
- Card hover effects implemented differently per section
- Some components use `className`, others use `style` prop
- No consistent pattern for section dividers

### Code Simplicity Reviewer
- Inconsistency makes it harder to update design system
- New contributors won't know which pattern to follow

## Proposed Solutions

### Option A: Establish and Document Patterns (Recommended)
**Description:** Create a patterns guide and refactor to match

**Pattern Guide:**
1. **Colors**: Always use CSS variables (`var(--color-*)`)
2. **Spacing**: Use CSS variables (`var(--space-*)`)
3. **Interactive states**: CSS pseudo-classes (`:hover`, `:focus-visible`)
4. **Layout**: CSS classes for reusable layouts
5. **One-off styles**: CSS classes in globals.css, not inline styles
6. **Section structure**: Consistent container/content pattern

**Pros:**
- Clear guidance for future work
- Consistent codebase

**Cons:**
- Requires upfront documentation and refactoring

**Effort:** Medium (3-4 hours for documentation + refactoring)
**Risk:** Low

### Option B: Add ESLint/StyleLint Rules
**Description:** Enforce patterns with linting

**Pros:**
- Automated enforcement

**Cons:**
- Doesn't fix existing inconsistencies
- May be too strict

**Effort:** Medium
**Risk:** Low

## Technical Details

**Patterns to Standardize:**

| Element | Standard Pattern |
|---------|------------------|
| Tags | `.tag` class in globals.css |
| Cards | `.card` class with CSS `:hover` |
| Section spacing | `--space-2xl` between sections |
| Text widths | `.text-readable` for 65ch max |
| Dividers | `.section-divider` class |

**Documentation Location:**
- Add to existing CLAUDE.md or create STYLE_GUIDE.md

## Acceptance Criteria

- [ ] Pattern guide documented
- [ ] Existing code refactored to match patterns
- [ ] All sections use consistent approach
- [ ] New components follow established patterns

## Work Log

| Date | Action | Learnings |
|------|--------|-----------|
| 2026-01-09 | Created from design audit review | Consistency reduces cognitive load |

## Resources

- Pattern Recognition Specialist Report
- Code Simplicity Reviewer Report
