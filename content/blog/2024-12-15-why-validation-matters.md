---
title: "Why Content Validation Matters for Developer Portfolios"
date: "2024-12-15"
excerpt: "Building a portfolio is easy. Maintaining content quality at scale is hard. Here's how automated validation saves time and prevents embarrassing mistakes."
tags: ["Developer Tools", "Best Practices", "Automation"]
thumbnail: null
---

Too many portfolios with broken links, malformed YAML, inconsistent data structures. The solution isn't "be more careful"—it's automation.

## The Problem with Manual Validation

When you're managing a portfolio with multiple content types (case studies, blog posts, projects), manual checking doesn't scale:

**Common mistakes:**
- Typos in YAML keys (`compnay` instead of `company`)
- Wrong date formats (`12/15/2024` vs. `2024-12-15`)
- Missing required fields that crash builds
- Duplicate IDs between case studies
- Invalid URLs that go unnoticed

These errors often don't surface until:
1. Your build fails in CI/CD
2. A recruiter clicks a broken link
3. Your case study drawer shows `undefined`

By then, it's too late.

## The Solution: Schema Validation

The answer is **Zod schemas** combined with a validation CLI.

### What This Looks Like

```typescript
// Define your schema once
const CaseStudySchema = z.object({
  id: z.number(),
  title: z.string(),
  year: z.string(),
  // ... all your fields
});

// Validate before commit
validateFile(caseStudy, CaseStudySchema);
```

### Benefits

1. **Catch errors early** - Before they reach production
2. **Self-documenting** - Schema is your source of truth
3. **Type safety** - TypeScript types derived from schemas
4. **Fast feedback** - Run validation in <1 second
5. **CI/CD integration** - Block bad commits automatically

## Real-World Example

Here's what validation caught in my portfolio:

```bash
npm run validate

✗ Case Study: 05-new-project.md
  ✗ hook.impactMetric.value: Required
  ✗ year: Expected YYYY or YYYY-YY format
  ✗ cta.action: Invalid enum value
```

Without validation, these would have crashed my build or shown broken UI.

## Implementation

**1. Define schemas:**
```typescript
export const CaseStudySchema = z.object({
  id: z.number(),
  slug: z.string(),
  title: z.string(),
  company: z.string(),
  year: z.string(),
  // ...
});
```

**2. Create validation script:**
```typescript
function validateContent() {
  const files = readAllContent();
  files.forEach(file => {
    const result = schema.safeParse(file);
    if (!result.success) {
      console.error(result.error);
      process.exit(1);
    }
  });
}
```

**3. Add to package.json:**
```json
{
  "scripts": {
    "validate": "tsx scripts/validate-content.ts"
  }
}
```

**4. Run before commits:**
```bash
npm run validate
git commit -m "Add new case study"
```

## Beyond Portfolios

This pattern works for any content-driven application:
- Documentation sites
- Blog platforms
- Product catalogs
- Configuration management

The key insight: **treat content as code**.

## Key Takeaways

- **Validation is infrastructure** — Not optional, foundational
- **Fail fast** — Catch errors locally, not in production
- **Automate everything** — Manual checks don't scale
- **Use types** — Schemas + TypeScript = confidence

## Next Steps

If you're maintaining a content-heavy portfolio:

1. Add Zod
2. Define schemas for each content type
3. Write validation script
4. Run validation in CI/CD
5. Create templates with correct structure

Your future self will thank you when the CLI catches a missing field before a recruiter sees a broken page.

---

*See my portfolio's [content validation system](https://github.com/fotescodev/portfolio) for a working implementation.*
