# LightRAG + RAG-Anything Integration Plan

> **Goal**: Enhance Universal CV document parsing with semantic search and multimodal processing while maintaining local-first development and deep understanding of the technology.

## Executive Summary

This plan integrates two state-of-the-art RAG frameworks into the portfolio project:
- **RAG-Anything**: Document parsing (PDFs, DOCX, images → structured data)
- **LightRAG**: Knowledge graph + semantic retrieval

### Infrastructure Overview

| Component | MVP (Phase 1) | Full (Phase 3+) |
|-----------|---------------|-----------------|
| **Storage** | File-based JSON/Parquet | PostgreSQL + Neo4j |
| **Embeddings** | OpenAI API (existing) | Local BAAI/bge-m3 |
| **LLM** | Claude/OpenAI (existing) | Hybrid (local + API) |
| **Vector DB** | Built-in nano-vectordb | Milvus or Qdrant |
| **New Services** | None | PostgreSQL, Neo4j (Docker) |

---

## Phase 0: Foundation & Learning (1-2 days)

### Objective
Understand both frameworks hands-on before integrating into the portfolio.

### 0.1 Environment Setup

```bash
# Create isolated learning environment
mkdir -p ~/learn/rag-exploration
cd ~/learn/rag-exploration

# Clone both repos for exploration
git clone https://github.com/fotescodev/rag-anything.git
git clone https://github.com/fotescodev/LightRAG.git

# Set up Python environment (both projects are Python-based)
python3 -m venv .venv
source .venv/bin/activate

# Install LightRAG first (foundation)
cd LightRAG
pip install -e .
# Or: pip install lightrag-hku

# Install RAG-Anything (builds on LightRAG)
cd ../rag-anything
pip install -e .
# Or: pip install raganything
```

### 0.2 Learning Exercises

**Exercise 1: Basic LightRAG Text Processing**
```python
# learn/01_basic_lightrag.py
"""
Goal: Understand how LightRAG extracts entities and relationships
from plain text and builds a knowledge graph.
"""
import asyncio
from lightrag import LightRAG, QueryParam
from lightrag.llm.openai import gpt_4o_mini_complete, openai_embed

async def main():
    # Initialize with file-based storage (no external DB needed)
    rag = LightRAG(
        working_dir="./rag_test_storage",
        llm_model_func=gpt_4o_mini_complete,
        embedding_func=openai_embed,
    )

    # LEARNING: Observe what gets created in ./rag_test_storage/
    # - graph_chunk_entity_relation.graphml (knowledge graph)
    # - vdb_chunks.json (vector embeddings)
    # - kv_store_*.json (key-value metadata)

    await rag.initialize_storages()

    # Insert a sample achievement from your portfolio
    sample_text = """
    At Ankr, I led the pivot from hardware staking to RPC infrastructure,
    resulting in 15x revenue growth over 18 months. The key was redesigning
    the API architecture to handle 10B+ daily requests while maintaining
    sub-100ms latency. I built SDKs in TypeScript, Python, and Go that
    reduced integration time from weeks to hours.
    """

    await rag.ainsert(sample_text)

    # LEARNING: Try different query modes to understand retrieval
    modes = ["naive", "local", "global", "hybrid"]

    for mode in modes:
        print(f"\n{'='*50}")
        print(f"Query Mode: {mode}")
        print('='*50)

        result = await rag.aquery(
            "What technical skills did this person demonstrate?",
            param=QueryParam(mode=mode)
        )
        print(result)

    await rag.finalize_storages()

if __name__ == "__main__":
    asyncio.run(main())
```

**Exercise 2: Inspect the Knowledge Graph**
```python
# learn/02_inspect_graph.py
"""
Goal: Understand the entity-relationship structure LightRAG creates.
This is key to understanding how semantic search works.
"""
import networkx as nx

# Load the generated graph
G = nx.read_graphml("./rag_test_storage/graph_chunk_entity_relation.graphml")

print("=== ENTITIES (Nodes) ===")
for node, attrs in list(G.nodes(data=True))[:10]:
    print(f"  {node}: {attrs.get('entity_type', 'unknown')}")

print("\n=== RELATIONSHIPS (Edges) ===")
for u, v, attrs in list(G.edges(data=True))[:10]:
    print(f"  {u} --[{attrs.get('relationship', '?')}]--> {v}")

print(f"\nTotal: {G.number_of_nodes()} entities, {G.number_of_edges()} relationships")
```

