// frontend/src/components/Footer.tsx
import React, { useState } from 'react';
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

const triggerHaptic = (): void => {
  try {
    if (window.navigator && typeof window.navigator.vibrate === "function") {
      window.navigator.vibrate(50);
    }
  } catch (e) {
    // Silently fail
  }
};

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
      <footer className="relative pt-12 md:pt-16 pb-8 overflow-hidden">
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
    <footer className="relative pt-12 md:pt-16 pb-8 overflow-hidden bg-black">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: "url('/assets/bg_image.jpg')",
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat'
        }}
      />
      <div className="absolute inset-0 z-1 bg-gradient-to-t from-black via-black/95 to-black/90" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8 lg:gap-10 mb-8 md:mb-12">
          {/* Column 1: Get In Touch */}
          <div className="space-y-3 md:space-y-4">
            <h3 className="font-bold text-base md:text-lg lg:text-xl text-white mb-3 md:mb-4">Get In Touch</h3>
            <p className="text-xs sm:text-sm text-gray-300 mb-4">Connect with us online</p>
            <div className="flex gap-3 flex-wrap">
              {socialLinksList.map((link, idx) => {
                const Icon = getSocialIcon(link.icon);
                return Icon ? (
                  <a
                    key={idx}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 md:p-3 rounded-full bg-white/10 hover:bg-green-500/20 transition-all hover:scale-110 group focus:outline-none focus:ring-2 focus:ring-green-500"
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
            <h3 className="font-bold text-base md:text-lg lg:text-xl text-white mb-3 md:mb-4">Quick Links</h3>
            <ul className="space-y-2 md:space-y-3">
              {quickLinksList.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs sm:text-sm text-gray-300 hover:text-green-500 transition-colors flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-green-500 rounded py-1"
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
            <h3 className="font-bold text-base md:text-lg lg:text-xl text-white mb-3 md:mb-4">Affiliated Sites</h3>
            <ul className="space-y-2 md:space-y-3">
              {affiliatedSitesList.map((site, idx) => (
                <li key={idx}>
                  <a
                    href={site.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs sm:text-sm text-gray-300 hover:text-green-500 transition-colors flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-green-500 rounded py-1"
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
              <h3 className="font-bold text-base md:text-lg lg:text-xl text-white mb-3 md:mb-4">Resources</h3>
              <ul className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                {resourcesList.map((resource, idx) => (
                  <li key={idx}>
                    <a
                      href={resource.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs sm:text-sm text-gray-300 hover:text-green-500 transition-colors flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-green-500 rounded py-1"
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
              <p className="text-xs sm:text-sm text-gray-300 mb-3 leading-relaxed">
                To receive regular News, Updates, and Information about ICT Authority.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-3">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewsletterEmail(e.target.value)}
                  placeholder="Your Email"
                  className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 md:py-3 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500 text-white placeholder:text-gray-400"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-600 text-white py-2 md:py-3 rounded-lg text-sm md:text-base font-bold hover:bg-green-700 transition-all duration-300 hover:scale-105 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[44px]"
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
            <h3 className="font-bold text-base md:text-lg lg:text-xl text-white mb-3 md:mb-4">ICT Authority Links</h3>
            <ul className="space-y-2 md:space-y-3">
              {ictaLinksList.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs sm:text-sm text-gray-300 hover:text-green-500 transition-colors flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-green-500 rounded py-1"
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
        <div className="pt-6 md:pt-8 border-t border-white/20 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] sm:text-xs text-gray-400 uppercase tracking-widest">
          <p className="text-center sm:text-left text-gray-400">
            © {new Date().getFullYear()} ICT Authority. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <a href="/privacy" className="text-gray-400 hover:text-green-500 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 rounded px-2 py-1" onClick={triggerHaptic}>
              Privacy Policy
            </a>
            <a href="/terms" className="text-gray-400 hover:text-green-500 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 rounded px-2 py-1" onClick={triggerHaptic}>
              Terms of Use
            </a>
            <a href="/accessibility" className="text-gray-400 hover:text-green-500 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 rounded px-2 py-1" onClick={triggerHaptic}>
              Accessibility
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
/*// frontend/src/components/Footer.tsx
import React, { useState } from 'react';
import { useContent } from '../content/useContext';

var FacebookIcon = function({ className = "w-5 h-5" }) {
  return React.createElement("svg", { className: className, viewBox: "0 0 24 24", fill: "currentColor", xmlns: "http://www.w3.org/2000/svg" },
    React.createElement("path", { d: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" }));
};

var TwitterIcon = function({ className = "w-5 h-5" }) {
  return React.createElement("svg", { className: className, viewBox: "0 0 24 24", fill: "currentColor", xmlns: "http://www.w3.org/2000/svg" },
    React.createElement("path", { d: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" }));
};

var LinkedInIcon = function({ className = "w-5 h-5" }) {
  return React.createElement("svg", { className: className, viewBox: "0 0 24 24", fill: "currentColor", xmlns: "http://www.w3.org/2000/svg" },
    React.createElement("path", { d: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C0.792 0 0 0.774 0 1.729v20.542C0 23.227 0.792 24 1.771 24h20.451c0.979 0 1.771-0.773 1.771-1.729V1.729C24 0.774 23.205 0 22.222 0h.003z" }));
};

var MailIcon = function({ className = "w-5 h-5" }) {
  return React.createElement("svg", { className: className, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", xmlns: "http://www.w3.org/2000/svg" },
    React.createElement("rect", { x: "2", y: "4", width: "20", height: "16", rx: "2" }),
    React.createElement("path", { d: "m22 7-10 7L2 7" }));
};

var EnvelopeIcon = function({ className = "w-5 h-5" }) {
  return React.createElement("svg", { className: className, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", xmlns: "http://www.w3.org/2000/svg" },
    React.createElement("path", { d: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" }),
    React.createElement("polyline", { points: "22,6 12,13 2,6" }));
};

var ExternalLinkIcon = function({ className = "w-3 h-3" }) {
  return React.createElement("svg", { className: className, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", xmlns: "http://www.w3.org/2000/svg" },
    React.createElement("path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" }),
    React.createElement("polyline", { points: "15 3 21 3 21 9" }),
    React.createElement("line", { x1: "10", y1: "14", x2: "21", y2: "3" }));
};

var triggerHaptic = function() {
  try {
    if (window.navigator && typeof window.navigator.vibrate === "function") {
      window.navigator.vibrate(50);
    }
  } catch (e) {}
};

var Footer: React.FC = function() {
  var { content, isLoading } = useContent();
  var _useState = useState('');
  var newsletterEmail = _useState[0];
  var setNewsletterEmail = _useState[1];
  var _useState2 = useState<{ type: 'success' | 'error' | ''; message: string }>({ type: '', message: '' });
  var newsletterStatus = _useState2[0];
  var setNewsletterStatus = _useState2[1];
  var _useState3 = useState(false);
  var loading = _useState3[0];
  var setLoading = _useState3[1];
  
  // Static data based on original footer
  var quickLinksList = [
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
  
  var affiliatedSitesList = [
    { name: "Connected Summit", href: "https://www.connected.go.ke/" },
    { name: "Smart Academy", href: "https://smartacademy.go.ke/" },
    { name: "DigiTalent", href: "https://digitalent.go.ke/" },
    { name: "Kenya Open Data", href: "https://opendata.go.ke/" }
  ];
  
  var resourcesList = [
    { name: "Tenders", href: "https://icta.go.ke/tenders" },
    { name: "Frequently Asked Questions (FAQs)", href: "https://icta.go.ke/faqs" },
    { name: "Contact Us", href: "https://icta.go.ke/contact-us" }
  ];
  
  var ictaLinksList = [
    { name: "WhiteBox", href: "https://whitebox.go.ke" }
  ];
  
  var socialLinksList = [
    { icon: "facebook", href: "https://web.facebook.com/ICTAuthorityKE?_rdc=1&_rdr" },
    { icon: "twitter", href: "https://twitter.com/ICTAuthorityKE" },
    { icon: "mail", href: "mailto:communications@ict.go.ke" },
    { icon: "linkedin", href: "https://www.linkedin.com/company/kenya-ict-board" }
  ];

  var handleNewsletterSubmit = async function(e: React.FormEvent) {
    e.preventDefault();
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newsletterEmail)) {
      setNewsletterStatus({ type: 'error', message: 'Please enter a valid email address.' });
      return;
    }
    setLoading(true);
    setNewsletterStatus({ type: '', message: '' });
    try {
      var res = await fetch('https://icta.go.ke/app/newsletter/subscribe.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail })
      });
      if (!res.ok) throw new Error('Subscription failed');
      setNewsletterStatus({ type: 'success', message: 'Thank you for subscribing!' });
      setNewsletterEmail('');
    } catch (err: any) {
      setNewsletterStatus({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  var getSocialIcon = function(iconName: string) {
    switch (iconName?.toLowerCase()) {
      case 'facebook': return React.createElement(FacebookIcon, { className: "w-5 h-5 text-white group-hover:text-green-500 transition-colors" });
      case 'twitter': return React.createElement(TwitterIcon, { className: "w-5 h-5 text-white group-hover:text-green-500 transition-colors" });
      case 'linkedin': return React.createElement(LinkedInIcon, { className: "w-5 h-5 text-white group-hover:text-green-500 transition-colors" });
      case 'mail': return React.createElement(EnvelopeIcon, { className: "w-5 h-5 text-white group-hover:text-green-500 transition-colors" });
      default: return null;
    }
  };

  if (isLoading) {
    return React.createElement("footer", { className: "relative pt-12 md:pt-16 pb-8 overflow-hidden" },
      React.createElement("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" },
        React.createElement("div", { className: "animate-pulse" },
          React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8 mb-8 md:mb-12" },
            [1, 2, 3, 4, 5].map(function(i) {
              return React.createElement("div", { key: i },
                React.createElement("div", { className: "h-6 bg-gray-700 rounded w-24 mb-4" }),
                React.createElement("div", { className: "space-y-2" },
                  React.createElement("div", { className: "h-4 bg-gray-700 rounded w-32" }),
                  React.createElement("div", { className: "h-4 bg-gray-700 rounded w-28" }),
                  React.createElement("div", { className: "h-4 bg-gray-700 rounded w-36" })));
            })))));
  }

  return React.createElement("footer", { className: "relative pt-12 md:pt-16 pb-8 overflow-hidden bg-black" },
    React.createElement("div", {
      className: "absolute inset-0 z-0 bg-cover bg-center bg-fixed",
      style: {
        backgroundImage: "url('/assets/bg_image.jpg')",
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
      }
    }),
    React.createElement("div", { 
      className: "absolute inset-0 z-1 bg-gradient-to-t from-black via-black/95 to-black/90"
    }),
    React.createElement("div", { className: "relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" },
      React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8 lg:gap-10 mb-8 md:mb-12" },
        
        // Column 1: Get In Touch
        React.createElement("div", { className: "space-y-3 md:space-y-4" },
          React.createElement("h3", { className: "font-bold text-base md:text-lg lg:text-xl text-white mb-3 md:mb-4" }, "Get In Touch"),
          React.createElement("p", { className: "text-xs sm:text-sm text-gray-300 mb-4" }, "Connect with us online"),
          React.createElement("div", { className: "flex gap-3 flex-wrap" },
            socialLinksList.map(function(link: any, idx: number) {
              var Icon = getSocialIcon(link.icon);
              return Icon ? React.createElement("a", {
                key: idx,
                href: link.href,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "p-2 md:p-3 rounded-full bg-white/10 hover:bg-green-500/20 transition-all hover:scale-110 group focus:outline-none focus:ring-2 focus:ring-green-500",
                "aria-label": link.icon,
                onClick: triggerHaptic
              }, Icon) : null;
            }))),
        
        // Column 2: Quick Links
        React.createElement("div", { className: "space-y-3 md:space-y-4" },
          React.createElement("h3", { className: "font-bold text-base md:text-lg lg:text-xl text-white mb-3 md:mb-4" }, "Quick Links"),
          React.createElement("ul", { className: "space-y-2 md:space-y-3" },
            quickLinksList.map(function(link: any, idx: number) {
              return React.createElement("li", { key: idx },
                React.createElement("a", {
                  href: link.href,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "text-xs sm:text-sm text-gray-300 hover:text-green-500 transition-colors flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-green-500 rounded py-1",
                  onClick: triggerHaptic
                }, link.name,
                  React.createElement(ExternalLinkIcon, { className: "opacity-50 w-3 h-3 inline-block ml-1" })));
            }))),
        
        // Column 3: Affiliated Sites
        React.createElement("div", { className: "space-y-3 md:space-y-4" },
          React.createElement("h3", { className: "font-bold text-base md:text-lg lg:text-xl text-white mb-3 md:mb-4" }, "Affiliated Sites"),
          React.createElement("ul", { className: "space-y-2 md:space-y-3" },
            affiliatedSitesList.map(function(site: any, idx: number) {
              return React.createElement("li", { key: idx },
                React.createElement("a", {
                  href: site.href,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "text-xs sm:text-sm text-gray-300 hover:text-green-500 transition-colors flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-green-500 rounded py-1",
                  onClick: triggerHaptic
                }, site.name,
                  React.createElement(ExternalLinkIcon, { className: "opacity-50 w-3 h-3 inline-block ml-1" })));
            }))),
        
        // Column 4: Resources & Newsletter
        React.createElement("div", { className: "space-y-4 md:space-y-6" },
          React.createElement("div", null,
            React.createElement("h3", { className: "font-bold text-base md:text-lg lg:text-xl text-white mb-3 md:mb-4" }, "Resources"),
            React.createElement("ul", { className: "space-y-2 md:space-y-3 mb-4 md:mb-6" },
              resourcesList.map(function(resource: any, idx: number) {
                return React.createElement("li", { key: idx },
                  React.createElement("a", {
                    href: resource.href,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "text-xs sm:text-sm text-gray-300 hover:text-green-500 transition-colors flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-green-500 rounded py-1",
                    onClick: triggerHaptic
                  }, resource.name,
                    React.createElement(ExternalLinkIcon, { className: "opacity-50 w-3 h-3 inline-block ml-1" })));
              }))),
          React.createElement("div", null,
            React.createElement("p", { className: "text-xs sm:text-sm text-gray-300 mb-3 leading-relaxed" }, 
              "To receive regular News, Updates, and Information about ICT Authority."),
            React.createElement("form", { onSubmit: handleNewsletterSubmit, className: "flex flex-col gap-3" },
              React.createElement("input", {
                type: "email",
                value: newsletterEmail,
                onChange: function(e) { setNewsletterEmail(e.target.value); },
                placeholder: "Your Email",
                className: "bg-white/10 border border-white/20 rounded-lg px-4 py-2 md:py-3 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500 text-white placeholder:text-gray-400",
                required: true
              }),
              React.createElement("button", {
                type: "submit",
                disabled: loading,
                className: "bg-green-600 text-white py-2 md:py-3 rounded-lg text-sm md:text-base font-bold hover:bg-green-700 transition-all duration-300 hover:scale-105 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[44px]",
                onClick: triggerHaptic
              }, loading ? 'Subscribing...' : 'Subscribe Now'),
              newsletterStatus.message && React.createElement("p", { className: "text-xs " + (newsletterStatus.type === 'success' ? 'text-green-400' : 'text-red-400') }, newsletterStatus.message)))),
        
        // Column 5: ICT Authority Links
        React.createElement("div", { className: "space-y-3 md:space-y-4" },
          React.createElement("h3", { className: "font-bold text-base md:text-lg lg:text-xl text-white mb-3 md:mb-4" }, "ICT Authority Links"),
          React.createElement("ul", { className: "space-y-2 md:space-y-3" },
            ictaLinksList.map(function(link: any, idx: number) {
              return React.createElement("li", { key: idx },
                React.createElement("a", {
                  href: link.href,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "text-xs sm:text-sm text-gray-300 hover:text-green-500 transition-colors flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-green-500 rounded py-1",
                  onClick: triggerHaptic
                }, link.name,
                  React.createElement(ExternalLinkIcon, { className: "opacity-50 w-3 h-3 inline-block ml-1" })));
            })))
      ),
      
      // Copyright Bar
      React.createElement("div", { className: "pt-6 md:pt-8 border-t border-white/20 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] sm:text-xs text-gray-400 uppercase tracking-widest" },
        React.createElement("p", { className: "text-center sm:text-left text-gray-400" }, `\u00A9 ${new Date().getFullYear()} ICT Authority. All rights reserved.`),
        React.createElement("div", { className: "flex flex-wrap justify-center gap-4 sm:gap-6" },
          React.createElement("a", {
            href: "/privacy",
            className: "text-gray-400 hover:text-green-500 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 rounded px-2 py-1",
            onClick: triggerHaptic
          }, "Privacy Policy"),
          React.createElement("a", {
            href: "/terms",
            className: "text-gray-400 hover:text-green-500 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 rounded px-2 py-1",
            onClick: triggerHaptic
          }, "Terms of Use"),
          React.createElement("a", {
            href: "/accessibility",
            className: "text-gray-400 hover:text-green-500 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 rounded px-2 py-1",
            onClick: triggerHaptic
          }, "Accessibility"))
      )
    )
  );
};

export default Footer;*/


/*// frontend/src/components/Footer.tsx
import React, { useState } from 'react';
import { useContent } from '../content/useContext';

var FacebookIcon = function({ className = "w-5 h-5" }) {
  return React.createElement("svg", { className: className, viewBox: "0 0 24 24", fill: "currentColor", xmlns: "http://www.w3.org/2000/svg" },
    React.createElement("path", { d: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" }));
};

var TwitterIcon = function({ className = "w-5 h-5" }) {
  return React.createElement("svg", { className: className, viewBox: "0 0 24 24", fill: "currentColor", xmlns: "http://www.w3.org/2000/svg" },
    React.createElement("path", { d: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" }));
};

var LinkedInIcon = function({ className = "w-5 h-5" }) {
  return React.createElement("svg", { className: className, viewBox: "0 0 24 24", fill: "currentColor", xmlns: "http://www.w3.org/2000/svg" },
    React.createElement("path", { d: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C0.792 0 0 0.774 0 1.729v20.542C0 23.227 0.792 24 1.771 24h20.451c0.979 0 1.771-0.773 1.771-1.729V1.729C24 0.774 23.205 0 22.222 0h.003z" }));
};

var MailIcon = function({ className = "w-5 h-5" }) {
  return React.createElement("svg", { className: className, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", xmlns: "http://www.w3.org/2000/svg" },
    React.createElement("rect", { x: "2", y: "4", width: "20", height: "16", rx: "2" }),
    React.createElement("path", { d: "m22 7-10 7L2 7" }));
};

var ExternalLinkIcon = function({ className = "w-5 h-5" }) {
  return React.createElement("svg", { className: className, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", xmlns: "http://www.w3.org/2000/svg" },
    React.createElement("path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" }),
    React.createElement("polyline", { points: "15 3 21 3 21 9" }),
    React.createElement("line", { x1: "10", y1: "14", x2: "21", y2: "3" }));
};

var triggerHaptic = function() {
  try {
    if (window.navigator && typeof window.navigator.vibrate === "function") {
      window.navigator.vibrate(50);
    }
  } catch (e) {}
};

var Footer: React.FC = function() {
  var { content, isLoading } = useContent();
  var _useState = useState('');
  var newsletterEmail = _useState[0];
  var setNewsletterEmail = _useState[1];
  var _useState2 = useState<{ type: 'success' | 'error' | ''; message: string }>({ type: '', message: '' });
  var newsletterStatus = _useState2[0];
  var setNewsletterStatus = _useState2[1];
  var _useState3 = useState(false);
  var loading = _useState3[0];
  var setLoading = _useState3[1];
  
  var footer = content.footer || {};
  var quickLinks = footer.quickLinks || [];
  var affiliatedSites = footer.affiliatedSites || [];
  var resources = footer.resources || [];
  var ictaLinks = footer.ictaLinks || [];
  var socialLinks = footer.socialLinks || [];

  var handleNewsletterSubmit = async function(e: React.FormEvent) {
    e.preventDefault();
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newsletterEmail)) {
      setNewsletterStatus({ type: 'error', message: 'Please enter a valid email address.' });
      return;
    }
    setLoading(true);
    setNewsletterStatus({ type: '', message: '' });
    try {
      var res = await fetch('https://icta.go.ke/app/newsletter/subscribe.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail })
      });
      if (!res.ok) throw new Error('Subscription failed');
      setNewsletterStatus({ type: 'success', message: 'Thank you for subscribing!' });
      setNewsletterEmail('');
    } catch (err: any) {
      setNewsletterStatus({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  var getSocialIcon = function(iconName: string) {
    switch (iconName?.toLowerCase()) {
      case 'facebook': return React.createElement(FacebookIcon, { className: "w-5 h-5 text-gray-300 group-hover:text-white" });
      case 'twitter': return React.createElement(TwitterIcon, { className: "w-5 h-5 text-gray-300 group-hover:text-white" });
      case 'linkedin': return React.createElement(LinkedInIcon, { className: "w-5 h-5 text-gray-300 group-hover:text-white" });
      case 'mail': return React.createElement(MailIcon, { className: "w-5 h-5 text-gray-300 group-hover:text-white" });
      default: return null;
    }
  };

  if (isLoading) {
    return React.createElement("footer", { className: "relative pt-12 md:pt-16 pb-8 overflow-hidden" },
      React.createElement("div", { className: "max-w-7xl mx-auto px-4" },
        React.createElement("div", { className: "animate-pulse" },
          React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8 mb-8 md:mb-12" },
            [1, 2, 3, 4, 5].map(function(i) {
              return React.createElement("div", { key: i },
                React.createElement("div", { className: "h-6 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-4" }),
                React.createElement("div", { className: "space-y-2" },
                  React.createElement("div", { className: "h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" }),
                  React.createElement("div", { className: "h-4 bg-gray-200 dark:bg-gray-700 rounded w-28" }),
                  React.createElement("div", { className: "h-4 bg-gray-200 dark:bg-gray-700 rounded w-36" })));
            })))));
  }

  return React.createElement("footer", { className: "relative pt-12 md:pt-16 pb-8 overflow-hidden" },
    React.createElement("div", {
      className: "absolute inset-0 z-0 bg-cover bg-center",
      style: {
        backgroundImage: "url('/assets/bg_image.jpg')",
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
      }
    }),
    React.createElement("div", { 
      className: "absolute inset-0 z-1",
      style: { 
        background: 'linear-gradient(to top, #000000, rgba(0,0,0,0.9), rgba(0,0,0,0.8))'
      }
    }),
    React.createElement("div", { className: "relative z-10 max-w-7xl mx-auto px-4" },
      React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8 mb-8 md:mb-12" },
        React.createElement("div", null,
          React.createElement("h3", { className: "font-bold text-base md:text-lg text-primary mb-3 md:mb-4" }, "Get In Touch"),
          React.createElement("p", { className: "text-xs md:text-sm text-gray-300 mb-4" }, "Connect with us online"),
          React.createElement("div", { className: "flex gap-3" },
            socialLinks.map(function(link: any, idx: number) {
              var Icon = getSocialIcon(link.icon);
              return Icon ? React.createElement("a", {
                key: idx,
                href: link.href,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "p-2 rounded-full bg-white/10 hover:bg-primary/30 transition-all hover:scale-110 group focus:outline-none focus:ring-2 focus:ring-primary",
                "aria-label": link.icon,
                onClick: triggerHaptic
              }, Icon) : null;
            }))),
        quickLinks.length > 0 && React.createElement("div", null,
          React.createElement("h3", { className: "font-bold text-base md:text-lg text-primary mb-3 md:mb-4" }, "Quick Links"),
          React.createElement("ul", { className: "space-y-2" },
            quickLinks.map(function(link: any, idx: number) {
              return React.createElement("li", { key: idx },
                React.createElement("a", {
                  href: link.href,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "text-xs md:text-sm text-gray-300 hover:text-primary transition-colors flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-primary rounded",
                  onClick: triggerHaptic
                }, link.name,
                  React.createElement(ExternalLinkIcon, { className: "opacity-50 w-3 h-3" })));
            }))),
        affiliatedSites.length > 0 && React.createElement("div", null,
          React.createElement("h3", { className: "font-bold text-base md:text-lg text-primary mb-3 md:mb-4" }, "Affiliated Sites"),
          React.createElement("ul", { className: "space-y-2" },
            affiliatedSites.map(function(site: any, idx: number) {
              return React.createElement("li", { key: idx },
                React.createElement("a", {
                  href: site.href,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "text-xs md:text-sm text-gray-300 hover:text-primary transition-colors flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-primary rounded",
                  onClick: triggerHaptic
                }, site.name,
                  React.createElement(ExternalLinkIcon, { className: "opacity-50 w-3 h-3" })));
            }))),
        React.createElement("div", null,
          React.createElement("h3", { className: "font-bold text-base md:text-lg text-primary mb-3 md:mb-4" }, "Resources"),
          React.createElement("ul", { className: "space-y-2 mb-6" },
            resources.map(function(resource: any, idx: number) {
              return React.createElement("li", { key: idx },
                React.createElement("a", {
                  href: resource.href,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "text-xs md:text-sm text-gray-300 hover:text-primary transition-colors flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-primary rounded",
                  onClick: triggerHaptic
                }, resource.name,
                  React.createElement(ExternalLinkIcon, { className: "opacity-50 w-3 h-3" })));
            })),
          React.createElement("div", null,
            React.createElement("p", { className: "text-xs text-gray-300 mb-3" }, "To receive regular News, Updates, and Information about ICT Authority."),
            React.createElement("form", { onSubmit: handleNewsletterSubmit, className: "flex flex-col gap-2" },
              React.createElement("input", {
                type: "email",
                value: newsletterEmail,
                onChange: function(e) { setNewsletterEmail(e.target.value); },
                placeholder: "Your Email",
                className: "bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary text-white placeholder:text-gray-400",
                required: true
              }),
              React.createElement("button", {
                type: "submit",
                disabled: loading,
                className: "bg-primary text-white py-2 rounded-lg text-sm font-bold hover:bg-primary/80 transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary",
                onClick: triggerHaptic
              }, loading ? 'Subscribing...' : 'Subscribe Now'),
              newsletterStatus.message && React.createElement("p", { className: "text-xs " + (newsletterStatus.type === 'success' ? 'text-green-400' : 'text-red-400') }, newsletterStatus.message)))),
        ictaLinks.length > 0 && React.createElement("div", null,
          React.createElement("h3", { className: "font-bold text-base md:text-lg text-primary mb-3 md:mb-4" }, "ICT Authority Links"),
          React.createElement("ul", { className: "space-y-2" },
            ictaLinks.map(function(link: any, idx: number) {
              return React.createElement("li", { key: idx },
                React.createElement("a", {
                  href: link.href,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "text-xs md:text-sm text-gray-300 hover:text-primary transition-colors flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-primary rounded",
                  onClick: triggerHaptic
                }, link.name,
                  React.createElement(ExternalLinkIcon, { className: "opacity-50 w-3 h-3" })));
            })))),
      React.createElement("div", { className: "pt-6 md:pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-gray-400 uppercase tracking-widest" },
        React.createElement("p", null, footer.copyright || `\u00A9 ${new Date().getFullYear()} ICT Authority. All rights reserved.`),
        React.createElement("div", { className: "flex gap-6" },
          (footer.legalLinks || []).map(function(link: any, idx: number) {
            return React.createElement("a", {
              key: idx,
              href: link.href,
              className: "hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded",
              onClick: triggerHaptic
            }, link.name);
          }))))
  );
};

export default Footer;*/

/*
// frontend/src/components/Footer.tsx
import React, { useState, useEffect } from 'react';
import { useContent } from '../content/useContext';

var FacebookIcon = function({ className = "w-5 h-5" }) {
  return React.createElement("svg", { className: className, viewBox: "0 0 24 24", fill: "currentColor", xmlns: "http://www.w3.org/2000/svg" },
    React.createElement("path", { d: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" }));
};

var TwitterIcon = function({ className = "w-5 h-5" }) {
  return React.createElement("svg", { className: className, viewBox: "0 0 24 24", fill: "currentColor", xmlns: "http://www.w3.org/2000/svg" },
    React.createElement("path", { d: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" }));
};

var LinkedInIcon = function({ className = "w-5 h-5" }) {
  return React.createElement("svg", { className: className, viewBox: "0 0 24 24", fill: "currentColor", xmlns: "http://www.w3.org/2000/svg" },
    React.createElement("path", { d: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C0.792 0 0 0.774 0 1.729v20.542C0 23.227 0.792 24 1.771 24h20.451c0.979 0 1.771-0.773 1.771-1.729V1.729C24 0.774 23.205 0 22.222 0h.003z" }));
};

var MailIcon = function({ className = "w-5 h-5" }) {
  return React.createElement("svg", { className: className, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", xmlns: "http://www.w3.org/2000/svg" },
    React.createElement("rect", { x: "2", y: "4", width: "20", height: "16", rx: "2" }),
    React.createElement("path", { d: "m22 7-10 7L2 7" }));
};

var ExternalLinkIcon = function({ className = "w-5 h-5" }) {
  return React.createElement("svg", { className: className, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", xmlns: "http://www.w3.org/2000/svg" },
    React.createElement("path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" }),
    React.createElement("polyline", { points: "15 3 21 3 21 9" }),
    React.createElement("line", { x1: "10", y1: "14", x2: "21", y2: "3" }));
};

var triggerHaptic = function() {
  try {
    if (window.navigator && typeof window.navigator.vibrate === "function") {
      window.navigator.vibrate(50);
    }
  } catch (e) {}
};

var Footer: React.FC = function() {
  var { content, isLoading } = useContent();
  var _useState = useState('');
  var newsletterEmail = _useState[0];
  var setNewsletterEmail = _useState[1];
  var _useState2 = useState<{ type: 'success' | 'error' | ''; message: string }>({ type: '', message: '' });
  var newsletterStatus = _useState2[0];
  var setNewsletterStatus = _useState2[1];
  var _useState3 = useState(false);
  var loading = _useState3[0];
  var setLoading = _useState3[1];
  
  var footer = content.footer || {};
  var quickLinks = footer.quickLinks || [];
  var affiliatedSites = footer.affiliatedSites || [];
  var resources = footer.resources || [];
  var ictaLinks = footer.ictaLinks || [];
  var socialLinks = footer.socialLinks || [];

  var handleNewsletterSubmit = async function(e: React.FormEvent) {
    e.preventDefault();
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newsletterEmail)) {
      setNewsletterStatus({ type: 'error', message: 'Please enter a valid email address.' });
      return;
    }
    setLoading(true);
    setNewsletterStatus({ type: '', message: '' });
    try {
      var res = await fetch('https://icta.go.ke/app/newsletter/subscribe.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail })
      });
      if (!res.ok) throw new Error('Subscription failed');
      setNewsletterStatus({ type: 'success', message: 'Thank you for subscribing!' });
      setNewsletterEmail('');
    } catch (err: any) {
      setNewsletterStatus({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  var getSocialIcon = function(iconName: string) {
    switch (iconName?.toLowerCase()) {
      case 'facebook': return React.createElement(FacebookIcon, { className: "w-5 h-5 text-gray-300 group-hover:text-white" });
      case 'twitter': return React.createElement(TwitterIcon, { className: "w-5 h-5 text-gray-300 group-hover:text-white" });
      case 'linkedin': return React.createElement(LinkedInIcon, { className: "w-5 h-5 text-gray-300 group-hover:text-white" });
      case 'mail': return React.createElement(MailIcon, { className: "w-5 h-5 text-gray-300 group-hover:text-white" });
      default: return null;
    }
  };

  if (isLoading) {
    return React.createElement("footer", { className: "relative pt-12 md:pt-16 pb-8 overflow-hidden" },
      React.createElement("div", { className: "max-w-7xl mx-auto px-4" },
        React.createElement("div", { className: "animate-pulse" },
          React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8 mb-8 md:mb-12" },
            [1, 2, 3, 4, 5].map(function(i) {
              return React.createElement("div", { key: i },
                React.createElement("div", { className: "h-6 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-4" }),
                React.createElement("div", { className: "space-y-2" },
                  React.createElement("div", { className: "h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" }),
                  React.createElement("div", { className: "h-4 bg-gray-200 dark:bg-gray-700 rounded w-28" }),
                  React.createElement("div", { className: "h-4 bg-gray-200 dark:bg-gray-700 rounded w-36" })));
            })))));
  }

  return React.createElement("footer", { className: "relative pt-12 md:pt-16 pb-8 overflow-hidden" },
    React.createElement("div", {
      className: "absolute inset-0 z-0 bg-cover bg-center",
      style: {
        backgroundImage: "url('/assets/bg_image.jpg')",
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
      }
    }),
    React.createElement("div", { className: "absolute inset-0 z-1 bg-gradient-to-t from-black via-black/90 to-black/80" }),
    React.createElement("div", { className: "relative z-10 max-w-7xl mx-auto px-4" },
      React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8 mb-8 md:mb-12" },
        React.createElement("div", null,
          React.createElement("h3", { className: "font-bold text-base md:text-lg text-primary mb-3 md:mb-4" }, "Get In Touch"),
          React.createElement("p", { className: "text-xs md:text-sm text-gray-300 mb-4" }, "Connect with us online"),
          React.createElement("div", { className: "flex gap-3" },
            socialLinks.map(function(link: any, idx: number) {
              var Icon = getSocialIcon(link.icon);
              return Icon ? React.createElement("a", {
                key: idx,
                href: link.href,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "p-2 rounded-full bg-white/10 hover:bg-primary/30 transition-all hover:scale-110 group focus:outline-none focus:ring-2 focus:ring-primary",
                "aria-label": link.icon,
                onClick: triggerHaptic
              }, Icon) : null;
            }))),
        quickLinks.length > 0 && React.createElement("div", null,
          React.createElement("h3", { className: "font-bold text-base md:text-lg text-primary mb-3 md:mb-4" }, "Quick Links"),
          React.createElement("ul", { className: "space-y-2" },
            quickLinks.map(function(link: any, idx: number) {
              return React.createElement("li", { key: idx },
                React.createElement("a", {
                  href: link.href,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "text-xs md:text-sm text-gray-300 hover:text-primary transition-colors flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-primary rounded",
                  onClick: triggerHaptic
                }, link.name,
                  React.createElement(ExternalLinkIcon, { size: 12, className: "opacity-50 w-3 h-3" })));
            }))),
        affiliatedSites.length > 0 && React.createElement("div", null,
          React.createElement("h3", { className: "font-bold text-base md:text-lg text-primary mb-3 md:mb-4" }, "Affiliated Sites"),
          React.createElement("ul", { className: "space-y-2" },
            affiliatedSites.map(function(site: any, idx: number) {
              return React.createElement("li", { key: idx },
                React.createElement("a", {
                  href: site.href,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "text-xs md:text-sm text-gray-300 hover:text-primary transition-colors flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-primary rounded",
                  onClick: triggerHaptic
                }, site.name,
                  React.createElement(ExternalLinkIcon, { size: 12, className: "opacity-50 w-3 h-3" })));
            }))),
        React.createElement("div", null,
          React.createElement("h3", { className: "font-bold text-base md:text-lg text-primary mb-3 md:mb-4" }, "Resources"),
          React.createElement("ul", { className: "space-y-2 mb-6" },
            resources.map(function(resource: any, idx: number) {
              return React.createElement("li", { key: idx },
                React.createElement("a", {
                  href: resource.href,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "text-xs md:text-sm text-gray-300 hover:text-primary transition-colors flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-primary rounded",
                  onClick: triggerHaptic
                }, resource.name,
                  React.createElement(ExternalLinkIcon, { size: 12, className: "opacity-50 w-3 h-3" })));
            })),
          React.createElement("div", null,
            React.createElement("p", { className: "text-xs text-gray-300 mb-3" }, "To receive regular News, Updates, and Information about ICT Authority."),
            React.createElement("form", { onSubmit: handleNewsletterSubmit, className: "flex flex-col gap-2" },
              React.createElement("input", {
                type: "email",
                value: newsletterEmail,
                onChange: function(e) { setNewsletterEmail(e.target.value); },
                placeholder: "Your Email",
                className: "bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary text-white placeholder:text-gray-400",
                required: true
              }),
              React.createElement("button", {
                type: "submit",
                disabled: loading,
                className: "bg-primary text-white py-2 rounded-lg text-sm font-bold hover:bg-primary/80 transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary",
                onClick: triggerHaptic
              }, loading ? 'Subscribing...' : 'Subscribe Now'),
              newsletterStatus.message && React.createElement("p", { className: "text-xs " + (newsletterStatus.type === 'success' ? 'text-green-400' : 'text-red-400') }, newsletterStatus.message)))),
        ictaLinks.length > 0 && React.createElement("div", null,
          React.createElement("h3", { className: "font-bold text-base md:text-lg text-primary mb-3 md:mb-4" }, "ICT Authority Links"),
          React.createElement("ul", { className: "space-y-2" },
            ictaLinks.map(function(link: any, idx: number) {
              return React.createElement("li", { key: idx },
                React.createElement("a", {
                  href: link.href,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "text-xs md:text-sm text-gray-300 hover:text-primary transition-colors flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-primary rounded",
                  onClick: triggerHaptic
                }, link.name,
                  React.createElement(ExternalLinkIcon, { size: 12, className: "opacity-50 w-3 h-3" })));
            })))),
      React.createElement("div", { className: "pt-6 md:pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-gray-400 uppercase tracking-widest" },
        React.createElement("p", null, footer.copyright || `\u00A9 ${new Date().getFullYear()} ICT Authority. All rights reserved.`),
        React.createElement("div", { className: "flex gap-6" },
          (footer.legalLinks || []).map(function(link: any, idx: number) {
            return React.createElement("a", {
              key: idx,
              href: link.href,
              className: "hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded",
              onClick: triggerHaptic
            }, link.name);
          }))))
  );
};

export default Footer;*/

/*last woring
// frontend/src/components/Footer.tsx
import React from 'react';
import { Mail, ExternalLink } from 'lucide-react';
import { useContent } from '../content/useContext';

// Custom SVG Icons
const FacebookIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const TwitterIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const LinkedInIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C0.792 0 0 0.774 0 1.729v20.542C0 23.227 0.792 24 1.771 24h20.451c0.979 0 1.771-0.773 1.771-1.729V1.729C24 0.774 23.205 0 22.222 0h.003z"/>
  </svg>
);

const Footer: React.FC = () => {
  const { content, isLoading } = useContent();
  const [newsletterEmail, setNewsletterEmail] = React.useState('');
  const [newsletterStatus, setNewsletterStatus] = React.useState<{ type: 'success' | 'error' | ''; message: string }>({ type: '', message: '' });
  const [loading, setLoading] = React.useState(false);
  
  const footer = content.footer || {};
  const quickLinks = footer.quickLinks || [];
  const affiliatedSites = footer.affiliatedSites || [];
  const resources = footer.resources || [];
  const ictaLinks = footer.ictaLinks || [];
  const socialLinks = footer.socialLinks || [];

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
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
    } catch (err: any) {
      setNewsletterStatus({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  // Helper to get social icon by name
  const getSocialIcon = (iconName: string) => {
    switch (iconName?.toLowerCase()) {
      case 'facebook': return <FacebookIcon className="w-5 h-5 text-gray-300 group-hover:text-white" />;
      case 'twitter': return <TwitterIcon className="w-5 h-5 text-gray-300 group-hover:text-white" />;
      case 'linkedin': return <LinkedInIcon className="w-5 h-5 text-gray-300 group-hover:text-white" />;
      case 'mail': return <Mail className="w-5 h-5 text-gray-300 group-hover:text-white" />;
      default: return null;
    }
  };

  if (isLoading) {
    return (
      <footer className="relative pt-16 pb-24 md:pb-8 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i}>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-28"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-36"></div>
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
    <footer className="relative pt-16 pb-24 md:pb-8 overflow-hidden">
      {/* Background Image /}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ 
          backgroundImage: "url('/assets/bg_image.jpg')",
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Dark Gradient Overlay /}
      <div className="absolute inset-0 z-1 bg-gradient-to-t from-black via-black/90 to-black/80" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Main Footer Grid /}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Get In Touch /}
          <div>
            <h3 className="font-bold text-lg text-primary mb-4">Get In Touch</h3>
            <p className="text-sm text-gray-300 mb-4">Connect with us online</p>
            <div className="flex gap-3">
              {socialLinks.map((link, idx) => {
                const Icon = getSocialIcon(link.icon);
                return Icon ? (
                  <a 
                    key={idx}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-white/10 hover:bg-primary/30 transition-all hover:scale-110 group"
                    aria-label={link.icon}
                  >
                    {Icon}
                  </a>
                ) : null;
              })}
            </div>
          </div>
          
          {/* Quick Links /}
          {quickLinks.length > 0 && (
            <div>
              <h3 className="font-bold text-lg text-primary mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {quickLinks.map((link, idx) => (
                  <li key={idx}>
                    <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-300 hover:text-primary transition-colors flex items-center gap-1">
                      {link.name}
                      <ExternalLink size={12} className="opacity-50" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Affiliated Sites /}
          {affiliatedSites.length > 0 && (
            <div>
              <h3 className="font-bold text-lg text-primary mb-4">Affiliated Sites</h3>
              <ul className="space-y-2">
                {affiliatedSites.map((site, idx) => (
                  <li key={idx}>
                    <a href={site.href} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-300 hover:text-primary transition-colors flex items-center gap-1">
                      {site.name}
                      <ExternalLink size={12} className="opacity-50" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Resources /}
          <div>
            <h3 className="font-bold text-lg text-primary mb-4">Resources</h3>
            <ul className="space-y-2 mb-6">
              {resources.map((resource, idx) => (
                <li key={idx}>
                  <a href={resource.href} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-300 hover:text-primary transition-colors flex items-center gap-1">
                    {resource.name}
                    <ExternalLink size={12} className="opacity-50" />
                  </a>
                </li>
              ))}
            </ul>
            
            {/* Newsletter Subscription /}
            <div>
              <p className="text-xs text-gray-300 mb-3">
                To receive regular News, Updates, and Information about ICT Authority.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-2">
                <input 
                  type="email" 
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Your Email" 
                  className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary text-white placeholder:text-gray-400"
                  required
                />
                <button type="submit" disabled={loading} className="bg-primary text-white py-2 rounded-lg text-sm font-bold hover:bg-primary/80 transition-colors disabled:opacity-50">
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
          
          {/* ICT Authority Links /}
          {ictaLinks.length > 0 && (
            <div>
              <h3 className="font-bold text-lg text-primary mb-4">ICT Authority Links</h3>
              <ul className="space-y-2">
                {ictaLinks.map((link, idx) => (
                  <li key={idx}>
                    <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-300 hover:text-primary transition-colors flex items-center gap-1">
                      {link.name}
                      <ExternalLink size={12} className="opacity-50" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        {/* Copyright Bar /}
        <div className="pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-gray-400 uppercase tracking-widest">
          <p>{footer.copyright || `© ${new Date().getFullYear()} ICT Authority. All rights reserved.`}</p>
          <div className="flex gap-6">
            {footer.legalLinks?.map((link, idx) => (
              <a key={idx} href={link.href} className="hover:text-primary transition-colors">{link.name}</a>
            ))}
          </div>
        </div>
      </div>
      
      {/* Bottom Mobile Nav /}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-black/95 backdrop-blur-lg border-t border-primary/20 flex justify-around items-center px-4 py-2">
        <a href="/" className="flex flex-col items-center gap-1 text-primary">
          <span className="material-symbols-outlined text-2xl">home</span>
          <span className="text-[10px] font-medium">Home</span>
        </a>
        <a href="#" className="flex flex-col items-center gap-1 text-gray-400">
          <span className="material-symbols-outlined text-2xl">grid_view</span>
          <span className="text-[10px] font-medium">Services</span>
        </a>
        <a href="https://icta.go.ke/news" target="_blank" className="flex flex-col items-center gap-1 text-gray-400">
          <span className="material-symbols-outlined text-2xl">newspaper</span>
          <span className="text-[10px] font-medium">News</span>
        </a>
        <a href="https://icta.go.ke/contact-us" target="_blank" className="flex flex-col items-center gap-1 text-gray-400">
          <span className="material-symbols-outlined text-2xl">mail</span>
          <span className="text-[10px] font-medium">Contact</span>
        </a>
      </nav>
    </footer>
  );
};

export default Footer;*/


/*// frontend/src/components/Footer.tsx
import React from 'react';
import { Mail, ExternalLink } from 'lucide-react';

// Custom SVG Icons
const FacebookIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const TwitterIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const LinkedInIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C0.792 0 0 0.774 0 1.729v20.542C0 23.227 0.792 24 1.771 24h20.451c0.979 0 1.771-0.773 1.771-1.729V1.729C24 0.774 23.205 0 22.222 0h.003z"/>
  </svg>
);

const quickLinks = [
  { label: 'Ministry of ICT', href: 'http://www.information.go.ke/' },
  { label: 'KEPROBA', href: 'https://brand.ke/' },
  { label: 'E-citizen Portal', href: 'https://www.ecitizen.go.ke/' },
  { label: 'Export Promotion Council(EPC)', href: 'https://www.epckenya.org/' },
  { label: 'The Export Processing Zones Authority', href: 'https://epzakenya.com/' },
  { label: 'Huduma Centre', href: 'https://www.hudumakenya.go.ke/' },
  { label: 'KenInvest', href: 'http://www.invest.go.ke/' },
  { label: 'Konza Techno City', href: 'https://konza.go.ke/' },
  { label: 'The Presidency', href: 'https://www.president.go.ke/' },
  { label: 'Kenya Vision 2030', href: 'http://vision2030.go.ke/' },
  { label: 'eWaste Kenya', href: 'https://ewaste.go.ke/' },
];

const affiliatedSites = [
  { label: 'Connected Summit', href: 'https://www.connected.go.ke/' },
  { label: 'Smart Academy', href: 'https://smartacademy.go.ke/' },
  { label: 'DigiTalent', href: 'https://digitalent.go.ke/' },
  { label: 'Kenya Open Data', href: 'https://opendata.go.ke/' },
];

const resources = [
  { label: 'Tenders', href: 'https://icta.go.ke/tenders' },
  { label: 'Frequently Asked Questions (FAQs)', href: 'https://icta.go.ke/faqs' },
  { label: 'Contact Us', href: 'https://icta.go.ke/contact-us' },
];

const ictaLinks = [
  { label: 'WhiteBox', href: 'https://whitebox.go.ke' },
];

const Footer: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = React.useState('');
  const [newsletterStatus, setNewsletterStatus] = React.useState<{ type: 'success' | 'error' | ''; message: string }>({ type: '', message: '' });
  const [loading, setLoading] = React.useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
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
    } catch (err: any) {
      setNewsletterStatus({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="relative pt-16 pb-24 md:pb-8 overflow-hidden">
      {/* Background Image /}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ 
          backgroundImage: "url('/assets/bg_image.jpg')",
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Dark Gradient Overlay - darker at bottom for better text readability /}
      <div className="absolute inset-0 z-1 bg-gradient-to-t from-black via-black/90 to-black/80" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Main Footer Grid /}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Get In Touch /}
          <div>
            <h3 className="font-bold text-lg text-primary mb-4">Get In Touch</h3>
            <p className="text-sm text-gray-300 mb-4">Connect with us online</p>
            <div className="flex gap-3">
              <a 
                href="https://web.facebook.com/ICTAuthorityKE" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 rounded-full bg-white/10 hover:bg-[#1877f2] transition-all hover:scale-110 group"
                aria-label="Facebook"
              >
                <FacebookIcon className="w-5 h-5 text-gray-300 group-hover:text-white" />
              </a>
              <a 
                href="https://twitter.com/ICTAuthorityKE" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 rounded-full bg-white/10 hover:bg-[#1da1f2] transition-all hover:scale-110 group"
                aria-label="Twitter"
              >
                <TwitterIcon className="w-5 h-5 text-gray-300 group-hover:text-white" />
              </a>
              <a 
                href="mailto:communications@ict.go.ke" 
                className="p-2 rounded-full bg-white/10 hover:bg-primary/30 transition-all hover:scale-110 group"
                aria-label="Email"
              >
                <Mail className="w-5 h-5 text-gray-300 group-hover:text-white" />
              </a>
              <a 
                href="https://www.linkedin.com/company/kenya-ict-board" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 rounded-full bg-white/10 hover:bg-[#0077b5] transition-all hover:scale-110 group"
                aria-label="LinkedIn"
              >
                <LinkedInIcon className="w-5 h-5 text-gray-300 group-hover:text-white" />
              </a>
            </div>
          </div>
          
          {/* Quick Links /}
          <div>
            <h3 className="font-bold text-lg text-primary mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-300 hover:text-primary transition-colors flex items-center gap-1">
                    {link.label}
                    <ExternalLink size={12} className="opacity-50" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Affiliated Sites /}
          <div>
            <h3 className="font-bold text-lg text-primary mb-4">Affiliated Sites</h3>
            <ul className="space-y-2">
              {affiliatedSites.map((site, idx) => (
                <li key={idx}>
                  <a href={site.href} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-300 hover:text-primary transition-colors flex items-center gap-1">
                    {site.label}
                    <ExternalLink size={12} className="opacity-50" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Resources /}
          <div>
            <h3 className="font-bold text-lg text-primary mb-4">Resources</h3>
            <ul className="space-y-2 mb-6">
              {resources.map((resource, idx) => (
                <li key={idx}>
                  <a href={resource.href} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-300 hover:text-primary transition-colors flex items-center gap-1">
                    {resource.label}
                    <ExternalLink size={12} className="opacity-50" />
                  </a>
                </li>
              ))}
            </ul>
            
            {/* Newsletter Subscription /}
            <div>
              <p className="text-xs text-gray-300 mb-3">
                To receive regular News, Updates, and Information about ICT Authority.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-2">
                <input 
                  type="email" 
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Your Email" 
                  className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary text-white placeholder:text-gray-400"
                  required
                />
                <button type="submit" disabled={loading} className="bg-primary text-white py-2 rounded-lg text-sm font-bold hover:bg-primary/80 transition-colors disabled:opacity-50">
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
          
          {/* ICT Authority Links /}
          <div>
            <h3 className="font-bold text-lg text-primary mb-4">ICT Authority Links</h3>
            <ul className="space-y-2">
              {ictaLinks.map((link, idx) => (
                <li key={idx}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-300 hover:text-primary transition-colors flex items-center gap-1">
                    {link.label}
                    <ExternalLink size={12} className="opacity-50" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Copyright Bar /}
        <div className="pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-gray-400 uppercase tracking-widest">
          <p>© {new Date().getFullYear()} ICT Authority. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
      
      {/* Bottom Mobile Nav /}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-black/95 backdrop-blur-lg border-t border-primary/20 flex justify-around items-center px-4 py-2">
        <a href="/" className="flex flex-col items-center gap-1 text-primary">
          <span className="material-symbols-outlined text-2xl">home</span>
          <span className="text-[10px] font-medium">Home</span>
        </a>
        <a href="#" className="flex flex-col items-center gap-1 text-gray-400">
          <span className="material-symbols-outlined text-2xl">grid_view</span>
          <span className="text-[10px] font-medium">Services</span>
        </a>
        <a href="https://icta.go.ke/news" target="_blank" className="flex flex-col items-center gap-1 text-gray-400">
          <span className="material-symbols-outlined text-2xl">newspaper</span>
          <span className="text-[10px] font-medium">News</span>
        </a>
        <a href="https://icta.go.ke/contact-us" target="_blank" className="flex flex-col items-center gap-1 text-gray-400">
          <span className="material-symbols-outlined text-2xl">mail</span>
          <span className="text-[10px] font-medium">Contact</span>
        </a>
      </nav>
    </footer>
  );
};

export default Footer;*/
