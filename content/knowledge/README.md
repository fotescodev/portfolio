# Knowledge Base

This directory contains the source of truth for all CV content. The knowledge base feeds case studies, blog posts, experience entries, and job-specific variants.

## Structure

```
knowledge/
├── index.yaml           # Entity definitions & relationship graph
├── achievements/        # Atomic accomplishments (STAR format)
│   ├── _template.yaml   # Template for new achievements
│   └── *.yaml          # Individual achievements
├── stories/            # Extended narratives
│   ├── _template.yaml  # Template for new stories
│   └── *.yaml         # Individual stories
├── metrics/            # Quantified results (future)
└── raw/               # Unstructured source material (future)
```

## How It Works

### 1. Knowledge Base → Presentation Layer

```
achievements/eth-staking-zero-slashing.yaml
         ↓
    [cv-content-generator skill]
         ↓
case-studies/01-eth-staking.md
```

### 2. Presentation Layer → Knowledge Base (Sync)

When you update a case study with new information, use the `cv-content-editor` skill to backport changes to the knowledge base.

### 3. Querying for Content

Use the `cv-knowledge-query` skill to:
- Find achievements by theme, skill, or company
- Discover relationships between experiences
- Gather data for new content

## Adding New Content

### New Achievement
1. Copy `achievements/_template.yaml`
2. Fill in STAR format (Situation, Task, Action, Result)
3. Add to `index.yaml` relationships
4. Generate presentation content

### New Story
1. Copy `stories/_template.yaml`
2. Link to relevant achievements
3. Use for case study or blog generation

## Entity Types

### Companies
Defined in `index.yaml` under `entities.companies`:
- `anchorage`, `forte`, `dapper`, `ankr`, `microsoft`

### Themes
Business themes for categorization:
- `institutional-crypto`, `developer-experience`, `infrastructure`
- `revenue-growth`, `enterprise-blockchain`, `ai-agents`

### Skills
Technical and soft skills:
- `ethereum`, `staking`, `l2s`, `api-design`, `sdk-development`
- `compliance`, `cross-functional`

## Relationship Types

| Type | Description |
|------|-------------|
| `achieved_at` | Achievement → Company |
| `demonstrates` | Achievement → Skill |
| `belongs_to` | Achievement → Theme |
| `contains` | Story → Achievement |
| `generated_from` | Case Study → Story |

## Claude Skills

Three skills operate on this knowledge base:

1. **cv-content-generator** - Create new content from knowledge
2. **cv-content-editor** - Edit existing content with knowledge sync
3. **cv-knowledge-query** - Query and retrieve from knowledge base

## Validation

Run content validation:
```bash
npm run validate
```

This checks presentation-layer files against schemas. Knowledge base files follow their own YAML schemas defined in templates.
