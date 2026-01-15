# LightRAG Integration: Technical Specification

> **Document Type**: Engineering Specification
> **Audience**: Claude Code (implementation) + Dmitrii (understanding)
> **Status**: Draft
> **Created**: 2025-01-05

---

## How to Read This Document

```
CLAUDE CODE: Look for these boxes for implementation instructions.
             Follow them precisely. They contain the "what" and "how".
```

<!-- DMITRII: Comments like this are plain-English explanations for you.
     They explain the "why" and help you understand what's happening
     without needing to read the code. Skip the code blocks if you want —
     the comments tell the story. -->

---

## 1. Executive Summary

### Two Projects, One System

<!-- DMITRII:
We're using TWO open-source projects that work together:

┌─────────────────────────────────────────────────────────┐
│                  RAG-Anything (Phase 2)                  │
│         "The Reader" - extracts text from PDFs          │
│                          │                               │
│                          ▼                               │
│  ┌───────────────────────────────────────────────────┐  │
│  │              LightRAG (Phase 1)                    │  │
│  │    "The Brain" - understands & searches content    │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘

- LightRAG: REQUIRED. This is the core. Provides semantic search.
- RAG-Anything: OPTIONAL. Only needed if you want to parse PDFs/DOCX.

You can do Phase 1 only and still get huge value. Phase 2 is additive.
-->

```
CLAUDE CODE: Architecture summary
- Phase 1 uses: lightrag-hku (Python package)
- Phase 2 adds: raganything (Python package, depends on lightrag-hku)
- RAG-Anything wraps LightRAG; they share the same index/storage
- All features from Phase 1 remain available in Phase 2
```

<!-- DMITRII:
What we're building: A smarter search system for your portfolio.

Currently, when you search for "API experience" in your knowledge base,
it only finds documents that literally contain "API experience".

