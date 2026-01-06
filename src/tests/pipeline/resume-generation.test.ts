/**
 * Resume Generation Pipeline Tests
 *
 * Ensures all variants have corresponding resume PDFs generated.
 * These tests catch missing resumes before deployment.
 */

import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import YAML from 'yaml';

const VARIANTS_DIR = path.resolve(__dirname, '../../../content/variants');
const RESUMES_DIR = path.resolve(__dirname, '../../../public/resumes');

// Variants to exclude from resume checks (templates, examples, negative examples)
const EXCLUDED_SLUGS = [
  '_template',
  'example-minimal',
  'anthropic-ai-safety-fellow', // Negative example for internal testing
];

interface VariantMetadata {
  slug: string;
  company: string;
  role: string;
  resumePath?: string;
  applicationStatus?: string;
}

function loadVariantYaml(slug: string): { metadata: VariantMetadata } | null {
  const variantPath = path.join(VARIANTS_DIR, `${slug}.yaml`);
  if (!fs.existsSync(variantPath)) {
    return null;
  }
  const content = fs.readFileSync(variantPath, 'utf-8');
  return YAML.parse(content);
}

function getActiveVariantSlugs(): string[] {
  const files = fs.readdirSync(VARIANTS_DIR).filter(f =>
    f.endsWith('.yaml') &&
    !EXCLUDED_SLUGS.some(excluded => f.startsWith(excluded))
  );
  return files.map(f => f.replace('.yaml', ''));
}

describe('Resume Generation Pipeline', () => {
  const variantSlugs = getActiveVariantSlugs();

  it('should have resume PDF for all active variants', () => {
    const missingResumes: string[] = [];

    for (const slug of variantSlugs) {
      const pdfPath = path.join(RESUMES_DIR, `${slug}.pdf`);
      if (!fs.existsSync(pdfPath)) {
        missingResumes.push(slug);
      }
    }

    if (missingResumes.length > 0) {
      console.error('\nMissing resume PDFs for variants:', missingResumes);
      console.error('\nTo generate missing resumes, run:');
      missingResumes.forEach(slug => {
        console.error(`  npm run generate:resume -- --variant ${slug}`);
      });
      console.error('\nOr generate all at once:');
      console.error('  npm run generate:resumes:all\n');
    }

    expect(missingResumes).toHaveLength(0);
  });

  it('should have resumePath in variant YAML matching actual PDF', () => {
    const mismatches: { slug: string; yamlPath?: string; actualExists: boolean }[] = [];

    for (const slug of variantSlugs) {
      const variant = loadVariantYaml(slug);
      if (!variant) continue;

      const resumePath = variant.metadata?.resumePath;
      const expectedPath = `/resumes/${slug}.pdf`;
      const actualPdfPath = path.join(RESUMES_DIR, `${slug}.pdf`);
      const actualExists = fs.existsSync(actualPdfPath);

      // Check if resumePath is set correctly
      if (resumePath !== expectedPath && actualExists) {
        mismatches.push({ slug, yamlPath: resumePath, actualExists });
      }
    }

    if (mismatches.length > 0) {
      console.error('\nVariant YAML resumePath mismatches:');
      mismatches.forEach(m => {
        console.error(`  ${m.slug}: YAML has "${m.yamlPath}", expected "/resumes/${m.slug}.pdf"`);
      });
      console.error('\nTo fix, run: npm run generate:resume -- --variant <slug>');
    }

    expect(mismatches).toHaveLength(0);
  });

  it('should have all resume PDFs non-empty', () => {
    const emptyResumes: string[] = [];

    for (const slug of variantSlugs) {
      const pdfPath = path.join(RESUMES_DIR, `${slug}.pdf`);
      if (fs.existsSync(pdfPath)) {
        const stats = fs.statSync(pdfPath);
        // PDFs should be at least 50KB (reasonable minimum for a resume)
        if (stats.size < 50000) {
          emptyResumes.push(`${slug} (${Math.round(stats.size / 1024)}KB)`);
        }
      }
    }

    if (emptyResumes.length > 0) {
      console.error('\nSuspiciously small resume PDFs:', emptyResumes);
      console.error('These may be corrupted. Regenerate with:');
      console.error('  npm run generate:resumes:all --force\n');
    }

    expect(emptyResumes).toHaveLength(0);
  });
});

describe('Resume PDF Inventory', () => {
  it('should report current resume coverage', () => {
    const variantSlugs = getActiveVariantSlugs();
    const existingPdfs = fs.readdirSync(RESUMES_DIR)
      .filter(f => f.endsWith('.pdf'))
      .map(f => f.replace('.pdf', ''));

    const coverage = variantSlugs.filter(slug => existingPdfs.includes(slug));
    const percentage = Math.round((coverage.length / variantSlugs.length) * 100);

    console.log(`\nResume Coverage: ${coverage.length}/${variantSlugs.length} (${percentage}%)`);

    // This test always passes but logs coverage info
    expect(true).toBe(true);
  });
});
