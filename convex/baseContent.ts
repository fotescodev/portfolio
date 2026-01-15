import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import {
  profileValidator,
  experienceValidator,
  skillsValidator,
  projectsValidator,
  caseStudiesValidator,
} from "./validators";

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
    profile: profileValidator,
    experience: experienceValidator,
    skills: skillsValidator,
    projects: projectsValidator,
    caseStudies: caseStudiesValidator,
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
