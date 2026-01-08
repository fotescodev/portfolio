/**
 * Convex Database Schema
 *
 * Defines the variants table for storing job-targeted CV variants.
 * Based on the engineering spec at capstone/develop/specs/convex-integration-spec.md
 */

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// ============================================================================
// SHARED VALUE DEFINITIONS
// ============================================================================

const headlineSegment = v.object({
  text: v.string(),
  style: v.optional(
    v.union(
      v.literal("italic"),
      v.literal("muted"),
      v.literal("accent"),
      v.literal("normal")
    )
  ),
});

const stat = v.object({
  value: v.string(),
  label: v.string(),
});

// ============================================================================
// VARIANT SCHEMA (matches existing Zod schema in src/lib/schemas.ts)
// ============================================================================

export const variantMetadata = v.object({
  company: v.string(),
  role: v.string(),
  slug: v.string(),
  generatedAt: v.string(),
  jobDescription: v.string(),
  generationModel: v.optional(v.string()),
  publishStatus: v.union(v.literal("draft"), v.literal("published")),
  publishedAt: v.optional(v.string()),
  applicationStatus: v.union(v.literal("not_applied"), v.literal("applied")),
  appliedAt: v.optional(v.string()),
  sourceUrl: v.optional(v.string()),
  resumePath: v.optional(v.string()),
});

const heroOverrides = v.object({
  status: v.optional(v.string()),
  headline: v.optional(v.array(headlineSegment)),
  subheadline: v.optional(v.string()),
  companyAccent: v.optional(v.array(headlineSegment)),
});

const aboutOverrides = v.object({
  tagline: v.optional(v.string()),
  bio: v.optional(v.array(v.string())),
  stats: v.optional(v.array(stat)),
});

const sectionOverrides = v.object({
  beyondWork: v.optional(v.boolean()),
  blog: v.optional(v.boolean()),
  onchainIdentity: v.optional(v.boolean()),
  skills: v.optional(v.boolean()),
  passionProjects: v.optional(v.boolean()),
});

const experienceOverride = v.object({
  company: v.string(),
  highlights: v.optional(v.array(v.string())),
  tags: v.optional(v.array(v.string())),
});

export const variantOverrides = v.object({
  hero: v.optional(heroOverrides),
  about: v.optional(aboutOverrides),
  sections: v.optional(sectionOverrides),
  experience: v.optional(v.array(experienceOverride)),
});

const caseStudyRelevance = v.object({
  slug: v.string(),
  relevanceScore: v.number(),
  reasoning: v.optional(v.string()),
});

const skillRelevance = v.object({
  category: v.string(),
  relevanceScore: v.number(),
});

const projectRelevance = v.object({
  slug: v.string(),
  relevanceScore: v.number(),
  reasoning: v.optional(v.string()),
});

export const variantRelevance = v.object({
  caseStudies: v.optional(v.array(caseStudyRelevance)),
  skills: v.optional(v.array(skillRelevance)),
  projects: v.optional(v.array(projectRelevance)),
});

// ============================================================================
// TABLE DEFINITIONS
// ============================================================================

export default defineSchema({
  // Convex Auth tables (users, sessions, etc.)
  ...authTables,

  // Main variants table — the only custom table for MVP
  variants: defineTable({
    metadata: variantMetadata,
    overrides: variantOverrides,
    relevance: v.optional(variantRelevance),
    // Audit fields only — no denormalization
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_slug", ["metadata.slug"])
    .index("by_status", ["metadata.publishStatus"])
    // by_company: Reserved for future dashboard filtering by company
    .index("by_company", ["metadata.company"]),

  // ============================================================================
  // DEFERRED TABLES (Phase 2 — only if file-based becomes painful)
  // ============================================================================
  // evaluations: defineTable({ ... })
  // redteamRuns: defineTable({ ... })
  // generationLogs: defineTable({ ... })
});