**Exercise 3: RAG-Anything Document Processing**
```python
# learn/03_document_parsing.py
"""
Goal: Understand how RAG-Anything handles multimodal documents.
Use a real PDF (e.g., your resume or a case study).
"""
import asyncio
from raganything import RAGAnything, RAGAnythingConfig

async def main():
    config = RAGAnythingConfig(
        working_dir="./raganything_storage",
        # MinerU parser extracts structure from PDFs
        parser="mineru",
        # Enable multimodal processing
        enable_image_processing=True,
        enable_table_processing=True,
        enable_equation_processing=False,  # Not needed for CVs
    )

    # Note: You'll need to provide LLM/embedding functions
    # Similar to LightRAG setup

    rag = RAGAnything(
        config=config,
        llm_model_func=your_llm_function,
        vision_model_func=your_vision_function,  # For images
        embedding_func=your_embedding_function,
    )

    # LEARNING: Process a PDF and observe the output structure
    await rag.process_document_complete(
        file_path="path/to/your/resume.pdf",
        output_dir="./parsed_output"
    )

    # Check ./parsed_output/ for:
    # - Extracted text chunks
    # - Table data (if any)
    # - Image descriptions (if any)

    # Query the processed content
    result = await rag.aquery(
        "What are this person's key achievements?",
        mode="hybrid"
    )
    print(result)

if __name__ == "__main__":
    asyncio.run(main())
```

### 0.3 Key Concepts to Understand

Before proceeding, ensure you understand:

| Concept | What It Means | Why It Matters |
|---------|---------------|----------------|
| **Entity Extraction** | LLM identifies nouns/concepts as nodes | Forms the "what" of your knowledge |
| **Relationship Extraction** | LLM identifies verbs/connections as edges | Forms the "how" things connect |
| **Local vs Global Retrieval** | Local = specific entities; Global = high-level themes | Different query types need different modes |
| **Hybrid Mode** | Combines local + global + vector similarity | Best for complex queries like job matching |
| **Chunking Strategy** | How documents are split for processing | Affects retrieval accuracy |
| **MinerU Parser** | Structure-aware PDF extraction | Preserves tables, headers, layout |

### 0.4 Checkpoint Questions

Answer these before moving to Phase 1:
1. What entities did LightRAG extract from your sample text?
2. How do query results differ between `local` and `global` modes?
3. What files does LightRAG create in `working_dir`?
4. How does RAG-Anything handle a PDF differently than raw text?

---

## Phase 1: MVP - Semantic Evidence Search (3-5 days)

### Objective
Replace `scripts/search-evidence.ts` with LightRAG-powered semantic search while keeping all existing functionality.

### 1.1 Architecture

```
Current Flow:
┌─────────────────┐     ┌──────────────────────┐     ┌─────────────────┐
│ Job Description │────▶│ search-evidence.ts   │────▶│ Matched YAML    │
│ (text)          │     │ (substring matching) │     │ Achievements    │
└─────────────────┘     └──────────────────────┘     └─────────────────┘

New Flow (Phase 1):
┌─────────────────┐     ┌──────────────────────┐     ┌─────────────────┐
│ Job Description │────▶│ search-evidence.ts   │────▶│ Matched YAML    │
│ (text)          │     │ (LightRAG semantic)  │     │ Achievements    │
└─────────────────┘     └──────────────────────┘     └─────────────────┘
                               │
                               ▼
                        ┌──────────────────┐
                        │ LightRAG Index   │
                        │ (file-based)     │
                        │ - achievements   │
                        │ - case studies   │
                        │ - experience     │
                        └──────────────────┘
```

### 1.2 Infrastructure (Local Only)

**No new services required!** LightRAG supports file-based storage:

```
portfolio/
├── .rag/                          # NEW: LightRAG working directory
│   ├── graph_chunk_entity_relation.graphml
│   ├── vdb_chunks.json
│   ├── kv_store_full_docs.json
│   └── kv_store_text_chunks.json
├── scripts/
│   ├── search-evidence.ts         # Modified to call Python
│   └── rag/                        # NEW: Python RAG scripts
│       ├── index_knowledge_base.py
│       ├── search.py
│       └── requirements.txt
```

### 1.3 Implementation Steps

**Step 1: Add Python RAG Module**

```python
# scripts/rag/requirements.txt
lightrag-hku>=1.0.0
python-dotenv>=1.0.0

# scripts/rag/config.py
"""
Shared configuration for RAG operations.
Uses same API keys as the TypeScript codebase.
"""
import os
from pathlib import Path
from dotenv import load_dotenv

# Load from project root
load_dotenv(Path(__file__).parent.parent.parent / ".env.local")

RAG_WORKING_DIR = Path(__file__).parent.parent.parent / ".rag"
KNOWLEDGE_DIR = Path(__file__).parent.parent.parent / "content" / "knowledge"

# Reuse existing API keys
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
```

