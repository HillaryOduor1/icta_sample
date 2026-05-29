// frontend/src/components/Sidebar/Sidebar.tsx
import React, { useState, useRef, useEffect } from 'react';
import SidebarItem from './SidebarItem';
import SidebarDropdown from './SidebarDropdown';
import SidebarFooter from './SidebarFooter';
import { useContent } from '../../content/useContext';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

// Haptic feedback function
var triggerHaptic = function() {
  try {
    if (window.navigator && typeof window.navigator.vibrate === "function") {
      window.navigator.vibrate(50);
    }
  } catch (e) {}
};

// Helper to get icon component by name - using simple SVGs for ES5 compatibility
var getIconComponent = function(iconName: string) {
  var icons: Record<string, React.ReactNode> = {
    home: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
      React.createElement("path", { d: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2h-5v-7H9v7H5a2 2 0 0 1-2-2z" })),
    info: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
      React.createElement("circle", { cx: "12", cy: "12", r: "10" }),
      React.createElement("line", { x1: "12", y1: "16", x2: "12", y2: "12" }),
      React.createElement("line", { x1: "12", y1: "8", x2: "12.01", y2: "8" })),
    briefcase: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
      React.createElement("rect", { x: "2", y: "7", width: "20", height: "14", rx: "2", ry: "2" }),
      React.createElement("path", { d: "M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" }))
  };
  return icons[iconName?.toLowerCase()] || React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
    React.createElement("path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" }),
    React.createElement("polyline", { points: "15 3 21 3 21 9" }),
    React.createElement("line", { x1: "10", y1: "14", x2: "21", y2: "3" }));
};

