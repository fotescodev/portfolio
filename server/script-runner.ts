/**
 * Script Runner - Execute CLI scripts and capture output
 *
 * Used by the CRM API to run portfolio scripts (generate-cv, analyze-jd, etc.)
 * via child_process and return structured JSON results.
 */

import { spawn } from 'child_process';
import { resolve } from 'path';
import { readFileSync, existsSync } from 'fs';

/**
 * Load environment variables from .env.local
 */
function loadEnvLocal(): Record<string, string> {
  const envPath = resolve(import.meta.dirname, '..', '.env.local');
  const env: Record<string, string> = {};

  if (existsSync(envPath)) {
    const content = readFileSync(envPath, 'utf-8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          env[key] = valueParts.join('=');
        }
      }
    }
  }

  return env;
}

const ENV_LOCAL = loadEnvLocal();

export interface ScriptResult {
  success: boolean;
  stdout: string;
  stderr: string;
  exitCode: number;
  duration: number;
}

export interface ScriptOptions {
  /** Timeout in milliseconds (default: 120000 = 2 minutes) */
  timeout?: number;
  /** Working directory (default: project root) */
  cwd?: string;
  /** Additional environment variables */
  env?: Record<string, string>;
}

const DEFAULT_TIMEOUT = 120000; // 2 minutes
const PROJECT_ROOT = resolve(import.meta.dirname, '..');

/**
 * Run a script from the scripts/ directory
 *
 * @param scriptName - Name of the script file (e.g., 'analyze-jd.ts')
 * @param args - Command line arguments to pass
 * @param options - Execution options
 */
export async function runScript(
  scriptName: string,
  args: string[] = [],
  options: ScriptOptions = {}
): Promise<ScriptResult> {
  const {
    timeout = DEFAULT_TIMEOUT,
    cwd = PROJECT_ROOT,
    env = {}
  } = options;

  const startTime = Date.now();
  const scriptPath = resolve(PROJECT_ROOT, 'scripts', scriptName);

  return new Promise((resolve) => {
    let stdout = '';
    let stderr = '';
    let killed = false;

    const child = spawn('npx', ['tsx', scriptPath, ...args], {
      cwd,
      env: { ...process.env, ...ENV_LOCAL, ...env },
      stdio: ['pipe', 'pipe', 'pipe']
    });

    // Set timeout
    const timeoutId = setTimeout(() => {
      killed = true;
      child.kill('SIGTERM');
    }, timeout);

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (code) => {
      clearTimeout(timeoutId);
      const duration = Date.now() - startTime;

      if (killed) {
        resolve({
          success: false,
          stdout,
          stderr: stderr + '\n[Script timed out]',
          exitCode: -1,
          duration
        });
      } else {
        resolve({
          success: code === 0,
          stdout,
          stderr,
          exitCode: code ?? -1,
          duration
        });
      }
    });

    child.on('error', (error) => {
      clearTimeout(timeoutId);
      const duration = Date.now() - startTime;
      resolve({
        success: false,
        stdout,
        stderr: stderr + '\n' + error.message,
        exitCode: -1,
        duration
      });
    });
  });
}

/**
 * Run an npm script
 *
 * @param scriptName - npm script name (e.g., 'variants:sync')
 * @param args - Additional arguments
 * @param options - Execution options
 */
export async function runNpmScript(
  scriptName: string,
  args: string[] = [],
  options: ScriptOptions = {}
): Promise<ScriptResult> {
  const {
    timeout = DEFAULT_TIMEOUT,
    cwd = PROJECT_ROOT,
    env = {}
  } = options;

  const startTime = Date.now();

  return new Promise((resolve) => {
    let stdout = '';
    let stderr = '';
    let killed = false;

    const child = spawn('npm', ['run', scriptName, '--', ...args], {
      cwd,
      env: { ...process.env, ...ENV_LOCAL, ...env },
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: true
    });

    const timeoutId = setTimeout(() => {
      killed = true;
      child.kill('SIGTERM');
    }, timeout);

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (code) => {
      clearTimeout(timeoutId);
      const duration = Date.now() - startTime;

      if (killed) {
        resolve({
          success: false,
          stdout,
          stderr: stderr + '\n[Script timed out]',
          exitCode: -1,
          duration
        });
      } else {
        resolve({
          success: code === 0,
          stdout,
          stderr,
          exitCode: code ?? -1,
          duration
        });
      }
    });

    child.on('error', (error) => {
      clearTimeout(timeoutId);
      const duration = Date.now() - startTime;
      resolve({
        success: false,
        stdout,
        stderr: stderr + '\n' + error.message,
        exitCode: -1,
        duration
      });
    });
  });
}

/**
 * Parse JSON output from script stdout
 * Scripts that use --json flag output structured data
 */
export function parseJsonOutput<T>(result: ScriptResult): T | null {
  if (!result.success) return null;

  try {
    // Try to find JSON in stdout (some scripts output other text before JSON)
    const jsonMatch = result.stdout.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as T;
    }
    return null;
  } catch {
    return null;
  }
}
