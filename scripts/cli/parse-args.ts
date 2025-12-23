/**
 * Shared CLI argument parsing utilities
 *
 * Provides type-safe argument parsing for variant CLI tools.
 * Replaces the repeated `a` and `n` pattern across multiple scripts.
 */

export interface BaseArgs {
  slug?: string;
  all?: boolean;
  check?: boolean;
  noWrite?: boolean;
  quiet?: boolean;
  json?: boolean;
  strict?: boolean;
}

export interface VerifyArg {
  id: string;
  sourcePath: string;
}

export interface EvalArgs extends BaseArgs {
  verify: VerifyArg[];
}

/**
 * Parse a --verify argument value like "claim-id=path/to/source.yaml"
 */
function parseVerifyValue(value: string): VerifyArg {
  const [id, sourcePath] = value.split('=');
  if (!id || !sourcePath) {
    throw new Error(`Invalid --verify value '${value}'. Expected: <claimId>=<sourcePath>`);
  }
  return { id, sourcePath };
}

/**
 * Generic argument parser for CLI scripts
 *
 * @param argv - Command line arguments (typically process.argv.slice(2))
 * @param options - Parser configuration
 * @returns Parsed arguments object
 *
 * @example
 * const args = parseArgs(process.argv.slice(2), {
 *   flags: ['all', 'check', 'json'],
 *   values: ['slug'],
 *   defaults: { all: false, check: false }
 * });
 */
export function parseArgs<T extends BaseArgs>(
  argv: string[],
  options: {
    flags?: (keyof T)[];
    values?: (keyof T)[];
    arrays?: (keyof T)[];
    defaults: T;
  }
): T {
  const result = { ...options.defaults };
  const flags = new Set(options.flags ?? []);
  const values = new Set(options.values ?? []);
  const arrays = new Set(options.arrays ?? []);

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    const nextValue = argv[i + 1];

    // Convert --some-flag to someFlag for matching
    const argName = arg.replace(/^--/, '').replace(/-([a-z])/g, (_, c) => c.toUpperCase());

    if (flags.has(argName as keyof T)) {
      (result as Record<string, unknown>)[argName] = true;
    } else if (values.has(argName as keyof T)) {
      (result as Record<string, unknown>)[argName] = nextValue;
      i++;
    } else if (arrays.has(argName as keyof T)) {
      const existing = (result as Record<string, unknown[]>)[argName] ?? [];
      if (argName === 'verify') {
        existing.push(parseVerifyValue(nextValue ?? ''));
      } else {
        existing.push(nextValue);
      }
      (result as Record<string, unknown>)[argName] = existing;
      i++;
    }
  }

  return result;
}

/**
 * Parse arguments for redteam.ts
 */
export function parseRedteamArgs(argv: string[]): BaseArgs & { all: boolean; check: boolean; strict: boolean; noWrite: boolean; quiet: boolean; json: boolean } {
  const args = parseArgs(argv, {
    flags: ['all', 'check', 'strict', 'noWrite', 'quiet', 'json'],
    values: ['slug'],
    defaults: {
      all: false,
      check: false,
      strict: false,
      noWrite: false,
      quiet: false,
      json: false
    }
  });

  // Default: redteam:check checks all variants
  if (args.check && !args.slug) args.all = true;

  if (!args.slug && !args.all) {
    throw new Error('Provide --slug <slug> or --all');
  }
  if (args.slug && args.all) {
    throw new Error('Choose either --slug or --all, not both.');
  }

  return args as BaseArgs & { all: boolean; check: boolean; strict: boolean; noWrite: boolean; quiet: boolean; json: boolean };
}

/**
 * Parse arguments for evaluate-variants.ts
 */
export function parseEvalArgs(argv: string[]): EvalArgs & { all: boolean; check: boolean; noWrite: boolean; json: boolean } {
  const args = parseArgs<EvalArgs>(argv, {
    flags: ['all', 'check', 'noWrite', 'json'],
    values: ['slug'],
    arrays: ['verify'],
    defaults: {
      all: false,
      check: false,
      noWrite: false,
      json: false,
      verify: []
    }
  });

  // Default: eval:check checks all variants
  if (args.check && !args.slug) args.all = true;

  if (!args.slug && !args.all) {
    throw new Error('Provide --slug <slug> or --all');
  }
  if (args.slug && args.all) {
    throw new Error('Choose either --slug or --all, not both.');
  }

  return args as EvalArgs & { all: boolean; check: boolean; noWrite: boolean; json: boolean };
}

/**
 * Parse arguments for sync-variants.ts
 */
export function parseSyncArgs(argv: string[]): BaseArgs & { check: boolean; quiet: boolean; json: boolean } {
  return parseArgs(argv, {
    flags: ['check', 'quiet', 'json'],
    values: ['slug'],
    defaults: {
      check: false,
      quiet: false,
      json: false
    }
  }) as BaseArgs & { check: boolean; quiet: boolean; json: boolean };
}
