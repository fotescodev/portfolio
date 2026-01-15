/**
 * Variant Validation Tests
 *
 * Tests for variant schema validation and content integrity:
 * - Schema validation for all variant JSON files
 * - Specific tests for new variants (Circle PM, Orca PM)
 * - Claims verification status
 */

import { describe, it, expect } from 'vitest';
import { VariantSchema } from '../../lib/schemas';
import fs from 'fs';
import path from 'path';

// Helper to load and parse variant JSON
function loadVariantJson(slug: string) {
  const variantPath = path.resolve(__dirname, `../../../content/variants/${slug}.json`);
  if (!fs.existsSync(variantPath)) {
    return null;
  }
  const content = fs.readFileSync(variantPath, 'utf-8');
  return JSON.parse(content);
}

// Helper to load claims ledger
function loadClaimsLedger(slug: string) {
  const claimsPath = path.resolve(__dirname, `../../../capstone/develop/evals/${slug}.claims.yaml`);
  if (!fs.existsSync(claimsPath)) {
    return null;
  }
  return fs.readFileSync(claimsPath, 'utf-8');
}

describe('Variant Schema Validation', () => {
  it('should validate circle-pm variant against schema', () => {
    const variant = loadVariantJson('circle-pm');
    expect(variant).not.toBeNull();

    const result = VariantSchema.safeParse(variant);
    if (!result.success) {
      console.error('Validation errors:', result.error.format());
    }
    expect(result.success).toBe(true);
  });

  it('should validate orca-pm variant against schema', () => {
    const variant = loadVariantJson('orca-pm');
    expect(variant).not.toBeNull();

    const result = VariantSchema.safeParse(variant);
    if (!result.success) {
      console.error('Validation errors:', result.error.format());
    }
    expect(result.success).toBe(true);
  });

  it('should validate all variant JSON files against schema', () => {
    const variantsDir = path.resolve(__dirname, '../../../content/variants');
    const files = fs.readdirSync(variantsDir).filter(f =>
      f.endsWith('.json') && !f.startsWith('_') && !f.startsWith('example-')
    );

    const failures: string[] = [];

    for (const file of files) {
      const slug = file.replace('.json', '');
      const variant = loadVariantJson(slug);
      const result = VariantSchema.safeParse(variant);

      if (!result.success) {
        failures.push(`${slug}: ${result.error.message}`);
      }
    }

    if (failures.length > 0) {
      console.error('Failed variants:', failures);
    }
    expect(failures).toHaveLength(0);
  });
});

describe('Circle PM Variant - Content Integrity', () => {
  const variant = loadVariantJson('circle-pm');

  it('should have correct metadata', () => {
    expect(variant).not.toBeNull();
    expect(variant.metadata.company).toBe('Circle');
    expect(variant.metadata.role).toBe('Product Manager');
    expect(variant.metadata.slug).toBe('circle-pm');
  });

  it('should have companyAccent set (REQUIRED)', () => {
    expect(variant.overrides.hero?.companyAccent).toBeDefined();
    expect(variant.overrides.hero?.companyAccent).toHaveLength(2);

    // Check for "with" and "Circle"
    const accentTexts = variant.overrides.hero?.companyAccent?.map((a: {text: string}) => a.text);
    expect(accentTexts).toContain('with');
    expect(accentTexts).toContain('Circle');
  });

  it('should preserve signature headline', () => {
    const headline = variant.overrides.hero?.headline;
    expect(headline).toBeDefined();

    // Check for "Building at the edge of trust"
    const texts = headline?.map((h: {text: string}) => h.text);
    expect(texts).toContain('Building');
    expect(texts).toContain('trust');
  });

  it('should have 3 stats', () => {
    expect(variant.overrides.about?.stats).toHaveLength(3);

    // Check for expected stat values (dev tools focus)
    const statValues = variant.overrides.about?.stats?.map((s: {value: string}) => s.value);
    expect(statValues).toContain('8+');
    expect(statValues).toContain('8');
    expect(statValues).toContain('1M+');
  });

  it('should have bio paragraphs', () => {
    expect(variant.overrides.about?.bio).toBeDefined();
    expect(variant.overrides.about?.bio?.length).toBeGreaterThanOrEqual(2);
  });

  it('should have subheadline in hero override', () => {
    // Check subheadline is set for Circle positioning (dev tools focus)
    expect(variant.overrides.hero?.subheadline).toBeDefined();
    expect(variant.overrides.hero?.subheadline).toContain('developer tools');
    expect(variant.overrides.hero?.subheadline).toContain('AI agents');
  });

  it('should have relevance scores for case studies', () => {
    expect(variant.relevance?.caseStudies).toBeDefined();
    expect(variant.relevance?.caseStudies?.length).toBeGreaterThan(0);

    // protocol-integration should be the most relevant (dev tools focus)
    const protocolIntegration = variant.relevance?.caseStudies?.find(
      (cs: {slug: string}) => cs.slug === 'protocol-integration'
    );
    expect(protocolIntegration?.relevanceScore).toBe(1.0);
  });

  it('should have resume path set', () => {
    expect(variant.metadata.resumePath).toBe('/resumes/circle-pm.pdf');
  });
});

