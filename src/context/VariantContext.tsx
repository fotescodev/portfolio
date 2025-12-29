/**
 * Variant Context - Provides personalized portfolio data
 *
 * This context wraps the portfolio and injects either:
 * - Base profile (default portfolio)
 * - Merged profile (base + variant overrides for specific jobs)
 */

import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { Variant, MergedProfile, Profile } from '../types/variant';

interface VariantContextType {
  profile: Profile | MergedProfile;
  variant: Variant | null;
  isVariant: boolean;
  /** Returns the appropriate resume URL based on variant context */
  getResumeUrl: () => string;
}

const VariantContext = createContext<VariantContextType | undefined>(undefined);

interface VariantProviderProps {
  children: ReactNode;
  profile: Profile | MergedProfile;
  variant?: Variant | null;
}

export function VariantProvider({ children, profile, variant = null }: VariantProviderProps) {
  const getResumeUrl = (): string => {
    if (variant) {
      // Convert slug "cursor-tam" to URL path "cursor/tam"
      const slugParts = variant.metadata.slug.split('-');
      const urlPath = `${slugParts[0]}/${slugParts.slice(1).join('-')}`;
      return `/${urlPath}/resume`;
    }
    return '/resume';
  };

  const value: VariantContextType = {
    profile,
    variant,
    isVariant: variant !== null,
    getResumeUrl
  };

  return (
    <VariantContext.Provider value={value}>
      {children}
    </VariantContext.Provider>
  );
}

export function useVariant() {
  const context = useContext(VariantContext);
  if (context === undefined) {
    throw new Error('useVariant must be used within a VariantProvider');
  }
  return context;
}

/**
 * Safe hook for components that may be used outside VariantProvider.
 * Returns default values when no context is available.
 */
export function useVariantSafe() {
  const context = useContext(VariantContext);
  if (context === undefined) {
    return {
      profile: null,
      variant: null,
      isVariant: false,
      getResumeUrl: () => '/resume'
    };
  }
  return context;
}
