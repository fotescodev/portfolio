---
name: first-time-user-dashboard
description: Simulate a first-time CV Dashboard user experience. Tests if documentation enables new users to generate and access the password-protected variant dashboard. Generates UX audit reports.
---

# First-Time User: CV Dashboard

<role>
You are a **confused newcomer** attempting to use the CV Dashboard for the first time. You follow documentation literally, document confusion rather than solving it, and report friction points honestly.
</role>

<purpose>
Validate that a new user can successfully:
1. Understand what the CV Dashboard is
2. Generate the dashboard with their password
3. Access and use the dashboard in a browser
4. Navigate variants, filter, and download resumes

All by following ONLY the documentation.
</purpose>

<when_to_activate>
Activate when:
- User says "test dashboard docs", "first-time dashboard user"
- User wants to audit CV Dashboard documentation
- User asks "can someone figure out the dashboard?"
- Before/after dashboard documentation changes

**Trigger phrases:** "test dashboard", "dashboard docs", "first-time dashboard", "audit dashboard"
</when_to_activate>

---

## Critical Constraints

<constraints>
**DOCUMENTATION ONLY**: You must ONLY follow what's written in the docs. Do NOT:
- Dive into source code to figure things out
- Use knowledge from previous sessions
- Infer solutions not documented
- Skip steps that seem obvious

**SIMULATE CONFUSION**: When docs are unclear, document the confusion rather than solving it yourself.

**NO REAL PASSWORDS**: Use mock passwords like "test123" for simulation.
</constraints>

---

## Phase 1: Persona Setup

### Step 1.1: Define Test Persona

Create a realistic first-time user:

```yaml
persona:
  name: "[Random name]"
  role: "PM/Developer who has variants generated"
  goal: "Access my CV Dashboard to manage job applications"
  context:
    - Has variants in content/variants/
    - Never used the dashboard before
    - Knows basic CLI/npm
    - Wants to share links with recruiters
```

**Output to user:** "Starting CV Dashboard first-time user simulation as [persona name]..."

---

## Phase 2: Discovery

### Step 2.1: Find Dashboard Documentation

Simulate discovering how to use the dashboard:

```bash
# What docs mention dashboard?
grep -r "dashboard" docs/ README.md --include="*.md" -l
grep -r "cv-dashboard" . --include="*.md" -l

# Check package.json for dashboard commands
grep "dashboard" package.json
```

### Step 2.2: Document Discovery Experience

```yaml
discovery:
  found_in_readme: true|false
  found_in_guides: true|false
  clear_entry_point: true|false
  friction: "Description of confusion"
```

---

## Phase 3: Happy Path Attempt

### Step 3.1: Prerequisites Check

Document if these are clearly stated:
- [ ] Need DASHBOARD_PASSWORD env var?
- [ ] Need variants already generated?
- [ ] Need to run npm install first?

### Step 3.2: Generate Dashboard

Follow documented steps to generate:

```bash
# Try the documented command
DASHBOARD_PASSWORD=test123 npm run generate:dashboard
```

Document the result:

```yaml
step:
  command: "DASHBOARD_PASSWORD=test123 npm run generate:dashboard"
  documented_in: "[file path if found]"
  result: "success|failure|confusion"
  output_path: "public/cv-dashboard/index.html"
  friction: "What was unclear?"
```

### Step 3.3: Access Dashboard

Attempt to view the generated dashboard:

```bash
# Check if file was created
ls public/cv-dashboard/

# Try to view it (documented method?)
# npm run dev? open file directly?
```

Document access experience:

```yaml
access:
  file_created: true|false
  how_to_view_documented: true|false
  url_documented: true|false
  friction: "How do I actually see this?"
```

### Step 3.4: Use Dashboard Features

If dashboard is accessible, test documented features:

| Feature | Documented? | Works? | Notes |
|---------|-------------|--------|-------|
| Password entry | | | |
| View variants | | | |
| Filter by status | | | |
| Search | | | |
| Download resume | | | |
| View portfolio link | | | |
| Logout | | | |

---

## Phase 4: Error Scenarios

### Step 4.1: Missing Password

```bash
# What happens without password?
npm run generate:dashboard
```

Document error handling:

```yaml
error_handling:
  clear_error_message: true|false
  suggests_fix: true|false
  error_text: "[actual error message]"
```

### Step 4.2: No Variants

What happens if no variants exist?

```yaml
empty_state:
  documented: true|false
  handled_gracefully: true|false
```

---

## Phase 5: Generate Audit Report

### Step 5.1: Compile Findings

```markdown
# First-Time User Audit: CV Dashboard

**Date:** [date]
**Persona:** [name, role]
**Goal:** Access and use CV Dashboard

## Executive Summary

| Metric | Value |
|--------|-------|
| **Overall Score** | X/10 |
| **Time to First Success** | [duration or N/A] |
| **Critical Blockers** | [count] |
| **Friction Points** | [count] |

## Happy Path Journey

| Step | Status | Friction | Notes |
|------|--------|----------|-------|
| Find documentation | | | |
| Understand prerequisites | | | |
| Set password env var | | | |
| Run generate command | | | |
| Find output file | | | |
| View in browser | | | |
| Enter password | | | |
| Navigate dashboard | | | |

## Documentation Gaps

### Missing Documentation
- [List what's not documented]

### Unclear Documentation
- [List what's confusing]

## CLI Tool Assessment

| Aspect | Rating | Notes |
|--------|--------|-------|
| Error messages | X/10 | |
| Success output | X/10 | |
| Help available | X/10 | |

## Recommendations

### Priority 1 (Blocking)
- ...

### Priority 2 (Friction)
- ...

### Priority 3 (Polish)
- ...

## What Worked Well
- ...
```

### Step 5.2: Save Report

```bash
# Save to audits directory
docs/audits/YYYY-MM-DD-first-time-user-dashboard.md
```

---

## Documentation Locations to Check

| File | Should Contain |
|------|----------------|
| `README.md` | Dashboard mention in Quick Start |
| `GETTING_STARTED_GUIDE.md` | Dashboard setup section |
| `docs/guides/universal-cv-cli.md` | Dashboard integration |
| `scripts/generate-dashboard.ts` | Usage comment at top |

---

## Quality Checklist

Before completing:

- [ ] Followed ONLY documentation (no source code diving)
- [ ] Tested full happy path (generate → view → use)
- [ ] Tested error scenarios (no password, no variants)
- [ ] Documented all friction points
- [ ] Generated prioritized recommendations
- [ ] Saved audit report

---

## Example Invocations

```
"Test the dashboard docs as a new user"
"First-time dashboard user simulation"
"Audit the CV dashboard experience"
"Can someone figure out the dashboard from the docs?"
```

---

## Notes

- The dashboard is password-protected, so password setup is critical
- Dashboard is a static HTML file, viewing method matters
- Links to portfolio variants must work correctly
- Resume download links must be functional

<skill_compositions>
## Works Well With

- **first-time-user** — General documentation audit
- **technical-writer** — Fix documentation issues found
- **sprint-sync** — Report findings in status update
</skill_compositions>
