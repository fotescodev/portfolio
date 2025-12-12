import { social } from '../../lib/content';

interface SocialSectionProps {
  isMobile: boolean;
  sectionPadding: string;
}

export default function SocialSection({ isMobile, sectionPadding }: SocialSectionProps) {
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
          Writing & Speaking
        </span>
        <div style={{
          flex: 1,
          height: '1px',
          background: 'var(--color-border-light)'
        }} />
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
        gap: 'var(--space-lg)'
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
            marginBottom: 'var(--space-md)'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              background: 'var(--color-success)',
              borderRadius: '50%'
            }} />
            <span style={{
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--color-success)'
            }}>
              Coming Soon
            </span>
          </div>

          <h3 style={{
            fontSize: isMobile ? '20px' : '26px',
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontWeight: 400,
            color: 'var(--color-text-secondary)',
            marginBottom: '12px',
            lineHeight: 1.2
          }}>
            Thoughts on AI × On-Chain
          </h3>

          <p style={{
            fontSize: '14px',
            color: 'var(--color-text-tertiary)',
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
            gap: 'var(--space-md)',
            flexWrap: 'wrap'
          }}>
            {['AI Agents', 'Smart Contracts', 'Product Thinking'].map((tag, i) => (
              <span key={i} style={{
                fontSize: '11px',
                fontWeight: 500,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: 'var(--color-text-muted)',
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
          background: 'linear-gradient(135deg, var(--color-background-secondary) 0%, var(--color-background-tertiary) 100%)',
          border: '1px solid var(--color-border-light)',
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
            color: 'var(--color-text-tertiary)'
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
                borderBottom: '1px solid var(--color-experience-border)',
                textDecoration: 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <div>
                <div style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  color: 'var(--color-text-secondary)',
                  marginBottom: '2px'
                }}>
                  {link.label}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: 'var(--color-text-muted)',
                  fontFamily: 'monospace'
                }}>
                  {('handle' in link) ? (link as { handle: string }).handle : ''}
                </div>
              </div>
              <span style={{
                color: 'var(--color-text-muted)',
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                transition: 'color 0.2s ease'
              }}>↗</span>
            </a>
          ))}

          {newsletter && !newsletter.enabled && (
            <div style={{
              marginTop: 'auto',
              padding: 'var(--space-md)',
              background: 'rgba(194, 154, 108, 0.05)',
              border: '1px dashed rgba(194, 154, 108, 0.15)',
              textAlign: 'center'
            }}>
              <span style={{
                fontSize: '12px',
                color: 'var(--color-text-tertiary)',
                fontStyle: 'italic',
                fontFamily: 'var(--font-serif)'
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
