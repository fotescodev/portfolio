import { useTheme } from '../../context/ThemeContext';
import { caseStudies } from '../../lib/content';
import type { CaseStudy } from '../../types/portfolio';

interface CaseStudiesSectionProps {
  isMobile: boolean;
  isTablet: boolean;
  sectionPadding: string;
  hoveredCase: number | null;
  setHoveredCase: (id: number | null) => void;
  onCaseClick: (study: CaseStudy) => void;
}

export default function CaseStudiesSection({
  isMobile,
  isTablet,
  sectionPadding,
  hoveredCase,
  setHoveredCase,
  onCaseClick
}: CaseStudiesSectionProps) {
  const { colors, isDark } = useTheme();

  // Format case study number with leading zero
  const formatNumber = (id: number) => id.toString().padStart(2, '0');

  return (
    <section id="work" style={{
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
          Selected Work
        </span>
        <div style={{
          flex: 1,
          height: '1px',
          background: 'rgba(232, 230, 227, 0.08)'
        }} />
      </div>

      {/* Case study list */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: isMobile ? '48px' : '0'
      }}>
        {caseStudies.map((study, index) => (
          <div
            key={study.id}
            style={{
              borderTop: !isMobile && index === 0 ? '1px solid rgba(232, 230, 227, 0.1)' : 'none',
              borderBottom: !isMobile ? '1px solid rgba(232, 230, 227, 0.1)' : 'none',
              padding: isMobile ? '0' : '40px 0',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              background: hoveredCase === study.id ? 'rgba(194, 154, 108, 0.02)' : 'transparent'
            }}
            onMouseEnter={() => !isMobile && setHoveredCase(study.id)}
            onMouseLeave={() => !isMobile && setHoveredCase(null)}
          >
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : isTablet ? '200px 1fr' : '340px 1fr',
              gap: isMobile ? '24px' : isTablet ? '40px' : '56px',
              alignItems: 'start'
            }}>
              {/* Thumbnail */}
              <div style={{
                position: 'relative',
                aspectRatio: '4/3',
                background: 'linear-gradient(135deg, #141416 0%, #1a1a1c 100%)',
                border: '1px solid rgba(232, 230, 227, 0.06)',
                overflow: 'hidden',
                transition: 'all 0.4s ease'
              }}>
                {study.hook.thumbnail ? (
                  <>
                    <img
                      src={study.hook.thumbnail}
                      alt={study.hook.thumbnailAlt}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.4s ease',
                        transform: hoveredCase === study.id ? 'scale(1.03)' : 'scale(1)'
                      }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    {/* Number overlay */}
                    <div style={{
                      position: 'absolute',
                      top: '16px',
                      left: '16px',
                      fontFamily: "'Instrument Serif', Georgia, serif",
                      fontSize: '14px',
                      fontStyle: 'italic',
                      color: '#fff',
                      background: 'rgba(8, 8, 10, 0.7)',
                      padding: '6px 12px',
                      backdropFilter: 'blur(4px)'
                    }}>
                      {formatNumber(study.id)}
                    </div>
                  </>
                ) : null}
                {/* Placeholder - always visible as fallback */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  zIndex: study.hook.thumbnail ? -1 : 1
                }}>
                  <span style={{
                    fontFamily: "'Instrument Serif', Georgia, serif",
                    fontSize: isMobile ? '48px' : '56px',
                    fontStyle: 'italic',
                    color: '#2a2a2c',
                    lineHeight: 1
                  }}>
                    {formatNumber(study.id)}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
              }}>
                <div style={{
                  display: 'flex',
                  gap: '16px',
                  marginBottom: '14px',
                  flexWrap: 'wrap',
                  alignItems: 'center'
                }}>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: 500,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    color: colors.textTertiary
                  }}>{study.company}</span>
                  <span style={{
                    color: '#3a3a3c',
                    fontSize: '12px'
                  }}>—</span>
                  <span style={{
                    fontSize: '12px',
                    color: colors.textMuted
                  }}>{study.year}</span>
                </div>

                <h3 style={{
                  fontSize: isMobile ? '26px' : isTablet ? '32px' : '38px',
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  fontWeight: 400,
                  fontStyle: 'italic',
                  color: colors.textSecondary,
                  marginBottom: '14px',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.15,
                  transition: 'color 0.2s ease'
                }}>
                  {study.title}
                </h3>

                <p style={{
                  fontSize: '15px',
                  color: colors.textTertiary,
                  lineHeight: 1.65,
                  marginBottom: '20px',
                  maxWidth: '520px'
                }}>
                  {study.hook.headline}
                </p>

                {/* Metrics row */}
                <div style={{
                  display: 'flex',
                  gap: isMobile ? '16px' : '24px',
                  marginBottom: '20px',
                  flexWrap: 'wrap'
                }}>
                  {/* Primary metric (from hook.impactMetric) */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}>
                    <span style={{
                      fontSize: isMobile ? '24px' : '28px',
                      fontFamily: "'Instrument Serif', Georgia, serif",
                      fontWeight: 400,
                      color: '#c29a6c',
                      lineHeight: 1
                    }}>
                      {study.hook.impactMetric.value}
                    </span>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 500,
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      color: colors.textMuted
                    }}>
                      {study.hook.impactMetric.label}
                    </span>
                  </div>

                  {/* Sub metrics */}
                  {study.hook.subMetrics?.slice(0, isMobile ? 1 : 2).map((metric, i) => (
                    <div key={i} style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      paddingLeft: isMobile ? '16px' : '24px',
                      borderLeft: '1px solid rgba(232, 230, 227, 0.1)'
                    }}>
                      <span style={{
                        fontSize: isMobile ? '24px' : '28px',
                        fontFamily: "'Instrument Serif', Georgia, serif",
                        fontWeight: 400,
                        color: colors.textSecondary,
                        lineHeight: 1
                      }}>
                        {metric.value}
                      </span>
                      <span style={{
                        fontSize: '10px',
                        fontWeight: 500,
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                        color: colors.textMuted
                      }}>
                        {metric.label}
                      </span>
                    </div>
                  ))}
                </div>

                <div style={{
                  display: 'flex',
                  gap: '10px',
                  flexWrap: 'wrap',
                  marginTop: 'auto'
                }}>
                  {study.tags.map((tag, i) => (
                    <span key={i} style={{
                      fontSize: '11px',
                      fontWeight: 500,
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      color: colors.textMuted,
                      padding: '6px 12px',
                      border: `1px solid ${colors.border}`,
                      transition: 'all 0.2s ease',
                      background: hoveredCase === study.id ? (isDark ? 'rgba(194, 154, 108, 0.05)' : 'rgba(138, 102, 66, 0.05)') : 'transparent'
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Read more - opens modal */}
                <div
                  onClick={() => onCaseClick(study)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginTop: '24px',
                    color: hoveredCase === study.id ? colors.accent : colors.textMuted,
                    transition: 'color 0.2s ease',
                    cursor: 'pointer'
                  }}
                >
                  <span style={{
                    fontSize: '13px',
                    fontWeight: 500,
                    letterSpacing: '0.02em'
                  }}>
                    Read case study
                  </span>
                  <span style={{
                    transform: hoveredCase === study.id ? 'translateX(4px)' : 'translateX(0)',
                    transition: 'transform 0.2s ease',
                    fontFamily: "'Instrument Serif', serif",
                    fontStyle: 'italic'
                  }}>→</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