```python
# scripts/rag/index_knowledge_base.py
"""
Index the YAML knowledge base into LightRAG.
Run this when knowledge base changes.
"""
import asyncio
import yaml
from pathlib import Path
from lightrag import LightRAG
from lightrag.llm.openai import gpt_4o_mini_complete, openai_embed
from config import RAG_WORKING_DIR, KNOWLEDGE_DIR

async def load_achievements() -> list[str]:
    """Convert YAML achievements to indexable text."""
    texts = []
    achievements_dir = KNOWLEDGE_DIR / "achievements"

    for yaml_file in achievements_dir.glob("*.yaml"):
        if yaml_file.name.startswith("_"):
            continue

        with open(yaml_file) as f:
            data = yaml.safe_load(f)

        # Convert structured YAML to rich text for indexing
        text = f"""
Achievement: {data.get('headline', '')}

Context (Situation):
{data.get('situation', '')}

Responsibility (Task):
{data.get('task', '')}

Actions Taken:
{data.get('action', '')}

Results and Impact:
{data.get('result', '')}

Skills Demonstrated: {', '.join(data.get('skills', []))}
Themes: {', '.join(data.get('themes', []))}
Companies: {', '.join(data.get('companies', []))}
Years: {', '.join(map(str, data.get('years', [])))}

Good for interviews about: {', '.join(data.get('good_for', []))}
        """
        texts.append(text.strip())

    return texts

async def index_case_studies() -> list[str]:
    """Index case study markdown files."""
    texts = []
    case_studies_dir = KNOWLEDGE_DIR.parent / "case-studies"

    for md_file in case_studies_dir.glob("*.md"):
        content = md_file.read_text()
        texts.append(content)

    return texts

async def main():
    print("Initializing LightRAG...")
    rag = LightRAG(
        working_dir=str(RAG_WORKING_DIR),
        llm_model_func=gpt_4o_mini_complete,
        embedding_func=openai_embed,
    )
    await rag.initialize_storages()

    print("Loading achievements...")
    achievements = await load_achievements()
    print(f"  Found {len(achievements)} achievements")

    print("Loading case studies...")
    case_studies = await index_case_studies()
    print(f"  Found {len(case_studies)} case studies")

    print("Indexing content...")
    all_content = achievements + case_studies

    for i, text in enumerate(all_content):
        print(f"  Indexing {i+1}/{len(all_content)}...")
        await rag.ainsert(text)

    await rag.finalize_storages()
    print("Done! Index saved to", RAG_WORKING_DIR)

if __name__ == "__main__":
    asyncio.run(main())
```

```python
# scripts/rag/search.py
"""
Semantic search interface for TypeScript to call.
Outputs JSON for easy parsing.
"""
import asyncio
import json
import sys
from lightrag import LightRAG, QueryParam
from lightrag.llm.openai import gpt_4o_mini_complete, openai_embed
from config import RAG_WORKING_DIR

async def search(query: str, mode: str = "hybrid", top_k: int = 5) -> dict:
    """
    Search the knowledge base semantically.

    Args:
        query: The search query (e.g., job description excerpt)
        mode: "local" (entities), "global" (themes), "hybrid" (both)
        top_k: Number of results to return

    Returns:
        JSON with matches and relevance scores
    """
    rag = LightRAG(
        working_dir=str(RAG_WORKING_DIR),
        llm_model_func=gpt_4o_mini_complete,
        embedding_func=openai_embed,
    )
    await rag.initialize_storages()

    # Get the raw retrieval results (not just the generated answer)
    result = await rag.aquery(
        query,
        param=QueryParam(
            mode=mode,
            top_k=top_k,
            # Return sources for attribution
            response_type="multiple paragraphs with sources",
        )
    )

    await rag.finalize_storages()

    return {
        "query": query,
        "mode": mode,
        "result": result,
        # Note: For structured results with scores, we'd need to
        # access the retrieval context directly (Phase 2 enhancement)
    }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Usage: search.py <query> [mode] [top_k]"}))
        sys.exit(1)

    query = sys.argv[1]
    mode = sys.argv[2] if len(sys.argv) > 2 else "hybrid"
    top_k = int(sys.argv[3]) if len(sys.argv) > 3 else 5

    result = asyncio.run(search(query, mode, top_k))
    print(json.dumps(result, indent=2))
```

**Step 2: TypeScript Integration Bridge**

```typescript
// scripts/rag/bridge.ts
/**
 * TypeScript bridge to Python RAG scripts.
 * Maintains type safety while leveraging Python ML ecosystem.
 */
import { execSync, spawn } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

const RAG_DIR = join(__dirname);
const PYTHON_CMD = 'python3';

interface SearchResult {
  query: string;
  mode: 'local' | 'global' | 'hybrid';
  result: string;
  // Future: structured matches with scores
}

/**
 * Check if RAG index exists
 */
export function isIndexed(): boolean {
  const indexPath = join(__dirname, '../../.rag/vdb_chunks.json');
  return existsSync(indexPath);
}

/**
 * Reindex the knowledge base
 */
export async function reindex(): Promise<void> {
  return new Promise((resolve, reject) => {
    const proc = spawn(PYTHON_CMD, [join(RAG_DIR, 'index_knowledge_base.py')], {
      stdio: 'inherit',
    });

    proc.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Indexing failed with code ${code}`));
    });
  });
}

