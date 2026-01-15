#!/usr/bin/env npx tsx
/**
 * Cleanup Orphaned PDFs
 *
 * Finds and optionally deletes PDF resumes that don't have matching variants in Convex.
 *
 * Usage:
 *   npx tsx scripts/cleanup-orphaned-pdfs.ts           # Dry run (show orphans)
 *   npx tsx scripts/cleanup-orphaned-pdfs.ts --delete  # Actually delete orphans
 */

import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import * as fs from "fs";
import * as path from "path";

const RESUMES_DIR = path.join(process.cwd(), "public/resumes");
const CONVEX_URL = process.env.VITE_CONVEX_URL || "https://scintillating-husky-549.convex.cloud";

async function main() {
  const shouldDelete = process.argv.includes("--delete");

  console.log("🔍 Scanning for orphaned PDF resumes...\n");

  // 1. Get all PDFs in public/resumes/
  if (!fs.existsSync(RESUMES_DIR)) {
    console.log(`📁 Resumes directory not found: ${RESUMES_DIR}`);
    return;
  }

  const pdfFiles = fs.readdirSync(RESUMES_DIR)
    .filter(f => f.endsWith(".pdf"))
    .map(f => f.replace(".pdf", ""));

  console.log(`📄 Found ${pdfFiles.length} PDF files in public/resumes/\n`);

  if (pdfFiles.length === 0) {
    console.log("✅ No PDF files to check.");
    return;
  }

  // 2. Get all variant slugs from Convex
  const client = new ConvexHttpClient(CONVEX_URL);
  const variants = await client.query(api.variants.listAll);
  const variantSlugs = new Set(variants.map(v => v.slug));

  console.log(`🗄️  Found ${variantSlugs.size} variants in Convex\n`);

  // 3. Find orphaned PDFs (PDFs without matching variants)
  const orphanedPdfs = pdfFiles.filter(slug => !variantSlugs.has(slug));

  if (orphanedPdfs.length === 0) {
    console.log("✅ No orphaned PDFs found. All resumes have matching variants.");
    return;
  }

  console.log(`⚠️  Found ${orphanedPdfs.length} orphaned PDF(s):\n`);

  for (const slug of orphanedPdfs) {
    const filePath = path.join(RESUMES_DIR, `${slug}.pdf`);
    const stats = fs.statSync(filePath);
    const sizeKB = (stats.size / 1024).toFixed(1);

    if (shouldDelete) {
      fs.unlinkSync(filePath);
      console.log(`   🗑️  Deleted: ${slug}.pdf (${sizeKB} KB)`);
    } else {
      console.log(`   📄 ${slug}.pdf (${sizeKB} KB)`);
    }
  }

  console.log("");

  if (shouldDelete) {
    console.log(`✅ Deleted ${orphanedPdfs.length} orphaned PDF(s).`);
  } else {
    console.log("ℹ️  Dry run complete. To delete these files, run:");
    console.log("   npx tsx scripts/cleanup-orphaned-pdfs.ts --delete");
  }
}

main().catch(console.error);
