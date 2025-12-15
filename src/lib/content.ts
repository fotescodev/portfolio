/**
 * Content Loader with Zod Validation
 *
 * This module provides type-safe access to all content files.
 * YAML files are loaded via @rollup/plugin-yaml.
 * Case studies are loaded from markdown files with YAML frontmatter.
 */

import { z } from 'zod';
import YAML from 'yaml';
import type { PortfolioContent, CaseStudy } from '../types/portfolio';

// Import YAML content files
import profileYaml from '../../content/profile.yaml';
import experienceYaml from '../../content/experience/index.yaml';
import testimonialsYaml from '../../content/testimonials/index.yaml';
import certificationsYaml from '../../content/certifications/index.yaml';
import skillsYaml from '../../content/skills/index.yaml';
import socialYaml from '../../content/social/index.yaml';

// Auto-discover case studies using import.meta.glob (now markdown files)
const caseStudyFiles = import.meta.glob('../../content/case-studies/*.md', { query: '?raw', eager: true });

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

// Case Study Schema (simplified for markdown files)
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
// Frontmatter Parsing
// ------------------------------------------------------------------

function parseFrontmatter(raw: string): { frontmatter: Record<string, unknown>; content: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { frontmatter: {}, content: raw };

  const frontmatterStr = match[1];
  const content = match[2].trim();

  try {
    const frontmatter = YAML.parse(frontmatterStr);
    return { frontmatter, content };
  } catch (error) {
    console.error('Failed to parse frontmatter:', error);
    return { frontmatter: {}, content: raw };
  }
}

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

// Parse and validate case studies from markdown files
function parseCaseStudies(): CaseStudy[] {
  return Object.entries(caseStudyFiles)
    .map(([path, module]) => {
      const filename = path.split('/').pop() || 'unknown';
      const raw = (module as { default: string }).default;
      const { frontmatter, content } = parseFrontmatter(raw);
      
      // Combine frontmatter with content
      const caseStudyData = {
        ...frontmatter,
        content
      };
      
      return validate(CaseStudySchema, caseStudyData, filename);
    })
    .sort((a, b) => a.id - b.id);
}

export const caseStudies = parseCaseStudies();

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
