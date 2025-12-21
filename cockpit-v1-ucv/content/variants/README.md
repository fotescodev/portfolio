# Universal CV Variants

This directory contains personalized portfolio variants generated for specific job applications.

## Structure

Each variant is stored as a YAML file with the naming convention:
```
{company}-{role-slug}.yaml
```

Examples:
- `bloomberg-senior-engineer.yaml`
- `gensyn-ml-researcher.yaml`

## Generation

Variants are generated using the CLI:

```bash
npm run generate:cv -- --company "Bloomberg" --role "Senior Engineer" --jd "./jd.txt"
```

This creates a YAML file with:
- **Metadata**: Company, role, generation timestamp, job description
- **Overrides**: Customized hero headline, bio, tagline, section visibility
- **Relevance**: Scored case studies, skills, and projects by relevance to the job

## Schema

All variants are validated against `VariantSchema` (see `/src/lib/schemas.ts`)

## Usage

Variants are accessible at URLs:
```
/{company}/{role}
```

The routing system merges the base portfolio with variant overrides to create a personalized experience.
