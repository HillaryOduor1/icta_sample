// frontend/src/components/Navbar.tsx
import React, { useState, useRef, useEffect } from 'react';
import { ThemeToggle } from './themeToggle';
import { useContent } from '../content/useContext';

var triggerHaptic = function() {
  try {
    if (window.navigator && typeof window.navigator.vibrate === "function") {
      window.navigator.vibrate(50);
    }
  } catch (e) {}
};

var Navbar = function({ isSidebarOpen, setIsSidebarOpen }) {
  var { content, isLoading } = useContent();
  var [openDropdown, setOpenDropdown] = useState(null);
  var [openNestedDropdown, setOpenNestedDropdown] = useState(null);
  var [visibleItems, setVisibleItems] = useState([]);
  var [moreItems, setMoreItems] = useState([]);
  var navRef = useRef(null);
  var rightSectionRef = useRef(null);

  var topNavLinks = (content.topNavLinks || []);
  var mainNavItems = (content.mainNavItems || []);

  var calculateVisibleItems = function() {
    if (!navRef.current || !rightSectionRef.current || mainNavItems.length === 0) {
      return;
    }
    
    var container = navRef.current;
    var containerWidth = container.offsetWidth;
    var rightSectionWidth = rightSectionRef.current.offsetWidth + 20;
    var availableWidth = containerWidth - rightSectionWidth - 100;
    
    var tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.visibility = 'hidden';
    tempDiv.style.display = 'flex';
    tempDiv.style.gap = '1rem';
    tempDiv.style.fontSize = '0.875rem';
    tempDiv.style.fontWeight = '500';
    document.body.appendChild(tempDiv);
    
    var itemWidths = [];
    for (var i = 0; i < mainNavItems.length; i++) {
      var item = mainNavItems[i];
      var span = document.createElement('span');
      span.textContent = item.label;
      span.style.whiteSpace = 'nowrap';
      span.style.padding = '0 0.5rem';
      tempDiv.appendChild(span);
      itemWidths.push(span.offsetWidth + 16);
      tempDiv.removeChild(span);
    }
    
    document.body.removeChild(tempDiv);
    
    var moreButtonWidth = 80;
    var totalWidth = 0;
    var visibleCount = 0;
    
    for (var j = 0; j < itemWidths.length; j++) {
      var remainingItems = itemWidths.length - j;
      var widthWithMore = totalWidth + itemWidths[j] + (remainingItems > 1 ? moreButtonWidth : 0);
      
      if (widthWithMore <= availableWidth) {
        totalWidth += itemWidths[j];
        visibleCount++;
      } else {
        break;
      }
    }
    
    if (visibleCount === 0 && mainNavItems.length > 0) {
      visibleCount = 1;
    }
    
    var visible = mainNavItems.slice(0, visibleCount);
    var hidden = mainNavItems.slice(visibleCount);
    
    setVisibleItems(visible);
    setMoreItems(hidden);
  };

  useEffect(function() {
    if (!isLoading && mainNavItems.length > 0) {
      var timer = setTimeout(calculateVisibleItems, 100);
      var handleResize = function() { 
        setTimeout(calculateVisibleItems, 50); 
      };
      window.addEventListener('resize', handleResize);
      return function() {
        clearTimeout(timer);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [isLoading, mainNavItems]);

  useEffect(function() {
    calculateVisibleItems();
  }, [mainNavItems]);

  useEffect(function() {
    var handleClickOutside = function(event) {
      var target = event.target;
      if (!target.closest('.dropdown-container') && !target.closest('.more-dropdown')) {
        setOpenDropdown(null);
        setOpenNestedDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return function() { 
      document.removeEventListener('mousedown', handleClickOutside); 
    };
  }, []);

  var handleDropdownToggle = function(label, event) {
    event.preventDefault();
    event.stopPropagation();
    triggerHaptic();
    setOpenDropdown(openDropdown === label ? null : label);
    setOpenNestedDropdown(null);
  };

  var renderNavItem = function(item) {
    if (item.dropdown && item.dropdown.length > 0) {
      return React.createElement(
        'div',
        { key: item.label, className: 'relative dropdown-container' },
        React.createElement(
          'button',
          {
            onClick: function(e) { 
              handleDropdownToggle(item.label, e); 
            },
            className: 'flex items-center gap-1 text-sm font-medium whitespace-nowrap hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded px-2 py-1'
          },
          item.label,
          React.createElement(
            'svg',
            {
              xmlns: 'http://www.w3.org/2000/svg',
              width: '14',
              height: '14',
              viewBox: '0 0 24 24',
              fill: 'none',
              stroke: 'currentColor',
              strokeWidth: '2',
              strokeLinecap: 'round',
              strokeLinejoin: 'round',
              className: 'transition-transform duration-200 ' + (openDropdown === item.label ? 'rotate-180' : '')
            },
            React.createElement('polyline', { points: '6 9 12 15 18 9' })
          )
        ),
        openDropdown === item.label && React.createElement(
          'div',
          { className: 'absolute top-full left-0 mt-2 w-64 bg-white dark:bg-surface rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50' },
          item.dropdown.map(function(subItem) {
            return React.createElement(
              'a',
              {
                key: subItem.label,
                href: subItem.href,
                target: '_blank',
                rel: 'noopener noreferrer',
                className: 'flex items-center justify-between px-4 py-3 text-sm hover:bg-primary/10 transition-colors hover:text-primary border-b border-gray-100 dark:border-gray-800 last:border-0 focus:outline-none focus:ring-2 focus:ring-primary',
                onClick: triggerHaptic
              },
              React.createElement('span', null, subItem.label),
              React.createElement(
                'svg',
                {
                  xmlns: 'http://www.w3.org/2000/svg',
                  width: '12',
                  height: '12',
                  viewBox: '0 0 24 24',
                  fill: 'none',
                  stroke: 'currentColor',
                  strokeWidth: '2',
                  strokeLinecap: 'round',
                  strokeLinejoin: 'round',
                  className: 'opacity-50 flex-shrink-0 ml-2'
                },
                React.createElement('path', { d: 'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6' }),
                React.createElement('polyline', { points: '15 3 21 3 21 9' }),
                React.createElement('line', { x1: '10', y1: '14', x2: '21', y2: '3' })
              )
            );
          })
        )
      );
    }
    
    return React.createElement(
      'div',
      { key: item.label, className: 'relative dropdown-container' },
      React.createElement(
        'a',
        {
          href: item.href || '#',
          target: item.external ? '_blank' : '_self',
          rel: item.external ? 'noopener noreferrer' : '',
          className: 'flex items-center gap-1 text-sm font-medium whitespace-nowrap hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded px-2 py-1',
          onClick: triggerHaptic
        },
        item.label,
        item.external && React.createElement(
          'svg',
          {
            xmlns: 'http://www.w3.org/2000/svg',
            width: '12',
            height: '12',
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            strokeWidth: '2',
            strokeLinecap: 'round',
            strokeLinejoin: 'round'
          },
          React.createElement('path', { d: 'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6' }),
          React.createElement('polyline', { points: '15 3 21 3 21 9' }),
          React.createElement('line', { x1: '10', y1: '14', x2: '21', y2: '3' })
        )
      )
    );
  };

  if (isLoading) {
    return React.createElement(
      'header',
      { className: 'sticky top-0 z-50 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-primary/10' },
      React.createElement(
        'div',
        { className: 'bg-primary hidden md:block' },
        React.createElement(
          'div',
          { className: 'max-w-7xl mx-auto px-4 py-2' },
          React.createElement(
            'div',
            { className: 'flex justify-end gap-3' },
            React.createElement('div', { className: 'h-4 w-20 bg-white/20 rounded animate-pulse' }),
            React.createElement('div', { className: 'h-4 w-32 bg-white/20 rounded animate-pulse' })
          )
        )
      ),
      React.createElement(
        'div',
        { className: 'max-w-7xl mx-auto px-4 py-3' },
        React.createElement(
          'div',
          { className: 'flex justify-between items-center' },
          React.createElement('div', { className: 'h-12 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse' }),
          React.createElement(
            'div',
            { className: 'hidden lg:flex gap-4' },
            React.createElement('div', { className: 'h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse' }),
            React.createElement('div', { className: 'h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse' })
          )
        )
      )
    );
  }

  return React.createElement(
    'header',
    { className: 'sticky top-0 z-50 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-primary/10' },
    topNavLinks.length > 0 && React.createElement(
      'div',
      { className: 'bg-primary hidden md:block' },
      React.createElement(
        'div',
        { className: 'max-w-7xl mx-auto px-4 py-2' },
        React.createElement(
          'div',
          { className: 'flex flex-wrap items-center justify-center md:justify-end gap-3 text-xs' },
          topNavLinks.map(function(link, idx) {
            return React.createElement(
              'a',
              {
                key: idx,
                href: link.href,
                target: '_blank',
                rel: 'noopener noreferrer',
                className: 'flex items-center gap-1 text-white hover:text-green-400 transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded px-2 py-1',
                onClick: triggerHaptic
              },
              link.icon === 'mail' && React.createElement(
                'svg',
                {
                  xmlns: 'http://www.w3.org/2000/svg',
                  width: '14',
                  height: '14',
                  viewBox: '0 0 24 24',
                  fill: 'none',
                  stroke: 'currentColor',
                  strokeWidth: '2',
                  strokeLinecap: 'round',
                  strokeLinejoin: 'round'
                },
                React.createElement('rect', { x: '2', y: '4', width: '20', height: '16', rx: '2' }),
                React.createElement('path', { d: 'm22 7-10 7L2 7' })
              ),
              React.createElement('span', null, link.label)
            );
          })
        )
      )
    ),
    React.createElement(
      'div',
      { className: 'max-w-7xl mx-auto px-4 py-3' },
      React.createElement(
        'div',
        { className: 'flex flex-wrap items-center justify-between gap-4' },
        React.createElement(
          'div',
          { className: 'flex-shrink-0', style: { width: '20%' } },
          React.createElement(
            'a',
            {
              href: 'https://icta.go.ke/',
              target: '_blank',
              rel: 'noopener noreferrer',
              className: 'flex items-center w-full focus:outline-none focus:ring-2 focus:ring-primary rounded'
            },
            React.createElement('img', {
              src: 'https://icta.go.ke//assets/images/ictalogo.png',
              alt: 'ICTA logo',
              className: 'logo-img',
              style: {
                objectFit: 'cover',
                width: '100%',
                height: 'auto',
                display: 'inline-block',
                position: 'relative',
                maxHeight: '60px'
              }
            })
          )
        ),
        React.createElement(
          'div',
          { className: 'hidden lg:flex items-center flex-1 gap-4 xl:gap-5 justify-end', ref: navRef },
          React.createElement(
            'div',
            { className: 'flex items-center gap-4 xl:gap-5' },
            visibleItems.map(function(item) { 
              return renderNavItem(item); 
            }),
            moreItems.length > 0 && React.createElement(
              'div',
              { className: 'relative more-dropdown' },
              React.createElement(
                'button',
                {
                  onClick: function(e) { 
                    handleDropdownToggle('more', e); 
                  },
                  className: 'flex items-center gap-1 text-sm font-medium whitespace-nowrap hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded px-2 py-1'
                },
                'More',
                React.createElement(
                  'svg',
                  {
                    xmlns: 'http://www.w3.org/2000/svg',
                    width: '14',
                    height: '14',
                    viewBox: '0 0 24 24',
                    fill: 'none',
                    stroke: 'currentColor',
                    strokeWidth: '2',
                    strokeLinecap: 'round',
                    strokeLinejoin: 'round',
                    className: 'transition-transform duration-200 ' + (openDropdown === 'more' ? 'rotate-180' : '')
                  },
                  React.createElement('polyline', { points: '6 9 12 15 18 9' })
                )
              ),
              openDropdown === 'more' && React.createElement(
                'div',
                { className: 'absolute top-full right-0 mt-2 w-80 bg-white dark:bg-surface rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 max-h-96 overflow-y-auto' },
                moreItems.map(function(item) {
                  if (item.dropdown && item.dropdown.length > 0) {
                    return React.createElement(
                      'div',
                      {
                        key: item.label,
                        className: 'relative border-b border-gray-100 dark:border-gray-800 last:border-0',
                        onMouseEnter: function() { 
                          setOpenNestedDropdown(item.label); 
                        },
                        onMouseLeave: function() { 
                          setOpenNestedDropdown(null); 
                        }
                      },
                      React.createElement(
                        'div',
                        { className: 'flex items-center justify-between px-4 py-3 text-sm hover:bg-primary/10 cursor-pointer' },
                        React.createElement('span', null, item.label),
                        React.createElement(
                          'svg',
                          {
                            xmlns: 'http://www.w3.org/2000/svg',
                            width: '14',
                            height: '14',
                            viewBox: '0 0 24 24',
                            fill: 'none',
                            stroke: 'currentColor',
                            strokeWidth: '2',
                            strokeLinecap: 'round',
                            strokeLinejoin: 'round'
                          },
                          React.createElement('polyline', { points: '9 18 15 12 9 6' })
                        )
                      ),
                      openNestedDropdown === item.label && React.createElement(
                        'div',
                        { className: 'absolute left-full top-0 mt-0 ml-1 w-64 bg-white dark:bg-surface rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-[60]' },
                        item.dropdown.map(function(subItem) {
                          return React.createElement(
                            'a',
                            {
                              key: subItem.label,
                              href: subItem.href,
                              target: '_blank',
                              rel: 'noopener noreferrer',
                              className: 'flex items-center justify-between px-4 py-3 text-sm hover:bg-primary/10 transition-colors hover:text-primary border-b border-gray-100 dark:border-gray-800 last:border-0 focus:outline-none focus:ring-2 focus:ring-primary',
                              onClick: triggerHaptic
                            },
                            React.createElement('span', null, subItem.label),
                            React.createElement(
                              'svg',
                              {
                                xmlns: 'http://www.w3.org/2000/svg',
                                width: '12',
                                height: '12',
                                viewBox: '0 0 24 24',
                                fill: 'none',
                                stroke: 'currentColor',
                                strokeWidth: '2',
                                strokeLinecap: 'round',
                                strokeLinejoin: 'round',
                                className: 'opacity-50 flex-shrink-0 ml-2'
                              },
                              React.createElement('path', { d: 'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6' }),
                              React.createElement('polyline', { points: '15 3 21 3 21 9' }),
                              React.createElement('line', { x1: '10', y1: '14', x2: '21', y2: '3' })
                            )
                          );
                        })
                      )
                    );
                  }
                  return React.createElement(
                    'a',
                    {
                      key: item.label,
                      href: item.href || '#',
                      target: '_blank',
                      rel: 'noopener noreferrer',
                      className: 'flex items-center justify-between px-4 py-3 text-sm hover:bg-primary/10 transition-colors hover:text-primary border-b border-gray-100 dark:border-gray-800 last:border-0 focus:outline-none focus:ring-2 focus:ring-primary',
                      onClick: triggerHaptic
                    },
                    React.createElement('span', null, item.label),
                    React.createElement(
                      'svg',
                      {
                        xmlns: 'http://www.w3.org/2000/svg',
                        width: '12',
                        height: '12',
                        viewBox: '0 0 24 24',
                        fill: 'none',
                        stroke: 'currentColor',
                        strokeWidth: '2',
                        strokeLinecap: 'round',
                        strokeLinejoin: 'round',
                        className: 'opacity-50 flex-shrink-0 ml-2'
                      },
                      React.createElement('path', { d: 'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6' }),
                      React.createElement('polyline', { points: '15 3 21 3 21 9' }),
                      React.createElement('line', { x1: '10', y1: '14', x2: '21', y2: '3' })
                    )
                  );
                })
              )
            )
          ),
          React.createElement(
            'div',
            { ref: rightSectionRef, className: 'flex items-center gap-2 flex-shrink-0' },
            React.createElement(ThemeToggle, null),
            React.createElement(
              'button',
              {
                className: 'p-2 rounded-full hover:bg-primary/10 transition-colors focus:outline-none focus:ring-2 focus:ring-primary',
                onClick: triggerHaptic,
                'aria-label': 'Search'
              },
              React.createElement('span', { className: 'material-symbols-outlined text-xl' }, 'search')
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'flex lg:hidden items-center gap-2' },
          React.createElement(ThemeToggle, null),
          React.createElement(
            'button',
            {
              onClick: function() { 
                triggerHaptic(); 
                setIsSidebarOpen(!isSidebarOpen); 
              },
              className: 'p-2 rounded-lg hover:bg-primary/10 transition-colors focus:outline-none focus:ring-2 focus:ring-primary'
            },
            isSidebarOpen ? 
              React.createElement(
                'svg',
                {
                  xmlns: 'http://www.w3.org/2000/svg',
                  width: '22',
                  height: '22',
                  viewBox: '0 0 24 24',
                  fill: 'none',
                  stroke: 'currentColor',
                  strokeWidth: '2',
                  strokeLinecap: 'round',
                  strokeLinejoin: 'round'
                },
                React.createElement('line', { x1: '18', y1: '6', x2: '6', y2: '18' }),
                React.createElement('line', { x1: '6', y1: '6', x2: '18', y2: '18' })
              ) :
              React.createElement(
                'svg',
                {
                  xmlns: 'http://www.w3.org/2000/svg',
                  width: '22',
                  height: '22',
                  viewBox: '0 0 24 24',
                  fill: 'none',
                  stroke: 'currentColor',
                  strokeWidth: '2',
                  strokeLinecap: 'round',
                  strokeLinejoin: 'round'
                },
                React.createElement('line', { x1: '3', y1: '12', x2: '21', y2: '12' }),
                React.createElement('line', { x1: '3', y1: '6', x2: '21', y2: '6' }),
                React.createElement('line', { x1: '3', y1: '18', x2: '21', y2: '18' })
              )
          )
        )
      )
    )
  );
};

export default Navbar;
/*last
// frontend/src/components/Navbar.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, ChevronDown, ChevronRight, Mail, ExternalLink } from 'lucide-react';
import { ThemeToggle } from './themeToggle';
import { useContent } from '../content/useContext';

interface DropdownItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  external?: boolean;
}

interface NavItem {
  label: string;
  href?: string;
  dropdown?: DropdownItem[];
  external?: boolean;
}

interface NavbarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (value: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const { content, isLoading } = useContent();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openNestedDropdown, setOpenNestedDropdown] = useState<string | null>(null);
  const [visibleItems, setVisibleItems] = useState<NavItem[]>([]);
  const [moreItems, setMoreItems] = useState<NavItem[]>([]);
  const navRef = useRef<HTMLDivElement>(null);
  const rightSectionRef = useRef<HTMLDivElement>(null);

  const topNavLinks = content.topNavLinks || [];
  const mainNavItems = content.mainNavItems || [];

  // Calculate visible items based on available width
  const calculateVisibleItems = () => {
    if (!navRef.current || !rightSectionRef.current || mainNavItems.length === 0) return;
    
    const container = navRef.current;
    const containerWidth = container.offsetWidth;
    const rightSectionWidth = rightSectionRef.current.offsetWidth + 20;
    
    const availableWidth = containerWidth - rightSectionWidth - 100;
    
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.visibility = 'hidden';
    tempDiv.style.display = 'flex';
    tempDiv.style.gap = '1rem';
    tempDiv.style.fontSize = '0.875rem';
    tempDiv.style.fontWeight = '500';
    document.body.appendChild(tempDiv);
    
    const itemWidths: number[] = [];
    mainNavItems.forEach(item => {
      const span = document.createElement('span');
      span.textContent = item.label;
      span.style.whiteSpace = 'nowrap';
      span.style.padding = '0 0.5rem';
      tempDiv.appendChild(span);
      itemWidths.push(span.offsetWidth + 16);
      tempDiv.removeChild(span);
    });
    
    document.body.removeChild(tempDiv);
    
    const moreButtonWidth = 80;
    let totalWidth = 0;
    let visibleCount = 0;
    
    for (let i = 0; i < itemWidths.length; i++) {
      const remainingItems = itemWidths.length - i;
      const widthWithMore = totalWidth + itemWidths[i] + (remainingItems > 1 ? moreButtonWidth : 0);
      
      if (widthWithMore <= availableWidth) {
        totalWidth += itemWidths[i];
        visibleCount++;
      } else {
        break;
      }
    }
    
    if (visibleCount === 0 && mainNavItems.length > 0) {
      visibleCount = 1;
    }
    
    const visible = mainNavItems.slice(0, visibleCount);
    const hidden = mainNavItems.slice(visibleCount);
    
    setVisibleItems(visible);
    setMoreItems(hidden);
  };

  useEffect(() => {
    if (!isLoading && mainNavItems.length > 0) {
      const timer = setTimeout(calculateVisibleItems, 100);
      const handleResize = () => setTimeout(calculateVisibleItems, 50);
      window.addEventListener('resize', handleResize);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [isLoading, mainNavItems]);

  useEffect(() => {
    calculateVisibleItems();
  }, [mainNavItems]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-container') && !target.closest('.more-dropdown')) {
        setOpenDropdown(null);
        setOpenNestedDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDropdownToggle = (label: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setOpenDropdown(openDropdown === label ? null : label);
    setOpenNestedDropdown(null);
  };

  const handleNestedDropdownEnter = (label: string) => {
    setOpenNestedDropdown(label);
  };

  const handleNestedDropdownLeave = () => {
    setOpenNestedDropdown(null);
  };

  const renderNavItem = (item: NavItem) => (
    <div key={item.label} className="relative dropdown-container">
      {item.dropdown && item.dropdown.length > 0 ? (
        <>
          <button
            onClick={(e) => handleDropdownToggle(item.label, e)}
            className="flex items-center gap-1 text-sm font-medium whitespace-nowrap hover:text-green-500 transition-colors"
          >
            {item.label}
            <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === item.label ? 'rotate-180' : ''}`} />
          </button>
          
          {openDropdown === item.label && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-surface rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
              {item.dropdown.map((subItem) => (
                <a
                  key={subItem.label}
                  href={subItem.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-4 py-3 text-sm hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors hover:text-green-600 border-b border-gray-100 dark:border-gray-800 last:border-0"
                >
                  <span>{subItem.label}</span>
                  <ExternalLink size={12} className="opacity-50 flex-shrink-0 ml-2" />
                </a>
              ))}
            </div>
          )}
        </>
      ) : (
        <a
          href={item.href || '#'}
          target={item.external ? "_blank" : "_self"}
          rel={item.external ? "noopener noreferrer" : ""}
          className="flex items-center gap-1 text-sm font-medium whitespace-nowrap hover:text-green-500 transition-colors"
        >
          {item.label}
          {item.external && <ExternalLink size={12} />}
        </a>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <header className="sticky top-0 z-50 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-primary/10">
        <div className="bg-primary">
          <div className="max-w-7xl mx-auto px-4 py-2">
            <div className="flex justify-end gap-3">
              <div className="h-4 w-20 bg-white/20 rounded animate-pulse"></div>
              <div className="h-4 w-32 bg-white/20 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="h-12 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="hidden lg:flex gap-4">
              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-primary/10">
      {/* Top Navigation Bar - Red background /}
      {topNavLinks.length > 0 && (
        <div className="bg-primary">
          <div className="max-w-7xl mx-auto px-4 py-2">
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 text-xs">
              {topNavLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-white hover:text-green-400 transition-colors"
                >
                  {link.icon === 'mail' && <Mail size={14} />}
                  <span>{link.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Navigation /}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Logo - Updated to match original ICTA logo sizing /}
          {/*<div className="flex-shrink-0 logo-sect">
            <a 
              href="https://icta.go.ke/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center"
            >
              <img 
                src="https://icta.go.ke//assets/images/ictalogo.png" 
                alt="ICTA logo" 
                className="logo-img"
                style={{ 
                  height: 'auto', 
                  width: 'auto',
                  display:'inline-block',
                  position:'relative',
                  maxHeight: '60px',
                  maxWidth: '200px'
                }}
              />
            </a>
          </div>/}
          <div className="flex-shrink-0 logo-sect" style={{ width: '20%' }}>
            <a 
              href="https://icta.go.ke/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center w-full"
            >
              <img 
                src="https://icta.go.ke//assets/images/ictalogo.png" 
                alt="ICTA logo" 
                className="logo-img"
                style={{ 
                  objectFit: 'cover',
                  width: '100%',
                  height: 'auto',
                  display: 'inline-block',
                  position: 'relative',
                  maxHeight: '60px'
                }}
              />
            </a>
          </div>

          {/* Desktop Navigation /}
          <div className="hidden lg:flex items-center flex-1 gap-4 xl:gap-5 justify-end" ref={navRef}>
            <div className="flex items-center gap-4 xl:gap-5">
              {visibleItems.map((item) => renderNavItem(item))}
              
              {/* More Dropdown for overflow items /}
              {moreItems.length > 0 && (
                <div className="relative more-dropdown">
                  <button
                    onClick={(e) => handleDropdownToggle('more', e)}
                    className="flex items-center gap-1 text-sm font-medium whitespace-nowrap hover:text-green-500 transition-colors"
                  >
                    More
                    <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === 'more' ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {openDropdown === 'more' && (
                    <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-surface rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 max-h-96 overflow-y-auto">
                      {moreItems.map((item) => (
                        item.dropdown && item.dropdown.length > 0 ? (
                          <div 
                            key={item.label} 
                            className="relative border-b border-gray-100 dark:border-gray-800 last:border-0"
                            onMouseEnter={() => handleNestedDropdownEnter(item.label)}
                            onMouseLeave={handleNestedDropdownLeave}
                          >
                            <div className="flex items-center justify-between px-4 py-3 text-sm hover:bg-green-50 dark:hover:bg-green-900/20 cursor-pointer">
                              <span>{item.label}</span>
                              <ChevronRight size={14} />
                            </div>
                            {openNestedDropdown === item.label && (
                              <div className="absolute left-full top-0 mt-0 ml-1 w-64 bg-white dark:bg-surface rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-[60]">
                                {item.dropdown.map((subItem) => (
                                  <a
                                    key={subItem.label}
                                    href={subItem.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between px-4 py-3 text-sm hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors hover:text-green-600 border-b border-gray-100 dark:border-gray-800 last:border-0"
                                  >
                                    <span>{subItem.label}</span>
                                    <ExternalLink size={12} className="opacity-50 flex-shrink-0 ml-2" />
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          <a
                            key={item.label}
                            href={item.href || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between px-4 py-3 text-sm hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors hover:text-green-600 border-b border-gray-100 dark:border-gray-800 last:border-0"
                          >
                            <span>{item.label}</span>
                            <ExternalLink size={12} className="opacity-50 flex-shrink-0 ml-2" />
                          </a>
                        )
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Right Section /}
            <div ref={rightSectionRef} className="flex items-center gap-2 flex-shrink-0">
              <ThemeToggle />
              <button className="p-2 rounded-full hover:bg-green-100 dark:hover:bg-green-900/20 text-slate-700 dark:text-slate-300 transition-colors">
                <span className="material-symbols-outlined text-xl">search</span>
              </button>
            </div>
          </div>

          {/* Mobile Menu Button /}
          <div className="flex lg:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/20 transition-colors"
            >
              {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;*/


/*stableish
// frontend/src/components/Navbar.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, ChevronDown, ChevronRight, Mail, ExternalLink } from 'lucide-react';
import { ThemeToggle } from './themeToggle';
import { useContent } from '../content/useContext';

interface DropdownItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  external?: boolean;
}

interface NavItem {
  label: string;
  href?: string;
  dropdown?: DropdownItem[];
  external?: boolean;
}

interface NavbarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (value: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const { content, isLoading } = useContent();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openNestedDropdown, setOpenNestedDropdown] = useState<string | null>(null);
  const [visibleItems, setVisibleItems] = useState<NavItem[]>([]);
  const [moreItems, setMoreItems] = useState<NavItem[]>([]);
  const navRef = useRef<HTMLDivElement>(null);
  const rightSectionRef = useRef<HTMLDivElement>(null);

  const topNavLinks = content.topNavLinks || [];
  const mainNavItems = content.mainNavItems || [];

  // Calculate visible items based on available width
  const calculateVisibleItems = () => {
    if (!navRef.current || !rightSectionRef.current || mainNavItems.length === 0) return;
    
    const container = navRef.current;
    const containerWidth = container.offsetWidth;
    const rightSectionWidth = rightSectionRef.current.offsetWidth + 20;
    
    const availableWidth = containerWidth - rightSectionWidth - 100;
    
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.visibility = 'hidden';
    tempDiv.style.display = 'flex';
    tempDiv.style.gap = '1rem';
    tempDiv.style.fontSize = '0.875rem';
    tempDiv.style.fontWeight = '500';
    document.body.appendChild(tempDiv);
    
    const itemWidths: number[] = [];
    mainNavItems.forEach(item => {
      const span = document.createElement('span');
      span.textContent = item.label;
      span.style.whiteSpace = 'nowrap';
      span.style.padding = '0 0.5rem';
      tempDiv.appendChild(span);
      itemWidths.push(span.offsetWidth + 16);
      tempDiv.removeChild(span);
    });
    
    document.body.removeChild(tempDiv);
    
    const moreButtonWidth = 80;
    let totalWidth = 0;
    let visibleCount = 0;
    
    for (let i = 0; i < itemWidths.length; i++) {
      const remainingItems = itemWidths.length - i;
      const widthWithMore = totalWidth + itemWidths[i] + (remainingItems > 1 ? moreButtonWidth : 0);
      
      if (widthWithMore <= availableWidth) {
        totalWidth += itemWidths[i];
        visibleCount++;
      } else {
        break;
      }
    }
    
    if (visibleCount === 0 && mainNavItems.length > 0) {
      visibleCount = 1;
    }
    
    const visible = mainNavItems.slice(0, visibleCount);
    const hidden = mainNavItems.slice(visibleCount);
    
    setVisibleItems(visible);
    setMoreItems(hidden);
  };

  useEffect(() => {
    if (!isLoading && mainNavItems.length > 0) {
      const timer = setTimeout(calculateVisibleItems, 100);
      const handleResize = () => setTimeout(calculateVisibleItems, 50);
      window.addEventListener('resize', handleResize);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [isLoading, mainNavItems]);

  useEffect(() => {
    calculateVisibleItems();
  }, [mainNavItems]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-container') && !target.closest('.more-dropdown')) {
        setOpenDropdown(null);
        setOpenNestedDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDropdownToggle = (label: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setOpenDropdown(openDropdown === label ? null : label);
    setOpenNestedDropdown(null);
  };

  const handleNestedDropdownEnter = (label: string) => {
    setOpenNestedDropdown(label);
  };

  const handleNestedDropdownLeave = () => {
    setOpenNestedDropdown(null);
  };

  const renderNavItem = (item: NavItem) => (
    <div key={item.label} className="relative dropdown-container">
      {item.dropdown && item.dropdown.length > 0 ? (
        <>
          <button
            onClick={(e) => handleDropdownToggle(item.label, e)}
            className="flex items-center gap-1 text-sm font-medium whitespace-nowrap hover:text-green-500 transition-colors"
          >
            {item.label}
            <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === item.label ? 'rotate-180' : ''}`} />
          </button>
          
          {openDropdown === item.label && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-surface rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
              {item.dropdown.map((subItem) => (
                <a
                  key={subItem.label}
                  href={subItem.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-4 py-3 text-sm hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors hover:text-green-600 border-b border-gray-100 dark:border-gray-800 last:border-0"
                >
                  <span>{subItem.label}</span>
                  <ExternalLink size={12} className="opacity-50 flex-shrink-0 ml-2" />
                </a>
              ))}
            </div>
          )}
        </>
      ) : (
        <a
          href={item.href || '#'}
          target={item.external ? "_blank" : "_self"}
          rel={item.external ? "noopener noreferrer" : ""}
          className="flex items-center gap-1 text-sm font-medium whitespace-nowrap hover:text-green-500 transition-colors"
        >
          {item.label}
          {item.external && <ExternalLink size={12} />}
        </a>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <header className="sticky top-0 z-50 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-primary/10">
        <div className="bg-primary">
          <div className="max-w-7xl mx-auto px-4 py-2">
            <div className="flex justify-end gap-3">
              <div className="h-4 w-20 bg-white/20 rounded animate-pulse"></div>
              <div className="h-4 w-32 bg-white/20 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="h-12 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="hidden lg:flex gap-4">
              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-primary/10">
      {/* Top Navigation Bar - Red background /}
      {topNavLinks.length > 0 && (
        <div className="bg-primary">
          <div className="max-w-7xl mx-auto px-4 py-2">
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 text-xs">
              {topNavLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-white hover:text-green-400 transition-colors"
                >
                  {link.icon === 'mail' && <Mail size={14} />}
                  <span>{link.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Navigation /}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Logo /}
          <div className="flex-shrink-0">
            <a href="https://icta.go.ke/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
              <img 
                src="/assets/logo1.png" 
                alt="ICTA logo" 
                className="h-12 w-auto"
              />
            </a>
          </div>

          {/* Desktop Navigation *}
          <div className="hidden lg:flex items-center gap-4 xl:gap-5 flex-1 justify-end" ref={navRef}>
            <div className="flex items-center gap-4 xl:gap-5">
              {visibleItems.map((item) => renderNavItem(item))}
              
              {/* More Dropdown for overflow items /}
              {moreItems.length > 0 && (
                <div className="relative more-dropdown">
                  <button
                    onClick={(e) => handleDropdownToggle('more', e)}
                    className="flex items-center gap-1 text-sm font-medium whitespace-nowrap hover:text-green-500 transition-colors"
                  >
                    More
                    <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === 'more' ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {openDropdown === 'more' && (
                    <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-surface rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 max-h-96 overflow-y-auto">
                      {moreItems.map((item) => (
                        item.dropdown && item.dropdown.length > 0 ? (
                          <div 
                            key={item.label} 
                            className="relative border-b border-gray-100 dark:border-gray-800 last:border-0"
                            onMouseEnter={() => handleNestedDropdownEnter(item.label)}
                            onMouseLeave={handleNestedDropdownLeave}
                          >
                            <div className="flex items-center justify-between px-4 py-3 text-sm hover:bg-green-50 dark:hover:bg-green-900/20 cursor-pointer">
                              <span>{item.label}</span>
                              <ChevronRight size={14} />
                            </div>
                            {openNestedDropdown === item.label && (
                              <div className="absolute left-full top-0 mt-0 ml-1 w-64 bg-white dark:bg-surface rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-[60]">
                                {item.dropdown.map((subItem) => (
                                  <a
                                    key={subItem.label}
                                    href={subItem.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between px-4 py-3 text-sm hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors hover:text-green-600 border-b border-gray-100 dark:border-gray-800 last:border-0"
                                  >
                                    <span>{subItem.label}</span>
                                    <ExternalLink size={12} className="opacity-50 flex-shrink-0 ml-2" />
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          <a
                            key={item.label}
                            href={item.href || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between px-4 py-3 text-sm hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors hover:text-green-600 border-b border-gray-100 dark:border-gray-800 last:border-0"
                          >
                            <span>{item.label}</span>
                            <ExternalLink size={12} className="opacity-50 flex-shrink-0 ml-2" />
                          </a>
                        )
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Right Section /}
            <div ref={rightSectionRef} className="flex items-center gap-2 flex-shrink-0">
              <ThemeToggle />
              <button className="p-2 rounded-full hover:bg-green-100 dark:hover:bg-green-900/20 text-slate-700 dark:text-slate-300 transition-colors">
                <span className="material-symbols-outlined text-xl">search</span>
              </button>
            </div>
          </div>

          {/* Mobile Menu Button /}
          <div className="flex lg:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/20 transition-colors"
            >
              {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;*/


/*// frontend/src/components/Navbar.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, ChevronDown, ChevronRight, Mail, ExternalLink } from 'lucide-react';
import { ThemeToggle } from './themeToggle';

interface DropdownItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  external?: boolean;
}

interface NavItem {
  label: string;
  href?: string;
  dropdown?: DropdownItem[];
  external?: boolean;
}

const topNavLinks = [
  { label: 'info@ict.go.ke', href: 'mailto:info@ict.go.ke', icon: <Mail size={14} />, external: true },
  { label: 'Strategic Plan 2024-2027', href: 'https://cms.icta.go.ke/sites/default/files/2024-09/SP_2024_-_2027_0912.pdf', external: true },
  { label: 'National Digital Masterplan', href: 'https://cms.icta.go.ke/sites/default/files/2022-09/Kenya_Digital_Master_Plan_2022-2023.pdf', external: true },
  { label: 'Service Charter (Audio)', href: 'https://www.youtube.com/watch?v=alP08G5_XuA', external: true },
  { label: 'Gallery', href: 'https://icta.go.ke/gallery', external: true },
  { label: 'Downloads', href: 'https://www.icta.go.ke/downloads', external: true },
];

const mainNavItems: NavItem[] = [
  { label: 'Connected Africa 2026', href: 'https://connected.go.ke/', external: true },
  {
    label: 'Who We Are',
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
    dropdown: [
      { label: 'ICT Standards', href: 'https://icta.go.ke/ict-standards', external: true },
      { label: 'ICT Supplier Accreditation', href: 'https://accreditation.icta.go.ke/', external: true },
      { label: 'ICT Professionals Accreditation', href: 'https://professionals.icta.go.ke/', external: true },
      { label: 'MCDA Assessment', href: 'https://sas.icta.go.ke/', external: true },
      { label: 'Masomo Learning Portal', href: 'https://masomo.icta.go.ke/', external: true },
    ]
  },
  { label: 'Accreditation', href: 'https://accreditation.icta.go.ke/', external: true },
  { label: 'Tenders', href: 'https://icta.go.ke/tenders', external: true },
  { label: 'Careers', href: 'https://icta.go.ke/careers', external: true },
  { label: 'For Citizens', href: 'https://icta.go.ke/page?q=17&type=citizens', external: true },
  { label: 'Partnerships', href: 'https://icta.go.ke/page?q=28&type=investors', external: true },
  { label: 'Media Center', href: 'https://icta.go.ke/news', external: true },
  {
    label: 'Resources',
    dropdown: [
      { label: 'Presentations', href: 'https://icta.go.ke/presentations', external: true },
      { label: 'Tenders', href: 'https://icta.go.ke/tenders', external: true },
    ]
  },
  { label: 'Feedback', href: 'https://icta.go.ke/contact-us', external: true },
];

interface NavbarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (value: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openNestedDropdown, setOpenNestedDropdown] = useState<string | null>(null);
  const [visibleItems, setVisibleItems] = useState<NavItem[]>([]);
  const [moreItems, setMoreItems] = useState<NavItem[]>([]);
  const navRef = useRef<HTMLDivElement>(null);
  const rightSectionRef = useRef<HTMLDivElement>(null);

  // Calculate visible items based on available width
  const calculateVisibleItems = () => {
    if (!navRef.current || !rightSectionRef.current) return;
    
    const container = navRef.current;
    const containerWidth = container.offsetWidth;
    const rightSectionWidth = rightSectionRef.current.offsetWidth + 20; // Add some padding
    
    // Calculate available width for nav items
    const availableWidth = containerWidth - rightSectionWidth - 100; // Extra buffer
    
    // Create temporary elements to measure each nav item
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.visibility = 'hidden';
    tempDiv.style.display = 'flex';
    tempDiv.style.gap = '1rem';
    tempDiv.style.fontSize = '0.875rem';
    tempDiv.style.fontWeight = '500';
    document.body.appendChild(tempDiv);
    
    const itemWidths: number[] = [];
    mainNavItems.forEach(item => {
      const span = document.createElement('span');
      span.textContent = item.label;
      span.style.whiteSpace = 'nowrap';
      span.style.padding = '0 0.5rem';
      tempDiv.appendChild(span);
      itemWidths.push(span.offsetWidth + 16); // Add padding and gap
      tempDiv.removeChild(span);
    });
    
    document.body.removeChild(tempDiv);
    
    // Determine how many items fit
    const moreButtonWidth = 80;
    let totalWidth = 0;
    let visibleCount = 0;
    
    for (let i = 0; i < itemWidths.length; i++) {
      const remainingItems = itemWidths.length - i;
      const widthWithMore = totalWidth + itemWidths[i] + (remainingItems > 1 ? moreButtonWidth : 0);
      
      if (widthWithMore <= availableWidth) {
        totalWidth += itemWidths[i];
        visibleCount++;
      } else {
        break;
      }
    }
    
    // Ensure at least one item is visible
    if (visibleCount === 0 && mainNavItems.length > 0) {
      visibleCount = 1;
    }
    
    const visible = mainNavItems.slice(0, visibleCount);
    const hidden = mainNavItems.slice(visibleCount);
    
    setVisibleItems(visible);
    setMoreItems(hidden);
  };

  // Handle resize with debounce
  useEffect(() => {
    // Initial calculation after DOM is ready
    const timer = setTimeout(calculateVisibleItems, 100);
    
    const handleResize = () => {
      setTimeout(calculateVisibleItems, 50);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Recalculate when dependencies change
  useEffect(() => {
    calculateVisibleItems();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-container') && !target.closest('.more-dropdown')) {
        setOpenDropdown(null);
        setOpenNestedDropdown(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDropdownToggle = (label: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setOpenDropdown(openDropdown === label ? null : label);
    setOpenNestedDropdown(null);
  };

  const handleNestedDropdownEnter = (label: string) => {
    setOpenNestedDropdown(label);
  };

  const handleNestedDropdownLeave = () => {
    setOpenNestedDropdown(null);
  };

  // Function to render a regular nav item (not in More dropdown)
  const renderNavItem = (item: NavItem) => (
    <div key={item.label} className="relative dropdown-container">
      {item.dropdown ? (
        <>
          <button
            onClick={(e) => handleDropdownToggle(item.label, e)}
            className="flex items-center gap-1 text-sm font-medium whitespace-nowrap hover:text-green-500 transition-colors"
          >
            {item.label}
            <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === item.label ? 'rotate-180' : ''}`} />
          </button>
          
          {openDropdown === item.label && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-surface rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
              {item.dropdown.map((subItem) => (
                <a
                  key={subItem.label}
                  href={subItem.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-4 py-3 text-sm hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors hover:text-green-600 border-b border-gray-100 dark:border-gray-800 last:border-0"
                >
                  <span>{subItem.label}</span>
                  <ExternalLink size={12} className="opacity-50 flex-shrink-0 ml-2" />
                </a>
              ))}
            </div>
          )}
        </>
      ) : (
        <a
          href={item.href}
          target={item.external ? "_blank" : "_self"}
          rel={item.external ? "noopener noreferrer" : ""}
          className="flex items-center gap-1 text-sm font-medium whitespace-nowrap hover:text-green-500 transition-colors"
        >
          {item.label}
          {item.external && <ExternalLink size={12} />}
        </a>
      )}
    </div>
  );

  return (
    <header className="sticky top-0 z-50 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-primary/10">
      {/* Top Navigation Bar - Red background /}
      <div className="bg-primary">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 text-xs">
            {topNavLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-white hover:text-green-400 transition-colors"
              >
                {link.icon}
                <span>{link.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Main Navigation /}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Logo /}
          <div className="flex-shrink-0">
            <a href="https://icta.go.ke/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
              <img 
                src="/assets/logo1.png" 
                alt="ICTA logo" 
                className="h-12 w-auto"
              />
            </a>
          </div>

          {/* Desktop Navigation /}
          <div className="hidden lg:flex items-center gap-4 xl:gap-5 flex-1 justify-end" ref={navRef}>
            <div className="flex items-center gap-4 xl:gap-5">
              {visibleItems.map((item) => renderNavItem(item))}
              
              {/* More Dropdown for overflow items /}
              {moreItems.length > 0 && (
                <div className="relative more-dropdown">
                  <button
                    onClick={(e) => handleDropdownToggle('more', e)}
                    className="flex items-center gap-1 text-sm font-medium whitespace-nowrap hover:text-green-500 transition-colors"
                  >
                    More
                    <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === 'more' ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {openDropdown === 'more' && (
                    <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-surface rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 max-h-96 overflow-y-auto">
                      {moreItems.map((item) => (
                        item.dropdown ? (
                          <div 
                            key={item.label} 
                            className="relative border-b border-gray-100 dark:border-gray-800 last:border-0"
                            onMouseEnter={() => handleNestedDropdownEnter(item.label)}
                            onMouseLeave={handleNestedDropdownLeave}
                          >
                            <div className="flex items-center justify-between px-4 py-3 text-sm hover:bg-green-50 dark:hover:bg-green-900/20 cursor-pointer">
                              <span>{item.label}</span>
                              <ChevronRight size={14} />
                            </div>
                            {openNestedDropdown === item.label && (
                              <div className="absolute left-full top-0 mt-0 ml-1 w-64 bg-white dark:bg-surface rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-[60]">
                                {item.dropdown.map((subItem) => (
                                  <a
                                    key={subItem.label}
                                    href={subItem.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between px-4 py-3 text-sm hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors hover:text-green-600 border-b border-gray-100 dark:border-gray-800 last:border-0"
                                  >
                                    <span>{subItem.label}</span>
                                    <ExternalLink size={12} className="opacity-50 flex-shrink-0 ml-2" />
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          <a
                            key={item.label}
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between px-4 py-3 text-sm hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors hover:text-green-600 border-b border-gray-100 dark:border-gray-800 last:border-0"
                          >
                            <span>{item.label}</span>
                            <ExternalLink size={12} className="opacity-50 flex-shrink-0 ml-2" />
                          </a>
                        )
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Right Section - Used for measurement /}
            <div ref={rightSectionRef} className="flex items-center gap-2 flex-shrink-0">
              <ThemeToggle />
              <button className="p-2 rounded-full hover:bg-green-100 dark:hover:bg-green-900/20 text-slate-700 dark:text-slate-300 transition-colors">
                <span className="material-symbols-outlined text-xl">search</span>
              </button>
              
            </div>
          </div>

          {/* Mobile Menu Button - Only visible on mobile /}
          <div className="flex lg:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/20 transition-colors"
            >
              {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;*/
