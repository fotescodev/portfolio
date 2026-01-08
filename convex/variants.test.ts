/**
 * Convex Variants API Tests
 *
 * Tests for variant queries and mutations using convex-test.
 * Based on the testing strategy in capstone/develop/specs/convex-integration-spec.md
 */

import { convexTest } from "convex-test";
import { describe, test, expect, beforeEach } from "vitest";
import schema from "./schema";
import { api } from "./_generated/api";

// Import all convex functions for the test harness
const modules = import.meta.glob("./**/*.ts");

// ============================================================================
// TEST DATA FIXTURES
// ============================================================================

const createTestVariantData = (
  slug: string,
  options?: {
    publishStatus?: "draft" | "published";
    applicationStatus?: "not_applied" | "applied";
    company?: string;
    role?: string;
  }
) => ({
  metadata: {
    company: options?.company ?? "Test Corp",
    role: options?.role ?? "Engineer",
    slug,
    generatedAt: "2026-01-08T00:00:00Z",
    jobDescription: "Test job description for " + slug,
    publishStatus: options?.publishStatus ?? "draft",
    applicationStatus: options?.applicationStatus ?? "not_applied",
  },
  overrides: {
    hero: {
      status: "Test status for " + slug,
    },
    about: {
      tagline: "Test tagline",
    },
  },
});

const createFullVariantData = (slug: string) => ({
  metadata: {
    company: "Full Test Corp",
    role: "Senior Engineer",
    slug,
    generatedAt: "2026-01-08T12:00:00Z",
    jobDescription: "Full test job description",
    generationModel: "claude-3-5-sonnet",
    publishStatus: "published" as const,
    publishedAt: "2026-01-08T12:30:00Z",
    applicationStatus: "applied" as const,
    appliedAt: "2026-01-08T13:00:00Z",
    sourceUrl: "https://example.com/jobs/senior-engineer",
    resumePath: "/resumes/full-test-corp-senior-engineer.pdf",
  },
  overrides: {
    hero: {
      status: "Actively seeking",
      headline: [
        { text: "Senior ", style: "normal" as const },
        { text: "Engineer", style: "accent" as const },
      ],
      subheadline: "Building the future",
      companyAccent: [
        { text: "— with ", style: "muted" as const },
        { text: "Full Test Corp", style: "accent" as const },
      ],
    },
    about: {
      tagline: "Full test tagline",
      bio: ["First paragraph", "Second paragraph"],
      stats: [
        { value: "10+", label: "Years" },
        { value: "50+", label: "Projects" },
      ],
    },
    sections: {
      beyondWork: true,
      blog: false,
      onchainIdentity: true,
      skills: true,
      passionProjects: false,
    },
    experience: [
      {
        company: "Previous Corp",
        highlights: ["Led team", "Shipped product"],
        tags: ["TypeScript", "React"],
      },
    ],
  },
  relevance: {
    caseStudies: [
      { slug: "case-study-1", relevanceScore: 0.9, reasoning: "Very relevant" },
    ],
    skills: [{ category: "frontend", relevanceScore: 0.85 }],
    projects: [
      { slug: "project-1", relevanceScore: 0.7, reasoning: "Somewhat relevant" },
    ],
  },
});

// ============================================================================
// PUBLIC QUERY TESTS
// ============================================================================

