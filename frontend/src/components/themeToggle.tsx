// frontend/src/components/themeToggle.tsx
import * as React from "react";
import { useTheme } from "./theme-provider";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className="p-2 rounded-full hover:bg-green-100 dark:hover:bg-green-900/20 transition-colors"
        aria-label="Toggle theme"
      >
        <Sun className="h-5 w-5 text-gray-700 dark:text-gray-300" />
      </button>
    );
  }

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    
    // Manually update document class for immediate effect
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-green-100 dark:hover:bg-green-900/20 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 text-gray-700 dark:text-gray-300" />
      ) : (
        <Moon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
      )}
    </button>
  );
}
/*
// frontend/src/components/themeToggle.tsx
import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "./theme-provider";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeToggle = () => {
    let newTheme: "light" | "dark" | "system";
    if (theme === "light") {
      newTheme = "dark";
    } else if (theme === "dark") {
      newTheme = "system";
    } else {
      newTheme = "light";
    }
    setTheme(newTheme);
    
    // Haptic feedback
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(50);
    }
  };

  if (!mounted) {
    return <div className="w-10 h-10" />;
  }

  const isDark = resolvedTheme === "dark";
  const isSystem = theme === "system";

  // Theme-responsive colors
  const getThemeColor = () => {
    if (isDark) {
      return {
        bg: "rgba(255, 255, 255, 0.1)",
        hover: "rgba(34, 197, 94, 0.2)",
        icon: "#ffffff",
        border: "rgba(255, 255, 255, 0.2)",
      };
    } else {
      return {
        bg: "rgba(0, 0, 0, 0.05)",
        hover: "rgba(34, 197, 94, 0.1)",
        icon: "#1a1a1a",
        border: "rgba(0, 0, 0, 0.1)",
      };
    }
  };

  const themeColors = getThemeColor();

  const buttonStyle: React.CSSProperties = {
    width: "2.5rem",
    height: "2.5rem",
    padding: 0,
    borderRadius: "9999px",
    border: `1px solid ${themeColors.border}`,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
    backgroundColor: themeColors.bg,
    color: themeColors.icon,
    position: "relative" as const,
  };

  const getIcon = () => {
    if (isSystem) {
      return <Monitor className="h-5 w-5" stroke={themeColors.icon} />;
    }
    return isDark ? 
      <Sun className="h-5 w-5" stroke={themeColors.icon} fill={themeColors.icon} /> : 
      <Moon className="h-5 w-5" stroke={themeColors.icon} />;
  };

  const getTitle = () => {
    if (isSystem) {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      return `System preference (current: ${prefersDark ? "dark" : "light"})`;
    }
    return `Switch to ${isDark ? "light" : "dark"} mode`;
  };

  return (
    <button
      onClick={handleThemeToggle}
      className="theme-toggle-button"
      style={buttonStyle}
      title={getTitle()}
      aria-label="Toggle theme"
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = themeColors.hover;
        e.currentTarget.style.transform = "scale(1.05)";
        e.currentTarget.style.borderColor = "#22c55e";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = themeColors.bg;
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.borderColor = themeColors.border;
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = "scale(0.95)";
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      {getIcon()}
      {isSystem && (
        <span
          style={{
            position: "absolute",
            bottom: "-2px",
            right: "-2px",
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            backgroundColor: "#22c55e",
            border: `2px solid ${isDark ? "#0a0a0a" : "#f8f5f5"}`,
          }}
        />
      )}
    </button>
  );
}*/
/*// frontend/src/components/themeToggle.tsx
import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "./theme-provider";

type Theme = "light" | "dark" | "system";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeToggle = () => {
    let newTheme: Theme;
    if (theme === "light") {
      newTheme = "dark";
    } else if (theme === "dark") {
      newTheme = "system";
    } else {
      newTheme = "light";
    }
    setTheme(newTheme);
  };

  if (!mounted) {
    return <div className="w-10 h-10" />;
  }

  const isDark = theme === "dark";
  const isSystem = theme === "system";

  const getThemeColor = () => {
    if (isDark) {
      return {
        bg: "rgba(255, 255, 255, 0.12)",
        hover: "rgba(34, 197, 94, 0.25)",
        icon: "#ffffff",
      };
    } else {
      return {
        bg: "rgba(0, 0, 0, 0.08)",
        hover: "rgba(34, 197, 94, 0.15)",
        icon: "#1a1a1a",
      };
    }
  };

  const themeColors = getThemeColor();

  const buttonStyle: React.CSSProperties = {
    width: "2.5rem",
    height: "2.5rem",
    padding: 0,
    borderRadius: "9999px",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
    backgroundColor: themeColors.bg,
    color: themeColors.icon,
    position: "relative" as const,
  };

  const getIcon = () => {
    if (isSystem) {
      return <Monitor className="h-5 w-5" color={themeColors.icon} />;
    }
    return isDark ? 
      <Sun className="h-5 w-5" color={themeColors.icon} /> : 
      <Moon className="h-5 w-5" color={themeColors.icon} />;
  };

  const getTitle = () => {
    if (isSystem) {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      return `System preference (current: ${prefersDark ? "dark" : "light"})`;
    }
    return `Switch to ${isDark ? "light" : "dark"} mode`;
  };

  return (
    <button
      onClick={handleThemeToggle}
      className="theme-toggle-button"
      style={buttonStyle}
      title={getTitle()}
      aria-label="Toggle theme"
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = themeColors.hover;
        e.currentTarget.style.transform = "scale(1.05)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = themeColors.bg;
        e.currentTarget.style.transform = "scale(1)";
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = "scale(0.95)";
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      {getIcon()}
      {isSystem && (
        <span
          style={{
            position: "absolute",
            bottom: "-2px",
            right: "-2px",
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: "#22c55e",
            border: "1px solid var(--bg)",
          }}
        />
      )}
    </button>
  );
}*/
/*last stable lis version
import * as React from "react";
import { Moon, Sun } from "./icons";
import { useTheme } from "./theme-provider";

// Define theme type if not already defined
type Theme = "light" | "dark";

// Props for icon components (adjust based on your actual icon component props)
interface IconProps {
  className?: string;
  color?: string;
  width?: number;
  height?: number;
}

export function ThemeToggle() {
  var themeContext = useTheme();
  var theme = themeContext.theme as Theme;
  var setTheme = themeContext.setTheme as (theme: Theme) => void;

  function handleThemeToggle() {
    var newTheme: Theme = theme === "light" ? "dark" : "light";
    
    // ES5 compatible theme setting
    try {
      setTheme(newTheme);
      localStorage.setItem("theme", newTheme);
      document.documentElement.className = newTheme;
      document.documentElement.setAttribute("data-theme", newTheme);
    } catch (e) {
      // Fallback for ES5
      document.documentElement.className = newTheme;
    }
  }

  var isDark = theme === "dark";

  // Get current theme color for background - matches navbar
  const getThemeColor = () => {
    if (isDark) {
      return {
        bg: "rgba(255, 255, 255, 0.08)",
        hover: "rgba(236, 72, 153, 0.18)",
        icon: "#e5e7eb"
      };
    } else {
      return {
        bg: "rgba(15, 23, 42, 0.06)",
        hover: "rgba(236, 72, 153, 0.12)",
        icon: "#0f172a"
      };
    }
  };

  const themeColors = getThemeColor();

  // ES5 compatible styling based on theme
  var buttonStyle: React.CSSProperties = {
    width: "2.5rem",
    height: "2.5rem",
    padding: 0,
    borderRadius: "9999px",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
    backgroundColor: themeColors.bg,
    color: themeColors.icon
  };

  // Icon props - pass color as a prop if supported, otherwise use style
  const iconProps = {
    className: "h-5 w-5",
    // If your icon components accept a color prop, use this:
    color: themeColors.icon,
    // If they don't accept color prop but accept style, use this instead:
    // style: { color: themeColors.icon } as React.CSSProperties
  };

  return React.createElement(
    "button",
    {
      onClick: handleThemeToggle,
      className: "theme-toggle-button",
      style: buttonStyle,
      title: "Switch to " + (isDark ? "light" : "dark") + " mode",
      "aria-label": "Switch to " + (isDark ? "light" : "dark") + " mode",
      onMouseEnter: function(e: React.MouseEvent<HTMLButtonElement>) {
        e.currentTarget.style.backgroundColor = themeColors.hover;
      },
      onMouseLeave: function(e: React.MouseEvent<HTMLButtonElement>) {
        e.currentTarget.style.backgroundColor = themeColors.bg;
      },
      onMouseDown: function(e: React.MouseEvent<HTMLButtonElement>) {
        e.currentTarget.style.transform = "scale(0.95)";
      },
      onMouseUp: function(e: React.MouseEvent<HTMLButtonElement>) {
        e.currentTarget.style.transform = "scale(1)";
      }
    },
    isDark
      ? React.createElement(Sun, iconProps)
      : React.createElement(Moon, iconProps)
  );
}*/