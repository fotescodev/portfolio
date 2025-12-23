// CareerGating Scanner Engine
import type { Rule, Finding, ScanResult, ScanContext } from './types';
import { EVIDENCE_DATABASE } from './types';

// =============================================================================
// RULE IMPLEMENTATIONS
// =============================================================================

// CG-SEC-001: Credential Exposure
const credentialRule: Rule = {
  id: 'CG-SEC-001',
  name: 'Credential Exposure',
  category: 'security',
  severity: 'fail',
  evidence: EVIDENCE_DATABASE['credential-exposure'],
  enabled: true,
  check(content: string): Finding[] {
    const findings: Finding[] = [];
    const lines = content.split('\n');

    const patterns = [
      { name: 'OpenAI API key', re: /\bsk-[A-Za-z0-9]{20,}\b/g },
      { name: 'GitHub token', re: /\bghp_[A-Za-z0-9]{30,}\b/g },
      { name: 'AWS Access Key', re: /\bAKIA[0-9A-Z]{16}\b/g },
      { name: 'Generic API key', re: /\b(api[_-]?key|apikey)\s*[:=]\s*['"][^'"]{10,}['"]/gi },
      { name: 'Private key', re: /-----BEGIN\s+(RSA\s+)?PRIVATE\s+KEY-----/g },
    ];

    lines.forEach((line, lineIndex) => {
      patterns.forEach(({ name, re }) => {
        re.lastIndex = 0;
        const match = re.exec(line);
        if (match) {
          findings.push({
            id: this.id,
            category: this.category,
            severity: this.severity,
            title: `${name} detected`,
            message: `Found what appears to be a ${name.toLowerCase()} in your resume`,
            line: lineIndex + 1,
            suggestion: 'Remove all credentials and secrets from your resume immediately',
            evidence: this.evidence,
          });
        }
      });
    });

    return findings;
  },
};

// CG-TONE-001: Sycophancy Detection
const sycophancyRule: Rule = {
  id: 'CG-TONE-001',
  name: 'Sycophancy Detection',
  category: 'tone',
  severity: 'warn',
  evidence: EVIDENCE_DATABASE['sycophancy'],
  enabled: true,
  check(content: string): Finding[] {
    const findings: Finding[] = [];
    const lines = content.split('\n');

    const patterns = [
      { re: /\b(thrilled|honored|excited)\s+to\s+(join|apply|work)/gi, term: 'excessive enthusiasm' },
      { re: /\bdream\s+(job|company|role|opportunity)/gi, term: 'dream job language' },
      { re: /\blong\s+admired/gi, term: '"long admired"' },
      { re: /\bprivileged?\s+to/gi, term: 'privileged language' },
      { re: /\bpassionate\s+about\s+your\s+(mission|company)/gi, term: 'excessive passion' },
    ];

    lines.forEach((line, lineIndex) => {
      patterns.forEach(({ re, term }) => {
        re.lastIndex = 0;
        const match = re.exec(line);
        if (match) {
          findings.push({
            id: this.id,
            category: this.category,
            severity: this.severity,
            title: 'Sycophantic language detected',
            message: `"${match[0]}" - ${term} may signal desperation`,
            line: lineIndex + 1,
            suggestion: 'Replace with specific, factual interest in the role or remove entirely',
            evidence: this.evidence,
          });
        }
      });
    });

    return findings;
  },
};

// CG-LNG-001: Buzzword Detection
const buzzwordRule: Rule = {
  id: 'CG-LNG-001',
  name: 'Buzzword Fatigue',
  category: 'language',
  severity: 'warn',
  evidence: EVIDENCE_DATABASE['buzzwords'],
  enabled: true,
  check(content: string): Finding[] {
    const findings: Finding[] = [];
    const lines = content.split('\n');

    const buzzwords = [
      'synergy', 'leverage', 'dynamic', 'proactive', 'guru', 'ninja',
      'rockstar', 'thought leader', 'paradigm', 'disrupt', 'pivot',
      'game-changer', 'move the needle', 'circle back', 'bandwidth',
      'deep dive', 'low-hanging fruit', 'best-in-class', 'world-class',
    ];

    const buzzwordRe = new RegExp(`\\b(${buzzwords.join('|')})\\b`, 'gi');

    lines.forEach((line, lineIndex) => {
      buzzwordRe.lastIndex = 0;
      let match;
      while ((match = buzzwordRe.exec(line)) !== null) {
        findings.push({
          id: this.id,
          category: this.category,
          severity: this.severity,
          title: 'Buzzword detected',
          message: `"${match[0]}" is overused and may cause recruiter fatigue`,
          line: lineIndex + 1,
          suggestion: 'Replace with specific, measurable language',
          evidence: this.evidence,
        });
      }
    });

    return findings;
  },
};

