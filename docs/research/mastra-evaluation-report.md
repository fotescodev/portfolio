# Mastra Framework Evaluation Report

**Prepared by:** Engineering Lead Analysis
**Date:** 2025-12-23
**Repository:** https://github.com/fotescodev/mastra

---

## Executive Summary

Mastra is a comprehensive TypeScript AI framework by a Y Combinator W25 startup designed for building AI-powered applications and autonomous agents. After thorough analysis, I recommend **selective adoption** for your capstone project:

| Area | Recommendation | Confidence |
|------|---------------|------------|
| **Evals Framework** | **Adopt** | High |
| **Redteaming/Adversarial Testing** | **Adopt** | Medium-High |
| **TypeScript Patterns** | **Learn From** | High |
| **Full Framework Adoption** | **Not Recommended** | High |

---

## 1. Evals Capabilities Analysis

### 1.1 Architecture Overview

Mastra provides a sophisticated **pipeline-based scorer architecture** with a fluent builder API:

```typescript
// Mastra's elegant scorer pattern
createScorer({
  id: 'toxicity-scorer',
  name: 'Toxicity Scorer',
  description: 'Evaluates toxicity of LLM output',
  judge: { model, instructions: TOXICITY_INSTRUCTIONS },
  type: 'agent',
})
  .preprocess({ ... })     // Extract claims/statements
  .analyze({ ... })        // Run LLM judgment
  .generateScore({ ... })  // Compute numeric score
  .generateReason({ ... }) // Human-readable explanation
```

### 1.2 Available Scorers

**LLM-Based Scorers (require model):**
| Scorer | Purpose | Your Capstone Use |
|--------|---------|-------------------|
| `createFaithfulnessScorer` | Checks output against provided context | Verify variants against knowledge base |
| `createHallucinationScorer` | Detects fabricated claims | **Critical** - validate metric claims |
| `createToxicityScorer` | Evaluates harmful content | Safety evaluation |
| `createBiasScorer` | Detects bias in output | Tone/fairness evaluation |
| `createAnswerRelevancyScorer` | Measures response relevance | Job description alignment |
| `createAnswerSimilarityScorer` | Compares output similarity | Compare variants |
| `createNoiseSensitivityScorerLLM` | **Adversarial testing** | Redteam robustness |
| `createPromptAlignmentScorer` | Checks adherence to instructions | Variant generation quality |
| `createContextPrecisionScorer` | RAG precision evaluation | Knowledge retrieval |
| `createContextRelevanceScorer` | RAG relevance evaluation | Knowledge retrieval |

**Code-Based Scorers (no LLM needed):**
| Scorer | Purpose | Your Capstone Use |
|--------|---------|-------------------|
| `createCompletenessScorerCode` | Word overlap completeness | Quick content checks |
| `createKeywordCoverageScorerCode` | Keyword extraction & matching | Ensure key terms covered |
| `createContentSimilarityScorerCode` | String similarity (Jaccard/Dice) | Fast deduplication |
| `createToneScorerCode` | Sentiment analysis | Detect sycophancy |
| `createTextualDifferenceScorerCode` | Text diff scoring | Change detection |
| `createToolCallAccuracyScorerCode` | Tool call validation | N/A for your project |

### 1.3 Relevance to Your Capstone

Your current eval system (`scripts/evaluate-variants.ts`) does:
1. Metric extraction via regex patterns
2. Source attribution (anchor matching)
3. Claims ledger maintenance
4. Manual verification workflow

**Mastra can enhance this with:**

```typescript
// Example: Replace/augment your metric verification
import { createHallucinationScorer, createFaithfulnessScorer } from '@mastra/evals/scorers/prebuilt';

const variantClaimVerifier = createHallucinationScorer({
  model: { provider: 'anthropic', name: 'claude-3-5-sonnet-20241022' },
  options: {
    context: knowledgeBaseFacts, // Your content/knowledge/** sources
    scale: 1
  }
});

// Run against variant claims
const result = await variantClaimVerifier.run({
  input: { inputMessages: [{ role: 'user', content: originalJobDescription }] },
  output: [{ role: 'assistant', content: generatedVariantContent }]
});

console.log(result.score);  // 0-1, lower = less hallucination
console.log(result.reason); // Human-readable explanation
```

### 1.4 Integration Opportunity: Hybrid Eval Pipeline

Your current pipeline is **deterministic and fast**. Mastra adds **semantic understanding**:

