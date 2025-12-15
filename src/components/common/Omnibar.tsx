import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { profile } from '../../lib/content';

export default function Omnibar() {
    const [copied, setCopied] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const observerRef = useRef<IntersectionObserver | null>(null);

    const handleCopyEmail = () => {
        navigator.clipboard.writeText(profile.email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Hide Omnibar when footer CTA is visible
    useEffect(() => {
        // Find the "Let's build" CTA section
        const ctaSection = document.querySelector('section[style*="textAlign"]');

        if (!ctaSection) return;

        observerRef.current = new IntersectionObserver(
            ([entry]) => {
                // Hide when CTA section is 20% visible
                setIsVisible(!entry.isIntersecting);
            },
            {
                threshold: 0.2,
                rootMargin: '0px'
            }
        );

        observerRef.current.observe(ctaSection);

        return () => {
            observerRef.current?.disconnect();
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
                    background: var(--color-text-primary);
                    color: var(--color-background);
                    font-weight: 600;
                }
                .omnibar-btn-primary:hover {
                    opacity: 0.9;
                    background: var(--color-text-primary);
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
                                    <motion.span
                                        key="email"
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.8, opacity: 0 }}
                                        style={iconStyle}
                                    >
                                        @
                                    </motion.span>
                                )}
                            </AnimatePresence>
                            <span>{copied ? 'Copied' : 'Email'}</span>
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
                            <span style={iconStyle}>CV</span>
                            <span>Resume</span>
                        </motion.a>

                        <div style={{ width: '1px', height: '16px', background: 'var(--color-border-light)' }} />

                        {/* Book Call (Primary) */}
                        <motion.a
                            href="https://calendly.com/dmitriifotesco"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileTap={{ scale: 0.98 }}
                            className="omnibar-btn omnibar-btn-primary"
                        >
                            <span style={{ ...iconStyle, opacity: 1 }}>→</span>
                            <span>Book Call</span>
                        </motion.a>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
