# UCV-CLI: Interactive Pipeline Interface

## The Problem

The current CLI requires you to be the orchestrator:
- Remember 7+ commands
- Know the sequence (sync → eval → redteam → ship)
- Manually check status by re-running commands
- Parse ephemeral output and hold state in your head

**You want the CLI to be the orchestrator** — showing you state, guiding you through phases, and letting you act without memorizing commands.

---

## Design Principles

1. **One entry point**: `npm run ucv-cli` — that's it
2. **State is visible**: Dashboard shows all variants and their pipeline status
3. **Actions are discoverable**: Arrow keys to navigate, Enter to act
4. **Flow is guided**: After each phase, suggest the next step
5. **Real-time feedback**: See progress as things run, not just final output

---

## Core Screens

### 1. Home / Dashboard (Default View)
What you see when you run `npm run ucv-cli`:

```
╭─────────────────────────────────────────────────────────────────────────────╮
│  ◆ Universal CV                                              Quality Pipeline│
╰─────────────────────────────────────────────────────────────────────────────╯

  Pipeline Status

  Variant                          Sync    Eval       RedTeam    Status
  ─────────────────────────────────────────────────────────────────────────
→ acme-senior-pm                    ✓      5/5 ✓      PASS       ✅ Ready
  bloomberg-technical-pm            ✓      8/8 ✓      1 WARN     ⚠️  Review
  mysten-walrus-senior-pm           ✓      4/6        —          🔴 Blocked
  stripe-crypto                     ✓      ○          —          ⏳ Pending

  ─────────────────────────────────────────────────────────────────────────
  4 variants │ 1 ready │ 1 needs review │ 2 in progress

  [↑↓] Navigate  [Enter] Actions  [c] Create  [q] Quit
```

**Key insight**: This IS the CLI now. You're always here. You navigate to do things.

### 2. Variant Actions (When you press Enter on a variant)
```
  acme-senior-pm

  [→] Run full pipeline      Run sync → eval → redteam
      Sync                   YAML → JSON
      Evaluate               Extract & verify claims
      Red Team               Security/quality scan
      View reports           Open eval.md / redteam.md
      Edit variant           Open in $EDITOR
      ─────────────────
      Back                   Return to dashboard
```

### 3. Running a Phase (Real-time feedback)
```
  Running: Evaluate acme-senior-pm

  ████████████████████░░░░░░░░░░░░░░░░░░░░  50%

  ✓ Extracted 5 claims
  ● Searching knowledge base for sources...

  [Esc] Cancel
```

### 4. Create Flow (Guided)
```
  Create New Variant

  Company: Stripe
  Role: Senior Product Manager
  Slug: stripe-senior-pm (auto-generated)

  [Enter] Create  [Esc] Cancel
```

---

## Technical Approach

### Option A: Ink (React for CLI)
**Pros:**
- What Claude Code uses (proven)
- React component model
- @inkjs/ui has Select, Spinner, TextInput
- Good TypeScript support

**Cons:**
- Adds React as dependency
- Learning curve if unfamiliar with React

### Option B: @inquirer/prompts + Custom Rendering
**Pros:**
- Lighter weight
- Just prompts, no framework
- Works well for linear flows

**Cons:**
- No persistent UI (each prompt is separate)
- Harder to build dashboard view
- Not good for "always-on" interface

### Option C: Blessed/Neo-blessed
**Pros:**
- Full TUI framework
- Widget-based (boxes, lists, tables)
- Mouse support

**Cons:**
- Older API, less TypeScript-friendly
- Steeper learning curve
- Overkill for this use case?

**Recommendation: Ink (Option A)**
- Matches the mental model you want (persistent UI, navigation)
- Proven by Claude Code
- Can reuse existing theme colors

---

## Implementation Phases

### Phase 1: Foundation
- Install Ink + React
- Create entry point (`scripts/cli/ucv/index.tsx`)
- Build App shell with screen routing
- Create branded Header component
- Wire up `npm run ucv-cli`

### Phase 2: Dashboard
- Load all variants and their status
- Render dashboard table with navigation
- Show aggregate status (ready/review/blocked)
- Keyboard shortcuts (c=create, q=quit)

