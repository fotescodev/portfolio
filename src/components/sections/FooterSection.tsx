interface FooterSectionProps {
  isMobile: boolean;
}

// Get dashboard URL based on environment
function getDashboardUrl(): string {
  if (typeof window === 'undefined') {
    return '/cv-dashboard/index.html';
  }

  const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  if (isDev) {
    // Pass current port to dashboard so it knows where portfolio is running
    // Use index.html explicitly to bypass React Router interception
    const currentPort = window.location.port || '5173';
    return `/cv-dashboard/index.html?devPort=${currentPort}`;
  }

  return 'https://fotescodev.github.io/portfolio/cv-dashboard/';
}

export default function FooterSection({ isMobile }: FooterSectionProps) {
  return (
    <footer id="contact" style={{
      padding: isMobile ? 'var(--space-xl) var(--space-lg)' : 'var(--space-2xl) var(--space-3xl)',
      borderTop: '1px solid var(--color-border-light)',
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
        letterSpacing: '0.02em',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        © 2025
        <a
          href={getDashboardUrl()}
          title="Dashboard"
          style={{
            color: 'var(--color-text-muted)',
            opacity: 0.4,
            display: 'inline-flex',
            alignItems: 'center',
            transition: 'opacity 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '0.4'}
          onClick={(e) => {
            e.preventDefault();
            window.location.href = getDashboardUrl();
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
        </a>
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
