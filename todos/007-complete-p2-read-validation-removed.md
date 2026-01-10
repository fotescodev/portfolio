---
status: complete
priority: p2
issue_id: "007"
tags: [code-review, performance]
dependencies: ["002"]
---

# Runtime Zod Validation on Every Query

## Problem Statement

The `useVariant` hook runs Zod validation on every successful Convex query result. This adds ~1-5ms of JavaScript execution time per page load, plus unnecessary re-renders from object recreation.

## Findings

### Performance Oracle Agent
- **Location:** `src/lib/variants.ts` lines 34-40
- Zod `VariantSchema` is comprehensive with nested objects/arrays
- Validation runs on EVERY query result, not just writes
- Combined with `structuredClone` in `mergeProfile`, creates significant overhead

### Architecture Strategist Agent
- Validation should happen on write, trust data on read
- Current pattern: "validate on read" violates fail-fast principle
- If we validate on write (fix #002), read-side validation is redundant

## Proposed Solutions

### Option A: Move Validation to Write Path (Recommended)
**Description:** Validate in mutations, trust Convex data on read

```typescript
// src/lib/variants.ts
export function useVariant(slug: string) {
  const result = useQuery(api.variants.getBySlug, { slug });
  if (result === undefined) return { data: null, isLoading: true };
  if (result === null) return { data: null, isLoading: false };
  // Trust the data - it was validated on write
  return { data: result as Variant, isLoading: false };
}
```

**Pros:**
- Removes ~1-5ms per page load
- Data validated once (on write) not repeatedly
- Fail-fast at the boundary

**Cons:**
- Requires implementing write-side validation first (#002)
- Trust assumption - if bad data exists, it propagates

**Effort:** Small (1 hour, after #002)
**Risk:** Low (if #002 is done first)

### Option B: Add Memoization
**Description:** Cache validation results to avoid re-running

```typescript
const validatedCache = new Map<string, Variant>();

export function useVariant(slug: string) {
  const result = useQuery(api.variants.getBySlug, { slug });
  // ...
  if (validatedCache.has(slug)) {
    return { data: validatedCache.get(slug)!, isLoading: false };
  }
  const validated = VariantSchema.parse(result);
  validatedCache.set(slug, validated);
  return { data: validated, isLoading: false };
}
```

**Pros:**
- Reduces repeated validation
- Keeps safety check

**Cons:**
- Cache invalidation complexity
- Memory overhead
- Still validates at least once per session

**Effort:** Small
**Risk:** Medium (cache bugs)

## Recommended Action

Option A - After implementing write-side validation (#002), remove read-side validation.

## Technical Details

**Affected Files:**
- `src/lib/variants.ts` lines 34-40

**Performance Impact:**
| Metric | Before | After |
|--------|--------|-------|
| JS execution per load | +1-5ms | ~0ms |
| Object allocations | 2x (parse + clone) | 1x |

## Acceptance Criteria

- [ ] Write-side validation implemented (#002 complete)
- [ ] Read-side Zod validation removed
- [ ] Page load time improved (measure before/after)
- [ ] No runtime errors from missing validation

## Work Log

| Date | Action | Learnings |
|------|--------|-----------|
| 2026-01-09 | Created from code review | Depends on #002 being completed first |

## Resources

- Performance Oracle Report
- Architecture Strategist Report
