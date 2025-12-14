import type { CaseStudy } from '../../types/portfolio';

interface CaseStudyOutcomeProps {
    caseStudy: CaseStudy;
    isMobile: boolean;
}

export default function CaseStudyOutcome({ caseStudy, isMobile }: CaseStudyOutcomeProps) {
    // Collect all metrics into one array
    const metrics = [
        caseStudy.results?.primary,
        caseStudy.results?.secondary,
        caseStudy.results?.tertiary
    ].filter(Boolean);

    // Also include sub-metrics from hook if they add value
    const subMetrics = caseStudy.hook?.subMetrics || [];

    if (metrics.length === 0 && subMetrics.length === 0) {
        return null;
    }

    return (
        <section style={{
            maxWidth: '720px',
            margin: '0 auto var(--space-5xl)',
            padding: isMobile ? '0 var(--space-lg)' : '0 var(--space-2xl)'
        }}>
            <div style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--color-text-muted)',
                marginBottom: 'var(--space-xl)'
            }}>
                Outcome
            </div>

            {/* Big numbers grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: 'var(--space-xl)',
                marginBottom: subMetrics.length > 0 || caseStudy.results?.qualitative ? 'var(--space-xl)' : 0
            }}>
                {/* Primary result with context */}
                {caseStudy.results?.primary && (
                    <div>
                        <div style={{
                            fontSize: isMobile ? '36px' : '48px',
                            fontFamily: 'var(--font-serif)',
                            color: 'var(--color-accent)',
                            lineHeight: 1,
                            marginBottom: 'var(--space-xs)'
                        }}>
                            {caseStudy.results.primary.metric}
                        </div>
                        <div style={{
                            fontSize: '14px',
                            color: 'var(--color-text-tertiary)',
                            lineHeight: 1.5
                        }}>
                            {caseStudy.results.primary.context}
                        </div>
                    </div>
                )}

                {/* Secondary results */}
                {caseStudy.results?.secondary && (
                    <div>
                        <div style={{
                            fontSize: isMobile ? '36px' : '48px',
                            fontFamily: 'var(--font-serif)',
                            color: 'var(--color-text-secondary)',
                            lineHeight: 1,
                            marginBottom: 'var(--space-xs)'
                        }}>
                            {caseStudy.results.secondary.metric}
                        </div>
                        <div style={{
                            fontSize: '14px',
                            color: 'var(--color-text-tertiary)',
                            lineHeight: 1.5
                        }}>
                            {caseStudy.results.secondary.context}
                        </div>
                    </div>
                )}

                {/* Sub-metrics from hook */}
                {subMetrics.map((metric, i) => (
                    <div key={i}>
                        <div style={{
                            fontSize: isMobile ? '36px' : '48px',
                            fontFamily: 'var(--font-serif)',
                            color: 'var(--color-text-secondary)',
                            lineHeight: 1,
                            marginBottom: 'var(--space-xs)'
                        }}>
                            {metric.value}
                        </div>
                        <div style={{
                            fontSize: '12px',
                            fontWeight: 500,
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            color: 'var(--color-text-muted)'
                        }}>
                            {metric.label}
                        </div>
                    </div>
                ))}
            </div>

            {/* Qualitative quote */}
            {caseStudy.results?.qualitative && (
                <p style={{
                    fontSize: '15px',
                    fontFamily: 'var(--font-serif)',
                    fontStyle: 'italic',
                    color: 'var(--color-text-tertiary)',
                    lineHeight: 1.7,
                    margin: 0
                }}>
                    {caseStudy.results.qualitative}
                </p>
            )}
        </section>
    );
}
