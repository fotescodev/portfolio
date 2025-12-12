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
        background: 'var(--color-background)',
        animation: 'modalSlideUp 0.4s var(--ease-smooth)'
      }}
    >
      <style>{`
        .modal-scroll::-webkit-scrollbar { width: 6px; }
        .modal-scroll::-webkit-scrollbar-track { background: transparent; }
        .modal-scroll::-webkit-scrollbar-thumb { background: var(--color-scrollbar-thumb); border-radius: 3px; }
        .modal-scroll { scrollbar-width: thin; scrollbar-color: var(--color-scrollbar-thumb) transparent; }
      `}</style>

      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: isMobile ? 'var(--space-md) 20px' : '20px var(--space-2xl)',
        borderBottom: '1px solid var(--color-border-light)',
        background: 'var(--color-background)',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <button
          onClick={onClose}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-sm)',
            background: 'none',
            border: 'none',
            color: 'var(--color-text-muted)',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
            padding: 0
          }}
        >
          <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>←</span>
          Back
        </button>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-text-muted)',
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
          padding: isMobile ? 'var(--space-xl) 20px' : 'var(--space-2xl) var(--space-2xl) 0'
        }}>
          {/* Meta line */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: 'var(--space-md)',
            fontSize: '13px',
            color: 'var(--color-text-muted)'
          }}>
            <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
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
            fontFamily: 'var(--font-serif)',
            fontWeight: 400,
            fontStyle: 'italic',
            color: 'var(--color-text-primary)',
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
            margin: '0 0 var(--space-lg) 0',
            maxWidth: '700px'
          }}>
            {caseStudy.title}
          </h1>

          {/* Role + Team + Duration - single line */}
          <p style={{
            fontSize: '15px',
            color: 'var(--color-text-tertiary)',
            margin: '0 0 40px 0'
          }}>
            <span style={{ color: 'var(--color-accent)' }}>{caseStudy.context.myRole}</span>
            <span style={{ color: 'var(--color-text-muted)' }}> · {caseStudy.context.teamSize} · {caseStudy.context.duration}</span>
          </p>
        </div>

        {/* Metrics bar - full width subtle background */}
        <div style={{
          background: 'var(--color-grid-overlay)',
          padding: isMobile ? 'var(--space-xl) 20px' : '40px var(--space-2xl)',
          marginBottom: 'var(--space-2xl)'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            gap: isMobile ? '40px' : 'var(--space-3xl)',
            flexWrap: 'wrap'
          }}>
            <div>
              <div style={{
                fontSize: isMobile ? '32px' : '40px',
                fontFamily: 'var(--font-serif)',
                color: 'var(--color-accent)',
                lineHeight: 1
              }}>{caseStudy.hook.impactMetric.value}</div>
              <div style={{
                fontSize: '11px',
                fontWeight: 500,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--color-text-muted)',
                marginTop: 'var(--space-sm)'
              }}>{caseStudy.hook.impactMetric.label}</div>
            </div>
            {caseStudy.hook.subMetrics?.map((metric, i) => (
              <div key={i}>
                <div style={{
                  fontSize: isMobile ? '32px' : '40px',
                  fontFamily: 'var(--font-serif)',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1
                }}>{metric.value}</div>
                <div style={{
                  fontSize: '11px',
                  fontWeight: 500,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--color-text-muted)',
                  marginTop: 'var(--space-sm)'
                }}>{metric.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Main content - narrower for readability */}
        <div style={{
          maxWidth: '680px',
          margin: '0 auto',
          padding: isMobile ? '0 20px var(--space-3xl)' : '0 var(--space-2xl) 80px'
        }}>

          {/* THE STORY */}
          {/* Challenge */}
          <p style={{
            fontSize: '17px',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.85,
            margin: '0 0 var(--space-xl) 0'
          }}>
            {caseStudy.problem.businessContext}
          </p>

          {/* Stakes as accent quote */}
          <div style={{
            margin: '0 0 var(--space-2xl) 0',
            padding: '0 0 0 20px',
            borderLeft: '2px solid var(--color-accent)'
          }}>
            <p style={{
              fontSize: '15px',
              color: 'var(--color-text-tertiary)',
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
            color: 'var(--color-text-secondary)',
            lineHeight: 1.85,
            margin: '0 0 var(--space-lg) 0'
          }}>
            {caseStudy.approach.hypothesis}
          </p>

          <p style={{
            fontSize: '17px',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.85,
            margin: '0 0 56px 0'
          }}>
            <strong style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>Solution:</strong> {caseStudy.approach.chosenPath}
          </p>

          {/* KEY DECISION */}
          <div style={{
            margin: '0 0 56px 0',
            padding: '28px',
            background: 'var(--color-card-hover)',
            borderLeft: '3px solid var(--color-accent)'
          }}>
            <div style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--color-accent)',
              marginBottom: '12px'
            }}>Key Decision</div>
            <div style={{
              fontSize: '18px',
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              color: 'var(--color-text-primary)',
              marginBottom: '12px'
            }}>{caseStudy.execution.keyDecision.title}</div>
            <p style={{
              fontSize: '15px',
              color: 'var(--color-text-tertiary)',
              lineHeight: 1.7,
              margin: 0
            }}>
              {caseStudy.execution.keyDecision.decision}
              <span style={{ color: 'var(--color-text-secondary)' }}> → {caseStudy.execution.keyDecision.outcome}</span>
            </p>
          </div>

          {/* EXECUTION - Clean timeline */}
          <div style={{ margin: '0 0 56px 0' }}>
            <h2 style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--color-text-muted)',
              margin: '0 0 var(--space-lg) 0'
            }}>How we executed</h2>

            {caseStudy.execution.phases.map((phase, i) => (
              <div key={i} style={{
                display: 'flex',
                gap: 'var(--space-md)',
                marginBottom: '20px'
              }}>
                <div style={{
                  width: '2px',
                  background: i === 0 ? 'var(--color-accent)' : 'var(--color-border-light)',
                  flexShrink: 0
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '12px',
                    marginBottom: 'var(--space-sm)'
                  }}>
                    <span style={{ fontSize: '15px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
                      {phase.name}
                    </span>
                    {phase.duration && (
                      <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                        {phase.duration}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--color-text-tertiary)', lineHeight: 1.65 }}>
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
              color: 'var(--color-text-muted)',
              margin: '0 0 20px 0'
            }}>Results</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '16px', color: 'var(--color-text-secondary)' }}>
                <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--color-accent)' }}>
                  {caseStudy.results.primary.metric}
                </span>
                <span style={{ color: 'var(--color-text-muted)' }}> — </span>
                <span style={{ color: 'var(--color-text-tertiary)' }}>{caseStudy.results.primary.context}</span>
              </div>

              {caseStudy.results.secondary && (
                <div style={{ fontSize: '16px', color: 'var(--color-text-secondary)' }}>
                  <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
                    {caseStudy.results.secondary.metric}
                  </span>
                  <span style={{ color: 'var(--color-text-muted)' }}> — </span>
                  <span style={{ color: 'var(--color-text-tertiary)' }}>{caseStudy.results.secondary.context}</span>
                </div>
              )}

              {caseStudy.results.tertiary && (
                <div style={{ fontSize: '16px', color: 'var(--color-text-secondary)' }}>
                  <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
                    {caseStudy.results.tertiary.metric}
                  </span>
                  <span style={{ color: 'var(--color-text-muted)' }}> — </span>
                  <span style={{ color: 'var(--color-text-tertiary)' }}>{caseStudy.results.tertiary.context}</span>
                </div>
              )}
            </div>

            {caseStudy.results.qualitative && (
              <p style={{
                fontSize: '15px',
                color: 'var(--color-text-tertiary)',
                lineHeight: 1.7,
                marginTop: '20px',
                fontStyle: 'italic'
              }}>{caseStudy.results.qualitative}</p>
            )}
          </div>

          {/* LESSON LEARNED - Featured quote */}
          <div style={{
            margin: '0 0 56px 0',
            padding: 'var(--space-lg) 28px',
            background: 'var(--color-grid-overlay)'
          }}>
            <div style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--color-text-muted)',
              marginBottom: '12px'
            }}>Key Lesson</div>
            <p style={{
              fontSize: '17px',
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              color: 'var(--color-text-secondary)',
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
            gap: 'var(--space-lg)',
            margin: '0 0 56px 0'
          }}>
            <div>
              <div style={{
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--color-success)',
                marginBottom: '12px'
              }}>What worked</div>
              {caseStudy.reflection.whatWorked.map((item, i) => (
                <p key={i} style={{
                  fontSize: '14px',
                  color: 'var(--color-text-tertiary)',
                  lineHeight: 1.6,
                  margin: '0 0 var(--space-sm) 0'
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
                  color: 'var(--color-text-tertiary)',
                  lineHeight: 1.6,
                  margin: '0 0 var(--space-sm) 0'
                }}>• {item}</p>
              ))}
            </div>
          </div>

          {/* TESTIMONIAL */}
          {caseStudy.evidence.testimonial && (
            <div style={{
              margin: '0 0 56px 0',
              padding: '28px',
              background: 'var(--color-grid-overlay)',
              borderLeft: '2px solid var(--color-border-light)'
            }}>
              <p style={{
                fontSize: '16px',
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.7,
                margin: '0 0 var(--space-md) 0'
              }}>
                "{caseStudy.evidence.testimonial.quote}"
              </p>
              <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                — {caseStudy.evidence.testimonial.author}, {caseStudy.evidence.testimonial.role}
              </div>
            </div>
          )}

          {/* FOOTER META - Tech + Links + Constraints */}
          <div style={{
            paddingTop: 'var(--space-xl)',
            borderTop: '1px solid var(--color-border-light)',
            fontSize: '13px',
            color: 'var(--color-text-muted)',
            lineHeight: 1.8
          }}>
            {/* Evidence links */}
            {(caseStudy.evidence.blogPostUrl || caseStudy.evidence.githubUrl || caseStudy.evidence.demoUrl) && (
              <div style={{ marginBottom: 'var(--space-md)' }}>
                {caseStudy.evidence.blogPostUrl && (
                  <a href={caseStudy.evidence.blogPostUrl} target="_blank" rel="noopener noreferrer"
                    style={{ color: 'var(--color-text-tertiary)', marginRight: '20px', textDecoration: 'none' }}>
                    Read blog post ↗
                  </a>
                )}
                {caseStudy.evidence.githubUrl && (
                  <a href={caseStudy.evidence.githubUrl} target="_blank" rel="noopener noreferrer"
                    style={{ color: 'var(--color-text-tertiary)', marginRight: '20px', textDecoration: 'none' }}>
                    View code ↗
                  </a>
                )}
                {caseStudy.evidence.demoUrl && (
                  <a href={caseStudy.evidence.demoUrl} target="_blank" rel="noopener noreferrer"
                    style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>
                    View demo ↗
                  </a>
                )}
              </div>
            )}

            {/* Tech stack inline */}
            <div style={{ marginBottom: 'var(--space-sm)' }}>
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
            padding: '40px var(--space-xl)',
            background: 'var(--color-tag-hover)',
            textAlign: 'center'
          }}>
            <h3 style={{
              fontSize: '22px',
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              color: 'var(--color-text-secondary)',
              margin: '0 0 var(--space-sm) 0',
              fontWeight: 400
            }}>{caseStudy.cta.headline}</h3>
            {caseStudy.cta.subtext && (
              <p style={{
                fontSize: '14px',
                color: 'var(--color-text-muted)',
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
                background: 'var(--color-accent)',
                color: 'var(--color-background)',
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
            marginTop: 'var(--space-2xl)',
            paddingTop: 'var(--space-lg)',
            borderTop: '1px solid var(--color-border-light)',
            gap: 'var(--space-lg)'
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
                <div style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-xs)' }}>
                  ← Previous
                </div>
                <div style={{ fontSize: '15px', fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--color-text-secondary)' }}>
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
                <div style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-xs)' }}>
                  Next →
                </div>
                <div style={{ fontSize: '15px', fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--color-text-secondary)' }}>
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
