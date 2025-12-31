# First-Time User Audit: CV Dashboard

**Date:** 2025-12-31
**Persona:** Jordan Kim, Senior PM with variants generated
**Goal:** Access and use CV Dashboard to manage job applications

---

## Executive Summary

| Metric | Value |
|--------|-------|
| **Overall Score** | 4/10 |
| **Time to First Success** | ~15 minutes (with guessing) |
| **Critical Blockers** | 1 |
| **Friction Points** | 4 |

The CV Dashboard feature is **essentially undocumented**. A first-time user cannot discover this feature exists without searching package.json or .env.example. Once found, the workflow succeeds, but requires significant guesswork.

---

## Happy Path Journey

| Step | Status | Friction | Notes |
|------|--------|----------|-------|
| Find documentation | **FAILED** | Critical | No user-facing docs exist |
| Understand prerequisites | **FAILED** | Critical | Password requirement hidden in .env.example |
| Set password env var | Success | Low | .env.example gives hint |
| Run generate command | Success | Medium | Had to find in package.json |
| Find output file | Success | None | Shown in command output |
| View in browser | Success | Medium | Had to guess `npm run dev` |
| Enter password | N/A | N/A | Can't test in terminal |
| Navigate dashboard | N/A | N/A | Can't test in terminal |

---

## Documentation Gaps

### Missing Documentation

1. **No mention in README.md** — README only mentions "CLI dashboard" (UCV-CLI), not CV Dashboard
2. **No mention in GETTING_STARTED_GUIDE.md** — Zero occurrences of "cv-dashboard" or "generate:dashboard"
3. **No dedicated guide** — Unlike UCV-CLI which has `docs/guides/universal-cv-cli.md`
4. **No explanation of what CV Dashboard is** — User has no idea this feature exists
5. **No workflow documentation** — How to generate → access → use

### Unclear Documentation

1. **.env.example** — Says `# Dashboard password (for /dashboard route)` but:
   - Doesn't explain what the dashboard IS
   - Doesn't mention `npm run generate:dashboard`
   - References `/dashboard` route but actual path is `/cv-dashboard/`

---

## CLI Tool Assessment

| Aspect | Rating | Notes |
|--------|--------|-------|
| Error messages | 9/10 | Excellent! Clear message when password missing |
| Success output | 8/10 | Shows variants and output path |
| Help available | 2/10 | No `--help` flag, no documentation |

---

## What Worked Well

1. **Error handling** — Missing password error is clear and actionable
2. **Command output** — Shows exactly what was generated and where
3. **Password hashing** — Security-conscious design (hash stored, not plaintext)
4. **Integration with npm run dev** — Works seamlessly once you know to use it

---

## Recommendations

### Priority 1 (Critical — Blocking Discovery)

1. **Add CV Dashboard section to GETTING_STARTED_GUIDE.md**
   ```markdown
   ## 9. CV Dashboard (Private Variant Links)

   Generate a password-protected dashboard to share variant links with recruiters:

   ```bash
   # Set your password
   export DASHBOARD_PASSWORD=your-secure-password
   # Or add to .env.local

   # Generate the dashboard
   npm run generate:dashboard

   # View locally
   npm run dev
   # Open http://localhost:5173/cv-dashboard/
   ```
   ```

2. **Add to README.md decision tree**
   ```markdown
   | Share private variant links with recruiters | [CV Dashboard](#cv-dashboard) |
   ```

### Priority 2 (Friction Reduction)

3. **Fix .env.example comment** — Change:
   ```
   # Dashboard password (for /dashboard route)
   ```
   To:
   ```
   # CV Dashboard password - for the private variant links dashboard
   # Generate with: DASHBOARD_PASSWORD=xxx npm run generate:dashboard
   # Access at: http://localhost:5173/cv-dashboard/ (dev) or /cv-dashboard (prod)
   ```

4. **Add local URL to command output** — Currently shows only production URL

### Priority 3 (Polish)

5. **Create docs/guides/cv-dashboard.md** — Dedicated guide explaining:
   - What it is (password-protected HTML page)
   - When to use it (sharing with recruiters)
   - Full workflow with screenshots
   - Security considerations

6. **Add --help flag to script** — `npm run generate:dashboard -- --help`

---

## Discovery Audit Details

### Files Searched

| File | Contains "dashboard"? | Contains "cv-dashboard"? | Contains "generate:dashboard"? |
|------|----------------------|--------------------------|-------------------------------|
| README.md | Yes (CLI dashboard) | No | No |
| GETTING_STARTED_GUIDE.md | No | No | No |
| docs/guides/universal-cv-cli.md | Yes (CLI dashboard) | No | No |
| docs/guides/universal-cv.md | No | No | No |
| .env.example | Yes | No | No |
| package.json | Yes | Yes | Yes |

### The Only Discoverable Path

1. User looks at package.json scripts
2. Sees `"generate:dashboard"`
3. Tries to run it, gets password error
4. Error message mentions `.env.local`
5. User checks `.env.example` for guidance
6. Finds cryptic `DASHBOARD_PASSWORD` comment
7. Guesses the workflow

---

## Conclusion

The CV Dashboard is a **hidden feature**. A user who doesn't already know it exists has no reasonable way to discover it through documentation. The feature itself works well once found, but the documentation debt makes it essentially inaccessible to new users.

**Recommended Priority:** P0 — Add basic documentation before any new user tries to use this feature.

---

*Generated by first-time-user-dashboard skill simulation*
