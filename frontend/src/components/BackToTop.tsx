// frontend/src/components/BackToTop.tsx
import React, { useState, useEffect } from 'react';

const BackToTop: React.FC = () => {
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    const toggleVisible = (): void => {
      const scrollY = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      setVisible(scrollY > 300);
    };
    
    window.addEventListener('scroll', toggleVisible);
    toggleVisible();
    
    return () => { 
      window.removeEventListener('scroll', toggleVisible); 
    };
  }, []);

  const triggerHaptic = (): void => {
    try {
      if (window.navigator && typeof window.navigator.vibrate === "function") {
        window.navigator.vibrate(50);
      }
    } catch (e) {
      // Silently fail
    }
  };

  const scrollToTop = (): void => {
    triggerHaptic();
    let supportsSmoothScroll = false;
    
    try {
      supportsSmoothScroll = 'scrollBehavior' in document.documentElement.style;
    } catch (e) {
      supportsSmoothScroll = false;
    }
    
    if (supportsSmoothScroll) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Fallback for older browsers (IE, older Android)
      const scrollStep = (): void => {
        const currentScroll = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
        if (currentScroll > 0) {
          window.scrollTo(0, currentScroll - (currentScroll / 10));
          requestAnimationFrame(scrollStep);
        }
      };
      requestAnimationFrame(scrollStep);
    }
  };

  if (!visible) {
    return null;
  }

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-50 bg-red-600 text-white p-3 rounded-full shadow-lg transition-opacity duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 hover:bg-red-700"
      aria-label="Back to top"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="18 15 12 9 6 15" />
      </svg>
    </button>
  );
};

export default BackToTop;
/*// frontend/src/components/BackToTop.tsx
import * as React from 'react';

var BackToTop = function() {
  var _useState = React.useState(false);
  var visible = _useState[0];
  var setVisible = _useState[1];

  React.useEffect(function() {
    var toggleVisible = function() {
      var scrollY = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      setVisible(scrollY > 300);
    };
    
    window.addEventListener('scroll', toggleVisible);
    toggleVisible();
    
    return function() { 
      window.removeEventListener('scroll', toggleVisible); 
    };
  }, []);

  var scrollToTop = function() {
    triggerHaptic();
    var supportsSmoothScroll = false;
    
    try {
      supportsSmoothScroll = 'scrollBehavior' in document.documentElement.style;
    } catch (e) {
      supportsSmoothScroll = false;
    }
    
    if (supportsSmoothScroll) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Fallback for older browsers (IE, older Android)
      var scrollStep = function() {
        var currentScroll = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
        if (currentScroll > 0) {
          window.scrollTo(0, currentScroll - (currentScroll / 10));
          requestAnimationFrame(scrollStep);
        }
      };
      requestAnimationFrame(scrollStep);
    }
  };
  
  var triggerHaptic = function() {
    try {
      if (window.navigator && typeof window.navigator.vibrate === "function") {
        window.navigator.vibrate(50);
      }
    } catch (e) {}
  };

  if (!visible) {
    return null;
  }

  return React.createElement("button", {
    onClick: scrollToTop,
    className: "fixed bottom-6 right-6 z-50 bg-primary text-white p-3 rounded-full shadow-lg transition-opacity duration-300 focus:outline-none focus:ring-2 focus:ring-primary hover:bg-primary/80",
    "aria-label": "Back to top"
  }, React.createElement("svg", {
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, React.createElement("polyline", { points: "18 15 12 9 6 15" })));
};

export default BackToTop;*/
/*import * as React from 'react';

const BackToTop = () => {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const toggleVisible = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', toggleVisible);
    return () => window.removeEventListener('scroll', toggleVisible);
  }, []);

  const scrollToTop = () => {
    if ('scrollBehavior' in document.documentElement.style) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Fallback for older browsers (IE, older Android)
      window.scrollTo(0, 0);
    }
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 z-50 bg-primary text-[#0d1b14] p-3 rounded-full shadow-lg transition-opacity duration-300 focus:outline-none focus:ring-2 focus:ring-primary ${
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      aria-label="Back to top"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="18 15 12 9 6 15" />
      </svg>
    </button>
  );
};

export default BackToTop;*/

/*import * as React from 'react';

const BackToTop = () => {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const toggleVisible = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', toggleVisible);
    return () => window.removeEventListener('scroll', toggleVisible);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 z-50 bg-primary text-[#0d1b14] p-3 rounded-full shadow-lg transition-opacity duration-300 focus:outline-none focus:ring-2 focus:ring-primary ${
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      aria-label="Back to top"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="18 15 12 9 6 15" />
      </svg>
    </button>
  );
};

export default BackToTop;*/