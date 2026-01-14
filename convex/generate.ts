"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import { VariantSchema } from "../src/lib/schemas";

// Simple API key check for actions
function requireAuth(apiKey: string | undefined) {
  const adminKey = process.env.ADMIN_API_KEY;
  if (!adminKey) {
    // If no admin key is configured, allow access (development mode)
    return;
  }
  if (apiKey !== adminKey) {
    throw new Error("Unauthorized: Invalid API key");
  }
}

/**
 * Generate a CV variant using AI
 *
 * This action:
 * 1. Loads base portfolio content from Convex
 * 2. Calls Claude API to generate a personalized variant
 * 3. Saves the result to the variants table as a draft
 */
export const generateVariant = action({
  args: {
    apiKey: v.optional(v.string()),
    company: v.string(),
    role: v.string(),
    jobDescription: v.string(),
    companyValues: v.optional(v.string()),
    additionalContext: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // 0. Check authorization
    requireAuth(args.apiKey);

    // 1. Load base content
    const baseContent = await ctx.runQuery(api.baseContent.get);
    if (!baseContent) {
      throw new Error(
        "Base portfolio content not found. Run the seed script first."
      );
    }

    // 2. Build the prompt
    const prompt = buildPrompt(args, baseContent);

    // 3. Call Claude API
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error("ANTHROPIC_API_KEY not set in Convex environment");
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Claude API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    const aiOutput = data.content[0].text;

    // 4. Parse JSON response (prompt explicitly requests JSON output)
    const parsed = parseAiResponse(aiOutput);

    // 5. Validate with Zod before storage
    const validationResult = VariantSchema.safeParse(parsed);
    if (!validationResult.success) {
      throw new Error(
        `AI generated invalid variant data: ${validationResult.error.message}`
      );
    }
    const variant = validationResult.data;

    // 6. Save to Convex as draft
    const slug =
      variant.metadata.slug ||
      `${args.company.toLowerCase().replace(/\s+/g, "-")}-${args.role.toLowerCase().replace(/\s+/g, "-")}`;

    // Check if jobDescription was a URL and store it as sourceUrl
    const urlPattern = /^https?:\/\/[^\s]+$/i;
    if (urlPattern.test(args.jobDescription.trim())) {
      variant.metadata.sourceUrl = args.jobDescription.trim();
    }

    await ctx.runMutation(api.variants.upsert, {
      slug,
      publishStatus: "draft",
      data: variant,
    });

    return {
      success: true,
      slug,
      message: `Variant created as draft: ${slug}`,
    };
  },
});

/**
 * Extract job details (company, role, values) from a job description or URL
 * Used by dashboard wizard to pre-fill fields before generation
 * Supports both:
 *   - Direct job description text
 *   - Job posting URLs (will fetch and parse)
 */
export const extractJobDetails = action({
  args: {
    jobDescription: v.string(),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error("ANTHROPIC_API_KEY not set in Convex environment");
    }

    let jobContent = args.jobDescription;
    let sourceUrl: string | undefined;

    // Check if input is a URL - if so, fetch the page content
    const urlPattern = /^https?:\/\/[^\s]+$/i;
    if (urlPattern.test(args.jobDescription.trim())) {
      sourceUrl = args.jobDescription.trim();
      try {
        const pageResponse = await fetch(sourceUrl, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (compatible; JobParser/1.0; +https://dmitrii.fyi)",
          },
        });

        if (!pageResponse.ok) {
          throw new Error(`Failed to fetch URL: ${pageResponse.status}`);
        }

        const html = await pageResponse.text();

        // Extract text content from HTML (basic extraction)
        // Remove script and style tags, then strip HTML tags
        jobContent = html
          .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
          .replace(/<[^>]+>/g, " ")
          .replace(/\s+/g, " ")
          .trim();
      } catch (fetchError) {
        // If fetch fails, treat the URL as the job description text
        // (user might have pasted a URL that's not accessible)
        console.error("Failed to fetch URL, using as text:", fetchError);
      }
    }

    const prompt = `Extract the following from this job posting:
1. Company name
2. Job title/role
3. Key company values or culture points (brief, 1-2 sentences)

Job posting:
${jobContent.slice(0, 15000)}

Respond ONLY with valid JSON in this exact format:
{"company": "Company Name", "role": "Job Title", "companyValues": "Brief values/culture summary"}

No markdown code blocks, no explanations, just the JSON object.`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 512,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Claude API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    const aiOutput = data.content[0].text;

    // Parse JSON response
    let clean = aiOutput.trim();
    if (clean.startsWith("```json")) {
      clean = clean.replace(/^```json\n?/, "").replace(/\n?```$/, "");
    } else if (clean.startsWith("```")) {
      clean = clean.replace(/^```\n?/, "").replace(/\n?```$/, "");
    }

    const result = JSON.parse(clean);

    // Include source URL if we fetched from one
    if (sourceUrl) {
      result.sourceUrl = sourceUrl;
    }

    return result;
  },
});

