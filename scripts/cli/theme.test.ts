/**
 * Unit tests for CLI theme utilities
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  theme,
  header,
  box,
  kv,
  li,
  step,
  progressBar,
  isInteractive,
  shouldUseColor,
  supportsHyperlinks,
  hyperlink,
  vscodeUrl,
  fileLink,
} from './theme.js';

describe('theme utilities', () => {
  describe('theme object', () => {
    it('exports semantic color functions', () => {
      expect(typeof theme.brand).toBe('function');
      expect(typeof theme.success).toBe('function');
      expect(typeof theme.warning).toBe('function');
      expect(typeof theme.error).toBe('function');
      expect(typeof theme.info).toBe('function');
      expect(typeof theme.muted).toBe('function');
    });

    it('exports text variant functions', () => {
      expect(typeof theme.bold).toBe('function');
      expect(typeof theme.dim).toBe('function');
      expect(typeof theme.italic).toBe('function');
      expect(typeof theme.underline).toBe('function');
      expect(typeof theme.inverse).toBe('function');
    });

    it('exports status icons', () => {
      expect(theme.icons.success).toBeDefined();
      expect(theme.icons.error).toBeDefined();
      expect(theme.icons.warning).toBeDefined();
      expect(theme.icons.info).toBeDefined();
      expect(theme.icons.pending).toBeDefined();
      expect(theme.icons.running).toBeDefined();
      expect(theme.icons.bullet).toBeDefined();
    });

    it('exports badge functions', () => {
      expect(theme.badge.pass).toBeDefined();
      expect(theme.badge.fail).toBeDefined();
      expect(theme.badge.warn).toBeDefined();
    });

    it('exports ribbon functions', () => {
      const ribbonText = theme.ribbon('Test');
      expect(ribbonText).toBeDefined();
      expect(typeof ribbonText).toBe('string');
    });
  });

  describe('header()', () => {
    it('renders a section header', () => {
      const result = header('Test Section');
      expect(result).toContain('Test Section');
    });

    it('renders header with subtitle', () => {
      const result = header('Test', 'Subtitle');
      expect(result).toContain('Test');
      expect(result).toContain('Subtitle');
    });
  });

  describe('box()', () => {
    it('renders a box around content', () => {
      const result = box('Title', 'Content line');
      expect(result).toContain('Title');
      expect(result).toContain('Content line');
      // Box characters
      expect(result).toMatch(/[╭╮╰╯│]/);
    });

    it('handles multi-line content', () => {
      const result = box('Title', 'Line 1\nLine 2\nLine 3');
      expect(result).toContain('Line 1');
      expect(result).toContain('Line 2');
      expect(result).toContain('Line 3');
    });
  });

  describe('kv()', () => {
    it('formats key-value pair', () => {
      const result = kv('Status', 'Active');
      expect(result).toContain('Status');
      expect(result).toContain('Active');
    });
  });

  describe('li()', () => {
    it('formats a list item', () => {
      const result = li('List item text');
      expect(result).toContain('List item text');
      expect(result).toContain('•');
    });

    it('handles indentation', () => {
      const result = li('Indented item', 2);
      expect(result.startsWith('    ')).toBe(true);
    });
  });

  describe('step()', () => {
    it('formats pending step', () => {
      const result = step('pending', 'Waiting...');
      expect(result).toContain('Waiting...');
    });

    it('formats running step', () => {
      const result = step('running', 'Processing...');
      expect(result).toContain('Processing...');
    });

    it('formats success step', () => {
      const result = step('success', 'Complete!');
      expect(result).toContain('Complete!');
    });

    it('formats error step', () => {
      const result = step('error', 'Failed');
      expect(result).toContain('Failed');
    });
  });

  describe('progressBar()', () => {
    it('renders 0% progress', () => {
      const result = progressBar(0);
      expect(result).toContain('0%');
    });

    it('renders 50% progress', () => {
      const result = progressBar(50);
      expect(result).toContain('50%');
    });

    it('renders 100% progress', () => {
      const result = progressBar(100);
      expect(result).toContain('100%');
    });

    it('respects custom width', () => {
      const shortBar = progressBar(50, 20);
      const longBar = progressBar(50, 60);
      // Different widths should produce different lengths
      expect(shortBar.length).not.toBe(longBar.length);
    });
  });
});

describe('environment detection', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('isInteractive()', () => {
    it('returns false in CI environment', () => {
      process.env.CI = 'true';
      // Note: isInteractive also checks TTY, which is false in tests
      expect(isInteractive()).toBe(false);
    });

    it('returns false when UCV_NON_INTERACTIVE is set', () => {
      process.env.UCV_NON_INTERACTIVE = 'true';
      expect(isInteractive()).toBe(false);
    });
  });

  describe('shouldUseColor()', () => {
    it('returns false when NO_COLOR is set', () => {
      process.env.NO_COLOR = '1';
      expect(shouldUseColor()).toBe(false);
    });

    it('returns false when UCV_NO_COLOR is set', () => {
      process.env.UCV_NO_COLOR = '1';
      expect(shouldUseColor()).toBe(false);
    });
  });
});

describe('hyperlink utilities', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('supportsHyperlinks()', () => {
    it('returns false in CI', () => {
      process.env.CI = 'true';
      expect(supportsHyperlinks()).toBe(false);
    });

    it('returns false when UCV_NO_HYPERLINKS is set', () => {
      process.env.UCV_NO_HYPERLINKS = '1';
      expect(supportsHyperlinks()).toBe(false);
    });

    // Note: TTY detection cannot be easily mocked, so we test the env checks
  });

  describe('vscodeUrl()', () => {
    it('generates vscode URL for absolute path', () => {
      const url = vscodeUrl('/path/to/file.ts');
      expect(url).toBe('vscode://file/path/to/file.ts');
    });

    it('generates vscode URL with line number', () => {
      const url = vscodeUrl('/path/to/file.ts', 42);
      expect(url).toBe('vscode://file/path/to/file.ts:42');
    });

    it('generates vscode URL with line and column', () => {
      const url = vscodeUrl('/path/to/file.ts', 42, 10);
      expect(url).toBe('vscode://file/path/to/file.ts:42:10');
    });

    it('converts relative paths to absolute', () => {
      const url = vscodeUrl('relative/path.ts');
      expect(url).toContain('vscode://file');
      expect(url).toContain('relative/path.ts');
      // Should contain cwd
      expect(url).toContain(process.cwd());
    });

    it('ignores line 0', () => {
      const url = vscodeUrl('/path/to/file.ts', 0);
      expect(url).toBe('vscode://file/path/to/file.ts');
    });
  });

  describe('hyperlink()', () => {
    it('returns styled text when hyperlinks not supported', () => {
      process.env.CI = 'true';  // Disable hyperlinks
      const result = hyperlink('https://example.com', 'Click me');
      expect(result).toContain('Click me');
      // Should not contain OSC 8 escape codes in CI
      expect(result).not.toContain('\x1b]8;;');
    });
  });

  describe('fileLink()', () => {
    it('creates a file link', () => {
      const result = fileLink('path/to/file.ts');
      expect(result).toContain('path/to/file.ts');
    });

    it('creates a file link with line number', () => {
      const result = fileLink('path/to/file.ts', 42);
      expect(result).toContain('path/to/file.ts');
      // The line number is in the URL, not necessarily visible
    });
  });
});
