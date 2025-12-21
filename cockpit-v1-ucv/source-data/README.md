# Source Data Directory

Drop raw career data here for the `cv-data-ingestion` skill to process.

## Supported Formats

| Format | Examples |
|--------|----------|
| **Obsidian vault** | Folders with `.md` files |
| **CSV exports** | LinkedIn, spreadsheets |
| **Zip archives** | Bulk exports, mixed content |
| **Text files** | Resumes, job descriptions |
| **AI summaries** | `*-review.md`, `*-summary.md` (processed first) |

## How to Use

1. Drop files/folders here
2. Run: `/cv-data-ingestion`
3. Skill reads from here, outputs to `content/`

## Gitignored

This directory is gitignored — raw source data stays local.
