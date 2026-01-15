import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { variantDataValidator } from "./validators";

/**
 * Validates API key for mutations.
 * FAIL-CLOSED: Throws error if ADMIN_API_KEY is not configured.
 * This prevents accidental unprotected mutations in production.
 */
function requireAuth(apiKey: string | undefined) {
  const adminKey = process.env.ADMIN_API_KEY;
  if (!adminKey) {
    throw new Error(
      "ADMIN_API_KEY environment variable is not configured. " +
      "Set it in Convex dashboard to enable mutations."
    );
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
      applicationStatus: variant.data?.metadata?.applicationStatus || "not_applied",
      appliedAt: variant.data?.metadata?.appliedAt,
      sourceUrl: variant.data?.metadata?.sourceUrl,
      generatedAt: variant.data?.metadata?.generatedAt,
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
    data: variantDataValidator,
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
 * Update application status for a variant
 * Sets appliedAt timestamp when status changes to 'applied'
 */
export const updateApplicationStatus = mutation({
  args: {
    apiKey: v.optional(v.string()),
    slug: v.string(),
    applicationStatus: v.union(v.literal("not_applied"), v.literal("applied")),
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

    const now = new Date().toISOString();
    const updatedData = {
      ...variant.data,
      metadata: {
        ...variant.data.metadata,
        applicationStatus: args.applicationStatus,
        // Set appliedAt when marking as applied, clear it when marking as not_applied
        appliedAt: args.applicationStatus === "applied" ? now : undefined,
      },
    };

    await ctx.db.patch(variant._id, {
      data: updatedData,
      updatedAt: now,
    });

    return { success: true, applicationStatus: args.applicationStatus };
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
