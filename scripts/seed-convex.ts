#!/usr/bin/env tsx
/**
 * Seed Convex Database
 *
 * Migrates existing variants from YAML files and uploads base portfolio content.
 *
 * Usage:
 *   npx tsx scripts/seed-convex.ts
 *
 * Prerequisites:
 *   - Convex dev server running (npx convex dev)
 *   - CONVEX_URL environment variable set (or reads from .env.local)
 */

import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import { readFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";
import YAML from "yaml";

// Load environment variables
const envPath = join(process.cwd(), ".env.local");
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].split("#")[0].trim();
    }
  }
}

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
  bold: "\x1b[1m",
};

const CONVEX_URL = process.env.CONVEX_URL || process.env.VITE_CONVEX_URL;
if (!CONVEX_URL) {
  console.error(`${colors.red}Error: CONVEX_URL or VITE_CONVEX_URL must be set in .env.local${colors.reset}`);
  process.exit(1);
}

const ADMIN_API_KEY = process.env.ADMIN_API_KEY;

async function main() {
  console.log(
    `${colors.bold}${colors.blue}Seeding Convex Database${colors.reset}\n`
  );
  console.log(`${colors.gray}URL: ${CONVEX_URL}${colors.reset}\n`);

  const convex = new ConvexHttpClient(CONVEX_URL);
  const contentDir = join(process.cwd(), "content");

  // 1. Seed base content
  console.log(`${colors.cyan}Loading base portfolio content...${colors.reset}`);

  const profile = YAML.parse(
    readFileSync(join(contentDir, "profile.yaml"), "utf-8")
  );
  const experience = YAML.parse(
    readFileSync(join(contentDir, "experience/index.yaml"), "utf-8")
  );
  const skills = YAML.parse(
    readFileSync(join(contentDir, "skills/index.yaml"), "utf-8")
  );
  const projects = YAML.parse(
    readFileSync(join(contentDir, "passion-projects/index.yaml"), "utf-8")
  );

  // Load case studies (just metadata for prompts)
  const caseStudiesDir = join(contentDir, "case-studies");
  const caseStudyFiles = readdirSync(caseStudiesDir).filter((f) =>
    f.endsWith(".md")
  );

  const caseStudies = caseStudyFiles
    .map((file) => {
      const content = readFileSync(join(caseStudiesDir, file), "utf-8");
      const match = content.match(/^---\n([\s\S]*?)\n---/);
      if (match) {
        const frontmatter = YAML.parse(match[1]);
        return {
          slug: frontmatter.slug || file.replace(".md", ""),
          title: frontmatter.title || "Untitled",
          headline: frontmatter.hook?.headline,
        };
      }
      return null;
    })
    .filter((cs): cs is NonNullable<typeof cs> => cs !== null);

  console.log(
    `${colors.green}✓${colors.reset} Loaded ${experience.jobs.length} jobs, ${caseStudies.length} case studies, ${skills.categories.length} skill categories`
  );

  await convex.mutation(api.baseContent.upsert, {
    apiKey: ADMIN_API_KEY,
    profile,
    experience,
    skills,
    projects,
    caseStudies,
  });

  console.log(
    `${colors.green}✓${colors.reset} Base content uploaded to Convex\n`
  );

  // 2. Seed variants
  console.log(`${colors.cyan}Migrating variants...${colors.reset}`);

  const variantsDir = join(contentDir, "variants");
  const variantFiles = readdirSync(variantsDir).filter(
    (f) => f.endsWith(".yaml") && !f.startsWith("_")
  );

  let migrated = 0;
  let failed = 0;

  for (const file of variantFiles) {
    const slug = file.replace(".yaml", "");
    try {
      const yamlContent = readFileSync(join(variantsDir, file), "utf-8");
      const data = YAML.parse(yamlContent);

      await convex.mutation(api.variants.upsert, {
        apiKey: ADMIN_API_KEY,
        slug,
        publishStatus: data.metadata?.publishStatus || "published",
        data,
      });

      console.log(`  ${colors.green}✓${colors.reset} ${slug}`);
      migrated++;
    } catch (error) {
      console.log(
        `  ${colors.red}✗${colors.reset} ${slug}: ${error instanceof Error ? error.message : error}`
      );
      failed++;
    }
  }

  console.log(
    `\n${colors.bold}${colors.green}Migration complete!${colors.reset}`
  );
  console.log(`  ${colors.green}✓${colors.reset} ${migrated} variants migrated`);
  if (failed > 0) {
    console.log(`  ${colors.red}✗${colors.reset} ${failed} variants failed`);
  }

  // 3. Verify
  console.log(`\n${colors.cyan}Verifying...${colors.reset}`);

  const slugs = await convex.query(api.variants.listPublishedSlugs);
  console.log(`  Published variants in Convex: ${slugs.length}`);

  const baseContent = await convex.query(api.baseContent.get);
  console.log(`  Base content: ${baseContent ? "✓" : "✗"}`);

  console.log(
    `\n${colors.cyan}Next steps:${colors.reset}
  1. Set ANTHROPIC_API_KEY in Convex Dashboard:
     npx convex env set ANTHROPIC_API_KEY your-key

  2. Test variant loading in the app:
     npm run dev

  3. (Optional) Delete content/variants/ files after confirming everything works
`
  );
}

main().catch((error) => {
  console.error(`${colors.red}Error:${colors.reset}`, error);
  process.exit(1);
});
