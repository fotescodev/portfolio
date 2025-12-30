# File Locations Reference

Shared file location reference for all skills.

## Content Structure

| Directory | Purpose |
|-----------|---------|
| `content/profile.yaml` | Identity, hero, about, stats |
| `content/experience/index.yaml` | Work history |
| `content/case-studies/*.md` | Project deep-dives |
| `content/testimonials/index.yaml` | Social proof quotes |
| `content/skills/index.yaml` | Technical & domain skills |
| `content/variants/*.yaml` | Job-specific personalizations |

## Knowledge Base

| Directory | Purpose |
|-----------|---------|
| `content/knowledge/index.yaml` | Entities and relationships graph |
| `content/knowledge/achievements/*.yaml` | Atomic accomplishments (STAR format) |
| `content/knowledge/stories/*.yaml` | Extended narratives |
| `content/knowledge/stories/*.hparl.yaml` | Interview-ready stories (HPARL format) |

## Pipeline Artifacts

| Directory | Purpose |
|-----------|---------|
| `capstone/develop/jd-analysis/*.yaml` | JD analysis outputs |
| `capstone/develop/alignment/*.yaml` | Evidence alignment reports |
| `capstone/develop/evals/*.claims.yaml` | Claims ledger |
| `capstone/develop/redteam/*.redteam.md` | Red team reports |

## Source Data (gitignored)

| Directory | Purpose |
|-----------|---------|
| `source-data/` | Raw input files (JDs, exports, etc.) |
| `source-data/jd-*.txt` | Job descriptions |

## Output Artifacts

| File | Purpose |
|------|---------|
| `public/resume.pdf` | Default resume PDF |
| `public/resumes/{slug}.pdf` | Variant-specific resume PDFs |

## Context Files

| File | Purpose |
|------|---------|
| `context/PROJECT_STATE.md` | Project status and session log |
| `context/CODEBASE.md` | Codebase documentation |
| `context/DESIGN.md` | Design system reference |
