/**
 * Blog Utilities
 * Shared functions for blog components
 */

import { social, profile } from './content';
import { READING_TIME, SHARE_WINDOW } from './constants';

/**
 * Generate canonical blog post URL
 * Uses hash router format: /#/blog/{slug}
 */
export function getPostUrl(slug: string): string {
  return `${window.location.origin}/#/blog/${slug}`;
}

/**
 * Calculate reading time from content
 */
export function calculateReadingTime(content: string): number {
  const words = content.split(/\s+/).length;
  return Math.ceil(words / READING_TIME.WORDS_PER_MINUTE);
}

/**
 * Get Twitter handle from social config
 */
export function getTwitterHandle(): string {
  const twitter = social.links.find(link => link.platform === 'twitter');
  return twitter?.handle || '@kolob0kk';
}

/**
 * Get Twitter URL from social config
 */
export function getTwitterUrl(): string {
  const twitter = social.links.find(link => link.platform === 'twitter');
  return twitter?.url || 'https://x.com/kolob0kk';
}

/**
 * Get author info from profile config
 */
export function getAuthorInfo() {
  return {
    name: profile.name,
    bio: profile.about.tagline,
    avatar: profile.photo,
    twitter: getTwitterUrl(),
  };
}

/**
 * Generate Twitter share URL
 */
export function getTwitterShareUrl(title: string, url: string): string {
  const handle = getTwitterHandle();
  const text = `${title} by ${handle}`;
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
}

/**
 * Generate LinkedIn share URL
 */
export function getLinkedInShareUrl(url: string): string {
  return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
}

/**
 * Open share window with standard dimensions
 */
export function openShareWindow(url: string): void {
  window.open(url, '_blank', `width=${SHARE_WINDOW.WIDTH},height=${SHARE_WINDOW.HEIGHT}`);
}

/**
 * Format date for display
 */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Format date in short format (MM.DD.YY)
 */
export function formatDateShort(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: '2-digit'
  }).replace(/\//g, '.');
}
