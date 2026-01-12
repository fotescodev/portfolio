---
status: complete
priority: p3
issue_id: "011"
tags: [code-review, agent-native, convex]
dependencies: ["001"]
---

# Missing JD URL Fetching in Convex Action

## Problem Statement

The `generateVariant` Convex action requires `jobDescription` as text. An agent on mobile cannot fetch a URL and convert to text - they must copy-paste the full JD manually. The CLI has URL fetching capability that isn't exposed via Convex.

## Findings

### Agent-Native Reviewer
- **Location:** `convex/generate.ts` - No jdUrl parameter
- **Location:** `scripts/generate-cv.ts:114-179` - Has fetchJobDescription()
- Mobile workflow requires manual copy-paste of entire JD
- CLI can fetch from URL, Convex action cannot

## Proposed Solutions

### Option A: Add URL Fetching to Generate Action (Recommended)
**Description:** Accept optional `jobDescriptionUrl` parameter

```typescript
export const generateVariant = action({
  args: {
    company: v.string(),
    role: v.string(),
    jobDescription: v.optional(v.string()),
    jobDescriptionUrl: v.optional(v.string()),
    // ...
  },
  handler: async (ctx, args) => {
    let jd = args.jobDescription;
    if (!jd && args.jobDescriptionUrl) {
      jd = await fetchAndExtractText(args.jobDescriptionUrl);
    }
    if (!jd) {
      throw new Error("Either jobDescription or jobDescriptionUrl required");
    }
    // ... rest of handler
  }
});

async function fetchAndExtractText(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 ...' }
  });
  const html = await response.text();
  // Strip HTML tags, clean up whitespace
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
```

**Pros:**
- Mobile can paste URL instead of full text
- Matches CLI capability
- Better agent experience

**Cons:**
- Some job sites block scraping
- May need to handle authentication
- HTML parsing is imperfect

**Effort:** Medium (2-4 hours)
**Risk:** Medium (site blocking)

### Option B: Keep URL Fetching CLI-Only
**Description:** Document that URL fetching requires CLI

**Pros:**
- No implementation effort
- Simpler action

**Cons:**
- Poor mobile experience
- Not agent-native

**Effort:** None
**Risk:** None

## Recommended Action

<!-- To be filled during triage -->

## Technical Details

**Affected Files:**
- `convex/generate.ts` - Add jdUrl handling

**Reference Implementation:**
- `scripts/generate-cv.ts` lines 114-179 has working URL fetcher

## Acceptance Criteria

- [ ] `generateVariant` accepts `jobDescriptionUrl` parameter
- [ ] URL content is fetched and extracted
- [ ] Error handling for failed fetches
- [ ] Works with common job posting sites

## Work Log

| Date | Action | Learnings |
|------|--------|-----------|
| 2026-01-09 | Created from code review | Would improve mobile/agent UX |

## Resources

- Agent-Native Reviewer Report
- `scripts/generate-cv.ts` fetchJobDescription implementation
