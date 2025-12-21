# Adding New Case Studies

This guide explains how to create and add new case studies to the portfolio.

## Quick Start

1. Create a new markdown file in `content/case-studies/`
2. Add YAML frontmatter with required metadata
3. Write your narrative content in Markdown
4. Add a thumbnail image to `public/images/`

## File Structure

Case studies are markdown files with YAML frontmatter:

```
content/case-studies/
├── 01-eth-staking.md
├── 02-protocol-integration.md
├── 03-xbox-royalties.md
└── 04-ankr-rpc.md
```

**Naming convention**: `{id}-{slug}.md` (e.g., `05-new-project.md`)

## Frontmatter Schema

```yaml
---
# Required: Identification
id: 5                           # Unique number, determines sort order
slug: my-project-slug           # URL-safe identifier
title: Project Title            # Display title
company: Company Name           # Company/client name
year: 2024                      # Year or range (e.g., "2023–24")
tags: [Tag1, Tag2, Tag3]        # Categories for filtering

# Required: Context
duration: 6 months              # Project duration
role: Product Manager           # Your role

# Required: Hook (displayed on cards and hero)
hook:
  headline: One sentence summary of impact  # ~100 chars max
  impactMetric:
    value: "10×"                # Primary metric value
    label: revenue growth       # Metric label (lowercase)
  subMetrics:                   # Optional, up to 2 additional metrics
    - value: "$1M"
      label: ARR
    - value: "50+"
      label: integrations
  thumbnail: /images/case-study-my-project.png  # Or null if no image

# Optional: External Links
demoUrl: https://example.com              # Live product link
githubUrl: https://github.com/...         # Source code
docsUrl: https://docs.example.com         # Documentation

# Optional: Media Links
media:
  - type: blog                  # blog | twitter | linkedin | video | article | slides
    url: https://...
    label: Launch Post          # Custom tooltip text (optional)
  - type: twitter
    url: https://twitter.com/...
    label: Launch Thread

# Required: CTA (call-to-action at end of case study)
cta:
  headline: Interested in similar work?
  subtext: I'd love to discuss your challenges.  # Optional
  action: calendly              # calendly | linkedin | contact (email)
  linkText: Let's talk →
---
```

## Markdown Content Structure

After the frontmatter (`---`), write your narrative in Markdown:

```markdown
---
[frontmatter here]
---

Opening hook paragraph - grab attention, set stakes.

## The Challenge

What problem needed solving? What constraints existed?

**Key constraints:**
- Constraint 1
- Constraint 2

## The Approach

Your hypothesis and strategy. Why this approach over alternatives?

### Alternatives Considered

| Option | Trade-offs | Why Not |
|--------|------------|---------|
| Option A | Pros/cons | Reason |
| Option B | Pros/cons | Reason |

## Key Decision

Highlight a critical decision point. Show your thinking.

> Quote or insight that emerged from this decision.

## Execution

### Phase 1: Discovery (X weeks)
- Action taken
- What you learned

### Phase 2: Build (X weeks)
- Key milestones
- Challenges overcome

## Results

- **Primary outcome** — Quantified impact
- **Secondary outcome** — Supporting metric
- **Tertiary outcome** — Additional value delivered

## What I Learned

**What worked:**
- Learning 1
- Learning 2

**What didn't:**
- Challenge faced
- How you'd do it differently

> Concluding insight or reflection.
```

## Adding Thumbnail Images

1. Create a 1200×900px image (4:3 aspect ratio)
2. Save as PNG or JPG to `public/images/case-study-{slug}.png`
3. Reference in frontmatter: `thumbnail: /images/case-study-{slug}.png`

**Tips:**
- Use consistent styling across thumbnails
- Include project context (UI screenshots, diagrams)
- Ensure readability in both light/dark modes

## Supported Markdown Features

- **Headings**: `## H2`, `### H3`
- **Bold/Italic**: `**bold**`, `*italic*`
- **Lists**: Ordered and unordered
- **Tables**: GFM table syntax
- **Blockquotes**: `> Quote text`
- **Code blocks**: Triple backticks with language
- **Inline code**: Single backticks
- **Links**: `[text](url)`
- **Images**: `![alt](url)`

## Validation

The content loader validates all case studies on build. Required fields:
- `id`, `slug`, `title`, `company`, `year`, `tags`
- `duration`, `role`
- `hook.headline`, `hook.impactMetric.value`, `hook.impactMetric.label`
- `cta.headline`, `cta.action`, `cta.linkText`
- `content` (markdown body must be >100 characters)

Invalid case studies will throw build errors with descriptive messages.

## Example: Minimal Case Study

```yaml
---
id: 5
slug: minimal-example
title: Minimal Example
company: Acme Corp
year: 2024
tags: [Example]
duration: 3 months
role: Product Manager

hook:
  headline: Brief description of what was achieved
  impactMetric:
    value: "2×"
    label: improvement
  thumbnail: null

cta:
  headline: Want to learn more?
  action: calendly
  linkText: Book a call →
---

This is the opening paragraph.

## The Challenge

Describe the problem.

## The Approach

Describe the solution.

## Results

- **Key result** — Impact achieved
```

## Testing Your Case Study

1. Run the dev server: `npm run dev`
2. Navigate to case studies section
3. Click your new case study card
4. Verify:
   - Card displays correctly (thumbnail, title, metrics)
   - Drawer opens with full content
   - Links and media buttons work (if added)
   - CTA links to correct destination
   - Navigation to prev/next works

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Case study not appearing | Check `id` is unique, file is `.md` |
| Build error: missing field | Add required field to frontmatter |
| Thumbnail not loading | Check path starts with `/images/` |
| Markdown not rendering | Ensure `---` separates frontmatter from content |
| Links not working | Verify URLs are complete (include `https://`) |
