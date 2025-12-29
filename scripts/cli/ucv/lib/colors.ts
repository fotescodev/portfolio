/**
 * UCV CLI Colors
 *
 * Shared color palette for Ink components.
 * Derived from the portfolio design system.
 */

export const colors = {
  accent: '#c29a6c',      // Brand tan
  success: '#4ade80',     // Green
  warning: '#facc15',     // Yellow
  error: '#ef4444',       // Red
  info: '#60a5fa',        // Blue
  muted: '#6b7280',       // Gray
  white: '#ffffff',
  dim: '#4b5563',
} as const;

export const icons = {
  success: '✓',
  error: '✗',
  warning: '⚠',
  info: 'ℹ',
  pending: '○',
  running: '●',
  bullet: '•',
  arrow: '→',
  diamond: '◆',
} as const;
