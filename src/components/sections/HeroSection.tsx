import type { Profile } from '../../types/variant';

// Extended hero type to include variant-specific companyAccent
type HeroWithAccent = Profile['hero'] & {
  companyAccent?: Array<{ text: string; style?: 'italic' | 'muted' | 'accent' | 'normal' }>;
};

interface HeroSectionProps {
  profile: Profile;
  isMobile: boolean;
  isTablet: boolean;
  isLoaded: boolean;
}

export default function HeroSection({ profile, isMobile, isTablet, isLoaded }: HeroSectionProps) {
  const hero = profile.hero as HeroWithAccent;

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
        padding: isMobile ? '100px 24px 48px' : '120px 64px 64px',
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
              return (
                <span key={index}>
                  {index > 0 && <br />}
                  <span style={style}>{segment.text}</span>
                </span>
              );
            })}
          </h1>

          {/* Company Accent - Shows company-specific context for variants */}
          {hero.companyAccent && hero.companyAccent.length > 0 && (
            <div style={{
              marginTop: isMobile ? 'var(--space-md)' : 'var(--space-lg)',
              fontSize: isMobile ? '4vw' : isTablet ? '3vw' : '2.5vw',
              fontFamily: 'var(--font-serif)',
              fontWeight: 400,
              fontStyle: 'italic',
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
              opacity: 0.7
            }}>
              {hero.companyAccent.map((segment, index) => {
                const style: React.CSSProperties = {};
                if (segment.style === 'muted') {
                  style.fontStyle = 'normal';
                  style.color = 'var(--color-text-tertiary)';
                } else if (segment.style === 'accent') {
                  style.color = 'var(--color-accent)';
                  style.opacity = 1;
                } else {
                  style.color = 'var(--color-text-secondary)';
                }
                return (
                  <span key={index}>
                    {index > 0 && ' '}
                    <span style={style}>{segment.text}</span>
                  </span>
                );
              })}
            </div>
          )}

          {/* Subheadline */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: isMobile ? 'var(--space-lg)' : 'var(--space-2xl)',
            marginTop: isMobile ? 'var(--space-xl)' : '40px',
            alignItems: 'start'
          }}>
            <p style={{
              fontSize: isMobile ? '17px' : '19px',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.6,
              fontWeight: 400,
              maxWidth: '480px'
            }}>
              {hero.subheadline}
            </p>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-md)'
            }}>
              <a
                href={hero.cta.primary.href}
                className="hero-primary-btn"
                style={{
                  padding: isMobile ? '16px 28px' : '18px 32px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: 600,
                  letterSpacing: '0.02em',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: isMobile ? '100%' : 'fit-content',
                  minWidth: '220px'
                }}
              >
                <span>{hero.cta.primary.label}</span>
                <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>↓</span>
              </a>
              <a
                href={hero.cta.secondary.href}
                download="Dmitrii-Fotesco-Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="hero-secondary-btn"
                style={{
                  padding: isMobile ? '16px 28px' : '18px 32px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: 600,
                  letterSpacing: '0.02em',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: isMobile ? '100%' : 'fit-content',
                  minWidth: '220px'
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
          </div>
        </div>
      </section>
    </>
  );
}
