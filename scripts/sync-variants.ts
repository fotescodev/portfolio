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
 */

import { existsSync, readFileSync, readdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import YAML from 'yaml';
import { VariantSchema } from '../src/lib/schemas.js';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  gray: '\x1b[90m',
  bold: '\x1b[1m'
};

type Args = {
  slug?: string;
  check: boolean;
  quiet: boolean;
};

function parseArgs(): Args {
  const argv = process.argv.slice(2);
  const out: Args = { check: false, quiet: false };
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
    }
  }
  return out;
}

function stableJson(obj: unknown): string {
  // Ensure consistent output across runs.
  return JSON.stringify(obj, null, 2) + '\n';
}

function listVariantYamlFiles(variantsDir: string): string[] {
  return readdirSync(variantsDir)
    .filter(f => f.endsWith('.yaml'))
    .filter(f => !f.startsWith('_'));
}

function syncOneVariant(variantsDir: string, yamlFile: string, checkOnly: boolean): { slug: string; changed: boolean } {
  const slugFromFile = yamlFile.replace(/\.yaml$/, '');
  const yamlPath = join(variantsDir, yamlFile);
  const jsonPath = join(variantsDir, `${slugFromFile}.json`);

  const raw = readFileSync(yamlPath, 'utf-8');
  const parsed = YAML.parse(raw);
  const validated = VariantSchema.parse(parsed);

  if (validated.metadata.slug !== slugFromFile) {
    throw new Error(
      `Slug mismatch in ${yamlFile}: metadata.slug='${validated.metadata.slug}' but filename implies '${slugFromFile}'. Fix the YAML.`
    );
  }

  const nextJson = stableJson(validated);
  const hadJson = existsSync(jsonPath);
  const prevJson = hadJson ? readFileSync(jsonPath, 'utf-8') : '';

  if (!hadJson) {
    if (checkOnly) {
      throw new Error(`Missing JSON artifact: ${jsonPath}. Run: npm run variants:sync`);
    }
    writeFileSync(jsonPath, nextJson, 'utf-8');
    return { slug: slugFromFile, changed: true };
  }

  if (prevJson !== nextJson) {
    if (checkOnly) {
      throw new Error(`Variant drift detected for '${slugFromFile}'. Run: npm run variants:sync`);
    }
    writeFileSync(jsonPath, nextJson, 'utf-8');
    return { slug: slugFromFile, changed: true };
  }

  return { slug: slugFromFile, changed: false };
}

async function main() {
  const args = parseArgs();
  const variantsDir = join(process.cwd(), 'content', 'variants');

  if (!existsSync(variantsDir)) {
    console.log(`${colors.gray}No variants directory found. Nothing to do.${colors.reset}`);
    process.exit(0);
  }

  const allYaml = listVariantYamlFiles(variantsDir);
  const targets = args.slug ? allYaml.filter(f => f === `${args.slug}.yaml`) : allYaml;

  if (args.slug && targets.length === 0) {
    console.error(`${colors.red}Error:${colors.reset} Variant YAML not found for slug '${args.slug}'. Expected file: content/variants/${args.slug}.yaml`);
    process.exit(1);
  }

  if (!args.quiet) {
    console.log(`${colors.bold}${colors.blue}${args.check ? 'Checking' : 'Syncing'} variants${colors.reset}`);
    console.log(`${colors.gray}${variantsDir}${colors.reset}\n`);
  }

  let changedCount = 0;
  for (const yamlFile of targets) {
    const { slug, changed } = syncOneVariant(variantsDir, yamlFile, args.check);
    if (!args.quiet) {
      if (changed) {
        console.log(`${colors.green}✓${colors.reset} ${slug} ${args.check ? '(drift detected)' : '(updated JSON)'}`);
      } else {
        console.log(`${colors.green}✓${colors.reset} ${slug} (in sync)`);
      }
    }
    if (changed) changedCount++;
  }

  if (!args.quiet) {
    console.log(`\n${colors.gray}Summary:${colors.reset} ${targets.length} variant(s), ${changedCount} updated`);
  }

  process.exit(0);
}

main().catch((err) => {
  console.error(`${colors.red}${colors.bold}Fatal:${colors.reset} ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
});
