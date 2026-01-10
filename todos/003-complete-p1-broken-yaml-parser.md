---
status: complete
priority: p1
issue_id: "003"
tags: [code-review, simplicity, convex]
dependencies: []
---

# Broken Custom YAML Parser in generate.ts

## Problem Statement

The `parseSimpleYaml` function in `convex/generate.ts` (lines 95-151) is a 55-line custom YAML parser that:
1. Only captures top-level keys (nested structures become empty objects)
2. Falls back to storing raw YAML as metadata if parsing fails
3. Is completely unnecessary since the prompt asks for JSON output

This is dead code that can silently corrupt data.

## Findings

### Code Simplicity Reviewer
- **Location:** `convex/generate.ts` lines 97-151
- Function is 55 lines but fundamentally broken for nested structures
- Line 205 explicitly says: "Output ONLY valid JSON (not YAML)"
- The JSON.parse at line 102 should always work if AI follows instructions

### Architecture Strategist Agent
- The fallback at lines 137-147 returns useless structure with `rawContent: yaml`
- No Zod validation before `ctx.runMutation`
- Parser named `parseSimpleYaml` but prompt requests JSON

### Pattern Recognition Agent
- Named "parseSimpleYaml" but trying to parse JSON first
- Comment acknowledges: "This is a minimal implementation - handles our specific structure"
- Actually handles NO structure correctly except JSON

## Proposed Solutions

### Option A: Remove YAML Fallback Entirely (Recommended)
**Description:** Since AI is instructed to output JSON, just parse JSON

```typescript
function parseAiResponse(content: string): Record<string, unknown> {
  // Remove code blocks if present
  let clean = content.trim();
  if (clean.startsWith("```")) {
    clean = clean.replace(/^```\w*\n/, "").replace(/\n```$/, "");
  }
  return JSON.parse(clean);
}
```

**Pros:**
- 50+ lines removed
- No silent data corruption
- Clear error if AI outputs invalid JSON

**Cons:**
- If AI outputs YAML, generation fails (but it would fail anyway with current broken parser)

**Effort:** Small (30 minutes)
**Risk:** None

### Option B: Use Proper YAML Library
**Description:** Since action uses `"use node"`, import js-yaml

```typescript
import yaml from 'js-yaml';

function parseYamlOrJson(content: string): Record<string, unknown> {
  let clean = content.trim().replace(/^```\w*\n/, "").replace(/\n```$/, "");
  try {
    return JSON.parse(clean);
  } catch {
    return yaml.load(clean) as Record<string, unknown>;
  }
}
```

**Pros:**
- Handles both JSON and YAML correctly
- Proper library, not custom parser

**Cons:**
- Adds dependency
- Unnecessary since prompt asks for JSON

**Effort:** Small (1 hour)
**Risk:** Low

## Recommended Action

Option A - Remove the broken YAML parser entirely.

## Technical Details

**Affected Files:**
- `convex/generate.ts` lines 95-151

**Current Broken Behavior:**
```yaml
# Input YAML:
metadata:
  company: "Acme"
  role: "PM"
overrides:
  hero:
    status: "Open"

# parseSimpleYaml output:
{
  "metadata": {},  // Lost all nested data!
  "overrides": {}  // Lost all nested data!
}
```

## Acceptance Criteria

- [ ] `parseSimpleYaml` function removed
- [ ] Replaced with simple JSON.parse with code block stripping
- [ ] AI-generated variants parse correctly
- [ ] Clear error message if AI outputs invalid JSON

## Work Log

| Date | Action | Learnings |
|------|--------|-----------|
| 2026-01-09 | Created from code review | 55 lines of dead code that silently corrupts data |
| 2026-01-09 | Fixed: Replaced with 10-line `parseAiResponse` function | Removed 45 lines, now properly parses JSON with code block stripping |

## Resources

- Code Simplicity Reviewer Report
- Architecture Strategist Report
