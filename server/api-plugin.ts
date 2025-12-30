/**
 * CRM API Plugin for Vite Dev Server
 *
 * Provides API endpoints for the CV Dashboard to:
 * - List and manage variants
 * - Run scripts (analyze-jd, generate-cv, etc.)
 * - Execute quality checks (eval, redteam)
 */

import type { Plugin, ViteDevServer } from 'vite';
import type { IncomingMessage, ServerResponse } from 'http';
import { readdir, readFile, writeFile } from 'fs/promises';
import { resolve, join } from 'path';
import { runScript, runNpmScript } from './script-runner';

const PROJECT_ROOT = resolve(import.meta.dirname, '..');
const VARIANTS_DIR = join(PROJECT_ROOT, 'content', 'variants');

interface ApiResponse {
  success: boolean;
  data?: unknown;
  error?: string;
}

/**
 * Parse JSON body from request
 */
async function parseBody(req: IncomingMessage): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error('Invalid JSON body'));
      }
    });
    req.on('error', reject);
  });
}

/**
 * Send JSON response
 */
function sendJson(res: ServerResponse, data: ApiResponse, status = 200) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

/**
 * List all variants from content/variants/*.json
 */
async function listVariants(): Promise<ApiResponse> {
  try {
    const files = await readdir(VARIANTS_DIR);
    const jsonFiles = files.filter(f => f.endsWith('.json') && !f.startsWith('_'));

    const variants = await Promise.all(
      jsonFiles.map(async (file) => {
        const content = await readFile(join(VARIANTS_DIR, file), 'utf-8');
        const data = JSON.parse(content);
        return {
          slug: file.replace('.json', ''),
          ...data.metadata,
          hasResume: !!data.metadata?.resumePath
        };
      })
    );

    // Sort by generatedAt descending
    variants.sort((a, b) => {
      const dateA = new Date(a.generatedAt || 0).getTime();
      const dateB = new Date(b.generatedAt || 0).getTime();
      return dateB - dateA;
    });

    return { success: true, data: { variants } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to list variants'
    };
  }
}

/**
 * Get a single variant by slug
 */
async function getVariant(slug: string): Promise<ApiResponse> {
  try {
    const filePath = join(VARIANTS_DIR, `${slug}.json`);
    const content = await readFile(filePath, 'utf-8');
    return { success: true, data: JSON.parse(content) };
  } catch {
    return { success: false, error: `Variant not found: ${slug}` };
  }
}

/**
 * Update variant metadata (e.g., applicationStatus)
 */
async function updateVariantMetadata(
  slug: string,
  updates: Record<string, unknown>
): Promise<ApiResponse> {
  try {
    const filePath = join(VARIANTS_DIR, `${slug}.json`);
    const content = await readFile(filePath, 'utf-8');
    const data = JSON.parse(content);

    // Update metadata fields
    data.metadata = { ...data.metadata, ...updates };

    await writeFile(filePath, JSON.stringify(data, null, 2));
    return { success: true, data: data.metadata };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update variant'
    };
  }
}

/**
 * Analyze a job description
 */
async function analyzeJd(text: string, url?: string): Promise<ApiResponse> {
  const args: string[] = ['--json'];

  if (url) {
    args.push('--url', url);
  } else if (text) {
    args.push('--text', text);
  } else {
    return { success: false, error: 'Either text or url is required' };
  }

  const result = await runScript('analyze-jd.ts', args);

  if (!result.success) {
    return { success: false, error: result.stderr || 'Analysis failed' };
  }

  try {
    // Parse JSON output from script
    const jsonMatch = result.stdout.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return { success: true, data: JSON.parse(jsonMatch[0]) };
    }
    return { success: true, data: { raw: result.stdout } };
  } catch {
    return { success: true, data: { raw: result.stdout } };
  }
}

/**
 * Search evidence in knowledge base
 */
async function searchEvidence(terms: string[]): Promise<ApiResponse> {
  const args = ['--terms', terms.join(','), '--json'];
  const result = await runScript('search-evidence.ts', args);

  if (!result.success) {
    return { success: false, error: result.stderr || 'Search failed' };
  }

  try {
    const jsonMatch = result.stdout.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return { success: true, data: JSON.parse(jsonMatch[0]) };
    }
    return { success: true, data: { raw: result.stdout } };
  } catch {
    return { success: true, data: { raw: result.stdout } };
  }
}

/**
 * Generate a new CV variant
 */
async function generateCv(
  company: string,
  role: string,
  jdText: string,
  jdUrl?: string
): Promise<ApiResponse> {
  const args = ['--company', company, '--role', role];

  if (jdUrl) {
    args.push('--jd-url', jdUrl);
  } else {
    args.push('--jd-text', jdText);
  }

  const result = await runScript('generate-cv.ts', args, { timeout: 180000 }); // 3 min for AI

  if (!result.success) {
    return { success: false, error: result.stderr || 'Generation failed' };
  }

  // Extract slug from output
  const slugMatch = result.stdout.match(/Variant saved.*?([a-z0-9-]+)\.yaml/i);
  const slug = slugMatch ? slugMatch[1] : `${company.toLowerCase()}-${role.toLowerCase().replace(/\s+/g, '-')}`;

  return {
    success: true,
    data: {
      slug,
      message: 'Variant generated successfully',
      output: result.stdout
    }
  };
}