After this integration, searching for "API experience" will ALSO find:
- "SDK development" (because SDKs use APIs)
- "REST endpoints" (because that's a type of API)
- "integration work" (because integrations involve APIs)

It's like upgrading from a dictionary lookup to having a librarian
who actually understands what you're looking for.
-->

### Goal
Replace substring-based evidence search with semantic (meaning-based) search using LightRAG, then add document parsing capabilities with RAG-Anything.

### Success Metrics
| Metric | Current | Target |
|--------|---------|--------|
| Search recall on related concepts | ~40% | >80% |
| Time to ingest new document | 30-60 min (manual) | 5-10 min (assisted) |
| False positive rate | N/A | <15% |

---

## 2. Architecture Overview

<!-- DMITRII:
Think of this like a library system:

1. YOUR DOCUMENTS (case studies, achievements) = Books
2. LIGHTRAG = The card catalog + librarian's brain
3. SEARCH = Asking the librarian a question
4. RESULTS = The librarian bringing you relevant books

The "knowledge graph" is like the librarian's understanding of how
topics connect. "Ethereum" connects to "blockchain" connects to
"Web3" connects to "smart contracts". When you search for one,
the system knows about the others.
-->

### 2.1 System Components

```
┌─────────────────────────────────────────────────────────────────┐
│                      YOUR PORTFOLIO                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────┐      ┌─────────────┐      ┌─────────────┐      │
│  │   Content   │      │  LightRAG   │      │   Scripts   │      │
│  │  (YAML/MD)  │─────▶│   Index     │◀─────│ (TS + Py)   │      │
│  │             │      │             │      │             │      │
│  └─────────────┘      └─────────────┘      └─────────────┘      │
│        │                    │                    │               │
│        │                    ▼                    │               │
│        │            ┌─────────────┐              │               │
│        └───────────▶│  Semantic   │◀─────────────┘               │
│                     │   Search    │                              │
│                     └─────────────┘                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Data Flow

<!-- DMITRII:
Two main flows:

INDEXING (happens occasionally, when you update content):
  Your YAML files → LightRAG reads them → Creates searchable index

SEARCHING (happens frequently, when generating variants):
  Job description → LightRAG searches → Returns relevant achievements
-->

```
CLAUDE CODE: The system has two operational modes:

1. INDEX MODE (write path):
   content/knowledge/*.yaml
   → Python script reads YAML
   → Converts to natural text
   → LightRAG extracts entities/relationships
   → Stores in .rag/ directory

2. SEARCH MODE (read path):
   Query string (e.g., job description)
   → TypeScript calls Python via subprocess
   → LightRAG performs semantic search
   → Returns ranked results as JSON
   → TypeScript converts to existing SearchResult format
```

---

## 3. File Structure

<!-- DMITRII:
We're adding a new folder called `scripts/rag/` with Python files.
Python is needed because the AI/ML libraries we're using are Python-based.
Your existing TypeScript code will "talk to" the Python code.
-->

```
CLAUDE CODE: Create the following structure. Do not deviate.

portfolio/
├── .rag/                              # LightRAG storage (gitignored)
│   ├── graph_chunk_entity_relation.graphml
│   ├── vdb_chunks.json
│   └── kv_store_*.json
│
├── scripts/
│   ├── rag/                           # NEW: Python RAG module
│   │   ├── __init__.py                # Empty, makes it a package
│   │   ├── requirements.txt           # Python dependencies
│   │   ├── config.py                  # Shared configuration
│   │   ├── client.py                  # RAG client factory (DRY)
│   │   ├── index.py                   # Indexing script
│   │   ├── search.py                  # Search script
│   │   └── parse.py                   # Document parsing (Phase 2)
│   │
│   ├── search-evidence.ts             # MODIFY: Add semantic option
│   └── rag-bridge.ts                  # NEW: TS↔Python bridge
│
├── docs/specs/
│   └── lightrag-integration-spec.md   # This file
│
└── .gitignore                         # ADD: .rag/ directory
```

---

## 4. Phase 1: Semantic Search (MVP)

<!-- DMITRII:
This is the minimum viable product. After Phase 1:
- You can search your knowledge base with natural language
- "Find achievements about scaling systems" will work
- No new services to run, just files on your computer
-->

### 4.1 Dependencies

```
CLAUDE CODE: Add these files exactly as specified.
```

**File: `scripts/rag/requirements.txt`**
```txt
lightrag-hku>=1.0.0
python-dotenv>=1.0.0
pyyaml>=6.0.0
```

**File: `.gitignore` addition**
```gitignore
# LightRAG index (regenerate with npm run rag:index)
.rag/
```

### 4.2 Configuration

<!-- DMITRII:
This file tells the Python scripts where to find things.
It uses the same API keys you already have in .env.local.
No new accounts or keys needed.
-->

**File: `scripts/rag/config.py`**
```python
"""
Configuration for RAG operations.

CLAUDE CODE: This module provides centralized configuration.
             All other scripts import from here. Never hardcode paths elsewhere.
"""
import os
from pathlib import Path
from dotenv import load_dotenv

# Project root is 3 levels up from this file
PROJECT_ROOT = Path(__file__).parent.parent.parent
load_dotenv(PROJECT_ROOT / ".env.local")

# Paths
RAG_WORKING_DIR = PROJECT_ROOT / ".rag"
KNOWLEDGE_DIR = PROJECT_ROOT / "content" / "knowledge"
CASE_STUDIES_DIR = PROJECT_ROOT / "content" / "case-studies"

# API Keys (reuse existing)
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Defaults (named constants, not magic numbers)
DEFAULT_TOP_K = 5          # Number of results to return
DEFAULT_QUERY_MODE = "hybrid"  # Best for job matching

# Ensure working directory exists
RAG_WORKING_DIR.mkdir(exist_ok=True)
```

### 4.3 RAG Client Factory

<!-- DMITRII:
This is like a "template" for creating the search system.
Instead of writing the same setup code everywhere, we write it once here.
Serghei specifically asked for this to avoid copy-paste.
-->

**File: `scripts/rag/client.py`**
```python
"""
RAG client factory with proper lifecycle management.

CLAUDE CODE: ALWAYS use get_rag_client() context manager.
             NEVER instantiate LightRAG directly in other scripts.
             This ensures consistent configuration and proper cleanup.
"""
import logging
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from lightrag import LightRAG
from lightrag.llm.openai import gpt_4o_mini_complete, openai_embed

from config import RAG_WORKING_DIR

logger = logging.getLogger(__name__)


@asynccontextmanager
async def get_rag_client() -> AsyncGenerator[LightRAG, None]:
    """
    Create and manage a LightRAG client.

    Usage:
        async with get_rag_client() as rag:
            result = await rag.aquery("...")

    CLAUDE CODE: This context manager:
    1. Creates the client with correct config
    2. Initializes storage connections
    3. Yields the client for use
    4. ALWAYS cleans up, even if errors occur
    """
    rag = LightRAG(
        working_dir=str(RAG_WORKING_DIR),
        llm_model_func=gpt_4o_mini_complete,
        embedding_func=openai_embed,
    )

    await rag.initialize_storages()
    try:
        yield rag
    finally:
        await rag.finalize_storages()
        logger.debug("RAG client finalized")
```

### 4.4 Indexing Script

<!-- DMITRII:
This script reads your YAML achievements and case studies,
then teaches LightRAG about them. Run it whenever you update content.
It's like updating the library's card catalog after adding new books.
-->

**File: `scripts/rag/index.py`**
```python
#!/usr/bin/env python3
"""
Index knowledge base content into LightRAG.

CLAUDE CODE:
- Run with: python scripts/rag/index.py
- Safe to re-run (will update existing index)
- Output goes to .rag/ directory
"""
import asyncio
import logging
import yaml
from pathlib import Path

from client import get_rag_client
from config import KNOWLEDGE_DIR, CASE_STUDIES_DIR

logging.basicConfig(level=logging.INFO, format='%(message)s')
logger = logging.getLogger(__name__)


def yaml_to_text(data: dict, source_file: str) -> str:
    """
    Convert a YAML achievement to natural text for indexing.

    CLAUDE CODE: LightRAG works best with natural prose, not structured data.
                 This converts YAML fields into readable paragraphs that
                 preserve all the semantic meaning.
    """
    # Include source file for traceability
    parts = [f"[Source: {source_file}]"]

    if headline := data.get('headline'):
        parts.append(f"Achievement: {headline}")

    if situation := data.get('situation'):
        parts.append(f"Context and Situation:\n{situation}")

    if task := data.get('task'):
        parts.append(f"Responsibility:\n{task}")

    if action := data.get('action'):
        parts.append(f"Actions Taken:\n{action}")

    if result := data.get('result'):
        parts.append(f"Results and Impact:\n{result}")

    # Metadata as natural text
    if skills := data.get('skills', []):
        parts.append(f"Skills demonstrated: {', '.join(skills)}")

    if themes := data.get('themes', []):
        parts.append(f"Themes: {', '.join(themes)}")

    if companies := data.get('companies', []):
        parts.append(f"Companies: {', '.join(companies)}")

    if years := data.get('years', []):
        parts.append(f"Years: {', '.join(map(str, years))}")

    if good_for := data.get('good_for', []):
        parts.append(f"Good for discussing: {', '.join(good_for)}")

    return "\n\n".join(parts)


async def load_achievements() -> list[tuple[str, str]]:
    """Load all YAML achievements as (id, text) tuples."""
    achievements = []
    achievements_dir = KNOWLEDGE_DIR / "achievements"

    if not achievements_dir.exists():
        logger.warning(f"Achievements directory not found: {achievements_dir}")
        return achievements

    for yaml_file in achievements_dir.glob("*.yaml"):
        # Skip template files
        if yaml_file.name.startswith("_"):
            continue

        try:
            with open(yaml_file) as f:
                data = yaml.safe_load(f)

            if data:  # Skip empty files
                text = yaml_to_text(data, yaml_file.name)
                achievements.append((yaml_file.stem, text))

        except yaml.YAMLError as e:
            logger.error(f"Failed to parse {yaml_file}: {e}")
        except Exception as e:
            logger.error(f"Error processing {yaml_file}: {e}")

    return achievements


async def load_case_studies() -> list[tuple[str, str]]:
    """Load all case study markdown files as (id, text) tuples."""
    case_studies = []

    if not CASE_STUDIES_DIR.exists():
        logger.warning(f"Case studies directory not found: {CASE_STUDIES_DIR}")
        return case_studies

    for md_file in CASE_STUDIES_DIR.glob("*.md"):
        try:
            content = md_file.read_text()
            # Prepend source for traceability
            text = f"[Source: {md_file.name}]\n\n{content}"
            case_studies.append((md_file.stem, text))
        except Exception as e:
            logger.error(f"Error reading {md_file}: {e}")

    return case_studies


async def main():
    """Main indexing pipeline."""
    logger.info("=" * 50)
    logger.info("LightRAG Knowledge Base Indexer")
    logger.info("=" * 50)

    # Load content
    logger.info("\nLoading achievements...")
    achievements = await load_achievements()
    logger.info(f"  Found {len(achievements)} achievements")

    logger.info("\nLoading case studies...")
    case_studies = await load_case_studies()
    logger.info(f"  Found {len(case_studies)} case studies")

    all_content = achievements + case_studies

    if not all_content:
        logger.error("No content found to index!")
        return

    # Index content
    logger.info(f"\nIndexing {len(all_content)} documents...")

    async with get_rag_client() as rag:
        for i, (doc_id, text) in enumerate(all_content, 1):
            logger.info(f"  [{i}/{len(all_content)}] {doc_id}")
            await rag.ainsert(text)

    logger.info("\n" + "=" * 50)
    logger.info("Indexing complete!")
    logger.info(f"Index saved to: .rag/")
    logger.info("=" * 50)


if __name__ == "__main__":
    asyncio.run(main())
```

### 4.5 Search Script

<!-- DMITRII:
This script searches your indexed content.
Give it a question or job description, and it finds relevant achievements.
The results come back as JSON that other scripts can use.
-->

**File: `scripts/rag/search.py`**
```python
#!/usr/bin/env python3
"""
Semantic search over the knowledge base.

CLAUDE CODE:
- Run with: python scripts/rag/search.py "your query" [mode] [top_k]
- Outputs JSON to stdout (for TypeScript to parse)
- Exit code 0 = success, 1 = error
"""
import argparse
import asyncio
import json
import logging
import sys

from lightrag import QueryParam

from client import get_rag_client
from config import DEFAULT_TOP_K, DEFAULT_QUERY_MODE

# Suppress INFO logs to keep stdout clean for JSON
logging.basicConfig(level=logging.WARNING)


def create_parser() -> argparse.ArgumentParser:
    """
    CLAUDE CODE: Using argparse instead of manual sys.argv parsing.
                 This provides --help, validation, and type conversion.
    """
    parser = argparse.ArgumentParser(
        description="Semantic search over the portfolio knowledge base",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python search.py "API design experience"
  python search.py "blockchain infrastructure" --mode local
  python search.py "SDK development" --top-k 10 --mode hybrid
        """
    )

    parser.add_argument(
        "query",
        help="The search query (e.g., job description excerpt)"
    )

    parser.add_argument(
        "--mode",
        choices=["naive", "local", "global", "hybrid"],
        default=DEFAULT_QUERY_MODE,
        help=f"Search mode (default: {DEFAULT_QUERY_MODE}). "
             "local=specific entities, global=themes, hybrid=both"
    )

    parser.add_argument(
        "--top-k",
        type=int,
        default=DEFAULT_TOP_K,
        help=f"Number of results (default: {DEFAULT_TOP_K})"
    )

    return parser


async def search(query: str, mode: str, top_k: int) -> dict:
    """
    Perform semantic search and return structured results.

    CLAUDE CODE: Returns dict with:
    - query: The original query
    - mode: The search mode used
    - result: LightRAG's response (includes sources)
    - success: Boolean indicating success
    """
    try:
        async with get_rag_client() as rag:
            result = await rag.aquery(
                query,
                param=QueryParam(
                    mode=mode,
                    top_k=top_k,
                    response_type="multiple paragraphs with sources",
                )
            )

        return {
            "success": True,
            "query": query,
            "mode": mode,
            "top_k": top_k,
            "result": result,
        }

    except FileNotFoundError:
        return {
            "success": False,
            "error": "Index not found. Run 'npm run rag:index' first.",
            "query": query,
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "query": query,
        }


def main():
    parser = create_parser()
    args = parser.parse_args()

    result = asyncio.run(search(args.query, args.mode, args.top_k))

    # Output JSON to stdout
    print(json.dumps(result, indent=2, ensure_ascii=False))

    # Exit code based on success
    sys.exit(0 if result.get("success") else 1)


if __name__ == "__main__":
    main()
```

### 4.6 TypeScript Bridge

<!-- DMITRII:
This is the "translator" between your TypeScript code and Python.
TypeScript is what your portfolio uses; Python is what LightRAG uses.
This bridge lets them work together.

SECURITY NOTE: Serghei flagged the original version as vulnerable.
This version is safe — it doesn't put user input directly into shell commands.
-->

**File: `scripts/rag-bridge.ts`**
```typescript
/**
 * TypeScript bridge to Python RAG scripts.
 *
 * CLAUDE CODE:
 * - Uses execFileSync (NOT execSync) to prevent shell injection
 * - All Python communication happens via JSON over stdout
 * - Errors are caught and converted to typed responses
 */
import { execFileSync, spawn } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

// Configuration
const SCRIPTS_DIR = join(__dirname, 'rag');
const RAG_INDEX_PATH = join(__dirname, '..', '.rag', 'vdb_chunks.json');
const PYTHON_CMD = 'python3';

// Types
export interface SearchResult {
  success: boolean;
  query: string;
  mode?: 'naive' | 'local' | 'global' | 'hybrid';
  top_k?: number;
  result?: string;
  error?: string;
}

export interface SearchOptions {
  mode?: 'local' | 'global' | 'hybrid';
  topK?: number;
}

/**
 * Check if the RAG index exists.
 *
 * CLAUDE CODE: Call this before searching to provide helpful error messages.
 */
export function isIndexed(): boolean {
  return existsSync(RAG_INDEX_PATH);
}

/**
 * Reindex the knowledge base.
 *
 * CLAUDE CODE: Returns a Promise that resolves when indexing completes.
 *              Logs output to console in real-time.
 */
export async function reindex(): Promise<void> {
  return new Promise((resolve, reject) => {
    const proc = spawn(PYTHON_CMD, [join(SCRIPTS_DIR, 'index.py')], {
      stdio: 'inherit', // Show output in real-time
    });

    proc.on('error', (err) => {
      reject(new Error(`Failed to start indexing: ${err.message}`));
    });

    proc.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Indexing failed with exit code ${code}`));
      }
    });
  });
}

/**
 * Perform semantic search over the knowledge base.
 *
 * CLAUDE CODE:
 * - SECURITY: Uses execFileSync with array args (no shell injection)
 * - Parses JSON response from Python
 * - Throws on Python errors for proper error handling
 */
export function semanticSearch(
  query: string,
  options: SearchOptions = {}
): SearchResult {
  const { mode = 'hybrid', topK = 5 } = options;

  if (!isIndexed()) {
    return {
      success: false,
      query,
      error: "Index not found. Run 'npm run rag:index' first.",
    };
  }

  try {
    // SECURITY: execFileSync passes args as array, not shell string
    const result = execFileSync(
      PYTHON_CMD,
      [
        join(SCRIPTS_DIR, 'search.py'),
        query,
        '--mode',
        mode,
        '--top-k',
        String(topK),
      ],
      {
        encoding: 'utf-8',
        maxBuffer: 10 * 1024 * 1024, // 10MB buffer for large results
      }
    );

    return JSON.parse(result);
  } catch (error) {
    // Handle execFileSync errors
    const err = error as Error & { stdout?: string; stderr?: string };

    // Try to parse JSON error from Python
    if (err.stdout) {
      try {
        return JSON.parse(err.stdout);
      } catch {
        // Fall through to generic error
      }
    }

    return {
      success: false,
      query,
      error: err.message || 'Unknown error during search',
    };
  }
}

/**
 * Async version of semantic search (runs in background).
 *
 * CLAUDE CODE: Use this when you don't want to block the event loop.
 */
export async function semanticSearchAsync(
  query: string,
  options: SearchOptions = {}
): Promise<SearchResult> {
  // For now, wrap sync version. Future: use proper async IPC.
  return semanticSearch(query, options);
}
```

### 4.7 Integration with Existing Search

<!-- DMITRII:
This modifies your existing search function to use the new semantic search.
It keeps the old substring search as a backup in case something goes wrong.
"Progressive enhancement" — new features, same reliability.
-->

```
CLAUDE CODE: Modify scripts/search-evidence.ts to add semantic search option.
             Keep existing functionality as fallback.
             Do not remove any existing code, only add.
```

**Changes to `scripts/search-evidence.ts`:**
```typescript
// ADD these imports at the top
import { semanticSearch, isIndexed, SearchResult as RAGSearchResult } from './rag-bridge';

// ADD this to SearchOptions interface
interface SearchOptions {
  // ... existing options ...

  /**
   * Use semantic search via LightRAG.
   * Falls back to substring search if index doesn't exist.
   * @default true
   */
  useSemanticSearch?: boolean;
}

// MODIFY the main search function
export async function searchEvidence(
  query: string,
  options: SearchOptions = {}
): Promise<EvidenceMatch[]> {
  const { useSemanticSearch = true, ...restOptions } = options;

  // Try semantic search first (if enabled and indexed)
  if (useSemanticSearch && isIndexed()) {
    const semanticResult = semanticSearch(query, {
      mode: 'hybrid',
      topK: restOptions.maxResults || 10,
    });

    if (semanticResult.success && semanticResult.result) {
      // Convert RAG results to existing format
      return convertSemanticResults(semanticResult, query);
    }

    // Log but don't fail — fall through to substring search
    console.warn('Semantic search failed, falling back to substring search');
  }

  // EXISTING: Substring search (unchanged)
  return existingSubstringSearch(query, restOptions);
}

// ADD this helper function
function convertSemanticResults(
  ragResult: RAGSearchResult,
  originalQuery: string
): EvidenceMatch[] {
  /**
   * CLAUDE CODE: Parse LightRAG's response to extract source references.
   * LightRAG includes [Source: filename.yaml] markers in results.
   * Extract these and map to existing EvidenceMatch format.
   */
  const sourcePattern = /\[Source: ([^\]]+)\]/g;
  const matches: EvidenceMatch[] = [];
  const result = ragResult.result || '';

  let match;
  while ((match = sourcePattern.exec(result)) !== null) {
    const sourceFile = match[1];
    const id = sourceFile.replace(/\.(yaml|md)$/, '');

    // Avoid duplicates
    if (!matches.find(m => m.id === id)) {
      matches.push({
        id,
        source: sourceFile,
        relevance: 0.8, // Semantic matches are high confidence
        matchedTerms: [originalQuery],
        excerpt: extractExcerpt(result, match.index),
      });
    }
  }

  return matches;
}

function extractExcerpt(text: string, position: number): string {
  // Extract ~200 chars around the match position
  const start = Math.max(0, position - 100);
  const end = Math.min(text.length, position + 100);
  return text.slice(start, end).trim();
}
```

### 4.8 Package.json Scripts

<!-- DMITRII:
These are shortcuts you can run from the terminal.
Like bookmarks for common tasks.

npm run rag:setup  → Install Python dependencies (run once)
npm run rag:index  → Update the search index (run when content changes)
npm run rag:search → Test a search query
-->

```
CLAUDE CODE: Add these scripts to package.json
```

```json
{
  "scripts": {
    "rag:setup": "pip install -r scripts/rag/requirements.txt",
    "rag:index": "python3 scripts/rag/index.py",
    "rag:search": "python3 scripts/rag/search.py"
  }
}
```

---

## 5. Phase 2: Document Parsing

<!-- DMITRII:
Phase 2 adds the ability to parse PDFs and Word documents.
Instead of manually reading a PDF and typing notes, you can:
1. Drop in a PDF
2. Run a command
3. Get structured YAML ready for review

This is "assisted" ingestion — it does the heavy lifting, you do the review.
-->

### 5.1 Additional Dependencies

**File: `scripts/rag/requirements.txt` (updated)**
```txt
# Phase 1
lightrag-hku>=1.0.0
python-dotenv>=1.0.0
pyyaml>=6.0.0

# Phase 2 (document parsing)
raganything>=0.1.0
magic-pdf>=0.1.0
```

**System dependencies:**
```
CLAUDE CODE: Document these requirements but don't auto-install.
             User must install manually based on their OS.
```

```bash
# macOS
brew install libreoffice  # For DOCX/PPTX
brew install tesseract    # For scanned PDFs (optional)

# Linux (Ubuntu/Debian)
sudo apt-get install libreoffice
sudo apt-get install tesseract-ocr
```

### 5.2 Document Parser

<!-- DMITRII:
This script takes any document (PDF, Word, etc.) and extracts:
- Text content (paragraphs)
- Tables (as structured data)
- Images (with AI descriptions)

It's like having an assistant read the document and take notes.
-->

**File: `scripts/rag/parse.py`**
```python
#!/usr/bin/env python3
"""
Parse documents into structured chunks using RAG-Anything.

CLAUDE CODE:
- Run with: python scripts/rag/parse.py document.pdf
- Outputs JSON with structured chunks
- Requires: LibreOffice (for Office docs), Tesseract (for OCR)
"""
import argparse
import asyncio
import json
import logging
import sys
from pathlib import Path

from raganything import RAGAnything, RAGAnythingConfig
from lightrag.llm.openai import gpt_4o_mini_complete, openai_embed

from config import RAG_WORKING_DIR, PROJECT_ROOT

logging.basicConfig(level=logging.INFO, format='%(message)s')
logger = logging.getLogger(__name__)


def create_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Parse documents into structured chunks"
    )
    parser.add_argument(
        "file_path",
        help="Path to the document (PDF, DOCX, etc.)"
    )
    parser.add_argument(
        "--output-dir",
        default=str(PROJECT_ROOT / "parsed_output"),
        help="Directory for parsed output"
    )
    parser.add_argument(
        "--json",
        action="store_true",
        help="Output JSON to stdout (for piping)"
    )
    return parser


async def parse_document(file_path: str, output_dir: str) -> dict:
    """
    Parse a document and extract structured content.

    CLAUDE CODE: Returns dict with:
    - source_file: Original file path
    - chunks: List of extracted content pieces
    - entities: Recognized entities (names, companies, etc.)
    - summary: AI-generated summary
    """
    config = RAGAnythingConfig(
        working_dir=str(RAG_WORKING_DIR / "parsing"),
        parser="mineru",
        enable_image_processing=True,
        enable_table_processing=True,
        enable_equation_processing=False,
    )

    rag = RAGAnything(
        config=config,
        llm_model_func=gpt_4o_mini_complete,
        embedding_func=openai_embed,
        vision_model_func=gpt_4o_mini_complete,
    )

    # Process document
    parsed = await rag.process_document_complete(
        file_path=file_path,
        output_dir=output_dir
    )

    return {
        "success": True,
        "source_file": file_path,
        "chunks": [
            {
                "type": chunk.type,
                "content": chunk.content,
                "metadata": chunk.metadata,
            }
            for chunk in parsed.chunks
        ],
        "entities": parsed.entities if hasattr(parsed, 'entities') else [],
        "summary": parsed.summary if hasattr(parsed, 'summary') else None,
    }


async def main():
    parser = create_parser()
    args = parser.parse_args()

    file_path = Path(args.file_path)
    if not file_path.exists():
        result = {"success": False, "error": f"File not found: {file_path}"}
        print(json.dumps(result))
        sys.exit(1)

    if not args.json:
        logger.info(f"Parsing: {file_path}")

    try:
        result = await parse_document(str(file_path), args.output_dir)

        if args.json:
            print(json.dumps(result, indent=2, default=str))
        else:
            logger.info(f"Extracted {len(result['chunks'])} chunks")
            logger.info(f"Output saved to: {args.output_dir}")

    except Exception as e:
        result = {"success": False, "error": str(e)}
        print(json.dumps(result))
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())
```

### 5.3 Package.json Scripts (Phase 2)

```json
{
  "scripts": {
    "rag:parse": "python3 scripts/rag/parse.py",
    "rag:parse:json": "python3 scripts/rag/parse.py --json"
  }
}
```

---

## 6. Testing & Validation

<!-- DMITRII:
These tests make sure everything works.
Run them after setting up, and after making changes.
Green = good. Red = something's wrong.
-->

### 6.1 Manual Testing Checklist

```
CLAUDE CODE: Create this as scripts/rag/test-checklist.md
```

```markdown
# RAG Integration Test Checklist

## Phase 1: Semantic Search

### Setup
- [ ] `pip install -r scripts/rag/requirements.txt` completes without errors
- [ ] `.env.local` contains valid `OPENAI_API_KEY`

### Indexing
- [ ] `npm run rag:index` completes successfully
- [ ] `.rag/` directory is created with files
- [ ] `.rag/vdb_chunks.json` is non-empty

### Search
- [ ] `npm run rag:search "API design"` returns results
- [ ] Results include source file references [Source: *.yaml]
- [ ] Different modes (local, global, hybrid) return different results

### Integration
- [ ] `searchEvidence()` uses semantic search when index exists
- [ ] `searchEvidence()` falls back to substring when index missing
- [ ] No TypeScript compilation errors

## Phase 2: Document Parsing

### Setup
- [ ] LibreOffice installed and in PATH
- [ ] `raganything` package installed

### Parsing
- [ ] `npm run rag:parse resume.pdf` extracts text
- [ ] Tables are extracted as structured data
- [ ] JSON output is valid and parseable
```

### 6.2 Comparison Test

<!-- DMITRII:
This test compares old search vs new search.
It helps prove the new system is actually better.
-->

**File: `scripts/test-rag-comparison.ts`**
```typescript
/**
 * Compare semantic search vs substring search accuracy.
 *
 * CLAUDE CODE: Run with: npx ts-node scripts/test-rag-comparison.ts
 */
import { semanticSearch } from './rag-bridge';
// Import your existing search function
// import { substringSearch } from './search-evidence';

interface TestCase {
  query: string;
  expectedMatches: string[];  // Achievement IDs that should match
  description: string;
}

const TEST_CASES: TestCase[] = [
  {
    query: "Experience with API design and SDK development",
    expectedMatches: ["ankr-15x-revenue", "forte-wallet-sdk"],
    description: "Should find API/SDK related achievements",
  },
  {
    query: "Blockchain and Ethereum infrastructure",
    expectedMatches: ["eth-staking-zero-slashing", "l2-protocol-integrations"],
    description: "Should find blockchain achievements even without exact terms",
  },
  {
    query: "Developer experience and tooling improvements",
    expectedMatches: ["flow-cli-dx"],
    description: "Should understand 'DX' relates to developer experience",
  },
  {
    query: "Revenue growth and business impact",
    expectedMatches: ["ankr-15x-revenue"],
    description: "Should find business impact stories",
  },
];

async function runTests() {
  console.log("=" .repeat(60));
  console.log("RAG Search Comparison Test");
  console.log("=".repeat(60));

  for (const test of TEST_CASES) {
    console.log(`\nTest: ${test.description}`);
    console.log(`Query: "${test.query}"`);
    console.log(`Expected: ${test.expectedMatches.join(", ")}`);

    // Semantic search
    const semanticResult = semanticSearch(test.query, { mode: "hybrid" });

    if (semanticResult.success) {
      // Extract matched sources from result
      const sourcePattern = /\[Source: ([^\]]+)\]/g;
      const found: string[] = [];
      let match;
      while ((match = sourcePattern.exec(semanticResult.result || "")) !== null) {
        found.push(match[1].replace(/\.(yaml|md)$/, ""));
      }

      console.log(`Found: ${found.join(", ") || "(none)"}`);

      // Calculate accuracy
      const hits = test.expectedMatches.filter(e => found.includes(e));
      const accuracy = hits.length / test.expectedMatches.length;
      console.log(`Accuracy: ${(accuracy * 100).toFixed(0)}%`);
    } else {
      console.log(`Error: ${semanticResult.error}`);
    }
  }
}

runTests().catch(console.error);
```

---

## 7. Error Handling

<!-- DMITRII:
Things will go wrong. This section tells Claude Code how to handle problems
gracefully — showing helpful messages instead of crashing.
-->

```
CLAUDE CODE: Follow these error handling patterns consistently.
```

### 7.1 Python Error Pattern

```python
# Always catch specific exceptions, log usefully, return structured errors

try:
    result = await some_operation()
except FileNotFoundError as e:
    logger.error(f"Required file not found: {e}")
    return {"success": False, "error": f"File not found: {e.filename}"}
except yaml.YAMLError as e:
    logger.error(f"Invalid YAML: {e}")
    return {"success": False, "error": f"YAML parsing error: {e}"}
except Exception as e:
    # Last resort — log full traceback for debugging
    logger.exception(f"Unexpected error: {e}")
    return {"success": False, "error": str(e)}
```

### 7.2 TypeScript Error Pattern

```typescript
// Always provide actionable error messages

try {
  const result = semanticSearch(query);
  if (!result.success) {
    // Provide actionable guidance
    if (result.error?.includes('Index not found')) {
      console.error('Run "npm run rag:index" to create the search index');
    } else {
      console.error(`Search failed: ${result.error}`);
    }
  }
} catch (error) {
  // Handle unexpected errors
  console.error('Unexpected error:', error);
  // Fall back to alternative behavior
  return fallbackSearch(query);
}
```

---

## 8. Security Considerations

<!-- DMITRII:
Security stuff. Serghei was right to flag these.
This section ensures we don't accidentally create vulnerabilities.
-->

```
CLAUDE CODE: These are MANDATORY security requirements.
```

### 8.1 Shell Injection Prevention

```typescript
// NEVER do this (shell injection vulnerable):
execSync(`python search.py "${userInput}"`);

// ALWAYS do this (safe):
execFileSync('python', ['search.py', userInput]);
```

### 8.2 API Key Protection

```python
# Keys come from environment, never hardcoded
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("OPENAI_API_KEY environment variable not set")
```

### 8.3 File Path Validation

```python
# Validate file paths are within expected directories
def safe_path(user_path: str, base_dir: Path) -> Path:
    """Ensure path doesn't escape base directory."""
    resolved = (base_dir / user_path).resolve()
    if not str(resolved).startswith(str(base_dir.resolve())):
        raise ValueError(f"Path escapes base directory: {user_path}")
    return resolved
```

---

## 9. Rollback Plan

<!-- DMITRII:
If something goes wrong, here's how to undo everything.
Like a "reset button" for the integration.
-->

```
CLAUDE CODE: Document rollback steps for each phase.
```

### Phase 1 Rollback

```bash
# 1. Remove RAG index
rm -rf .rag/

# 2. Remove Python scripts
rm -rf scripts/rag/

# 3. Remove TypeScript bridge
rm scripts/rag-bridge.ts

# 4. Revert search-evidence.ts changes
git checkout scripts/search-evidence.ts

# 5. Remove package.json scripts
# (manual edit to remove rag:* scripts)
```

### Phase 2 Rollback

```bash
# Remove parsing dependencies
pip uninstall raganything magic-pdf

# Remove parsed output
rm -rf parsed_output/

# Remove parse.py
rm scripts/rag/parse.py
```

---

## 10. Implementation Order

<!-- DMITRII:
This is the exact order Claude Code should implement things.
Each step is a small, testable piece.
-->

```
CLAUDE CODE: Implement in this EXACT order. Test after each step.
```

### Step-by-Step Implementation

```
PHASE 1 (in order):

□ Step 1.1: Create scripts/rag/ directory structure
  Test: Directory exists

□ Step 1.2: Create requirements.txt
  Test: pip install -r requirements.txt succeeds

□ Step 1.3: Create config.py
  Test: python -c "from scripts.rag.config import *" works

□ Step 1.4: Create client.py
  Test: No import errors

□ Step 1.5: Create index.py
  Test: npm run rag:index creates .rag/ files

□ Step 1.6: Create search.py
  Test: npm run rag:search "test query" returns JSON

□ Step 1.7: Create rag-bridge.ts
  Test: TypeScript compiles without errors

□ Step 1.8: Modify search-evidence.ts
  Test: Existing tests still pass

□ Step 1.9: Update package.json
  Test: All npm run rag:* commands work

□ Step 1.10: Run comparison test
  Test: Semantic search finds expected matches

PHASE 2 (in order):

□ Step 2.1: Update requirements.txt with Phase 2 deps
□ Step 2.2: Create parse.py
□ Step 2.3: Test PDF parsing
□ Step 2.4: Test DOCX parsing
□ Step 2.5: Update package.json with parse scripts
```

---

## Appendix A: Glossary

<!-- DMITRII: Reference for technical terms -->

| Term | Meaning |
|------|---------|
| **Semantic search** | Search by meaning, not exact words. "car" finds "automobile". |
| **Knowledge graph** | A web of connected concepts. "Python" connects to "programming", "snake", "Monty Python". |
| **Embeddings** | Numbers that represent the meaning of text. Similar meanings = similar numbers. |
| **LLM** | Large Language Model. The AI that understands text (like Claude or GPT). |
| **Vector DB** | Database optimized for finding similar embeddings quickly. |
| **RAG** | Retrieval-Augmented Generation. Find relevant info, then generate response. |
| **Subprocess** | Running one program from inside another. TypeScript runs Python this way. |
| **Context manager** | Python pattern (`with` statement) that ensures cleanup happens. |

---

## Appendix B: Troubleshooting

<!-- DMITRII: When things go wrong, check here first -->

| Problem | Likely Cause | Solution |
|---------|--------------|----------|
| "Index not found" | Haven't run indexing | `npm run rag:index` |
| "OPENAI_API_KEY not set" | Missing env var | Add to `.env.local` |
| "No module named lightrag" | Python deps missing | `npm run rag:setup` |
| Search returns empty | Index is stale | Re-run `npm run rag:index` |
| TypeScript errors | Missing types | Run `npm install` |
| Python syntax errors | Wrong Python version | Ensure Python 3.10+ |

---

*End of specification.*
