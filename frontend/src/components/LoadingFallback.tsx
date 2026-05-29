// frontend/src/components/LoadingFallback.tsx
import * as React from "react";

// ES5-safe theme detection
var getInitialTheme = function() {
  try {
    if (typeof window !== "undefined") {
      var saved = localStorage.getItem("theme");
      if (saved === "light") return "light";
      if (saved === "dark") return "dark";
      // Check system preference
      if (window.matchMedia && typeof window.matchMedia === "function") {
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      }
    }
    // Default to light mode (instead of dark)
    return "light";
  } catch (e) {
    return "light";
  }
};

// ES5-safe CSS variable getter with fallbacks
var getCSSVar = function(varName: string, fallback: string) {
  try {
    if (typeof window !== "undefined" && window.getComputedStyle) {
      var value = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
      if (value) return value;
    }
    return fallback;
  } catch (e) {
    return fallback;
  }
};

var LoadingFallback = function() {
  var _useState = React.useState(getInitialTheme);
  var theme = _useState[0];
  var setTheme = _useState[1];

  React.useEffect(function() {
    // Listen for theme changes
    var observer = new MutationObserver(function() {
      var isDarkMode = document.documentElement.classList.contains("dark");
      setTheme(isDarkMode ? "dark" : "light");
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"]
    });
    
    // Initial check
    var isDarkMode = document.documentElement.classList.contains("dark");
    setTheme(isDarkMode ? "dark" : "light");
    
    return function() { observer.disconnect(); };
  }, []);

  // Get colors with proper fallbacks - consistent across ES5/ES6
  var isDark = theme === "dark";
  
  // Use direct color values instead of CSS variables for better ES5 compatibility
  var bgColor = isDark ? "#0a0a0a" : "#f8f5f5";
  var primaryColor = "#f20d0d"; // Fixed primary color - consistent across all browsers
  var textColor = isDark ? "#ffffff" : "#1a1a1a";
  
  // Simplified colors with higher visibility - reduced masking
  var arcColorPrimary = primaryColor;
  var arcColorAccent = "#00a86b"; // Green accent
  var arcColorSecondary = isDark ? "#ffffff" : primaryColor;

  return React.createElement("div", {
    className: "flex items-center justify-center min-h-screen",
    style: { backgroundColor: bgColor }
  },
    React.createElement("svg", {
      width: "280",
      height: "280",
      viewBox: "0 0 280 280",
      xmlns: "http://www.w3.org/2000/svg"
    },
      React.createElement("defs", null,
        // Simplified gradients - reduced opacity masking for better visibility
        React.createElement("linearGradient", {
          id: "arcGradient1",
          gradientUnits: "userSpaceOnUse",
          x1: "0",
          y1: "0",
          x2: "280",
          y2: "0"
        },
          React.createElement("stop", { offset: "0%", stopColor: arcColorPrimary, stopOpacity: "0.3" }),
          React.createElement("stop", { offset: "20%", stopColor: arcColorPrimary, stopOpacity: "0.8" }),
          React.createElement("stop", { offset: "50%", stopColor: arcColorPrimary, stopOpacity: "1" }),
          React.createElement("stop", { offset: "80%", stopColor: arcColorPrimary, stopOpacity: "0.8" }),
          React.createElement("stop", { offset: "100%", stopColor: arcColorPrimary, stopOpacity: "0.3" })
        ),
        React.createElement("linearGradient", {
          id: "arcGradient2",
          gradientUnits: "userSpaceOnUse",
          x1: "0",
          y1: "0",
          x2: "280",
          y2: "0"
        },
          React.createElement("stop", { offset: "0%", stopColor: arcColorAccent, stopOpacity: "0.3" }),
          React.createElement("stop", { offset: "20%", stopColor: arcColorAccent, stopOpacity: "0.8" }),
          React.createElement("stop", { offset: "50%", stopColor: arcColorAccent, stopOpacity: "1" }),
          React.createElement("stop", { offset: "80%", stopColor: arcColorAccent, stopOpacity: "0.8" }),
          React.createElement("stop", { offset: "100%", stopColor: arcColorAccent, stopOpacity: "0.3" })
        ),
        React.createElement("linearGradient", {
          id: "arcGradient3",
          gradientUnits: "userSpaceOnUse",
          x1: "0",
          y1: "0",
          x2: "280",
          y2: "0"
        },
          React.createElement("stop", { offset: "0%", stopColor: arcColorSecondary, stopOpacity: "0.3" }),
          React.createElement("stop", { offset: "20%", stopColor: arcColorSecondary, stopOpacity: "0.8" }),
          React.createElement("stop", { offset: "50%", stopColor: arcColorSecondary, stopOpacity: "1" }),
          React.createElement("stop", { offset: "80%", stopColor: arcColorSecondary, stopOpacity: "0.8" }),
          React.createElement("stop", { offset: "100%", stopColor: arcColorSecondary, stopOpacity: "0.3" })
        )
      ),
      
      // Outer Arc - Primary Color (Red)
      React.createElement("g", { transform: "translate(140,140)" },
        React.createElement("circle", {
          cx: "0",
          cy: "0",
          r: "100",
          fill: "none",
          stroke: "url(#arcGradient1)",
          strokeWidth: "5",
          strokeLinecap: "round",
          strokeDasharray: "200 600"
        },
          React.createElement("animateTransform", {
            attributeName: "transform",
            type: "rotate",
            from: "0",
            to: "360",
            dur: "1.2s",
            repeatCount: "indefinite"
          })
        )
      ),
      
      // Middle Arc - Green Accent
      React.createElement("g", { transform: "translate(140,140)" },
        React.createElement("circle", {
          cx: "0",
          cy: "0",
          r: "90",
          fill: "none",
          stroke: "url(#arcGradient2)",
          strokeWidth: "5",
          strokeLinecap: "round",
          strokeDasharray: "180 600"
        },
          React.createElement("animateTransform", {
            attributeName: "transform",
            type: "rotate",
            from: "0",
            to: "-360",
            dur: "1.4s",
            repeatCount: "indefinite"
          })
        )
      ),
      
      // Inner Arc - Secondary Color
      React.createElement("g", { transform: "translate(140,140)" },
        React.createElement("circle", {
          cx: "0",
          cy: "0",
          r: "80",
          fill: "none",
          stroke: "url(#arcGradient3)",
          strokeWidth: "5",
          strokeLinecap: "round",
          strokeDasharray: "160 600"
        },
          React.createElement("animateTransform", {
            attributeName: "transform",
            type: "rotate",
            from: "0",
            to: "360",
            dur: "1.6s",
            repeatCount: "indefinite"
          })
        )
      ),
      
      // Center Text
      React.createElement("text", {
        x: "140",
        y: "140",
        textAnchor: "middle",
        dominantBaseline: "middle",
        fill: textColor,
        fontFamily: "Space Grotesk, sans-serif",
        fontSize: "14",
        fontWeight: "700",
        letterSpacing: "3"
      }, "ICT AUTHORITY"),
      
      // Subtle pulsing dot in center for visual interest
      React.createElement("circle", {
        cx: "140",
        cy: "140",
        r: "4",
        fill: primaryColor,
        opacity: "0.6"
      },
        React.createElement("animate", {
          attributeName: "opacity",
          values: "0.3;0.8;0.3",
          dur: "2s",
          repeatCount: "indefinite"
        }),
        React.createElement("animate", {
          attributeName: "r",
          values: "3;5;3",
          dur: "2s",
          repeatCount: "indefinite"
        })
      )
    )
  );
};

export default LoadingFallback;