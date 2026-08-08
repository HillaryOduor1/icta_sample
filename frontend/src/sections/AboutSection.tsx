import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useContent } from '../content/useContext';

interface AboutItem {
  title: string;
  description: string;
  icon?: string;
  link: string;
}

export default function AboutSection() {
  const { content, isLoading } = useContent();
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  
  var backgroundImage = useMemo(function() { return '/assets/bg_image.jpg'; }, []);
  
  useEffect(function() {
    if (!backgroundImage) return;
    var preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.as = 'image';
    preloadLink.href = backgroundImage;
    preloadLink.setAttribute('fetchpriority', 'high');
    document.head.appendChild(preloadLink);
    return function() {
      if (preloadLink.parentNode) {
        document.head.removeChild(preloadLink);
      }
    };
  }, [backgroundImage]);

  var triggerHaptic = useCallback(function(): void {
    try {
      if (window.navigator && typeof window.navigator.vibrate === 'function') {
        window.navigator.vibrate(50);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  var handleImageError = useCallback(function(index: number): void {
    setImageErrors(function(prev) {
      var newState = Object.assign({}, prev);
      newState[index] = true;
      return newState;
    });
  }, []);

  // If still loading, return null
  if (isLoading) {
    return null;
  }

  var about = content.about || {};
  var aboutItems: AboutItem[] = content.aboutItems || [];
  var fallbackIcon = 'https://icta.go.ke//assets/images/icons/digi.png';
  var featuredItem = aboutItems[0];
  var regularItems = aboutItems.slice(1);
  var aboutLink = 'https://icta.go.ke/page?q=6&type=about_ict_authority';

  return (
    <section className="relative py-12 md:py-20 lg:py-28 overflow-hidden">
      {/* Background Image with enhanced overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(' + backgroundImage + ')' }}
      />
      
      {/* Enhanced Gradient Overlay - better for both dark and light mode */}
      <div className="absolute inset-0 z-1">
        {/* Light mode overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/90 to-white/95 light-only" />
        {/* Dark mode overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/90 to-black/95 dark-only" />
        {/* Subtle backdrop blur */}
        <div className="absolute inset-0 backdrop-blur-sm" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-6 md:gap-8 lg:gap-12">
          
          {/* Left Column - About Text (spans 2 columns on desktop) */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* Eyebrow */}
            <div className="flex items-center gap-3">
              <span className="text-xs md:text-sm font-semibold tracking-widest uppercase text-red-600 dark:text-red-400">
                About ICT Authority
              </span>
              <span className="h-px flex-1 bg-red-600/20 dark:bg-red-400/20" />
            </div>
            
            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-gray-900 dark:text-white">
              {about.title || 'Building Kenya\'s Digital Future'}
            </h1>
            
            {/* Description */}
            <p className="text-base md:text-lg leading-relaxed text-gray-700 dark:text-gray-300 max-w-lg">
              {about.description1 ||
                "The Authority's broad mandate entails enforcing ICT standards in Government, establishing, developing and maintaining secure ICT infrastructure systems, supervision of electronic communications, as well as promoting digital literacy, capacity, innovation and enterprise."}
            </p>
            
            {/* CTA Button */}
            <div className="pt-2">
              <a
                href={aboutLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={triggerHaptic}
                className="group inline-flex items-center gap-3 bg-red-600 hover:bg-green-600 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-black"
              >
                <span>Explore ICT Authority</span>
                <svg 
                  className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </div>
          </div>
          
          {/* Right Column - Cards (spans 3 columns on desktop) */}
          <div className="lg:col-span-3">
            {/* Card grid with explicit gap and margin-bottom for ES5 fallback */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5 lg:gap-6">
              
              {/* Featured Card - First item, spans 2 columns */}
              {featuredItem && (
                <div className="sm:col-span-2 mb-4 sm:mb-0">
                  <div 
                    className="group relative overflow-hidden rounded-2xl p-5 md:p-7 lg:p-8 bg-white/80 dark:bg-black/40 backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
                  >
                    {/* Subtle gradient accent */}
                    <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-transparent dark:from-red-400/5 pointer-events-none" />
                    
                    <div className="relative flex flex-col sm:flex-row items-start gap-4 md:gap-5 lg:gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/10 flex items-center justify-center">
                          <img
                            src={imageErrors[0] ? fallbackIcon : (featuredItem.icon || fallbackIcon)}
                            alt={featuredItem.title}
                            className="w-9 h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 object-contain"
                            onError={function() { handleImageError(0); }}
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                      </div>
                      <div className="flex-1 space-y-1.5 md:space-y-2">
                        <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
                          {featuredItem.title}
                        </h3>
                        <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                          {featuredItem.description}
                        </p>
                        <a
                          href={aboutLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={triggerHaptic}
                          className="group/link inline-flex items-center gap-2 mt-1 md:mt-2 text-sm font-semibold text-red-600 dark:text-red-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-300"
                        >
                          Learn More
                          <svg 
                            className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1"
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Regular Cards - with explicit margin for ES5 fallback */}
              {regularItems.map(function(item: AboutItem, index: number) {
                var actualIndex = index + 1;
                return (
                  <div key={actualIndex} className="col-span-1 mb-4 sm:mb-0">
                    <div 
                      className="group h-full rounded-2xl p-4 md:p-5 lg:p-6 bg-white/70 dark:bg-black/30 backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-red-600/20 dark:hover:border-red-400/20"
                    >
                      <div className="flex flex-col items-start gap-3 md:gap-4">
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/10 flex items-center justify-center flex-shrink-0">
                          <img
                            src={imageErrors[actualIndex] ? fallbackIcon : (item.icon || fallbackIcon)}
                            alt={item.title}
                            className="w-7 h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 object-contain"
                            onError={function() { handleImageError(actualIndex); }}
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                        
                        <div className="space-y-1 flex-1">
                          <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white">
                            {item.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                        
                        <a
                          href={aboutLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={triggerHaptic}
                          className="group/link inline-flex items-center gap-2 text-sm font-semibold text-red-600 dark:text-red-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-300"
                        >
                          Learn More
                          <svg 
                            className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1"
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
              
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
/*import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useContent } from '../content/useContext';

interface AboutItem {
  title: string;
  description: string;
  icon?: string;
  link: string;
}

export default function AboutSection() {
  const { content, isLoading } = useContent();
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  
  var backgroundImage = useMemo(function() { return '/assets/bg_image.jpg'; }, []);
  
  useEffect(function() {
    if (!backgroundImage) return;
    var preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.as = 'image';
    preloadLink.href = backgroundImage;
    preloadLink.setAttribute('fetchpriority', 'high');
    document.head.appendChild(preloadLink);
    return function() {
      if (preloadLink.parentNode) {
        document.head.removeChild(preloadLink);
      }
    };
  }, [backgroundImage]);

  var triggerHaptic = useCallback(function(): void {
    try {
      if (window.navigator && typeof window.navigator.vibrate === 'function') {
        window.navigator.vibrate(50);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  var handleImageError = useCallback(function(index: number): void {
    setImageErrors(function(prev) {
      var newState = Object.assign({}, prev);
      newState[index] = true;
      return newState;
    });
  }, []);

  // If still loading, return null
  if (isLoading) {
    return null;
  }

  var about = content.about || {};
  var aboutItems: AboutItem[] = content.aboutItems || [];
  var fallbackIcon = 'https://icta.go.ke//assets/images/icons/digi.png';
  var featuredItem = aboutItems[0];
  var regularItems = aboutItems.slice(1);
  var aboutLink = 'https://icta.go.ke/page?q=6&type=about_ict_authority';

  return (
    <section className="relative py-16 md:py-24 lg:py-32 overflow-hidden">
      {/* Background Image /}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat will-change-transform"
        style={{ backgroundImage: 'url(' + backgroundImage + ')' }}
      />
      
      {/* Gradient Overlay - More sophisticated than flat white /}
      <div className="absolute inset-0 z-1 bg-gradient-to-b from-white/90 via-white/85 to-white/90 dark:from-black/90 dark:via-black/85 dark:to-black/90 backdrop-blur-sm" />
      
      {/* Content /}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Left Column - About Text (spans 2 columns on desktop) /}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* Eyebrow /}
            <div className="flex items-center gap-3">
              <span className="text-xs md:text-sm font-semibold tracking-widest uppercase text-red-600 dark:text-red-400">
                About ICT Authority
              </span>
              <span className="h-px flex-1 bg-red-600/20 dark:bg-red-400/20" />
            </div>
            
            {/* Main Heading /}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-gray-900 dark:text-white">
              {about.title || 'Building Kenya\'s Digital Future'}
            </h1>
            
            {/* Description /}
            <p className="text-base md:text-lg leading-relaxed text-gray-700 dark:text-gray-300 max-w-lg">
              {about.description1 ||
                "The Authority's broad mandate entails enforcing ICT standards in Government, establishing, developing and maintaining secure ICT infrastructure systems, supervision of electronic communications, as well as promoting digital literacy, capacity, innovation and enterprise."}
            </p>
            
            {/* CTA Button /}
            <div className="pt-2">
              <a
                href={aboutLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={triggerHaptic}
                className="group inline-flex items-center gap-3 bg-red-600 hover:bg-green-600 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-black"
              >
                <span>Explore ICT Authority</span>
                <svg 
                  className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </div>
          </div>
          
          {/* Right Column - Cards (spans 3 columns on desktop) /}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
              
              {/* Featured Card - First item, spans 2 columns /}
              {featuredItem && (
                <div className="sm:col-span-2">
                  <div 
                    className="group relative overflow-hidden rounded-2xl p-6 md:p-8 bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
                  >
                    {/* Subtle gradient accent *}
                    <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-transparent dark:from-red-400/5 pointer-events-none" />
                    
                    <div className="relative flex flex-col md:flex-row items-start gap-5 md:gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/10 flex items-center justify-center">
                          <img
                            src={imageErrors[0] ? fallbackIcon : (featuredItem.icon || fallbackIcon)}
                            alt={featuredItem.title}
                            className="w-10 h-10 md:w-12 md:h-12 object-contain"
                            onError={function() { handleImageError(0); }}
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                      </div>
                      <div className="flex-1 space-y-2">
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                          {featuredItem.title}
                        </h3>
                        <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                          {featuredItem.description}
                        </p>
                        <a
                          href={aboutLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={triggerHaptic}
                          className="group/link inline-flex items-center gap-2 mt-2 text-sm font-semibold text-red-600 dark:text-red-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-300"
                        >
                          Learn More
                          <svg 
                            className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1"
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Regular Cards /}
              {regularItems.map(function(item: AboutItem, index: number) {
                var actualIndex = index + 1; // Adjust for featured card offset
                return (
                  <div key={actualIndex} className="col-span-1">
                    <div 
                      className="group h-full rounded-2xl p-5 md:p-6 bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-red-600/20 dark:hover:border-red-400/20"
                    >
                      <div className="flex flex-col items-start gap-4">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/10 flex items-center justify-center flex-shrink-0">
                          <img
                            src={imageErrors[actualIndex] ? fallbackIcon : (item.icon || fallbackIcon)}
                            alt={item.title}
                            className="w-8 h-8 md:w-9 md:h-9 object-contain"
                            onError={function() { handleImageError(actualIndex); }}
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                        
                        <div className="space-y-1.5 flex-1">
                          <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white">
                            {item.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                        
                        <a
                          href={aboutLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={triggerHaptic}
                          className="group/link inline-flex items-center gap-2 text-sm font-semibold text-red-600 dark:text-red-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-300"
                        >
                          Learn More
                          <svg 
                            className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1"
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
              
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}*/



/*import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useContent } from '../content/useContext';

interface AboutItem {
  title: string;
  description: string;
  icon?: string;
  link: string;
}

// Using function declaration instead of arrow function for better ES5 compatibility
export default function AboutSection() {
  const { content, isLoading } = useContent();
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  
  // Hardcoded background image - can be made dynamic from content later
  var backgroundImage = useMemo(function() { return '/assets/bg_image.jpg'; }, []);
  
  // Preload background image
  useEffect(function() {
    if (!backgroundImage) return;
    var preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.as = 'image';
    preloadLink.href = backgroundImage;
    preloadLink.setAttribute('fetchpriority', 'high');
    document.head.appendChild(preloadLink);
    return function() {
      if (preloadLink.parentNode) {
        document.head.removeChild(preloadLink);
      }
    };
  }, [backgroundImage]);

  var triggerHaptic = useCallback(function(): void {
    try {
      if (window.navigator && typeof window.navigator.vibrate === 'function') {
        window.navigator.vibrate(50);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  var handleImageError = useCallback(function(index: number): void {
    setImageErrors(function(prev) {
      var newState = Object.assign({}, prev);
      newState[index] = true;
      return newState;
    });
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(' + backgroundImage + ')' }}
        />
        <div className="absolute inset-0 z-1 bg-white/80 dark:bg-black/80 backdrop-blur-sm" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse max-w-3xl mx-auto">
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-6" />
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-6" />
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
          </div>
        </div>
      </section>
    );
  }

  var about = content.about || {};
  var aboutItems: AboutItem[] = content.aboutItems || [];
  var fallbackIcon = 'https://icta.go.ke//assets/images/icons/digi.png';
  
  // Featured card = first item, remaining = regular cards
  var featuredItem = aboutItems[0];
  var regularItems = aboutItems.slice(1);

  // About page link (consistent for all CTAs)
  var aboutLink = 'https://icta.go.ke/page?q=6&type=about_ict_authority';

  return (
    <section className="relative py-16 md:py-24 lg:py-32 overflow-hidden">
      {/* Background Image /}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat will-change-transform"
        style={{ backgroundImage: 'url(' + backgroundImage + ')' }}
      />
      
      {/* Gradient Overlay - More sophisticated than flat white/}
      <div className="absolute inset-0 z-1 bg-gradient-to-b from-white/90 via-white/85 to-white/90 dark:from-black/90 dark:via-black/85 dark:to-black/90 backdrop-blur-sm" />
      
      {/* Content /}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Left Column - About Text (spans 2 columns on desktop) /}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* Eyebrow /}
            <div className="flex items-center gap-3">
              <span className="text-xs md:text-sm font-semibold tracking-widest uppercase text-red-600 dark:text-red-400">
                About ICT Authority
              </span>
              <span className="h-px flex-1 bg-red-600/20 dark:bg-red-400/20" />
            </div>
            
            {/* Main Heading /}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-gray-900 dark:text-white">
              {about.title || 'Building Kenya\'s Digital Future'}
            </h1>
            
            {/* Description /}
            <p className="text-base md:text-lg leading-relaxed text-gray-700 dark:text-gray-300 max-w-lg">
              {about.description1 ||
                "The Authority's broad mandate entails enforcing ICT standards in Government, establishing, developing and maintaining secure ICT infrastructure systems, supervision of electronic communications, as well as promoting digital literacy, capacity, innovation and enterprise."}
            </p>
            
            {/* CTA Button /}
            <div className="pt-2">
              <a
                href={aboutLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={triggerHaptic}
                className="group inline-flex items-center gap-3 bg-red-600 hover:bg-green-600 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-black"
              >
                <span>Explore ICT Authority</span>
                <svg 
                  className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </div>
          </div>
          
          {/* Right Column - Cards (spans 3 columns on desktop) /}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
              
              {/* Featured Card - First item, spans 2 columns /}
              {featuredItem && (
                <div className="sm:col-span-2">
                  <div 
                    className="group relative overflow-hidden rounded-2xl p-6 md:p-8 bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
                  >
                    {/* Subtle gradient accent /}
                    <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-transparent dark:from-red-400/5 pointer-events-none" />
                    
                    <div className="relative flex flex-col md:flex-row items-start gap-5 md:gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/10 flex items-center justify-center">
                          <img
                            src={imageErrors[0] ? fallbackIcon : (featuredItem.icon || fallbackIcon)}
                            alt={featuredItem.title}
                            className="w-10 h-10 md:w-12 md:h-12 object-contain"
                            onError={function() { handleImageError(0); }}
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                      </div>
                      <div className="flex-1 space-y-2">
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                          {featuredItem.title}
                        </h3>
                        <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                          {featuredItem.description}
                        </p>
                        <a
                          href={aboutLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={triggerHaptic}
                          className="group/link inline-flex items-center gap-2 mt-2 text-sm font-semibold text-red-600 dark:text-red-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-300"
                        >
                          Learn More
                          <svg 
                            className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1"
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Regular Cards /}
              {regularItems.map(function(item: AboutItem, index: number) {
                var actualIndex = index + 1; // Adjust for featured card offset
                return (
                  <div key={actualIndex} className="col-span-1">
                    <div 
                      className="group h-full rounded-2xl p-5 md:p-6 bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-red-600/20 dark:hover:border-red-400/20"
                    >
                      <div className="flex flex-col items-start gap-4">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/10 flex items-center justify-center flex-shrink-0">
                          <img
                            src={imageErrors[actualIndex] ? fallbackIcon : (item.icon || fallbackIcon)}
                            alt={item.title}
                            className="w-8 h-8 md:w-9 md:h-9 object-contain"
                            onError={function() { handleImageError(actualIndex); }}
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                        
                        <div className="space-y-1.5 flex-1">
                          <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white">
                            {item.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                        
                        <a
                          href={aboutLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={triggerHaptic}
                          className="group/link inline-flex items-center gap-2 text-sm font-semibold text-red-600 dark:text-red-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-300"
                        >
                          Learn More
                          <svg 
                            className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1"
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
              
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}*/


/*import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useContent } from '../content/useContext';

interface AboutItem {
  title: string;
  description: string;
  icon?: string;
  link: string;
}

const AboutSection: React.FC = () => {
  const { content, isLoading } = useContent();
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  
  // Hardcoded background image - can be made dynamic from content later
  const backgroundImage = useMemo(() => '/assets/bg_image.jpg', []);
  
  // Preload background image
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

  const triggerHaptic = useCallback((): void => {
    try {
      if (window.navigator && typeof window.navigator.vibrate === 'function') {
        window.navigator.vibrate(50);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const handleImageError = useCallback((index: number): void => {
    setImageErrors((prev) => ({ ...prev, [index]: true }));
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${backgroundImage}')` }}
        />
        <div className="absolute inset-0 z-1 bg-white/80 dark:bg-black/80 backdrop-blur-sm" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse max-w-3xl mx-auto">
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-6" />
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-6" />
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
          </div>
        </div>
      </section>
    );
  }

  const about = content.about || {};
  const aboutItems: AboutItem[] = content.aboutItems || [];
  const fallbackIcon = 'https://icta.go.ke//assets/images/icons/digi.png';
  
  // Featured card = first item, remaining = regular cards
  const featuredItem = aboutItems[0];
  const regularItems = aboutItems.slice(1);

  // About page link (consistent for all CTAs)
  const aboutLink = 'https://icta.go.ke/page?q=6&type=about_ict_authority';

  return (
    <section className="relative py-16 md:py-24 lg:py-32 overflow-hidden">
      {/* Background Image /}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat will-change-transform"
        style={{ backgroundImage: `url('${backgroundImage}')` }}
      />
      
      {/* Gradient Overlay - More sophisticated than flat white /}
      <div className="absolute inset-0 z-1 bg-gradient-to-b from-white/90 via-white/85 to-white/90 dark:from-black/90 dark:via-black/85 dark:to-black/90 backdrop-blur-sm" />
      
      {/* Content /}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Left Column - About Text (spans 2 columns on desktop) /}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* Eyebrow /}
            <div className="flex items-center gap-3">
              <span className="text-xs md:text-sm font-semibold tracking-widest uppercase text-red-600 dark:text-red-400">
                About ICT Authority
              </span>
              <span className="h-px flex-1 bg-red-600/20 dark:bg-red-400/20" />
            </div>
            
            {/* Main Heading /}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-gray-900 dark:text-white">
              {about.title || 'Building Kenya\'s Digital Future'}
            </h1>
            
            {/* Description /}
            <p className="text-base md:text-lg leading-relaxed text-gray-700 dark:text-gray-300 max-w-lg">
              {about.description1 ||
                "The Authority's broad mandate entails enforcing ICT standards in Government, establishing, developing and maintaining secure ICT infrastructure systems, supervision of electronic communications, as well as promoting digital literacy, capacity, innovation and enterprise."}
            </p>
            
            {/* CTA Button /}
            <div className="pt-2">
              <a
                href={aboutLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={triggerHaptic}
                className="group inline-flex items-center gap-3 bg-red-600 hover:bg-green-600 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-black"
              >
                <span>Explore ICT Authority</span>
                <svg 
                  className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </div>
          </div>
          
          {/* Right Column - Cards (spans 3 columns on desktop) /}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
              
              {/* Featured Card - First item, spans 2 columns /}
              {featuredItem && (
                <div className="sm:col-span-2">
                  <div 
                    className="group relative overflow-hidden rounded-2xl p-6 md:p-8 bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
                  >
                    {/* Subtle gradient accent /}
                    <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-transparent dark:from-red-400/5 pointer-events-none" />
                    
                    <div className="relative flex flex-col md:flex-row items-start gap-5 md:gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/10 flex items-center justify-center">
                          <img
                            src={imageErrors[0] ? fallbackIcon : (featuredItem.icon || fallbackIcon)}
                            alt={featuredItem.title}
                            className="w-10 h-10 md:w-12 md:h-12 object-contain"
                            onError={() => handleImageError(0)}
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                      </div>
                      <div className="flex-1 space-y-2">
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                          {featuredItem.title}
                        </h3>
                        <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                          {featuredItem.description}
                        </p>
                        <a
                          href={aboutLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={triggerHaptic}
                          className="group/link inline-flex items-center gap-2 mt-2 text-sm font-semibold text-red-600 dark:text-red-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-300"
                        >
                          Learn More
                          <svg 
                            className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1"
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Regular Cards /}
              {regularItems.map((item: AboutItem, index: number) => {
                const actualIndex = index + 1; // Adjust for featured card offset
                return (
                  <div key={actualIndex} className="col-span-1">
                    <div 
                      className="group h-full rounded-2xl p-5 md:p-6 bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-red-600/20 dark:hover:border-red-400/20"
                    >
                      <div className="flex flex-col items-start gap-4">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/10 flex items-center justify-center flex-shrink-0">
                          <img
                            src={imageErrors[actualIndex] ? fallbackIcon : (item.icon || fallbackIcon)}
                            alt={item.title}
                            className="w-8 h-8 md:w-9 md:h-9 object-contain"
                            onError={() => handleImageError(actualIndex)}
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                        
                        <div className="space-y-1.5 flex-1">
                          <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white">
                            {item.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                        
                        <a
                          href={aboutLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={triggerHaptic}
                          className="group/link inline-flex items-center gap-2 text-sm font-semibold text-red-600 dark:text-red-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-300"
                        >
                          Learn More
                          <svg 
                            className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1"
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
              
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default AboutSection;*/


/*import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useContent } from '../content/useContext';

interface AboutItem {
  title: string;
  description: string;
  icon?: string;
  link: string;
}

const AboutSection: React.FC = () => {
  const { content, isLoading } = useContent();
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  // Hardcoded background image i'll later make this dynamic from content
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

  const triggerHaptic = useCallback((): void => {
    try {
      if (window.navigator && typeof window.navigator.vibrate === 'function') {
        window.navigator.vibrate(50);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const handleImageError = useCallback((index: number): void => {
    setImageErrors((prev) => ({ ...prev, [index]: true }));
  }, []);

  if (isLoading) {
    return (
      <section
        className="about-section"
        style={{
          position: 'relative',
          paddingTop: '3rem',
          paddingBottom: '3rem',
          overflow: 'hidden',
        }}
      >
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
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1,
            backgroundColor: 'rgba(255,255,255,0.8)',
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </section>
    );
  }

  const about = content.about || {};
  const aboutItems: AboutItem[] = content.aboutItems || [];
  const fallbackIcon = 'https://icta.go.ke//assets/images/icons/digi.png';

  return (
    <section
      className="about-section"
      style={{
        position: 'relative',
        paddingTop: '3rem',
        paddingBottom: '3rem',
        overflow: 'hidden',
      }}
    >
      {/* Background Image /}
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
          backgroundAttachment: 'fixed',
        }}
      />
      {/* Overlay - Light mode white, Dark mode black /}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
        }}
        className="dark:bg-black/85"
      />
      {/* Content /}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
          {/* Left Column - Main About /}
          <div className="space-y-4 md:space-y-6">
            <h1
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight"
              style={{ color: '#1a1a1a' }}
            >
              {about.title || 'About ICT Authority'}
            </h1>
            <p
              className="leading-relaxed text-sm sm:text-base md:text-lg"
              style={{ color: '#4a4a4a' }}
            >
              {about.description1 ||
                "The Authority's broad mandate entails enforcing ICT standards in Government, establishing, developing and maintaining secure ICT infrastructure systems, supervision of electronic communications, as well as promoting digital literacy, capacity, innovation and enterprise."}
            </p>
            <a
              href="https://icta.go.ke/page?q=6&type=about_ict_authority"
              target="_blank"
              rel="noopener noreferrer"
              onClick={triggerHaptic}
              className="inline-flex items-center gap-2 text-white px-6 py-3 md:px-8 md:py-4 rounded-lg font-bold text-sm md:text-base transition-all duration-300 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 group"
              style={{ backgroundColor: '#dc2626' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#16a34a')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#dc2626')}
            >
              <span>Learn More</span>
              <svg
                className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          </div>

          {/* Right Column - About Items Grid /}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            {aboutItems.map((item: AboutItem, index: number) => (
              <div
                key={index}
                className="group rounded-xl p-4 md:p-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                }}
              >
                <div className="flex gap-4 md:gap-5 items-start">
                  <div className="flex-shrink-0">
                    <img
                      src={imageErrors[index] ? fallbackIcon : (item.icon || fallbackIcon)}
                      alt={item.title}
                      className="w-12 h-12 md:w-16 md:h-16 object-contain transition-transform duration-300 group-hover:scale-110"
                      onError={() => handleImageError(index)}
                    />
                  </div>
                  <div className="flex-1">
                    <h3
                      className="text-base md:text-lg lg:text-xl font-bold mb-2 md:mb-3 transition-colors duration-300"
                      style={{ color: '#1a1a1a' }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="text-xs sm:text-sm md:text-base mb-3 md:mb-4 leading-relaxed"
                      style={{ color: '#6b7280' }}
                    >
                      {item.description}
                    </p>
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={triggerHaptic}
                      className="inline-flex items-center gap-1 text-sm font-semibold transition-all duration-300 group-hover:gap-2 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                      style={{ color: '#dc2626' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#16a34a')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#dc2626')}
                    >
                      Learn More
                      <svg
                        className="w-3 h-3 md:w-4 md:h-4 transition-transform duration-300 group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;*/

