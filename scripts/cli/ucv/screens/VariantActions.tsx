import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { colors, icons } from '../lib/colors.js';

type Phase = 'sync' | 'eval' | 'redteam' | 'pipeline';

interface VariantActionsProps {
  slug: string;
  onRunPhase: (phase: Phase) => void;
  onViewIssues: () => void;
  onBack: () => void;
}

interface MenuItem {
  id: Phase | 'issues' | 'back';
  label: string;
  description: string;
}

const menuItems: MenuItem[] = [
  { id: 'issues', label: 'View Issues', description: 'See warnings, failures, unverified claims' },
  { id: 'pipeline', label: 'Run Pipeline', description: 'Run sync → eval → redteam' },
  { id: 'sync', label: 'Sync', description: 'YAML → JSON' },
  { id: 'eval', label: 'Evaluate', description: 'Extract & verify claims' },
  { id: 'redteam', label: 'Red Team', description: 'Security/quality scan' },
  { id: 'back', label: 'Back', description: 'Return to dashboard' },
];

export function VariantActions({ slug, onRunPhase, onViewIssues, onBack }: VariantActionsProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useInput((input, key) => {
    if (key.upArrow) {
      setSelectedIndex(i => Math.max(0, i - 1));
    } else if (key.downArrow) {
      setSelectedIndex(i => Math.min(menuItems.length - 1, i + 1));
    } else if (key.return) {
      const selected = menuItems[selectedIndex];
      if (selected.id === 'back') {
        onBack();
      } else if (selected.id === 'issues') {
        onViewIssues();
      } else {
        onRunPhase(selected.id as Phase);
      }
    } else if (key.escape || input === 'b') {
      onBack();
    }
  });

  return (
    <Box flexDirection="column" paddingLeft={2}>
      <Box marginBottom={1}>
        <Text bold color={colors.accent}>{slug}</Text>
      </Box>

      {menuItems.map((item, index) => {
        const isSelected = index === selectedIndex;
        const pointer = isSelected ? icons.arrow : ' ';

        // Add separator before "Back"
        const separator = item.id === 'back' ? (
          <Box key="separator" marginTop={1} marginBottom={1}>
            <Text dimColor>{'─'.repeat(40)}</Text>
          </Box>
        ) : null;

        return (
          <React.Fragment key={item.id}>
            {separator}
            <Box>
              <Text color={isSelected ? colors.accent : undefined}>{pointer} </Text>
              <Text bold={isSelected}>{item.label.padEnd(16)}</Text>
              <Text dimColor>{item.description}</Text>
            </Box>
          </React.Fragment>
        );
      })}

      <Box marginTop={2}>
        <Text dimColor>
          [↑↓] Navigate  [Enter] Select  [Esc/b] Back
        </Text>
      </Box>
    </Box>
  );
}
