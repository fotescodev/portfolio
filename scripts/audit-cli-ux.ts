#!/usr/bin/env tsx
/**
 * CLI UX Audit Runner
 *
 * Automatically tests all CLI tools and generates a structured assessment.
 * Used by the first-time-user skill to automate UX auditing.
 *
 * Usage:
 *   npm run audit:cli
 *   npm run audit:cli -- --json
 *   npm run audit:cli -- --save
 */

import { execSync, spawnSync } from 'child_process';
import { writeFileSync, existsSync } from 'fs';
import { join } from 'path';

// ANSI colors
const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  gray: '\x1b[90m',
  cyan: '\x1b[36m'
};

interface CLITest {
  name: string;
  command: string;
  args: string[];
  expectSuccess: boolean;
  checkHelp: boolean;
  checkJson: boolean;
  description: string;
}

interface TestResult {
  name: string;
  command: string;
  success: boolean;
  exitCode: number;
  hasHelp: boolean;
  helpQuality: 'excellent' | 'good' | 'poor' | 'none';
  hasJson: boolean;
  errorClarity: 'helpful' | 'unhelpful' | 'none';
  outputSample: string;
  duration: number;
  notes: string[];
}

interface AuditReport {
  timestamp: string;
  totalTests: number;
  passed: number;
  failed: number;
  overallScore: number;
  results: TestResult[];
  recommendations: string[];
}

// Define CLI tests
const CLI_TESTS: CLITest[] = [
  {
    name: 'validate',
    command: 'npm',
    args: ['run', 'validate'],
    expectSuccess: true,
    checkHelp: false,
    checkJson: false,
    description: 'Content validation'
  },
  {
    name: 'analyze:jd (help)',
    command: 'npm',
    args: ['run', 'analyze:jd', '--', '--text', 'test'],
    expectSuccess: true,
    checkHelp: false, // Has usage in error, not --help flag
    checkJson: false,
    description: 'Job description analysis'
  },
  {
    name: 'analyze:jd (json)',
    command: 'npm',
    args: ['run', 'analyze:jd', '--', '--text', 'Looking for a PM with 5 years experience in crypto and API development.', '--json'],
    expectSuccess: true,
    checkHelp: false,
    checkJson: false, // We're testing JSON directly in this command
    description: 'JD analysis JSON output'
  },
  {
    name: 'search:evidence',
    command: 'npm',
    args: ['run', 'search:evidence', '--', '--terms', 'crypto,api,infrastructure'],
    expectSuccess: true,
    checkHelp: false,
    checkJson: false,
    description: 'Evidence search'
  },
  {
    name: 'search:evidence (json)',
    command: 'npm',
    args: ['run', 'search:evidence', '--', '--terms', 'crypto', '--json'],
    expectSuccess: true,
    checkHelp: false,
    checkJson: false,
    description: 'Evidence search JSON output'
  },
  {
    name: 'check:coverage',
    command: 'npm',
    args: ['run', 'check:coverage'],
    expectSuccess: true,
    checkHelp: false,
    checkJson: false,
    description: 'Bullet coverage check'
  },
  {
    name: 'check:coverage (json)',
    command: 'npm',
    args: ['run', 'check:coverage', '--', '--json'],
    expectSuccess: true,
    checkHelp: false,
    checkJson: false,
    description: 'Coverage JSON output'
  },
  {
    name: 'generate:cv (help)',
    command: 'npm',
    args: ['run', 'generate:cv', '--', '--help'],
    expectSuccess: true,
    checkHelp: true,
    checkJson: false,
    description: 'CV generator help'
  },
  {
    name: 'generate:cv (error)',
    command: 'npm',
    args: ['run', 'generate:cv', '--', '--company', 'Test', '--role', 'PM', '--jd-text', 'Test JD'],
    expectSuccess: false,
    checkHelp: false,
    checkJson: false,
    description: 'CV generator error handling (no API key)'
  },
  {
    name: 'eval:variant',
    command: 'npm',
    args: ['run', 'eval:variant', '--', '--slug', 'bloomberg-technical-product-manager'],
    expectSuccess: true,
    checkHelp: false,
    checkJson: false,
    description: 'Variant evaluation'
  },
  {
    name: 'redteam:variant',
    command: 'npm',
    args: ['run', 'redteam:variant', '--', '--slug', 'bloomberg-technical-product-manager'],
    expectSuccess: true, // May have warnings but should exit 0
    checkHelp: false,
    checkJson: false,
    description: 'Red team scan'
  },
  {
    name: 'variants:sync',
    command: 'npm',
    args: ['run', 'variants:sync'],
    expectSuccess: true,
    checkHelp: false,
    checkJson: false,
    description: 'Variant syncing'
  }
];

