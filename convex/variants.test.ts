import { convexTest } from "convex-test";
import { describe, it, expect, beforeEach } from "vitest";
import { api } from "./_generated/api";
import schema from "./schema";

describe("variants", () => {
  describe("upsert", () => {
    it("creates a new variant when slug does not exist", async () => {
      const t = convexTest(schema);

      const variantData = {
        metadata: {
          company: "TestCo",
          role: "Engineer",
          slug: "testco-engineer",
          generatedAt: new Date().toISOString(),
        },
        overrides: { hero: { status: "Open to roles" } },
      };

      const id = await t.mutation(api.variants.upsert, {
        slug: "testco-engineer",
        publishStatus: "draft",
        data: variantData,
      });

      expect(id).toBeDefined();

      // Verify variant was created
      const variants = await t.query(api.variants.listAll, {});
      expect(variants).toHaveLength(1);
      expect(variants[0].slug).toBe("testco-engineer");
      expect(variants[0].publishStatus).toBe("draft");
      expect(variants[0].company).toBe("TestCo");
    });

    it("updates existing variant when slug exists", async () => {
      const t = convexTest(schema);

      // Create initial variant
      await t.mutation(api.variants.upsert, {
        slug: "testco-engineer",
        publishStatus: "draft",
        data: { metadata: { company: "TestCo", role: "Engineer" } },
      });

      // Update with new data
      await t.mutation(api.variants.upsert, {
        slug: "testco-engineer",
        publishStatus: "published",
        data: { metadata: { company: "TestCo Updated", role: "Senior Engineer" } },
      });

      // Verify only one variant exists with updated data
      const variants = await t.query(api.variants.listAll, {});
      expect(variants).toHaveLength(1);
      expect(variants[0].publishStatus).toBe("published");
      expect(variants[0].company).toBe("TestCo Updated");
      expect(variants[0].role).toBe("Senior Engineer");
    });
  });

  describe("getBySlug", () => {
    it("returns null for non-existent slug", async () => {
      const t = convexTest(schema);
      const result = await t.query(api.variants.getBySlug, { slug: "nonexistent" });
      expect(result).toBeNull();
    });

    it("returns null for draft variants", async () => {
      const t = convexTest(schema);

      // Create a draft variant
      await t.mutation(api.variants.upsert, {
        slug: "draft-variant",
        publishStatus: "draft",
        data: { metadata: { company: "DraftCo", role: "Test" } },
      });

      const result = await t.query(api.variants.getBySlug, { slug: "draft-variant" });
      expect(result).toBeNull();
    });

    it("returns variant data for published variants", async () => {
      const t = convexTest(schema);

      const variantData = {
        metadata: { company: "PublishedCo", role: "Developer" },
        overrides: { hero: { headline: "Test headline" } },
      };

      await t.mutation(api.variants.upsert, {
        slug: "published-variant",
        publishStatus: "published",
        data: variantData,
      });

      const result = await t.query(api.variants.getBySlug, { slug: "published-variant" });
      expect(result).toEqual(variantData);
    });
  });

  describe("listPublishedSlugs", () => {
    it("returns empty array when no variants exist", async () => {
      const t = convexTest(schema);
      const result = await t.query(api.variants.listPublishedSlugs, {});
      expect(result).toEqual([]);
    });

    it("returns only published variant slugs", async () => {
      const t = convexTest(schema);

      // Create mix of draft and published variants
      await t.mutation(api.variants.upsert, {
        slug: "draft-one",
        publishStatus: "draft",
        data: { metadata: { company: "A" } },
      });

      await t.mutation(api.variants.upsert, {
        slug: "published-one",
        publishStatus: "published",
        data: { metadata: { company: "B" } },
      });

      await t.mutation(api.variants.upsert, {
        slug: "published-two",
        publishStatus: "published",
        data: { metadata: { company: "C" } },
      });

      const result = await t.query(api.variants.listPublishedSlugs, {});
      expect(result).toHaveLength(2);
      expect(result).toContain("published-one");
      expect(result).toContain("published-two");
      expect(result).not.toContain("draft-one");
    });
  });

  describe("listAll", () => {
    it("returns all variants with extracted metadata", async () => {
      const t = convexTest(schema);

      await t.mutation(api.variants.upsert, {
        slug: "testco-engineer",
        publishStatus: "published",
        data: {
          metadata: {
            company: "TestCo",
            role: "Engineer",
            applicationStatus: "applied",
            appliedAt: "2025-01-01T00:00:00Z",
            sourceUrl: "https://example.com/job",
            generatedAt: "2025-01-01T00:00:00Z",
          },
        },
      });

      const result = await t.query(api.variants.listAll, {});
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        slug: "testco-engineer",
        publishStatus: "published",
        company: "TestCo",
        role: "Engineer",
        applicationStatus: "applied",
        sourceUrl: "https://example.com/job",
      });
    });

    it("defaults applicationStatus to 'not_applied' when missing", async () => {
      const t = convexTest(schema);

      await t.mutation(api.variants.upsert, {
        slug: "no-status",
        publishStatus: "draft",
        data: { metadata: { company: "NoCo" } },
      });

      const result = await t.query(api.variants.listAll, {});
      expect(result[0].applicationStatus).toBe("not_applied");
    });
  });

  describe("updateStatus", () => {
    it("updates publish status for existing variant", async () => {
      const t = convexTest(schema);

      await t.mutation(api.variants.upsert, {
        slug: "testco-dev",
        publishStatus: "draft",
        data: { metadata: { company: "TestCo" } },
      });

      await t.mutation(api.variants.updateStatus, {
        slug: "testco-dev",
        publishStatus: "published",
      });

      const variants = await t.query(api.variants.listAll, {});
      expect(variants[0].publishStatus).toBe("published");
    });

    it("throws error for non-existent variant", async () => {
      const t = convexTest(schema);

      await expect(
        t.mutation(api.variants.updateStatus, {
          slug: "nonexistent",
          publishStatus: "published",
        })
      ).rejects.toThrow("Variant not found: nonexistent");
    });
  });

  describe("updateApplicationStatus", () => {
    it("sets appliedAt timestamp when marking as applied", async () => {
      const t = convexTest(schema);

      await t.mutation(api.variants.upsert, {
        slug: "apply-test",
        publishStatus: "published",
        data: { metadata: { company: "ApplyCo" } },
      });

      await t.mutation(api.variants.updateApplicationStatus, {
        slug: "apply-test",
        applicationStatus: "applied",
      });

      const variants = await t.query(api.variants.listAll, {});
      expect(variants[0].applicationStatus).toBe("applied");
      expect(variants[0].appliedAt).toBeDefined();
    });

    it("clears appliedAt when marking as not_applied", async () => {
      const t = convexTest(schema);

      await t.mutation(api.variants.upsert, {
        slug: "unapply-test",
        publishStatus: "published",
        data: {
          metadata: {
            company: "UnapplyCo",
            applicationStatus: "applied",
            appliedAt: "2025-01-01T00:00:00Z",
          },
        },
      });

      await t.mutation(api.variants.updateApplicationStatus, {
        slug: "unapply-test",
        applicationStatus: "not_applied",
      });

      const variants = await t.query(api.variants.listAll, {});
      expect(variants[0].applicationStatus).toBe("not_applied");
      expect(variants[0].appliedAt).toBeUndefined();
    });

    it("throws error for non-existent variant", async () => {
      const t = convexTest(schema);

      await expect(
        t.mutation(api.variants.updateApplicationStatus, {
          slug: "nonexistent",
          applicationStatus: "applied",
        })
      ).rejects.toThrow("Variant not found: nonexistent");
    });
  });

  describe("remove", () => {
    it("deletes existing variant", async () => {
      const t = convexTest(schema);

      await t.mutation(api.variants.upsert, {
        slug: "delete-me",
        publishStatus: "draft",
        data: { metadata: { company: "DeleteCo" } },
      });

      // Verify it exists
      let variants = await t.query(api.variants.listAll, {});
      expect(variants).toHaveLength(1);

      // Delete it
      await t.mutation(api.variants.remove, { slug: "delete-me" });

      // Verify it's gone
      variants = await t.query(api.variants.listAll, {});
      expect(variants).toHaveLength(0);
    });

    it("throws error for non-existent variant", async () => {
      const t = convexTest(schema);

      await expect(
        t.mutation(api.variants.remove, { slug: "nonexistent" })
      ).rejects.toThrow("Variant not found: nonexistent");
    });
  });
});
