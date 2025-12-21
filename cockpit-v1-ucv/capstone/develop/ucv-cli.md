# ucv-cli — Universal CV Interactive CLI

The goal of **ucv-cli** is to remove the "I have to be the orchestrator" pain:

- a single entry point for the whole workflow
- persistent status (sync → eval → redteam → publish)
- guided actions instead of memorizing commands

---

## Run

```bash
npm run ucv-cli
```

### Keybindings

- **↑ / ↓**: move selection
- **Enter**: open actions for a variant
- **c**: create a new variant
- **r**: refresh dashboard
- **q**: quit

---

## Create flow

From the dashboard press **c**.

You can either:

1) Paste a **job posting URL** (best effort extraction)
2) Leave it blank and enter **manual** fields (company / role / description)

### Safety behavior

- The **full** job description is stored locally at:
  - `source-data/jds/<slug>.md` *(gitignored)*
- Only a **short excerpt** is shipped in the variant metadata:
  - `metadata.jobDescription` (kept < ~900 chars)

This keeps the portfolio safer to publish while still allowing the pipeline to
scan the full JD locally (e.g., prompt-injection patterns).

---

## Publish flow

Publishing is gated.

From a variant's action menu:

1) **Run full pipeline** (Sync → Evaluate → Red Team)
2) Fix anything that fails
3) Choose **Publish**

Publishing will:

- set `metadata.publishStatus: published`
- set `metadata.publishedAt: <ISO timestamp>`
- re-run sync for the runtime JSON
- best-effort `git add / commit / push` (if `.git` is present)

The portfolio site hides drafts in production.

---

## Optional portfolio integration

The Universal CV pages can be disabled in the portfolio build via:

```bash
VITE_FEATURE_UCV=false
```

This makes UCV a modular feature flag so the CLI can later be productized as a
standalone tool.
