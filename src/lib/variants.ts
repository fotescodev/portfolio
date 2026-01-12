/**
 * Variant loading and merging utilities
 *
 * Handles loading variants from Convex and merging them with base portfolio content
 */

import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { Variant, MergedProfile } from '../types/variant';
import { profile as baseProfile, experience as baseExperience } from './content';

/**
 * Hook to load a variant from Convex by slug
 * @param slug - The variant slug (e.g., "bloomberg-senior-engineer")
 * @returns { data, isLoading } - Variant data or null, and loading state
 *
 * Note: Data is validated with Zod on write (in generate.ts and CLI).
 * We trust Convex data on read to avoid redundant validation overhead.
 */
export function useVariant(slug: string): {
  data: Variant | null;
  isLoading: boolean;
} {
  const result = useQuery(api.variants.getBySlug, { slug });

  // result is undefined while loading, null if not found, or the data
  if (result === undefined) {
    return { data: null, isLoading: true };
  }

  if (result === null) {
    return { data: null, isLoading: false };
  }

  // Data was validated on write - trust it on read
  return { data: result as Variant, isLoading: false };
}


/**
 * Merge base profile with variant overrides
 * @param variant - The variant data with overrides
 * @returns Merged profile with variant overrides applied
 */
export function mergeProfile(variant: Variant): MergedProfile {
  const merged: MergedProfile = structuredClone(baseProfile);

  // Apply variant metadata
  merged._variant = variant.metadata;

  // Apply hero overrides
  // NOTE: headline is preserved (signature branding), companyAccent adds context
  if (variant.overrides.hero) {
    if (variant.overrides.hero.status) {
      merged.hero.status = variant.overrides.hero.status;
    }
    // Only override headline if explicitly provided (discouraged - use companyAccent instead)
    if (variant.overrides.hero.headline) {
      merged.hero.headline = variant.overrides.hero.headline;
    }
    if (variant.overrides.hero.subheadline) {
      merged.hero.subheadline = variant.overrides.hero.subheadline;
    }
    // Company accent for recruiter visualization (e.g., "— with Galaxy")
    if (variant.overrides.hero.companyAccent) {
      merged.hero.companyAccent = variant.overrides.hero.companyAccent;
    }
  }

  // Apply about overrides
  if (variant.overrides.about) {
    if (variant.overrides.about.tagline) {
      merged.about.tagline = variant.overrides.about.tagline;
    }
    if (variant.overrides.about.bio) {
      merged.about.bio = variant.overrides.about.bio;
    }
    if (variant.overrides.about.stats) {
      merged.about.stats = variant.overrides.about.stats;
    }
  }

  // Apply section visibility overrides
  if (variant.overrides.sections) {
    merged.sections = {
      ...merged.sections,
      ...variant.overrides.sections
    };
  }

  return merged;
}

/**
 * Get experience with variant overrides applied
 * @param variant - The variant data (or null for base)
 * @returns Experience data with any variant overrides merged
 */
export function getExperienceWithOverrides(variant: Variant | null) {
  if (!variant?.overrides.experience) {
    return baseExperience;
  }

  // Create a deep copy to avoid mutating original
  const mergedExperience = structuredClone(baseExperience);

  // Apply experience overrides by matching company name
  for (const override of variant.overrides.experience) {
    const jobIndex = mergedExperience.jobs.findIndex(
      (job: { company: string }) => job.company.toLowerCase() === override.company.toLowerCase()
    );

    if (jobIndex !== -1) {
      if (override.highlights) {
        mergedExperience.jobs[jobIndex].highlights = override.highlights;
      }
      if (override.tags) {
        mergedExperience.jobs[jobIndex].tags = override.tags;
      }
    }
  }

  return mergedExperience;
}