function runCommand(command: string, args: string[], timeout = 60000): {
  stdout: string;
  stderr: string;
  exitCode: number;
  duration: number
} {
  const start = Date.now();

  try {
    const result = spawnSync(command, args, {
      encoding: 'utf-8',
      timeout,
      cwd: process.cwd(),
      env: { ...process.env, FORCE_COLOR: '0' } // Disable colors for parsing
    });

    return {
      stdout: result.stdout || '',
      stderr: result.stderr || '',
      exitCode: result.status ?? 1,
      duration: Date.now() - start
    };
  } catch (error) {
    return {
      stdout: '',
      stderr: error instanceof Error ? error.message : 'Unknown error',
      exitCode: 1,
      duration: Date.now() - start
    };
  }
}

function assessHelpQuality(output: string): 'excellent' | 'good' | 'poor' | 'none' {
  if (!output || output.length < 50) return 'none';

  const hasUsage = /usage:/i.test(output);
  const hasExamples = /example/i.test(output);
  const hasOptions = /--\w+/.test(output);
  const hasDescription = output.length > 200;

  const score = [hasUsage, hasExamples, hasOptions, hasDescription].filter(Boolean).length;

  if (score >= 4) return 'excellent';
  if (score >= 2) return 'good';
  if (score >= 1) return 'poor';
  return 'none';
}

function assessErrorClarity(output: string, isError: boolean): 'helpful' | 'unhelpful' | 'none' {
  if (!isError) return 'none';

  const hasActionableAdvice = /to fix|try|run|use|get.*at/i.test(output);
  const hasLink = /https?:\/\//.test(output);
  const hasSpecificError = /error:|missing|invalid|not found/i.test(output);

  if (hasActionableAdvice || hasLink) return 'helpful';
  if (hasSpecificError) return 'unhelpful';
  return 'none';
}

function extractJson(str: string): string | null {
  // npm adds header lines before the actual output
  // Try to find JSON object/array in the output
  const lines = str.split('\n');
  let jsonStart = -1;
  let braceCount = 0;
  let inJson = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!inJson && (line.startsWith('{') || line.startsWith('['))) {
      jsonStart = i;
      inJson = true;
    }
    if (inJson) {
      braceCount += (line.match(/{/g) || []).length;
      braceCount -= (line.match(/}/g) || []).length;
      braceCount += (line.match(/\[/g) || []).length;
      braceCount -= (line.match(/]/g) || []).length;

      if (braceCount === 0) {
        const jsonStr = lines.slice(jsonStart, i + 1).join('\n');
        return jsonStr;
      }
    }
  }
  return null;
}

function isValidJson(str: string): boolean {
  const jsonStr = extractJson(str);
  if (!jsonStr) return false;
  try {
    JSON.parse(jsonStr);
    return true;
  } catch {
    return false;
  }
}

function runTest(test: CLITest): TestResult {
  console.log(`${c.gray}Testing: ${c.reset}${test.name}...`);

  const result = runCommand(test.command, test.args);
  const combined = result.stdout + result.stderr;
  const success = test.expectSuccess ? result.exitCode === 0 : true; // Non-success expected = still pass

  const notes: string[] = [];

  // Check --help availability
  let hasHelp = false;
  let helpQuality: TestResult['helpQuality'] = 'none';

  if (test.checkHelp) {
    hasHelp = combined.length > 100;
    helpQuality = assessHelpQuality(combined);
    if (helpQuality === 'excellent') notes.push('Excellent help documentation');
    if (helpQuality === 'poor') notes.push('Help could be more detailed');
  }

  // Check if this command tests JSON output directly
  let hasJson = false;
  if (test.name.includes('(json)')) {
    hasJson = isValidJson(result.stdout);
    if (hasJson) {
      notes.push('JSON output works');
    } else {
      notes.push('JSON output broken or missing');
    }
  }

  // Assess error clarity
  const errorClarity = assessErrorClarity(combined, result.exitCode !== 0);
  if (errorClarity === 'helpful') notes.push('Error messages are helpful');
  if (errorClarity === 'unhelpful') notes.push('Error messages could be more helpful');

  // Truncate output sample
  const outputSample = combined.substring(0, 500) + (combined.length > 500 ? '...' : '');

  const statusIcon = success ? `${c.green}✓${c.reset}` : `${c.red}✗${c.reset}`;
  console.log(`  ${statusIcon} ${test.name} (${result.duration}ms)`);

  return {
    name: test.name,
    command: `${test.command} ${test.args.join(' ')}`,
    success,
    exitCode: result.exitCode,
    hasHelp,
    helpQuality,
    hasJson,
    errorClarity,
    outputSample,
    duration: result.duration,
    notes
  };
}

