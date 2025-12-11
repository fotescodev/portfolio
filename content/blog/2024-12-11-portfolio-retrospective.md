---
title: "Building at the Edge of Trust: A Portfolio Project Retrospective"
date: "2024-12-11"
excerpt: "A reflection on building a personal brand site with AI-assisted development—the wins, the stumbles, and what's next."
tags: ["Retrospective", "AI", "Engineering", "Design"]
thumbnail: null
---

# Building at the Edge of Trust: A Portfolio Project Retrospective

*A reflection on building a personal brand site with AI-assisted development—the wins, the stumbles, and what's next.*

---

## The Journey So Far

What started as a simple portfolio site became an exercise in **deliberate design**, **iterative refinement**, and the emerging practice of **human-AI pair programming**. Over 9 commits, we went from a blank React/Vite scaffold to a dark-mode-first, typography-driven personal brand that ships on ENS (dmitriif.eth.limo).

### Commit Timeline

| Commit | What We Built |
|--------|---------------|
| `d78ceed` | Initial portfolio implementation—React, TypeScript, Vite scaffold with blog modal system |
| `3551048` | GitHub Pages deployment setup |
| `64fc8fd` | LinkedIn profile URL fix |
| `64a62e7` | **Edge of Trust thumbnail generator**—HTML-based OG image with precise typography |
| `cad47ca` | OG image export for social previews |
| `2b163d4` | Fixed OG meta tags to use absolute URLs (social platforms require this) |
| `3c6aeb2` | Light mode toggle with smooth transitions |
| `4f1a73f` | Merged light mode feature via PR |
| `fc78ec5` | **LinkedIn background banner**—1584×396 with mobile-safe centered layout |

---

## What We Accomplished

### 1. **A Distinct Visual Identity**
- **Dark charcoal base** (`#08080a`)—not black, but almost
- **Instrument Sans + Instrument Serif** typography pairing—clean sans for hierarchy, elegant italic serif for personality
- **Gold accent** (`#c29a6c`)—derived from your selection highlight color, creating continuity
- **"Building at the edge of trust"**—a tagline that positions your work at the intersection of crypto, AI, and product management

### 2. **Social-Ready Assets**
Created two HTML-based generators that produce pixel-perfect exports:
- **OG Thumbnail** (1200×630)—for link previews on LinkedIn, Twitter, Slack
- **LinkedIn Banner** (1584×396)—mobile-safe centered layout with skills bar

### 3. **Technical Architecture**
- **React 19 + Vite 7**—modern stack with fast HMR
- **Markdown-based blog**—using `gray-matter` and `react-markdown` for content
- **CaseStudy data model**—rich structure for projects with metrics, testimonials, tech stacks
- **Theme context**—light/dark mode toggle with system preference detection

---

## Agent Reflections: What I Learned

Building alongside you, I made mistakes. Here's what stood out:

### ❌ Pitfall 1: Relative OG Image URLs
I initially set `og:image` to `/images/og-image.png`. When you reported the thumbnail wasn't updating on social platforms, I realized social crawlers need **absolute URLs**—they hit your URL from their servers and can't resolve relative paths.

**Self-correction:** Changed to `https://dmitriif.eth.limo/images/og-image.png` and documented why.

### ❌ Pitfall 2: Browser Screenshot Artifacts
When exporting the LinkedIn banner, my browser screenshot tool captured the macOS focus ring (that blue border). I tried multiple approaches—resizing the window, matching background colors—but couldn't eliminate it with my available tools.

**Self-correction:** Acknowledged the limitation and provided you with a **manual workaround** (DevTools → Capture node screenshot). Sometimes the right answer is knowing when to hand back control.

### ❌ Pitfall 3: Design Hierarchy Assumptions
When you said "make my name bigger," I almost made the rookie mistake of just increasing font size without considering **line length**. "Dmitrii Fotesco | Product Manager" at 88px would overflow awkwardly.

**Self-correction:** Proposed a **3-tier hierarchy** instead—splitting name, role, and tagline into distinct visual layers. This created breathing room and a natural reading flow.

### ✅ What Worked Well
- **Iterating in HTML/CSS first**—much faster than image generation tools, and gives you an editable source
- **Asking design questions back**—"What would make a recruiter click?" led to better decisions than just executing instructions
- **Sequential generation after rate limits**—when parallel image generation failed, falling back to one-at-a-time worked reliably

