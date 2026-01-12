# Design Audit: Warm Industrial Gray Theme

**Date**: January 9, 2026
**Context**: Light mode palette updated to warm industrial gray (#EBEBE8). Previous "noisy" elements (marquee, noise overlay, grid lines) removed after user feedback. This audit focuses on refining each section to feel cohesive with the new palette.

---

## Current State

### What Was Changed
- Light mode background: `#EBEBE8` (warm industrial gray)
- Light mode accent: `#8a6642` (darkened gold for contrast)
- Supporting stone tones for text hierarchy

### What Was Kept
- Instrument Serif + Sans typography
- Editorial italic headline style
- Gold/bronze brand accent
- Ambient orb background (subtle, not removed)

---

## Section-by-Section Analysis

### 1. Hero Section

**Screenshot**: `audit-01-hero.png`

**Strengths:**
- Editorial italic headline is distinctive and brand-forward
- Gold accent on "trust" creates focal point
- Clean hierarchy: status → headline → subheadline → CTAs

**Issues:**
| Problem | Severity | Location |
|---------|----------|----------|
| CTA buttons disconnected from content | High | Right side floats with excessive whitespace |
| Eyebrow letter-spacing too tight | Medium | `letterSpacing: '0.1em'` feels cramped |
| No visual transition to About | Low | Abrupt section break |

**Fixes:**
```tsx
// HeroSection.tsx - Move CTAs below subheadline or reduce gap
// Consider: flexDirection: 'column' for content + CTAs together

// Eyebrow: Use .eyebrow CSS class (IMPLEMENTED in globals.css)
<span className="eyebrow">{status}</span>

// .eyebrow class includes:
// - fontSize: 11px
// - fontWeight: 600
// - letterSpacing: 0.15em
// - textTransform: uppercase
// - color: var(--color-text-muted)
```

**Add section divider:**
```tsx
// After hero section, before About
<div style={{
  height: '1px',
  background: 'var(--color-border-light)',
  margin: '0 var(--layout-padding-x)'
}} />
```

---

### 2. About Section

**Screenshot**: `audit-02-about.png`, `audit-03-experience.png`

**Strengths:**
- Photo placement is clean
- Social icons appropriately subtle
- Stats (8+, 5, 6) create visual interest

**Issues:**
| Problem | Severity | Location |
|---------|----------|----------|
| Two-column text awkward to read | High | User jumps columns mid-thought |
| Stats numbers don't pop | Medium | Same weight as labels |
| Inconsistent spacing to Experience | Low | Gap feels arbitrary |

**Fixes:**
```tsx
// AboutSection.tsx - Single column bio
<p style={{
  maxWidth: '65ch', // optimal reading width
  // Remove the two-column grid
}}>

// Stats - add accent color to numbers
<span style={{
  color: 'var(--color-accent)', // gold numbers
  fontSize: '48px'
}}>8+</span>
```

---

### 3. Experience Section

**Screenshot**: `audit-05-experience.png`

**Strengths:**
- Left-aligned dates create scannable timeline
- Arrow bullets (→) are consistent
- Company logos add credibility

**Issues:**
| Problem | Severity | Location |
|---------|----------|----------|
| Bullet text too long, hard to scan | High | Lines run 100+ characters |
| Tags cluttered, low contrast | High | Border-only, small padding |
| All roles look identical | Medium | No visual hierarchy between companies |
| Company logos inconsistent sizes | Low | Some taller than others |

**Fixes:**
```css
/* globals.css - Unified tag styling (IMPLEMENTED) */
.tag {
  background: var(--color-background-tertiary);
  color: var(--color-text-secondary);
  padding: 6px 12px;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  border-radius: 2px;
  border: none;
}
```

```tsx
// ExperienceSection.tsx - Use .tag class and .bullet-list utility
<span className="tag">STAKING</span>

// Cap bullet width with utility class
<ul className="bullet-list">
  <li>...</li>
</ul>
```

**Tag limit:** Show max 4 tags per role. Current has 5+ on some.

**Add role separation:**
```tsx
// Add subtle divider between roles
<div style={{
  height: '1px',
  background: 'var(--color-border-light)',
  margin: '32px 0'
}} />
```

---

### 4. Credentials Section

**Issues:**
| Problem | Severity | Location |
|---------|----------|----------|
| Cards feel flat | Medium | No depth or hover state |
| "Verify ↗" link is subtle | Low | Could be more prominent |

**Fixes:**
```css
/* globals.css - Use light-card class for shadows */
[data-theme="light"] .light-card {
  box-shadow: var(--shadow-card);
}

/* Add card-hover class for hover state */
.card-hover:hover {
  border-left: 3px solid var(--color-accent);
}
```
```tsx
// CertificationsSection.tsx - Apply classes
<article className="light-card card-hover">
```

---

### 5. Case Studies (Selected Work)

**Screenshot**: `audit-06-cases.png`

**Strengths:**
- Dark thumbnails contrast well against warm gray
- Metric callouts (200+, 15×, 99%) are prominent
- "Read more →" affordance is clear

**Issues:**
| Problem | Severity | Location |
|---------|----------|----------|
| Icon-only buttons unclear | High | X icons with no labels |
| Cards feel flat | Medium | No hover state visible |
| Inconsistent button groupings | Medium | Mempools vs Ankr patterns differ |

**Fixes:**
```tsx
// Standardize evidence buttons - all get labels OR all get tooltips
// Option 1: Labeled buttons for all
<button>Live</button>
<button>Code</button>
<button>Docs</button>

// Option 2: Icon-only with tooltips
<button title="View live site" aria-label="View live site">
  <ExternalLinkIcon />
</button>
```

**Card hover state:**
```css
/* Use CSS class for hover - see globals.css */
.card-hover {
  transition: all 0.2s ease;
}
.card-hover:hover {
  border-left: 3px solid var(--color-accent);
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
}
```
```tsx
// CaseStudiesSection.tsx - Apply class
<article className="card-hover light-card">
```

---

### 6. Testimonials (References)

**Screenshot**: `audit-07-testimonials.png`

**Strengths:**
- Italic quote styling feels editorial
- Attribution format is clean

**Issues:**
| Problem | Severity | Location |
|---------|----------|----------|
| Quote mark too prominent | High | Large " draws eye from content |
| Card borders feel boxy | Medium | Breaks editorial flow |
| Two columns cramped | Medium | Medium viewports suffer |
| Avatar initials feel cold | Low | HS, PB without photos |

**Fixes:**
```css
/* globals.css - Quote mark utilities (IMPLEMENTED) */
.quote-mark {
  font-family: var(--font-serif);
  font-size: 54px;
  line-height: 1;
  color: var(--color-accent);
  opacity: 0.3;
}

.quote-mark-subtle {
  /* Same as above but opacity: 0.18 for desktop */
  opacity: 0.18;
}
```

```tsx
// TestimonialsSection.tsx - Use TestimonialCard component (IMPLEMENTED)
import TestimonialCard from '../common/TestimonialCard';

// Single column layout
<div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
  {testimonials.map((t, i) => (
    <TestimonialCard
      key={i}
      quote={t.quote}
      author={t.author}
      role={t.role}
      company={t.company}
      variant="desktop"
    />
  ))}
</div>
```

---

### 7. Blog/Insights Section

**Screenshot**: `audit-08-blog.png`

**Strengths:**
- Date + read time metadata useful
- Tags provide categorization
- Section header typography matches brand

**Issues:**
| Problem | Severity | Location |
|---------|----------|----------|
| Post cards utilitarian | Medium | No visual interest beyond text |
| "Read →" detached | Medium | Too far right from content |
| Tags inconsistent with Experience | Low | Different sizing/spacing |

**Fixes:**
```tsx
// Add top border to posts
<article style={{
  borderTop: '1px solid var(--color-border-light)',
  paddingTop: '24px'
}}>

// Move "Read →" inline after excerpt
<p>
  {excerpt}
  <a style={{ marginLeft: '8px' }}>Read →</a>
</p>

// Match tag styling to Experience section tags
// Same padding, same background treatment
```

---

### 8. CTA Section ("Let's build")

**Screenshot**: `audit-09-footer.png`

**Strengths:**
- Large italic headline is bold and inviting
- Centered layout focuses attention
- Button trio is clear

**Issues:**
| Problem | Severity | Location |
|---------|----------|----------|
| Excessive whitespace | Medium | Feels empty not intentional |
| Social icons disconnected | Low | Random row below buttons |
| Button hierarchy unclear | Low | "Book Time" has accent, others don't |

**Fixes:**
```tsx
// Reduce section padding
padding: 'var(--space-2xl) var(--space-lg)' // was var(--space-3xl)

// Equal button treatment - all secondary style
// OR remove social icons here (they're in About)
```

---

### 9. Footer

**Screenshot**: `audit-09-footer.png`

**Strengths:**
- Minimal and clean
- "Designed and built by Dmitrii" is subtle

**Issues:**
| Problem | Severity | Location |
|---------|----------|----------|
| Too minimal, feels forgotten | Low | No brand anchor |

**Fixes:**
```tsx
// Add top border
<footer style={{
  borderTop: '1px solid var(--color-border-light)',
  // ...existing styles
}}>
```

---

## Global Design System Refinements

> ✅ **Status**: All patterns below have been implemented in `src/styles/globals.css`

### Section Dividers ✅
```css
/* globals.css - IMPLEMENTED */
.section-divider {
  height: 1px;
  background: var(--color-border-light);
  margin: 0 var(--layout-padding-x);
}
```

### Tag Styling (Unified) ✅
```css
/* globals.css - IMPLEMENTED */
.tag {
  background: var(--color-background-tertiary);
  color: var(--color-text-secondary);
  padding: 6px 12px;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  border-radius: 2px;
  border: none;
}
```

### Card Hover Pattern ✅
```css
/* globals.css - IMPLEMENTED */
.card-hover {
  transition: all 0.2s ease;
}
.card-hover:hover {
  border-left: 3px solid var(--color-accent);
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
}
```

### Eyebrow Pattern ✅
```css
/* globals.css - IMPLEMENTED */
.eyebrow {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-text-muted);
}
```

### Quote Mark Pattern ✅
```css
/* globals.css - IMPLEMENTED */
.quote-mark { opacity: 0.3; }        /* Mobile */
.quote-mark-subtle { opacity: 0.18; } /* Desktop */
```

### Spacing Constants
| Element | Value |
|---------|-------|
| Between sections | `64px` (var(--space-2xl)) |
| Within sections | `32px` (var(--space-lg)) |
| Between items | `24px` (var(--space-md)) |

---

## Implementation Priority

### Phase 1: High Impact ✅ COMPLETE
1. ✅ **Experience tags** - Unified `.tag` class with solid fill
2. ✅ **Experience bullets** - `.bullet-list` utility class
3. ✅ **Section dividers** - `.section-divider` class
4. ✅ **Testimonials** - `TestimonialCard` component, `.quote-mark` classes

### Phase 2: Medium Impact ✅ COMPLETE
5. ✅ **Case Studies cards** - `.card-hover` class for hover state
6. ✅ **Blog posts** - Borders and inline "Read →"
7. ✅ **About section** - Single column bio

### Phase 3: Polish (Partial)
8. ⏳ **Hero CTAs** - Layout adjusted, could improve further
9. ✅ **Footer** - Top border added
10. ⏳ **CTA section** - Whitespace is intentional for breathing room

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/styles/globals.css` | Tag styles, card hover, section divider class |
| `src/components/sections/ExperienceSection.tsx` | Bullet width, tag limit, role dividers |
| `src/components/sections/TestimonialsSection.tsx` | Single column, subtle quotes |
| `src/components/sections/CaseStudiesSection.tsx` | Card hover states |
| `src/components/sections/BlogSection.tsx` | Post borders, inline links |
| `src/components/sections/HeroSection.tsx` | CTA positioning, eyebrow spacing |
| `src/components/sections/FooterSection.tsx` | Top border |
| `src/components/Portfolio.tsx` | Section dividers between components |

---

## Screenshots Reference

All audit screenshots saved to: `.playwright-mcp/`
- `audit-01-hero.png`
- `audit-02-about.png`
- `audit-05-experience.png`
- `audit-06-cases.png`
- `audit-07-testimonials.png`
- `audit-08-blog.png`
- `audit-09-footer.png`

---

## Next Session Prompt

Copy this to resume work:

```
Continue implementing the design audit from DESIGN_AUDIT.md. Start with Phase 1:
1. Experience section tags - solid fill background, 6px 12px padding, max 4 tags per role
2. Experience bullets - max-width 600px
3. Add section dividers (1px var(--color-border-light)) between major sections
4. Testimonials - single column layout, quote marks at 0.3 opacity

The warm industrial gray palette is already in place. Focus on spacing, tag styling, and visual rhythm.
```
