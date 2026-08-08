import React from "react";
import { useTheme } from "./theme-provider";

const triggerHaptic = (): void => {
  try {
    if (window.navigator && typeof window.navigator.vibrate === "function") {
      window.navigator.vibrate(50);
    }
  } catch {}
};

export const ThemeToggle: React.FC = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // Local animation state for the icon swap
  const [rotating, setRotating] = React.useState(false);

  const toggleTheme = React.useCallback((): void => {
    triggerHaptic();
    setRotating(true);
    setTheme(isDark ? "light" : "dark");
  }, [isDark, setTheme]);

  const handleAnimationEnd = React.useCallback(() => {
    setRotating(false);
  }, []);

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={[
        "p-2 rounded-full bg-transparent",
        "hover:bg-gray-100 dark:hover:bg-gray-800",
        "transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-offset-2 focus-visible:ring-primary",
      ].join(" ")}
      style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <span
        onAnimationEnd={handleAnimationEnd}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          animation: rotating ? "theme-toggle-spin 0.35s ease-out forwards" : "none",
        }}
      >
        {isDark ? (
          // Sun — shown in dark mode to switch to light
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="text-yellow-300"
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
        ) : (
          // Moon — shown in light mode to switch to dark
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="text-gray-700"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        )}
      </span>

      <style>{`
        @keyframes theme-toggle-spin {
          0%   { transform: rotate(0deg)   scale(1); }
          50%  { transform: rotate(180deg) scale(0.8); }
          100% { transform: rotate(360deg) scale(1); }
        }
      `}</style>
    </button>
  );
};

export default ThemeToggle;