### Phase 3: Variant Actions
- Action menu when selecting a variant
- "Run full pipeline" option
- Individual phase options (sync/eval/redteam)
- View reports option

### Phase 4: Phase Runner
- Real-time progress display
- Reuse existing script logic (spawn child process or import directly)
- Success/failure feedback
- "What's next?" suggestion after completion

### Phase 5: Create Flow
- Guided prompts for new variant
- Auto-generate slug
- Scaffold from template
- Auto-run sync after creation

### Phase 6: Polish
- Help overlay (? key)
- Settings (strict mode, etc.)
- Error recovery
- Non-TTY fallback (CI mode)

---

## Key Files

| File | Purpose |
|------|---------|
| `scripts/cli/ucv/index.tsx` | Entry point |
| `scripts/cli/ucv/App.tsx` | Main app, screen routing |
| `scripts/cli/ucv/screens/Dashboard.tsx` | Home view |
| `scripts/cli/ucv/screens/VariantActions.tsx` | Per-variant menu |
| `scripts/cli/ucv/screens/PhaseRunner.tsx` | Running a phase |
| `scripts/cli/ucv/screens/Create.tsx` | New variant flow |
| `scripts/cli/ucv/components/Header.tsx` | Branded header |
| `scripts/cli/ucv/components/StatusTable.tsx` | Variant status table |
| `scripts/cli/ucv/hooks/useVariants.ts` | Load/compute variant status |
| `scripts/cli/ucv/lib/runner.ts` | Execute pipeline phases |

---

## Dependencies to Add

```json
{
  "ink": "^5.0.0",
  "react": "^18.0.0",
  "@inkjs/ui": "^2.0.0"
}
```

Note: You already have React 19 in dependencies (for the web app). Ink 5 works with React 18+.

---

## Decisions Made

- **Technology**: Ink (React for CLI) ✓
- **Scope**: MVP first (Dashboard + Actions + Run Phases)
- **Deferred**: Create flow, watch mode, settings — iterate later

---

## MVP Scope

### What's In
1. `npm run ucv-cli` launches the app
2. Dashboard shows all variants with pipeline status
3. Arrow key navigation between variants
4. Enter → Action menu for selected variant
5. Run individual phases (sync, eval, redteam)
6. Run full pipeline (all phases in sequence)
7. Real-time progress feedback
8. Return to dashboard after action
9. `q` to quit

### What's Out (For Now)
- Create new variant flow
- Watch mode / auto-refresh
- Edit variant in editor
- View reports inline
- Settings/configuration
- Help overlay

---

## Implementation Steps

### Step 1: Setup
- [ ] Install dependencies: `ink`, `@inkjs/ui`
- [ ] Add `"ucv-cli": "tsx scripts/cli/ucv/index.tsx"` to package.json
- [ ] Create directory structure: `scripts/cli/ucv/`

### Step 2: App Shell
- [ ] Create `index.tsx` entry point
- [ ] Create `App.tsx` with screen state (dashboard | actions | running)
- [ ] Create `Header.tsx` using existing theme colors

### Step 3: Dashboard Screen
- [ ] Create `useVariants` hook to load variant status
- [ ] Create `Dashboard.tsx` with navigable list
- [ ] Show: variant name, sync status, eval status, redteam status
- [ ] Keyboard: ↑↓ navigate, Enter select, q quit

### Step 4: Actions Screen
- [ ] Create `VariantActions.tsx` menu
- [ ] Options: Run Pipeline, Sync, Evaluate, Red Team, Back
- [ ] Keyboard: ↑↓ navigate, Enter select, Esc back

### Step 5: Phase Runner
- [ ] Create `PhaseRunner.tsx` component
- [ ] Execute existing scripts (sync-variants, evaluate-variants, redteam)
- [ ] Show real-time output/progress
- [ ] Return to dashboard on completion

### Step 6: Polish
- [ ] Handle errors gracefully
- [ ] Add "Run full pipeline" (sync → eval → redteam in sequence)
- [ ] Test edge cases (no variants, all passing, all failing)
