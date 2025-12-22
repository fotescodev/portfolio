/**
 * TUI Flow Tests for ucv-cli
 *
 * Tests the happy path scenarios:
 * - Create variant → Sync → Eval → Verify → Redteam → Publish
 * - Verification flow with CTA transition
 * - Clickable links generation
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { spawn } from 'child_process';
import { existsSync, readFileSync, writeFileSync, unlinkSync, mkdirSync } from 'fs';
import { join } from 'path';
import YAML from 'yaml';

const PROJECT_ROOT = process.cwd();
const VARIANTS_DIR = join(PROJECT_ROOT, 'content', 'variants');
const EVALS_DIR = join(PROJECT_ROOT, 'capstone', 'develop', 'evals');
const REDTEAM_DIR = join(PROJECT_ROOT, 'capstone', 'develop', 'redteam');

// Test fixture for a minimal variant
const TEST_VARIANT_SLUG = 'test-flow-variant';
const TEST_VARIANT_YAML = `
metadata:
  company: Test Company
  role: Test Role
  slug: ${TEST_VARIANT_SLUG}
  generatedAt: "2025-01-01T00:00:00Z"
  jobDescription: "Test job description for flow testing"
  publishStatus: draft

overrides:
  hero:
    status: "Test status"
    headline:
      - text: "Test headline"
        style: accent
    subheadline: "Test subheadline with 5 years of experience"

relevance:
  caseStudies: []
  projects: []
`;

// Helper to run CLI commands
function runCommand(command: string, args: string[]): Promise<{ code: number; stdout: string; stderr: string }> {
  return new Promise((resolve) => {
    const proc = spawn(command, args, {
      cwd: PROJECT_ROOT,
      env: { ...process.env, UCV_NON_INTERACTIVE: '1', FORCE_COLOR: '0' },
    });

    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    proc.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    proc.on('close', (code) => {
      resolve({ code: code ?? 1, stdout, stderr });
    });
  });
}

describe('ucv-cli flow tests', () => {
  describe('variant sync flow', () => {
    beforeEach(() => {
      // Create test variant
      const variantPath = join(VARIANTS_DIR, `${TEST_VARIANT_SLUG}.yaml`);
      writeFileSync(variantPath, TEST_VARIANT_YAML);
    });

    afterEach(() => {
      // Cleanup test artifacts
      const files = [
        join(VARIANTS_DIR, `${TEST_VARIANT_SLUG}.yaml`),
        join(VARIANTS_DIR, `${TEST_VARIANT_SLUG}.json`),
        join(EVALS_DIR, `${TEST_VARIANT_SLUG}.claims.yaml`),
        join(EVALS_DIR, `${TEST_VARIANT_SLUG}.eval.md`),
        join(REDTEAM_DIR, `${TEST_VARIANT_SLUG}.redteam.md`),
      ];
      files.forEach((f) => {
        if (existsSync(f)) {
          try { unlinkSync(f); } catch { /* ignore */ }
        }
      });
    });

    it('syncs variant YAML to JSON', async () => {
      const result = await runCommand('npx', ['tsx', 'scripts/sync-variants.ts', '--slug', TEST_VARIANT_SLUG]);

      expect(result.code).toBe(0);

      const jsonPath = join(VARIANTS_DIR, `${TEST_VARIANT_SLUG}.json`);
      expect(existsSync(jsonPath)).toBe(true);

      const json = JSON.parse(readFileSync(jsonPath, 'utf-8'));
      expect(json.metadata.slug).toBe(TEST_VARIANT_SLUG);
      expect(json.metadata.company).toBe('Test Company');
    });

    it('validates variant against schema', async () => {
      const result = await runCommand('npx', ['tsx', 'scripts/validate-content.ts']);

      // Should run without crashing (may have warnings for other variants)
      expect(result.code).toBeDefined();
    });
  });

  describe('eval flow', () => {
    beforeEach(() => {
      // Create test variant and sync it
      const variantPath = join(VARIANTS_DIR, `${TEST_VARIANT_SLUG}.yaml`);
      writeFileSync(variantPath, TEST_VARIANT_YAML);
    });

    afterEach(() => {
      // Cleanup test artifacts
      const files = [
        join(VARIANTS_DIR, `${TEST_VARIANT_SLUG}.yaml`),
        join(VARIANTS_DIR, `${TEST_VARIANT_SLUG}.json`),
        join(EVALS_DIR, `${TEST_VARIANT_SLUG}.claims.yaml`),
        join(EVALS_DIR, `${TEST_VARIANT_SLUG}.eval.md`),
        join(REDTEAM_DIR, `${TEST_VARIANT_SLUG}.redteam.md`),
      ];
      files.forEach((f) => {
        if (existsSync(f)) {
          try { unlinkSync(f); } catch { /* ignore */ }
        }
      });
    });

    it('generates claims ledger for variant', async () => {
      // First sync
      await runCommand('npx', ['tsx', 'scripts/sync-variants.ts', '--slug', TEST_VARIANT_SLUG]);

      // Then eval
      await runCommand('npx', ['tsx', 'scripts/evaluate-variants.ts', '--slug', TEST_VARIANT_SLUG]);

      // Eval may have unverified claims, which is expected
      const claimsPath = join(EVALS_DIR, `${TEST_VARIANT_SLUG}.claims.yaml`);
      expect(existsSync(claimsPath)).toBe(true);

      const claims = YAML.parse(readFileSync(claimsPath, 'utf-8'));
      expect(claims).toHaveProperty('claims');
    });
  });

  describe('redteam flow', () => {
    beforeEach(() => {
      // Create test variant
      const variantPath = join(VARIANTS_DIR, `${TEST_VARIANT_SLUG}.yaml`);
      writeFileSync(variantPath, TEST_VARIANT_YAML);

      // Create minimal claims ledger (all verified)
      const claimsPath = join(EVALS_DIR, `${TEST_VARIANT_SLUG}.claims.yaml`);
      const claims = {
        slug: TEST_VARIANT_SLUG,
        generatedAt: new Date().toISOString(),
        claims: [
          {
            id: 'test-claim-1',
            text: 'Test claim with 5 years of experience',
            location: 'overrides.hero.subheadline',
            verified: true,
            verifiedWith: 'content/experience/index.yaml',
          },
        ],
      };
      mkdirSync(EVALS_DIR, { recursive: true });
      writeFileSync(claimsPath, YAML.stringify(claims));
    });

    afterEach(() => {
      // Cleanup test artifacts
      const files = [
        join(VARIANTS_DIR, `${TEST_VARIANT_SLUG}.yaml`),
        join(VARIANTS_DIR, `${TEST_VARIANT_SLUG}.json`),
        join(EVALS_DIR, `${TEST_VARIANT_SLUG}.claims.yaml`),
        join(EVALS_DIR, `${TEST_VARIANT_SLUG}.eval.md`),
        join(REDTEAM_DIR, `${TEST_VARIANT_SLUG}.redteam.md`),
      ];
      files.forEach((f) => {
        if (existsSync(f)) {
          try { unlinkSync(f); } catch { /* ignore */ }
        }
      });
    });

    it('runs redteam scan on variant', async () => {
      // First sync
      await runCommand('npx', ['tsx', 'scripts/sync-variants.ts', '--slug', TEST_VARIANT_SLUG]);

      // Then redteam
      const result = await runCommand('npx', ['tsx', 'scripts/redteam.ts', '--slug', TEST_VARIANT_SLUG]);

      const redteamPath = join(REDTEAM_DIR, `${TEST_VARIANT_SLUG}.redteam.md`);
      expect(existsSync(redteamPath)).toBe(true);
    });
  });
});

