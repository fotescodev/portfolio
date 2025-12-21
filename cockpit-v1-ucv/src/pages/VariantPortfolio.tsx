/**
 * Variant Portfolio Page
 *
 * Loads a personalized portfolio variant based on URL parameters
 * Example: /bloomberg/senior-engineer
 */

import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { loadVariant, mergeProfile } from '../lib/variants';
import { VariantProvider } from '../context/VariantContext';
import Portfolio from '../components/Portfolio';
import type { Variant } from '../types/variant';
import { FEATURES } from '../config/features';

export default function VariantPortfolio() {
  const { company, role } = useParams<{ company: string; role: string }>();
  const [variant, setVariant] = useState<Variant | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function load() {
      // Feature flag: treat as not found when Universal CV is disabled.
      if (!FEATURES.ucv) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      if (!company || !role) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      // Generate slug from URL params
      const slug = `${company.toLowerCase()}-${role.toLowerCase()}`;

      try {
        const loadedVariant = await loadVariant(slug);

        if (!loadedVariant) {
          setNotFound(true);
        } else {
          // Publish gate: drafts should not be public in production.
          // In dev (vite), allow previewing drafts.
          const isPublished = loadedVariant.metadata.publishStatus === 'published';
          if (!isPublished && import.meta.env.PROD) {
            setNotFound(true);
            return;
          }
          setVariant(loadedVariant);
        }
      } catch (error) {
        console.error('Error loading variant:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [company, role]);

  if (loading) {
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

  if (notFound || !variant) {
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
