/**
 * Tests for check-coverage.ts
 *
 * Validates the bullet coverage categorization logic.
 * Run with: npm run test:cli
 */

import { describe, it, expect } from 'vitest';

// ═══════════════════════════════════════════════════════════════
// BUNDLE DEFINITIONS (mirrored from check-coverage.ts)
// ═══════════════════════════════════════════════════════════════

const BUNDLES: Record<string, { name: string; keywords: string[] }> = {
  productDesign: {
    name: 'Product Design & Development',
    keywords: [
      'shipped', 'launched', 'built', 'designed', 'UX', 'user research',
      'prototyped', 'improved', 'ideation', 'MVP', 'feature', 'product'
    ]
  },
  leadershipExecution: {
    name: 'Leadership & Execution',
    keywords: [
      'led', 'managed', 'coordinated', 'E2E', 'cross-functional',
      'stakeholders', 'team of', 'owned', 'drove', 'spearheaded'
    ]
  },
  strategyPlanning: {
    name: 'Strategy & Planning',
    keywords: [
      'strategy', 'vision', 'roadmap', 'prioritized', 'market analysis',
      'decision', 'goal setting', 'planning', 'pivot', 'direction'
    ]
  },
  businessMarketing: {
    name: 'Business & Marketing',
    keywords: [
      'revenue', 'ARR', 'GTM', 'partnerships', 'growth', 'B2B', 'B2C',
      'pricing', 'negotiated', 'sales', 'customers', 'clients', 'monetization'
    ]
  },
  projectManagement: {
    name: 'Project Management',
    keywords: [
      'delivered', 'timeline', 'Agile', 'risk', 'on-time', 'milestone',
      'sprint', 'scrum', 'deadline', 'weeks', 'months', 'faster'
    ]
  },
  technicalAnalytical: {
    name: 'Technical & Analytical',
    keywords: [
      'architecture', 'API', 'SDK', 'data', 'metrics', 'experimentation',
      'trade-offs', 'system design', 'infrastructure', 'technical', 'integration'
    ]
  },
  communication: {
    name: 'Communication',
    keywords: [
      'presented', 'documented', 'collaborated', 'aligned', 'storytelling',
      'stakeholder', 'communication', 'consensus', 'evangelized'
    ]
  }
};

// ═══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS (mirrored from check-coverage.ts)
// ═══════════════════════════════════════════════════════════════

function matchBundleKeywords(bullet: string, keywords: string[]): string[] {
  const lowerBullet = bullet.toLowerCase();
  return keywords.filter(kw => lowerBullet.includes(kw.toLowerCase()));
}

function categorizeBullet(bullet: string): { bundle: string | null; keywords: string[] } {
  let bestBundle: string | null = null;
  let bestKeywords: string[] = [];

  for (const [bundleId, bundle] of Object.entries(BUNDLES)) {
    const matched = matchBundleKeywords(bullet, bundle.keywords);
    if (matched.length > bestKeywords.length) {
      bestBundle = bundleId;
      bestKeywords = matched;
    }
  }

  return { bundle: bestBundle, keywords: bestKeywords };
}

// ═══════════════════════════════════════════════════════════════
// TESTS
// ═══════════════════════════════════════════════════════════════

