import type { CaseStudy } from '../../types/portfolio';

interface CaseStudyResultsProps {
    caseStudy: CaseStudy;
}

export default function CaseStudyResults({ caseStudy }: CaseStudyResultsProps) {
    return (
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
    );
}
