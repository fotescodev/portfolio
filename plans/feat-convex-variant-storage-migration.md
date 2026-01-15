# feat: Migrate Variant Storage to Convex Database

**Revision:** 2.0 — Simplified 1-day migration based on reviewer feedback

## Overview

Migrate variant storage from file-based (YAML/JSON in Git) to Convex database, eliminating the sync step and enabling instant edits via Convex Dashboard.

**What this is NOT:**
- NOT moving AI generation to Convex (keep local)
- NOT building a custom React dashboard (use Convex Dashboard UI)
- NOT implementing OAuth (use Convex dev/prod environments)

## Problem Statement

The sync step (`npm run variants:sync`) is error-prone and the PR ceremony adds friction for content edits.

**Actual pain point:** YAML → JSON sync + git commit for every edit.

**Solution:** Store variants in Convex. Edit via Convex Dashboard. No sync, no PR for content changes.

## Proposed Solution (1 Day)

### Files to Create (2 files)

| File | Purpose | Lines |
|------|---------|-------|
| `convex/schema.ts` | Minimal table with slug index | ~30 |
| `convex/variants.ts` | 2 queries + 2 mutations | ~80 |

### Files to Modify (4 files)

| File | Change |
|------|--------|
| `src/main.tsx` | Wrap app in `ConvexProvider` |
| `src/lib/variants.ts` | Replace `import.meta.glob` with `useQuery` |
| `src/pages/VariantPortfolio.tsx` | Use new hook, add loading state |
| `scripts/generate-cv.ts` | Save to Convex instead of writing YAML |

### Files to Delete (after migration stable)

| File | Reason |
|------|--------|
| `scripts/sync-variants.ts` | No longer needed |
| `content/variants/*.yaml` | Data now in Convex |
| `content/variants/*.json` | Data now in Convex |

## Technical Approach

### Minimal Schema

```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  variants: defineTable({
    slug: v.string(),
    publishStatus: v.union(v.literal("draft"), v.literal("published")),
    data: v.any(), // Full variant object, validated by Zod on write
    updatedAt: v.string(),
  })
    .index("by_slug", ["slug"])
    .index("by_status", ["publishStatus"]),
});
```

**Why `v.any()` for data?**
- Zod schemas already exist in `src/lib/schemas.ts`
- Duplicating as Convex validators creates drift risk
- Validate with Zod before insert, trust data in DB

### Two Queries, Two Mutations

```typescript
// convex/variants.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// PUBLIC: Get published variant by slug
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const variant = await ctx.db
      .query("variants")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (!variant || variant.publishStatus !== "published") {
      return null;
    }
    return variant.data;
  },
});

// PUBLIC: List all published slugs (for sitemap)
export const listPublishedSlugs = query({
  args: {},
  handler: async (ctx) => {
    const variants = await ctx.db
      .query("variants")
      .withIndex("by_status", (q) => q.eq("publishStatus", "published"))
      .collect();
    return variants.map((v) => v.slug);
  },
});

// ADMIN: Upsert variant (called from CLI)
export const upsert = mutation({
  args: {
    slug: v.string(),
    publishStatus: v.union(v.literal("draft"), v.literal("published")),
    data: v.any(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("variants")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    const now = new Date().toISOString();

    if (existing) {
      await ctx.db.patch(existing._id, {
        publishStatus: args.publishStatus,
        data: args.data,
        updatedAt: now,
      });
      return existing._id;
    }

    return await ctx.db.insert("variants", {
      slug: args.slug,
      publishStatus: args.publishStatus,
      data: args.data,
      updatedAt: now,
    });
  },
});

// ADMIN: Update publish status
export const updateStatus = mutation({
  args: {
    slug: v.string(),
    publishStatus: v.union(v.literal("draft"), v.literal("published")),
  },
  handler: async (ctx, args) => {
    const variant = await ctx.db
      .query("variants")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (!variant) {
      throw new Error(`Variant not found: ${args.slug}`);
    }

    await ctx.db.patch(variant._id, {
      publishStatus: args.publishStatus,
      updatedAt: new Date().toISOString(),
    });
  },
});
```

### Frontend Hook

```typescript
// src/lib/variants.ts - Replace loadVariant with:
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function useVariant(slug: string) {
  const data = useQuery(api.variants.getBySlug, { slug });
  // data is undefined (loading), null (not found), or Variant
  return data;
}

// mergeProfile() stays exactly the same
```

### CLI Change (One Line)

```typescript
// scripts/generate-cv.ts - At the end, replace file write with:
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.CONVEX_URL!);

// Instead of: fs.writeFileSync(yamlPath, yaml.stringify(variant));
await convex.mutation(api.variants.upsert, {
  slug: variant.metadata.slug,
  publishStatus: "draft",
  data: variant,
});
```

## Acceptance Criteria

