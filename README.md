# Dmitrii Fotesco | Senior Technical PM Portfolio

**Status**: Active Development
**Live URL**: [edgeoftrust.com](https://edgeoftrust.com)

## ✨ Features

### 🎯 Universal CV System
Personalized portfolio variants for job applications:
- **Base Portfolio**: `/#/` - Default comprehensive portfolio
- **Job-Specific Variants**: `/#/:company/:role` - AI-tailored versions

**Active Variants:**
- Bloomberg TPM: `/#/bloomberg/technical-product-manager`
- Gensyn TPM: `/#/gensyn/technical-product-manager`

See [Universal CV Guide](./docs/guides/universal-cv.md) for details.

## 📚 Documentation

*   **[Technical Context](./context/CODEBASE.md)**: Architecture, Pattern Guides, Component Rules.
*   **[Design System](./context/DESIGN.md)**: Tokens, Theming, Typography.
*   **[Roadmap](./context/ROADMAP.md)**: Current plan and upcoming features.
*   **[Universal CV Guide](./docs/guides/universal-cv.md)**: Creating personalized variants.
*   **[Content Guide](./docs/CONTENT.md)**: Managing portfolio content.
*   **[Project History](./docs/history/)**: Refactoring logs and original prompts.

## 🤖 For AI Agents
**READ THIS FIRST**: [Governance & Rules](context/AGENT_RULES.md)
*   **Context**: [Codebase Overview](context/CODEBASE.md)
*   **Design**: [Design System](context/DESIGN.md)
*   **Plan**: [Roadmap](context/ROADMAP.md)

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Validate content
npm run validate

# Generate personalized variant
npm run generate:cv -- --company "Company" --role "Role" --jd "./jd.txt" --provider gemini
```

## 🧠 For AI Agents

Please read `context/CODEBASE.md` first. It is the comprehensive source of truth for this project.
