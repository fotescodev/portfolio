#!/usr/bin/env tsx
/**
 * Verify Convex URL configuration and connectivity
 *
 * Usage:
 *   npm run verify:convex
 *   npm run verify:convex -- --env production
 *
 * Validates:
 * - URL is set
 * - URL uses HTTPS
 * - URL matches *.convex.cloud pattern
 * - Optional: URL connectivity (if network available)
 * - Warns about dev/staging URLs
 */

import https from 'https';
import { URL } from 'url';

const convexUrl = process.env.VITE_CONVEX_URL || process.env.CONVEX_URL;

if (!convexUrl) {
  console.error('❌ ERROR: VITE_CONVEX_URL is not set');
  console.error('');
  console.error('Set it in:');
  console.error('  1. .env.local (development)');
  console.error('  2. GitHub Secrets (production)');
  process.exit(1);
}

try {
  // Validate URL format
  const url = new URL(convexUrl);

  console.log('\n🔍 Verifying Convex URL Configuration\n');

  // Check HTTPS
  if (url.protocol !== 'https:') {
    console.error('❌ ERROR: Convex URL must use HTTPS');
    console.error(`   Got: ${url.protocol}//`);
    console.error(`   Expected: https://`);
    process.exit(1);
  }
  console.log('✓ Protocol: HTTPS');

  // Check domain
  if (!url.hostname.includes('convex.cloud')) {
    console.error('❌ ERROR: URL does not appear to be a Convex deployment');
    console.error(`   Got: ${url.hostname}`);
    console.error(`   Expected: *.convex.cloud`);
    process.exit(1);
  }
  console.log('✓ Domain: *.convex.cloud');

  // Validate format with regex
  if (!/^https:\/\/[a-z0-9-]+\.convex\.cloud\/?$/.test(convexUrl)) {
    console.error('❌ ERROR: URL format does not match expected pattern');
    console.error(`   Got: ${convexUrl}`);
    console.error(`   Expected: https://xxx.convex.cloud`);
    process.exit(1);
  }
  console.log('✓ Format: Valid');

  // Warn about non-production URLs
  if (url.hostname.includes('dev') || url.hostname.includes('staging')) {
    console.warn('\n⚠️  WARNING: URL appears to be non-production:');
    console.warn(`   Hostname: ${url.hostname}`);
    console.warn('   Confirm this is intentional before deploying to main branch');
  }

  console.log(`\n✓ Convex URL is valid: ${convexUrl}\n`);

  // Optional: Test connectivity
  console.log('🌐 Testing connectivity...');
  const request = https.get(`${convexUrl}/api`, { timeout: 5000 }, (res) => {
    console.log(`✓ Deployment is reachable (Status: ${res.statusCode})`);
  });

  request.on('error', (err) => {
    console.warn(`⚠️  Could not reach Convex deployment: ${err.message}`);
    console.warn('   (Network might be restricted in CI environment)');
  });

  request.on('timeout', () => {
    request.destroy();
    console.warn('⚠️  Connection timeout');
  });

} catch (err) {
  console.error('❌ ERROR: Invalid Convex URL');
  console.error(`   Error: ${err instanceof Error ? err.message : String(err)}`);
  console.error(`   URL: ${convexUrl}`);
  process.exit(1);
}
