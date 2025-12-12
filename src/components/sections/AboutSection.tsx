import { profile } from '../../lib/content';

interface AboutSectionProps {
  isMobile: boolean;
  isTablet: boolean;
  sectionPadding: string;
}

export default function AboutSection({ isMobile, isTablet, sectionPadding }: AboutSectionProps) {
  const { about, ens, photo, name } = profile;

  return (
    <section id="about" style={{
      padding: sectionPadding,
      maxWidth: 'var(--layout-max-width)',
      margin: '0 auto',
      position: 'relative',
      zIndex: 1
    }}>
      {/* Section label */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-lg)',
        marginBottom: isMobile ? 'var(--space-xl)' : '40px'
      }}>
        <span style={{
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'var(--color-text-muted)'
        }}>
          About
        </span>
        <div style={{
          flex: 1,
          height: '1px',
          background: 'var(--color-border-light)'
        }} />
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : isTablet ? '180px 1fr' : '280px 1fr',
        gap: isMobile ? '40px' : isTablet ? 'var(--space-2xl)' : '80px',
        alignItems: 'start'
      }}>
        {/* Photo */}
        <div style={{
          aspectRatio: '3/4',
          maxWidth: isMobile ? '180px' : '100%',
          background: 'linear-gradient(135deg, var(--color-background-secondary) 0%, var(--color-background-tertiary) 100%)',
          border: '1px solid var(--color-photo-border)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <img
            src={photo}
            alt={name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              const parent = (e.target as HTMLImageElement).parentElement;
              if (parent) {
                const placeholder = document.createElement('div');
                placeholder.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#2a2a2c;font-size:12px;font-weight:500;letter-spacing:0.1em;text-transform:uppercase';
                placeholder.textContent = 'Photo';
                parent.appendChild(placeholder);
              }
            }}
          />
          {/* ENS tag */}
          <div style={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            right: '0',
            background: 'var(--color-ens-bg)',
            backdropFilter: 'blur(8px)',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: '14px',
              color: 'var(--color-accent)'
            }}>
              {ens}
            </span>
            <span style={{
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--color-success)'
            }}>
              Verified
            </span>
          </div>
        </div>

        <div>
          <h2 style={{
            fontSize: isMobile ? '28px' : isTablet ? '32px' : '40px',
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            lineHeight: 1.3,
            color: 'var(--color-text-primary)',
            marginBottom: '28px',
            letterSpacing: '-0.02em'
          }}>
            {about.tagline}
          </h2>
          <div style={{
            columns: isMobile ? 1 : 2,
            columnGap: 'var(--space-2xl)'
          }}>
            {about.bio.map((paragraph, index) => (
              <p key={index} style={{
                fontSize: '15px',
                lineHeight: 1.75,
                color: 'var(--color-text-tertiary)',
                marginBottom: '20px'
              }}>
                {paragraph}
              </p>
            ))}
          </div>

          {/* Stats row */}
          <div style={{
            display: 'flex',
            gap: isMobile ? 'var(--space-xl)' : 'var(--space-2xl)',
            marginTop: 'var(--space-xl)',
            paddingTop: 'var(--space-lg)',
            borderTop: '1px solid var(--color-border-light)',
            flexWrap: 'wrap'
          }}>
            {about.stats.map((stat, i) => (
              <div key={i}>
                <div style={{
                  fontSize: isMobile ? '36px' : '48px',
                  fontFamily: 'var(--font-serif)',
                  fontWeight: 400,
                  color: 'var(--color-text-primary)',
                  lineHeight: 1
                }}>{stat.value}</div>
                <div style={{
                  fontSize: '12px',
                  fontWeight: 500,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--color-text-muted)',
                  marginTop: 'var(--space-sm)'
                }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
