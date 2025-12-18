import { passionProjects } from '../../lib/content';
import { useState } from 'react';

interface PassionProjectsSectionProps {
  isMobile: boolean;
  isTablet?: boolean;
  sectionPadding: string;
}

export default function PassionProjectsSection({
  isMobile,
  isTablet = false,
  sectionPadding
}: PassionProjectsSectionProps) {
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

  // Handle link clicks (open in new tab)
  const handleLinkClick = (url: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="passion-projects" style={{
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
          justifyContent: 'space-between',
          marginBottom: isMobile ? 'var(--space-xl)' : '40px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-lg)' }}>
            <span style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--color-text-muted)'
            }}>
              Side Projects
            </span>
          </div>

          <a
            href="https://github.com/fotescodev"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: 'var(--color-text-tertiary)',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-text-primary)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-tertiary)'}
          >
            See more on GitHub ↗
          </a>
        </div>

        {/* Clean list rows */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-xs)'
        }}>
          {passionProjects.slice(0, 3).map((project) => (
            <article
              key={project.id}
              style={{
                padding: isMobile ? '16px 16px' : '16px 20px',
                cursor: project.githubUrl || project.liveUrl ? 'pointer' : 'default',
                transition: 'all 0.25s ease',
                background: hoveredProject === project.id ? 'var(--color-card-bg)' : 'transparent',
                borderLeft: hoveredProject === project.id ? '2px solid var(--color-accent)' : '2px solid transparent',
                marginLeft: '-2px'
              }}
              onMouseEnter={() => !isMobile && setHoveredProject(project.id)}
              onMouseLeave={() => !isMobile && setHoveredProject(null)}
              onClick={() => {
                if (project.liveUrl) {
                  handleLinkClick(project.liveUrl);
                } else if (project.githubUrl) {
                  handleLinkClick(project.githubUrl);
                }
              }}
            >
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : isTablet ? '100px 1fr' : '120px 1fr auto',
                gap: isMobile ? 'var(--space-md)' : 'var(--space-xl)',
                alignItems: 'start'
              }}>
                {/* Year column */}
                <div style={{
                  fontSize: '12px',
                  fontWeight: 500,
                  letterSpacing: '0.05em',
                  color: 'var(--color-text-muted)'
                }}>
                  {project.year}
                </div>

                {/* Content column */}
                <div>
                  <h3 style={{
                    fontSize: isMobile ? '20px' : '24px',
                    fontFamily: 'var(--font-serif)',
                    fontWeight: 400,
                    fontStyle: 'italic',
                    color: 'var(--color-text-primary)',
                    marginBottom: 'var(--space-xs)',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.2,
                    transition: 'color 0.2s ease'
                  }}>
                    {project.title}
                  </h3>

                  <p style={{
                    fontSize: '14px',
                    color: 'var(--color-text-tertiary)',
                    lineHeight: 1.6,
                    marginBottom: 'var(--space-sm)',
                    maxWidth: '600px'
                  }}>
                    {project.tagline}
                  </p>

                  {/* Tags */}
                  <div style={{
                    display: 'flex',
                    gap: 'var(--space-sm)',
                    flexWrap: 'wrap'
                  }}>
                    {project.tags.map((tag, i) => (
                      <span key={i} style={{
                        fontSize: '10px',
                        fontWeight: 500,
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                        color: 'var(--color-text-muted)',
                        padding: '4px 8px',
                        border: '1px solid var(--color-border-light)',
                        transition: 'all 0.2s ease',
                        background: hoveredProject === project.id ? 'var(--color-tag-hover)' : 'transparent'
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Links column - desktop only */}
                {!isMobile && !isTablet && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-md)',
                    alignSelf: 'center'
                  }} onClick={(e) => e.stopPropagation()}>
                    {project.liveUrl && (
                      <button
                        onClick={(e) => handleLinkClick(project.liveUrl!, e)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          background: 'transparent',
                          color: hoveredProject === project.id ? 'var(--color-accent)' : 'var(--color-text-muted)',
                          border: '1px solid var(--color-border)',
                          fontSize: '11px',
                          fontWeight: 600,
                          letterSpacing: '0.02em',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                        Live
                      </button>
                    )}
                    {project.githubUrl && (
                      <button
                        onClick={(e) => handleLinkClick(project.githubUrl!, e)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          background: 'transparent',
                          color: hoveredProject === project.id ? 'var(--color-accent)' : 'var(--color-text-muted)',
                          border: '1px solid var(--color-border)',
                          fontSize: '11px',
                          fontWeight: 600,
                          letterSpacing: '0.02em',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                        Code
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile links row */}
              {isMobile && (project.liveUrl || project.githubUrl) && (
                <div
                  style={{
                    display: 'flex',
                    gap: 'var(--space-sm)',
                    marginTop: 'var(--space-md)'
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {project.liveUrl && (
                    <button
                      onClick={(e) => handleLinkClick(project.liveUrl!, e)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 14px',
                        background: 'transparent',
                        color: 'var(--color-text-secondary)',
                        border: '1px solid var(--color-border)',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Live ↗
                    </button>
                  )}
                  {project.githubUrl && (
                    <button
                      onClick={(e) => handleLinkClick(project.githubUrl!, e)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 14px',
                        background: 'transparent',
                        color: 'var(--color-text-secondary)',
                        border: '1px solid var(--color-border)',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Code ↗
                    </button>
                  )}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
