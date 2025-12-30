# CLI Reference

Shared command reference for all skills that interact with the portfolio CLI.

## Knowledge Base Commands

| Command | Purpose | Common Options |
|---------|---------|----------------|
| `npm run analyze:jd` | Analyze job description | `--file jd.txt --save` |
| `npm run search:evidence` | Search knowledge base | `--terms "x,y,z"` or `--jd-analysis path.yaml` |
| `npm run check:coverage` | Check PM competency coverage | `--json`, `--save` |

## Variant Pipeline

| Command | Purpose | Options |
|---------|---------|---------|
| `npm run variants:sync` | Sync YAML → JSON | `--slug {slug}` |
| `npm run eval:variant` | Extract and verify claims | `--slug {slug}` |
| `npm run redteam:variant` | Security/quality scan | `--slug {slug}` |

## Content Validation

| Command | Purpose |
|---------|---------|
| `npm run validate` | Validate all content against Zod schemas |
| `npm run build` | Full production build |
| `npm run test` | Run test suite |

## Resume Generation

| Command | Purpose | Options |
|---------|---------|---------|
| `npm run generate:resume` | Generate PDF resume | `--name "Name"`, `--variant {slug}` |

## Development

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server (http://localhost:5173) |
| `npm run test:watch` | Tests in watch mode |

## Common Patterns

### JD Analysis → Evidence Search → Variant
```bash
npm run analyze:jd -- --file source-data/jd-{company}.txt --save
npm run search:evidence -- --jd-analysis capstone/develop/jd-analysis/{slug}.yaml --save
npm run check:coverage
```

### Variant Validation Pipeline
```bash
npm run variants:sync -- --slug {slug}
npm run eval:variant -- --slug {slug}
npm run redteam:variant -- --slug {slug}
```
