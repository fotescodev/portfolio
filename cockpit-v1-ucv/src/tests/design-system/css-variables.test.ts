/**
 * Design System CSS Variables Test Suite
 * 
 * Verifies that all design tokens are properly defined as CSS custom properties.
 * These tests ensure the design system foundation is intact.
 */

describe('Design System CSS Variables', () => {
    const getComputedStyleProperty = (property: string): string => {
        return getComputedStyle(document.documentElement).getPropertyValue(property).trim();
    };

    describe('Color Tokens - Dark Theme (default)', () => {
        beforeEach(() => {
            document.documentElement.setAttribute('data-theme', 'dark');
        });

        it('should have background colors defined', () => {
            expect(getComputedStyleProperty('--color-background')).toBe('#08080a');
            expect(getComputedStyleProperty('--color-background-secondary')).toBe('#141416');
            expect(getComputedStyleProperty('--color-background-tertiary')).toBe('#1a1a1c');
        });

        it('should have text colors defined', () => {
            expect(getComputedStyleProperty('--color-text-primary')).toBe('#e8e6e3');
            expect(getComputedStyleProperty('--color-text-secondary')).toBe('#a8a5a0');
            expect(getComputedStyleProperty('--color-text-tertiary')).toBe('#6b6966');
            expect(getComputedStyleProperty('--color-text-muted')).toBe('#4a4a4c');
        });

        it('should have accent color defined', () => {
            expect(getComputedStyleProperty('--color-accent')).toBe('#c29a6c');
        });

        it('should have success color defined', () => {
            expect(getComputedStyleProperty('--color-success')).toBe('#4ade80');
        });

        it('should have border colors defined', () => {
            expect(getComputedStyleProperty('--color-border')).toBeTruthy();
            expect(getComputedStyleProperty('--color-border-light')).toBeTruthy();
        });
    });

    describe('Color Tokens - Light Theme', () => {
        beforeEach(() => {
            document.documentElement.setAttribute('data-theme', 'light');
        });

        afterEach(() => {
            document.documentElement.setAttribute('data-theme', 'dark');
        });

        it('should override background colors for light theme', () => {
            expect(getComputedStyleProperty('--color-background')).toBe('#fafafa');
            expect(getComputedStyleProperty('--color-background-secondary')).toBe('#ffffff');
        });

        it('should override text colors for light theme', () => {
            expect(getComputedStyleProperty('--color-text-primary')).toBe('#050505');
            expect(getComputedStyleProperty('--color-text-secondary')).toBe('#2a2a2c');
        });

        it('should have accent color for light theme (darker variant)', () => {
            // Light theme uses darker accent for better contrast
            expect(getComputedStyleProperty('--color-accent')).toBe('#8a6642');
        });
    });

    describe('Typography Tokens', () => {
        it('should have font families defined', () => {
            expect(getComputedStyleProperty('--font-sans')).toContain('Instrument Sans');
            expect(getComputedStyleProperty('--font-serif')).toContain('Instrument Serif');
        });
    });

    describe('Spacing Tokens', () => {
        it('should have spacing scale defined', () => {
            expect(getComputedStyleProperty('--space-xs')).toBe('4px');
            expect(getComputedStyleProperty('--space-sm')).toBe('8px');
            expect(getComputedStyleProperty('--space-md')).toBe('16px');
            expect(getComputedStyleProperty('--space-lg')).toBe('24px');
            expect(getComputedStyleProperty('--space-xl')).toBe('32px');
            expect(getComputedStyleProperty('--space-2xl')).toBe('48px');
            expect(getComputedStyleProperty('--space-3xl')).toBe('64px');
        });
    });

    describe('Transition Tokens', () => {
        it('should have easing function defined', () => {
            expect(getComputedStyleProperty('--ease-smooth')).toBeTruthy();
        });

        it('should have transition durations defined', () => {
            expect(getComputedStyleProperty('--transition-fast')).toBeTruthy();
            expect(getComputedStyleProperty('--transition-medium')).toBeTruthy();
        });
    });
});
