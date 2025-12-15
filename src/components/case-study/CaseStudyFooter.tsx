import type { CaseStudy } from '../../types/portfolio';
import CaseStudyLinks from './CaseStudyLinks';

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
    const hasLinks = caseStudy.demoUrl || caseStudy.githubUrl || caseStudy.docsUrl || (caseStudy.media && caseStudy.media.length > 0);

    return (
        <footer style={{
            maxWidth: 'var(--drawer-content-max-width)',
            margin: '0 auto',
            padding: `0 ${padding} ${padding}`
        }}>
            {/* Links section before CTA */}
            {hasLinks && (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: 'var(--space-2xl) 0',
                    borderTop: '1px solid var(--color-border-light)'
                }}>
                    <span style={{
                        fontSize: '12px',
                        fontWeight: 500,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: 'var(--color-text-muted)',
                        marginBottom: 'var(--space-md)'
                    }}>
                        Explore
                    </span>
                    <CaseStudyLinks caseStudy={caseStudy} isMobile={isMobile} />
                </div>
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
