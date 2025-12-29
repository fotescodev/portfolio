/**
 * Variant Resume Tests
 *
 * Tests for VariantResumePage component:
 * - Variant overrides are applied correctly
 * - Merged profile data flows to resume
 * - Experience overrides work
 * - Stats from variant are used
 */

import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import type { Variant } from '../../types/variant';

// Mock the variants module
vi.mock('../../lib/variants', () => ({
  loadVariant: vi.fn(),
  mergeProfile: vi.fn(),
  getExperienceWithOverrides: vi.fn(),
}));

// Mock the content module
vi.mock('../../lib/content', () => ({
  profile: {
    name: 'Test User',
    email: 'test@example.com',
    location: 'Test City',
    about: {
      tagline: 'Base tagline',
      stats: [{ value: '5+', label: 'Years' }],
      bio: ['Base bio paragraph']
    },
    hero: {
      status: 'Open to roles',
      headline: [{ text: 'Test', style: 'normal' }],
      subheadline: 'Base subheadline'
    }
  },
  experience: {
    jobs: [
      {
        company: 'Test Company',
        role: 'Test Role',
        period: '2024–present',
        location: 'Test City',
        highlights: ['Base highlight 1', 'Base highlight 2'],
        tags: ['tag1']
      }
    ]
  },
  skills: {
    categories: [
      { name: 'Test Category', skills: ['Skill 1', 'Skill 2'] }
    ]
  }
}));

import { loadVariant, mergeProfile, getExperienceWithOverrides } from '../../lib/variants';
import VariantResumePage from '../../pages/VariantResumePage';

// Create mock variant data
const createMockVariant = (overrides: Partial<Variant> = {}): Variant => ({
  metadata: {
    company: 'Test Company',
    role: 'Test Role',
    slug: 'test-role',
    generatedAt: '2024-12-29',
    jobDescription: 'Test JD',
    publishStatus: 'draft',
    applicationStatus: 'not_applied',
    ...overrides.metadata
  },
  overrides: {
    about: {
      tagline: 'Variant tagline for Test Company',
      stats: [
        { value: '10+', label: 'Variant Years' },
        { value: '50%', label: 'Improvement' }
      ],
      bio: ['Variant bio paragraph 1', 'Variant bio paragraph 2']
    },
    hero: {
      subheadline: 'Variant subheadline'
    },
    ...overrides.overrides
  },
  relevance: overrides.relevance
});

const createMergedProfile = (variant: Variant) => ({
  name: 'Test User',
  email: 'test@example.com',
  location: 'Test City',
  ens: 'test.eth',
  timezone: 'UTC',
  photo: '/photo.jpg',
  about: {
    tagline: variant.overrides.about?.tagline || 'Base tagline',
    stats: variant.overrides.about?.stats || [{ value: '5+', label: 'Years' }],
    bio: variant.overrides.about?.bio || ['Base bio paragraph']
  },
  hero: {
    status: 'Open to roles',
    headline: [{ text: 'Test', style: 'normal' as const }],
    subheadline: variant.overrides.hero?.subheadline || 'Base subheadline',
    cta: {
      primary: { label: 'Work', href: '#' },
      secondary: { label: 'Resume', href: '#' }
    }
  },
  sections: {
    beyondWork: false,
    blog: true,
    onchainIdentity: false,
    skills: true,
    passionProjects: false
  },
  _variant: variant.metadata
});

const createMergedExperience = () => ({
  jobs: [
    {
      company: 'Test Company',
      role: 'Test Role',
      period: '2024–present',
      location: 'Test City',
      highlights: ['Variant highlight 1', 'Variant highlight 2', 'Variant highlight 3'],
      tags: ['variant-tag']
    }
  ]
});

// Test wrapper with routing
const renderWithRouter = (initialRoute: string) => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path="/:company/:role/resume" element={<VariantResumePage />} />
        <Route path="/" element={<div>Home</div>} />
      </Routes>
    </MemoryRouter>
  );
};

describe('VariantResumePage - Variant Loading', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading state initially', () => {
    vi.mocked(loadVariant).mockImplementation(() => new Promise(() => {})); // Never resolves

    renderWithRouter('/test/role/resume');

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should redirect to home if variant not found', async () => {
    vi.mocked(loadVariant).mockResolvedValue(null);

    renderWithRouter('/nonexistent/role/resume');

    await waitFor(() => {
      expect(screen.getByText('Home')).toBeInTheDocument();
    });
  });

  it('should load variant based on URL params', async () => {
    const mockVariant = createMockVariant();
    vi.mocked(loadVariant).mockResolvedValue(mockVariant);
    vi.mocked(mergeProfile).mockReturnValue(createMergedProfile(mockVariant));
    vi.mocked(getExperienceWithOverrides).mockReturnValue(createMergedExperience());

    renderWithRouter('/test/role/resume');

    await waitFor(() => {
      expect(loadVariant).toHaveBeenCalledWith('test-role');
    });
  });
});

