import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { HelmetProvider } from 'react-helmet-async';
import BasePortfolio from './pages/BasePortfolio';

// Lazy load routes that aren't needed on initial page load
const VariantPortfolio = lazy(() => import('./pages/VariantPortfolio'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));
const ResumePage = lazy(() => import('./pages/ResumePage'));

// Simple loading fallback
const PageLoader = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    color: 'var(--color-text-secondary)'
  }}>
    Loading...
  </div>
);

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Base portfolio route */}
              <Route path="/" element={<BasePortfolio />} />

              {/* Resume page for PDF export - lazy loaded */}
              <Route path="/resume" element={<ResumePage />} />

              {/* Blog post route - lazy loaded */}
              <Route path="/blog/:slug" element={<BlogPostPage />} />

              {/* Variant portfolio routes: /company/role - lazy loaded */}
              <Route path="/:company/:role" element={<VariantPortfolio />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
