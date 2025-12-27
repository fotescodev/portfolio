#!/usr/bin/env tsx
/**
 * Generate Resume PDF from React page
 *
 * Uses Puppeteer to render /resume route and export as PDF.
 *
 * Usage:
 *   npm run generate:resume              # Generate base resume
 *   npm run generate:resume -- --name "Jane Smith"  # Custom filename
 *
 * Prerequisites:
 *   - Dev server must be running: npm run dev
 *   - Or specify URL: npm run generate:resume -- --url http://localhost:5173
 *
 * Output:
 *   public/resume.pdf (default)
 *   public/{name}-resume.pdf (with --name flag)
 */

import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { existsSync, mkdirSync } from 'fs';

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

// Parse command line arguments
function parseArgs(): { url: string; name: string; output: string } {
  const args = process.argv.slice(2);
  let url = 'http://localhost:5173';
  let name = '';

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--url' && args[i + 1]) {
      url = args[i + 1];
      i++;
    } else if (args[i] === '--name' && args[i + 1]) {
      name = args[i + 1];
      i++;
    }
  }

  // Generate output filename
  const slug = name
    ? name.toLowerCase().replace(/\s+/g, '-')
    : 'resume';
  const output = resolve(rootDir, 'public', `${slug}.pdf`);

  return { url, name, output };
}

async function generateResumePDF() {
  const { url, output } = parseArgs();
  const resumeUrl = `${url}/resume`;

  console.log('Generating Resume PDF...');
  console.log(`  Source: ${resumeUrl}`);
  console.log(`  Output: ${output}`);

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
    console.log('\nTo update the download link in profile.yaml:');
    console.log(`  hero.cta.secondary.href: "/${output.split('/').pop()}"`);
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
