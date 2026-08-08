
import React from "react";
import { useContent } from "../content/useContext";

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

const STYLE_EL_ID = "dynamic-dark-theme";

export default function ThemeManager({
  children,
}: {
  children: React.ReactNode;
}) {
  const { content } = useContent();
  const theme = (content?.theme as ThemeConfig) || {};

  React.useEffect(() => {
    const root = document.documentElement;

    // Light mode CSS variables (applied globally)
    if (theme.light) {
      Object.entries(theme.light).forEach(([key, value]) => {
        if (value) root.style.setProperty(`--${key}`, value);
      });
    }

    // Dark mode overrides via a <style> element so they
    // activate automatically when the .dark class is present
    if (theme.dark) {
      let styleEl = document.getElementById(STYLE_EL_ID) as HTMLStyleElement | null;
      if (!styleEl) {
        styleEl = document.createElement("style");
        styleEl.id = STYLE_EL_ID;
        document.head.appendChild(styleEl);
      }
      const darkStyles = Object.entries(theme.dark)
        .filter(([, value]) => value)
        .map(([key, value]) => `--${key}: ${value};`)
        .join(" ");
      styleEl.textContent = `.dark { ${darkStyles} }`;
    }

    // Typography tokens
    const typo = theme.typography;
    if (typo) {
      if (typo.fontFamily) root.style.setProperty("--font-family", typo.fontFamily);
      if (typo.headingWeight) root.style.setProperty("--weight-heading", typo.headingWeight);
      if (typo.bodyWeight) root.style.setProperty("--weight-body", typo.bodyWeight);
      if (typo.textScale !== undefined)
        root.style.setProperty("--text-scale", String(typo.textScale));
      if (typo.textAlign) root.style.setProperty("--text-align", typo.textAlign);
    }

    // Spacing tokens
    const spacing = theme.spacing;
    if (spacing) {
      if (spacing.spacingUnit) root.style.setProperty("--spacing-unit", spacing.spacingUnit);
      if (spacing.radius) root.style.setProperty("--radius", spacing.radius);
      if (spacing.shadowIntensity)
        root.style.setProperty("--shadow-intensity", spacing.shadowIntensity);
    }
  }, [theme]);

  return <>{children}</>;
}
