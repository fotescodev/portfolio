---
title: "CV Dashboard DEV Mode Port Configuration"
type: "integration-issue"
severity: "medium"
status: "resolved"
date_identified: "2026-01-13"
date_resolved: "2026-01-13"

category: "integration-issue"
component: "CV Dashboard (public/cv-dashboard/index.html)"
subsystem: "DEV mode URL generation"

symptoms:
  - "Clicking 'View Portfolio' opens wrong application"
  - "Links point to localhost:5173 instead of actual portfolio dev server"
  - "DEV badge displays but functionality fails when multiple Vite projects run"

root_cause: |
  Hardcoded port 5173 assumption in DEV mode URL generation.
  Developer machines often run multiple Vite projects on different ports.

affected_files:
  - path: "public/cv-dashboard/index.html"
    description: "DEV mode port detection and URL building"

tags: [port-detection, dev-mode, vite, localhost, multi-project-dev, cv-dashboard]
---

# CV Dashboard DEV Mode Port Configuration

## Problem

The CV Dashboard DEV mode detection correctly identifies localhost but hardcodes port 5173 for the portfolio dev server URL. When multiple Vite projects run simultaneously on different ports, "View Portfolio" links open the wrong application.

### Symptoms

- Clicking "View Portfolio" from dashboard opens wrong project (e.g., Claude Watch instead of Portfolio)
- DEV badge shows correctly, but links point to wrong port
- Issue only occurs in multi-project development environments

### Root Cause

```javascript
// Original problematic code
const IS_DEV = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const BASE_URL = IS_DEV
  ? 'http://localhost:5173'  // HARDCODED PORT
  : 'https://fotescodev.github.io/portfolio';
```

## Solution

Implement a hybrid approach using localStorage + URL parameter for port configuration:

1. **URL parameter** (`?devPort=5174`) - allows override
2. **localStorage** - remembers user preference across sessions
3. **Default fallback** - uses 5173 if nothing configured

### Implementation

```javascript
const IS_DEV = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Priority: URL param > localStorage > default
function getDevPort() {
  const params = new URLSearchParams(window.location.search);
  return params.get('devPort') || localStorage.getItem('cvDashboardDevPort') || '5173';
}

const DEV_PORT = IS_DEV ? getDevPort() : null;
const BASE_URL = IS_DEV
  ? `http://localhost:${DEV_PORT}`
  : 'https://fotescodev.github.io/portfolio';

// Save port preference to localStorage
if (IS_DEV && DEV_PORT) {
  localStorage.setItem('cvDashboardDevPort', DEV_PORT);
}

// Update DEV badge to show port
if (IS_DEV) {
  const badge = document.getElementById('dev-badge');
  if (badge) badge.title = `DEV mode - Port ${DEV_PORT}`;
}
```

### Usage

1. **First time setup**: Add port to URL
   ```
   http://localhost:8889/cv-dashboard/?devPort=5174
   ```

2. **Subsequent visits**: Port is remembered
   ```
   http://localhost:8889/cv-dashboard/
   ```

3. **Override**: Use URL parameter anytime
   ```
   http://localhost:8889/cv-dashboard/?devPort=5175
   ```

## Prevention

1. **Never hardcode ports** - Always make dev server ports configurable
2. **Use localStorage for dev preferences** - Reduces friction for developers
3. **Document port configuration** - Add to GETTING_STARTED_GUIDE.md

## React Router Interception Fix

When linking to the dashboard from the React app, React Router's `/:company/:role` catch-all route intercepts `/cv-dashboard/` (treating "cv-dashboard" as the company parameter). To bypass this:

1. **Use explicit `index.html`** in the path: `/cv-dashboard/index.html?devPort=5175`
2. **Use `onClick` handler** to force full page navigation:
   ```javascript
   onClick={(e) => {
     e.preventDefault();
     window.location.href = getDashboardUrl();
   }}
   ```

This ensures Vite serves the static HTML file directly instead of React Router intercepting the route.

## Related Files

- `public/cv-dashboard/index.html` - Dashboard with DEV mode
- `src/components/sections/FooterSection.tsx` - Admin icon with dashboard link
- `vite.config.ts` - Dev server configuration
- `docs/guides/KNOWLEDGE_BASE_SETUP_GUIDE.md` - Port troubleshooting section

## Testing

1. Start portfolio on non-default port: `npm run dev -- --port 5174`
2. Open dashboard: `http://localhost:8889/cv-dashboard/?devPort=5174`
3. Click "View Portfolio" - should open localhost:5174
4. Refresh without param - should remember 5174
