import "./index.css"; 
import "core-js/stable";
import "regenerator-runtime/runtime";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import App from "./App";
import { ErrorBoundary } from "./ErrorBoundary";

/* ES5 compatibility: adds the 'es5-browser' class for CSS fallbacks. Written entirely in var/function syntax so it runs on any browser.*/
function detectES5Compatibility(): void {
  var isModernBrowser = (function (): boolean {
    try {
      // Arrow functions + Promise + Map + Set = ES6 baseline
      new Function("let x = 1; const y = 2; (() => x + y)();");
      if (!window.Promise || !window.Map || !window.Set) return false;
      return true;
    } catch (e) {
      return false;
    }
  })();

  if (!isModernBrowser) {
    document.documentElement.classList.add("es5-browser");
    console.info("[ICT] ES5 compatibility mode active");
  }
}

function registerServiceWorker(): void {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker
        .register("/sw.js")
        .then(function (reg) {
          console.info("[ICT] SW registered:", reg.scope);
        })
        .catch(function (err) {
          console.warn("[ICT] SW registration failed:", err);
        });
    });
  }
}

// Run synchronously — this is a lightweight DOM check
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", detectES5Compatibility);
} else {
  detectES5Compatibility();
}

registerServiceWorker();

var rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("[ICT] Root element #root not found in DOM.");
}

ReactDOM.createRoot(rootElement).render(
  React.createElement(
    React.StrictMode,
    null,
    React.createElement(
      ErrorBoundary,
      null,
      React.createElement(App, null)
    )
  )
);
