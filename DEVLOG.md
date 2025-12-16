# Development Log

Record of significant development sessions, features, and architectural decisions for the portfolio.

---

## 2024-12-16 | Universal CV System

**Session Goal:** Build AI-powered portfolio personalization for job applications

### Features Shipped

#### 1. Universal CV Infrastructure ✅
- **Architecture**: Variant system with schema, routing, and context
- **Features**:
  - Dynamic routes: `/#/:company/:role`
  - Variant schema with metadata, overrides, and relevance scoring
  - Content merging: base profile + variant overrides
  - Section components receive profile from context
  - Validation extended to include variants

**Components:**
- `src/context/VariantContext.tsx` - Profile injection system
- `src/pages/VariantPortfolio.tsx` - Dynamic variant page loader
- `src/pages/BasePortfolio.tsx` - Base portfolio wrapper
- `src/lib/variants.ts` - Variant loading and merging logic
- `src/types/variant.ts` - Complete type definitions

**Schemas:**
- `VariantSchema` - Metadata, overrides, relevance scoring
- Extended `ProfileSchema` for variant compatibility

---

#### 2. CLI Generator ✅
- **Script**: `scripts/generate-cv.ts` (243 lines)
- **Command**: `npm run generate:cv`
- **Features**:
  - Multi-provider AI support (Claude, OpenAI, Gemini)
  - Reads entire portfolio + job description
  - Generates personalized YAML + JSON variants
  - Full Zod validation
  - Outputs usage instructions

**Example:**
```bash
npm run generate:cv -- \
  --company "Bloomberg" \
  --role "Senior Engineer" \
  --jd "./jd.txt" \
  --provider gemini
```

**AI Prompt Engineering:**
- Analyzes: 5 jobs, 6 case studies, 4 skill categories, passion projects
- Generates: Hero, bio, stats, section visibility, relevance scores
- Maintains: Factual accuracy, authentic voice

---

#### 3. Live Variants ✅

**Bloomberg - Technical Product Manager**
- **URL**: `/#/bloomberg/technical-product-manager`
- **Focus**: Platform architecture, SDK development, developer productivity
- **Hero**: "Building developer platforms at the intersection of scale and innovation"
- **Stats**: 8+ years platform PM, 7+ SDK/API products, 4 developer tools
- **Top Case Studies**: Developer Analytics (0.95), Ankr RPC (0.90)

**Gensyn - Technical Product Manager**
- **URL**: `/#/gensyn/technical-product-manager`
- **Focus**: Web3 + ML infrastructure, distributed systems
- **Hero**: "Building at the intersection of AI and decentralized systems"
- **Stats**: 5+ years Web3, 7+ protocol integrations, 3 developer SDKs
- **Top Case Studies**: AI Agent Orchestration (1.0), Developer Analytics (0.95)

---

#### 4. GitHub Pages Compatibility ✅
- **Problem**: GitHub Pages doesn't support client-side routing
- **Solution**: Switched from `BrowserRouter` to `HashRouter`
- **URLs**: Hash-based (`/#/company/role`) for reliable routing
- **Benefit**: Works without server-side configuration

---

#### 5. Variant Personalization Fix ✅
- **Problem**: Sections importing base profile directly, ignoring variant overrides
- **Solution**: Refactored sections to receive profile as prop from VariantContext
- **Fixed**:
  - `HeroSection` - Now shows personalized headline/subheadline
  - `AboutSection` - Now shows personalized bio/stats/tagline
  - `CertificationsSection` - Respects variant section visibility

---

### Architecture Highlights

**Data Flow:**
```
URL (/#/company/role)
  → VariantPortfolio loads variant JSON
  → mergeProfile() combines base + overrides
  → VariantContext provides merged profile
  → Portfolio component receives from context
  → Sections render personalized content
```

**Content Structure:**
```
content/variants/
├── bloomberg-technical-product-manager.yaml  # Human-readable
├── bloomberg-technical-product-manager.json  # Client loading (4KB chunk)
├── gensyn-technical-product-manager.yaml
└── gensyn-technical-product-manager.json
```

