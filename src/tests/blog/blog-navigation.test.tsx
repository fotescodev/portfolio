/**
 * Blog Post Page Navigation Tests
 *
 * These tests verify that navigation links from blog pages correctly navigate
 * back to the home page and scroll to the appropriate section.
 *
 * With BrowserRouter, links use href="/#section" as fallback anchors,
 * while onClick handlers navigate('/') + setTimeout scroll to element.
 */

import { render, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach, beforeAll } from 'vitest';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from '../../context/ThemeContext';
import { VariantProvider } from '../../context/VariantContext';
import { HelmetProvider } from 'react-helmet-async';
import { profile } from '../../lib/content';
import BlogPostPage from '../../pages/BlogPostPage';
import Portfolio from '../../components/Portfolio';

// Mocks
const scrollIntoViewMock = vi.fn();
Object.defineProperty(window, 'scrollTo', { value: vi.fn(), writable: true });
Object.defineProperty(window, 'pageYOffset', { value: 0, writable: true });
Element.prototype.scrollIntoView = scrollIntoViewMock;

beforeAll(() => {
    global.IntersectionObserver = class IntersectionObserver {
        constructor() { }
        observe() { return null; }
        unobserve() { return null; }
        disconnect() { return null; }
    } as unknown as typeof IntersectionObserver;

    Object.assign(navigator, {
        clipboard: { writeText: vi.fn().mockResolvedValue(undefined) }
    });
});

// Track current route
let currentPath = '';
function LocationSpy() {
    const location = useLocation();
    currentPath = location.pathname;
    return null;
}

// Use an actual blog post slug that exists in content/blog/
const EXISTING_BLOG_SLUG = 'ai-agents-meet-onchain';

const renderBlogPage = () => {
    currentPath = '';
    return render(
        <MemoryRouter initialEntries={[`/blog/${EXISTING_BLOG_SLUG}`]}>
            <HelmetProvider>
                <VariantProvider profile={profile}>
                    <ThemeProvider>
                        <LocationSpy />
                        <Routes>
                            <Route path="/" element={<Portfolio />} />
                            <Route path="/blog/:slug" element={<BlogPostPage />} />
                        </Routes>
                    </ThemeProvider>
                </VariantProvider>
            </HelmetProvider>
        </MemoryRouter>
    );
};

