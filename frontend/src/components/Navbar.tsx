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
      {/* Top Navigation Bar - Red background */}
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

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="https://icta.go.ke/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
              <img 
                src="/assets/logo1.png" 
                alt="ICTA logo" 
                className="h-12 w-auto"
              />
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-5 flex-1 justify-end" ref={navRef}>
            <div className="flex items-center gap-4 xl:gap-5">
              {visibleItems.map((item) => renderNavItem(item))}
              
              {/* More Dropdown for overflow items */}
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
            
            {/* Right Section */}
            <div ref={rightSectionRef} className="flex items-center gap-2 flex-shrink-0">
              <ThemeToggle />
              <button className="p-2 rounded-full hover:bg-green-100 dark:hover:bg-green-900/20 text-slate-700 dark:text-slate-300 transition-colors">
                <span className="material-symbols-outlined text-xl">search</span>
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
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

export default Navbar;
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
