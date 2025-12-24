import type { Profile } from '../../types/variant';
import type { CompanyBadge as CompanyBadgeType } from '../../types/variant';
import CompanyBadge from '../common/CompanyBadge';

// Extended hero type to include variant-specific fields
type HeroWithVariant = Profile['hero'] & {
  companyAccent?: Array<{ text: string; style?: 'italic' | 'muted' | 'accent' | 'normal' }>;
  companyBadge?: CompanyBadgeType;
};

interface HeroSectionProps {
  profile: Profile;
  isMobile: boolean;
  isTablet: boolean;
  isLoaded: boolean;
}

export default function HeroSection({ profile, isMobile, isTablet, isLoaded }: HeroSectionProps) {
  const hero = profile.hero as HeroWithVariant;

  // Calculate badge scale based on viewport (matches headline scaling)
  // Headline: mobile 11vw, tablet 9vw, desktop 8vw
  // Badge target: ~1.5-2x base size at desktop, scaling proportionally
  const badgeScale = isMobile ? 1.2 : isTablet ? 1.5 : 1.8;

  return (
    <>
      <style>{`
        .hero-primary-btn {
          background: var(--color-accent);
          color: var(--color-background);
          transition: all 0.2s ease;
        }
        .hero-primary-btn:hover {
          background: var(--color-accent-hover);
        }
        .hero-secondary-btn {
          background: transparent;
          border: 1px solid var(--color-border);
          color: var(--color-text-secondary);
          transition: all 0.2s ease;
        }
        .hero-secondary-btn:hover {
          border-color: var(--color-text-tertiary);
          color: var(--color-text-primary);
        }
      `}</style>
      <section style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: isMobile
          ? '80px var(--space-lg) var(--space-xl)'
          : '100px var(--layout-padding-x) var(--space-2xl)',
        maxWidth: 'var(--layout-max-width)',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? 'translateY(0)' : 'translateY(40px)',
          transition: 'all 1s var(--ease-smooth) 0.2s'
        }}>
          {/* Eyebrow */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-md)',
            marginBottom: isMobile ? '20px' : 'var(--space-lg)'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              background: 'var(--color-success)',
              borderRadius: '50%'
            }} />
            <span style={{
              fontSize: '13px',
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--color-text-tertiary)'
            }}>
              {hero.status}
            </span>
          </div>

          {/* Main headline - Editorial style (signature branding) */}
          <h1 style={{
            fontSize: isMobile ? '11vw' : isTablet ? '9vw' : '8vw',
            fontFamily: 'var(--font-serif)',
            fontWeight: 400,
            fontStyle: 'italic',
            lineHeight: 0.95,
            margin: 0,
            letterSpacing: '-0.03em',
            color: 'var(--color-text-primary)',
            transition: 'color var(--transition-medium)'
          }}>
            {hero.headline.map((segment, index) => {
              const style: React.CSSProperties = {};
              if (segment.style === 'muted') {
                style.fontStyle = 'normal';
                style.color = 'var(--color-text-tertiary)';
              } else if (segment.style === 'accent') {
                style.color = 'var(--color-accent)';
              }
              const isLast = index === hero.headline.length - 1;
              return (
                <span key={index}>
                  {index > 0 && <br />}
                  <span style={style}>{segment.text}</span>
                  {/* Company badge with logo (preferred) */}
                  {isLast && hero.companyBadge && (
                    <span style={{
                      fontSize: '0.28em',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      marginLeft: '0.5em',
                      letterSpacing: '0.01em',
                      verticalAlign: 'baseline',
                      position: 'relative',
                      top: '-0.15em',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35em'
                    }}>
                      <span style={{ color: 'var(--color-text-tertiary)', opacity: 0.4 }}>—</span>
                      <span style={{ color: 'var(--color-text-tertiary)', opacity: 0.6 }}>with</span>
                      <CompanyBadge badge={hero.companyBadge} scale={badgeScale} />
                    </span>
                  )}
                  {/* Fallback: text-only company accent (if no badge) */}
                  {isLast && !hero.companyBadge && hero.companyAccent && hero.companyAccent.length > 0 && (
                    <span style={{
                      fontSize: '0.28em',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      marginLeft: '0.5em',
                      letterSpacing: '0.01em',
                      verticalAlign: 'baseline',
                      position: 'relative',
                      top: '-0.15em'
                    }}>
                      <span style={{ color: 'var(--color-text-tertiary)', opacity: 0.4 }}>—</span>
                      {hero.companyAccent.map((accentSegment, accentIndex) => {
                        const accentStyle: React.CSSProperties = { marginLeft: '0.35em' };
                        if (accentSegment.style === 'muted') {
                          accentStyle.color = 'var(--color-text-tertiary)';
                          accentStyle.opacity = 0.6;
                        } else if (accentSegment.style === 'accent') {
                          accentStyle.color = 'var(--color-accent)';
                          accentStyle.opacity = 0.75;
                        } else {
                          accentStyle.color = 'var(--color-text-secondary)';
                          accentStyle.opacity = 0.6;
                        }
                        return (
                          <span key={accentIndex} style={accentStyle}>{accentSegment.text}</span>
                        );
                      })}
                    </span>
                  )}
                </span>
              );
            })}
          </h1>

          {/* Subheadline */}
          <div className="hero-grid">
            <p style={{
              fontSize: isMobile ? '17px' : '19px',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.6,
              fontWeight: 400,
              maxWidth: '480px'
            }}>
              {hero.subheadline}
            </p>

            {/* Hide buttons on mobile - they appear next to photo in About section */}
            {!isMobile && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-md)',
                marginLeft: 'auto'
              }}>
                <button
                  onClick={() => {
                    const target = hero.cta.primary.href.replace('#', '');
                    const el = document.getElementById(target);
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hero-primary-btn hero-cta-btn"
                  style={{
                    padding: '18px 32px',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: 600,
                    letterSpacing: '0.02em',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <span>{hero.cta.primary.label}</span>
                  <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>↓</span>
                </button>
                <a
                  href={hero.cta.secondary.href}
                  download="Dmitrii-Fotesco-Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero-secondary-btn hero-cta-btn"
                  style={{
                    padding: '18px 32px',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: 600,
                    letterSpacing: '0.02em',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span>{hero.cta.secondary.label}</span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ opacity: 0.7 }}
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                </a>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
