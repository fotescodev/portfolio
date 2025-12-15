import type { CaseStudy } from '../../types/portfolio';

interface CaseStudyOutcomeProps {
    caseStudy: CaseStudy;
    isMobile: boolean;
}

export default function CaseStudyOutcome({ caseStudy, isMobile }: CaseStudyOutcomeProps) {
    const padding = isMobile ? 'var(--space-lg)' : 'var(--space-2xl)';

    // Get results with context
    const results = [
        caseStudy.results?.primary,
        caseStudy.results?.secondary,
        caseStudy.results?.tertiary
    ].filter(Boolean);

    const hasResults = results.length > 0;
    const hasQualitative = caseStudy.results?.qualitative;

    if (!hasResults && !hasQualitative) {
        return null;
    }

    return (
        <section style={{
            maxWidth: '640px',
            margin: '0 auto',
            padding: `0 ${padding} var(--space-2xl)`
        }}>
            {/* Section divider with label */}
            <div style={{
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--color-text-muted)',
                marginBottom: 'var(--space-lg)',
                paddingTop: 'var(--space-lg)',
                borderTop: '1px solid var(--color-border-light)'
            }}>
                Results
            </div>

            {/* Results as clean list */}
            {hasResults && (
                <div style={{ marginBottom: hasQualitative ? 'var(--space-xl)' : 0 }}>
                    {results.map((result, i) => (
                        <div key={i} style={{
                            display: 'flex',
                            alignItems: 'baseline',
                            gap: 'var(--space-md)',
                            marginBottom: i < results.length - 1 ? 'var(--space-md)' : 0
                        }}>
                            <span style={{
                                fontSize: isMobile ? '24px' : '28px',
                                fontFamily: 'var(--font-serif)',
                                color: i === 0 ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                                lineHeight: 1,
                                flexShrink: 0
                            }}>
                                {result!.metric}
                            </span>
                            <span style={{
                                fontSize: '14px',
                                color: 'var(--color-text-tertiary)',
                                lineHeight: 1.5
                            }}>
                                {result!.context}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {/* Qualitative outcome */}
            {hasQualitative && (
                <p style={{
                    fontSize: '15px',
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
