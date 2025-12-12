import type { CaseStudy } from '../../types/portfolio';

interface CaseStudyNarrativeProps {
    caseStudy: CaseStudy;
    isMobile: boolean; // Retained prop for future styling needs, though currently unused in style objects below
}

export default function CaseStudyNarrative({ caseStudy }: CaseStudyNarrativeProps) {
    return (
        <>
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
        </>
    );
}
