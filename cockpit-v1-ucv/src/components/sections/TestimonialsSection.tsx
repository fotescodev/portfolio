import { useState } from 'react';
import { testimonials as testimonialsData } from '../../lib/content';

interface TestimonialsSectionProps {
  isMobile: boolean;
  isTablet: boolean;
  sectionPadding: string;
}

export default function TestimonialsSection({ isMobile, isTablet, sectionPadding }: TestimonialsSectionProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const { testimonials } = testimonialsData;

  return (
    <section
      id="testimonials"
      style={{
        padding: sectionPadding,
        maxWidth: 'var(--layout-max-width)',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1
      }}
    >
      {/* Section label */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-lg)',
          marginBottom: isMobile ? 'var(--space-xl)' : 'calc(var(--space-xl) + var(--space-sm))'
        }}
      >
        <span
          style={{
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--color-text-muted)'
          }}
        >
          References
        </span>
        <div style={{ flex: 1, height: '1px', background: 'var(--color-border-light)' }} />
      </div>

      {/* Section header */}
      <div style={{ marginBottom: isMobile ? 'var(--space-xl)' : 'var(--space-2xl)' }}>
        <h2
          style={{
            fontSize: isMobile ? '28px' : isTablet ? '36px' : '42px',
            fontFamily: 'var(--font-serif)',
            fontWeight: 400,
            fontStyle: 'italic',
            color: 'var(--color-text-primary)',
            marginBottom: 'var(--space-md)',
            letterSpacing: '-0.02em',
            lineHeight: 1.2
          }}
        >
          People I've built with
        </h2>
        <p
          style={{
            fontSize: '15px',
            color: 'var(--color-text-tertiary)',
            maxWidth: '720px',
            lineHeight: 1.6
          }}
        >
          A few words from leaders and collaborators across crypto infrastructure and product.
        </p>
      </div>

      {/* Testimonials - Horizontal scroll */}
      <div
        style={{
          display: 'flex',
          gap: isMobile ? 'var(--space-md)' : 'var(--space-lg)',
          overflowX: 'auto',
          paddingBottom: 'var(--space-md)',
          scrollSnapType: 'x mandatory'
        }}
      >
        {testimonials.filter(t => t.featured).map((testimonial, index) => {
          const isHovered = hovered === index;

          return (
            <article
              key={index}
              style={{
                flex: '0 0 auto',
                width: isMobile ? '86vw' : isTablet ? '420px' : '460px',
                scrollSnapAlign: 'start',
                background:
                  'linear-gradient(135deg, var(--color-background-secondary) 0%, var(--color-background-tertiary) 100%)',
                border: isHovered ? '1px solid var(--color-border)' : '1px solid var(--color-border-light)',
                padding: isMobile ? 'var(--space-lg)' : 'var(--space-xl)',
                position: 'relative',
                transition: 'border-color var(--transition-fast), transform var(--transition-fast)',
                transform: isHovered ? 'translateY(-2px)' : 'translateY(0)'
              }}
              onMouseEnter={() => !isMobile && setHovered(index)}
              onMouseLeave={() => !isMobile && setHovered(null)}
            >
              {/* Quote mark */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  top: 'var(--space-md)',
                  right: 'var(--space-md)',
                  fontFamily: 'var(--font-serif)',
                  fontSize: '54px',
                  lineHeight: 1,
                  color: 'var(--color-accent)',
                  opacity: 0.18
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
                {testimonial.quote}
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
                  {('initials' in testimonial)
                    ? (testimonial as { initials: string }).initials
                    : testimonial.author.split(' ').slice(0, 2).map((n) => n[0]).join('')}
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
                    {testimonial.author}
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'var(--color-text-tertiary)',
                      lineHeight: 1.4
                    }}
                  >
                    {testimonial.role} · {testimonial.company}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
