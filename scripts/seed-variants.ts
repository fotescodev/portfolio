/**
 * Seed Variants to Convex
 *
 * One-time migration script to seed existing variants from JSON files to Convex database.
 * Run with: npx tsx scripts/seed-variants.ts
 *
 * Prerequisites:
 * - CONVEX_URL environment variable must be set
 * - User must be authenticated with Convex
 */

import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Convex URL from environment
const CONVEX_URL = process.env.CONVEX_URL;

if (!CONVEX_URL) {
  console.error("Error: CONVEX_URL environment variable is not set");
  console.error("Run 'npx convex dev' to get your Convex deployment URL");
  process.exit(1);
}

const client = new ConvexHttpClient(CONVEX_URL);

interface VariantData {
  metadata: {
    company: string;
    role: string;
    slug: string;
    generatedAt: string;
    jobDescription: string;
    generationModel?: string;
    publishStatus: "draft" | "published";
    publishedAt?: string;
    applicationStatus: "not_applied" | "applied";
    appliedAt?: string;
    sourceUrl?: string;
    resumePath?: string;
  };
  overrides: {
    hero?: {
      status?: string;
      headline?: Array<{
        text: string;
        style?: "italic" | "muted" | "accent" | "normal";
      }>;
      subheadline?: string;
      companyAccent?: Array<{
        text: string;
        style?: "italic" | "muted" | "accent" | "normal";
      }>;
    };
    about?: {
      tagline?: string;
      bio?: string[];
      stats?: Array<{ value: string; label: string }>;
    };
    sections?: {
      beyondWork?: boolean;
      blog?: boolean;
      onchainIdentity?: boolean;
      skills?: boolean;
      passionProjects?: boolean;
    };
    experience?: Array<{
      company: string;
      highlights?: string[];
      tags?: string[];
    }>;
  };
  relevance?: {
    caseStudies?: Array<{
      slug: string;
      relevanceScore: number;
      reasoning?: string;
    }>;
    skills?: Array<{
      category: string;
      relevanceScore: number;
    }>;
    projects?: Array<{
      slug: string;
      relevanceScore: number;
      reasoning?: string;
    }>;
  };
}

async function seedVariants() {
  const variantsDir = path.join(__dirname, "../content/variants");

  // Get all JSON files (excluding template files)
  const files = fs
    .readdirSync(variantsDir)
    .filter((f) => f.endsWith(".json") && !f.startsWith("_"));

  console.log(`Found ${files.length} variants to seed\n`);

  let successCount = 0;
  let errorCount = 0;
  const errors: { file: string; error: string }[] = [];

  for (const file of files) {
    const filePath = path.join(variantsDir, file);

    try {
      const content = fs.readFileSync(filePath, "utf-8");
      const data: VariantData = JSON.parse(content);

      console.log(`Seeding: ${data.metadata.slug}`);

      await client.mutation(api.variants.upsert, {
        metadata: data.metadata,
        overrides: data.overrides,
        relevance: data.relevance,
      });

      successCount++;
      console.log(`  ✓ ${data.metadata.slug}`);
    } catch (error) {
      errorCount++;
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      errors.push({ file, error: errorMessage });
      console.error(`  ✗ ${file}: ${errorMessage}`);
    }
  }

  console.log("\n" + "=".repeat(50));
  console.log(`Seeding complete!`);
  console.log(`  Success: ${successCount}`);
  console.log(`  Errors: ${errorCount}`);

  if (errors.length > 0) {
    console.log("\nErrors:");
    for (const { file, error } of errors) {
      console.log(`  - ${file}: ${error}`);
    }
    process.exit(1);
  }
}

// Check for --dry-run flag
const isDryRun = process.argv.includes("--dry-run");

if (isDryRun) {
  console.log("Dry run mode - no changes will be made\n");
  const variantsDir = path.join(__dirname, "../content/variants");
  const files = fs
    .readdirSync(variantsDir)
    .filter((f) => f.endsWith(".json") && !f.startsWith("_"));

  console.log(`Would seed ${files.length} variants:`);
  for (const file of files) {
    const filePath = path.join(variantsDir, file);
    const content = fs.readFileSync(filePath, "utf-8");
    const data: VariantData = JSON.parse(content);
    console.log(
      `  - ${data.metadata.slug} (${data.metadata.company} / ${data.metadata.role})`
    );
  }
} else {
  seedVariants().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
}
