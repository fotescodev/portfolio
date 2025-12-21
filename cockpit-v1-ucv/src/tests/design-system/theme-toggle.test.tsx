/**
 * Theme Toggle Functionality Tests
 * 
 * Verifies that the ThemeProvider and theme switching work correctly.
 */

import { render, screen, fireEvent, act } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../../context/ThemeContext';

// Test component that exposes theme state
function ThemeTestComponent() {
    const { isDark, toggleTheme, theme } = useTheme();
    return (
        <div>
            <span data-testid="theme-state">{theme}</span>
            <span data-testid="is-dark">{isDark ? 'dark' : 'light'}</span>
            <button onClick={toggleTheme} data-testid="toggle-btn">Toggle</button>
        </div>
    );
}

describe('Theme Toggle Functionality', () => {
    beforeEach(() => {
        // Clear localStorage and mocks before each test
        localStorage.clear();
        vi.clearAllMocks();
        // Reset data-theme attribute
        document.documentElement.setAttribute('data-theme', 'dark');
    });

    describe('ThemeProvider', () => {
        it('should provide default dark theme', () => {
            render(
                <ThemeProvider>
                    <ThemeTestComponent />
                </ThemeProvider>
            );

            expect(screen.getByTestId('theme-state')).toHaveTextContent('dark');
            expect(screen.getByTestId('is-dark')).toHaveTextContent('dark');
        });

        it('should set data-theme attribute on document element', () => {
            render(
                <ThemeProvider>
                    <ThemeTestComponent />
                </ThemeProvider>
            );

            expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
        });

        it('should toggle theme when toggleTheme is called', () => {
            render(
                <ThemeProvider>
                    <ThemeTestComponent />
                </ThemeProvider>
            );

            const toggleBtn = screen.getByTestId('toggle-btn');

            // Initially dark
            expect(screen.getByTestId('theme-state')).toHaveTextContent('dark');

            // Toggle to light
            act(() => {
                fireEvent.click(toggleBtn);
            });
            expect(screen.getByTestId('theme-state')).toHaveTextContent('light');
            expect(document.documentElement.getAttribute('data-theme')).toBe('light');

            // Toggle back to dark
            act(() => {
                fireEvent.click(toggleBtn);
            });
            expect(screen.getByTestId('theme-state')).toHaveTextContent('dark');
            expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
        });

        it('should call localStorage.setItem when theme changes', () => {
            const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

            render(
                <ThemeProvider>
                    <ThemeTestComponent />
                </ThemeProvider>
            );

            const toggleBtn = screen.getByTestId('toggle-btn');

            // Toggle to light
            act(() => {
                fireEvent.click(toggleBtn);
            });

            expect(setItemSpy).toHaveBeenCalledWith('portfolio-theme', 'light');
            setItemSpy.mockRestore();
        });

        it('should respect initial theme from localStorage', () => {
            // Mock getItem to return 'light'
            const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('light');

            render(
                <ThemeProvider>
                    <ThemeTestComponent />
                </ThemeProvider>
            );

            expect(screen.getByTestId('theme-state')).toHaveTextContent('light');
            getItemSpy.mockRestore();
        });
    });

    describe('CSS Variable Theme Switching', () => {
        it('should update CSS variables when theme changes', () => {
            render(
                <ThemeProvider>
                    <ThemeTestComponent />
                </ThemeProvider>
            );

            const getBackground = () =>
                getComputedStyle(document.documentElement).getPropertyValue('--color-background').trim();

            // Dark theme background
            expect(getBackground()).toBe('#08080a');

            // Toggle to light
            act(() => {
                fireEvent.click(screen.getByTestId('toggle-btn'));
            });

            // Light theme background
            expect(getBackground()).toBe('#fafafa');
        });
    });
});
