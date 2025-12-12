/**
 * Content Loader with Zod Validation
 *
 * This module provides type-safe access to all YAML content files.
 * Content is loaded at build time via @rollup/plugin-yaml and validated at runtime.
 */

import { z } from 'zod';
import type { PortfolioContent } from '../types/portfolio';

// Import YAML content files
import profileYaml from '../../content/profile.yaml';
import experienceYaml from '../../content/experience/index.yaml';
import testimonialsYaml from '../../content/testimonials/index.yaml';
import certificationsYaml from '../../content/certifications/index.yaml';
import skillsYaml from '../../content/skills/index.yaml';
import socialYaml from '../../content/social/index.yaml';

// Auto-discover case studies using import.meta.glob
const caseStudyFiles = import.meta.glob('../../content/case-studies/*.yaml', { eager: true });

// ------------------------------------------------------------------
// Zod Schemas (Mirroring types/portfolio.ts)
// ------------------------------------------------------------------

const HeadlineSegmentSchema = z.object({
  text: z.string(),
  style: z.enum(['italic', 'muted', 'accent', 'normal']).optional().default('normal')
});

const CtaButtonSchema = z.object({
  label: z.string(),
  href: z.string()
});

const StatSchema = z.object({
  value: z.string(),
  label: z.string()
});

export const ProfileSchema = z.object({
  name: z.string(),
  ens: z.string(),
  email: z.string().email(),
  location: z.string(),
  timezone: z.string(),
  photo: z.string(),
  hero: z.object({
    status: z.string(),
    headline: z.array(HeadlineSegmentSchema),
    subheadline: z.string(),
    cta: z.object({
      primary: CtaButtonSchema,
      secondary: CtaButtonSchema
    })
  }),
  about: z.object({
    tagline: z.string(),
    bio: z.array(z.string()),
    stats: z.array(StatSchema)
  }),
  sections: z.object({
    beyondWork: z.boolean(),
    blog: z.boolean(),
    onchainIdentity: z.boolean(),
    skills: z.boolean()
  })
});

const JobSchema = z.object({
  company: z.string(),
  role: z.string(),
  period: z.string(),
  location: z.string(),
  logo: z.string().nullable().optional(),
  highlights: z.array(z.string()),
  tags: z.array(z.string()),
  url: z.string().nullable().optional()
});

export const ExperienceSchema = z.object({
  jobs: z.array(JobSchema)
});

const TestimonialSchema = z.object({
  quote: z.string(),
  author: z.string(),
  initials: z.string().optional(),
  role: z.string(),
  company: z.string(),
  avatar: z.string().nullable().optional(),
  featured: z.boolean()
});

export const TestimonialsSchema = z.object({
  testimonials: z.array(TestimonialSchema)
});

const CertificationSchema = z.object({
  name: z.string(),
  issuer: z.string(),
  date: z.string(),
  credentialId: z.string().nullable().optional(),
  url: z.string().nullable().optional(),
  logo: z.string().nullable().optional(),
  featured: z.boolean(),
  instructor: z.string().nullable().optional(),
  instructorRole: z.string().nullable().optional()
});

const CredentialSchema = z.object({
  label: z.string(),
  value: z.string(),
  url: z.string().nullable().optional()
});

const OnchainLinkSchema = z.object({
  name: z.string(),
  url: z.string(),
  icon: z.string()
});

export const CertificationsSchema = z.object({
  certifications: z.array(CertificationSchema),
  credentials: z.array(CredentialSchema),
  onchainIdentity: z.object({
    ens: z.string(),
    links: z.array(OnchainLinkSchema)
  })
});

const SkillCategorySchema = z.object({
  name: z.string(),
  skills: z.array(z.string())
});

export const SkillsSchema = z.object({
  categories: z.array(SkillCategorySchema)
});

const SocialLinkSchema = z.object({
  platform: z.string(),
  label: z.string(),
  handle: z.string().optional(),
  url: z.string(),
  icon: z.string(),
  primary: z.boolean()
});

const ContactCtaButtonSchema = z.object({
  label: z.string(),
  href: z.string(),
  style: z.enum(['primary', 'secondary'])
});

const ContactCtaSchema = z.object({
  headline: z.string(),
  subtext: z.string(),
  buttons: z.array(ContactCtaButtonSchema)
});

const NewsletterSchema = z.object({
  enabled: z.boolean(),
  launchDate: z.string().optional(),
  teaser: z.string().optional()
});

export const SocialSchema = z.object({
  links: z.array(SocialLinkSchema),
  contactCta: ContactCtaSchema,
  newsletter: NewsletterSchema.optional()
});

// Case Study Sub-Schemas
const ImpactMetricSchema = z.object({
  value: z.string(),
  label: z.string()
});

const MetricWithContextSchema = z.object({
  metric: z.string(),
  context: z.string()
});

