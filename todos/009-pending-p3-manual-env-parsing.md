---
status: complete
priority: p3
issue_id: "009"
tags: [code-review, simplicity]
dependencies: []
---

# Manual Environment Variable Parsing

## Problem Statement

Both `scripts/seed-convex.ts` and `scripts/generate-cv.ts` implement custom .env.local parsing instead of using standard tooling. The custom parser is fragile and doesn't handle edge cases.

## Findings

### Code Simplicity Reviewer
- **Location:** `scripts/seed-convex.ts` lines 22-31
- **Location:** `scripts/generate-cv.ts` lines 34-44
- Custom parser truncates values containing `#`
- No handling for quoted values or multiline
- Duplicated in two files

### Security Sentinel Agent
- Values with `#` are truncated (e.g., passwords with `#`)
- Could cause authentication failures

## Proposed Solutions

### Option A: Use Node.js --env-file Flag (Recommended)
**Description:** Node 20+ has built-in env file loading

```bash
# package.json scripts
"seed:convex": "tsx --env-file=.env.local scripts/seed-convex.ts"
"generate:cv": "tsx --env-file=.env.local scripts/generate-cv.ts"
```

Then remove the custom parsing code from both scripts.

**Pros:**
- No custom code
- Handles all edge cases
- Built into Node.js

**Cons:**
- Requires Node 20+

**Effort:** Small (30 minutes)
**Risk:** None

### Option B: Use dotenv Package
**Description:** If dotenv is already a dependency, use it

```typescript
import 'dotenv/config';
// or
import { config } from 'dotenv';
config({ path: '.env.local' });
```

**Pros:**
- Standard solution
- Well-tested

**Cons:**
- Adds dependency if not present

**Effort:** Small
**Risk:** None

## Recommended Action

Option A if on Node 20+, otherwise Option B.

## Technical Details

**Affected Files:**
- `scripts/seed-convex.ts` lines 22-31
- `scripts/generate-cv.ts` lines 34-44

**Code to Remove:**
```typescript
const envPath = join(process.cwd(), '.env.local');
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].split('#')[0].trim();
    }
  }
}
```

## Acceptance Criteria

- [ ] Custom env parsing removed from seed-convex.ts
- [ ] Custom env parsing removed from generate-cv.ts
- [ ] Scripts work correctly with standard env loading
- [ ] Values with `#` are preserved

## Work Log

| Date | Action | Learnings |
|------|--------|-----------|
| 2026-01-09 | Created from code review | ~20 lines of duplicated fragile code |

## Resources

- Code Simplicity Reviewer Report
- Security Sentinel Report
