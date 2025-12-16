import { certifications as certificationsData } from '../../lib/content';
import type { Profile } from '../../types/variant';

interface CertificationsSectionProps {
  profile: Profile;
  isMobile: boolean;
  isTablet: boolean;
  sectionPadding: string;
  showOnchainIdentity?: boolean;
}

function formatCompletionDate(date: string) {
  // Handle simple year strings like "2024"
  if (/^\d{4}$/.test(date)) {
    return date;
  }
  // Handle season + year formats like "Winter 2025"
  if (/^(Winter|Spring|Summer|Fall)\s+\d{4}$/i.test(date)) {
    return date;
  }
  try {
    return new Date(date).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short'
    });
  } catch {
    return date;
  }
}

export default function CertificationsSection({
  profile,
  isMobile,
  isTablet,
  sectionPadding,
  showOnchainIdentity
}: CertificationsSectionProps) {
  const shouldShowOnchain = showOnchainIdentity ?? profile.sections.onchainIdentity;
  const { certifications, credentials, onchainIdentity } = certificationsData;

  return (
    <section
      id="certifications"
      style={{
        padding: sectionPadding,
        maxWidth: 'var(--layout-max-width)',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1
      }}
    >
      {/* Section label */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-lg)',
          marginBottom: isMobile ? 'var(--space-xl)' : 'calc(var(--space-xl) + var(--space-sm))'
        }}
      >
        <span
          style={{
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--color-text-muted)'
          }}
        >
          Credentials
        </span>
        <div style={{ flex: 1, height: '1px', background: 'var(--color-border-light)' }} />
      </div>

      {/* Section header */}
      <div style={{ marginBottom: isMobile ? 'var(--space-xl)' : 'var(--space-2xl)' }}>
        <h2
          style={{
            fontSize: isMobile ? '28px' : isTablet ? '36px' : '42px',
            fontFamily: 'var(--font-serif)',
            fontWeight: 400,
            fontStyle: 'italic',
            color: 'var(--color-text-primary)',
            marginBottom: 'var(--space-md)',
            letterSpacing: '-0.02em',
            lineHeight: 1.2
          }}
        >
          Signals of craft
        </h2>
        <p
          style={{
            fontSize: '15px',
            color: 'var(--color-text-tertiary)',
            maxWidth: '760px',
            lineHeight: 1.6
          }}
        >
          A mix of formal training, hands-on certifications, and verifiable identity across platforms.
        </p>
      </div>

      {/* Certifications - Clean list style */}
      <div style={{ marginBottom: 'var(--space-2xl)' }}>
        {certifications.map((cert, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: isMobile ? 'flex-start' : 'baseline',
              gap: isMobile ? 'var(--space-sm)' : 'var(--space-xl)',
              padding: 'var(--space-lg) 0',
              borderBottom: index < certifications.length - 1 ? '1px solid var(--color-border-light)' : 'none'
            }}
          >
            {/* Date column */}
            <div
              style={{
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--color-text-muted)',
                minWidth: isMobile ? 'auto' : '120px',
                flexShrink: 0
              }}
            >
              {formatCompletionDate(cert.date)}
            </div>

            {/* Main content */}
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: isMobile ? 'column' : 'row',
                  alignItems: isMobile ? 'flex-start' : 'baseline',
                  gap: isMobile ? 'var(--space-xs)' : 'var(--space-md)',
                  marginBottom: cert.instructor ? 'var(--space-sm)' : 0
                }}
              >
                <h3
                  style={{
                    fontSize: isMobile ? '18px' : '20px',
                    fontFamily: 'var(--font-serif)',
                    fontWeight: 400,
                    fontStyle: 'italic',
                    color: 'var(--color-text-primary)',
                    margin: 0
                  }}
                >
                  {cert.name}
                </h3>
                <span
                  style={{
                    fontSize: '13px',
                    color: 'var(--color-text-muted)'
                  }}
                >
                  {cert.issuer}
                </span>
              </div>

              {cert.instructor && (
                <p
                  style={{
                    fontSize: '13px',
                    color: 'var(--color-text-tertiary)',
                    lineHeight: 1.5,
                    margin: 0,
                    maxWidth: '600px'
                  }}
                >
                  Led by <span style={{ color: 'var(--color-text-secondary)' }}>{cert.instructor}</span>
                  {cert.instructorRole && ` — ${cert.instructorRole}`}
                </p>
              )}
            </div>

            {/* Verify link */}
            {cert.url && (
              <a
                href={cert.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: 'var(--color-accent)',
                  textDecoration: 'none',
                  flexShrink: 0,
                  marginTop: isMobile ? 'var(--space-sm)' : 0
                }}
              >
                Verify ↗
              </a>
            )}
          </div>
        ))}
      </div>

      {/* Highlights - Horizontal badges */}
      <div
        style={{
          padding: 'var(--space-xl) 0',
          borderTop: '1px solid var(--color-border-light)',
          borderBottom: shouldShowOnchain ? 'none' : '1px solid var(--color-border-light)'
        }}
      >
        <div
          style={{
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--color-text-muted)',
            marginBottom: 'var(--space-lg)'
          }}
        >
          Highlights
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: isMobile ? 'var(--space-md)' : 'var(--space-xl)'
          }}
        >
          {credentials.map((cred, index) => (
            <div
              key={index}
              style={{
                minWidth: isMobile ? '100%' : 'auto'
              }}
            >
              <div
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--color-text-muted)',
                  marginBottom: 'var(--space-xs)'
                }}
              >
                {cred.label}
              </div>
              {cred.url ? (
                <a
                  href={cred.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: '14px',
                    color: 'var(--color-text-primary)',
                    textDecoration: 'none'
                  }}
                >
                  {cred.value} <span style={{ color: 'var(--color-accent)' }}>↗</span>
                </a>
              ) : (
                <div style={{ fontSize: '14px', color: 'var(--color-text-primary)' }}>{cred.value}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* On-chain identity - Compact footer style */}
      {shouldShowOnchain && (
        <div
          style={{
            padding: 'var(--space-lg) 0',
            borderTop: '1px solid var(--color-border-light)',
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'flex-start' : 'center',
            gap: 'var(--space-lg)',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--color-text-muted)'
              }}
            >
              On-chain
            </span>
            <span
              style={{
                fontSize: '15px',
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-mono)',
                fontWeight: 500
              }}
            >
              {onchainIdentity.ens}
            </span>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
            {onchainIdentity.links.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  color: 'var(--color-text-tertiary)',
                  textDecoration: 'none'
                }}
              >
                {link.name} ↗
              </a>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
