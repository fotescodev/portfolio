/**
 * Job Extraction Tests
 *
 * Tests the ability to scrape job postings from various job board URLs.
 * Uses puppeteer-extra with stealth plugin to bypass bot protection.
 */

import { describe, it, expect } from 'vitest';

// Test URLs from popular job boards
const TEST_URLS = {
  // Coinbase uses Cloudflare protection
  coinbase: 'https://www.coinbase.com/careers/positions/7452527',
  // Ashby is commonly used by startups
  ashby: 'https://jobs.ashbyhq.com/anthropic',
  // Greenhouse is widely used
  greenhouse: 'https://boards.greenhouse.io/anthropic',
};

// Helper to extract job from URL (mirrors the CLI implementation)
async function extractJobFromUrl(url: string): Promise<{
  ok: boolean;
  company?: string;
  role?: string;
  description?: string;
  error?: string;
}> {
  // Try simple fetch first
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      }
    });
    if (res.ok) {
      const html = await res.text();
      const result = parseJobFromHtml(html, url);
      if (result.ok) return result;
    }
  } catch {
    // Fall through to Puppeteer
  }

  // Fallback: headless browser with stealth
  return await extractWithPuppeteer(url);
}

async function extractWithPuppeteer(url: string): Promise<{
  ok: boolean;
  company?: string;
  role?: string;
  description?: string;
  error?: string;
}> {
  const puppeteerExtra = await import('puppeteer-extra');
  const StealthPlugin = await import('puppeteer-extra-plugin-stealth');

  puppeteerExtra.default.use(StealthPlugin.default());

  const browser = await puppeteerExtra.default.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });

    // Wait for JS rendering
    await new Promise(r => setTimeout(r, 2000));

    const html = await page.content();
    return parseJobFromHtml(html, url);
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  } finally {
    await browser.close();
  }
}

function parseJobFromHtml(html: string, _url: string): {
  ok: boolean;
  company?: string;
  role?: string;
  description?: string;
  error?: string;
} {
  // Look for JSON-LD JobPosting
  const jsonLdMatch = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi);

  if (jsonLdMatch) {
    for (const match of jsonLdMatch) {
      const content = match.replace(/<script[^>]*>|<\/script>/gi, '').trim();
      try {
        const data = JSON.parse(content);
        const items = Array.isArray(data) ? data : [data];
        const posting = items.find((x: any) => {
          const t = x?.['@type'];
          if (!t) return false;
          if (Array.isArray(t)) return t.includes('JobPosting');
          return t === 'JobPosting';
        });

        if (posting) {
          return {
            ok: true,
            role: posting.title || posting.jobTitle,
            company: posting.hiringOrganization?.name,
            description: typeof posting.description === 'string'
              ? posting.description.replace(/<[^>]*>/g, ' ').slice(0, 500)
              : undefined,
          };
        }
      } catch {
        // Continue to next match
      }
    }
  }

  // Fallback: try to extract from page content
  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);

  if (titleMatch || h1Match) {
    return {
      ok: true,
      role: h1Match?.[1]?.trim() || titleMatch?.[1]?.trim(),
    };
  }

  return { ok: false, error: 'Could not parse job details from page' };
}

describe('Job Extraction', () => {
  describe('parseJobFromHtml', () => {
    it('extracts JobPosting from JSON-LD', () => {
      const html = `
        <html>
        <head>
          <script type="application/ld+json">
            {
              "@type": "JobPosting",
              "title": "Senior Engineer",
              "hiringOrganization": { "name": "Acme Corp" },
              "description": "Great job opportunity"
            }
          </script>
        </head>
        <body></body>
        </html>
      `;

      const result = parseJobFromHtml(html, 'https://example.com/job');

      expect(result.ok).toBe(true);
      expect(result.role).toBe('Senior Engineer');
      expect(result.company).toBe('Acme Corp');
    });

    it('handles array of JSON-LD items', () => {
      const html = `
        <html>
        <head>
          <script type="application/ld+json">
            [
              { "@type": "Organization", "name": "Ignored" },
              { "@type": "JobPosting", "title": "PM Role", "hiringOrganization": { "name": "TechCo" } }
            ]
          </script>
        </head>
        <body></body>
        </html>
      `;

      const result = parseJobFromHtml(html, 'https://example.com/job');

      expect(result.ok).toBe(true);
      expect(result.role).toBe('PM Role');
      expect(result.company).toBe('TechCo');
    });

    it('falls back to title/h1 when no JSON-LD', () => {
      const html = `
        <html>
        <head><title>Software Engineer at StartupXYZ</title></head>
        <body><h1>Software Engineer</h1></body>
        </html>
      `;

      const result = parseJobFromHtml(html, 'https://example.com/job');

      expect(result.ok).toBe(true);
      expect(result.role).toBe('Software Engineer');
    });

    it('returns error for empty page', () => {
      const html = '<html><head></head><body></body></html>';

      const result = parseJobFromHtml(html, 'https://example.com/job');

      expect(result.ok).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('extractWithPuppeteer (integration)', () => {
    // These tests hit real URLs - run selectively
    it('extracts job from Coinbase careers page', async () => {
      const result = await extractWithPuppeteer(TEST_URLS.coinbase);

      expect(result.ok).toBe(true);
      expect(result.role).toBeDefined();
      expect(result.role?.toLowerCase()).toContain('product manager');
      expect(result.company).toBe('Coinbase');
    }, 60000); // 60s timeout for real network request

    it('handles protected pages with stealth plugin', async () => {
      // Coinbase uses Cloudflare - this tests the stealth bypass
      const result = await extractWithPuppeteer(TEST_URLS.coinbase);

      expect(result.ok).toBe(true);
      // Should get actual job content, not a challenge page
      expect(result.role).not.toMatch(/cloudflare|challenge|verify/i);
    }, 60000);
  });

  describe('extractJobFromUrl (full flow)', () => {
    it('extracts job with fallback chain', async () => {
      // This tests the full flow: try fetch -> fall back to Puppeteer
      const result = await extractJobFromUrl(TEST_URLS.coinbase);

      expect(result.ok).toBe(true);
      expect(result.role).toBeDefined();
    }, 60000);
  });
});

describe('Supported Job Boards', () => {
  // Smoke tests for various job board formats
  // These ensure we don't regress on common platforms

  const testCases = [
    {
      name: 'JSON-LD JobPosting (standard)',
      html: `<script type="application/ld+json">{"@type":"JobPosting","title":"Test","hiringOrganization":{"name":"Co"}}</script>`,
      expectRole: 'Test',
      expectCompany: 'Co',
    },
    {
      name: 'Lever format',
      html: `<script type="application/ld+json">{"@type":"JobPosting","title":"Engineer","hiringOrganization":{"@type":"Organization","name":"Lever Co"}}</script>`,
      expectRole: 'Engineer',
      expectCompany: 'Lever Co',
    },
    {
      name: 'Greenhouse format',
      html: `<script type="application/ld+json">[{"@context":"http://schema.org","@type":"JobPosting","title":"Designer","hiringOrganization":{"name":"GH Corp"}}]</script>`,
      expectRole: 'Designer',
      expectCompany: 'GH Corp',
    },
  ];

  testCases.forEach(({ name, html, expectRole, expectCompany }) => {
    it(`parses ${name}`, () => {
      const result = parseJobFromHtml(`<html><head>${html}</head><body></body></html>`, 'https://test.com');

      expect(result.ok).toBe(true);
      expect(result.role).toBe(expectRole);
      expect(result.company).toBe(expectCompany);
    });
  });
});
