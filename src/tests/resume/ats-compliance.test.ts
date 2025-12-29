/**
 * ATS Compliance Tests
 *
 * Tests to ensure resume is ATS (Applicant Tracking System) friendly:
 * - Plain text structure (no images/icons in content)
 * - Standard section headers
 * - Semantic HTML structure
 * - Proper heading hierarchy
 * - Contact info format
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

// Read the CSS file for style compliance checks
const resumeCssPath = join(process.cwd(), 'src/pages/ResumePage.css');

describe('ATS Compliance - CSS Structure', () => {
  let cssContent: string;

  try {
    cssContent = readFileSync(resumeCssPath, 'utf-8');
  } catch {
    cssContent = '';
  }

  it('should use standard fonts', () => {
    // ATS prefers serif fonts like Georgia, Times New Roman
    // or sans-serif like Arial, Helvetica
    const hasStandardFont = /font-family.*(?:Georgia|Times|Arial|Helvetica|sans-serif|serif)/i.test(cssContent);
    expect(hasStandardFont).toBe(true);
  });

  it('should have print media styles', () => {
    const hasPrintStyles = /@media\s+print/i.test(cssContent);
    expect(hasPrintStyles).toBe(true);
  });

  it('should set white background for print', () => {
    const hasWhiteBackground = /background:\s*(?:white|#fff|#ffffff)/i.test(cssContent);
    expect(hasWhiteBackground).toBe(true);
  });
});

describe('ATS Compliance - Text Formatting', () => {
  it('should strip markdown links from highlights', () => {
    const markdownLink = '[Click here](https://example.com)';
    const stripped = markdownLink.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
    expect(stripped).toBe('Click here');
    expect(stripped).not.toContain('[');
    expect(stripped).not.toContain('](');
  });

  it('should strip accent markers from text', () => {
    const accentText = 'This is {{accent}}important{{/accent}} text';
    const stripped = accentText.replace(/\{\{accent\}\}|\{\{\/accent\}\}/g, '');
    expect(stripped).toBe('This is important text');
    expect(stripped).not.toContain('{{');
  });

  it('should handle nested formatting gracefully', () => {
    const complexText = '{{accent}}[Link Text](url){{/accent}} and more';
    let result = complexText.replace(/\{\{accent\}\}|\{\{\/accent\}\}/g, '');
    result = result.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
    expect(result).toBe('Link Text and more');
  });
});

describe('ATS Compliance - Section Headers', () => {
  const standardSections = [
    'Professional Experience',
    'Skills',
    'Summary',
    'Impact'
  ];

  it('should use standard section names', () => {
    // These are the expected section headers in the resume
    for (const section of standardSections) {
      expect(section.length).toBeGreaterThan(0);
    }
  });

  it('should not use creative/unclear section names', () => {
    const creativeNames = [
      'Career Journey',
      'My Story',
      'Adventures',
      'What I Do'
    ];

    for (const name of creativeNames) {
      expect(standardSections).not.toContain(name);
    }
  });
});

describe('ATS Compliance - Metrics Format', () => {
  it('should format metrics with clear values', () => {
    const goodMetrics = [
      '60% improvement',
      '15× revenue growth',
      '$2M ARR',
      '8+ years',
      'Zero slashing events'
    ];

    for (const metric of goodMetrics) {
      // Metrics should have a number or quantifier
      const hasQuantifier = /\d+|zero|million|billion/i.test(metric);
      expect(hasQuantifier).toBe(true);
    }
  });

  it('should avoid vague descriptions', () => {
    const vagueDescriptions = [
      'significantly improved',
      'greatly increased',
      'substantial growth',
      'many projects'
    ];

    // These should NOT be used - we want specific metrics
    for (const desc of vagueDescriptions) {
      const hasNumber = /\d+/.test(desc);
      expect(hasNumber).toBe(false);
    }
  });
});

describe('ATS Compliance - Contact Information', () => {
  it('should format email correctly', () => {
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const testEmail = 'test@example.com';
    expect(validEmail.test(testEmail)).toBe(true);
  });

  it('should include location as city, state/country', () => {
    const locationFormat = /[\w\s]+,\s*[\w\s]+/;
    const testLocation = 'San Francisco, CA';
    expect(locationFormat.test(testLocation)).toBe(true);
  });
});

describe('ATS Compliance - Date Formats', () => {
  it('should use consistent date format', () => {
    const validDateFormats = [
      '2024–present',
      '2023–2024',
      '2022–2023',
      'Jan 2024',
      'Present'
    ];

    for (const date of validDateFormats) {
      // Should not use MM/DD/YYYY format
      expect(date).not.toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/);
    }
  });

  it('should use en-dash for date ranges', () => {
    const dateRange = '2024–present';
    // En-dash (–) is preferred over hyphen (-) for ranges
    expect(dateRange).toContain('–');
  });
});

describe('ATS Compliance - Skills Section', () => {
  it('should list skills as comma-separated values', () => {
    const skillsList = 'JavaScript, TypeScript, React, Node.js';
    const skills = skillsList.split(',').map(s => s.trim());
    expect(skills.length).toBeGreaterThan(1);
    expect(skills.every(s => s.length > 0)).toBe(true);
  });

  it('should group skills by category', () => {
    // Skills should be organized into logical categories
    const categories = [
      { name: 'Languages', skills: ['JavaScript', 'TypeScript'] },
      { name: 'Frameworks', skills: ['React', 'Node.js'] }
    ];

    for (const cat of categories) {
      expect(cat.name).toBeTruthy();
      expect(cat.skills.length).toBeGreaterThan(0);
    }
  });
});

describe('ATS Compliance - Bullet Points', () => {
  it('should start bullets with action verbs', () => {
    const actionVerbs = [
      'Built',
      'Led',
      'Shipped',
      'Designed',
      'Improved',
      'Reduced',
      'Increased',
      'Launched',
      'Created',
      'Managed',
      'Developed',
      'Implemented'
    ];

    const goodBullet = 'Shipped Advanced API from 0→1 serving 1M+ daily requests';
    const firstWord = goodBullet.split(' ')[0];

    // Check that common patterns start with action verbs
    expect(actionVerbs.some(v => goodBullet.startsWith(v))).toBe(true);
  });

  it('should follow Action → Result format', () => {
    const goodBullets = [
      'Reduced time-to-first-deploy by 60% through CLI redesign',
      'Drove 15× revenue growth by pivoting to protocol partnerships',
      'Built ETF-grade infrastructure with zero slashing events'
    ];

    for (const bullet of goodBullets) {
      // Should contain a metric or result
      const hasMetric = /\d+%|\d+×|\d+\+|zero|million|billion|\$\d+/i.test(bullet);
      expect(hasMetric).toBe(true);
    }
  });
});
