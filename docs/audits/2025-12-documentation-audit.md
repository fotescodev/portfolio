# First-Time User Experience Audit: Universal CV System

**Date:** December 27, 2025
**Auditor:** Claude (simulating first-time user experience)
**Scope:** Documentation walkthrough + hands-on CLI testing

---

## Executive Summary

| Metric | Score |
|--------|-------|
| **Documentation** | 6/10 |
| **CLI Tools** | 8.5/10 |
| **Overall** | 7/10 |

**Key Finding:** The CLI tools are surprisingly well-designed, but the documentation is fragmented with critical gaps that block new users.

**Primary Blocker:** No `.env.example` file + no API key setup instructions.

---

## Audit Scenario

I role-played as "Alex Chen", a developer with 5 years of experience, trying to:
1. Understand the Universal CV system
2. Generate a variant for a "TechCorp Product Manager" position
3. Follow only the documentation (no code diving)

---

## Part 1: Documentation Review

### Entry Points Found

| Document | Purpose | First-time User Clarity |
|----------|---------|------------------------|
| `GETTING_STARTED_GUIDE.md` | Recipe book | Good structure, missing prereqs |
| `docs/guides/universal-cv.md` | Variant details | Comprehensive, assumes knowledge |
| `docs/COMPLETE_WORKFLOW.md` | End-to-end | Great diagrams, overlaps with above |
| `docs/guides/universal-cv-cli.md` | CLI reference | Excellent, but verbose |

**Problem:** 4+ documents could be "the starting point" - unclear which to read first.

### Critical Documentation Gaps

| Gap | Location | Impact |
|-----|----------|--------|
| `<repository-url>` unexplained | GETTING_STARTED_GUIDE.md:27 | Can't clone repo |
| API key setup missing | Multiple docs | BLOCKING - can't generate variants |
| No `.env.example` | Project root | No idea what env vars are needed |
| Skills system unexplained | GETTING_STARTED_GUIDE.md:98 | Can't invoke `/cv-data-ingestion` |
| Phase numbering mismatch | SKILL.md vs capstone-workflow.md | Confusing to follow |
| URL format inconsistent | Multiple docs | `/#/company/role` vs `/company/role` |

---

## Part 2: Hands-On Testing

### CLI Tools Tested

| Command | Result | UX Rating |
|---------|--------|-----------|
| `npm run analyze:jd` | SUCCESS | 9/10 - Clear output, smart filtering |
| `npm run search:evidence` | SUCCESS | 9/10 - Excellent alignment scoring |
| `npm run check:coverage` | SUCCESS | 8/10 - Visual competency analysis |
| `npm run validate` | SUCCESS | 8/10 - Clean checkmarks |
| `npm run eval:variant` | SUCCESS | 8/10 - Clear claims count |
| `npm run redteam:variant` | SUCCESS | 8/10 - Clear pass/fail |
| `npm run generate:cv` | BLOCKED | No API key setup |
| `npm run ucv-cli` | FAILED | Needs TTY (not documented) |

### Blockers Encountered

1. **No `.env.example`** - Had to guess what environment variables are needed
2. **`generate:cv --help` broken** - Shows error instead of help text
3. **API key sources not linked** - Where do I get an Anthropic key?
4. **`ucv-cli` needs TTY** - Fails silently in non-interactive mode

---

## Part 3: User Journey Map

| Step | Status | Notes |
|------|--------|-------|
| 1. Clone repo | Warning | `<repository-url>` unclear |
| 2. npm install | Success | Works |
| 3. npm run dev | Success | Works |
| 4. Dump data to source-data/ | Warning | No example files |
| 5. Run /cv-data-ingestion | Warning | Skills unexplained |
| 6. Run analyze:jd | Success | Works great! |
| 7. Run search:evidence | Success | Works great! |
| 8. Run generate:cv | **BLOCKED** | No API key, no .env.example |
| 9. Manual variant creation | Success | Template well-documented |
| 10. Run eval:variant | Success | Works |
| 11. Run redteam:variant | Success | Works |
| 12. Preview | Success | Works |

**Estimated time to first variant:**
- Current state: 2-3 hours (experienced dev), 4-6 hours (new dev)
- With fixes: 30-45 minutes (experienced), 1-2 hours (new)

---

## Recommendations

### Priority 1 - Critical (Blocking)

1. **Create `.env.example`**
```bash
# Universal CV Environment Configuration
# Copy to .env.local and fill in your values

# Anthropic Claude (Recommended)
# Get your key at: https://console.anthropic.com
ANTHROPIC_API_KEY=

# OpenAI (Alternative)
# Get your key at: https://platform.openai.com/api-keys
OPENAI_API_KEY=

# Google Gemini (Alternative)
# Get your key at: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=
```

2. **Add API Key Setup Section to GETTING_STARTED_GUIDE.md**

3. **Fix `generate:cv --help`** - Should show usage, not error

### Priority 2 - High (Confusing)

4. **Document ucv-cli TTY requirement**

5. **Add "Which Method?" decision tree:**
   - Have Claude Code? → Use `/generate-variant` skill
   - No Claude Code? → Use `npm run generate:cv` CLI
   - No API key? → Use manual method (copy _template.yaml)

6. **Standardize URL format** - All docs should use `/#/company/role`

### Priority 3 - Medium (Polish)

7. **Improve generate:cv error messages** - Add link to API key sources

8. **Align phase numbering across documents**

9. **Add root README.md** with clear learning path

---

## What Works Well

1. **CLI tool output** is clear, colorful, and actionable
2. **`analyze:jd`** automatically filters generic phrases
3. **`search:evidence`** gives GO/NO-GO recommendations
4. **`check:coverage`** shows competency bundle gaps
5. **Variant template** has excellent inline documentation
6. **Skill SKILL.md files** are thorough and actionable

---

## Appendix: Test Commands Run

```bash
# Environment check
cat .env.example  # No such file

# CLI tools
npm run generate:cv -- --company "TechCorp" --role "Product Manager" --jd-text "..."
# Error: No API key found

npm run analyze:jd -- --text "Product Manager with 5+ years..."
# Success - clear output

npm run search:evidence -- --terms "crypto,developer_tools,infrastructure"
# Success - 100% alignment, PROCEED recommendation

npm run check:coverage
# Success - shows 4 gaps in competency bundles

npm run validate
# Success - all content validates

npm run eval:variant -- --slug bloomberg-technical-product-manager
# Success - 0/5 verified, 5 unverified

npm run redteam:variant -- --slug bloomberg-technical-product-manager
# Success - 1 FAIL 1 WARN

npm run ucv-cli
# Failed - "Non-interactive mode not implemented"
```
