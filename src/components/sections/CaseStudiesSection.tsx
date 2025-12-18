import type { ReactNode } from 'react';
import { caseStudies } from '../../lib/content';
import type { CaseStudy } from '../../types/portfolio';

interface CaseStudiesSectionProps {
  isMobile: boolean;
  isTablet: boolean;
  sectionPadding: string;
  hoveredCase: number | null;
  setHoveredCase: (id: number | null) => void;
  onCaseClick: (study: CaseStudy) => void;
}

// Media type icons and labels
const MediaIcons: Record<string, { icon: ReactNode; label: string }> = {
  blog: {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 19l7-7 3 3-7 7-3-3z" />
        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
        <path d="M2 2l7.586 7.586" />
        <circle cx="11" cy="11" r="2" />
      </svg>
    ),
    label: 'Blog'
  },
  twitter: {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    label: 'Twitter'
  },
  linkedin: {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    label: 'LinkedIn'
  },
  video: {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
    ),
    label: 'Video'
  },
  article: {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    label: 'Article'
  },
  slides: {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    label: 'Slides'
  }
};

export default function CaseStudiesSection({
  isMobile,
  isTablet,
  sectionPadding,
  hoveredCase,
  setHoveredCase,
  onCaseClick
}: CaseStudiesSectionProps) {
  // Format case study number with leading zero
  const formatNumber = (id: number) => id.toString().padStart(2, '0');

  // Handle external link clicks (prevent card click)
  const handleLinkClick = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Shared button style for primary buttons
  const secondaryButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    background: 'transparent',
    color: 'var(--color-text-secondary)',
    border: '1px solid var(--color-border)',
    fontSize: '12px',
    fontWeight: 600,
    letterSpacing: '0.02em',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  } as const;

  return (
    <section id="work" style={{
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
          Selected Work
        </span>
        <div style={{
          flex: 1,
          height: '1px',
          background: 'var(--color-border-light)'
        }} />
      </div>

      {/* Case study list */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: isMobile ? 'var(--space-2xl)' : '0'
      }}>
        {caseStudies.map((study) => (
          <div
            key={study.id}
            onClick={() => onCaseClick(study)}
            style={{
              padding: isMobile ? '0' : '40px 0',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              background: hoveredCase === study.id ? 'var(--color-card-hover)' : 'transparent'
            }}
            onMouseEnter={() => !isMobile && setHoveredCase(study.id)}
            onMouseLeave={() => !isMobile && setHoveredCase(null)}
          >
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : isTablet ? '200px 1fr' : '260px 1fr',
              gap: isMobile ? 'var(--space-lg)' : isTablet ? '40px' : '56px',
              alignItems: 'start'
            }}>
              {/* Thumbnail */}
              <div style={{
                position: 'relative',
                aspectRatio: '4/3',
                background: 'linear-gradient(135deg, var(--color-thumbnail-bg-start) 0%, var(--color-thumbnail-bg-end) 100%)',
                border: '1px solid var(--color-border-light)',
                overflow: 'hidden',
                transition: 'all 0.4s ease'
              }}>
                {study.hook.thumbnail ? (
                  <>
                    <img
                      src={study.hook.thumbnail}
                      alt={`${study.title} case study`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.4s ease',
                        transform: hoveredCase === study.id ? 'scale(1.03)' : 'scale(1)'
                      }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    {/* Number overlay */}
                    <div style={{
                      position: 'absolute',
                      top: 'var(--space-md)',
                      left: 'var(--space-md)',
                      fontFamily: 'var(--font-serif)',
                      fontSize: '14px',
                      fontStyle: 'italic',
                      color: 'var(--color-overlay-text)',
                      background: 'var(--color-overlay-dark)',
                      padding: '6px 12px',
                      backdropFilter: 'blur(4px)'
                    }}>
                      {formatNumber(study.id)}
                    </div>
                  </>
                ) : null}
                {/* Placeholder - always visible as fallback */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'var(--space-sm)',
                  zIndex: study.hook.thumbnail ? -1 : 1
                }}>
                  <span style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: isMobile ? '48px' : '56px',
                    fontStyle: 'italic',
                    color: 'var(--color-placeholder-text)',
                    lineHeight: 1
                  }}>
                    {formatNumber(study.id)}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
              }}>
                {/* Meta line */}
                <div style={{
                  display: 'flex',
                  gap: 'var(--space-md)',
                  marginBottom: '14px',
                  flexWrap: 'wrap',
                  alignItems: 'center'
                }}>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: 500,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    color: 'var(--color-text-tertiary)'
                  }}>{study.company}</span>
                  <span style={{
                    color: 'var(--color-separator)',
                    fontSize: '12px'
                  }}>—</span>
                  <span style={{
                    fontSize: '12px',
                    color: 'var(--color-text-muted)'
                  }}>{study.year}</span>
                </div>

                {/* Title */}
                <h3 style={{
                  fontSize: isMobile ? '26px' : isTablet ? '32px' : '38px',
                  fontFamily: 'var(--font-serif)',
                  fontWeight: 400,
                  fontStyle: 'italic',
                  color: 'var(--color-text-secondary)',
                  marginBottom: '14px',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.15,
                  transition: 'color 0.2s ease'
                }}>
                  {study.title}
                </h3>

                {/* Headline */}
                <p style={{
                  fontSize: '15px',
                  color: 'var(--color-text-tertiary)',
                  lineHeight: 1.65,
                  marginBottom: '20px',
                  maxWidth: '520px'
                }}>
                  {study.hook.headline}
                </p>

                {/* Primary metric only - cleaner */}
                <div style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 'var(--space-sm)',
                  marginBottom: '20px'
                }}>
                  <span style={{
                    fontSize: isMobile ? '28px' : '32px',
                    fontFamily: 'var(--font-serif)',
                    fontWeight: 400,
                    color: 'var(--color-accent)',
                    lineHeight: 1
                  }}>
                    {study.hook.impactMetric.value}
                  </span>
                  <span style={{
                    fontSize: '13px',
                    fontWeight: 500,
                    letterSpacing: '0.02em',
                    textTransform: 'lowercase',
                    color: 'var(--color-text-muted)'
                  }}>
                    {study.hook.impactMetric.label}
                  </span>
                </div>

                {/* Action buttons row */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-md)',
                  marginTop: 'auto',
                  flexWrap: 'wrap'
                }}>
                  {/* Demo/Live button */}
                  {study.demoUrl && (
                    <button
                      onClick={(e) => handleLinkClick(e, study.demoUrl!)}
                      style={secondaryButtonStyle}
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
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                      Live
                    </button>
                  )}

                  {/* GitHub button */}
                  {study.githubUrl && (
                    <button
                      onClick={(e) => handleLinkClick(e, study.githubUrl!)}
                      style={secondaryButtonStyle}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--color-accent)';
                        e.currentTarget.style.color = 'var(--color-accent)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--color-border)';
                        e.currentTarget.style.color = 'var(--color-text-secondary)';
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                      Code
                    </button>
                  )}

                  {/* Docs button */}
                  {study.docsUrl && (
                    <button
                      onClick={(e) => handleLinkClick(e, study.docsUrl!)}
                      style={secondaryButtonStyle}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--color-accent)';
                        e.currentTarget.style.color = 'var(--color-accent)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--color-border)';
                        e.currentTarget.style.color = 'var(--color-text-secondary)';
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                      </svg>
                      Docs
                    </button>
                  )}

                  {/* Media links - icon only */}
                  {study.media && study.media.length > 0 && (
                    <>
                      <span style={{
                        width: '1px',
                        height: '20px',
                        background: 'var(--color-border)',
                        margin: '0 4px'
                      }} />
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        {study.media.map((mediaItem, i) => {
                          const mediaInfo = MediaIcons[mediaItem.type];
                          if (!mediaInfo) return null;

                          return (
                            <button
                              key={i}
                              onClick={(e) => handleLinkClick(e, mediaItem.url)}
                              title={mediaItem.label || mediaInfo.label}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '32px',
                                height: '32px',
                                padding: 0,
                                background: 'transparent',
                                color: 'var(--color-text-muted)',
                                border: '1px solid var(--color-border)',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = 'var(--color-accent)';
                                e.currentTarget.style.color = 'var(--color-accent)';
                                e.currentTarget.style.background = 'transparent';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'var(--color-border)';
                                e.currentTarget.style.color = 'var(--color-text-muted)';
                                e.currentTarget.style.background = 'transparent';
                              }}
                            >
                              {mediaInfo.icon}
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}

                  {/* Read more indicator */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-sm)',
                    marginLeft: 'auto',
                    color: hoveredCase === study.id ? 'var(--color-accent)' : 'var(--color-text-muted)',
                    transition: 'color 0.2s ease'
                  }}>
                    <span style={{
                      fontSize: '13px',
                      fontWeight: 500,
                      letterSpacing: '0.02em'
                    }}>
                      Read more
                    </span>
                    <span style={{
                      transform: hoveredCase === study.id ? 'translateX(4px)' : 'translateX(0)',
                      transition: 'transform 0.2s ease',
                      fontFamily: 'var(--font-serif)',
                      fontStyle: 'italic'
                    }}>→</span>
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
