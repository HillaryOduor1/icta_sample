import React, { useState, useEffect } from "react";

/*Reads the resolved theme from:
  1. The "dark" class on <html> (set by the inline script in index.html)
  2. System preference (prefers-color-scheme) as a fallback
 */
function getResolvedTheme(): "light" | "dark" {
  if (typeof document === "undefined") return "light";

  const root = document.documentElement;
  if (root.classList.contains("dark")) return "dark";

  // Fallback: use system preference
  if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
}

const LoadingFallback: React.FC = () => {
  const [theme, setTheme] = useState<"light" | "dark">(getResolvedTheme);

  useEffect(() => {
    // Update when the class on <html> changes
    const classObserver = new MutationObserver(() => {
      setTheme(getResolvedTheme());
    });
    classObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Also react to system preference changes in case the class isn't set
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      setTheme(getResolvedTheme());
    };
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      classObserver.disconnect();
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  const isDark = theme === "dark";

  // Soft colours — not pure white or black
  const bgColor = isDark ? "#0d0d0d" : "#f5f2f2";
  const textColor = isDark ? "#ffffff" : "#1a1a1a";
  const innerRingColor = isDark ? "#ffffff" : "#000000";

  return (
    <div
      aria-label="Loading"
      aria-live="polite"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        minWidth: "100vw",
        backgroundColor: bgColor,
        transition: "background-color 0.3s ease",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "280px",
          height: "280px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Outer ring — Red */}
        <div
          style={{
            position: "absolute",
            width: "280px",
            height: "280px",
            border: "5px solid transparent",
            borderTopColor: "#f20d0d",
            borderRightColor: "#f20d0d",
            borderRadius: "50%",
            animation: "ict-spin 1.2s linear infinite",
          }}
        />

        {/* Middle ring — Green, counter-rotating */}
        <div
          style={{
            position: "absolute",
            width: "220px",
            height: "220px",
            border: "5px solid transparent",
            borderBottomColor: "#00a86b",
            borderLeftColor: "#00a86b",
            borderRadius: "50%",
            animation: "ict-spin-reverse 1.4s linear infinite",
          }}
        />

        {/* Inner ring — follows theme (white in dark, black in light) */}
        <div
          style={{
            position: "absolute",
            width: "160px",
            height: "160px",
            border: "5px solid transparent",
            borderTopColor: innerRingColor,
            borderRightColor: innerRingColor,
            borderRadius: "50%",
            animation: "ict-spin 1.6s linear infinite",
            transition: "border-top-color 0.3s ease, border-right-color 0.3s ease",
          }}
        />

        {/* Center label */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            color: textColor,
            fontFamily: "'Space Grotesk', system-ui, sans-serif",
            fontSize: "13px",
            fontWeight: 700,
            letterSpacing: "3px",
            textAlign: "center",
            textTransform: "uppercase",
            userSelect: "none",
            transition: "color 0.3s ease",
          }}
        >
          ICT AUTHORITY
        </div>
      </div>

      {/* Scoped keyframes */}
      <style>{`
        @keyframes ict-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes ict-spin-reverse {
          from { transform: rotate(360deg); }
          to   { transform: rotate(0deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="ict-spin"] { animation: none !important; }
        }
      `}</style>
    </div>
  );
};

export default LoadingFallback;
