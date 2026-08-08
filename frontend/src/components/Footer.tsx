import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useContent } from '../content/useContext';

interface IconProps {
  className?: string;
}

const FacebookIcon: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const TwitterIcon: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedInIcon: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C0.792 0 0 0.774 0 1.729v20.542C0 23.227 0.792 24 1.771 24h20.451c0.979 0 1.771-0.773 1.771-1.729V1.729C24 0.774 23.205 0 22.222 0h.003z" />
  </svg>
);

const EnvelopeIcon: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const ExternalLinkIcon: React.FC<IconProps> = ({ className = "w-3 h-3" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

interface LinkItem {
  name: string;
  href: string;
}

interface SocialLink {
  icon: string;
  href: string;
}

const Footer: React.FC = () => {
  const { isLoading } = useContent();
  const [newsletterEmail, setNewsletterEmail] = useState<string>('');
  const [newsletterStatus, setNewsletterStatus] = useState<{ type: 'success' | 'error' | ''; message: string }>({ type: '', message: '' });
  const [loading, setLoading] = useState<boolean>(false);

  // Memoize the background image URL (static in this case)
  const backgroundImage = useMemo(() => '/assets/bg_image.jpg', []);

  // Preconnect to the image origin (only if absolute URL)
  useEffect(() => {
    if (!backgroundImage) return;
    try {
      const url = new URL(backgroundImage, window.location.origin);
      const domain = url.origin;
      if (domain) {
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
  }, [backgroundImage]);

  // Preload the background image
  useEffect(() => {
    if (!backgroundImage) return;
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.as = 'image';
    preloadLink.href = backgroundImage;
    preloadLink.setAttribute('fetchpriority', 'high');
    document.head.appendChild(preloadLink);
    return () => {
      if (preloadLink.parentNode) {
        document.head.removeChild(preloadLink);
      }
    };
  }, [backgroundImage]);

  const quickLinksList: LinkItem[] = [
    { name: "Ministry of ICT", href: "http://www.information.go.ke/" },
    { name: "KEPROBA", href: "https://brand.ke/" },
    { name: "E-citizen Portal", href: "https://www.ecitizen.go.ke/" },
    { name: "Export Promotion Council(EPC)", href: "https://www.epckenya.org/" },
    { name: "The Export Processing Zones Authority", href: "https://epzakenya.com/" },
    { name: "Huduma Centre", href: "https://www.hudumakenya.go.ke/" },
    { name: "KenInvest", href: "http://www.invest.go.ke/" },
    { name: "Konza Techno City", href: "https://konza.go.ke/" },
    { name: "The Presidency", href: "https://www.president.go.ke/" },
    { name: "Kenya Vision 2030", href: "http://vision2030.go.ke/" },
    { name: "eWaste Kenya", href: "https://ewaste.go.ke/" }
  ];

  const affiliatedSitesList: LinkItem[] = [
    { name: "Connected Summit", href: "https://www.connected.go.ke/" },
    { name: "Smart Academy", href: "https://smartacademy.go.ke/" },
    { name: "DigiTalent", href: "https://digitalent.go.ke/" },
    { name: "Kenya Open Data", href: "https://opendata.go.ke/" }
  ];

  const resourcesList: LinkItem[] = [
    { name: "Tenders", href: "https://icta.go.ke/tenders" },
    { name: "Frequently Asked Questions (FAQs)", href: "https://icta.go.ke/faqs" },
    { name: "Contact Us", href: "https://icta.go.ke/contact-us" }
  ];

  const ictaLinksList: LinkItem[] = [
    { name: "WhiteBox", href: "https://whitebox.go.ke" }
  ];

  const socialLinksList: SocialLink[] = [
    { icon: "facebook", href: "https://web.facebook.com/ICTAuthorityKE?_rdc=1&_rdr" },
    { icon: "twitter", href: "https://twitter.com/ICTAuthorityKE" },
    { icon: "mail", href: "mailto:communications@ict.go.ke" },
    { icon: "linkedin", href: "https://www.linkedin.com/company/kenya-ict-board" }
  ];

  const triggerHaptic = useCallback((): void => {
    try {
      if (window.navigator && typeof window.navigator.vibrate === "function") {
        window.navigator.vibrate(50);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const handleNewsletterSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newsletterEmail)) {
      setNewsletterStatus({ type: 'error', message: 'Please enter a valid email address.' });
      return;
    }
    setLoading(true);
    setNewsletterStatus({ type: '', message: '' });
    try {
      const res = await fetch('https://icta.go.ke/app/newsletter/subscribe.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail })
      });
      if (!res.ok) throw new Error('Subscription failed');
      setNewsletterStatus({ type: 'success', message: 'Thank you for subscribing!' });
      setNewsletterEmail('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Subscription failed';
      setNewsletterStatus({ type: 'error', message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const getSocialIcon = (iconName: string): React.ReactNode => {
    switch (iconName?.toLowerCase()) {
      case 'facebook': return <FacebookIcon className="w-5 h-5 text-white group-hover:text-green-500 transition-colors" />;
      case 'twitter': return <TwitterIcon className="w-5 h-5 text-white group-hover:text-green-500 transition-colors" />;
      case 'linkedin': return <LinkedInIcon className="w-5 h-5 text-white group-hover:text-green-500 transition-colors" />;
      case 'mail': return <EnvelopeIcon className="w-5 h-5 text-white group-hover:text-green-500 transition-colors" />;
      default: return null;
    }
  };

  if (isLoading) {
    return (
      <footer style={{ backgroundColor: '#000000', position: 'relative', paddingTop: '3rem', paddingBottom: '2rem', overflow: 'hidden' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8 mb-8 md:mb-12">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i}>
                  <div className="h-6 bg-gray-700 rounded w-24 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-700 rounded w-32"></div>
                    <div className="h-4 bg-gray-700 rounded w-28"></div>
                    <div className="h-4 bg-gray-700 rounded w-36"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="footer-container" style={{ position: 'relative', paddingTop: '3rem', paddingBottom: '2rem', overflow: 'hidden', backgroundColor: '#000000' }}>
      {/* Background Image */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          backgroundImage: `url('${backgroundImage}')`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      />
      {/* Solid Overlay */}
      <div
        className="footer-overlay"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.85)'
        }}
      />
      {/* Content */}
      <div className="footer-content relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8 lg:gap-10 mb-8 md:mb-12">
          {/* Column 1: Get In Touch */}
          <div className="space-y-3 md:space-y-4">
            <h3 className="font-bold text-base md:text-lg lg:text-xl mb-3 md:mb-4" style={{ color: '#ffffff' }}>Get In Touch</h3>
            <p className="text-xs sm:text-sm mb-4" style={{ color: '#d1d5db' }}>Connect with us online</p>
            <div className="flex gap-3 flex-wrap">
              {socialLinksList.map((link, idx) => {
                const Icon = getSocialIcon(link.icon);
                return Icon ? (
                  <a
                    key={idx}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 md:p-3 rounded-full transition-all hover:scale-110 group focus:outline-none focus:ring-2 focus:ring-green-500"
                    style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                    aria-label={link.icon}
                    onClick={triggerHaptic}
                  >
                    {Icon}
                  </a>
                ) : null;
              })}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3 md:space-y-4">
            <h3 className="font-bold text-base md:text-lg lg:text-xl mb-3 md:mb-4" style={{ color: '#ffffff' }}>Quick Links</h3>
            <ul className="space-y-2 md:space-y-3">
              {quickLinksList.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs sm:text-sm transition-colors flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-green-500 rounded py-1"
                    style={{ color: '#d1d5db' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#22c55e'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#d1d5db'}
                    onClick={triggerHaptic}
                  >
                    {link.name}
                    <ExternalLinkIcon className="opacity-50 w-3 h-3 inline-block ml-1" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Affiliated Sites */}
          <div className="space-y-3 md:space-y-4">
            <h3 className="font-bold text-base md:text-lg lg:text-xl mb-3 md:mb-4" style={{ color: '#ffffff' }}>Affiliated Sites</h3>
            <ul className="space-y-2 md:space-y-3">
              {affiliatedSitesList.map((site, idx) => (
                <li key={idx}>
                  <a
                    href={site.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs sm:text-sm transition-colors flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-green-500 rounded py-1"
                    style={{ color: '#d1d5db' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#22c55e'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#d1d5db'}
                    onClick={triggerHaptic}
                  >
                    {site.name}
                    <ExternalLinkIcon className="opacity-50 w-3 h-3 inline-block ml-1" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Resources & Newsletter */}
          <div className="space-y-4 md:space-y-6">
            <div>
              <h3 className="font-bold text-base md:text-lg lg:text-xl mb-3 md:mb-4" style={{ color: '#ffffff' }}>Resources</h3>
              <ul className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                {resourcesList.map((resource, idx) => (
                  <li key={idx}>
                    <a
                      href={resource.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs sm:text-sm transition-colors flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-green-500 rounded py-1"
                      style={{ color: '#d1d5db' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#22c55e'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#d1d5db'}
                      onClick={triggerHaptic}
                    >
                      {resource.name}
                      <ExternalLinkIcon className="opacity-50 w-3 h-3 inline-block ml-1" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs sm:text-sm mb-3 leading-relaxed" style={{ color: '#d1d5db' }}>
                To receive regular News, Updates, and Information about ICT Authority.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-3">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewsletterEmail(e.target.value)}
                  placeholder="Your Email"
                  className="rounded-lg px-4 py-2 md:py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#ffffff' }}
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="text-white py-2 md:py-3 rounded-lg text-sm md:text-base font-bold transition-all duration-300 hover:scale-105 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[44px]"
                  style={{ backgroundColor: '#16a34a' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#15803d'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#16a34a'}
                  onClick={triggerHaptic}
                >
                  {loading ? 'Subscribing...' : 'Subscribe Now'}
                </button>
                {newsletterStatus.message && (
                  <p className={`text-xs ${newsletterStatus.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                    {newsletterStatus.message}
                  </p>
                )}
              </form>
            </div>
          </div>

          {/* Column 5: ICT Authority Links */}
          <div className="space-y-3 md:space-y-4">
            <h3 className="font-bold text-base md:text-lg lg:text-xl mb-3 md:mb-4" style={{ color: '#ffffff' }}>ICT Authority Links</h3>
            <ul className="space-y-2 md:space-y-3">
              {ictaLinksList.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs sm:text-sm transition-colors flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-green-500 rounded py-1"
                    style={{ color: '#d1d5db' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#22c55e'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#d1d5db'}
                    onClick={triggerHaptic}
                  >
                    {link.name}
                    <ExternalLinkIcon className="opacity-50 w-3 h-3 inline-block ml-1" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="pt-6 md:pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] sm:text-xs uppercase tracking-widest" style={{ borderTop: '1px solid rgba(255,255,255,0.2)', color: '#9ca3af' }}>
          <p className="text-center sm:text-left">© {new Date().getFullYear()} ICT Authority. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <a href="/privacy" className="transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 rounded px-2 py-1" style={{ color: '#9ca3af' }} onMouseEnter={(e) => e.currentTarget.style.color = '#22c55e'} onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'} onClick={triggerHaptic}>
              Privacy Policy
            </a>
            <a href="/terms" className="transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 rounded px-2 py-1" style={{ color: '#9ca3af' }} onMouseEnter={(e) => e.currentTarget.style.color = '#22c55e'} onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'} onClick={triggerHaptic}>
              Terms of Use
            </a>
            <a href="/accessibility" className="transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 rounded px-2 py-1" style={{ color: '#9ca3af' }} onMouseEnter={(e) => e.currentTarget.style.color = '#22c55e'} onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'} onClick={triggerHaptic}>
              Accessibility
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

