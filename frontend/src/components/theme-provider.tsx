import * as React from "react";

export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  resolvedTheme: "light",
  setTheme: () => {},
};

const ThemeContext = React.createContext<ThemeProviderState>(initialState);

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function resolveTheme(theme: Theme): ResolvedTheme {
  return theme === "system" ? getSystemTheme() : (theme as ResolvedTheme);
}

/**
 * Applies the resolved theme to <html>.
 * Nb: On first paint the index.html inline script has already done this.
 * This function keeps React's state in sync with subsequent user-driven changes.
 */
function applyTheme(resolved: ResolvedTheme): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  // Only touch the DOM when something actually changed — avoids repaints
  const alreadyCorrect = root.classList.contains(resolved);
  if (!alreadyCorrect) {
    root.classList.remove("light", "dark");
    root.classList.add(resolved);
  }
  root.setAttribute("data-theme", resolved);
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
}: ThemeProviderProps) {
  /**
   * Read the stored preference. Falls back to defaultTheme.
   * We deliberately do NOT call applyTheme here because the
   * index.html blocking script already set the correct class —
   * calling it again would be a no-op at best, a flash at worst.
   */
  const getInitialTheme = (): Theme => {
    if (typeof window === "undefined") return defaultTheme;
    try {
      const stored = localStorage.getItem(storageKey) as Theme | null;
      if (stored === "light" || stored === "dark" || stored === "system") {
        return stored;
      }
    } catch {}
    return defaultTheme;
  };

  const [theme, setThemeState] = React.useState<Theme>(getInitialTheme);

  /**
   * Derive initial resolvedTheme from the DOM class that the
   * inline script already set — this is always accurate.
   */
  const [resolvedTheme, setResolvedTheme] = React.useState<ResolvedTheme>(
    () => {
      if (typeof document !== "undefined") {
        return document.documentElement.classList.contains("dark")
          ? "dark"
          : "light";
      }
      return resolveTheme(getInitialTheme());
    }
  );

  // When the user explicitly changes theme, persist + apply
  React.useEffect(() => {
    const resolved = resolveTheme(theme);
    setResolvedTheme(resolved);
    applyTheme(resolved);
    try {
      localStorage.setItem(storageKey, theme);
    } catch {}
  }, [theme, storageKey]);

  // Track OS-level preference changes when theme === "system"
  React.useEffect(() => {
    if (theme !== "system") return;
    if (typeof window === "undefined") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const handler = (e: MediaQueryListEvent | MediaQueryList) => {
      const resolved: ResolvedTheme = (e as MediaQueryListEvent).matches
        ? "dark"
        : "light";
      setResolvedTheme(resolved);
      applyTheme(resolved);
    };

    // Modern browsers
    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", handler as (e: MediaQueryListEvent) => void);
    } else if (typeof (media as any).addListener === "function") {
      // Legacy Safari / IE fallback
      (media as any).addListener(handler);
    }

    return () => {
      if (typeof media.removeEventListener === "function") {
        media.removeEventListener("change", handler as (e: MediaQueryListEvent) => void);
      } else if (typeof (media as any).removeListener === "function") {
        (media as any).removeListener(handler);
      }
    };
  }, [theme]);

  const value: ThemeProviderState = {
    theme,
    resolvedTheme,
    setTheme: setThemeState,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeProviderState {
  return React.useContext(ThemeContext);
}