describe("Public Queries", () => {
  describe("getBySlug", () => {
    test("returns null for non-existent variant", async () => {
      const t = convexTest(schema, modules);
      const result = await t.query(api.variants.getBySlug, {
        slug: "non-existent-variant",
      });
      expect(result).toBeNull();
    });

    test("returns null for draft variant (security)", async () => {
      const t = convexTest(schema, modules);

      // First insert a draft variant directly into the database
      await t.run(async (ctx) => {
        const now = new Date().toISOString();
        await ctx.db.insert("variants", {
          ...createTestVariantData("draft-variant", { publishStatus: "draft" }),
          createdAt: now,
          updatedAt: now,
        });
      });

      // Public query should NOT return draft
      const result = await t.query(api.variants.getBySlug, {
        slug: "draft-variant",
      });
      expect(result).toBeNull();
    });

    test("returns published variant", async () => {
      const t = convexTest(schema, modules);

      // Insert a published variant
      await t.run(async (ctx) => {
        const now = new Date().toISOString();
        await ctx.db.insert("variants", {
          ...createTestVariantData("published-variant", {
            publishStatus: "published",
            company: "Acme Inc",
          }),
          createdAt: now,
          updatedAt: now,
        });
      });

      const result = await t.query(api.variants.getBySlug, {
        slug: "published-variant",
      });

      expect(result).not.toBeNull();
      expect(result?.metadata.slug).toBe("published-variant");
      expect(result?.metadata.company).toBe("Acme Inc");
      expect(result?.metadata.publishStatus).toBe("published");
    });

    test("returns full variant data with all fields", async () => {
      const t = convexTest(schema, modules);

      // Insert a variant with all fields populated
      const fullData = createFullVariantData("full-variant");
      await t.run(async (ctx) => {
        const now = new Date().toISOString();
        await ctx.db.insert("variants", {
          ...fullData,
          createdAt: now,
          updatedAt: now,
        });
      });

      const result = await t.query(api.variants.getBySlug, {
        slug: "full-variant",
      });

      expect(result).not.toBeNull();
      expect(result?.metadata.generationModel).toBe("claude-3-5-sonnet");
      expect(result?.overrides.hero?.headline).toHaveLength(2);
      expect(result?.relevance?.caseStudies).toHaveLength(1);
    });
  });

  describe("listPublishedSlugs", () => {
    test("returns empty array when no variants exist", async () => {
      const t = convexTest(schema, modules);
      const result = await t.query(api.variants.listPublishedSlugs, {});
      expect(result).toEqual([]);
    });

    test("returns only published variant slugs", async () => {
      const t = convexTest(schema, modules);

      // Insert mix of draft and published variants
      await t.run(async (ctx) => {
        const now = new Date().toISOString();
        await ctx.db.insert("variants", {
          ...createTestVariantData("draft-1", { publishStatus: "draft" }),
          createdAt: now,
          updatedAt: now,
        });
        await ctx.db.insert("variants", {
          ...createTestVariantData("published-1", { publishStatus: "published" }),
          createdAt: now,
          updatedAt: now,
        });
        await ctx.db.insert("variants", {
          ...createTestVariantData("published-2", { publishStatus: "published" }),
          createdAt: now,
          updatedAt: now,
        });
      });

      const slugs = await t.query(api.variants.listPublishedSlugs, {});

      expect(slugs).toContain("published-1");
      expect(slugs).toContain("published-2");
      expect(slugs).not.toContain("draft-1");
      expect(slugs).toHaveLength(2);
    });
  });

  describe("listPublished", () => {
    test("returns only published variants", async () => {
      const t = convexTest(schema, modules);

      await t.run(async (ctx) => {
        const now = new Date().toISOString();
        await ctx.db.insert("variants", {
          ...createTestVariantData("draft-only", { publishStatus: "draft" }),
          createdAt: now,
          updatedAt: now,
        });
        await ctx.db.insert("variants", {
          ...createTestVariantData("public-one", { publishStatus: "published" }),
          createdAt: now,
          updatedAt: now,
        });
      });

      const result = await t.query(api.variants.listPublished, {});

      expect(result).toHaveLength(1);
      expect(result[0].metadata.slug).toBe("public-one");
    });

    test("respects limit parameter", async () => {
      const t = convexTest(schema, modules);

      await t.run(async (ctx) => {
        const now = new Date().toISOString();
        for (let i = 0; i < 5; i++) {
          await ctx.db.insert("variants", {
            ...createTestVariantData(`pub-${i}`, { publishStatus: "published" }),
            createdAt: now,
            updatedAt: now,
          });
        }
      });

      const result = await t.query(api.variants.listPublished, { limit: 3 });
      expect(result).toHaveLength(3);
    });
  });
});

