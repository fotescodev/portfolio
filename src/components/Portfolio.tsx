import { useState, useEffect } from 'react';
import Blog from './Blog';

interface CaseStudy {
  id: number;
  number: string;
  title: string;
  company: string;
  year: string;
  tags: string[];

  // Multiple metrics for card view
  metrics: {
    primary: { value: string; label: string };
    secondary?: { value: string; label: string };
    tertiary?: { value: string; label: string };
  };

  description: string;
  thumbnail: string | null;
  thumbnailAlt: string;

  // Rich expanded content structure
  fullContent: {
    // Role clarity
    myRole: string;
    teamSize?: string;
    duration?: string;

    // STAR framework
    situation: string;
    actions: string[];
    results: string;

    // Key decision highlight
    keyDecision?: {
      title: string;
      description: string;
    };

    // Visual artifacts (placeholder-ready)
    artifacts?: {
      type: 'diagram' | 'screenshot' | 'chart' | 'wireframe';
      src: string | null;  // null = show placeholder
      alt: string;
      caption?: string;
    }[];

    // Testimonial/quote
    testimonial?: {
      quote: string;
      author: string;
      role: string;
    };

    // Tools & technologies used
    techStack?: string[];
  };
}

interface Credential {
  label: string;
  value: string;
  url?: string;
}

interface ExplorerLink {
  name: string;
  url: string;
}