/**
 * Semantic search over knowledge base
 */
export async function semanticSearch(
  query: string,
  options: { mode?: 'local' | 'global' | 'hybrid'; topK?: number } = {}
): Promise<SearchResult> {
  const { mode = 'hybrid', topK = 5 } = options;

  const result = execSync(
    `${PYTHON_CMD} ${join(RAG_DIR, 'search.py')} "${query.replace(/"/g, '\\"')}" ${mode} ${topK}`,
    { encoding: 'utf-8' }
  );

  return JSON.parse(result);
}
```

**Step 3: Enhance search-evidence.ts**

```typescript
// In scripts/search-evidence.ts - add semantic search option

import { semanticSearch, isIndexed } from './rag/bridge';

interface SearchOptions {
  // Existing options
  minRelevance?: number;
  maxResults?: number;
  // New option
  useSemanticSearch?: boolean;
}

export async function searchEvidence(
  query: string,
  options: SearchOptions = {}
): Promise<SearchResult[]> {
  const { useSemanticSearch = true } = options;

  if (useSemanticSearch && isIndexed()) {
    // NEW: Use LightRAG semantic search
    const semanticResult = await semanticSearch(query, {
      mode: 'hybrid',
      topK: options.maxResults || 10,
    });

    // Convert to existing format for compatibility
    return convertSemanticResults(semanticResult);
  }

  // FALLBACK: Existing substring matching
  return existingSubstringSearch(query, options);
}
```

### 1.4 New npm Scripts

```json
// package.json additions
{
  "scripts": {
    "rag:setup": "cd scripts/rag && pip install -r requirements.txt",
    "rag:index": "python3 scripts/rag/index_knowledge_base.py",
    "rag:search": "python3 scripts/rag/search.py",
    "rag:inspect": "python3 scripts/rag/inspect_graph.py"
  }
}
```

### 1.5 Testing & Validation

```typescript
// scripts/test-rag-accuracy.ts
/**
 * Compare semantic vs substring search accuracy.
 * Uses known good matches as ground truth.
 */

const TEST_QUERIES = [
  {
    query: "API design and SDK development experience",
    expectedMatches: ["ankr-15x-revenue", "forte-wallet-sdk"],
  },
  {
    query: "Ethereum and blockchain infrastructure",
    expectedMatches: ["eth-staking-zero-slashing", "l2-protocol-integrations"],
  },
  {
    query: "Developer experience and tooling",
    expectedMatches: ["flow-cli-dx", "forte-wallet-sdk"],
  },
];

async function compareSearchMethods() {
  for (const test of TEST_QUERIES) {
    const substringResults = await existingSearch(test.query);
    const semanticResults = await semanticSearch(test.query);

    console.log(`Query: ${test.query}`);
    console.log(`Expected: ${test.expectedMatches.join(', ')}`);
    console.log(`Substring found: ${substringResults.map(r => r.id).join(', ')}`);
    console.log(`Semantic found: ${semanticResults.map(r => r.id).join(', ')}`);
    console.log('---');
  }
}
```

### 1.6 Phase 1 Deliverables Checklist

- [ ] Python RAG module in `scripts/rag/`
- [ ] Knowledge base indexing script
- [ ] Semantic search CLI
- [ ] TypeScript bridge for integration
- [ ] Enhanced `search-evidence.ts` with semantic option
- [ ] Comparison tests (semantic vs substring)
- [ ] Documentation of query modes and when to use each

---

## Phase 2: Document Parsing with RAG-Anything (5-7 days)

### Objective
Add multimodal document parsing for PDFs, DOCX, and images to accelerate knowledge base creation.

### 2.1 Architecture

```
New Ingestion Flow:
┌─────────────────┐     ┌──────────────────────┐     ┌─────────────────┐
│ Source Files    │────▶│ RAG-Anything Parser  │────▶│ Structured      │
│ - PDFs          │     │ - MinerU extraction  │     │ Chunks          │
│ - DOCX          │     │ - Table processing   │     │ (JSON)          │
│ - Screenshots   │     │ - Image OCR          │     │                 │
└─────────────────┘     └──────────────────────┘     └─────────────────┘
                                                              │
                               ┌──────────────────────────────┘
                               ▼
┌─────────────────┐     ┌──────────────────────┐     ┌─────────────────┐
│ AI Structuring  │◀────│ LightRAG Index       │◀────│ Entity          │
│ (Claude/GPT)    │     │ (semantic layer)     │     │ Extraction      │
│ → YAML output   │     │                      │     │                 │
└─────────────────┘     └──────────────────────┘     └─────────────────┘
        │
        ▼
┌─────────────────┐
│ Zod Validation  │
│ → knowledge/    │
└─────────────────┘
```

### 2.2 Infrastructure Requirements

**New Local Dependencies:**

```bash
# MinerU for document parsing (RAG-Anything's backbone)
pip install magic-pdf

