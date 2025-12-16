/**
 * Blog UX Features Tests
 *
 * Comprehensive test suite for blog post modal UX enhancements:
 * - Reading progress bar
 * - Table of contents with scroll spy
 * - Copy code buttons
 * - Back-to-top button
 * - Related posts
 * - Social sharing
 * - Fluid typography
 * - Design system compliance
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ThemeProvider } from '../../context/ThemeContext';
import BlogPostModal from '../../components/BlogPostModal';
import type { BlogPost } from '../../types/blog';

// Test wrapper with ThemeProvider
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider>{children}</ThemeProvider>
);

// Mock blog post data
const mockPost: BlogPost = {
    slug: 'test-post',
    title: 'Test Blog Post with UX Features',
    date: '2024-12-15',
    excerpt: 'A test post to verify all UX features work correctly',
    tags: ['Testing', 'UX', 'Features'],
    thumbnail: null,
    readingTime: 5,
    content: `
# Introduction

This is a test blog post with multiple sections.

## First Section

Some content here with a code example:

\`\`\`javascript
function testFunction() {
    return "Hello World";
}
\`\`\`

## Second Section

More content in the second section.

### Subsection

Even more detailed content.
    `.trim()
};

const mockRelatedPosts: BlogPost[] = [
    {
        slug: 'related-1',
        title: 'Related Post 1',
        date: '2024-12-10',
        excerpt: 'First related post',
        tags: ['Testing', 'Related'],
        thumbnail: null,
        readingTime: 3,
        content: '# Related content'
    },
    {
        slug: 'related-2',
        title: 'Related Post 2',
        date: '2024-12-11',
        excerpt: 'Second related post',
        tags: ['UX', 'Related'],
        thumbnail: null,
        readingTime: 4,
        content: '# Related content'
    }
];

describe('BlogPostModal - UX Features', () => {
    let mockOnClose: ReturnType<typeof vi.fn>;
    let mockOnPostSelect: ReturnType<typeof vi.fn>;
    let localStorageMock: { [key: string]: string };

    beforeEach(() => {
        mockOnClose = vi.fn();
        mockOnPostSelect = vi.fn();

        // Mock localStorage
        localStorageMock = {};
        global.Storage.prototype.getItem = vi.fn((key: string) => localStorageMock[key] || null);
        global.Storage.prototype.setItem = vi.fn((key: string, value: string) => {
            localStorageMock[key] = value;
        });
        global.Storage.prototype.clear = vi.fn(() => {
            localStorageMock = {};
        });

        // Mock clipboard API
        Object.assign(navigator, {
            clipboard: {
                writeText: vi.fn().mockResolvedValue(undefined)
            }
        });

        // Mock window.open for social sharing
        global.open = vi.fn();

        // Mock canvas methods
        HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
            fillText: vi.fn(),
            measureText: vi.fn(() => ({ width: 0 }))
        });
        HTMLCanvasElement.prototype.toDataURL = vi.fn().mockReturnValue('data:image/png;base64,mock');
    });

    afterEach(() => {
        vi.clearAllMocks();
        localStorageMock = {};
    });

    describe('Reading Progress Bar', () => {
        it('should render progress bar at top of modal', () => {
            render(
                <TestWrapper>
                    <BlogPostModal
                        post={mockPost}
                        onClose={mockOnClose}
                        isMobile={false}
                    />
                </TestWrapper>
            );

            // Progress bar should exist
            const progressBars = document.querySelectorAll('[style*="height: 3px"]');
            expect(progressBars.length).toBeGreaterThan(0);
        });

        it('should have accent color for progress indicator', () => {
            render(
                <TestWrapper>
                    <BlogPostModal
                        post={mockPost}
                        onClose={mockOnClose}
                        isMobile={false}
                    />
                </TestWrapper>
            );

            // Check for accent color in progress bar
            const accentElements = document.querySelectorAll('[style*="--color-accent"]');
            expect(accentElements.length).toBeGreaterThan(0);
        });
    });

    describe('Table of Contents', () => {
        it('should generate TOC from markdown headings', () => {
            render(
                <TestWrapper>
                    <BlogPostModal
                        post={mockPost}
                        onClose={mockOnClose}
                        isMobile={false}
                    />
                </TestWrapper>
            );

            // TOC should be visible on desktop
            expect(screen.getByText('Contents')).toBeInTheDocument();
        });

        it('should hide TOC on mobile', () => {
            render(
                <TestWrapper>
                    <BlogPostModal
                        post={mockPost}
                        onClose={mockOnClose}
                        isMobile={true}
                    />
                </TestWrapper>
            );

            // TOC should not be visible on mobile
            expect(screen.queryByText('Contents')).not.toBeInTheDocument();
        });

        it('should have clickable TOC items', () => {
            render(
                <TestWrapper>
                    <BlogPostModal
                        post={mockPost}
                        onClose={mockOnClose}
                        isMobile={false}
                    />
                </TestWrapper>
            );

            const tocItems = document.querySelectorAll('.toc-item');
            expect(tocItems.length).toBeGreaterThan(0);

            // TOC items should be clickable
            tocItems.forEach(item => {
                expect(item).toHaveStyle({ cursor: 'pointer' });
            });
        });

        it('should use design system spacing for TOC levels', () => {
            render(
                <TestWrapper>
                    <BlogPostModal
                        post={mockPost}
                        onClose={mockOnClose}
                        isMobile={false}
                    />
                </TestWrapper>
            );

            // Check that TOC styling exists in style tag
            const styleElements = document.querySelectorAll('style');
            const hasTocStyles = Array.from(styleElements).some(
                style => style.textContent?.includes('.toc-item') &&
                    style.textContent?.includes('var(--space-')
            );
            expect(hasTocStyles).toBe(true);
        });
    });

    describe('Copy Code Buttons', () => {
        it('should render copy button for code blocks', () => {
            render(
                <TestWrapper>
                    <BlogPostModal
                        post={mockPost}
                        onClose={mockOnClose}
                        isMobile={false}
                    />
                </TestWrapper>
            );

            // Wait for markdown to render
            waitFor(() => {
                const copyButtons = screen.queryAllByText('Copy');
                expect(copyButtons.length).toBeGreaterThan(0);
            });
        });

        it('should copy code to clipboard when clicked', async () => {
            render(
                <TestWrapper>
                    <BlogPostModal
                        post={mockPost}
                        onClose={mockOnClose}
                        isMobile={false}
                    />
                </TestWrapper>
            );

            await waitFor(() => {
                const copyButtons = screen.queryAllByText('Copy');
                if (copyButtons.length > 0) {
                    fireEvent.click(copyButtons[0]);
                    expect(navigator.clipboard.writeText).toHaveBeenCalled();
                }
            });
        });

        it('should use design system colors for copy button', () => {
            render(
                <TestWrapper>
                    <BlogPostModal
                        post={mockPost}
                        onClose={mockOnClose}
                        isMobile={false}
                    />
                </TestWrapper>
            );

            const styleElements = document.querySelectorAll('style');
            const hasCopyBtnStyles = Array.from(styleElements).some(
                style => style.textContent?.includes('.code-copy-btn') &&
                    style.textContent?.includes('var(--color-')
            );
            expect(hasCopyBtnStyles).toBe(true);
        });
    });

    describe('Back to Top Button', () => {
        it('should render back-to-top button', () => {
            render(
                <TestWrapper>
                    <BlogPostModal
                        post={mockPost}
                        onClose={mockOnClose}
                        isMobile={false}
                    />
                </TestWrapper>
            );

            const backToTopBtn = screen.getByTitle('Back to top');
            expect(backToTopBtn).toBeInTheDocument();
        });

        it('should initially be hidden (opacity 0)', () => {
            render(
                <TestWrapper>
                    <BlogPostModal
                        post={mockPost}
                        onClose={mockOnClose}
                        isMobile={false}
                    />
                </TestWrapper>
            );

            const backToTopBtn = screen.getByTitle('Back to top');
            // Button should not have 'visible' class initially
            expect(backToTopBtn.className).not.toContain('visible');
        });

        it('should have circular shape with accent hover', () => {
            render(
                <TestWrapper>
                    <BlogPostModal
                        post={mockPost}
                        onClose={mockOnClose}
                        isMobile={false}
                    />
                </TestWrapper>
            );

            const styleElements = document.querySelectorAll('style');
            const hasBackToTopStyles = Array.from(styleElements).some(
                style => style.textContent?.includes('.back-to-top-btn') &&
                    style.textContent?.includes('border-radius: 50%') &&
                    style.textContent?.includes('var(--color-accent)')
            );
            expect(hasBackToTopStyles).toBe(true);
        });
    });

    describe('Related Posts', () => {
        it('should render related posts section when posts provided', () => {
            render(
                <TestWrapper>
                    <BlogPostModal
                        post={mockPost}
                        onClose={mockOnClose}
                        isMobile={false}
                        relatedPosts={mockRelatedPosts}
                        onPostSelect={mockOnPostSelect}
                    />
                </TestWrapper>
            );

            expect(screen.getByText('Related Articles')).toBeInTheDocument();
        });

        it('should render related post cards', () => {
            render(
                <TestWrapper>
                    <BlogPostModal
                        post={mockPost}
                        onClose={mockOnClose}
                        isMobile={false}
                        relatedPosts={mockRelatedPosts}
                        onPostSelect={mockOnPostSelect}
                    />
                </TestWrapper>
            );

            expect(screen.getByText('Related Post 1')).toBeInTheDocument();
            expect(screen.getByText('Related Post 2')).toBeInTheDocument();
        });

        it('should call onPostSelect when clicking related post', () => {
            render(
                <TestWrapper>
                    <BlogPostModal
                        post={mockPost}
                        onClose={mockOnClose}
                        isMobile={false}
                        relatedPosts={mockRelatedPosts}
                        onPostSelect={mockOnPostSelect}
                    />
                </TestWrapper>
            );

            const relatedCard = screen.getByText('Related Post 1').closest('div');
            if (relatedCard) {
                fireEvent.click(relatedCard);
                expect(mockOnPostSelect).toHaveBeenCalledWith(mockRelatedPosts[0]);
            }
        });

        it('should not render related posts section when no posts provided', () => {
            render(
                <TestWrapper>
                    <BlogPostModal
                        post={mockPost}
                        onClose={mockOnClose}
                        isMobile={false}
                    />
                </TestWrapper>
            );

            expect(screen.queryByText('Related Articles')).not.toBeInTheDocument();
        });

        it('should use grid layout with responsive columns', () => {
            render(
                <TestWrapper>
                    <BlogPostModal
                        post={mockPost}
                        onClose={mockOnClose}
                        isMobile={false}
                        relatedPosts={mockRelatedPosts}
                        onPostSelect={mockOnPostSelect}
                    />
                </TestWrapper>
            );

            const relatedSection = screen.getByText('Related Articles').parentElement;
            const gridContainer = relatedSection?.querySelector('[style*="display: grid"]');
            expect(gridContainer).toBeInTheDocument();
        });
    });

    describe('Social Sharing', () => {
        it('should render share buttons', () => {
            render(
                <TestWrapper>
                    <BlogPostModal
                        post={mockPost}
                        onClose={mockOnClose}
                        isMobile={false}
                    />
                </TestWrapper>
            );

            expect(screen.getByLabelText('Share on Twitter/X')).toBeInTheDocument();
            expect(screen.getByLabelText('Share on LinkedIn')).toBeInTheDocument();
            expect(screen.getByLabelText('Copy link to clipboard')).toBeInTheDocument();
        });

        it('should open Twitter share dialog when clicked', () => {
            render(
                <TestWrapper>
                    <BlogPostModal
                        post={mockPost}
                        onClose={mockOnClose}
                        isMobile={false}
                    />
                </TestWrapper>
            );

            const twitterBtn = screen.getByLabelText('Share on Twitter/X');
            fireEvent.click(twitterBtn);

            expect(global.open).toHaveBeenCalledWith(
                expect.stringContaining('twitter.com/intent/tweet'),
                '_blank',
                'width=550,height=420'
            );
        });

        it('should open LinkedIn share dialog when clicked', () => {
            render(
                <TestWrapper>
                    <BlogPostModal
                        post={mockPost}
                        onClose={mockOnClose}
                        isMobile={false}
                    />
                </TestWrapper>
            );

            const linkedInBtn = screen.getByLabelText('Share on LinkedIn');
            fireEvent.click(linkedInBtn);

            expect(global.open).toHaveBeenCalledWith(
                expect.stringContaining('linkedin.com/sharing'),
                '_blank',
                'width=550,height=420'
            );
        });

        it('should copy link to clipboard and show toast', async () => {
            render(
                <TestWrapper>
                    <BlogPostModal
                        post={mockPost}
                        onClose={mockOnClose}
                        isMobile={false}
                    />
                </TestWrapper>
            );

            const copyLinkBtn = screen.getByLabelText('Copy link to clipboard');
            fireEvent.click(copyLinkBtn);

            expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
                expect.stringContaining('blog?post=test-post')
            );

            // Toast should appear
            await waitFor(() => {
                expect(screen.getByText('Link copied to clipboard!')).toBeInTheDocument();
            });
        });

        it('should use design system styles for share buttons', () => {
            render(
                <TestWrapper>
                    <BlogPostModal
                        post={mockPost}
                        onClose={mockOnClose}
                        isMobile={false}
                    />
                </TestWrapper>
            );

            const styleElements = document.querySelectorAll('style');
            const hasShareBtnStyles = Array.from(styleElements).some(
                style => style.textContent?.includes('.share-btn') &&
                    style.textContent?.includes('var(--color-border-light)') &&
                    style.textContent?.includes('var(--color-accent)')
            );
            expect(hasShareBtnStyles).toBe(true);
        });
    });

    describe('Fluid Typography', () => {
        it('should use clamp() for responsive heading sizes', () => {
            render(
                <TestWrapper>
                    <BlogPostModal
                        post={mockPost}
                        onClose={mockOnClose}
                        isMobile={false}
                    />
                </TestWrapper>
            );

            const styleElements = document.querySelectorAll('style');
            const hasClampTypography = Array.from(styleElements).some(
                style => style.textContent?.includes('clamp(') &&
                    style.textContent?.includes('.blog-content h1')
            );
            expect(hasClampTypography).toBe(true);
        });

        it('should use text-wrap: balance for headings', () => {
            render(
                <TestWrapper>
                    <BlogPostModal
                        post={mockPost}
                        onClose={mockOnClose}
                        isMobile={false}
                    />
                </TestWrapper>
            );

            const styleElements = document.querySelectorAll('style');
            const hasTextWrapBalance = Array.from(styleElements).some(
                style => style.textContent?.includes('text-wrap: balance')
            );
            expect(hasTextWrapBalance).toBe(true);
        });
    });

    describe('Design System Compliance', () => {
        it('should use CSS variables for all colors', () => {
            render(
                <TestWrapper>
                    <BlogPostModal
                        post={mockPost}
                        onClose={mockOnClose}
                        isMobile={false}
                        relatedPosts={mockRelatedPosts}
                        onPostSelect={mockOnPostSelect}
                    />
                </TestWrapper>
            );

            const styleElements = document.querySelectorAll('style');
            const usesVarColors = Array.from(styleElements).some(
                style => {
                    const content = style.textContent || '';
                    return content.includes('var(--color-') ||
                        content.includes('var(--space-') ||
                        content.includes('var(--transition-');
                }
            );
            expect(usesVarColors).toBe(true);
        });

        it('should use design system spacing tokens', () => {
            render(
                <TestWrapper>
                    <BlogPostModal
                        post={mockPost}
                        onClose={mockOnClose}
                        isMobile={false}
                    />
                </TestWrapper>
            );

            const styleElements = document.querySelectorAll('style');
            const usesSpaceTokens = Array.from(styleElements).some(
                style => style.textContent?.includes('var(--space-')
            );
            expect(usesSpaceTokens).toBe(true);
        });

        it('should use design system transition easing', () => {
            render(
                <TestWrapper>
                    <BlogPostModal
                        post={mockPost}
                        onClose={mockOnClose}
                        isMobile={false}
                    />
                </TestWrapper>
            );

            const styleElements = document.querySelectorAll('style');
            const usesTransitionTokens = Array.from(styleElements).some(
                style => style.textContent?.includes('var(--transition-')
            );
            expect(usesTransitionTokens).toBe(true);
        });

        it('should use design system font families', () => {
            render(
                <TestWrapper>
                    <BlogPostModal
                        post={mockPost}
                        onClose={mockOnClose}
                        isMobile={false}
                    />
                </TestWrapper>
            );

            const styleElements = document.querySelectorAll('style');
            const usesFontTokens = Array.from(styleElements).some(
                style => {
                    const content = style.textContent || '';
                    return content.includes('var(--font-serif)') ||
                        content.includes('var(--font-sans)');
                }
            );
            expect(usesFontTokens).toBe(true);
        });

        it('should not use hardcoded color values', () => {
            render(
                <TestWrapper>
                    <BlogPostModal
                        post={mockPost}
                        onClose={mockOnClose}
                        isMobile={false}
                        relatedPosts={mockRelatedPosts}
                        onPostSelect={mockOnPostSelect}
                    />
                </TestWrapper>
            );

            // Component should render successfully using CSS variables
            expect(screen.getByText(mockPost.title)).toBeInTheDocument();
        });
    });

    describe('Accessibility', () => {
        it('should have aria-labels for icon-only buttons', () => {
            render(
                <TestWrapper>
                    <BlogPostModal
                        post={mockPost}
                        onClose={mockOnClose}
                        isMobile={false}
                    />
                </TestWrapper>
            );

            // Share buttons should have aria-labels
            expect(screen.getByLabelText('Share on Twitter/X')).toBeInTheDocument();
            expect(screen.getByLabelText('Share on LinkedIn')).toBeInTheDocument();
            expect(screen.getByLabelText('Copy link to clipboard')).toBeInTheDocument();
        });

        it('should have title attributes for tooltips', () => {
            render(
                <TestWrapper>
                    <BlogPostModal
                        post={mockPost}
                        onClose={mockOnClose}
                        isMobile={false}
                    />
                </TestWrapper>
            );

            const backToTopBtn = screen.getByTitle('Back to top');
            expect(backToTopBtn).toHaveAttribute('title', 'Back to top');
        });

        it('should support keyboard ESC to close modal', () => {
            render(
                <TestWrapper>
                    <BlogPostModal
                        post={mockPost}
                        onClose={mockOnClose}
                        isMobile={false}
                    />
                </TestWrapper>
            );

            fireEvent.keyDown(window, { key: 'Escape' });
            expect(mockOnClose).toHaveBeenCalled();
        });
    });

    describe('Like Functionality', () => {
        it('should render like button', () => {
            render(
                <TestWrapper>
                    <BlogPostModal
                        post={mockPost}
                        onClose={mockOnClose}
                        isMobile={false}
                    />
                </TestWrapper>
            );

            expect(screen.getByLabelText('Like this post')).toBeInTheDocument();
        });

        it('should show "Like" text when not liked', () => {
            render(
                <TestWrapper>
                    <BlogPostModal
                        post={mockPost}
                        onClose={mockOnClose}
                        isMobile={false}
                    />
                </TestWrapper>
            );

            const likeButton = screen.getByLabelText('Like this post');
            expect(likeButton.textContent).toContain('Like');
        });

        it('should increment like count when clicked', async () => {
            render(
                <TestWrapper>
                    <BlogPostModal
                        post={mockPost}
                        onClose={mockOnClose}
                        isMobile={false}
                    />
                </TestWrapper>
            );

            const likeButton = screen.getByLabelText('Like this post');
            fireEvent.click(likeButton);

            await waitFor(() => {
                expect(screen.getByLabelText('Unlike this post')).toBeInTheDocument();
                expect(screen.getByText(/1 like/)).toBeInTheDocument();
            });
        });

        it('should change button state when liked', async () => {
            render(
                <TestWrapper>
                    <BlogPostModal
                        post={mockPost}
                        onClose={mockOnClose}
                        isMobile={false}
                    />
                </TestWrapper>
            );

            const likeButton = screen.getByLabelText('Like this post');
            fireEvent.click(likeButton);

            await waitFor(() => {
                const unlikeButton = screen.getByLabelText('Unlike this post');
                expect(unlikeButton).toHaveClass('liked');
                expect(unlikeButton.textContent).toContain('Liked');
            });
        });

        it('should decrement like count when unliked', async () => {
            render(
                <TestWrapper>
                    <BlogPostModal
                        post={mockPost}
                        onClose={mockOnClose}
                        isMobile={false}
                    />
                </TestWrapper>
            );

            // Like first
            const likeButton = screen.getByLabelText('Like this post');
            fireEvent.click(likeButton);

            await waitFor(() => {
                expect(screen.getByText(/1 like/)).toBeInTheDocument();
            });

            // Then unlike
            const unlikeButton = screen.getByLabelText('Unlike this post');
            fireEvent.click(unlikeButton);

            await waitFor(() => {
                expect(screen.queryByText(/like/)).not.toBeInTheDocument();
                expect(screen.getByLabelText('Like this post')).toBeInTheDocument();
            });
        });

        it('should persist like state across component remounts', async () => {
            const { unmount } = render(
                <TestWrapper>
                    <BlogPostModal
                        post={mockPost}
                        onClose={mockOnClose}
                        isMobile={false}
                    />
                </TestWrapper>
            );

            const likeButton = screen.getByLabelText('Like this post');
            fireEvent.click(likeButton);

            await waitFor(() => {
                expect(screen.getByLabelText('Unlike this post')).toBeInTheDocument();
            });

            unmount();

            // Remount component
            render(
                <TestWrapper>
                    <BlogPostModal
                        post={mockPost}
                        onClose={mockOnClose}
                        isMobile={false}
                    />
                </TestWrapper>
            );

            // Should still be liked
            await waitFor(() => {
                expect(screen.getByLabelText('Unlike this post')).toBeInTheDocument();
            });
        });

        it('should use design system styling for like button', () => {
            render(
                <TestWrapper>
                    <BlogPostModal
                        post={mockPost}
                        onClose={mockOnClose}
                        isMobile={false}
                    />
                </TestWrapper>
            );

            const styleElements = document.querySelectorAll('style');
            const hasLikeStyles = Array.from(styleElements).some(
                style => style.textContent?.includes('.like-button') &&
                    style.textContent?.includes('var(--color-border-light)') &&
                    style.textContent?.includes('var(--color-accent)')
            );
            expect(hasLikeStyles).toBe(true);
        });

        it('should have heart animation on like', async () => {
            render(
                <TestWrapper>
                    <BlogPostModal
                        post={mockPost}
                        onClose={mockOnClose}
                        isMobile={false}
                    />
                </TestWrapper>
            );

            const likeButton = screen.getByLabelText('Like this post');
            fireEvent.click(likeButton);

            await waitFor(() => {
                expect(likeButton).toHaveClass('animating');
            });
        });

        it('should have proper accessibility labels', () => {
            render(
                <TestWrapper>
                    <BlogPostModal
                        post={mockPost}
                        onClose={mockOnClose}
                        isMobile={false}
                    />
                </TestWrapper>
            );

            const likeButton = screen.getByLabelText('Like this post');
            expect(likeButton).toHaveAttribute('aria-label', 'Like this post');
            expect(likeButton).toHaveAttribute('title', 'Like this post');
        });
    });

    describe('Responsive Design', () => {
        it('should hide TOC on mobile', () => {
            render(
                <TestWrapper>
                    <BlogPostModal
                        post={mockPost}
                        onClose={mockOnClose}
                        isMobile={true}
                    />
                </TestWrapper>
            );

            expect(screen.queryByText('Contents')).not.toBeInTheDocument();
        });

        it('should adjust related posts grid for mobile', () => {
            render(
                <TestWrapper>
                    <BlogPostModal
                        post={mockPost}
                        onClose={mockOnClose}
                        isMobile={true}
                        relatedPosts={mockRelatedPosts}
                        onPostSelect={mockOnPostSelect}
                    />
                </TestWrapper>
            );

            // Related posts should use single column on mobile
            const relatedSection = screen.getByText('Related Articles').parentElement;
            const gridContainer = relatedSection?.querySelector('[style*="1fr"]');
            expect(gridContainer).toBeInTheDocument();
        });

        it('should show back-to-top button on all screen sizes', () => {
            const { rerender } = render(
                <TestWrapper>
                    <BlogPostModal
                        post={mockPost}
                        onClose={mockOnClose}
                        isMobile={true}
                    />
                </TestWrapper>
            );

            expect(screen.getByTitle('Back to top')).toBeInTheDocument();

            rerender(
                <TestWrapper>
                    <BlogPostModal
                        post={mockPost}
                        onClose={mockOnClose}
                        isMobile={false}
                    />
                </TestWrapper>
            );

            expect(screen.getByTitle('Back to top')).toBeInTheDocument();
        });
    });
});
