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
        <div style={{
            maxWidth: '720px',
            margin: '0 auto',
            padding: '0 var(--space-2xl) var(--space-2xl)'
        }}>
            {/* ══════════════════════════════════════════════════════════════
          TESTIMONIAL (if exists)
          ══════════════════════════════════════════════════════════════ */}
            {caseStudy.evidence?.testimonial && (
                <div style={{
                    marginBottom: 'var(--space-5xl)',
                    padding: 'var(--space-xl)',
                    background: 'var(--color-card-hover)',
                    borderLeft: '2px solid var(--color-accent)'
                }}>
                    <p style={{
                        fontSize: '17px',
                        fontFamily: 'var(--font-serif)',
                        fontStyle: 'italic',
                        color: 'var(--color-text-secondary)',
                        lineHeight: 1.7,
                        margin: '0 0 var(--space-md) 0'
                    }}>
                        "{caseStudy.evidence.testimonial.quote}"
                    </p>
                    <div style={{
                        fontSize: '13px',
                        color: 'var(--color-text-muted)'
                    }}>
                        — {caseStudy.evidence.testimonial.author}, {caseStudy.evidence.testimonial.role}
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════════════════════
          CTA - Single focused action
          ══════════════════════════════════════════════════════════════ */}
            <div style={{
                textAlign: 'center',
                marginBottom: 'var(--space-5xl)'
            }}>
                <h3 style={{
                    fontSize: '24px',
                    fontFamily: 'var(--font-serif)',
                    fontStyle: 'italic',
                    color: 'var(--color-text-primary)',
                    margin: '0 0 var(--space-md) 0',
                    fontWeight: 400
                }}>
                    {caseStudy.cta.headline}
                </h3>
                <a
                    href={getCtaLink(caseStudy.cta.action)}
                    target={caseStudy.cta.action !== 'contact' ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    style={{
                        display: 'inline-block',
                        padding: '14px 32px',
                        background: 'var(--color-text-primary)',
                        color: 'var(--color-background)',
                        textDecoration: 'none',
                        fontSize: '14px',
                        fontWeight: 600,
                        letterSpacing: '0.02em',
                        transition: 'background 0.2s ease'
                    }}
                >
                    {caseStudy.cta.linkText} →
                </a>
            </div>

            {/* ══════════════════════════════════════════════════════════════
          NAVIGATION - Previous / Next
          ══════════════════════════════════════════════════════════════ */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
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
                        <div style={{
                            fontSize: '11px',
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            color: 'var(--color-text-muted)',
                            marginBottom: '4px'
                        }}>
                            ← Previous
                        </div>
                        <div style={{
                            fontSize: '15px',
                            fontFamily: 'var(--font-serif)',
                            fontStyle: 'italic',
                            color: 'var(--color-text-secondary)'
                        }}>
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
                        <div style={{
                            fontSize: '11px',
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            color: 'var(--color-text-muted)',
                            marginBottom: '4px'
                        }}>
                            Next →
                        </div>
                        <div style={{
                            fontSize: '15px',
                            fontFamily: 'var(--font-serif)',
                            fontStyle: 'italic',
                            color: 'var(--color-text-secondary)'
                        }}>
                            {nextStudy.title}
                        </div>
                    </button>
                ) : <div />}
            </div>
        </div>
    );
}
