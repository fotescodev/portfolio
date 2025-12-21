# Dmitrii Fotesco | Senior Technical PM Portfolio

**Mission Control Center** for the edgeoftrust.com portfolio engine.

---

## 🏛️ Project Structure

### 🧠 [Active Context](./context/) (Read this first)
The "Brain" of the project. Essential for AI agents and strategic planning.
*   **[STATE OF THE UNION](./context/STATE_OF_THE_UNION.md)**: Consolidated command center including:
    - Parts I-V: Strategic Audit & Gap Analysis
    - Part VI: Agent Governance (the "Supreme Law")
    - Part VII: Strategic Roadmap
    - Part VIII: Sprint Briefings (append-only history)
    - Part IX: Capstone Quality Pipeline
*   **[CODEBASE Architecture](./context/CODEBASE.md)**: High-level system design and patterns.
*   **[DESIGN System](./context/DESIGN.md)**: Visual tokens (118 CSS variables), typography, and theme parity.
*   **[DEVLOG](./context/DEVLOG.md)**: Session-by-session history of changes.

### 📖 [Reference Guides](./docs/)
Operational details for managing the engine.
*   **[Content Guide](./docs/CONTENT.md)**: Schema definitions for YAML/MD.
*   **[Universal CV](./docs/guides/universal-cv.md)**: Personalization engine documentation.
*   **[Adding Case Studies](./docs/guides/adding-case-studies.md)**: Workflow for new editorial content.
*   **[CV Data Ingestion](./docs/guides/cv-data-ingestion.md)**: AI-assisted career data import.

### 🤖 [Claude Code Skills](./.claude/skills/)
AI-powered automation skills for content management.
*   **[sprint-sync](./.claude/skills/sprint-sync/SKILL.md)**: Multi-perspective project onboarding (PM, Designer, Architect, Engineer views).
*   **[cv-data-ingestion](./.claude/skills/cv-data-ingestion/SKILL.md)**: Import career data from Obsidian, CSV, zip archives.
*   **[cv-content-generator](./.claude/skills/cv-content-generator/SKILL.md)**: Generate case studies, blog posts, variants.
*   **[cv-content-editor](./.claude/skills/cv-content-editor/SKILL.md)**: Edit existing CV content.
*   **[cv-knowledge-query](./.claude/skills/cv-knowledge-query/SKILL.md)**: Query achievements and stories.

### 🔬 [Capstone Quality Pipeline](./capstone/)
AI product evaluation framework for variant quality assurance.
*   **[Evaluation Rubric](./capstone/develop/evaluation.md)**: Claims verification methodology.
*   **[Red Team Threat Model](./capstone/develop/red-teaming.md)**: Adversarial checks for portfolio risks.
*   **[Claims Ledgers](./capstone/develop/evals/)**: Machine-checkable verification per variant.
*   **[Red Team Reports](./capstone/develop/redteam/)**: Adversarial scan results.

### 🗄️ [Historical Archive](./docs/history/)
Past plans, refactoring logs, and legacy prompts (including archived AGENT_RULES.md, ROADMAP.md).

---

## 🚀 Quick Start (Operations)

### 🛠️ Local Development
```bash
# Setup & Dependency injection
npm install

# Start Local Instance (auto-syncs variants)
npm run dev

# Content Integrity Check
npm run validate
```

### 🎯 Personalization (Universal CV)
```bash
# Generate a tailored variant for a specific role
npm run generate:cv -- --company "Company" --role "Role" --jd "./jd.txt" --provider gemini

# Sync YAML variants to JSON (runs automatically on dev/build)
npm run variants:sync
```

### 🔍 Quality Pipeline (Capstone)
```bash
# Generate claims ledger for a variant
npm run eval:variant -- --slug bloomberg-technical-product-manager

# Run adversarial red team scan
npm run redteam:variant -- --slug bloomberg-technical-product-manager

# Check all variants pass evaluation
npm run eval:check

# Check all variants pass red team (strict mode)
npm run redteam:check --strict
```

### 🖼️ OG Image Generation
```bash
# Generate social sharing images (requires Puppeteer)
npm run generate:og
```

---

## 🏗️ Technical Stack
**React 19 + TypeScript + Vite 7 + Framer Motion + Zod**

| Metric | Current | Target |
|--------|---------|--------|
| Bundle Size | 480KB | <200KB |
| Tests | 192 | 200+ |
| CSS Tokens | 118 | — |
| Active Variants | 5 | — |

**Status**: Active Development (85% production-ready)
**Live URL**: [edgeoftrust.com](https://edgeoftrust.com)
**P0 Priority**: Bundle size reduction via code splitting