function generateRecommendations(results: TestResult[]): string[] {
  const recommendations: string[] = [];

  // Check for failed tests
  const failed = results.filter(r => !r.success);
  if (failed.length > 0) {
    recommendations.push(`Fix failing commands: ${failed.map(r => r.name).join(', ')}`);
  }

  // Check for broken JSON tests
  const brokenJson = results.filter(r => r.name.includes('(json)') && !r.hasJson);
  if (brokenJson.length > 0) {
    recommendations.push(`Fix JSON output for: ${brokenJson.map(r => r.name.replace(' (json)', '')).join(', ')}`);
  }

  // Check for unhelpful errors
  const badErrors = results.filter(r => r.errorClarity === 'unhelpful');
  if (badErrors.length > 0) {
    recommendations.push(`Improve error messages for: ${badErrors.map(r => r.name).join(', ')}`);
  }

  // Check for slow commands
  const slow = results.filter(r => r.duration > 5000);
  if (slow.length > 0) {
    recommendations.push(`Consider optimizing slow commands: ${slow.map(r => `${r.name} (${r.duration}ms)`).join(', ')}`);
  }

  if (recommendations.length === 0) {
    recommendations.push('All CLI tools are working well!');
  }

  return recommendations;
}

function calculateScore(results: TestResult[]): number {
  let score = 0;
  let maxScore = 0;

  for (const r of results) {
    // Success: 2 points
    maxScore += 2;
    if (r.success) score += 2;

    // Help quality: 2 points
    if (r.helpQuality !== 'none') {
      maxScore += 2;
      if (r.helpQuality === 'excellent') score += 2;
      else if (r.helpQuality === 'good') score += 1;
    }

    // JSON output: 1 point
    maxScore += 1;
    if (r.hasJson) score += 1;

    // Error clarity: 1 point (only if error occurred)
    if (r.exitCode !== 0) {
      maxScore += 1;
      if (r.errorClarity === 'helpful') score += 1;
    }
  }

  return Math.round((score / maxScore) * 100) / 10;
}

function formatReport(report: AuditReport, json: boolean): string {
  if (json) {
    return JSON.stringify(report, null, 2);
  }

  let output = `
${c.bold}═══════════════════════════════════════════════════════════════${c.reset}
${c.bold}  CLI UX AUDIT REPORT${c.reset}
${c.bold}═══════════════════════════════════════════════════════════════${c.reset}

${c.cyan}Timestamp:${c.reset} ${report.timestamp}
${c.cyan}Overall Score:${c.reset} ${report.overallScore}/10

${c.bold}Summary:${c.reset}
  ${c.green}Passed:${c.reset} ${report.passed}/${report.totalTests}
  ${c.red}Failed:${c.reset} ${report.failed}/${report.totalTests}

${c.bold}Results:${c.reset}
`;

  for (const r of report.results) {
    const icon = r.success ? `${c.green}✓${c.reset}` : `${c.red}✗${c.reset}`;
    const help = r.helpQuality !== 'none' ? `help:${r.helpQuality}` : '';
    const json = r.hasJson ? 'json:yes' : '';
    const error = r.errorClarity !== 'none' ? `errors:${r.errorClarity}` : '';
    const meta = [help, json, error].filter(Boolean).join(' | ');

    output += `  ${icon} ${r.name} ${c.gray}(${r.duration}ms)${c.reset}\n`;
    if (meta) output += `    ${c.gray}${meta}${c.reset}\n`;
    if (r.notes.length) output += `    ${c.gray}${r.notes.join(', ')}${c.reset}\n`;
  }

  if (report.recommendations.length > 0) {
    output += `\n${c.bold}Recommendations:${c.reset}\n`;
    for (const rec of report.recommendations) {
      output += `  ${c.yellow}•${c.reset} ${rec}\n`;
    }
  }

  return output;
}

async function main() {
  const args = process.argv.slice(2);
  const jsonOutput = args.includes('--json');
  const saveReport = args.includes('--save');

  if (!jsonOutput) {
    console.log(`${c.bold}${c.blue}CLI UX Audit${c.reset}\n`);
    console.log(`${c.gray}Running ${CLI_TESTS.length} tests...${c.reset}\n`);
  }

  const results: TestResult[] = [];

  for (const test of CLI_TESTS) {
    results.push(runTest(test));
  }

  const report: AuditReport = {
    timestamp: new Date().toISOString(),
    totalTests: results.length,
    passed: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    overallScore: calculateScore(results),
    results,
    recommendations: generateRecommendations(results)
  };

  console.log(formatReport(report, jsonOutput));

  if (saveReport) {
    const filename = `cli-ux-audit-${new Date().toISOString().split('T')[0]}.json`;
    const filepath = join('docs', 'audits', filename);
    writeFileSync(filepath, JSON.stringify(report, null, 2));
    console.log(`\n${c.green}Report saved to:${c.reset} ${filepath}`);
  }
}

main().catch(console.error);
