// frontend/src/sections/HeroSection.tsx
import { useState } from 'react';
import { useContent } from '../content/useContext';

const HeroSection = () => {
  const { content, isLoading } = useContent();
  const [imageError, setImageError] = useState(false);
  
  const triggerHaptic = () => {
    try {
      if (window.navigator && typeof window.navigator.vibrate === "function") {
        window.navigator.vibrate(50);
      }
    } catch (e) {}
  };
  
  if (isLoading) {
    return (
      <section className="relative overflow-hidden">
        <div className="relative min-h-[600px] flex flex-col justify-center px-6 md:px-12">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-6"></div>
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-96 mb-4"></div>
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-6"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full max-w-xl mb-10"></div>
            <div className="flex gap-4">
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-40"></div>
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  const hero = content.hero || {};
  const fallbackImage = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2070&auto=format';
  const backgroundImage = imageError || !hero.backgroundImage ? fallbackImage : hero.backgroundImage;
  
  return (
    <section className="relative overflow-hidden">
      <div className="relative min-h-[600px] flex flex-col justify-center px-6 md:px-12 overflow-hidden">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center opacity-30 dark:opacity-20"
          style={{
            backgroundImage: `url('${backgroundImage}')`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat'
          }}
          onError={() => setImageError(true)}
        />
        <div className="absolute inset-0 z-1 bg-gradient-to-r from-white/95 via-white/80 to-white/60 dark:from-black/95 dark:via-black/80 dark:to-black/60" />
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-[2px] w-8 bg-primary"></div>
            <span className="text-primary font-bold tracking-widest text-xs uppercase">{hero.badge || 'Vision 2030 Partner'}</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tighter mb-6 text-gray-900 dark:text-white">
            {hero.headline || "Powering Kenya's"} <br />
            <span className="text-primary">{hero.highlightedText || 'Digital Economy'}</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-10 max-w-xl leading-relaxed">
            {hero.description || "The National Digital Masterplan 2022-2032 is transforming Kenya into a regional ICT hub through innovation, infrastructure, and e-government."}
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://cms.icta.go.ke/sites/default/files/2022-09/Kenya_Digital_Master_Plan_2022-2023.pdf"
              target="_blank"
              rel="noopener noreferrer"
              onClick={triggerHaptic}
              className="bg-primary text-white px-8 py-4 rounded-lg font-bold text-base hover:bg-green-600 hover:scale-105 transition-all duration-300 shadow-lg shadow-primary/30 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-black"
            >
              {hero.primaryButtonText || 'Download Masterplan'}
            </a>
            <a
              href="#"
              onClick={triggerHaptic}
              className="border-2 border-primary text-primary dark:text-white dark:border-white/30 px-8 py-4 rounded-lg font-bold text-base hover:bg-primary/10 dark:hover:bg-white/10 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-black"
            >
              {hero.secondaryButtonText || 'View Roadmap'}
            </a>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-2 flex z-20">
          <div className="flex-1" style={{ backgroundColor: '#000000' }}></div>
          <div className="flex-1" style={{ backgroundColor: '#cc0000' }}></div>
          <div className="flex-1" style={{ backgroundColor: '#008000' }}></div>
          <div className="flex-1" style={{ backgroundColor: '#ffffff' }}></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
/*// frontend/src/sections/HeroSection.tsx
import React, { useState } from 'react';
import { useContent } from '../content/useContext';

var HeroSection: React.FC = function() {
  var { content, isLoading } = useContent();
  var _useState = useState(false);
  var imageError = _useState[0];
  var setImageError = _useState[1];
  
  var triggerHaptic = function() {
    try {
      if (window.navigator && typeof window.navigator.vibrate === "function") {
        window.navigator.vibrate(50);
      }
    } catch (e) {}
  };
  
  if (isLoading) {
    return React.createElement("section", { className: "relative overflow-hidden" },
      React.createElement("div", { className: "relative min-h-[600px] flex flex-col justify-center px-6 md:px-12" },
        React.createElement("div", { className: "animate-pulse" },
          React.createElement("div", { className: "h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-6" }),
          React.createElement("div", { className: "h-12 bg-gray-200 dark:bg-gray-700 rounded w-96 mb-4" }),
          React.createElement("div", { className: "h-12 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-6" }),
          React.createElement("div", { className: "h-4 bg-gray-200 dark:bg-gray-700 rounded w-full max-w-xl mb-10" }),
          React.createElement("div", { className: "flex gap-4" },
            React.createElement("div", { className: "h-12 bg-gray-200 dark:bg-gray-700 rounded w-40" }),
            React.createElement("div", { className: "h-12 bg-gray-200 dark:bg-gray-700 rounded w-32" })))));
  }
  
  var hero = content.hero || {};
  
  var fallbackImage = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2070&auto=format';
  var backgroundImage = imageError || !hero.backgroundImage ? fallbackImage : hero.backgroundImage;
  
  return React.createElement("section", { className: "relative overflow-hidden" },
    React.createElement("div", { className: "relative min-h-[600px] flex flex-col justify-center px-6 md:px-12 overflow-hidden" },
      React.createElement("div", {
        className: "absolute inset-0 z-0 bg-cover bg-center opacity-30 dark:opacity-20",
        style: {
          backgroundImage: "url('" + backgroundImage + "')",
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat'
        },
        onError: function() { setImageError(true); }
      }),
      React.createElement("div", { className: "absolute inset-0 z-1 bg-gradient-to-r from-white/95 via-white/80 to-white/60 dark:from-black/95 dark:via-black/80 dark:to-black/60" }),
      React.createElement("div", { className: "relative z-10 max-w-3xl" },
        React.createElement("div", { className: "flex items-center gap-2 mb-6" },
          React.createElement("div", { className: "h-[2px] w-8 bg-primary" }),
          React.createElement("span", { className: "text-primary font-bold tracking-widest text-xs uppercase" }, hero.badge || 'Vision 2030 Partner')),
        React.createElement("h1", { className: "text-5xl md:text-7xl font-black leading-tight tracking-tighter mb-6 text-gray-900 dark:text-white" },
          hero.headline || "Powering Kenya's",
          React.createElement("br", null),
          React.createElement("span", { className: "text-primary" }, hero.highlightedText || 'Digital Economy')),
        React.createElement("p", { className: "text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-10 max-w-xl leading-relaxed" },
          hero.description || "The National Digital Masterplan 2022-2032 is transforming Kenya into a regional ICT hub through innovation, infrastructure, and e-government."),
        React.createElement("div", { className: "flex flex-wrap gap-4" },
          React.createElement("a", {
            href: "https://cms.icta.go.ke/sites/default/files/2022-09/Kenya_Digital_Master_Plan_2022-2023.pdf",
            target: "_blank",
            rel: "noopener noreferrer",
            onClick: triggerHaptic,
            className: "bg-primary text-white px-8 py-4 rounded-lg font-bold text-base hover:bg-green-600 hover:scale-105 transition-all duration-300 shadow-lg shadow-primary/30 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-black"
          }, hero.primaryButtonText || 'Download Masterplan'),
          React.createElement("a", {
            href: "#",
            onClick: triggerHaptic,
            className: "border-2 border-primary text-primary dark:text-white dark:border-white/30 px-8 py-4 rounded-lg font-bold text-base hover:bg-primary/10 dark:hover:bg-white/10 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-black"
          }, hero.secondaryButtonText || 'View Roadmap'))),
      React.createElement("div", { className: "absolute bottom-0 left-0 right-0 h-2 flex z-20" },
        React.createElement("div", { className: "flex-1 bg-black", style: { backgroundColor: '#000000' } }),
        React.createElement("div", { className: "flex-1", style: { backgroundColor: '#cc0000' } }),
        React.createElement("div", { className: "flex-1", style: { backgroundColor: '#008000' } }),
        React.createElement("div", { className: "flex-1", style: { backgroundColor: '#ffffff' } }))));
};

export default HeroSection;*/


/*// frontend/src/sections/HeroSection.tsx
import React, { useState } from 'react';
import { useContent } from '../content/useContext';

const HeroSection: React.FC = () => {
  const { content, isLoading } = useContent();
  const [imageError, setImageError] = useState(false);
  
  if (isLoading) {
    return (
      <section className="relative overflow-hidden">
        <div className="relative min-h-[600px] flex flex-col justify-center px-6 md:px-12">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-6"></div>
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-96 mb-4"></div>
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-6"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full max-w-xl mb-10"></div>
            <div className="flex gap-4">
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-40"></div>
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  const hero = content.hero || {};
  
  // Fallback background image
  const fallbackImage = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2070&auto=format';
  const backgroundImage = imageError || !hero.backgroundImage ? fallbackImage : hero.backgroundImage;
  
  return (
    <section className="relative overflow-hidden">
      <div className="relative min-h-[600px] flex flex-col justify-center px-6 md:px-12 overflow-hidden">
        {/* Background Image /}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center opacity-30 dark:opacity-20"
          style={{ 
            backgroundImage: `url('${backgroundImage}')`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat'
          }} 
          onError={() => setImageError(true)}
        />
        
        {/* Gradient Overlay - Theme responsive /}
        <div className="absolute inset-0 z-1 bg-gradient-to-r from-white/95 via-white/80 to-white/60 dark:from-black/95 dark:via-black/80 dark:to-black/60"></div>
        
        {/* Content /}
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-[2px] w-8 bg-primary"></div>
            <span className="text-primary font-bold tracking-widest text-xs uppercase">{hero.badge || 'Vision 2030 Partner'}</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tighter mb-6 text-gray-900 dark:text-white">
            {hero.headline || "Powering Kenya's"} <br />
            <span className="text-primary">{hero.highlightedText || 'Digital Economy'}</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-10 max-w-xl leading-relaxed">
            {hero.description || "The National Digital Masterplan 2022-2032 is transforming Kenya into a regional ICT hub through innovation, infrastructure, and e-government."}
          </p>
          <div className="flex flex-wrap gap-4">
            <a 
              href="https://cms.icta.go.ke/sites/default/files/2022-09/Kenya_Digital_Master_Plan_2022-2023.pdf" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-primary text-white px-8 py-4 rounded-lg font-bold text-base hover:bg-green-600 hover:scale-105 transition-all duration-300 shadow-lg shadow-primary/30"
            >
              {hero.primaryButtonText || 'Download Masterplan'}
            </a>
            <a 
              href="#" 
              className="border-2 border-primary text-primary dark:text-white dark:border-white/30 px-8 py-4 rounded-lg font-bold text-base hover:bg-primary/10 dark:hover:bg-white/10 hover:scale-105 transition-all duration-300"
            >
              {hero.secondaryButtonText || 'View Roadmap'}
            </a>
          </div>
        </div>
        
        {/* Kenyan Flag Accent Bar /}
        <div className="absolute bottom-0 left-0 right-0 h-2 flex">
          <div className="flex-1 bg-black"></div>
          <div className="flex-1 bg-red-700"></div>
          <div className="flex-1 bg-green-700"></div>
          <div className="flex-1 bg-white"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;*/
/*
// frontend/src/sections/HeroSection.tsx
import React from 'react';
import { useContent } from '../content/useContext';

const HeroSection: React.FC = () => {
  const { content, isLoading } = useContent();
  
  if (isLoading) {
    return (
      <section className="relative overflow-hidden">
        <div className="relative min-h-[600px] flex flex-col justify-center px-6 md:px-12">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-6"></div>
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-96 mb-4"></div>
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-6"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full max-w-xl mb-10"></div>
            <div className="flex gap-4">
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-40"></div>
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  const hero = content.hero || {};
  
  return (
    <section className="relative overflow-hidden">
      <div className="relative min-h-[600px] flex flex-col justify-center px-6 md:px-12 overflow-hidden">
        {/* Background Image /}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center opacity-30 dark:opacity-20"
          style={{ 
            backgroundImage: `url('${hero.backgroundImage || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCaw5m81nNM0MZpSeCDSNMR8jtfNYnp9g_sDz_8asKYKGnthRVAskslJIAjiTmbaHXZ-vuirL6iauAcncqAt2woss8Pecc8hsmRThlmME0jN_5qDagGnFTfiLbp_Y4Sx7RcnMmq8qrWjUUOJO9pG6aZIEuGw-SvSgEoJcX3KrjoAOVTpUcVGUDF4-f--biRylHhvozDmzE6pQWv7ZzideKNjDPIdBVCPFQgaRA2Ih0i3203IltxKnEwHLmMXevAasWpWNy8mdawQ'}")`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat'
          }} 
        />
        
        {/* Gradient Overlay - Theme responsive /}
        <div className="absolute inset-0 z-1 bg-gradient-to-r from-white/95 via-white/80 to-white/60 dark:from-black/95 dark:via-black/80 dark:to-black/60"></div>
        
        {/* Content /}
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-[2px] w-8 bg-primary"></div>
            <span className="text-primary font-bold tracking-widest text-xs uppercase">{hero.badge || 'Vision 2030 Partner'}</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tighter mb-6 text-gray-900 dark:text-white">
            {hero.headline || "Powering Kenya's"} <br />
            <span className="text-primary">{hero.highlightedText || 'Digital Economy'}</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-10 max-w-xl leading-relaxed">
            {hero.description || "The National Digital Masterplan 2022-2032 is transforming Kenya into a regional ICT hub through innovation, infrastructure, and e-government."}
          </p>
          <div className="flex flex-wrap gap-4">
            <a 
              href="https://cms.icta.go.ke/sites/default/files/2022-09/Kenya_Digital_Master_Plan_2022-2023.pdf" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-primary text-white px-8 py-4 rounded-lg font-bold text-base hover:bg-green-600 hover:scale-105 transition-all duration-300 shadow-lg shadow-primary/30"
            >
              {hero.primaryButtonText || 'Download Masterplan'}
            </a>
            <a 
              href="#" 
              className="border-2 border-primary text-primary dark:text-white dark:border-white/30 px-8 py-4 rounded-lg font-bold text-base hover:bg-primary/10 dark:hover:bg-white/10 hover:scale-105 transition-all duration-300"
            >
              {hero.secondaryButtonText || 'View Roadmap'}
            </a>
          </div>
        </div>
        
        {/* Kenyan Flag Accent Bar /}
        <div className="absolute bottom-0 left-0 right-0 h-2 flex">
          <div className="flex-1 bg-black"></div>
          <div className="flex-1 bg-red-700"></div>
          <div className="flex-1 bg-green-700"></div>
          <div className="flex-1 bg-white"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;*/


/*// frontend/src/sections/HeroSection.tsx
import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="relative min-h-[600px] flex flex-col justify-center px-6 md:px-12 overflow-hidden">
        {/* Background Image /}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center opacity-30 dark:opacity-20"
          style={{ 
            backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDCaw5m81nNM0MZpSeCDSNMR8jtfNYnp9g_sDz_8asKYKGnthRVAskslJIAjiTmbaHXZ-vuirL6iauAcncqAt2woss8Pecc8hsmRThlmME0jN_5qDagGnFTfiLbp_Y4Sx7RcnMmq8qrWjUUOJO9pG6aZIEuGw-SvSgEoJcX3KrjoAOVTpUcVGUDF4-f--biRylHhvozDmzE6pQWv7ZzideKNjDPIdBVCPFQgaRA2Ih0i3203IltxKnEwHLmMXevAasWpWNy8mdawQ')",
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat'
          }} 
        />
        
        {/* Gradient Overlay - Theme responsive /}
        <div className="absolute inset-0 z-1 bg-gradient-to-r from-white/95 via-white/80 to-white/60 dark:from-black/95 dark:via-black/80 dark:to-black/60"></div>
        
        {/* Content /}
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-[2px] w-8 bg-primary"></div>
            <span className="text-primary font-bold tracking-widest text-xs uppercase">Vision 2030 Partner</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tighter mb-6 text-gray-900 dark:text-white">
            Powering Kenya's <br />
            <span className="text-primary">Digital Economy</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-10 max-w-xl leading-relaxed">
            The National Digital Masterplan 2022-2032 is transforming Kenya into a regional ICT hub through innovation, infrastructure, and e-government.
          </p>
          <div className="flex flex-wrap gap-4">
            <a 
              href="https://cms.icta.go.ke/sites/default/files/2022-09/Kenya_Digital_Master_Plan_2022-2023.pdf" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-primary text-white px-8 py-4 rounded-lg font-bold text-base hover:bg-green-600 hover:scale-105 transition-all duration-300 shadow-lg shadow-primary/30"
            >
              Download Masterplan
            </a>
            <a 
              href="#" 
              className="border-2 border-primary text-primary dark:text-white dark:border-white/30 px-8 py-4 rounded-lg font-bold text-base hover:bg-primary/10 dark:hover:bg-white/10 hover:scale-105 transition-all duration-300"
            >
              View Roadmap
            </a>
          </div>
        </div>
        
        {/* Kenyan Flag Accent Bar - Correct colors /}
        <div className="absolute bottom-0 left-0 right-0 h-2 flex">
          <div className="flex-1 bg-black"></div>
          <div className="flex-1 bg-red-700"></div>
          <div className="flex-1 bg-green-700"></div>
          <div className="flex-1 bg-white"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;*/
