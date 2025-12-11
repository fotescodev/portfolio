import { useTheme } from '../../context/ThemeContext';
import { profile } from '../../lib/content';

interface AboutSectionProps {
  isMobile: boolean;
  isTablet: boolean;
  sectionPadding: string;
}

export default function AboutSection({ isMobile, isTablet, sectionPadding }: AboutSectionProps) {
  const { colors, isDark } = useTheme();
  const { about, ens, photo, name } = profile;

  return (
    <section id="about" style={{
      padding: sectionPadding,
      maxWidth: '1400px',
      margin: '0 auto',
      position: 'relative',
      zIndex: 1
    }}>
      {/* Section label */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        marginBottom: isMobile ? '32px' : '40px'
      }}>
        <span style={{
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: colors.textMuted
        }}>
          About
        </span>
        <div style={{
          flex: 1,
          height: '1px',
          background: colors.borderLight
        }} />
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : isTablet ? '180px 1fr' : '280px 1fr',
        gap: isMobile ? '40px' : isTablet ? '48px' : '80px',
        alignItems: 'start'
      }}>
        {/* Photo */}
        <div style={{
          aspectRatio: '3/4',
          maxWidth: isMobile ? '180px' : '100%',
          background: `linear-gradient(135deg, ${colors.backgroundSecondary} 0%, ${colors.backgroundTertiary} 100%)`,
          border: `1px solid ${isDark ? 'rgba(232, 230, 227, 0.06)' : 'rgba(26, 26, 28, 0.06)'}`,
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
            background: isDark ? 'rgba(8, 8, 10, 0.9)' : 'rgba(250, 250, 250, 0.9)',
            backdropFilter: 'blur(8px)',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontStyle: 'italic',
              fontSize: '14px',
              color: colors.accent
            }}>
              {ens}
            </span>
            <span style={{
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: colors.success
            }}>
              Verified
            </span>
          </div>
        </div>

        <div>
          <h2 style={{
            fontSize: isMobile ? '28px' : isTablet ? '32px' : '40px',
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontStyle: 'italic',
            lineHeight: 1.3,
            color: colors.textPrimary,
            marginBottom: '28px',
            letterSpacing: '-0.02em'
          }}>
            {about.tagline}
          </h2>
          <div style={{
            columns: isMobile ? 1 : 2,
            columnGap: '48px'
          }}>
            {about.bio.map((paragraph, index) => (
              <p key={index} style={{
                fontSize: '15px',
                lineHeight: 1.75,
                color: isDark ? '#8a8885' : '#5a5a5c',
                marginBottom: '20px'
              }}>
                {paragraph}
              </p>
            ))}
          </div>

          {/* Stats row */}
          <div style={{
            display: 'flex',
            gap: isMobile ? '32px' : '48px',
            marginTop: '32px',
            paddingTop: '24px',
            borderTop: `1px solid ${colors.borderLight}`,
            flexWrap: 'wrap'
          }}>
            {about.stats.map((stat, i) => (
              <div key={i}>
                <div style={{
                  fontSize: isMobile ? '36px' : '48px',
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  fontWeight: 400,
                  color: colors.textPrimary,
                  lineHeight: 1
                }}>{stat.value}</div>
                <div style={{
                  fontSize: '12px',
                  fontWeight: 500,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: colors.textMuted,
                  marginTop: '8px'
                }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
