import type { CaseStudy } from '../../types/portfolio';

interface CaseStudyHeroProps {
    caseStudy: CaseStudy;
    isMobile: boolean;
}

export default function CaseStudyHero({ caseStudy, isMobile }: CaseStudyHeroProps) {
    const padding = isMobile ? 'var(--space-lg)' : 'var(--space-2xl)';
    const subMetrics = caseStudy.hook?.subMetrics || [];

    return (
        <header style={{
            maxWidth: 'var(--drawer-content-max-width)',
            margin: '0 auto',
            padding: `var(--space-3xl) ${padding} var(--space-2xl)`
        }}>
            {/* Meta line - subtle context */}
            <div style={{
                fontSize: '13px',
                color: 'var(--color-text-tertiary)',
                marginBottom: 'var(--space-md)',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px',
                alignItems: 'center'
            }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>
                    {caseStudy.company}
                </span>
                <span style={{ color: 'var(--color-text-muted)' }}>·</span>
                <span>{caseStudy.year}</span>
                <span style={{ color: 'var(--color-text-muted)' }}>·</span>
                <span>{caseStudy.duration}</span>
            </div>

            {/* Title */}
            <h1 style={{
                fontSize: isMobile ? '28px' : '36px',
                fontFamily: 'var(--font-serif)',
                fontWeight: 400,
                fontStyle: 'italic',
                color: 'var(--color-text-primary)',
                letterSpacing: '-0.01em',
                lineHeight: 1.2,
                margin: '0 0 var(--space-2xl) 0'
            }}>
                {caseStudy.title}
            </h1>

            {/* Key Metrics - clean horizontal layout */}
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: isMobile ? 'var(--space-lg)' : 'var(--space-2xl)',
                paddingBottom: 'var(--space-2xl)',
                borderBottom: '1px solid var(--color-border-light)'
            }}>
                {/* Primary metric */}
                <div>
                    <div style={{
                        fontSize: isMobile ? '32px' : '40px',
                        fontFamily: 'var(--font-serif)',
                        color: 'var(--color-accent)',
                        lineHeight: 1,
                        letterSpacing: '-0.02em'
                    }}>
                        {caseStudy.hook.impactMetric.value}
                    </div>
                    <div style={{
                        fontSize: '12px',
                        fontWeight: 500,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        color: 'var(--color-text-muted)',
                        marginTop: '4px'
                    }}>
                        {caseStudy.hook.impactMetric.label}
                    </div>
                </div>

                {/* Sub metrics */}
                {subMetrics.slice(0, 2).map((metric, i) => (
                    <div key={i}>
                        <div style={{
                            fontSize: isMobile ? '32px' : '40px',
                            fontFamily: 'var(--font-serif)',
                            color: 'var(--color-text-secondary)',
                            lineHeight: 1,
                            letterSpacing: '-0.02em'
                        }}>
                            {metric.value}
                        </div>
                        <div style={{
                            fontSize: '12px',
                            fontWeight: 500,
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                            color: 'var(--color-text-muted)',
                            marginTop: '4px'
                        }}>
                            {metric.label}
                        </div>
                    </div>
                ))}
            </div>
        </header>
    );
}
