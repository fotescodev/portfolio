interface FooterSectionProps {
  isMobile: boolean;
}

export default function FooterSection({ isMobile }: FooterSectionProps) {
  return (
    <footer id="contact" style={{
      padding: isMobile ? 'var(--space-xl) var(--space-lg)' : 'var(--space-2xl) var(--space-3xl)',
      borderTop: '1px solid var(--color-experience-border)',
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      justifyContent: 'space-between',
      alignItems: isMobile ? 'flex-start' : 'center',
      gap: 'var(--space-md)',
      position: 'relative',
      zIndex: 1
    }}>
      <div style={{
        fontSize: '12px',
        color: 'var(--color-text-muted)',
        letterSpacing: '0.02em'
      }}>
        © 2025
      </div>
      <div style={{
        fontSize: '12px',
        color: 'var(--color-text-muted)',
        fontStyle: 'italic',
        fontFamily: 'var(--font-serif)'
      }}>
        Designed and built by Dmitrii
      </div>
    </footer>
  );
}
