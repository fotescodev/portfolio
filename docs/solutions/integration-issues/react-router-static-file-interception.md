---
title: "React Router Static File Interception Prevention"
type: "integration-issue"
severity: "medium"
status: "resolved"
date_identified: "2026-01-13"
date_resolved: "2026-01-13"

category: "integration-issue"
component: "React Router (src/App.tsx)"
subsystem: "Client-side routing vs static asset serving"

symptoms:
  - "Clicking links to static HTML files shows blank page"
  - "React Router catch-all intercepts /path/ before static serving"
  - "PDF and HTML files don't load when accessed via React navigation"

root_cause: |
  React Router catch-all routes (like /:company/:role) intercept paths
  meant for static files in /public before Vite can serve them.

affected_files:
  - path: "src/App.tsx"
    description: "React Router configuration with catch-all routes"
  - path: "src/components/sections/FooterSection.tsx"
    description: "Links to static dashboard"
  - path: "public/cv-dashboard/index.html"
    description: "Static HTML file being intercepted"

tags: [react-router, static-assets, vite, spa-routing, catch-all-routes]
---

# React Router Static File Interception Prevention

## Problem

React Router's catch-all routes can intercept paths meant for static files, causing blank pages or routing errors.

### Example Scenario

```tsx
// App.tsx - Catch-all route intercepts everything
<Routes>
  <Route path="/:company/:role" element={<VariantPortfolio />} />
</Routes>

// Clicking link to /cv-dashboard/ → React Router treats "cv-dashboard" as :company
// Result: Blank page instead of static HTML
```

## Solution

### 1. Use Explicit File Extensions

```typescript
// WRONG: /cv-dashboard/ → intercepted by /:company/:role
const url = '/cv-dashboard/';

// CORRECT: /cv-dashboard/index.html → bypasses React Router
const url = '/cv-dashboard/index.html';
```

### 2. Force Full Page Navigation

```typescript
// Use onClick to bypass React Router's client-side navigation
<a
  href={getDashboardUrl()}
  onClick={(e) => {
    e.preventDefault();
    window.location.href = getDashboardUrl();
  }}
>
  Dashboard
</a>
```

### 3. Route Ordering (Specific Before Catch-All)

```tsx
<Routes>
  {/* Specific routes FIRST */}
  <Route path="/" element={<Home />} />
  <Route path="/resume" element={<ResumePage />} />
  <Route path="/blog/:slug" element={<BlogPost />} />

  {/* Catch-all routes LAST */}
  <Route path="/:company/:role/resume" element={<VariantResume />} />
  <Route path="/:company/:role" element={<VariantPortfolio />} />
</Routes>
```

## Prevention Guidelines

### Safe URL Patterns

```typescript
// SAFE - Won't match /:company/:role
'/resume.pdf'              // Has extension
'/cv-dashboard/index.html' // Has extension
'/resumes/stripe-pm.pdf'   // Has extension
'/api/variants'            // Reserved prefix
'/blog/my-post'            // Specific route defined first

// UNSAFE - Will match /:company/:role
'/stripe/pm'               // Two segments, no extension
'/dashboard/main'          // Two segments, no extension
```

### Reserved Prefixes

Establish prefixes that should never match dynamic routes:

```typescript
const RESERVED_PREFIXES = [
  '/api/',
  '/assets/',
  '/resumes/',
  '/tools/',
  '/admin/',
  '/blog/',
];
```

### Parameter Validation

Add validation in dynamic route components:

```typescript
function VariantPortfolio() {
  const { company, role } = useParams();

  // Reject parameters that look like files
  const invalidPatterns = [
    /\.[a-z]{2,4}$/i,  // Has file extension
    /^(api|assets|resumes|tools)$/i,  // Reserved prefix
  ];

  const isInvalid = invalidPatterns.some(p =>
    p.test(company || '') || p.test(role || '')
  );

  if (isInvalid) {
    return <Navigate to="/" replace />;
  }

  return <VariantContent />;
}
```

## Test Cases

```typescript
describe('Route Interception Prevention', () => {
  it('should not match /cv-dashboard/index.html to /:company/:role', () => {
    // /cv-dashboard/index.html should serve static file
    // NOT render VariantPortfolio with company="cv-dashboard"
  });

  it('should not match /resume.pdf to /:company/:role', () => {
    // PDF files should be served directly
  });

  it('should match /stripe/pm to /:company/:role', () => {
    // Valid variant routes should still work
  });
});
```

## Related Files

- `docs/solutions/integration-issues/cv-dashboard-dev-port-configuration.md` - Specific CV Dashboard fix
- `src/App.tsx` - React Router configuration
- `vite.config.ts` - Static file serving configuration

## References

- [React Router v6 Route Matching](https://reactrouter.com/en/main/route/route#dynamic-segments)
- [Vite Static Asset Handling](https://vitejs.dev/guide/assets.html)
