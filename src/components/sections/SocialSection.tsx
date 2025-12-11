import { useTheme } from '../../context/ThemeContext';
import { social } from '../../lib/content';

interface SocialSectionProps {
  isMobile: boolean;
  sectionPadding: string;
}

export default function SocialSection({ isMobile, sectionPadding }: SocialSectionProps) {
  const { colors } = useTheme();
  const { links, newsletter } = social;
  const primaryLinks = links.filter(l => l.primary);

  return (
    <section style={{
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
          Writing & Speaking
        </span>
        <div style={{
          flex: 1,
          height: '1px',
          background: 'rgba(232, 230, 227, 0.08)'
        }} />
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
        gap: '24px'
      }}>
        {/* Coming Soon Card */}
        <div style={{
          gridColumn: isMobile ? 'span 1' : 'span 2',
          background: 'linear-gradient(135deg, rgba(74, 222, 128, 0.05) 0%, rgba(74, 222, 128, 0.01) 100%)',
          border: '1px solid rgba(74, 222, 128, 0.15)',
          padding: isMobile ? '28px 24px' : '36px',
          position: 'relative'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '16px'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              background: '#4ade80',
              borderRadius: '50%'
            }} />
            <span style={{
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#4ade80'
            }}>
              Coming Soon
            </span>
          </div>

          <h3 style={{
            fontSize: isMobile ? '20px' : '26px',
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontStyle: 'italic',
            fontWeight: 400,
            color: colors.textSecondary,
            marginBottom: '12px',
            lineHeight: 1.2
          }}>
            Thoughts on AI × On-Chain
          </h3>

          <p style={{
            fontSize: '14px',
            color: '#8a8885',
            lineHeight: 1.7,
            marginBottom: '20px',
            maxWidth: '480px'
          }}>
            Exploring the intersection of AI agents and blockchain execution.
            Where deterministic systems meet probabilistic intelligence—and what
            product managers need to know.
          </p>

          <div style={{
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap'
          }}>
            {['AI Agents', 'Smart Contracts', 'Product Thinking'].map((tag, i) => (
              <span key={i} style={{
                fontSize: '11px',
                fontWeight: 500,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: colors.textMuted,
                padding: '6px 10px',
                background: 'rgba(74, 222, 128, 0.05)',
                border: '1px solid rgba(74, 222, 128, 0.1)'
              }}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Social Links */}
        <div style={{
          background: 'linear-gradient(135deg, #141416 0%, #1a1a1c 100%)',
          border: '1px solid rgba(232, 230, 227, 0.08)',
          padding: isMobile ? '28px 24px' : '36px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <span style={{
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: colors.textTertiary
          }}>
            Follow Along
          </span>

          {primaryLinks.filter(l => l.platform !== 'email').map((link, i) => (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 0',
                borderBottom: '1px solid rgba(232, 230, 227, 0.06)',
                textDecoration: 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <div>
                <div style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  color: colors.textSecondary,
                  marginBottom: '2px'
                }}>
                  {link.label}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: colors.textMuted,
                  fontFamily: 'monospace'
                }}>
                  {('handle' in link) ? (link as { handle: string }).handle : ''}
                </div>
              </div>
              <span style={{
                color: colors.textMuted,
                fontFamily: "'Instrument Serif', serif",
                fontStyle: 'italic',
                transition: 'color 0.2s ease'
              }}>↗</span>
            </a>
          ))}

          {newsletter && !newsletter.enabled && (
            <div style={{
              marginTop: 'auto',
              padding: '16px',
              background: 'rgba(194, 154, 108, 0.05)',
              border: '1px dashed rgba(194, 154, 108, 0.15)',
              textAlign: 'center'
            }}>
              <span style={{
                fontSize: '12px',
                color: colors.textTertiary,
                fontStyle: 'italic',
                fontFamily: "'Instrument Serif', Georgia, serif"
              }}>
                {newsletter.teaser}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
