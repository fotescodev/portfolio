import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { profile } from '../../lib/content';

export default function Omnibar() {
    const { colors, isDark } = useTheme();
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
        const ctaSection = document.querySelector('section[style*="textAlign: \'center\'"]');

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
                        gap: '4px',
                        padding: '4px',
                        background: isDark ? 'rgba(20, 20, 22, 0.6)' : 'rgba(255, 255, 255, 0.6)',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        borderRadius: '4px',
                        border: `1px solid ${colors.borderLight}`,
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)'
                    }}
                >
                    {/* Email / Copy */}
                    <motion.button
                        onClick={handleCopyEmail}
                        whileHover={{ backgroundColor: colors.tagHover }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '10px 14px',
                            background: 'transparent',
                            border: 'none',
                            borderRadius: '2px',
                            color: colors.textPrimary,
                            fontSize: '12px',
                            fontWeight: 500,
                            letterSpacing: '0.02em',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap'
                        }}
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

                    <div style={{ width: '1px', height: '16px', background: colors.borderLight }} />

                    {/* Resume */}
                    <motion.a
                        href="/dmitrii-fotesco-resume.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ backgroundColor: colors.tagHover }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '10px 14px',
                            background: 'transparent',
                            border: 'none',
                            borderRadius: '2px',
                            color: colors.textPrimary,
                            fontSize: '12px',
                            fontWeight: 500,
                            letterSpacing: '0.02em',
                            cursor: 'pointer',
                            textDecoration: 'none'
                        }}
                    >
                        <span style={iconStyle}>CV</span>
                        <span>Resume</span>
                    </motion.a>

                    <div style={{ width: '1px', height: '16px', background: colors.borderLight }} />

                    {/* Book Call (Primary) */}
                    <motion.a
                        href="https://calendly.com/dmitriifotesco"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ opacity: 0.9 }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '10px 14px',
                            background: colors.textPrimary,
                            color: colors.background,
                            border: 'none',
                            borderRadius: '2px',
                            fontSize: '12px',
                            fontWeight: 600,
                            letterSpacing: '0.02em',
                            cursor: 'pointer',
                            textDecoration: 'none'
                        }}
                    >
                        <span style={{ ...iconStyle, opacity: 1 }}>→</span>
                        <span>Book Call</span>
                    </motion.a>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