---

## The Codebase Today

```
portfolio/
├── src/
│   ├── components/
│   │   ├── Portfolio.tsx    # Main component (3062 lines—needs refactoring)
│   │   ├── Blog.tsx         # Blog listing
│   │   ├── BlogPostModal.tsx # Full post viewer
│   │   └── ThemeToggle.tsx  # Light/dark mode
│   ├── context/
│   │   └── ThemeContext.tsx
│   └── types/
├── content/
│   └── blog/                # Markdown posts
├── public/
│   ├── thumbnail-generator.html   # OG image source
│   └── linkedin-banner-generator.html
└── index.html               # SEO meta tags, font loading
```

### Technical Debt
- **Portfolio.tsx is 3062 lines**—contains all case study data inline. Should be split into data files + presentational components.
- **No case study detail pages**—everything is in modals. Loses SEO value and shareable URLs.
- **README is still default Vite template**—needs project-specific documentation.

---

## What's Next: A Prioritized Roadmap

Based on your ideas and the current state of the project, here's a prioritized backlog:

### Priority Matrix

| Priority | Initiative | Effort | Impact | Notes |
|:--------:|------------|:------:|:------:|-------|
| **P0** | Update case studies content | Low | High | Your current content is dated. Fresh case studies = fresh engagement. |
| **P1** | Card-based project portfolio | Medium | High | Replace modal-only view with scannable cards. Better UX for "lots of projects." |
| **P1** | Extract case study data to JSON/YAML | Medium | Medium | Prerequisite for Remix feature. Makes content portable. |
| **P2** | Add metrics dashboard | Low | Medium | Track what matters: page views, time on case studies, link clicks. |
| **P2** | Case study detail pages (not modals) | Medium | Medium | SEO-friendly, shareable URLs for each project. |
| **P3** | **"Remix" feature for community** | High | Very High | Allow others to fork + personalize with their resume/photo/case studies. |
| **P3** | Resume/photo upload flow | High | High | Part of Remix—AI-assisted content ingestion. |
| **P4** | Refactor Portfolio.tsx | Medium | Low | Technical health, but not user-facing. |

### Metrics to Track

| Metric | Why It Matters |
|--------|----------------|
| **Unique visitors** | Top of funnel—is the link getting clicked? |
| **Time on page** | Are people reading or bouncing? |
| **Case study opens** | Which projects resonate? |
| **Outbound link clicks** | LinkedIn, GitHub, email—conversion intent |
| **Scroll depth** | How far do people get before leaving? |
| **Source attribution** | Which channel drives quality traffic? |

Consider lightweight analytics like **Plausible** or **Fathom**—privacy-friendly, no cookie banners needed.

---

## The Remix Vision

You want to give back to the job-seeking community. Here's a rough sketch of what the Remix feature could look like:

### User Flow
1. **Fork button** on your live site
2. User lands on a **configuration wizard**:
   - Upload resume (PDF/DOCX)
   - Upload headshot
   - Paste LinkedIn URL (optional, for scraping public data)
3. **AI processes inputs**:
   - Extracts name, title, experience
   - Suggests tagline based on resume content
   - Generates case study stubs from job history
4. **Preview** the generated portfolio
5. **Deploy** to Vercel/GitHub Pages with one click

### Technical Requirements
- Move case study data to portable format (JSON/YAML)
- Create a `/remix` route with the wizard
- Build resume parser (PDF.js + LLM extraction)
- Headshot processing (crop, optimize)
- Deploy integration (Vercel API / GitHub Actions)

This is a **P3 initiative**—high effort, very high impact—but requires the P1 data extraction work first.

---

## Final Thoughts

What I've learned working with you:

1. **Design is iteration, not specification.** We didn't start with a perfect brief. We started with "make a thumbnail" and refined through conversation.

2. **Constraints breed creativity.** The dark background, specific fonts, and gold accent weren't limitations—they were the foundation that made every decision easier.

3. **Know when to hand off.** I can generate HTML, write code, and capture screenshots—but when the browser's focus ring pollutes the export, the right move is to explain the workaround and let you take it from here.

4. **Recruiters are scanners.** Every visual decision—bigger Product Management text, visible skills, prominent name—is about **reducing time to recognition**.

Building at the edge of trust, indeed.

---

*Written as a retrospective on December 11, 2024.*