### Must Have
- [ ] `/:company/:role` loads variant from Convex (verified: 3 sample URLs work)
- [ ] Loading skeleton shows while query in flight (`data-testid="variant-loading"`)
- [ ] 404 page shows for non-existent/unpublished variants
- [ ] `npm run generate:cv` saves to Convex instead of files
- [ ] All 18 existing variants migrated and accessible

### Measurable Targets
- [ ] Query latency P95 < 300ms (measure via Convex dashboard)
- [ ] Lighthouse Performance score >= 90 (baseline: 94)
- [ ] Zero console errors on variant pages

### Verification
- [ ] Manual test: Edit variant in Convex Dashboard → refresh page → see change
- [ ] Manual test: Generate new variant via CLI → appears in Convex Dashboard

## Implementation Steps

**Total: ~4-6 hours**

### Step 1: Initialize Convex (30 min)
```bash
npx convex dev
# Creates convex/ directory, prompts for project setup
```

### Step 2: Create Schema + Functions (1 hour)
- Create `convex/schema.ts` (minimal schema above)
- Create `convex/variants.ts` (2 queries, 2 mutations above)
- Deploy: `npx convex deploy`

### Step 3: Seed Existing Variants (30 min)
```typescript
// scripts/seed-variants.ts (one-time use)
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import fs from "fs";
import yaml from "yaml";
import { VariantSchema } from "../src/lib/schemas";

const convex = new ConvexHttpClient(process.env.CONVEX_URL!);
const files = fs.readdirSync("content/variants").filter(f => f.endsWith(".yaml"));

for (const file of files) {
  const content = fs.readFileSync(`content/variants/${file}`, "utf-8");
  const data = VariantSchema.parse(yaml.parse(content));

  await convex.mutation(api.variants.upsert, {
    slug: data.metadata.slug,
    publishStatus: data.metadata.publishStatus || "published",
    data,
  });
  console.log(`Seeded: ${data.metadata.slug}`);
}
```

### Step 4: Update Frontend (1 hour)
- Add `ConvexProvider` to `src/main.tsx`
- Replace `loadVariant()` with `useVariant()` hook in `src/lib/variants.ts`
- Update `VariantPortfolio.tsx` to handle loading/null states

### Step 5: Update CLI (30 min)
- Modify `scripts/generate-cv.ts` to call Convex mutation
- Test: Generate a test variant, verify it appears in Convex Dashboard

### Step 6: Verify + Cleanup (1 hour)
- Test all 18 variant URLs
- Delete `scripts/sync-variants.ts`
- Archive `content/variants/` to separate branch (don't delete yet)

## What We're NOT Doing (YAGNI)

| Feature | Why Skipped |
|---------|-------------|
| Custom React Dashboard | Convex Dashboard UI already exists and works |
| GitHub OAuth | Single user, use Convex dev/prod environments |
| Generation in Convex Actions | Local generation works, just save result to Convex |
| Feature flag rollback | Git history is the backup; keep files in archive branch |
| 4 query variants | Start with 2, add more if needed |
| Verbose Convex validators | Validate with Zod before insert |

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Convex outage | Variant pages unavailable | Low risk for personal portfolio; Convex has 99.9% SLA |
| Migration data loss | Lost variants | YAML files kept in `archive/file-based-variants` branch |
| Query slower than bundled | Slightly longer initial load | Convex queries typically <100ms; acceptable tradeoff |

## Testing (Minimal)

```typescript
// convex/variants.test.ts
import { convexTest } from "convex-test";
import { api } from "./_generated/api";

test("getBySlug returns null for non-existent", async () => {
  const t = convexTest();
  expect(await t.query(api.variants.getBySlug, { slug: "nope" })).toBeNull();
});

test("getBySlug returns null for draft", async () => {
  const t = convexTest();
  await t.mutation(api.variants.upsert, {
    slug: "test-draft",
    publishStatus: "draft",
    data: { metadata: { slug: "test-draft" } },
  });
  expect(await t.query(api.variants.getBySlug, { slug: "test-draft" })).toBeNull();
});

test("getBySlug returns data for published", async () => {
  const t = convexTest();
  await t.mutation(api.variants.upsert, {
    slug: "test-pub",
    publishStatus: "published",
    data: { metadata: { slug: "test-pub" } },
  });
  const result = await t.query(api.variants.getBySlug, { slug: "test-pub" });
  expect(result?.metadata.slug).toBe("test-pub");
});
```

## Success Criteria

After migration:
1. **Edit variant:** Open Convex Dashboard → edit data → refresh page → see change (no git, no PR)
2. **Generate variant:** Run CLI → variant appears in Convex Dashboard as draft
3. **Publish variant:** Toggle `publishStatus` in Convex Dashboard → publicly visible

## References

- Convex Docs: https://docs.convex.dev
- Existing schemas: `src/lib/schemas.ts:259-347`
- Existing variant loading: `src/lib/variants.ts:13-50`

---

*Revised based on DHH, Kieran, and Simplicity reviewer feedback. Original 4-phase plan reduced to 1-day migration.*
