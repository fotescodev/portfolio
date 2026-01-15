#!/usr/bin/env tsx
/**
 * Generate a detailed report of variant publishing status
 *
 * Useful for:
 * - Understanding which variants will be visible in production
 * - Identifying work-in-progress variants
 * - Pre-deployment safety checks
 * - Documentation of variant state
 *
 * Usage:
 *   npm run report:variants
 *   npm run report:variants -- --json (machine-readable output)
 *   npm run report:variants -- --csv (spreadsheet-friendly)
 */

import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import YAML from 'yaml';

interface VariantStatus {
  slug: string;
  publishStatus: 'draft' | 'published';
  company?: string;
  role?: string;
  applicationStatus?: string;
  generatedAt?: string;
  willBeServed: boolean;
}

const args = process.argv.slice(2);
const jsonMode = args.includes('--json');
const csvMode = args.includes('--csv');

const variantsDir = join(process.cwd(), 'content', 'variants');

try {
  const yamlFiles = readdirSync(variantsDir)
    .filter(f => f.endsWith('.yaml') && !f.startsWith('_'));

  const variants: VariantStatus[] = [];

  for (const file of yamlFiles) {
    const content = readFileSync(join(variantsDir, file), 'utf-8');
    const variant = YAML.parse(content);

    variants.push({
      slug: file.replace('.yaml', ''),
      publishStatus: (variant.publishStatus || 'draft') as 'draft' | 'published',
      company: variant.metadata?.company,
      role: variant.metadata?.role,
      applicationStatus: variant.metadata?.applicationStatus,
      generatedAt: variant.metadata?.generatedAt,
      willBeServed: (variant.publishStatus || 'draft') === 'published'
    });
  }

  // Sort: published first, then alphabetical
  variants.sort((a, b) => {
    if (a.publishStatus !== b.publishStatus) {
      return a.publishStatus === 'published' ? -1 : 1;
    }
    return a.slug.localeCompare(b.slug);
  });

  if (jsonMode) {
    // Machine-readable JSON
    console.log(JSON.stringify({
      generatedAt: new Date().toISOString(),
      summary: {
        total: variants.length,
        published: variants.filter(v => v.publishStatus === 'published').length,
        draft: variants.filter(v => v.publishStatus === 'draft').length
      },
      variants
    }, null, 2));
  } else if (csvMode) {
    // CSV for spreadsheet import
    console.log('Slug,Status,Company,Role,Application Status,Generated At,Will Be Served');
    variants.forEach(v => {
      const company = v.company || '';
      const role = v.role || '';
      const appStatus = v.applicationStatus || '';
      const generated = v.generatedAt || '';
      console.log(
        `"${v.slug}","${v.publishStatus}","${company}","${role}","${appStatus}","${generated}",${v.willBeServed}`
      );
    });
  } else {
    // Human-readable output
    console.log('\n📊 Variant Publishing Status Report\n');
    console.log(`Generated: ${new Date().toISOString()}\n`);

    const published = variants.filter(v => v.publishStatus === 'published');
    const draft = variants.filter(v => v.publishStatus === 'draft');

    if (published.length > 0) {
      console.log(`✓ PUBLISHED (${published.length}) — Will be served in production:`);
      published.forEach(v => {
        const location = v.company && v.role ? ` — ${v.company} / ${v.role}` : '';
        const appStatus = v.applicationStatus ? ` [${v.applicationStatus}]` : '';
        console.log(`  • ${v.slug}${location}${appStatus}`);
      });
      console.log();
    }

    if (draft.length > 0) {
      console.log(
        `📝 DRAFT (${draft.length}) — Will NOT be served in production (returns null):`
      );
      draft.forEach(v => {
        const location = v.company && v.role ? ` — ${v.company} / ${v.role}` : '';
        const appStatus = v.applicationStatus ? ` [${v.applicationStatus}]` : '';
        console.log(`  • ${v.slug}${location}${appStatus}`);
      });
      console.log();
    }

    // Summary
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`SUMMARY: ${published.length} published, ${draft.length} draft (${variants.length} total)`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    if (draft.length > 0) {
      console.log('⚠️  Important: Draft variants will return null\n');
      console.log('This is by design in convex/variants.ts:');
      console.log('  if (!variant || variant.publishStatus !== "published") return null\n');
      console.log('To publish a draft variant:');
      console.log('  1. Edit content/variants/<slug>.yaml');
      console.log('  2. Change publishStatus: "published"');
      console.log('  3. Run: npm run variants:sync');
      console.log('  4. Commit and push\n');
    }

    console.log('📖 Convex Query Reference:');
    console.log('  • /convex/variants.ts - Query filtering logic\n');
  }

} catch (err) {
  console.error('❌ Error generating report:');
  console.error(`   ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
}
