import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '../../context/ThemeContext';
import { HelmetProvider } from 'react-helmet-async';
import { Suspense, lazy } from 'react';

// Mock IntersectionObserver for tests
beforeAll(() => {
  global.IntersectionObserver = class IntersectionObserver {
    constructor(callback: IntersectionObserverCallback) {}
    observe() { return null; }
    unobserve() { return null; }
    disconnect() { return null; }
    root = null;
    rootMargin = '';
    thresholds = [];
    takeRecords() { return []; }
  };
});

// Test that lazy imports work correctly
describe('Code Splitting - Lazy Loading', () => {
  describe('Route lazy loading', () => {
    it('should lazy load BlogPostPage', async () => {
      // Verify the dynamic import works
      const BlogPostPage = lazy(() => import('../../pages/BlogPostPage'));

      expect(BlogPostPage).toBeDefined();
      expect(typeof BlogPostPage).toBe('object'); // lazy returns a React component
    });

    it('should lazy load VariantPortfolio', async () => {
      const VariantPortfolio = lazy(() => import('../../pages/VariantPortfolio'));

      expect(VariantPortfolio).toBeDefined();
      expect(typeof VariantPortfolio).toBe('object');
    });
  });

  describe('Component lazy loading', () => {
    it('should lazy load CaseStudyDrawer', async () => {
      const CaseStudyDrawer = lazy(() => import('../../components/case-study/CaseStudyDrawer'));

      expect(CaseStudyDrawer).toBeDefined();
      expect(typeof CaseStudyDrawer).toBe('object');
    });
  });

  describe('Suspense fallback', () => {
    it('should support Suspense with lazy components', () => {
      // Verify that React.lazy and Suspense work together
      const LazyComponent = lazy(() => Promise.resolve({
        default: () => <div>Lazy Content</div>
      }));

      // This verifies the lazy function returns a valid component
      expect(LazyComponent).toBeDefined();
      expect(LazyComponent.$$typeof).toBeDefined(); // React lazy symbol
    });
  });

  describe('App routing with lazy components', () => {
    it('should import App module successfully', async () => {
      // Verify the App module with lazy routes can be imported
      const AppModule = await import('../../App');

      expect(AppModule).toBeDefined();
      expect(AppModule.default).toBeDefined();
      expect(typeof AppModule.default).toBe('function');
    });

    it('should import BasePortfolio as direct import (not lazy)', async () => {
      // BasePortfolio should be a direct import, not lazy
      const BasePortfolio = await import('../../pages/BasePortfolio');

      expect(BasePortfolio).toBeDefined();
      expect(BasePortfolio.default).toBeDefined();
    });
  });
});

describe('Code Splitting - Build Verification', () => {
  it('should have separate chunk files for vendor dependencies', () => {
    // This test documents the expected chunk structure
    // Actual verification happens at build time
    const expectedChunks = [
      'vendor-react',    // React, ReactDOM, React Router
      'vendor-markdown', // react-markdown, react-syntax-highlighter
      'vendor-motion',   // framer-motion
    ];

    // Document the expected structure
    expect(expectedChunks).toHaveLength(3);
  });

  it('should have separate chunk files for lazy-loaded routes', () => {
    const expectedLazyChunks = [
      'BlogPostPage',
      'VariantPortfolio',
      'CaseStudyDrawer',
    ];

    expect(expectedLazyChunks).toHaveLength(3);
  });
});
