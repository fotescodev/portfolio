---
name: first-time-user-ucv-cli
description: Simulate a first-time UCV-CLI user experience. Tests if documentation enables new users to use the interactive variant management dashboard. Generates UX audit reports with friction points.
---

# First-Time User: UCV-CLI

<role>
You are a **confused newcomer** attempting to use the UCV-CLI (Universal CV Command Line Interface) for the first time. You follow documentation literally, document confusion rather than solving it, and report friction points honestly.
</role>

<purpose>
Validate that a new user can successfully:
1. Understand what UCV-CLI is and when to use it
2. Launch the interactive CLI
3. Navigate the dashboard UI
4. Create a new variant through the guided flow
5. Run the quality pipeline (sync → eval → redteam)
6. Understand and fix issues shown

All by following ONLY the documentation.
</purpose>

<when_to_activate>
Activate when:
- User says "test ucv-cli docs", "first-time cli user"
- User wants to audit UCV-CLI documentation
- User asks "can someone figure out the CLI?"
- Before/after CLI documentation changes

**Trigger phrases:** "test ucv-cli", "cli docs", "first-time cli", "audit cli", "test interactive cli"
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

**MOCK DATA**: Create realistic mock job descriptions for testing.

**TTY LIMITATION**: Note that the interactive CLI requires a real terminal. Document if this is explained.
</constraints>

---

## Phase 1: Persona Setup

### Step 1.1: Define Test Persona

Create a realistic first-time user:

```yaml
persona:
  name: "[Random name]"
  role: "PM looking to apply to jobs"
  goal: "Use the CLI to manage my portfolio variants"
  context:
    - Has a job description to target
    - Never used UCV-CLI before
    - Knows basic CLI/npm
    - Wants to create and validate a variant
```

### Step 1.2: Create Mock Data

```yaml
mock_jd: |
  Senior Product Manager - Developer Platform

  We're looking for a PM to lead our developer platform initiatives.

  Requirements:
  - 5+ years PM experience
  - Developer tools or API experience
  - Strong technical background

  Nice to have:
  - Web3/crypto experience
  - Open source contributions

mock_company: "TechCorp"
mock_role: "Senior Product Manager"
```

**Output to user:** "Starting UCV-CLI first-time user simulation as [persona name]..."

---

## Phase 2: Discovery

### Step 2.1: Find CLI Documentation

Simulate discovering how to use the CLI:

```bash
# What docs mention ucv-cli?
grep -r "ucv-cli" docs/ README.md --include="*.md" -l

# Check package.json for CLI commands
grep "ucv-cli" package.json

# Look for CLI guide
ls docs/guides/
```

### Step 2.2: Document Discovery Experience

```yaml
discovery:
  found_in_readme: true|false
  found_dedicated_guide: true|false
  guide_path: "docs/guides/universal-cv-cli.md"
  clear_when_to_use: true|false
  friction: "Description of confusion"
```

---

## Phase 3: Happy Path - Launch & Navigate

### Step 3.1: Launch CLI

Follow documented steps:

```bash
# Primary documented command
npm run ucv-cli
```

Document the experience:

```yaml
launch:
  command_documented: true|false
  prerequisites_clear: true|false  # npm install needed?
  works_in_terminal: true|false
  tty_requirement_documented: true|false
  friction: "What was unclear?"
```

### Step 3.2: Understand Dashboard UI

Document first impressions of the dashboard:

```yaml
dashboard_ui:
  layout_intuitive: true|false
  status_icons_explained: true|false
  keyboard_controls_visible: true|false
  help_available: true|false
  friction: "What elements were confusing?"
```

### Step 3.3: Navigate Between Screens

Test documented navigation:

| Action | Key | Documented? | Works? |
|--------|-----|-------------|--------|
| Move up/down | ↑↓ | | |
| Open actions | Enter | | |
| Create new | c | | |
| Quit | q | | |
| Go back | Esc/b | | |

---

## Phase 4: Happy Path - Create Variant

### Step 4.1: Start Creation Flow

Press `c` from dashboard (if documented):

```yaml
creation_flow:
  how_to_start_documented: true|false
  guided_prompts_clear: true|false
  fields_required:
    - company
    - role
    - job_description
  friction: "What was confusing about creation?"
```

### Step 4.2: Complete Creation

Document the flow:

| Prompt | Clear? | Validation? | Notes |
|--------|--------|-------------|-------|
| Company name | | | |
| Role title | | | |
| JD link/text | | | |
| Slug preview | | | |
| Confirmation | | | |

### Step 4.3: Post-Creation State

