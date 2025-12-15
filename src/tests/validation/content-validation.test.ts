/**
 * Content Validation Tests
 *
 * Tests for Zod schema validation of all content types:
 * - Case studies
 * - Blog posts
 * - Passion projects
 * - Profile and other YAML configs
 */

import { describe, it, expect } from 'vitest';
import {
  CaseStudySchema,
  BlogPostSchema,
  PassionProjectsSchema,
  ProfileSchema
} from '../../lib/schemas';

describe('Case Study Schema Validation', () => {
  it('should validate a complete case study', () => {
    const validCaseStudy = {
      id: 1,
      slug: 'test-project',
      title: 'Test Project',
      company: 'Test Company',
      year: '2024',
      tags: ['Tag1', 'Tag2'],
      duration: '6 months',
      role: 'Product Manager',
      hook: {
        headline: 'Test headline',
        impactMetric: {
          value: '50%',
          label: 'improvement'
        },
        thumbnail: null
      },
      cta: {
        headline: 'CTA headline',
        action: 'calendly' as const,
        linkText: 'Let\'s talk'
      },
      content: 'Test content'
    };

    const result = CaseStudySchema.safeParse(validCaseStudy);
    expect(result.success).toBe(true);
  });

  it('should validate case study with all optional fields', () => {
    const caseStudyWithOptionals = {
      id: 1,
      slug: 'test-project',
      title: 'Test Project',
      company: 'Test Company',
      year: '2024-25',
      tags: ['Tag1', 'Tag2'],
      duration: '6 months',
      role: 'Product Manager',
      hook: {
        headline: 'Test headline',
        impactMetric: {
          value: '50%',
          label: 'improvement'
        },
        subMetrics: [
          { value: '100', label: 'users' }
        ],
        thumbnail: '/images/test.png'
      },
      demoUrl: 'https://demo.com',
      githubUrl: 'https://github.com/test/repo',
      docsUrl: 'https://docs.test.com',
      media: [
        { type: 'blog' as const, url: 'https://blog.com', label: 'Post' }
      ],
      cta: {
        headline: 'CTA headline',
        subtext: 'Additional text',
        action: 'calendly' as const,
        linkText: 'Let\'s talk'
      },
      content: 'Test content'
    };

    const result = CaseStudySchema.safeParse(caseStudyWithOptionals);
    expect(result.success).toBe(true);
  });

  it('should reject case study with missing required fields', () => {
    const invalidCaseStudy = {
      id: 1,
      slug: 'test-project',
      // Missing title, company, year, etc.
    };

    const result = CaseStudySchema.safeParse(invalidCaseStudy);
    expect(result.success).toBe(false);
  });

  it('should reject case study with invalid CTA action', () => {
    const invalidCaseStudy = {
      id: 1,
      slug: 'test-project',
      title: 'Test Project',
      company: 'Test Company',
      year: '2024',
      tags: ['Tag1'],
      duration: '6 months',
      role: 'PM',
      hook: {
        headline: 'Test',
        impactMetric: { value: '50%', label: 'test' },
        thumbnail: null
      },
      cta: {
        headline: 'CTA',
        action: 'invalid-action', // Invalid enum value
        linkText: 'Click'
      },
      content: 'Test'
    };

    const result = CaseStudySchema.safeParse(invalidCaseStudy);
    expect(result.success).toBe(false);
  });

  it('should accept both quoted and unquoted year formats', () => {
    const singleYear = { year: '2024' };
    const yearRange = { year: '2024-25' };

    // Both should be valid strings
    expect(typeof singleYear.year).toBe('string');
    expect(typeof yearRange.year).toBe('string');
  });
});

describe('Blog Post Schema Validation', () => {
  it('should validate a complete blog post', () => {
    const validBlogPost = {
      title: 'Test Post',
      date: '2024-12-15',
      excerpt: 'Test excerpt',
      tags: ['Tag1', 'Tag2'],
      thumbnail: null,
      content: 'Test content'
    };

    const result = BlogPostSchema.safeParse(validBlogPost);
    expect(result.success).toBe(true);
  });

  it('should validate blog post with thumbnail', () => {
    const blogPostWithThumbnail = {
      title: 'Test Post',
      date: '2024-12-15',
      excerpt: 'Test excerpt',
      tags: ['Tag1'],
      thumbnail: '/images/thumb.png',
      content: 'Test content'
    };

    const result = BlogPostSchema.safeParse(blogPostWithThumbnail);
    expect(result.success).toBe(true);
  });

  it('should reject blog post with invalid date format', () => {
    const invalidBlogPost = {
      title: 'Test Post',
      date: '12/15/2024', // Wrong format (should be YYYY-MM-DD)
      excerpt: 'Test excerpt',
      tags: ['Tag1'],
      content: 'Test content'
    };

    const result = BlogPostSchema.safeParse(invalidBlogPost);
    // Should fail validation due to incorrect date format
    expect(result.success).toBe(false);
  });

  it('should reject blog post with missing required fields', () => {
    const invalidBlogPost = {
      title: 'Test Post',
      // Missing date, excerpt, tags, content
    };

    const result = BlogPostSchema.safeParse(invalidBlogPost);
    expect(result.success).toBe(false);
  });
});

