import React from 'react';
import { Box, Text } from 'ink';
import { colors, icons } from '../lib/colors.js';

interface HeaderProps {
  subtitle?: string;
}

export function Header({ subtitle = 'Quality Pipeline' }: HeaderProps) {
  const width = 77;
  const borderChar = '─';

  return (
    <Box flexDirection="column" marginBottom={1}>
      <Text color={colors.accent}>
        {'╭' + borderChar.repeat(width) + '╮'}
      </Text>
      <Text>
        <Text color={colors.accent}>│</Text>
        <Text>  </Text>
        <Text color={colors.accent} bold>{icons.diamond} Universal CV</Text>
        <Text>{' '.repeat(44)}</Text>
        <Text dimColor>{subtitle}</Text>
        <Text>  </Text>
        <Text color={colors.accent}>│</Text>
      </Text>
      <Text color={colors.accent}>
        {'╰' + borderChar.repeat(width) + '╯'}
      </Text>
    </Box>
  );
}
