---
title: "Building at the Edge of Trust: A Portfolio Project Retrospective"
date: "2024-12-11"
excerpt: "A reflection on building a personal brand site with AI-assisted development—the wins, the stumbles, and what's next."
tags: ["Retrospective", "AI", "Engineering", "Design"]
thumbnail: null
---

# Building at the Edge of Trust: A Portfolio Retrospective

*A collaboration between [User] and Antigravity Agent*

## Switching Gears: Reflecting on the Journey

We've reached a significant milestone. What started as a goal to "build a portfolio" evolved into a deep dive into personal branding, tool creation, and exploring the boundaries of Agent-Human collaboration. This document serves as a retrospective on what we've built, the specific hurdles we overcame (and how), and where we're going next.

## Goals Attained

Looking back at our commit history and deployed assets, we've achieved several key objectives:

*   **A "Wow" Factor Portfolio**: We moved beyond a basic resume site to a dynamic, visually engaging portfolio with smooth transitions, glassmorphism effects, and a premium fail (Light/Dark mode).
*   **Unified Branding**: We established the "Edge of Trust" tagline and visual identity, ensuring it permeates not just the site, but your external profiles too.
*   **Custom Asset Generators**: Instead of relying on static, hard-to-edit images, we built:
    *   **LinkedIn Banner Generator**: A dedicated HTML tool to render your high-def background.
    *   **Thumbnail Generator**: A tool to create perfect Open Graph images for social sharing.
*   **Technical Polish**: We tackled SEO basics, semantic HTML, and accessibility (aria labels, contrast).

## The "Agentic" Experience: Challenges, Pitfalls, and Solutions

This leverage of an AI Agent wasn't without its friction points. Reflecting on our "self-corrections," two major themes emerged regarding how we handled Agent limitations.

### 1. The "Blue Hue" & Color Fidelity
**The Pitfall**: Early in our design phase, we struggled with color accuracy. I (the Agent) would generate or suggest colors that were *mathematically* close but visually off-brand (the "blue hue" issue) when rendered in different contexts or exports.
**The Solution**: We moved away from "trusting the output" blindly to "verifying the code." We hard-coded the exact HSL/Hex values into CSS variables (`--primary`, `--accent`) and ensured that our asset generators used these *exact* variables rather than improved approximations.
**Lesson**: *Consistency requires a Single Source of Truth (CSS variables) that both the site and the asset generators consume.*

### 2. The "Quota" Wall & The Tool-Builder Shift
**The Pitfall**: You asked for high-quality image assets. I hit an internal wall: my image generation tools have quotas and resolution limits that couldn't match the crisp, retina-ready quality you needed for a professional LinkedIn banner. I couldn't "just send you the file."
**The Solution**: We pivoted. Instead of acting as the **Manufacturer** (making the image), I acted as the **Engineer** (building the machine). I wrote the `linkedin-banner-generator.html` code so *you* could run it legally on your machine, render the `<div element>`, and capture it at infinite resolution.
**Lesson**: *When the Agent hits a resource ceiling, the best move is to build a tool that empowers the User to bypass that ceiling.*

### 3. The "Relative Path" Trap
**The Pitfall**: Our initial Open Graph (OG) images were broken on social media because we used relative paths (`/images/me.png`).
**The Solution**: We quickly identified this via deployment checks and switched to absolute URLs, ensuring the preview card renders correctly on LinkedIn/Twitter.

## Lessons Learned & What Not To Do

Based on our analysis, here is a clear guide on how to navigate Agent-Human collaboration effectively:

### Lessons Learned
*   **Single Source of Truth is Mandatory**: Define your design tokens (colors, fonts, spacing) in one place (CSS variables) and force every tool or component to Reference them. Never hard-code values in multiple places.
*   **Agents Build Tools, Humans Verify Output**: When precise creative control is needed, don't ask the Agent to *produce* the final asset. Ask the Agent to *build the studio* (the tool/generator) so you can produce the asset with infinite tweaks.
*   **The "Div" De-Risk**: If you can render it in a browser `<div>`, you can export it. This is always superior to Model-generated images for text-heavy or layout-heavy graphics because it remains editable.

### What Not To Do
*   **❌ Do NOT Trust "Close Enough" Colors**: LLMs approximate colors. Never accept "a nice shade of blue." Always demand or provide the specific Hex/HSL code.
*   **❌ Do NOT Rely on Agent Quotas for Production Assets**: If you need a 4K banner, don't ask the chat interface to generate it (it will compress it). Ask for a script that generates it locally on your machine.
*   **❌ Do NOT Use Relative Paths for Social Media**: When setting `og:image` tags, never use `/assets/image.png`. It will fail on Twitter/LinkedIn. Always use the full deployment domain `https://yoursite.com/assets/image.png`.

## What's Next: A Prioritized Roadmap

We have a solid foundation, but a product is never finished. Here is the prioritized table for the next phase of development:

| Priority | Feature | Description | Why? |
| :--- | :--- | :--- | :--- |
| **P0** | **Remix & Community** | Add a "Remix this Portfolio" button and instructions. | **Give Back.** Allow job seekers to ingest their resume/photo and spin up a high-quality version of this site easily. |
| **P1** | **Case Study Content** | Update text & visuals inside existing case studies. | Content is king. The shell is beautiful, now the story needs to match. |
| **P2** | **Card View 2.0** | Redesign the projects section into a dense, user-friendly card grid. | You have "lots of projects" to add; the current layout may not scale well for density. |
| **P3** | **Metrics Strategy** | Implement meaningful analytics (not just pageviews). | **Measure Impact.** Focus on: *Time on Case Study*, *Resume Download Conversions*, and *Outbound Link Clicks(LinkedIn)*. |

## Conclusion

We've built more than a website; we've built a system for your personal brand. By solving the "Agent limitations" through collaborative tool-building, we've actually created a more robust setup—you now own the generators, not just the JPEGs.

**Ready to start on P0: The Remix Button?**
