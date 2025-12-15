/**
 * Case Study Tests
 * 
 * Tests for the markdown-based case study system:
 * - Content loading and parsing
 * - Schema validation
 * - Component rendering
 */

import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '../../context/ThemeContext';
import { caseStudies, getCaseStudyBySlug, getCaseStudyById } from '../../lib/content';
import CaseStudyHero from '../../components/case-study/CaseStudyHero';
import CaseStudyContent from '../../components/case-study/CaseStudyContent';
import CaseStudyFooter from '../../components/case-study/CaseStudyFooter';
import CaseStudyLinks from '../../components/case-study/CaseStudyLinks';

// Wrapper for components that need ThemeProvider
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider>{children}</ThemeProvider>
);

describe('Case Study Content Loading', () => {
    it('should load all 4 case studies', () => {
        expect(caseStudies).toHaveLength(4);
    });

    it('should sort case studies by id', () => {
        const ids = caseStudies.map(cs => cs.id);
        expect(ids).toEqual([1, 2, 3, 4]);
    });

    it('should have required fields in each case study', () => {
        caseStudies.forEach(cs => {
            // Identification
            expect(cs.id).toBeDefined();
            expect(cs.slug).toBeDefined();
            expect(cs.title).toBeDefined();
            expect(cs.company).toBeDefined();
            expect(cs.year).toBeDefined();
            expect(cs.tags).toBeDefined();
            expect(Array.isArray(cs.tags)).toBe(true);

            // Context
            expect(cs.duration).toBeDefined();
            expect(cs.role).toBeDefined();

            // Hook
            expect(cs.hook).toBeDefined();
            expect(cs.hook.headline).toBeDefined();
            expect(cs.hook.impactMetric).toBeDefined();
            expect(cs.hook.impactMetric.value).toBeDefined();
            expect(cs.hook.impactMetric.label).toBeDefined();

            // CTA
            expect(cs.cta).toBeDefined();
            expect(cs.cta.headline).toBeDefined();
            expect(cs.cta.action).toBeDefined();
            expect(cs.cta.linkText).toBeDefined();

            // Markdown content
            expect(cs.content).toBeDefined();
            expect(cs.content.length).toBeGreaterThan(100);
        });
    });

    it('should parse markdown content correctly', () => {
        const ethStaking = getCaseStudyById(1);
        expect(ethStaking).toBeDefined();
        expect(ethStaking?.content).toContain('## The Challenge');
        expect(ethStaking?.content).toContain('## The Approach');
    });
});

describe('Case Study Helper Functions', () => {
    it('getCaseStudyBySlug should return correct case study', () => {
        const cs = getCaseStudyBySlug('institutional-eth-staking');
        expect(cs).toBeDefined();
        expect(cs?.title).toBe('Institutional ETH Staking');
    });

    it('getCaseStudyBySlug should return undefined for non-existent slug', () => {
        const cs = getCaseStudyBySlug('non-existent-slug');
        expect(cs).toBeUndefined();
    });

    it('getCaseStudyById should return correct case study', () => {
        const cs = getCaseStudyById(2);
        expect(cs).toBeDefined();
        expect(cs?.title).toBe('Protocol Integration Framework');
    });

    it('getCaseStudyById should return undefined for non-existent id', () => {
        const cs = getCaseStudyById(999);
        expect(cs).toBeUndefined();
    });
});