var Sidebar = function({ isOpen, toggleSidebar }: SidebarProps) {
  var { content, isLoading } = useContent();
  var _useState = useState<{ [key: string]: boolean }>({});
  var openDropdowns = _useState[0];
  var setOpenDropdowns = _useState[1];
  var sidebarRef = useRef<HTMLDivElement>(null);
  var scrollYRef = useRef<number>(0);

  var topNavLinks = content.topNavLinks || [];
  var mainNavItems = content.mainNavItems || [];

  var sidebarNavItems = mainNavItems.map(function(item: any) {
    return Object.assign({}, item, {
      icon: getIconComponent(item.label?.toLowerCase().replace(/\s/g, ''))
    });
  });

  var toggleDropdown = function(name: string) {
    triggerHaptic();
    setOpenDropdowns(function(prev) {
      var newState = Object.assign({}, prev);
      newState[name] = !prev[name];
      return newState;
    });
  };

  var handleToggle = function() {
    triggerHaptic();
    toggleSidebar();
  };

  // Prevent body scroll when sidebar is open
  useEffect(function() {
    if (isOpen) {
      // Save current scroll position
      scrollYRef.current = window.scrollY;
      
      // Apply styles to prevent scrolling
      document.body.style.position = 'fixed';
      document.body.style.top = '-' + scrollYRef.current + 'px';
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      // Restore scrolling
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      
      // Restore scroll position
      window.scrollTo(0, scrollYRef.current);
    }
    
    return function() {
      // Cleanup: ensure scrolling is restored if component unmounts while open
      if (isOpen) {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
      }
    };
  }, [isOpen]);

  // Close on outside click
  useEffect(function() {
    var handleClickOutside = function(event: MouseEvent) {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        handleToggle();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return function() { document.removeEventListener("mousedown", handleClickOutside); };
  }, [isOpen]);

  // Close on Escape key
  useEffect(function() {
    var handleKeyDown = function(event: KeyboardEvent) {
      if (isOpen && event.key === 'Escape') {
        handleToggle();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return function() { document.removeEventListener('keydown', handleKeyDown); };
  }, [isOpen]);

  // Swipe to close on touch devices
  useEffect(function() {
    var touchStartX = 0;
    var onTouchStart = function(e: TouchEvent) { 
      touchStartX = e.changedTouches[0].clientX; 
    };
    var onTouchMove = function(e: TouchEvent) {
      if (!isOpen) return;
      var deltaX = e.changedTouches[0].clientX - touchStartX;
      if (deltaX < -50) {
        handleToggle();
      }
    };
    window.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchmove', onTouchMove);
    return function() {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, [isOpen]);

  if (isLoading) {
    return React.createElement(React.Fragment, null,
      isOpen && React.createElement("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden" }),
      React.createElement("aside", { 
        className: "fixed top-0 left-0 h-full w-80 z-50 shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col bg-white dark:bg-surface border-r border-gray-200 dark:border-gray-800 " + (isOpen ? 'translate-x-0' : '-translate-x-full'),
        style: { height: '100%' }
      },
        React.createElement("div", { className: "sticky top-0 bg-primary p-4" },
          React.createElement("div", { className: "h-12 w-32 bg-white/20 rounded animate-pulse" })),
        React.createElement("div", { className: "flex-1 p-4 space-y-6" },
          React.createElement("div", { className: "space-y-2" },
            [1, 2, 3, 4, 5].map(function(i) {
              return React.createElement("div", { key: i, className: "h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" });
            })))));
  }

  return React.createElement(React.Fragment, null,
    // Overlay - only shown on mobile when sidebar is open
    isOpen && React.createElement("div", {
      className: "fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden",
      onClick: handleToggle,
      "aria-hidden": "true"
    }),
    React.createElement("aside", {
      ref: sidebarRef,
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "Mobile navigation menu",
      className: "fixed top-0 left-0 h-full w-80 z-50 shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto flex flex-col bg-white dark:bg-surface border-r border-gray-200 dark:border-gray-700 " + (isOpen ? 'translate-x-0' : '-translate-x-full'),
      style: { height: '100%' }
    },
    React.createElement("div", { className: "sticky top-0 bg-primary p-4 text-white flex justify-between items-center" },
      React.createElement("a", { href: "https://icta.go.ke/", target: "_blank", rel: "noopener noreferrer", className: "flex items-center" },
        React.createElement("img", {
          src: "https://icta.go.ke//assets/images/ictalogo.png",
          alt: "ICTA logo",
          className: "h-auto w-auto max-h-12 max-w-[150px] brightness-0 invert"
        })),
      React.createElement("button", {
        onClick: handleToggle,
        className: "p-1 hover:bg-white/20 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white",
        "aria-label": "Close sidebar"
      }, React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
        React.createElement("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
        React.createElement("line", { x1: "6", y1: "6", x2: "18", y2: "18" })))),
    React.createElement("div", { className: "flex-1 p-4 space-y-6 overflow-y-auto" },
      topNavLinks.length > 0 && React.createElement("div", null,
        React.createElement("h3", { className: "text-xs font-semibold text-primary uppercase tracking-wider mb-3 px-2" }, "Quick Links"),
        React.createElement("div", { className: "space-y-1" },
          topNavLinks.map(function(link: any, idx: number) {
            return React.createElement(SidebarItem, {
              key: link.label || idx,
              icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
                React.createElement("path", { d: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" }),
                React.createElement("polyline", { points: "22,6 12,13 2,6" })),
              label: link.label,
              href: link.href,
              external: true,
              onClick: handleToggle
            });
          }))),
      React.createElement("div", { className: "border-t border-gray-200 dark:border-gray-700" }),
      sidebarNavItems.length > 0 && React.createElement("div", null,
        React.createElement("h3", { className: "text-xs font-semibold text-primary uppercase tracking-wider mb-3 px-2" }, "Navigation"),
        React.createElement("div", { className: "space-y-1" },
          sidebarNavItems.map(function(item: any) {
            if (item.dropdown && item.dropdown.length > 0) {
              return React.createElement(SidebarDropdown, {
                key: item.label,
                name: item.label.toLowerCase().replace(/\s/g, '-'),
                label: item.label,
                icon: item.icon,
                items: item.dropdown,
                isOpen: openDropdowns[item.label] || false,
                onToggle: function() { toggleDropdown(item.label); },
                onItemClick: handleToggle
              });
            }
            return React.createElement(SidebarItem, {
              key: item.label,
              icon: item.icon,
              label: item.label,
              href: item.href,
              external: item.external,
              onClick: handleToggle
            });
          })))),
    React.createElement(SidebarFooter, null)));
};

export default Sidebar;
/*// frontend/src/components/Sidebar/Sidebar.tsx
import React, { useState, useRef, useEffect } from 'react';
import SidebarItem from './SidebarItem';
import SidebarDropdown from './SidebarDropdown';
import SidebarFooter from './SidebarFooter';
import { useContent } from '../../content/useContext';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

// Haptic feedback function
var triggerHaptic = function() {
  try {
    if (window.navigator && typeof window.navigator.vibrate === "function") {
      window.navigator.vibrate(50);
    }
  } catch (e) {}
};

// Helper to get icon component by name - using simple SVGs for ES5 compatibility
var getIconComponent = function(iconName: string) {
  var icons: Record<string, React.ReactNode> = {
    home: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
      React.createElement("path", { d: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2h-5v-7H9v7H5a2 2 0 0 1-2-2z" })),
    info: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
      React.createElement("circle", { cx: "12", cy: "12", r: "10" }),
      React.createElement("line", { x1: "12", y1: "16", x2: "12", y2: "12" }),
      React.createElement("line", { x1: "12", y1: "8", x2: "12.01", y2: "8" })),
    briefcase: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
      React.createElement("rect", { x: "2", y: "7", width: "20", height: "14", rx: "2", ry: "2" }),
      React.createElement("path", { d: "M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" }))
  };
  return icons[iconName?.toLowerCase()] || React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
    React.createElement("path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" }),
    React.createElement("polyline", { points: "15 3 21 3 21 9" }),
    React.createElement("line", { x1: "10", y1: "14", x2: "21", y2: "3" }));
};

var Sidebar: React.FC<SidebarProps> = function({ isOpen, toggleSidebar }) {
  var { content, isLoading } = useContent();
  var _useState = useState<{ [key: string]: boolean }>({});
  var openDropdowns = _useState[0];
  var setOpenDropdowns = _useState[1];
  var sidebarRef = useRef<HTMLDivElement>(null);

  var topNavLinks = content.topNavLinks || [];
  var mainNavItems = content.mainNavItems || [];

  var sidebarNavItems = mainNavItems.map(function(item: any) {
    return Object.assign({}, item, {
      icon: getIconComponent(item.label?.toLowerCase().replace(/\s/g, ''))
    });
  });

  var toggleDropdown = function(name: string) {
    triggerHaptic();
    setOpenDropdowns(function(prev) {
      var newState = Object.assign({}, prev);
      newState[name] = !prev[name];
      return newState;
    });
  };

  var handleToggle = function() {
    triggerHaptic();
    toggleSidebar();
  };

  // Close on outside click
  useEffect(function() {
    var handleClickOutside = function(event: MouseEvent) {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        handleToggle();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return function() { document.removeEventListener("mousedown", handleClickOutside); };
  }, [isOpen]);

  // Close on Escape key
  useEffect(function() {
    var handleKeyDown = function(event: KeyboardEvent) {
      if (isOpen && event.key === 'Escape') {
        handleToggle();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return function() { document.removeEventListener('keydown', handleKeyDown); };
  }, [isOpen]);

  // Swipe to close
  useEffect(function() {
    var touchStartX = 0;
    var onTouchStart = function(e: TouchEvent) { touchStartX = e.changedTouches[0].clientX; };
    var onTouchMove = function(e: TouchEvent) {
      if (!isOpen) return;
      var deltaX = e.changedTouches[0].clientX - touchStartX;
      if (deltaX < -50) {
        handleToggle();
      }
    };
    window.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchmove', onTouchMove);
    return function() {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, [isOpen]);

  if (isLoading) {
    return React.createElement(React.Fragment, null,
      isOpen && React.createElement("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden" }),
      React.createElement("aside", { className: "fixed top-0 left-0 h-full w-80 z-50 shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col bg-white dark:bg-surface border-r border-gray-200 dark:border-gray-800 " + (isOpen ? 'translate-x-0' : '-translate-x-full') },
        React.createElement("div", { className: "sticky top-0 bg-primary p-4" },
          React.createElement("div", { className: "h-12 w-32 bg-white/20 rounded animate-pulse" })),
        React.createElement("div", { className: "flex-1 p-4 space-y-6" },
          React.createElement("div", { className: "space-y-2" },
            [1, 2, 3, 4, 5].map(function(i) {
              return React.createElement("div", { key: i, className: "h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" });
            })))));
  }

  return React.createElement(React.Fragment, null,
    isOpen && React.createElement("div", {
      className: "fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden",
      onClick: handleToggle,
      "aria-hidden": "true"
    }),
    React.createElement("aside", {
      ref: sidebarRef,
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "Mobile navigation menu",
      className: "fixed top-0 left-0 h-full w-80 z-50 shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto flex flex-col bg-white dark:bg-surface-dark border-r border-gray-200 dark:border-gray-700",
      style: { height: '100dvh', backgroundColor: 'var(--surface, #1a1a1a)' }
    },
    React.createElement("div", { className: "sticky top-0 bg-primary p-4 text-white flex justify-between items-center" },
      React.createElement("a", { href: "https://icta.go.ke/", target: "_blank", rel: "noopener noreferrer", className: "flex items-center" },
        React.createElement("img", {
          src: "https://icta.go.ke//assets/images/ictalogo.png",
          alt: "ICTA logo",
          className: "h-auto w-auto max-h-12 max-w-[150px] brightness-0 invert"
        })),
      React.createElement("button", {
        onClick: handleToggle,
        className: "p-1 hover:bg-white/20 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white",
        "aria-label": "Close sidebar"
      }, React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
        React.createElement("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
        React.createElement("line", { x1: "6", y1: "6", x2: "18", y2: "18" })))),
    React.createElement("div", { className: "flex-1 p-4 space-y-6 overflow-y-auto" },
      topNavLinks.length > 0 && React.createElement("div", null,
        React.createElement("h3", { className: "text-xs font-semibold text-primary uppercase tracking-wider mb-3 px-2" }, "Quick Links"),
        React.createElement("div", { className: "space-y-1" },
          topNavLinks.map(function(link: any, idx: number) {
            return React.createElement(SidebarItem, {
              key: link.label || idx,
              icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
                React.createElement("path", { d: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" }),
                React.createElement("polyline", { points: "22,6 12,13 2,6" })),
              label: link.label,
              href: link.href,
              external: true,
              onClick: handleToggle
            });
          }))),
      React.createElement("div", { className: "border-t border-gray-200 dark:border-gray-700" }),
      sidebarNavItems.length > 0 && React.createElement("div", null,
        React.createElement("h3", { className: "text-xs font-semibold text-primary uppercase tracking-wider mb-3 px-2" }, "Navigation"),
        React.createElement("div", { className: "space-y-1" },
          sidebarNavItems.map(function(item: any) {
            if (item.dropdown && item.dropdown.length > 0) {
              return React.createElement(SidebarDropdown, {
                key: item.label,
                name: item.label.toLowerCase().replace(/\s/g, '-'),
                label: item.label,
                icon: item.icon,
                items: item.dropdown,
                isOpen: openDropdowns[item.label] || false,
                onToggle: function() { toggleDropdown(item.label); },
                onItemClick: handleToggle
              });
            }
            return React.createElement(SidebarItem, {
              key: item.label,
              icon: item.icon,
              label: item.label,
              href: item.href,
              external: item.external,
              onClick: handleToggle
            });
          })))),
    React.createElement(SidebarFooter, null)));
};

export default Sidebar;*/

/*
// frontend/src/components/Sidebar/Sidebar.tsx
import React, { useState, useRef, useEffect } from 'react';
import SidebarItem from './SidebarItem';
import SidebarDropdown from './SidebarDropdown';
import SidebarFooter from './SidebarFooter';
import { useContent } from '../../content/useContext';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

// Haptic feedback function
var triggerHaptic = function() {
  try {
    if (window.navigator && typeof window.navigator.vibrate === "function") {
      window.navigator.vibrate(50);
    }
  } catch (e) {}
};

// Helper to get icon component by name - using simple SVGs for ES5 compatibility
var getIconComponent = function(iconName: string) {
  var icons: Record<string, React.ReactNode> = {
    home: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
      React.createElement("path", { d: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2h-5v-7H9v7H5a2 2 0 0 1-2-2z" })),
    info: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
      React.createElement("circle", { cx: "12", cy: "12", r: "10" }),
      React.createElement("line", { x1: "12", y1: "16", x2: "12", y2: "12" }),
      React.createElement("line", { x1: "12", y1: "8", x2: "12.01", y2: "8" })),
    briefcase: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
      React.createElement("rect", { x: "2", y: "7", width: "20", height: "14", rx: "2", ry: "2" }),
      React.createElement("path", { d: "M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" }))
  };
  return icons[iconName?.toLowerCase()] || React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
    React.createElement("path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" }),
    React.createElement("polyline", { points: "15 3 21 3 21 9" }),
    React.createElement("line", { x1: "10", y1: "14", x2: "21", y2: "3" }));
};

var Sidebar: React.FC<SidebarProps> = function({ isOpen, toggleSidebar }) {
  var { content, isLoading } = useContent();
  var _useState = useState<{ [key: string]: boolean }>({});
  var openDropdowns = _useState[0];
  var setOpenDropdowns = _useState[1];
  var sidebarRef = useRef<HTMLDivElement>(null);

  var topNavLinks = content.topNavLinks || [];
  var mainNavItems = content.mainNavItems || [];

  var sidebarNavItems = mainNavItems.map(function(item: any) {
    return Object.assign({}, item, {
      icon: getIconComponent(item.label?.toLowerCase().replace(/\s/g, ''))
    });
  });

  var toggleDropdown = function(name: string) {
    triggerHaptic();
    setOpenDropdowns(function(prev) {
      var newState = Object.assign({}, prev);
      newState[name] = !prev[name];
      return newState;
    });
  };

  var handleToggle = function() {
    triggerHaptic();
    toggleSidebar();
  };

  // Close on outside click
  useEffect(function() {
    var handleClickOutside = function(event: MouseEvent) {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        handleToggle();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return function() { document.removeEventListener("mousedown", handleClickOutside); };
  }, [isOpen]);

  // Close on Escape key
  useEffect(function() {
    var handleKeyDown = function(event: KeyboardEvent) {
      if (isOpen && event.key === 'Escape') {
        handleToggle();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return function() { document.removeEventListener('keydown', handleKeyDown); };
  }, [isOpen]);

  // Swipe to close
  useEffect(function() {
    var touchStartX = 0;
    var onTouchStart = function(e: TouchEvent) { touchStartX = e.changedTouches[0].clientX; };
    var onTouchMove = function(e: TouchEvent) {
      if (!isOpen) return;
      var deltaX = e.changedTouches[0].clientX - touchStartX;
      if (deltaX < -50) {
        handleToggle();
      }
    };
    window.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchmove', onTouchMove);
    return function() {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, [isOpen]);

  if (isLoading) {
    return React.createElement(React.Fragment, null,
      isOpen && React.createElement("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden" }),
      React.createElement("aside", { className: "fixed top-0 left-0 h-full w-80 z-50 shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col bg-white dark:bg-surface border-r border-gray-200 dark:border-gray-800 " + (isOpen ? 'translate-x-0' : '-translate-x-full') },
        React.createElement("div", { className: "sticky top-0 bg-primary p-4" },
          React.createElement("div", { className: "h-12 w-32 bg-white/20 rounded animate-pulse" })),
        React.createElement("div", { className: "flex-1 p-4 space-y-6" },
          React.createElement("div", { className: "space-y-2" },
            [1, 2, 3, 4, 5].map(function(i) {
              return React.createElement("div", { key: i, className: "h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" });
            })))));
  }

  return React.createElement(React.Fragment, null,
    isOpen && React.createElement("div", {
      className: "fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden",
      onClick: handleToggle,
      "aria-hidden": "true"
    }),
    React.createElement("aside", {
      ref: sidebarRef,
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "Mobile navigation menu",
      className: "fixed top-0 left-0 h-full w-80 z-50 shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto flex flex-col bg-white dark:bg-surface border-r border-gray-200 dark:border-gray-800 " + (isOpen ? 'translate-x-0' : '-translate-x-full'),
      style: { height: '100dvh' }
    },
    React.createElement("div", { className: "sticky top-0 bg-primary p-4 text-white flex justify-between items-center" },
      React.createElement("a", { href: "https://icta.go.ke/", target: "_blank", rel: "noopener noreferrer", className: "flex items-center" },
        React.createElement("img", {
          src: "https://icta.go.ke//assets/images/ictalogo.png",
          alt: "ICTA logo",
          className: "h-auto w-auto max-h-12 max-w-[150px] brightness-0 invert"
        })),
      React.createElement("button", {
        onClick: handleToggle,
        className: "p-1 hover:bg-white/20 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white",
        "aria-label": "Close sidebar"
      }, React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
        React.createElement("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
        React.createElement("line", { x1: "6", y1: "6", x2: "18", y2: "18" })))),
    React.createElement("div", { className: "flex-1 p-4 space-y-6 overflow-y-auto" },
      topNavLinks.length > 0 && React.createElement("div", null,
        React.createElement("h3", { className: "text-xs font-semibold text-primary uppercase tracking-wider mb-3 px-2" }, "Quick Links"),
        React.createElement("div", { className: "space-y-1" },
          topNavLinks.map(function(link: any, idx: number) {
            return React.createElement(SidebarItem, {
              key: link.label || idx,
              icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
                React.createElement("path", { d: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" }),
                React.createElement("polyline", { points: "22,6 12,13 2,6" })),
              label: link.label,
              href: link.href,
              external: true,
              onClick: handleToggle
            });
          }))),
      React.createElement("div", { className: "border-t border-gray-200 dark:border-gray-800" }),
      sidebarNavItems.length > 0 && React.createElement("div", null,
        React.createElement("h3", { className: "text-xs font-semibold text-primary uppercase tracking-wider mb-3 px-2" }, "Navigation"),
        React.createElement("div", { className: "space-y-1" },
          sidebarNavItems.map(function(item: any) {
            if (item.dropdown && item.dropdown.length > 0) {
              return React.createElement(SidebarDropdown, {
                key: item.label,
                name: item.label.toLowerCase().replace(/\s/g, '-'),
                label: item.label,
                icon: item.icon,
                items: item.dropdown,
                isOpen: openDropdowns[item.label] || false,
                onToggle: function() { toggleDropdown(item.label); },
                onItemClick: handleToggle
              });
            }
            return React.createElement(SidebarItem, {
              key: item.label,
              icon: item.icon,
              label: item.label,
              href: item.href,
              external: item.external,
              onClick: handleToggle
            });
          })))),
    React.createElement(SidebarFooter, null)));
};

export default Sidebar;*/

/*works but background issue on es5
// frontend/src/components/Sidebar/Sidebar.tsx
import React, { useState, useRef, useEffect } from 'react';
import { X, Menu, Home, Info, Briefcase, Shield, Award, FileText, Users, Megaphone, Folder, MessageCircle, Globe, Mail, File, BookOpen, Image, Download, ExternalLink } from 'lucide-react';
import SidebarItem from './SidebarItem';
import SidebarDropdown from './SidebarDropdown';
import SidebarFooter from './SidebarFooter';
import { useContent } from '../../content/useContext';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

// Helper to get icon component by name
const getIconComponent = (iconName: string) => {
  const icons: Record<string, React.ReactNode> = {
    home: <Home size={18} />,
    info: <Info size={18} />,
    briefcase: <Briefcase size={18} />,
    shield: <Shield size={18} />,
    award: <Award size={18} />,
    filetext: <FileText size={18} />,
    users: <Users size={18} />,
    megaphone: <Megaphone size={18} />,
    folder: <Folder size={18} />,
    messagecircle: <MessageCircle size={18} />,
    globe: <Globe size={18} />,
    mail: <Mail size={18} />,
    file: <File size={18} />,
    bookopen: <BookOpen size={18} />,
    image: <Image size={18} />,
    download: <Download size={18} />
  };
  return icons[iconName?.toLowerCase()] || <ExternalLink size={18} />;
};

// Haptic feedback function
const triggerHaptic = () => {
  if (window.navigator && window.navigator.vibrate) {
    window.navigator.vibrate(50);
  }
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const { content, isLoading } = useContent();
  const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({});
  const sidebarRef = useRef<HTMLDivElement>(null);

  const topNavLinks = content.topNavLinks || [];
  const mainNavItems = content.mainNavItems || [];

  // Transform mainNavItems to include icons for sidebar
  const sidebarNavItems = mainNavItems.map((item: any) => ({
    ...item,
    icon: getIconComponent(item.label?.toLowerCase().replace(/\s/g, ''))
  }));

  const toggleDropdown = (name: string) => {
    triggerHaptic();
    setOpenDropdowns(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const handleToggle = () => {
    triggerHaptic();
    toggleSidebar();
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        handleToggle();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isOpen && event.key === 'Escape') {
        handleToggle();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.dataset.scrollY = scrollY.toString();
    } else {
      const scrollY = parseInt(document.body.dataset.scrollY || '0');
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      window.scrollTo(0, scrollY);
      delete document.body.dataset.scrollY;
    }
  }, [isOpen]);

  // Swipe to close
  useEffect(() => {
    let touchStartX = 0;
    const onTouchStart = (e: TouchEvent) => { touchStartX = e.changedTouches[0].clientX; };
    const onTouchMove = (e: TouchEvent) => {
      if (!isOpen) return;
      const deltaX = e.changedTouches[0].clientX - touchStartX;
      if (deltaX < -50) {
        handleToggle();
      }
    };
    window.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchmove', onTouchMove);
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, [isOpen]);

  if (isLoading) {
    return (
      <>
        {isOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden" />
        )}
        <aside className={`fixed top-0 left-0 h-full w-80 z-50 shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col bg-white dark:bg-surface border-r border-gray-200 dark:border-gray-800 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="sticky top-0 bg-primary p-4">
            <div className="h-12 w-32 bg-white/20 rounded animate-pulse"></div>
          </div>
          <div className="flex-1 p-4 space-y-6">
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        </aside>
      </>
    );
  }

  return (
    <>
      {/* Overlay /}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden"
          onClick={handleToggle}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar /}
      <aside
        ref={sidebarRef}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
        className={`fixed top-0 left-0 h-full w-80 z-50 shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } bg-white dark:bg-surface border-r border-gray-200 dark:border-gray-800`}
        style={{ height: '100dvh' }}
      >
        {/* Header /}
        {/*<div className="sticky top-0 bg-primary p-4 text-white flex justify-between items-center">
          <a href="https://icta.go.ke/" target="_blank" rel="noopener noreferrer" className="flex items-center">
            <img 
              src="/assets/logo1.png" 
              alt="ICTA logo" 
              className="h-12 w-auto brightness-0 invert"
            />
          </a>
          <button 
            onClick={handleToggle} 
            className="p-1 hover:bg-white/20 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Close sidebar"
          >
            <X size={24} />
          </button>
        </div>/}
          
        <div className="sticky top-0 bg-primary p-4 text-white flex justify-between items-center">
          <a href="https://icta.go.ke/" target="_blank" rel="noopener noreferrer" className="flex items-center">
            <img 
              src="https://icta.go.ke//assets/images/ictalogo.png" 
              alt="ICTA logo" 
              className="h-auto w-auto max-h-12 max-w-[150px] brightness-0 invert"
            />
          </a>
          <button 
            onClick={handleToggle} 
            className="p-1 hover:bg-white/20 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Close sidebar"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Navigation Links /}
        <div className="flex-1 p-4 space-y-6 overflow-y-auto">
          {/* Quick Links Section *}
          {topNavLinks.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-3 px-2">Quick Links</h3>
              <div className="space-y-1">
                {topNavLinks.map((link) => (
                  <SidebarItem
                    key={link.label}
                    icon={link.icon === 'mail' ? <Mail size={18} /> : <ExternalLink size={18} />}
                    label={link.label}
                    href={link.href}
                    external={link.external}
                    onClick={handleToggle}
                  />
                ))}
              </div>
            </div>
          )}
          
          <div className="border-t border-gray-200 dark:border-gray-800" />
          
          {/* Main Navigation /}
          {sidebarNavItems.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-3 px-2">Navigation</h3>
              <div className="space-y-1">
                {sidebarNavItems.map((item) => {
                  if (item.dropdown && item.dropdown.length > 0) {
                    return (
                      <SidebarDropdown
                        key={item.label}
                        name={item.label.toLowerCase().replace(/\s/g, '-')}
                        label={item.label}
                        icon={item.icon}
                        items={item.dropdown}
                        isOpen={openDropdowns[item.label] || false}
                        onToggle={() => toggleDropdown(item.label)}
                        onItemClick={handleToggle}
                      />
                    );
                  }
                  return (
                    <SidebarItem
                      key={item.label}
                      icon={item.icon}
                      label={item.label}
                      href={item.href!}
                      external={item.external}
                      onClick={handleToggle}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
        
        {/* Footer /}
        <SidebarFooter />
      </aside>
    </>
  );
};

export default Sidebar;*/


/*
// frontend/src/components/Sidebar/Sidebar.tsx
import React, { useState, useRef, useEffect } from 'react';
import { X, Menu, Home, Info, Briefcase, Shield, Award, FileText, Users, Megaphone, Folder, MessageCircle, Globe, Mail, File, BookOpen, Image, Download, ExternalLink } from 'lucide-react';
import SidebarItem from './SidebarItem';
import SidebarDropdown from './SidebarDropdown';
import SidebarFooter from './SidebarFooter';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

// Top quick links
const topNavLinks = [
  { label: 'info@ict.go.ke', href: 'mailto:info@ict.go.ke', icon: <Mail size={18} />, external: true },
  { label: 'Strategic Plan 2024-2027', href: 'https://cms.icta.go.ke/sites/default/files/2024-09/SP_2024_-_2027_0912.pdf', icon: <FileText size={18} />, external: true },
  { label: 'National Digital Masterplan', href: 'https://cms.icta.go.ke/sites/default/files/2022-09/Kenya_Digital_Master_Plan_2022-2023.pdf', icon: <BookOpen size={18} />, external: true },
  { label: 'Service Charter (Audio)', href: 'https://www.youtube.com/watch?v=alP08G5_XuA', icon: <FileText size={18} />, external: true },
  { label: 'Gallery', href: 'https://icta.go.ke/gallery', icon: <Image size={18} />, external: true },
  { label: 'Downloads', href: 'https://www.icta.go.ke/downloads', icon: <Download size={18} />, external: true },
];

// Main navigation items with dropdowns
const mainNavItems = [
  { label: 'Connected Africa 2026', href: 'https://connected.go.ke/', icon: <Globe size={18} />, external: true, dropdown: null },
  {
    label: 'Who We Are',
    icon: <Users size={18} />,
    dropdown: [
      { label: 'About Us', href: 'https://icta.go.ke/page?q=6&type=about_ict_authority', external: true },
      { label: 'Board of Directors', href: 'https://icta.go.ke/board', external: true },
      { label: 'Management', href: 'https://icta.go.ke/management', external: true },
      { label: 'Our Partnerships', href: 'https://icta.go.ke/page?q=240&type=partnerships', external: true },
      { label: 'Our Regional Offices', href: 'https://icta.go.ke/contact-us', external: true },
    ]
  },
  {
    label: 'Projects',
    icon: <Briefcase size={18} />,
    dropdown: [
      { label: 'Kenya Open Data', href: 'https://icta.go.ke/page?q=100&type=projects', external: true },
      { label: 'Smart County', href: 'https://icta.go.ke/page?q=101&type=projects', external: true },
      { label: 'TIMS', href: 'https://icta.go.ke/page?q=102&type=projects', external: true },
      { label: 'IFMIS', href: 'https://icta.go.ke/page?q=103&type=projects', external: true },
      { label: 'Center of Excellence', href: 'https://icta.go.ke/page?q=104&type=projects', external: true },
      { label: 'The GDC', href: 'https://icta.go.ke/page?q=204&type=projects', external: true },
      { label: 'Public Key Infrastructure', href: 'https://icta.go.ke/page?q=205&type=projects', external: true },
    ]
  },
  {
    label: 'ICT Standards',
    icon: <Shield size={18} />,
    dropdown: [
      { label: 'ICT Standards', href: 'https://icta.go.ke/ict-standards', external: true },
      { label: 'ICT Supplier Accreditation', href: 'https://accreditation.icta.go.ke/', external: true },
      { label: 'ICT Professionals Accreditation', href: 'https://professionals.icta.go.ke/', external: true },
      { label: 'MCDA Assessment', href: 'https://sas.icta.go.ke/', external: true },
      { label: 'Masomo Learning Portal', href: 'https://masomo.icta.go.ke/', external: true },
    ]
  },
  { label: 'Accreditation', href: 'https://accreditation.icta.go.ke/', icon: <Award size={18} />, external: true, dropdown: null },
  { label: 'Tenders', href: 'https://icta.go.ke/tenders', icon: <FileText size={18} />, external: true, dropdown: null },
  { label: 'Careers', href: 'https://icta.go.ke/careers', icon: <Briefcase size={18} />, external: true, dropdown: null },
  { label: 'For Citizens', href: 'https://icta.go.ke/page?q=17&type=citizens', icon: <Users size={18} />, external: true, dropdown: null },
  { label: 'Partnerships', href: 'https://icta.go.ke/page?q=28&type=investors', icon: <Users size={18} />, external: true, dropdown: null },
  { label: 'Media Center', href: 'https://icta.go.ke/news', icon: <Megaphone size={18} />, external: true, dropdown: null },
  {
    label: 'Resources',
    icon: <Folder size={18} />,
    dropdown: [
      { label: 'Presentations', href: 'https://icta.go.ke/presentations', external: true },
      { label: 'Tenders', href: 'https://icta.go.ke/tenders', external: true },
    ]
  },
  { label: 'Feedback', href: 'https://icta.go.ke/contact-us', icon: <MessageCircle size={18} />, external: true, dropdown: null },
];

// Haptic feedback function
const triggerHaptic = () => {
  if (window.navigator && window.navigator.vibrate) {
    window.navigator.vibrate(50);
  }
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({});
  const sidebarRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = (name: string) => {
    triggerHaptic();
    setOpenDropdowns(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const handleToggle = () => {
    triggerHaptic();
    toggleSidebar();
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        handleToggle();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isOpen && event.key === 'Escape') {
        handleToggle();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.dataset.scrollY = scrollY.toString();
    } else {
      const scrollY = parseInt(document.body.dataset.scrollY || '0');
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      window.scrollTo(0, scrollY);
      delete document.body.dataset.scrollY;
    }
  }, [isOpen]);

  // Swipe to close on touch devices
  useEffect(() => {
    let touchStartX = 0;
    const onTouchStart = (e: TouchEvent) => { touchStartX = e.changedTouches[0].clientX; };
    const onTouchMove = (e: TouchEvent) => {
      if (!isOpen) return;
      const deltaX = e.changedTouches[0].clientX - touchStartX;
      if (deltaX < -50) {
        handleToggle();
      }
    };
    window.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchmove', onTouchMove);
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, [isOpen]);

  return (
    <>
      {/* Overlay /}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden"
          onClick={handleToggle}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar /}
      <aside
        ref={sidebarRef}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
        className={`fixed top-0 left-0 h-full w-80 z-50 shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } bg-white dark:bg-surface border-r border-gray-200 dark:border-gray-800`}
        style={{ height: '100dvh' }}
      >
        {/* Header /}
        <div className="sticky top-0 bg-primary p-4 text-white flex justify-between items-center">
            <a href="https://icta.go.ke/" target="_blank" rel="noopener noreferrer" className="flex items-center">
              <img 
                src="/assets/logo1.png" 
                alt="ICTA logo" 
                className="h-12 w-auto brightness-0 invert"
              />
            </a>
          <button 
            onClick={handleToggle} 
            className="p-1 hover:bg-white/20 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Close sidebar"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Navigation Links /}
        <div className="flex-1 p-4 space-y-6 overflow-y-auto">
          {/* Quick Links Section /}
          <div>
            <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-3 px-2">Quick Links</h3>
            <div className="space-y-1">
              {topNavLinks.map((link) => (
                <SidebarItem
                  key={link.label}
                  icon={link.icon}
                  label={link.label}
                  href={link.href}
                  external={link.external}
                  onClick={handleToggle}
                />
              ))}
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-800" />
          
          {/* Main Navigation /}
          <div>
            <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-3 px-2">Navigation</h3>
            <div className="space-y-1">
              {mainNavItems.map((item) => {
                if (item.dropdown && item.dropdown.length > 0) {
                  return (
                    <SidebarDropdown
                      key={item.label}
                      name={item.label.toLowerCase().replace(/\s/g, '-')}
                      label={item.label}
                      icon={item.icon}
                      items={item.dropdown}
                      isOpen={openDropdowns[item.label] || false}
                      onToggle={() => toggleDropdown(item.label)}
                      onItemClick={handleToggle}
                    />
                  );
                }
                return (
                  <SidebarItem
                    key={item.label}
                    icon={item.icon}
                    label={item.label}
                    href={item.href!}
                    external={item.external}
                    onClick={handleToggle}
                  />
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Footer /}
        <SidebarFooter />
      </aside>
    </>
  );
};

export default Sidebar;*/


/*// frontend/src/components/Sidebar/Sidebar.tsx - Main Sidebar component
import React, { useState } from 'react';
import { X, Menu, Home, Info, Briefcase, Shield, Award, FileText, Users, Megaphone, Folder, MessageCircle, Globe, Mail, File, BookOpen, Image, Download, ExternalLink } from 'lucide-react';
import SidebarItem from './SidebarItem';
import SidebarDropdown from './SidebarDropdown';
import SidebarFooter from './SidebarFooter';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

// Top quick links
const topNavLinks = [
  { label: 'info@ict.go.ke', href: 'mailto:info@ict.go.ke', icon: <Mail size={18} />, external: true },
  { label: 'Strategic Plan 2024-2027', href: 'https://cms.icta.go.ke/sites/default/files/2024-09/SP_2024_-_2027_0912.pdf', icon: <FileText size={18} />, external: true },
  { label: 'National Digital Masterplan', href: 'https://cms.icta.go.ke/sites/default/files/2022-09/Kenya_Digital_Master_Plan_2022-2023.pdf', icon: <BookOpen size={18} />, external: true },
  { label: 'Service Charter (Audio)', href: 'https://www.youtube.com/watch?v=alP08G5_XuA', icon: <FileText size={18} />, external: true },
  { label: 'Gallery', href: 'https://icta.go.ke/gallery', icon: <Image size={18} />, external: true },
  { label: 'Downloads', href: 'https://www.icta.go.ke/downloads', icon: <Download size={18} />, external: true },
];

// Main navigation items with dropdowns
const mainNavItems = [
  { label: 'Connected Africa 2026', href: 'https://connected.go.ke/', icon: <Globe size={18} />, external: true, dropdown: null },
  {
    label: 'Who We Are',
    icon: <Users size={18} />,
    dropdown: [
      { label: 'About Us', href: 'https://icta.go.ke/page?q=6&type=about_ict_authority', external: true },
      { label: 'Board of Directors', href: 'https://icta.go.ke/board', external: true },
      { label: 'Management', href: 'https://icta.go.ke/management', external: true },
      { label: 'Our Partnerships', href: 'https://icta.go.ke/page?q=240&type=partnerships', external: true },
      { label: 'Our Regional Offices', href: 'https://icta.go.ke/contact-us', external: true },
    ]
  },
  {
    label: 'Projects',
    icon: <Briefcase size={18} />,
    dropdown: [
      { label: 'Kenya Open Data', href: 'https://icta.go.ke/page?q=100&type=projects', external: true },
      { label: 'Smart County', href: 'https://icta.go.ke/page?q=101&type=projects', external: true },
      { label: 'TIMS', href: 'https://icta.go.ke/page?q=102&type=projects', external: true },
      { label: 'IFMIS', href: 'https://icta.go.ke/page?q=103&type=projects', external: true },
      { label: 'Center of Excellence', href: 'https://icta.go.ke/page?q=104&type=projects', external: true },
      { label: 'The GDC', href: 'https://icta.go.ke/page?q=204&type=projects', external: true },
      { label: 'Public Key Infrastructure', href: 'https://icta.go.ke/page?q=205&type=projects', external: true },
    ]
  },
  {
    label: 'ICT Standards',
    icon: <Shield size={18} />,
    dropdown: [
      { label: 'ICT Standards', href: 'https://icta.go.ke/ict-standards', external: true },
      { label: 'ICT Supplier Accreditation', href: 'https://accreditation.icta.go.ke/', external: true },
      { label: 'ICT Professionals Accreditation', href: 'https://professionals.icta.go.ke/', external: true },
      { label: 'MCDA Assessment', href: 'https://sas.icta.go.ke/', external: true },
      { label: 'Masomo Learning Portal', href: 'https://masomo.icta.go.ke/', external: true },
    ]
  },
  { label: 'Accreditation', href: 'https://accreditation.icta.go.ke/', icon: <Award size={18} />, external: true, dropdown: null },
  { label: 'Tenders', href: 'https://icta.go.ke/tenders', icon: <FileText size={18} />, external: true, dropdown: null },
  { label: 'Careers', href: 'https://icta.go.ke/careers', icon: <Briefcase size={18} />, external: true, dropdown: null },
  { label: 'For Citizens', href: 'https://icta.go.ke/page?q=17&type=citizens', icon: <Users size={18} />, external: true, dropdown: null },
  { label: 'Partnerships', href: 'https://icta.go.ke/page?q=28&type=investors', icon: <Users size={18} />, external: true, dropdown: null },
  { label: 'Media Center', href: 'https://icta.go.ke/news', icon: <Megaphone size={18} />, external: true, dropdown: null },
  {
    label: 'Resources',
    icon: <Folder size={18} />,
    dropdown: [
      { label: 'Presentations', href: 'https://icta.go.ke/presentations', external: true },
      { label: 'Tenders', href: 'https://icta.go.ke/tenders', external: true },
    ]
  },
  { label: 'Feedback', href: 'https://icta.go.ke/contact-us', icon: <MessageCircle size={18} />, external: true, dropdown: null },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({});

  const toggleDropdown = (name: string) => {
    setOpenDropdowns(prev => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <>
      {/* Overlay /}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar }
      <div className={`fixed top-0 left-0 h-full w-80 bg-white dark:bg-surface z-50 shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Header /}
        <div className="sticky top-0 bg-primary p-4 text-white flex justify-between items-center">
          <div>
            <h2 className="font-bold text-lg">ICT AUTHORITY</h2>
            <p className="text-xs opacity-80">Republic of Kenya</p>
          </div>
          <button onClick={toggleSidebar} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
            <X size={24} />
          </button>
        </div>
        
        {/* Navigation Links /}
        <div className="flex-1 p-4 space-y-6 overflow-y-auto">
          {/* Quick Links Section /}
          <div>
            <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-3 px-2">Quick Links</h3>
            <div className="space-y-1">
              {topNavLinks.map((link) => (
                <SidebarItem
                  key={link.label}
                  icon={link.icon}
                  label={link.label}
                  href={link.href}
                  external={link.external}
                  onClick={toggleSidebar}
                />
              ))}
            </div>
          </div>
          
          <div className="border-t border-border" />
          
          {/* Main Navigation /}
          <div>
            <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-3 px-2">Navigation</h3>
            <div className="space-y-1">
              {mainNavItems.map((item) => {
                if (item.dropdown && item.dropdown.length > 0) {
                  return (
                    <SidebarDropdown
                      key={item.label}
                      name={item.label.toLowerCase().replace(/\s/g, '-')}
                      label={item.label}
                      icon={item.icon}
                      items={item.dropdown}
                      isOpen={openDropdowns[item.label] || false}
                      onToggle={() => toggleDropdown(item.label)}
                      onItemClick={toggleSidebar}
                    />
                  );
                }
                return (
                  <SidebarItem
                    key={item.label}
                    icon={item.icon}
                    label={item.label}
                    href={item.href!}
                    external={item.external}
                    onClick={toggleSidebar}
                  />
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Footer /}
        <SidebarFooter />
      </div>
    </>
  );
};

export default Sidebar;*/

/*last stable lis version
// src/components/Sidebar/Sidebar.tsx
import * as React from "react";
import { Link } from "react-router-dom";
import SidebarItem from "./SidebarItem";
import SidebarFooter from "./SidebarFooter";
import { navlinks } from "../../data/navlinks";
import { useContent } from "../../content/useContext";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  userRole?: string;
}

export default function Sidebar(props: SidebarProps) {
  const { isOpen, toggleSidebar } = props;
  const sidebarRef = React.useRef<HTMLDivElement | null>(null);
  const { content } = useContent();
  const mobileNavlinks = (content && content.navigation) ? (content.navigation as typeof navlinks) : navlinks;

  // Close on outside click
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        toggleSidebar();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, toggleSidebar]);

  // Close on Escape key
  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (isOpen && event.key === 'Escape') {
        toggleSidebar();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, toggleSidebar]);

  // Prevent body scroll
  // Inside Sidebar component, replace the scroll lock useEffect:
React.useEffect(() => {
  if (isOpen) {
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.dataset.scrollY = scrollY.toString();
  } else {
    const scrollY = parseInt(document.body.dataset.scrollY || '0');
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    window.scrollTo(0, scrollY);
    delete document.body.dataset.scrollY;
  }
}, [isOpen]);
  /*React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);/

  // Swipe left to close (on touch devices)
  React.useEffect(() => {
    let touchStartX = 0;
    const onTouchStart = (e: TouchEvent) => { touchStartX = e.changedTouches[0].clientX; };
    const onTouchMove = (e: TouchEvent) => {
      if (!isOpen) return;
      const deltaX = e.changedTouches[0].clientX - touchStartX;
      if (deltaX < -50) { // swipe left
        toggleSidebar();
      }
    };
    window.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchmove', onTouchMove);
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, [isOpen, toggleSidebar]);

  // Haptic feedback on open (ES5 safe)
  const handleToggle = () => {
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(50);
    }
    toggleSidebar();
  };

  return (
    <React.Fragment>
      {/* Overlay /}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={handleToggle}
        aria-hidden="true"
      />
      {/* Sidebar Panel /}
      <aside
        ref={sidebarRef}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
        className={`fixed top-0 h-full w-[280px] z-[101] flex flex-col p-6 transition-transform duration-300 ease-in-out border-r border-border bg-white dark:bg-background-dark shadow-xl md:hidden sidebar-solid-fallback ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ height: '100dvh' }} // modern viewport unit
      >
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-primary/10">
          <Link to="/" className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary rounded" onClick={handleToggle}>
            <div className="size-8 text-primary">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z" fill="currentColor"></path>
              </svg>
            </div>
            <span className="font-bold text-xl text-[#0d1b14] dark:text-white">LIS</span>
          </Link>
          <button
            onClick={handleToggle}
            className="p-2 rounded-lg bg-transparent hover:bg-black/10 dark:hover:bg-white/10 text-[#0d1b14] dark:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Close sidebar"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <nav className="flex-grow flex flex-col gap-1" aria-label="Mobile navigation">
           {mobileNavlinks.map(function(link, idx) {
              return (
                <SidebarItem
                  key={idx}
                  icon={<span className="material-symbols-outlined text-xl">{link.icon}</span>}
                  label={link.name}
                  href={link.href}
                  onClick={function() { handleToggle(); }}
                />
              );
            })}
          {/*{mobileNavlinks.map(function(link, idx) {
            return (
              <SidebarItem
                key={idx}
                icon={link.icon}
                label={link.name}
                href={link.href}
                onClick={function() { handleToggle(); }}
              />
            );
          })}/}
          <div className="mt-4 pt-4 border-t border-primary/10">
            <button className="w-full bg-primary hover:bg-primary/90 text-[#0d1b14] font-bold py-3 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
              Contact Us
            </button>
          </div>
        </nav>
        <SidebarFooter />
      </aside>
    </React.Fragment>
  );
}*/