# LibreOffice for DOCX/PPTX/XLSX conversion
# macOS:
brew install libreoffice

# Linux:
sudo apt-get install libreoffice

# Tesseract for OCR (optional, for scanned PDFs)
# macOS:
brew install tesseract

# Linux:
sudo apt-get install tesseract-ocr
```

### 2.3 Implementation

```python
# scripts/rag/parse_document.py
"""
Parse any document into structured chunks using RAG-Anything.
Outputs JSON that can feed into knowledge base generation.
"""
import asyncio
import json
import sys
from pathlib import Path
from raganything import RAGAnything, RAGAnythingConfig
from config import RAG_WORKING_DIR, OPENAI_API_KEY

async def parse_document(
    file_path: str,
    output_dir: str = "./parsed_output"
) -> dict:
    """
    Parse a document and extract structured content.

    Returns:
        {
            "source_file": "path/to/file.pdf",
            "chunks": [
                {
                    "type": "text",
                    "content": "...",
                    "metadata": {"page": 1, "section": "Experience"}
                },
                {
                    "type": "table",
                    "content": [["Header1", "Header2"], ["Row1Col1", "Row1Col2"]],
                    "metadata": {"page": 2}
                },
                {
                    "type": "image",
                    "description": "Screenshot of dashboard showing...",
                    "path": "parsed_output/images/img_001.png"
                }
            ],
            "entities": ["Ankr", "Ethereum", "API", ...],
            "summary": "This document describes..."
        }
    """
    config = RAGAnythingConfig(
        working_dir=str(RAG_WORKING_DIR / "parsing"),
        parser="mineru",
        enable_image_processing=True,
        enable_table_processing=True,
    )

    # Process the document
    result = await process_with_raganything(file_path, config, output_dir)

    return result

async def process_with_raganything(file_path: str, config, output_dir: str) -> dict:
    """
    Core processing logic using RAG-Anything.
    """
    from raganything import RAGAnything
    from lightrag.llm.openai import gpt_4o_mini_complete, openai_embed

    rag = RAGAnything(
        config=config,
        llm_model_func=gpt_4o_mini_complete,
        embedding_func=openai_embed,
        # Vision model for image descriptions
        vision_model_func=gpt_4o_mini_complete,  # Or GPT-4V
    )

    # Parse document
    parsed = await rag.process_document_complete(
        file_path=file_path,
        output_dir=output_dir
    )

    # Extract structured output
    return {
        "source_file": file_path,
        "chunks": parsed.chunks,
        "entities": parsed.entities,
        "summary": parsed.summary,
    }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Usage: parse_document.py <file_path> [output_dir]"}))
        sys.exit(1)

    file_path = sys.argv[1]
    output_dir = sys.argv[2] if len(sys.argv) > 2 else "./parsed_output"

    result = asyncio.run(parse_document(file_path, output_dir))
    print(json.dumps(result, indent=2, default=str))
```

```python
# scripts/rag/ingest_to_knowledge_base.py
"""
Convert parsed document chunks into knowledge base YAML.
Uses AI to structure into achievement/story format.
"""
import asyncio
import yaml
from pathlib import Path
from anthropic import Anthropic

ACHIEVEMENT_PROMPT = """
You are converting parsed document content into a structured achievement for a portfolio knowledge base.

Input chunks (from parsed document):
{chunks}

Convert this into a YAML achievement following this exact schema:
```yaml
id: kebab-case-unique-id
headline: "One line summary with metric if possible"
metric:
  value: "X"
  unit: "description"
  context: "what this means"
situation: |
  2-3 sentences on context and constraints
task: |
  2-3 sentences on your specific responsibility
action: |
  3-5 sentences on what you did, technically specific
result: |
  2-3 sentences on outcomes with metrics
skills: [skill1, skill2]  # From: api-design, sdk-development, blockchain, etc.
themes: [theme1, theme2]  # From: revenue-growth, developer-experience, etc.
companies: [company-name]
years: [2023, 2024]
good_for: ["Interview type 1", "Interview type 2"]
evidence:
  source: "Original document"
```

Output ONLY the YAML, no explanation.
"""

async def chunks_to_achievement(chunks: list[dict]) -> str:
    """Convert document chunks to achievement YAML."""
    client = Anthropic()

    # Format chunks for prompt
    chunks_text = "\n\n".join([
        f"[{c['type'].upper()}]\n{c['content']}"
        for c in chunks
    ])

    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=2000,
        messages=[{
            "role": "user",
            "content": ACHIEVEMENT_PROMPT.format(chunks=chunks_text)
        }]
    )

    return response.content[0].text

async def main(parsed_json_path: str, output_dir: str):
    """Main ingestion pipeline."""
    import json

    with open(parsed_json_path) as f:
        parsed = json.load(f)

    # Group chunks by likely achievement boundaries
    # (This is a simplification - real implementation would be smarter)
    achievement_yaml = await chunks_to_achievement(parsed["chunks"])

    # Validate with Zod (via TypeScript call)
    # ... validation logic ...

    # Save to knowledge base
    output_path = Path(output_dir) / "achievements" / f"{parsed['source_file'].stem}.yaml"
    output_path.write_text(achievement_yaml)

    print(f"Created: {output_path}")