describe('Case Study Schema Validation', () => {
    it('should have valid CTA actions', () => {
        const validActions = ['contact', 'calendly', 'linkedin'];
        caseStudies.forEach(cs => {
            expect(validActions).toContain(cs.cta.action);
        });
    });

    it('should have thumbnail paths or null', () => {
        caseStudies.forEach(cs => {
            if (cs.hook.thumbnail !== null) {
                expect(cs.hook.thumbnail).toMatch(/^\/images\//);
            }
        });
    });

    it('should have at least one tag per case study', () => {
        caseStudies.forEach(cs => {
            expect(cs.tags.length).toBeGreaterThan(0);
        });
    });
});

describe('CaseStudyHero Component', () => {
    const mockCaseStudy = caseStudies[0];

    it('should render without crashing', () => {
        render(
            <TestWrapper>
                <CaseStudyHero caseStudy={mockCaseStudy} isMobile={false} />
            </TestWrapper>
        );

        expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    it('should display case study title', () => {
        render(
            <TestWrapper>
                <CaseStudyHero caseStudy={mockCaseStudy} isMobile={false} />
            </TestWrapper>
        );

        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(mockCaseStudy.title);
    });

    it('should display company and year', () => {
        render(
            <TestWrapper>
                <CaseStudyHero caseStudy={mockCaseStudy} isMobile={false} />
            </TestWrapper>
        );

        expect(screen.getByText(mockCaseStudy.company)).toBeInTheDocument();
        expect(screen.getByText(mockCaseStudy.year)).toBeInTheDocument();
    });

    it('should display primary impact metric', () => {
        render(
            <TestWrapper>
                <CaseStudyHero caseStudy={mockCaseStudy} isMobile={false} />
            </TestWrapper>
        );

        expect(screen.getByText(mockCaseStudy.hook.impactMetric.value)).toBeInTheDocument();
        expect(screen.getByText(mockCaseStudy.hook.impactMetric.label)).toBeInTheDocument();
    });

    it('should display duration', () => {
        render(
            <TestWrapper>
                <CaseStudyHero caseStudy={mockCaseStudy} isMobile={false} />
            </TestWrapper>
        );

        expect(screen.getByText(mockCaseStudy.duration)).toBeInTheDocument();
    });

    it('should use CSS variables for styling', () => {
        render(
            <TestWrapper>
                <CaseStudyHero caseStudy={mockCaseStudy} isMobile={false} />
            </TestWrapper>
        );

        const header = document.querySelector('header');
        expect(header?.style.maxWidth).toContain('var(--drawer-content-max-width)');
    });
});

describe('CaseStudyContent Component', () => {
    const mockCaseStudy = caseStudies[0];

    it('should render without crashing', () => {
        render(
            <TestWrapper>
                <CaseStudyContent caseStudy={mockCaseStudy} isMobile={false} />
            </TestWrapper>
        );

        expect(document.querySelector('article')).toBeInTheDocument();
    });

    it('should render markdown content', () => {
        render(
            <TestWrapper>
                <CaseStudyContent caseStudy={mockCaseStudy} isMobile={false} />
            </TestWrapper>
        );

        // Check that markdown headings are rendered as HTML
        const h2Elements = document.querySelectorAll('.case-study-content h2');
        expect(h2Elements.length).toBeGreaterThan(0);
    });

    it('should render markdown lists', () => {
        render(
            <TestWrapper>
                <CaseStudyContent caseStudy={mockCaseStudy} isMobile={false} />
            </TestWrapper>
        );

        // Case studies contain lists
        const lists = document.querySelectorAll('.case-study-content ul, .case-study-content ol');
        expect(lists.length).toBeGreaterThan(0);
    });

    it('should use CSS variables for max-width', () => {
        render(
            <TestWrapper>
                <CaseStudyContent caseStudy={mockCaseStudy} isMobile={false} />
            </TestWrapper>
        );

        const article = document.querySelector('article');
        expect(article?.style.maxWidth).toContain('var(--drawer-content-max-width)');
    });

    it('should include markdown styles', () => {
        render(
            <TestWrapper>
                <CaseStudyContent caseStudy={mockCaseStudy} isMobile={false} />
            </TestWrapper>
        );

        // Check that style tag with markdown styles is present
        const styleElements = document.querySelectorAll('style');
        const hasMarkdownStyles = Array.from(styleElements).some(
            style => style.textContent?.includes('.case-study-content')
        );
        expect(hasMarkdownStyles).toBe(true);
    });
});

describe('CaseStudyFooter Component', () => {
    const mockCaseStudy = caseStudies[0];
    const mockPrevStudy = null;
    const mockNextStudy = caseStudies[1];
    const mockOnNavigate = vi.fn();

    beforeEach(() => {
        mockOnNavigate.mockClear();
    });

    it('should render without crashing', () => {
        render(
            <TestWrapper>
                <CaseStudyFooter 
                    caseStudy={mockCaseStudy}
                    prevStudy={mockPrevStudy}
                    nextStudy={mockNextStudy}
                    onNavigate={mockOnNavigate}
                    isMobile={false}
                />
            </TestWrapper>
        );

        expect(document.querySelector('footer')).toBeInTheDocument();
    });

    it('should display CTA headline', () => {
        render(
            <TestWrapper>
                <CaseStudyFooter 
                    caseStudy={mockCaseStudy}
                    prevStudy={mockPrevStudy}
                    nextStudy={mockNextStudy}
                    onNavigate={mockOnNavigate}
                    isMobile={false}
                />
            </TestWrapper>
        );

        expect(screen.getByText(mockCaseStudy.cta.headline)).toBeInTheDocument();
    });

    it('should display CTA buttons (Copy Email, Resume, Book Time)', () => {
        render(
            <TestWrapper>
                <CaseStudyFooter 
                    caseStudy={mockCaseStudy}
                    prevStudy={mockPrevStudy}
                    nextStudy={mockNextStudy}
                    onNavigate={mockOnNavigate}
                    isMobile={false}
                />
            </TestWrapper>
        );

        expect(screen.getByText('Copy Email')).toBeInTheDocument();
        expect(screen.getByText('Resume')).toBeInTheDocument();
        expect(screen.getByText('Book Time')).toBeInTheDocument();
    });

    it('should have correct Book Time link', () => {
        render(
            <TestWrapper>
                <CaseStudyFooter 
                    caseStudy={mockCaseStudy}
                    prevStudy={mockPrevStudy}
                    nextStudy={mockNextStudy}
                    onNavigate={mockOnNavigate}
                    isMobile={false}
                />
            </TestWrapper>
        );

        const bookTimeLink = screen.getByText('Book Time').closest('a');
        expect(bookTimeLink).toHaveAttribute('href');
        expect(bookTimeLink?.getAttribute('href')).toContain('calendar.google.com');
    });

    it('should show next study navigation when available', () => {
        render(
            <TestWrapper>
                <CaseStudyFooter 
                    caseStudy={mockCaseStudy}
                    prevStudy={mockPrevStudy}
                    nextStudy={mockNextStudy}
                    onNavigate={mockOnNavigate}
                    isMobile={false}
                />
            </TestWrapper>
        );

        expect(screen.getByText('Next →')).toBeInTheDocument();
        expect(screen.getByText(mockNextStudy.title)).toBeInTheDocument();
    });

    it('should NOT show previous study when null', () => {
        render(
            <TestWrapper>
                <CaseStudyFooter 
                    caseStudy={mockCaseStudy}
                    prevStudy={mockPrevStudy}
                    nextStudy={mockNextStudy}
                    onNavigate={mockOnNavigate}
                    isMobile={false}
                />
            </TestWrapper>
        );

        expect(screen.queryByText('← Previous')).not.toBeInTheDocument();
    });

    it('should NOT have testimonial section (removed)', () => {
        render(
            <TestWrapper>
                <CaseStudyFooter 
                    caseStudy={mockCaseStudy}
                    prevStudy={mockPrevStudy}
                    nextStudy={mockNextStudy}
                    onNavigate={mockOnNavigate}
                    isMobile={false}
                />
            </TestWrapper>
        );

        // Testimonial blockquote should not exist
        expect(document.querySelector('blockquote')).not.toBeInTheDocument();
    });
});

describe('Case Study Content Specific Tests', () => {
    it('ETH Staking case study should have correct data', () => {
        const cs = getCaseStudyById(1);
        expect(cs?.title).toBe('Institutional ETH Staking');
        expect(cs?.company).toBe('Anchorage Digital');
        expect(cs?.hook.impactMetric.value).toBe('Zero');
        expect(cs?.hook.impactMetric.label).toBe('slashing events');
    });

    it('Protocol Integration case study should have correct data', () => {
        const cs = getCaseStudyById(2);
        expect(cs?.title).toBe('Protocol Integration Framework');
        expect(cs?.hook.impactMetric.value).toBe('7+');
    });

    it('Xbox Royalties case study should have correct data', () => {
        const cs = getCaseStudyById(3);
        expect(cs?.title).toBe('Royalties on Ethereum');
        expect(cs?.company).toBe('Microsoft / Xbox');
        expect(cs?.hook.impactMetric.value).toBe('First');
    });

    it('Ankr RPC case study should have correct data', () => {
        const cs = getCaseStudyById(4);
        expect(cs?.title).toBe('RPC Infrastructure & APIs');
        expect(cs?.company).toBe('Ankr');
        expect(cs?.hook.impactMetric.value).toBe('15×');
    });
});

describe('Case Study Links Schema', () => {
    it('should support optional demoUrl, githubUrl, docsUrl fields', () => {
        // Ankr case study has all three
        const ankr = getCaseStudyById(4);
        expect(ankr?.demoUrl).toBeDefined();
        expect(ankr?.githubUrl).toBeDefined();
        expect(ankr?.docsUrl).toBeDefined();
    });

    it('should allow case studies without links', () => {
        // ETH Staking doesn't have external links (confidential)
        const ethStaking = getCaseStudyById(1);
        expect(ethStaking?.demoUrl).toBeUndefined();
        expect(ethStaking?.githubUrl).toBeUndefined();
        expect(ethStaking?.docsUrl).toBeUndefined();
    });

    it('should support media array with type and url', () => {
        const ankr = getCaseStudyById(4);
        expect(ankr?.media).toBeDefined();
        expect(Array.isArray(ankr?.media)).toBe(true);
        expect(ankr?.media?.length).toBeGreaterThan(0);
        
        ankr?.media?.forEach(item => {
            expect(item.type).toBeDefined();
            expect(item.url).toBeDefined();
        });
    });

    it('should have valid media types', () => {
        const validTypes = ['blog', 'twitter', 'linkedin', 'video', 'article', 'slides'];
        caseStudies.forEach(cs => {
            cs.media?.forEach(item => {
                expect(validTypes).toContain(item.type);
            });
        });
    });

    it('media items can have optional labels', () => {
        const ankr = getCaseStudyById(4);
        // At least some media items should have labels
        const hasLabels = ankr?.media?.some(item => item.label !== undefined);
        expect(hasLabels).toBe(true);
    });
});

describe('CaseStudyLinks Component', () => {
    it('should render nothing when no links exist', () => {
        const noLinksCaseStudy = { ...caseStudies[0], demoUrl: undefined, githubUrl: undefined, docsUrl: undefined, media: undefined };
        const { container } = render(
            <TestWrapper>
                <CaseStudyLinks caseStudy={noLinksCaseStudy} />
            </TestWrapper>
        );
        
        expect(container.firstChild).toBeNull();
    });

    it('should render Live button when demoUrl exists', () => {
        const ankr = getCaseStudyById(4)!;
        render(
            <TestWrapper>
                <CaseStudyLinks caseStudy={ankr} />
            </TestWrapper>
        );
        
        expect(screen.getByText('Live')).toBeInTheDocument();
    });

    it('should render Code button when githubUrl exists', () => {
        const ankr = getCaseStudyById(4)!;
        render(
            <TestWrapper>
                <CaseStudyLinks caseStudy={ankr} />
            </TestWrapper>
        );
        
        expect(screen.getByText('Code')).toBeInTheDocument();
    });

    it('should render Docs button when docsUrl exists', () => {
        const ankr = getCaseStudyById(4)!;
        render(
            <TestWrapper>
                <CaseStudyLinks caseStudy={ankr} />
            </TestWrapper>
        );
        
        expect(screen.getByText('Docs')).toBeInTheDocument();
    });

    it('should render media icon buttons with tooltips', () => {
        const ankr = getCaseStudyById(4)!;
        render(
            <TestWrapper>
                <CaseStudyLinks caseStudy={ankr} />
            </TestWrapper>
        );
        
        // Media buttons should have title attributes (tooltips)
        const buttons = document.querySelectorAll('button[title]');
        const mediaButtonCount = Array.from(buttons).filter(btn => 
            btn.getAttribute('title') && !['Live', 'Code', 'Docs'].includes(btn.textContent || '')
        ).length;
        
        expect(mediaButtonCount).toBeGreaterThan(0);
    });

    it('should render links in hero section', () => {
        const ankr = getCaseStudyById(4)!;
        render(
            <TestWrapper>
                <CaseStudyHero caseStudy={ankr} isMobile={false} />
            </TestWrapper>
        );
        
        // Links should be in the hero
        expect(screen.getByText('Live')).toBeInTheDocument();
        expect(screen.getByText('Code')).toBeInTheDocument();
    });

    it('should render links only in hero (not footer for consistency)', () => {
        const ankr = getCaseStudyById(4)!;
        render(
            <TestWrapper>
                <CaseStudyFooter 
                    caseStudy={ankr}
                    prevStudy={caseStudies[2]}
                    nextStudy={null}
                    onNavigate={() => {}}
                    isMobile={false}
                />
            </TestWrapper>
        );
        
        // Footer should NOT have "Explore" section (links are in hero only)
        expect(screen.queryByText('Explore')).not.toBeInTheDocument();
        // CTA buttons should still be present
        expect(screen.getByText('Copy Email')).toBeInTheDocument();
        expect(screen.getByText('Book Time')).toBeInTheDocument();
    });
});
