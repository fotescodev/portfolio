import { useState } from 'react';
import type { CompanyBadge as CompanyBadgeType } from '../../types/variant';

interface CompanyBadgeProps {
  badge: CompanyBadgeType;
  className?: string;
}

/**
 * Derives a domain from company name for Logo.dev API
 * e.g., "Plaid" -> "plaid.com", "Meta" -> "meta.com"
 */
function deriveDomain(companyName: string): string {
  // Common company domain mappings
  const knownDomains: Record<string, string> = {
    'plaid': 'plaid.com',
    'meta': 'meta.com',
    'facebook': 'meta.com',
    'google': 'google.com',
    'microsoft': 'microsoft.com',
    'stripe': 'stripe.com',
    'coinbase': 'coinbase.com',
    'figma': 'figma.com',
    'anthropic': 'anthropic.com',
    'openai': 'openai.com',
    'github': 'github.com',
    'gitlab': 'gitlab.com',
    'bloomberg': 'bloomberg.com',
    'anaconda': 'anaconda.com',
    'galaxy': 'galaxy.com',
    'gensyn': 'gensyn.ai',
    'mysten': 'mystenlabs.com',
    'mysten labs': 'mystenlabs.com',
  };

  const normalized = companyName.toLowerCase().trim();
  if (knownDomains[normalized]) {
    return knownDomains[normalized];
  }

  // Default: assume company.com
  return `${normalized.replace(/\s+/g, '')}.com`;
}

/**
 * Generates Logo.dev API URL for a company
 * Uses dark mode format for better visibility on dark backgrounds
 */
function getLogoUrl(badge: CompanyBadgeType, theme: 'light' | 'dark'): string {
  // If custom logoUrl provided, use it
  if (badge.logoUrl) {
    return badge.logoUrl;
  }

  const domain = badge.domain || deriveDomain(badge.name);

  // Logo.dev API with format parameter
  // Using higher size for retina displays
  return `https://img.logo.dev/${domain}?token=pk_X-1ZO13GSgeOoUrIuJ6GMQ&size=64&format=png`;
}

/**
 * CompanyBadge - displays target company logo + name
 *
 * Two styles:
 * - pill: Glass container with logo + name (default)
 * - inline: Just logo + name without container
 */
export default function CompanyBadge({ badge, className = '' }: CompanyBadgeProps) {
  const [logoError, setLogoError] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);

  // Detect current theme from data attribute
  const theme = typeof document !== 'undefined'
    ? (document.documentElement.getAttribute('data-theme') as 'light' | 'dark') || 'dark'
    : 'dark';

  const logoUrl = getLogoUrl(badge, theme);
  const style = badge.style || 'pill';

  // Pill style: glass container
  if (style === 'pill') {
    return (
      <span
        className={`company-badge company-badge-pill ${className}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px 8px 12px',
          background: 'var(--color-badge-bg, rgba(255, 255, 255, 0.95))',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          verticalAlign: 'middle',
          transition: 'all 0.2s ease',
        }}
      >
        <style>{`
          .company-badge-pill {
            --color-badge-bg: rgba(255, 255, 255, 0.95);
            --color-badge-text: #1a1a1a;
          }
          [data-theme="light"] .company-badge-pill {
            --color-badge-bg: rgba(255, 255, 255, 0.98);
            --color-badge-text: #0a0a0a;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05);
          }
        `}</style>
        {!logoError && (
          <img
            src={logoUrl}
            alt={`${badge.name} logo`}
            onError={() => setLogoError(true)}
            onLoad={() => setLogoLoaded(true)}
            style={{
              width: '24px',
              height: '24px',
              objectFit: 'contain',
              opacity: logoLoaded ? 1 : 0,
              transition: 'opacity 0.2s ease',
            }}
          />
        )}
        <span
          style={{
            fontSize: '15px',
            fontWeight: 600,
            color: 'var(--color-badge-text, #1a1a1a)',
            letterSpacing: '0.01em',
            fontFamily: 'var(--font-sans)',
          }}
        >
          {badge.name}
        </span>
      </span>
    );
  }

  // Inline style: no container
  return (
    <span
      className={`company-badge company-badge-inline ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        verticalAlign: 'middle',
      }}
    >
      {!logoError && (
        <img
          src={logoUrl}
          alt={`${badge.name} logo`}
          onError={() => setLogoError(true)}
          onLoad={() => setLogoLoaded(true)}
          style={{
            width: '20px',
            height: '20px',
            objectFit: 'contain',
            opacity: logoLoaded ? 1 : 0,
            transition: 'opacity 0.2s ease',
          }}
        />
      )}
      <span
        style={{
          color: 'var(--color-accent)',
          fontWeight: 500,
        }}
      >
        {badge.name}
      </span>
    </span>
  );
}
