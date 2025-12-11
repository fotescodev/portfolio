import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type Theme = 'dark' | 'light';

interface ThemeColors {
  // Backgrounds
  background: string;
  backgroundSecondary: string;
  backgroundTertiary: string;

  // Text
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textMuted: string;

  // Accent
  accent: string;
  accentHover: string;

  // UI Elements
  border: string;
  borderLight: string;

  // Special
  success: string;
  codeBackground: string;

  // Gradients & overlays
  navGradient: string;
  gridOverlay: string;
  orbAccent: string;
  orbSecondary: string;

  // Scrollbar
  scrollbarThumb: string;
  scrollbarThumbHover: string;
}

const darkColors: ThemeColors = {
  background: '#08080a',
  backgroundSecondary: '#141416',
  backgroundTertiary: '#1a1a1c',

  textPrimary: '#e8e6e3',
  textSecondary: '#a8a5a0',
  textTertiary: '#6b6966',
  textMuted: '#4a4a4c',

  accent: '#c29a6c',
  accentHover: '#d4ac7e',

  border: 'rgba(232, 230, 227, 0.1)',
  borderLight: 'rgba(232, 230, 227, 0.08)',

  success: '#4ade80',
  codeBackground: '#141416',

  navGradient: 'linear-gradient(180deg, rgba(8,8,10,1) 0%, rgba(8,8,10,0) 100%)',
  gridOverlay: 'rgba(255,255,255,0.03)',
  orbAccent: 'rgba(194, 154, 108, 0.15)',
  orbSecondary: 'rgba(74, 222, 128, 0.08)',

  scrollbarThumb: 'rgba(232, 230, 227, 0.15)',
  scrollbarThumbHover: 'rgba(232, 230, 227, 0.25)',
};

const lightColors: ThemeColors = {
  background: '#fafafa',
  backgroundSecondary: '#ffffff',
  backgroundTertiary: '#f5f5f5',

  textPrimary: '#050505', // Pure black for primary
  textSecondary: '#2a2a2c', // Darker gray
  textTertiary: '#4a4a4c', // Previous secondary
  textMuted: '#666666', // Darker muted

  accent: '#a67c52',
  accentHover: '#8a6642',

  border: 'rgba(26, 26, 28, 0.12)',
  borderLight: 'rgba(26, 26, 28, 0.08)',

  success: '#22c55e',
  codeBackground: '#f8f8f8',

  navGradient: 'linear-gradient(180deg, rgba(250,250,250,1) 0%, rgba(250,250,250,0) 100%)',
  gridOverlay: 'rgba(0,0,0,0.02)',
  orbAccent: 'rgba(166, 124, 82, 0.08)',
  orbSecondary: 'rgba(34, 197, 94, 0.05)',

  scrollbarThumb: 'rgba(26, 26, 28, 0.15)',
  scrollbarThumbHover: 'rgba(26, 26, 28, 0.25)',
};

interface ThemeContextType {
  theme: Theme;
  colors: ThemeColors;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'portfolio-theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check localStorage first
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'light' || stored === 'dark') {
        return stored;
      }
      // Check system preference
      if (window.matchMedia('(prefers-color-scheme: light)').matches) {
        return 'light';
      }
    }
    return 'dark';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, theme);

    // Update meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#08080a' : '#fafafa');
    }

    // Update body background for smooth transitions
    document.body.style.background = theme === 'dark' ? '#08080a' : '#fafafa';
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev: Theme) => prev === 'dark' ? 'light' : 'dark');
  };

  const colors = theme === 'dark' ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export type { ThemeColors, Theme };
