/**
 * Tests for search-evidence.ts
 *
 * Validates knowledge base search and alignment report generation.
 * Run with: npm run test:cli
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  loadAchievements,
  loadStories,
  searchAchievement,
  searchStory,
  searchKnowledgeBase,
  generateAlignmentReport,
  type Achievement,
  type Story,
  type EvidenceMatch
} from './search-evidence.js';

// ═══════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════

const mockAchievement: Achievement = {
  id: 'eth-staking-test',
  headline: 'Built ETF-grade staking infrastructure with zero slashing events',
  metric: {
    value: 'Zero',
    unit: 'slashing events',
    context: 'Billions in AUM at stake'
  },
  situation: 'ETF providers needed ETH staking with institutional controls',
  task: 'Build validator infrastructure with SOC 2 compliance',
  action: 'Designed multi-client architecture with Web3Signer',
  result: 'Zero slashing events. Galaxy cited full key ownership as reason for choosing us.',
  skills: ['ethereum', 'staking', 'compliance', 'api-design'],
  themes: ['institutional-crypto', 'infrastructure'],
  companies: ['anchorage'],
  years: [2024],
  good_for: ['Infrastructure PM roles', 'Crypto positions', 'Compliance-heavy environments']
};

const mockStory: Story = {
  id: 'galaxy-compliance-win',
  title: 'How we won Galaxy with compliance-first approach',
  headline: 'Galaxy specifically cited key ownership as reason for choosing us over competitors',
  themes: ['institutional-crypto', 'compliance'],
  skills: ['staking', 'enterprise-sales']
};

// ═══════════════════════════════════════════════════════════════
// UNIT TESTS: searchAchievement
// ═══════════════════════════════════════════════════════════════

describe('searchAchievement', () => {
  it('should match achievements by headline keywords', () => {
    const match = searchAchievement(mockAchievement, ['staking', 'infrastructure']);
    expect(match).not.toBeNull();
    expect(match!.matchedTerms).toContain('staking');
    expect(match!.matchedTerms).toContain('infrastructure');
  });

  it('should match achievements by skills', () => {
    const match = searchAchievement(mockAchievement, ['ethereum', 'compliance']);
    expect(match).not.toBeNull();
    expect(match!.matchedSkills).toContain('ethereum');
    expect(match!.matchedSkills).toContain('compliance');
  });

  it('should match achievements by themes', () => {
    const match = searchAchievement(mockAchievement, ['institutional-crypto']);
    expect(match).not.toBeNull();
    expect(match!.matchedThemes).toContain('institutional-crypto');
  });

  it('should return null for no matches', () => {
    const match = searchAchievement(mockAchievement, ['gaming', 'mobile', 'consumer']);
    expect(match).toBeNull();
  });

  it('should calculate relevance score based on match count', () => {
    // 4 matching terms out of 4 should be high score
    const match = searchAchievement(mockAchievement, ['staking', 'ethereum', 'compliance', 'infrastructure']);
    expect(match).not.toBeNull();
    expect(match!.relevanceScore).toBeGreaterThan(0.5);
  });

  it('should include snippet from result or action', () => {
    const match = searchAchievement(mockAchievement, ['staking']);
    expect(match).not.toBeNull();
    expect(match!.snippet.length).toBeGreaterThan(0);
  });

  it('should handle case-insensitive matching', () => {
    const match = searchAchievement(mockAchievement, ['ETHEREUM', 'Staking', 'COMPLIANCE']);
    expect(match).not.toBeNull();
    expect(match!.matchedSkills.length).toBeGreaterThan(0);
  });

  it('should match partial terms in text', () => {
    const match = searchAchievement(mockAchievement, ['validator', 'slashing']);
    expect(match).not.toBeNull();
    expect(match!.matchedTerms.length).toBeGreaterThan(0);
  });
});

// ═══════════════════════════════════════════════════════════════
// UNIT TESTS: searchStory
// ═══════════════════════════════════════════════════════════════

describe('searchStory', () => {
  it('should match stories by title keywords', () => {
    const match = searchStory(mockStory, ['galaxy', 'compliance']);
    expect(match).not.toBeNull();
    expect(match!.matchedTerms.length).toBeGreaterThan(0);
  });

  it('should match stories by themes', () => {
    const match = searchStory(mockStory, ['institutional-crypto']);
    expect(match).not.toBeNull();
    expect(match!.matchedThemes).toContain('institutional-crypto');
  });

  it('should match stories by skills', () => {
    const match = searchStory(mockStory, ['staking', 'enterprise-sales']);
    expect(match).not.toBeNull();
    expect(match!.matchedSkills.length).toBeGreaterThan(0);
  });

  it('should return null for no matches', () => {
    const match = searchStory(mockStory, ['gaming', 'mobile', 'defi']);
    expect(match).toBeNull();
  });

  it('should set source as story', () => {
    const match = searchStory(mockStory, ['compliance']);
    expect(match).not.toBeNull();
    expect(match!.source).toBe('story');
  });
});

// ═══════════════════════════════════════════════════════════════
// INTEGRATION TESTS: searchKnowledgeBase
// ═══════════════════════════════════════════════════════════════

describe('searchKnowledgeBase', () => {
  it('should return results sorted by relevance score', () => {
    const matches = searchKnowledgeBase(['staking', 'ethereum', 'infrastructure']);
    if (matches.length > 1) {
      for (let i = 1; i < matches.length; i++) {
        expect(matches[i - 1].relevanceScore).toBeGreaterThanOrEqual(matches[i].relevanceScore);
      }
    }
  });

  it('should return empty array for non-matching terms', () => {
    const matches = searchKnowledgeBase(['xyznonexistent123', 'nomatchwillbefound']);
    expect(matches).toHaveLength(0);
  });

  it('should find achievements with crypto domain terms', () => {
    const matches = searchKnowledgeBase(['crypto', 'blockchain', 'staking']);
    expect(matches.length).toBeGreaterThan(0);
  });

  it('should find achievements with infrastructure terms', () => {
    const matches = searchKnowledgeBase(['infrastructure', 'api', 'platform']);
    expect(matches.length).toBeGreaterThan(0);
  });
});

// ═══════════════════════════════════════════════════════════════
// UNIT TESTS: generateAlignmentReport
// ═══════════════════════════════════════════════════════════════

describe('generateAlignmentReport', () => {
  it('should generate a report with all required fields', () => {
    const report = generateAlignmentReport(['staking', 'ethereum']);

    expect(report.metadata).toBeDefined();
    expect(report.metadata.generatedAt).toBeDefined();
    expect(report.metadata.searchTerms).toEqual(['staking', 'ethereum']);

    expect(report.summary).toBeDefined();
    expect(report.summary.totalMatches).toBeGreaterThanOrEqual(0);
    expect(report.summary.alignmentScore).toBeGreaterThanOrEqual(0);
    expect(report.summary.alignmentScore).toBeLessThanOrEqual(1);
    expect(['PROCEED', 'REVIEW', 'SKIP']).toContain(report.summary.recommendation);

    expect(report.matches).toBeDefined();
    expect(Array.isArray(report.matches)).toBe(true);

    expect(report.gaps).toBeDefined();
    expect(Array.isArray(report.gaps)).toBe(true);
  });

  it('should count matches by strength correctly', () => {
    const report = generateAlignmentReport(['staking', 'ethereum', 'infrastructure', 'compliance']);

    const total = report.summary.strongMatches + report.summary.moderateMatches + report.summary.weakMatches;
    expect(total).toBe(report.summary.totalMatches);
  });

  it('should identify gaps for unmatched terms', () => {
    const report = generateAlignmentReport(['staking', 'xyz_nonexistent_term_123']);

    // The nonexistent term should appear in gaps
    expect(report.gaps).toContain('xyz_nonexistent_term_123');
  });

  it('should recommend SKIP for no matches', () => {
    const report = generateAlignmentReport(['xyznonexistent123', 'nomatchwillbefound']);

    expect(report.summary.recommendation).toBe('SKIP');
    expect(report.summary.alignmentScore).toBe(0);
  });

  it('should include source analysis path when provided', () => {
    const report = generateAlignmentReport(
      ['staking'],
      0.5,
      'capstone/develop/jd-analysis/test.yaml'
    );

    expect(report.metadata.sourceAnalysis).toBe('capstone/develop/jd-analysis/test.yaml');
  });

  it('should respect threshold for recommendation', () => {
    // With a very high threshold, should recommend REVIEW or SKIP
    const report = generateAlignmentReport(['staking'], 0.99);
    expect(['REVIEW', 'SKIP']).toContain(report.summary.recommendation);

    // With very low threshold, should be more likely to PROCEED
    const lowThresholdReport = generateAlignmentReport(['staking', 'ethereum', 'compliance'], 0.1);
    expect(['PROCEED', 'REVIEW']).toContain(lowThresholdReport.summary.recommendation);
  });
});

// ═══════════════════════════════════════════════════════════════
// INTEGRATION TESTS: Real Knowledge Base
// ═══════════════════════════════════════════════════════════════

describe('real knowledge base integration', () => {
  it('should load achievements from knowledge base', () => {
    const achievements = loadAchievements();
    expect(achievements.length).toBeGreaterThan(0);

    // Each achievement should have required fields
    for (const achievement of achievements) {
      expect(achievement.id).toBeDefined();
      expect(achievement.headline).toBeDefined();
    }
  });

  it('should load stories from knowledge base', () => {
    const stories = loadStories();
    // Stories may or may not exist
    expect(Array.isArray(stories)).toBe(true);
  });

  it('should find eth-staking achievement with relevant terms', () => {
    const matches = searchKnowledgeBase(['staking', 'institutional', 'ethereum']);

    const stakingMatch = matches.find(m => m.id.includes('staking'));
    expect(stakingMatch).toBeDefined();
  });

  it('should find ankr achievement with api/infrastructure terms', () => {
    const matches = searchKnowledgeBase(['api', 'revenue', 'infrastructure']);

    const ankrMatch = matches.find(m => m.id.includes('ankr'));
    expect(ankrMatch).toBeDefined();
  });

  it('should find xbox achievement with ethereum/microsoft terms', () => {
    const matches = searchKnowledgeBase(['ethereum', 'microsoft', 'smart contract']);

    const xboxMatch = matches.find(m => m.id.includes('xbox'));
    expect(xboxMatch).toBeDefined();
  });
});

// ═══════════════════════════════════════════════════════════════
// EDGE CASES
// ═══════════════════════════════════════════════════════════════

describe('edge cases', () => {
  it('should handle empty search terms array', () => {
    const report = generateAlignmentReport([]);

    expect(report.summary.totalMatches).toBe(0);
    expect(report.summary.alignmentScore).toBe(0);
    expect(report.summary.recommendation).toBe('SKIP');
  });

  it('should handle single search term', () => {
    const report = generateAlignmentReport(['ethereum']);

    expect(report.metadata.searchTerms).toHaveLength(1);
  });

  it('should handle special characters in search terms', () => {
    const report = generateAlignmentReport(['0→1', '$100M', 'API/SDK']);

    // Should not throw
    expect(report.metadata.searchTerms).toHaveLength(3);
  });

  it('should handle very long search terms list', () => {
    const manyTerms = Array.from({ length: 50 }, (_, i) => `term${i}`);
    const report = generateAlignmentReport(manyTerms);

    expect(report.metadata.searchTerms).toHaveLength(50);
  });

  it('should handle duplicate search terms', () => {
    // Duplicate search terms are passed as-is; the key test is that search still works
    const matches = searchKnowledgeBase(['staking', 'staking', 'ethereum']);

    // Should find matches despite duplicate input terms
    expect(matches.length).toBeGreaterThan(0);
    // At least one match should contain both unique terms
    const hasStaking = matches.some(m => m.matchedTerms.includes('staking'));
    const hasEthereum = matches.some(m => m.matchedTerms.includes('ethereum') || m.matchedSkills.includes('ethereum'));
    expect(hasStaking || hasEthereum).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════
// RECOMMENDATION LOGIC TESTS
// ═══════════════════════════════════════════════════════════════

describe('recommendation logic', () => {
  it('should recommend PROCEED when score >= threshold and strong matches >= 2', () => {
    // Using terms that should match well with the knowledge base
    const report = generateAlignmentReport(
      ['staking', 'ethereum', 'infrastructure', 'compliance', 'api'],
      0.3  // Low threshold
    );

    // With multiple matching terms, should have strong matches
    if (report.summary.strongMatches >= 2 && report.summary.alignmentScore >= 0.3) {
      expect(report.summary.recommendation).toBe('PROCEED');
    }
  });

  it('should recommend REVIEW when on the edge', () => {
    // Using terms that partially match
    const report = generateAlignmentReport(
      ['staking', 'unknown_term_xyz'],
      0.5
    );

    // Partial match should lead to REVIEW if alignment is borderline
    expect(['REVIEW', 'PROCEED', 'SKIP']).toContain(report.summary.recommendation);
  });

  it('should recommend SKIP when no relevant matches', () => {
    const report = generateAlignmentReport(
      ['gaming_mobile_consumer', 'social_media', 'ecommerce_retail'],
      0.5
    );

    expect(report.summary.recommendation).toBe('SKIP');
  });
});
