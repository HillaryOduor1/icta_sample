// frontend/src/components/theme-provider.tsx
"use client";

import * as React from "react";

type Theme = "light" | "dark" | "system";

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
}

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "light" | "dark";
}

const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, defaultTheme = "system" }) => {
  const [theme, setTheme] = React.useState<Theme>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("theme") as Theme;
        if (saved === "light" || saved === "dark" || saved === "system") {
          return saved;
        }
      } catch (e) {
        console.error("Error reading theme from localStorage:", e);
      }
    }
    return defaultTheme;
  });

  const [resolvedTheme, setResolvedTheme] = React.useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme") as Theme;
      if (saved === "light") return "light";
      if (saved === "dark") return "dark";
    }
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  // Apply theme to DOM
  React.useEffect(() => {
    const root = document.documentElement;
    
    let appliedTheme: "light" | "dark";
    if (theme === "system") {
      appliedTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    } else {
      appliedTheme = theme;
    }
    
    setResolvedTheme(appliedTheme);
    
    // Remove both classes first
    root.classList.remove("light", "dark");
    // Add the correct class
    root.classList.add(appliedTheme);
    
    // Save to localStorage
    localStorage.setItem("theme", theme);
    
    // Update CSS variables for the theme
    if (appliedTheme === "light") {
      document.body.style.backgroundColor = "#f8f5f5";
      document.body.style.color = "#1a1a1a";
    } else {
      document.body.style.backgroundColor = "#0a0a0a";
      document.body.style.color = "#ffffff";
    }
  }, [theme]);

  // Listen for system preference changes
  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = () => {
      if (theme === "system") {
        const newTheme = mediaQuery.matches ? "dark" : "light";
        const root = document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(newTheme);
        setResolvedTheme(newTheme);
      }
    };
    
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  const value = React.useMemo(() => ({
    theme,
    setTheme,
    resolvedTheme,
  }), [theme, resolvedTheme]);

  return React.createElement(ThemeContext.Provider, { value }, children);
};

export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

/*
"use client";

import * as React from "react";

type Theme = "light" | "dark" | "system";

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
}

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

var ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined);

var ThemeProvider = function (props: ThemeProviderProps) {
  var children = props.children;
  var defaultTheme = props.defaultTheme || "system";

  var _a = React.useState<Theme>(function () {
    if (typeof window !== "undefined") {
      try {
        var saved = localStorage.getItem("theme") as Theme;
        if (saved === "light" || saved === "dark" || saved === "system") {
          return saved;
        }
      } catch (e) {
        console.error("Error reading theme from localStorage:", e);
      }
    }
    return defaultTheme;
  }),
    theme = _a[0],
    setTheme = _a[1];

  // ---------------- EFFECT: APPLY THEME ----------------
  React.useEffect(function () {
    if (typeof window === "undefined") return;

    try {
      var root = document.documentElement;

      // Determine actual applied theme
      var appliedTheme: "light" | "dark";
      if (theme === "system") {
        appliedTheme = window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
      } else {
        appliedTheme = theme;
      }

      // Remove old classes
      root.classList.remove("light");
      root.classList.remove("dark");

      // Apply new class
      root.classList.add(appliedTheme);

      // For old browsers: fallback inline CSS
      if (root.style) {
        if (appliedTheme === "light") {
          root.style.backgroundColor = "#ffffff";
          root.style.color = "#0f172a";
        } else {
          root.style.backgroundColor = "#020617";
          root.style.color = "#e5e7eb";
        }
      }

      // Save preference
      localStorage.setItem("theme", theme);

      console.log("ThemeProvider: Applied", appliedTheme, "| Storage:", theme);
    } catch (e) {
      console.error("Error applying theme:", e);
    }
  }, [theme]);

  // ---------------- CONTEXT VALUE ----------------
  var value: ThemeContextValue = { theme: theme, setTheme: setTheme };

  return React.createElement(ThemeContext.Provider, { value: value }, children);
};

// ---------------- HOOK ----------------
function useTheme() {
  var context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

export { ThemeProvider, useTheme };*/


