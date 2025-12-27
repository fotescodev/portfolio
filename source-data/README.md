# Source Data Directory

Drop raw career data here for the `cv-data-ingestion` skill to process.

## Supported Formats

| Format | Examples |
|--------|----------|
| **Markdown files** | Notion exports, project docs, notes |
| **CSV exports** | LinkedIn, spreadsheets |
| **PDF documents** | Resumes, certificates, reviews |
| **Images** | Diagrams, screenshots, photos |
| **Text files** | Resumes, job descriptions |
| **AI summaries** | `*-review.md`, `*-summary.md` (processed first) |

## How to Use

1. Drop files/folders here
2. Run: `/cv-data-ingestion`
3. Skill reads from here, outputs to `content/`

## Gitignored

This directory is gitignored — raw source data stays local.

---

## Mock Data for Testing

This directory contains mock data for the fictional persona **Alex Chen** to test the `first-time-user` and `cv-data-ingestion` skills.

### Files Included

| File/Folder | Format | Purpose |
|-------------|--------|---------|
| `mock-resume.md` | Markdown | Primary career source with 3 roles |
| `linkedin-export.csv` | CSV | Position history in tabular format |
| `project-notes/` | Markdown/Text | Rich project documentation |
| `testimonials.txt` | Plain text | LinkedIn-style recommendations |
| `gemini-review.md` | Markdown | AI summary (priority processing) |
| `target-jd.txt` | Plain text | Job description for variant testing |
| `documents/` | PDF | Resume, certificates, reviews |
| `images/` | PNG/JPG | Diagrams, screenshots, photos |

### Persona: Alex Chen

- **Role**: Senior Product Manager
- **Experience**: 6 years (engineer to PM)
- **Domain**: FinTech, Developer Tools, API Platforms
- **Location**: San Francisco, CA

### Testing Workflow

1. Run `first-time-user` skill to simulate new user experience
2. Run `cv-data-ingestion` to process mock data
3. Run `generate-variant` with `target-jd.txt` to test variant generation
4. Verify output in `content/` matches expected structure

### Cross-References

The same projects appear across multiple files to test deduplication:
- "API Platform Redesign" in resume, project notes, review
- "ML Code Completion" in resume, project notes
- Testimonials reference specific projects