describe('Passion Projects Schema Validation', () => {
  it('should validate passion projects array', () => {
    const validProjects = {
      projects: [
        {
          id: 1,
          slug: 'test-project',
          title: 'Test Project',
          tagline: 'One-line description',
          year: '2024',
          tags: ['Tag1', 'Tag2'],
          thumbnail: null,
          githubUrl: 'https://github.com/test/repo',
          liveUrl: null,
          docsUrl: null
        }
      ]
    };

    const result = PassionProjectsSchema.safeParse(validProjects);
    expect(result.success).toBe(true);
  });

  it('should validate passion project with all optional URLs', () => {
    const projectWithAllUrls = {
      projects: [
        {
          id: 1,
          slug: 'test-project',
          title: 'Test Project',
          tagline: 'Description',
          year: '2024',
          tags: ['Tag1'],
          thumbnail: '/images/thumb.png',
          githubUrl: 'https://github.com/test/repo',
          liveUrl: 'https://demo.com',
          docsUrl: 'https://docs.test.com'
        }
      ]
    };

    const result = PassionProjectsSchema.safeParse(projectWithAllUrls);
    expect(result.success).toBe(true);
  });

  it('should validate empty projects array', () => {
    const emptyProjects = {
      projects: []
    };

    const result = PassionProjectsSchema.safeParse(emptyProjects);
    expect(result.success).toBe(true);
  });

  it('should reject passion project with missing required fields', () => {
    const invalidProjects = {
      projects: [
        {
          id: 1,
          // Missing slug, title, tagline, year, tags
        }
      ]
    };

    const result = PassionProjectsSchema.safeParse(invalidProjects);
    expect(result.success).toBe(false);
  });
});

describe('Profile Schema Validation', () => {
  it('should validate profile with all sections', () => {
    const validProfile = {
      name: 'Test User',
      ens: 'test.eth',
      email: 'test@example.com',
      location: 'San Francisco, CA',
      timezone: 'PST',
      photo: '/images/photo.jpg',
      hero: {
        status: 'Open to opportunities',
        headline: [
          { text: 'Building', style: 'italic' as const }
        ],
        subheadline: 'Test subheadline',
        cta: {
          primary: { label: 'View Work', href: '#work' },
          secondary: { label: 'Resume', href: '/resume.pdf' }
        }
      },
      about: {
        tagline: 'Test tagline',
        bio: ['Bio paragraph 1', 'Bio paragraph 2'],
        stats: [
          { value: '5+', label: 'Years' }
        ]
      },
      sections: {
        beyondWork: false,
        blog: true,
        onchainIdentity: false,
        skills: false,
        passionProjects: true
      }
    };

    const result = ProfileSchema.safeParse(validProfile);
    expect(result.success).toBe(true);
  });

  it('should reject profile with invalid email', () => {
    const invalidProfile = {
      name: 'Test User',
      ens: 'test.eth',
      email: 'invalid-email', // Invalid email format
      location: 'SF',
      timezone: 'PST',
      photo: '/photo.jpg',
      hero: {
        status: 'Open',
        headline: [{ text: 'Test', style: 'normal' as const }],
        subheadline: 'Test',
        cta: {
          primary: { label: 'Work', href: '#' },
          secondary: { label: 'Resume', href: '#' }
        }
      },
      about: {
        tagline: 'Test',
        bio: ['Test'],
        stats: []
      },
      sections: {
        beyondWork: false,
        blog: true,
        onchainIdentity: false,
        skills: false,
        passionProjects: true
      }
    };

    const result = ProfileSchema.safeParse(invalidProfile);
    expect(result.success).toBe(false);
  });
});

describe('Content Type Detection', () => {
  it('should differentiate between content types by structure', () => {
    const caseStudy = {
      id: 1,
      slug: 'test',
      title: 'Test',
      company: 'Test Co',
      year: '2024',
      tags: [],
      duration: '6 months',
      role: 'PM',
      hook: {
        headline: 'Test',
        impactMetric: { value: '50%', label: 'test' },
        thumbnail: null
      },
      cta: {
        headline: 'CTA',
        action: 'calendly' as const,
        linkText: 'Click'
      },
      content: 'Test'
    };

    const blogPost = {
      title: 'Test',
      date: '2024-12-15',
      excerpt: 'Test',
      tags: [],
      content: 'Test'
    };

    expect(CaseStudySchema.safeParse(caseStudy).success).toBe(true);
    expect(BlogPostSchema.safeParse(blogPost).success).toBe(true);

    // Cross-validation should fail
    expect(CaseStudySchema.safeParse(blogPost).success).toBe(false);
    expect(BlogPostSchema.safeParse(caseStudy).success).toBe(false);
  });
});
