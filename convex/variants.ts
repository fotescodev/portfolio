import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Simple API key check for mutations
function requireAuth(apiKey: string | undefined) {
  const adminKey = process.env.ADMIN_API_KEY;
  if (!adminKey) {
    // If no admin key is configured, allow access (development mode)
    return;
  }
  if (apiKey !== adminKey) {
    throw new Error("Unauthorized: Invalid API key");
  }
}

// ============================================================================
// PUBLIC QUERIES
// ============================================================================

/**
 * Get a published variant by slug
 * Returns null if not found or if variant is draft
 */
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

/**
 * List all published variant slugs (for sitemap/discovery)
 */
export const listPublishedSlugs = query({
  args: {},
  handler: async (ctx) => {
    const variants = await ctx.db
      .query("variants")
      .withIndex("by_status", (q) => q.eq("publishStatus", "published"))
      .collect();
    return variants.map((variant) => variant.slug);
  },
});

/**
 * List all variants (for dashboard/admin)
 */
export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const variants = await ctx.db.query("variants").collect();
    return variants.map((variant) => ({
      _id: variant._id,
      slug: variant.slug,
      publishStatus: variant.publishStatus,
      updatedAt: variant.updatedAt,
      company: variant.data?.metadata?.company,
      role: variant.data?.metadata?.role,
      // Additional fields for dashboard
      generatedAt: variant.data?.metadata?.generatedAt,
      applicationStatus: variant.data?.metadata?.applicationStatus || "not_applied",
      sourceUrl: variant.data?.metadata?.sourceUrl,
    }));
  },
});

// ============================================================================
// MUTATIONS
// ============================================================================

/**
 * Upsert a variant (create or update by slug)
 * Requires ADMIN_API_KEY if configured
 */
export const upsert = mutation({
  args: {
    apiKey: v.optional(v.string()),
    slug: v.string(),
    publishStatus: v.union(v.literal("draft"), v.literal("published")),
    data: v.any(),
  },
  handler: async (ctx, args) => {
    requireAuth(args.apiKey);

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

/**
 * Update publish status only
 * Requires ADMIN_API_KEY if configured
 */
export const updateStatus = mutation({
  args: {
    apiKey: v.optional(v.string()),
    slug: v.string(),
    publishStatus: v.union(v.literal("draft"), v.literal("published")),
  },
  handler: async (ctx, args) => {
    requireAuth(args.apiKey);

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

/**
 * Update application status (not_applied → applied)
 * Used by dashboard to track which jobs have been applied to
 */
export const updateApplicationStatus = mutation({
  args: {
    slug: v.string(),
    applicationStatus: v.union(v.literal("not_applied"), v.literal("applied")),
  },
  handler: async (ctx, args) => {
    const variant = await ctx.db
      .query("variants")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (!variant) {
      throw new Error(`Variant not found: ${args.slug}`);
    }

    const now = new Date().toISOString();

    // Update applicationStatus in nested data.metadata
    const updatedData = {
      ...variant.data,
      metadata: {
        ...variant.data?.metadata,
        applicationStatus: args.applicationStatus,
        appliedAt: args.applicationStatus === "applied" ? now : undefined,
      },
    };

    await ctx.db.patch(variant._id, {
      data: updatedData,
      updatedAt: now,
    });
  },
});

/**
 * Delete a variant
 * Requires ADMIN_API_KEY if configured
 */
export const remove = mutation({
  args: {
    apiKey: v.optional(v.string()),
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    requireAuth(args.apiKey);

    const variant = await ctx.db
      .query("variants")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (!variant) {
      throw new Error(`Variant not found: ${args.slug}`);
    }

    await ctx.db.delete(variant._id);
  },
});
