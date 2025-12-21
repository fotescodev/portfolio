#!/usr/bin/env tsx
/**
 * Variant Sync CLI
 *
 * Canonical source: content/variants/*.yaml
 * Runtime artifact:  content/variants/*.json
 *
 * Why this exists:
 * - The website loads variants as JSON via Vite import.meta.glob.
 * - Humans and agents should edit YAML (reviewable).
 * - JSON must be deterministic and kept in sync (no YAML/JSON drift).
 *
 * Usage:
 *   npm run variants:sync
 *   npm run variants:sync -- --slug mysten-walrus-senior-pm
 *   npm run variants:check
 *   npm run variants:sync -- --json
 */

import { existsSync, readFileSync, readdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import YAML from 'yaml';
import ora from 'ora';
import { VariantSchema } from '../src/lib/schemas.js';
import { theme, HEADER_COMPACT, kv, box } from './cli/theme.js';

type Args = {
  slug?: string;
  check: boolean;
  quiet: boolean;
  json: boolean;
};

type SyncResult = {
  slug: string;
  status: 'synced' | 'updated' | 'created' | 'error';
  message?: string;
};

function parseArgs(): Args {
  const argv = process.argv.slice(2);
  const out: Args = { check: false, quiet: false, json: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const n = argv[i + 1];
    if (a === '--slug') {
      out.slug = n;
      i++;
    } else if (a === '--check') {
      out.check = true;
    } else if (a === '--quiet') {
      out.quiet = true;
    } else if (a === '--json') {
      out.json = true;
    }
  }
  return out;
}

function stableJson(obj: unknown): string {
  return JSON.stringify(obj, null, 2) + '\n';
}

function listVariantYamlFiles(variantsDir: string): string[] {
  return readdirSync(variantsDir)
    .filter(f => f.endsWith('.yaml'))
    .filter(f => !f.startsWith('_'));
}

function syncOneVariant(variantsDir: string, yamlFile: string, checkOnly: boolean): SyncResult {
  const slugFromFile = yamlFile.replace(/\.yaml$/, '');
  const yamlPath = join(variantsDir, yamlFile);
  const jsonPath = join(variantsDir, `${slugFromFile}.json`);

  try {
    const raw = readFileSync(yamlPath, 'utf-8');
    const parsed = YAML.parse(raw);
    const validated = VariantSchema.parse(parsed);

    if (validated.metadata.slug !== slugFromFile) {
      return {
        slug: slugFromFile,
        status: 'error',
        message: `Slug mismatch: metadata.slug='${validated.metadata.slug}' but filename implies '${slugFromFile}'`
      };
    }

    const nextJson = stableJson(validated);
    const hadJson = existsSync(jsonPath);
    const prevJson = hadJson ? readFileSync(jsonPath, 'utf-8') : '';

    if (!hadJson) {
      if (checkOnly) {
        return {
          slug: slugFromFile,
          status: 'error',
          message: `Missing JSON artifact. Run: npm run variants:sync`
        };
      }
      writeFileSync(jsonPath, nextJson, 'utf-8');
      return { slug: slugFromFile, status: 'created' };
    }

    if (prevJson !== nextJson) {
      if (checkOnly) {
        return {
          slug: slugFromFile,
          status: 'error',
          message: `Drift detected. Run: npm run variants:sync`
        };
      }
      writeFileSync(jsonPath, nextJson, 'utf-8');
      return { slug: slugFromFile, status: 'updated' };
    }

    return { slug: slugFromFile, status: 'synced' };
  } catch (err) {
    return {
      slug: slugFromFile,
      status: 'error',
      message: err instanceof Error ? err.message : String(err)
    };
  }
}

async function main() {
  const args = parseArgs();
  const variantsDir = join(process.cwd(), 'content', 'variants');

  // JSON output mode - minimal, machine-readable
  if (args.json) {
    if (!existsSync(variantsDir)) {
      console.log(JSON.stringify({ variants: [], errors: [] }));
      process.exit(0);
    }

    const allYaml = listVariantYamlFiles(variantsDir);
    const targets = args.slug ? allYaml.filter(f => f === `${args.slug}.yaml`) : allYaml;
    const results = targets.map(f => syncOneVariant(variantsDir, f, args.check));

    const output = {
      mode: args.check ? 'check' : 'sync',
      variants: results.filter(r => r.status !== 'error'),
      errors: results.filter(r => r.status === 'error')
    };

    console.log(JSON.stringify(output, null, 2));
    process.exit(output.errors.length > 0 ? 1 : 0);
  }

  // Interactive output
  if (!args.quiet) {
    console.log(HEADER_COMPACT);
    console.log();
  }

  if (!existsSync(variantsDir)) {
    if (!args.quiet) {
      console.log(theme.muted('No variants directory found. Nothing to do.'));
    }
    process.exit(0);
  }

  const allYaml = listVariantYamlFiles(variantsDir);
  const targets = args.slug ? allYaml.filter(f => f === `${args.slug}.yaml`) : allYaml;

  if (args.slug && targets.length === 0) {
    console.error(`${theme.icons.error} Variant YAML not found: ${theme.bold(args.slug)}`);
    console.error(theme.muted(`  Expected: content/variants/${args.slug}.yaml`));
    process.exit(1);
  }

  const spinner = ora({
    text: args.check ? 'Checking variants...' : 'Syncing variants...',
    color: 'yellow'
  }).start();

  const results: SyncResult[] = [];

  for (const yamlFile of targets) {
    const result = syncOneVariant(variantsDir, yamlFile, args.check);
    results.push(result);
  }

  spinner.stop();

  // Display results
  const updated = results.filter(r => r.status === 'updated' || r.status === 'created');
  const synced = results.filter(r => r.status === 'synced');
  const errors = results.filter(r => r.status === 'error');

  if (!args.quiet) {
    console.log(theme.bold(args.check ? 'Checking variants' : 'Syncing variants'));
    console.log(theme.muted(variantsDir));
    console.log();

    for (const r of results) {
      if (r.status === 'error') {
        console.log(`${theme.icons.error} ${r.slug} ${theme.error('error')}`);
        if (r.message) console.log(theme.muted(`  ${r.message}`));
      } else if (r.status === 'created') {
        console.log(`${theme.icons.success} ${r.slug} ${theme.success('(created)')}`);
      } else if (r.status === 'updated') {
        console.log(`${theme.icons.success} ${r.slug} ${theme.warning('(updated)')}`);
      } else {
        console.log(`${theme.icons.success} ${r.slug} ${theme.muted('(in sync)')}`);
      }
    }

    console.log();
    console.log(theme.muted('Summary:'), `${results.length} variant(s), ${updated.length} updated, ${errors.length} errors`);
  }

  if (errors.length > 0) {
    process.exit(1);
  }

  process.exit(0);
}

main().catch((err) => {
  console.error(`${theme.icons.error} ${theme.error('Fatal:')} ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
});
