// frontend/src/components/theme-provider.tsx
import * as React from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

var initialState: ThemeProviderState = {
  theme: "system",
  setTheme: function() { return null; }
};

var ThemeProviderContext = React.createContext<ThemeProviderState>(initialState);

// Safe event listener function for ES5 browsers
var safeAddEventListener = function(target: any, event: string, handler: () => void) {
  if (!target) return false;
  
  if (target && typeof target.addEventListener === "function") {
    target.addEventListener(event, handler);
    return true;
  }
  else if (target && typeof target.attachEvent === "function") {
    target.attachEvent("on" + event, handler);
    return true;
  }
  return false;
};

var safeRemoveEventListener = function(target: any, event: string, handler: () => void) {
  if (!target) return;
  
  if (target && typeof target.removeEventListener === "function") {
    target.removeEventListener(event, handler);
  } else if (target && typeof target.detachEvent === "function") {
    target.detachEvent("on" + event, handler);
  }
};

export function ThemeProvider(props: ThemeProviderProps) {
  var children = props.children;
  var defaultTheme = props.defaultTheme !== undefined ? props.defaultTheme : "system";
  var storageKey = props.storageKey !== undefined ? props.storageKey : "vite-ui-theme";
  
  var getInitialTheme = function() {
    try {
      var saved = localStorage.getItem(storageKey) as Theme;
      return saved || defaultTheme;
    } catch (e) {
      return defaultTheme;
    }
  };
  
  var _useState = React.useState<Theme>(getInitialTheme);
  var theme = _useState[0];
  var setTheme = _useState[1];
  
  var _useState2 = React.useState(false);
  var mounted = _useState2[0];
  var setMounted = _useState2[1];

  React.useEffect(function() {
    setMounted(true);
  }, []);

  React.useEffect(function() {
    if (!mounted) return;

    var root = window.document.documentElement;
    if (!root) return;
    
    root.classList.remove("light", "dark");
    
    if (theme === "system") {
      try {
        var isDark = false;
        if (window.matchMedia && typeof window.matchMedia === "function") {
          var mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
          if (mediaQuery && typeof mediaQuery.matches !== "undefined") {
            isDark = mediaQuery.matches;
          }
        }
        root.classList.add(isDark ? "dark" : "light");
      } catch (e) {
        root.classList.add("light");
      }
    } else {
      root.classList.add(theme);
    }
    
    try {
      localStorage.setItem(storageKey, theme);
    } catch (e) {}
  }, [theme, mounted]);

  React.useEffect(function() {
    if (!mounted || theme !== "system") return;

    var mediaQuery: MediaQueryList | null = null;
    var handler: (() => void) | null = null;

    try {
      if (window.matchMedia && typeof window.matchMedia === "function") {
        mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        
        if (mediaQuery && mediaQuery.addEventListener) {
          handler = function() {
            var root = window.document.documentElement;
            if (!root) return;
            var systemTheme = mediaQuery && mediaQuery.matches ? "dark" : "light";
            root.classList.remove("light", "dark");
            root.classList.add(systemTheme);
          };
          mediaQuery.addEventListener("change", handler);
        } 
        else if (mediaQuery && mediaQuery.addListener) {
          handler = function() {
            var root = window.document.documentElement;
            if (!root) return;
            var systemTheme = mediaQuery && mediaQuery.matches ? "dark" : "light";
            root.classList.remove("light", "dark");
            root.classList.add(systemTheme);
          };
          mediaQuery.addListener(handler);
        }
      }
    } catch (e) {
      console.warn("Could not set up system theme listener:", e);
    }

    return function() {
      if (mediaQuery && handler) {
        if (mediaQuery.removeEventListener) {
          mediaQuery.removeEventListener("change", handler);
        } else if (mediaQuery.removeListener) {
          mediaQuery.removeListener(handler);
        }
      }
    };
  }, [theme, mounted]);

  var value = {
    theme: theme,
    setTheme: function(newTheme: Theme) {
      setTheme(newTheme);
    }
  };

  return React.createElement(
    ThemeProviderContext.Provider,
    Object.assign({ value: value }, props),
    children
  );
}

