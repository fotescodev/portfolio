/**
 * Universal CV CLI Theme
 *
 * Design tokens and utilities for consistent CLI output.
 * Colors derived from the portfolio design system (globals.css)
 */

import chalk from 'chalk';

// Brand colors from globals.css
const BRAND = {
  accent: '#c29a6c',      // --color-accent (dark mode)
  accentLight: '#8a6642', // --color-accent (light mode)
  success: '#4ade80',     // --color-success
  warning: '#facc15',     // Yellow for warnings
  error: '#ef4444',       // --color-danger
  info: '#60a5fa',        // Blue for info
  muted: '#6b7280',       // Gray for secondary text
};

// Semantic color functions
export const theme = {
  // Brand
  brand: chalk.hex(BRAND.accent),
  brandBold: chalk.hex(BRAND.accent).bold,

  // Semantic
  success: chalk.hex(BRAND.success),
  warning: chalk.hex(BRAND.warning),
  error: chalk.hex(BRAND.error),
  info: chalk.hex(BRAND.info),
  muted: chalk.hex(BRAND.muted),

  // Text variants
  bold: chalk.bold,
  dim: chalk.dim,
  italic: chalk.italic,
  underline: chalk.underline,
  inverse: chalk.inverse,

  // Status icons with colors
  icons: {
    success: chalk.hex(BRAND.success)('✓'),
    error: chalk.hex(BRAND.error)('✗'),
    warning: chalk.hex(BRAND.warning)('⚠'),
    info: chalk.hex(BRAND.info)('ℹ'),
    pending: chalk.hex(BRAND.muted)('○'),
    running: chalk.hex(BRAND.info)('●'),
    bullet: chalk.hex(BRAND.muted)('•'),
  },

  // For pass/fail/warn badges
  badge: {
    pass: chalk.hex(BRAND.success).bold('PASS'),
    fail: chalk.hex(BRAND.error).bold('FAIL'),
    warn: chalk.hex(BRAND.warning).bold('WARN'),
  },

  // High-contrast ribbon (used for guided next-step UI)
  ribbon: (text: string) => chalk.bgHex(BRAND.accent).black.bold(` ${text} `),
  ribbonMuted: (text: string) => chalk.bgHex(BRAND.muted).black.bold(` ${text} `),
};

// ASCII Art header - compact version for subcommands
export const HEADER_COMPACT = `
${chalk.hex(BRAND.accent)('╭─────────────────────────────────────────────────────────────────────────────╮')}
${chalk.hex(BRAND.accent)('│')}  ${chalk.hex(BRAND.accent).bold('◆ Universal CV')}                                          ${chalk.dim('Quality Pipeline')}  ${chalk.hex(BRAND.accent)('│')}
${chalk.hex(BRAND.accent)('╰─────────────────────────────────────────────────────────────────────────────╯')}
`.trim();

// Full ASCII art logo for main entry point
export const HEADER_FULL = `
${chalk.hex(BRAND.accent)('    ██╗   ██╗███╗   ██╗██╗██╗   ██╗███████╗██████╗ ███████╗ █████╗ ██╗')}
${chalk.hex(BRAND.accent)('    ██║   ██║████╗  ██║██║██║   ██║██╔════╝██╔══██╗██╔════╝██╔══██╗██║')}
${chalk.hex(BRAND.accent)('    ██║   ██║██╔██╗ ██║██║██║   ██║█████╗  ██████╔╝███████╗███████║██║')}
${chalk.hex(BRAND.accent)('    ██║   ██║██║╚██╗██║██║╚██╗ ██╔╝██╔══╝  ██╔══██╗╚════██║██╔══██║██║')}
${chalk.hex(BRAND.accent)('    ╚██████╔╝██║ ╚████║██║ ╚████╔╝ ███████╗██║  ██║███████║██║  ██║███████╗')}
${chalk.hex(BRAND.accent)('     ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═══╝  ╚══════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚══════╝')}
${chalk.hex(BRAND.accent)('                             ██████╗██╗   ██╗')}
${chalk.hex(BRAND.accent)('                            ██╔════╝██║   ██║')}
${chalk.hex(BRAND.accent)('                            ██║     ██║   ██║')}
${chalk.hex(BRAND.accent)('                            ██║     ╚██╗ ██╔╝')}
${chalk.hex(BRAND.accent)('                            ╚██████╗ ╚████╔╝')}
${chalk.hex(BRAND.accent)('                             ╚═════╝  ╚═══╝')}

${chalk.dim('                   AI-Powered Portfolio Quality Pipeline')}
`.trim();

/**
 * Print a section header
 */
export function header(title: string, subtitle?: string): string {
  const line = chalk.hex(BRAND.muted)('─'.repeat(75));
  const header = `${chalk.hex(BRAND.accent).bold(title)}${subtitle ? chalk.dim(` · ${subtitle}`) : ''}`;
  return `\n${header}\n${line}`;
}

/**
 * Print a box around content
 */
export function box(title: string, content: string): string {
  const lines = content.split('\n');
  const maxWidth = Math.max(title.length + 4, ...lines.map(l => stripAnsi(l).length + 4));
  const width = Math.min(maxWidth, 77);

  const accent = chalk.hex(BRAND.accent);
  const top = `${accent('╭─')} ${chalk.bold(title)} ${accent('─'.repeat(Math.max(0, width - title.length - 5)))}${accent('╮')}`;
  const bottom = `${accent('╰')}${accent('─'.repeat(width - 1))}${accent('╯')}`;

  const body = lines.map(line => {
    const stripped = stripAnsi(line);
    const padding = Math.max(0, width - stripped.length - 4);
    return `${accent('│')} ${line}${' '.repeat(padding)} ${accent('│')}`;
  }).join('\n');

  return [top, body, bottom].join('\n');
}

/**
 * Format a key-value pair
 */
export function kv(key: string, value: string): string {
  return `${chalk.dim(key + ':')} ${value}`;
}

/**
 * Format a list item
 */
export function li(text: string, indent = 0): string {
  return `${'  '.repeat(indent)}${theme.icons.bullet} ${text}`;
}

/**
 * Format a step in a process
 */
export function step(status: 'pending' | 'running' | 'success' | 'error', text: string): string {
  const icon = theme.icons[status] || theme.icons.pending;
  return `${icon} ${text}`;
}

/**
 * Simple progress bar
 */
export function progressBar(percent: number, width = 40): string {
  const filled = Math.round((percent / 100) * width);
  const empty = width - filled;
  return `${chalk.hex(BRAND.success)('█'.repeat(filled))}${chalk.dim('░'.repeat(empty))} ${percent.toFixed(0)}%`;
}

/**
 * Strip ANSI codes from a string (for width calculation)
 */
function stripAnsi(str: string): string {
  // eslint-disable-next-line no-control-regex
  return str.replace(/\x1B\[[0-9;]*m/g, '');
}

/**
 * Detect if running in interactive mode
 */
export function isInteractive(): boolean {
  return process.stdin.isTTY === true &&
         process.stdout.isTTY === true &&
         !process.env.CI &&
         !process.env.UCV_NON_INTERACTIVE;
}

/**
 * Check if colors should be disabled
 */
export function shouldUseColor(): boolean {
  return !process.env.NO_COLOR &&
         !process.env.UCV_NO_COLOR &&
         (process.stdout.isTTY === true || process.env.FORCE_COLOR === '1');
}
