import type { CaseStudy } from '../../types/portfolio';

interface CaseStudyHeroProps {
    caseStudy: CaseStudy;
    isMobile: boolean;
}

export default function CaseStudyHero({ caseStudy, isMobile }: CaseStudyHeroProps) {
    return (
        <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: isMobile ? 'var(--space-xl) var(--space-lg)' : 'var(--space-3xl) var(--space-2xl) var(--space-2xl)'
        }}>
            {/* Title - Large, commanding */}
            <h1 style={{
                fontSize: isMobile ? '32px' : '48px',
                fontFamily: 'var(--font-serif)',
                fontWeight: 400,
                fontStyle: 'italic',
                color: 'var(--color-text-primary)',
                letterSpacing: '-0.02em',
                lineHeight: 1.15,
                margin: '0 0 var(--space-xl) 0',
                maxWidth: '800px'
            }}>
                {caseStudy.title}
            </h1>

            {/* Primary Impact Metric - BIG */}
            <div style={{
                marginBottom: 'var(--space-xl)'
            }}>
                <div style={{
                    fontSize: isMobile ? '48px' : '72px',
                    fontFamily: 'var(--font-serif)',
                    color: 'var(--color-accent)',
                    lineHeight: 1,
                    letterSpacing: '-0.02em'
                }}>
                    {caseStudy.hook.impactMetric.value}
                </div>
                <div style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--color-text-muted)',
                    marginTop: 'var(--space-sm)'
                }}>
                    {caseStudy.hook.impactMetric.label}
                </div>
            </div>

            {/* Compact meta line */}
            <div style={{
                fontSize: '14px',
                color: 'var(--color-text-tertiary)',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px'
            }}>
                <span style={{ fontWeight: 500, color: 'var(--color-text-secondary)' }}>
                    {caseStudy.company}
                </span>
                <span style={{ color: 'var(--color-text-muted)' }}>·</span>
                <span>{caseStudy.year}</span>
                <span style={{ color: 'var(--color-text-muted)' }}>·</span>
                <span style={{ color: 'var(--color-accent)' }}>{caseStudy.context.myRole}</span>
                <span style={{ color: 'var(--color-text-muted)' }}>·</span>
                <span>{caseStudy.context.teamSize}</span>
                <span style={{ color: 'var(--color-text-muted)' }}>·</span>
                <span>{caseStudy.context.duration}</span>
            </div>
        </div>
    );
}
