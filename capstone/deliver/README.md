# Deliver Phase: Deployment & Results

---

## Deployment

```
GitHub Repo  →  GitHub Actions  →  GitHub Pages  →  edgeoftrust.com
(push)           (build)            (host)          (live)
```

**Live URL:** https://edgeoftrust.com

---

## Active Variants

| Variant | URL |
|---------|-----|
| Bloomberg Technical PM | [/#/bloomberg/technical-product-manager](https://edgeoftrust.com/#/bloomberg/technical-product-manager) |
| Microsoft Senior PM | [/#/microsoft/senior-pm](https://edgeoftrust.com/#/microsoft/senior-pm) |
| Galaxy PM | [/#/galaxy/pm](https://edgeoftrust.com/#/galaxy/pm) |
| + 9 more | See `/content/variants/` |

---

## Deployment Workflow

```bash
# 1. Pre-generation analysis
npm run analyze:jd -- --file jd.txt --save
npm run search:evidence -- --jd-analysis analysis.yaml --save

# 2. Generate variant
npm run generate:variant -- --company "Company" --role "Role"

# 3. Quality gates
npm run eval:variant -- --slug company-role
npm run redteam:variant -- --slug company-role

# 4. Sync and deploy
npm run variants:sync
git add . && git commit -m "Add company-role variant" && git push
```

GitHub Actions deploys automatically on push.

---

## Results Tracking

### Application Log

Track applications in `deliver/applications.yaml`:

```yaml
applications:
  - company: "Company Name"
    role: "Role Title"
    date: 2025-01-15
    variant_used: company-role
    funnel:
      applied: true
      response_received: false
      interview_scheduled: false
```

### Conversion Comparison

```
                    Base Portfolio    Personalized Variant
Applications              N                   N
Response Rate            X%                  Y%
Interview Rate           A%                  B%

Lift: (Y% - X%) / X%
```

---

## Current Status

| Metric | Count |
|--------|-------|
| Variants deployed | 12 |
| Claims ledgers complete | 8 |
| Red team reports complete | 11 |

---

→ Back to [Capstone Overview](../README.md)
