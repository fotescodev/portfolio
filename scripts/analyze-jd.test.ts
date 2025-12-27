/**
 * Tests for analyze-jd.ts
 *
 * Validates JD parsing, generic phrase filtering, and requirement extraction.
 * Run with: npm run test:cli
 */

import { describe, it, expect } from 'vitest';
import {
  GENERIC_PHRASES,
  SIGNAL_PATTERNS,
  DOMAIN_KEYWORDS,
  analyzeJD,
  type JDAnalysis
} from './analyze-jd.js';

// ═══════════════════════════════════════════════════════════════
// GENERIC PHRASE FILTERING TESTS
// ═══════════════════════════════════════════════════════════════

describe('GENERIC_PHRASES', () => {
  it('should include common soft skill phrases', () => {
    expect(GENERIC_PHRASES).toContain('team player');
    expect(GENERIC_PHRASES).toContain('excellent communication');
    expect(GENERIC_PHRASES).toContain('self-starter');
  });

  it('should include meaningless qualifiers', () => {
    expect(GENERIC_PHRASES).toContain('proven track record');
    expect(GENERIC_PHRASES).toContain('data-driven');
    expect(GENERIC_PHRASES).toContain('results-oriented');
  });

  it('should include generic PM boilerplate', () => {
    expect(GENERIC_PHRASES).toContain('work with cross-functional teams');
    expect(GENERIC_PHRASES).toContain('influence without authority');
  });
});

// ═══════════════════════════════════════════════════════════════
// SIGNAL PATTERN TESTS
// ═══════════════════════════════════════════════════════════════

