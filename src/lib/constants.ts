/**
 * Blog Constants
 * Centralized configuration for blog-related values
 */

// Reading time calculation
export const READING_TIME = {
  WORDS_PER_MINUTE: 200,
} as const;

// Scroll behavior thresholds (in pixels)
export const SCROLL = {
  BACK_TO_TOP_THRESHOLD: 400,
  HEADING_DETECTION_OFFSET: 150,
} as const;

// Animation timings (in milliseconds)
export const ANIMATION = {
  TOAST_DURATION: 2000,
  LIKE_ANIMATION: 600,
} as const;

// Share window dimensions
export const SHARE_WINDOW = {
  WIDTH: 550,
  HEIGHT: 420,
} as const;

// Blog display settings
export const BLOG = {
  RELATED_POSTS_COUNT: 3,
  HOMEPAGE_POSTS_COUNT: 2,
} as const;