const AlternativeSchema = z.object({
  option: z.string(),
  tradeoffs: z.string(),
  whyNot: z.string()
});

const ExecutionPhaseSchema = z.object({
  name: z.string(),
  duration: z.string().optional(),
  actions: z.array(z.string())
});

const KeyDecisionSchema = z.object({
  title: z.string(),
  context: z.string(),
  decision: z.string(),
  outcome: z.string()
});

const CaseStudyTestimonialSchema = z.object({
  quote: z.string(),
  author: z.string(),
  role: z.string(),
  company: z.string()
});

const ArtifactSchema = z.object({
  type: z.enum(['diagram', 'screenshot', 'video', 'metrics', 'chart']),
  src: z.string().nullable(),
  alt: z.string(),
  caption: z.string().optional()
});

const CaseStudyCtaSchema = z.object({
  headline: z.string(),
  subtext: z.string().optional(),
  action: z.enum(['contact', 'calendly', 'linkedin']),
  linkText: z.string()
});

export const CaseStudySchema = z.object({
  id: z.number(),
  slug: z.string(),
  title: z.string(),
  company: z.string(),
  year: z.string(),
  tags: z.array(z.string()),
  hook: z.object({
    headline: z.string(),
    impactMetric: ImpactMetricSchema,
    subMetrics: z.array(ImpactMetricSchema).optional(),
    thumbnail: z.string().nullable(),
    thumbnailAlt: z.string()
  }),
  context: z.object({
    myRole: z.string(),
    teamSize: z.string(),
    duration: z.string(),
    stakeholders: z.array(z.string())
  }),
  problem: z.object({
    businessContext: z.string(),
    constraints: z.array(z.string()),
    stakes: z.string()
  }),
  approach: z.object({
    hypothesis: z.string(),
    alternatives: z.array(AlternativeSchema).optional().default([]),
    chosenPath: z.string()
  }),
  execution: z.object({
    phases: z.array(ExecutionPhaseSchema),
    keyDecision: KeyDecisionSchema
  }),
  results: z.object({
    primary: MetricWithContextSchema,
    secondary: MetricWithContextSchema.optional(),
    tertiary: MetricWithContextSchema.optional(),
    qualitative: z.string().optional()
  }),
  reflection: z.object({
    whatWorked: z.array(z.string()),
    whatDidnt: z.array(z.string()),
    lessonLearned: z.string(),
    wouldDoDifferently: z.string()
  }),
  evidence: z.object({
    demoUrl: z.string().nullable().optional(),
    githubUrl: z.string().nullable().optional(),
    blogPostUrl: z.string().nullable().optional(),
    testimonial: CaseStudyTestimonialSchema.optional(),
    artifacts: z.array(ArtifactSchema).optional().default([])
  }),
  cta: CaseStudyCtaSchema,
  techStack: z.array(z.string())
});

// ------------------------------------------------------------------
// Runtime Validation
// ------------------------------------------------------------------

function validate<T>(schema: z.ZodSchema<T>, data: unknown, filename: string): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(`❌ Validation failed for ${filename}:`, error.flatten().fieldErrors);
      throw new Error(`Invalid content in ${filename}: ${error.message}`);
    }
    throw error;
  }
}

// Export validated content
export const profile = validate(ProfileSchema, profileYaml, 'profile.yaml');
export const experience = validate(ExperienceSchema, experienceYaml, 'experience/index.yaml');
export const testimonials = validate(TestimonialsSchema, testimonialsYaml, 'testimonials/index.yaml');
export const certifications = validate(CertificationsSchema, certificationsYaml, 'certifications/index.yaml');
export const skills = validate(SkillsSchema, skillsYaml, 'skills/index.yaml');
export const social = validate(SocialSchema, socialYaml, 'social/index.yaml');

// Validate and sort case studies (auto-discovered)
export const caseStudies = Object.entries(caseStudyFiles)
  .map(([path, module]) => {
    const filename = path.split('/').pop() || 'unknown';
    return validate(CaseStudySchema, (module as any).default, filename);
  })
  .sort((a, b) => a.id - b.id);

// Aggregated content export
export const content: PortfolioContent = {
  profile,
  experience,
  testimonials,
  certifications,
  skills,
  social,
  caseStudies,
};

// Helper functions
export function getCaseStudyBySlug(slug: string) {
  return caseStudies.find(cs => cs.slug === slug);
}

export function getCaseStudyById(id: number) {
  return caseStudies.find(cs => cs.id === id);
}

export function getFeaturedTestimonials() {
  return testimonials.testimonials.filter(t => t.featured);
}

export function getFeaturedCertifications() {
  return certifications.certifications.filter(c => c.featured);
}

export function getPrimarySocialLinks() {
  return social.links.filter(l => l.primary);
}

export function isSectionVisible(section: keyof typeof profile.sections): boolean {
  return profile.sections[section];
}

export default content;
