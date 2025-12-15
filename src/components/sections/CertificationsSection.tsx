import { certifications as certificationsData, profile } from '../../lib/content';

interface CertificationsSectionProps {
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
  isMobile,
  isTablet,
  sectionPadding,
  showOnchainIdentity = profile.sections.onchainIdentity
}: CertificationsSectionProps) {
  const { certifications, credentials, onchainIdentity } = certificationsData;

  const featured = certifications.filter((c) => c.featured);
  const other = certifications.filter((c) => !c.featured);

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

      {/* Two-column layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1.5fr 0.5fr',
          gap: isMobile ? 'var(--space-xl)' : 'var(--space-2xl)'
        }}
      >
        {/* Left: Certifications */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          {featured.map((cert, index) => (
            <div
              key={index}
              style={{
                position: 'relative',
                padding: isMobile ? 'var(--space-xl)' : 'var(--space-2xl)',
                border: '1px solid var(--color-border-light)',
                background:
                  'linear-gradient(135deg, var(--color-background-secondary) 0%, var(--color-background-tertiary) 100%)'
              }}
            >
              {/* Decorative corner */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  top: 'var(--space-md)',
                  right: 'var(--space-md)',
                  width: '48px',
                  height: '48px',
                  background: 'var(--color-accent)',
                  opacity: 0.12,
                  filter: 'blur(14px)'
                }}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-lg)' }}>
                <div style={{ display: 'flex', gap: 'var(--space-lg)', flex: 1 }}>
                  {/* Logo */}
                  {cert.logo && (
                    <div style={{
                      width: '48px',
                      height: '48px',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <img
                        src={cert.logo}
                        alt={`${cert.issuer} logo`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain'
                        }}
                        onError={(e) => {
                          // Hide image if it fails to load
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  <div>
                    <h3
                      style={{
                        fontSize: '20px',
                        fontFamily: 'var(--font-serif)',
                        fontWeight: 400,
                        fontStyle: 'italic',
                        color: 'var(--color-text-primary)',
                        marginBottom: 'var(--space-xs)'
                      }}
                    >
                      {cert.name}
                    </h3>
                    <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: 'var(--space-md)' }}>
                      {cert.issuer} · Completed {formatCompletionDate(cert.date)}
                    </div>
                    {cert.instructor && (
                      <p style={{ fontSize: '14px', color: 'var(--color-text-tertiary)', lineHeight: 1.6 }}>
                        Intensive AI PM program led by <strong style={{ color: 'var(--color-text-secondary)' }}>{cert.instructor}</strong>
                        {cert.instructorRole && `, ${cert.instructorRole}.`}
                      </p>
                    )}
                  </div>
                </div>

                {cert.url && (
                  <a
                    href={cert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      alignSelf: 'flex-start',
                      padding: '8px 14px',
                      border: '1px solid var(--color-border-light)',
                      textDecoration: 'none',
                      fontSize: '12px',
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      color: 'var(--color-text-primary)'
                    }}
                  >
                    Verify ↗
                  </a>
                )}
              </div>

              {cert.credentialId && (
                <div
                  style={{
                    marginTop: 'var(--space-lg)',
                    fontSize: '12px',
                    color: 'var(--color-text-muted)'
                  }}
                >
                  Credential ID: <span style={{ color: 'var(--color-text-tertiary)' }}>{cert.credentialId}</span>
                </div>
              )}
            </div>
          ))}

          {other.length > 0 && (
            <div
              style={{
                padding: isMobile ? 'var(--space-lg)' : 'var(--space-xl)',
                border: '1px solid var(--color-border-light)',
                background: 'var(--color-background-secondary)'
              }}
            >
              <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-md)' }}>
                Other certifications
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                {other.map((cert, index) => (
                  <div key={index} style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-lg)' }}>
                    <div style={{ color: 'var(--color-text-primary)', fontSize: '13px', fontWeight: 600 }}>{cert.name}</div>
                    <div style={{ color: 'var(--color-text-muted)', fontSize: '12px' }}>{cert.issuer}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Highlights */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          <div
            style={{
              padding: isMobile ? 'var(--space-lg)' : 'var(--space-xl)',
              border: '1px solid var(--color-border-light)',
              background: 'var(--color-background-secondary)'
            }}
          >
            <div
              style={{
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--color-text-muted)',
                marginBottom: 'var(--space-md)'
              }}
            >
              Highlights
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              {credentials.map((cred, index) => (
                <div key={index}>
                  <div
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      letterSpacing: '0.12em',
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
                      style={{ fontSize: '13px', color: 'var(--color-text-primary)', textDecoration: 'none' }}
                    >
                      {cred.value} ↗
                    </a>
                  ) : (
                    <div style={{ fontSize: '13px', color: 'var(--color-text-primary)' }}>{cred.value}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {showOnchainIdentity && (
            <div
              style={{
                padding: isMobile ? 'var(--space-lg)' : 'var(--space-xl)',
                border: '1px solid var(--color-border-light)',
                background: 'var(--color-background-secondary)'
              }}
            >
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--color-text-muted)',
                  marginBottom: 'var(--space-md)'
                }}
              >
                On-chain identity
              </div>

              <div
                style={{
                  fontSize: '13px',
                  color: 'var(--color-text-primary)',
                  fontWeight: 700,
                  marginBottom: 'var(--space-xs)'
                }}
              >
                {onchainIdentity.ens}
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)', marginTop: 'var(--space-md)' }}>
                {onchainIdentity.links.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: '8px 12px',
                      border: '1px solid var(--color-border-light)',
                      textDecoration: 'none',
                      fontSize: '12px',
                      fontWeight: 700,
                      color: 'var(--color-text-tertiary)',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase'
                    }}
                  >
                    {link.name} ↗
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
