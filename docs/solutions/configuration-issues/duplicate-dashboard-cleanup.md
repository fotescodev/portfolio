---
title: "Duplicate Dashboard Directory Cleanup"
type: "configuration-issue"
severity: "low"
status: "resolved"
date_identified: "2026-01-15"
date_resolved: "2026-01-15"

category: "configuration-issues"
component: "dashboard"
subsystem: "project structure"

symptoms:
  - "Confusion about which dashboard is authoritative"
  - "Maintenance burden from keeping two dashboards in sync"
  - "Risk of divergent behavior between dashboards"

root_cause: |
  Historical artifact - original dashboard was created at dashboard/index.html,
  then later moved/copied to public/cv-dashboard/index.html. The old location
  was never cleaned up.

affected_files:
  - path: "dashboard/index.html"
    description: "Legacy duplicate (deleted)"
  - path: "public/cv-dashboard/index.html"
    description: "Authoritative dashboard location"

tags: [cleanup, dashboard, duplicate-files, project-structure]
---

# Duplicate Dashboard Directory Cleanup

## Problem

Two dashboard directories existed in the project:
- `dashboard/index.html` (624 lines) - legacy duplicate
- `public/cv-dashboard/index.html` (1645 lines) - authoritative version

This caused confusion about which dashboard was the source of truth.

## Solution

Delete the legacy duplicate:

```bash
rm -rf dashboard/
```

Keep only `public/cv-dashboard/index.html` as the single source of truth.

## Prevention

### Checklist
- Run `find . -name "*dashboard*" -type d` before creating new directories
- Document canonical paths in project README

### CI Validation
```bash
# Ensure only one dashboard directory exists
test $(find . -name "*dashboard*" -type d -not -path "*/node_modules/*" | wc -l) -le 1
```

### Code Review
Reject PRs creating directories that duplicate existing functionality names.

## Related Files

- `docs/solutions/integration-issues/cv-dashboard-dev-port-configuration.md`
- `docs/solutions/integration-issues/react-router-static-file-interception.md`