export default function Portfolio() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredCase, setHoveredCase] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [modalCase, setModalCase] = useState<CaseStudy | null>(null);

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

  // Section visibility flags - set to true to show, false to hide
  const SHOW_BEYOND_WORK = false;
  const SHOW_BLOG_SECTION = false;
  const SHOW_ONCHAIN_IDENTITY = false;
  const SHOW_SKILLS = false;

  const caseStudies: CaseStudy[] = [
    {
      id: 1,
      number: "01",
      title: "Institutional ETH Staking",
      company: "Anchorage Digital",
      year: "2024–25",
      tags: ["Staking", "Custody", "ETF-Grade"],
      metrics: {
        primary: { value: "ETF-grade", label: "custody standard" },
        secondary: { value: "Galaxy+", label: "institutional clients" },
        tertiary: { value: "6-month", label: "delivery cycle" }
      },
      description: "Led ETH staking initiatives including validator provisioning for institutional clients like Galaxy, delivering Staking MVP aligned with ETF-grade custody standards. Balanced regulatory requirements with competitive yield optimization.",
      thumbnail: "/images/case-study-eth-staking.png",
      thumbnailAlt: "Institutional ETH Staking project",
      fullContent: {
        myRole: "Senior Product Manager",
        teamSize: "6 engineers + compliance",
        duration: "6 months",
        situation: "Anchorage Digital needed to expand institutional staking offerings to meet demand from ETF providers and large asset managers requiring ETF-grade custody standards. The challenge was balancing competitive staking yields with the security constraints required for institutional custody.",
        actions: [
          "Defined product requirements balancing yield optimization with custody security constraints",
          "Coordinated with compliance, legal, and engineering teams on validator provisioning architecture",
          "Worked directly with Galaxy and other institutional clients to gather requirements and iterate on MVP",
          "Established framework for evaluating staking-as-a-service providers vs. in-house solutions"
        ],
        results: "Shipped Staking MVP aligned with ETF-grade custody standards. Enabled institutional clients to access ETH staking yield while maintaining full custody compliance.",
        keyDecision: {
          title: "In-house validators vs. staking-as-a-service",
          description: "We evaluated 3 leading staking providers but ultimately chose to build in-house validator infrastructure. This gave us full control over custody keys—critical for ETF-grade compliance—while maintaining competitive yields within 0.1% of market leaders."
        },
        artifacts: [
          {
            type: "diagram",
            src: null,
            alt: "Validator provisioning architecture",
            caption: "High-level architecture for ETF-grade validator provisioning"
          }
        ],
        techStack: ["Ethereum", "Validator Infrastructure", "MPC Custody", "Compliance APIs", "HSM"]
      }
    },
    {
      id: 2,
      number: "02",
      title: "Protocol Integration Framework",
      company: "Anchorage Digital",
      year: "2024–25",
      tags: ["L2s", "Compliance", "Infrastructure"],
      metrics: {
        primary: { value: "7+", label: "protocols shipped" },
        secondary: { value: "40%", label: "faster integration" },
        tertiary: { value: "3", label: "parallel launches" }
      },
      description: "Built scalable framework for evaluating and integrating blockchain protocols into institutional custody infrastructure. Coordinated global teams across engineering, compliance, and external protocol teams.",
      thumbnail: "/images/case-study-protocol-integration.png",
      thumbnailAlt: "Protocol Integration Framework diagram",
      fullContent: {
        myRole: "Senior Product Manager",
        teamSize: "Cross-functional (8+ across teams)",
        duration: "Ongoing",
        situation: "Rapid growth in L2 ecosystems required a systematic approach to protocol evaluation and integration while maintaining institutional security standards. Each new protocol required coordination across 4+ internal teams and external protocol teams.",
        actions: [
          "Developed comprehensive protocol evaluation framework covering security, compliance, and technical feasibility",
          "Led cross-functional coordination between engineering, compliance, legal, and external protocol teams",
          "Created standardized integration playbook reducing time-to-launch for new protocols",
          "Established ongoing protocol health monitoring and risk assessment processes"
        ],
        results: "Successfully shipped 7+ protocol integrations including Optimism, Base, and emerging chains. Reduced integration timeline by 40% through standardized processes.",
        keyDecision: {
          title: "Protocol prioritization framework",
          description: "Created RICE-based evaluation criteria weighing institutional demand, technical complexity, and compliance risk. This let us confidently say 'no' to 60% of requests while fast-tracking high-value integrations."
        },
        artifacts: [
          {
            type: "diagram",
            src: null,
            alt: "Protocol integration workflow",
            caption: "Standardized integration playbook"
          }
        ],
        techStack: ["Optimism", "Base", "Arbitrum", "Plume", "Citrea", "BOB", "Aztec"]
      }
    },
    {
      id: 3,
      number: "03",
      title: "Royalties on Ethereum",
      company: "Microsoft / Xbox",
      year: "2016–20",
      tags: ["Smart Contracts", "Gaming", "Enterprise"],
      metrics: {
        primary: { value: "Xbox-scale", label: "payment processing" },
        secondary: { value: "First", label: "smart contract at MSFT" },
        tertiary: { value: "Docker/K8s", label: "consortium infra" }
      },
      description: "Designed, developed, and tested royalty payment and tracking system based on Ethereum smart contracts for the Xbox store platform. Implemented Docker/Kubernetes architecture for the blockchain consortium network.",
      thumbnail: "/images/case-study-xbox-royalties.png",
      thumbnailAlt: "Xbox Royalties system architecture",
      fullContent: {
        myRole: "Software Engineer → Technical PM",
        teamSize: "4 engineers",
        duration: "2 years",
        situation: "Xbox needed a transparent, auditable system for tracking and distributing royalty payments to game publishers at massive scale. Traditional database systems lacked the auditability and transparency needed for complex multi-party royalty calculations.",
        actions: [
          "Designed Ethereum-based smart contract architecture for royalty tracking and distribution",
          "Built Docker/Kubernetes infrastructure for enterprise blockchain consortium",
          "Developed testing frameworks for smart contract validation",
          "Collaborated with legal and finance teams on compliance requirements"
        ],
        results: "Delivered production-ready royalty system capable of processing Xbox-scale transactions. Pioneered enterprise blockchain adoption at Microsoft.",
        keyDecision: {
          title: "Private consortium vs. public Ethereum",
          description: "Chose a private Ethereum consortium for transaction privacy and throughput, while maintaining compatibility with public Ethereum tooling. This let us leverage existing Solidity expertise while meeting enterprise security requirements."
        },
        artifacts: [
          {
            type: "diagram",
            src: null,
            alt: "Royalty system architecture",
            caption: "Enterprise blockchain consortium architecture"
          }
        ],
        techStack: ["Ethereum", "Solidity", "Docker", "Kubernetes", "Azure", "Smart Contracts"]
      }
    },
    {
      id: 4,
      number: "04",
      title: "RPC Infrastructure & APIs",
      company: "Ankr",
      year: "2021–22",
      tags: ["APIs", "Developer Tools", "Growth"],
      metrics: {
        primary: { value: "15×", label: "revenue growth" },
        secondary: { value: "$2M", label: "ARR in 6 months" },
        tertiary: { value: "1M+", label: "daily requests" }
      },
      description: "Repositioned ankr.com/rpc to target blockchains as a core customer segment. Designed and led creation of Ankr Advanced APIs and Ankr.JS, reaching 1M+ requests per day average usage.",
      thumbnail: "/images/case-study-ankr-rpc.png",
      thumbnailAlt: "Ankr RPC infrastructure dashboard",
      fullContent: {
        myRole: "Product Manager",
        teamSize: "5 engineers",
        duration: "8 months",
        situation: "Ankr's RPC infrastructure was underutilized and needed repositioning to capture the growing Web3 developer market. The existing product lacked differentiation from competitors.",
        actions: [
          "Led strategic repositioning of RPC product to target blockchain protocols as primary customers",
          "Designed and shipped Ankr Advanced APIs for enhanced blockchain data access",
          "Created Ankr.JS SDK to improve developer experience",
          "Implemented usage analytics and pricing optimization"
        ],
        results: "Achieved 15× revenue growth, reaching $2M ARR in 6 months. Scaled to 1M+ daily API requests with high reliability.",
        keyDecision: {
          title: "B2B pivot: protocols over developers",
          description: "Shifted focus from individual developers to blockchain protocols as customers. Protocols needed reliable RPC infrastructure for their ecosystems—higher LTV, longer contracts, and better unit economics."
        },
        artifacts: [
          {
            type: "screenshot",
            src: null,
            alt: "Ankr RPC dashboard",
            caption: "Developer dashboard showing usage analytics"
          }
        ],
        techStack: ["Node.js", "WebSocket", "REST APIs", "Multi-chain RPC", "SDK Development"]
      }
    }
  ];

  const credentials: Credential[] = [
    { label: "Founder", value: "Mempools.com — 200 DAU Web3 SaaS", url: "https://mempools.com" },
    { label: "Developer Tools", value: "Flow CLI, Cadence Playground, Ankr.JS" },
    { label: "MPC & Custody", value: "Wallet-as-a-Service at Forte" },
    { label: "Exploring", value: "AI agents × on-chain execution" }
  ];

  const explorerLinks: ExplorerLink[] = [
    { name: 'Etherscan', url: 'https://etherscan.io/address/dmitriif.eth' },
    { name: 'ENS Profile', url: 'https://app.ens.domains/dmitriif.eth' },
    { name: 'Snapshot', url: 'https://snapshot.org/#/profile/dmitriif.eth' }
  ];

  const sectionPadding = isMobile ? '48px 24px' : isTablet ? '64px 40px' : '80px 64px';

  return (
    <div style={{
      minHeight: '100vh',
      background: '#08080a',
      color: '#e8e6e3',
      fontFamily: "'Instrument Sans', -apple-system, BlinkMacSystemFont, sans-serif",
      overflowX: 'hidden'
    }}>
      {/* Subtle grid texture overlay */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)`,
        backgroundSize: '32px 32px',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Animated gradient orbs for hero visual interest */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(30px, -20px) scale(1.05); }
          50% { transform: translate(-20px, 20px) scale(0.95); }
          75% { transform: translate(10px, 10px) scale(1.02); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.6; }
        }
      `}</style>
      <div style={{
        position: 'absolute',
        top: isMobile ? '5%' : '10%',
        right: isMobile ? '-20%' : '5%',
        width: isMobile ? '300px' : '500px',
        height: isMobile ? '300px' : '500px',
        background: 'radial-gradient(circle, rgba(194, 154, 108, 0.15) 0%, rgba(194, 154, 108, 0.05) 40%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        pointerEvents: 'none',
        zIndex: 0,
        animation: 'float 20s ease-in-out infinite, pulse 8s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        top: isMobile ? '60%' : '50%',
        left: isMobile ? '-30%' : '-5%',
        width: isMobile ? '250px' : '400px',
        height: isMobile ? '250px' : '400px',
        background: 'radial-gradient(circle, rgba(74, 222, 128, 0.08) 0%, rgba(74, 222, 128, 0.02) 40%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(80px)',
        pointerEvents: 'none',
        zIndex: 0,
        animation: 'float 25s ease-in-out infinite reverse, pulse 10s ease-in-out infinite'
      }} />

      {/* Navigation */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        padding: isMobile ? '20px 24px' : '28px 64px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 100,
        background: 'linear-gradient(180deg, rgba(8,8,10,1) 0%, rgba(8,8,10,0) 100%)',
        opacity: isLoaded ? 1 : 0,
        transform: isLoaded ? 'translateY(0)' : 'translateY(-20px)',
        transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        <div style={{
          fontFamily: "'Instrument Serif', Georgia, serif",
          fontStyle: 'italic',
          fontSize: isMobile ? '18px' : '20px',
          color: '#e8e6e3',
          letterSpacing: '-0.02em'
        }}>
          dmitriif.eth
        </div>

        {/* Desktop Navigation */}
        {!isMobile && (
          <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
            {['Work', 'About'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} style={{
                color: '#6b6966',
                textDecoration: 'none',
                fontSize: '13px',
                fontWeight: 500,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                transition: 'color 0.2s ease',
                cursor: 'pointer'
              }}
                onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#e8e6e3'}
                onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#6b6966'}
              >
                {item}
              </a>
            ))}
            {/* Blog with Coming Soon badge */}
            <span style={{
              color: '#4a4a4c',
              fontSize: '13px',
              fontWeight: 500,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'default'
            }}>
              Blog
              <span style={{
                fontSize: '9px',
                fontWeight: 600,
                letterSpacing: '0.08em',
                color: '#3a3a3c',
                padding: '3px 6px',
                border: '1px solid rgba(232, 230, 227, 0.1)',
                fontStyle: 'normal'
              }}>
                SOON
              </span>
            </span>            <a href="mailto:dmitrii.fotesco@gmail.com" style={{
              color: '#08080a',
              background: '#e8e6e3',
              padding: '12px 24px',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: 600,
              letterSpacing: '0.02em',
              transition: 'all 0.2s ease'
            }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.background = '#c29a6c';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.background = '#e8e6e3';
              }}
            >
              Get in Touch
            </a>
          </div>
        )}

        {/* Mobile Menu Button */}
        {isMobile && (
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'none',
              border: 'none',
              padding: '8px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}
          >
            <span style={{
              width: '24px',
              height: '1px',
              background: '#e8e6e3',
              transition: 'all 0.3s ease',
              transform: mobileMenuOpen ? 'rotate(45deg) translateY(5px)' : 'none'
            }} />
            <span style={{
              width: '24px',
              height: '1px',
              background: '#e8e6e3',
              transition: 'all 0.3s ease',
              opacity: mobileMenuOpen ? 0 : 1
            }} />
            <span style={{
              width: '24px',
              height: '1px',
              background: '#e8e6e3',
              transition: 'all 0.3s ease',
              transform: mobileMenuOpen ? 'rotate(-45deg) translateY(-5px)' : 'none'
            }} />
          </button>
        )}
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobile && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: '#08080a',
          zIndex: 99,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 24px',
          opacity: mobileMenuOpen ? 1 : 0,
          pointerEvents: mobileMenuOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s ease'
        }}>
          {['Work', 'About', 'Contact'].map((item, i) => (
            <a
              key={item}
              href={item === 'Contact' ? 'mailto:dmitrii.fotesco@gmail.com' : `#${item.toLowerCase()}`}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                color: '#e8e6e3',
                textDecoration: 'none',
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontSize: '42px',
                fontStyle: 'italic',
                padding: '16px 0',
                borderBottom: '1px solid rgba(232, 230, 227, 0.1)',
                transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(-20px)',
                opacity: mobileMenuOpen ? 1 : 0,
                transition: `all 0.4s ease ${i * 0.08}s`
              }}
            >
              {item}
            </a>
          ))}
          {/* Blog with Coming Soon */}
          <div
            style={{
              color: '#4a4a4c',
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontSize: '42px',
              fontStyle: 'italic',
              padding: '16px 0',
              borderBottom: '1px solid rgba(232, 230, 227, 0.1)',
              transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(-20px)',
              opacity: mobileMenuOpen ? 1 : 0,
              transition: `all 0.4s ease ${3 * 0.08}s`,
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}
          >
            Blog
            <span style={{
              fontSize: '12px',
              fontWeight: 600,
              fontStyle: 'normal',
              fontFamily: "'Instrument Sans', sans-serif",
              letterSpacing: '0.08em',
              color: '#3a3a3c',
              padding: '4px 8px',
              border: '1px solid rgba(232, 230, 227, 0.1)'
            }}>
              SOON
            </span>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: isMobile ? '100px 24px 48px' : '120px 64px 64px',
        maxWidth: '1400px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? 'translateY(0)' : 'translateY(40px)',
          transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s'
        }}>
          {/* Eyebrow */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: isMobile ? '20px' : '24px'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              background: '#4ade80',
              borderRadius: '50%'
            }} />
            <span style={{
              fontSize: '13px',
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#6b6966'
            }}>
              Open to PM roles — AI, Infrastructure, Web3
            </span>
          </div>

          {/* Main headline - Editorial style */}
          <h1 style={{
            fontSize: isMobile ? '11vw' : isTablet ? '9vw' : '8vw',
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontWeight: 400,
            fontStyle: 'italic',
            lineHeight: 0.95,
            margin: 0,
            letterSpacing: '-0.03em',
            color: '#e8e6e3'
          }}>
            Building
            <br />
            <span style={{
              fontStyle: 'normal',
              color: '#6b6966'
            }}>at the edge of</span>
            <br />
            <span style={{
              color: '#c29a6c'
            }}>
              trust
            </span>
          </h1>

          {/* Subheadline */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: isMobile ? '24px' : '48px',
            marginTop: isMobile ? '32px' : '40px',
            alignItems: 'start'
          }}>
            <p style={{
              fontSize: isMobile ? '17px' : '19px',
              color: '#a8a5a0',
              lineHeight: 1.6,
              fontWeight: 400,
              maxWidth: '480px'
            }}>
              Senior Technical PM shipping institutional crypto infrastructure.
              From Xbox royalties on Ethereum to ETF-grade custody.
              Now exploring where AI agents meet on-chain execution.
            </p>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <a href="#work" style={{
                background: '#e8e6e3',
                color: '#08080a',
                padding: isMobile ? '16px 28px' : '18px 32px',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 600,
                letterSpacing: '0.02em',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease',
                width: isMobile ? '100%' : 'fit-content',
                minWidth: '220px'
              }}>
                <span>View Work</span>
                <span style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}>↓</span>
              </a>
              <a
                href="/dmitrii-fotesco-resume.pdf"
                download="Dmitrii-Fotesco-Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#6b6966',
                  padding: '18px 0',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: 500,
                  letterSpacing: '0.02em',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                  borderBottom: '1px solid rgba(232, 230, 227, 0.1)',
                  transition: 'all 0.2s ease',
                  width: 'fit-content'
                }}
                onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#e8e6e3'}
                onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#6b6966'}
              >
                Download Resume
              </a>
            </div>
          </div>
        </div>

      </section>

      {/* Bio Section */}
      <section id="about" style={{
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
            color: '#4a4a4c'
          }}>
            About
          </span>
          <div style={{
            flex: 1,
            height: '1px',
            background: 'rgba(232, 230, 227, 0.08)'
          }} />
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : isTablet ? '180px 1fr' : '280px 1fr',
          gap: isMobile ? '40px' : isTablet ? '48px' : '80px',
          alignItems: 'start'
        }}>
          {/* Photo */}
          <div style={{
            aspectRatio: '3/4',
            maxWidth: isMobile ? '180px' : '100%',
            background: 'linear-gradient(135deg, #141416 0%, #1a1a1c 100%)',
            border: '1px solid rgba(232, 230, 227, 0.06)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <img
              src="/images/headshot.jpg"
              alt="Dmitrii Fotesco"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
              onError={(e) => {
                // Fallback to placeholder if image not found
                (e.target as HTMLImageElement).style.display = 'none';
                const parent = (e.target as HTMLImageElement).parentElement;
                if (parent) {
                  const placeholder = document.createElement('div');
                  placeholder.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#2a2a2c;font-size:12px;font-weight:500;letter-spacing:0.1em;text-transform:uppercase';
                  placeholder.textContent = 'Photo';
                  parent.appendChild(placeholder);
                }
              }}
            />
            {/* ENS tag */}
            <div style={{
              position: 'absolute',
              bottom: '0',
              left: '0',
              right: '0',
              background: 'rgba(8, 8, 10, 0.9)',
              backdropFilter: 'blur(8px)',
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontStyle: 'italic',
                fontSize: '14px',
                color: '#c29a6c'
              }}>
                dmitriif.eth
              </span>
              <span style={{
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#4ade80'
              }}>
                Verified
              </span>
            </div>
          </div>

          {/* Bio content */}
          <div>
            <h2 style={{
              fontSize: isMobile ? '28px' : isTablet ? '32px' : '40px',
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontWeight: 400,
              fontStyle: 'italic',
              lineHeight: 1.3,
              color: '#e8e6e3',
              marginBottom: '28px',
              letterSpacing: '-0.02em'
            }}>
              Eight years shipping products where complexity
              meets compliance—from enterprise to crypto to whatever comes next.
            </h2>
            <div style={{
              columns: isMobile ? 1 : 2,
              columnGap: '48px'
            }}>
              <p style={{
                fontSize: '15px',
                lineHeight: 1.75,
                color: '#8a8885',
                marginBottom: '20px'
              }}>
                Currently at Anchorage Digital, I lead protocol integrations and staking
                products for institutional clients—Galaxy, ETF providers, and enterprises
                navigating crypto custody. Before that, I built Wallet-as-a-Service at Forte,
                developer tooling at Dapper Labs, and API infrastructure at Ankr.
              </p>
              <p style={{
                fontSize: '15px',
                lineHeight: 1.75,
                color: '#8a8885'
              }}>
                I started in enterprise blockchain at Microsoft, shipping Xbox royalties
                on Ethereum before "Web3" was a term. I'm drawn to problems at the
                intersection of deterministic systems and probabilistic intelligence—where
                smart contracts meet AI agents.
              </p>
            </div>

            {/* Stats row */}
            <div style={{
              display: 'flex',
              gap: isMobile ? '32px' : '48px',
              marginTop: '32px',
              paddingTop: '24px',
              borderTop: '1px solid rgba(232, 230, 227, 0.08)',
              flexWrap: 'wrap'
            }}>
              {[
                { value: '8+', label: 'Years in Product' },
                { value: '5', label: 'Years in Web3' },
                { value: '6', label: 'Companies Shipped' }
              ].map((stat, i) => (
                <div key={i}>
                  <div style={{
                    fontSize: isMobile ? '36px' : '48px',
                    fontFamily: "'Instrument Serif', Georgia, serif",
                    fontWeight: 400,
                    color: '#e8e6e3',
                    lineHeight: 1
                  }}>{stat.value}</div>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: 500,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#4a4a4c',
                    marginTop: '8px'
                  }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Experience Timeline */}
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
            color: '#4a4a4c'
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
          {[
            {
              company: 'Anchorage Digital',
              role: 'Senior Product Manager',
              period: '2024 – Present',
              location: 'Remote',
              highlights: [
                'Leading ETH staking and protocol integrations for institutional clients',
                'Shipped 7+ L2 protocol integrations (Optimism, Base, Arbitrum)',
                'Built ETF-grade custody standards for validator provisioning'
              ],
              tags: ['Staking', 'L2s', 'Institutional Custody']
            },
            {
              company: 'Forte',
              role: 'Product Manager',
              period: '2023 – 2024',
              location: 'Remote',
              highlights: [
                'Built Wallet-as-a-Service infrastructure for gaming studios',
                'Designed MPC custody solution for non-custodial wallets',
                'Launched SDK used by multiple AAA gaming partners'
              ],
              tags: ['MPC', 'Gaming', 'Wallet Infrastructure']
            },
            {
              company: 'Dapper Labs',
              role: 'Product Manager',
              period: '2022 – 2023',
              location: 'Remote',
              highlights: [
                'Shipped Flow CLI and Cadence Playground developer tools',
                'Improved developer onboarding reducing time-to-first-deploy by 60%',
                'Led cross-functional team of 8 engineers'
              ],
              tags: ['Developer Tools', 'Flow', 'Cadence']
            },
            {
              company: 'Ankr',
              role: 'Product Manager',
              period: '2021 – 2022',
              location: 'Remote',
              highlights: [
                'Drove 15× revenue growth on RPC infrastructure ($2M ARR)',
                'Launched Ankr Advanced APIs reaching 1M+ daily requests',
                'Repositioned product to target blockchain protocols as customers'
              ],
              tags: ['APIs', 'RPC', 'Growth']
            },
            {
              company: 'Microsoft',
              role: 'Software Engineer → PM',
              period: '2016 – 2020',
              location: 'Seattle, WA',
              highlights: [
                'Designed Ethereum-based royalty system for Xbox store',
                'Built Docker/K8s blockchain consortium infrastructure',
                'First smart contract shipped at Microsoft (2016)'
              ],
              tags: ['Enterprise Blockchain', 'Xbox', 'Smart Contracts']
            }
          ].map((job, index) => (
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
                  color: '#6b6966',
                  marginBottom: '4px'
                }}>
                  {job.period}
                </div>
                <div style={{
                  fontSize: isMobile ? '16px' : '18px',
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  fontStyle: 'italic',
                  color: '#e8e6e3',
                  marginBottom: '4px'
                }}>
                  {job.company}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#4a4a4c'
                }}>
                  {job.location}
                </div>
              </div>

              {/* Right column - Role & Highlights */}
              <div>
                <div style={{
                  fontSize: isMobile ? '15px' : '16px',
                  fontWeight: 500,
                  color: '#a8a5a0',
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
                        color: '#6b6966',
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
                        color: '#4a4a4c',
                        padding: '4px 8px',
                        border: '1px solid rgba(232, 230, 227, 0.08)'
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

      {/* Certifications Section */}
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
            color: '#4a4a4c'
          }}>
            Certifications
          </span>
          <div style={{
            flex: 1,
            height: '1px',
            background: 'rgba(232, 230, 227, 0.08)'
          }} />
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
          gap: '24px'
        }}>
          {/* Product Faculty AI PM Certification */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(194, 154, 108, 0.08) 0%, rgba(194, 154, 108, 0.02) 100%)',
            border: '1px solid rgba(194, 154, 108, 0.2)',
            padding: isMobile ? '28px 24px' : '36px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Decorative corner */}
            <div style={{
              position: 'absolute',
              top: '-1px',
              right: '-1px',
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, transparent 50%, rgba(194, 154, 108, 0.15) 50%)'
            }} />

            <div style={{
              display: 'flex',
              gap: '20px',
              alignItems: 'flex-start'
            }}>
              {/* Badge icon */}
              <div style={{
                width: '56px',
                height: '56px',
                background: 'linear-gradient(135deg, #c29a6c 0%, #a67c4e 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <span style={{
                  fontSize: '24px',
                  color: '#08080a'
                }}>🎓</span>
              </div>

              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#c29a6c',
                  marginBottom: '8px'
                }}>
                  AI Product Management
                </div>
                <h3 style={{
                  fontSize: isMobile ? '20px' : '24px',
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  fontStyle: 'italic',
                  fontWeight: 400,
                  color: '#e8e6e3',
                  marginBottom: '12px',
                  lineHeight: 1.2
                }}>
                  Product Faculty Certification
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#8a8885',
                  lineHeight: 1.6,
                  marginBottom: '16px'
                }}>
                  Intensive AI PM program led by <strong style={{ color: '#a8a5a0' }}>Miqdad Jaffer</strong>,
                  Product Leader at <strong style={{ color: '#a8a5a0' }}>OpenAI</strong> and former Head of AI Products at Shopify.
                </p>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  flexWrap: 'wrap'
                }}>
                  <span style={{
                    fontSize: '12px',
                    color: '#4a4a4c'
                  }}>
                    Issued 2024
                  </span>
                  <a
                    href="https://productfaculty.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: '12px',
                      fontWeight: 500,
                      color: '#c29a6c',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'opacity 0.2s ease'
                    }}
                  >
                    Verify credential
                    <span style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}>↗</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Placeholder for additional certification */}
          <div style={{
            background: 'linear-gradient(135deg, #141416 0%, #1a1a1c 100%)',
            border: '1px dashed rgba(232, 230, 227, 0.1)',
            padding: isMobile ? '28px 24px' : '36px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            minHeight: '180px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              border: '1px dashed rgba(232, 230, 227, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#3a3a3c',
              fontSize: '20px'
            }}>
              +
            </div>
            <span style={{
              fontSize: '13px',
              color: '#3a3a3c',
              fontStyle: 'italic',
              fontFamily: "'Instrument Serif', Georgia, serif"
            }}>
              More certifications coming soon
            </span>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      {SHOW_SKILLS && (
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
              color: '#4a4a4c'
            }}>
              Skills & Tools
            </span>
            <div style={{
              flex: 1,
              height: '1px',
              background: 'rgba(232, 230, 227, 0.08)'
            }} />
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
            gap: isMobile ? '32px' : '24px'
          }}>
            {[
              {
                category: 'Blockchain & Web3',
                skills: ['Ethereum', 'Solidity', 'L2s (Optimism, Base, Arbitrum)', 'Staking Infrastructure', 'MPC Custody', 'ENS', 'DeFi Protocols']
              },
              {
                category: 'Product Management',
                skills: ['PRDs & Specs', 'Roadmapping', 'Agile/Scrum', 'Cross-functional Leadership', 'Stakeholder Management', 'Go-to-Market']
              },
              {
                category: 'Technical',
                skills: ['API Design', 'Docker/Kubernetes', 'Smart Contracts', 'SDK Development', 'System Architecture', 'Developer Experience']
              },
              {
                category: 'Tools',
                skills: ['Jira', 'Linear', 'Notion', 'Figma', 'GitHub', 'Dune Analytics', 'Etherscan']
              }
            ].map((group, i) => (
              <div key={i}>
                <h3 style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#6b6966',
                  marginBottom: '20px'
                }}>
                  {group.category}
                </h3>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  {group.skills.map((skill, j) => (
                    <span key={j} style={{
                      fontSize: '14px',
                      color: '#a8a5a0',
                      lineHeight: 1.4
                    }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Case Studies Section */}
      <section id="work" style={{
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
            color: '#4a4a4c'
          }}>
            Selected Work
          </span>
          <div style={{
            flex: 1,
            height: '1px',
            background: 'rgba(232, 230, 227, 0.08)'
          }} />
        </div>

        {/* Case study list */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: isMobile ? '48px' : '0'
        }}>
          {caseStudies.map((study, index) => (
            <div
              key={study.id}
              style={{
                borderTop: !isMobile && index === 0 ? '1px solid rgba(232, 230, 227, 0.1)' : 'none',
                borderBottom: !isMobile ? '1px solid rgba(232, 230, 227, 0.1)' : 'none',
                padding: isMobile ? '0' : '40px 0',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                background: hoveredCase === study.id ? 'rgba(194, 154, 108, 0.02)' : 'transparent'
              }}
              onMouseEnter={() => !isMobile && setHoveredCase(study.id)}
              onMouseLeave={() => !isMobile && setHoveredCase(null)}
            >
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : isTablet ? '200px 1fr' : '340px 1fr',
                gap: isMobile ? '24px' : isTablet ? '40px' : '56px',
                alignItems: 'start'
              }}>
                {/* Thumbnail */}
                <div style={{
                  position: 'relative',
                  aspectRatio: '4/3',
                  background: 'linear-gradient(135deg, #141416 0%, #1a1a1c 100%)',
                  border: '1px solid rgba(232, 230, 227, 0.06)',
                  overflow: 'hidden',
                  transition: 'all 0.4s ease'
                }}>
                  {study.thumbnail ? (
                    <>
                      <img
                        src={study.thumbnail}
                        alt={study.thumbnailAlt}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.4s ease',
                          transform: hoveredCase === study.id ? 'scale(1.03)' : 'scale(1)'
                        }}
                        onError={(e) => {
                          // Hide broken image and show placeholder
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      {/* Number overlay */}
                      <div style={{
                        position: 'absolute',
                        top: '16px',
                        left: '16px',
                        fontFamily: "'Instrument Serif', Georgia, serif",
                        fontSize: '14px',
                        fontStyle: 'italic',
                        color: '#fff',
                        background: 'rgba(8, 8, 10, 0.7)',
                        padding: '6px 12px',
                        backdropFilter: 'blur(4px)'
                      }}>
                        {study.number}
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
                    gap: '12px',
                    zIndex: study.thumbnail ? -1 : 1
                  }}>
                    <span style={{
                      fontFamily: "'Instrument Serif', Georgia, serif",
                      fontSize: isMobile ? '48px' : '56px',
                      fontStyle: 'italic',
                      color: '#2a2a2c',
                      lineHeight: 1
                    }}>
                      {study.number}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%'
                }}>
                  <div style={{
                    display: 'flex',
                    gap: '16px',
                    marginBottom: '14px',
                    flexWrap: 'wrap',
                    alignItems: 'center'
                  }}>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: 500,
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      color: '#6b6966'
                    }}>{study.company}</span>
                    <span style={{
                      color: '#3a3a3c',
                      fontSize: '12px'
                    }}>—</span>
                    <span style={{
                      fontSize: '12px',
                      color: '#4a4a4c'
                    }}>{study.year}</span>
                  </div>

                  <h3 style={{
                    fontSize: isMobile ? '26px' : isTablet ? '32px' : '38px',
                    fontFamily: "'Instrument Serif', Georgia, serif",
                    fontWeight: 400,
                    fontStyle: 'italic',
                    color: '#e8e6e3',
                    marginBottom: '14px',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.15,
                    transition: 'color 0.2s ease'
                  }}>
                    {study.title}
                  </h3>

                  <p style={{
                    fontSize: '15px',
                    color: '#6b6966',
                    lineHeight: 1.65,
                    marginBottom: '20px',
                    maxWidth: '520px'
                  }}>
                    {study.description}
                  </p>

                  {/* Metrics row */}
                  <div style={{
                    display: 'flex',
                    gap: isMobile ? '16px' : '24px',
                    marginBottom: '20px',
                    flexWrap: 'wrap'
                  }}>
                    {/* Primary metric */}
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}>
                      <span style={{
                        fontSize: isMobile ? '24px' : '28px',
                        fontFamily: "'Instrument Serif', Georgia, serif",
                        fontWeight: 400,
                        color: '#c29a6c',
                        lineHeight: 1
                      }}>
                        {study.metrics.primary.value}
                      </span>
                      <span style={{
                        fontSize: '10px',
                        fontWeight: 500,
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                        color: '#4a4a4c'
                      }}>
                        {study.metrics.primary.label}
                      </span>
                    </div>

                    {/* Secondary metric */}
                    {study.metrics.secondary && (
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                        paddingLeft: isMobile ? '16px' : '24px',
                        borderLeft: '1px solid rgba(232, 230, 227, 0.1)'
                      }}>
                        <span style={{
                          fontSize: isMobile ? '24px' : '28px',
                          fontFamily: "'Instrument Serif', Georgia, serif",
                          fontWeight: 400,
                          color: '#e8e6e3',
                          lineHeight: 1
                        }}>
                          {study.metrics.secondary.value}
                        </span>
                        <span style={{
                          fontSize: '10px',
                          fontWeight: 500,
                          letterSpacing: '0.05em',
                          textTransform: 'uppercase',
                          color: '#4a4a4c'
                        }}>
                          {study.metrics.secondary.label}
                        </span>
                      </div>
                    )}

                    {/* Tertiary metric */}
                    {study.metrics.tertiary && !isMobile && (
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                        paddingLeft: '24px',
                        borderLeft: '1px solid rgba(232, 230, 227, 0.1)'
                      }}>
                        <span style={{
                          fontSize: '28px',
                          fontFamily: "'Instrument Serif', Georgia, serif",
                          fontWeight: 400,
                          color: '#a8a5a0',
                          lineHeight: 1
                        }}>
                          {study.metrics.tertiary.value}
                        </span>
                        <span style={{
                          fontSize: '10px',
                          fontWeight: 500,
                          letterSpacing: '0.05em',
                          textTransform: 'uppercase',
                          color: '#4a4a4c'
                        }}>
                          {study.metrics.tertiary.label}
                        </span>
                      </div>
                    )}
                  </div>

                  <div style={{
                    display: 'flex',
                    gap: '10px',
                    flexWrap: 'wrap',
                    marginTop: 'auto'
                  }}>
                    {study.tags.map((tag, i) => (
                      <span key={i} style={{
                        fontSize: '11px',
                        fontWeight: 500,
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                        color: '#4a4a4c',
                        padding: '6px 12px',
                        border: '1px solid rgba(232, 230, 227, 0.08)',
                        transition: 'all 0.2s ease',
                        background: hoveredCase === study.id ? 'rgba(194, 154, 108, 0.05)' : 'transparent'
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Read more - opens modal */}
                  {study.fullContent && (
                    <div
                      onClick={() => setModalCase(study)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginTop: '24px',
                        color: hoveredCase === study.id ? '#c29a6c' : '#4a4a4c',
                        transition: 'color 0.2s ease',
                        cursor: 'pointer'
                      }}
                    >
                      <span style={{
                        fontSize: '13px',
                        fontWeight: 500,
                        letterSpacing: '0.02em'
                      }}>
                        Read case study
                      </span>
                      <span style={{
                        transform: hoveredCase === study.id ? 'translateX(4px)' : 'translateX(0)',
                        transition: 'transform 0.2s ease',
                        fontFamily: "'Instrument Serif', serif",
                        fontStyle: 'italic'
                      }}>→</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
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
            color: '#4a4a4c'
          }}>
            What People Say
          </span>
          <div style={{
            flex: 1,
            height: '1px',
            background: 'rgba(232, 230, 227, 0.08)'
          }} />
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
          gap: '24px'
        }}>
          {/* Testimonial 1 - Placeholder */}
          <div style={{
            background: 'linear-gradient(135deg, #141416 0%, #1a1a1c 100%)',
            border: '1px solid rgba(232, 230, 227, 0.08)',
            padding: isMobile ? '28px 24px' : '36px',
            position: 'relative'
          }}>
            {/* Quote mark */}
            <div style={{
              position: 'absolute',
              top: isMobile ? '16px' : '24px',
              left: isMobile ? '16px' : '24px',
              fontSize: '48px',
              fontFamily: "'Instrument Serif', Georgia, serif",
              color: 'rgba(194, 154, 108, 0.2)',
              lineHeight: 1
            }}>
              "
            </div>

            <div style={{ paddingTop: '24px' }}>
              <p style={{
                fontSize: '16px',
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontStyle: 'italic',
                color: '#a8a5a0',
                lineHeight: 1.7,
                marginBottom: '24px'
              }}>
                Dmitrii has a rare ability to bridge complex technical systems with business value.
                His work on our staking infrastructure was exceptional—he understood the compliance
                constraints while pushing for the best possible product.
              </p>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(135deg, #2a2a2c 0%, #1a1a1c 100%)',
                  border: '1px solid rgba(232, 230, 227, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#4a4a4c',
                  fontSize: '18px',
                  fontFamily: "'Instrument Serif', Georgia, serif"
                }}>
                  JD
                </div>
                <div>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#e8e6e3',
                    marginBottom: '2px'
                  }}>
                    Engineering Lead
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#4a4a4c'
                  }}>
                    Former Colleague at Anchorage Digital
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonial 2 - Placeholder */}
          <div style={{
            background: 'linear-gradient(135deg, #141416 0%, #1a1a1c 100%)',
            border: '1px solid rgba(232, 230, 227, 0.08)',
            padding: isMobile ? '28px 24px' : '36px',
            position: 'relative'
          }}>
            {/* Quote mark */}
            <div style={{
              position: 'absolute',
              top: isMobile ? '16px' : '24px',
              left: isMobile ? '16px' : '24px',
              fontSize: '48px',
              fontFamily: "'Instrument Serif', Georgia, serif",
              color: 'rgba(194, 154, 108, 0.2)',
              lineHeight: 1
            }}>
              "
            </div>

            <div style={{ paddingTop: '24px' }}>
              <p style={{
                fontSize: '16px',
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontStyle: 'italic',
                color: '#a8a5a0',
                lineHeight: 1.7,
                marginBottom: '24px'
              }}>
                Working with Dmitrii on the Flow CLI was a masterclass in developer experience.
                He has an intuition for what developers need and the technical depth to
                make those improvements happen.
              </p>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(135deg, #2a2a2c 0%, #1a1a1c 100%)',
                  border: '1px solid rgba(232, 230, 227, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#4a4a4c',
                  fontSize: '18px',
                  fontFamily: "'Instrument Serif', Georgia, serif"
                }}>
                  SR
                </div>
                <div>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#e8e6e3',
                    marginBottom: '2px'
                  }}>
                    Senior Developer Advocate
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#4a4a4c'
                  }}>
                    Former Colleague at Dapper Labs
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Writing & Speaking Section */}
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
            color: '#4a4a4c'
          }}>
            Writing & Speaking
          </span>
          <div style={{
            flex: 1,
            height: '1px',
            background: 'rgba(232, 230, 227, 0.08)'
          }} />
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: '24px'
        }}>
          {/* Coming Soon Card */}
          <div style={{
            gridColumn: isMobile ? 'span 1' : 'span 2',
            background: 'linear-gradient(135deg, rgba(74, 222, 128, 0.05) 0%, rgba(74, 222, 128, 0.01) 100%)',
            border: '1px solid rgba(74, 222, 128, 0.15)',
            padding: isMobile ? '28px 24px' : '36px',
            position: 'relative'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                background: '#4ade80',
                borderRadius: '50%'
              }} />
              <span style={{
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#4ade80'
              }}>
                Coming Soon
              </span>
            </div>

            <h3 style={{
              fontSize: isMobile ? '20px' : '26px',
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontStyle: 'italic',
              fontWeight: 400,
              color: '#e8e6e3',
              marginBottom: '12px',
              lineHeight: 1.2
            }}>
              Thoughts on AI × On-Chain
            </h3>

            <p style={{
              fontSize: '14px',
              color: '#8a8885',
              lineHeight: 1.7,
              marginBottom: '20px',
              maxWidth: '480px'
            }}>
              Exploring the intersection of AI agents and blockchain execution.
              Where deterministic systems meet probabilistic intelligence—and what
              product managers need to know.
            </p>

            <div style={{
              display: 'flex',
              gap: '16px',
              flexWrap: 'wrap'
            }}>
              {['AI Agents', 'Smart Contracts', 'Product Thinking'].map((tag, i) => (
                <span key={i} style={{
                  fontSize: '11px',
                  fontWeight: 500,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  color: '#4a4a4c',
                  padding: '6px 10px',
                  background: 'rgba(74, 222, 128, 0.05)',
                  border: '1px solid rgba(74, 222, 128, 0.1)'
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div style={{
            background: 'linear-gradient(135deg, #141416 0%, #1a1a1c 100%)',
            border: '1px solid rgba(232, 230, 227, 0.08)',
            padding: isMobile ? '28px 24px' : '36px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            <span style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#6b6966'
            }}>
              Follow Along
            </span>

            {[
              { platform: 'X / Twitter', handle: '@kolob0kk', url: 'https://x.com/kolob0kk' },
              { platform: 'LinkedIn', handle: '/in/0xdmitri', url: 'https://www.linkedin.com/in/0xdmitri/' }
            ].map((social, i) => (
              <a
                key={i}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '14px 0',
                  borderBottom: '1px solid rgba(232, 230, 227, 0.06)',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <div>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#a8a5a0',
                    marginBottom: '2px'
                  }}>
                    {social.platform}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#4a4a4c',
                    fontFamily: 'monospace'
                  }}>
                    {social.handle}
                  </div>
                </div>
                <span style={{
                  color: '#4a4a4c',
                  fontFamily: "'Instrument Serif', serif",
                  fontStyle: 'italic',
                  transition: 'color 0.2s ease'
                }}>↗</span>
              </a>
            ))}

            <div style={{
              marginTop: 'auto',
              padding: '16px',
              background: 'rgba(194, 154, 108, 0.05)',
              border: '1px dashed rgba(194, 154, 108, 0.15)',
              textAlign: 'center'
            }}>
              <span style={{
                fontSize: '12px',
                color: '#6b6966',
                fontStyle: 'italic',
                fontFamily: "'Instrument Serif', Georgia, serif"
              }}>
                Newsletter launching Q1 2025
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Credentials Section (Beyond Work) */}
      {SHOW_BEYOND_WORK && (
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
              color: '#4a4a4c'
            }}>
              Beyond Work
            </span>
            <div style={{
              flex: 1,
              height: '1px',
              background: 'rgba(232, 230, 227, 0.08)'
            }} />
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
            gap: '1px',
            background: 'rgba(232, 230, 227, 0.06)'
          }}>
            {credentials.map((item, i) => (
              <div key={i} style={{
                background: '#08080a',
                padding: isMobile ? '28px 24px' : '40px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#4a4a4c'
                }}>
                  {item.label}
                </span>
                {item.url ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: isMobile ? '18px' : '22px',
                      fontFamily: "'Instrument Serif', Georgia, serif",
                      fontStyle: 'italic',
                      color: '#a8a5a0',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#c29a6c'}
                    onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#a8a5a0'}
                  >
                    {item.value}
                  </a>
                ) : (
                  <span style={{
                    fontSize: isMobile ? '18px' : '22px',
                    fontFamily: "'Instrument Serif', Georgia, serif",
                    fontStyle: 'italic',
                    color: '#a8a5a0'
                  }}>
                    {item.value}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Blog Section */}
      {SHOW_BLOG_SECTION && <Blog isMobile={isMobile} isTablet={isTablet} />}

      {/* On-Chain Identity Section */}
      {SHOW_ONCHAIN_IDENTITY && (
        <section id="on-chain" style={{
          padding: sectionPadding,
          maxWidth: '1400px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{
            border: '1px solid rgba(194, 154, 108, 0.2)',
            padding: isMobile ? '32px 24px' : '48px',
            position: 'relative'
          }}>
            {/* Corner accent */}
            <div style={{
              position: 'absolute',
              top: '-1px',
              left: '-1px',
              width: '24px',
              height: '24px',
              borderTop: '2px solid #c29a6c',
              borderLeft: '2px solid #c29a6c'
            }} />
            <div style={{
              position: 'absolute',
              bottom: '-1px',
              right: '-1px',
              width: '24px',
              height: '24px',
              borderBottom: '2px solid #c29a6c',
              borderRight: '2px solid #c29a6c'
            }} />

            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              gap: isMobile ? '32px' : '48px'
            }}>
              <div>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: '#4a4a4c',
                  display: 'block',
                  marginBottom: '16px'
                }}>
                  On-Chain Identity
                </span>

                <h3 style={{
                  fontSize: isMobile ? '28px' : '36px',
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  fontWeight: 400,
                  fontStyle: 'italic',
                  color: '#e8e6e3',
                  marginBottom: '20px',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2
                }}>
                  Builder, not just observer
                </h3>

                <p style={{
                  fontSize: '15px',
                  color: '#6b6966',
                  lineHeight: 1.7,
                  marginBottom: '24px'
                }}>
                  From shipping smart contracts at Microsoft to founding a Web3 SaaS,
                  I've been on-chain since before "Web3" was a category. My activity
                  reflects genuine participation in the ecosystem I help build.
                </p>

                {/* ENS Display */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  padding: '20px 24px',
                  background: 'rgba(194, 154, 108, 0.05)',
                  border: '1px solid rgba(194, 154, 108, 0.15)'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: 'linear-gradient(135deg, #c29a6c 0%, #a67c4e 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: "'Instrument Serif', Georgia, serif",
                    fontSize: '20px',
                    color: '#08080a'
                  }}>
                    ◆
                  </div>
                  <div>
                    <div style={{
                      fontFamily: "'Instrument Serif', Georgia, serif",
                      fontSize: '18px',
                      fontStyle: 'italic',
                      color: '#e8e6e3'
                    }}>
                      dmitriif.eth
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: '#4a4a4c',
                      fontFamily: 'monospace',
                      marginTop: '4px'
                    }}>
                      Charlotte, NC · EST
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1px',
                background: 'rgba(232, 230, 227, 0.06)',
                alignSelf: 'start'
              }}>
                {[
                  { value: '2016', label: 'First smart contract' },
                  { value: '200', label: 'DAU at Mempools' },
                  { value: '1M+', label: 'API requests/day' },
                  { value: '7+', label: 'Protocols shipped' }
                ].map((stat, i) => (
                  <div key={i} style={{
                    background: '#08080a',
                    padding: isMobile ? '24px 20px' : '32px'
                  }}>
                    <div style={{
                      fontSize: isMobile ? '28px' : '36px',
                      fontFamily: "'Instrument Serif', Georgia, serif",
                      fontWeight: 400,
                      color: '#e8e6e3',
                      lineHeight: 1
                    }}>
                      {stat.value}
                    </div>
                    <div style={{
                      fontSize: '11px',
                      fontWeight: 500,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: '#4a4a4c',
                      marginTop: '10px'
                    }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Explorer links */}
            <div style={{
              display: 'flex',
              gap: '32px',
              marginTop: '32px',
              paddingTop: '24px',
              borderTop: '1px solid rgba(232, 230, 227, 0.06)',
              flexWrap: 'wrap'
            }}>
              {explorerLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#4a4a4c',
                    textDecoration: 'none',
                    fontSize: '13px',
                    fontWeight: 500,
                    letterSpacing: '0.02em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#c29a6c'}
                  onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#4a4a4c'}
                >
                  {link.name}
                  <span style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}>↗</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

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
          color: '#e8e6e3',
          letterSpacing: '-0.03em',
          lineHeight: 1,
          marginBottom: '32px'
        }}>
          Let's build
        </h2>

        <p style={{
          fontSize: '16px',
          color: '#6b6966',
          maxWidth: '440px',
          margin: '0 auto 32px',
          lineHeight: 1.6
        }}>
          Open to PM roles in AI, infrastructure, and Web3.
          Particularly interested in where agents meet on-chain execution.
          Based in Charlotte (EST), flexible on remote.
        </p>

        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: '16px',
          justifyContent: 'center'
        }}>
          <a href="mailto:dmitrii.fotesco@gmail.com" style={{
            background: '#e8e6e3',
            color: '#08080a',
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
            color: '#6b6966',
            padding: '18px 40px',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: 600,
            letterSpacing: '0.02em',
            border: '1px solid rgba(232, 230, 227, 0.15)',
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
            { name: 'Email', url: 'mailto:dmitrii.fotesco@gmail.com' }
          ].map((social, i) => (
            <a
              key={i}
              href={social.url}
              target={social.url.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              style={{
                color: '#3a3a3c',
                textDecoration: 'none',
                fontSize: '12px',
                fontWeight: 500,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#6b6966'}
              onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#3a3a3c'}
            >
              {social.name}
            </a>
          ))}
        </div>
      </section>

      {/* Full-Page Case Study Modal */}
      {modalCase && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            background: '#08080a',
            animation: 'modalSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {/* Modal styles including animation and scrollbar */}
          <style>{`
            @keyframes modalSlideUp {
              from {
                opacity: 0;
                transform: translateY(40px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            
            .modal-scroll::-webkit-scrollbar {
              width: 6px;
            }
            
            .modal-scroll::-webkit-scrollbar-track {
              background: transparent;
            }
            
            .modal-scroll::-webkit-scrollbar-thumb {
              background: rgba(232, 230, 227, 0.15);
              border-radius: 3px;
            }
            
            .modal-scroll::-webkit-scrollbar-thumb:hover {
              background: rgba(232, 230, 227, 0.25);
            }
            
            .modal-scroll {
              scrollbar-width: thin;
              scrollbar-color: rgba(232, 230, 227, 0.15) transparent;
            }
          `}</style>

          {/* Modal Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: isMobile ? '20px 24px' : '28px 64px',
            borderBottom: '1px solid rgba(232, 230, 227, 0.08)',
            background: '#08080a',
            position: 'sticky',
            top: 0,
            zIndex: 10
          }}>
            <button
              onClick={() => setModalCase(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'none',
                border: 'none',
                color: '#6b6966',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
                padding: 0,
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget as HTMLButtonElement).style.color = '#e8e6e3'}
              onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.color = '#6b6966'}
            >
              <span style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}>←</span>
              Back to Work
            </button>

            <button
              onClick={() => setModalCase(null)}
              style={{
                background: 'none',
                border: '1px solid rgba(232, 230, 227, 0.1)',
                color: '#6b6966',
                width: '40px',
                height: '40px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(232, 230, 227, 0.3)';
                (e.currentTarget as HTMLButtonElement).style.color = '#e8e6e3';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(232, 230, 227, 0.1)';
                (e.currentTarget as HTMLButtonElement).style.color = '#6b6966';
              }}
            >
              ✕
            </button>
          </div>

          {/* Modal Content - Scrollable */}
          <div
            className="modal-scroll"
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: isMobile ? '40px 24px' : '64px',
              maxWidth: '900px',
              margin: '0 auto',
              width: '100%'
            }}>
            {/* Case Study Number & Title */}
            <div style={{ marginBottom: '40px' }}>
              <span style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontSize: isMobile ? '48px' : '72px',
                fontStyle: 'italic',
                color: '#2a2a2c',
                lineHeight: 1
              }}>
                {modalCase.number}
              </span>
              <h1 style={{
                fontSize: isMobile ? '32px' : '48px',
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontWeight: 400,
                fontStyle: 'italic',
                color: '#e8e6e3',
                marginTop: '16px',
                marginBottom: '12px',
                letterSpacing: '-0.02em',
                lineHeight: 1.1
              }}>
                {modalCase.title}
              </h1>
              <div style={{
                fontSize: '14px',
                color: '#6b6966'
              }}>
                {modalCase.company} • {modalCase.year}
              </div>
            </div>

            {/* Hero Image Placeholder */}
            {modalCase.fullContent.artifacts && modalCase.fullContent.artifacts[0] && (
              <div style={{
                background: 'linear-gradient(135deg, #141416 0%, #1a1a1c 100%)',
                border: modalCase.fullContent.artifacts[0].src ? 'none' : '1px dashed rgba(232, 230, 227, 0.15)',
                aspectRatio: '16/9',
                marginBottom: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                {modalCase.fullContent.artifacts[0].src ? (
                  <img
                    src={modalCase.fullContent.artifacts[0].src}
                    alt={modalCase.fullContent.artifacts[0].alt}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '32px', color: '#3a3a3c' }}>
                      {modalCase.fullContent.artifacts[0].type === 'diagram' && '📐'}
                      {modalCase.fullContent.artifacts[0].type === 'screenshot' && '🖼️'}
                      {modalCase.fullContent.artifacts[0].type === 'chart' && '📊'}
                      {modalCase.fullContent.artifacts[0].type === 'wireframe' && '📱'}
                    </span>
                    <div style={{ fontSize: '14px', color: '#4a4a4c', marginTop: '12px' }}>
                      {modalCase.fullContent.artifacts[0].alt}
                    </div>
                    {modalCase.fullContent.artifacts[0].caption && (
                      <div style={{ fontSize: '12px', color: '#3a3a3c', fontStyle: 'italic', marginTop: '8px' }}>
                        {modalCase.fullContent.artifacts[0].caption}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Metrics Row */}
            <div style={{
              display: 'flex',
              gap: isMobile ? '24px' : '48px',
              marginBottom: '48px',
              flexWrap: 'wrap',
              padding: '32px',
              background: 'rgba(232, 230, 227, 0.02)',
              border: '1px solid rgba(232, 230, 227, 0.06)'
            }}>
              <div style={{ flex: 1, minWidth: '120px' }}>
                <div style={{
                  fontSize: isMobile ? '32px' : '40px',
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  color: '#c29a6c',
                  lineHeight: 1
                }}>{modalCase.metrics.primary.value}</div>
                <div style={{
                  fontSize: '11px',
                  fontWeight: 500,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#4a4a4c',
                  marginTop: '8px'
                }}>{modalCase.metrics.primary.label}</div>
              </div>
              {modalCase.metrics.secondary && (
                <div style={{ flex: 1, minWidth: '120px' }}>
                  <div style={{
                    fontSize: isMobile ? '32px' : '40px',
                    fontFamily: "'Instrument Serif', Georgia, serif",
                    color: '#e8e6e3',
                    lineHeight: 1
                  }}>{modalCase.metrics.secondary.value}</div>
                  <div style={{
                    fontSize: '11px',
                    fontWeight: 500,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: '#4a4a4c',
                    marginTop: '8px'
                  }}>{modalCase.metrics.secondary.label}</div>
                </div>
              )}
              {modalCase.metrics.tertiary && (
                <div style={{ flex: 1, minWidth: '120px' }}>
                  <div style={{
                    fontSize: isMobile ? '32px' : '40px',
                    fontFamily: "'Instrument Serif', Georgia, serif",
                    color: '#a8a5a0',
                    lineHeight: 1
                  }}>{modalCase.metrics.tertiary.value}</div>
                  <div style={{
                    fontSize: '11px',
                    fontWeight: 500,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: '#4a4a4c',
                    marginTop: '8px'
                  }}>{modalCase.metrics.tertiary.label}</div>
                </div>
              )}
            </div>

            {/* Role & Context */}
            <div style={{
              display: 'flex',
              gap: '32px',
              marginBottom: '40px',
              flexWrap: 'wrap',
              paddingBottom: '32px',
              borderBottom: '1px solid rgba(232, 230, 227, 0.08)'
            }}>
              <div>
                <span style={{
                  fontSize: '10px',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#4a4a4c'
                }}>My Role</span>
                <div style={{
                  fontSize: '16px',
                  color: '#c29a6c',
                  marginTop: '6px',
                  fontWeight: 500
                }}>{modalCase.fullContent.myRole}</div>
              </div>
              {modalCase.fullContent.teamSize && (
                <div>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: '#4a4a4c'
                  }}>Team</span>
                  <div style={{
                    fontSize: '16px',
                    color: '#a8a5a0',
                    marginTop: '6px'
                  }}>{modalCase.fullContent.teamSize}</div>
                </div>
              )}
              {modalCase.fullContent.duration && (
                <div>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: '#4a4a4c'
                  }}>Duration</span>
                  <div style={{
                    fontSize: '16px',
                    color: '#a8a5a0',
                    marginTop: '6px'
                  }}>{modalCase.fullContent.duration}</div>
                </div>
              )}
            </div>

            {/* The Challenge */}
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{
                fontSize: '13px',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#6b6966',
                marginBottom: '16px'
              }}>The Challenge</h2>
              <p style={{
                fontSize: '17px',
                color: '#a8a5a0',
                lineHeight: 1.8
              }}>{modalCase.fullContent.situation}</p>
            </div>

            {/* Key Decision Callout */}
            {modalCase.fullContent.keyDecision && (
              <div style={{
                background: 'rgba(194, 154, 108, 0.08)',
                border: '1px solid rgba(194, 154, 108, 0.25)',
                padding: '28px',
                marginBottom: '40px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '12px'
                }}>
                  <span style={{ fontSize: '18px' }}>💡</span>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: '#c29a6c'
                  }}>Key Decision</span>
                </div>
                <h3 style={{
                  fontSize: '18px',
                  color: '#e8e6e3',
                  fontWeight: 500,
                  marginBottom: '12px',
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  fontStyle: 'italic'
                }}>{modalCase.fullContent.keyDecision.title}</h3>
                <p style={{
                  fontSize: '15px',
                  color: '#8a8885',
                  lineHeight: 1.7
                }}>{modalCase.fullContent.keyDecision.description}</p>
              </div>
            )}

            {/* What I Did */}
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{
                fontSize: '13px',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#6b6966',
                marginBottom: '20px'
              }}>What I Did</h2>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                {modalCase.fullContent.actions.map((action: string, i: number) => (
                  <li key={i} style={{
                    fontSize: '16px',
                    color: '#a8a5a0',
                    lineHeight: 1.7,
                    paddingLeft: '28px',
                    position: 'relative'
                  }}>
                    <span style={{
                      position: 'absolute',
                      left: 0,
                      color: '#c29a6c',
                      fontFamily: "'Instrument Serif', serif",
                      fontStyle: 'italic'
                    }}>→</span>
                    {action}
                  </li>
                ))}
              </ul>
            </div>

            {/* Results */}
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{
                fontSize: '13px',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#6b6966',
                marginBottom: '16px'
              }}>Results</h2>
              <p style={{
                fontSize: '17px',
                color: '#a8a5a0',
                lineHeight: 1.8
              }}>{modalCase.fullContent.results}</p>
            </div>

            {/* Tech Stack */}
            {modalCase.fullContent.techStack && (
              <div style={{ marginBottom: '40px' }}>
                <h2 style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#6b6966',
                  marginBottom: '16px'
                }}>Tech Stack</h2>
                <div style={{
                  display: 'flex',
                  gap: '10px',
                  flexWrap: 'wrap'
                }}>
                  {modalCase.fullContent.techStack.map((tech, i) => (
                    <span key={i} style={{
                      fontSize: '12px',
                      fontWeight: 500,
                      color: '#6b6966',
                      padding: '8px 14px',
                      background: 'rgba(232, 230, 227, 0.04)',
                      border: '1px solid rgba(232, 230, 227, 0.1)'
                    }}>{tech}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            <div style={{
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap',
              paddingTop: '32px',
              borderTop: '1px solid rgba(232, 230, 227, 0.08)'
            }}>
              {modalCase.tags.map((tag, i) => (
                <span key={i} style={{
                  fontSize: '11px',
                  fontWeight: 500,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#4a4a4c',
                  padding: '8px 14px',
                  border: '1px solid rgba(232, 230, 227, 0.08)'
                }}>{tag}</span>
              ))}
            </div>

            {/* Navigation Between Case Studies */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '64px',
              paddingTop: '32px',
              borderTop: '1px solid rgba(232, 230, 227, 0.08)',
              gap: '24px',
              flexWrap: 'wrap'
            }}>
              {(() => {
                const currentIndex = caseStudies.findIndex(c => c.id === modalCase.id);
                const prevStudy = currentIndex > 0 ? caseStudies[currentIndex - 1] : null;
                const nextStudy = currentIndex < caseStudies.length - 1 ? caseStudies[currentIndex + 1] : null;

                return (
                  <>
                    {prevStudy ? (
                      <button
                        onClick={() => setModalCase(prevStudy)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          textAlign: 'left',
                          padding: 0,
                          flex: 1
                        }}
                      >
                        <span style={{
                          fontSize: '11px',
                          fontWeight: 500,
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          color: '#4a4a4c',
                          display: 'block',
                          marginBottom: '8px'
                        }}>← Previous</span>
                        <span style={{
                          fontSize: '16px',
                          fontFamily: "'Instrument Serif', Georgia, serif",
                          fontStyle: 'italic',
                          color: '#a8a5a0'
                        }}>{prevStudy.title}</span>
                      </button>
                    ) : <div style={{ flex: 1 }} />}

                    {nextStudy ? (
                      <button
                        onClick={() => setModalCase(nextStudy)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          textAlign: 'right',
                          padding: 0,
                          flex: 1
                        }}
                      >
                        <span style={{
                          fontSize: '11px',
                          fontWeight: 500,
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          color: '#4a4a4c',
                          display: 'block',
                          marginBottom: '8px'
                        }}>Next →</span>
                        <span style={{
                          fontSize: '16px',
                          fontFamily: "'Instrument Serif', Georgia, serif",
                          fontStyle: 'italic',
                          color: '#a8a5a0'
                        }}>{nextStudy.title}</span>
                      </button>
                    ) : <div style={{ flex: 1 }} />}
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{
        padding: isMobile ? '32px 24px' : '40px 64px',
        borderTop: '1px solid rgba(232, 230, 227, 0.06)',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: isMobile ? 'flex-start' : 'center',
        gap: '16px',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          fontSize: '12px',
          color: '#3a3a3c',
          letterSpacing: '0.02em'
        }}>
          © 2025
        </div>
        <div style={{
          fontSize: '12px',
          color: '#3a3a3c',
          fontStyle: 'italic',
          fontFamily: "'Instrument Serif', Georgia, serif"
        }}>
          Designed and built by Dmitrii
        </div>
      </footer>
    </div>
  );
}
