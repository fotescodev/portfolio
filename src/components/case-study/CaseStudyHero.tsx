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
            padding: isMobile ? 'var(--space-xl) 20px' : 'var(--space-2xl) var(--space-2xl) 0'
        }}>
            {/* Meta line */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: 'var(--space-md)',
                fontSize: '13px',
                color: 'var(--color-text-muted)'
            }}>
                <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
                    {String(caseStudy.id).padStart(2, '0')}
                </span>
                <span>·</span>
                <span>{caseStudy.company}</span>
                <span>·</span>
                <span>{caseStudy.year}</span>
            </div>

            {/* Title */}
            <h1 style={{
                fontSize: isMobile ? '32px' : '44px',
                fontFamily: 'var(--font-serif)',
                fontWeight: 400,
                fontStyle: 'italic',
                color: 'var(--color-text-primary)',
                letterSpacing: '-0.02em',
                lineHeight: 1.15,
                margin: '0 0 var(--space-lg) 0',
                maxWidth: '700px'
            }}>
                {caseStudy.title}
            </h1>

            {/* Role + Team + Duration - single line */}
            <p style={{
                fontSize: '15px',
                color: 'var(--color-text-tertiary)',
                margin: '0 0 40px 0'
            }}>
                <span style={{ color: 'var(--color-accent)' }}>{caseStudy.context.myRole}</span>
                <span style={{ color: 'var(--color-text-muted)' }}> · {caseStudy.context.teamSize} · {caseStudy.context.duration}</span>
            </p>

            {/* [NEW] Feature Fix: Render Thumbnail if available */}
            {caseStudy.hook.thumbnail && (
                <div style={{
                    width: '100%',
                    marginBottom: '40px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: '1px solid var(--color-border-light)'
                }}>
                    <img
                        src={caseStudy.hook.thumbnail}
                        alt={caseStudy.hook.thumbnailAlt || caseStudy.title}
                        style={{
                            width: '100%',
                            height: 'auto',
                            display: 'block'
                        }}
                    />
                </div>
            )}
        </div>
    );
}
