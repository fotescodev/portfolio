---
status: complete
priority: p2
issue_id: "008"
tags: [code-review, quality, typescript]
dependencies: []
---

# Variable Shadowing in variants.ts

## Problem Statement

The imported `v` from `convex/values` is shadowed by loop variables in `convex/variants.ts`. While not a runtime bug, this reduces code clarity and could cause maintenance issues.

## Findings

### Pattern Recognition Agent
- **Location:** `convex/variants.ts` lines 37, 48
- `v` from Convex values is shadowed by map callback parameter
- ESLint would typically flag this

## Proposed Solutions

### Option A: Rename Loop Variables (Recommended)
**Description:** Use `variant` instead of `v` in map callbacks

```typescript
// Before
return variants.map((v) => v.slug);
return variants.map((v) => ({
  _id: v._id,
  slug: v.slug,
  // ...
}));

// After
return variants.map((variant) => variant.slug);
return variants.map((variant) => ({
  _id: variant._id,
  slug: variant.slug,
  // ...
}));
```

**Pros:**
- Clearer code
- No shadowing
- More readable

**Cons:**
- Slightly more verbose

**Effort:** Small (15 minutes)
**Risk:** None

## Recommended Action

Option A - Quick fix, do it now.

## Technical Details

**Affected Files:**
- `convex/variants.ts` lines 37, 48

## Acceptance Criteria

- [ ] No variable shadowing of `v` import
- [ ] TypeScript compiles without issues
- [ ] ESLint passes (if configured)

## Work Log

| Date | Action | Learnings |
|------|--------|-----------|
| 2026-01-09 | Created from code review | Minor but easy to fix |

## Resources

- Pattern Recognition Report
