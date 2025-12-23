# Session Archive

> Archived session logs from PROJECT_STATE.md. Kept for historical reference.

---

## December 2025

### Session: December 21, 2025 — UCV-CLI Dashboard

**Summary**: Shipped interactive TUI dashboard for variant management. Discovered test regression.

**Changes**:
- `scripts/cli/ucv/` — New Ink/React TUI dashboard (+1,334 lines)
- `docs/guides/universal-cv-cli.md` — Comprehensive CLI guide
- `docs/guides/capstone-workflow.md` — Step-by-step workflow

**New Commands**:
```bash
npm run ucv-cli  # Interactive dashboard
```

**Issues Found**:
- 7 test suites failing with React DOM TypeError
- Likely React 19 + @testing-library/react incompatibility

**Next**: Fix test regression, then code splitting

---

### Session: December 20, 2025 — Capstone Pipeline & Sprint-Sync

**Summary**: Integrated capstone quality pipeline. Created sprint-sync skill. Fixed OG images.

**Changes**:
- `scripts/sync-variants.ts` — YAML→JSON sync
- `scripts/evaluate-variants.ts` — Claims ledger generator
- `scripts/redteam.ts` — Adversarial scanner
- `.claude/skills/sprint-sync/` — Multi-perspective onboarding skill
- OG images aligned with design system

**New Commands**:
```bash
npm run variants:sync
npm run eval:variant -- --slug <slug>
npm run redteam:variant -- --slug <slug>
```

---

### Session: December 19, 2025 — Experience Optimization

**Summary**: Optimized experience section with SMART bullets and product links.

**Changes**:
- Reduced highlights from 42 to 24 (43% reduction)
- Added 12 inline product links
- Added `parseLinks()` to ExperienceSection.tsx

**Learnings**:
- 3-4 bullets max per role
- Metrics in first 10 words
- Link to proof (npm, docs, case studies)

---
