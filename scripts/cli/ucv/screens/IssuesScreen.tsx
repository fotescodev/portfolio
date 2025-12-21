import React from 'react';
import { Box, Text, useInput } from 'ink';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import YAML from 'yaml';
import { colors, icons } from '../lib/colors.js';

interface IssuesScreenProps {
  slug: string;
  onBack: () => void;
}

interface RedTeamFinding {
  id: string;
  title: string;
  severity: 'PASS' | 'WARN' | 'FAIL';
  details?: string[];
}

interface Claim {
  id: string;
  text: string;
  location: string;
  verified: {
    status: 'verified' | 'unverified';
    notes?: string;
  };
}

function loadRedTeamIssues(slug: string): RedTeamFinding[] {
  const reportPath = join(process.cwd(), 'capstone', 'develop', 'redteam', `${slug}.redteam.md`);

  if (!existsSync(reportPath)) {
    return [];
  }

  try {
    const content = readFileSync(reportPath, 'utf-8');
    const findings: RedTeamFinding[] = [];

    // Parse the table rows for WARN and FAIL
    // Format: | `RT-XXX` | ⚠️ WARN | Check title |
    const tableRowRegex = /\|\s*`(RT-[^`]+)`\s*\|\s*(?:⚠️|❌)\s*(WARN|FAIL)\s*\|\s*([^|]+)\|/g;
    let match;

    while ((match = tableRowRegex.exec(content)) !== null) {
      const id = match[1];
      const severity = match[2] as 'WARN' | 'FAIL';
      const title = match[3].trim();

      // Find details section for this ID
      // Format: ### RT-XXX — Title\n\n- detail line
      const detailsRegex = new RegExp(`### ${id}[^\\n]*\\n\\n([\\s\\S]*?)(?=###|$)`);
      const detailsMatch = content.match(detailsRegex);

      let details: string[] = [];
      if (detailsMatch) {
        const detailLines = detailsMatch[1].match(/^- .+$/gm) || [];
        details = detailLines.map(l => l.replace(/^- /, '')).slice(0, 3);
      }

      findings.push({
        id,
        title,
        severity,
        details,
      });
    }

    return findings;
  } catch {
    return [];
  }
}

function loadUnverifiedClaims(slug: string): Claim[] {
  const claimsPath = join(process.cwd(), 'capstone', 'develop', 'evals', `${slug}.claims.yaml`);

  if (!existsSync(claimsPath)) {
    return [];
  }

  try {
    const content = readFileSync(claimsPath, 'utf-8');
    const ledger = YAML.parse(content);
    const claims = ledger?.claims || [];

    return claims
      .filter((c: Claim) => c.verified?.status !== 'verified')
      .slice(0, 10); // First 10 unverified
  } catch {
    return [];
  }
}

export function IssuesScreen({ slug, onBack }: IssuesScreenProps) {
  const redteamIssues = loadRedTeamIssues(slug);
  const unverifiedClaims = loadUnverifiedClaims(slug);

  useInput((input, key) => {
    if (key.escape || key.return || input === 'b') {
      onBack();
    }
  });

  const hasIssues = redteamIssues.length > 0 || unverifiedClaims.length > 0;

  return (
    <Box flexDirection="column" paddingLeft={2}>
      <Box marginBottom={1}>
        <Text bold>Issues: </Text>
        <Text color={colors.accent}>{slug}</Text>
      </Box>

      {!hasIssues && (
        <Box marginBottom={1}>
          <Text color={colors.success}>{icons.success} No issues found!</Text>
        </Box>
      )}

      {/* Red Team Issues */}
      {redteamIssues.length > 0 && (
        <Box flexDirection="column" marginBottom={1}>
          <Box marginBottom={1}>
            <Text bold color={colors.warning}>Red Team Issues ({redteamIssues.length})</Text>
          </Box>

          {redteamIssues.map((issue, i) => (
            <Box key={issue.id} flexDirection="column" marginBottom={1}>
              <Box>
                <Text color={issue.severity === 'FAIL' ? colors.error : colors.warning}>
                  {issue.severity === 'FAIL' ? icons.error : icons.warning}
                </Text>
                <Text> </Text>
                <Text bold>{issue.id}</Text>
                <Text dimColor>: </Text>
                <Text>{issue.title}</Text>
              </Box>
              {issue.details && issue.details.map((detail, j) => (
                <Box key={j} paddingLeft={3}>
                  <Text dimColor>{icons.bullet} {detail.substring(0, 60)}{detail.length > 60 ? '...' : ''}</Text>
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      )}

      {/* Unverified Claims */}
      {unverifiedClaims.length > 0 && (
        <Box flexDirection="column" marginBottom={1}>
          <Box marginBottom={1}>
            <Text bold color={colors.info}>Unverified Claims ({unverifiedClaims.length})</Text>
          </Box>

          {unverifiedClaims.map((claim, i) => (
            <Box key={claim.id} flexDirection="column" marginBottom={1}>
              <Box>
                <Text color={colors.muted}>{icons.pending}</Text>
                <Text> </Text>
                <Text dimColor>{claim.id}</Text>
              </Box>
              <Box paddingLeft={3}>
                <Text>"{claim.text.substring(0, 70)}{claim.text.length > 70 ? '...' : ''}"</Text>
              </Box>
              <Box paddingLeft={3}>
                <Text dimColor>Location: {claim.location}</Text>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {/* Help */}
      <Box marginTop={1}>
        <Text dimColor>{'─'.repeat(60)}</Text>
      </Box>

      {hasIssues && (
        <Box flexDirection="column" marginTop={1}>
          <Text dimColor>To fix:</Text>
          {redteamIssues.length > 0 && (
            <Text dimColor>  {icons.bullet} Red Team: Edit content/variants/{slug}.yaml</Text>
          )}
          {unverifiedClaims.length > 0 && (
            <Text dimColor>  {icons.bullet} Claims: Add sources to capstone/develop/evals/{slug}.claims.yaml</Text>
          )}
        </Box>
      )}

      <Box marginTop={1}>
        <Text dimColor>[Enter/Esc/b] Back to actions</Text>
      </Box>
    </Box>
  );
}
