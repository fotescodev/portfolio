# Dmitrii Fotesco | Senior Technical PM Portfolio

**Mission Control Center** for the edgeoftrust.com portfolio engine.

---

## 🏛️ Project Structure

### 🧠 [Active Context](./context/) (Read this first)
The "Brain" of the project. Essential for AI agents and strategic planning.
*   **[STATE OF THE UNION](./context/STATE_OF_THE_UNION.md)**: 🔴 **Current Audit & Status** (Red Alert Check).
*   **[ROADMAP](./context/ROADMAP.md)**: Current sprint status and future targets.
*   **[AGENT RULES](./context/AGENT_RULES.md)**: The "Supreme Law" for AI collaboration.
*   **[CODEBASE Architecture](./context/CODEBASE.md)**: High-level system design and patterns.
*   **[DESIGN System](./context/DESIGN.md)**: Visual tokens, typography, and theme parity.
*   **[DEVLOG](./context/DEVLOG.md)**: Session-by-session history of changes.

### 📖 [Reference Guides](./docs/)
Operational details for managing the engine.
*   **[Content Guide](./docs/CONTENT.md)**: Schema definitions for YAML/MD.
*   **[Universal CV](./docs/guides/universal-cv.md)**: Personalization engine documentation.
*   **[Adding Case Studies](./docs/guides/adding-case-studies.md)**: Workflow for new editorial content.
*   **[CV Data Ingestion](./docs/guides/cv-data-ingestion.md)**: AI-assisted career data import.

### 🤖 [Claude Code Skills](./.claude/skills/)
AI-powered automation skills for content management.
*   **[cv-data-ingestion](./.claude/skills/cv-data-ingestion/SKILL.md)**: Import career data from Obsidian, CSV, zip archives.
*   **[cv-content-generator](./.claude/skills/cv-content-generator/SKILL.md)**: Generate case studies, blog posts, variants.
*   **[cv-content-editor](./.claude/skills/cv-content-editor/SKILL.md)**: Edit existing CV content.
*   **[cv-knowledge-query](./.claude/skills/cv-knowledge-query/SKILL.md)**: Query achievements and stories.

### 🗄️ [Historical Archive](./docs/history/)
Past plans, refactoring logs, and legacy prompts.

---

## 🚀 Quick Start (Operations)

### 🛠️ Local Development
```bash
# Setup & Dependency injection
npm install

# Start Local Instance
npm run dev

# Content Integrity Check
npm run validate
```

### 🎯 Personalization (Universal CV)
```bash
# Generate a tailored variant for a specific role
npm run generate:cv -- --company "Company" --role "Role" --jd "./jd.txt" --provider gemini
```

---

## 🏗️ Technical Stack
**React 19 + TypeScript + Vite + Framer Motion + Zod**

**Status**: Active Development
**Live URL**: [edgeoftrust.com](https://edgeoftrust.com)
