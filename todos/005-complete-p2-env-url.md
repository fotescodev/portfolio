---
status: complete
priority: p2
issue_id: "005"
tags: [code-review, security, configuration]
dependencies: []
---

# Hardcoded Convex URL Fallback

## Problem Statement

The seed script contains a hardcoded production Convex URL as a fallback (line 37). If environment variables are not set, operations silently target production instead of failing fast.

## Findings

### Security Sentinel Agent
- **Location:** `scripts/seed-convex.ts` lines 33-37
- Hardcoded URL: `https://scintillating-husky-549.convex.cloud`
- URL is now publicly exposed in codebase
- Developers could accidentally seed production during local development

## Proposed Solutions

### Option A: Fail Fast if URL Missing (Recommended)
**Description:** Remove fallback, require explicit configuration

```typescript
const CONVEX_URL = process.env.VITE_CONVEX_URL || process.env.CONVEX_URL;
if (!CONVEX_URL) {
  console.error('Error: CONVEX_URL or VITE_CONVEX_URL environment variable required');
  console.error('Set it in .env.local or pass via environment');
  process.exit(1);
}
```

**Pros:**
- Prevents accidental production operations
- Clear error message
- Fail-fast principle

**Cons:**
- Requires env var to be set (but it should be!)

**Effort:** Small (15 minutes)
**Risk:** None

### Option B: Keep Fallback but Warn
**Description:** Log warning when using fallback

**Pros:**
- Backward compatible
- Still works without config

**Cons:**
- Still risky
- Warnings often ignored

**Effort:** Small
**Risk:** Medium

## Recommended Action

Option A - Remove hardcoded fallback, require explicit configuration.

## Technical Details

**Affected Files:**
- `scripts/seed-convex.ts` lines 33-37

**Current Code:**
```typescript
const CONVEX_URL =
  process.env.VITE_CONVEX_URL ||
  process.env.CONVEX_URL ||
  "https://scintillating-husky-549.convex.cloud";  // REMOVE THIS
```

## Acceptance Criteria

- [ ] Hardcoded URL removed from seed-convex.ts
- [ ] Script fails with clear error if URL not set
- [ ] Same fix applied to generate-cv.ts if applicable

## Work Log

| Date | Action | Learnings |
|------|--------|-----------|
| 2026-01-09 | Created from code review | Security risk from exposed URL |

## Resources

- Security Sentinel Report
