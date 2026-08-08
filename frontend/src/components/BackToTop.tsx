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
    } catch (e) {}
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

  // Using inline styles for maximum ES5 compatibility
  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      style={{
        position: 'fixed',
        right: '24px',
        bottom: '24px',
        zIndex: 9999,
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        backgroundColor: '#dc2626',
        color: '#ffffff',
        border: 'none',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.35)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#b91c1c';
        e.currentTarget.style.transform = 'scale(1.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = '#dc2626';
        e.currentTarget.style.transform = 'scale(1)';
      }}
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
