/**
 * Universal CV CLI Theme
 *
 * Design tokens and utilities for consistent CLI output.
 * Colors derived from the portfolio design system (globals.css)
 */

import chalk from 'chalk';
import { join } from 'path';

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

  // For pass/fail/warn badges (text-only, for inline use)
  badge: {
    pass: chalk.hex(BRAND.success).bold('PASS'),
    fail: chalk.hex(BRAND.error).bold('FAIL'),
    warn: chalk.hex(BRAND.warning).bold('WARN'),
  },

  // Enhanced badges with background colors (for prominent display)
  badgeBg: {
    live: chalk.bgGreen.black.bold(' LIVE '),
    draft: chalk.bgYellow.black(' DRAFT '),
    pass: chalk.bgGreen.black.bold(' PASS '),
    fail: chalk.bgRed.white.bold(' FAIL '),
    warn: chalk.bgYellow.black.bold(' WARN '),
    error: chalk.bgRed.white(' ERR '),
    pending: chalk.bgHex('#4b5563').white(' ... '),
    ok: chalk.bgGreen.black.bold(' OK '),
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

// ─────────────────────────────────────────────────────────────────────────────
// Clickable Hyperlinks (OSC 8)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Check if the terminal supports OSC 8 hyperlinks.
 * Supported by: iTerm2, Terminal.app (macOS 10.15+), Windows Terminal,
 * VSCode terminal, WezTerm, Kitty, most modern Linux terminals.
 */
export function supportsHyperlinks(): boolean {
  // Skip in CI environments or when explicitly disabled
  if (process.env.CI || process.env.UCV_NO_HYPERLINKS) return false;

  // Must be a TTY
  if (!process.stdout.isTTY) return false;

  const term = process.env.TERM_PROGRAM || '';

  // Known supporting terminals
  if (term === 'iTerm.app') return true;
  if (term === 'Apple_Terminal') return true;
  if (term === 'vscode') return true;
  if (term === 'WezTerm') return true;
  if (term === 'Hyper') return true;

  // Windows Terminal
  if (process.env.WT_SESSION) return true;

  // Kitty
  if (process.env.KITTY_WINDOW_ID) return true;

  // GNOME Terminal, Konsole, etc. - check COLORTERM
  const colorTerm = process.env.COLORTERM || '';
  if (colorTerm === 'truecolor' || colorTerm === '24bit') {
    return true;
  }

  // Default: try anyway if it's a modern 256color terminal
  return process.env.TERM?.includes('256color') ?? false;
}

/**
 * Create a clickable hyperlink using OSC 8 escape sequence.
 * Falls back to styled (underlined) text when hyperlinks not supported.
 *
 * @param url The URL to link to (vscode://, https://, file://, etc.)
 * @param text The visible text
 */
export function hyperlink(url: string, text: string): string {
  if (!supportsHyperlinks()) {
    return theme.underline(theme.info(text));
  }

  // OSC 8 format: \x1b]8;;URL\x07 TEXT \x1b]8;;\x07
  const start = `\x1b]8;;${url}\x07`;
  const end = `\x1b]8;;\x07`;

  // Apply visual styling to indicate clickability
  const styledText = theme.underline(theme.info(text));

  return `${start}${styledText}${end}`;
}

/**
 * Build a VSCode URL for opening a file at a specific location.
 * Format: vscode://file/ABSOLUTE_PATH:LINE:COLUMN
 *
 * @param filePath Relative or absolute path to the file
 * @param line Optional line number (1-indexed)
 * @param column Optional column number (1-indexed)
 */
export function vscodeUrl(filePath: string, line?: number, column?: number): string {
  const absolutePath = filePath.startsWith('/')
    ? filePath
    : join(process.cwd(), filePath);

  let url = `vscode://file${absolutePath}`;
  if (line !== undefined && line > 0) {
    url += `:${line}`;
    if (column !== undefined && column > 0) {
      url += `:${column}`;
    }
  }
  return url;
}

/**
 * Create a clickable file link that opens in VSCode.
 *
 * @param filePath Relative path to the file
 * @param line Optional line number
 */
export function fileLink(filePath: string, line?: number): string {
  const url = vscodeUrl(filePath, line);
  return hyperlink(url, filePath);
}
