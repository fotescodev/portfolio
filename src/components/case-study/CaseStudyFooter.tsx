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
            maxWidth: 'var(--drawer-content-max-width)',
            margin: '0 auto',
            padding: `0 ${padding} ${padding}`
        }}>
            {/* CTA */}
            <div style={{
                textAlign: 'center',
                padding: 'var(--space-3xl) 0',
                borderTop: '1px solid var(--color-border-light)',
                borderBottom: '1px solid var(--color-border-light)',
                marginBottom: 'var(--space-xl)'
            }}>
                <p style={{
                    fontSize: '20px',
                    fontFamily: 'var(--font-serif)',
                    fontStyle: 'italic',
                    color: 'var(--color-text-secondary)',
                    margin: '0 0 var(--space-lg) 0',
                    lineHeight: 1.4
                }}>
                    {caseStudy.cta.headline}
                </p>
                <a
                    href={getCtaLink(caseStudy.cta.action)}
                    target={caseStudy.cta.action !== 'contact' ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    style={{
                        display: 'inline-block',
                        padding: '14px 32px',
                        background: 'var(--color-accent)',
                        color: 'var(--color-background)',
                        textDecoration: 'none',
                        fontSize: '15px',
                        fontWeight: 600,
                        letterSpacing: '0.02em',
                        transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--color-accent-hover)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'var(--color-accent)';
                    }}
                >
                    {caseStudy.cta.linkText}
                </a>
            </div>

            {/* Navigation */}
            <nav style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 'var(--space-lg)',
                paddingTop: 'var(--space-xl)'
            }}>
                {prevStudy ? (
                    <button
                        onClick={() => onNavigate(prevStudy)}
                        style={{
                            background: 'none',
                            border: '1px solid var(--color-border)',
                            cursor: 'pointer',
                            textAlign: 'left',
                            padding: 'var(--space-lg)',
                            flex: 1,
                            maxWidth: '45%',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'var(--color-accent)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'var(--color-border)';
                        }}
                    >
                        <span style={{
                            fontSize: '13px',
                            fontWeight: 500,
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                            color: 'var(--color-text-muted)',
                            display: 'block',
                            marginBottom: '6px'
                        }}>
                            ← Previous
                        </span>
                        <span style={{
                            fontSize: '18px',
                            fontFamily: 'var(--font-serif)',
                            fontStyle: 'italic',
                            color: 'var(--color-text-secondary)',
                            lineHeight: 1.3
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
                            border: '1px solid var(--color-border)',
                            cursor: 'pointer',
                            textAlign: 'right',
                            padding: 'var(--space-lg)',
                            flex: 1,
                            maxWidth: '45%',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'var(--color-accent)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'var(--color-border)';
                        }}
                    >
                        <span style={{
                            fontSize: '13px',
                            fontWeight: 500,
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                            color: 'var(--color-text-muted)',
                            display: 'block',
                            marginBottom: '6px'
                        }}>
                            Next →
                        </span>
                        <span style={{
                            fontSize: '18px',
                            fontFamily: 'var(--font-serif)',
                            fontStyle: 'italic',
                            color: 'var(--color-text-secondary)',
                            lineHeight: 1.3
                        }}>
                            {nextStudy.title}
                        </span>
                    </button>
                ) : <div />}
            </nav>
        </footer>
    );
}
