import React, { useState } from 'react';
import { Box, useApp, useInput } from 'ink';
import { Header } from './components/Header.js';
import { Dashboard } from './screens/Dashboard.js';
import { VariantActions } from './screens/VariantActions.js';
import { PhaseRunner } from './screens/PhaseRunner.js';
import { CreateScreen } from './screens/CreateScreen.js';
import { IssuesScreen } from './screens/IssuesScreen.js';

export type Screen =
  | { type: 'dashboard' }
  | { type: 'create' }
  | { type: 'actions'; slug: string }
  | { type: 'issues'; slug: string }
  | { type: 'running'; slug: string; phase: 'sync' | 'eval' | 'redteam' | 'pipeline' };

export function App() {
  const { exit } = useApp();
  const [screen, setScreen] = useState<Screen>({ type: 'dashboard' });

  // Global quit handler
  useInput((input, key) => {
    if (input === 'q' && screen.type === 'dashboard') {
      exit();
    }
  });

  const navigateTo = (newScreen: Screen) => {
    setScreen(newScreen);
  };

  const goBack = () => {
    if (screen.type === 'actions') {
      setScreen({ type: 'dashboard' });
    } else if (screen.type === 'running') {
      setScreen({ type: 'actions', slug: screen.slug });
    }
  };

  const getSubtitle = () => {
    switch (screen.type) {
      case 'dashboard':
        return 'Quality Pipeline';
      case 'create':
        return 'Create Variant';
      case 'actions':
        return screen.slug;
      case 'issues':
        return `Issues: ${screen.slug}`;
      case 'running':
        return `Running ${screen.phase}`;
      default:
        return 'Quality Pipeline';
    }
  };

  return (
    <Box flexDirection="column">
      <Header subtitle={getSubtitle()} />

      {screen.type === 'dashboard' && (
        <Dashboard
          onSelectVariant={(slug) => navigateTo({ type: 'actions', slug })}
          onCreate={() => navigateTo({ type: 'create' })}
        />
      )}

      {screen.type === 'create' && (
        <CreateScreen
          onComplete={(slug) => navigateTo({ type: 'actions', slug })}
          onRunPipeline={(slug) => navigateTo({ type: 'running', slug, phase: 'pipeline' })}
          onCancel={() => navigateTo({ type: 'dashboard' })}
        />
      )}

      {screen.type === 'actions' && (
        <VariantActions
          slug={screen.slug}
          onRunPhase={(phase) => navigateTo({ type: 'running', slug: screen.slug, phase })}
          onViewIssues={() => navigateTo({ type: 'issues', slug: screen.slug })}
          onBack={goBack}
        />
      )}

      {screen.type === 'issues' && (
        <IssuesScreen
          slug={screen.slug}
          onBack={() => navigateTo({ type: 'actions', slug: screen.slug })}
        />
      )}

      {screen.type === 'running' && (
        <PhaseRunner
          slug={screen.slug}
          phase={screen.phase}
          onComplete={() => navigateTo({ type: 'dashboard' })}
          onBack={goBack}
        />
      )}
    </Box>
  );
}
