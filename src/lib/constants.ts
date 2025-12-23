/**
 * Shared constants for the portfolio application
 *
 * Centralizes magic numbers and configuration values that were
 * previously scattered throughout the codebase.
 */

// Responsive breakpoints (in pixels)
export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280,
} as const;

// Toast/notification durations (in milliseconds)
export const TOAST_DURATION = {
  copy: 2000,
  success: 2000,
  error: 3000,
} as const;

// Animation durations (in milliseconds)
export const ANIMATION_DURATION = {
  likeButton: 600,
  transition: 300,
} as const;

// Scroll thresholds (in pixels)
export const SCROLL_THRESHOLD = {
  backToTop: 400,
  headingOffset: 150,
  progressBarVisible: 5,
  progressBarHide: 95,
} as const;

// Social share window dimensions
export const SHARE_WINDOW = {
  width: 550,
  height: 420,
} as const;

// Reading calculation
export const WORDS_PER_MINUTE = 200;

// Blog post freshness (in days)
export const NEW_POST_THRESHOLD_DAYS = 30;
