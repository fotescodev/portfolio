# LinkedIn Content Plan: January 2025

> **Goal**: Share the journey from "I need a portfolio" to "I accidentally built an AI eval stack"
> **Duration**: January 6-19, 2025 (2 weeks)
> **Cadence**: 1 article every other day (~7 articles) + 1 short post daily (~14 posts)

---

## The Origin Story (Use This in Content)

**The Setup**: Lost my job. Meanwhile, taking an AI certification course ("Building AI Features for Product Managers" by Migdad Jafar, PM @ OpenAI).

**The Idea**: "I need a portfolio website anyway. What if I made it my capstone project too?"

**The Pivot**: Simple portfolio → Universal CV system that tailors content to specific job descriptions using AI.

**The Evolution**:
1. Build portfolio website (the "what")
2. Add AI-powered variant generation (the "AI feature")
3. Realize AI can hallucinate metrics (the "oh no")
4. Build eval pipeline to verify claims (the "quality gate")
5. Build red-team pipeline to catch tone/safety issues (the "defense")
6. Ship 17 variants, 21 skills, 210 tests (the "accidental product")

**The Current State**: Skeleton is functional. Can generate solid variants. Still needs human oversight, more evals, red-team polish. Work in progress.

**The Meta-Lesson**: The best capstone projects solve your own problems.

---

## Content Pillars

| Pillar | Theme | Audience Hook |
|--------|-------|---------------|
| 🏗️ **The Build** | What I built and why | "Here's what happens when a PM builds their own portfolio" |
| 🧠 **The Learnings** | Technical insights & patterns | "I learned this the hard way so you don't have to" |
| 🔥 **The Pitfalls** | Mistakes and recoveries | "Everything was on fire. Here's how I put it out." |
| 🤖 **The AI Angle** | Claude, prompts, evals | "I taught an AI to red-team my resume" |
| 📊 **The Research** | Evidence-based decisions | "Recruiters spend 7 seconds. I have data." |

---

## Week 1: January 6-12

### Monday, Jan 6

**📝 ARTICLE: "I Lost My Job, Built a Portfolio, and Accidentally Created an AI Eval Stack"**

*Hook*: "I just wanted a website. Three weeks later, I had a red-team pipeline."

