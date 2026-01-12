---
status: complete
priority: p1
issue_id: "014"
tags: [design-audit, accessibility, aria]
dependencies: []
---

# Missing ARIA Labels on Interactive Elements

## Problem Statement

Icon-only buttons and links lack descriptive text for screen readers. The design audit identified icon-only buttons (X icons, external links) that have no labels or aria-label attributes.

## Findings

### Security Sentinel Agent (Accessibility Focus)
- **Location:** `DESIGN_AUDIT.md` - "Icon-only buttons unclear" noted as High severity
- Case Studies section has icon buttons without labels
- Social icons may lack proper labeling

### Kieran TypeScript Reviewer
- **Location:** `DESIGN_AUDIT.md:189-192` - shows proper pattern but may not be implemented
- Suggested fix includes `aria-label` but current implementation unknown

## Proposed Solutions

### Option A: Add aria-label to All Icon Buttons (Recommended)
**Description:** Every icon-only button gets descriptive aria-label

```tsx
// CaseStudiesSection.tsx
<button aria-label="View live site">
  <ExternalLinkIcon />
</button>

<button aria-label="View source code">
  <GitHubIcon />
</button>

<a href="..." aria-label="Read full case study about {projectName}">
  Read →
</a>
```

**Pros:**
- Screen reader accessible
- Simple implementation
- No visual changes

**Cons:**
- Must audit all icon buttons

**Effort:** Small (1-2 hours)
**Risk:** None

### Option B: Add Visible Labels
**Description:** Replace icon-only buttons with labeled buttons

```tsx
<button>
  <ExternalLinkIcon /> Live
</button>
```

**Pros:**
- Accessible to all users
- Clearer for sighted users too

**Cons:**
- Changes visual design
- May need layout adjustments

**Effort:** Medium (2-3 hours)
**Risk:** Low (design change)

## Technical Details

**Affected Files:**
- `src/components/sections/CaseStudiesSection.tsx` - evidence buttons
- `src/components/sections/AboutSection.tsx` - social icons
- `src/components/sections/FooterSection.tsx` - social icons (if duplicated)
- `src/components/sections/HeroSection.tsx` - any icon buttons

**Elements Needing Labels:**
- External link icons
- GitHub/code icons
- Social media icons
- Navigation arrows
- Close/dismiss buttons

## Acceptance Criteria

- [ ] All icon-only buttons have aria-label
- [ ] Labels are descriptive and unique
- [ ] Screen reader announces button purpose
- [ ] Tested with VoiceOver or similar

## Work Log

| Date | Action | Learnings |
|------|--------|-----------|
| 2026-01-09 | Created from design audit review | Icon buttons need text alternatives |

## Resources

- Security Sentinel Agent Report
- WAI-ARIA Authoring Practices
- WCAG 1.1.1 Non-text Content