describe('Circle PM Variant - Claims Verification', () => {
  it('should have all claims verified', () => {
    const claimsContent = loadClaimsLedger('circle-pm');
    expect(claimsContent).not.toBeNull();

    // Check that no claims are unverified
    const unverifiedCount = (claimsContent!.match(/status: unverified/g) || []).length;
    expect(unverifiedCount).toBe(0);

    // Check that all claims are verified
    const verifiedCount = (claimsContent!.match(/status: verified/g) || []).length;
    expect(verifiedCount).toBeGreaterThan(0);
  });
});

// Slugify function must match generate.ts, VariantPortfolio.tsx, and dashboard
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

describe('Variant URL Slug Generation', () => {
  it('should generate correct slug for circle/pm URL', () => {
    // URL pattern: /:company/:role
    // circle/pm -> circle-pm
    const company = 'circle';
    const role = 'pm';
    const expectedSlug = `${slugify(company)}-${slugify(role)}`;

    expect(expectedSlug).toBe('circle-pm');
  });

  it('should handle orca/pm URL correctly', () => {
    const company = 'orca';
    const role = 'pm';
    const expectedSlug = `${slugify(company)}-${slugify(role)}`;

    expect(expectedSlug).toBe('orca-pm');
  });

  it('should handle company names with special characters (e.g., Crypto.com)', () => {
    const company = 'Crypto.com';
    const role = 'Product Manager (AI)';
    const expectedSlug = `${slugify(company)}-${slugify(role)}`;

    // Dots and parens should be removed
    expect(slugify(company)).toBe('cryptocom');
    expect(slugify(role)).toBe('product-manager-ai');
    expect(expectedSlug).toBe('cryptocom-product-manager-ai');
  });

  it('should handle company names with spaces', () => {
    const company = 'Mysten Labs';
    const role = 'Sr. Product Manager, Walrus (Distributed Storage)';

    expect(slugify(company)).toBe('mysten-labs');
    expect(slugify(role)).toBe('sr-product-manager-walrus-distributed-storage');
  });

  it('should handle OpenAI Lead Product Manager slug', () => {
    const company = 'OpenAI';
    const role = 'Lead Product Manager';
    const expectedSlug = `${slugify(company)}-${slugify(role)}`;

    expect(expectedSlug).toBe('openai-lead-product-manager');
  });

  it('should collapse multiple dashes', () => {
    const company = 'Company---Name';
    const role = 'Role--Title';

    expect(slugify(company)).toBe('company-name');
    expect(slugify(role)).toBe('role-title');
  });

  it('should trim leading and trailing dashes', () => {
    const company = '-Leading';
    const role = 'Trailing-';

    expect(slugify(company)).toBe('leading');
    expect(slugify(role)).toBe('trailing');
  });
});
