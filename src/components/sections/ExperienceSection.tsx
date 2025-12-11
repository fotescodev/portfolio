import { useTheme } from '../../context/ThemeContext';
import { experience } from '../../lib/content';

interface ExperienceSectionProps {
  isMobile: boolean;
  isTablet: boolean;
  sectionPadding: string;
}

export default function ExperienceSection({ isMobile, isTablet, sectionPadding }: ExperienceSectionProps) {
  const { colors } = useTheme();
  const { jobs } = experience;

  return (
    <section style={{
      padding: sectionPadding,
      maxWidth: '1400px',
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
          Experience
        </span>
        <div style={{
          flex: 1,
          height: '1px',
          background: 'rgba(232, 230, 227, 0.08)'
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
              gap: isMobile ? '16px' : '48px',
              padding: isMobile ? '24px 0' : '32px 0',
              borderBottom: '1px solid rgba(232, 230, 227, 0.06)'
            }}
          >
            {/* Left column - Company & Period */}
            <div>
              <div style={{
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: colors.textTertiary,
                marginBottom: '4px'
              }}>
                {job.period}
              </div>
              <div style={{
                fontSize: isMobile ? '16px' : '18px',
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontStyle: 'italic',
                color: colors.textSecondary,
                marginBottom: '4px'
              }}>
                {job.company}
              </div>
              <div style={{
                fontSize: '12px',
                color: colors.textMuted
              }}>
                {job.location}
              </div>
            </div>

            {/* Right column - Role & Highlights */}
            <div>
              <div style={{
                fontSize: isMobile ? '15px' : '16px',
                fontWeight: 500,
                color: colors.textSecondary,
                marginBottom: '12px'
              }}>
                {job.role}
              </div>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: '0 0 16px 0',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                {job.highlights.map((highlight, i) => (
                  <li
                    key={i}
                    style={{
                      fontSize: '14px',
                      color: colors.textTertiary,
                      lineHeight: 1.5,
                      paddingLeft: '16px',
                      position: 'relative'
                    }}
                  >
                    <span style={{
                      position: 'absolute',
                      left: 0,
                      color: '#c29a6c'
                    }}>→</span>
                    {highlight}
                  </li>
                ))}
              </ul>
              <div style={{
                display: 'flex',
                gap: '8px',
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
                      color: colors.textMuted,
                      padding: '4px 8px',
                      border: `1px solid ${colors.border}`
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
