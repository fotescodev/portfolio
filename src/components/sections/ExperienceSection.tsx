import { useVariant } from '../../context/VariantContext';
import { getExperienceWithOverrides } from '../../lib/variants';

interface Job {
  company: string;
  role: string;
  period: string;
  location: string;
  logo?: string | null;
  highlights: string[];
  tags: string[];
  url?: string | null;
}

interface ExperienceSectionProps {
  isMobile: boolean;
  isTablet: boolean;
  sectionPadding: string;
}

export default function ExperienceSection({ isMobile, isTablet, sectionPadding }: ExperienceSectionProps) {
  const { variant } = useVariant();
  const experience = getExperienceWithOverrides(variant) as { jobs: Job[] };
  const { jobs } = experience;

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
        gap: 'var(--space-lg)',
        marginBottom: isMobile ? 'var(--space-xl)' : '40px'
      }}>
        <span style={{
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'var(--color-text-muted)'
        }}>
          Experience
        </span>
        <div style={{
          flex: 1,
          height: '1px',
          background: 'var(--color-border-light)'
        }} />
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0'
      }}>
        {jobs.map((job, index) => (
          <div
            key={index}
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : isTablet ? '160px 1fr' : '200px 1fr',
              gap: isMobile ? 'var(--space-md)' : 'var(--space-2xl)',
              padding: isMobile ? 'var(--space-lg) 0' : 'var(--space-xl) 0',
              borderBottom: '1px solid var(--color-experience-border)'
            }}
          >
            {/* Left column - Company & Period */}
            <div>
              <div style={{
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: 'var(--color-text-tertiary)',
                marginBottom: 'var(--space-xs)'
              }}>
                {job.period}
              </div>
              <div style={{
                fontSize: isMobile ? '16px' : '18px',
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--space-xs)'
              }}>
                {job.company}
              </div>
              <div style={{
                fontSize: '12px',
                color: 'var(--color-text-muted)'
              }}>
                {job.location}
              </div>
            </div>

            {/* Right column - Role & Highlights */}
            <div>
              <div style={{
                fontSize: isMobile ? '15px' : '16px',
                fontWeight: 500,
                color: 'var(--color-text-secondary)',
                marginBottom: '12px'
              }}>
                {job.role}
              </div>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: '0 0 var(--space-md) 0',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-sm)'
              }}>
                {job.highlights.map((highlight, i) => (
                  <li
                    key={i}
                    style={{
                      fontSize: '14px',
                      color: 'var(--color-text-tertiary)',
                      lineHeight: 1.5,
                      paddingLeft: 'var(--space-md)',
                      position: 'relative'
                    }}
                  >
                    <span style={{
                      position: 'absolute',
                      left: 0,
                      color: 'var(--color-accent)'
                    }}>→</span>
                    {highlight}
                  </li>
                ))}
              </ul>
              <div style={{
                display: 'flex',
                gap: 'var(--space-sm)',
                flexWrap: 'wrap'
              }}>
                {job.tags.map((tag, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: '10px',
                      fontWeight: 500,
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      color: 'var(--color-text-muted)',
                      padding: '4px 8px',
                      border: '1px solid var(--color-border)'
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
