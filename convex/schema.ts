import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import {
  variantDataValidator,
  profileValidator,
  experienceValidator,
  skillsValidator,
  projectsValidator,
  caseStudiesValidator,
} from "./validators";

export default defineSchema({
  variants: defineTable({
    slug: v.string(),
    publishStatus: v.union(v.literal("draft"), v.literal("published")),
    data: variantDataValidator,
    updatedAt: v.string(),
  })
    .index("by_slug", ["slug"])
    .index("by_status", ["publishStatus"]),

  // Stores base portfolio content for AI generation
  baseContent: defineTable({
    key: v.string(), // "portfolio" - singleton pattern
    profile: profileValidator,
    experience: experienceValidator,
    skills: skillsValidator,
    projects: projectsValidator,
    caseStudies: caseStudiesValidator,
    updatedAt: v.string(),
  }).index("by_key", ["key"]),
});
