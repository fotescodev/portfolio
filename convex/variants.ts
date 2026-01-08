/**
 * Convex Variants API
 *
 * Queries and mutations for variant storage and retrieval.
 * Based on the engineering spec at capstone/develop/specs/convex-integration-spec.md
 */

import { query, mutation, QueryCtx, MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { variantMetadata, variantOverrides, variantRelevance } from "./schema";

// ============================================================================
// CONSTANTS
// ============================================================================

const DEFAULT_QUERY_LIMIT = 100;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Helper: Require auth or throw
 */
async function requireAuth(ctx: QueryCtx | MutationCtx): Promise<string> {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error("Authentication required");
  }
  return userId;
}

/**
 * Helper: Get variant by slug or throw if not found
 */
async function getVariantOrThrow(ctx: QueryCtx | MutationCtx, slug: string) {
  const variant = await ctx.db
    .query("variants")
    .withIndex("by_slug", (q) => q.eq("metadata.slug", slug))
    .first();
  if (!variant) {
    throw new Error(`Variant not found: ${slug}`);
  }
  return variant;
}

// ============================================================================
// PUBLIC QUERIES (no auth required)
// ============================================================================

/**
 * Get a single PUBLISHED variant by slug
 * Used by: VariantPortfolio.tsx (public portfolio pages)
 */
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const variant = await ctx.db
      .query("variants")
      .withIndex("by_slug", (q) => q.eq("metadata.slug", args.slug))
      .first();

    // Security: Only return published variants to public
    if (!variant || variant.metadata.publishStatus !== "published") {
      return null;
    }

    return variant;
  },
});

/**
 * List published variant slugs (for sitemap/static generation)
 */
export const listPublishedSlugs = query({
  args: {},
  handler: async (ctx) => {
    const variants = await ctx.db
      .query("variants")
      .withIndex("by_status", (q) =>
        q.eq("metadata.publishStatus", "published")
      )
      .collect();

    return variants.map((v) => v.metadata.slug);
  },
});

/**
 * List all published variants (for public variant listing)
 */
export const listPublished = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const variants = await ctx.db
      .query("variants")
      .withIndex("by_status", (q) =>
        q.eq("metadata.publishStatus", "published")
      )
      .order("desc")
      .take(args.limit ?? DEFAULT_QUERY_LIMIT);

    return variants;
  },
});

// ============================================================================
// AUTHENTICATED QUERIES (dashboard only)
// ============================================================================

/**
 * Get any variant by slug (including drafts)
 * Used by: Dashboard preview, CLI verification
 * Requires: Authentication
 */
export const getBySlugAuth = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null; // Unauthenticated

    return await ctx.db
      .query("variants")
      .withIndex("by_slug", (q) => q.eq("metadata.slug", args.slug))
      .first();
  },
});

/**
 * List all variants for dashboard
 * Uses database-level filtering (no load-all-filter-later anti-pattern)
 * Requires: Authentication
 */
export const listForDashboard = query({
  args: {
    status: v.optional(
      v.union(v.literal("draft"), v.literal("published"))
    ),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return []; // Unauthenticated

    // Use index for status filter, or full table scan if no filter
    let queryBuilder = ctx.db.query("variants");

    if (args.status) {
      queryBuilder = queryBuilder.withIndex("by_status", (q) =>
        q.eq("metadata.publishStatus", args.status!)
      );
    }

    // Order by creation time (newest first) and limit at DB level
    const variants = await queryBuilder
      .order("desc")
      .take(args.limit ?? DEFAULT_QUERY_LIMIT);

    return variants;
  },
});

/**
 * Dashboard stats (counts by status)
 * Requires: Authentication
 */
export const getDashboardStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const all = await ctx.db.query("variants").collect();

    // Single pass through the array
    const stats = { total: all.length, published: 0, draft: 0, applied: 0 };
    for (const v of all) {
      if (v.metadata.publishStatus === "published") stats.published++;
      else stats.draft++;
      if (v.metadata.applicationStatus === "applied") stats.applied++;
    }
    return stats;
  },
});

// ============================================================================
// MUTATIONS (all require authentication)
// ============================================================================

/**
 * Create or update a variant
 * Used by: CLI generation, dashboard edits
 */
export const upsert = mutation({
  args: {
    metadata: variantMetadata,
    overrides: variantOverrides,
    relevance: v.optional(variantRelevance),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const now = new Date().toISOString();

    // Check for existing variant
    const existing = await ctx.db
      .query("variants")
      .withIndex("by_slug", (q) => q.eq("metadata.slug", args.metadata.slug))
      .first();

    const variantData = {
      metadata: args.metadata,
      overrides: args.overrides,
      relevance: args.relevance,
      updatedAt: now,
    };

    if (existing) {
      await ctx.db.patch(existing._id, variantData);
      return existing._id;
    } else {
      return await ctx.db.insert("variants", {
        ...variantData,
        createdAt: now,
      });
    }
  },
});

/**
 * Update variant publish status
 */
export const updateStatus = mutation({
  args: {
    slug: v.string(),
    publishStatus: v.union(v.literal("draft"), v.literal("published")),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const variant = await getVariantOrThrow(ctx, args.slug);
    const now = new Date().toISOString();

    // Build updated metadata
    const updatedMetadata = {
      ...variant.metadata,
      publishStatus: args.publishStatus,
      publishedAt:
        args.publishStatus === "published"
          ? now
          : variant.metadata.publishedAt,
    };

    await ctx.db.patch(variant._id, {
      metadata: updatedMetadata,
      updatedAt: now,
    });
  },
});

/**
 * Update application status
 */
export const updateApplicationStatus = mutation({
  args: {
    slug: v.string(),
    applicationStatus: v.union(v.literal("not_applied"), v.literal("applied")),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const variant = await getVariantOrThrow(ctx, args.slug);
    const now = new Date().toISOString();

    // Build updated metadata
    const updatedMetadata = {
      ...variant.metadata,
      applicationStatus: args.applicationStatus,
      appliedAt:
        args.applicationStatus === "applied"
          ? now
          : variant.metadata.appliedAt,
    };

    await ctx.db.patch(variant._id, {
      metadata: updatedMetadata,
      updatedAt: now,
    });
  },
});

/**
 * Delete a variant
 */
export const remove = mutation({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const variant = await getVariantOrThrow(ctx, args.slug);
    await ctx.db.delete(variant._id);
  },
});
