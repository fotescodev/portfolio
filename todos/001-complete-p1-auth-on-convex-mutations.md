---
status: complete
priority: p1
issue_id: "001"
tags: [code-review, security, convex]
dependencies: []
---

# No Authorization on Convex Mutations/Actions

## Problem Statement

All Convex mutations and actions are completely public. Any client with the Convex URL can:
- Create or modify any variant (`upsert`)
- Change publish status of any variant (`updateStatus`)
- Delete any variant (`remove`)
- Trigger AI generation and consume API credits (`generateVariant`)

This is a **critical security vulnerability** that could lead to data corruption, unauthorized content changes, and financial impact from API abuse.

## Findings

### Security Sentinel Agent
- **Location:** `convex/variants.ts` lines 66-96, 101-121, 126-140
- **Location:** `convex/generate.ts` lines 15-93
- No `ctx.auth` checks in any mutation or action
- Convex endpoints are publicly accessible - only the URL is needed to attack

### Agent-Native Reviewer
- Noted that while CRUD is accessible, no authentication means agents AND attackers have equal access

## Proposed Solutions

### Option A: Convex Auth Integration (Recommended)
**Description:** Use Convex's built-in authentication with a provider (Clerk, Auth0, or custom)

**Pros:**
- Full auth infrastructure provided by Convex
- Session management handled automatically
- Works with Convex Dashboard

**Cons:**
- Adds complexity for a personal portfolio
- Requires auth provider setup

**Effort:** Medium (1-2 days)
**Risk:** Low

### Option B: Simple API Key Authentication
**Description:** Add a secret API key check to mutations

```typescript
export const upsert = mutation({
  args: {
    apiKey: v.string(),
    // ... other args
  },
  handler: async (ctx, args) => {
    if (args.apiKey !== process.env.ADMIN_API_KEY) {
      throw new Error("Unauthorized");
    }
    // ... rest of handler
  },
});
```

**Pros:**
- Simple to implement
- No external dependencies
- Works for single-user scenario

**Cons:**
- API key must be passed with every request
- Not scalable for multi-user
- Key rotation requires code changes

**Effort:** Small (2-4 hours)
**Risk:** Medium (key management)

### Option C: Accept Risk (Personal Portfolio)
**Description:** Document the risk and accept it for a personal portfolio site

**Pros:**
- No implementation effort
- Simpler architecture

**Cons:**
- Vulnerable to vandalism
- API credits could be abused
- Not production-ready pattern

**Effort:** None
**Risk:** High

## Recommended Action

<!-- To be filled during triage -->

## Technical Details

**Affected Files:**
- `convex/variants.ts` - All mutations need auth
- `convex/generate.ts` - Action needs auth
- `convex/baseContent.ts` - Upsert needs auth

**Testing Required:**
- [ ] Verify unauthorized requests are rejected
- [ ] Verify authorized requests succeed
- [ ] Test from Convex Dashboard still works

## Acceptance Criteria

- [ ] Mutations require authentication
- [ ] Generate action requires authentication
- [ ] Unauthorized requests return 401/403
- [ ] CLI scripts work with new auth
- [ ] Convex Dashboard admin access preserved

## Work Log

| Date | Action | Learnings |
|------|--------|-----------|
| 2026-01-09 | Created from code review | Multiple agents flagged this as critical |

## Resources

- [Convex Authentication Docs](https://docs.convex.dev/auth)
- Security Sentinel Agent Report
- Agent-Native Review Report
