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
  logo?: string;
  highlights: string[];
  tags: string[];
  url?: string;
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
  url?: string;
  logo?: string;
  featured: boolean;
  instructor?: string;
  instructorRole?: string;
}

export interface Credential {
  label: string;
  value: string;
  url?: string;
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
// CASE STUDY (Enhanced for recruiter engagement)
// ═══════════════════════════════════════════════════════════════
export interface MetricWithContext {
  metric: string;
  context: string;
}

export interface ImpactMetric {
  value: string;
  label: string;
}

export interface Alternative {
  option: string;
  tradeoffs: string;
  whyNot: string;
}

export interface ExecutionPhase {
  name: string;
  duration?: string;
  actions: string[];
}

export interface KeyDecision {
  title: string;
  context: string;
  decision: string;
  outcome: string;
}

export interface CaseStudyTestimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
}

export interface Artifact {
  type: 'diagram' | 'screenshot' | 'video' | 'metrics' | 'chart';
  src: string | null;
  alt: string;
  caption?: string;
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

  // Hook - Grab attention in 3 seconds
  hook: {
    headline: string;
    impactMetric: ImpactMetric;
    subMetrics?: ImpactMetric[];
    thumbnail: string | null;
    thumbnailAlt: string;
  };

  // Context - Role clarity
  context: {
    myRole: string;
    teamSize: string;
    duration: string;
    stakeholders: string[];
  };

  // Problem - Make them feel the pain
  problem: {
    businessContext: string;
    constraints: string[];
    stakes: string;
  };

  // Approach - Show thinking depth
  approach: {
    hypothesis: string;
    alternatives: Alternative[];
    chosenPath: string;
  };

  // Execution - Concrete actions
  execution: {
    phases: ExecutionPhase[];
    keyDecision: KeyDecision;
  };

  // Results - Quantified impact
  results: {
    primary: MetricWithContext;
    secondary?: MetricWithContext;
    tertiary?: MetricWithContext;
    qualitative?: string;
  };

  // Reflection - Shows self-awareness (critical for credibility)
  reflection: {
    whatWorked: string[];
    whatDidnt: string[];
    lessonLearned: string;
    wouldDoDifferently: string;
  };

  // Evidence - Proof points
  evidence: {
    demoUrl?: string | null;
    githubUrl?: string | null;
    blogPostUrl?: string | null;
    testimonial?: CaseStudyTestimonial;
    artifacts: Artifact[];
  };

  // CTA - Drive action (contextual per case study)
  cta: CaseStudyCta;

  // Tech Stack - For keyword matching
  techStack: string[];
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
