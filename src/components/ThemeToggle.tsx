import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  isMobile?: boolean;
}

export default function ThemeToggle({ isMobile = false }: ThemeToggleProps) {
  const { isDark, toggleTheme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={toggleTheme}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      style={{
        position: 'relative',
        width: isMobile ? '44px' : '40px',
        height: isMobile ? '44px' : '40px',
        background: 'transparent',
        border: `1px solid ${isHovered ? 'var(--color-text-tertiary)' : 'var(--color-border)'}`,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all var(--transition-medium)',
        overflow: 'hidden',
        color: 'var(--color-text-tertiary)',
      }}
    >
      {/* Sun icon */}
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          position: 'absolute',
          transition: 'all var(--transition-medium)',
          opacity: isDark ? 1 : 0,
          transform: isDark ? 'rotate(0deg) scale(1)' : 'rotate(-90deg) scale(0.5)',
        }}
      >
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>

      {/* Moon icon */}
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          position: 'absolute',
          transition: 'all var(--transition-medium)',
          opacity: isDark ? 0 : 1,
          transform: isDark ? 'rotate(90deg) scale(0.5)' : 'rotate(0deg) scale(1)',
        }}
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    </button>
  );
}
