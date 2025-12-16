/**
 * Variant loading and merging utilities
 *
 * Handles loading variant YAML files and merging them with base portfolio content
 */

import { VariantSchema } from './schemas';
import type { Variant, MergedProfile } from '../types/variant';
import { profile as baseProfile } from './content';

// Import all variant JSON files at build time using Vite's glob import
// We use JSON instead of YAML for easier client-side loading
const variantFiles = import.meta.glob('../../content/variants/*.json', {
  eager: false
});

/**
 * Load a specific variant by slug
 * @param slug - The variant slug (e.g., "bloomberg-senior-engineer")
 * @returns The validated variant data or null if not found
 */
export async function loadVariant(slug: string): Promise<Variant | null> {
  const filePath = `../../content/variants/${slug}.json`;

  // Check if variant exists
  const loader = variantFiles[filePath];
  if (!loader) {
    console.warn(`Variant not found: ${slug}`);
    return null;
  }

  try {
    // Dynamic import the JSON module
    const module = await loader() as { default: Variant };
    const variantData = module.default;

    // Validate against schema
    const validated = VariantSchema.parse(variantData);
    return validated;

  } catch (error) {
    console.error(`Error loading variant ${slug}:`, error);
    return null;
  }
}

/**
 * Get list of all available variant slugs
 */
export function getVariantSlugs(): string[] {
  return Object.keys(variantFiles).map(path => {
    const match = path.match(/\/([^/]+)\.yaml$/);
    return match ? match[1] : '';
  }).filter(slug => slug && !slug.startsWith('_')); // Exclude template files
}

/**
 * Merge base profile with variant overrides
 * @param variant - The variant data with overrides
 * @returns Merged profile with variant overrides applied
 */
export function mergeProfile(variant: Variant): MergedProfile {
  const merged: MergedProfile = JSON.parse(JSON.stringify(baseProfile));

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
    // NEW: Company accent for recruiter visualization
    if (variant.overrides.hero.companyAccent) {
      (merged.hero as typeof merged.hero & { companyAccent?: typeof variant.overrides.hero.companyAccent }).companyAccent = variant.overrides.hero.companyAccent;
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
  // Dynamic import to avoid circular dependency
  const { experience } = require('./content');

  if (!variant?.overrides.experience) {
    return experience;
  }

  // Create a deep copy to avoid mutating original
  const mergedExperience = JSON.parse(JSON.stringify(experience));

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

/**
 * Check if a variant exists for a given company and role
 * @param company - Company name (lowercase, hyphenated)
 * @param role - Role slug (lowercase, hyphenated)
 * @returns True if variant exists
 */
export function variantExists(company: string, role: string): boolean {
  const slug = `${company}-${role}`;
  return getVariantSlugs().includes(slug);
}
