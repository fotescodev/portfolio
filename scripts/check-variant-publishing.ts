#!/usr/bin/env tsx
/**
 * Check if all variants are properly published
 *
 * Prevents accidental deployment of draft variants to production.
 * Draft variants will not be served (publishStatus check in convex/variants.ts).
 *
 * Usage:
 *   npm run check:variants
 *   npm run check:variants -- --warn (show warnings, don't fail)
 *   npm run check:variants -- --report (show detailed report)
 *
 * Exit codes:
 *   0 = All variants are published
 *   1 = Draft variants found in main branch
 */

import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import YAML from 'yaml';

interface VariantInfo {
  slug: string;
  publishStatus: string;
  company?: string;
  role?: string;
}

const args = process.argv.slice(2);
const warnMode = args.includes('--warn');
const reportMode = args.includes('--report');

const variantsDir = join(process.cwd(), 'content', 'variants');

let draftVariants: VariantInfo[] = [];
let publishedVariants: VariantInfo[] = [];

try {
  const yamlFiles = readdirSync(variantsDir)
    .filter(f => f.endsWith('.yaml') && !f.startsWith('_'));

  for (const file of yamlFiles) {
    const filePath = join(variantsDir, file);
    const content = readFileSync(filePath, 'utf-8');
    const variant = YAML.parse(content);

    const info: VariantInfo = {
      slug: file.replace('.yaml', ''),
      publishStatus: variant.publishStatus || 'draft',
      company: variant.metadata?.company,
      role: variant.metadata?.role
    };

    if ((variant.publishStatus || 'draft') === 'draft') {
      draftVariants.push(info);
    } else {
      publishedVariants.push(info);
    }
  }

  // Sort alphabetically
  draftVariants.sort((a, b) => a.slug.localeCompare(b.slug));
  publishedVariants.sort((a, b) => a.slug.localeCompare(b.slug));

  if (reportMode) {
    console.log('\n📊 Variant Publishing Status Report\n');

    if (publishedVariants.length > 0) {
      console.log(`✓ PUBLISHED (${publishedVariants.length}):`);
      publishedVariants.forEach(v => {
        const location = v.company && v.role ? ` — ${v.company} / ${v.role}` : '';
        console.log(`  • ${v.slug}${location}`);
      });
      console.log();
    }

    if (draftVariants.length > 0) {
      console.log(`📝 DRAFT (${draftVariants.length}) — Will NOT be served in production:`);
      draftVariants.forEach(v => {
        const location = v.company && v.role ? ` — ${v.company} / ${v.role}` : '';
        console.log(`  • ${v.slug}${location}`);
      });
      console.log();
    }

    console.log(`Total: ${publishedVariants.length} published, ${draftVariants.length} draft\n`);
  }

  if (draftVariants.length > 0) {
    const message = `Found ${draftVariants.length} draft variant(s) that will NOT be served in production:`;

    if (warnMode) {
      console.warn(`\n⚠️  WARNING: ${message}`);
      draftVariants.forEach(v => {
        console.warn(`  • ${v.slug}`);
      });
      console.warn('\nNote: Draft variants return null from getBySlug() query\n');
      process.exit(0);
    }

    console.error(`\n❌ ERROR: ${message}`);
    console.error('');
    draftVariants.forEach(v => {
      console.error(`  • ${v.slug} (publishStatus: "draft")`);
    });
    console.error('');
    console.error('These variants will return null from the getBySlug() query:');
    console.error('  if (!variant || variant.publishStatus !== "published") return null');
    console.error('');
    console.error('To fix:');
    console.error('  1. Edit content/variants/<slug>.yaml');
    console.error('  2. Set publishStatus: "published"');
    console.error('  3. Run: npm run variants:sync');
    console.error('  4. Commit and push\n');
    process.exit(1);
  }

  if (!reportMode) {
    console.log(`✓ All variants are published (${publishedVariants.length} total)\n`);
  }

} catch (err) {
  console.error('❌ ERROR: Failed to check variants');
  console.error(`   ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
}
