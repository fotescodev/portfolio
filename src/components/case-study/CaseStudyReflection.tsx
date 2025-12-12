import type { CaseStudy } from '../../types/portfolio';

interface CaseStudyReflectionProps {
    caseStudy: CaseStudy;
    isMobile: boolean;
}

export default function CaseStudyReflection({ caseStudy, isMobile }: CaseStudyReflectionProps) {
    return (
        <>
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
        </>
    );
}
