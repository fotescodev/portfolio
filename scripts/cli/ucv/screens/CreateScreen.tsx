import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import { TextInput } from '@inkjs/ui';
import { writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { spawn } from 'child_process';
import { colors, icons } from '../lib/colors.js';

interface CreateScreenProps {
  onComplete: (slug: string) => void;
  onRunPipeline: (slug: string) => void;
  onCancel: () => void;
}

type Step = 'template' | 'company' | 'role' | 'jdLink' | 'jdDescription' | 'confirm' | 'creating' | 'syncing' | 'done' | 'error';

type Template = {
  id: string;
  name: string;
  description: string;
  defaults: {
    role?: string;
    sections?: {
      beyondWork?: boolean;
      blog?: boolean;
      onchainIdentity?: boolean;
      skills?: boolean;
      passionProjects?: boolean;
    };
  };
};

const TEMPLATES: Template[] = [
  {
    id: 'blank',
    name: 'Blank',
    description: 'Start from scratch',
    defaults: {},
  },
  {
    id: 'technical-pm',
    name: 'Technical PM',
    description: 'Product Manager with engineering background',
    defaults: {
      role: 'Technical Product Manager',
      sections: { beyondWork: false, blog: true, skills: true, passionProjects: true, onchainIdentity: false },
    },
  },
  {
    id: 'senior-pm',
    name: 'Senior PM',
    description: 'Senior/Staff Product Manager',
    defaults: {
      role: 'Senior Product Manager',
      sections: { beyondWork: false, blog: true, skills: true, passionProjects: true, onchainIdentity: false },
    },
  },
  {
    id: 'crypto-pm',
    name: 'Crypto/Web3 PM',
    description: 'Product Manager in blockchain/crypto',
    defaults: {
      role: 'Product Manager',
      sections: { beyondWork: false, blog: true, skills: true, passionProjects: true, onchainIdentity: true },
    },
  },
];

function slugify(company: string, role: string): string {
  const normalize = (s: string) =>
    s.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  return `${normalize(company)}-${normalize(role)}`;
}

export function CreateScreen({ onComplete, onRunPipeline, onCancel }: CreateScreenProps) {
  const [step, setStep] = useState<Step>('template');
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [template, setTemplate] = useState<Template>(TEMPLATES[0]);
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [jdLink, setJdLink] = useState('');
  const [jdDescription, setJdDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [createdSlug, setCreatedSlug] = useState<string | null>(null);

  const slug = slugify(company, role);

  useInput((input, key) => {
    if (key.escape) {
      onCancel();
      return;
    }

    // Template selection
    if (step === 'template') {
      if (key.upArrow) {
        setSelectedTemplate(i => Math.max(0, i - 1));
      } else if (key.downArrow) {
        setSelectedTemplate(i => Math.min(TEMPLATES.length - 1, i + 1));
      } else if (key.return) {
        const selected = TEMPLATES[selectedTemplate];
        setTemplate(selected);
        if (selected.defaults.role) {
          setRole(selected.defaults.role);
        }
        setStep('company');
      }
      return;
    }

    if (step === 'confirm') {
      if (input === 'y' || key.return) {
        createVariant();
      } else if (input === 'n') {
        onCancel();
      }
    }

    if (step === 'done') {
      if (input === 'p') {
        onRunPipeline(createdSlug!);
      } else if (key.return) {
        onComplete(createdSlug!);
      }
    }

    if (step === 'error' && key.return) {
      onCancel();
    }
  });

  const handleCompanySubmit = (value: string) => {
    if (value.trim()) {
      setCompany(value.trim());
      setStep('role');
    }
  };

  const handleRoleSubmit = (value: string) => {
    if (value.trim()) {
      setRole(value.trim());
      setStep('jdLink');
    }
  };

  const handleJdLinkSubmit = (value: string) => {
    setJdLink(value.trim());
    setStep('jdDescription');
  };

  const handleJdDescriptionSubmit = (value: string) => {
    setJdDescription(value.trim());
    setStep('confirm');
  };

  const createVariant = () => {
    setStep('creating');

    try {
      const variantsDir = join(process.cwd(), 'content', 'variants');
      const targetPath = join(variantsDir, `${slug}.yaml`);

      // Check if variant already exists
      if (existsSync(targetPath)) {
        setError(`Variant already exists: ${slug}.yaml`);
        setStep('error');
        return;
      }

      // Escape and format job description for YAML
      const formattedJd = jdDescription
        ? jdDescription.split('\n').map(line => `    ${line}`).join('\n')
        : '    [Paste job description here]';

      // Get section defaults from template
      const sections = template.defaults.sections || {
        beyondWork: false,
        blog: true,
        onchainIdentity: false,
        skills: true,
        passionProjects: true,
      };

      // Create variant content
      const content = `metadata:
  slug: "${slug}"
  company: "${company}"
  role: "${role}"
  jobUrl: "${jdLink}"
  jobDescription: |
${formattedJd}
  generatedAt: "${new Date().toISOString()}"
  template: "${template.id}"

overrides:
  hero:
    status: "Open to ${role} roles"
    headline:
      - text: "${role}"
        style: "accent"
      - text: "at"
        style: "muted"
      - text: "${company}"
        style: "normal"
    subheadline: |
      [Your tailored pitch for this role]

  about:
    tagline: |
      [Professional summary tailored for ${company}]
    bio:
      - |
        [First paragraph about relevant experience]
      - |
        [Second paragraph about career journey]
    stats:
      - value: "X+"
        label: "Years Experience"
      - value: "Y"
        label: "Projects Shipped"
      - value: "Z"
        label: "Key Metric"

  sections:
    beyondWork: ${sections.beyondWork ?? false}
    blog: ${sections.blog ?? true}
    onchainIdentity: ${sections.onchainIdentity ?? false}
    skills: ${sections.skills ?? true}
    passionProjects: ${sections.passionProjects ?? true}

relevance:
  caseStudies: []
  skills: []
  projects: []
`;

      // Write the new variant
      writeFileSync(targetPath, content, 'utf-8');

      setCreatedSlug(slug);
      setStep('syncing');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setStep('error');
    }
  };

  // Auto-run sync after creating
  useEffect(() => {
    if (step !== 'syncing' || !createdSlug) return;

    const proc = spawn('npm', ['run', 'variants:sync', '--', '--slug', createdSlug, '--quiet'], {
      cwd: process.cwd(),
      shell: true,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    proc.on('close', (code) => {
      if (code === 0) {
        setStep('done');
      } else {
        setError('Sync failed. The YAML was created but JSON was not generated.');
        setStep('error');
      }
    });

    return () => {
      proc.kill();
    };
  }, [step, createdSlug]);

  const isAtOrAfterStep = (current: Step, target: Step) => {
    const order: Step[] = ['template', 'company', 'role', 'jdLink', 'jdDescription', 'confirm', 'creating', 'syncing', 'done', 'error'];
    return order.indexOf(current) >= order.indexOf(target);
  };

  return (
    <Box flexDirection="column" paddingLeft={2}>
      <Box marginBottom={1}>
        <Text bold>Create New Variant</Text>
        {template.id !== 'blank' && step !== 'template' && (
          <Text dimColor> ({template.name})</Text>
        )}
      </Box>

      {/* Template Selection */}
      {step === 'template' && (
        <Box flexDirection="column" marginBottom={1}>
          <Text dimColor marginBottom={1}>Select a template:</Text>
          {TEMPLATES.map((t, index) => (
            <Box key={t.id}>
              <Text color={index === selectedTemplate ? colors.accent : undefined}>
                {index === selectedTemplate ? icons.arrow : ' '}
              </Text>
              <Text bold={index === selectedTemplate}> {t.name}</Text>
              <Text dimColor> — {t.description}</Text>
            </Box>
          ))}
          <Box marginTop={1}>
            <Text dimColor>[↑↓] Select  [Enter] Confirm  [Esc] Cancel</Text>
          </Box>
        </Box>
      )}

      {/* Company Input */}
      {isAtOrAfterStep(step, 'company') && (
        <Box marginBottom={1}>
          <Text color={step === 'company' ? colors.accent : colors.muted}>
            {step === 'company' ? icons.arrow : company ? icons.success : icons.pending}
          </Text>
          <Text> Company: </Text>
          {step === 'company' ? (
            <TextInput
              placeholder="e.g., Stripe"
              onSubmit={handleCompanySubmit}
            />
          ) : (
            <Text bold>{company}</Text>
          )}
        </Box>
      )}

      {/* Role Input */}
      {isAtOrAfterStep(step, 'role') && (
        <Box marginBottom={1}>
          <Text color={step === 'role' ? colors.accent : role ? colors.success : colors.muted}>
            {step === 'role' ? icons.arrow : role ? icons.success : icons.pending}
          </Text>
          <Text> Role: </Text>
          {step === 'role' ? (
            <TextInput
              placeholder="e.g., Senior Product Manager"
              onSubmit={handleRoleSubmit}
            />
          ) : (
            <Text bold>{role}</Text>
          )}
        </Box>
      )}

      {/* JD Link Input */}
      {isAtOrAfterStep(step, 'jdLink') && (
        <Box marginBottom={1}>
          <Text color={step === 'jdLink' ? colors.accent : jdLink ? colors.success : colors.muted}>
            {step === 'jdLink' ? icons.arrow : jdLink ? icons.success : icons.pending}
          </Text>
          <Text> JD Link: </Text>
          {step === 'jdLink' ? (
            <TextInput
              placeholder="https://... (optional, press Enter to skip)"
              onSubmit={handleJdLinkSubmit}
            />
          ) : (
            <Text bold>{jdLink || <Text dimColor>(none)</Text>}</Text>
          )}
        </Box>
      )}

      {/* JD Description Input */}
      {isAtOrAfterStep(step, 'jdDescription') && (
        <Box marginBottom={1}>
          <Text color={step === 'jdDescription' ? colors.accent : jdDescription ? colors.success : colors.muted}>
            {step === 'jdDescription' ? icons.arrow : jdDescription ? icons.success : icons.pending}
          </Text>
          <Text> JD Description: </Text>
          {step === 'jdDescription' ? (
            <TextInput
              placeholder="Paste key requirements (optional, press Enter to skip)"
              onSubmit={handleJdDescriptionSubmit}
            />
          ) : (
            <Text bold>
              {jdDescription
                ? (jdDescription.length > 40 ? jdDescription.substring(0, 40) + '...' : jdDescription)
                : <Text dimColor>(none)</Text>
              }
            </Text>
          )}
        </Box>
      )}

      {/* Slug Preview */}
      {isAtOrAfterStep(step, 'confirm') && (
        <Box marginBottom={1}>
          <Text color={colors.muted}>{icons.info}</Text>
          <Text> Slug: </Text>
          <Text color={colors.accent}>{slug}</Text>
        </Box>
      )}

      {/* Confirm */}
      {step === 'confirm' && (
        <Box flexDirection="column" marginTop={1}>
          <Text>
            Create <Text bold color={colors.accent}>{slug}.yaml</Text>?
          </Text>
          <Box marginTop={1}>
            <Text dimColor>[y] Yes  [n] No  [Esc] Cancel</Text>
          </Box>
        </Box>
      )}

      {/* Creating */}
      {step === 'creating' && (
        <Box marginTop={1}>
          <Text color={colors.info}>{icons.running} Creating variant...</Text>
        </Box>
      )}

      {/* Syncing */}
      {step === 'syncing' && (
        <Box flexDirection="column" marginTop={1}>
          <Text color={colors.success}>{icons.success} Created YAML file</Text>
          <Text color={colors.info}>{icons.running} Syncing to JSON...</Text>
        </Box>
      )}

      {/* Done */}
      {step === 'done' && (
        <Box flexDirection="column" marginTop={1}>
          <Text color={colors.success}>
            {icons.success} Created and synced: {createdSlug}
          </Text>
          <Box marginTop={1}>
            <Text dimColor>Your variant is now live at:</Text>
          </Box>
          <Text color={colors.accent}>  /{company.toLowerCase()}/{createdSlug}</Text>
          <Box marginTop={1}>
            <Text bold>What's next?</Text>
          </Box>
          <Box marginTop={1} flexDirection="column">
            <Text>  <Text color={colors.accent}>[p]</Text> Run full pipeline <Text dimColor>(eval + redteam)</Text></Text>
            <Text>  <Text color={colors.muted}>[Enter]</Text> Go to actions <Text dimColor>(manual steps)</Text></Text>
          </Box>
          <Box marginTop={1}>
            <Text dimColor>Tip: Press 'p' to automatically evaluate and red-team your variant</Text>
          </Box>
        </Box>
      )}

      {/* Error */}
      {step === 'error' && (
        <Box flexDirection="column" marginTop={1}>
          <Text color={colors.error}>
            {icons.error} Error: {error}
          </Text>
          {/* Contextual fix suggestions */}
          <Box marginTop={1} flexDirection="column">
            {error?.includes('already exists') && (
              <>
                <Text color={colors.warning}>{icons.info} Fix: Choose a different company/role combination</Text>
                <Text dimColor>   Or delete the existing file: content/variants/{slug}.yaml</Text>
              </>
            )}
            {error?.includes('Sync failed') && (
              <>
                <Text color={colors.warning}>{icons.info} Fix: Check YAML syntax in content/variants/{createdSlug}.yaml</Text>
                <Text dimColor>   Run: npm run validate to see detailed errors</Text>
              </>
            )}
            {error?.includes('permission') && (
              <Text color={colors.warning}>{icons.info} Fix: Check file permissions in content/variants/</Text>
            )}
            {!error?.includes('already exists') && !error?.includes('Sync failed') && !error?.includes('permission') && (
              <Text color={colors.warning}>{icons.info} Try running: npm run validate for more details</Text>
            )}
          </Box>
          <Box marginTop={1}>
            <Text dimColor>[Enter] Back to dashboard</Text>
          </Box>
        </Box>
      )}

      {/* Help */}
      {['company', 'role', 'jdLink', 'jdDescription'].includes(step) && (
        <Box marginTop={2}>
          <Text dimColor>[Enter] Submit  [Esc] Cancel</Text>
        </Box>
      )}
    </Box>
  );
}