describe('check-coverage', () => {
  describe('matchBundleKeywords', () => {
    it('should match exact keywords case-insensitively', () => {
      const bullet = 'Shipped Advanced API from 0→1';
      const keywords = ['shipped', 'launched', 'built'];
      const matches = matchBundleKeywords(bullet, keywords);
      expect(matches).toContain('shipped');
      expect(matches).toHaveLength(1);
    });

    it('should match multiple keywords in same bullet', () => {
      const bullet = 'Built and shipped the MVP for the product';
      const keywords = ['shipped', 'launched', 'built', 'MVP', 'product'];
      const matches = matchBundleKeywords(bullet, keywords);
      expect(matches).toContain('shipped');
      expect(matches).toContain('built');
      expect(matches).toContain('MVP');
      expect(matches).toContain('product');
      expect(matches).toHaveLength(4);
    });

    it('should return empty array for no matches', () => {
      const bullet = 'Managed cross-functional team';
      const keywords = ['revenue', 'pricing', 'sales'];
      const matches = matchBundleKeywords(bullet, keywords);
      expect(matches).toHaveLength(0);
    });

    it('should handle case variations', () => {
      const bullet = 'LED the team and DROVE results';
      const keywords = ['led', 'drove'];
      const matches = matchBundleKeywords(bullet, keywords);
      expect(matches).toContain('led');
      expect(matches).toContain('drove');
    });
  });

  describe('categorizeBullet', () => {
    it('should categorize product design bullets', () => {
      const bullets = [
        'Shipped Cadence Playground V2 with multi-project management',
        'Launched new Developer Portal consolidating docs',
        'Built ERC20 Xpress platform eliminating engineering dependency'
      ];

      for (const bullet of bullets) {
        const result = categorizeBullet(bullet);
        expect(result.bundle).toBe('productDesign');
        expect(result.keywords.length).toBeGreaterThan(0);
      }
    });

    it('should categorize leadership bullets', () => {
      // "Led" and "team of" both match leadership
      const bullet = 'Led cross-functional team of 5 engineers';
      const result = categorizeBullet(bullet);
      expect(result.bundle).toBe('leadershipExecution');
      expect(result.keywords).toContain('led');
    });

    it('should categorize business/marketing bullets', () => {
      // Multiple business keywords: revenue, ARR, growth, B2B
      const bullet = 'Generated $2M ARR through B2B sales and partnerships';
      const result = categorizeBullet(bullet);
      expect(result.bundle).toBe('businessMarketing');
      expect(result.keywords.length).toBeGreaterThanOrEqual(2);
    });

    it('should categorize technical bullets', () => {
      // Multiple technical keywords: architecture, API, SDK, infrastructure
      const bullet = 'Designed API architecture with SDK integration';
      const result = categorizeBullet(bullet);
      expect(result.bundle).toBe('technicalAnalytical');
      expect(result.keywords.length).toBeGreaterThanOrEqual(2);
    });

    it('should categorize project management bullets', () => {
      const result = categorizeBullet('Delivered in 2 weeks, 4× faster than industry standard');
      expect(result.bundle).toBe('projectManagement');
      expect(result.keywords).toContain('weeks');
      expect(result.keywords).toContain('faster');
    });

    it('should pick bundle with most keyword matches', () => {
      // This bullet has both "shipped" (productDesign) and "API" (technical)
      // but should favor the one with more matches
      const bullet = 'Shipped Advanced API and SDK with technical documentation';
      const result = categorizeBullet(bullet);
      expect(result.bundle).toBe('technicalAnalytical');
      expect(result.keywords.length).toBeGreaterThanOrEqual(2);
    });

    it('should return null for unmatched bullets', () => {
      const bullet = 'Did various things at the company';
      const result = categorizeBullet(bullet);
      expect(result.bundle).toBeNull();
      expect(result.keywords).toHaveLength(0);
    });
  });

  describe('real bullet examples from experience', () => {
    const realBullets = [
      {
        bullet: 'Delivered $1M Aztec custody and staking integration, onboarding a16z',
        expectedBundle: 'projectManagement', // "Delivered"
        reason: 'Contains "Delivered"'
      },
      {
        bullet: 'Led 8 protocol integrations (Base, Optimism, Stellar) averaging <2 weeks per chain',
        expectedBundle: 'leadershipExecution', // "Led" wins over "weeks"
        reason: 'Contains "Led" which maps to leadership'
      },
      {
        bullet: 'Shipped ETH Liquid Staking MVP with Liquid Collective, partnering with Fidelity',
        expectedBundle: 'productDesign', // "Shipped" and "MVP"
        reason: 'Contains "Shipped" and "MVP"'
      },
      {
        bullet: 'Drove 15× revenue growth to $2M ARR through B2B pivot',
        expectedBundle: 'businessMarketing', // "revenue", "ARR", "growth", "B2B"
        reason: 'Multiple business keywords'
      },
      {
        bullet: 'Architected Docker/Kubernetes infrastructure for blockchain consortium',
        expectedBundle: 'technicalAnalytical', // "Architected", "infrastructure"
        reason: 'Contains "Architected" and "infrastructure"'
      }
    ];

    for (const { bullet, expectedBundle, reason } of realBullets) {
      it(`should categorize: "${bullet.slice(0, 50)}..." as ${expectedBundle}`, () => {
        const result = categorizeBullet(bullet);
        expect(result.bundle).toBe(expectedBundle);
      });
    }
  });

  describe('edge cases', () => {
    it('should handle empty bullet', () => {
      const result = categorizeBullet('');
      expect(result.bundle).toBeNull();
      expect(result.keywords).toHaveLength(0);
    });

    it('should handle bullet with only numbers', () => {
      const result = categorizeBullet('123456789');
      expect(result.bundle).toBeNull();
    });

    it('should handle bullet with special characters', () => {
      const bullet = 'Shipped $1M+ feature → drove 15× growth';
      const result = categorizeBullet(bullet);
      expect(result.bundle).not.toBeNull();
    });

    it('should handle markdown links in bullets', () => {
      // "Shipped" matches productDesign, "API" matches technical
      // Since "shipped" appears first and both have 1 match, productDesign wins
      const bullet = 'Shipped [Advanced API](https://ankr.com/docs/advanced-api/) from 0→1';
      const result = categorizeBullet(bullet);
      // With equal matches, first bundle in iteration wins (depends on object order)
      expect(result.bundle).not.toBeNull();
      expect(result.keywords.length).toBeGreaterThan(0);
    });
  });
});
