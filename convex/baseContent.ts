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

/**
 * Get the base portfolio content (singleton)
 */
export const get = query({
  args: {},
  handler: async (ctx) => {
    const content = await ctx.db
      .query("baseContent")
      .withIndex("by_key", (q) => q.eq("key", "portfolio"))
      .first();

    return content;
  },
});

/**
 * Upsert base portfolio content (called from seed script)
 * Requires ADMIN_API_KEY if configured
 */
export const upsert = mutation({
  args: {
    apiKey: v.optional(v.string()),
    profile: v.any(),
    experience: v.any(),
    skills: v.any(),
    projects: v.any(),
    caseStudies: v.array(
      v.object({
        slug: v.string(),
        title: v.string(),
        headline: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    requireAuth(args.apiKey);

    const existing = await ctx.db
      .query("baseContent")
      .withIndex("by_key", (q) => q.eq("key", "portfolio"))
      .first();

    const now = new Date().toISOString();

    if (existing) {
      await ctx.db.patch(existing._id, {
        profile: args.profile,
        experience: args.experience,
        skills: args.skills,
        projects: args.projects,
        caseStudies: args.caseStudies,
        updatedAt: now,
      });
      return existing._id;
    }

    return await ctx.db.insert("baseContent", {
      key: "portfolio",
      profile: args.profile,
      experience: args.experience,
      skills: args.skills,
      projects: args.projects,
      caseStudies: args.caseStudies,
      updatedAt: now,
    });
  },
});