```
Current Flow:
  YAML → Regex extraction → Anchor matching → Claims ledger

Enhanced Flow:
  YAML → Regex extraction → Anchor matching → Claims ledger
                         ↓
                    [Mastra LLM Scorers]
                         ↓
                  - Hallucination check
                  - Faithfulness to knowledge base
                  - Tone/bias detection
                         ↓
                  Enhanced eval report
```

---

## 2. Redteaming Capabilities Analysis

### 2.1 Current State

Your `scripts/redteam.ts` implements pattern-based scanning:
- Secret detection (API keys, tokens)
- Confidential/NDA language
- Sycophancy detection
- Prompt injection patterns
- Approximation near metrics
- Cross-variant contamination

### 2.2 Mastra's Noise Sensitivity Scorer

Mastra's `createNoiseSensitivityScorerLLM` is specifically designed for adversarial testing:

```typescript
const adversarialTest = createNoiseSensitivityScorerLLM({
  model: { provider: 'openai', name: 'gpt-4o' },
  options: {
    baselineResponse: cleanVariantOutput,
    noisyQuery: jobDescriptionWithAdversarialContent,
    noiseType: 'adversarial',
    scoring: {
      impactWeights: {
        none: 1.0,
        minimal: 0.85,
        moderate: 0.6,
        significant: 0.3,
        severe: 0.1
      },
      penalties: {
        majorIssuePerItem: 0.2,
        maxMajorIssuePenalty: 0.6
      }
    }
  }
});
```

**Evaluation Dimensions:**
1. Content Accuracy - factual correctness maintained
2. Completeness - thoroughness preserved
3. Relevance - stays on topic
4. Consistency - message coherence
5. Hallucination Resistance - avoids fabrication

### 2.3 Integration with Your Redteam Pipeline

```typescript
// Enhanced redteam checks
const findings = [
  // Your existing pattern-based checks
  scanSecrets(text),
  scanConfidential(text),
  scanSycophancy(text),
  // ...

  // NEW: Mastra LLM-based adversarial checks
  await runNoiseSensitivity({
    variant,
    noiseTypes: ['misinformation', 'distractors', 'adversarial']
  }),

  // NEW: Toxicity scoring
  await runToxicityCheck(variant),

  // NEW: Bias detection
  await runBiasCheck(variant)
];
```

---

## 3. TypeScript Patterns & Best Practices

### 3.1 Patterns Worth Adopting

**a) Fluent Builder Pattern with Type Accumulation**

Mastra's scorer uses an advanced pattern where types accumulate through the pipeline:

```typescript
// Each step adds to accumulated results type
.preprocess<TPreprocessOutput>(stepDef)
  // Returns MastraScorer<..., AccumulatedResults<..., 'preprocess', TPreprocessOutput>>

.analyze<TAnalyzeOutput>(stepDef)
  // Returns MastraScorer<..., AccumulatedResults<..., 'analyze', TAnalyzeOutput>>
```

This provides excellent IDE support and compile-time type safety.

**b) Discriminated Unions for Type Shortcuts**

```typescript
type ScorerTypeShortcuts = {
  agent: {
    input: ScorerRunInputForAgent;
    output: ScorerRunOutputForAgent;
  };
};

// Usage: type: 'agent' gives you full type inference
```

**c) Zod Schema Integration**

Mastra deeply integrates Zod for runtime validation:

```typescript
const analyzeOutputSchema = z.object({
  dimensions: z.array(z.object({
    dimension: z.string(),
    impactLevel: z.enum(['none', 'minimal', 'moderate', 'significant', 'severe']),
    specificChanges: z.string(),
    noiseInfluence: z.string(),
  })),
  overallAssessment: z.string(),
  majorIssues: z.array(z.string()).optional().default([]),
  robustnessScore: z.number().min(0).max(1),
});
```

**d) Strict TypeScript Configuration**

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitReturns": true,
    "noUncheckedIndexedAccess": true,  // Important for array safety
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

### 3.2 Comparison with Your Current Patterns

| Pattern | Your Code | Mastra | Recommendation |
|---------|-----------|--------|----------------|
| Schema Validation | Zod schemas ✓ | Zod schemas ✓ | Already aligned |
| Type Exports | Good | Comprehensive | Add more utility types |
| Error Handling | Try/catch | MastraError class | Consider error classes |
| Builder Pattern | Limited | Extensive | Adopt for pipelines |
| Config Types | Inline | Extracted | Extract more interfaces |

### 3.3 Code Organization

Mastra's monorepo structure is exemplary:

