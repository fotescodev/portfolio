#!/usr/bin/env tsx
/**
 * Generate Resume PDF from React page
 *
 * Uses Puppeteer to render /resume route and export as PDF.
 *
 * Usage:
 *   npm run generate:resume                          # Generate base resume
 *   npm run generate:resume -- --name "Jane Smith"   # Custom filename
 *   npm run generate:resume -- --variant cursor-tam  # Generate variant resume
 *
 * Prerequisites:
 *   - Dev server must be running: npm run dev
 *   - Or specify URL: npm run generate:resume -- --url http://localhost:5173
 *
 * Output:
 *   public/resume.pdf (default)
 *   public/{name}.pdf (with --name flag)
 *   public/resumes/{variant-slug}.pdf (with --variant flag)
 */

import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, resolve, join } from 'path';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import YAML from 'yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');

/** Page dimensions at 96dpi */
const PAGE_DIMENSIONS = {
  LETTER: {
    WIDTH_PX: 816,   // 8.5" at 96dpi
    HEIGHT_PX: 1056, // 11" at 96dpi
  },
} as const;

/** Timing constants */
const TIMING = {
  /** Buffer after fonts.ready to ensure full render */
  POST_FONT_BUFFER_MS: 500,
  /** Navigation timeout */
  PAGE_LOAD_TIMEOUT_MS: 30000,
} as const;

interface ParsedArgs {
  url: string;
  name: string;
  variant: string;
  output: string;
  resumeUrl: string;
  updateVariant: boolean;
}

// Parse command line arguments
function parseArgs(): ParsedArgs {
  const args = process.argv.slice(2);
  let url = 'http://localhost:5173';
  let name = '';
  let variant = '';
  let updateVariant = true; // Default to updating the variant YAML

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--url' && args[i + 1]) {
      url = args[i + 1];
      i++;
    } else if (args[i] === '--name' && args[i + 1]) {
      name = args[i + 1];
      i++;
    } else if (args[i] === '--variant' && args[i + 1]) {
      variant = args[i + 1];
      i++;
    } else if (args[i] === '--no-update') {
      updateVariant = false;
    }
  }

  let output: string;
  let resumeUrl: string;

  if (variant) {
    // Variant resume: /company/role/resume -> public/resumes/{slug}.pdf
    // Handle multi-hyphen slugs: "cryptocom-pm-ai" -> company="cryptocom", role="pm-ai"
    const parts = variant.split('-');
    const company = parts[0];
    const role = parts.slice(1).join('-');
    if (!company || !role) {
      console.error('❌ Invalid variant slug. Expected format: company-role (e.g., cursor-tam)');
      process.exit(1);
    }
    resumeUrl = `${url}/${company}/${role}/resume`;
    output = resolve(rootDir, 'public', 'resumes', `${variant}.pdf`);
  } else if (name) {
    // Named resume: public/{name}.pdf
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    resumeUrl = `${url}/resume`;
    output = resolve(rootDir, 'public', `${slug}.pdf`);
  } else {
    // Default base resume
    resumeUrl = `${url}/resume`;
    output = resolve(rootDir, 'public', 'resume.pdf');
  }

  return { url, name, variant, output, resumeUrl, updateVariant };
}

/**
 * Update variant YAML with the resume path
 */
function updateVariantWithResumePath(variant: string, resumePath: string): boolean {
  const variantYamlPath = join(rootDir, 'content', 'variants', `${variant}.yaml`);

  if (!existsSync(variantYamlPath)) {
    console.warn(`  ⚠ Variant YAML not found: ${variantYamlPath}`);
    return false;
  }

  try {
    const content = readFileSync(variantYamlPath, 'utf-8');
    const parsed = YAML.parse(content);

    // Update the resumePath in metadata
    if (!parsed.metadata) {
      parsed.metadata = {};
    }
    parsed.metadata.resumePath = resumePath;

    // Write back with preserved formatting
    const updated = YAML.stringify(parsed, {
      lineWidth: 0,
      defaultStringType: 'QUOTE_DOUBLE',
      defaultKeyType: 'PLAIN'
    });
    writeFileSync(variantYamlPath, updated, 'utf-8');

    return true;
  } catch (error) {
    console.warn(`  ⚠ Failed to update variant YAML: ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
}

async function generateResumePDF() {
  const { variant, output, resumeUrl, updateVariant } = parseArgs();

  console.log('Generating Resume PDF...');
  console.log(`  Source: ${resumeUrl}`);
  console.log(`  Output: ${output}`);
  if (variant) {
    console.log(`  Variant: ${variant}`);
  }

  // Ensure output directory exists
  const outputDir = dirname(output);
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();

    // Set viewport for consistent rendering
    await page.setViewport({
      width: PAGE_DIMENSIONS.LETTER.WIDTH_PX,
      height: PAGE_DIMENSIONS.LETTER.HEIGHT_PX,
      deviceScaleFactor: 2,
    });

    // Navigate to resume page
    console.log('  Loading page...');
    const response = await page.goto(resumeUrl, {
      waitUntil: 'networkidle0',
      timeout: TIMING.PAGE_LOAD_TIMEOUT_MS,
    });

    if (!response?.ok()) {
      throw new Error(
        `Failed to load ${resumeUrl} - is the dev server running? (npm run dev)`
      );
    }

    // Wait for fonts to load using the Font Loading API
    console.log('  Waiting for fonts...');
    await page.evaluateHandle('document.fonts.ready');
    // Small buffer after fonts.ready to ensure full render
    await new Promise((r) => setTimeout(r, TIMING.POST_FONT_BUFFER_MS));

    // Generate PDF
    console.log('  Rendering PDF...');
    await page.pdf({
      path: output,
      format: 'letter',
      printBackground: true,
      margin: {
        top: '0.4in',
        right: '0.5in',
        bottom: '0.4in',
        left: '0.5in',
      },
      preferCSSPageSize: true,
    });

    console.log(`\n✓ Resume PDF generated: ${output}`);

    // If variant, update the variant YAML with resume path
    if (variant && updateVariant) {
      const relativePath = `/resumes/${variant}.pdf`;
      const updated = updateVariantWithResumePath(variant, relativePath);
      if (updated) {
        console.log(`✓ Updated variant YAML with resumePath: ${relativePath}`);
        console.log('\n  Run npm run variants:sync to update JSON artifact');
      }
    } else if (!variant) {
      console.log('\nTo update the download link in profile.yaml:');
      console.log(`  hero.cta.secondary.href: "/${output.split('/').pop()}"`);
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('net::ERR_CONNECTION_REFUSED')) {
      console.error('\n❌ Error: Could not connect to dev server');
      console.error('   Make sure the dev server is running: npm run dev');
      process.exit(1);
    }
    throw error;
  } finally {
    await browser.close();
  }
}

generateResumePDF().catch((error) => {
  console.error('❌ Error generating resume:', error.message);
  process.exit(1);
});
