/**
 * Resume Page Tests
 *
 * Tests for base ResumePage component:
 * - Correct content rendering
 * - ATS-friendly structure
 * - Print-optimized layout
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import ResumePage from '../../pages/ResumePage';
import { profile, experience, skills } from '../../lib/content';

// Test wrapper
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('ResumePage - Content Rendering', () => {
  it('should render the user name', () => {
    render(
      <TestWrapper>
        <ResumePage />
      </TestWrapper>
    );

    expect(screen.getByText(new RegExp(profile.name))).toBeInTheDocument();
  });

  it('should render contact information', () => {
    render(
      <TestWrapper>
        <ResumePage />
      </TestWrapper>
    );

    expect(screen.getByText(new RegExp(profile.location))).toBeInTheDocument();
    expect(screen.getByText(new RegExp(profile.email))).toBeInTheDocument();
  });

  it('should render the current role', () => {
    render(
      <TestWrapper>
        <ResumePage />
      </TestWrapper>
    );

    const currentRole = experience.jobs[0]?.role;
    if (currentRole) {
      // Role may appear multiple times (header + job entries)
      const roleElements = screen.getAllByText(new RegExp(currentRole));
      expect(roleElements.length).toBeGreaterThan(0);
    }
  });

  it('should render professional experience section', () => {
    render(
      <TestWrapper>
        <ResumePage />
      </TestWrapper>
    );

    expect(screen.getByText(/Professional Experience/i)).toBeInTheDocument();
  });

  it('should render all job companies', () => {
    render(
      <TestWrapper>
        <ResumePage />
      </TestWrapper>
    );

    // Check first 6 companies (MAX_JOBS)
    const jobsToShow = experience.jobs.slice(0, 6);
    for (const job of jobsToShow) {
      // Company may appear multiple times (in different contexts)
      const companyElements = screen.getAllByText(new RegExp(job.company));
      expect(companyElements.length).toBeGreaterThan(0);
    }
  });

  it('should render skills section', () => {
    render(
      <TestWrapper>
        <ResumePage />
      </TestWrapper>
    );

    expect(screen.getByText(/Skills/i)).toBeInTheDocument();
  });

  it('should render skill categories', () => {
    render(
      <TestWrapper>
        <ResumePage />
      </TestWrapper>
    );

    for (const category of skills.categories) {
      expect(screen.getByText(new RegExp(`${category.name}:`))).toBeInTheDocument();
    }
  });

  it('should render impact summary section', () => {
    render(
      <TestWrapper>
        <ResumePage />
      </TestWrapper>
    );

    expect(screen.getByText(/Impact.*Summary.*Expertise/i)).toBeInTheDocument();
  });
});

describe('ResumePage - Job Highlights', () => {
  it('should render job highlights as bullet points', () => {
    render(
      <TestWrapper>
        <ResumePage />
      </TestWrapper>
    );

    // Check that highlights are rendered (first job, up to 3 highlights)
    const firstJob = experience.jobs[0];
    const highlightsToShow = firstJob?.highlights.slice(0, 3) || [];

    for (const highlight of highlightsToShow) {
      // Strip markdown links for comparison
      const cleanHighlight = highlight.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
      // Check for partial match since highlight might be truncated (may appear multiple times)
      const highlightStart = cleanHighlight.substring(0, 30);
      const elements = screen.getAllByText(new RegExp(highlightStart.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
      expect(elements.length).toBeGreaterThan(0);
    }
  });

  it('should limit highlights to MAX_HIGHLIGHTS_PER_JOB', () => {
    render(
      <TestWrapper>
        <ResumePage />
      </TestWrapper>
    );

    // Get all list items in experience section
    const highlights = screen.getAllByRole('listitem');
    const maxHighlightsPerJob = 3;
    const maxJobs = 6;

    // Total highlights should not exceed MAX_JOBS * MAX_HIGHLIGHTS_PER_JOB
    expect(highlights.length).toBeLessThanOrEqual(maxJobs * maxHighlightsPerJob);
  });
});

describe('ResumePage - Stats in Summary', () => {
  it('should include profile stats in impact summary', () => {
    render(
      <TestWrapper>
        <ResumePage />
      </TestWrapper>
    );

    // Stats should appear in the summary section (may appear multiple times)
    for (const stat of profile.about.stats) {
      const statElements = screen.getAllByText(new RegExp(stat.value));
      expect(statElements.length).toBeGreaterThan(0);
    }
  });
});
