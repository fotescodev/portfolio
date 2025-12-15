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
  // Format case study number with leading zero
  const formatNumber = (id: number) => id.toString().padStart(2, '0');

  return (
    <section id="work" style={{
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
          Selected Work
        </span>
        <div style={{
          flex: 1,
          height: '1px',
          background: 'var(--color-border-light)'
        }} />
      </div>

      {/* Case study list */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: isMobile ? 'var(--space-2xl)' : '0'
      }}>
        {caseStudies.map((study, index) => (
          <div
            key={study.id}
            style={{
              borderTop: !isMobile && index === 0 ? '1px solid var(--color-border)' : 'none',
              borderBottom: !isMobile ? '1px solid var(--color-border)' : 'none',
              padding: isMobile ? '0' : '40px 0',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              background: hoveredCase === study.id ? 'var(--color-card-hover)' : 'transparent'
            }}
            onMouseEnter={() => !isMobile && setHoveredCase(study.id)}
            onMouseLeave={() => !isMobile && setHoveredCase(null)}
          >
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : isTablet ? '200px 1fr' : '340px 1fr',
              gap: isMobile ? 'var(--space-lg)' : isTablet ? '40px' : '56px',
              alignItems: 'start'
            }}>
              {/* Thumbnail */}
              <div style={{
                position: 'relative',
                aspectRatio: '4/3',
                background: 'linear-gradient(135deg, var(--color-thumbnail-bg-start) 0%, var(--color-thumbnail-bg-end) 100%)',
                border: '1px solid var(--color-border-light)',
                overflow: 'hidden',
                transition: 'all 0.4s ease'
              }}>
                {study.hook.thumbnail ? (
                  <>
                    <img
                      src={study.hook.thumbnail}
                      alt={`${study.title} case study`}
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
                      top: 'var(--space-md)',
                      left: 'var(--space-md)',
                      fontFamily: 'var(--font-serif)',
                      fontSize: '14px',
                      fontStyle: 'italic',
                      color: 'var(--color-overlay-text)',
                      background: 'var(--color-overlay-dark)',
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
                  gap: 'var(--space-sm)',
                  zIndex: study.hook.thumbnail ? -1 : 1
                }}>
                  <span style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: isMobile ? '48px' : '56px',
                    fontStyle: 'italic',
                    color: 'var(--color-placeholder-text)',
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
                  gap: 'var(--space-md)',
                  marginBottom: '14px',
                  flexWrap: 'wrap',
                  alignItems: 'center'
                }}>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: 500,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    color: 'var(--color-text-tertiary)'
                  }}>{study.company}</span>
                  <span style={{
                    color: 'var(--color-separator)',
                    fontSize: '12px'
                  }}>—</span>
                  <span style={{
                    fontSize: '12px',
                    color: 'var(--color-text-muted)'
                  }}>{study.year}</span>
                </div>

                <h3 style={{
                  fontSize: isMobile ? '26px' : isTablet ? '32px' : '38px',
                  fontFamily: 'var(--font-serif)',
                  fontWeight: 400,
                  fontStyle: 'italic',
                  color: 'var(--color-text-secondary)',
                  marginBottom: '14px',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.15,
                  transition: 'color 0.2s ease'
                }}>
                  {study.title}
                </h3>

                <p style={{
                  fontSize: '15px',
                  color: 'var(--color-text-tertiary)',
                  lineHeight: 1.65,
                  marginBottom: '20px',
                  maxWidth: '520px'
                }}>
                  {study.hook.headline}
                </p>

                {/* Metrics row */}
                <div style={{
                  display: 'flex',
                  gap: isMobile ? 'var(--space-md)' : 'var(--space-lg)',
                  marginBottom: '20px',
                  flexWrap: 'wrap'
                }}>
                  {/* Primary metric (from hook.impactMetric) */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-xs)'
                  }}>
                    <span style={{
                      fontSize: isMobile ? '24px' : '28px',
                      fontFamily: 'var(--font-serif)',
                      fontWeight: 400,
                      color: 'var(--color-accent)',
                      lineHeight: 1
                    }}>
                      {study.hook.impactMetric.value}
                    </span>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 500,
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      color: 'var(--color-text-muted)'
                    }}>
                      {study.hook.impactMetric.label}
                    </span>
                  </div>

                  {/* Sub metrics */}
                  {study.hook.subMetrics?.slice(0, isMobile ? 1 : 2).map((metric, i) => (
                    <div key={i} style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 'var(--space-xs)',
                      paddingLeft: isMobile ? 'var(--space-md)' : 'var(--space-lg)',
                      borderLeft: '1px solid var(--color-border)'
                    }}>
                      <span style={{
                        fontSize: isMobile ? '24px' : '28px',
                        fontFamily: 'var(--font-serif)',
                        fontWeight: 400,
                        color: 'var(--color-text-secondary)',
                        lineHeight: 1
                      }}>
                        {metric.value}
                      </span>
                      <span style={{
                        fontSize: '10px',
                        fontWeight: 500,
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                        color: 'var(--color-text-muted)'
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
                      color: 'var(--color-text-muted)',
                      padding: '6px 12px',
                      border: '1px solid var(--color-border)',
                      transition: 'all 0.2s ease',
                      background: hoveredCase === study.id ? 'var(--color-tag-hover)' : 'transparent'
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
                    gap: 'var(--space-sm)',
                    marginTop: 'var(--space-lg)',
                    color: hoveredCase === study.id ? 'var(--color-accent)' : 'var(--color-text-muted)',
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
                    fontFamily: 'var(--font-serif)',
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
