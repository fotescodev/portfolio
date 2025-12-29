import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { profile } from '../../lib/content';

export default function Omnibar() {
    const [copied, setCopied] = useState(false);
    const [heroVisible, setHeroVisible] = useState(true);
    const [footerVisible, setFooterVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
    const heroObserverRef = useRef<IntersectionObserver | null>(null);
    const footerObserverRef = useRef<IntersectionObserver | null>(null);

    // Track window resize for mobile detection
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Derived state: Show omnibar only when hero CTAs are NOT visible AND footer CTA is NOT visible
    const isVisible = !heroVisible && !footerVisible;

    const handleCopyEmail = () => {
        navigator.clipboard.writeText(profile.email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Observe Hero CTA section
    useEffect(() => {
        // Find the hero CTA container - check for desktop (.hero-primary-btn) or mobile (.mobile-hero-primary-btn)
        const desktopBtn = document.querySelector('.hero-primary-btn');
        const mobileBtn = document.querySelector('.mobile-hero-primary-btn');
        const heroCta = desktopBtn?.parentElement || mobileBtn?.parentElement;

        if (!heroCta) return;

        heroObserverRef.current = new IntersectionObserver(
            ([entry]) => {
                setHeroVisible(entry.isIntersecting);
            },
            {
                threshold: 0.1,
                rootMargin: '0px'
            }
        );

        heroObserverRef.current.observe(heroCta);

        return () => {
            heroObserverRef.current?.disconnect();
        };
    }, []);

    // Observe Footer CTA section
    useEffect(() => {
        // Find the "Let's build" CTA section
        const ctaSection = document.querySelector('section[style*="text-align"]');

        if (!ctaSection) return;

        footerObserverRef.current = new IntersectionObserver(
            ([entry]) => {
                setFooterVisible(entry.isIntersecting);
            },
            {
                threshold: 0.2,
                rootMargin: '0px'
            }
        );

        footerObserverRef.current.observe(ctaSection);

        return () => {
            footerObserverRef.current?.disconnect();
        };
    }, []);

    // Typography-based icon style
    const iconStyle = {
        fontFamily: 'var(--font-serif)',
        fontStyle: 'italic' as const,
        fontSize: '14px',
        fontWeight: 400,
        opacity: 0.7
    };

    return (
        <>
            <style>{`
                .omnibar-btn {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 10px 14px;
                    background: transparent;
                    border: none;
                    border-radius: 2px;
                    color: var(--color-text-primary);
                    font-size: 12px;
                    font-weight: 500;
                    letter-spacing: 0.02em;
                    cursor: pointer;
                    white-space: nowrap;
                    text-decoration: none;
                    transition: background 0.2s ease;
                }
                .omnibar-btn:hover {
                    background: var(--color-tag-hover);
                }
                .omnibar-btn-primary {
                    background: transparent;
                    border: 1px solid var(--color-accent);
                    color: var(--color-accent);
                    font-weight: 600;
                }
                .omnibar-btn-primary:hover {
                    background: var(--color-accent);
                    color: var(--color-background);
                }
            `}</style>

            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ y: 100, opacity: 0, x: '-50%' }}
                        animate={{ y: 0, opacity: 1, x: '-50%' }}
                        exit={{ y: 20, opacity: 0, x: '-50%' }}
                        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                        style={{
                            position: 'fixed',
                            bottom: 'var(--omnibar-bottom-spacing)',
                            left: '50%',
                            zIndex: 'var(--omnibar-z-index)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-xs)',
                            padding: 'var(--space-xs)',
                            background: 'var(--color-surface-glass)',
                            backdropFilter: 'blur(12px)',
                            WebkitBackdropFilter: 'blur(12px)',
                            borderRadius: '4px',
                            border: '1px solid var(--color-border-light)',
                            boxShadow: 'var(--shadow-omnibar)'
                        }}
                    >
                        {/* Email / Copy */}
                        <motion.button
                            onClick={handleCopyEmail}
                            whileTap={{ scale: 0.98 }}
                            className="omnibar-btn"
                        >
                            <AnimatePresence mode='wait' initial={false}>
                                {copied ? (
                                    <motion.span
                                        key="check"
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.8, opacity: 0 }}
                                        style={iconStyle}
                                    >
                                        ✓
                                    </motion.span>
                                ) : (
                                    <motion.svg
                                        key="copy"
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 0.7 }}
                                        exit={{ scale: 0.8, opacity: 0 }}
                                        width="14"
                                        height="14"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                    </motion.svg>
                                )}
                            </AnimatePresence>
                            <span>{copied ? 'Copied!' : (isMobile ? 'Email' : 'Copy Email')}</span>
                        </motion.button>

                        <div style={{ width: '1px', height: '16px', background: 'var(--color-border-light)' }} />

                        {/* Resume */}
                        <motion.a
                            href="/dmitrii-fotesco-resume.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileTap={{ scale: 0.98 }}
                            className="omnibar-btn"
                        >
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                style={{ opacity: 0.7 }}
                            >
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7 10 12 15 17 10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                            <span>{isMobile ? 'CV' : 'Resume'}</span>
                        </motion.a>

                        <div style={{ width: '1px', height: '16px', background: 'var(--color-border-light)' }} />

                        {/* Book Time (Primary) */}
                        <motion.a
                            href="https://calendar.google.com/calendar/u/0/appointments/AcZssZ2leGghBAF6F4IbGMZQErnaR21wvu-mYWXP06o="
                            target="_blank"
                            rel="noopener noreferrer"
                            whileTap={{ scale: 0.98 }}
                            className="omnibar-btn omnibar-btn-primary"
                        >
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                <line x1="16" y1="2" x2="16" y2="6" />
                                <line x1="8" y1="2" x2="8" y2="6" />
                                <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                            <span>{isMobile ? 'Book' : 'Book Time'}</span>
                        </motion.a>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
