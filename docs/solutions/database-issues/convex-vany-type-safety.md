---
title: "Convex v.any() Type Safety Fix"
type: "database-issue"
severity: "high"
status: "resolved"
date_identified: "2026-01-15"
date_resolved: "2026-01-15"

category: "database-issues"
component: "convex/schema"
subsystem: "Convex validators"

symptoms:
  - "Invalid data could be stored in Convex database"
  - "Runtime errors when reading malformed variant data"
  - "Hard to debug issues - errors appeared far from source"
  - "No compile-time safety for database operations"

root_cause: |
  The initial Convex schema used v.any() for complex nested objects
  (variant data, base content) as a shortcut. This bypassed Convex's
  built-in validation, allowing any JSON structure to be stored.

affected_files:
  - path: "convex/schema.ts"
    description: "Table definitions with v.any()"
  - path: "convex/validators.ts"
    description: "New typed validators (created)"
  - path: "convex/variants.ts"
    description: "Mutation args updated"
  - path: "convex/baseContent.ts"
    description: "Mutation args updated"

tags: [convex, type-safety, validators, schema, database]
---

# Convex v.any() Type Safety Fix

## Problem

Using `v.any()` in Convex schema bypasses type validation:

```typescript
// BEFORE - No type safety
export default defineSchema({
  variants: defineTable({
    data: v.any(), // Any shape accepted
  }),
});
```

## Solution

### 1. Create `convex/validators.ts`

Define typed validators that mirror the Zod schema:

```typescript
import { v } from "convex/values";

const variantMetadataValidator = v.object({
  company: v.string(),
  role: v.string(),
  generatedAt: v.string(),
  jobDescription: v.string(),
  slug: v.string(),
  // ... all fields explicitly typed
});

export const variantDataValidator = v.object({
  metadata: variantMetadataValidator,
  overrides: variantOverridesValidator,
  relevance: variantRelevanceValidator,
});
```

### 2. Update `convex/schema.ts`

```typescript
import { variantDataValidator } from "./validators";

export default defineSchema({
  variants: defineTable({
    data: variantDataValidator, // Now typed
  }),
});
```

### 3. Update mutation args

```typescript
export const upsert = mutation({
  args: {
    data: variantDataValidator, // Instead of v.any()
  },
});
```

## Verification

```bash
npx convex codegen
# Should complete without errors
```

## Prevention

### Checklist
- Search for `v.any()` before committing: `grep -r "v\.any()" convex/`
- Use `v.union()` or `v.object()` with explicit fields

### Pre-commit Hook
```bash
# .githooks/pre-commit
if grep -r "v\.any()" convex/; then
  echo "ERROR: v.any() found in Convex schema"
  exit 1
fi
```

### Code Review
Auto-reject any `v.any()` in Convex schemas. Require typed alternatives.

## Related Files

- `src/lib/schemas.ts` - Zod schema (source of truth for types)
- `docs/solutions/CONVEX_DEPLOYMENT_GUIDE.md`
- `context/PRODUCTION_SAFETY_CHECKLIST.md`
