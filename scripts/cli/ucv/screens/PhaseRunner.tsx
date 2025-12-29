import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import { spawn } from 'child_process';
import { colors, icons } from '../lib/colors.js';

type Phase = 'sync' | 'eval' | 'redteam' | 'pipeline';

interface PhaseRunnerProps {
  slug: string;
  phase: Phase;
  onComplete: () => void;
  onBack: () => void;
}

interface PhaseConfig {
  label: string;
  command: string;
  args: string[];
}

function getPhaseConfig(phase: Phase, slug: string): PhaseConfig[] {
  const configs: Record<Phase, PhaseConfig[]> = {
    sync: [
      { label: 'Sync', command: 'npm', args: ['run', 'variants:sync', '--', '--slug', slug, '--quiet'] },
    ],
    eval: [
      { label: 'Evaluate', command: 'npm', args: ['run', 'eval:variant', '--', '--slug', slug] },
    ],
    redteam: [
      { label: 'Red Team', command: 'npm', args: ['run', 'redteam:variant', '--', '--slug', slug] },
    ],
    pipeline: [
      { label: 'Sync', command: 'npm', args: ['run', 'variants:sync', '--', '--slug', slug, '--quiet'] },
      { label: 'Evaluate', command: 'npm', args: ['run', 'eval:variant', '--', '--slug', slug] },
      { label: 'Red Team', command: 'npm', args: ['run', 'redteam:variant', '--', '--slug', slug] },
    ],
  };
  return configs[phase];
}

interface StepStatus {
  label: string;
  status: 'pending' | 'running' | 'success' | 'error';
  output: string[];
}

export function PhaseRunner({ slug, phase, onComplete, onBack }: PhaseRunnerProps) {
  const phases = React.useMemo(() => getPhaseConfig(phase, slug), [phase, slug]);
  const [steps, setSteps] = useState<StepStatus[]>(
    phases.map(p => ({ label: p.label, status: 'pending', output: [] }))
  );
  const [currentStep, setCurrentStep] = useState(0);
  const [done, setDone] = useState(false);
  const [hasError, setHasError] = useState(false);

  useInput((input, key) => {
    if (done && (key.return || key.escape)) {
      onComplete();
    } else if (key.escape && !done) {
      // TODO: Could add cancellation support
    }
  });

  useEffect(() => {
    if (currentStep >= phases.length) {
      setDone(true);
      return;
    }

    const phaseConfig = phases[currentStep];

    // Mark as running
    setSteps(prev => {
      const next = [...prev];
      next[currentStep] = { ...next[currentStep], status: 'running' };
      return next;
    });

    const proc = spawn(phaseConfig.command, phaseConfig.args, {
      cwd: process.cwd(),
      shell: true,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    const output: string[] = [];

    proc.stdout?.on('data', (data: Buffer) => {
      const lines = data.toString().split('\n').filter(Boolean);
      output.push(...lines);
      setSteps(prev => {
        const next = [...prev];
        next[currentStep] = { ...next[currentStep], output: [...output].slice(-5) };
        return next;
      });
    });

    proc.stderr?.on('data', (data: Buffer) => {
      const lines = data.toString().split('\n').filter(Boolean);
      output.push(...lines);
      setSteps(prev => {
        const next = [...prev];
        next[currentStep] = { ...next[currentStep], output: [...output].slice(-5) };
        return next;
      });
    });

    proc.on('close', (code) => {
      const success = code === 0;
      setSteps(prev => {
        const next = [...prev];
        next[currentStep] = {
          ...next[currentStep],
          status: success ? 'success' : 'error',
        };
        return next;
      });

      if (success) {
        setCurrentStep(prev => prev + 1);
      } else {
        setHasError(true);
        setDone(true);
      }
    });

    return () => {
      proc.kill();
    };
  }, [currentStep, phases]);

  const phaseLabel = phase === 'pipeline' ? 'Pipeline' : phases[0]?.label || phase;

  return (
    <Box flexDirection="column" paddingLeft={2}>
      <Box marginBottom={1}>
        <Text bold>Running: </Text>
        <Text color={colors.accent}>{phaseLabel}</Text>
        <Text dimColor> for </Text>
        <Text bold>{slug}</Text>
      </Box>

      {/* Progress */}
      <Box marginBottom={1}>
        <ProgressBar current={currentStep} total={phases.length} done={done} hasError={hasError} />
      </Box>

      {/* Steps */}
      {steps.map((step, index) => (
        <StepRow key={index} step={step} />
      ))}

      {/* Footer */}
      <Box marginTop={2}>
        {done ? (
          <Text dimColor>
            {hasError ? '[Enter/Esc] Return to dashboard' : '[Enter/Esc] Done - return to dashboard'}
          </Text>
        ) : (
          <Text dimColor>Running...</Text>
        )}
      </Box>
    </Box>
  );
}

function ProgressBar({ current, total, done, hasError }: { current: number; total: number; done: boolean; hasError: boolean }) {
  const width = 40;
  const percent = done ? 100 : Math.round((current / total) * 100);
  const filled = Math.round((percent / 100) * width);
  const empty = width - filled;

  const barColor = hasError ? colors.error : colors.success;

  return (
    <Text>
      <Text color={barColor}>{'█'.repeat(filled)}</Text>
      <Text dimColor>{'░'.repeat(empty)}</Text>
      <Text> {percent}%</Text>
    </Text>
  );
}

function StepRow({ step }: { step: StepStatus }) {
  const iconMap = {
    pending: { icon: icons.pending, color: colors.muted },
    running: { icon: icons.running, color: colors.info },
    success: { icon: icons.success, color: colors.success },
    error: { icon: icons.error, color: colors.error },
  };
  const { icon, color } = iconMap[step.status];

  return (
    <Box flexDirection="column">
      <Box>
        <Text color={color}>{icon} </Text>
        <Text bold={step.status === 'running'}>{step.label}</Text>
        {step.status === 'running' && (
          <Text dimColor> ...</Text>
        )}
      </Box>
      {step.status === 'running' && step.output.length > 0 && (
        <Box flexDirection="column" paddingLeft={3}>
          {step.output.slice(-3).map((line, i) => (
            <Text key={i} dimColor>{line.substring(0, 70)}</Text>
          ))}
        </Box>
      )}
    </Box>
  );
}
