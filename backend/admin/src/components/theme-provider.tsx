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

export { ThemeProvider, useTheme };