describe('VariantResumePage - Content Overrides', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render variant tagline instead of base', async () => {
    const mockVariant = createMockVariant();
    vi.mocked(loadVariant).mockResolvedValue(mockVariant);
    vi.mocked(mergeProfile).mockReturnValue(createMergedProfile(mockVariant));
    vi.mocked(getExperienceWithOverrides).mockReturnValue(createMergedExperience());

    renderWithRouter('/test/role/resume');

    await waitFor(() => {
      // Variant tagline should be present
      expect(screen.getByText(/Variant tagline for Test Company/i)).toBeInTheDocument();
    });
  });

  it('should render variant stats', async () => {
    const mockVariant = createMockVariant();
    vi.mocked(loadVariant).mockResolvedValue(mockVariant);
    vi.mocked(mergeProfile).mockReturnValue(createMergedProfile(mockVariant));
    vi.mocked(getExperienceWithOverrides).mockReturnValue(createMergedExperience());

    renderWithRouter('/test/role/resume');

    await waitFor(() => {
      expect(screen.getByText(/10\+/)).toBeInTheDocument();
      expect(screen.getByText(/Variant Years/)).toBeInTheDocument();
    });
  });

  it('should render variant experience highlights', async () => {
    const mockVariant = createMockVariant();
    vi.mocked(loadVariant).mockResolvedValue(mockVariant);
    vi.mocked(mergeProfile).mockReturnValue(createMergedProfile(mockVariant));
    vi.mocked(getExperienceWithOverrides).mockReturnValue(createMergedExperience());

    renderWithRouter('/test/role/resume');

    await waitFor(() => {
      expect(screen.getByText(/Variant highlight 1/)).toBeInTheDocument();
    });
  });
});

describe('VariantResumePage - ATS Formatting', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should strip accent markers from variant bio', async () => {
    const mockVariant = createMockVariant({
      overrides: {
        about: {
          tagline: 'Test tagline',
          bio: ['This is {{accent}}important{{/accent}} text'],
          stats: [{ value: '10+', label: 'Years' }]
        }
      }
    });

    const mergedProfile = createMergedProfile(mockVariant);
    mergedProfile.about.bio = ['This is {{accent}}important{{/accent}} text'];

    vi.mocked(loadVariant).mockResolvedValue(mockVariant);
    vi.mocked(mergeProfile).mockReturnValue(mergedProfile);
    vi.mocked(getExperienceWithOverrides).mockReturnValue(createMergedExperience());

    renderWithRouter('/test/role/resume');

    await waitFor(() => {
      // The rendered text should not contain accent markers
      const pageText = document.body.textContent || '';
      expect(pageText).not.toContain('{{accent}}');
      expect(pageText).not.toContain('{{/accent}}');
    });
  });

  it('should strip markdown links from highlights', async () => {
    const mockVariant = createMockVariant();
    const experience = createMergedExperience();
    experience.jobs[0].highlights = ['[Link Text](http://example.com) is here'];

    vi.mocked(loadVariant).mockResolvedValue(mockVariant);
    vi.mocked(mergeProfile).mockReturnValue(createMergedProfile(mockVariant));
    vi.mocked(getExperienceWithOverrides).mockReturnValue(experience);

    renderWithRouter('/test/role/resume');

    await waitFor(() => {
      // Should contain the link text without markdown
      expect(screen.getByText(/Link Text is here/)).toBeInTheDocument();
      // Should not contain markdown syntax
      const pageText = document.body.textContent || '';
      expect(pageText).not.toContain('[Link Text]');
      expect(pageText).not.toContain('](');
    });
  });
});

describe('VariantResumePage - Structure', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should have resume-page container class', async () => {
    const mockVariant = createMockVariant();
    vi.mocked(loadVariant).mockResolvedValue(mockVariant);
    vi.mocked(mergeProfile).mockReturnValue(createMergedProfile(mockVariant));
    vi.mocked(getExperienceWithOverrides).mockReturnValue(createMergedExperience());

    const { container } = renderWithRouter('/test/role/resume');

    await waitFor(() => {
      expect(container.querySelector('.resume-page')).toBeInTheDocument();
    });
  });

  it('should render all major sections', async () => {
    const mockVariant = createMockVariant();
    vi.mocked(loadVariant).mockResolvedValue(mockVariant);
    vi.mocked(mergeProfile).mockReturnValue(createMergedProfile(mockVariant));
    vi.mocked(getExperienceWithOverrides).mockReturnValue(createMergedExperience());

    renderWithRouter('/test/role/resume');

    await waitFor(() => {
      expect(screen.getByText(/Impact.*Summary.*Expertise/i)).toBeInTheDocument();
      expect(screen.getByText(/Professional Experience/i)).toBeInTheDocument();
      expect(screen.getByText(/Skills/i)).toBeInTheDocument();
    });
  });
});

describe('VariantResumePage - URL Slug Generation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should generate correct slug from company-role URL', async () => {
    const mockVariant = createMockVariant();
    vi.mocked(loadVariant).mockResolvedValue(mockVariant);
    vi.mocked(mergeProfile).mockReturnValue(createMergedProfile(mockVariant));
    vi.mocked(getExperienceWithOverrides).mockReturnValue(createMergedExperience());

    renderWithRouter('/cursor/tam/resume');

    await waitFor(() => {
      expect(loadVariant).toHaveBeenCalledWith('cursor-tam');
    });
  });

  it('should handle multi-word role slugs', async () => {
    const mockVariant = createMockVariant();
    vi.mocked(loadVariant).mockResolvedValue(mockVariant);
    vi.mocked(mergeProfile).mockReturnValue(createMergedProfile(mockVariant));
    vi.mocked(getExperienceWithOverrides).mockReturnValue(createMergedExperience());

    renderWithRouter('/microsoft/senior-pm/resume');

    await waitFor(() => {
      expect(loadVariant).toHaveBeenCalledWith('microsoft-senior-pm');
    });
  });
});