// ============================================================================
// AUTHENTICATED QUERY TESTS
// ============================================================================

describe("Authenticated Queries", () => {
  describe("getBySlugAuth", () => {
    test("returns null when not authenticated", async () => {
      const t = convexTest(schema, modules);

      // Insert a variant
      await t.run(async (ctx) => {
        const now = new Date().toISOString();
        await ctx.db.insert("variants", {
          ...createTestVariantData("auth-test", { publishStatus: "draft" }),
          createdAt: now,
          updatedAt: now,
        });
      });

      // Without identity, should return null
      const result = await t.query(api.variants.getBySlugAuth, {
        slug: "auth-test",
      });
      expect(result).toBeNull();
    });

    test("returns draft variant when authenticated", async () => {
      const t = convexTest(schema, modules);

      // Insert a draft variant
      await t.run(async (ctx) => {
        const now = new Date().toISOString();
        await ctx.db.insert("variants", {
          ...createTestVariantData("draft-auth", { publishStatus: "draft" }),
          createdAt: now,
          updatedAt: now,
        });
      });

      // With identity, should return the draft
      const authed = t.withIdentity({ subject: "user123" });
      const result = await authed.query(api.variants.getBySlugAuth, {
        slug: "draft-auth",
      });

      expect(result).not.toBeNull();
      expect(result?.metadata.slug).toBe("draft-auth");
      expect(result?.metadata.publishStatus).toBe("draft");
    });
  });

  describe("listForDashboard", () => {
    test("returns empty array when not authenticated", async () => {
      const t = convexTest(schema, modules);

      await t.run(async (ctx) => {
        const now = new Date().toISOString();
        await ctx.db.insert("variants", {
          ...createTestVariantData("any-variant"),
          createdAt: now,
          updatedAt: now,
        });
      });

      const result = await t.query(api.variants.listForDashboard, {});
      expect(result).toEqual([]);
    });

    test("returns all variants when authenticated with no filter", async () => {
      const t = convexTest(schema, modules);

      await t.run(async (ctx) => {
        const now = new Date().toISOString();
        await ctx.db.insert("variants", {
          ...createTestVariantData("dash-draft", { publishStatus: "draft" }),
          createdAt: now,
          updatedAt: now,
        });
        await ctx.db.insert("variants", {
          ...createTestVariantData("dash-pub", { publishStatus: "published" }),
          createdAt: now,
          updatedAt: now,
        });
      });

      const authed = t.withIdentity({ subject: "admin" });
      const result = await authed.query(api.variants.listForDashboard, {});

      expect(result).toHaveLength(2);
    });

    test("filters by status when specified", async () => {
      const t = convexTest(schema, modules);

      await t.run(async (ctx) => {
        const now = new Date().toISOString();
        await ctx.db.insert("variants", {
          ...createTestVariantData("filter-draft", { publishStatus: "draft" }),
          createdAt: now,
          updatedAt: now,
        });
        await ctx.db.insert("variants", {
          ...createTestVariantData("filter-pub", { publishStatus: "published" }),
          createdAt: now,
          updatedAt: now,
        });
      });

      const authed = t.withIdentity({ subject: "admin" });

      const drafts = await authed.query(api.variants.listForDashboard, {
        status: "draft",
      });
      expect(drafts).toHaveLength(1);
      expect(drafts[0].metadata.slug).toBe("filter-draft");

      const published = await authed.query(api.variants.listForDashboard, {
        status: "published",
      });
      expect(published).toHaveLength(1);
      expect(published[0].metadata.slug).toBe("filter-pub");
    });

    test("respects limit parameter", async () => {
      const t = convexTest(schema, modules);

      await t.run(async (ctx) => {
        const now = new Date().toISOString();
        for (let i = 0; i < 10; i++) {
          await ctx.db.insert("variants", {
            ...createTestVariantData(`limit-${i}`),
            createdAt: now,
            updatedAt: now,
          });
        }
      });

      const authed = t.withIdentity({ subject: "admin" });
      const result = await authed.query(api.variants.listForDashboard, {
        limit: 5,
      });
      expect(result).toHaveLength(5);
    });
  });

  describe("getDashboardStats", () => {
    test("returns null when not authenticated", async () => {
      const t = convexTest(schema, modules);
      const result = await t.query(api.variants.getDashboardStats, {});
      expect(result).toBeNull();
    });

    test("returns correct counts", async () => {
      const t = convexTest(schema, modules);

      await t.run(async (ctx) => {
        const now = new Date().toISOString();
        // 2 drafts
        await ctx.db.insert("variants", {
          ...createTestVariantData("stat-d1", { publishStatus: "draft" }),
          createdAt: now,
          updatedAt: now,
        });
        await ctx.db.insert("variants", {
          ...createTestVariantData("stat-d2", { publishStatus: "draft" }),
          createdAt: now,
          updatedAt: now,
        });
        // 3 published (1 applied)
        await ctx.db.insert("variants", {
          ...createTestVariantData("stat-p1", { publishStatus: "published" }),
          createdAt: now,
          updatedAt: now,
        });
        await ctx.db.insert("variants", {
          ...createTestVariantData("stat-p2", { publishStatus: "published" }),
          createdAt: now,
          updatedAt: now,
        });
        await ctx.db.insert("variants", {
          ...createTestVariantData("stat-p3", {
            publishStatus: "published",
            applicationStatus: "applied",
          }),
          createdAt: now,
          updatedAt: now,
        });
      });

      const authed = t.withIdentity({ subject: "admin" });
      const stats = await authed.query(api.variants.getDashboardStats, {});

      expect(stats).toEqual({
        total: 5,
        draft: 2,
        published: 3,
        applied: 1,
      });
    });
  });
});

