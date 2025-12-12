import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { profile } from '../../lib/content';

export default function Omnibar() {
    const { colors, isDark } = useTheme();
    const [copied, setCopied] = useState(false);

    const handleCopyEmail = () => {
        navigator.clipboard.writeText(profile.email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div
            initial={{ y: 100, opacity: 0, x: '-50%' }}
            animate={{ y: 0, opacity: 1, x: '-50%' }}
            transition={{ type: 'spring', damping: 20, stiffness: 300, delay: 0.5 }}
            style={{
                position: 'fixed',
                bottom: 'var(--omnibar-bottom-spacing)',
                left: '50%',
                zIndex: 'var(--omnibar-z-index)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px',
                background: isDark ? 'rgba(20, 20, 22, 0.6)' : 'rgba(255, 255, 255, 0.6)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                borderRadius: '100px',
                border: `1px solid ${colors.borderLight}`,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)'
            }}
        >
            {/* Email / Copy */}
            <motion.button
                onClick={handleCopyEmail}
                whileHover={{ scale: 1.05, backgroundColor: colors.tagHover }}
                whileTap={{ scale: 0.95 }}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    background: 'transparent',
                    border: 'none',
                    color: colors.textPrimary,
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    borderRadius: '100px',
                    whiteSpace: 'nowrap'
                }}
            >
                <AnimatePresence mode='wait' initial={false}>
                    {copied ? (
                        <motion.span
                            key="check"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            style={{ fontSize: '16px' }}
                        >
                            ✓
                        </motion.span>
                    ) : (
                        <motion.span
                            key="email"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            style={{ fontSize: '16px' }}
                        >
                            ✉️
                        </motion.span>
                    )}
                </AnimatePresence>
                <span>{copied ? 'Copied' : 'Email'}</span>
            </motion.button>

            <div style={{ width: '1px', height: '16px', background: colors.borderLight }} />

            {/* Resume */}
            <motion.a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, backgroundColor: colors.tagHover }}
                whileTap={{ scale: 0.95 }}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    background: 'transparent',
                    border: 'none',
                    color: colors.textPrimary,
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    textDecoration: 'none',
                    borderRadius: '100px'
                }}
            >
                <span>📄</span>
                <span>Resume</span>
            </motion.a>

            <div style={{ width: '1px', height: '16px', background: colors.borderLight }} />

            {/* Book Call (Primary) */}
            <motion.a
                href="https://calendly.com/dmitriifotesco"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    background: colors.textPrimary,
                    color: colors.background,
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textDecoration: 'none',
                    borderRadius: '100px'
                }}
            >
                <span>☕️</span>
                <span>Book Call</span>
            </motion.a>
        </motion.div>
    );
}