// Parse AI response - expects JSON (prompt explicitly requests JSON output)
function parseAiResponse(content: string): Record<string, unknown> {
  // Remove code blocks if present
  let clean = content.trim();
  if (clean.startsWith("```json")) {
    clean = clean.replace(/^```json\n?/, "").replace(/\n?```$/, "");
  } else if (clean.startsWith("```")) {
    clean = clean.replace(/^```\n?/, "").replace(/\n?```$/, "");
  }
  return JSON.parse(clean);
}

interface GenerateArgs {
  company: string;
  role: string;
  jobDescription: string;
  companyValues?: string;
  additionalContext?: string;
}

interface BaseContent {
  profile: unknown;
  experience: unknown;
  skills: unknown;
  projects: unknown;
  caseStudies: Array<{ slug: string; title: string; headline?: string }>;
}

function buildPrompt(args: GenerateArgs, data: BaseContent): string {
  const caseStudiesList = data.caseStudies
    .map((cs) => `- ${cs.title} (${cs.slug}): ${cs.headline || "No headline"}`)
    .join("\n");

  return `You are an expert career consultant helping personalize a portfolio website for a specific job application.

# Job Application
Company: ${args.company}
Role: ${args.role}

${args.companyValues ? `Company Values:\n${args.companyValues}\n` : ""}
${args.additionalContext ? `Additional Context:\n${args.additionalContext}\n` : ""}

Job Description:
${args.jobDescription}

# Portfolio Owner's Background

## Current Profile
${JSON.stringify(data.profile, null, 2)}

## Experience
${JSON.stringify(data.experience, null, 2)}

## Case Studies (${data.caseStudies.length} available)
${caseStudiesList}

## Skills
${JSON.stringify(data.skills, null, 2)}

## Passion Projects
${JSON.stringify(data.projects, null, 2)}

# Your Task

Generate a personalized portfolio variant. Output ONLY valid JSON (not YAML) with this exact structure:

{
  "metadata": {
    "company": "${args.company}",
    "role": "${args.role}",
    "slug": "company-role-slug",
    "generatedAt": "${new Date().toISOString()}",
    "jobDescription": "...",
    "generationModel": "claude-sonnet-4-20250514"
  },
  "overrides": {
    "hero": {
      "status": "Open to [relevant role type] roles — [relevant domains]",
      "headline": [
        {"text": "Building", "style": "italic"},
        {"text": "at the edge of", "style": "muted"},
        {"text": "trust", "style": "accent"}
      ],
      "companyAccent": [
        {"text": "with", "style": "muted"},
        {"text": "${args.company}", "style": "accent"}
      ],
      "subheadline": "One-sentence pitch..."
    },
    "about": {
      "tagline": "Two-sentence professional summary...",
      "bio": ["First paragraph...", "Second paragraph..."],
      "stats": [
        {"value": "X+", "label": "Relevant Metric 1"},
        {"value": "Y", "label": "Relevant Metric 2"},
        {"value": "Z", "label": "Relevant Metric 3"}
      ]
    },
    "sections": {
      "beyondWork": false,
      "blog": true,
      "onchainIdentity": false,
      "skills": true,
      "passionProjects": true
    }
  },
  "relevance": {
    "caseStudies": [
      {"slug": "case-study-slug", "relevanceScore": 0.9, "reasoning": "..."}
    ],
    "skills": [
      {"category": "Category Name", "relevanceScore": 0.8}
    ],
    "projects": [
      {"slug": "project-slug", "relevanceScore": 0.7, "reasoning": "..."}
    ]
  }
}

# Guidelines

1. **Be Truthful**: Only use facts from the portfolio. Don't invent achievements.
2. **Be Specific**: Use concrete numbers, technologies, and outcomes.
3. **Match Language**: Mirror keywords from the job description naturally.
4. **Prioritize**: Score content by relevance - what demonstrates fit for THIS role?
5. **Tailor Stats**: Choose 3 stats that best demonstrate fit for this role.
6. **Section Visibility**: Only show sections that strengthen the application.
7. **Headline**: Make it memorable and aligned with company values.

Output ONLY the JSON. No markdown code blocks, no explanations, just valid JSON.`;
}
