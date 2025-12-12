import { certifications as certificationsData } from '../../lib/content';

interface CertificationsSectionProps {
  isMobile: boolean;
  sectionPadding: string;
}

export default function CertificationsSection({ isMobile, sectionPadding }: CertificationsSectionProps) {
  const { certifications } = certificationsData;

  return (
    <section style={{
      padding: sectionPadding,
      maxWidth: '1600px',
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
          Certifications
        </span>
        <div style={{
          flex: 1,
          height: '1px',
          background: 'var(--color-border-light)'
        }} />
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
        gap: 'var(--space-lg)'
      }}>
        {/* Featured Certifications */}
        {certifications.filter(cert => cert.featured).map((cert, index) => (
          <div key={index} style={{
            background: 'linear-gradient(135deg, var(--color-cert-bg-start) 0%, var(--color-cert-bg-end) 100%)',
            border: '1px solid var(--color-cert-border)',
            padding: isMobile ? '28px 24px' : '36px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Decorative corner */}
            <div style={{
              position: 'absolute',
              top: '-1px',
              right: '-1px',
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, transparent 50%, rgba(194, 154, 108, 0.15) 50%)'
            }} />

            <div style={{
              display: 'flex',
              gap: '20px',
              alignItems: 'flex-start'
            }}>
              {/* Badge icon */}
              <div style={{
                width: '56px',
                height: '56px',
                background: 'linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-hover) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <span style={{
                  fontSize: '24px',
                  color: 'var(--color-background)'
                }}>🎓</span>
              </div>

              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--color-accent)',
                  marginBottom: 'var(--space-sm)'
                }}>
                  {cert.name}
                </div>
                <h3 style={{
                  fontSize: isMobile ? '20px' : '24px',
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'italic',
                  fontWeight: 400,
                  color: 'var(--color-text-secondary)',
                  marginBottom: '12px',
                  lineHeight: 1.2
                }}>
                  {cert.issuer} Certification
                </h3>
                {cert.instructor && (
                  <p style={{
                    fontSize: '14px',
                    color: 'var(--color-text-tertiary)',
                    lineHeight: 1.6,
                    marginBottom: 'var(--space-md)'
                  }}>
                    Intensive AI PM program led by <strong style={{ color: 'var(--color-text-secondary)' }}>{cert.instructor}</strong>
                    {cert.instructorRole && `, ${cert.instructorRole}.`}
                  </p>
                )}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-md)',
                  flexWrap: 'wrap'
                }}>
                  <span style={{
                    fontSize: '12px',
                    color: 'var(--color-text-muted)'
                  }}>
                    Issued {cert.date}
                  </span>
                  {cert.url && (
                    <a
                      href={cert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: '12px',
                        fontWeight: 500,
                        color: 'var(--color-accent)',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'opacity 0.2s ease'
                      }}
                    >
                      Verify credential
                      <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>↗</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Placeholder for additional certification */}
        <div style={{
          background: 'linear-gradient(135deg, var(--color-background-secondary) 0%, var(--color-background-tertiary) 100%)',
          border: '1px dashed var(--color-border)',
          padding: isMobile ? '28px 24px' : '36px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'var(--space-md)',
          minHeight: '180px'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '1px dashed var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-text-muted)',
            fontSize: '20px'
          }}>
            +
          </div>
          <span style={{
            fontSize: '13px',
            color: 'var(--color-text-muted)',
            fontStyle: 'italic',
            fontFamily: 'var(--font-serif)'
          }}>
            More certifications coming soon
          </span>
        </div>
      </div>
    </section>
  );
}
