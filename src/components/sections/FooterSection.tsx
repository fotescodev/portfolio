import { useTheme } from '../../context/ThemeContext';

interface FooterSectionProps {
  isMobile: boolean;
}

export default function FooterSection({ isMobile }: FooterSectionProps) {
  const { isDark } = useTheme();

  return (
    <footer style={{
      padding: isMobile ? '32px 24px' : '40px 64px',
      borderTop: `1px solid ${isDark ? 'rgba(232, 230, 227, 0.06)' : 'rgba(26, 26, 28, 0.06)'}`,
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      justifyContent: 'space-between',
      alignItems: isMobile ? 'flex-start' : 'center',
      gap: '16px',
      position: 'relative',
      zIndex: 1
    }}>
      <div style={{
        fontSize: '12px',
        color: isDark ? '#3a3a3c' : '#9a9a9c',
        letterSpacing: '0.02em'
      }}>
        © 2025
      </div>
      <div style={{
        fontSize: '12px',
        color: isDark ? '#3a3a3c' : '#9a9a9c',
        fontStyle: 'italic',
        fontFamily: "'Instrument Serif', Georgia, serif"
      }}>
        Designed and built by Dmitrii
      </div>
    </footer>
  );
}