---

### Design Decisions

**Why Variants over A/B Testing:**
- Personalization is deterministic (same job → same variant)
- Content is pre-generated and reviewable
- No runtime performance impact
- SEO-friendly (each variant is statically built)

**Why HashRouter:**
- GitHub Pages constraint (no server-side redirects)
- Reliable client-side routing
- Hash URLs are fully shareable and bookmarkable
- Can switch to clean URLs on Vercel/Netlify if needed

**Why Section Props:**
- Enables true personalization (not just hiding/showing)
- Maintains single source of truth (VariantContext)
- Type-safe with TypeScript
- Testable (tests pass profile explicitly)

---

### Testing

✅ **Build**: Successful - variants bundled as separate chunks
✅ **Validation**: 19 content files (7 YAML, 6 case studies, 4 blog posts, 2 variants)
✅ **Tests**: Updated component and mobile tests
✅ **Type Safety**: No TypeScript errors

---

### Documentation Added

- `docs/guides/universal-cv.md` - Complete guide (200+ lines)
- `content/variants/README.md` - Variant documentation
- `content/variants/_template.yaml` - Template for new variants
- Updated `README.md` with Universal CV section

---

### Next Steps

**Phase 2 - Recruiter View:**
- Allow recruiters to input JD and see candidate fit
- Match scoring algorithm
- Highlight relevant case studies

**Phase 3 - Dynamic Generation:**
- Generate variants on-the-fly
- Serverless function for AI generation
- No pre-building required

---

### Metrics

- **Lines Added**: ~1,500 (infrastructure + 2 variants)
- **New Files**: 14 (components, types, docs, variants)
- **Build Time**: 7.5s (unchanged)
- **Chunk Sizes**: 4KB per variant (optimized)

---

## 2024-12-15 | Content Management System & Passion Projects

**Session Goal:** Add Passion Projects section and build content management tooling

### Features Shipped

#### 1. Passion Projects Section ✅
- **Component**: `PassionProjectsSection.tsx`
- **Design**: 2-column grid layout (1 col mobile)
- **Features**:
  - Minimal card design matching design system
  - 16:9 thumbnail placeholders with gradient
  - Direct links (no drawer) - GitHub, Live, Docs buttons
  - Smaller button styling (11px vs 12px) to differentiate from case studies
  - Hover states on cards and buttons with accent color
- **Content**: 9 example projects demonstrating variety of URL combinations
- **Visibility**: Toggle via `profile.yaml` (`passionProjects: true/false`)

**Design Decisions:**
- Changed from 3-column to 2-column grid to convey "side project" feel
- No modal/drawer - cards link directly to reduce friction
- Position: Between "Selected Work" and "Testimonials"

**Files Added:**
- `src/components/sections/PassionProjectsSection.tsx`
- `src/types/portfolio.ts` (PassionProject interface)
- `content/passion-projects/index.yaml`

---

#### 2. Content Validation CLI ✅
- **Script**: `scripts/validate-content.ts`
- **Command**: `npm run validate`
- **Features**:
  - Validates all content files against Zod schemas
  - Color-coded terminal output (green ✓, red ✗)
  - Clear error messages with field paths
  - Validates: Case studies, Blog posts, Passion projects, all YAML files
  - Exits with proper codes (0 success, 1 failure)

**Validation Coverage:**
- ✅ 14 content files total
- ✅ 7 YAML configs (profile, experience, testimonials, etc.)
- ✅ 4 case study markdown files
- ✅ 3 blog post markdown files

**Architecture:**
- Created `/src/lib/schemas.ts` - Central schema definitions
- Refactored `/src/lib/content.ts` - Imports schemas, re-exports for compatibility
- Added blog post Zod validation (was missing)

**Files Added:**
- `scripts/validate-content.ts`
- `src/lib/schemas.ts`

**Dependencies Added:**
- `tsx@4.21.0` (dev) - TypeScript execution for scripts

