import type { CaseStudy } from '../../types/portfolio';

interface CaseStudyFooterProps {
    caseStudy: CaseStudy;
    prevStudy: CaseStudy | null;
    nextStudy: CaseStudy | null;
    onNavigate: (study: CaseStudy) => void;
    isMobile?: boolean;
}

export default function CaseStudyFooter({ caseStudy, prevStudy, nextStudy, onNavigate, isMobile = false }: CaseStudyFooterProps) {
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

    const padding = isMobile ? 'var(--space-lg)' : 'var(--space-2xl)';

    return (
        <footer style={{
            maxWidth: '640px',
            margin: '0 auto',
            padding: `0 ${padding} ${padding}`
        }}>
            {/* Testimonial - simple blockquote style */}
            {caseStudy.evidence?.testimonial && (
                <blockquote style={{
                    margin: '0 0 var(--space-3xl) 0',
                    padding: '0 0 0 var(--space-lg)',
                    borderLeft: '2px solid var(--color-accent)'
                }}>
                    <p style={{
                        fontSize: '16px',
                        fontFamily: 'var(--font-serif)',
                        fontStyle: 'italic',
                        color: 'var(--color-text-secondary)',
                        lineHeight: 1.7,
                        margin: '0 0 var(--space-sm) 0'
                    }}>
                        "{caseStudy.evidence.testimonial.quote}"
                    </p>
                    <cite style={{
                        fontSize: '13px',
                        fontStyle: 'normal',
                        color: 'var(--color-text-muted)'
                    }}>
                        — {caseStudy.evidence.testimonial.author}, {caseStudy.evidence.testimonial.role}
                    </cite>
                </blockquote>
            )}

            {/* CTA - minimal */}
            <div style={{
                textAlign: 'center',
                padding: 'var(--space-2xl) 0',
                borderTop: '1px solid var(--color-border-light)',
                borderBottom: '1px solid var(--color-border-light)',
                marginBottom: 'var(--space-xl)'
            }}>
                <p style={{
                    fontSize: '15px',
                    color: 'var(--color-text-tertiary)',
                    margin: '0 0 var(--space-md) 0'
                }}>
                    {caseStudy.cta.headline}
                </p>
                <a
                    href={getCtaLink(caseStudy.cta.action)}
                    target={caseStudy.cta.action !== 'contact' ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    style={{
                        display: 'inline-block',
                        padding: '12px 24px',
                        background: 'var(--color-text-primary)',
                        color: 'var(--color-background)',
                        textDecoration: 'none',
                        fontSize: '13px',
                        fontWeight: 600,
                        letterSpacing: '0.02em',
                        borderRadius: '2px',
                        transition: 'opacity 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                    {caseStudy.cta.linkText}
                </a>
            </div>

            {/* Navigation */}
            <nav style={{
                display: 'flex',
                justifyContent: 'space-between',
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
                        <span style={{
                            fontSize: '12px',
                            color: 'var(--color-text-muted)',
                            display: 'block',
                            marginBottom: '2px'
                        }}>
                            Previous
                        </span>
                        <span style={{
                            fontSize: '14px',
                            fontFamily: 'var(--font-serif)',
                            fontStyle: 'italic',
                            color: 'var(--color-text-secondary)'
                        }}>
                            {prevStudy.title}
                        </span>
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
                        <span style={{
                            fontSize: '12px',
                            color: 'var(--color-text-muted)',
                            display: 'block',
                            marginBottom: '2px'
                        }}>
                            Next
                        </span>
                        <span style={{
                            fontSize: '14px',
                            fontFamily: 'var(--font-serif)',
                            fontStyle: 'italic',
                            color: 'var(--color-text-secondary)'
                        }}>
                            {nextStudy.title}
                        </span>
                    </button>
                ) : <div />}
            </nav>
        </footer>
    );
}