if __name__ == "__main__":
    import sys
    asyncio.run(main(sys.argv[1], sys.argv[2]))
```

### 2.4 Enhanced cv-data-ingestion Workflow

```
BEFORE (Manual):
1. User provides source files
2. Human reads and extracts key info
3. Human writes YAML manually
4. Run npm run validate

AFTER (RAG-Assisted):
1. User provides source files (PDF, DOCX, etc.)
2. RAG-Anything parses → structured chunks
3. LightRAG extracts entities/relationships
4. AI structures into Zod-compliant YAML
5. Human reviews and refines
6. Run npm run validate
```

### 2.5 New npm Scripts

```json
{
  "scripts": {
    "rag:parse": "python3 scripts/rag/parse_document.py",
    "rag:ingest": "python3 scripts/rag/ingest_to_knowledge_base.py",
    "rag:pipeline": "npm run rag:parse -- $1 && npm run rag:ingest -- ./parsed_output/result.json content/knowledge"
  }
}
```

### 2.6 Phase 2 Deliverables Checklist

- [ ] MinerU/LibreOffice installed and configured
- [ ] Document parsing script (PDF, DOCX, images)
- [ ] Chunk-to-YAML conversion with AI
- [ ] Integration with existing cv-data-ingestion skill
- [ ] Validation that output matches Zod schemas
- [ ] Test with real portfolio documents

---

## Phase 3: Full Infrastructure (7-10 days)

### Objective
Deploy production-grade storage backends for scalability and advanced features.

### 3.1 Infrastructure Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Docker Compose                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ PostgreSQL  │  │   Neo4j     │  │   Qdrant    │              │
│  │ (metadata)  │  │ (kg graph)  │  │ (vectors)   │              │
│  │ Port: 5432  │  │ Port: 7687  │  │ Port: 6333  │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐                               │
│  │   Redis     │  │  Ollama     │  ← Optional: local LLM        │
│  │  (cache)    │  │  (LLM)      │                               │
│  │ Port: 6379  │  │ Port: 11434 │                               │
│  └─────────────┘  └─────────────┘                               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Docker Compose Setup

```yaml
# docker/docker-compose.yml
version: '3.8'

services:
  # PostgreSQL for document metadata and status tracking
  postgres:
    image: postgres:16-alpine
    container_name: portfolio-postgres
    environment:
      POSTGRES_USER: portfolio
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-localdev}
      POSTGRES_DB: portfolio_rag
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init-scripts/postgres:/docker-entrypoint-initdb.d
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U portfolio"]
      interval: 5s
      timeout: 5s
      retries: 5

  # Neo4j for knowledge graph storage
  neo4j:
    image: neo4j:5.15-community
    container_name: portfolio-neo4j
    environment:
      NEO4J_AUTH: neo4j/${NEO4J_PASSWORD:-localdev}
      NEO4J_PLUGINS: '["apoc"]'
    ports:
      - "7474:7474"  # HTTP
      - "7687:7687"  # Bolt
    volumes:
      - neo4j_data:/data
      - neo4j_logs:/logs
    healthcheck:
      test: ["CMD", "neo4j", "status"]
      interval: 10s
      timeout: 10s
      retries: 5

  # Qdrant for vector embeddings
  qdrant:
    image: qdrant/qdrant:latest
    container_name: portfolio-qdrant
    ports:
      - "6333:6333"  # HTTP
      - "6334:6334"  # gRPC
    volumes:
      - qdrant_data:/qdrant/storage
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:6333/health"]
      interval: 5s
      timeout: 5s
      retries: 5

  # Redis for caching (optional but recommended)
  redis:
    image: redis:7-alpine
    container_name: portfolio-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 5s
      retries: 5

  # Ollama for local LLM (optional - saves API costs)
  ollama:
    image: ollama/ollama:latest
    container_name: portfolio-ollama
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama
    # Uncomment for GPU support:
    # deploy:
    #   resources:
    #     reservations:
    #       devices:
    #         - driver: nvidia
    #           count: 1
    #           capabilities: [gpu]

volumes:
  postgres_data:
  neo4j_data:
  neo4j_logs:
  qdrant_data:
  redis_data:
  ollama_data:
```

### 3.3 LightRAG Configuration for Production Backends

```python
# scripts/rag/config_production.py
"""
Production configuration using external storage backends.
"""
import os
from lightrag import LightRAG
from lightrag.kg.postgres_impl import PostgreSQLStorage
from lightrag.kg.neo4j_impl import Neo4jStorage
from lightrag.vector.qdrant_impl import QdrantStorage

