---
status: complete
priority: p1
issue_id: "002"
tags: [code-review, security, data-integrity, convex]
dependencies: []
---

# v.any() Bypasses Write-Path Validation

## Problem Statement

Multiple Convex schema fields use `v.any()` which bypasses all type validation at the database level. The comment claims "validated by Zod on write" but **validation actually happens on READ, not write**. This means invalid or malicious data CAN be stored in the database.

## Findings

### Security Sentinel Agent
- **Location:** `convex/schema.ts` lines 8, 16-20
- **Location:** `convex/variants.ts` line 70
- 10 total usages of `v.any()` across schema
- Arbitrary data can be stored, including malicious payloads

### Architecture Strategist Agent
- Write path in `generate.ts` calls `ctx.runMutation(api.variants.upsert)` without Zod validation
- Read path in `src/lib/variants.ts` validates with Zod AFTER data is already stored
- Invalid data can persist and cause runtime failures for other clients

### Pattern Recognition Agent
- `BaseContent` interface in generate.ts duplicates schema structure without type safety
- No validation before database insert in any mutation

## Proposed Solutions

### Option A: Add Zod Validation to Mutations (Recommended)
**Description:** Validate data with Zod before inserting into database

```typescript
// convex/variants.ts
import { VariantSchema } from '../src/lib/schemas';

export const upsert = mutation({
  args: { ... },
  handler: async (ctx, args) => {
    // Validate before write
    const validationResult = VariantSchema.safeParse(args.data);
    if (!validationResult.success) {
      throw new Error(`Invalid variant data: ${validationResult.error.message}`);
    }
    // ... proceed with insert
  },
});
```

**Pros:**
- Prevents invalid data from ever being stored
- Uses existing Zod schemas
- Fail-fast at the boundary

**Cons:**
- Zod must be bundled with Convex functions
- Slight performance overhead on writes

**Effort:** Small (2-4 hours)
**Risk:** Low

### Option B: Define Proper Convex Validators
**Description:** Replace `v.any()` with structured Convex validators

```typescript
const variantDataValidator = v.object({
  metadata: v.object({
    company: v.string(),
    role: v.string(),
    slug: v.string(),
    // ... all required fields
  }),
  overrides: v.object({ ... }),
  relevance: v.optional(v.object({ ... })),
});
```

**Pros:**
- Native Convex validation
- Better TypeScript integration
- No external dependencies

**Cons:**
- Duplicates Zod schema structure
- Maintenance burden keeping both in sync
- Complex nested structures are verbose

**Effort:** Medium (4-8 hours)
**Risk:** Medium (schema drift)

### Option C: Hybrid Approach
**Description:** Use Convex validators for top-level structure, Zod for nested data

**Effort:** Medium
**Risk:** Low

## Recommended Action

<!-- To be filled during triage -->

## Technical Details

**Affected Files:**
- `convex/schema.ts` - Schema definitions
- `convex/variants.ts` - upsert mutation
- `convex/baseContent.ts` - upsert mutation
- `convex/generate.ts` - generates and stores without validation

**v.any() Locations:**
1. `schema.ts:8` - variants.data
2. `schema.ts:17` - baseContent.profile
3. `schema.ts:18` - baseContent.experience
4. `schema.ts:19` - baseContent.skills
5. `schema.ts:20` - baseContent.projects

## Acceptance Criteria

- [ ] Invalid variant data is rejected on write
- [ ] Invalid base content is rejected on write
- [ ] Generated variants are validated before storage
- [ ] Error messages are clear and actionable
- [ ] Existing valid data continues to work

## Work Log

| Date | Action | Learnings |
|------|--------|-----------|
| 2026-01-09 | Created from code review | Comment "validated on write" is misleading - actually validated on read |

## Resources

- Architecture Strategist Report
- Security Sentinel Report
- Pattern Recognition Report