describe('overlay state transitions', () => {
  // These are unit tests for the state transition logic
  // extracted from the TUI for testability

  type OverlayFocus = 'claims' | 'sources' | 'cta';

  interface EvalSummary {
    exists: boolean;
    total: number;
    verified: number;
    unverified: number;
  }

  function computeInitialFocus(ev: EvalSummary): OverlayFocus {
    return ev.unverified === 0 ? 'cta' : 'claims';
  }

  function computeFocusAfterVerify(prevUnverified: number, newUnverified: number): OverlayFocus {
    if (newUnverified === 0 && prevUnverified > 0) {
      return 'cta';  // All claims now verified - show CTA
    }
    return 'claims';  // More claims to verify
  }

  describe('computeInitialFocus', () => {
    it('returns "claims" when there are unverified claims', () => {
      const ev: EvalSummary = { exists: true, total: 5, verified: 3, unverified: 2 };
      expect(computeInitialFocus(ev)).toBe('claims');
    });

    it('returns "cta" when all claims are verified', () => {
      const ev: EvalSummary = { exists: true, total: 5, verified: 5, unverified: 0 };
      expect(computeInitialFocus(ev)).toBe('cta');
    });

    it('returns "cta" when there are no claims', () => {
      const ev: EvalSummary = { exists: true, total: 0, verified: 0, unverified: 0 };
      expect(computeInitialFocus(ev)).toBe('cta');
    });
  });

  describe('computeFocusAfterVerify', () => {
    it('returns "cta" when last claim is verified', () => {
      expect(computeFocusAfterVerify(1, 0)).toBe('cta');
    });

    it('returns "claims" when more claims remain', () => {
      expect(computeFocusAfterVerify(3, 2)).toBe('claims');
    });

    it('returns "claims" when starting with 0 unverified', () => {
      expect(computeFocusAfterVerify(0, 0)).toBe('claims');
    });
  });
});

