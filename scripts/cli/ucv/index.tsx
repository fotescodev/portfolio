#!/usr/bin/env tsx
/**
 * UCV-CLI: Interactive Universal CV Pipeline
 *
 * Single entry point for the Universal CV quality pipeline.
 * Replaces the need to remember individual npm commands.
 *
 * Usage:
 *   npm run ucv-cli
 */

import React from 'react';
import { render } from 'ink';
import { App } from './App.js';

// Check for TTY - if not interactive, show help and exit
if (!process.stdin.isTTY || !process.stdout.isTTY) {
  console.log('UCV-CLI requires an interactive terminal.');
  console.log('');
  console.log('For non-interactive usage, use the individual commands:');
  console.log('  npm run variants:sync     Sync YAML → JSON');
  console.log('  npm run eval:all          Evaluate all variants');
  console.log('  npm run redteam:all       Red team all variants');
  process.exit(1);
}

// Render the Ink app
render(<App />);
