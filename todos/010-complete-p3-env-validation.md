---
status: complete
priority: p3
issue_id: "010"
tags: [code-review, quality, typescript]
dependencies: []
---

# No Environment Variable Validation in main.tsx

## Problem Statement

The ConvexReactClient is initialized with a type assertion that doesn't validate the environment variable exists. If `VITE_CONVEX_URL` is undefined, the app fails at runtime with an unclear error.

## Findings

### Pattern Recognition Agent
- **Location:** `src/main.tsx` line 7
- Type assertion `as string` bypasses undefined check
- Runtime failure if env var missing

### Architecture Strategist Agent
- Fail-fast principle violated
- Error message would be confusing (undefined URL)

## Proposed Solutions

### Option A: Add Validation Guard (Recommended)
**Description:** Check for undefined before using

```typescript
const convexUrl = import.meta.env.VITE_CONVEX_URL;
if (!convexUrl) {
  throw new Error(
    'VITE_CONVEX_URL environment variable is required. ' +
    'Add it to .env.local: VITE_CONVEX_URL=https://your-project.convex.cloud'
  );
}
const convex = new ConvexReactClient(convexUrl);
```

**Pros:**
- Clear error message
- Fail-fast at startup
- Developer-friendly

**Cons:**
- 4 extra lines

**Effort:** Small (10 minutes)
**Risk:** None

## Recommended Action

Option A - Quick fix with developer experience improvement.

## Technical Details

**Affected Files:**
- `src/main.tsx` line 7

**Current Code:**
```typescript
const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string)
```

## Acceptance Criteria

- [ ] VITE_CONVEX_URL is validated before use
- [ ] Clear error message if missing
- [ ] App works normally when env var is set

## Work Log

| Date | Action | Learnings |
|------|--------|-----------|
| 2026-01-09 | Created from code review | Type assertions can hide runtime errors |

## Resources

- Pattern Recognition Report
- Architecture Strategist Report
