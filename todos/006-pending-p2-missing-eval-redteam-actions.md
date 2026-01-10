---
status: complete
priority: p2
issue_id: "006"
tags: [code-review, agent-native, convex]
dependencies: ["001"]
---

# Missing Evaluation and Red-Team Convex Actions

## Problem Statement

The CV generation pipeline has quality gates (evaluation, red-teaming) that only exist as CLI scripts. An agent on mobile can generate variants but cannot verify claims or run adversarial checks before publishing. The full workflow is CLI-only.

## Findings

### Agent-Native Reviewer
- **Orphan Feature:** `scripts/evaluate-variants.ts` - Not accessible remotely
- **Orphan Feature:** `scripts/redteam.ts` - Not accessible remotely
- Agent can generate and publish variants without any quality verification
- 7/14 capabilities are CLI-only

**Current Agent Capability Map:**
| Action | Convex API | Status |
|--------|------------|--------|
| Generate variant | `generate.generateVariant` | OK |
| Evaluate claims | Missing | CRITICAL |
| Red-team variant | Missing | CRITICAL |
| Publish variant | `variants.updateStatus` | OK (no gates) |

## Proposed Solutions

### Option A: Create Convex Actions for Quality Gates (Recommended)
**Description:** Port evaluation and red-team logic to Convex actions

```typescript
// convex/evaluate.ts
export const evaluateVariant = action({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const variant = await ctx.runQuery(api.variants.getBySlug, { slug: args.slug });
    // Run evaluation logic
    // Return { claims: [], verified: N, unverified: N, passed: boolean }
  }
});

// convex/redteam.ts
export const redteamVariant = action({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    // Run red-team checks
    // Return { pass: boolean, warns: [], fails: [] }
  }
});
```

**Pros:**
- Full pipeline accessible remotely/mobile
- Agents can run complete workflow
- Quality gates enforced server-side

**Cons:**
- Significant implementation effort
- Requires porting complex logic
- API costs for evaluation calls

**Effort:** Large (2-3 days)
**Risk:** Medium

### Option B: Quality-Gated Publish Mutation
**Description:** Add a `publish` mutation that enforces gates

```typescript
export const publish = mutation({
  args: { slug: v.string(), force: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    const variant = await getVariant(ctx, args.slug);
    if (!args.force) {
      if (!variant.evalPassed) throw new Error("Evaluation not passed");
      if (!variant.redteamPassed) throw new Error("Red-team not passed");
    }
    await ctx.db.patch(variant._id, { publishStatus: "published" });
  }
});
```

**Pros:**
- Prevents publishing unverified variants
- Simpler than full action port

**Cons:**
- Still requires CLI to run eval/redteam
- Partial solution

**Effort:** Small (2-4 hours)
**Risk:** Low

### Option C: Accept CLI-Only for Quality Gates
**Description:** Document that eval/redteam require CLI access

**Pros:**
- No implementation effort
- Simpler architecture

**Cons:**
- Not agent-native
- Mobile workflow incomplete

**Effort:** None
**Risk:** Low (for personal use)

## Recommended Action

<!-- To be filled during triage -->

## Technical Details

**CLI Scripts to Port:**
- `scripts/evaluate-variants.ts`
- `scripts/redteam.ts`

**Schema Extension Needed:**
```typescript
variants: defineTable({
  // ... existing fields
  evalStatus: v.optional(v.object({
    ran: v.string(),
    verified: v.number(),
    unverified: v.number(),
    passed: v.boolean()
  })),
  redteamStatus: v.optional(v.object({
    ran: v.string(),
    warns: v.number(),
    fails: v.number(),
    passed: v.boolean()
  }))
})
```

## Acceptance Criteria

- [ ] Evaluation can be triggered via Convex action
- [ ] Red-team can be triggered via Convex action
- [ ] Results stored in variant document
- [ ] `listAll` query returns eval/redteam status
- [ ] Publish mutation checks quality gates

## Work Log

| Date | Action | Learnings |
|------|--------|-----------|
| 2026-01-09 | Created from code review | 7/14 capabilities are CLI-only |

## Resources

- Agent-Native Reviewer Report
- `scripts/evaluate-variants.ts`
- `scripts/redteam.ts`
