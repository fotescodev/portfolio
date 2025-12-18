# Documentation Consolidation Strategy

**Goal**: streamline the "myriad of MD files" into a cohesive, navigational structure that serves both Human Developers and AI Agents.

---

## 1. Current State Assessment

| File | Location | Purpose | Verdict |
|------|----------|---------|---------|
| `README.md` | Root | Default Vite Boilerplate | **REPLACE** with Project Index |
| `REFACTORING.md` | Root | Detailed history of Dec 2024 refactor | **ARCHIVE** to `docs/history/` |
| `CODEBASE.md` | `context/` | Technical Source of Truth | **KEEP** as Core AI Context |
| `AI_AGENT_PROMPT.md` | `context/` | One-off task prompt | **DELETE** or Archive |
| `ROADMAP.md` | `context/` | Forward-looking plan | **KEEP** |
| `DESIGN_SYSTEM.md` | `context/design-system/` | Design documentation | **CONSOLIDATE** to `context/DESIGN.md` |
| `globals.css` | `context/design-system/` | **DIVERGENT** reference file | **MERGE** into `src` & Delete |

**Critical Finding**: `context/design-system/globals.css` contains "Orb" and "Gradient" styles that are missing from the active `src/styles/globals.css`. This explains why the "Orb/Glow" effects requested are missing from the live site.

---

## 2. Proposed Directory Structure

We will separate "Active Context" (for AI/Devs working NOW) from "Passive Documentation" (History/Reference).

```
portfolio/
├── README.md                  # The "Front Door" (Project Overview, Setup, Index)
├── context/                   # ACTIVE AI CONTEXT (Read often)
│   ├── CODEBASE.md            # Architecture, Tech Stack, Commands
│   ├── ROADMAP.md             # Current Sprint/Goals
│   └── DESIGN.md              # Design Tokens, Theming Rules (Moved from subfolder)
├── docs/                      # PASSIVE DOCUMENTATION (Read rarely)
│   └── history/
│       └── 2024-12-refactor.md # (Was REFACTORING.md)
└── src/                       # Source Code
```

---

## 3. Step-by-Step Execution Plan

### Step A: Clean the Root (High Priority)
1.  **Move `REFACTORING.md`**:
    *   `mkdir -p docs/history`
    *   `mv REFACTORING.md docs/history/2024-12-refactor.md`
2.  **Overwrite `README.md`**:
    *   Create a new Dashboard-style README that links to `context/CODEBASE.md` for tech details and `context/ROADMAP.md` for status.

### Step B: Consolidate Context (Medium Priority)
1.  **Flatten `context/design-system/`**:
    *   Move `context/design-system/DESIGN_SYSTEM.md` to `context/DESIGN.md`.
    *   Update `context/CODEBASE.md` to reference `DESIGN.md`.
2.  **Resolve CSS Divergence**:
    *   **Action for Roadmap**: The "Orbs" styles hidden in `context/design-system/globals.css` need to be manually ported to `src/styles/globals.css` (Phase 2 of Roadmap).
    *   Once ported, delete the `context/design-system` folder entirely.

### Step C: Archive Transactional Files (Low Priority)
1.  **Delete `AI_AGENT_PROMPT.md`**:
    *   Its contents are now effectively represented by the **Roadmap**. Keeping it creates noise.

---

## 4. Root README Template

I recommend updating `README.md` to this format immediately:

```markdown
# Dmitrii Fotesco | Senior Technical PM Portfolio

**Status**: Active Development
**Live URL**: [Insert URL]

## 📚 Documentation

*   **[Technical Context](./context/CODEBASE.md)**: Architecture, Pattern Guides, Component Rules.
*   **[Design System](./context/DESIGN.md)**: Tokens, Theming, Typography.
*   **[Roadmap](./context/ROADMAP.md)**: Current plan and upcoming features.

## 🛠 Quick Start

\`\`\`bash
npm install
npm run dev
\`\`\`

## 🧠 For AI Agents

Please read \`context/CODEBASE.md\` first. It is the comprehensive source of truth for this project.
```
