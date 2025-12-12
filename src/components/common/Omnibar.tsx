import { useState } from 'react';
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
        <div style={{
            position: 'fixed',
            bottom: 'var(--omnibar-bottom-spacing)',
            left: '50%',
            transform: 'translateX(-50%)',
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
        }}>
            {/* Email / Copy */}
            <button
                onClick={handleCopyEmail}
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
                    transition: 'background 0.2s ease',
                    whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = colors.tagHover)}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
                <span style={{ fontSize: '16px' }}>{copied ? '✓' : '✉️'}</span>
                <span>{copied ? 'Copied' : 'Email'}</span>
            </button>

            <div style={{ width: '1px', height: '16px', background: colors.borderLight }} />

            {/* Resume */}
            <a
                href="/resume.pdf" // Placeholder, user needs to add resume.pdf to public folder
                target="_blank"
                rel="noopener noreferrer"
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
                    borderRadius: '100px',
                    transition: 'background 0.2s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = colors.tagHover)}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
                <span>📄</span>
                <span>Resume</span>
            </a>

            <div style={{ width: '1px', height: '16px', background: colors.borderLight }} />

            {/* Book Call (Primary) */}
            <a
                href="https://calendly.com/dmitriifotesco" // Hardcoded based on CaseStudyFooter knowledge
                target="_blank"
                rel="noopener noreferrer"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    background: colors.textPrimary, // Primary action style
                    color: colors.background,
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textDecoration: 'none',
                    borderRadius: '100px',
                    transition: 'transform 0.2s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
                <span>☕️</span>
                <span>Book Call</span>
            </a>
        </div>
    );
}
