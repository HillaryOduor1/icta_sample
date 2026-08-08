import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ThemeToggle } from './themeToggle';
import { useContent } from '../content/useContext';
import { useTheme } from './theme-provider';

interface DropdownItem {
  label: string;
  href: string;
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

const triggerHaptic = (): void => {
  try {
    if (window.navigator && typeof window.navigator.vibrate === "function") {
      window.navigator.vibrate(50);
    }
  } catch (e) {}
};

const Navbar: React.FC<NavbarProps> = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const { content, isLoading } = useContent();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openNestedDropdown, setOpenNestedDropdown] = useState<string | null>(null);
  const [visibleItems, setVisibleItems] = useState<NavItem[]>([]);
  const [moreItems, setMoreItems] = useState<NavItem[]>([]);
  const [logoLoaded, setLogoLoaded] = useState<boolean>(true);
  const navRef = useRef<HTMLDivElement>(null);
  const rightSectionRef = useRef<HTMLDivElement>(null);

  const { resolvedTheme, theme } = useTheme();

  // Determine the correct logo URL based on the current theme
  const getLogoSrc = useCallback((): string => {
    const currentTheme = resolvedTheme || theme;
    if (currentTheme === 'dark') {
      return '/assets/ictaLogo_dark.png';
    } else {
      return 'https://icta.go.ke//assets/images/ictalogo.png';
    }
  }, [resolvedTheme, theme]);

  const logoSrc = getLogoSrc();

  // Preload the appropriate logo and preconnect to its origin
  useEffect(() => {
    if (!logoSrc) return;

    // Preconnect to the logo's domain if it's external
    try {
      const url = new URL(logoSrc, window.location.origin);
      const domain = url.origin;
      if (domain && domain !== window.location.origin) {
        const preconnectLink = document.createElement('link');
        preconnectLink.rel = 'preconnect';
        preconnectLink.href = domain;
        document.head.appendChild(preconnectLink);
        return () => {
          if (preconnectLink.parentNode) {
            document.head.removeChild(preconnectLink);
          }
        };
      }
    } catch (_) {
      // ignore invalid URL
    }

    // Preload the logo image
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.as = 'image';
    preloadLink.href = logoSrc;
    preloadLink.setAttribute('fetchpriority', 'high');
    document.head.appendChild(preloadLink);

    return () => {
      if (preloadLink.parentNode) {
        document.head.removeChild(preloadLink);
      }
    };
  }, [logoSrc]);

  const topNavLinks = content.topNavLinks || [];
  const mainNavItems: NavItem[] = content.mainNavItems || [];

  const calculateVisibleItems = (): void => {
    if (!navRef.current || !rightSectionRef.current || mainNavItems.length === 0) {
      return;
    }
    
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
    for (let i = 0; i < mainNavItems.length; i++) {
      const item = mainNavItems[i];
      const span = document.createElement('span');
      span.textContent = item.label;
      span.style.whiteSpace = 'nowrap';
      span.style.padding = '0 0.5rem';
      tempDiv.appendChild(span);
      itemWidths.push(span.offsetWidth + 16);
      tempDiv.removeChild(span);
    }
    
    document.body.removeChild(tempDiv);
    
    const moreButtonWidth = 80;
    let totalWidth = 0;
    let visibleCount = 0;
    
    for (let j = 0; j < itemWidths.length; j++) {
      const remainingItems = itemWidths.length - j;
      const widthWithMore = totalWidth + itemWidths[j] + (remainingItems > 1 ? moreButtonWidth : 0);
      
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
    
    const visible = mainNavItems.slice(0, visibleCount);
    const hidden = mainNavItems.slice(visibleCount);
    
    setVisibleItems(visible);
    setMoreItems(hidden);
  };

  useEffect(() => {
    if (!isLoading && mainNavItems.length > 0) {
      const timer = setTimeout(calculateVisibleItems, 100);
      const handleResize = () => { 
        setTimeout(calculateVisibleItems, 50); 
      };
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
    const handleClickOutside = (event: MouseEvent): void => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-container') && !target.closest('.more-dropdown')) {
        setOpenDropdown(null);
        setOpenNestedDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => { 
      document.removeEventListener('mousedown', handleClickOutside); 
    };
  }, []);

  const handleDropdownToggle = (label: string, event: React.MouseEvent): void => {
    event.preventDefault();
    event.stopPropagation();
    triggerHaptic();
    setOpenDropdown(openDropdown === label ? null : label);
    setOpenNestedDropdown(null);
  };

  const renderNavItem = (item: NavItem): React.ReactNode => {
    if (item.dropdown && item.dropdown.length > 0) {
      return (
        <div key={item.label} className="relative dropdown-container">
          <button
            onClick={(e) => handleDropdownToggle(item.label, e)}
            className="flex items-center gap-1 text-sm font-medium whitespace-nowrap hover:text-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 rounded px-2 py-1"
          >
            {item.label}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform duration-200 ${openDropdown === item.label ? 'rotate-180' : ''}`}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          {openDropdown === item.label && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
              {item.dropdown.map((subItem) => (
                <a
                  key={subItem.label}
                  href={subItem.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-4 py-3 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors hover:text-red-600 border-b border-gray-100 dark:border-gray-800 last:border-0 focus:outline-none focus:ring-2 focus:ring-red-500"
                  onClick={triggerHaptic}
                >
                  <span>{subItem.label}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="opacity-50 flex-shrink-0 ml-2"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
              ))}
            </div>
          )}
        </div>
      );
    }
    
    return (
      <div key={item.label} className="relative dropdown-container">
        <a
          href={item.href || '#'}
          target={item.external ? '_blank' : '_self'}
          rel={item.external ? 'noopener noreferrer' : ''}
          className="flex items-center gap-1 text-sm font-medium whitespace-nowrap hover:text-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 rounded px-2 py-1"
          onClick={triggerHaptic}
        >
          {item.label}
          {item.external && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          )}
        </a>
      </div>
    );
  };

  if (isLoading) {
    return (
      <header className="sticky top-0 z-50 bg-gray-50/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-red-500/10">
        <div className="bg-red-600 hidden md:block">
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
    <header className="sticky top-0 z-50 bg-gray-50/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-red-500/10">
      {topNavLinks.length > 0 && (
        <div className="bg-red-600 hidden md:block">
          <div className="max-w-7xl mx-auto px-4 py-2">
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 text-xs">
              {topNavLinks.map((link: any, idx: number) => (
                <a
                  key={idx}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-white hover:text-green-400 transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded px-2 py-1"
                  onClick={triggerHaptic}
                >
                  {link.icon === 'mail' && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="m22 7-10 7L2 7" />
                    </svg>
                  )}
                  <span>{link.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* HAMBURGER MENU - Mobile only, far left */}
          <div className="flex lg:hidden items-center order-1">
            <button
              onClick={() => { 
                triggerHaptic(); 
                setIsSidebarOpen(!isSidebarOpen); 
              }}
              className="p-2 rounded-lg bg-transparent hover:bg-transparent focus:outline-none focus:ring-0 border-0 shadow-none"
              aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
            >
              {isSidebarOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          </div>
          
          {/* SPACER - Only visible on mobile, pushes logo to the right */}
          <div className="flex-1 lg:hidden order-2" />
          
          {/* LOGO - Mobile: far right (order-3), Desktop: far left (lg:order-1) */}
          <div 
            className="flex-shrink-0 order-3 lg:order-1"
            style={{ width: '20%', minWidth: '100px' }}
          >
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-end lg:justify-start focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
            >
              {logoLoaded ? (
                <img
                  src={logoSrc}
                  key={resolvedTheme || theme}
                  alt="ICTA logo"
                  className="logo-img"
                  style={{
                    objectFit: 'cover',
                    width: '100%',
                    height: 'auto',
                    maxHeight: '45px',
                    maxWidth: '140px'
                  }}
                  onLoad={() => setLogoLoaded(true)}
                  onError={() => setLogoLoaded(false)}
                />
              ) : (
                <div
                  style={{
                    width: '120px',
                    height: '45px',
                    backgroundColor: '#e0e0e0',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <span className="text-xs text-gray-500">ICTA</span>
                </div>
              )}
            </a>
          </div>
          
          {/* DESKTOP NAVIGATION - Middle (hidden on mobile) */}
          <div 
            className="hidden lg:flex items-center justify-center flex-1 lg:order-2"
            ref={navRef}
          >
            <div className="flex items-center gap-4 xl:gap-5">
              {visibleItems.map((item) => renderNavItem(item))}
              {moreItems.length > 0 && (
                <div className="relative more-dropdown">
                  <button
                    onClick={(e) => handleDropdownToggle('more', e)}
                    className="flex items-center gap-1 text-sm font-medium whitespace-nowrap hover:text-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 rounded px-2 py-1"
                  >
                    More
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`transition-transform duration-200 ${openDropdown === 'more' ? 'rotate-180' : ''}`}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  {openDropdown === 'more' && (
                    <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 max-h-96 overflow-y-auto">
                      {moreItems.map((item) => {
                        if (item.dropdown && item.dropdown.length > 0) {
                          return (
                            <div
                              key={item.label}
                              className="relative border-b border-gray-100 dark:border-gray-800 last:border-0"
                              onMouseEnter={() => setOpenNestedDropdown(item.label)}
                              onMouseLeave={() => setOpenNestedDropdown(null)}
                            >
                              <div className="flex items-center justify-between px-4 py-3 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer">
                                <span>{item.label}</span>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <polyline points="9 18 15 12 9 6" />
                                </svg>
                              </div>
                              {openNestedDropdown === item.label && (
                                <div className="absolute left-full top-0 mt-0 ml-1 w-64 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-[60]">
                                  {item.dropdown.map((subItem) => (
                                    <a
                                      key={subItem.label}
                                      href={subItem.href}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center justify-between px-4 py-3 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors hover:text-red-600 border-b border-gray-100 dark:border-gray-800 last:border-0 focus:outline-none focus:ring-2 focus:ring-red-500"
                                      onClick={triggerHaptic}
                                    >
                                      <span>{subItem.label}</span>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="12"
                                        height="12"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="opacity-50 flex-shrink-0 ml-2"
                                      >
                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                        <polyline points="15 3 21 3 21 9" />
                                        <line x1="10" y1="14" x2="21" y2="3" />
                                      </svg>
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        }
                        return (
                          <a
                            key={item.label}
                            href={item.href || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between px-4 py-3 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors hover:text-red-600 border-b border-gray-100 dark:border-gray-800 last:border-0 focus:outline-none focus:ring-2 focus:ring-red-500"
                            onClick={triggerHaptic}
                          >
                            <span>{item.label}</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="opacity-50 flex-shrink-0 ml-2"
                            >
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                              <polyline points="15 3 21 3 21 9" />
                              <line x1="10" y1="14" x2="21" y2="3" />
                            </svg>
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* RIGHT CONTROLS - Theme Toggle only on mobile, Theme Toggle + Search on desktop */}
          <div 
            ref={rightSectionRef}
            className="flex items-center gap-2 flex-shrink-0 order-4 lg:order-3"
          >
            <ThemeToggle />
            {/* Search button - hidden on mobile, visible on desktop /}
            <button
              className="hidden lg:flex p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 bg-transparent"
              onClick={triggerHaptic}
              aria-label="Search"
            >
              <span className="material-symbols-outlined text-xl">search</span>
            </button>*/}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