describe('BlogPostPage - Navigation', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        document.getElementById = vi.fn().mockImplementation((id) => {
            if (['experience', 'work', 'about', 'blog', 'contact', 'main-content'].includes(id)) {
                return {
                    scrollIntoView: scrollIntoViewMock,
                    getBoundingClientRect: () => ({ top: 500, left: 0, right: 0, bottom: 0, width: 100, height: 100 })
                };
            }
            return null;
        });
    });

    afterEach(() => {
        cleanup();
    });

    describe('Critical: Nav links navigate correctly', () => {
        it('should have valid href patterns for anchor links', () => {
            renderBlogPage();

            const nav = document.querySelector('nav[aria-label="Primary"]');
            const allLinks = nav?.querySelectorAll('a') || [];

            // With BrowserRouter, anchor links should use /#section format
            Array.from(allLinks).forEach(link => {
                const href = link.getAttribute('href') || '';
                // Valid patterns: /#section (anchor to home), #section (same-page), /path
                if (href.startsWith('/#')) {
                    expect(href).toMatch(/^\/#[a-z]/); // Must be /#section format
                }
            });
        });

        it('Experience link should navigate to home route /', async () => {
            renderBlogPage();
            expect(currentPath).toBe(`/blog/${EXISTING_BLOG_SLUG}`);

            const nav = document.querySelector('nav[aria-label="Primary"]');
            const expLink = nav?.querySelector('a[href*="experience"]');

            expect(expLink).not.toBeNull();
            fireEvent.click(expLink!);

            await waitFor(() => {
                expect(currentPath).toBe('/');
            });
        });

        it('Cases link should navigate to home route /', async () => {
            renderBlogPage();

            const nav = document.querySelector('nav[aria-label="Primary"]');
            const link = nav?.querySelector('a[href*="work"]');

            fireEvent.click(link!);

            await waitFor(() => {
                expect(currentPath).toBe('/');
            });
        });

        it('Blog link should navigate to home route /', async () => {
            renderBlogPage();

            const nav = document.querySelector('nav[aria-label="Primary"]');
            // Find blog link that's not the logo
            const links = nav?.querySelectorAll('a') || [];
            const blogLink = Array.from(links).find(l =>
                l.textContent?.toLowerCase() === 'blog' &&
                l.getAttribute('href')?.includes('blog')
            );

            if (blogLink) {
                fireEvent.click(blogLink);
                await waitFor(() => {
                    expect(currentPath).toBe('/');
                });
            }
        });

        it('About link should navigate to home route /', async () => {
            renderBlogPage();

            const nav = document.querySelector('nav[aria-label="Primary"]');
            const link = nav?.querySelector('a[href*="about"]');

            fireEvent.click(link!);

            await waitFor(() => {
                expect(currentPath).toBe('/');
            });
        });

        it('Get in Touch CTA should link to Google Calendar', () => {
            renderBlogPage();

            // Find CTA in the nav bar specifically
            const nav = document.querySelector('nav[aria-label="Primary"]');
            const cta = nav?.querySelector('a[href*="calendar.google.com"]');

            expect(cta).not.toBeNull();
            expect(cta?.getAttribute('target')).toBe('_blank');
            expect(cta?.getAttribute('rel')).toBe('noopener noreferrer');
        });

        it('should NOT navigate to /experience (invalid route)', async () => {
            renderBlogPage();

            const nav = document.querySelector('nav[aria-label="Primary"]');
            const expLink = nav?.querySelector('a[href*="experience"]');

            fireEvent.click(expLink!);

            await waitFor(() => {
                expect(currentPath).not.toBe('/experience');
                expect(currentPath).toBe('/');
            });
        });
    });

    describe('Scroll behavior after navigation', () => {
        it('should call getElementById for target section after clicking nav link', async () => {
            renderBlogPage();

            const nav = document.querySelector('nav[aria-label="Primary"]');
            const expLink = nav?.querySelector('a[href*="experience"]');

            fireEvent.click(expLink!);

            await waitFor(() => {
                expect(document.getElementById).toHaveBeenCalledWith('experience');
            }, { timeout: 300 });
        });
    });

    describe('Back to Thoughts link', () => {
        it('should navigate to home and target blog section', async () => {
            renderBlogPage();

            const backLink = document.querySelector('a.back-link');

            if (backLink) {
                fireEvent.click(backLink);

                await waitFor(() => {
                    expect(currentPath).toBe('/');
                });

                await waitFor(() => {
                    expect(document.getElementById).toHaveBeenCalledWith('blog');
                }, { timeout: 300 });
            }
        });
    });

    describe('Mobile menu navigation', () => {
        it('mobile menu links should have correct href format', () => {
            renderBlogPage();

            const mobileMenu = document.querySelector('.mobile-menu');
            if (mobileMenu) {
                const links = mobileMenu.querySelectorAll('a');

                links.forEach(link => {
                    const href = link.getAttribute('href') || '';
                    if (href.startsWith('/#')) {
                        // With BrowserRouter, should be /#section format
                        expect(href).toMatch(/^\/#[a-z]/);
                    }
                });
            }
        });
    });
});

describe('Navigation consistency between pages', () => {
    afterEach(() => {
        cleanup();
    });

    it('blog page nav should have same items as home page nav', () => {
        // Render blog page and get nav items
        const { unmount: unmountBlog } = renderBlogPage();

        const blogNav = document.querySelector('nav[aria-label="Primary"]');
        const blogNavTexts = Array.from(blogNav?.querySelectorAll('a') || [])
            .map(a => a.textContent?.toLowerCase().trim())
            .filter(t => ['experience', 'cases', 'blog', 'about'].includes(t || ''));

        unmountBlog();

        // Render home page and get nav items
        render(
            <MemoryRouter initialEntries={['/']}>
                <HelmetProvider>
                    <VariantProvider profile={profile}>
                        <ThemeProvider>
                            <Routes>
                                <Route path="/" element={<Portfolio />} />
                            </Routes>
                        </ThemeProvider>
                    </VariantProvider>
                </HelmetProvider>
            </MemoryRouter>
        );

        const homeNav = document.querySelector('nav[aria-label="Primary"]');
        const homeNavTexts = Array.from(homeNav?.querySelectorAll('a') || [])
            .map(a => a.textContent?.toLowerCase().trim())
            .filter(t => ['experience', 'cases', 'blog', 'about'].includes(t || ''));

        expect(blogNavTexts.sort()).toEqual(homeNavTexts.sort());
    });
});
