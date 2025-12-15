import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { profile, social } from '../../lib/content';

interface AboutSectionProps {
  isMobile: boolean;
  isTablet: boolean;
  sectionPadding: string;
}

export default function AboutSection({ isMobile, isTablet, sectionPadding }: AboutSectionProps) {
  const { about, photo, name } = profile;
  const [photoError, setPhotoError] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profile.email);
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2000);
  };

  // Get social links
  const emailLink = social.links.find(l => l.platform === 'email');
  const linkedinLink = social.links.find(l => l.platform === 'linkedin');
  const githubLink = social.links.find(l => l.platform === 'github');
  const twitterLink = social.links.find(l => l.platform === 'twitter');

  const initials = useMemo(() => {
    const parts = name.split(' ').filter(Boolean);
    const computed = parts
      .slice(0, 2)
      .map((p) => p[0])
      .join('')
      .toUpperCase();
    return computed || 'ME';
  }, [name]);

  return (
    <section id="about" style={{
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
          About
        </span>
        <div style={{
          flex: 1,
          height: '1px',
          background: 'var(--color-border-light)'
        }} />
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : isTablet ? '180px 1fr' : '280px 1fr',
        gap: isMobile ? '40px' : isTablet ? 'var(--space-2xl)' : '80px',
        alignItems: 'start'
      }}>
        {/* Photo + Social Icons */}
        <div style={{ maxWidth: isMobile ? '180px' : '100%' }}>
          {/* Photo */}
          <div style={{
            aspectRatio: '3/4',
            background: 'linear-gradient(135deg, var(--color-background-secondary) 0%, var(--color-background-tertiary) 100%)',
            border: '1px solid var(--color-photo-border)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {!photoError ? (
              <img
                src={photo}
                alt={name}
                loading="lazy"
                decoding="async"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
                onError={() => setPhotoError(true)}
              />
            ) : (
              <div
                aria-label={`${name} photo unavailable`}
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'var(--space-xs)',
                  color: 'var(--color-text-muted)'
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontStyle: 'italic',
                    fontSize: '32px',
                    color: 'var(--color-text-tertiary)'
                  }}
                >
                  {initials}
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase'
                  }}
                >
                  Photo
                </div>
              </div>
            )}
          </div>

          {/* Social Icons Bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 'var(--space-sm)',
            borderTop: '1px solid var(--color-border-light)',
            paddingTop: 'var(--space-sm)'
          }}>
            {/* Email - Copy */}
            <motion.button
              onClick={handleCopyEmail}
              whileTap={{ scale: 0.95 }}
              title={emailCopied ? 'Copied!' : 'Copy email'}
              style={{
                flex: emailCopied ? 2 : 1,
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--space-xs)',
                background: emailCopied ? 'var(--color-success-bg)' : 'transparent',
                border: 'none',
                borderRadius: '2px',
                color: emailCopied ? 'var(--color-success)' : 'var(--color-text-tertiary)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <AnimatePresence mode="wait" initial={false}>
                {emailCopied ? (
                  <motion.div
                    key="copied"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.02em' }}>Copied!</span>
                  </motion.div>
                ) : (
                  <motion.svg
                    key="mail"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  >
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="M22 6l-10 7L2 6" />
                  </motion.svg>
                )}
              </AnimatePresence>
            </motion.button>

            {/* LinkedIn */}
            {linkedinLink && (
              <motion.a
                href={linkedinLink.url}
                target="_blank"
                rel="noopener noreferrer"
                whileTap={{ scale: 0.95 }}
                title="LinkedIn"
                style={{
                  flex: 1,
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-text-tertiary)',
                  transition: 'color 0.2s ease'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </motion.a>
            )}

            {/* GitHub */}
            {githubLink && (
              <motion.a
                href={githubLink.url}
                target="_blank"
                rel="noopener noreferrer"
                whileTap={{ scale: 0.95 }}
                title="GitHub"
                style={{
                  flex: 1,
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-text-tertiary)',
                  transition: 'color 0.2s ease'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </motion.a>
            )}

            {/* X / Twitter */}
            {twitterLink && (
              <motion.a
                href={twitterLink.url}
                target="_blank"
                rel="noopener noreferrer"
                whileTap={{ scale: 0.95 }}
                title="X / Twitter"
                style={{
                  flex: 1,
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-text-tertiary)',
                  transition: 'color 0.2s ease'
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </motion.a>
            )}

            {/* Telegram */}
            <motion.a
              href="https://t.me/zimbru0x"
              target="_blank"
              rel="noopener noreferrer"
              whileTap={{ scale: 0.95 }}
              title="Telegram"
              style={{
                flex: 1,
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-text-tertiary)',
                transition: 'color 0.2s ease'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
            </motion.a>

          </div>
        </div>

        <div>
          <h2 style={{
            fontSize: isMobile ? '28px' : isTablet ? '32px' : '40px',
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            lineHeight: 1.3,
            color: 'var(--color-text-primary)',
            marginBottom: '28px',
            letterSpacing: '-0.02em'
          }}>
            {about.tagline}
          </h2>
          <div style={{
            columns: isMobile ? 1 : 2,
            columnGap: 'var(--space-2xl)'
          }}>
            {about.bio.map((paragraph, index) => (
              <p key={index} style={{
                fontSize: '15px',
                lineHeight: 1.75,
                color: 'var(--color-text-tertiary)',
                marginBottom: '20px'
              }}>
                {paragraph}
              </p>
            ))}
          </div>

          {/* Stats row */}
          <div style={{
            display: 'flex',
            gap: isMobile ? 'var(--space-xl)' : 'var(--space-2xl)',
            marginTop: 'var(--space-xl)',
            paddingTop: 'var(--space-lg)',
            borderTop: '1px solid var(--color-border-light)',
            flexWrap: 'wrap'
          }}>
            {about.stats.map((stat, i) => (
              <div key={i}>
                <div style={{
                  fontSize: isMobile ? '36px' : '48px',
                  fontFamily: 'var(--font-serif)',
                  fontWeight: 400,
                  color: 'var(--color-text-primary)',
                  lineHeight: 1
                }}>{stat.value}</div>
                <div style={{
                  fontSize: '12px',
                  fontWeight: 500,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--color-text-muted)',
                  marginTop: 'var(--space-sm)'
                }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