// ============================================================================
// MUTATION TESTS
// ============================================================================

describe("Mutations", () => {
  describe("upsert", () => {
    test("throws when not authenticated", async () => {
      const t = convexTest(schema, modules);

      await expect(
        t.mutation(api.variants.upsert, createTestVariantData("no-auth"))
      ).rejects.toThrow("Authentication required");
    });

    test("creates new variant when authenticated", async () => {
      const t = convexTest(schema, modules);
      const authed = t.withIdentity({ subject: "creator" });

      const id = await authed.mutation(
        api.variants.upsert,
        createTestVariantData("new-variant")
      );

      expect(id).toBeDefined();

      // Verify it was created
      const variant = await authed.query(api.variants.getBySlugAuth, {
        slug: "new-variant",
      });
      expect(variant).not.toBeNull();
      expect(variant?.metadata.company).toBe("Test Corp");
      expect(variant?.createdAt).toBeDefined();
      expect(variant?.updatedAt).toBeDefined();
    });

    test("updates existing variant (upsert behavior)", async () => {
      const t = convexTest(schema, modules);
      const authed = t.withIdentity({ subject: "updater" });

      // Create initial variant
      await authed.mutation(
        api.variants.upsert,
        createTestVariantData("upsert-test", { company: "Original Corp" })
      );

      // Get the original
      const original = await authed.query(api.variants.getBySlugAuth, {
        slug: "upsert-test",
      });
      expect(original?.metadata.company).toBe("Original Corp");

      // Update with same slug
      await authed.mutation(
        api.variants.upsert,
        createTestVariantData("upsert-test", { company: "Updated Corp" })
      );

      // Verify update
      const updated = await authed.query(api.variants.getBySlugAuth, {
        slug: "upsert-test",
      });
      expect(updated?.metadata.company).toBe("Updated Corp");
      expect(updated?._id).toEqual(original?._id); // Same document
    });

    test("creates variant with full data including relevance", async () => {
      const t = convexTest(schema, modules);
      const authed = t.withIdentity({ subject: "full-creator" });

      const fullData = createFullVariantData("full-create");
      await authed.mutation(api.variants.upsert, fullData);

      const variant = await authed.query(api.variants.getBySlugAuth, {
        slug: "full-create",
      });

      expect(variant?.relevance).toBeDefined();
      expect(variant?.relevance?.caseStudies).toHaveLength(1);
      expect(variant?.relevance?.skills).toHaveLength(1);
      expect(variant?.overrides.experience).toHaveLength(1);
    });
  });

  describe("updateStatus", () => {
    test("throws when not authenticated", async () => {
      const t = convexTest(schema, modules);

      await expect(
        t.mutation(api.variants.updateStatus, {
          slug: "any",
          publishStatus: "published",
        })
      ).rejects.toThrow("Authentication required");
    });

    test("throws for non-existent variant", async () => {
      const t = convexTest(schema, modules);
      const authed = t.withIdentity({ subject: "admin" });

      await expect(
        authed.mutation(api.variants.updateStatus, {
          slug: "non-existent",
          publishStatus: "published",
        })
      ).rejects.toThrow("Variant not found: non-existent");
    });

    test("publishes a draft variant", async () => {
      const t = convexTest(schema, modules);
      const authed = t.withIdentity({ subject: "publisher" });

      // Create draft
      await authed.mutation(
        api.variants.upsert,
        createTestVariantData("to-publish", { publishStatus: "draft" })
      );

      // Verify it's a draft
      const draft = await authed.query(api.variants.getBySlugAuth, {
        slug: "to-publish",
      });
      expect(draft?.metadata.publishStatus).toBe("draft");

      // Publish
      await authed.mutation(api.variants.updateStatus, {
        slug: "to-publish",
        publishStatus: "published",
      });

      // Verify published
      const published = await authed.query(api.variants.getBySlugAuth, {
        slug: "to-publish",
      });
      expect(published?.metadata.publishStatus).toBe("published");
      expect(published?.metadata.publishedAt).toBeDefined();
    });

    test("unpublishes a published variant", async () => {
      const t = convexTest(schema, modules);
      const authed = t.withIdentity({ subject: "unpublisher" });

      // Create published variant
      await authed.mutation(
        api.variants.upsert,
        createTestVariantData("to-unpublish", { publishStatus: "published" })
      );

      // Unpublish
      await authed.mutation(api.variants.updateStatus, {
        slug: "to-unpublish",
        publishStatus: "draft",
      });

      // Verify draft (and still in auth query)
      const result = await authed.query(api.variants.getBySlugAuth, {
        slug: "to-unpublish",
      });
      expect(result?.metadata.publishStatus).toBe("draft");

      // Public query should now return null
      const publicResult = await t.query(api.variants.getBySlug, {
        slug: "to-unpublish",
      });
      expect(publicResult).toBeNull();
    });
  });

  describe("updateApplicationStatus", () => {
    test("throws when not authenticated", async () => {
      const t = convexTest(schema, modules);

      await expect(
        t.mutation(api.variants.updateApplicationStatus, {
          slug: "any",
          applicationStatus: "applied",
        })
      ).rejects.toThrow("Authentication required");
    });

    test("marks variant as applied", async () => {
      const t = convexTest(schema, modules);
      const authed = t.withIdentity({ subject: "applicant" });

      // Create variant
      await authed.mutation(
        api.variants.upsert,
        createTestVariantData("to-apply")
      );

      // Mark as applied
      await authed.mutation(api.variants.updateApplicationStatus, {
        slug: "to-apply",
        applicationStatus: "applied",
      });

      const variant = await authed.query(api.variants.getBySlugAuth, {
        slug: "to-apply",
      });
      expect(variant?.metadata.applicationStatus).toBe("applied");
      expect(variant?.metadata.appliedAt).toBeDefined();
    });

    test("can revert applied status", async () => {
      const t = convexTest(schema, modules);
      const authed = t.withIdentity({ subject: "reverter" });

      // Create applied variant
      await authed.mutation(
        api.variants.upsert,
        createTestVariantData("applied-variant", { applicationStatus: "applied" })
      );

      // Revert to not applied
      await authed.mutation(api.variants.updateApplicationStatus, {
        slug: "applied-variant",
        applicationStatus: "not_applied",
      });

      const variant = await authed.query(api.variants.getBySlugAuth, {
        slug: "applied-variant",
      });
      expect(variant?.metadata.applicationStatus).toBe("not_applied");
    });
  });

  describe("remove", () => {
    test("throws when not authenticated", async () => {
      const t = convexTest(schema, modules);

      await expect(
        t.mutation(api.variants.remove, { slug: "any" })
      ).rejects.toThrow("Authentication required");
    });

    test("throws for non-existent variant", async () => {
      const t = convexTest(schema, modules);
      const authed = t.withIdentity({ subject: "deleter" });

      await expect(
        authed.mutation(api.variants.remove, { slug: "ghost" })
      ).rejects.toThrow("Variant not found: ghost");
    });

    test("deletes existing variant", async () => {
      const t = convexTest(schema, modules);
      const authed = t.withIdentity({ subject: "deleter" });

      // Create variant
      await authed.mutation(
        api.variants.upsert,
        createTestVariantData("to-delete")
      );

      // Verify it exists
      const before = await authed.query(api.variants.getBySlugAuth, {
        slug: "to-delete",
      });
      expect(before).not.toBeNull();

      // Delete
      await authed.mutation(api.variants.remove, { slug: "to-delete" });

      // Verify deleted
      const after = await authed.query(api.variants.getBySlugAuth, {
        slug: "to-delete",
      });
      expect(after).toBeNull();
    });
  });
});

