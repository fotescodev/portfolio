import { useState, useEffect } from 'react';
import Blog from './Blog';
import ThemeToggle from './ThemeToggle';
import HeroSection from './sections/HeroSection';
import AboutSection from './sections/AboutSection';
import ExperienceSection from './sections/ExperienceSection';
import CertificationsSection from './sections/CertificationsSection';
import TestimonialsSection from './sections/TestimonialsSection';
import PassionProjectsSection from './sections/PassionProjectsSection';

import CaseStudiesSection from './sections/CaseStudiesSection';
import FooterSection from './sections/FooterSection';
import CaseStudyDrawer from './case-study/CaseStudyDrawer';
import AmbientBackground from './common/AmbientBackground';
import Omnibar from './common/Omnibar';
import { useVariant } from '../context/VariantContext';
import type { CaseStudy } from '../types/portfolio';

export default function Portfolio() {
  // Get profile from variant context (either base or merged with variant)
  const { profile } = useVariant();

  const [isLoaded, setIsLoaded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [modalCase, setModalCase] = useState<CaseStudy | null>(null);
  const [hoveredCase, setHoveredCase] = useState<number | null>(null);

  useEffect(() => {
    setIsLoaded(true);

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle modal scroll lock and ESC key
  useEffect(() => {
    if (modalCase) {
      document.body.style.overflow = 'hidden';
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setModalCase(null);
      };
      window.addEventListener('keydown', handleEsc);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleEsc);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [modalCase]);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  const { sections } = profile;

  const sectionPadding = isMobile
    ? 'var(--space-2xl) var(--space-lg)'
    : isTablet
      ? 'var(--space-3xl) var(--space-2xl)'
      : 'var(--space-4xl) var(--layout-padding-x)';

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement> | null, id: string) => {
    if (e) e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Nav height buffer
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    if (isMobile) setMobileMenuOpen(false);
  };

  return (
    <>
      <style>{`
        .nav-link {
          color: var(--color-text-tertiary);
          text-decoration: none;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          transition: color 0.2s ease;
          cursor: pointer;
        }
        .nav-link:hover {
          color: var(--color-text-primary);
        }
        .nav-cta {
          color: var(--color-background);
          background: var(--color-accent);
          padding: 12px 24px;
          text-decoration: none;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.02em;
          transition: all 0.2s ease;
        }
        .nav-cta:hover {
          background: var(--color-accent-hover);
        }
        .mobile-menu-link {
          color: var(--color-text-primary);
          text-decoration: none;
          font-family: var(--font-serif);
          font-size: 42px;
          font-style: italic;
          padding: 16px 0;
          border-bottom: 1px solid var(--color-border);
        }
        .footer-omnibar-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 16px 24px;
          background: transparent;
          border: none;
          border-radius: 2px;
          color: var(--color-text-primary);
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.02em;
          cursor: pointer;
          white-space: nowrap;
          text-decoration: none;
          transition: background 0.2s ease;
        }
        .footer-omnibar-btn:hover {
          background: var(--color-tag-hover);
        }
        .footer-omnibar-btn-primary {
          background: transparent;
          border: 1px solid var(--color-accent);
          color: var(--color-accent);
          font-weight: 600;
        }
        .footer-omnibar-btn-primary:hover {
          background: var(--color-accent);
          color: var(--color-background);
        }
        .social-link {
          color: var(--color-separator);
          text-decoration: none;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          transition: color 0.2s ease;
        }
        .social-link:hover {
          color: var(--color-text-tertiary);
        }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: 'var(--color-background)',
        color: 'var(--color-text-primary)',
        transition: 'background var(--transition-medium), color var(--transition-medium)',
        position: 'relative'
      }}>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>

        <div className="wide-screen-vignette" />
        <AmbientBackground />

        {/* Navigation - hidden when drawer is open on mobile */}
        <nav
          aria-label="Primary"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            background: 'var(--color-nav-bg)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderBottom: '1px solid var(--color-border-light)',
            opacity: isLoaded ? 1 : 0,
            transform: isLoaded ? 'translateY(0)' : 'translateY(-20px)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            display: (isMobile && modalCase) ? 'none' : 'block'
          }}
        >
          <div style={{
            maxWidth: 'var(--layout-max-width)',
            margin: '0 auto',
            padding: isMobile
              ? 'var(--nav-height-mobile) var(--space-lg)'
              : 'var(--nav-height) var(--space-3xl)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            {/* Logo */}
            <div style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '24px',
              fontStyle: 'italic',
              fontWeight: 700,
              zIndex: 101,
              position: 'relative'
            }}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  // Close any open drawer
                  setModalCase(null);
                  // Close mobile menu if open
                  setMobileMenuOpen(false);
                  // Scroll to top
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  // Clear URL hash if any
                  if (window.location.hash) {
                    window.history.pushState(null, '', window.location.pathname);
                  }
                }}
                style={{
                  textDecoration: 'none',
                  color: 'var(--color-text-primary)',
                  transition: 'color 0.4s ease',
                  cursor: 'pointer'
                }}
              >
                {profile.name}
              </a>
            </div>


            {/* Desktop Navigation */}
            {!isMobile && (
              <div style={{ display: 'flex', gap: 'var(--space-xl)', alignItems: 'center' }}>
                {['Work', 'About', 'Blog'].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    onClick={(e) => handleNavClick(e, item.toLowerCase())}
                    className="nav-link"
                  >
                    {item}
                  </a>
                ))}
                <ThemeToggle />
                <a href="https://calendar.google.com/calendar/u/0/appointments/AcZssZ2leGghBAF6F4IbGMZQErnaR21wvu-mYWXP06o=" target="_blank" rel="noopener noreferrer" className="nav-cta">
                  Get in Touch
                </a>
              </div>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                <ThemeToggle isMobile />
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                  aria-expanded={mobileMenuOpen}
                  aria-controls="mobile-menu"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    padding: 'var(--space-sm)',
                    cursor: 'pointer',
                    zIndex: 101,
                    position: 'relative',
                    color: 'var(--color-text-primary)'
                  }}
                >
                  <span style={{
                    fontSize: '14px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    fontWeight: 600
                  }}>
                    {mobileMenuOpen ? 'Close' : 'Menu'}
                  </span>
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Menu Overlay */}
        {isMobile && (
          <div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'var(--color-background)',
              zIndex: 99,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '0 var(--space-lg)',
              opacity: mobileMenuOpen ? 1 : 0,
              pointerEvents: mobileMenuOpen ? 'auto' : 'none',
              transition: 'opacity 0.3s ease, background 0.4s ease'
            }}>
            {['Work', 'About', 'Blog', 'Contact'].map((item, i) => (
              <a
                key={item}
                href={item === 'Contact' ? `mailto:${profile.email}` : `#${item.toLowerCase()}`}
                onClick={(e) => {
                  if (item !== 'Contact') {
                    handleNavClick(e, item.toLowerCase());
                  } else {
                    setMobileMenuOpen(false);
                  }
                }}
                className="mobile-menu-link"
                style={{
                  transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(-20px)',
                  opacity: mobileMenuOpen ? 1 : 0,
                  transition: `all 0.4s ease ${i * 0.08}s`
                }}
              >
                {item}
              </a>
            ))}
          </div>
        )}


        <main id="main-content" style={{ position: 'relative', zIndex: 1 }}>
          {/* Hero Section */}
          <HeroSection
            profile={profile}
            isMobile={isMobile}
            isTablet={isTablet}
            isLoaded={isLoaded}
          />

          {/* About Section */}
          <AboutSection
            profile={profile}
            isMobile={isMobile}
            isTablet={isTablet}
            sectionPadding={sectionPadding}
          />

          {/* Experience Section */}
          <ExperienceSection
            isMobile={isMobile}
            isTablet={isTablet}
            sectionPadding={sectionPadding}
          />

          {/* Certifications Section */}
          <CertificationsSection
            profile={profile}
            isMobile={isMobile}
            isTablet={isTablet}
            sectionPadding={sectionPadding}
          />

          {/* Skills Section - conditionally rendered */}
          {sections.skills && (
            <section style={{
              padding: sectionPadding,
              maxWidth: 'var(--layout-max-width)',
              margin: '0 auto',
              position: 'relative',
              zIndex: 1
            }}>
              {/* Skills content would go here */}
            </section>
          )}

          {/* Case Studies Section */}
          <CaseStudiesSection
            isMobile={isMobile}
            isTablet={isTablet}
            sectionPadding={sectionPadding}
            hoveredCase={hoveredCase}
            setHoveredCase={setHoveredCase}
            onCaseClick={(study) => setModalCase(study)}
          />

          {/* Passion Projects Section */}
          {sections.passionProjects && (
            <PassionProjectsSection
              isMobile={isMobile}
              sectionPadding={sectionPadding}
            />
          )}

          {/* Testimonials Section */}
          <TestimonialsSection
            isMobile={isMobile}
            isTablet={isTablet}
            sectionPadding={sectionPadding}
          />

          {/* Blog Section */}
          {sections.blog && <Blog isMobile={isMobile} isTablet={isTablet} />}

          {/* Final CTA */}
          <section style={{
            padding: isMobile ? '48px 24px 64px' : '64px 64px 80px',
            maxWidth: '1000px',
            margin: '0 auto',
            textAlign: 'center',
            position: 'relative',
            zIndex: 1
          }}>
            <h2 style={{
              fontSize: isMobile ? '10vw' : '7vw',
              fontFamily: 'var(--font-serif)',
              fontWeight: 400,
              fontStyle: 'italic',
              color: 'var(--color-text-primary)',
              letterSpacing: '-0.03em',
              lineHeight: 1,
              marginBottom: 'var(--space-xl)'
            }}>
              Let's build
            </h2>

            <p style={{
              fontSize: '16px',
              color: 'var(--color-text-tertiary)',
              maxWidth: '440px',
              margin: '0 auto var(--space-xl)',
              lineHeight: 1.6
            }}>
              Open to PM roles in AI, infrastructure, and Web3.
              Particularly interested in where agents meet on-chain execution.
              Based in {profile.location} ({profile.timezone}), flexible on remote.
            </p>

            {/* Omnibar-style CTA */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-sm)',
              padding: 'var(--space-sm)',
              background: 'var(--color-surface-glass)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              borderRadius: '6px',
              border: '1px solid var(--color-border-light)',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
              flexWrap: isMobile ? 'wrap' : 'nowrap',
              justifyContent: 'center'
            }}>
              {/* Copy Email */}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(profile.email);
                }}
                className="footer-omnibar-btn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7 }}>
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                <span>Copy Email</span>
              </button>

              <div style={{ width: '1px', height: '24px', background: 'var(--color-border-light)' }} />

              {/* Resume */}
              <a
                href="/dmitrii-fotesco-resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-omnibar-btn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7 }}>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span>Resume</span>
              </a>

              <div style={{ width: '1px', height: '24px', background: 'var(--color-border-light)' }} />

              {/* Book Time */}
              <a
                href="https://calendar.google.com/calendar/u/0/appointments/AcZssZ2leGghBAF6F4IbGMZQErnaR21wvu-mYWXP06o="
                target="_blank"
                rel="noopener noreferrer"
                className="footer-omnibar-btn footer-omnibar-btn-primary"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span>Book Time</span>
              </a>
            </div>

            {/* Social Icons Bar */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 'var(--space-lg)',
              marginTop: 'var(--space-xl)'
            }}>
              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/0xdmitri/"
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn"
                style={{
                  color: 'var(--color-text-tertiary)',
                  transition: 'color 0.2s ease'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>

              {/* GitHub */}
              <a
                href="https://github.com/fotescodev"
                target="_blank"
                rel="noopener noreferrer"
                title="GitHub"
                style={{
                  color: 'var(--color-text-tertiary)',
                  transition: 'color 0.2s ease'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>

              {/* X / Twitter */}
              <a
                href="https://x.com/kolob0kk"
                target="_blank"
                rel="noopener noreferrer"
                title="X / Twitter"
                style={{
                  color: 'var(--color-text-tertiary)',
                  transition: 'color 0.2s ease'
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* Telegram */}
              <a
                href="https://t.me/zimbru0x"
                target="_blank"
                rel="noopener noreferrer"
                title="Telegram"
                style={{
                  color: 'var(--color-text-tertiary)',
                  transition: 'color 0.2s ease'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
              </a>
            </div>
          </section>

          {/* Omnibar */}
          <Omnibar />

          {/* Case Study Modal */}
          {modalCase && (
            <CaseStudyDrawer
              isOpen={!!modalCase}
              onClose={() => setModalCase(null)}
              caseStudy={modalCase}
              isMobile={isMobile}
              onNavigate={(study) => setModalCase(study)}
            />
          )}

        </main>

        {/* Footer */}
        <FooterSection isMobile={isMobile} />
      </div>
    </>
  );
}
