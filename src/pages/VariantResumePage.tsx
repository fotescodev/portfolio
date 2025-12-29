/**
 * Variant Resume Page - Print-optimized single-page resume with variant overrides
 *
 * Designed for PDF export via Puppeteer.
 * Uses merged profile/experience from variant data.
 * Follows ATS-friendly format with:
 * - Header: Name / Role + contact
 * - Impact summary with metrics
 * - Professional experience with action → outcome bullets
 */

import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { loadVariant, mergeProfile, getExperienceWithOverrides } from '../lib/variants';
import { skills, certifications } from '../lib/content';
import type { Variant } from '../types/variant';
import type { MergedProfile } from '../types/variant';
import './ResumePage.css';

/** Resume layout configuration - tuned for single-page fit */
const RESUME_CONFIG = {
  /** Number of skill categories to show in impact summary */
  SUMMARY_SKILL_CATEGORIES: 2,
  /** Number of skills per category in impact summary */
  SKILLS_PER_CATEGORY: 3,
  /** Number of companies to list in impact summary */
  SUMMARY_COMPANIES: 4,
  /** Maximum jobs to show - include ALL experience */
  MAX_JOBS: 6,
  /** Maximum highlights per job */
  MAX_HIGHLIGHTS_PER_JOB: 3,
} as const;

/**
 * Strip markdown links [text](url) to just text
 * Resume should be plain text for ATS compatibility
 */
function stripMarkdownLinks(text: string): string {
  return text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
}

/**
 * Strip {{accent}} and {{/accent}} markers from text
 * Resume should be plain text
 */
function stripAccentMarkers(text: string): string {
  return text.replace(/\{\{accent\}\}|\{\{\/accent\}\}/g, '');
}

interface ResumeContentProps {
  profile: MergedProfile;
  experience: { jobs: Array<{ company: string; role: string; period: string; location: string; highlights: string[]; tags: string[] }> };
}

function ResumeContent({ profile, experience }: ResumeContentProps) {
  // Build impact summary from profile stats
  const statsSummary = profile.about.stats
    .map(s => `${s.value} ${s.label}`)
    .join('; ');

  // Extract top skills for summary
  const topSkills = skills.categories
    .slice(0, RESUME_CONFIG.SUMMARY_SKILL_CATEGORIES)
    .flatMap(cat => cat.skills.slice(0, RESUME_CONFIG.SKILLS_PER_CATEGORY))
    .join(', ');

  // Company names for summary
  const companies = experience.jobs
    .slice(0, RESUME_CONFIG.SUMMARY_COMPANIES)
    .map(j => j.company)
    .join(', ');

  // Clean tagline of accent markers
  const cleanTagline = stripAccentMarkers(profile.about.tagline);

  return (
    <div className="resume-page">
      {/* Header */}
      <header className="resume-header">
        <h1 className="resume-name">
          {profile.name} / <span className="resume-role-highlight">{experience.jobs[0]?.role || 'Product Manager'}</span>
        </h1>
        <p className="resume-contact">
          {profile.location} &bull; {profile.email}
        </p>
      </header>

      {/* Impact Summary */}
      <section className="resume-summary">
        <h2 className="resume-section-title">Impact / Summary / Expertise</h2>
        <p className="resume-summary-text">
          {cleanTagline} Expertise in {topSkills} at {companies}. {statsSummary}.
        </p>
      </section>

      {/* Professional Experience */}
      <section className="resume-experience">
        <h2 className="resume-section-title">Professional Experience</h2>

        {experience.jobs.slice(0, RESUME_CONFIG.MAX_JOBS).map((job) => (
          <article key={`${job.company}-${job.period}`} className="resume-job">
            <div className="resume-job-header">
              <span className="resume-company">{job.company}</span>
              {job.location && <span className="resume-location">({job.location})</span>}
              <span className="resume-period">{job.period}</span>
            </div>
            <p className="resume-job-title">{job.role}</p>
            <ul className="resume-highlights">
              {job.highlights.slice(0, RESUME_CONFIG.MAX_HIGHLIGHTS_PER_JOB).map((highlight, idx) => (
                <li key={`${job.company}-highlight-${idx}`} className="resume-highlight">
                  {stripMarkdownLinks(stripAccentMarkers(highlight))}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      {/* Skills */}
      <section className="resume-skills">
        <h2 className="resume-section-title">Skills</h2>
        <div className="resume-skills-grid">
          {skills.categories.map((cat) => (
            <div key={cat.name} className="resume-skill-category">
              <span className="resume-skill-category-name">{cat.name}:</span>{' '}
              <span className="resume-skill-category-items">{cat.skills.join(', ')}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Certifications - show featured ones */}
      {certifications.certifications.filter(c => c.featured).length > 0 && (
        <section className="resume-certifications">
          <h2 className="resume-section-title">Certifications</h2>
          <div className="resume-certifications-list">
            {certifications.certifications.filter(c => c.featured).map((cert) => (
              <div key={cert.credentialId} className="resume-certification">
                <span className="resume-certification-name">{cert.name}</span>
                <span className="resume-certification-meta">
                  {cert.issuer}{cert.instructor && ` (${cert.instructor})`} — {cert.date}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default function VariantResumePage() {
  const { company, role } = useParams<{ company: string; role: string }>();
  const [variant, setVariant] = useState<Variant | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function load() {
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
        Loading resume...
      </div>
    );
  }

  if (notFound || !variant) {
    return <Navigate to="/" replace />;
  }

  // Merge base profile with variant overrides
  const mergedProfile = mergeProfile(variant);
  const mergedExperience = getExperienceWithOverrides(variant);

  return <ResumeContent profile={mergedProfile} experience={mergedExperience} />;
}
