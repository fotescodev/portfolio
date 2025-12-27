/**
 * Resume Page - Print-optimized single-page resume
 *
 * Designed for PDF export via Puppeteer.
 * Follows ATS-friendly format with:
 * - Header: Name / Role + contact
 * - Impact summary with metrics
 * - Professional experience with action → outcome bullets
 */

import { profile, experience, skills } from '../lib/content';
import './ResumePage.css';

/** Resume layout configuration - tuned for single-page fit */
const RESUME_CONFIG = {
  /** Number of skill categories to show in impact summary */
  SUMMARY_SKILL_CATEGORIES: 2,
  /** Number of skills per category in impact summary */
  SKILLS_PER_CATEGORY: 3,
  /** Number of companies to list in impact summary */
  SUMMARY_COMPANIES: 4,
  /** Maximum jobs to show - include ALL experience (6 jobs) */
  MAX_JOBS: 6,
  /** Maximum highlights per job - reduced to 2 to fit all jobs on one page */
  MAX_HIGHLIGHTS_PER_JOB: 2,
} as const;

export default function ResumePage() {
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
          {profile.about.tagline} Expertise in {topSkills} at {companies}. {statsSummary}.
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
                  {stripMarkdownLinks(highlight)}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      {/* Skills */}
      <section className="resume-skills">
        <h2 className="resume-section-title">Skills</h2>
        <p className="resume-skills-list">
          {skills.categories.map(cat => cat.skills.join(', ')).join(' | ')}
        </p>
      </section>
    </div>
  );
}

/**
 * Strip markdown links [text](url) to just text
 * Resume should be plain text for ATS compatibility
 */
function stripMarkdownLinks(text: string): string {
  return text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
}
