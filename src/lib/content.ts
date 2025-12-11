/**
 * Content Loader
 *
 * This module provides type-safe access to all YAML content files.
 * Content is loaded at build time via @rollup/plugin-yaml.
 */

import type {
  Profile,
  Experience,
  Testimonials,
  Certifications,
  Skills,
  Social,
  CaseStudy,
  PortfolioContent
} from '../types/portfolio';

// Import YAML content files
import profileYaml from '../../content/profile.yaml';
import experienceYaml from '../../content/experience/index.yaml';
import testimonialsYaml from '../../content/testimonials/index.yaml';
import certificationsYaml from '../../content/certifications/index.yaml';
import skillsYaml from '../../content/skills/index.yaml';
import socialYaml from '../../content/social/index.yaml';

// Import case studies
import caseStudy01 from '../../content/case-studies/01-eth-staking.yaml';
import caseStudy02 from '../../content/case-studies/02-protocol-integration.yaml';
import caseStudy03 from '../../content/case-studies/03-xbox-royalties.yaml';
import caseStudy04 from '../../content/case-studies/04-ankr-rpc.yaml';

// Type assertions for YAML imports (using unknown intermediate for stricter checking)
export const profile = profileYaml as unknown as Profile;
export const experience = experienceYaml as unknown as Experience;
export const testimonials = testimonialsYaml as unknown as Testimonials;
export const certifications = certificationsYaml as unknown as Certifications;
export const skills = skillsYaml as unknown as Skills;
export const social = socialYaml as unknown as Social;

// Case studies array (sorted by id)
export const caseStudies: CaseStudy[] = [
  caseStudy01 as unknown as CaseStudy,
  caseStudy02 as unknown as CaseStudy,
  caseStudy03 as unknown as CaseStudy,
  caseStudy04 as unknown as CaseStudy,
].sort((a, b) => a.id - b.id);

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
export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find(cs => cs.slug === slug);
}

export function getCaseStudyById(id: number): CaseStudy | undefined {
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

// Section visibility helpers
export function isSectionVisible(section: keyof Profile['sections']): boolean {
  return profile.sections[section];
}

export default content;
