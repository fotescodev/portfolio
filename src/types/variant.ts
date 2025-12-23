/**
 * TypeScript types for Universal CV variants
 *
 * A variant is a personalized version of the portfolio
 * tailored to a specific job description and company
 */

import { z } from 'zod';
import { VariantSchema, ProfileSchema, CaseStudySchema, PassionProjectsSchema } from '../lib/schemas';

// Infer TypeScript types from Zod schemas
export type Variant = z.infer<typeof VariantSchema>;
export type Profile = z.infer<typeof ProfileSchema>;
export type CaseStudy = z.infer<typeof CaseStudySchema>;

// Extract single project type from the PassionProjects array
type PassionProjectsType = z.infer<typeof PassionProjectsSchema>;
export type PassionProject = PassionProjectsType['projects'][number];

export type VariantMetadata = Variant['metadata'];
export type VariantOverrides = Variant['overrides'];
export type VariantRelevance = Variant['relevance'];

/**
 * Styled text segment for headlines
 */
export interface StyledTextSegment {
  text: string;
  style?: 'italic' | 'muted' | 'accent' | 'normal';
}

/**
 * Merged profile - base profile + variant overrides applied
 * Extends base Profile with optional variant-specific fields
 */
export interface MergedProfile extends Omit<Profile, 'hero'> {
  _variant?: VariantMetadata; // Track which variant is active
  hero: Profile['hero'] & {
    companyAccent?: StyledTextSegment[]; // Optional company accent for variants
  };
}

/**
 * Scored content - existing content with relevance scores
 */
export interface ScoredCaseStudy extends CaseStudy {
  _relevanceScore?: number;
  _reasoning?: string;
}

export interface ScoredProject extends PassionProject {
  _relevanceScore?: number;
  _reasoning?: string;
}

/**
 * Variant generation request (for CLI and future API)
 */
export interface VariantGenerationRequest {
  company: string;
  role: string;
  jobDescription: string;
  companyValues?: string;
  additionalContext?: string;
}

/**
 * Variant generation response (from AI)
 */
export interface VariantGenerationResponse {
  variant: Variant;
  tokensUsed?: number;
  model?: string;
  warnings?: string[];
}
