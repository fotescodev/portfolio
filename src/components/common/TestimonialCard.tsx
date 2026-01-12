interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  company: string;
  initials?: string;
  variant?: 'mobile' | 'desktop';
  isHovered?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export default function TestimonialCard({
  quote,
  author,
  role,
  company,
  initials,
  variant = 'desktop',
  isHovered = false,
  onMouseEnter,
  onMouseLeave
}: TestimonialCardProps) {
  const isMobile = variant === 'mobile';

  // Generate initials from author name if not provided
  const displayInitials = initials || author.split(' ').slice(0, 2).map((n) => n[0]).join('');

  return (
    <article
      className="light-card"
      style={{
        background:
          'linear-gradient(135deg, var(--color-background-secondary) 0%, var(--color-background-tertiary) 100%)',
        border: isHovered ? '1px solid var(--color-border)' : '1px solid var(--color-border-light)',
        padding: isMobile ? 'var(--space-lg)' : 'var(--space-xl)',
        position: 'relative',
        transition: isMobile ? undefined : 'border-color var(--transition-fast), transform var(--transition-fast), box-shadow var(--transition-fast)',
        transform: !isMobile && isHovered ? 'translateY(-2px)' : 'translateY(0)'
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Quote mark */}
      <div
        aria-hidden="true"
        className={isMobile ? 'quote-mark' : 'quote-mark-subtle'}
        style={{
          position: 'absolute',
          top: 'var(--space-md)',
          right: 'var(--space-md)'
        }}
      >
        "
      </div>

      {/* Content */}
      <p
        style={{
          fontSize: isMobile ? '15px' : '16px',
          lineHeight: 1.7,
          color: 'var(--color-text-secondary)',
          marginBottom: 'var(--space-lg)',
          position: 'relative',
          zIndex: 1,
          fontFamily: 'var(--font-serif)',
          fontStyle: 'italic'
        }}
      >
        {quote}
      </p>

      {/* Author */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
        <div
          style={{
            width: '44px',
            height: '44px',
            background: 'var(--color-background-tertiary)',
            border: '1px solid var(--color-border-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: 600,
            letterSpacing: '0.02em',
            color: 'var(--color-text-primary)',
            flexShrink: 0
          }}
        >
          {displayInitials}
        </div>

        <div>
          <div
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              marginBottom: 2
            }}
          >
            {author}
          </div>
          <div
            style={{
              fontSize: '12px',
              color: 'var(--color-text-tertiary)',
              lineHeight: 1.4
            }}
          >
            {role} · {company}
          </div>
        </div>
      </div>
    </article>
  );
}