/**
 * Generate resume PDF for a variant
 */
async function generateResume(slug: string): Promise<ApiResponse> {
  const result = await runNpmScript('generate:resume', ['--variant', slug], { timeout: 60000 });

  if (!result.success) {
    return { success: false, error: result.stderr || 'Resume generation failed' };
  }

  return {
    success: true,
    data: {
      slug,
      resumePath: `/resumes/${slug}.pdf`,
      output: result.stdout
    }
  };
}

/**
 * Sync variants (YAML to JSON)
 */
async function syncVariants(slug?: string): Promise<ApiResponse> {
  const args = slug ? ['--slug', slug] : [];
  const result = await runNpmScript('variants:sync', args);

  return {
    success: result.success,
    data: { output: result.stdout },
    error: result.success ? undefined : result.stderr
  };
}

/**
 * Run evaluation on a variant
 */
async function evalVariant(slug: string): Promise<ApiResponse> {
  const result = await runNpmScript('eval:variant', ['--slug', slug, '--json']);

  if (!result.success) {
    return { success: false, error: result.stderr || 'Evaluation failed' };
  }

  try {
    const jsonMatch = result.stdout.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return { success: true, data: JSON.parse(jsonMatch[0]) };
    }
    return { success: true, data: { raw: result.stdout } };
  } catch {
    return { success: true, data: { raw: result.stdout } };
  }
}

/**
 * Run redteam scan on a variant
 */
async function redteamVariant(slug: string): Promise<ApiResponse> {
  const result = await runNpmScript('redteam:variant', ['--slug', slug, '--json']);

  if (!result.success) {
    return { success: false, error: result.stderr || 'Redteam scan failed' };
  }

  try {
    const jsonMatch = result.stdout.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return { success: true, data: JSON.parse(jsonMatch[0]) };
    }
    return { success: true, data: { raw: result.stdout } };
  } catch {
    return { success: true, data: { raw: result.stdout } };
  }
}

/**
 * Create the Vite plugin
 */
export function crmApiPlugin(): Plugin {
  return {
    name: 'crm-api',
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req, res, next) => {
        // Only handle /api/crm/* routes
        if (!req.url?.startsWith('/api/crm')) {
          return next();
        }

        // Enable CORS for dev
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (req.method === 'OPTIONS') {
          res.writeHead(204);
          res.end();
          return;
        }

        const path = req.url.replace('/api/crm', '');

        try {
          // GET /api/crm/variants - List all variants
          if (path === '/variants' && req.method === 'GET') {
            const result = await listVariants();
            return sendJson(res, result);
          }

          // GET /api/crm/variants/:slug - Get single variant
          if (path.startsWith('/variants/') && req.method === 'GET') {
            const slug = path.replace('/variants/', '');
            const result = await getVariant(slug);
            return sendJson(res, result);
          }

          // PUT /api/crm/variants/:slug - Update variant metadata
          if (path.startsWith('/variants/') && req.method === 'PUT') {
            const slug = path.replace('/variants/', '');
            const body = await parseBody(req);
            const result = await updateVariantMetadata(slug, body);
            return sendJson(res, result);
          }

          // POST /api/crm/analyze-jd - Analyze job description
          if (path === '/analyze-jd' && req.method === 'POST') {
            const body = await parseBody(req);
            const result = await analyzeJd(
              body.text as string,
              body.url as string | undefined
            );
            return sendJson(res, result);
          }

          // POST /api/crm/search-evidence - Search knowledge base
          if (path === '/search-evidence' && req.method === 'POST') {
            const body = await parseBody(req);
            const result = await searchEvidence(body.terms as string[]);
            return sendJson(res, result);
          }

          // POST /api/crm/generate-cv - Generate variant
          if (path === '/generate-cv' && req.method === 'POST') {
            const body = await parseBody(req);
            const result = await generateCv(
              body.company as string,
              body.role as string,
              body.jdText as string,
              body.jdUrl as string | undefined
            );
            return sendJson(res, result);
          }

          // POST /api/crm/generate-resume - Generate PDF
          if (path === '/generate-resume' && req.method === 'POST') {
            const body = await parseBody(req);
            const result = await generateResume(body.slug as string);
            return sendJson(res, result);
          }

          // POST /api/crm/sync-variants - Sync YAML to JSON
          if (path === '/sync-variants' && req.method === 'POST') {
            const body = await parseBody(req);
            const result = await syncVariants(body.slug as string | undefined);
            return sendJson(res, result);
          }

          // POST /api/crm/eval-variant - Run evaluation
          if (path === '/eval-variant' && req.method === 'POST') {
            const body = await parseBody(req);
            const result = await evalVariant(body.slug as string);
            return sendJson(res, result);
          }

          // POST /api/crm/redteam-variant - Run redteam scan
          if (path === '/redteam-variant' && req.method === 'POST') {
            const body = await parseBody(req);
            const result = await redteamVariant(body.slug as string);
            return sendJson(res, result);
          }

          // 404 for unknown API routes
          return sendJson(res, { success: false, error: 'Not found' }, 404);

        } catch (error) {
          console.error('API Error:', error);
          return sendJson(res, {
            success: false,
            error: error instanceof Error ? error.message : 'Internal server error'
          }, 500);
        }
      });
    }
  };
}
