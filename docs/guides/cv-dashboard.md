# CV Dashboard Guide

A password-protected dashboard for sharing your portfolio variants with recruiters.

## What It Is

The CV Dashboard is a static HTML page that:
- Lists all your portfolio variants in one place
- Requires a password to access (not indexed by search engines)
- Provides quick links to view portfolios and download resumes
- Lets you filter by application status

## When to Use It

Use the CV Dashboard when you want to:
- Share multiple variant links with a recruiter
- Track which variants you've applied with
- Give recruiters a branded, private view of your applications
- Download resumes quickly for email attachments

## Quick Start

```bash
# 1. Set your password
export DASHBOARD_PASSWORD=your-secure-password

# 2. Generate the dashboard
npm run generate:dashboard

# 3. View locally
npm run dev
# Open: http://localhost:5173/cv-dashboard/
```

## Setup

### Option A: Environment Variable (Temporary)

```bash
DASHBOARD_PASSWORD=mypassword npm run generate:dashboard
```

### Option B: .env.local (Persistent)

```bash
# Create .env.local if it doesn't exist
cp .env.example .env.local

# Add your password
echo "DASHBOARD_PASSWORD=mypassword" >> .env.local

# Generate
npm run generate:dashboard
```

## Generated Files

```
public/cv-dashboard/
├── index.html              ← The dashboard (password-protected)
└── variants-manifest.json  ← Variant metadata
```

Both files are committed to git and deployed with your site.

## Features

### Password Gate

Visitors see a password prompt before accessing the dashboard. The password is:
- Hashed (not stored in plaintext in the HTML)
- Checked client-side (no server required)
- Stored in localStorage after successful entry (persistent session)

### Variant Cards

Each variant shows:
- Company and role
- Generation date
- Application status (Applied/Pending)
- Quick actions:
  - **View Portfolio** — Opens the variant page
  - **Resume** — Downloads the PDF resume
  - **Job Post** — Links to original job listing (if saved)

### Search & Filter

- **Search** — Find variants by company or role name
- **Filter** — Show All, Pending only, or Applied only

### Stats Overview

- Total variants
- Applied count
- Pending count
- Resumes ready

## Updating the Dashboard

The dashboard is **static** — it's generated from your `content/variants/*.yaml` files at build time. To update it:

```bash
# After adding/editing variants
npm run generate:dashboard
```

Or use the combined command:

```bash
# Syncs variants AND regenerates dashboard
npm run variants:sync:dashboard
```

## Production Deployment

The dashboard is automatically included when you build:

```bash
npm run build
# Dashboard is at: dist/cv-dashboard/index.html
```

On GitHub Pages or any static host, access at:
```
https://yoursite.com/cv-dashboard/
```

### Security Notes

- The page includes `<meta name="robots" content="noindex, nofollow">` to prevent search engine indexing
- Password is hashed, not stored in plaintext
- The dashboard is a static HTML file — no server-side authentication
- For sensitive applications, consider additional access controls

## Tracking Application Status

To mark a variant as "Applied", edit the variant YAML:

```yaml
# content/variants/company-role.yaml
metadata:
  company: Company Name
  role: Role Title
  applicationStatus: applied  # Add this
  appliedAt: "2024-01-15"     # Optional: when you applied
```

Then regenerate:

```bash
npm run generate:dashboard
```

## Troubleshooting

### "DASHBOARD_PASSWORD environment variable is required"

Set the password before running:

```bash
DASHBOARD_PASSWORD=mypassword npm run generate:dashboard
```

Or add to `.env.local`:

```bash
echo "DASHBOARD_PASSWORD=mypassword" >> .env.local
```

### Dashboard shows old variants

Regenerate after adding variants:

```bash
npm run generate:dashboard
```

### Password not working

The password is case-sensitive. If you changed it, regenerate:

```bash
DASHBOARD_PASSWORD=newpassword npm run generate:dashboard
```

Then clear localStorage in your browser (the old session may be cached).

### Resume download links broken

Ensure resumes are generated:

```bash
npm run generate:resume -- --all
```

Resumes should be at `public/resumes/{slug}.pdf`.

## Related

- [Getting Started Guide §10](../GETTING_STARTED_GUIDE.md#10-cv-dashboard-private-variant-links) — Setup walkthrough
- [Universal CV Guide](./universal-cv.md) — Creating variants
- [UCV-CLI Guide](./universal-cv-cli.md) — Interactive variant management
