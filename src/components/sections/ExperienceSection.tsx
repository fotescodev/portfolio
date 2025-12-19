import { useVariant } from '../../context/VariantContext';
import { useTheme } from '../../context/ThemeContext';
import { getExperienceWithOverrides } from '../../lib/variants';

// Parse markdown links [text](url) into clickable anchors
function parseLinks(text: string): React.ReactNode {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(text)) !== null) {
    // Add text before the link
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    // Add the link
    parts.push(
      <a
        key={match.index}
        href={match[2]}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: 'var(--color-accent)',
          textDecoration: 'underline',
          textDecorationColor: 'var(--color-accent)',
          textUnderlineOffset: '2px'
        }}
        onMouseEnter={(e) => e.currentTarget.style.borderBottomColor = 'var(--color-accent)'}
        onMouseLeave={(e) => e.currentTarget.style.borderBottomColor = 'transparent'}
      >
        {match[1]}
      </a>
    );
    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

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
  const { theme } = useTheme();
  const experience = getExperienceWithOverrides(variant) as { jobs: Job[] };
  const { jobs } = experience;
  const isDark = theme === 'dark';

  return (
    <section style={{
      width: '100%',
      backgroundColor: 'var(--color-background-secondary)',
      position: 'relative',
      zIndex: 1
    }}>
      <div style={{
        padding: sectionPadding,
        maxWidth: 'var(--layout-max-width)',
        margin: '0 auto',
      }}>
        {/* Section label */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-lg)',
          marginBottom: isMobile ? 'var(--space-lg)' : '24px'
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
                padding: isMobile ? 'var(--space-md) 0' : '24px 0',
              }}
            >
              {/* Left column - Company & Period */}
              <div style={{
                position: 'relative',
                paddingRight: isMobile ? 0 : 'var(--space-xl)',
                borderRight: isMobile ? 'none' : '1px solid var(--color-border-light)',
              }}>
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
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-sm)',
                  marginBottom: 'var(--space-xs)'
                }}>
                  {job.logo && (
                    <img
                      src={job.logo}
                      alt={`${job.company} logo`}
                      style={{
                        width: '18px',
                        height: '18px',
                        objectFit: 'contain',
                        opacity: 0.7,
                        filter: isDark ? 'invert(1) brightness(0.9)' : 'none'
                      }}
                    />
                  )}
                  {job.url ? (
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: isMobile ? '16px' : '18px',
                        fontFamily: 'var(--font-serif)',
                        fontStyle: 'italic',
                        color: 'var(--color-text-secondary)',
                        textDecoration: 'none',
                        transition: 'color 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-accent)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-secondary)'}
                    >
                      {job.company}
                    </a>
                  ) : (
                    <span style={{
                      fontSize: isMobile ? '16px' : '18px',
                      fontFamily: 'var(--font-serif)',
                      fontStyle: 'italic',
                      color: 'var(--color-text-secondary)'
                    }}>
                      {job.company}
                    </span>
                  )}
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
                      {parseLinks(highlight)}
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
      </div>
    </section>
  );
}
