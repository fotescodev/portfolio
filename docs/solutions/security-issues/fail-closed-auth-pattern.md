---
title: "Fail-Closed Authentication Pattern"
type: "security-issue"
severity: "critical"
status: "resolved"
date_identified: "2026-01-15"
date_resolved: "2026-01-15"

category: "security-issues"
component: "convex/auth"
subsystem: "API authentication"

symptoms:
  - "Unprotected mutations when ADMIN_API_KEY not configured"
  - "Silent security degradation with no warning"
  - "False sense of security - auth code exists but doesn't protect"

root_cause: |
  The original requireAuth() function implemented a "fail-open" pattern:
  if ADMIN_API_KEY was not set, the function returned early without
  checking authentication, effectively allowing all requests through.

affected_files:
  - path: "convex/variants.ts"
    description: "requireAuth function and mutations"
  - path: "convex/generate.ts"
    description: "requireAuth function and actions"
  - path: "convex/baseContent.ts"
    description: "requireAuth function and mutations"

tags: [security, authentication, fail-closed, convex, CWE-287]
cwe_reference: "CWE-287 (Improper Authentication)"
---

# Fail-Closed Authentication Pattern

## Problem

The original auth pattern silently allowed access when `ADMIN_API_KEY` was missing:

```typescript
// DANGEROUS - Fail-Open Pattern
function requireAuth(apiKey: string | undefined) {
  const adminKey = process.env.ADMIN_API_KEY;
  if (!adminKey) {
    // If no admin key is configured, allow access (development mode)
    return;  // SECURITY HOLE!
  }
  if (apiKey !== adminKey) {
    throw new Error("Unauthorized: Invalid API key");
  }
}
```

This meant production deployments without `ADMIN_API_KEY` were completely unprotected.

## Solution

Change to fail-closed pattern - deny by default:

```typescript
/**
 * FAIL-CLOSED: Throws error if ADMIN_API_KEY is not configured.
 * This prevents accidental unprotected mutations in production.
 */
function requireAuth(apiKey: string | undefined) {
  const adminKey = process.env.ADMIN_API_KEY;
  if (!adminKey) {
    throw new Error(
      "ADMIN_API_KEY environment variable is not configured. " +
      "Set it in Convex dashboard to enable mutations."
    );
  }
  if (apiKey !== adminKey) {
    throw new Error("Unauthorized: Invalid API key");
  }
}
```

## Files Updated

Apply this pattern in all three files:
- `convex/variants.ts`
- `convex/generate.ts`
- `convex/baseContent.ts`

## Verification

1. **Without ADMIN_API_KEY** - mutations should fail with clear error
2. **With wrong key** - "Unauthorized: Invalid API key"
3. **With correct key** - mutation succeeds

## Prevention

### Checklist
- Auth checks must throw on failure, never silently return
- Default state must be "denied" - require explicit grant
- Missing config = blocked access, not open access

### Pattern Test
Auth functions must have:
```typescript
if (!authorized) throw new Error("...");
```

NOT:
```typescript
if (authorized) { /* continue */ }
```

### Code Review Guidelines
- Reject patterns like `if (isAdmin) { /* do stuff */ }`
- Require guard clauses at function start: `if (!isAdmin) throw ...`
- Check for early returns that bypass auth

## Security Principle

**Fail-closed (deny by default)** is a fundamental security principle:
- Missing configuration should block access
- Security failures should be loud, not silent
- Default state should be the most restrictive

## Related Files

- `docs/solutions/ui-bugs/resume-link-redirect-fallback.md` - graceful fallback pattern
- `docs/solutions/deployment-issues/production-variant-routes-redirect.md` - consequences of silent failures
- `context/PREVENTION_STRATEGIES.md`
