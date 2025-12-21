import { useState, useEffect } from 'react';
import { existsSync, readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import YAML from 'yaml';

export interface VariantStatus {
  slug: string;
  exists: boolean;
  synced: boolean;
  evalStatus: {
    total: number;
    verified: number;
    hasLedger: boolean;
  };
  redteamStatus: {
    pass: boolean;
    fails: number;
    warns: number;
    hasReport: boolean;
  };
  overallStatus: 'ready' | 'review' | 'blocked' | 'pending';
}

export function useVariants() {
  const [variants, setVariants] = useState<VariantStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const variantsDir = join(process.cwd(), 'content', 'variants');
      const evalsDir = join(process.cwd(), 'capstone', 'develop', 'evals');
      const redteamDir = join(process.cwd(), 'capstone', 'develop', 'redteam');

      if (!existsSync(variantsDir)) {
        setVariants([]);
        setLoading(false);
        return;
      }

      const yamlFiles = readdirSync(variantsDir)
        .filter(f => f.endsWith('.yaml') && !f.startsWith('_'));

      const statuses: VariantStatus[] = yamlFiles.map(file => {
        const slug = file.replace(/\.yaml$/, '');
        const yamlPath = join(variantsDir, file);
        const jsonPath = join(variantsDir, `${slug}.json`);
        const claimsPath = join(evalsDir, `${slug}.claims.yaml`);
        const redteamPath = join(redteamDir, `${slug}.redteam.md`);

        // Check if synced
        const synced = existsSync(jsonPath);

        // Check eval status
        let evalStatus = { total: 0, verified: 0, hasLedger: false };
        if (existsSync(claimsPath)) {
          try {
            const ledger = YAML.parse(readFileSync(claimsPath, 'utf-8'));
            const claims = ledger?.claims || [];
            evalStatus = {
              total: claims.length,
              verified: claims.filter((c: any) => c.verified?.status === 'verified').length,
              hasLedger: true,
            };
          } catch {
            // Ignore parse errors
          }
        }

        // Check redteam status
        let redteamStatus = { pass: false, fails: 0, warns: 0, hasReport: false };
        if (existsSync(redteamPath)) {
          try {
            const report = readFileSync(redteamPath, 'utf-8');
            // Parse summary from markdown
            const failMatch = report.match(/FAIL:\s*\*\*(\d+)\*\*/);
            const warnMatch = report.match(/WARN:\s*\*\*(\d+)\*\*/);
            redteamStatus = {
              fails: failMatch ? parseInt(failMatch[1], 10) : 0,
              warns: warnMatch ? parseInt(warnMatch[1], 10) : 0,
              pass: (!failMatch || failMatch[1] === '0'),
              hasReport: true,
            };
          } catch {
            // Ignore parse errors
          }
        }

        // Determine overall status
        let overallStatus: VariantStatus['overallStatus'] = 'pending';
        if (!synced) {
          overallStatus = 'pending';
        } else if (!evalStatus.hasLedger) {
          overallStatus = 'pending';
        } else if (evalStatus.verified < evalStatus.total) {
          overallStatus = 'blocked';
        } else if (!redteamStatus.hasReport) {
          overallStatus = 'pending';
        } else if (redteamStatus.fails > 0) {
          overallStatus = 'blocked';
        } else if (redteamStatus.warns > 0) {
          overallStatus = 'review';
        } else {
          overallStatus = 'ready';
        }

        return {
          slug,
          exists: true,
          synced,
          evalStatus,
          redteamStatus,
          overallStatus,
        };
      });

      setVariants(statuses);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setLoading(false);
    }
  }, []);

  const refresh = () => {
    setLoading(true);
    // Re-trigger the effect by updating a dependency
    // For now, just reload
    setVariants([]);
    setTimeout(() => {
      setLoading(false);
    }, 100);
  };

  return { variants, loading, error, refresh };
}
