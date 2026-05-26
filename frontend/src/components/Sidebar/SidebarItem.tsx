// frontend/src/components/Sidebar/SidebarItem.tsx
import * as React from "react";
import { Link } from "react-router-dom";

interface SidebarItemProps {
  icon?: React.ReactNode;
  label: string;
  href: string;
  onClick?: () => void;
  external?: boolean;
}

// Haptic feedback function
const triggerHaptic = () => {
  if (window.navigator && window.navigator.vibrate) {
    window.navigator.vibrate(50);
  }
};

export default function SidebarItem({ icon, label, href, onClick, external }: SidebarItemProps) {
  const location = useLocation();
  const isActive = location.pathname === href || (href.indexOf('#') !== -1 && location.pathname === '/');
  const hasHash = href.indexOf('#') !== -1;

  const handleClick = () => {
    triggerHaptic();
    if (onClick) onClick();
  };

  const className = `flex items-center gap-3 px-4 py-3 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary ${
    isActive 
      ? 'bg-primary text-white font-semibold' 
      : 'text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400'
  }`;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" onClick={handleClick} className={className}>
        {icon && <span className="text-xl flex-shrink-0" aria-hidden="true">{icon}</span>}
        <span className="text-sm">{label}</span>
      </a>
    );
  }

  if (hasHash) {
    return (
      <a href={href} onClick={handleClick} className={className} aria-current={isActive ? 'location' : undefined}>
        {icon && <span className="text-xl flex-shrink-0" aria-hidden="true">{icon}</span>}
        <span className="text-sm">{label}</span>
      </a>
    );
  }

  return (
    <Link to={href} onClick={handleClick} className={className} aria-current={isActive ? 'page' : undefined}>
      {icon && <span className="text-xl flex-shrink-0" aria-hidden="true">{icon}</span>}
      <span className="text-sm">{label}</span>
    </Link>
  );
}

// Add missing import
import { useLocation } from 'react-router-dom';

/*// frontend/src/components/Sidebar/SidebarItem.tsx
import * as React from "react";
import { Link, useLocation } from "react-router-dom";

interface SidebarItemProps {
  icon?: React.ReactNode;
  label: string;
  href: string;
  onClick?: () => void;
  external?: boolean;
}

export default function SidebarItem({ icon, label, href, onClick, external }: SidebarItemProps) {
  const location = useLocation();
  const isActive = location.pathname === href || (href.indexOf('#') !== -1 && location.pathname === '/');
  const hasHash = href.indexOf('#') !== -1;

  const handleClick = () => {
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(50);
    }
    if (onClick) onClick();
  };

  const className = `flex items-center gap-3 px-4 py-3 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary ${
    isActive 
      ? 'bg-primary text-white font-semibold' 
      : 'text-gray-700 dark:text-gray-300 hover:bg-primary/10'
  }`;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" onClick={handleClick} className={className}>
        {icon && <span className="text-xl flex-shrink-0" aria-hidden="true">{icon}</span>}
        <span className="text-sm">{label}</span>
      </a>
    );
  }

  if (hasHash) {
    return (
      <a href={href} onClick={handleClick} className={className} aria-current={isActive ? 'location' : undefined}>
        {icon && <span className="text-xl flex-shrink-0" aria-hidden="true">{icon}</span>}
        <span className="text-sm">{label}</span>
      </a>
    );
  }

  return (
    <Link to={href} onClick={handleClick} className={className} aria-current={isActive ? 'page' : undefined}>
      {icon && <span className="text-xl flex-shrink-0" aria-hidden="true">{icon}</span>}
      <span className="text-sm">{label}</span>
    </Link>
  );
}*/
/*last stable version lis
import * as React from "react";
import { Link, useLocation } from "react-router-dom";

interface SidebarItemProps {
  icon?: React.ReactNode;
  label: string;
  href: string;
  onClick?: () => void;
}

export default function SidebarItem({ icon, label, href, onClick }: SidebarItemProps) {
  const location = useLocation();
  const isActive = location.pathname === href || (href.indexOf('#') !== -1 && location.pathname === '/');
  const hasHash = href.indexOf('#') !== -1;

  const handleClick = () => {
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(50);
    }
    if (onClick) onClick();
  };

  const className = `flex items-center gap-3 px-4 py-3 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary ${
    isActive 
      ? 'bg-primary text-[#0d1b14] font-semibold' 
      : 'text-[#0d1b14] dark:text-white hover:bg-primary/10'
  }`;

  if (hasHash) {
    return (
      <a href={href} onClick={handleClick} className={className} aria-current={isActive ? 'location' : undefined}>
        {icon && <span className="text-xl flex-shrink-0" aria-hidden="true">{icon}</span>}
        <span className="text-sm">{label}</span>
      </a>
    );
  }

  return (
    <Link to={href} onClick={handleClick} className={className} aria-current={isActive ? 'page' : undefined}>
      {icon && <span className="text-xl flex-shrink-0" aria-hidden="true">{icon}</span>}
      <span className="text-sm">{label}</span>
    </Link>
  );
}*/
