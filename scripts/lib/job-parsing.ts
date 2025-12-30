/**
 * Job Parsing Utilities
 *
 * Shared utilities for extracting company/role from job descriptions.
 * Used by analyze-jd.ts and other scripts.
 */

// ═══════════════════════════════════════════════════════════════
// VALIDATION CONSTANTS
// ═══════════════════════════════════════════════════════════════

/** Common sentence starters that are NOT company names */
const INVALID_COMPANY_STARTERS = [
  'while', 'when', 'where', 'what', 'why', 'how',
  'we', 'our', 'the', 'this', 'that', 'these', 'those',
  'if', 'as', 'at', 'by', 'for', 'from', 'with',
  'about', 'join', 'help', 'build', 'create', 'make',
  'are', 'is', 'be', 'been', 'being', 'have', 'has', 'had',
  'do', 'does', 'did', 'will', 'would', 'could', 'should',
  'can', 'may', 'might', 'must', 'shall',
  'it', 'its', 'you', 'your', 'they', 'their',
  'a', 'an', 'and', 'or', 'but', 'not', 'no', 'yes',
  'all', 'any', 'some', 'many', 'most', 'few', 'each', 'every',
  'here', 'there', 'now', 'then', 'today', 'first', 'next'
];

/** Keywords that indicate a job title */
const ROLE_KEYWORDS = [
  'manager', 'director', 'lead', 'head', 'chief', 'vp', 'vice president',
  'engineer', 'developer', 'architect', 'designer', 'analyst',
  'product', 'program', 'project', 'technical', 'senior', 'staff', 'principal',
  'associate', 'junior', 'intern', 'specialist', 'coordinator', 'administrator'
];

/** Role abbreviations */
const ROLE_ABBREVIATIONS = ['pm', 'tpm', 'spm', 'swe', 'sde', 'ux', 'ui', 'qa', 'devops', 'cto', 'cpo', 'ceo'];

// ═══════════════════════════════════════════════════════════════
// VALIDATION FUNCTIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Check if text looks like a valid company name
 */
export function looksLikeCompanyName(text: string): boolean {
  if (!text || typeof text !== 'string') return false;

  const trimmed = text.trim();
  const words = trimmed.split(/\s+/);

  // Must be 1-5 words
  if (words.length === 0 || words.length > 5) return false;

  // First word must start with capital (or be all caps like IBM)
  const firstWord = words[0].toLowerCase();
  if (!/^[A-Z]/.test(words[0]) && !/^[A-Z]+$/.test(words[0])) return false;

  // First word should NOT be a common sentence starter
  if (INVALID_COMPANY_STARTERS.includes(firstWord)) return false;

  // Should not contain common verbs in first position
  if (['is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had'].includes(firstWord)) {
    return false;
  }

  // Should not look like a sentence (no periods except at end, no commas)
  if (/[,]/.test(trimmed) || /\.\s/.test(trimmed)) return false;

  return true;
}

/**
 * Check if text looks like a valid job title
 */
export function looksLikeJobTitle(text: string): boolean {
  if (!text || typeof text !== 'string') return false;

  const trimmed = text.trim().toLowerCase();
  const words = trimmed.split(/\s+/);

  // Must be 1-8 words
  if (words.length === 0 || words.length > 8) return false;

  // Should contain at least one role keyword or abbreviation
  const hasRoleKeyword = ROLE_KEYWORDS.some(kw => trimmed.includes(kw));
  const hasAbbreviation = words.some(w => ROLE_ABBREVIATIONS.includes(w));

  if (!hasRoleKeyword && !hasAbbreviation) return false;

  // Should not look like a sentence
  if (/[,]/.test(text) || /\.\s/.test(text)) return false;

  return true;
}

// ═══════════════════════════════════════════════════════════════
// JSON-LD EXTRACTION
// ═══════════════════════════════════════════════════════════════

interface JsonLdExtraction {
  company?: string;
  role?: string;
}

/**
 * Extract company and role from JSON-LD structured data in HTML
 * Many job boards embed schema.org JobPosting data
 */
