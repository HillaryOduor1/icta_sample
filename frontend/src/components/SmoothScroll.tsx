import * as React from "react";
import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

export default function SmoothScroll(props: { children: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }) {
  useEffect(function () {
    if (typeof window === "undefined") return;

    // Respect prefers-reduced-motion
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    var currentY = window.pageYOffset || 0;
    var targetY = currentY;
    var isRunning = true;

    function onScroll() {
      targetY = window.pageYOffset || 0;
    }

    function tick() {
      if (!isRunning) return;

      currentY += (targetY - currentY) * 0.1;
      window.scrollTo(0, Math.round(currentY));

      if (Math.abs(targetY - currentY) > 0.5) {
        if (window.requestAnimationFrame) {
          window.requestAnimationFrame(tick);
        } else {
          setTimeout(tick, 16); // fallback for older browsers
        }
      }
    }

    window.addEventListener("scroll", onScroll);
    tick(); // start animation loop

    return function cleanup() {
      isRunning = false;
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return React.createElement(React.Fragment, null, props.children);
}

