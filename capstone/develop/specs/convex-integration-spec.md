# Convex Integration Engineering Specification

**Status:** Draft (Revised)
**Author:** Claude
**Created:** 2026-01-08
**Last Updated:** 2026-01-08
**Revision:** 1.2 — Added Phase 2 roadmap for deferred features

---

## Table of Contents

**Phase 1 (MVP):**
1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Current Architecture](#3-current-architecture)
4. [Target Architecture](#4-target-architecture)
5. [Convex Schema Design](#5-convex-schema-design)
6. [API Design](#6-api-design)
7. [Migration Phases](#7-migration-phases)
8. [Module Impact Analysis](#8-module-impact-analysis)
9. [Data Migration Strategy](#9-data-migration-strategy)
10. [Testing Strategy](#10-testing-strategy)
11. [Rollback Plan](#11-rollback-plan)
12. [Security Considerations](#12-security-considerations)
13. [Error Handling](#13-error-handling)
14. [Cost Analysis](#14-cost-analysis)
15. [Decisions Made](#15-decisions-made)

**Phase 2 (Deferred):**
- [Phase 2 Roadmap](#phase-2-roadmap-deferred-features) *(new)*
  - [2A: Evaluation Pipeline](#phase-2a-evaluation-pipeline-in-convex)
  - [2B: Red-Team Pipeline](#phase-2b-red-team-pipeline-in-convex)
  - [2C: Resume PDFs](#phase-2c-resume-pdfs-in-convex-file-storage)
  - [2D: Generation Logs](#phase-2d-generation-audit-logs)

**Reference:**
16. [Appendix](#16-appendix)

---

## 1. Executive Summary

### Goal

Migrate the Universal CV variant system from file-based storage (YAML/JSON in Git) to Convex, eliminating the PR ceremony for content-level variant changes while preserving the robust validation and quality gates.

### Key Benefits

| Benefit | Current Pain | With Convex |
|---------|--------------|-------------|
| **Zero-git workflow** | ~800 line PRs per variant | Edit in dashboard → live |
| **Single source of truth** | YAML + JSON dual files | One Convex document |
| **Real-time updates** | Rebuild required | Instant propagation |
| **Dynamic discovery** | Static manifest.json | Query at runtime |
| **Version history** | Git commits | Built-in Convex history |
| **Draft workflow** | No preview without merge | `publishStatus: draft` filtering |

### Scope

**In Scope (Phase 1 — MVP):**
- Variant storage and retrieval
- Dashboard with Convex Auth
- Generation CLI integration

**Deferred (Phase 2 — If Needed):**
- Evaluation results in Convex (keep file-based for now)
- Red-team results in Convex (keep file-based for now)
- Resume PDF storage (keep local generation + Git for now)
- Generation logs/audit trail

**Out of Scope:**
- Base portfolio content (profile, experience, case studies) — stays static
- React components and UI — unchanged
- Build pipeline for static assets — unchanged

### Estimated Effort

| Phase | Effort | Dependencies |
|-------|--------|--------------|
| Phase 1: Core Storage + Auth | 2 days | None |
| Phase 2: Generation Pipeline | 1 day | Phase 1 |
| Phase 3: Dashboard | 0.5 days | Phase 1 |
| **Total (MVP)** | **3-4 days** | |

**Deferred phases** (implement only if friction persists):
- Quality Gates in Convex: 1 day
- Resume PDF storage: 1 day

---

## 2. Problem Statement

### Current Friction Points

```
┌─────────────────────────────────────────────────────────────────┐
│ CURRENT WORKFLOW (per variant)                                  │
└─────────────────────────────────────────────────────────────────┘

1. Generate variant      → npm run generate:cv (creates YAML)
2. Sync to JSON          → npm run variants:sync
3. Evaluate claims       → npm run eval:variant
4. Red-team scan         → npm run redteam:variant
5. Generate resume       → npm run generate:resume
6. Update dashboard      → npm run generate:dashboard
7. Commit all artifacts  → git add . && git commit
8. Create PR             → gh pr create
9. Review & merge        → Manual approval
10. Deploy               → GitHub Actions

Files touched per variant: 6-8 files, ~800 lines changed
Time to live: 15-30 minutes minimum
```

### Pain Points Breakdown

| Pain Point | Impact | Root Cause |
|------------|--------|------------|
| Dual file sync (YAML+JSON) | Drift risk, extra commits | File-based architecture |
| Large PRs | Noisy diffs, hard to review | All artifacts in Git |
| Binary PDFs in Git | Repo bloat, merge conflicts | No external storage |
| No draft preview | Can't iterate before merge | Static deployment |
| Manual sync scripts | Easy to forget, breaks build | No single source of truth |
| Static manifest | Can't add variants dynamically | Build-time generation |

---

## 3. Current Architecture

### Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│ CURRENT ARCHITECTURE                                            │
└─────────────────────────────────────────────────────────────────┘

                    ┌──────────────────┐
                    │   AI Provider    │
                    │ (Claude/OpenAI)  │
                    └────────┬─────────┘
                             │
                             ▼
┌─────────────┐    ┌──────────────────┐    ┌──────────────────┐
│ JD Input    │───▶│  generate-cv.ts  │───▶│ content/variants │
│ (file/URL)  │    │                  │    │   ├── X.yaml     │
└─────────────┘    └──────────────────┘    │   └── X.json     │
                                           └────────┬─────────┘
                                                    │
                    ┌───────────────────────────────┼───────────┐
                    │                               │           │
                    ▼                               ▼           ▼
           ┌──────────────┐              ┌──────────────┐  ┌────────┐
           │ eval/redteam │              │ variants:sync│  │ resume │
           │   reports    │              │   + manifest │  │  PDFs  │
           └──────────────┘              └──────────────┘  └────────┘
                    │                               │           │
                    └───────────────────────────────┼───────────┘
                                                    │
                                                    ▼
                                           ┌──────────────────┐
                                           │    Git Commit    │
                                           │   + PR + Merge   │
                                           └────────┬─────────┘
                                                    │
                                                    ▼
                                           ┌──────────────────┐
                                           │  GitHub Pages    │
                                           │  (Static Host)   │
                                           └────────┬─────────┘
                                                    │
                                                    ▼
                                           ┌──────────────────┐
                                           │  Browser loads   │
                                           │  variant JSON    │
                                           │  via glob import │
                                           └──────────────────┘
```

### Key Files

| Category | Files | Purpose |
|----------|-------|---------|
| **Schemas** | `src/lib/schemas.ts` | Zod validation (VariantSchema) |
| **Types** | `src/types/variant.ts` | TypeScript interfaces |
| **Loading** | `src/lib/variants.ts` | `loadVariant()`, `mergeProfile()` |
| **Routing** | `src/pages/VariantPortfolio.tsx` | `/:company/:role` handler |
| **Context** | `src/context/VariantContext.tsx` | React context provider |
| **Generation** | `scripts/generate-cv.ts` | AI variant generation |
| **Sync** | `scripts/sync-variants.ts` | YAML→JSON + manifest |
| **Eval** | `scripts/evaluate-variants.ts` | Claims ledger builder |
| **Redteam** | `scripts/redteam.ts` | Security scanner |
| **Resume** | `scripts/generate-resume.ts` | Puppeteer PDF generation |
| **Dashboard** | `scripts/generate-dashboard.ts` | Static HTML dashboard |

---

## 4. Target Architecture

### High-Level Design

```
┌─────────────────────────────────────────────────────────────────┐
│ TARGET ARCHITECTURE (with Convex)                               │
└─────────────────────────────────────────────────────────────────┘

                    ┌──────────────────┐
                    │   AI Provider    │
                    │ (Claude/OpenAI)  │
                    └────────┬─────────┘
                             │
                             ▼
┌─────────────┐    ┌──────────────────┐    ┌──────────────────┐
│ JD Input    │───▶│  Convex Action   │───▶│  Convex Database │
│ (file/URL)  │    │  generateVariant │    │   variants table │
└─────────────┘    └──────────────────┘    └────────┬─────────┘
                                                    │
                    ┌───────────────────────────────┼───────────┐
                    │                               │           │
                    ▼                               ▼           ▼
           ┌──────────────┐              ┌──────────────┐  ┌────────┐
           │  Convex DB   │              │  Convex DB   │  │ Convex │
           │ evaluations  │              │  (variants)  │  │ Files  │
           │ redteam_runs │              │              │  │ (PDFs) │
           └──────────────┘              └──────────────┘  └────────┘
                                                    │
                                                    │ (no git needed)
                                                    ▼
                                           ┌──────────────────┐
                                           │  GitHub Pages    │
                                           │  (Static SPA)    │
                                           └────────┬─────────┘
                                                    │
                                                    ▼
                                           ┌──────────────────┐
                                           │  Browser loads   │
                                           │  variant via     │
                                           │  useQuery()      │
                                           └──────────────────┘
```

### What Changes

| Component | Before | After |
|-----------|--------|-------|
| **Variant storage** | YAML/JSON files | Convex `variants` table |
| **Variant loading** | `import.meta.glob()` | `useQuery(api.variants.getBySlug)` |
| **Manifest** | Static JSON file | `useQuery(api.variants.list)` |
| **Generation** | Local script → file | Convex action → database |
| **Evaluation** | Local script → file | Convex action → database |
| **Resume PDFs** | Git-tracked files | Convex file storage |
| **Dashboard** | Static HTML | React + Convex queries |

### What Stays the Same

| Component | Reason |
|-----------|--------|
| Base portfolio content | Static, rarely changes, benefits from Git history |
| React components | No change needed, just different data source |
| Merge logic | Same `mergeProfile()` function, different input |
| Zod validation | Convex validators mirror Zod schemas |
| Build pipeline | Still Vite, still deploys to GitHub Pages |
| URL routing | `/:company/:role` unchanged |

---

## 5. Convex Schema Design

### Database Schema (Simplified)

> **Design Decision:** Single table for MVP. Evaluation/red-team results stay file-based.
> No denormalization — Convex supports nested field indexes.

```typescript
// convex/schema.ts

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// ============================================================================
// SHARED VALUE DEFINITIONS
// ============================================================================

const headlineSegment = v.object({
  text: v.string(),
  style: v.optional(v.union(
    v.literal("italic"),
    v.literal("muted"),
    v.literal("accent"),
    v.literal("normal")
  ))
});

const stat = v.object({
  value: v.string(),
  label: v.string()
});

// ============================================================================
// VARIANT SCHEMA (matches existing Zod schema in src/lib/schemas.ts)
// ============================================================================

const variantMetadata = v.object({
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
  resumePath: v.optional(v.string()), // Path to PDF in /public/resumes/
});

const heroOverrides = v.object({
  status: v.optional(v.string()),
  headline: v.optional(v.array(headlineSegment)),
  subheadline: v.optional(v.string()),
  companyAccent: v.optional(v.array(headlineSegment))
});

const aboutOverrides = v.object({
  tagline: v.optional(v.string()),
  bio: v.optional(v.array(v.string())),
  stats: v.optional(v.array(stat))
});

const sectionOverrides = v.object({
  beyondWork: v.optional(v.boolean()),
  blog: v.optional(v.boolean()),
  onchainIdentity: v.optional(v.boolean()),
  skills: v.optional(v.boolean()),
  passionProjects: v.optional(v.boolean())
});

const experienceOverride = v.object({
  company: v.string(),
  highlights: v.optional(v.array(v.string())),
  tags: v.optional(v.array(v.string()))
});

const variantOverrides = v.object({
  hero: v.optional(heroOverrides),
  about: v.optional(aboutOverrides),
  sections: v.optional(sectionOverrides),
  experience: v.optional(v.array(experienceOverride))
});

const caseStudyRelevance = v.object({
  slug: v.string(),
  relevanceScore: v.number(),
  reasoning: v.optional(v.string())
});

const skillRelevance = v.object({
  category: v.string(),
  relevanceScore: v.number()
});

const projectRelevance = v.object({
  slug: v.string(),
  relevanceScore: v.number(),
  reasoning: v.optional(v.string())
});

const variantRelevance = v.object({
  caseStudies: v.optional(v.array(caseStudyRelevance)),
  skills: v.optional(v.array(skillRelevance)),
  projects: v.optional(v.array(projectRelevance))
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
    .index("by_company", ["metadata.company"]),

  // ============================================================================
  // DEFERRED TABLES (Phase 2 — only if file-based becomes painful)
  // ============================================================================
  // evaluations: defineTable({ ... })
  // redteamRuns: defineTable({ ... })
  // generationLogs: defineTable({ ... })
});
```

### Why This Schema?

| Decision | Rationale |
|----------|-----------|
| **Single table** | 18 variants don't need 4 tables. YAGNI. |
| **No denormalization** | Convex indexes nested fields. Less sync bugs. |
| **Auth tables included** | Real authentication, not security theater. |
| **Deferred tables commented** | Clear path to expand if needed. |

### Schema Mapping: Zod → Convex

| Zod Type | Convex Type | Notes |
|----------|-------------|-------|
| `z.string()` | `v.string()` | Direct mapping |
| `z.number()` | `v.number()` | Direct mapping |
| `z.boolean()` | `v.boolean()` | Direct mapping |
| `z.array(T)` | `v.array(T)` | Direct mapping |
| `z.object({})` | `v.object({})` | Direct mapping |
| `z.optional(T)` | `v.optional(T)` | Direct mapping |
| `z.enum([...])` | `v.union(v.literal(...), ...)` | Explicit union |
| `z.literal(X)` | `v.literal(X)` | Direct mapping |
| `z.string().email()` | `v.string()` | Validation in action |
| `z.string().regex()` | `v.string()` | Validation in action |
| `z.number().min().max()` | `v.number()` | Validation in action |

---

## 6. API Design

### Queries

```typescript
// convex/variants.ts

import { query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

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
      .withIndex("by_status", (q) => q.eq("metadata.publishStatus", "published"))
      .collect();

    return variants.map(v => v.metadata.slug);
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
    status: v.optional(v.union(
      v.literal("draft"),
      v.literal("published")
    )),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return []; // Unauthenticated

    // Use index for status filter, or full table scan if no filter
    let query = ctx.db.query("variants");

    if (args.status) {
      query = query.withIndex("by_status", (q) =>
        q.eq("metadata.publishStatus", args.status)
      );
    }

    // Order by creation time (newest first) and limit at DB level
    const variants = await query
      .order("desc")
      .take(args.limit || 100);

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

    return {
      total: all.length,
      published: all.filter(v => v.metadata.publishStatus === "published").length,
      draft: all.filter(v => v.metadata.publishStatus === "draft").length,
      applied: all.filter(v => v.metadata.applicationStatus === "applied").length,
    };
  },
});
```

### Why This API Design?

| Decision | Rationale |
|----------|-----------|
| **Separate public/auth queries** | Clear security boundary. Public can only see published. |
| **No unused parameters** | Every arg is used. No `includeUnpublished` lies. |
| **DB-level filtering** | `.withIndex()` + `.take()` instead of load-all-filter-later. |
| **Auth via `getAuthUserId`** | Real Convex Auth, not password theater. |

### Mutations

> **All mutations require authentication.** No anonymous writes to the database.

```typescript
// convex/variants.ts (continued)

import { mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

/**
 * Helper: Require auth or throw
 */
async function requireAuth(ctx: any) {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error("Authentication required");
  }
  return userId;
}

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

    const variant = await ctx.db
      .query("variants")
      .withIndex("by_slug", (q) => q.eq("metadata.slug", args.slug))
      .first();

    if (!variant) {
      throw new Error(`Variant not found: ${args.slug}`);
    }

    const now = new Date().toISOString();

    // Update nested metadata field
    await ctx.db.patch(variant._id, {
      "metadata.publishStatus": args.publishStatus,
      "metadata.publishedAt": args.publishStatus === "published" ? now : undefined,
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

    const variant = await ctx.db
      .query("variants")
      .withIndex("by_slug", (q) => q.eq("metadata.slug", args.slug))
      .first();

    if (!variant) {
      throw new Error(`Variant not found: ${args.slug}`);
    }

    const now = new Date().toISOString();

    await ctx.db.patch(variant._id, {
      "metadata.applicationStatus": args.applicationStatus,
      "metadata.appliedAt": args.applicationStatus === "applied" ? now : undefined,
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

    const variant = await ctx.db
      .query("variants")
      .withIndex("by_slug", (q) => q.eq("metadata.slug", args.slug))
      .first();

    if (!variant) {
      throw new Error(`Variant not found: ${args.slug}`);
    }

    await ctx.db.delete(variant._id);
  },
});
```

### Why These Mutations?

| Decision | Rationale |
|----------|-----------|
| **All require auth** | No anonymous database writes. Period. |
| **No denormalized updates** | Only update `metadata.*` fields. Single source of truth. |
| **No cascade deletes** | Eval/redteam stay file-based. Simple delete. |
| **Shared `requireAuth` helper** | DRY auth check pattern. |

### Actions (Server-side with External APIs)

> **Design Decision: Portfolio Context Strategy**
>
> Portfolio content (profile, experience, case studies) is **bundled as static JSON**.
> - Rationale: This data changes ~quarterly. No need for runtime fetches.
> - The generation action imports bundled context, not fetches from Convex/CDN.
> - This keeps cold starts fast and reduces complexity.

```typescript
// convex/actions/generate.ts

import { action } from "../_generated/server";
import { v } from "convex/values";
import { api } from "../_generated/api";

// Bundled at build time — static portfolio content
import portfolioContext from "./portfolio-context.json";

/**
 * Generate a variant using AI
 * Runs server-side with access to API keys via Convex env vars
 */
export const generateVariant = action({
  args: {
    company: v.string(),
    role: v.string(),
    jobDescription: v.string(),
    sourceUrl: v.optional(v.string()),
    model: v.optional(v.union(
      v.literal("claude"),
      v.literal("openai"),
      v.literal("gemini")
    )),
  },
  handler: async (ctx, args) => {
    // Auth check for actions
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Authentication required");
    }

    const slug = `${args.company.toLowerCase().replace(/\s+/g, '-')}-${args.role.toLowerCase().replace(/\s+/g, '-')}`;
    const model = args.model || "claude";

    // 1. Build prompt using bundled portfolio context
    const prompt = buildGenerationPrompt({
      portfolioContext,
      jobDescription: args.jobDescription,
      company: args.company,
      role: args.role,
    });

    // 2. Call AI provider (API key from Convex env vars)
    const apiKey = process.env.ANTHROPIC_API_KEY; // Set in Convex dashboard
    const response = await callAIProvider(model, prompt, apiKey);

    // 3. Parse and validate response
    const variantData = parseVariantResponse(response);

    // 4. Save to database
    const variantId = await ctx.runMutation(api.variants.upsert, {
      metadata: {
        company: args.company,
        role: args.role,
        slug,
        generatedAt: new Date().toISOString(),
        jobDescription: args.jobDescription,
        generationModel: model,
        publishStatus: "draft",
        applicationStatus: "not_applied",
        sourceUrl: args.sourceUrl,
      },
      overrides: variantData.overrides,
      relevance: variantData.relevance,
    });

    return { success: true, slug, variantId };
  },
});

// ============================================================================
// HELPER FUNCTIONS (implementation details)
// ============================================================================

function buildGenerationPrompt(args: {
  portfolioContext: typeof portfolioContext;
  jobDescription: string;
  company: string;
  role: string;
}): string {
  // Same prompt logic as current scripts/generate-cv.ts
  // Just moved server-side
  return `...`;
}

async function callAIProvider(
  model: string,
  prompt: string,
  apiKey: string
): Promise<string> {
  // Switch on model, call appropriate API
  // Return raw AI response
  return `...`;
}

function parseVariantResponse(response: string): {
  overrides: VariantOverrides;
  relevance?: VariantRelevance;
} {
  // Parse YAML from AI response
  // Validate against schema
  return { overrides: {}, relevance: undefined };
}
```

### Why This Action Design?

| Decision | Rationale |
|----------|-----------|
| **Bundled portfolio context** | Static data. No runtime fetches. Fast cold starts. |
| **Auth in actions** | Even server-side actions need auth for writes. |
| **No generation logs table** | YAGNI. Console logs are fine for now. |
| **No eval/redteam actions** | Keep file-based for MVP. Less complexity. |

### Deferred: Eval/Redteam Actions

> Evaluation and red-team pipelines remain **file-based** for MVP.
>
> If the friction of local eval becomes unbearable, add these actions later:
> - `evaluateVariant` — Claims extraction + knowledge base search
> - `redteamVariant` — Security/quality checks
>
> For now, continue using `npm run eval:variant` and `npm run redteam:variant`.

---

## 7. Migration Phases

### Phase 1: Core Storage (Day 1-2)

**Goal:** Replace file-based variant storage with Convex database

```
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 1: CORE STORAGE                                           │
└─────────────────────────────────────────────────────────────────┘

BEFORE:
  /content/variants/*.yaml  →  import.meta.glob()  →  VariantPortfolio

AFTER:
  Convex variants table  →  useQuery()  →  VariantPortfolio
```

#### Tasks

| Task | File(s) | Changes |
|------|---------|---------|
| Initialize Convex | `convex/` directory | `npx convex dev` |
| Define schema | `convex/schema.ts` | Tables, indexes, validators |
| Create queries | `convex/variants.ts` | `getBySlug`, `list`, `listSlugs` |
| Create mutations | `convex/variants.ts` | `upsert`, `updateStatus`, `remove` |
| Add Convex provider | `src/main.tsx` | `<ConvexProvider>` wrapper |
| Update variant loading | `src/lib/variants.ts` | Replace glob with `useQuery` |
| Update VariantPortfolio | `src/pages/VariantPortfolio.tsx` | Use Convex query |
| Seed existing variants | `scripts/seed-variants.ts` | One-time migration |

#### File Changes: `src/lib/variants.ts`

```typescript
// BEFORE
const variantFiles = import.meta.glob('../../content/variants/*.json', {
  eager: false
});

export async function loadVariant(slug: string): Promise<Variant | null> {
  const filePath = `../../content/variants/${slug}.json`;
  const loader = variantFiles[filePath];
  if (!loader) return null;
  const module = await loader();
  return VariantSchema.parse(module.default);
}

// AFTER
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

// Hook for React components
export function useVariant(slug: string) {
  return useQuery(api.variants.getBySlug, { slug });
}

// Async function for non-React contexts
export async function loadVariant(
  convex: ConvexReactClient,
  slug: string
): Promise<Variant | null> {
  const result = await convex.query(api.variants.getBySlug, { slug });
  return result ? VariantSchema.parse(result) : null;
}

// mergeProfile stays the same - just takes Variant data
export function mergeProfile(variant: Variant): MergedProfile {
  // ... unchanged
}
```

#### File Changes: `src/pages/VariantPortfolio.tsx`

```typescript
// BEFORE
import { loadVariant, mergeProfile } from '../lib/variants';

export function VariantPortfolio() {
  const { company, role } = useParams();
  const [variant, setVariant] = useState<Variant | null>(null);

  useEffect(() => {
    const slug = `${company}-${role}`;
    loadVariant(slug).then(setVariant);
  }, [company, role]);

  // ...
}

// AFTER
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { mergeProfile } from '../lib/variants';

export function VariantPortfolio() {
  const { company, role } = useParams();
  const slug = `${company}-${role}`;

  const variant = useQuery(api.variants.getBySlug, { slug });

  // Loading state
  if (variant === undefined) {
    return <LoadingSpinner />;
  }

  // Not found
  if (variant === null) {
    return <Navigate to="/404" />;
  }

  const mergedProfile = mergeProfile(variant);

  return (
    <VariantProvider profile={mergedProfile} variant={variant}>
      <Portfolio />
    </VariantProvider>
  );
}
```

#### Seed Script

```typescript
// scripts/seed-variants.ts

import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import fs from "fs";
import path from "path";
import yaml from "yaml";
import { VariantSchema } from "../src/lib/schemas";

const client = new ConvexHttpClient(process.env.CONVEX_URL!);

async function seedVariants() {
  const variantsDir = path.join(__dirname, "../content/variants");
  const files = fs.readdirSync(variantsDir).filter(f => f.endsWith(".yaml"));

  console.log(`Found ${files.length} variants to seed`);

  for (const file of files) {
    const content = fs.readFileSync(path.join(variantsDir, file), "utf-8");
    const data = yaml.parse(content);
    const variant = VariantSchema.parse(data);

    console.log(`Seeding: ${variant.metadata.slug}`);

    await client.mutation(api.variants.upsert, {
      metadata: variant.metadata,
      overrides: variant.overrides,
      relevance: variant.relevance,
    });
  }

  console.log("Done!");
}

seedVariants().catch(console.error);
```

#### Validation Checklist

- [ ] Convex project initialized
- [ ] Schema deployed
- [ ] All existing variants seeded
- [ ] `/:company/:role` routes load from Convex
- [ ] Loading states handle undefined/null correctly
- [ ] 404 handling works for missing variants
- [ ] Merge logic produces identical output

---

### Phase 2: Generation Pipeline (Day 3)

**Goal:** Move variant generation from local script to Convex action

```
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 2: GENERATION PIPELINE                                    │
└─────────────────────────────────────────────────────────────────┘

BEFORE:
  npm run generate:cv  →  AI API  →  write YAML/JSON files  →  git commit

AFTER:
  npm run generate:cv  →  Convex action  →  save to DB  →  (no git needed)
```

#### Tasks

| Task | File(s) | Changes |
|------|---------|---------|
| Create generation action | `convex/actions/generate.ts` | AI integration, prompt building |
| Add environment secrets | Convex dashboard | API keys |
| Update CLI | `scripts/generate-cv.ts` | Call Convex action instead of local AI |
| Add streaming support | `convex/actions/generate.ts` | Progress updates (optional) |
| Add generation logs | `convex/generationLogs.ts` | Audit trail |

#### Updated CLI

```typescript
// scripts/generate-cv.ts (simplified)

import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

const client = new ConvexHttpClient(process.env.CONVEX_URL!);

async function generateVariant(options: GenerateOptions) {
  const spinner = ora("Generating variant...").start();

  try {
    const result = await client.action(api.actions.generate.generateVariant, {
      company: options.company,
      role: options.role,
      jobDescription: options.jobDescription,
      sourceUrl: options.sourceUrl,
      model: options.model,
    });

    spinner.succeed(`Generated variant: ${result.slug}`);
    console.log(`View: ${process.env.SITE_URL}/${options.company}/${options.role}`);

  } catch (error) {
    spinner.fail(`Generation failed: ${error.message}`);
    process.exit(1);
  }
}
```

#### Validation Checklist

- [ ] API keys configured in Convex dashboard
- [ ] Generation creates variant in database
- [ ] Generated variants load correctly in frontend
- [ ] Generation logs tracked
- [ ] Error handling works

---

### Phase 3: Quality Gates (Day 4)

**Goal:** Move evaluation and red-team pipelines to Convex

```
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 3: QUALITY GATES                                          │
└─────────────────────────────────────────────────────────────────┘

BEFORE:
  npm run eval:variant  →  write YAML files  →  git commit

AFTER:
  npm run eval:variant  →  Convex action  →  save to evaluations table
```

#### Tasks

| Task | File(s) | Changes |
|------|---------|---------|
| Create eval action | `convex/actions/evaluate.ts` | Claims extraction, source search |
| Create redteam action | `convex/actions/redteam.ts` | All 8 checks |
| Update CLI wrappers | `scripts/evaluate-variants.ts` | Call Convex actions |
| Add quality gate queries | `convex/variants.ts` | `getEvaluation`, `getRedteamRun` |
| Update CI checks | `.github/workflows/` | Use Convex queries for gates |

#### Validation Checklist

- [ ] Evaluation runs and stores results
- [ ] Red-team runs and stores findings
- [ ] CI can query quality gate status
- [ ] `npm run eval:check` uses Convex data

---

### Phase 4: Resume PDFs (Day 5 - Optional)

**Goal:** Move PDF generation to Convex action with file storage

```
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 4: RESUME PDFs                                            │
└─────────────────────────────────────────────────────────────────┘

BEFORE:
  Puppeteer local  →  write to /public/resumes/  →  git commit

AFTER:
  Convex action  →  Puppeteer (cloud)  →  Convex file storage
```

#### Options

**Option A: Keep Local (Recommended for now)**
- Keep Puppeteer running locally
- Upload generated PDF to Convex file storage
- Store `resumeStorageId` in variant metadata
- Pros: Simpler, uses existing infrastructure
- Cons: Still need local Puppeteer for generation

**Option B: Cloud PDF Service**
- Use external service (e.g., Browserless, Puppeteer Cloud)
- Convex action calls service API
- Pros: Fully serverless
- Cons: Additional cost, latency

**Option C: On-Demand Generation**
- Don't pre-generate PDFs
- Generate on first request, cache result
- Pros: No storage, always fresh
- Cons: First load latency

#### Recommended: Option A Implementation

```typescript
// scripts/generate-resume.ts (updated)

import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

async function generateResume(slug: string) {
  // 1. Generate PDF locally with Puppeteer (existing code)
  const pdfBuffer = await generatePdfWithPuppeteer(slug);

  // 2. Upload to Convex file storage
  const client = new ConvexHttpClient(process.env.CONVEX_URL!);

  const uploadUrl = await client.mutation(api.files.generateUploadUrl);

  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: { "Content-Type": "application/pdf" },
    body: pdfBuffer,
  });

  const { storageId } = await response.json();

  // 3. Update variant with storage ID
  await client.mutation(api.variants.updateResume, {
    slug,
    resumeStorageId: storageId,
  });

  console.log(`Resume uploaded: ${storageId}`);
}
```

#### Validation Checklist

- [ ] PDFs upload to Convex storage
- [ ] Variant metadata includes `resumeStorageId`
- [ ] Resume download links work
- [ ] Old Git-tracked PDFs can be removed

---

### Phase 5: Dashboard (Day 5-6)

**Goal:** Replace static HTML dashboard with React + Convex queries

```
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 5: DASHBOARD                                              │
└─────────────────────────────────────────────────────────────────┘

BEFORE:
  npm run generate:dashboard  →  static HTML  →  git commit

AFTER:
  React component  →  useQuery(api.variants.list)  →  real-time updates
```

#### Tasks

| Task | File(s) | Changes |
|------|---------|---------|
| Create dashboard page | `src/pages/Dashboard.tsx` | React component |
| Add route | `src/App.tsx` | `/dashboard` route |
| Add auth check | `src/pages/Dashboard.tsx` | Password gate (or Convex auth) |
| Remove static generation | `scripts/generate-dashboard.ts` | Delete or deprecate |
| Add real-time updates | `src/pages/Dashboard.tsx` | Convex subscriptions |

#### Dashboard Component

```typescript
// src/pages/Dashboard.tsx

import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

export function Dashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [search, setSearch] = useState("");

  const variants = useQuery(api.variants.list, { status: filter });

  // Filter by search
  const filtered = variants?.filter(v =>
    v.company.toLowerCase().includes(search.toLowerCase()) ||
    v.role.toLowerCase().includes(search.toLowerCase())
  );

  if (!authenticated) {
    return <PasswordGate onSuccess={() => setAuthenticated(true)} />;
  }

  return (
    <div className="dashboard">
      <header>
        <h1>CV Dashboard</h1>
        <input
          type="search"
          placeholder="Search variants..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="published">Published</option>
          <option value="draft">Drafts</option>
        </select>
      </header>

      <main>
        {filtered?.map(variant => (
          <VariantCard
            key={variant._id}
            variant={variant}
          />
        ))}
      </main>
    </div>
  );
}
```

#### Validation Checklist

- [ ] Dashboard loads variants from Convex
- [ ] Search and filter work
- [ ] Password protection works
- [ ] Real-time updates when variants change
- [ ] Can remove static `generate-dashboard.ts`

---

## 8. Module Impact Analysis

### Impact Summary

| Module | Impact Level | Changes Required |
|--------|--------------|------------------|
| **Variant Storage** | 🔴 High | Complete rewrite of data source |
| **Variant Loading** | 🔴 High | Replace glob with queries |
| **Generation CLI** | 🟡 Medium | Update to call Convex action |
| **Evaluation CLI** | 🟡 Medium | Update to call Convex action |
| **Red-team CLI** | 🟡 Medium | Update to call Convex action |
| **Resume Generation** | 🟡 Medium | Add Convex upload step |
| **Dashboard** | 🟡 Medium | Rewrite as React component |
| **Build Pipeline** | 🟢 Low | Remove variants:sync from prebuild |
| **React Components** | 🟢 Low | No changes (same data shape) |
| **Merge Logic** | 🟢 Low | No changes (same function) |
| **Routing** | 🟢 Low | No changes |
| **Styling** | ⚪ None | No changes |

### Detailed Impact: Variant Loading

**Current Flow:**
```
URL /:company/:role
    ↓
useParams() extracts { company, role }
    ↓
loadVariant(`${company}-${role}`)
    ↓
import.meta.glob loader
    ↓
dynamic import of JSON file
    ↓
Zod validation
    ↓
return Variant | null
```

**New Flow:**
```
URL /:company/:role
    ↓
useParams() extracts { company, role }
    ↓
useQuery(api.variants.getBySlug, { slug: `${company}-${role}` })
    ↓
Convex query execution
    ↓
return Variant | null | undefined (loading)
```

**Key Differences:**
1. **Loading state**: Convex returns `undefined` while loading
2. **Reactivity**: Automatic re-fetch on data changes
3. **Validation**: Convex validators instead of Zod (at boundary)
4. **Caching**: Convex handles caching automatically

### Detailed Impact: Generation CLI

**Current Flow:**
```
npm run generate:cv --company X --role Y --jd ./jd.txt
    ↓
Load portfolio context from local files
    ↓
Build prompt
    ↓
Call AI API directly (using local env vars)
    ↓
Parse response
    ↓
Validate with Zod
    ↓
Write YAML to content/variants/X-Y.yaml
    ↓
Write JSON to content/variants/X-Y.json
    ↓
(Manual) git commit + PR
```

**New Flow:**
```
npm run generate:cv --company X --role Y --jd ./jd.txt
    ↓
Call Convex action: api.actions.generate.generateVariant
    ↓
(In Convex) Load portfolio context
    ↓
(In Convex) Build prompt
    ↓
(In Convex) Call AI API (using Convex env vars)
    ↓
(In Convex) Validate with Convex validators
    ↓
(In Convex) Insert into variants table
    ↓
Return { success, slug }
    ↓
(No git needed)
```

**Key Differences:**
1. **API keys**: Stored in Convex dashboard, not local `.env`
2. **Output**: Database insert, not file write
3. **Validation**: Convex validators (mirroring Zod)
4. **Git**: No commit required

### Detailed Impact: Dashboard

**Current Flow:**
```
npm run generate:dashboard
    ↓
Read all YAML files from content/variants/
    ↓
Extract metadata
    ↓
Generate static HTML with embedded data
    ↓
Write to public/cv-dashboard/index.html
    ↓
git commit + deploy
    ↓
User visits /cv-dashboard/
    ↓
Static HTML loads
    ↓
Password check in JS
    ↓
Display embedded variant cards
```

**New Flow:**
```
User visits /dashboard
    ↓
React component mounts
    ↓
useQuery(api.variants.list)
    ↓
Convex returns variant list (real-time)
    ↓
Display variant cards
    ↓
Changes to variants reflect immediately
```

**Key Differences:**
1. **Generation step**: None required
2. **Data freshness**: Always current
3. **Git commits**: None for dashboard updates
4. **Real-time**: Automatic updates when variants change

---

## 9. Data Migration Strategy

### Migration Steps

```
┌─────────────────────────────────────────────────────────────────┐
│ DATA MIGRATION STEPS                                            │
└─────────────────────────────────────────────────────────────────┘

Step 1: PREPARE
  - Deploy Convex schema
  - Configure environment variables
  - Test queries/mutations in Convex dashboard

Step 2: SEED
  - Run seed script to copy all YAML variants to Convex
  - Verify count matches: 18 variants
  - Spot-check 3-5 variants for data integrity

Step 3: PARALLEL RUN
  - Deploy frontend with Convex integration
  - Keep file-based loading as fallback
  - Monitor for errors

Step 4: VALIDATE
  - Compare rendered output: file vs Convex
  - Test all routes
  - Test search/filter functionality

Step 5: CUTOVER
  - Remove file-based loading code
  - Remove variants:sync from build
  - Archive YAML/JSON files (don't delete yet)

Step 6: CLEANUP
  - Delete content/variants/*.yaml
  - Delete content/variants/*.json
  - Delete scripts/sync-variants.ts
  - Update documentation
```

### Seed Script Details

```typescript
// scripts/seed-variants.ts

import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import fs from "fs";
import path from "path";
import yaml from "yaml";
import { VariantSchema } from "../src/lib/schemas";

const CONVEX_URL = process.env.CONVEX_URL;
if (!CONVEX_URL) {
  throw new Error("CONVEX_URL environment variable required");
}

const client = new ConvexHttpClient(CONVEX_URL);

interface SeedOptions {
  dryRun?: boolean;
  force?: boolean; // Overwrite existing
}

async function seedVariants(options: SeedOptions = {}) {
  const variantsDir = path.join(__dirname, "../content/variants");
  const files = fs.readdirSync(variantsDir)
    .filter(f => f.endsWith(".yaml") && !f.startsWith("_"));

  console.log(`Found ${files.length} variants to seed`);

  const results = {
    created: 0,
    updated: 0,
    skipped: 0,
    errors: [] as string[],
  };

  for (const file of files) {
    const slug = file.replace(".yaml", "");

    try {
      const content = fs.readFileSync(
        path.join(variantsDir, file),
        "utf-8"
      );
      const data = yaml.parse(content);
      const variant = VariantSchema.parse(data);

      if (options.dryRun) {
        console.log(`[DRY RUN] Would seed: ${slug}`);
        results.created++;
        continue;
      }

      // Check if exists
      const existing = await client.query(api.variants.getBySlugWithDrafts, {
        slug
      });

      if (existing && !options.force) {
        console.log(`Skipping (exists): ${slug}`);
        results.skipped++;
        continue;
      }

      await client.mutation(api.variants.upsert, {
        metadata: variant.metadata,
        overrides: variant.overrides,
        relevance: variant.relevance,
      });

      if (existing) {
        console.log(`Updated: ${slug}`);
        results.updated++;
      } else {
        console.log(`Created: ${slug}`);
        results.created++;
      }

    } catch (error) {
      console.error(`Error seeding ${slug}:`, error.message);
      results.errors.push(`${slug}: ${error.message}`);
    }
  }

  console.log("\n--- Seed Summary ---");
  console.log(`Created: ${results.created}`);
  console.log(`Updated: ${results.updated}`);
  console.log(`Skipped: ${results.skipped}`);
  console.log(`Errors: ${results.errors.length}`);

  if (results.errors.length > 0) {
    console.log("\nErrors:");
    results.errors.forEach(e => console.log(`  - ${e}`));
  }
}

// CLI
const args = process.argv.slice(2);
seedVariants({
  dryRun: args.includes("--dry-run"),
  force: args.includes("--force"),
}).catch(console.error);
```

### Rollback Capability

During migration, maintain ability to rollback:

```typescript
// src/lib/variants.ts

const USE_CONVEX = process.env.VITE_USE_CONVEX === "true";

export async function loadVariant(slug: string): Promise<Variant | null> {
  if (USE_CONVEX) {
    return loadVariantFromConvex(slug);
  } else {
    return loadVariantFromFile(slug);
  }
}
```

---

## 10. Testing Strategy

### Unit Tests

```typescript
// convex/variants.test.ts

import { convexTest } from "convex-test";
import { expect, test } from "vitest";
import { api } from "./_generated/api";

test("getBySlug returns null for non-existent variant", async () => {
  const t = convexTest();
  const result = await t.query(api.variants.getBySlug, {
    slug: "non-existent"
  });
  expect(result).toBeNull();
});

test("upsert creates new variant", async () => {
  const t = convexTest();

  const variantData = {
    metadata: {
      company: "Test Corp",
      role: "Engineer",
      slug: "test-corp-engineer",
      generatedAt: "2026-01-08T00:00:00Z",
      jobDescription: "Test JD",
      publishStatus: "draft" as const,
      applicationStatus: "not_applied" as const,
    },
    overrides: {},
  };

  const id = await t.mutation(api.variants.upsert, variantData);
  expect(id).toBeDefined();

  const retrieved = await t.query(api.variants.getBySlugWithDrafts, {
    slug: "test-corp-engineer"
  });
  expect(retrieved?.metadata.company).toBe("Test Corp");
});

test("getBySlug filters unpublished variants", async () => {
  const t = convexTest();

  // Create draft variant
  await t.mutation(api.variants.upsert, {
    metadata: {
      company: "Draft Co",
      role: "PM",
      slug: "draft-co-pm",
      generatedAt: "2026-01-08T00:00:00Z",
      jobDescription: "Test",
      publishStatus: "draft",
      applicationStatus: "not_applied",
    },
    overrides: {},
  });

  // Public query should not return draft
  const publicResult = await t.query(api.variants.getBySlug, {
    slug: "draft-co-pm"
  });
  expect(publicResult).toBeNull();

  // Internal query should return draft
  const internalResult = await t.query(api.variants.getBySlugWithDrafts, {
    slug: "draft-co-pm"
  });
  expect(internalResult).not.toBeNull();
});
```

### Integration Tests

```typescript
// tests/integration/variant-flow.test.ts

import { test, expect } from "@playwright/test";

test("variant portfolio loads from Convex", async ({ page }) => {
  // Assuming a seeded variant exists
  await page.goto("/stripe/senior-pm");

  // Wait for Convex query to complete
  await page.waitForSelector("[data-testid='hero-headline']");

  // Verify variant-specific content rendered
  const headline = await page.textContent("[data-testid='hero-headline']");
  expect(headline).toContain("Stripe");
});

test("non-existent variant shows 404", async ({ page }) => {
  await page.goto("/fake-company/fake-role");

  await page.waitForSelector("[data-testid='not-found']");
  expect(await page.textContent("h1")).toContain("Not Found");
});

test("dashboard lists variants", async ({ page }) => {
  await page.goto("/dashboard");

  // Handle password gate
  await page.fill("[data-testid='password-input']", process.env.DASHBOARD_PASSWORD!);
  await page.click("[data-testid='submit-password']");

  // Wait for variants to load
  await page.waitForSelector("[data-testid='variant-card']");

  const cards = await page.$$("[data-testid='variant-card']");
  expect(cards.length).toBeGreaterThan(0);
});
```

### Migration Verification Tests

```typescript
// scripts/verify-migration.ts

import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import fs from "fs";
import path from "path";
import yaml from "yaml";
import { VariantSchema } from "../src/lib/schemas";
import { isEqual } from "lodash-es";

async function verifyMigration() {
  const client = new ConvexHttpClient(process.env.CONVEX_URL!);
  const variantsDir = path.join(__dirname, "../content/variants");
  const files = fs.readdirSync(variantsDir)
    .filter(f => f.endsWith(".yaml") && !f.startsWith("_"));

  let passed = 0;
  let failed = 0;

  for (const file of files) {
    const slug = file.replace(".yaml", "");

    // Load from file
    const content = fs.readFileSync(path.join(variantsDir, file), "utf-8");
    const fileVariant = VariantSchema.parse(yaml.parse(content));

    // Load from Convex
    const convexVariant = await client.query(
      api.variants.getBySlugWithDrafts,
      { slug }
    );

    if (!convexVariant) {
      console.error(`FAIL: ${slug} - not found in Convex`);
      failed++;
      continue;
    }

    // Compare core fields
    const fileCore = {
      metadata: fileVariant.metadata,
      overrides: fileVariant.overrides,
      relevance: fileVariant.relevance,
    };

    const convexCore = {
      metadata: convexVariant.metadata,
      overrides: convexVariant.overrides,
      relevance: convexVariant.relevance,
    };

    if (isEqual(fileCore, convexCore)) {
      console.log(`PASS: ${slug}`);
      passed++;
    } else {
      console.error(`FAIL: ${slug} - data mismatch`);
      failed++;
    }
  }

  console.log(`\n--- Results ---`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);

  process.exit(failed > 0 ? 1 : 0);
}

verifyMigration().catch(console.error);
```

---

## 11. Rollback Plan

### Rollback Triggers

| Scenario | Trigger | Action |
|----------|---------|--------|
| **Convex outage** | 5+ minutes downtime | Switch to file fallback |
| **Data corruption** | Variants returning incorrect data | Restore from file source |
| **Performance issues** | P95 latency > 2s | Enable caching or fallback |
| **Critical bug** | Blocking bug in production | Revert deployment |

### Rollback Steps

**Immediate (< 5 minutes):**
```bash
# 1. Set environment variable to disable Convex
export VITE_USE_CONVEX=false

# 2. Redeploy
npm run build && npm run deploy
```

**Full Rollback (< 30 minutes):**
```bash
# 1. Revert to pre-migration commit
git revert --no-commit HEAD~N..HEAD  # N = number of migration commits

# 2. Restore variants:sync to build
# (already in pre-migration code)

# 3. Redeploy
npm run build && npm run deploy

# 4. Notify team
```

### Data Recovery

If Convex data is corrupted:

```bash
# 1. Re-seed from file source (still in git history)
git checkout main -- content/variants/

# 2. Run seed script with force
npm run seed:variants -- --force

# 3. Verify
npm run verify:migration
```

---

## 12. Security Considerations

### Authentication: Convex Auth

> **Decision:** Use Convex Auth with GitHub OAuth for single-user dashboard access.

```typescript
// convex/auth.config.ts
import GitHub from "@auth/core/providers/github";
import { convexAuth } from "@convex-dev/auth/server";

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [GitHub],
});
```

**Why GitHub OAuth?**
- You already use GitHub for the portfolio repo
- Single authorized user (you)
- No password to manage/remember
- Revocable via GitHub settings

**Access Control:**
```typescript
// Whitelist your GitHub user ID in env
const AUTHORIZED_USER_ID = process.env.AUTHORIZED_GITHUB_USER_ID;

async function requireAuth(ctx: any) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity || identity.subject !== AUTHORIZED_USER_ID) {
    throw new Error("Unauthorized");
  }
  return identity;
}
```

### API Key Management

| Key | Current Location | Convex Location |
|-----|------------------|-----------------|
| `ANTHROPIC_API_KEY` | `.env.local` | Convex Environment Variables |
| `OPENAI_API_KEY` | `.env.local` | Convex Environment Variables |
| `AUTHORIZED_GITHUB_USER_ID` | N/A | Convex Environment Variables |

**Access Control:**
- API keys only accessible in Convex actions (server-side)
- Never exposed to client
- Rotatable via Convex dashboard

### Query Security

| Query Type | Auth Required | Data Returned |
|------------|---------------|---------------|
| `getBySlug` | No | Published variants only |
| `listPublishedSlugs` | No | Slugs only (no JD/content) |
| `getBySlugAuth` | Yes | Any variant including drafts |
| `listForDashboard` | Yes | All variants with full data |

### Data Validation

All mutations validate input:
- Convex validators at API boundary
- Business logic validation in handlers
- No raw database access from client
- All writes require authentication

---

## 13. Error Handling

> **Serghei's feedback:** "The happy path is documented beautifully. The sad path? We don't talk about that."

### Frontend Error Handling

```typescript
// src/pages/VariantPortfolio.tsx

import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

export function VariantPortfolio() {
  const { company, role } = useParams();
  const slug = `${company}-${role}`;

  const variant = useQuery(api.variants.getBySlug, { slug });

  // State: Loading (Convex query in flight)
  if (variant === undefined) {
    return <LoadingSpinner />;
  }

  // State: Not found (variant doesn't exist or not published)
  if (variant === null) {
    return <NotFoundPage />;
  }

  // State: Success
  const mergedProfile = mergeProfile(variant);
  return (
    <VariantProvider profile={mergedProfile} variant={variant}>
      <Portfolio />
    </VariantProvider>
  );
}
```

### Convex Connection Errors

```typescript
// src/components/ConvexErrorBoundary.tsx

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ErrorBoundary } from "react-error-boundary";

function ConvexErrorFallback({ error }: { error: Error }) {
  const isNetworkError = error.message.includes("network") ||
                         error.message.includes("fetch");

  if (isNetworkError) {
    return (
      <div className="error-page">
        <h1>Connection Error</h1>
        <p>Unable to connect to the server. Please check your internet connection.</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="error-page">
      <h1>Something went wrong</h1>
      <p>{error.message}</p>
    </div>
  );
}

export function AppWithErrorBoundary() {
  return (
    <ErrorBoundary FallbackComponent={ConvexErrorFallback}>
      <ConvexProvider client={convex}>
        <App />
      </ConvexProvider>
    </ErrorBoundary>
  );
}
```

### Generation Action Timeout

```typescript
// scripts/generate-cv.ts (CLI)

const GENERATION_TIMEOUT_MS = 120_000; // 2 minutes

async function generateVariant(options: GenerateOptions) {
  const spinner = ora("Generating variant...").start();

  try {
    const result = await Promise.race([
      client.action(api.actions.generate.generateVariant, {
        company: options.company,
        role: options.role,
        jobDescription: options.jobDescription,
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Generation timed out after 2 minutes")), GENERATION_TIMEOUT_MS)
      ),
    ]);

    spinner.succeed(`Generated: ${result.slug}`);

  } catch (error) {
    spinner.fail(`Generation failed: ${error.message}`);

    if (error.message.includes("timed out")) {
      console.log("\nTip: Try a shorter job description or check Convex dashboard for logs.");
    }

    process.exit(1);
  }
}
```

### Fallback Strategy: File-Based Loading

> During migration, keep file-based loading as fallback.

```typescript
// src/lib/variants.ts

const USE_CONVEX = import.meta.env.VITE_USE_CONVEX === "true";

// Fallback: Load from bundled JSON files
const variantFiles = import.meta.glob('../../content/variants/*.json', {
  eager: false
});

async function loadVariantFromFile(slug: string): Promise<Variant | null> {
  const loader = variantFiles[`../../content/variants/${slug}.json`];
  if (!loader) return null;
  const module = await loader();
  return VariantSchema.parse(module.default);
}

// Primary: Load from Convex (in React components)
export function useVariant(slug: string) {
  const convexResult = useQuery(
    USE_CONVEX ? api.variants.getBySlug : skipToken,
    USE_CONVEX ? { slug } : undefined
  );

  // If Convex disabled or not configured, fall back to file
  if (!USE_CONVEX) {
    const [variant, setVariant] = useState<Variant | null>(null);
    useEffect(() => {
      loadVariantFromFile(slug).then(setVariant);
    }, [slug]);
    return variant;
  }

  return convexResult;
}
```

### Error Scenarios Summary

| Scenario | Detection | User Experience | Recovery |
|----------|-----------|-----------------|----------|
| **Convex down** | Network error in query | "Connection Error" page | Retry button |
| **Variant not found** | Query returns `null` | 404 page | Link to home |
| **Auth expired** | `getAuthUserId` returns `null` | Redirect to login | Re-authenticate |
| **Generation timeout** | Promise.race timeout | CLI error message | Retry with shorter JD |
| **Invalid variant data** | Zod validation fails | Console error | Fix source data |

---

## 14. Cost Analysis

### Convex Pricing (as of 2026)

| Resource | Free Tier | Pro Tier |
|----------|-----------|----------|
| Database storage | 512 MB | 10 GB |
| Bandwidth | 1 GB/month | 50 GB/month |
| Function invocations | 1M/month | 10M/month |
| File storage | 1 GB | 50 GB |

### Estimated Usage

| Resource | Estimated Usage | Tier Needed |
|----------|-----------------|-------------|
| Database storage | ~10 MB (variants) | Free |
| Bandwidth | ~5 GB/month | Pro (if high traffic) |
| Function invocations | ~100K/month | Free |
| File storage | ~500 MB (PDFs) | Free |

### Cost Projection

- **Development phase**: Free tier sufficient
- **Production (low traffic)**: Free tier sufficient
- **Production (high traffic)**: ~$25/month Pro tier

### Comparison to Current

| Current Cost | With Convex |
|--------------|-------------|
| GitHub Pages: Free | GitHub Pages: Free |
| Git storage: Free | Git storage: Free (less) |
| N/A | Convex: Free or ~$25/month |

**Net impact**: $0-25/month additional cost, offset by time savings (~2-4 hours/variant).

---

## 15. Decisions Made

> Per QA feedback (Serghei review), the following decisions are now final:

### Technical Decisions

| Question | Decision | Rationale |
|----------|----------|-----------|
| **Dashboard auth** | Convex Auth with GitHub OAuth | Real security, not password theater |
| **Portfolio context** | Bundled as static JSON | Data changes quarterly. No runtime fetches. |
| **Resume PDF strategy** | Keep local (deferred) | Puppeteer works. Don't fix what isn't broken. |
| **Eval/redteam storage** | Keep file-based (deferred) | YAGNI. Single table for MVP. |
| **Schema denormalization** | Removed | Convex indexes nested fields. Less sync bugs. |

### Process Decisions

| Question | Decision | Rationale |
|----------|----------|-----------|
| **Migration approach** | Feature flag (`VITE_USE_CONVEX`) | Instant rollback capability |
| **YAML files** | Keep as backup (archive branch) | Git history is free insurance |
| **CI/CD changes** | Remove `variants:sync` after validation | Clean up after proven stable |

### Open for Future

1. **Multi-user support**: Add more GitHub users to whitelist if needed
2. **Variant templates**: Consider if generating many similar variants
3. **Analytics**: Track views/conversions if you want data

---

## Phase 2 Roadmap (Deferred Features)

> Implement these features **only if** file-based approaches become painful.
> Each section includes trigger conditions and implementation details.

### Phase 2A: Evaluation Pipeline in Convex

**Trigger condition:** Running `npm run eval:variant` locally becomes annoying, or you want evaluation status visible in the dashboard.

**Schema addition:**
```typescript
// Add to convex/schema.ts

const claim = v.object({
  id: v.string(),
  text: v.string(),
  location: v.string(),
  anchors: v.array(v.string()),
  verified: v.boolean(),
  verifiedAt: v.optional(v.string()),
  verifiedBy: v.optional(v.string()),
  sources: v.array(v.object({
    file: v.string(),
    score: v.number(),
    excerpt: v.optional(v.string())
  }))
});

evaluations: defineTable({
  variantId: v.id("variants"),
  slug: v.string(),
  claims: v.array(claim),
  allVerified: v.boolean(),
  contentHash: v.string(),
  evaluatedAt: v.string(),
})
  .index("by_variant", ["variantId"])
  .index("by_slug", ["slug"]),
```

**New action:**
```typescript
// convex/actions/evaluate.ts

export const evaluateVariant = action({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Authentication required");

    // 1. Load variant
    const variant = await ctx.runQuery(api.variants.getBySlugAuth, {
      slug: args.slug,
    });
    if (!variant) throw new Error(`Variant not found: ${args.slug}`);

    // 2. Extract claims from overrides
    const claims = extractMetricClaims(variant.overrides);

    // 3. Search knowledge base for sources
    // Note: Knowledge base stays file-based, bundled into action
    const claimsWithSources = await matchClaimsToSources(claims);

    // 4. Save evaluation
    const contentHash = hashObject(variant.overrides);
    await ctx.runMutation(api.evaluations.save, {
      variantId: variant._id,
      slug: args.slug,
      claims: claimsWithSources,
      contentHash,
    });

    return {
      totalClaims: claims.length,
      verified: claimsWithSources.filter(c => c.verified).length,
      unverified: claimsWithSources.filter(c => !c.verified).length,
    };
  },
});
```

**Dashboard integration:**
```typescript
// Show eval status on variant cards
const evaluation = useQuery(api.evaluations.getBySlug, { slug });

<VariantCard>
  {evaluation?.allVerified ? (
    <Badge color="green">✓ Verified</Badge>
  ) : (
    <Badge color="yellow">{evaluation?.claims.filter(c => !c.verified).length} unverified</Badge>
  )}
</VariantCard>
```

**Effort:** ~1 day

---

### Phase 2B: Red-Team Pipeline in Convex

**Trigger condition:** Want security scan results visible in dashboard, or want to block publishing of variants that fail security checks.

**Schema addition:**
```typescript
// Add to convex/schema.ts

const redteamFinding = v.object({
  checkId: v.string(),
  severity: v.union(v.literal("pass"), v.literal("warn"), v.literal("fail")),
  message: v.string(),
  details: v.optional(v.string())
});

redteamRuns: defineTable({
  variantId: v.id("variants"),
  slug: v.string(),
  findings: v.array(redteamFinding),
  overallStatus: v.union(v.literal("pass"), v.literal("warn"), v.literal("fail")),
  scannedAt: v.string(),
})
  .index("by_variant", ["variantId"])
  .index("by_slug", ["slug"]),
```

**New action:**
```typescript
// convex/actions/redteam.ts

export const redteamVariant = action({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Authentication required");

    const variant = await ctx.runQuery(api.variants.getBySlugAuth, {
      slug: args.slug,
    });
    if (!variant) throw new Error(`Variant not found: ${args.slug}`);

    // Run all checks
    const findings = [
      checkSecrets(variant),           // RT-SEC-SECRETS
      checkConfidential(variant),      // RT-SEC-CONFIDENTIAL
      checkSycophancy(variant),        // RT-TONE-SYCOPHANCY
      checkInflation(variant),         // RT-ACC-INFLATION
      checkPromptInjection(variant),   // RT-INPUT-INJECTION
      checkJdLength(variant),          // RT-PRIV-JD
      checkCrossContamination(variant),// RT-XVAR-CONTAM
    ].flat();

    const hasFail = findings.some(f => f.severity === "fail");
    const hasWarn = findings.some(f => f.severity === "warn");
    const overallStatus = hasFail ? "fail" : hasWarn ? "warn" : "pass";

    await ctx.runMutation(api.redteamRuns.save, {
      variantId: variant._id,
      slug: args.slug,
      findings,
      overallStatus,
    });

    return { overallStatus, findings };
  },
});
```

**Publish gate (optional):**
```typescript
// Block publishing if redteam failed
export const updateStatus = mutation({
  handler: async (ctx, args) => {
    if (args.publishStatus === "published") {
      const lastRedteam = await ctx.db
        .query("redteamRuns")
        .withIndex("by_slug", q => q.eq("slug", args.slug))
        .order("desc")
        .first();

      if (!lastRedteam || lastRedteam.overallStatus === "fail") {
        throw new Error("Cannot publish: variant failed security scan");
      }
    }
    // ... rest of mutation
  },
});
```

**Effort:** ~1 day

---

### Phase 2C: Resume PDFs in Convex File Storage

**Trigger condition:** Git repo bloat from PDFs becomes annoying, or you want on-demand PDF generation.

**Option A: Upload after local generation (recommended)**

```typescript
// scripts/generate-resume.ts (updated)

async function generateAndUploadResume(slug: string) {
  // 1. Generate PDF locally with Puppeteer (unchanged)
  const pdfBuffer = await generatePdfWithPuppeteer(slug);

  // 2. Get upload URL from Convex
  const uploadUrl = await client.mutation(api.files.generateUploadUrl);

  // 3. Upload PDF
  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: { "Content-Type": "application/pdf" },
    body: pdfBuffer,
  });
  const { storageId } = await response.json();

  // 4. Update variant with storage ID
  await client.mutation(api.variants.updateResume, {
    slug,
    resumeStorageId: storageId,
  });

  // 5. Get public URL for download
  const publicUrl = await client.query(api.files.getUrl, { storageId });
  console.log(`Resume uploaded: ${publicUrl}`);
}
```

**Schema change:**
```typescript
const variantMetadata = v.object({
  // ... existing fields
  resumeStorageId: v.optional(v.id("_storage")), // Add this
  resumePath: v.optional(v.string()), // Keep for backwards compat
});
```

**File serving:**
```typescript
// convex/files.ts

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    await requireAuth(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

export const getUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});
```

**Option B: On-demand generation via cloud service**

```typescript
// convex/actions/generateResume.ts

export const generateResume = action({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Authentication required");

    // Check if already generated
    const variant = await ctx.runQuery(api.variants.getBySlugAuth, {
      slug: args.slug,
    });
    if (variant?.metadata.resumeStorageId) {
      return await ctx.storage.getUrl(variant.metadata.resumeStorageId);
    }

    // Generate via Browserless or similar
    const pdfBuffer = await fetch("https://chrome.browserless.io/pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
      body: JSON.stringify({
        url: `${process.env.SITE_URL}/${args.slug.replace("-", "/")}/resume`,
        options: { format: "Letter", printBackground: true },
      }),
    }).then(r => r.arrayBuffer());

    // Upload to Convex storage
    const storageId = await ctx.storage.store(new Blob([pdfBuffer]));

    // Update variant
    await ctx.runMutation(api.variants.updateResume, {
      slug: args.slug,
      resumeStorageId: storageId,
    });

    return await ctx.storage.getUrl(storageId);
  },
});
```

**Effort:** ~1 day (Option A) or ~1.5 days (Option B)

---

### Phase 2D: Generation Audit Logs

**Trigger condition:** Want to track AI costs, debug generation failures, or audit who generated what.

**Schema addition:**
```typescript
generationLogs: defineTable({
  variantId: v.optional(v.id("variants")),
  slug: v.string(),
  company: v.string(),
  role: v.string(),
  model: v.string(),
  promptTokens: v.optional(v.number()),
  completionTokens: v.optional(v.number()),
  durationMs: v.number(),
  success: v.boolean(),
  errorMessage: v.optional(v.string()),
  generatedAt: v.string(),
  generatedBy: v.string(), // GitHub user ID
})
  .index("by_slug", ["slug"])
  .index("by_date", ["generatedAt"])
  .index("by_user", ["generatedBy"]),
```

**Update generation action:**
```typescript
export const generateVariant = action({
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const startTime = Date.now();

    try {
      // ... existing generation logic ...

      // Log success
      await ctx.runMutation(api.generationLogs.create, {
        variantId,
        slug,
        company: args.company,
        role: args.role,
        model,
        promptTokens: response.usage?.prompt_tokens,
        completionTokens: response.usage?.completion_tokens,
        durationMs: Date.now() - startTime,
        success: true,
        generatedAt: new Date().toISOString(),
        generatedBy: identity.subject,
      });

      return { success: true, slug, variantId };

    } catch (error) {
      // Log failure
      await ctx.runMutation(api.generationLogs.create, {
        slug,
        company: args.company,
        role: args.role,
        model,
        durationMs: Date.now() - startTime,
        success: false,
        errorMessage: error.message,
        generatedAt: new Date().toISOString(),
        generatedBy: identity.subject,
      });

      throw error;
    }
  },
});
```

**Dashboard cost tracking:**
```typescript
// Show monthly AI costs
const logs = useQuery(api.generationLogs.listByMonth, {
  month: "2026-01"
});

const totalTokens = logs?.reduce((acc, log) => ({
  prompt: acc.prompt + (log.promptTokens || 0),
  completion: acc.completion + (log.completionTokens || 0),
}), { prompt: 0, completion: 0 });

// Claude pricing: $3/1M input, $15/1M output (as of 2026)
const estimatedCost = (totalTokens.prompt * 3 + totalTokens.completion * 15) / 1_000_000;
```

**Effort:** ~0.5 days

---

### Phase 2 Summary

| Feature | Trigger | Effort | Priority |
|---------|---------|--------|----------|
| **Eval in Convex** | Want dashboard visibility for claim verification | 1 day | Medium |
| **Redteam in Convex** | Want publish gates, dashboard security status | 1 day | Medium |
| **Resume PDFs** | Git bloat, want on-demand generation | 1-1.5 days | Low |
| **Generation Logs** | Want cost tracking, audit trail | 0.5 days | Low |

**Total Phase 2 effort:** 3.5-4 days (if all features implemented)

**Recommendation:** Don't implement any of these until you've used the MVP for at least 2-4 weeks and feel specific pain.

---

## 16. Appendix

### A. Convex Setup Commands

```bash
# Initialize Convex in project
npx convex dev

# Deploy schema
npx convex deploy

# Run type generation
npx convex codegen

# Set environment variable
npx convex env set ANTHROPIC_API_KEY sk-...

# View logs
npx convex logs
```

### B. Package Dependencies

```json
{
  "dependencies": {
    "convex": "^1.x.x"
  },
  "devDependencies": {
    "convex-test": "^0.x.x"
  }
}
```

### C. Environment Variables

```bash
# .env.local (development)
CONVEX_URL=https://xxx.convex.cloud
VITE_CONVEX_URL=https://xxx.convex.cloud
VITE_USE_CONVEX=true

# Convex dashboard (production)
ANTHROPIC_API_KEY=sk-...
OPENAI_API_KEY=sk-...
DASHBOARD_PASSWORD=...
```

### D. File Structure After Migration

```
portfolio/
├── convex/
│   ├── _generated/
│   ├── schema.ts
│   ├── variants.ts
│   ├── actions/
│   │   ├── generate.ts
│   │   ├── evaluate.ts
│   │   └── redteam.ts
│   └── files.ts
├── src/
│   ├── lib/
│   │   ├── variants.ts      # Updated: Convex queries
│   │   └── schemas.ts       # Unchanged: Still used for local validation
│   └── pages/
│       ├── VariantPortfolio.tsx  # Updated: useQuery
│       └── Dashboard.tsx         # New: React dashboard
├── scripts/
│   ├── generate-cv.ts       # Updated: Calls Convex action
│   ├── seed-variants.ts     # New: Migration script
│   └── verify-migration.ts  # New: Verification script
└── content/
    └── variants/            # Archived after migration
```

### E. References

- [Convex Documentation](https://docs.convex.dev)
- [Convex Schema Reference](https://docs.convex.dev/database/schemas)
- [Convex Actions](https://docs.convex.dev/functions/actions)
- [Convex File Storage](https://docs.convex.dev/file-storage)
- [Convex Authentication](https://docs.convex.dev/auth)

---

## Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2026-01-08 | 1.0 | Initial draft |
| 2026-01-08 | 1.1 | **QA Revision** (Serghei feedback): |
| | | - Simplified scope: Single table MVP, deferred eval/redteam |
| | | - Added Convex Auth with GitHub OAuth (no more password theater) |
| | | - Fixed load-all-filter-later anti-pattern in `list` query |
| | | - Removed denormalized fields (Convex indexes nested fields) |
| | | - Removed unused `includeUnpublished` parameter lie |
| | | - Added Error Handling section |
| | | - Decided portfolio context strategy: bundled static JSON |
| | | - Reduced estimated effort from 5-6 days to 3-4 days |
| 2026-01-08 | 1.2 | **Phase 2 Roadmap**: |
| | | - Added deferred feature specs for Eval, Redteam, PDFs, Logs |
| | | - Each feature includes trigger conditions and implementation |
| | | - Total Phase 2 effort: 3.5-4 days if all implemented |
| | | - Recommendation: Use MVP 2-4 weeks before implementing Phase 2 |

---

*End of specification*
