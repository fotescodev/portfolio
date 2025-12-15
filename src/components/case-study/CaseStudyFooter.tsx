import { useState } from 'react';
import type { CaseStudy } from '../../types/portfolio';
import { profile } from '../../lib/content';

interface CaseStudyFooterProps {
    caseStudy: CaseStudy;
    prevStudy: CaseStudy | null;
    nextStudy: CaseStudy | null;
    onNavigate: (study: CaseStudy) => void;
    isMobile?: boolean;
}

export default function CaseStudyFooter({ caseStudy, prevStudy, nextStudy, onNavigate, isMobile = false }: CaseStudyFooterProps) {
    const [copied, setCopied] = useState(false);

    const handleCopyEmail = () => {
        navigator.clipboard.writeText(profile.email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const padding = isMobile ? 'var(--space-lg)' : 'var(--space-2xl)';

    const btnStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 16px',
        background: 'transparent',
        border: 'none',
        color: 'var(--color-text-primary)',
        fontSize: '13px',
        fontWeight: 500,
        letterSpacing: '0.02em',
        cursor: 'pointer',
        whiteSpace: 'nowrap' as const,
        textDecoration: 'none',
        transition: 'background 0.2s ease'
    };

    const primaryBtnStyle = {
        ...btnStyle,
        background: 'transparent',
        border: '1px solid var(--color-accent)',
        color: 'var(--color-accent)',
        fontWeight: 600
    };

    return (
        <footer style={{
            maxWidth: 'var(--drawer-content-max-width)',
            margin: '0 auto',
            padding: `0 ${padding} ${padding}`
        }}>
            <style>{`
                .drawer-cta-btn:hover {
                    background: var(--color-tag-hover) !important;
                }
                .drawer-cta-btn-primary:hover {
                    background: var(--color-accent) !important;
                    color: var(--color-background) !important;
                }
                .drawer-social-icon:hover {
                    color: var(--color-accent) !important;
                }
            `}</style>

            {/* CTA Section */}
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

                {/* Omnibar-style CTA */}
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 'var(--space-sm)',
                    padding: 'var(--space-sm)',
                    background: 'var(--color-surface-glass)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    borderRadius: '6px',
                    border: '1px solid var(--color-border-light)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    flexWrap: isMobile ? 'wrap' : 'nowrap',
                    justifyContent: 'center'
                }}>
                    {/* Copy Email */}
                    <button
                        onClick={handleCopyEmail}
                        className="drawer-cta-btn"
                        style={btnStyle}
                    >
                        {copied ? (
                            <span style={{ fontSize: '14px' }}>✓</span>
                        ) : (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7 }}>
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                            </svg>
                        )}
                        <span>{copied ? 'Copied!' : 'Copy Email'}</span>
                    </button>

                    <div style={{ width: '1px', height: '20px', background: 'var(--color-border-light)' }} />

                    {/* Resume */}
                    <a
                        href="/dmitrii-fotesco-resume.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="drawer-cta-btn"
                        style={btnStyle}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7 }}>
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        <span>Resume</span>
                    </a>

                    <div style={{ width: '1px', height: '20px', background: 'var(--color-border-light)' }} />

                    {/* Book Time */}
                    <a
                        href="https://calendar.google.com/calendar/u/0/appointments/AcZssZ2leGghBAF6F4IbGMZQErnaR21wvu-mYWXP06o="
                        target="_blank"
                        rel="noopener noreferrer"
                        className="drawer-cta-btn drawer-cta-btn-primary"
                        style={primaryBtnStyle}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        <span>Book Time</span>
                    </a>
                </div>

                {/* Social Icons */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 'var(--space-lg)',
                    marginTop: 'var(--space-xl)'
                }}>
                    {/* LinkedIn */}
                    <a
                        href="https://www.linkedin.com/in/0xdmitri/"
                        target="_blank"
                        rel="noopener noreferrer"
                        title="LinkedIn"
                        className="drawer-social-icon"
                        style={{ color: 'var(--color-text-tertiary)', transition: 'color 0.2s ease' }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                    </a>

                    {/* GitHub */}
                    <a
                        href="https://github.com/fotescodev"
                        target="_blank"
                        rel="noopener noreferrer"
                        title="GitHub"
                        className="drawer-social-icon"
                        style={{ color: 'var(--color-text-tertiary)', transition: 'color 0.2s ease' }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                    </a>

                    {/* X / Twitter */}
                    <a
                        href="https://x.com/kolob0kk"
                        target="_blank"
                        rel="noopener noreferrer"
                        title="X / Twitter"
                        className="drawer-social-icon"
                        style={{ color: 'var(--color-text-tertiary)', transition: 'color 0.2s ease' }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                    </a>

                    {/* Telegram */}
                    <a
                        href="https://t.me/zimbru0x"
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Telegram"
                        className="drawer-social-icon"
                        style={{ color: 'var(--color-text-tertiary)', transition: 'color 0.2s ease' }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                        </svg>
                    </a>
                </div>
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
