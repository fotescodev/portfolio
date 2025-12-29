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
import {
  ProfileSchema,
  ExperienceSchema,
  TestimonialsSchema,
  CertificationsSchema,
  SkillsSchema,
  SocialSchema,
  CaseStudySchema,
  PassionProjectsSchema,
  BlogPostSchema
} from './schemas';

// Import YAML content files
import profileYaml from '../../content/profile.yaml';
import experienceYaml from '../../content/experience/index.yaml';
import testimonialsYaml from '../../content/testimonials/index.yaml';
import certificationsYaml from '../../content/certifications/index.yaml';
import skillsYaml from '../../content/skills/index.yaml';
import socialYaml from '../../content/social/index.yaml';
import passionProjectsYaml from '../../content/passion-projects/index.yaml';

// Auto-discover case studies using import.meta.glob (now markdown files)
const caseStudyFiles = import.meta.glob('../../content/case-studies/*.md', { query: '?raw', eager: true });

// Re-export schemas for backward compatibility
export {
  ProfileSchema,
  ExperienceSchema,
  TestimonialsSchema,
  CertificationsSchema,
  SkillsSchema,
  SocialSchema,
  CaseStudySchema,
  PassionProjectsSchema,
  BlogPostSchema
};

// ------------------------------------------------------------------
// Frontmatter Parsing
// ------------------------------------------------------------------

/**
 * Parse YAML frontmatter from markdown content
 * Uses proper YAML.parse instead of brittle manual string parsing
 */
export function parseFrontmatter(raw: string): { frontmatter: Record<string, unknown>; content: string } {
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
export const passionProjectsData = validate(PassionProjectsSchema, passionProjectsYaml, 'passion-projects/index.yaml');
export const passionProjects = passionProjectsData.projects;

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
  passionProjects,
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
