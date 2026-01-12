/**
 * Variant Portfolio Page
 *
 * Loads a personalized portfolio variant based on URL parameters
 * Example: /bloomberg/senior-engineer
 */

import { useParams, Navigate } from 'react-router-dom';
import { useVariant, mergeProfile } from '../lib/variants';
import { VariantProvider } from '../context/VariantContext';
import Portfolio from '../components/Portfolio';

export default function VariantPortfolio() {
  const { company, role } = useParams<{ company: string; role: string }>();

  // Generate slug from URL params
  const slug = company && role ? `${company.toLowerCase()}-${role.toLowerCase()}` : '';

  // Load variant from Convex using hook
  const { data: variant, isLoading } = useVariant(slug);

  // Handle missing params
  if (!company || !role) {
    return <Navigate to="/" replace />;
  }

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        fontFamily: 'system-ui, sans-serif',
        color: 'var(--color-text-primary)'
      }}>
        Loading personalized portfolio...
      </div>
    );
  }

  if (!variant) {
    return <Navigate to="/" replace />;
  }

  // Merge base profile with variant overrides
  const mergedProfile = mergeProfile(variant);

  return (
    <VariantProvider profile={mergedProfile} variant={variant}>
      <Portfolio />
    </VariantProvider>
  );
}