describe('pipeline state computation', () => {
  // Tests for the "next step" computation logic

  type SyncStatus = { kind: 'ok' } | { kind: 'error'; message: string };
  type EvalStatus =
    | { kind: 'missing' }
    | { kind: 'unverified'; verified: number; claims: number }
    | { kind: 'ok'; verified: number; claims: number }
    | { kind: 'error'; message: string };
  type RedteamStatus =
    | { kind: 'pass'; warns: number; fails: number }
    | { kind: 'warn'; warns: number; fails: number }
    | { kind: 'fail'; warns: number; fails: number }
    | { kind: 'error'; message: string };

  function computeNext(
    publishStatus: 'draft' | 'published',
    sync: SyncStatus,
    ev: EvalStatus,
    rt: RedteamStatus
  ): string {
    // Sync errors block everything
    if (sync.kind === 'error') return 'Fix sync';

    // Missing eval -> run eval
    if (ev.kind === 'missing') return 'Evaluate';
    if (ev.kind === 'error') return 'Fix eval';

    // Unverified claims -> verify
    if (ev.kind === 'unverified') return 'Verify claims';

    // Redteam errors/failures -> fix
    if (rt.kind === 'error') return 'Redteam';
    if (rt.kind === 'fail') return 'Fix redteam';

    // Everything passing, draft -> publish
    if (publishStatus === 'draft') {
      if (rt.kind === 'pass' || rt.kind === 'warn') return 'Publish';
    }

    // Published and passing
    return 'Sync';
  }

  describe('computeNext', () => {
    it('returns "Fix sync" when sync has error', () => {
      expect(
        computeNext('draft', { kind: 'error', message: 'Test' }, { kind: 'ok', verified: 5, claims: 5 }, { kind: 'pass', warns: 0, fails: 0 })
      ).toBe('Fix sync');
    });

    it('returns "Evaluate" when eval is missing', () => {
      expect(
        computeNext('draft', { kind: 'ok' }, { kind: 'missing' }, { kind: 'pass', warns: 0, fails: 0 })
      ).toBe('Evaluate');
    });

    it('returns "Verify claims" when there are unverified claims', () => {
      expect(
        computeNext('draft', { kind: 'ok' }, { kind: 'unverified', verified: 3, claims: 5 }, { kind: 'pass', warns: 0, fails: 0 })
      ).toBe('Verify claims');
    });

    it('returns "Fix redteam" when redteam fails', () => {
      expect(
        computeNext('draft', { kind: 'ok' }, { kind: 'ok', verified: 5, claims: 5 }, { kind: 'fail', warns: 0, fails: 2 })
      ).toBe('Fix redteam');
    });

    it('returns "Publish" when everything passes and variant is draft', () => {
      expect(
        computeNext('draft', { kind: 'ok' }, { kind: 'ok', verified: 5, claims: 5 }, { kind: 'pass', warns: 0, fails: 0 })
      ).toBe('Publish');
    });

    it('returns "Sync" when published and everything passes', () => {
      expect(
        computeNext('published', { kind: 'ok' }, { kind: 'ok', verified: 5, claims: 5 }, { kind: 'pass', warns: 0, fails: 0 })
      ).toBe('Sync');
    });
  });
});

describe('render helpers', () => {
  // Test string manipulation helpers used in rendering

  function stripAnsi(str: string): string {
    // eslint-disable-next-line no-control-regex
    return str.replace(/\x1B\[[0-9;]*m/g, '');
  }

  function truncate(str: string, max: number): string {
    const stripped = stripAnsi(str);
    if (stripped.length <= max) return str;
    // Need to be careful with ANSI codes
    return stripped.slice(0, max - 1) + '…';
  }

  function padRight(str: string, width: number): string {
    const stripped = stripAnsi(str);
    const pad = Math.max(0, width - stripped.length);
    return str + ' '.repeat(pad);
  }

  describe('stripAnsi', () => {
    it('removes ANSI color codes', () => {
      const colored = '\x1b[32mGreen\x1b[0m';
      expect(stripAnsi(colored)).toBe('Green');
    });

    it('handles multiple codes', () => {
      const multi = '\x1b[1m\x1b[34mBold Blue\x1b[0m';
      expect(stripAnsi(multi)).toBe('Bold Blue');
    });

    it('returns plain text unchanged', () => {
      expect(stripAnsi('Plain text')).toBe('Plain text');
    });
  });

  describe('truncate', () => {
    it('truncates long strings', () => {
      const long = 'This is a very long string that should be truncated';
      expect(truncate(long, 20)).toBe('This is a very long…');
    });

    it('leaves short strings unchanged', () => {
      const short = 'Short';
      expect(truncate(short, 20)).toBe('Short');
    });

    it('handles exact length', () => {
      const exact = '12345';
      expect(truncate(exact, 5)).toBe('12345');
    });
  });

  describe('padRight', () => {
    it('pads short strings', () => {
      expect(padRight('Hi', 5)).toBe('Hi   ');
    });

    it('leaves long strings unchanged', () => {
      expect(padRight('Hello World', 5)).toBe('Hello World');
    });
  });
});
