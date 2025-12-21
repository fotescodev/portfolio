import type { CaseStudy } from '../../types/portfolio';

interface CaseStudyMetricsProps {
    caseStudy: CaseStudy;
    isMobile: boolean;
}

export default function CaseStudyMetrics({ caseStudy, isMobile }: CaseStudyMetricsProps) {
    return (
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
                {/* Primary Metric */}
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

                {/* Sub Metrics */}
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
    );
}