```
packages/
├── core/           # Framework foundation
│   └── src/
│       ├── agent/
│       ├── evals/
│       ├── tools/
│       └── workflows/
├── evals/          # Separate evaluation package
│   └── src/
│       └── scorers/
│           ├── llm/        # LLM-based scorers
│           │   ├── toxicity/
│           │   │   ├── index.ts
│           │   │   ├── prompts.ts
│           │   │   └── index.test.ts
│           │   └── ...
│           └── code/       # Code-based scorers
```

---

## 4. Recommendations

### 4.1 High Priority: Adopt Evals Package

**Why:** Your claims verification is regex-based. Adding LLM-based hallucination/faithfulness detection would significantly strengthen the capstone.

**How:**
1. Install `@mastra/evals` as dependency
2. Create wrapper functions that integrate with your existing ledger system
3. Add LLM checks as optional enhancement to `npm run eval:variant`

```bash
npm install @mastra/core @mastra/evals
```

### 4.2 Medium Priority: Enhance Redteaming

**Why:** Your pattern-based scanning is solid but misses semantic adversarial attacks.

**How:**
1. Add noise sensitivity testing for variants
2. Test with adversarial job descriptions
3. Include in CI gate

### 4.3 Low Priority: TypeScript Improvements

**Why:** Your code is already well-structured; incremental improvements are nice-to-have.

**How:**
1. Enable `noUncheckedIndexedAccess`
2. Extract more reusable type utilities
3. Consider fluent builder for multi-step pipelines

### 4.4 Not Recommended: Full Framework Adoption

**Why:**
- Your project doesn't need agents/workflows/memory systems
- Mastra is optimized for LLM agent applications, not static content generation
- Dependency overhead (40+ LLM providers) is unnecessary
- Your custom eval/redteam scripts are well-suited to your specific needs

---

## 5. Implementation Roadmap

### Phase 1: Minimal Integration (1-2 days)

```typescript
// scripts/eval-mastra.ts - New file
import { createHallucinationScorer, createFaithfulnessScorer } from '@mastra/evals/scorers/prebuilt';

export async function runMastraEvals(variant: Variant, knowledgeBase: string[]) {
  const hallucinationScorer = createHallucinationScorer({
    model: { provider: 'anthropic', name: 'claude-3-5-sonnet-20241022' },
    options: { context: knowledgeBase }
  });

  // Extract override text
  const overrideText = extractOverrideText(variant);

  return hallucinationScorer.run({
    input: { inputMessages: [{ role: 'user', content: variant.metadata.jobDescription }] },
    output: [{ role: 'assistant', content: overrideText }]
  });
}
```

### Phase 2: Enhanced Eval Pipeline (2-3 days)

- Integrate Mastra scores into claims ledger
- Add to `npm run eval:variant` as optional flag `--llm-check`
- Display in eval report markdown

### Phase 3: Adversarial Testing (1-2 days)

- Add noise sensitivity tests
- Create adversarial job description test suite
- Integrate with redteam pipeline

---

## 6. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| API cost for LLM evals | Medium | Low | Use sparingly, cache results |
| Breaking changes in Mastra | Medium | Medium | Pin versions, use core primitives |
| Complexity increase | Low | Low | Keep Mastra usage isolated |
| False positives in evals | Medium | Low | Use as supplement, not replacement |

---

## 7. Conclusion

Mastra offers a well-architected evaluation framework that can meaningfully enhance your capstone project's variant verification and redteaming capabilities. The recommended approach is **selective adoption**:

1. **Use the evals package** for LLM-based hallucination/faithfulness checking
2. **Use noise sensitivity scorer** for adversarial robustness testing
3. **Learn from TypeScript patterns** but don't over-engineer
4. **Skip the full framework** - you don't need agents/workflows/memory

This selective approach gives you the benefits of Mastra's mature evaluation infrastructure without the overhead of a full AI agent framework.

---

## Appendix A: Key Files Reference

| File | Purpose |
|------|---------|
| `/tmp/mastra-eval/packages/evals/src/scorers/llm/` | LLM-based scorers |
| `/tmp/mastra-eval/packages/evals/src/scorers/code/` | Code-based scorers |
| `/tmp/mastra-eval/packages/core/src/evals/base.ts` | Scorer builder infrastructure |
| `/tmp/mastra-eval/packages/core/src/tools/tool.ts` | Tool pattern (for reference) |

## Appendix B: Relevant Documentation URLs

- Mastra Evals Overview: https://mastra.ai/docs/evals/overview
- Noise Sensitivity Scorer: https://mastra.ai/docs/reference/evals/noise-sensitivity
- Custom Scorers: https://mastra.ai/docs/evals/custom-scorers
