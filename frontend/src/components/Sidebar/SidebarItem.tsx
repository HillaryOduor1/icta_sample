// frontend/src/components/Sidebar/SidebarItem.tsx
import * as React from "react";
import { Link, useLocation } from "react-router-dom";

interface SidebarItemProps {
  icon?: React.ReactNode;
  label: string;
  href: string;
  onClick?: () => void;
  external?: boolean;
}

var triggerHaptic = function() {
  try {
    if (window.navigator && typeof window.navigator.vibrate === "function") {
      window.navigator.vibrate(50);
    }
  } catch (e) {}
};

export default function SidebarItem({ icon, label, href, onClick, external }: SidebarItemProps) {
  var location = useLocation();
  var isActive = location.pathname === href || (href.indexOf('#') !== -1 && location.pathname === '/');
  var hasHash = href.indexOf('#') !== -1;

  var handleClick = function() {
    triggerHaptic();
    if (onClick) onClick();
  };

  var className = "flex items-center gap-3 px-4 py-3 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary " + (isActive 
    ? 'bg-primary text-white font-semibold' 
    : 'text-gray-700 dark:text-gray-300 hover:bg-primary/10 hover:text-primary');

  if (external) {
    return React.createElement("a", {
      href: href,
      target: "_blank",
      rel: "noopener noreferrer",
      onClick: handleClick,
      className: className
    }, icon && React.createElement("span", { className: "flex-shrink-0", "aria-hidden": "true" }, icon),
      React.createElement("span", { className: "text-sm" }, label));
  }

  if (hasHash) {
    return React.createElement("a", {
      href: href,
      onClick: handleClick,
      className: className,
      "aria-current": isActive ? 'location' : undefined
    }, icon && React.createElement("span", { className: "flex-shrink-0", "aria-hidden": "true" }, icon),
      React.createElement("span", { className: "text-sm" }, label));
  }

  return React.createElement(Link, {
    to: href,
    onClick: handleClick,
    className: className,
    "aria-current": isActive ? 'page' : undefined
  }, icon && React.createElement("span", { className: "flex-shrink-0", "aria-hidden": "true" }, icon),
    React.createElement("span", { className: "text-sm" }, label));
}

