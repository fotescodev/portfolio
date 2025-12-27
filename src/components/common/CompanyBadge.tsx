import { useState } from 'react';
import type { CompanyBadge as CompanyBadgeType } from '../../types/variant';

interface CompanyBadgeProps {
  badge: CompanyBadgeType;
  className?: string;
  /** Scale factor - 1 = 24px logo, adjusts proportionally */
  scale?: number;
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
 */
function getLogoUrl(badge: CompanyBadgeType): string {
  // If custom logoUrl provided, use it
  if (badge.logoUrl) {
    return badge.logoUrl;
  }

  const domain = badge.domain || deriveDomain(badge.name);

  // Logo.dev API - using larger size for retina/scaling
  return `https://img.logo.dev/${domain}?token=pk_X-1ZO13GSgeOoUrIuJ6GMQ&size=128&format=png`;
}

/**
 * CompanyBadge - displays target company logo + name
 *
 * Two styles:
 * - pill: Glass container with logo + name (default)
 * - inline: Just logo + name without container
 *
 * Supports scaling via the `scale` prop (default 1 = 24px logo)
 */
export default function CompanyBadge({ badge, className = '', scale = 1 }: CompanyBadgeProps) {
  const [logoError, setLogoError] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);

  const logoUrl = getLogoUrl(badge);
  const badgeStyle = badge.style || 'pill';

  // Base sizes that scale
  const logoSize = 24 * scale;
  const fontSize = 15 * scale;
  const paddingV = 8 * scale;
  const paddingH = 16 * scale;
  const paddingLogo = 12 * scale;
  const gap = 8 * scale;
  const borderRadius = 8 * scale;

  // Pill style: glass container
  if (badgeStyle === 'pill') {
    return (
      <span
        className={`company-badge company-badge-pill ${className}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: `${gap}px`,
          padding: `${paddingV}px ${paddingH}px ${paddingV}px ${paddingLogo}px`,
          background: 'var(--color-badge-bg, rgba(255, 255, 255, 0.95))',
          borderRadius: `${borderRadius}px`,
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
              width: `${logoSize}px`,
              height: `${logoSize}px`,
              objectFit: 'contain',
              opacity: logoLoaded ? 1 : 0,
              transition: 'opacity 0.2s ease',
            }}
          />
        )}
        <span
          style={{
            fontSize: `${fontSize}px`,
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
  const inlineLogoSize = 20 * scale;
  const inlineFontSize = 14 * scale;
  const inlineGap = 6 * scale;

  return (
    <span
      className={`company-badge company-badge-inline ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: `${inlineGap}px`,
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
            width: `${inlineLogoSize}px`,
            height: `${inlineLogoSize}px`,
            objectFit: 'contain',
            opacity: logoLoaded ? 1 : 0,
            transition: 'opacity 0.2s ease',
          }}
        />
      )}
      <span
        style={{
          fontSize: `${inlineFontSize}px`,
          color: 'var(--color-accent)',
          fontWeight: 500,
        }}
      >
        {badge.name}
      </span>
    </span>
  );
}
