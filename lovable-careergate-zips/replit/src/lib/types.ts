// CareerGating Core Types
// Based on PRD: docs/prd/careergating-prd.md

export type Category = 'security' | 'tone' | 'quality' | 'format' | 'language' | 'variant';
export type Severity = 'fail' | 'warn' | 'info';
export type Confidence = 'strong' | 'moderate' | 'convention';
export type SourceType = 'peer-reviewed' | 'survey' | 'field-experiment' | 'vendor' | 'consensus';

export interface Source {
  title: string;
  authors?: string;
  year: number;
  sampleSize?: number;
  url?: string;
  type: SourceType;
}

export interface Evidence {
  confidence: Confidence;
  summary: string;
  sources: Source[];
  notes?: string;
}

export interface Finding {
  id: string;           // e.g., CG-ERR-001
  category: Category;
  severity: Severity;
  title: string;
  message: string;
  line?: number;
  column?: number;
  suggestion?: string;
  evidence: Evidence;
}

export interface ScanResult {
  content: string;
  findings: Finding[];
  summary: {
    fail: number;
    warn: number;
    info: number;
    passed: number;
  };
  score?: number;
  scannedAt: Date;
}

export interface Rule {
  id: string;
  name: string;
  category: Category;
  severity: Severity;
  evidence: Evidence;
  enabled: boolean;
  check: (content: string, context?: ScanContext) => Finding[];
}

export interface ScanContext {
  targetCompany?: string;
  region?: 'us' | 'eu' | 'uk' | 'apac';
  industry?: 'tech' | 'finance' | 'healthcare' | 'academic';
  evidenceOnly?: boolean;
}

// Evidence Database - Research backing for rules
export const EVIDENCE_DATABASE: Record<string, Evidence> = {
  'spelling-errors': {
    confidence: 'strong',
    summary: '77% of hiring managers reject resumes with typos',
    sources: [
      {
        title: 'Ghent University Recruiter Study',
        authors: 'Sterkens et al.',
        year: 2023,
        sampleSize: 445,
        type: 'peer-reviewed',
      },
      {
        title: 'CareerBuilder Survey',
        year: 2018,
        sampleSize: 2153,
        type: 'survey',
      },
    ],
  },
  'missing-metrics': {
    confidence: 'strong',
    summary: 'Quantified achievements lead to 40% more interviews',
    sources: [
      {
        title: 'LinkedIn Talent Trends',
        year: 2023,
        type: 'survey',
      },
      {
        title: 'Zety HR Statistics',
        year: 2025,
        sampleSize: 753,
        type: 'survey',
      },
    ],
  },
  'sycophancy': {
    confidence: 'moderate',
    summary: 'Excessive flattery triggers curvilinear backlash effect',
    sources: [
      {
        title: 'Ingratiation Meta-Analysis',
        authors: 'Gordon',
        year: 1996,
        sampleSize: 69, // studies
        type: 'peer-reviewed',
      },
      {
        title: 'Too Much of a Good Thing Effect',
        authors: 'Baron',
        year: 1986,
        type: 'peer-reviewed',
      },
    ],
    notes: 'Most research is on interviews, not written applications',
  },
  'buzzwords': {
    confidence: 'strong',
    summary: '73% of recruiters report buzzword fatigue',
    sources: [
      {
        title: 'CareerBuilder Annual Survey',
        year: 2023,
        type: 'survey',
      },
    ],
  },
  'credential-exposure': {
    confidence: 'strong',
    summary: 'API keys in resumes are security red flags',
    sources: [
      {
        title: 'Industry Security Consensus',
        year: 2024,
        type: 'consensus',
      },
    ],
  },
  'linkedin-profile': {
    confidence: 'moderate',
    summary: 'LinkedIn URL leads to 71% higher callback rate',
    sources: [
      {
        title: 'ResumeGo Field Experiment',
        year: 2020,
        sampleSize: 24570,
        type: 'field-experiment',
      },
    ],
  },
};