describe('SIGNAL_PATTERNS', () => {
  it('should have patterns for years experience', () => {
    const yearsCategory = SIGNAL_PATTERNS.find(p => p.category === 'years_experience');
    expect(yearsCategory).toBeDefined();

    const text = '5+ years of product management experience';
    const hasMatch = yearsCategory!.patterns.some(p => p.test(text));
    expect(hasMatch).toBe(true);
  });

  it('should have patterns for technologies', () => {
    const techCategory = SIGNAL_PATTERNS.find(p => p.category === 'technologies');
    expect(techCategory).toBeDefined();

    const text = 'Experience with Kubernetes, Docker, and AWS';
    const hasMatch = techCategory!.patterns.some(p => p.test(text));
    expect(hasMatch).toBe(true);
  });

  it('should have patterns for domain expertise', () => {
    const domainCategory = SIGNAL_PATTERNS.find(p => p.category === 'domain_expertise');
    expect(domainCategory).toBeDefined();

    const text = 'fintech background required';
    const hasMatch = domainCategory!.patterns.some(p => p.test(text));
    expect(hasMatch).toBe(true);
  });

  it('should match 0→1 experience', () => {
    const achievementsCategory = SIGNAL_PATTERNS.find(p => p.category === 'specific_achievements');
    expect(achievementsCategory).toBeDefined();

    const text = 'Built product 0→1 from scratch';
    const hasMatch = achievementsCategory!.patterns.some(p => p.test(text));
    expect(hasMatch).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════
// DOMAIN KEYWORDS TESTS
// ═══════════════════════════════════════════════════════════════

describe('DOMAIN_KEYWORDS', () => {
  it('should have crypto domain keywords', () => {
    expect(DOMAIN_KEYWORDS.crypto).toContain('blockchain');
    expect(DOMAIN_KEYWORDS.crypto).toContain('ethereum');
    expect(DOMAIN_KEYWORDS.crypto).toContain('staking');
  });

  it('should have developer_tools domain keywords', () => {
    expect(DOMAIN_KEYWORDS.developer_tools).toContain('api');
    expect(DOMAIN_KEYWORDS.developer_tools).toContain('sdk');
  });

  it('should have ai_ml domain keywords', () => {
    expect(DOMAIN_KEYWORDS.ai_ml).toContain('llm');
    expect(DOMAIN_KEYWORDS.ai_ml).toContain('machine learning');
  });
});

// ═══════════════════════════════════════════════════════════════
// JD ANALYSIS TESTS
// ═══════════════════════════════════════════════════════════════

describe('analyzeJD', () => {
  describe('company and role extraction', () => {
    it('should extract company from filename pattern', () => {
      const analysis = analyzeJD('Some job description', 'jd-stripe-pm.txt');
      expect(analysis.extracted.company).toBe('Stripe');
      expect(analysis.metadata.slug).toBe('stripe-pm');
    });

    it('should extract role from text', () => {
      const jd = `
        Stripe is hiring a Senior Product Manager

        We are looking for someone with 5+ years of experience.
      `;
      const analysis = analyzeJD(jd);
      expect(analysis.extracted.role?.toLowerCase()).toContain('product manager');
    });

    it('should extract years required', () => {
      const jd = '7+ years of product management experience required';
      const analysis = analyzeJD(jd);
      expect(analysis.extracted.yearsRequired).toBe(7);
    });

    it('should handle minimum years phrasing', () => {
      const jd = 'Minimum 5 years of experience in product management';
      const analysis = analyzeJD(jd);
      expect(analysis.extracted.yearsRequired).toBe(5);
    });
  });

  describe('must-have extraction', () => {
    it('should extract technology requirements', () => {
      const jd = `
        Requirements:
        - Experience with Kubernetes and Docker
        - 5+ years of product experience
        - Built products using AWS infrastructure
      `;
      const analysis = analyzeJD(jd);
      expect(analysis.mustHaves.length).toBeGreaterThan(0);
      expect(analysis.mustHaves.some(m => m.category === 'technologies')).toBe(true);
    });

    it('should extract domain expertise requirements', () => {
      const jd = `
        - Fintech background required
        - Experience with blockchain payments
      `;
      const analysis = analyzeJD(jd);
      expect(analysis.mustHaves.some(m => m.category === 'domain_expertise')).toBe(true);
    });

    it('should assign high specificity to technology/domain requirements', () => {
      const jd = 'Experience with Kubernetes required';
      const analysis = analyzeJD(jd);
      const techReq = analysis.mustHaves.find(m => m.category === 'technologies');
      expect(techReq?.specificity).toBe('high');
    });

    it('should assign medium specificity to years/achievements', () => {
      const jd = '5+ years of product management experience';
      const analysis = analyzeJD(jd);
      const yearsReq = analysis.mustHaves.find(m => m.category === 'years_experience');
      expect(yearsReq?.specificity).toBe('medium');
    });
  });

  describe('generic phrase filtering', () => {
    it('should filter out generic phrases', () => {
      const jd = `
        Requirements:
        - Team player with excellent communication skills
        - Self-starter with proven track record
        - Data-driven decision maker
        - 5+ years of Kubernetes experience
      `;
      const analysis = analyzeJD(jd);

      // Should have filtered the generic phrases
      expect(analysis.ignoredGeneric.length).toBeGreaterThan(0);

      // But should have kept the specific requirement
      const hasKubernetes = analysis.mustHaves.some(m =>
        m.text.toLowerCase().includes('kubernetes')
      );
      expect(hasKubernetes).toBe(true);
    });

    it('should not extract requirements from generic-only bullets', () => {
      const jd = `
        - Excellent communication skills
        - Strong problem solver
        - Passionate about technology
      `;
      const analysis = analyzeJD(jd);

      // All are generic, so mustHaves should be empty or very small
      expect(analysis.mustHaves.length).toBe(0);
      expect(analysis.ignoredGeneric.length).toBeGreaterThan(0);
    });
  });

  describe('domain keyword extraction', () => {
    it('should detect crypto domain', () => {
      const jd = 'Experience with blockchain, ethereum, and staking infrastructure';
      const analysis = analyzeJD(jd);
      expect(analysis.domainKeywords).toContain('crypto');
    });

    it('should detect fintech domain', () => {
      const jd = 'Experience in fintech and payments processing';
      const analysis = analyzeJD(jd);
      expect(analysis.domainKeywords).toContain('fintech');
    });

    it('should detect multiple domains', () => {
      const jd = 'Building API infrastructure for blockchain payments platform';
      const analysis = analyzeJD(jd);
      expect(analysis.domainKeywords).toContain('developer_tools');
      expect(analysis.domainKeywords).toContain('infrastructure');
      expect(analysis.domainKeywords).toContain('crypto');
    });

    it('should detect AI/ML domain', () => {
      const jd = 'Experience with LLM and machine learning products';
      const analysis = analyzeJD(jd);
      expect(analysis.domainKeywords).toContain('ai_ml');
    });
  });

  describe('search terms generation', () => {
    it('should generate search terms from domain keywords', () => {
      const jd = 'Blockchain infrastructure experience required';
      const analysis = analyzeJD(jd);
      expect(analysis.searchTerms.length).toBeGreaterThan(0);
    });

    it('should include terms from matched patterns', () => {
      const jd = '5+ years of product experience with infrastructure and platform work';
      const analysis = analyzeJD(jd);
      // Should have infrastructure domain terms
      expect(analysis.domainKeywords).toContain('infrastructure');
      expect(analysis.searchTerms.length).toBeGreaterThan(0);
    });

    it('should limit search terms to 15', () => {
      const jd = `
        Experience with AWS, GCP, Azure, Kubernetes, Docker, Terraform,
        Python, Rust, Go, TypeScript, React, Node.js, blockchain, ethereum,
        fintech, payments, banking, API, SDK, infrastructure, scalability
      `;
      const analysis = analyzeJD(jd);
      expect(analysis.searchTerms.length).toBeLessThanOrEqual(15);
    });
  });

  describe('nice-to-haves extraction', () => {
    it('should extract nice-to-have requirements', () => {
      const jd = `
        Requirements:
        - 5+ years PM experience

        Nice to have:
        - Kubernetes experience preferred
        - Gaming industry background is a bonus
      `;
      const analysis = analyzeJD(jd);
      expect(analysis.niceToHaves.length).toBeGreaterThan(0);
    });
  });
});

// ═══════════════════════════════════════════════════════════════
// REAL JD EXAMPLES
// ═══════════════════════════════════════════════════════════════

describe('real JD examples', () => {
  it('should analyze a crypto PM JD', () => {
    const jd = `
      Senior Product Manager - Staking Infrastructure

      About the role:
      We're looking for a Senior PM to lead our staking products.

      Requirements:
      - 7+ years of product management experience
      - Deep experience with Ethereum and proof-of-stake protocols
      - Experience with institutional crypto products
      - Strong technical background in distributed systems

      Nice to have:
      - Experience with regulatory compliance preferred
      - Gaming background is a plus
    `;

    const analysis = analyzeJD(jd);

    expect(analysis.extracted.yearsRequired).toBe(7);
    expect(analysis.domainKeywords).toContain('crypto');
    expect(analysis.mustHaves.length).toBeGreaterThan(0);
    expect(analysis.niceToHaves.length).toBeGreaterThan(0);
  });

  it('should analyze a DevTools PM JD', () => {
    const jd = `
      Product Manager - Developer Experience

      Join us to build world-class developer tools.

      You should have:
      - 5+ years of experience in product management
      - Experience with API design and SDK development
      - Shipped developer tools or platforms
      - Understanding of developer workflows

      We don't need:
      - A great communicator who is passionate
      - Someone who works well in fast-paced environments
    `;

    const analysis = analyzeJD(jd);

    expect(analysis.extracted.yearsRequired).toBe(5);
    expect(analysis.domainKeywords).toContain('developer_tools');
    // The "great communicator" and "fast-paced" lines should be filtered
    expect(analysis.ignoredGeneric.some(g =>
      g.toLowerCase().includes('communicator') || g.toLowerCase().includes('fast-paced')
    )).toBe(true);
  });

  it('should handle JD with mostly generic content', () => {
    const jd = `
      Product Manager

      We need someone who is:
      - A team player
      - Self-motivated
      - Passionate about products
      - Data-driven
      - Results-oriented
      - Excellent communicator
    `;

    const analysis = analyzeJD(jd);

    // All requirements are generic
    expect(analysis.mustHaves.length).toBe(0);
    expect(analysis.ignoredGeneric.length).toBeGreaterThan(0);
  });
});

// ═══════════════════════════════════════════════════════════════
// EDGE CASES
// ═══════════════════════════════════════════════════════════════

describe('edge cases', () => {
  it('should handle empty JD', () => {
    const analysis = analyzeJD('');
    expect(analysis.extracted.company).toBeNull();
    expect(analysis.mustHaves).toEqual([]);
  });

  it('should handle JD with only numbers', () => {
    const analysis = analyzeJD('12345 67890');
    expect(analysis.mustHaves.length).toBe(0);
  });

  it('should handle special characters in JD', () => {
    // The arrow gets normalized to space, making "5+ years experience" matchable
    const jd = '5+ years → of product experience with $100K+ ARR';
    const analysis = analyzeJD(jd);
    expect(analysis.extracted.yearsRequired).toBe(5);
  });

  it('should handle markdown formatting', () => {
    const jd = `
      ## Requirements

      * **5+ years** of PM experience
      * Experience with [Kubernetes](https://kubernetes.io)
      * Built _multiple_ products
    `;
    const analysis = analyzeJD(jd);
    expect(analysis.extracted.yearsRequired).toBe(5);
  });

  it('should handle various bullet formats', () => {
    const jd = `
      • 5+ years experience
      - Docker expertise
      * AWS knowledge
      ◦ Terraform skills
    `;
    const analysis = analyzeJD(jd);
    expect(analysis.mustHaves.length).toBeGreaterThan(0);
  });
});