def create_production_rag():
    """Create LightRAG instance with production backends."""

    return LightRAG(
        working_dir="./rag_working",

        # Knowledge Graph in Neo4j
        kg_storage=Neo4jStorage(
            uri=os.getenv("NEO4J_URI", "bolt://localhost:7687"),
            user=os.getenv("NEO4J_USER", "neo4j"),
            password=os.getenv("NEO4J_PASSWORD", "localdev"),
        ),

        # Vector embeddings in Qdrant
        vector_storage=QdrantStorage(
            host=os.getenv("QDRANT_HOST", "localhost"),
            port=int(os.getenv("QDRANT_PORT", "6333")),
            collection_name="portfolio_embeddings",
        ),

        # Metadata in PostgreSQL
        doc_storage=PostgreSQLStorage(
            host=os.getenv("POSTGRES_HOST", "localhost"),
            port=int(os.getenv("POSTGRES_PORT", "5432")),
            database=os.getenv("POSTGRES_DB", "portfolio_rag"),
            user=os.getenv("POSTGRES_USER", "portfolio"),
            password=os.getenv("POSTGRES_PASSWORD", "localdev"),
        ),

        # LLM configuration
        llm_model_func=get_llm_function(),
        embedding_func=get_embedding_function(),
    )

def get_llm_function():
    """Get LLM function - prefer local Ollama, fallback to API."""
    ollama_url = os.getenv("OLLAMA_URL", "http://localhost:11434")

    # Try Ollama first
    try:
        from lightrag.llm.ollama import ollama_complete
        return ollama_complete
    except:
        pass

    # Fallback to OpenAI
    from lightrag.llm.openai import gpt_4o_mini_complete
    return gpt_4o_mini_complete

def get_embedding_function():
    """Get embedding function."""
    # For production, consider local embeddings to reduce API costs
    # BAAI/bge-m3 is recommended
    from lightrag.llm.openai import openai_embed
    return openai_embed
```

### 3.4 npm Scripts for Infrastructure

```json
{
  "scripts": {
    "infra:up": "docker compose -f docker/docker-compose.yml up -d",
    "infra:down": "docker compose -f docker/docker-compose.yml down",
    "infra:logs": "docker compose -f docker/docker-compose.yml logs -f",
    "infra:reset": "docker compose -f docker/docker-compose.yml down -v && docker compose -f docker/docker-compose.yml up -d",
    "infra:status": "docker compose -f docker/docker-compose.yml ps"
  }
}
```

### 3.5 Environment Configuration

```bash
# .env.local additions for Phase 3

# PostgreSQL
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=portfolio_rag
POSTGRES_USER=portfolio
POSTGRES_PASSWORD=your-secure-password

# Neo4j
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=your-secure-password

# Qdrant
QDRANT_HOST=localhost
QDRANT_PORT=6333

# Redis (optional)
REDIS_URL=redis://localhost:6379

# Ollama (optional)
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3.1:8b  # or mixtral, etc.

# Feature flags
USE_LOCAL_LLM=false
USE_PRODUCTION_STORAGE=true
```

### 3.6 Migration Script

```python
# scripts/rag/migrate_to_production.py
"""
Migrate from file-based storage to production backends.
"""
import asyncio
from pathlib import Path

async def migrate():
    """Migrate existing file-based index to production storage."""
    from config import RAG_WORKING_DIR
    from config_production import create_production_rag

    # Load existing data
    old_rag = LightRAG(working_dir=str(RAG_WORKING_DIR))
    await old_rag.initialize_storages()

    # Get all documents
    docs = await old_rag.get_all_documents()

    # Create production instance
    new_rag = create_production_rag()
    await new_rag.initialize_storages()

    # Re-insert all documents
    for doc in docs:
        print(f"Migrating: {doc.id[:50]}...")
        await new_rag.ainsert(doc.content)

    await old_rag.finalize_storages()
    await new_rag.finalize_storages()

    print(f"Migrated {len(docs)} documents to production storage")

if __name__ == "__main__":
    asyncio.run(migrate())
```

### 3.7 Phase 3 Deliverables Checklist

- [ ] Docker Compose configuration
- [ ] PostgreSQL, Neo4j, Qdrant running locally
- [ ] LightRAG configured with production backends
- [ ] Migration script from file-based to production
- [ ] Environment variable configuration
- [ ] Health check and monitoring scripts
- [ ] Documentation for infrastructure management

---

## Phase 4: Advanced Features (Ongoing)

### 4.1 Local LLM with Ollama

```bash
# Pull recommended models
docker exec -it portfolio-ollama ollama pull llama3.1:8b
docker exec -it portfolio-ollama ollama pull nomic-embed-text  # For embeddings
```

```python
# scripts/rag/config_local_llm.py
"""
Configuration for fully local operation (no API calls).
"""
from lightrag.llm.ollama import ollama_complete, ollama_embed

