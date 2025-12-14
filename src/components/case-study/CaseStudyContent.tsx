import type { CaseStudy } from '../../types/portfolio';

interface CaseStudyContentProps {
    caseStudy: CaseStudy;
    isMobile: boolean;
}

const sectionMargin = 'var(--space-5xl)'; // 96px for breathing room

// Section label component
function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <div style={{
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--color-text-muted)',
            marginBottom: 'var(--space-lg)'
        }}>
            {children}
        </div>
    );
}

export default function CaseStudyContent({ caseStudy, isMobile }: CaseStudyContentProps) {
    const hasProblem = caseStudy.problem?.businessContext || caseStudy.problem?.stakes;
    const hasDiscovery = caseStudy.approach?.hypothesis || caseStudy.execution?.keyDecision;
    const hasSolution = caseStudy.approach?.chosenPath || caseStudy.execution?.phases?.length;
    const hasReflection = caseStudy.reflection?.lessonLearned;

    return (
        <div style={{
            maxWidth: '720px',
            margin: '0 auto',
            padding: isMobile ? '0 var(--space-lg)' : '0 var(--space-2xl)'
        }}>
            {/* ══════════════════════════════════════════════════════════════
          PROBLEM SECTION
          ══════════════════════════════════════════════════════════════ */}
            {hasProblem && (
                <section style={{ marginBottom: sectionMargin }}>
                    <SectionLabel>The Challenge</SectionLabel>

                    {/* Stakes quote - the hook */}
                    {caseStudy.problem.stakes && (
                        <div style={{
                            fontSize: isMobile ? '20px' : '24px',
                            fontFamily: 'var(--font-serif)',
                            fontStyle: 'italic',
                            color: 'var(--color-text-primary)',
                            lineHeight: 1.5,
                            marginBottom: 'var(--space-xl)',
                            paddingLeft: 'var(--space-lg)',
                            borderLeft: '2px solid var(--color-accent)'
                        }}>
                            "{caseStudy.problem.stakes}"
                        </div>
                    )}

                    {/* Context - brief */}
                    {caseStudy.problem.businessContext && (
                        <p style={{
                            fontSize: '16px',
                            color: 'var(--color-text-tertiary)',
                            lineHeight: 1.85,
                            margin: 0
                        }}>
                            {caseStudy.problem.businessContext}
                        </p>
                    )}
                </section>
            )}

            {/* ══════════════════════════════════════════════════════════════
          DISCOVERY / DECISIONS SECTION
          ══════════════════════════════════════════════════════════════ */}
            {hasDiscovery && (
                <section style={{ marginBottom: sectionMargin }}>
                    <SectionLabel>Key Insight</SectionLabel>

                    {/* Hypothesis - the discovery */}
                    {caseStudy.approach?.hypothesis && (
                        <p style={{
                            fontSize: '17px',
                            color: 'var(--color-text-secondary)',
                            lineHeight: 1.85,
                            margin: '0 0 var(--space-xl) 0'
                        }}>
                            {caseStudy.approach.hypothesis}
                        </p>
                    )}

                    {/* Key decision - one liner */}
                    {caseStudy.execution?.keyDecision && (
                        <div style={{
                            padding: 'var(--space-lg)',
                            background: 'var(--color-card-hover)',
                            borderLeft: '2px solid var(--color-accent)'
                        }}>
                            <div style={{
                                fontSize: '15px',
                                color: 'var(--color-text-primary)',
                                marginBottom: 'var(--space-xs)'
                            }}>
                                <strong>{caseStudy.execution.keyDecision.title}</strong>
                            </div>
                            <div style={{
                                fontSize: '14px',
                                color: 'var(--color-text-tertiary)',
                                lineHeight: 1.6
                            }}>
                                {caseStudy.execution.keyDecision.decision}
                                <span style={{ color: 'var(--color-text-muted)' }}> → </span>
                                <span style={{ color: 'var(--color-text-secondary)' }}>
                                    {caseStudy.execution.keyDecision.outcome}
                                </span>
                            </div>
                        </div>
                    )}
                </section>
            )}

            {/* ══════════════════════════════════════════════════════════════
          SOLUTION / EXECUTION SECTION
          ══════════════════════════════════════════════════════════════ */}
            {hasSolution && (
                <section style={{ marginBottom: sectionMargin }}>
                    <SectionLabel>What We Built</SectionLabel>

                    {/* Chosen path - brief context */}
                    {caseStudy.approach?.chosenPath && (
                        <p style={{
                            fontSize: '16px',
                            color: 'var(--color-text-secondary)',
                            lineHeight: 1.85,
                            margin: '0 0 var(--space-xl) 0'
                        }}>
                            {caseStudy.approach.chosenPath}
                        </p>
                    )}

                    {/* Execution phases as outcome-focused list */}
                    {caseStudy.execution?.phases?.map((phase, i) => (
                        <div key={i} style={{
                            display: 'flex',
                            gap: 'var(--space-md)',
                            marginBottom: 'var(--space-md)',
                            alignItems: 'flex-start'
                        }}>
                            <div style={{
                                width: '6px',
                                height: '6px',
                                background: i === 0 ? 'var(--color-accent)' : 'var(--color-border)',
                                marginTop: '8px',
                                flexShrink: 0
                            }} />
                            <div>
                                <span style={{
                                    fontSize: '15px',
                                    fontWeight: 500,
                                    color: 'var(--color-text-secondary)'
                                }}>
                                    {phase.name}
                                </span>
                                {phase.duration && (
                                    <span style={{
                                        fontSize: '13px',
                                        color: 'var(--color-text-muted)',
                                        marginLeft: 'var(--space-sm)'
                                    }}>
                                        ({phase.duration})
                                    </span>
                                )}
                                <div style={{
                                    fontSize: '14px',
                                    color: 'var(--color-text-tertiary)',
                                    marginTop: '2px'
                                }}>
                                    {phase.actions.join(' → ')}
                                </div>
                            </div>
                        </div>
                    ))}
                </section>
            )}

            {/* ══════════════════════════════════════════════════════════════
          LESSONS LEARNED SECTION
          ══════════════════════════════════════════════════════════════ */}
            {hasReflection && (
                <section style={{ marginBottom: sectionMargin }}>
                    <SectionLabel>What I Learned</SectionLabel>

                    <p style={{
                        fontSize: '18px',
                        fontFamily: 'var(--font-serif)',
                        fontStyle: 'italic',
                        color: 'var(--color-text-secondary)',
                        lineHeight: 1.6,
                        margin: 0
                    }}>
                        "{caseStudy.reflection.lessonLearned}"
                    </p>
                </section>
            )}
        </div>
    );
}
