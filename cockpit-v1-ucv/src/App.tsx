import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { HelmetProvider } from 'react-helmet-async';
import BasePortfolio from './pages/BasePortfolio';
import BlogPostPage from './pages/BlogPostPage';
import { FEATURES } from './config/features';

// Lazy-load variants so Universal CV can be treated as an optional module.
const VariantPortfolio = lazy(() => import('./pages/VariantPortfolio'));

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            {/* Base portfolio route */}
            <Route path="/" element={<BasePortfolio />} />

            {/* Blog post route */}
            <Route path="/blog/:slug" element={<BlogPostPage />} />

            {/* Variant portfolio routes: /company/role */}
            {FEATURES.ucv && (
              <Route
                path="/:company/:role"
                element={(
                  <Suspense fallback={null}>
                    <VariantPortfolio />
                  </Suspense>
                )}
              />
            )}

            {/* Catch-all: GitHub Pages deep links fall back to SPA routing */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
