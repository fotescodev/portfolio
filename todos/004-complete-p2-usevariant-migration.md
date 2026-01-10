---
status: complete
priority: p2
issue_id: "004"
tags: [code-review, simplicity, migration]
dependencies: []
---

# Legacy loadVariant Still Used in VariantResumePage

## Problem Statement

The deprecated `loadVariant` function (file-based loading) is still used in `VariantResumePage.tsx` instead of the new `useVariant` Convex hook. This creates:
1. Inconsistent data sources (file vs Convex)
2. Dead code that can't be removed
3. Confusion about source of truth

## Findings

### Code Simplicity Reviewer
- **Location:** `src/lib/variants.ts` lines 44-70 (deprecated function)
- **Location:** `src/pages/VariantResumePage.tsx` (still uses loadVariant)
- `getVariantSlugs()` has a bug: matches `.yaml` but variantFiles glob is for `.json`
- `variantExists()` depends on broken `getVariantSlugs()`

### Pattern Recognition Agent
- Legacy code marked deprecated but still in use
- ~40 lines of dead/legacy code in variants.ts
- Creates maintenance burden

## Proposed Solutions

### Option A: Update VariantResumePage to Use Hook (Recommended)
**Description:** Migrate VariantResumePage to use `useVariant` hook like VariantPortfolio

```typescript
// Before (VariantResumePage.tsx)
const [variant, setVariant] = useState<Variant | null>(null);
useEffect(() => {
  loadVariant(slug).then(setVariant);
}, [slug]);

// After
const { data: variant, isLoading } = useVariant(slug);
```

Then delete:
- `loadVariant` function
- `getVariantSlugs` function
- `variantExists` function
- `import.meta.glob` statement

**Pros:**
- Removes ~40 lines of legacy code
- Single source of truth (Convex)
- Consistent behavior across pages

**Cons:**
- Need to verify VariantResumePage works correctly

**Effort:** Small (1-2 hours)
**Risk:** Low

### Option B: Keep Both During Transition
**Description:** Document deprecation timeline, remove later

**Pros:**
- No immediate changes needed
- Fallback if Convex issues arise

**Cons:**
- Technical debt accumulates
- Confusion persists

**Effort:** None
**Risk:** Medium (never gets cleaned up)

## Recommended Action

Option A - Update VariantResumePage and remove legacy code.

## Technical Details

**Affected Files:**
- `src/pages/VariantResumePage.tsx` - Needs migration
- `src/lib/variants.ts` - Remove lines 43-80, 174-177

**Code to Remove (after migration):**
```typescript
// Lines 43-46 - Remove glob import
const variantFiles = import.meta.glob('../../content/variants/*.json', {
  eager: false
});

// Lines 48-70 - Remove loadVariant
export async function loadVariant(slug: string): Promise<Variant | null> { ... }

// Lines 72-80 - Remove getVariantSlugs (also has bug)
export function getVariantSlugs(): string[] { ... }

// Lines 174-177 - Remove variantExists
export function variantExists(company: string, role: string): boolean { ... }
```

## Acceptance Criteria

- [ ] VariantResumePage uses `useVariant` hook
- [ ] Resume page loads variants from Convex
- [ ] Legacy `loadVariant` function removed
- [ ] `getVariantSlugs` and `variantExists` removed
- [ ] `import.meta.glob` statement removed
- [ ] No references to file-based loading remain

## Work Log

| Date | Action | Learnings |
|------|--------|-----------|
| 2026-01-09 | Created from code review | Convex migration was incomplete |

## Resources

- Code Simplicity Reviewer Report
- Pattern Recognition Report
