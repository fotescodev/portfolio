import { passionProjects } from '../../lib/content';

interface PassionProjectsSectionProps {
  isMobile: boolean;
  isTablet: boolean;
  sectionPadding: string;
}

export default function PassionProjectsSection({
  isMobile,
  isTablet,
  sectionPadding
}: PassionProjectsSectionProps) {
  // Handle link clicks (open in new tab)
  const handleLinkClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Shared button style matching case studies but smaller
  const buttonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    background: 'transparent',
    color: 'var(--color-text-secondary)',
    border: '1px solid var(--color-border)',
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.02em',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  } as const;

  return (
    <section id="passion-projects" style={{
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
          Passion Projects
        </span>
        <div style={{
          flex: 1,
          height: '1px',
          background: 'var(--color-border-light)'
        }} />
      </div>

      {/* Grid of project cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
        gap: isMobile ? 'var(--space-xl)' : 'var(--space-2xl)',
        alignItems: 'start'
      }}>
        {passionProjects.map((project) => (
          <div
            key={project.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-md)',
              padding: 'var(--space-xl)',
              background: 'var(--color-card-bg)',
              border: '1px solid var(--color-border)',
              transition: 'all 0.3s ease',
              cursor: project.githubUrl || project.liveUrl ? 'pointer' : 'default'
            }}
            onClick={() => {
              // Click on card opens primary link (live > github)
              if (project.liveUrl) {
                handleLinkClick(project.liveUrl);
              } else if (project.githubUrl) {
                handleLinkClick(project.githubUrl);
              }
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border-light)';
              e.currentTarget.style.background = 'var(--color-card-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border)';
              e.currentTarget.style.background = 'var(--color-card-bg)';
            }}
          >
            {/* Thumbnail placeholder */}
            <div style={{
              aspectRatio: '16/9',
              background: 'linear-gradient(135deg, var(--color-thumbnail-bg-start) 0%, var(--color-thumbnail-bg-end) 100%)',
              border: '1px solid var(--color-border-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 'var(--space-sm)'
            }}>
              {project.thumbnail ? (
                <img
                  src={project.thumbnail}
                  alt={`${project.title} thumbnail`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <span style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '36px',
                  fontStyle: 'italic',
                  color: 'var(--color-placeholder-text)',
                  lineHeight: 1
                }}>
                  {project.id.toString().padStart(2, '0')}
                </span>
              )}
            </div>

            {/* Year */}
            <div style={{
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: 'var(--color-text-muted)'
            }}>
              {project.year}
            </div>

            {/* Title */}
            <h3 style={{
              fontSize: isMobile ? '20px' : '24px',
              fontFamily: 'var(--font-serif)',
              fontWeight: 400,
              fontStyle: 'italic',
              color: 'var(--color-text-secondary)',
              letterSpacing: '-0.01em',
              lineHeight: 1.2,
              marginBottom: 'var(--space-xs)'
            }}>
              {project.title}
            </h3>

            {/* Tagline */}
            <p style={{
              fontSize: '14px',
              color: 'var(--color-text-tertiary)',
              lineHeight: 1.6,
              marginBottom: 'var(--space-md)',
              flex: 1
            }}>
              {project.tagline}
            </p>

            {/* Tags */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--space-xs)',
              marginBottom: 'var(--space-md)'
            }}>
              {project.tags.map((tag, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: '10px',
                    fontWeight: 500,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    color: 'var(--color-text-muted)',
                    padding: '4px 8px',
                    border: '1px solid var(--color-border)',
                    background: 'transparent'
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Action buttons */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-sm)',
                flexWrap: 'wrap'
              }}
              onClick={(e) => e.stopPropagation()} // Prevent card click when clicking buttons
            >
              {/* Live button */}
              {project.liveUrl && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLinkClick(project.liveUrl!);
                  }}
                  style={buttonStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-accent)';
                    e.currentTarget.style.color = 'var(--color-accent)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-border)';
                    e.currentTarget.style.color = 'var(--color-text-secondary)';
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

              {/* GitHub button */}
              {project.githubUrl && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLinkClick(project.githubUrl!);
                  }}
                  style={buttonStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-accent)';
                    e.currentTarget.style.color = 'var(--color-accent)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-border)';
                    e.currentTarget.style.color = 'var(--color-text-secondary)';
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  Code
                </button>
              )}

              {/* Docs button */}
              {project.docsUrl && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLinkClick(project.docsUrl!);
                  }}
                  style={buttonStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-accent)';
                    e.currentTarget.style.color = 'var(--color-accent)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-border)';
                    e.currentTarget.style.color = 'var(--color-text-secondary)';
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                  Docs
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
