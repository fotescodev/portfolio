import { useState } from 'react';
import { testimonials as testimonialsData } from '../../lib/content';

interface TestimonialsSectionProps {
  isMobile: boolean;
  isTablet: boolean;
  sectionPadding: string;
}

export default function TestimonialsSection({ isMobile, isTablet, sectionPadding }: TestimonialsSectionProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { testimonials } = testimonialsData;
  const featuredTestimonials = testimonials.filter(t => t.featured);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredTestimonials.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredTestimonials.length) % featuredTestimonials.length);
  };

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

      {/* Testimonials - Carousel on mobile, horizontal scroll on tablet/desktop */}
      {isMobile ? (
        /* Mobile Carousel */
        <div style={{ position: 'relative' }}>
          {/* Current testimonial */}
          {featuredTestimonials.length > 0 && (
            <article
              className="light-card"
              style={{
                background:
                  'linear-gradient(135deg, var(--color-background-secondary) 0%, var(--color-background-tertiary) 100%)',
                border: '1px solid var(--color-border-light)',
                padding: 'var(--space-lg)',
                position: 'relative'
              }}
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
                  fontSize: '15px',
                  lineHeight: 1.7,
                  color: 'var(--color-text-secondary)',
                  marginBottom: 'var(--space-lg)',
                  position: 'relative',
                  zIndex: 1,
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'italic'
                }}
              >
                {featuredTestimonials[currentIndex].quote}
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
                  {('initials' in featuredTestimonials[currentIndex])
                    ? (featuredTestimonials[currentIndex] as { initials: string }).initials
                    : featuredTestimonials[currentIndex].author.split(' ').slice(0, 2).map((n) => n[0]).join('')}
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
                    {featuredTestimonials[currentIndex].author}
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'var(--color-text-tertiary)',
                      lineHeight: 1.4
                    }}
                  >
                    {featuredTestimonials[currentIndex].role} · {featuredTestimonials[currentIndex].company}
                  </div>
                </div>
              </div>
            </article>
          )}

          {/* Navigation controls */}
          {featuredTestimonials.length > 1 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--space-lg)',
              marginTop: 'var(--space-md)'
            }}>
              <button
                onClick={goToPrev}
                aria-label="Previous testimonial"
                style={{
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'transparent',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  borderRadius: '50%'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>

              {/* Dots indicator */}
              <div style={{ display: 'flex', gap: '8px' }}>
                {featuredTestimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    aria-label={`Go to testimonial ${idx + 1}`}
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: idx === currentIndex ? 'var(--color-accent)' : 'var(--color-border)',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0
                    }}
                  />
                ))}
              </div>

              <button
                onClick={goToNext}
                aria-label="Next testimonial"
                style={{
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'transparent',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  borderRadius: '50%'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Tablet/Desktop - Horizontal scroll */
        <div
          style={{
            display: 'flex',
            gap: 'var(--space-lg)',
            overflowX: 'auto',
            paddingBottom: 'var(--space-md)',
            scrollSnapType: 'x mandatory'
          }}
        >
          {featuredTestimonials.map((testimonial, index) => {
            const isHovered = hovered === index;

            return (
              <article
                key={index}
                className="light-card"
                style={{
                  flex: '0 0 auto',
                  width: isTablet ? '420px' : '460px',
                  scrollSnapAlign: 'start',
                  background:
                    'linear-gradient(135deg, var(--color-background-secondary) 0%, var(--color-background-tertiary) 100%)',
                  border: isHovered ? '1px solid var(--color-border)' : '1px solid var(--color-border-light)',
                  padding: 'var(--space-xl)',
                  position: 'relative',
                  transition: 'border-color var(--transition-fast), transform var(--transition-fast), box-shadow var(--transition-fast)',
                  transform: isHovered ? 'translateY(-2px)' : 'translateY(0)'
                }}
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(null)}
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
                    fontSize: '16px',
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
      )}
    </section>
  );
}
