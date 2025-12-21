/// <reference types="vitest/globals" />
import '@testing-library/jest-dom';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Mock window.matchMedia (required for ThemeContext)
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

// Load globals.css into jsdom
const globalsCss = readFileSync(
    resolve(__dirname, '../styles/globals.css'),
    'utf-8'
);

// Create style element and inject CSS
const style = document.createElement('style');
style.textContent = globalsCss;
document.head.appendChild(style);

// Set default theme
document.documentElement.setAttribute('data-theme', 'dark');
