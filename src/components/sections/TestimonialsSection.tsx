import { useState } from 'react';
import { testimonials as testimonialsData } from '../../lib/content';
import TestimonialCard from '../common/TestimonialCard';

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
        <span className="eyebrow">
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

      {/* Testimonials - Carousel on mobile, list on tablet/desktop */}
      {isMobile ? (
        /* Mobile Carousel */
        <div style={{ position: 'relative' }}>
          {featuredTestimonials.length > 0 && (
            <TestimonialCard
              quote={featuredTestimonials[currentIndex].quote}
              author={featuredTestimonials[currentIndex].author}
              role={featuredTestimonials[currentIndex].role}
              company={featuredTestimonials[currentIndex].company}
              initials={'initials' in featuredTestimonials[currentIndex]
                ? (featuredTestimonials[currentIndex] as { initials: string }).initials
                : undefined}
              variant="mobile"
            />
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
        /* Tablet/Desktop - Single column layout for reading flow */
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-xl)',
            maxWidth: '720px'
          }}
        >
          {featuredTestimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              quote={testimonial.quote}
              author={testimonial.author}
              role={testimonial.role}
              company={testimonial.company}
              initials={'initials' in testimonial
                ? (testimonial as { initials: string }).initials
                : undefined}
              variant="desktop"
              isHovered={hovered === index}
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