---

#### 3. Content Templates ✅
- **Location**: `content/_templates/`
- **Templates**:
  1. `case-study.md` - Full case study template with all fields documented
  2. `blog-post.md` - Blog post template with frontmatter
  3. `passion-project-entry.yaml` - Single project entry for copy-paste
  4. `README.md` - Usage guide for templates

**Template Features:**
- All required fields marked
- Optional fields documented
- Inline comments explaining each field
- Example values provided
- Instructions for ID assignment

**Files Added:**
- `content/_templates/case-study.md`
- `content/_templates/blog-post.md`
- `content/_templates/passion-project-entry.yaml`
- `content/_templates/README.md`

---

#### 4. Developer Documentation ✅
- **File**: `docs/CONTENT.md`
- **Sections**:
  - Content types overview
  - Step-by-step guides for adding each content type
  - Field reference (required vs optional)
  - Validation workflow
  - Common tasks & troubleshooting
  - Best practices

**Coverage:**
- Adding case studies, blog posts, passion projects
- Validation commands
- Field specifications
- File naming conventions
- Getting next available IDs
- Toggling section visibility

**Files Added:**
- `docs/CONTENT.md`

---

### Technical Changes

**package.json:**
```json
{
  "scripts": {
    "validate": "tsx scripts/validate-content.ts"
  },
  "devDependencies": {
    "tsx": "^4.21.0"
  }
}
```

**Type System:**
- Added `PassionProject` and `PassionProjects` interfaces
- Updated `PortfolioContent` to include `passionProjects`
- Added `passionProjects` flag to profile sections config

**Zod Schemas:**
- Extracted all schemas to `src/lib/schemas.ts`
- Added `BlogPostSchema` (date regex validation)
- Added `PassionProjectsSchema`
- Re-exported from `content.ts` for backward compatibility

---

### Testing

**Test Results:** ✅ All 127 tests passing (5/5 suites)
- Design system tests: 12 passing
- Theme toggle tests: 6 passing
- Components tests: 18 passing
- Case study tests: 45 passing
- Mobile tests: 46 passing

**Build:** ✅ Successful
- TypeScript compilation: No errors
- Vite build: 1672 modules transformed
- Bundle size: 461.80 kB gzipped

**Validation:** ✅ All 14 content files valid

---

### Commits

1. `f306361` - feat: Add Passion Projects section with grid layout
2. `be26455` - feat: Add 6 more passion projects for mobile testing
3. `09809c7` - refactor: Change passion projects grid from 3 to 2 columns per row
4. *(pending)* - feat: Add content validation CLI and templates

---

### Metrics

- **Files Added**: 12
- **Lines of Code**: ~1,200
- **Test Coverage**: 127 tests, 100% passing
- **Content Validated**: 14 files
- **Templates Created**: 4

---

### Learnings

**What Worked:**
- Extracting schemas to separate file enabled CLI validation without circular imports
- 2-column grid better conveys "side project" aesthetic
- Comprehensive templates reduce friction for adding content
- Color-coded CLI output makes validation errors immediately clear

**Design System Adherence:**
- Reused existing design tokens (colors, spacing, typography)
- Matched button styling patterns from case studies
- Followed responsive breakpoint patterns
- Maintained consistent card hover states

**Future Improvements:**
- Consider pre-commit hook for automatic validation
- Add unit tests for validation CLI
- Create interactive CLI for scaffolding new content
- Add image optimization for thumbnails

---

### Next Steps

Potential enhancements for future sessions:
1. Pre-commit git hook for validation
2. Interactive CLI (`npm run new:case-study`)
3. Automated ID assignment
4. Image optimization pipeline
5. Content analytics (word count, reading time)
6. Draft/publish workflow

---

## Session Metadata

- **Date**: 2024-12-15
- **Duration**: ~2 hours
- **Commits**: 3 (+ 1 pending)
- **Files Changed**: 12 added, 4 modified
- **Tests**: 127/127 passing
- **Build**: ✅ Successful

