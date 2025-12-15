import type { CaseStudy } from '../../types/portfolio';

interface CaseStudyOutcomeProps {
    caseStudy: CaseStudy;
    isMobile: boolean;
}

export default function CaseStudyOutcome({ caseStudy, isMobile }: CaseStudyOutcomeProps) {
    const padding = isMobile ? 'var(--space-lg)' : 'var(--space-2xl)';
    const hasQualitative = caseStudy.results?.qualitative;

    // Only render if we have qualitative content
    if (!hasQualitative) {
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
                Impact
            </div>

            {/* Qualitative outcome */}
            <p style={{
                fontSize: '15px',
                color: 'var(--color-text-tertiary)',
                lineHeight: 1.7,
                margin: 0
            }}>
                {caseStudy.results.qualitative}
            </p>
        </section>
    );
}
