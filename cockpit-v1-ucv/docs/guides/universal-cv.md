# Universal CV System - Complete Guide

## Overview

The Universal CV system allows you to create personalized portfolio variants tailored to specific job applications. Each variant customizes your hero section, bio, stats, and content emphasis while maintaining factual accuracy.

## Live Examples

- **Base Portfolio**: `https://edgeoftrust.com/#/`
- **Bloomberg (TPM)**: `https://edgeoftrust.com/#/bloomberg/technical-product-manager`
- **Gensyn (TPM)**: `https://edgeoftrust.com/#/gensyn/technical-product-manager`

---

## Architecture

### URL Structure
```
/#/:company/:role
```

Examples:
- `/#/bloomberg/technical-product-manager`
- `/#/stripe/senior-pm`
- `/#/databricks/ml-platform-lead`

### Data Flow

```
1. User visits /#/bloomberg/technical-product-manager
2. React Router captures params: { company: "bloomberg", role: "technical-product-manager" }
3. VariantPortfolio loads variant JSON: bloomberg-technical-product-manager.json
4. mergeProfile() combines base profile + variant overrides
5. VariantContext provides merged profile to Portfolio component
6. Sections render personalized content
```

### File Structure

```
content/variants/
├── README.md                                    # Variant documentation
├── _template.yaml                               # Template for new variants
├── bloomberg-technical-product-manager.yaml     # Human-readable source
├── bloomberg-technical-product-manager.json     # Client-side loading
├── gensyn-technical-product-manager.yaml
└── gensyn-technical-product-manager.json

source-data/
└── jds/
    └── <slug>.md                                # Full JDs (gitignored)
```

---

## Creating a New Variant

### Method 0: ucv-cli (Recommended)

The interactive workflow CLI (dashboard + guided actions):

```bash
npm run ucv-cli
```

From there you can:
- create a new variant from a job URL (or manual input)
- see sync/eval/redteam status in one place
- publish only after the pipeline passes

---

### Method 1: CLI Generator (AI)

```bash
# Set API key
export GEMINI_API_KEY=your_key_here

# Generate variant (writes a draft variant)
npm run generate:cv -- \
  --company "Stripe" \
  --role "Senior PM" \
  --jd "./stripe-jd.txt" \
  --provider gemini

# Or inline job description
npm run generate:cv -- \
  --company "Databricks" \
  --role "ML Platform Lead" \
  --jd-text "Job description here..." \
  --provider gemini
```

**CLI Options:**
- `--company <name>` - Company name (required)
- `--role <title>` - Role title (required)
- `--jd <file>` - Path to job description file
- `--jd-text <text>` - Job description as inline text
- `--values <text>` - Company values (optional)
- `--context <text>` - Additional context (optional)
- `--provider <name>` - AI provider: `claude` | `openai` | `gemini` (default: claude)
- `--api-key <key>` - API key (or use env var)
- `--output <file>` - Output file path (auto-generated if not specified)

**Supported AI Providers:**
- **Claude** (Anthropic): `ANTHROPIC_API_KEY`
- **OpenAI**: `OPENAI_API_KEY`
- **Gemini** (Google): `GEMINI_API_KEY`

### Method 2: Manual Creation

1. **Copy template:**
   ```bash
   cp content/variants/_template.yaml content/variants/company-role.yaml
   ```

2. **Edit YAML file** with variant overrides

3. **Generate JSON (sync runtime artifacts):**
   ```bash
   npm run variants:sync
   ```

4. **Validate:**
   ```bash
   npm run validate
   ```

---

## Variant Schema

### Metadata

```yaml
metadata:
  company: "Bloomberg"                          # Company name
  role: "Technical Product Manager"            # Role title
  slug: "bloomberg-technical-product-manager"  # File slug (lowercase-hyphenated)
  companyKey: "bloomberg"                      # URL segment for routing
  roleKey: "technical-product-manager"         # URL segment for routing
  generatedAt: "2025-12-16T18:30:00Z"          # ISO timestamp
  sourceUrl: "https://example.com/job"         # Optional: original posting
  # IMPORTANT: this is a SHORT EXCERPT, not the full JD.
  jobDescription: |
    Short excerpt of the job description (kept ~<900 chars).
  generationModel: "claude-3-5-sonnet"         # AI model used
  # Publish gate
  publishStatus: "draft"                       # draft | published
  # publishedAt: "2025-12-21T00:00:00Z"
```