export function extractFromJsonLd(html: string): JsonLdExtraction | null {
  if (!html) return null;

  // Find all JSON-LD script tags
  const jsonLdRegex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;

  while ((match = jsonLdRegex.exec(html)) !== null) {
    try {
      const jsonContent = match[1].trim();
      const data = JSON.parse(jsonContent);

      // Handle array of items
      const items = Array.isArray(data) ? data : [data];

      for (const item of items) {
        // Look for JobPosting type
        if (item['@type'] === 'JobPosting' || item.type === 'JobPosting') {
          const result: JsonLdExtraction = {};

          // Extract role/title
          const title = item.title || item.jobTitle || item.name;
          if (title && typeof title === 'string') {
            result.role = title.trim();
          }

          // Extract company
          const org = item.hiringOrganization || item.employmentUnit;
          if (org) {
            const companyName = typeof org === 'string' ? org : org.name;
            if (companyName && typeof companyName === 'string') {
              result.company = companyName.trim();
            }
          }

          // Only return if we found at least one field
          if (result.company || result.role) {
            return result;
          }
        }

        // Check @graph for nested items
        if (item['@graph'] && Array.isArray(item['@graph'])) {
          for (const graphItem of item['@graph']) {
            if (graphItem['@type'] === 'JobPosting') {
              const result: JsonLdExtraction = {};

              const title = graphItem.title || graphItem.jobTitle || graphItem.name;
              if (title) result.role = title.trim();

              const org = graphItem.hiringOrganization;
              if (org?.name) result.company = org.name.trim();

              if (result.company || result.role) {
                return result;
              }
            }
          }
        }
      }
    } catch {
      // Invalid JSON, try next match
      continue;
    }
  }

  return null;
}

// ═══════════════════════════════════════════════════════════════
// CLAUDE API EXTRACTION
// ═══════════════════════════════════════════════════════════════

interface ClaudeExtraction {
  company: string;
  role: string;
}

/**
 * Extract company and role using Claude API as fallback
 * Only called when deterministic methods fail
 */
