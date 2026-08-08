
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