### Overrides

Override specific profile fields for personalization:

```yaml
overrides:
  hero:
    status: "Open to Technical PM roles — Platform Architecture, Developer Tools"
    headline:
      - text: "Building"
        style: "italic"
      - text: "developer platforms at the intersection of"
        style: "muted"
      - text: "scale and innovation"
        style: "accent"
    subheadline: >
      Personalized elevator pitch emphasizing relevant experience

  about:
    tagline: >
      Professional summary highlighting job fit
    bio:
      - "First paragraph: current role and relevant experience..."
      - "Second paragraph: career journey leading to this role..."
    stats:
      - value: "8+"
        label: "Years Platform PM"
      - value: "7+"
        label: "SDK/API Products"

  sections:
    beyondWork: false      # Show/hide sections based on job relevance
    blog: true
    onchainIdentity: false
    skills: true
    passionProjects: true
```

### Relevance Scoring

AI ranks your existing content by relevance (0.0-1.0):

```yaml
relevance:
  caseStudies:
    - slug: "developer-analytics"
      relevanceScore: 0.95
      reasoning: "Direct SDK/platform architecture experience"
    - slug: "ankr-rpc"
      relevanceScore: 0.90
      reasoning: "API platform growth demonstrates stakeholder management"

  skills:
    - category: "Technical Leadership"
      relevanceScore: 1.0
    - category: "Product Strategy"
      relevanceScore: 0.95

  projects:
    - slug: "ai-agent-framework"
      relevanceScore: 0.85
      reasoning: "Demonstrates ML infrastructure experience"
```

---

## Personalization Strategy

### What Gets Personalized

✅ **Hero Section**
- Status line (role type emphasis)
- Headline (key value proposition)
- Subheadline (tailored elevator pitch)

✅ **About Section**
- Tagline (professional summary)
- Bio paragraphs (career narrative)
- Stats (metrics that matter for role)

✅ **Section Visibility**
- Show/hide sections based on job fit
- Example: Show onchain identity for Web3 roles, hide for traditional tech

✅ **Content Ordering**
- Case studies ranked by relevance
- Skills emphasized by category
- Projects highlighted by fit

### What Stays Consistent

❌ **Factual Content**
- Case study text unchanged
- Experience details unchanged
- All achievements remain truthful

❌ **Design & Brand**
- Same visual design system
- Same navigation and UX
- Same color scheme and typography

---

## Best Practices

### 1. Gather Comprehensive Info

Before generating:
- Full job description
- Company values/culture research
- Specific technologies mentioned
- Role emphasis (technical vs. strategic vs. people leadership)

### 2. Review & Refine

After generation:
- Review hero headline for impact
- Ensure bio flows naturally
- Verify stats are relevant
- Check section visibility makes sense

### 3. Test Before Sharing

```bash
# Local testing
npm run dev
# Visit: http://localhost:5173/#/company/role

# Validate content
npm run validate

# Build for production
npm run build
```

### 4. Naming Conventions

**Slugs:** Use lowercase with hyphens
- ✅ `bloomberg-technical-product-manager`
- ❌ `Bloomberg_Technical_Product_Manager`

**Files:** Match slug exactly
- `{slug}.yaml` - Human-readable source
- `{slug}.json` - Client-side loading

---

## Editing Existing Variants

### Update YAML Source

```bash
# Edit the human-readable YAML
vim content/variants/bloomberg-technical-product-manager.yaml

# Regenerate JSON
npx tsx -e "
import { readFileSync, writeFileSync } from 'fs';
import YAML from 'yaml';
const yaml = readFileSync('content/variants/bloomberg-technical-product-manager.yaml', 'utf-8');
writeFileSync('content/variants/bloomberg-technical-product-manager.json',
  JSON.stringify(YAML.parse(yaml), null, 2));
"

# Validate
npm run validate

# Test
npm run dev
```

