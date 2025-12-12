import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CaseStudyModal from '../components/case-study/CaseStudyModal';
import type { CaseStudy } from '../types/portfolio';

// Mock Case Study Data
const mockCaseStudy: CaseStudy = {
    id: 1,
    slug: 'test-case',
    title: 'Test Case Study',
    company: 'TestCorp',
    year: '2025',
    tags: ['Tag1', 'Tag2'],
    hook: {
        headline: 'Hook Headline',
        impactMetric: { value: '99%', label: 'Efficiency' },
        subMetrics: [{ value: '10x', label: 'Faster' }],
        thumbnail: '/test.jpg',
        thumbnailAlt: 'Test Alt'
    },
    context: {
        myRole: 'Lead PM',
        teamSize: '5 Engineers',
        duration: '3 Months',
        stakeholders: ['CEO']
    },
    problem: {
        businessContext: 'Problem Context',
        constraints: ['Time', 'Budget'],
        stakes: 'High Stakes'
    },
    approach: {
        hypothesis: 'If we do X, then Y',
        alternatives: [],
        chosenPath: 'The Path'
    },
    execution: {
        phases: [
            { name: 'Phase 1', duration: '1 week', actions: ['Action A'] }
        ],
        keyDecision: {
            title: 'Decide X',
            context: 'Context Y',
            decision: 'Chose X',
            outcome: 'Outcome Z'
        }
    },
    results: {
        primary: { metric: 'Result A', context: 'Context A' },
        qualitative: 'It was great'
    },
    reflection: {
        whatWorked: ['This'],
        whatDidnt: ['That'],
        lessonLearned: 'Always test',
        wouldDoDifferently: 'More tests'
    },
    evidence: {
        demoUrl: undefined,
        githubUrl: undefined,
        blogPostUrl: undefined,
        testimonial: undefined,
        artifacts: []
    },
    cta: {
        headline: 'Hire Me',
        subtext: undefined,
        action: 'contact',
        linkText: 'Contact'
    },
    techStack: ['React', 'TypeScript']
};

describe('CaseStudyModal Refactor', () => {
    it('renders all main sections', () => {
        render(
            <CaseStudyModal
                caseStudy={mockCaseStudy}
                allCaseStudies={[mockCaseStudy]}
                onClose={() => { }}
                onNavigate={() => { }}
                isMobile={false}
            />
        );

        // Header
        expect(screen.getByText('Back')).toBeInTheDocument();

        // Hero
        expect(screen.getByText('Test Case Study')).toBeInTheDocument();
        expect(screen.getByText('TestCorp')).toBeInTheDocument();

        // Metrics
        expect(screen.getByText('99%')).toBeInTheDocument();
        expect(screen.getByText('Efficiency')).toBeInTheDocument();

        // Narrative
        expect(screen.getByText('Problem Context')).toBeInTheDocument();
        expect(screen.getByText('High Stakes')).toBeInTheDocument();
        expect(screen.getByText('Action A')).toBeInTheDocument();

        // Results
        expect(screen.getByText('Result A')).toBeInTheDocument();

        // Reflection (Key Lesson)
        expect(screen.getByText('"Always test"')).toBeInTheDocument();

        // Footer
        expect(screen.getByText('Stack:')).toBeInTheDocument();
        expect(screen.getByText('React, TypeScript')).toBeInTheDocument();
    });
});