export async function extractWithClaude(
  text: string,
  apiKey?: string
): Promise<ClaudeExtraction | null> {
  if (!apiKey) return null;

  // Take first 4000 chars (likely contains title) and last 2000 (often has company info)
  const beginning = text.slice(0, 4000);
  const end = text.length > 6000 ? '\n...\n' + text.slice(-2000) : '';
  const truncatedText = beginning + end;

  const prompt = `Extract the company name and job title/role from this job posting.

Return ONLY a JSON object with these fields:
- "company": The hiring company's name (e.g., "Stripe", "Coinbase", "Galaxy")
- "role": The job title being hired for (e.g., "Senior Product Manager", "Staff Engineer", "Director of Engineering")

If multiple jobs are listed, extract the main/primary one.
If you can't determine a field with confidence, use null.

Job Posting:
${truncatedText}

JSON response:`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 150,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const content = data.content?.[0]?.text;

    if (!content) return null;

    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    const parsed = JSON.parse(jsonMatch[0]);

    if (parsed.company || parsed.role) {
      return {
        company: parsed.company || '',
        role: parsed.role || ''
      };
    }

    return null;
  } catch {
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════
// MAIN EXTRACTION FUNCTION
// ═══════════════════════════════════════════════════════════════

export interface ExtractionResult {
  company: string | null;
  role: string | null;
  source: 'json-ld' | 'regex' | 'claude' | 'fallback';
}

/**
 * Extract company and role using waterfall approach:
 * 1. JSON-LD structured data (most reliable)
 * 2. Regex patterns with validation
 * 3. Claude API fallback
 * 4. Best-effort regex (no validation)
 */
export async function extractCompanyAndRoleAsync(
  text: string,
  rawHtml?: string,
  filename?: string,
  apiKey?: string
): Promise<ExtractionResult> {
  // Strategy 1: JSON-LD (if we have raw HTML)
  if (rawHtml) {
    const jsonLd = extractFromJsonLd(rawHtml);
    if (jsonLd?.company && jsonLd?.role) {
      return {
        company: jsonLd.company,
        role: jsonLd.role,
        source: 'json-ld'
      };
    }
    // Partial JSON-LD result - use what we found
    if (jsonLd?.company || jsonLd?.role) {
      const regexResult = extractWithRegex(text, filename);
      return {
        company: jsonLd.company || regexResult.company,
        role: jsonLd.role || regexResult.role,
        source: 'json-ld'
      };
    }
  }

  // Strategy 2: Regex with validation
  const regexResult = extractWithRegex(text, filename);
  const companyValid = regexResult.company && looksLikeCompanyName(regexResult.company);
  const roleValid = regexResult.role && looksLikeJobTitle(regexResult.role);

  if (companyValid && roleValid) {
    return {
      company: regexResult.company,
      role: regexResult.role,
      source: 'regex'
    };
  }

  // Strategy 3: Claude API (if available and regex failed validation)
  if (apiKey) {
    const claudeResult = await extractWithClaude(text, apiKey);
    if (claudeResult?.company || claudeResult?.role) {
      return {
        company: claudeResult.company || regexResult.company,
        role: claudeResult.role || regexResult.role,
        source: 'claude'
      };
    }
  }

  // Strategy 4: Best-effort regex (fallback)
  return {
    company: regexResult.company,
    role: regexResult.role,
    source: 'fallback'
  };
}

// ═══════════════════════════════════════════════════════════════
// REGEX EXTRACTION (from original analyze-jd.ts)
// ═══════════════════════════════════════════════════════════════

interface RegexExtractionResult {
  company: string | null;
  role: string | null;
}

/**
 * Extract company and role using regex patterns
 * Adapted from original analyze-jd.ts logic
 */
function extractWithRegex(text: string, filename?: string): RegexExtractionResult {
  let company: string | null = null;
  let role: string | null = null;

  // Try filename first (e.g., jd-stripe-pm.txt)
  if (filename) {
    const fileMatch = filename.match(/jd-([a-z0-9-]+)/i);
    if (fileMatch) {
      const parts = fileMatch[1].split('-');
      company = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
    }
  }

  // Common JD patterns
  const patterns = [
    // "Company - Role" format
    /^([A-Z][A-Za-z0-9\s]{0,30})\s*[-–—]\s*(.{5,50})$/m,
    // "Company is hiring/looking for a Role"
    /^(.{2,30}?)\s+is\s+(?:hiring|looking for|seeking)\s+(?:a\s+)?(.{5,50})/im,
    // "at Company" pattern
    /(?:position|role|job|opportunity)\s+at\s+([A-Z][A-Za-z0-9\s]{1,25})/i,
  ];

  const firstLines = text.slice(0, 2000);

  for (const pattern of patterns) {
    const match = firstLines.match(pattern);
    if (match) {
      if (!company && match[1]) {
        const candidate = match[1].trim().split(/\s+/).slice(0, 4).join(' ');
        if (looksLikeCompanyName(candidate)) {
          company = candidate;
        }
      }
      if (!role && (match[2] || match[3])) {
        const candidate = (match[3] || match[2]).trim().split(/\s+/).slice(0, 6).join(' ');
        if (looksLikeJobTitle(candidate)) {
          role = candidate;
        }
      }
      if (company && role) break;
    }
  }

  // Try specific role patterns if no role found
  if (!role) {
    const rolePatterns = [
      /\b((?:senior\s+)?(?:staff\s+)?(?:principal\s+)?(?:product|program|project|technical)\s+manager)\b/i,
      /\b((?:senior\s+)?(?:staff\s+)?(?:pm|tpm|spm))\b/i,
      /\b(director[,\s]+(?:of\s+)?(?:product|engineering|technical))/i,
      /\b((?:senior\s+)?(?:software|backend|frontend|full[- ]?stack)\s+engineer)\b/i,
    ];

    for (const pattern of rolePatterns) {
      const match = firstLines.match(pattern);
      if (match) {
        role = match[1].trim();
        break;
      }
    }
  }

  return { company, role };
}