---

## Deployment

### GitHub Pages (Current Setup)

Using HashRouter for client-side routing:

```bash
# Merge PR
git checkout main
git pull origin main

# GitHub Pages auto-deploys

# Test live URLs
https://edgeoftrust.com/#/bloomberg/technical-product-manager
https://edgeoftrust.com/#/gensyn/technical-product-manager
```

### Alternative Hosting

For **Vercel/Netlify** (clean URLs without hash):

1. Switch back to BrowserRouter in `src/App.tsx`
2. Add rewrites config (see section below)
3. Deploy

**Vercel** (`vercel.json`):
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Netlify** (`netlify.toml`):
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## Troubleshooting

### Variant Not Loading

**Issue:** Variant URL shows base portfolio

**Checks:**
1. ✅ JSON file exists: `content/variants/{slug}.json`
2. ✅ Slug matches URL: `/#/company/role` → `company-role.json`
3. ✅ File validates: `npm run validate`
4. ✅ Build includes variant: Check `dist/assets/` for variant chunk

**Debug:**
```bash
# Check if variant file exists
ls -la content/variants/

# Validate schema
npm run validate

# Check build output
npm run build | grep "technical-product-manager"

# Test locally
npm run dev
# Open browser console at /#/company/role
```

### Sections Not Personalizing

**Issue:** Hero/About look the same as base

**Fix:** Ensure sections receive profile prop (fixed in latest version)

**Verify:**
```tsx
// src/components/Portfolio.tsx
<HeroSection profile={profile} ... />  // ✅ Has profile prop
<HeroSection ... />  // ❌ Missing profile prop
```

### 404 on Variant URLs

**Issue:** URLs return 404

**Fix:** Using HashRouter for GitHub Pages
- URLs must include `#`: `/#/company/role`
- Not: `/company/role` (clean URLs need server config)

---

## Example Variants

### Bloomberg - Platform Architecture Focus

**Emphasis:**
- SDK/framework development
- Developer productivity tools
- Technical platform standards

**Hero:** "Building developer platforms at the intersection of scale and innovation"

**Stats:** Platform PM experience, SDK products, developer tools

### Gensyn - Web3 + ML Infrastructure Focus

**Emphasis:**
- Distributed systems
- Crypto protocol experience
- ML infrastructure

**Hero:** "Building at the intersection of AI and decentralized systems"

**Stats:** Web3 experience, protocol integrations, developer SDKs

---

## Future Enhancements

### Phase 2: Recruiter View

Allow recruiters to check candidate fit:

```
/#/check?jd=base64_encoded_jd
```

Shows:
- Match score
- Relevant case studies highlighted
- Skill alignment
- Culture fit indicators

### Phase 3: Dynamic Generation

Generate variants on-the-fly without pre-building:

```
/#/custom?company=X&role=Y
```

With serverless function for AI generation.

---

## API Reference

### loadVariant(slug: string)

Loads and validates a variant JSON file.

```typescript
import { loadVariant } from '../lib/variants';

const variant = await loadVariant('bloomberg-technical-product-manager');
// Returns: Variant | null
```

### mergeProfile(variant: Variant)

Merges base profile with variant overrides.

```typescript
import { mergeProfile } from '../lib/variants';

const mergedProfile = mergeProfile(variant);
// Returns: MergedProfile (Profile with overrides applied)
```

### VariantContext

Provides active profile to components.

```typescript
import { useVariant } from '../context/VariantContext';

function MyComponent() {
  const { profile, variant, isVariant } = useVariant();
  // profile: Active profile (base or merged)
  // variant: Variant data if active, null otherwise
  // isVariant: Boolean flag
}
```

---

## Resources

- **Variant Template**: `content/variants/_template.yaml`
- **Schema Definition**: `src/lib/schemas.ts` → `VariantSchema`
- **Type Definitions**: `src/types/variant.ts`
- **Loader Logic**: `src/lib/variants.ts`
- **CLI Tool**: `scripts/generate-cv.ts`

---

**Questions?** See [CODEBASE.md](../../context/CODEBASE.md) for architecture details.
