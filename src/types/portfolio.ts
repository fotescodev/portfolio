// ═══════════════════════════════════════════════════════════════
// PROFILE
// ═══════════════════════════════════════════════════════════════
export interface HeadlineSegment {
  text: string;
  style: 'italic' | 'muted' | 'accent' | 'normal';
}

export interface CtaButton {
  label: string;
  href: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface Profile {
  name: string;
  ens: string;
  email: string;
  location: string;
  timezone: string;
  photo: string;
  hero: {
    status: string;
    headline: HeadlineSegment[];
    subheadline: string;
    cta: {
      primary: CtaButton;
      secondary: CtaButton;
    };
  };
  about: {
    tagline: string;
    bio: string[];
    stats: Stat[];
  };
  sections: {
    beyondWork: boolean;
    blog: boolean;
    onchainIdentity: boolean;
    skills: boolean;
  };
}

// ═══════════════════════════════════════════════════════════════
// EXPERIENCE
// ═══════════════════════════════════════════════════════════════
export interface Job {
  company: string;
  role: string;
  period: string;
  location: string;
  logo?: string | null;
  highlights: string[];
  tags: string[];
  url?: string | null;
}

export interface Experience {
  jobs: Job[];
}

// ═══════════════════════════════════════════════════════════════
// TESTIMONIALS
// ═══════════════════════════════════════════════════════════════
export interface Testimonial {
  quote: string;
  author: string;
  initials?: string;
  role: string;
  company: string;
  avatar?: string | null;
  featured: boolean;
}

export interface Testimonials {
  testimonials: Testimonial[];
}

// ═══════════════════════════════════════════════════════════════
// CERTIFICATIONS
// ═══════════════════════════════════════════════════════════════
export interface Certification {
  name: string;
  issuer: string;
  date: string;
  credentialId?: string | null;
  url?: string | null;
  logo?: string | null;
  featured: boolean;
  instructor?: string | null;
  instructorRole?: string | null;
}

export interface Credential {
  label: string;
  value: string;
  url?: string | null;
}

export interface OnchainLink {
  name: string;
  url: string;
  icon: string;
}

export interface Certifications {
  certifications: Certification[];
  credentials: Credential[];
  onchainIdentity: {
    ens: string;
    links: OnchainLink[];
  };
}

// ═══════════════════════════════════════════════════════════════
// SKILLS
// ═══════════════════════════════════════════════════════════════
export interface SkillCategory {
  name: string;
  skills: string[];
}

export interface Skills {
  categories: SkillCategory[];
}

// ═══════════════════════════════════════════════════════════════
// SOCIAL
// ═══════════════════════════════════════════════════════════════
export interface SocialLink {
  platform: string;
  label: string;
  handle?: string;
  url: string;
  icon: string;
  primary: boolean;
}

export interface ContactCtaButton {
  label: string;
  href: string;
  style: 'primary' | 'secondary';
}

export interface ContactCta {
  headline: string;
  subtext: string;
  buttons: ContactCtaButton[];
}

export interface Newsletter {
  enabled: boolean;
  launchDate?: string;
  teaser?: string;
}

export interface Social {
  links: SocialLink[];
  contactCta: ContactCta;
  newsletter?: Newsletter;
}

// ═══════════════════════════════════════════════════════════════
// CASE STUDY (Simplified markdown-first schema)
// ═══════════════════════════════════════════════════════════════
export interface ImpactMetric {
  value: string;
  label: string;
}

export interface CaseStudyCta {
  headline: string;
  subtext?: string;
  action: 'contact' | 'calendly' | 'linkedin';
  linkText: string;
}

export interface CaseStudy {
  // Identification
  id: number;
  slug: string;
  title: string;
  company: string;
  year: string;
  tags: string[];

  // Context (simplified)
  duration: string;
  role: string;

  // Hook - Grab attention in 3 seconds
  hook: {
    headline: string;
    impactMetric: ImpactMetric;
    subMetrics?: ImpactMetric[];
    thumbnail: string | null;
  };

  // Links (optional)
  demoUrl?: string | null;
  githubUrl?: string | null;
  docsUrl?: string | null;

  // Media links (optional) - blog posts, tweets, videos, etc.
  media?: Array<{
    type: 'blog' | 'twitter' | 'linkedin' | 'video' | 'article' | 'slides';
    url: string;
    label?: string; // Optional custom label for tooltip
  }>;

  // CTA - Drive action
  cta: CaseStudyCta;

  // Markdown content (the narrative)
  content: string;
}

// ═══════════════════════════════════════════════════════════════
// AGGREGATED CONTENT (for content loader)
// ═══════════════════════════════════════════════════════════════
export interface PortfolioContent {
  profile: Profile;
  experience: Experience;
  testimonials: Testimonials;
  certifications: Certifications;
  skills: Skills;
  social: Social;
  caseStudies: CaseStudy[];
}
