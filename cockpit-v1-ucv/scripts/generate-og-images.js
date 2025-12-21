#!/usr/bin/env node
/**
 * Generate OG images from HTML templates
 *
 * Usage:
 *   npm run generate:og          # Generate both dark and light
 *   npm run generate:og -- dark  # Generate dark only
 *   npm run generate:og -- light # Generate light only
 *
 * Output:
 *   public/images/og-image.png       (dark - default for social)
 *   public/images/og-image-light.png (light - alternative)
 */

import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');

const templates = {
  dark: {
    input: resolve(rootDir, 'public/og-image-dark.html'),
    output: resolve(rootDir, 'public/images/og-image.png'),
  },
  light: {
    input: resolve(rootDir, 'public/og-image-light.html'),
    output: resolve(rootDir, 'public/images/og-image-light.png'),
  },
};

async function generateImage(variant) {
  const config = templates[variant];
  if (!config) {
    console.error(`Unknown variant: ${variant}`);
    process.exit(1);
  }

  console.log(`Generating ${variant} OG image...`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // Set viewport to exact OG image dimensions
  await page.setViewport({
    width: 1200,
    height: 630,
    deviceScaleFactor: 2, // 2x for retina quality
  });

  // Load the HTML template
  await page.goto(`file://${config.input}`, {
    waitUntil: 'networkidle0', // Wait for fonts to load
  });

  // Wait a bit more for fonts to fully render
  await new Promise(r => setTimeout(r, 1000));

  // Take screenshot
  await page.screenshot({
    path: config.output,
    type: 'png',
    clip: {
      x: 0,
      y: 0,
      width: 1200,
      height: 630,
    },
  });

  await browser.close();

  console.log(`  ✓ Saved: ${config.output}`);
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    // Generate both
    await generateImage('dark');
    await generateImage('light');
  } else {
    // Generate specified variant
    for (const variant of args) {
      await generateImage(variant);
    }
  }

  console.log('\nDone! OG images generated.');
  console.log('\nTo test social previews:');
  console.log('  - LinkedIn: https://www.linkedin.com/post-inspector/');
  console.log('  - Twitter: https://cards-dev.twitter.com/validator');
  console.log('  - Facebook: https://developers.facebook.com/tools/debug/');
  console.log('  - General: https://www.opengraph.xyz/');
}

main().catch(console.error);
