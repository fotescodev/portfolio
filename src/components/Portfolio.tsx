import { useState, useEffect } from 'react';
import Blog from './Blog';
import ThemeToggle from './ThemeToggle';
import HeroSection from './sections/HeroSection';
import AboutSection from './sections/AboutSection';
import ExperienceSection from './sections/ExperienceSection';
import CertificationsSection from './sections/CertificationsSection';
import TestimonialsSection from './sections/TestimonialsSection';

import CaseStudiesSection from './sections/CaseStudiesSection';
import FooterSection from './sections/FooterSection';
import CaseStudyDrawer from './case-study/CaseStudyDrawer';
import AmbientBackground from './common/AmbientBackground';
import Omnibar from './common/Omnibar';
import { profile } from '../lib/content';
import type { CaseStudy } from '../types/portfolio';

export default function Portfolio() {
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

  // Section visibility flags from YAML config
  const { sections } = profile;

  const sectionPadding = isMobile ? '48px 24px' : isTablet ? '64px 40px' : '80px 64px';

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
        .cta-primary {
          background: var(--color-accent);
          color: var(--color-background);
          padding: 18px 40px;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.02em;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }
        .cta-primary:hover {
          background: var(--color-accent-hover);
        }
        .cta-secondary {
          color: var(--color-text-tertiary);
          padding: 18px 40px;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.02em;
          border: 1px solid var(--color-border);
          transition: all 0.2s ease;
        }
        .cta-secondary:hover {
          border-color: var(--color-text-tertiary);
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

        <AmbientBackground />

        {/* Navigation */}
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
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
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
              <a href="#" style={{
                textDecoration: 'none',
                color: 'var(--color-text-primary)',
                transition: 'color 0.4s ease'
              }}>
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
                    className="nav-link"
                  >
                    {item}
                  </a>
                ))}
                <ThemeToggle />
                <a href={`mailto:${profile.email}`} className="nav-cta">
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
                onClick={() => setMobileMenuOpen(false)}
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
            isMobile={isMobile}
            isTablet={isTablet}
            isLoaded={isLoaded}
          />

          {/* About Section */}
          <AboutSection
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

            <div style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              gap: 'var(--space-md)',
              justifyContent: 'center'
            }}>
              <a href={`mailto:${profile.email}`} className="cta-primary">
                <span>Share an Opportunity</span>
                <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>→</span>
              </a>
              <a
                href="https://www.linkedin.com/in/0xdmitri/"
                target="_blank"
                rel="noopener noreferrer"
                className="cta-secondary"
              >
                Connect on LinkedIn
              </a>
            </div>

            {/* Social links */}
            <div style={{
              display: 'flex',
              gap: '40px',
              justifyContent: 'center',
              marginTop: '40px'
            }}>
              {[
                { name: 'X', url: 'https://x.com/kolob0kk' },
                { name: 'LinkedIn', url: 'https://www.linkedin.com/in/0xdmitri/' },
                { name: 'Email', url: `mailto:${profile.email}` }
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.url}
                  target={social.url.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="social-link"
                >
                  {social.name}
                </a>
              ))}
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