*Content*:
- **The Setup**: Lost my job while taking an AI certification course (Migdad Jafar, PM @ OpenAI)
- **The Idea**: "What if my portfolio was also my capstone project?"
- **The Build**: Universal CV — AI generates job-tailored portfolio variants
- **The Problem**: AI wrote beautiful lies about my career (metrics I couldn't verify)
- **The Solution**: Claims ledger (eval) + adversarial scanning (red-team)
- **What I Learned**:
  - "Trust but verify" is the only way to use AI for job search
  - Quality gates aren't paranoia—they're professionalism
  - The best capstone projects solve your own problems
- **Where I Am Now**: 17 variants, 21 skills, 210 tests, still iterating

*CTA*: "What would you build if you had 3 weeks and needed a job?"

---

**📱 POST: The Origin Story**

> I lost my job.
>
> Meanwhile, I was taking an AI certification course.
>
> I needed a portfolio.
> I needed a capstone project.
>
> "What if they were the same thing?"
>
> 3 weeks later:
> • Portfolio website → Universal CV system
> • Simple variants → AI-powered generation
> • Generated content → Quality pipeline
> • Red-team scanning → BS detection
>
> 17 job-targeted variants. 21 automation skills. 210 tests.
>
> The best projects solve your own problems.
>
> (Still a work in progress. But functional.)

---

### Tuesday, Jan 7

**📱 POST: The 7.4-Second Reality Check**

> I spent a month building the perfect portfolio.
>
> Then I learned recruiters spend 7.4 seconds looking at it.
>
> That's not a typo. 7.4 seconds.
>
> So I rebuilt everything around one question:
> "Can they find what matters in 7 seconds?"
>
> F-pattern scanning. Big Six elements. Metrics in the first 10 words.
>
> Your portfolio isn't a novel. It's a billboard on a highway.
>
> (Research source: TheLadders eye-tracking study, n=30 recruiters)

---

**📱 POST: The Knowledge Base Epiphany**

> Plot twist: The hardest part of building an AI-powered portfolio wasn't the AI.
>
> It was answering the question: "What are my actual facts?"
>
> • 15x revenue growth → Did I actually measure this?
> • Zero slashing incidents → Over what time period?
> • Shipped SDK → What was the adoption rate?
>
> So I built a "Knowledge Base" — a YAML file of ONLY verified achievements.
>
> Now when AI generates content, it can ONLY reference things I can prove.
>
> Revolutionary concept: Tell the truth. But make it systematic.

---

### Wednesday, Jan 8

**📝 ARTICLE: "From Portfolio Website to Eval Stack: An Accidental PM Journey"**

*Hook*: "I just wanted a website. I ended up building a quality assurance pipeline."

*Content*:
- Timeline of the evolution (simple site → variants → knowledge base → eval → redteam)
- The moment I realized I was scope-creeping myself
- Why PMs can't help but productize everything
- The architecture diagram: Source Data → Knowledge Base → Variants → Quality Gates → Deploy
- Honest reflection: Was this over-engineering or good engineering?

*Humor angle*: "Week 1: 'I'll just use a template.' Week 4: 'I need a claims verification ledger.'"

*CTA*: "Have you ever accidentally built something 10x bigger than planned?"

---

**📱 POST: The Variant System**

> One resume doesn't fit all jobs.
>
> But maintaining 17 different resumes? Nightmare.
>
> My solution: A "variant" system.
>
> Base profile + job-specific overrides = tailored portfolio
>
> bloomberg-technical-product-manager.yaml
> stripe-crypto.yaml
> anthropic-ai-safety-fellow.yaml
>
> Each one:
> ✅ Pulls from the same knowledge base
> ✅ Gets verified against real achievements
> ✅ Runs through red-team scans
> ✅ Deploys to its own URL
>
> edgeoftrust.com/bloomberg/technical-product-manager
>
> Recruiters see a tailored story. I see a single source of truth.

---

### Thursday, Jan 9

**📱 POST: The "Sycophancy" Problem**

> AI has a problem: It REALLY wants to make you sound amazing.
>
> "Passionate visionary leader who revolutionized..."
>
> 🚩 Red flag. Recruiters hate this.
>
> My red-team pipeline scans for:
> • "Dream company" / "thrilled" / "excited"
> • Excessive superlatives
> • Unearned enthusiasm
>
> FAIL: "I'm incredibly passionate about this opportunity"
> PASS: "Built staking infrastructure serving $2B+ in assets"
>
> Facts > Feelings. Always.

---

### Friday, Jan 10

**📝 ARTICLE: "21 Claude Code Skills Later: What I Learned About Prompt Engineering"**

*Hook*: "I wrote 6,000+ lines of prompts. Most of them were wrong the first time."

*Content*:
- What are "skills" in Claude Code? (Reusable prompts with context)
- My skill taxonomy: Content management, Generation, Quality, Utility
- The XML structure pattern that finally worked
- Top 3 prompting mistakes I made:
  1. Being too vague about output format
  2. Not including examples
  3. Forgetting to define failure modes
- The "gandalf-the-prompt" skill: An AI that audits other AI prompts

*Humor angle*: "Yes, I built an AI to judge my prompts. It was brutally honest."

*CTA*: "What's your favorite/worst prompting hack?"

---

**📱 POST: The Pre-Generation Insight**

> Hot take: The best AI optimization is doing less AI.
>
> I was burning tokens having Claude analyze job descriptions.
>
> Then I realized: 60% of JD requirements are generic fluff.
>
> "Excellent communication skills"
> "Team player"
> "Fast-paced environment"
>
> So I built a DETERMINISTIC pre-filter.
> 47 generic phrases → auto-filtered before AI sees them.
>
> Result: 60% fewer tokens. Better signal. Faster generation.
>
> Don't use AI for things regex can solve.

---

### Saturday, Jan 11

**📱 POST: The Bundle Size Wake-Up Call**

> My portfolio was 476KB.
>
> For a SINGLE PAGE SITE.
>
> Loading on mobile? Pain.
>
> Solution: Code splitting
>
> Before: Everything loads at once
> After: Only load what you see
>
> Results:
> • Index chunk: 53KB
> • React vendor: 142KB
> • Motion library: 138KB (on-demand)
> • Markdown: 267KB (only when viewing blog)
>
> 59% reduction. 195KB initial load.
>
> Performance isn't a feature. It's table stakes.

---

### Sunday, Jan 12

**📝 ARTICLE: "The Claims Ledger: How I Stopped AI From Lying About My Career"**

*Hook*: "AI wrote that I '10x'd revenue.' I actually 15x'd it. Both are wrong without proof."

*Content*:
- The problem: AI generates plausible-sounding metrics that may or may not be true
- The solution: Every claim must have a source in the knowledge base
- How the claims ledger works:
  1. Extract all metric-like claims from generated content
  2. Match against knowledge base facts
  3. Score each claim (1-5)
  4. Generate human verification checklist
- Real example: Walking through a claims.yaml file
- The "trust score" concept for variants

*Humor angle*: "I built a lie detector for my own resume. What has my life become?"

*CTA*: "What claims on your resume could you actually prove?"

---

**📱 POST: The "Source of Truth" Architecture**

> Architecture lesson from building 17 portfolio variants:
>
> YAML is for humans. JSON is for machines.
>
> My pattern:
> 1. Humans edit YAML (readable, commentable)
> 2. Script syncs YAML → JSON (validated, typed)
> 3. App consumes JSON (fast, typed)
>
> Why?
> • YAML has better merge conflict resolution
> • Humans don't make JSON syntax errors
> • Validation happens at sync time, not runtime
>
> `npm run variants:sync`
>
> If YAML and JSON drift? Build fails.
>
> Single source of truth or bust.

---

## Week 2: January 13-19

### Monday, Jan 13

**📝 ARTICLE: "What Eye-Tracking Research Taught Me About Portfolio Design"**

*Hook*: "I read 37 pages of academic research so my portfolio could survive 7.4 seconds of scrutiny."

*Content*:
- The F-pattern: Where recruiters actually look (top-left dominates)
- The "Big Six" elements that must be visible instantly
- Why dense paragraphs get "almost no view"
- The 77% rejection rate for typos (Ghent University study, n=445)
- How I applied this:
  - Metrics in first 10 words of each bullet
  - Left-aligned, bolded job titles
  - 3-4 bullets max per role
- Before/after comparison of my experience section

*Research flex*: TheLadders 2018, Texas A&M ML study, Nielsen Norman Group

*CTA*: "Does your resume pass the F-pattern test?"

---

**📱 POST: The Testing Regression Nightmare**

> Day 1: "I'll just add this TUI dashboard"
> Day 2: 7 test suites failing
>
> The culprit? React 19 + Testing Library incompatibility.
>
> Not my code. The ecosystem.
>
> Lessons:
> 1. Always run tests before AND after PRs
> 2. Pin your React versions (react & react-dom)
> 3. Test regressions are information, not failures
>
> Fixed it by updating testing-library and pinning versions.
>
> 210 tests passing. Sleep restored.

---

### Tuesday, Jan 14

**📱 POST: The Skill Refactoring Journey**

> My "serghei-qa" skill was 805 lines.
>
> It worked. But it was a monster.
>
> After refactoring: 283 lines.
>
> Same functionality. 65% smaller.
>
> The secret? XML structure.
>
> Before: Prose with embedded instructions
> After: <purpose>, <when_to_activate>, <workflow>
>
> Claude parses structure better than paragraphs.
>
> Your prompts are code. Refactor them like code.

---

### Wednesday, Jan 15

**📝 ARTICLE: "The Pitfalls: 5 Things That Almost Broke My AI Portfolio Project"**

*Hook*: "Everything was on fire at least three times. Here's the fire extinguisher guide."

*Content*:

1. **The Hallucination Spiral**
   - AI generated metrics I couldn't verify
   - Solution: Knowledge base as source of truth

2. **The Bundle Bloat**
   - 476KB for a single page
   - Solution: Code splitting, lazy loading

3. **The Test Regression**
   - React 19 broke Testing Library
   - Solution: Version pinning, patience

4. **The Sycophancy Creep**
   - AI made everything sound desperate
   - Solution: Red-team scanning for tone

5. **The Scope Explosion**
   - "Just a portfolio" became a full pipeline
   - Solution: Embrace it? (Still processing)

*Humor angle*: "I'm not saying I cried into my keyboard. I'm saying my keyboard needed cleaning."

*CTA*: "What's your biggest 'everything is broken' moment?"

---

**📱 POST: The Inline Style Debt**

> Technical debt counter: 324 inline styles
>
> `style={{ color: 'var(--color-text-primary)' }}`
>
> I know. I KNOW.
>
> But here's the thing: They work.
>
> And I have 17 variants to ship, a job to find, and limited time.
>
> Sometimes good enough IS good enough.
>
> The refactor is on the roadmap. The roadmap is long.
>
> Ship first. Refactor later. (Just document the debt)

---

### Thursday, Jan 16

**📱 POST: The First-Time User Test**

> I built a skill called "first-time-user"
>
> It simulates someone who's NEVER seen the project before.
>
> Rules:
> • Only follow documentation
> • No assumptions from code knowledge
> • Report every friction point
>
> Result: UX audit reports with specific fixes.
>
> Current score: 8.5/10
>
> You'd be amazed what you miss when you're too close to the code.
>
> Your docs are your product. Test them like code.

---

### Friday, Jan 17

**📝 ARTICLE: "Why I Treat My Resume Like Production Code"**

*Hook*: "My resume has a CI/CD pipeline. I'm not even joking."

*Content*:
- The parallel between software quality and resume quality
- My "quality gates":
  1. Schema validation (Zod)
  2. Claims verification (eval)
  3. Adversarial scanning (redteam)
  4. Sync validation (YAML→JSON)
- Why recruiters are like linters: Reject on first error
- The test suite for my content: 210 tests
- How `npm run build` enforces quality

*Philosophy*: "If I can automate quality checks for code, why not for my career narrative?"

*CTA*: "What would a 'test suite' for your resume include?"

---

**📱 POST: The "Hired-on-Sight" Standard**

> My design target: 9/10 polish
>
> Not 10/10. That's perfectionism.
>
> 9/10 is "hired-on-sight" — good enough that design doesn't create friction.
>
> Current status:
> • Design fidelity: 8.5/10
> • Light mode: Complete
> • Dark mode: Complete
> • Mobile: Complete
> • Performance: 195KB
>
> The gap? Trust Battery testimonials (deferred) and scroll-driven storytelling (deferred).
>
> Scope is a feature. Know what to defer.

---

### Saturday, Jan 18

**📱 POST: The Sprint-Sync Skill**

> I built a skill that simulates a cross-functional leadership team.
>
> "sprint-sync" generates perspectives from:
> • PM (product priorities)
> • Designer (UX debt)
> • Architect (technical patterns)
> • Engineer (implementation reality)
>
> Why? Context switching is expensive.
>
> One command gives me a 360° status update.
>
> AI as a multiplier for self-awareness. Not just a code generator.

---

### Sunday, Jan 19

**📝 ARTICLE: "The Capstone Reflection: What Building an AI Portfolio Taught Me About Product"**

*Hook*: "I accidentally built a case study while trying to get a job. Here's what I learned about product thinking."

*Content*:
- **Discovery**: The research phase (CareerGating research brief, 37 pages of recruiter psychology)
- **Define**: The architecture phase (what problem am I actually solving?)
- **Develop**: The build phase (from MVP to eval stack)
- **Deliver**: The polish phase (hired-on-sight standard)

Key product lessons:
1. **Facts are your foundation** — Knowledge base before generation
2. **Quality is automatable** — If you can describe it, you can check it
3. **Scope expands to fill available time** — Embrace it or fight it
4. **Your docs are your product** — First-time user testing is real UX testing
5. **Ship early, iterate always** — 17 variants, all imperfect, all deployed

*Closing*: "I came for a portfolio. I left with a capstone, a content system, and way too many YAML files."

*CTA*: "What's the most over-engineered thing you've built for 'personal use'?"

---

**📱 POST: The Final Reflection**

> 2 weeks of posts. 7 articles. 1 journey.
>
> What I built:
> • 17 job-targeted portfolio variants
> • 21 Claude Code skills (6,000+ lines of prompts)
> • 210 tests
> • Eval pipeline with claims ledger
> • Red-team scanner for BS detection
>
> What I learned:
> • AI is a tool, not a replacement for truth
> • Quality is a habit, not a feature
> • Scope creep is just enthusiasm with deadlines
>
> What's next:
> Finding a team that appreciates someone who can't build anything simple.
>
> Thanks for following along. Now back to applying.

---

## Bonus Content (If Time Permits)

### Short Posts (Fill Gaps)

1. **The CSS Variable System**
   > 120+ CSS custom properties. Zero magic numbers. Full theme support.
   > Design systems aren't overhead. They're leverage.

2. **The STAR Format for Knowledge Base**
   > Every achievement: Situation, Task, Action, Result.
   > Not because it's trendy. Because it forces specificity.

3. **The Omnibar Pattern**
   > Floating "Get in Touch" button. Always visible. Never intrusive.
   > One CTA. One action. One click to calendar.

4. **The Blog Like Analytics**
   > Yes, my portfolio blog has a like counter.
   > Vanity? Maybe. But it surfaces which content resonates.

5. **The Case Study Drawer**
   > Modal with animations. Lazy loaded.
   > Case studies shouldn't break your back button.

6. **The "3-Second Payoff" Rule**
   > A hiring manager should understand your value in 3 seconds.
   > WHAT you did. SO WHAT (impact). WHO/WHEN.
   > Everything else is just proof.

7. **The Magazine Spread Test**
   > Each section should feel like a magazine page:
   > - One focal point
   > - Generous margins
   > - Max 3 text elements visible at once
   > If you scroll within a section to find the point, it's too long.

8. **The Schema-First Lesson**
   > Run 1: AI generated rich objects. Validation failed.
   > Run 2: Read schema FIRST. Zero errors.
   > Your AI skills should parse schemas before generating content.

9. **The Testimonial Gap**
   > I processed 79MB of career data.
   > Found: 42 highlights, 7 case studies, 34 skills.
   > Found: 2 testimonials.
   > Some things AI can't extract. You have to ask for them.

10. **The Gemini Trick**
    > Before AI parses your raw career data, have another AI summarize it first.
    > My Gemini review saved hours of parsing time.
    > Pre-synthesis is underrated.

---

## Deep-Dive Article Ideas (Future Queue)

### "The Data Ingestion Process Log: What Happens When AI Reads Your Career"

*Hook*: "I threw 79MB of career chaos at an AI. Here's what survived."

*Content from process log*:
- Phase 1: Data Discovery (11 markdown files, 60+ research files, 4 old resumes)
- The Gemini pre-synthesis trick
- Phase 2: Experience Enrichment (5 jobs → 7 jobs, 15 → 42 highlights)
- Key decisions: Date formats, title upgrades, metric verification
- Challenges: Placeholder metrics ("[X%]"), Bloom role clarity
- Phase 3: Case Study Mining (what got enriched vs. what got created)
- Phase 4: Testimonial Extraction (the gap discovery)
- Phase 5: Skills Taxonomy (schema mismatch, the fix)
- Phase 6: Validation (2 errors → 0 errors in Run 2)
- Skill improvements that emerged

*Takeaway*: Document your AI workflows. The process log became more valuable than the output.

---

### "From 600 Lines to Components: Refactoring a Monster Modal"

*Hook*: "My CaseStudyModal.tsx was 600+ lines. I couldn't even scroll through it."

*Content*:
- The problem: Monolithic component, impossible to maintain
- The refactor strategy: ModalHeader, ModalMetrics, ModalContent
- The "3-Second Payoff" design principle
- Typography hierarchy decisions (Instrument Serif vs Sans)
- Why "bigger numbers" matters (40px → 72px for primary metrics)
- The whitespace confidence signal
- Before/after screenshots

---

### "The Sprint Briefing Evolution: From Notes to Multi-Agent Simulation"

*Hook*: "I got tired of writing status updates. So I built an AI team to write them for me."

*Content*:
- The sprint-sync skill: PM, Designer, Architect, Engineer perspectives
- The "hardcore mode" for brutal honesty
- ASCII art as documentation (yes, really)
- The briefings archive (5 briefings tracked)
- What emerged: Bundle size tracking, test regression discovery
- Why multi-perspective simulation catches blind spots

---

### "The Original Prompt: What I Asked For vs. What I Got"

*Hook*: "My first prompt was 58 lines. The project is now 6,000+ lines of prompts."

*Content*:
- The original-ai-prompt.md: A "Senior Technical PM consultant" brief
- The 3 dimensions: Business outcome, Design/UX, Technical debt
- What I asked for: Gap analysis and roadmap
- What I got: An entire quality pipeline
- The scope expansion timeline
- Lessons in AI prompting: Be specific about outcomes, not features

---

## Content Calendar Summary

| Date | Type | Title/Hook |
|------|------|------------|
| Jan 6 | Article | "I Lost My Job, Built a Portfolio, and Accidentally Created an AI Eval Stack" |
| Jan 6 | Post | The Origin Story |
| Jan 7 | Post | The 7.4-Second Reality Check |
| Jan 7 | Post | The Knowledge Base Epiphany |
| Jan 8 | Article | "From Portfolio to Eval Stack" |
| Jan 8 | Post | The Variant System |
| Jan 9 | Post | The "Sycophancy" Problem |
| Jan 10 | Article | "21 Claude Code Skills Later" |
| Jan 10 | Post | The Pre-Generation Insight |
| Jan 11 | Post | The Bundle Size Wake-Up Call |
| Jan 12 | Article | "The Claims Ledger" |
| Jan 12 | Post | The "Source of Truth" Architecture |
| Jan 13 | Article | "Eye-Tracking Research & Portfolio Design" |
| Jan 13 | Post | The Testing Regression Nightmare |
| Jan 14 | Post | The Skill Refactoring Journey |
| Jan 15 | Article | "The Pitfalls: 5 Things That Almost Broke It" |
| Jan 15 | Post | The Inline Style Debt |
| Jan 16 | Post | The First-Time User Test |
| Jan 17 | Article | "Why I Treat My Resume Like Production Code" |
| Jan 17 | Post | The "Hired-on-Sight" Standard |
| Jan 18 | Post | The Sprint-Sync Skill |
| Jan 19 | Article | "The Capstone Reflection" |
| Jan 19 | Post | The Final Reflection |

---

## Hashtag Strategy

**Primary**: #ProductManagement #AI #JobSearch #TechCareers
**Secondary**: #PromptEngineering #WebDevelopment #CareerAdvice #LLMs
**Niche**: #ClaudeAI #ResumeOptimization #PortfolioDesign

---

## Notes for Writing

1. **Tone**: Conversational, self-deprecating humor, technically substantive
2. **Format**: Short paragraphs, bullet points, one clear takeaway
3. **Proof**: Always cite specific numbers, tools, or outcomes
4. **CTA**: End with a question to drive engagement
5. **Images**: Consider screenshots of:
   - Red-team output (sanitized)
   - Claims ledger example
   - Before/after design comparisons
   - Architecture diagrams
   - Terminal output from eval runs

**Credit Where Due**:
- AI Certification Course: "Building AI Features for Product Managers" by Migdad Jafar (PM @ OpenAI)
- Tag him in the kickoff article when appropriate

**Vulnerability Angle**:
- Be honest about the job search context — relatable and human
- Mention "still work in progress" — shows intellectual honesty
- The meta-story (turning adversity into a capstone) is more interesting than just the tech

---

*Created: January 5, 2025*
*Last Updated: January 5, 2025*
