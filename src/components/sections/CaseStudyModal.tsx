import { useTheme } from '../../context/ThemeContext';
import type { CaseStudy } from '../../types/portfolio';

interface CaseStudyModalProps {
  caseStudy: CaseStudy;
  allCaseStudies: CaseStudy[];
  onClose: () => void;
  onNavigate: (caseStudy: CaseStudy) => void;
  isMobile: boolean;
}

export default function CaseStudyModal({
  caseStudy,
  allCaseStudies,
  onClose,
  onNavigate,
  isMobile
}: CaseStudyModalProps) {
  const { colors, isDark } = useTheme();

  const currentIndex = allCaseStudies.findIndex(c => c.id === caseStudy.id);
  const prevStudy = currentIndex > 0 ? allCaseStudies[currentIndex - 1] : null;
  const nextStudy = currentIndex < allCaseStudies.length - 1 ? allCaseStudies[currentIndex + 1] : null;

  const getCtaLink = (action: string): string => {
    switch (action) {
      case 'calendly':
        return 'https://calendly.com/dmitriifotesco';
      case 'linkedin':
        return 'https://www.linkedin.com/in/0xdmitri/';
      case 'contact':
      default:
        return 'mailto:dmitrii.fotesco@gmail.com';
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        background: colors.background,
        animation: 'modalSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      <style>{`
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .modal-scroll::-webkit-scrollbar { width: 6px; }
        .modal-scroll::-webkit-scrollbar-track { background: transparent; }
        .modal-scroll::-webkit-scrollbar-thumb { background: ${colors.scrollbarThumb}; border-radius: 3px; }
        .modal-scroll { scrollbar-width: thin; scrollbar-color: ${colors.scrollbarThumb} transparent; }
      `}</style>

      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: isMobile ? '16px 20px' : '20px 48px',
        borderBottom: `1px solid ${colors.borderLight}`,
        background: colors.background,
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <button
          onClick={onClose}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'none',
            border: 'none',
            color: colors.textMuted,
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
            padding: 0
          }}
        >
          <span style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}>←</span>
          Back
        </button>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: colors.textMuted,
            width: '32px',
            height: '32px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px'
          }}
        >
          ×
        </button>
      </div>

      {/* Content */}
      <div
        className="modal-scroll"
        style={{
          flex: 1,
          overflowY: 'auto'
        }}
      >
        {/* Hero area with image */}
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: isMobile ? '32px 20px' : '48px 48px 0'
        }}>
          {/* Meta line */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '16px',
            fontSize: '13px',
            color: colors.textMuted
          }}>
            <span style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}>
              {String(caseStudy.id).padStart(2, '0')}
            </span>
            <span>·</span>
            <span>{caseStudy.company}</span>
            <span>·</span>
            <span>{caseStudy.year}</span>
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: isMobile ? '32px' : '44px',
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontWeight: 400,
            fontStyle: 'italic',
            color: colors.textPrimary,
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
            margin: '0 0 24px 0',
            maxWidth: '700px'
          }}>
            {caseStudy.title}
          </h1>

          {/* Role + Team + Duration - single line */}
          <p style={{
            fontSize: '15px',
            color: colors.textTertiary,
            margin: '0 0 40px 0'
          }}>
            <span style={{ color: colors.accent }}>{caseStudy.context.myRole}</span>
            <span style={{ color: colors.textMuted }}> · {caseStudy.context.teamSize} · {caseStudy.context.duration}</span>
          </p>
        </div>

        {/* Metrics bar - full width subtle background */}
        <div style={{
          background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
          padding: isMobile ? '32px 20px' : '40px 48px',
          marginBottom: '48px'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            gap: isMobile ? '40px' : '64px',
            flexWrap: 'wrap'
          }}>
            <div>
              <div style={{
                fontSize: isMobile ? '32px' : '40px',
                fontFamily: "'Instrument Serif', Georgia, serif",
                color: colors.accent,
                lineHeight: 1
              }}>{caseStudy.hook.impactMetric.value}</div>
              <div style={{
                fontSize: '11px',
                fontWeight: 500,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: colors.textMuted,
                marginTop: '8px'
              }}>{caseStudy.hook.impactMetric.label}</div>
            </div>
            {caseStudy.hook.subMetrics?.map((metric, i) => (
              <div key={i}>
                <div style={{
                  fontSize: isMobile ? '32px' : '40px',
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  color: colors.textSecondary,
                  lineHeight: 1
                }}>{metric.value}</div>
                <div style={{
                  fontSize: '11px',
                  fontWeight: 500,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: colors.textMuted,
                  marginTop: '8px'
                }}>{metric.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Main content - narrower for readability */}
        <div style={{
          maxWidth: '680px',
          margin: '0 auto',
          padding: isMobile ? '0 20px 64px' : '0 48px 80px'
        }}>

          {/* THE STORY */}
          {/* Challenge */}
          <p style={{
            fontSize: '17px',
            color: colors.textSecondary,
            lineHeight: 1.85,
            margin: '0 0 32px 0'
          }}>
            {caseStudy.problem.businessContext}
          </p>

          {/* Stakes as accent quote */}
          <div style={{
            margin: '0 0 48px 0',
            padding: '0 0 0 20px',
            borderLeft: `2px solid ${colors.accent}`
          }}>
            <p style={{
              fontSize: '15px',
              color: colors.textTertiary,
              lineHeight: 1.75,
              margin: 0,
              fontStyle: 'italic'
            }}>
              {caseStudy.problem.stakes}
            </p>
          </div>

          {/* Approach */}
          <p style={{
            fontSize: '17px',
            color: colors.textSecondary,
            lineHeight: 1.85,
            margin: '0 0 24px 0'
          }}>
            {caseStudy.approach.hypothesis}
          </p>

          <p style={{
            fontSize: '17px',
            color: colors.textSecondary,
            lineHeight: 1.85,
            margin: '0 0 56px 0'
          }}>
            <strong style={{ color: colors.textPrimary, fontWeight: 500 }}>Solution:</strong> {caseStudy.approach.chosenPath}
          </p>

          {/* KEY DECISION */}
          <div style={{
            margin: '0 0 56px 0',
            padding: '28px',
            background: isDark ? 'rgba(194, 154, 108, 0.06)' : 'rgba(194, 154, 108, 0.08)',
            borderLeft: `3px solid ${colors.accent}`
          }}>
            <div style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: colors.accent,
              marginBottom: '12px'
            }}>Key Decision</div>
            <div style={{
              fontSize: '18px',
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontStyle: 'italic',
              color: colors.textPrimary,
              marginBottom: '12px'
            }}>{caseStudy.execution.keyDecision.title}</div>
            <p style={{
              fontSize: '15px',
              color: colors.textTertiary,
              lineHeight: 1.7,
              margin: 0
            }}>
              {caseStudy.execution.keyDecision.decision}
              <span style={{ color: colors.textSecondary }}> → {caseStudy.execution.keyDecision.outcome}</span>
            </p>
          </div>

          {/* EXECUTION - Clean timeline */}
          <div style={{ margin: '0 0 56px 0' }}>
            <h2 style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: colors.textMuted,
              margin: '0 0 24px 0'
            }}>How we executed</h2>

            {caseStudy.execution.phases.map((phase, i) => (
              <div key={i} style={{
                display: 'flex',
                gap: '16px',
                marginBottom: '20px'
              }}>
                <div style={{
                  width: '2px',
                  background: i === 0 ? colors.accent : colors.borderLight,
                  flexShrink: 0
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '12px',
                    marginBottom: '8px'
                  }}>
                    <span style={{ fontSize: '15px', fontWeight: 500, color: colors.textSecondary }}>
                      {phase.name}
                    </span>
                    {phase.duration && (
                      <span style={{ fontSize: '12px', color: colors.textMuted }}>
                        {phase.duration}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '14px', color: colors.textTertiary, lineHeight: 1.65 }}>
                    {phase.actions.join(' · ')}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* RESULTS - Inline format */}
          <div style={{ margin: '0 0 56px 0' }}>
            <h2 style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: colors.textMuted,
              margin: '0 0 20px 0'
            }}>Results</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '16px', color: colors.textSecondary }}>
                <span style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', color: colors.accent }}>
                  {caseStudy.results.primary.metric}
                </span>
                <span style={{ color: colors.textMuted }}> — </span>
                <span style={{ color: colors.textTertiary }}>{caseStudy.results.primary.context}</span>
              </div>

              {caseStudy.results.secondary && (
                <div style={{ fontSize: '16px', color: colors.textSecondary }}>
                  <span style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}>
                    {caseStudy.results.secondary.metric}
                  </span>
                  <span style={{ color: colors.textMuted }}> — </span>
                  <span style={{ color: colors.textTertiary }}>{caseStudy.results.secondary.context}</span>
                </div>
              )}

              {caseStudy.results.tertiary && (
                <div style={{ fontSize: '16px', color: colors.textSecondary }}>
                  <span style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}>
                    {caseStudy.results.tertiary.metric}
                  </span>
                  <span style={{ color: colors.textMuted }}> — </span>
                  <span style={{ color: colors.textTertiary }}>{caseStudy.results.tertiary.context}</span>
                </div>
              )}
            </div>

            {caseStudy.results.qualitative && (
              <p style={{
                fontSize: '15px',
                color: colors.textTertiary,
                lineHeight: 1.7,
                marginTop: '20px',
                fontStyle: 'italic'
              }}>{caseStudy.results.qualitative}</p>
            )}
          </div>

          {/* LESSON LEARNED - Featured quote */}
          <div style={{
            margin: '0 0 56px 0',
            padding: '24px 28px',
            background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'
          }}>
            <div style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: colors.textMuted,
              marginBottom: '12px'
            }}>Key Lesson</div>
            <p style={{
              fontSize: '17px',
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontStyle: 'italic',
              color: colors.textSecondary,
              lineHeight: 1.6,
              margin: 0
            }}>
              "{caseStudy.reflection.lessonLearned}"
            </p>
          </div>

          {/* REFLECTION - Compact two-column */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: '24px',
            margin: '0 0 56px 0'
          }}>
            <div>
              <div style={{
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#4ade80',
                marginBottom: '12px'
              }}>What worked</div>
              {caseStudy.reflection.whatWorked.map((item, i) => (
                <p key={i} style={{
                  fontSize: '14px',
                  color: colors.textTertiary,
                  lineHeight: 1.6,
                  margin: '0 0 8px 0'
                }}>• {item}</p>
              ))}
            </div>
            <div>
              <div style={{
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#ef4444',
                marginBottom: '12px'
              }}>What didn't</div>
              {caseStudy.reflection.whatDidnt.map((item, i) => (
                <p key={i} style={{
                  fontSize: '14px',
                  color: colors.textTertiary,
                  lineHeight: 1.6,
                  margin: '0 0 8px 0'
                }}>• {item}</p>
              ))}
            </div>
          </div>

          {/* TESTIMONIAL */}
          {caseStudy.evidence.testimonial && (
            <div style={{
              margin: '0 0 56px 0',
              padding: '28px',
              background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
              borderLeft: `2px solid ${colors.borderLight}`
            }}>
              <p style={{
                fontSize: '16px',
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontStyle: 'italic',
                color: colors.textSecondary,
                lineHeight: 1.7,
                margin: '0 0 16px 0'
              }}>
                "{caseStudy.evidence.testimonial.quote}"
              </p>
              <div style={{ fontSize: '13px', color: colors.textMuted }}>
                — {caseStudy.evidence.testimonial.author}, {caseStudy.evidence.testimonial.role}
              </div>
            </div>
          )}

          {/* FOOTER META - Tech + Links + Constraints */}
          <div style={{
            paddingTop: '32px',
            borderTop: `1px solid ${colors.borderLight}`,
            fontSize: '13px',
            color: colors.textMuted,
            lineHeight: 1.8
          }}>
            {/* Evidence links */}
            {(caseStudy.evidence.blogPostUrl || caseStudy.evidence.githubUrl || caseStudy.evidence.demoUrl) && (
              <div style={{ marginBottom: '16px' }}>
                {caseStudy.evidence.blogPostUrl && (
                  <a href={caseStudy.evidence.blogPostUrl} target="_blank" rel="noopener noreferrer"
                    style={{ color: colors.textTertiary, marginRight: '20px', textDecoration: 'none' }}>
                    Read blog post ↗
                  </a>
                )}
                {caseStudy.evidence.githubUrl && (
                  <a href={caseStudy.evidence.githubUrl} target="_blank" rel="noopener noreferrer"
                    style={{ color: colors.textTertiary, marginRight: '20px', textDecoration: 'none' }}>
                    View code ↗
                  </a>
                )}
                {caseStudy.evidence.demoUrl && (
                  <a href={caseStudy.evidence.demoUrl} target="_blank" rel="noopener noreferrer"
                    style={{ color: colors.textTertiary, textDecoration: 'none' }}>
                    View demo ↗
                  </a>
                )}
              </div>
            )}

            {/* Tech stack inline */}
            <div style={{ marginBottom: '8px' }}>
              <strong>Stack:</strong> {caseStudy.techStack.join(', ')}
            </div>

            {/* Constraints inline */}
            <div>
              <strong>Constraints:</strong> {caseStudy.problem.constraints.join(' · ')}
            </div>
          </div>

          {/* CTA */}
          <div style={{
            marginTop: '56px',
            padding: '40px 32px',
            background: isDark ? 'rgba(194, 154, 108, 0.05)' : 'rgba(194, 154, 108, 0.07)',
            textAlign: 'center'
          }}>
            <h3 style={{
              fontSize: '22px',
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontStyle: 'italic',
              color: colors.textSecondary,
              margin: '0 0 8px 0',
              fontWeight: 400
            }}>{caseStudy.cta.headline}</h3>
            {caseStudy.cta.subtext && (
              <p style={{
                fontSize: '14px',
                color: colors.textMuted,
                margin: '0 0 20px 0'
              }}>{caseStudy.cta.subtext}</p>
            )}
            <a
              href={getCtaLink(caseStudy.cta.action)}
              target={caseStudy.cta.action !== 'contact' ? '_blank' : undefined}
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                padding: '12px 28px',
                background: colors.accent,
                color: '#08080a',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 600
              }}
            >
              {caseStudy.cta.linkText}
            </a>
          </div>

          {/* NAV */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '48px',
            paddingTop: '24px',
            borderTop: `1px solid ${colors.borderLight}`,
            gap: '24px'
          }}>
            {prevStudy ? (
              <button
                onClick={() => onNavigate(prevStudy)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  padding: 0
                }}
              >
                <div style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: colors.textMuted, marginBottom: '4px' }}>
                  ← Previous
                </div>
                <div style={{ fontSize: '15px', fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', color: colors.textSecondary }}>
                  {prevStudy.title}
                </div>
              </button>
            ) : <div />}

            {nextStudy ? (
              <button
                onClick={() => onNavigate(nextStudy)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'right',
                  padding: 0
                }}
              >
                <div style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: colors.textMuted, marginBottom: '4px' }}>
                  Next →
                </div>
                <div style={{ fontSize: '15px', fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', color: colors.textSecondary }}>
                  {nextStudy.title}
                </div>
              </button>
            ) : <div />}
          </div>
        </div>
      </div>
    </div>
  );
}