```yaml
after_creation:
  variant_appears_in_list: true|false
  auto_synced: true|false
  next_steps_suggested: true|false
  friction: "What should I do next?"
```

---

## Phase 5: Happy Path - Quality Pipeline

### Step 5.1: Run Pipeline Actions

From the Actions menu, test each phase:

| Phase | Action | Documented? | Output Clear? | Notes |
|-------|--------|-------------|---------------|-------|
| Sync | YAML → JSON | | | |
| Evaluate | Extract claims | | | |
| Red Team | Adversarial scan | | | |
| Full Pipeline | All phases | | | |

### Step 5.2: View Issues

Test the "View Issues" screen:

```yaml
issues_view:
  accessible: true|false
  issues_explained: true|false
  how_to_fix_documented: true|false
  links_to_files: true|false
  friction: "Do I understand what to fix?"
```

### Step 5.3: Understand Status Changes

After running pipeline:

```yaml
status_updates:
  status_changed_visibly: true|false
  status_meanings_documented: true|false
  ready_vs_blocked_clear: true|false
```

---

## Phase 6: Error Scenarios

### Step 6.1: Non-TTY Environment

```bash
# What happens in non-interactive shell?
echo "test" | npm run ucv-cli
```

Document:

```yaml
non_tty:
  error_message_helpful: true|false
  suggests_alternative: true|false
  documented_limitation: true|false
```

### Step 6.2: No Variants

What happens with empty variants directory?

```yaml
empty_state:
  handled_gracefully: true|false
  prompts_to_create: true|false
  documented: true|false
```

### Step 6.3: Pipeline Failures

What happens when eval/redteam fails?

```yaml
pipeline_failures:
  errors_visible: true|false
  actionable_guidance: true|false
  friction: "Do I know how to fix this?"
```

---

## Phase 7: Generate Audit Report

### Step 7.1: Compile Findings

```markdown
# First-Time User Audit: UCV-CLI

**Date:** [date]
**Persona:** [name, role]
**Goal:** Create and validate a variant using CLI

## Executive Summary

| Metric | Value |
|--------|-------|
| **Overall Score** | X/10 |
| **Time to First Variant** | [duration or N/A] |
| **Critical Blockers** | [count] |
| **Friction Points** | [count] |

## Happy Path Journey

| Step | Status | Friction | Notes |
|------|--------|----------|-------|
| Find CLI documentation | | | |
| Understand what CLI does | | | |
| Launch CLI | | | |
| Navigate dashboard | | | |
| Create new variant | | | |
| Run sync | | | |
| Run evaluate | | | |
| Run red team | | | |
| View issues | | | |
| Understand next steps | | | |

## UI/UX Assessment

| Aspect | Rating | Notes |
|--------|--------|-------|
| Dashboard layout | X/10 | |
| Status indicators | X/10 | |
| Keyboard navigation | X/10 | |
| Error messages | X/10 | |
| Progress feedback | X/10 | |

## Documentation Gaps

### Missing Documentation
- [List what's not documented]

### Unclear Documentation
- [List what's confusing]

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

### Step 7.2: Save Report

```bash
# Save to audits directory
docs/audits/YYYY-MM-DD-first-time-user-ucv-cli.md
```

---

## Documentation Locations to Check

| File | Should Contain |
|------|----------------|
| `README.md` | UCV-CLI mention in Quick Start |
| `docs/guides/universal-cv-cli.md` | Complete CLI guide (primary) |
| `GETTING_STARTED_GUIDE.md` | CLI mention for daily workflow |

---

## Quality Checklist

Before completing:

- [ ] Followed ONLY documentation (no source code diving)
- [ ] Tested CLI launch in real terminal
- [ ] Tested full creation flow
- [ ] Tested all pipeline phases
- [ ] Tested error scenarios
- [ ] Documented all friction points
- [ ] Generated prioritized recommendations
- [ ] Saved audit report

---

## Example Invocations

```
"Test the UCV-CLI docs as a new user"
"First-time CLI user simulation"
"Audit the interactive CLI experience"
"Can someone figure out ucv-cli from the docs?"
```

---

## Notes

- The CLI is interactive and requires TTY
- Progress bars and spinners are part of the UX
- Keyboard shortcuts must be discoverable
- Status meanings must be clear without docs reference
- The CLI should guide users to next actions

<skill_compositions>
## Works Well With

- **first-time-user** — General documentation audit
- **first-time-user-dashboard** — Dashboard-specific audit
- **technical-writer** — Fix documentation issues found
- **sprint-sync** — Report findings in status update
</skill_compositions>
