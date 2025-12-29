#!/usr/bin/env tsx
/**
 * Generate Resume PDFs for all variants
 *
 * Iterates through all variant YAML files and generates PDFs for each.
 * Updates each variant's YAML with the resumePath field.
 *
 * Usage:
 *   npm run generate:resumes:all                    # Generate all variant resumes
 *   npm run generate:resumes:all -- --force         # Regenerate even if PDF exists
 *   npm run generate:resumes:all -- --dry-run       # Show what would be generated
 *
 * Prerequisites:
 *   - Dev server must be running: npm run dev
 */

import { spawn } from 'child_process';
import { readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const variantsDir = join(rootDir, 'content', 'variants');
const resumesDir = join(rootDir, 'public', 'resumes');

interface Options {
  force: boolean;
  dryRun: boolean;
}

function parseArgs(): Options {
  const args = process.argv.slice(2);
  return {
    force: args.includes('--force'),
    dryRun: args.includes('--dry-run'),
  };
}

function getVariantSlugs(): string[] {
  const files = readdirSync(variantsDir)
    .filter(f => f.endsWith('.yaml') && !f.startsWith('_') && f !== 'README.md');

  return files.map(f => f.replace('.yaml', ''));
}

function resumeExists(slug: string): boolean {
  return existsSync(join(resumesDir, `${slug}.pdf`));
}

async function generateResume(slug: string): Promise<boolean> {
  return new Promise((resolve) => {
    const child = spawn('npx', ['tsx', 'scripts/generate-resume.ts', '--variant', slug], {
      cwd: rootDir,
      stdio: 'inherit',
    });

    child.on('close', (code) => {
      resolve(code === 0);
    });

    child.on('error', () => {
      resolve(false);
    });
  });
}

async function main() {
  const options = parseArgs();
  const slugs = getVariantSlugs();

  console.log('');
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║           Batch Resume Generator                         ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log('');

  if (options.dryRun) {
    console.log('🔍 Dry run mode - no files will be generated\n');
  }

  console.log(`Found ${slugs.length} variants:\n`);

  const toGenerate: string[] = [];
  const skipped: string[] = [];

  for (const slug of slugs) {
    const exists = resumeExists(slug);
    if (exists && !options.force) {
      skipped.push(slug);
      console.log(`  ⏭  ${slug} (already exists)`);
    } else {
      toGenerate.push(slug);
      console.log(`  📄 ${slug} ${exists ? '(will regenerate)' : ''}`);
    }
  }

  console.log('');
  console.log(`Summary: ${toGenerate.length} to generate, ${skipped.length} skipped`);
  console.log('');

  if (options.dryRun) {
    console.log('Dry run complete. Use without --dry-run to generate.\n');
    return;
  }

  if (toGenerate.length === 0) {
    console.log('Nothing to generate. Use --force to regenerate existing resumes.\n');
    return;
  }

  console.log('Starting generation...\n');
  console.log('─'.repeat(60));

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < toGenerate.length; i++) {
    const slug = toGenerate[i];
    console.log(`\n[${i + 1}/${toGenerate.length}] Generating: ${slug}`);
    console.log('');

    const success = await generateResume(slug);

    if (success) {
      successCount++;
      console.log(`\n✓ ${slug} complete`);
    } else {
      failCount++;
      console.log(`\n✗ ${slug} failed`);
    }

    console.log('─'.repeat(60));
  }

  console.log('');
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║                     Summary                              ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`  ✓ Generated: ${successCount}`);
  console.log(`  ✗ Failed:    ${failCount}`);
  console.log(`  ⏭  Skipped:   ${skipped.length}`);
  console.log('');

  if (successCount > 0) {
    console.log('Next steps:');
    console.log('  1. Run: npm run variants:sync     # Update JSON artifacts');
    console.log('  2. Run: npm run generate:dashboard # Regenerate dashboard');
    console.log('');
  }

  process.exit(failCount > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error('Fatal error:', error.message);
  process.exit(1);
});
