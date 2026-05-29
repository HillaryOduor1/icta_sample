// frontend/src/components/Sidebar/SidebarDropdown.tsx
import * as React from "react";
import SidebarItem from "./SidebarItem";

interface DropdownItem {
  label: string;
  href: string;
  external?: boolean;
}

interface SidebarDropdownProps {
  name: string;
  label: string;
  icon: React.ReactNode;
  items: DropdownItem[];
  isOpen: boolean;
  onToggle: () => void;
  onItemClick?: () => void;
}

var triggerHaptic = function() {
  try {
    if (window.navigator && typeof window.navigator.vibrate === "function") {
      window.navigator.vibrate(50);
    }
  } catch (e) {}
};

export default function SidebarDropdown(props: SidebarDropdownProps) {
  var isOpen = props.isOpen;
  var dropdownClass = "flex flex-col pl-8 mt-1 gap-1 overflow-hidden transition-all duration-300 " + (isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0");

  var handleToggle = function() {
    triggerHaptic();
    props.onToggle();
  };

  return React.createElement("div", { className: "flex flex-col" },
    React.createElement("button", {
      onClick: handleToggle,
      className: "flex items-center justify-between w-full px-4 py-3 rounded-lg transition-all hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary text-gray-700 dark:text-gray-300",
      "aria-expanded": isOpen,
      "aria-controls": "dropdown-" + props.name
    },
      React.createElement("div", { className: "flex items-center gap-3" },
        React.createElement("span", { className: "flex-shrink-0", "aria-hidden": "true" }, props.icon),
        React.createElement("span", { className: "text-sm" }, props.label)),
      React.createElement("span", { className: "transition-transform duration-200 text-xs " + (isOpen ? 'rotate-180' : '') }, "\u25BC")),
    React.createElement("div", { id: "dropdown-" + props.name, className: dropdownClass },
      props.items.map(function(item, i) {
        return React.createElement(SidebarItem, {
          key: i,
          icon: null,
          label: item.label,
          href: item.href,
          external: item.external,
          onClick: props.onItemClick
        });
      })));
}
/*
// frontend/src/components/Sidebar/SidebarDropdown.tsx
import * as React from "react";
import SidebarItem from "./SidebarItem";

interface DropdownItem {
  label: string;
  href: string;
  external?: boolean;
}

interface SidebarDropdownProps {
  name: string;
  label: string;
  icon: React.ReactNode;
  items: DropdownItem[];
  isOpen: boolean;
  onToggle: () => void;
  onItemClick?: () => void;
}

// Haptic feedback function
const triggerHaptic = () => {
  if (window.navigator && window.navigator.vibrate) {
    window.navigator.vibrate(50);
  }
};

export default function SidebarDropdown(props: SidebarDropdownProps) {
  var isOpen = props.isOpen;
  var dropdownClass =
    "flex flex-col pl-8 mt-1 gap-1 overflow-hidden transition-all duration-300 " +
    (isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0");

  const handleToggle = () => {
    triggerHaptic();
    props.onToggle();
  };

  return (
    <div className="flex flex-col">
      <button
        onClick={handleToggle}
        className="flex items-center justify-between w-full px-4 py-3 rounded-lg transition-all hover:bg-green-50 dark:hover:bg-green-900/20 focus:outline-none focus:ring-2 focus:ring-primary text-gray-700 dark:text-gray-300"
        aria-expanded={isOpen}
        aria-controls={`dropdown-${props.name}`}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl flex-shrink-0" aria-hidden="true">{props.icon}</span>
          <span className="text-sm">{props.label}</span>
        </div>
        <span className={`transition-transform duration-200 text-xs ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>
      <div id={`dropdown-${props.name}`} className={dropdownClass}>
        {props.items.map(function (item, i) {
          return (
            <SidebarItem
              key={i}
              icon={null}
              label={item.label}
              href={item.href}
              external={item.external}
              onClick={props.onItemClick}
            />
          );
        })}
      </div>
    </div>
  );
}*/

/*// frontend/src/components/Sidebar/SidebarDropdown.tsx
import * as React from "react";
import SidebarItem from "./SidebarItem";

interface DropdownItem {
  label: string;
  href: string;
  external?: boolean;
}

interface SidebarDropdownProps {
  name: string;
  label: string;
  icon: React.ReactNode;
  items: DropdownItem[];
  isOpen: boolean;
  onToggle: () => void;
  onItemClick?: () => void;
}

export default function SidebarDropdown(props: SidebarDropdownProps) {
  var isOpen = props.isOpen;
  var dropdownClass =
    "flex flex-col pl-8 mt-1 gap-1 overflow-hidden transition-all duration-300 " +
    (isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0");

  return (
    <div className="flex flex-col">
      <button
        onClick={props.onToggle}
        className="flex items-center justify-between w-full px-4 py-3 rounded-lg transition-all hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary text-gray-700 dark:text-gray-300"
        aria-expanded={isOpen}
        aria-controls={`dropdown-${props.name}`}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl flex-shrink-0" aria-hidden="true">{props.icon}</span>
          <span className="text-sm">{props.label}</span>
        </div>
        <span className={`transition-transform duration-200 text-xs ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>
      <div id={`dropdown-${props.name}`} className={dropdownClass}>
        {props.items.map(function (item, i) {
          return (
            <SidebarItem
              key={i}
              icon={null}
              label={item.label}
              href={item.href}
              external={item.external}
              onClick={props.onItemClick}
            />
          );
        })}
      </div>
    </div>
  );
}*/
/*last stable lis version
import * as React from "react";
import SidebarItem from "./SidebarItem";

interface SidebarDropdownProps {
  name: string;
  label: string;
  icon: React.ReactNode;
  items: Array<{ label: string; path: string }>;
  isOpen: boolean;
  onToggle: () => void;
  onItemClick?: () => void;
}

export default function SidebarDropdown(props: SidebarDropdownProps) {
  var isOpen = props.isOpen;
  var dropdownClass =
    "flex flex-col pl-8 mt-1 gap-1 overflow-hidden transition-all duration-300 " +
    (isOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0");

  return (
    <div className="flex flex-col">
      <button
        onClick={props.onToggle}
        className="flex items-center justify-between w-full px-3 py-2 rounded-md sidebar-link transition-colors hover:bg-pink-500/10 dark:hover:bg-pink-500/20 focus:outline-none focus:ring-2 focus:ring-primary"
        aria-expanded={isOpen}
        aria-controls={`dropdown-${props.name}`}
      >
        <div className="flex items-center gap-3">
          <span className="w-5 h-5" aria-hidden="true">{props.icon}</span>
          <span>{props.label}</span>
        </div>
        <span className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>
      <div id={`dropdown-${props.name}`} className={dropdownClass}>
        {props.items.map(function (item, i) {
          return (
            <SidebarItem
              key={i}
              icon={null}
              label={item.label}
              href={item.path}
              onClick={props.onItemClick}
            />
          );
        })}
      </div>
    </div>
  );
}*/
