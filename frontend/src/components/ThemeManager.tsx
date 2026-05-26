import React from 'react';
import { useContent } from '../content/useContext';

interface ThemeConfig {
  light?: Record<string, string>;
  dark?: Record<string, string>;
  typography?: {
    fontFamily?: string;
    headingWeight?: string;
    bodyWeight?: string;
    textScale?: number;
    textAlign?: string;
  };
  spacing?: {
    spacingUnit?: string;
    radius?: string;
    shadowIntensity?: string;
  };
}

export default function ThemeManager({ children }: { children: React.ReactNode }) {
  const { content } = useContent();
  const theme = (content?.theme as ThemeConfig) || {};

  React.useEffect(() => {
    const root = document.documentElement;
    
    // Light mode variables
    if (theme.light) {
      Object.entries(theme.light).forEach(([key, value]) => {
        if (value) root.style.setProperty(`--${key}`, value);
      });
    }
    
    // Dark mode overrides – store as a style element
    if (theme.dark) {
      let styleEl = document.getElementById('dynamic-dark-theme');
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'dynamic-dark-theme';
        document.head.appendChild(styleEl);
      }
      const darkStyles = Object.entries(theme.dark)
        .filter(([_, value]) => value)
        .map(([key, value]) => `--${key}: ${value};`)
        .join(' ');
      styleEl.textContent = `.dark { ${darkStyles} }`;
    }
    
    // Typography
    if (theme.typography) {
      if (theme.typography.fontFamily) root.style.setProperty('--font-family', theme.typography.fontFamily);
      if (theme.typography.headingWeight) root.style.setProperty('--weight-heading', theme.typography.headingWeight);
      if (theme.typography.bodyWeight) root.style.setProperty('--weight-body', theme.typography.bodyWeight);
      if (theme.typography.textScale !== undefined) root.style.setProperty('--text-scale', theme.typography.textScale.toString());
      if (theme.typography.textAlign) root.style.setProperty('--text-align', theme.typography.textAlign);
    }
    
    // Spacing
    if (theme.spacing) {
      if (theme.spacing.spacingUnit) root.style.setProperty('--spacing-unit', theme.spacing.spacingUnit);
      if (theme.spacing.radius) root.style.setProperty('--radius', theme.spacing.radius);
      if (theme.spacing.shadowIntensity) root.style.setProperty('--shadow-intensity', theme.spacing.shadowIntensity);
    }
  }, [theme]);

  return <>{children}</>;
}