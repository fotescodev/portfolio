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

  // Stores base portfolio content for AI generation
  baseContent: defineTable({
    key: v.string(), // "portfolio" - singleton pattern
    profile: v.any(),
    experience: v.any(),
    skills: v.any(),
    projects: v.any(),
    caseStudies: v.array(v.object({
      slug: v.string(),
      title: v.string(),
      headline: v.optional(v.string()),
    })),
    updatedAt: v.string(),
  }).index("by_key", ["key"]),
});