export var useTheme = function() {
  var context = React.useContext(ThemeProviderContext);
  
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  
  return context;
};
/*// frontend/src/components/theme-provider.tsx
import * as React from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

const ThemeProviderContext = React.createContext<ThemeProviderState>(initialState);

// Safe event listener function
const safeAddEventListener = (
  target: any,
  event: string,
  handler: () => void
) => {
  if (!target) return false;
  
  // Check if addEventListener exists and is a function
  if (target && typeof target.addEventListener === "function") {
    target.addEventListener(event, handler);
    return true;
  }
  // Fallback for older browsers
  else if (target && typeof target.attachEvent === "function") {
    target.attachEvent("on" + event, handler);
    return true;
  }
  return false;
};

const safeRemoveEventListener = (
  target: any,
  event: string,
  handler: () => void
) => {
  if (!target) return;
  
  if (target && typeof target.removeEventListener === "function") {
    target.removeEventListener(event, handler);
  } else if (target && typeof target.detachEvent === "function") {
    target.detachEvent("on" + event, handler);
  }
};

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = React.useState<Theme>(() => {
    // Safe localStorage read
    try {
      return (localStorage.getItem(storageKey) as Theme) || defaultTheme;
    } catch (e) {
      return defaultTheme;
    }
  });
  
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!mounted) return;

    const root = window.document.documentElement;
    if (!root) return;
    
    // Remove old class
    root.classList.remove("light", "dark");
    
    // Apply new theme
    if (theme === "system") {
      try {
        // Safely check system preference
        let isDark = false;
        if (window.matchMedia && typeof window.matchMedia === "function") {
          const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
          if (mediaQuery && typeof mediaQuery.matches !== "undefined") {
            isDark = mediaQuery.matches;
          }
        }
        root.classList.add(isDark ? "dark" : "light");
      } catch (e) {
        // Fallback to light theme on error
        root.classList.add("light");
      }
    } else {
      root.classList.add(theme);
    }
    
    // Safe localStorage write
    try {
      localStorage.setItem(storageKey, theme);
    } catch (e) {
      // Ignore storage errors
    }
  }, [theme, mounted]);

  // Listen for system theme changes - SAFE VERSION
  React.useEffect(() => {
    if (!mounted || theme !== "system") return;

    let mediaQuery: MediaQueryList | null = null;
    let handler: (() => void) | null = null;

    try {
      if (window.matchMedia && typeof window.matchMedia === "function") {
        mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        
        if (mediaQuery && mediaQuery.addEventListener) {
          // Modern browsers
          handler = () => {
            const root = window.document.documentElement;
            if (!root) return;
            const systemTheme = mediaQuery.matches ? "dark" : "light";
            root.classList.remove("light", "dark");
            root.classList.add(systemTheme);
          };
          mediaQuery.addEventListener("change", handler);
        } 
        else if (mediaQuery && mediaQuery.addListener) {
          // Older browsers (including some iOS versions)
          handler = () => {
            const root = window.document.documentElement;
            if (!root) return;
            const systemTheme = mediaQuery.matches ? "dark" : "light";
            root.classList.remove("light", "dark");
            root.classList.add(systemTheme);
          };
          mediaQuery.addListener(handler);
        }
      }
    } catch (e) {
      console.warn("Could not set up system theme listener:", e);
    }

    // Cleanup
    return () => {
      if (mediaQuery && handler) {
        if (mediaQuery.removeEventListener) {
          mediaQuery.removeEventListener("change", handler);
        } else if (mediaQuery.removeListener) {
          mediaQuery.removeListener(handler);
        }
      }
    };
  }, [theme, mounted]);

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      setTheme(newTheme);
    },
  };

  return (
    <ThemeProviderContext.Provider value={value} {...props}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext);
  
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");
  
  return context;
};*/

/*works better
// frontend/src/components/theme-provider.tsx
import * as React from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

const ThemeProviderContext = React.createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = React.useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!mounted) return;

    const root = window.document.documentElement;
    
    // Remove old class
    root.classList.remove("light", "dark");
    
    // Apply new theme
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
    
    // Save to localStorage
    localStorage.setItem(storageKey, theme);
  }, [theme, mounted]);

  // Listen for system theme changes
  React.useEffect(() => {
    if (!mounted || theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    // Use the modern API if available, fallback to addListener for older browsers
    const handleChange = () => {
      const root = window.document.documentElement;
      const systemTheme = mediaQuery.matches ? "dark" : "light";
      root.classList.remove("light", "dark");
      root.classList.add(systemTheme);
    };
    
    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    } 
    // Fallback for older browsers (like iOS Safari on iPhone 6)
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [theme, mounted]);

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      setTheme(newTheme);
    },
  };

  // Prevent flash of wrong theme
  if (!mounted) {
    return (
      <ThemeProviderContext.Provider value={value}>
        {children}
      </ThemeProviderContext.Provider>
    );
  }

  return (
    <ThemeProviderContext.Provider value={value} {...props}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext);
  
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");
  
  return context;
};*/

/*
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
};*/

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


