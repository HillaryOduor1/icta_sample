import React, { useState, useRef, useEffect } from 'react';
import SidebarItem from './SidebarItem';
import SidebarDropdown from './SidebarDropdown';
import SidebarFooter from './SidebarFooter';
import { useContent } from '../../content/useContext';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const triggerHaptic = (): void => {
  try {
    if (window.navigator && typeof window.navigator.vibrate === "function") {
      window.navigator.vibrate(50);
    }
  } catch (e) {}
};

const getIconComponent = (iconName: string): React.ReactNode => {
  const icons: Record<string, React.ReactNode> = {
    home: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2h-5v-7H9v7H5a2 2 0 0 1-2-2z" />
      </svg>
    ),
    info: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
    briefcase: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    )
  };
  return icons[iconName?.toLowerCase()] || (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const { content, isLoading } = useContent();
  const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({});
  const sidebarRef = useRef<HTMLDivElement>(null);
  const scrollYRef = useRef<number>(0);
  
  // Runtime theme detection for ES5 compatibility
  const isDarkMode = document.documentElement.classList.contains('dark');
  
  // Colors based on theme
  const sidebarBgColor = isDarkMode ? '#111111' : '#ffffff';
  const sidebarTextColor = isDarkMode ? '#ffffff' : '#111111';
  const sidebarBorderColor = isDarkMode ? '#374151' : '#e5e7eb';

  const topNavLinks = content.topNavLinks || [];
  const mainNavItems = content.mainNavItems || [];

  const sidebarNavItems = mainNavItems.map((item: any) => ({
    ...item,
    icon: getIconComponent(item.label?.toLowerCase().replace(/\s/g, ''))
  }));

  const toggleDropdown = (name: string): void => {
    triggerHaptic();
    setOpenDropdowns((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleToggle = (): void => {
    triggerHaptic();
    toggleSidebar();
  };

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      scrollYRef.current = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollYRef.current}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      window.scrollTo(0, scrollYRef.current);
    }
    
    return () => {
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
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        handleToggle();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => { document.removeEventListener("mousedown", handleClickOutside); };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (isOpen && event.key === 'Escape') {
        handleToggle();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => { document.removeEventListener('keydown', handleKeyDown); };
  }, [isOpen]);

  // Swipe to close on touch devices
  useEffect(() => {
    let touchStartX = 0;
    const onTouchStart = (e: TouchEvent): void => { 
      touchStartX = e.changedTouches[0].clientX; 
    };
    const onTouchMove = (e: TouchEvent): void => {
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
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              zIndex: 40
            }}
          />
        )}
        <aside 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '320px',
            height: '100%',
            zIndex: 50,
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.3s ease-in-out',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: sidebarBgColor,
            borderRight: `1px solid ${sidebarBorderColor}`
          }}
        >
          <div style={{ position: 'sticky', top: 0, backgroundColor: '#dc2626', padding: '1rem' }}>
            <div style={{ height: '48px', width: '128px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '4px', animation: 'pulse 1.5s infinite' }} />
          </div>
          <div style={{ flex: 1, padding: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} style={{ height: '40px', backgroundColor: isDarkMode ? '#374151' : '#e5e7eb', borderRadius: '4px', animation: 'pulse 1.5s infinite' }} />
              ))}
            </div>
          </div>
        </aside>
      </>
    );
  }

  return (
    <>
      {/* Overlay - ES5 compatible */}
      {isOpen && (
        <div
          onClick={handleToggle}
          aria-hidden="true"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            zIndex: 40,
            transition: 'opacity 0.3s ease'
          }}
        />
      )}
      <aside
        ref={sidebarRef}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '320px',
          height: '100%',
          zIndex: 50,
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease-in-out',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: sidebarBgColor,
          borderRight: `1px solid ${sidebarBorderColor}`
        }}
      >
        <div style={{ position: 'sticky', top: 0, backgroundColor: '#dc2626', padding: '1rem', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <a href="https://icta.go.ke/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src="https://icta.go.ke//assets/images/ictalogo.png"
              alt="ICTA logo"
              style={{ height: 'auto', width: 'auto', maxHeight: '48px', maxWidth: '150px', filter: 'brightness(0) invert(1)' }}
            />
          </a>
          <button
            onClick={handleToggle}
            style={{ padding: '4px', borderRadius: '8px', transition: 'background-color 0.2s', background: 'transparent', border: 'none', cursor: 'pointer', color: '#ffffff' }}
            aria-label="Close sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>
          {topNavLinks.length > 0 && (
            <div>
              <h3 style={{ fontSize: '0.75rem', fontWeight: '600', color: '#dc2626', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', paddingLeft: '0.5rem', paddingRight: '0.5rem' }}>Quick Links</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {topNavLinks.map((link: any, idx: number) => (
                  <SidebarItem
                    key={link.label || idx}
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    }
                    label={link.label}
                    href={link.href}
                    external={true}
                    onClick={handleToggle}
                  />
                ))}
              </div>
            </div>
          )}
          <div style={{ borderTop: `1px solid ${sidebarBorderColor}`, margin: '1rem 0' }} />
          {sidebarNavItems.length > 0 && (
            <div>
              <h3 style={{ fontSize: '0.75rem', fontWeight: '600', color: '#dc2626', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', paddingLeft: '0.5rem', paddingRight: '0.5rem' }}>Navigation</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {sidebarNavItems.map((item: any) => {
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
                      href={item.href}
                      external={item.external}
                      onClick={handleToggle}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
        <SidebarFooter />
      </aside>
    </>
  );
};

export default Sidebar;
