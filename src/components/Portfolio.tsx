import { useState, useEffect } from 'react';
import Blog from './Blog';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../context/ThemeContext';
import HeroSection from './sections/HeroSection';
import AboutSection from './sections/AboutSection';
import ExperienceSection from './sections/ExperienceSection';
import CertificationsSection from './sections/CertificationsSection';
import TestimonialsSection from './sections/TestimonialsSection';
import SocialSection from './sections/SocialSection';
import CaseStudiesSection from './sections/CaseStudiesSection';
import FooterSection from './sections/FooterSection';
import CaseStudyDrawer from './case-study/CaseStudyDrawer';
import AmbientBackground from './common/AmbientBackground';
import { profile } from '../lib/content';
import type { CaseStudy } from '../types/portfolio';

export default function Portfolio() {
  const { colors, isDark } = useTheme();
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
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-background)',
      color: 'var(--color-text-primary)',
      transition: 'background var(--transition-medium), color var(--transition-medium)',
      position: 'relative'
    }}>

      <AmbientBackground />

      {/* Navigation */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: colors.navGradient,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${colors.borderLight}`,
        opacity: isLoaded ? 1 : 0,
        transform: isLoaded ? 'translateY(0)' : 'translateY(-20px)',
        transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
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
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: '24px',
            fontStyle: 'italic',
            fontWeight: 700,
            zIndex: 101,
            position: 'relative'
          }}>
            <a href="#" style={{
              textDecoration: 'none',
              color: colors.textPrimary,
              transition: 'color 0.4s ease'
            }}>
              {profile.name}
            </a>
          </div>

          {/* Desktop Navigation */}
          {!isMobile && (
            <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
              {['Work', 'About', 'Blog'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} style={{
                  color: colors.textTertiary,
                  textDecoration: 'none',
                  fontSize: '13px',
                  fontWeight: 500,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  transition: 'color 0.2s ease',
                  cursor: 'pointer'
                }}
                  onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => (e.target as HTMLElement).style.color = colors.textPrimary}
                  onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.target as HTMLElement).style.color = colors.textTertiary}
                >
                  {item}
                </a>
              ))}
              <ThemeToggle />
              <a href={`mailto:${profile.email}`} style={{
                color: colors.background,
                background: colors.textPrimary,
                padding: '12px 24px',
                textDecoration: 'none',
                fontSize: '13px',
                fontWeight: 600,
                letterSpacing: '0.02em',
                transition: 'all 0.2s ease'
              }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.background = colors.accent;
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.background = colors.textPrimary;
                }}
              >
                Get in Touch
              </a>
            </div>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <ThemeToggle isMobile />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  padding: '8px',
                  cursor: 'pointer',
                  zIndex: 101,
                  position: 'relative',
                  color: colors.textPrimary
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
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: colors.background,
          zIndex: 99,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 24px',
          opacity: mobileMenuOpen ? 1 : 0,
          pointerEvents: mobileMenuOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s ease, background 0.4s ease'
        }}>
          {['Work', 'About', 'Blog', 'Contact'].map((item, i) => (
            <a
              key={item}
              href={item === 'Contact' ? `mailto:${profile.email}` : `#${item.toLowerCase()}`}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                color: colors.textPrimary,
                textDecoration: 'none',
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontSize: '42px',
                fontStyle: 'italic',
                padding: '16px 0',
                borderBottom: `1px solid ${colors.border}`,
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
        sectionPadding={sectionPadding}
      />

      {/* Social / Writing & Speaking Section */}
      <SocialSection
        isMobile={isMobile}
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
          fontFamily: "'Instrument Serif', Georgia, serif",
          fontWeight: 400,
          fontStyle: 'italic',
          color: colors.textPrimary,
          letterSpacing: '-0.03em',
          lineHeight: 1,
          marginBottom: '32px'
        }}>
          Let's build
        </h2>

        <p style={{
          fontSize: '16px',
          color: colors.textTertiary,
          maxWidth: '440px',
          margin: '0 auto 32px',
          lineHeight: 1.6
        }}>
          Open to PM roles in AI, infrastructure, and Web3.
          Particularly interested in where agents meet on-chain execution.
          Based in {profile.location} ({profile.timezone}), flexible on remote.
        </p>

        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: '16px',
          justifyContent: 'center'
        }}>
          <a href={`mailto:${profile.email}`} style={{
            background: colors.textPrimary,
            color: colors.background,
            padding: '18px 40px',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: 600,
            letterSpacing: '0.02em',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px'
          }}>
            <span>Share an Opportunity</span>
            <span style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}>→</span>
          </a>
          <a href="https://www.linkedin.com/in/0xdmitri/" target="_blank" rel="noopener noreferrer" style={{
            color: colors.textTertiary,
            padding: '18px 40px',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: 600,
            letterSpacing: '0.02em',
            border: `1px solid ${isDark ? 'rgba(232, 230, 227, 0.15)' : 'rgba(26, 26, 28, 0.15)'}`,
            transition: 'all 0.2s ease'
          }}>
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
              style={{
                color: isDark ? '#3a3a3c' : '#9a9a9c',
                textDecoration: 'none',
                fontSize: '12px',
                fontWeight: 500,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => (e.target as HTMLElement).style.color = colors.textTertiary}
              onMouseLeave={(e) => (e.target as HTMLElement).style.color = isDark ? '#3a3a3c' : '#9a9a9c'}
            >
              {social.name}
            </a>
          ))}
        </div>
      </section>

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

      {/* Footer */}
      <FooterSection isMobile={isMobile} />
    </div>
  );
}
