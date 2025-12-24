/**
 * Zod validation schemas for all content types
 *
 * Shared between content loader and validation CLI
 */

import { z } from 'zod';

// ------------------------------------------------------------------
// PROFILE
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
    skills: z.boolean(),
    passionProjects: z.boolean()
  })
});

// ------------------------------------------------------------------
// EXPERIENCE
// ------------------------------------------------------------------

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

// ------------------------------------------------------------------
// TESTIMONIALS
// ------------------------------------------------------------------

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

// ------------------------------------------------------------------
// CERTIFICATIONS
// ------------------------------------------------------------------

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

// ------------------------------------------------------------------
// SKILLS
// ------------------------------------------------------------------

const SkillCategorySchema = z.object({
  name: z.string(),
  skills: z.array(z.string())
});

export const SkillsSchema = z.object({
  categories: z.array(SkillCategorySchema)
});

// ------------------------------------------------------------------
// SOCIAL
// ------------------------------------------------------------------

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

// ------------------------------------------------------------------
// CASE STUDIES
// ------------------------------------------------------------------

const ImpactMetricSchema = z.object({
  value: z.string(),
  label: z.string()
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
  duration: z.string(),
  role: z.string(),
  hook: z.object({
    headline: z.string(),
    impactMetric: ImpactMetricSchema,
    subMetrics: z.array(ImpactMetricSchema).optional(),
    thumbnail: z.string().nullable()
  }),
  demoUrl: z.string().nullable().optional(),
  githubUrl: z.string().nullable().optional(),
  docsUrl: z.string().nullable().optional(),
  media: z.array(z.object({
    type: z.enum(['blog', 'twitter', 'linkedin', 'video', 'article', 'slides']),
    url: z.string(),
    label: z.string().optional()
  })).optional(),
  cta: CaseStudyCtaSchema,
  content: z.string()
});

// ------------------------------------------------------------------
// PASSION PROJECTS
// ------------------------------------------------------------------

const PassionProjectSchema = z.object({
  id: z.number(),
  slug: z.string(),
  title: z.string(),
  tagline: z.string(),
  year: z.string(),
  tags: z.array(z.string()),
  thumbnail: z.string().nullable().optional(),
  githubUrl: z.string().nullable().optional(),
  liveUrl: z.string().nullable().optional(),
  docsUrl: z.string().nullable().optional()
});

export const PassionProjectsSchema = z.object({
  projects: z.array(PassionProjectSchema)
});

// ------------------------------------------------------------------
// BLOG POSTS
// ------------------------------------------------------------------

export const BlogPostSchema = z.object({
  title: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  excerpt: z.string(),
  tags: z.array(z.string()),
  thumbnail: z.string().nullable().optional(),
  content: z.string()
});

// ------------------------------------------------------------------
// VARIANT CV (Universal Portfolio)
// ------------------------------------------------------------------

/**
 * Metadata about the variant generation
 */
const VariantMetadataSchema = z.object({
  company: z.string(),
  role: z.string(),
  generatedAt: z.string(),
  jobDescription: z.string(),
  generationModel: z.string().optional(), // e.g., "claude-3-5-sonnet-20241022"
  slug: z.string(), // e.g., "bloomberg-senior-engineer"
  publishStatus: z.enum(['draft', 'published']).optional().default('draft'),
  publishedAt: z.string().optional(),
  applicationStatus: z.enum(['not_applied', 'applied']).optional().default('not_applied'),
  appliedAt: z.string().optional()
});

/**
 * Experience override - allows tailoring job highlights per variant
 */
const ExperienceOverrideSchema = z.object({
  company: z.string(), // Match by company name
  highlights: z.array(z.string()).optional(), // Override highlights for this company
  tags: z.array(z.string()).optional() // Override tags for this company
});

/**
 * Overrides for profile fields specific to this variant
 * All fields optional - only override what's relevant for the job
 */
const VariantOverridesSchema = z.object({
  hero: z.object({
    status: z.string().optional(),
    headline: z.array(HeadlineSegmentSchema).optional(),
    subheadline: z.string().optional(),
    // Company accent - shown below signature headline to help recruiters visualize fit
    companyAccent: z.array(HeadlineSegmentSchema).optional()
  }).optional(),
  about: z.object({
    tagline: z.string().optional(),
    bio: z.array(z.string()).optional(),
    stats: z.array(StatSchema).optional()
  }).optional(),
  sections: z.object({
    beyondWork: z.boolean().optional(),
    blog: z.boolean().optional(),
    onchainIdentity: z.boolean().optional(),
    skills: z.boolean().optional(),
    passionProjects: z.boolean().optional()
  }).optional(),
  // Experience customization - tailor highlights per company for this job
  experience: z.array(ExperienceOverrideSchema).optional()
});

/**
 * Relevance rankings for existing content
 * AI determines which case studies, projects, skills to emphasize
 */
const VariantRelevanceSchema = z.object({
  caseStudies: z.array(z.object({
    slug: z.string(),
    relevanceScore: z.number().min(0).max(1),
    reasoning: z.string().optional()
  })).optional(),
  skills: z.array(z.object({
    category: z.string(),
    relevanceScore: z.number().min(0).max(1)
  })).optional(),
  projects: z.array(z.object({
    slug: z.string(),
    relevanceScore: z.number().min(0).max(1),
    reasoning: z.string().optional()
  })).optional()
});

/**
 * Complete variant schema - combines metadata, overrides, and relevance
 */
export const VariantSchema = z.object({
  metadata: VariantMetadataSchema,
  overrides: VariantOverridesSchema,
  relevance: VariantRelevanceSchema.optional()
});
