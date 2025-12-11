import { useTheme } from '../../context/ThemeContext';
import { profile } from '../../lib/content';

interface HeroSectionProps {
  isMobile: boolean;
  isTablet: boolean;
  isLoaded: boolean;
}

export default function HeroSection({ isMobile, isTablet, isLoaded }: HeroSectionProps) {
  const { colors } = useTheme();
  const { hero } = profile;

  return (
    <section style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: isMobile ? '100px 24px 48px' : '120px 64px 64px',
      maxWidth: '1400px',
      margin: '0 auto',
      position: 'relative',
      zIndex: 1
    }}>
      <div style={{
        opacity: isLoaded ? 1 : 0,
        transform: isLoaded ? 'translateY(0)' : 'translateY(40px)',
        transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s'
      }}>
        {/* Eyebrow */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: isMobile ? '20px' : '24px'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            background: colors.success,
            borderRadius: '50%'
          }} />
          <span style={{
            fontSize: '13px',
            fontWeight: 500,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: colors.textTertiary
          }}>
            {hero.status}
          </span>
        </div>

        {/* Main headline - Editorial style */}
        <h1 style={{
          fontSize: isMobile ? '11vw' : isTablet ? '9vw' : '8vw',
          fontFamily: "'Instrument Serif', Georgia, serif",
          fontWeight: 400,
          fontStyle: 'italic',
          lineHeight: 0.95,
          margin: 0,
          letterSpacing: '-0.03em',
          color: colors.textPrimary,
          transition: 'color 0.4s ease'
        }}>
          {hero.headline.map((segment, index) => {
            const style: React.CSSProperties = {};
            if (segment.style === 'muted') {
              style.fontStyle = 'normal';
              style.color = colors.textTertiary;
            } else if (segment.style === 'accent') {
              style.color = colors.accent;
            }
            return (
              <span key={index}>
                {index > 0 && <br />}
                <span style={style}>{segment.text}</span>
              </span>
            );
          })}
        </h1>

        {/* Subheadline */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: isMobile ? '24px' : '48px',
          marginTop: isMobile ? '32px' : '40px',
          alignItems: 'start'
        }}>
          <p style={{
            fontSize: isMobile ? '17px' : '19px',
            color: colors.textSecondary,
            lineHeight: 1.6,
            fontWeight: 400,
            maxWidth: '480px'
          }}>
            {hero.subheadline}
          </p>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <a href={hero.cta.primary.href} style={{
              background: colors.textPrimary,
              color: colors.background,
              padding: isMobile ? '16px 28px' : '18px 32px',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 600,
              letterSpacing: '0.02em',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.2s ease',
              width: isMobile ? '100%' : 'fit-content',
              minWidth: '220px'
            }}>
              <span>{hero.cta.primary.label}</span>
              <span style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}>↓</span>
            </a>
            <a
              href={hero.cta.secondary.href}
              download="Dmitrii-Fotesco-Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: colors.textTertiary,
                padding: '18px 0',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 500,
                letterSpacing: '0.02em',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                borderBottom: `1px solid ${colors.border}`,
                transition: 'all 0.2s ease',
                width: 'fit-content'
              }}
              onMouseEnter={(e) => (e.target as HTMLElement).style.color = colors.textPrimary}
              onMouseLeave={(e) => (e.target as HTMLElement).style.color = colors.textTertiary}
            >
              {hero.cta.secondary.label}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