def create_local_rag():
    return LightRAG(
        working_dir="./rag_working",
        llm_model_func=lambda prompt: ollama_complete(
            prompt,
            model="llama3.1:8b",
            host="http://localhost:11434"
        ),
        embedding_func=lambda texts: ollama_embed(
            texts,
            model="nomic-embed-text",
            host="http://localhost:11434"
        ),
        # ... storage config ...
    )
```

### 4.2 Variant Generation Integration

```python
# scripts/rag/generate_variant_context.py
"""
Use RAG to gather relevant context for variant generation.
Replaces the current "dump everything" approach.
"""

async def get_variant_context(job_description: str) -> dict:
    """
    Query RAG for relevant achievements, skills, and case studies
    for a specific job description.

    Returns focused context instead of entire portfolio.
    """
    rag = create_production_rag()
    await rag.initialize_storages()

    # Multi-query approach for comprehensive context
    queries = [
        f"What achievements are most relevant to: {job_description}",
        f"What technical skills match: {job_description}",
        f"What case studies demonstrate experience for: {job_description}",
    ]

    context = {
        "achievements": [],
        "skills": [],
        "case_studies": [],
    }

    for query in queries:
        result = await rag.aquery(
            query,
            param=QueryParam(mode="hybrid", top_k=5)
        )
        # Parse and categorize results
        # ...

    await rag.finalize_storages()
    return context
```

### 4.3 Claims Verification with RAG

```python
# scripts/rag/verify_claims.py
"""
Verify variant claims against knowledge base evidence.
Uses RAG to find supporting context for each claim.
"""

async def verify_claim(claim: str) -> dict:
    """
    Check if a claim is supported by knowledge base evidence.

    Returns:
        {
            "claim": "Led 15x revenue growth at Ankr",
            "supported": True,
            "confidence": 0.92,
            "evidence": [
                {
                    "source": "ankr-15x-revenue.yaml",
                    "excerpt": "...",
                    "relevance": 0.95
                }
            ]
        }
    """
    rag = create_production_rag()
    await rag.initialize_storages()

    # Query for evidence
    result = await rag.aquery(
        f"Find evidence supporting this claim: {claim}",
        param=QueryParam(mode="local", top_k=3)
    )

    # Calculate confidence based on semantic similarity
    # ...

    await rag.finalize_storages()
    return verification_result
```

### 4.4 Real-time Knowledge Base Updates

```python
# scripts/rag/watch_and_index.py
"""
Watch knowledge base directory and auto-reindex on changes.
"""
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

class KnowledgeBaseHandler(FileSystemEventHandler):
    def on_modified(self, event):
        if event.src_path.endswith('.yaml'):
            asyncio.run(reindex_single_file(event.src_path))

    def on_created(self, event):
        if event.src_path.endswith('.yaml'):
            asyncio.run(reindex_single_file(event.src_path))

# Run with: python scripts/rag/watch_and_index.py
```

---

## Resource Requirements Summary

### Development Machine Requirements

| Phase | CPU | RAM | Disk | GPU |
|-------|-----|-----|------|-----|
| Phase 0-1 | Any | 8GB+ | 1GB | Not needed |
| Phase 2 | Any | 16GB+ | 5GB | Not needed |
| Phase 3 | 4+ cores | 16GB+ | 20GB | Optional |
| Phase 4 (local LLM) | 8+ cores | 32GB+ | 50GB | Recommended |

### API Cost Estimates (per month)

| Phase | OpenAI Embeddings | LLM Calls | Estimated Cost |
|-------|-------------------|-----------|----------------|
| Phase 1 | ~100K tokens | ~50K tokens | $5-10 |
| Phase 2 | ~500K tokens | ~200K tokens | $20-40 |
| Phase 3 | Reduced (caching) | Reduced | $10-20 |
| Phase 4 | Optional | Optional (local) | $0-10 |

---

## Learning Resources

### Documentation
- [LightRAG Documentation](https://github.com/HKUDS/LightRAG)
- [RAG-Anything Technical Report](https://arxiv.org/abs/2510.12323)
- [MinerU Documentation](https://github.com/opendatalab/MinerU)

### Key Papers
- "LightRAG: Simple and Fast Retrieval-Augmented Generation" (EMNLP 2025)
- "RAG-Anything: Multimodal RAG for Any Document" (arXiv 2510.12323)

### Tutorials
- Run learning exercises in Phase 0 before implementing
- Inspect generated graphs to understand entity/relationship extraction
- Compare query modes to understand retrieval strategies

---

## Next Steps

1. **Start with Phase 0** - Set up learning environment and run exercises
2. **Answer checkpoint questions** before proceeding
3. **Phase 1 MVP** - Replace search-evidence.ts with semantic search
4. **Measure improvement** - Compare substring vs semantic search accuracy
5. **Iterate** - Refine based on real-world usage

This plan prioritizes understanding over speed. Each phase builds on the previous one, and you'll have working software at each checkpoint.
