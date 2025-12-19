import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '../../context/ThemeContext';
import { VariantProvider } from '../../context/VariantContext';
import { HelmetProvider } from 'react-helmet-async';
import { profile } from '../../lib/content';
import Portfolio from '../../components/Portfolio';

// Mock scrollTo since JSDOM doesn't implement it
const scrollToMock = vi.fn();
Object.defineProperty(window, 'scrollTo', { value: scrollToMock, writable: true });

// Mock pageYOffset
Object.defineProperty(window, 'pageYOffset', { value: 0, writable: true });

// Mock IntersectionObserver
beforeAll(() => {
    global.IntersectionObserver = class IntersectionObserver {
        constructor() { }
        observe() { return null; }
        unobserve() { return null; }
        disconnect() { return null; }
    } as unknown as typeof IntersectionObserver;
});

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter>
        <HelmetProvider>
            <VariantProvider profile={profile}>
                <ThemeProvider>{children}</ThemeProvider>
            </VariantProvider>
        </HelmetProvider>
    </MemoryRouter>
);

describe('Navigation Flow', () => {
    beforeEach(() => {
        scrollToMock.mockClear();
        // Mock getElementById to return a mock element with getBoundingClientRect
        document.getElementById = vi.fn().mockImplementation((id) => {
            if (id === 'work' || id === 'about' || id === 'blog') {
                return {
                    getBoundingClientRect: () => ({
                        top: 1000,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        width: 100,
                        height: 100,
                    }),
                };
            }
            return null;
        });
    });

    it('should call window.scrollTo with correct parameters on navigation link click', () => {
        render(
            <TestWrapper>
                <Portfolio />
            </TestWrapper>
        );

        // Find work link in desktop nav - using role 'link' is more robust
        const workLink = screen.getAllByRole('link', { name: /work/i })[0];
        fireEvent.click(workLink);

        // Should call scrollTo with 1000 - 80 = 920
        expect(scrollToMock).toHaveBeenCalledWith({
            top: 920,
            behavior: 'smooth'
        });
    });

    it('should call window.scrollTo for About section', () => {
        render(
            <TestWrapper>
                <Portfolio />
            </TestWrapper>
        );

        const aboutLink = screen.getAllByRole('link', { name: /about/i })[0];
        fireEvent.click(aboutLink);

        expect(scrollToMock).toHaveBeenCalledWith({
            top: 920,
            behavior: 'smooth'
        });
    });

    it('should call window.scrollTo for Blog section', () => {
        render(
            <TestWrapper>
                <Portfolio />
            </TestWrapper>
        );

        const blogLink = screen.getAllByRole('link', { name: /blog/i })[0];
        fireEvent.click(blogLink);

        expect(scrollToMock).toHaveBeenCalledWith({
            top: 920,
            behavior: 'smooth'
        });
    });
});