// ============================================================================
// INDEX TESTS
// ============================================================================

describe("Index behavior", () => {
  test("by_slug index works correctly", async () => {
    const t = convexTest(schema, modules);

    await t.run(async (ctx) => {
      const now = new Date().toISOString();
      for (let i = 0; i < 10; i++) {
        await ctx.db.insert("variants", {
          ...createTestVariantData(`indexed-${i}`, { publishStatus: "published" }),
          createdAt: now,
          updatedAt: now,
        });
      }
    });

    // Query specific slug should be fast (uses index)
    const result = await t.query(api.variants.getBySlug, {
      slug: "indexed-5",
    });
    expect(result?.metadata.slug).toBe("indexed-5");
  });

  test("by_status index filters correctly", async () => {
    const t = convexTest(schema, modules);

    await t.run(async (ctx) => {
      const now = new Date().toISOString();
      // Create 5 drafts and 5 published
      for (let i = 0; i < 5; i++) {
        await ctx.db.insert("variants", {
          ...createTestVariantData(`status-d-${i}`, { publishStatus: "draft" }),
          createdAt: now,
          updatedAt: now,
        });
        await ctx.db.insert("variants", {
          ...createTestVariantData(`status-p-${i}`, { publishStatus: "published" }),
          createdAt: now,
          updatedAt: now,
        });
      }
    });

    const published = await t.query(api.variants.listPublished, {});
    expect(published).toHaveLength(5);
    expect(published.every((v) => v.metadata.publishStatus === "published")).toBe(
      true
    );
  });

  test("by_company index can be used for filtering", async () => {
    const t = convexTest(schema, modules);

    await t.run(async (ctx) => {
      const now = new Date().toISOString();
      await ctx.db.insert("variants", {
        ...createTestVariantData("acme-1", {
          company: "Acme",
          publishStatus: "published",
        }),
        createdAt: now,
        updatedAt: now,
      });
      await ctx.db.insert("variants", {
        ...createTestVariantData("acme-2", {
          company: "Acme",
          publishStatus: "published",
        }),
        createdAt: now,
        updatedAt: now,
      });
      await ctx.db.insert("variants", {
        ...createTestVariantData("other-1", {
          company: "Other Corp",
          publishStatus: "published",
        }),
        createdAt: now,
        updatedAt: now,
      });
    });

    // Verify company index exists by checking data
    // (The actual index usage is internal to Convex)
    const all = await t.query(api.variants.listPublished, {});
    const acmeVariants = all.filter((v) => v.metadata.company === "Acme");
    expect(acmeVariants).toHaveLength(2);
  });
});
