#!/usr/bin/env node
/**
 * Generate favicon PNG from HTML template
 *
 * Usage:
 *   npm run generate:favicon
 *
 * Output:
 *   public/favicon.png (512x512 PNG)
 *
 * Note: This requires puppeteer to be installed and working.
 * The SVG favicon at public/favicon.svg works directly in modern browsers.
 */

import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');

const config = {
  input: resolve(rootDir, 'public/favicon-template.html'),
  output: resolve(rootDir, 'public/favicon.png'),
};

async function generateFavicon() {
  console.log('Generating favicon PNG from template...');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // Set viewport to favicon size
  await page.setViewport({
    width: 512,
    height: 512,
    deviceScaleFactor: 1,
  });

  // Load the HTML template
  await page.goto(`file://${config.input}`, {
    waitUntil: 'networkidle0',
  });

  // Wait for rendering
  await new Promise(r => setTimeout(r, 500));

  // Take screenshot
  await page.screenshot({
    path: config.output,
    type: 'png',
    clip: {
      x: 0,
      y: 0,
      width: 512,
      height: 512,
    },
  });

  await browser.close();

  console.log(`  ✓ Saved: ${config.output}`);
  console.log('\nDone! Favicon PNG generated.');
}

generateFavicon().catch(console.error);
