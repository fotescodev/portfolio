interface CaseStudyHeaderProps {
    onClose: () => void;
    isMobile: boolean;
}

export default function CaseStudyHeader({ onClose, isMobile }: CaseStudyHeaderProps) {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: isMobile ? 'var(--space-md) 20px' : '20px var(--space-2xl)',
            borderBottom: '1px solid var(--color-border-light)',
            background: 'var(--color-background)',
            position: 'sticky',
            top: 0,
            zIndex: 10
        }}>
            <button
                onClick={onClose}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-sm)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-text-muted)',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    padding: 0
                }}
            >
                <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>←</span>
                Back
            </button>
            <button
                onClick={onClose}
                style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-text-muted)',
                    width: '32px',
                    height: '32px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px'
                }}
            >
                ×
            </button>
        </div>
    );
}