// CG-LNG-002: Weak Verbs
const weakVerbRule: Rule = {
  id: 'CG-LNG-002',
  name: 'Weak Verb Detection',
  category: 'language',
  severity: 'warn',
  evidence: {
    confidence: 'moderate',
    summary: 'Vague verbs dilute impact and hide achievements',
    sources: [{ title: 'Industry Consensus', year: 2024, type: 'consensus' }],
  },
  enabled: true,
  check(content: string): Finding[] {
    const findings: Finding[] = [];
    const lines = content.split('\n');

    const patterns = [
      { re: /\bresponsible\s+for\b/gi, suggestion: 'Led', 'Managed', or 'Owned' },
      { re: /\bhelped\s+(with|to)\b/gi, suggestion: 'Contributed to' or specific action },
      { re: /\bassisted\s+(in|with)\b/gi, suggestion: 'Supported' or specific contribution },
      { re: /\bworked\s+on\b/gi, suggestion: 'Built', 'Developed', or 'Shipped' },
      { re: /\bwas\s+involved\s+in\b/gi, suggestion: 'Drove', 'Executed', or specific role },
    ];

    lines.forEach((line, lineIndex) => {
      patterns.forEach(({ re }) => {
        re.lastIndex = 0;
        const match = re.exec(line);
        if (match) {
          findings.push({
            id: this.id,
            category: this.category,
            severity: this.severity,
            title: 'Weak verb detected',
            message: `"${match[0]}" is vague and hides your actual contribution`,
            line: lineIndex + 1,
            suggestion: 'Replace with a strong action verb that shows ownership',
            evidence: this.evidence,
          });
        }
      });
    });

    return findings;
  },
};

// CG-QNT-001: Low Quantification
const quantificationRule: Rule = {
  id: 'CG-QNT-001',
  name: 'Low Quantification',
  category: 'quality',
  severity: 'warn',
  evidence: EVIDENCE_DATABASE['missing-metrics'],
  enabled: true,
  check(content: string): Finding[] {
    const findings: Finding[] = [];
    const lines = content.split('\n');

    // Find bullet points (lines starting with -, *, •, or numbers)
    const bulletLines = lines.filter(line => /^\s*[-*•]\s|^\s*\d+\.\s/.test(line));

    if (bulletLines.length === 0) return findings;

    // Check for numbers/metrics in bullets
    const metricsRe = /\d+%|\$[\d,]+|\d+x|\d{2,}|\d+\s*(users|customers|clients|people|teams|projects|products)/i;
    const quantifiedBullets = bulletLines.filter(line => metricsRe.test(line));

    const ratio = quantifiedBullets.length / bulletLines.length;

    if (ratio < 0.5) {
      findings.push({
        id: this.id,
        category: this.category,
        severity: this.severity,
        title: 'Low quantification in achievements',
        message: `Only ${Math.round(ratio * 100)}% of bullet points contain metrics (${quantifiedBullets.length}/${bulletLines.length})`,
        suggestion: 'Add numbers, percentages, dollar amounts, or user counts to more bullet points',
        evidence: this.evidence,
      });
    }

    return findings;
  },
};

// CG-LNK-001: Missing LinkedIn
const linkedinRule: Rule = {
  id: 'CG-LNK-001',
  name: 'Missing LinkedIn',
  category: 'format',
  severity: 'info',
  evidence: EVIDENCE_DATABASE['linkedin-profile'],
  enabled: true,
  check(content: string): Finding[] {
    const findings: Finding[] = [];

    if (!/linkedin\.com\/in\//i.test(content)) {
      findings.push({
        id: this.id,
        category: this.category,
        severity: this.severity,
        title: 'No LinkedIn URL found',
        message: 'Including a LinkedIn profile URL increases callback rates',
        suggestion: 'Add your LinkedIn profile URL to your contact information',
        evidence: this.evidence,
      });
    }

    return findings;
  },
};

// =============================================================================
// RULE REGISTRY
// =============================================================================

const ALL_RULES: Rule[] = [
  credentialRule,
  sycophancyRule,
  buzzwordRule,
  weakVerbRule,
  quantificationRule,
  linkedinRule,
];

// =============================================================================
// SCANNER ENGINE
// =============================================================================

export function scan(content: string, context?: ScanContext): ScanResult {
  const findings: Finding[] = [];

  const activeRules = ALL_RULES.filter(rule => {
    if (!rule.enabled) return false;
    if (context?.evidenceOnly && rule.evidence.confidence === 'convention') return false;
    return true;
  });

  for (const rule of activeRules) {
    const ruleFindings = rule.check(content, context);
    findings.push(...ruleFindings);
  }

  // Sort by severity (fail > warn > info) then by line number
  const severityOrder = { fail: 0, warn: 1, info: 2 };
  findings.sort((a, b) => {
    const severityDiff = severityOrder[a.severity] - severityOrder[b.severity];
    if (severityDiff !== 0) return severityDiff;
    return (a.line ?? 0) - (b.line ?? 0);
  });

  const summary = {
    fail: findings.filter(f => f.severity === 'fail').length,
    warn: findings.filter(f => f.severity === 'warn').length,
    info: findings.filter(f => f.severity === 'info').length,
    passed: activeRules.length - new Set(findings.map(f => f.id)).size,
  };

  // Calculate score (0-100)
  const totalPenalty = summary.fail * 20 + summary.warn * 5 + summary.info * 1;
  const score = Math.max(0, 100 - totalPenalty);

  return {
    content,
    findings,
    summary,
    score,
    scannedAt: new Date(),
  };
}

export { ALL_RULES };
