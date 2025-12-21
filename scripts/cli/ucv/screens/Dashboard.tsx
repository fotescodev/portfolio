import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { useVariants, VariantStatus } from '../hooks/useVariants.js';
import { colors, icons } from '../lib/colors.js';

interface DashboardProps {
  onSelectVariant: (slug: string) => void;
  onCreate: () => void;
}

export function Dashboard({ onSelectVariant, onCreate }: DashboardProps) {
  const { variants, loading, error } = useVariants();
  const [selectedIndex, setSelectedIndex] = useState(0);

  useInput((input, key) => {
    if (loading) return;

    if (input === 'c') {
      onCreate();
      return;
    }

    if (key.upArrow) {
      setSelectedIndex(i => Math.max(0, i - 1));
    } else if (key.downArrow) {
      setSelectedIndex(i => Math.min(variants.length - 1, i + 1));
    } else if (key.return && variants.length > 0) {
      onSelectVariant(variants[selectedIndex].slug);
    }
  });

  if (loading) {
    return (
      <Box>
        <Text color={colors.info}>{icons.running} Loading variants...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Text color={colors.error}>{icons.error} Error: {error}</Text>
      </Box>
    );
  }

  if (variants.length === 0) {
    return (
      <Box flexDirection="column" paddingLeft={2}>
        <Text dimColor>No variants found.</Text>
        <Box marginTop={1}>
          <Text dimColor>Press </Text>
          <Text color={colors.accent}>c</Text>
          <Text dimColor> to create your first variant</Text>
        </Box>
        <Box marginTop={1}>
          <Text dimColor>[c] Create  [q] Quit</Text>
        </Box>
      </Box>
    );
  }

  // Count statuses
  const counts = {
    ready: variants.filter(v => v.overallStatus === 'ready').length,
    review: variants.filter(v => v.overallStatus === 'review').length,
    blocked: variants.filter(v => v.overallStatus === 'blocked').length,
    pending: variants.filter(v => v.overallStatus === 'pending').length,
  };

  return (
    <Box flexDirection="column">
      <Box marginBottom={1} paddingLeft={2}>
        <Text bold>Pipeline Status</Text>
      </Box>

      {/* Header row */}
      <Box paddingLeft={2}>
        <Text dimColor>
          {'  '}
          <Text>{'Variant'.padEnd(35)}</Text>
          <Text>{'Sync'.padEnd(8)}</Text>
          <Text>{'Eval'.padEnd(12)}</Text>
          <Text>{'RedTeam'.padEnd(12)}</Text>
          <Text>Status</Text>
        </Text>
      </Box>
      <Box paddingLeft={2} marginBottom={1}>
        <Text dimColor>{'─'.repeat(75)}</Text>
      </Box>

      {/* Variant rows */}
      {variants.map((variant, index) => (
        <VariantRow
          key={variant.slug}
          variant={variant}
          isSelected={index === selectedIndex}
        />
      ))}

      {/* Summary */}
      <Box paddingLeft={2} marginTop={1}>
        <Text dimColor>{'─'.repeat(75)}</Text>
      </Box>
      <Box paddingLeft={2} marginTop={1}>
        <Text>
          {variants.length} variants
          <Text dimColor> │ </Text>
          <Text color={colors.success}>{counts.ready} ready</Text>
          <Text dimColor> │ </Text>
          <Text color={colors.warning}>{counts.review} review</Text>
          <Text dimColor> │ </Text>
          <Text color={colors.error}>{counts.blocked} blocked</Text>
          <Text dimColor> │ </Text>
          <Text dimColor>{counts.pending} pending</Text>
        </Text>
      </Box>

      {/* Help */}
      <Box paddingLeft={2} marginTop={1}>
        <Text dimColor>
          [↑↓] Navigate  [Enter] Actions  [c] Create  [q] Quit
        </Text>
      </Box>
    </Box>
  );
}

function VariantRow({ variant, isSelected }: { variant: VariantStatus; isSelected: boolean }) {
  const pointer = isSelected ? icons.arrow : ' ';
  const pointerColor = isSelected ? colors.accent : undefined;

  // Sync status
  const syncIcon = variant.synced ? icons.success : icons.pending;
  const syncColor = variant.synced ? colors.success : colors.muted;

  // Eval status
  let evalText = '';
  let evalColor = colors.muted;
  if (!variant.evalStatus.hasLedger) {
    evalText = icons.pending;
  } else if (variant.evalStatus.verified === variant.evalStatus.total) {
    evalText = `${variant.evalStatus.verified}/${variant.evalStatus.total} ${icons.success}`;
    evalColor = colors.success;
  } else {
    evalText = `${variant.evalStatus.verified}/${variant.evalStatus.total}`;
    evalColor = colors.warning;
  }

  // Redteam status
  let redteamText = '';
  let redteamColor = colors.muted;
  if (!variant.redteamStatus.hasReport) {
    redteamText = '—';
  } else if (variant.redteamStatus.fails > 0) {
    redteamText = `${variant.redteamStatus.fails} FAIL`;
    redteamColor = colors.error;
  } else if (variant.redteamStatus.warns > 0) {
    redteamText = `${variant.redteamStatus.warns} WARN`;
    redteamColor = colors.warning;
  } else {
    redteamText = 'PASS';
    redteamColor = colors.success;
  }

  // Overall status
  const statusConfig = {
    ready: { emoji: '✅', text: 'Ready', color: colors.success },
    review: { emoji: '⚠️', text: 'Review', color: colors.warning },
    blocked: { emoji: '🔴', text: 'Blocked', color: colors.error },
    pending: { emoji: '⏳', text: 'Pending', color: colors.muted },
  };
  const status = statusConfig[variant.overallStatus];

  return (
    <Box paddingLeft={2}>
      <Text color={pointerColor}>{pointer} </Text>
      <Text bold={isSelected}>{variant.slug.padEnd(35)}</Text>
      <Text color={syncColor}>{syncIcon.padEnd(8)}</Text>
      <Text color={evalColor}>{evalText.padEnd(12)}</Text>
      <Text color={redteamColor}>{redteamText.padEnd(12)}</Text>
      <Text color={status.color}>{status.emoji} {status.text}</Text>
    </Box>
  );
}
