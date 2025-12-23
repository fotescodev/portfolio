# CareerGating - Replit Setup Guide

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run the dev server
npm run dev

# 3. Open the web preview
```

## What's Included

### Core Files
- `src/` - React app with scanner UI
- `src/rules/` - Evidence-based scanning rules
- `src/lib/evidence.ts` - Research database

### Reference Code (from portfolio repo)
- `reference/redteam.ts` - Pattern detection (secrets, sycophancy, buzzwords)
- `reference/schemas.ts` - Zod validation schemas
- `reference/evaluate-variants.ts` - Claims verification logic

---

## Architecture Overview

```
careergating/
├── src/
│   ├── App.tsx              # Main app
│   ├── components/
│   │   ├── Scanner.tsx      # Textarea + scan button
│   │   ├── Results.tsx      # Findings display
│   │   ├── Finding.tsx      # Individual finding card
│   │   └── EvidencePanel.tsx # Research sources
│   ├── rules/
│   │   ├── index.ts         # Rule registry
│   │   ├── spelling.ts      # CG-ERR-001
│   │   ├── credentials.ts   # CG-SEC-001
│   │   ├── sycophancy.ts    # CG-TONE-001
│   │   ├── buzzwords.ts     # CG-LNG-001
│   │   ├── weak-verbs.ts    # CG-LNG-002
│   │   └── quantification.ts # CG-QNT-001
│   ├── lib/
│   │   ├── scanner.ts       # Core scanning engine
│   │   ├── evidence.ts      # Research database
│   │   └── types.ts         # TypeScript interfaces
│   └── main.tsx
├── reference/               # Code from portfolio repo
│   ├── redteam.ts          # Pattern detection source
│   ├── schemas.ts          # Zod schemas
│   └── evaluate-variants.ts # Claims verification
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## Key Types (from PRD)

```typescript
interface Finding {
  id: string;           // CG-ERR-001
  category: Category;   // 'security' | 'tone' | 'quality' | 'format'
  severity: Severity;   // 'fail' | 'warn' | 'info'
  title: string;
  message: string;
  line?: number;
  suggestion?: string;
  evidence: Evidence;
}

interface Evidence {
  confidence: 'strong' | 'moderate' | 'convention';
  summary: string;
  sources: Source[];
}

interface Source {
  title: string;
  authors?: string;
  year: number;
  sampleSize?: number;
  url?: string;
  type: 'peer-reviewed' | 'survey' | 'field-experiment' | 'vendor' | 'consensus';
}
```

---

## MVP Rules to Implement

### FAIL Severity (auto-reject evidence)
| ID | Name | Pattern |
|----|------|---------|
| CG-ERR-001 | Spelling Error | Spellcheck API |
| CG-SEC-001 | Credentials | `/sk-[A-Za-z0-9]{20,}/`, `/ghp_[A-Za-z0-9]{30,}/` |
| CG-SEC-002 | Confidential | `NDA`, `internal only`, `confidential` |

### WARN Severity
| ID | Name | Pattern |
|----|------|---------|
| CG-LNG-001 | Buzzword | `synergy`, `leverage`, `dynamic`, etc. |
| CG-LNG-002 | Weak Verb | `responsible for`, `helped with`, `assisted` |
| CG-QNT-001 | Low Metrics | <50% bullets with numbers |
| CG-TONE-001 | Sycophancy | `thrilled`, `dream job`, `honored to` |

### INFO Severity
| ID | Name | Pattern |
|----|------|---------|
| CG-LNK-001 | No LinkedIn | Missing `linkedin.com/in/` |

---

## Pattern Examples (from redteam.ts)

```typescript
// Secret detection
const secretPatterns = [
  { name: 'OpenAI key', re: /\bsk-[A-Za-z0-9]{20,}\b/g },
  { name: 'GitHub token', re: /\bghp_[A-Za-z0-9]{30,}\b/g },
  { name: 'AWS key', re: /\bAKIA[0-9A-Z]{16}\b/g },
  { name: 'Generic API key', re: /\b(api[_-]?key|apikey)\s*[:=]\s*['"][^'"]{10,}['"]/gi },
];

// Sycophancy detection
const sycophancyPatterns = [
  /\b(thrilled|honored|excited)\s+to\s+(join|apply|work)/gi,
  /\bdream\s+(job|company|role|opportunity)/gi,
  /\blong\s+admired/gi,
  /\bpassionate\s+about\s+your\s+(mission|company)/gi,
];

// Buzzwords
const buzzwords = [
  'synergy', 'leverage', 'dynamic', 'proactive', 'guru', 'ninja',
  'rockstar', 'thought leader', 'paradigm', 'disrupt', 'pivot',
];

// Weak verbs
const weakVerbs = [
  /\bresponsible\s+for\b/gi,
  /\bhelped\s+(with|to)\b/gi,
  /\bassisted\s+(in|with)\b/gi,
  /\bworked\s+on\b/gi,
];
```

---

## Design Tokens

```css
:root {
  /* Severity */
  --fail: #ef4444;
  --warn: #f59e0b;
  --info: #3b82f6;
  --pass: #10b981;

  /* Confidence */
  --strong: #10b981;
  --moderate: #f59e0b;
  --convention: #6b7280;

  /* UI */
  --bg: #0a0a0c;
  --surface: #1a1a1e;
  --border: #2a2a2e;
  --text: #fafafa;
  --text-muted: #a1a1aa;
  --accent: #c29a6c;
}
```

---

## npm Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "lint": "eslint src/"
  }
}
```

---

## Next Steps After MVP

1. **CLI Tool** - Add `npm run scan resume.md`
2. **Watch Mode** - Real-time scanning while editing
3. **JSON Output** - For CI/CD integration
4. **Multi-file** - Scan entire directories
5. **Job URL Matching** - Extract requirements from job postings
