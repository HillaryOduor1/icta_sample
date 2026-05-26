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
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ 
          backgroundImage: "url('/assets/bg_image.jpg')",
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 z-1 bg-gradient-to-t from-black via-black/90 to-black/80" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Get In Touch */}
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
          
          {/* Quick Links */}
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
          
          {/* Affiliated Sites */}
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
          
          {/* Resources */}
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
            
            {/* Newsletter Subscription */}
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
          
          {/* ICT Authority Links */}
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
        
        {/* Copyright Bar */}
        <div className="pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-gray-400 uppercase tracking-widest">
          <p>{footer.copyright || `© ${new Date().getFullYear()} ICT Authority. All rights reserved.`}</p>
          <div className="flex gap-6">
            {footer.legalLinks?.map((link, idx) => (
              <a key={idx} href={link.href} className="hover:text-primary transition-colors">{link.name}</a>
            ))}
          </div>
        </div>
      </div>
      
      {/* Bottom Mobile Nav */}
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

export default Footer;
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
