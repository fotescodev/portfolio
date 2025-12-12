import type { CaseStudy } from '../../types/portfolio';

interface CaseStudyFooterProps {
    caseStudy: CaseStudy;
    prevStudy: CaseStudy | null;
    nextStudy: CaseStudy | null;
    onNavigate: (study: CaseStudy) => void;
}

export default function CaseStudyFooter({ caseStudy, prevStudy, nextStudy, onNavigate }: CaseStudyFooterProps) {

    const getCtaLink = (action: string): string => {
        switch (action) {
            case 'calendly':
                return 'https://calendly.com/dmitriifotesco';
            case 'linkedin':
                return 'https://www.linkedin.com/in/0xdmitri/';
            case 'contact':
            default:
                return 'mailto:dmitrii.fotesco@gmail.com';
        }
    };

    return (
        <>
            {/* TESTIMONIAL */}
            {caseStudy.evidence.testimonial && (
                <div style={{
                    margin: '0 0 56px 0',
                    padding: '28px',
                    background: 'var(--color-grid-overlay)',
                    borderLeft: '2px solid var(--color-border-light)'
                }}>
                    <p style={{
                        fontSize: '16px',
                        fontFamily: 'var(--font-serif)',
                        fontStyle: 'italic',
                        color: 'var(--color-text-secondary)',
                        lineHeight: 1.7,
                        margin: '0 0 var(--space-md) 0'
                    }}>
                        "{caseStudy.evidence.testimonial.quote}"
                    </p>
                    <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                        — {caseStudy.evidence.testimonial.author}, {caseStudy.evidence.testimonial.role}
                    </div>
                </div>
            )}

            {/* FOOTER META - Tech + Links + Constraints */}
            <div style={{
                paddingTop: 'var(--space-xl)',
                borderTop: '1px solid var(--color-border-light)',
                fontSize: '13px',
                color: 'var(--color-text-muted)',
                lineHeight: 1.8
            }}>
                {/* Evidence links */}
                {(caseStudy.evidence.blogPostUrl || caseStudy.evidence.githubUrl || caseStudy.evidence.demoUrl) && (
                    <div style={{ marginBottom: 'var(--space-md)' }}>
                        {caseStudy.evidence.blogPostUrl && (
                            <a href={caseStudy.evidence.blogPostUrl} target="_blank" rel="noopener noreferrer"
                                style={{ color: 'var(--color-text-tertiary)', marginRight: '20px', textDecoration: 'none' }}>
                                Read blog post ↗
                            </a>
                        )}
                        {caseStudy.evidence.githubUrl && (
                            <a href={caseStudy.evidence.githubUrl} target="_blank" rel="noopener noreferrer"
                                style={{ color: 'var(--color-text-tertiary)', marginRight: '20px', textDecoration: 'none' }}>
                                View code ↗
                            </a>
                        )}
                        {caseStudy.evidence.demoUrl && (
                            <a href={caseStudy.evidence.demoUrl} target="_blank" rel="noopener noreferrer"
                                style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>
                                View demo ↗
                            </a>
                        )}
                    </div>
                )}

                {/* Tech stack inline */}
                <div style={{ marginBottom: 'var(--space-sm)' }}>
                    <strong>Stack:</strong> {caseStudy.techStack.join(', ')}
                </div>

                {/* Constraints inline */}
                <div>
                    <strong>Constraints:</strong> {caseStudy.problem.constraints.join(' · ')}
                </div>
            </div>

            {/* CTA */}
            <div style={{
                marginTop: '56px',
                padding: '40px var(--space-xl)',
                background: 'var(--color-tag-hover)',
                textAlign: 'center'
            }}>
                <h3 style={{
                    fontSize: '22px',
                    fontFamily: 'var(--font-serif)',
                    fontStyle: 'italic',
                    color: 'var(--color-text-secondary)',
                    margin: '0 0 var(--space-sm) 0',
                    fontWeight: 400
                }}>{caseStudy.cta.headline}</h3>
                {caseStudy.cta.subtext && (
                    <p style={{
                        fontSize: '14px',
                        color: 'var(--color-text-muted)',
                        margin: '0 0 20px 0'
                    }}>{caseStudy.cta.subtext}</p>
                )}
                <a
                    href={getCtaLink(caseStudy.cta.action)}
                    target={caseStudy.cta.action !== 'contact' ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    style={{
                        display: 'inline-block',
                        padding: '12px 28px',
                        background: 'var(--color-accent)',
                        color: 'var(--color-background)',
                        textDecoration: 'none',
                        fontSize: '14px',
                        fontWeight: 600
                    }}
                >
                    {caseStudy.cta.linkText}
                </a>
            </div>

            {/* NAV */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: 'var(--space-2xl)',
                paddingTop: 'var(--space-lg)',
                borderTop: '1px solid var(--color-border-light)',
                gap: 'var(--space-lg)'
            }}>
                {prevStudy ? (
                    <button
                        onClick={() => onNavigate(prevStudy)}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            textAlign: 'left',
                            padding: 0
                        }}
                    >
                        <div style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-xs)' }}>
                            ← Previous
                        </div>
                        <div style={{ fontSize: '15px', fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--color-text-secondary)' }}>
                            {prevStudy.title}
                        </div>
                    </button>
                ) : <div />}

                {nextStudy ? (
                    <button
                        onClick={() => onNavigate(nextStudy)}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            textAlign: 'right',
                            padding: 0
                        }}
                    >
                        <div style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-xs)' }}>
                            Next →
                        </div>
                        <div style={{ fontSize: '15px', fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--color-text-secondary)' }}>
                            {nextStudy.title}
                        </div>
                    </button>
                ) : <div />}
            </div>
        </>
    );
}
