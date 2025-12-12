import { useTheme } from '../../context/ThemeContext';
import { testimonials as testimonialsData } from '../../lib/content';

interface TestimonialsSectionProps {
  isMobile: boolean;
  sectionPadding: string;
}

export default function TestimonialsSection({ isMobile, sectionPadding }: TestimonialsSectionProps) {
  const { colors } = useTheme();
  const { testimonials } = testimonialsData;

  return (
    <section style={{
      padding: sectionPadding,
      maxWidth: 'var(--layout-max-width)',
      margin: '0 auto',
      position: 'relative',
      zIndex: 1
    }}>
      {/* Section label */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        marginBottom: isMobile ? '32px' : '40px'
      }}>
        <span style={{
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: colors.textMuted
        }}>
          What People Say
        </span>
        <div style={{
          flex: 1,
          height: '1px',
          background: 'rgba(232, 230, 227, 0.08)'
        }} />
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
        gap: '24px'
      }}>
        {testimonials.filter(t => t.featured).map((testimonial, index) => (
          <div key={index} style={{
            background: 'linear-gradient(135deg, #141416 0%, #1a1a1c 100%)',
            border: '1px solid rgba(232, 230, 227, 0.08)',
            padding: isMobile ? '28px 24px' : '36px',
            position: 'relative'
          }}>
            {/* Quote mark */}
            <div style={{
              position: 'absolute',
              top: isMobile ? '16px' : '24px',
              left: isMobile ? '16px' : '24px',
              fontSize: '48px',
              fontFamily: "'Instrument Serif', Georgia, serif",
              color: 'rgba(194, 154, 108, 0.2)',
              lineHeight: 1
            }}>
              "
            </div>

            <div style={{ paddingTop: '24px' }}>
              <p style={{
                fontSize: '16px',
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontStyle: 'italic',
                color: colors.textSecondary,
                lineHeight: 1.7,
                marginBottom: '24px'
              }}>
                {testimonial.quote}
              </p>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(135deg, #2a2a2c 0%, #1a1a1c 100%)',
                  border: '1px solid rgba(232, 230, 227, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: colors.textMuted,
                  fontSize: '18px',
                  fontFamily: "'Instrument Serif', Georgia, serif"
                }}>
                  {('initials' in testimonial) ? (testimonial as { initials: string }).initials : testimonial.author.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: colors.textSecondary,
                    marginBottom: '2px'
                  }}>
                    {testimonial.author}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: colors.textMuted
                  }}>
                    {testimonial.role} at {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
