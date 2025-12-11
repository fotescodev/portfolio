import { useTheme } from '../../context/ThemeContext';
import { certifications as certificationsData } from '../../lib/content';

interface CertificationsSectionProps {
  isMobile: boolean;
  sectionPadding: string;
}

export default function CertificationsSection({ isMobile, sectionPadding }: CertificationsSectionProps) {
  const { colors } = useTheme();
  const { certifications } = certificationsData;

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
          Certifications
        </span>
        <div style={{
          flex: 1,
          height: '1px',
          background: 'rgba(232, 230, 227, 0.08)'
        }} />
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
        gap: '24px'
      }}>
        {/* Featured Certifications */}
        {certifications.filter(cert => cert.featured).map((cert, index) => (
          <div key={index} style={{
            background: 'linear-gradient(135deg, rgba(194, 154, 108, 0.08) 0%, rgba(194, 154, 108, 0.02) 100%)',
            border: '1px solid rgba(194, 154, 108, 0.2)',
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
                background: 'linear-gradient(135deg, #c29a6c 0%, #a67c4e 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <span style={{
                  fontSize: '24px',
                  color: '#08080a'
                }}>🎓</span>
              </div>

              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#c29a6c',
                  marginBottom: '8px'
                }}>
                  {cert.name}
                </div>
                <h3 style={{
                  fontSize: isMobile ? '20px' : '24px',
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  fontStyle: 'italic',
                  fontWeight: 400,
                  color: colors.textSecondary,
                  marginBottom: '12px',
                  lineHeight: 1.2
                }}>
                  {cert.issuer} Certification
                </h3>
                {cert.instructor && (
                  <p style={{
                    fontSize: '14px',
                    color: '#8a8885',
                    lineHeight: 1.6,
                    marginBottom: '16px'
                  }}>
                    Intensive AI PM program led by <strong style={{ color: colors.textSecondary }}>{cert.instructor}</strong>
                    {cert.instructorRole && `, ${cert.instructorRole}.`}
                  </p>
                )}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  flexWrap: 'wrap'
                }}>
                  <span style={{
                    fontSize: '12px',
                    color: colors.textMuted
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
                        color: '#c29a6c',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'opacity 0.2s ease'
                      }}
                    >
                      Verify credential
                      <span style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}>↗</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Placeholder for additional certification */}
        <div style={{
          background: 'linear-gradient(135deg, #141416 0%, #1a1a1c 100%)',
          border: '1px dashed rgba(232, 230, 227, 0.1)',
          padding: isMobile ? '28px 24px' : '36px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          minHeight: '180px'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '1px dashed rgba(232, 230, 227, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#3a3a3c',
            fontSize: '20px'
          }}>
            +
          </div>
          <span style={{
            fontSize: '13px',
            color: '#3a3a3c',
            fontStyle: 'italic',
            fontFamily: "'Instrument Serif', Georgia, serif"
          }}>
            More certifications coming soon
          </span>
        </div>
      </div>
    </section>
  );
}
