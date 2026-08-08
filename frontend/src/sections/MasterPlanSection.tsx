import React, { useState, useCallback } from 'react';
import { useContent } from '../content/useContext';

interface MasterplanItem {
  icon: string;
  title: string;
  description: string;
  link?: string;
}

interface MasterplanTab {
  id?: string;
  title: string;
  description: string;
  ctaLink: string;
  ctaText: string;
  items?: MasterplanItem[];
}

export default function MasterplanSection() {
  const { content, isLoading } = useContent();
  const [activeTab, setActiveTab] = useState<number>(0);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  
  const masterplanTabs: MasterplanTab[] = content.masterplanTabs || [];
  const currentTab: MasterplanTab | undefined = masterplanTabs[activeTab] || masterplanTabs[0];
  
  const triggerHaptic = useCallback((): void => {
    try {
      if (window.navigator && typeof window.navigator.vibrate === "function") {
        window.navigator.vibrate(50);
      }
    } catch (e) {
      // ignore
    }
  }, []);
  
  const handleImageError = useCallback((index: number): void => {
    setImageErrors(function(prev) {
      var newState = Object.assign({}, prev);
      newState[index] = true;
      return newState;
    });
  }, []);
  
  var fallbackIcon = 'https://icta.go.ke//assets/images/icons/digi.png';
  
  // If still loading, return null
  if (isLoading) {
    return null;
  }
  
  if (masterplanTabs.length === 0 || !currentTab) return null;
  
  var featuredItem = currentTab.items && currentTab.items.length > 0 ? currentTab.items[0] : null;
  var regularItems = currentTab.items && currentTab.items.length > 1 ? currentTab.items.slice(1) : [];

  // Select a tab and close dropdown
  var selectTab = function(index: number): void {
    setActiveTab(index);
    setIsDropdownOpen(false);
    triggerHaptic();
  };

  return (
    <section className="py-12 md:py-20 bg-gray-50 dark:bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14 lg:mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-xs md:text-sm font-semibold tracking-widest uppercase text-primary dark:text-primary-light">
              Our Masterplan
            </span>
            <span className="h-px w-12 bg-primary/20 dark:bg-primary-light/20" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
            Strategic Pillars
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm md:text-base lg:text-lg">
            Explore our key strategic areas driving Kenya's digital transformation
          </p>
        </div>
        
        {/* Mobile: Dropdown Selector */}
        <div className="md:hidden mb-8">
          <button
            onClick={function() { setIsDropdownOpen(!isDropdownOpen); }}
            className="w-full flex items-center justify-between px-5 py-3.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-black"
            aria-expanded={isDropdownOpen}
            aria-haspopup="listbox"
          >
            <span className="font-semibold text-gray-900 dark:text-white text-sm">
              {currentTab.title}
            </span>
            <svg 
              className={'w-5 h-5 text-gray-500 transition-transform duration-300 ' + (isDropdownOpen ? 'rotate-180' : '')}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {/* Dropdown menu */}
          {isDropdownOpen && (
            <div className="mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden z-20">
              {masterplanTabs.map(function(tab: MasterplanTab, idx: number) {
                return (
                  <button
                    key={tab.id || idx}
                    onClick={function() { selectTab(idx); }}
                    className={
                      'w-full text-left px-5 py-3.5 text-sm font-medium transition-all duration-200 border-b border-gray-100 dark:border-gray-700 last:border-0 ' +
                      (activeTab === idx
                        ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50')
                    }
                  >
                    <div className="flex items-center justify-between">
                      <span>{tab.title}</span>
                      {activeTab === idx && (
                        <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
        
        {/* Desktop: Pill Tabs */}
        <div className="hidden md:flex flex-wrap justify-center gap-3 mb-12 md:mb-16">
          {masterplanTabs.map(function(tab: MasterplanTab, idx: number) {
            return (
              <button
                key={tab.id || idx}
                onClick={function() { triggerHaptic(); setActiveTab(idx); }}
                className={
                  'px-6 lg:px-8 py-2.5 lg:py-3 rounded-lg font-semibold text-sm lg:text-base ' +
                  'transition-all duration-300 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-black ' +
                  (activeTab === idx
                    ? 'bg-primary text-white shadow-lg hover:bg-green-600 hover:scale-105'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-primary hover:bg-primary/10 border border-gray-200 dark:border-gray-700')
                }
              >
                {tab.title}
              </button>
            );
          })}
        </div>
        
        {/* Tab Content - Asymmetric Layout */}
        {currentTab && (
          <div className="grid lg:grid-cols-5 gap-6 md:gap-8 lg:gap-12">
            
            {/* Left Column - Main Content (2/5) */}
            <div className="lg:col-span-2 space-y-4 md:space-y-5 lg:space-y-6">
              <div className="space-y-2 md:space-y-3">
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-primary dark:text-primary-light uppercase tracking-wider">
                  <span className="w-8 h-px bg-primary/30 dark:bg-primary-light/30" />
                  <span className="hidden sm:inline">Pillar {activeTab + 1}</span>
                </div>
                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                  {currentTab.title}
                </h3>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm md:text-base lg:text-lg">
                {currentTab.description}
              </p>
              
              {currentTab.ctaLink && (
                <div className="pt-2">
                  <a
                    href={currentTab.ctaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={triggerHaptic}
                    className="group inline-flex items-center gap-3 bg-primary text-white font-semibold px-6 md:px-7 lg:px-8 py-3 md:py-3.5 rounded-lg transition-all duration-300 hover:bg-green-600 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-black"
                  >
                    <span className="text-sm md:text-base">{currentTab.ctaText}</span>
                    <svg 
                      className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 group-hover:translate-x-1" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </a>
                </div>
              )}
              
              {/* Tab indicator dots - visible on all screens */}
              <div className="flex gap-1.5 pt-4">
                {masterplanTabs.map(function(_, idx) {
                  return (
                    <button
                      key={idx}
                      onClick={function() { selectTab(idx); }}
                      className={
                        'w-2 h-2 rounded-full transition-all duration-300 ' +
                        (activeTab === idx 
                          ? 'w-8 bg-primary dark:bg-primary-light' 
                          : 'bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600')
                      }
                      aria-label={'Go to tab ' + (idx + 1)}
                    />
                  );
                })}
              </div>
            </div>
            
            {/* Right Column - Items Grid (3/5) */}
            <div className="lg:col-span-3">
              {currentTab.items && currentTab.items.length > 0 ? (
                // Card grid with explicit gap and margin-bottom for ES5 fallback
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5 lg:gap-6">
                  
                  {/* Featured Item - First item spans 2 columns */}
                  {featuredItem && (
                    <div className="sm:col-span-2 mb-4 sm:mb-0">
                      <div className="group relative overflow-hidden rounded-xl p-5 md:p-6 lg:p-8 bg-white dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                        {/* Gradient accent with primary color */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-green-500/5 dark:from-primary/5 dark:to-green-500/5 pointer-events-none" />
                        
                        <div className="relative flex flex-col sm:flex-row items-start gap-4 md:gap-5 lg:gap-6">
                          <div className="flex-shrink-0">
                            <div className="w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-xl bg-gradient-to-br from-primary/10 to-green-500/10 dark:from-primary/20 dark:to-green-500/20 flex items-center justify-center">
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
                            <h4 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
                              {featuredItem.title}
                            </h4>
                            <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                              {featuredItem.description}
                            </p>
                            {featuredItem.link && (
                              <a
                                href={featuredItem.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={triggerHaptic}
                                className="group/link inline-flex items-center gap-2 mt-1 text-sm font-semibold text-primary hover:text-green-600 dark:text-primary-light dark:hover:text-green-400 transition-colors duration-300"
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
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Regular Items - with explicit margin for ES5 fallback */}
                  {regularItems.map(function(item: MasterplanItem, index: number) {
                    var actualIndex = index + 1;
                    return (
                      <div key={actualIndex} className="col-span-1 mb-4 sm:mb-0">
                        <div className="group h-full rounded-xl p-4 md:p-5 lg:p-6 bg-white dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 dark:hover:border-primary/20">
                          <div className="flex flex-col items-start gap-3 md:gap-4">
                            <div className="w-11 h-11 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-xl bg-gradient-to-br from-primary/10 to-green-500/10 dark:from-primary/20 dark:to-green-500/20 flex items-center justify-center flex-shrink-0">
                              <img
                                src={imageErrors[actualIndex] ? fallbackIcon : (item.icon || fallbackIcon)}
                                alt={item.title}
                                className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 object-contain"
                                onError={function() { handleImageError(actualIndex); }}
                                loading="lazy"
                                decoding="async"
                              />
                            </div>
                            
                            <div className="space-y-1 flex-1">
                              <h4 className="text-sm md:text-base lg:text-lg font-bold text-gray-900 dark:text-white">
                                {item.title}
                              </h4>
                              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                {item.description}
                              </p>
                            </div>
                            
                            {item.link && (
                              <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={triggerHaptic}
                                className="group/link inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-primary hover:text-green-600 dark:text-primary-light dark:hover:text-green-400 transition-colors duration-300"
                              >
                                Learn More
                                <svg 
                                  className="w-3 h-3 md:w-4 md:h-4 transition-transform duration-300 group-hover/link:translate-x-1" 
                                  fill="none" 
                                  stroke="currentColor" 
                                  viewBox="0 0 24 24"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                </div>
              ) : (
                <div className="hidden"></div>
              )}
            </div>
            
          </div>
        )}
      </div>
    </section>
  );
}
/*import React, { useState, useCallback } from 'react';
import { useContent } from '../content/useContext';

interface MasterplanItem {
  icon: string;
  title: string;
  description: string;
  link?: string;
}

interface MasterplanTab {
  id?: string;
  title: string;
  description: string;
  ctaLink: string;
  ctaText: string;
  items?: MasterplanItem[];
}

export default function MasterplanSection() {
  const { content, isLoading } = useContent();
  const [activeTab, setActiveTab] = useState<number>(0);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  
  const masterplanTabs: MasterplanTab[] = content.masterplanTabs || [];
  const currentTab: MasterplanTab | undefined = masterplanTabs[activeTab] || masterplanTabs[0];
  
  const triggerHaptic = useCallback((): void => {
    try {
      if (window.navigator && typeof window.navigator.vibrate === "function") {
        window.navigator.vibrate(50);
      }
    } catch (e) {
      // ignore
    }
  }, []);
  
  const handleImageError = useCallback((index: number): void => {
    setImageErrors(function(prev) {
      var newState = Object.assign({}, prev);
      newState[index] = true;
      return newState;
    });
  }, []);
  
  var fallbackIcon = 'https://icta.go.ke//assets/images/icons/digi.png';
  
  // If still loading, return null
  if (isLoading) {
    return null;
  }
  
  if (masterplanTabs.length === 0 || !currentTab) return null;
  
  var featuredItem = currentTab.items && currentTab.items.length > 0 ? currentTab.items[0] : null;
  var regularItems = currentTab.items && currentTab.items.length > 1 ? currentTab.items.slice(1) : [];
  
  return (
    <section className="py-12 md:py-20 bg-gray-50 dark:bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header /}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-xs md:text-sm font-semibold tracking-widest uppercase text-primary dark:text-primary-light">
              Our Masterplan
            </span>
            <span className="h-px w-12 bg-primary/20 dark:bg-primary-light/20" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
            Strategic Pillars
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400 text-base md:text-lg">
            Explore our key strategic areas driving Kenya's digital transformation
          </p>
        </div>
        
        {/* Modern Tabs - Pill/Segment Style with Original Colors /}
        <div className="flex flex-wrap justify-center gap-3 mb-12 md:mb-16">
          {masterplanTabs.map(function(tab: MasterplanTab, idx: number) {
            return (
              <button
                key={tab.id || idx}
                onClick={function() { triggerHaptic(); setActiveTab(idx); }}
                className={
                  'px-6 md:px-8 py-2.5 md:py-3 rounded-lg font-semibold text-sm md:text-base ' +
                  'transition-all duration-300 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-black ' +
                  (activeTab === idx
                    ? 'bg-primary text-white shadow-lg hover:bg-green-600 hover:scale-105'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-primary hover:bg-primary/10 border border-gray-200 dark:border-gray-700')
                }
              >
                {tab.title}
              </button>
            );
          })}
        </div>
        
        {/* Tab Content - Asymmetric Layout /}
        {currentTab && (
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
            
            {/* Left Column - Main Content (2/5) /}
            <div className="lg:col-span-2 space-y-5 md:space-y-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-primary dark:text-primary-light uppercase tracking-wider">
                  <span className="w-8 h-px bg-primary/30 dark:bg-primary-light/30" />
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                  {currentTab.title}
                </h3>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base md:text-lg">
                {currentTab.description}
              </p>
              
              {currentTab.ctaLink && (
                <div className="pt-2">
                  <a
                    href={currentTab.ctaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={triggerHaptic}
                    className="group inline-flex items-center gap-3 bg-primary text-white font-semibold px-7 py-3.5 rounded-lg transition-all duration-300 hover:bg-green-600 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-black"
                  >
                    <span>{currentTab.ctaText}</span>
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
              )}
              
              {/* Tab indicator dots *}
              <div className="flex gap-1.5 pt-4">
                {masterplanTabs.map(function(_, idx) {
                  return (
                    <button
                      key={idx}
                      onClick={function() { setActiveTab(idx); }}
                      className={
                        'w-2 h-2 rounded-full transition-all duration-300 ' +
                        (activeTab === idx 
                          ? 'w-8 bg-primary dark:bg-primary-light' 
                          : 'bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600')
                      }
                      aria-label={'Go to tab ' + (idx + 1)}
                    />
                  );
                })}
              </div>
            </div>
            
            {/* Right Column - Items Grid (3/5) /}
            <div className="lg:col-span-3">
              {currentTab.items && currentTab.items.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
                  
                  {/* Featured Item - First item spans 2 columns /}
                  {featuredItem && (
                    <div className="sm:col-span-2">
                      <div className="group relative overflow-hidden rounded-xl p-6 md:p-8 bg-white dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                        {/* Gradient accent with primary color /}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-green-500/5 dark:from-primary/5 dark:to-green-500/5 pointer-events-none" />
                        
                        <div className="relative flex flex-col md:flex-row items-start gap-5 md:gap-6">
                          <div className="flex-shrink-0">
                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-gradient-to-br from-primary/10 to-green-500/10 dark:from-primary/20 dark:to-green-500/20 flex items-center justify-center">
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
                            <h4 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                              {featuredItem.title}
                            </h4>
                            <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                              {featuredItem.description}
                            </p>
                            {featuredItem.link && (
                              <a
                                href={featuredItem.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={triggerHaptic}
                                className="group/link inline-flex items-center gap-2 mt-1 text-sm font-semibold text-primary hover:text-green-600 dark:text-primary-light dark:hover:text-green-400 transition-colors duration-300"
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
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Regular Items /}
                  {regularItems.map(function(item: MasterplanItem, index: number) {
                    var actualIndex = index + 1;
                    return (
                      <div key={actualIndex} className="col-span-1">
                        <div className="group h-full rounded-xl p-5 md:p-6 bg-white dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 dark:hover:border-primary/20">
                          <div className="flex flex-col items-start gap-4">
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-primary/10 to-green-500/10 dark:from-primary/20 dark:to-green-500/20 flex items-center justify-center flex-shrink-0">
                              <img
                                src={imageErrors[actualIndex] ? fallbackIcon : (item.icon || fallbackIcon)}
                                alt={item.title}
                                className="w-7 h-7 md:w-8 md:h-8 object-contain"
                                onError={function() { handleImageError(actualIndex); }}
                                loading="lazy"
                                decoding="async"
                              />
                            </div>
                            
                            <div className="space-y-1.5 flex-1">
                              <h4 className="text-base md:text-lg font-bold text-gray-900 dark:text-white">
                                {item.title}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                {item.description}
                              </p>
                            </div>
                            
                            {item.link && (
                              <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={triggerHaptic}
                                className="group/link inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-green-600 dark:text-primary-light dark:hover:text-green-400 transition-colors duration-300"
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
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                </div>
              ) : (
                <div className="hidden"></div>
              )}
            </div>
            
          </div>
        )}
      </div>
    </section>
  );
}*/



/*import React, { useState, useCallback } from 'react';
import { useContent } from '../content/useContext';

interface MasterplanItem {
  icon: string;
  title: string;
  description: string;
  link?: string;
}

interface MasterplanTab {
  id?: string;
  title: string;
  description: string;
  ctaLink: string;
  ctaText: string;
  items?: MasterplanItem[];
}

// Using function declaration instead of arrow function for better ES5 compatibility
export default function MasterplanSection() {
  const { content, isLoading } = useContent();
  const [activeTab, setActiveTab] = useState<number>(0);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  
  const masterplanTabs: MasterplanTab[] = content.masterplanTabs || [];
  const currentTab: MasterplanTab | undefined = masterplanTabs[activeTab] || masterplanTabs[0];
  
  const triggerHaptic = useCallback((): void => {
    try {
      if (window.navigator && typeof window.navigator.vibrate === "function") {
        window.navigator.vibrate(50);
      }
    } catch (e) {
      // ignore
    }
  }, []);
  
  const handleImageError = useCallback((index: number): void => {
    setImageErrors(function(prev) {
      // Using Object.assign instead of spread for better ES5 compatibility
      var newState = Object.assign({}, prev);
      newState[index] = true;
      return newState;
    });
  }, []);
  
  var fallbackIcon = 'https://icta.go.ke//assets/images/icons/digi.png';
  
  if (isLoading) {
    return (
      <section className="py-12 md:py-20 bg-gray-50 dark:bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="flex flex-wrap gap-2 mb-8 md:mb-12">
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-28"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
            </div>
            <div className="grid lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  if (masterplanTabs.length === 0 || !currentTab) return null;
  
  // Split items into featured (first) and regular (rest)
  var featuredItem = currentTab.items && currentTab.items.length > 0 ? currentTab.items[0] : null;
  var regularItems = currentTab.items && currentTab.items.length > 1 ? currentTab.items.slice(1) : [];
  
  return (
    <section className="py-12 md:py-20 bg-gray-50 dark:bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header /}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-xs md:text-sm font-semibold tracking-widest uppercase text-primary dark:text-primary-light">
              Our Masterplan
            </span>
            <span className="h-px w-12 bg-primary/20 dark:bg-primary-light/20" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
            Strategic Pillars
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400 text-base md:text-lg">
            Explore our key strategic areas driving Kenya's digital transformation
          </p>
        </div>
        
        {/* Modern Tabs - Pill/Segment Style with Original Colors /}
        <div className="flex flex-wrap justify-center gap-3 mb-12 md:mb-16">
          {masterplanTabs.map(function(tab: MasterplanTab, idx: number) {
            return (
              <button
                key={tab.id || idx}
                onClick={function() { triggerHaptic(); setActiveTab(idx); }}
                className={
                  'px-6 md:px-8 py-2.5 md:py-3 rounded-lg font-semibold text-sm md:text-base ' +
                  'transition-all duration-300 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-black ' +
                  (activeTab === idx
                    ? 'bg-primary text-white shadow-lg hover:bg-green-600 hover:scale-105'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-primary hover:bg-primary/10 border border-gray-200 dark:border-gray-700')
                }
              >
                {tab.title}
              </button>
            );
          })}
        </div>
        
        {/* Tab Content - Asymmetric Layout /}
        {currentTab && (
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
            
            {/* Left Column - Main Content (2/5) /}
            <div className="lg:col-span-2 space-y-5 md:space-y-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-primary dark:text-primary-light uppercase tracking-wider">
                  <span className="w-8 h-px bg-primary/30 dark:bg-primary-light/30" />
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                  {currentTab.title}
                </h3>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base md:text-lg">
                {currentTab.description}
              </p>
              
              {currentTab.ctaLink && (
                <div className="pt-2">
                  <a
                    href={currentTab.ctaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={triggerHaptic}
                    className="group inline-flex items-center gap-3 bg-primary text-white font-semibold px-7 py-3.5 rounded-lg transition-all duration-300 hover:bg-green-600 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-black"
                  >
                    <span>{currentTab.ctaText}</span>
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
              )}
              
              {/* Tab indicator dots /}
              <div className="flex gap-1.5 pt-4">
                {masterplanTabs.map(function(_, idx) {
                  return (
                    <button
                      key={idx}
                      onClick={function() { setActiveTab(idx); }}
                      className={
                        'w-2 h-2 rounded-full transition-all duration-300 ' +
                        (activeTab === idx 
                          ? 'w-8 bg-primary dark:bg-primary-light' 
                          : 'bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600')
                      }
                      aria-label={'Go to tab ' + (idx + 1)}
                    />
                  );
                })}
              </div>
            </div>
            
            {/* Right Column - Items Grid (3/5) /}
            <div className="lg:col-span-3">
              {currentTab.items && currentTab.items.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
                  
                  {/* Featured Item - First item spans 2 columns /}
                  {featuredItem && (
                    <div className="sm:col-span-2">
                      <div className="group relative overflow-hidden rounded-xl p-6 md:p-8 bg-white dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                        {/* Gradient accent with primary color /}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-green-500/5 dark:from-primary/5 dark:to-green-500/5 pointer-events-none" />
                        
                        <div className="relative flex flex-col md:flex-row items-start gap-5 md:gap-6">
                          <div className="flex-shrink-0">
                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-gradient-to-br from-primary/10 to-green-500/10 dark:from-primary/20 dark:to-green-500/20 flex items-center justify-center">
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
                            <h4 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                              {featuredItem.title}
                            </h4>
                            <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                              {featuredItem.description}
                            </p>
                            {featuredItem.link && (
                              <a
                                href={featuredItem.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={triggerHaptic}
                                className="group/link inline-flex items-center gap-2 mt-1 text-sm font-semibold text-primary hover:text-green-600 dark:text-primary-light dark:hover:text-green-400 transition-colors duration-300"
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
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Regular Items /}
                  {regularItems.map(function(item: MasterplanItem, index: number) {
                    var actualIndex = index + 1;
                    return (
                      <div key={actualIndex} className="col-span-1">
                        <div className="group h-full rounded-xl p-5 md:p-6 bg-white dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 dark:hover:border-primary/20">
                          <div className="flex flex-col items-start gap-4">
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-primary/10 to-green-500/10 dark:from-primary/20 dark:to-green-500/20 flex items-center justify-center flex-shrink-0">
                              <img
                                src={imageErrors[actualIndex] ? fallbackIcon : (item.icon || fallbackIcon)}
                                alt={item.title}
                                className="w-7 h-7 md:w-8 md:h-8 object-contain"
                                onError={function() { handleImageError(actualIndex); }}
                                loading="lazy"
                                decoding="async"
                              />
                            </div>
                            
                            <div className="space-y-1.5 flex-1">
                              <h4 className="text-base md:text-lg font-bold text-gray-900 dark:text-white">
                                {item.title}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                {item.description}
                              </p>
                            </div>
                            
                            {item.link && (
                              <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={triggerHaptic}
                                className="group/link inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-green-600 dark:text-primary-light dark:hover:text-green-400 transition-colors duration-300"
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
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                </div>
              ) : (
                <div className="hidden"></div>
              )}
            </div>
            
          </div>
        )}
      </div>
    </section>
  );
}*/


/*
import React, { useState, useCallback } from 'react';
import { useContent } from '../content/useContext';

interface MasterplanItem {
  icon: string;
  title: string;
  description: string;
  link?: string;
}

interface MasterplanTab {
  id?: string;
  title: string;
  description: string;
  ctaLink: string;
  ctaText: string;
  items?: MasterplanItem[];
}

const MasterplanSection: React.FC = () => {
  const { content, isLoading } = useContent();
  const [activeTab, setActiveTab] = useState<number>(0);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  
  const masterplanTabs: MasterplanTab[] = content.masterplanTabs || [];
  const currentTab: MasterplanTab | undefined = masterplanTabs[activeTab] || masterplanTabs[0];
  
  const triggerHaptic = useCallback((): void => {
    try {
      if (window.navigator && typeof window.navigator.vibrate === "function") {
        window.navigator.vibrate(50);
      }
    } catch (e) {}
  }, []);
  
  const handleImageError = useCallback((index: number): void => {
    setImageErrors((prev) => ({ ...prev, [index]: true }));
  }, []);
  
  const fallbackIcon = 'https://icta.go.ke//assets/images/icons/digi.png';
  
  if (isLoading) {
    return (
      <section className="py-12 md:py-20 bg-gray-50 dark:bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="flex flex-wrap gap-2 mb-8 md:mb-12">
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-28"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
            </div>
            <div className="grid lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  if (masterplanTabs.length === 0 || !currentTab) return null;
  
  // Split items into featured (first) and regular (rest)
  const featuredItem = currentTab.items && currentTab.items.length > 0 ? currentTab.items[0] : null;
  const regularItems = currentTab.items && currentTab.items.length > 1 ? currentTab.items.slice(1) : [];
  
  return (
    <section className="py-12 md:py-20 bg-gray-50 dark:bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header /}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-xs md:text-sm font-semibold tracking-widest uppercase text-primary dark:text-primary-light">
              Our Masterplan
            </span>
            <span className="h-px w-12 bg-primary/20 dark:bg-primary-light/20" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
            Strategic Pillars
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400 text-base md:text-lg">
            Explore our key strategic areas driving Kenya's digital transformation
          </p>
        </div>
        
        {/* Modern Tabs - Pill/Segment Style with Original Colors /}
        <div className="flex flex-wrap justify-center gap-3 mb-12 md:mb-16">
          {masterplanTabs.map((tab: MasterplanTab, idx: number) => (
            <button
              key={tab.id || idx}
              onClick={() => { triggerHaptic(); setActiveTab(idx); }}
              className={`
                px-6 md:px-8 py-2.5 md:py-3 rounded-lg font-semibold text-sm md:text-base 
                transition-all duration-300 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-black
                ${activeTab === idx
                  ? 'bg-primary text-white shadow-lg hover:bg-green-600 hover:scale-105'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-primary hover:bg-primary/10 border border-gray-200 dark:border-gray-700'
                }
              `}
            >
              {tab.title}
            </button>
          ))}
        </div>
        
        {/* Tab Content - Asymmetric Layout /}
        {currentTab && (
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
            
            {/* Left Column - Main Content (2/5) /}
            <div className="lg:col-span-2 space-y-5 md:space-y-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-primary dark:text-primary-light uppercase tracking-wider">
                  <span className="w-8 h-px bg-primary/30 dark:bg-primary-light/30" />
                  {/*<span>Pillar {activeTab + 1}</span>/}
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                  {currentTab.title}
                </h3>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base md:text-lg">
                {currentTab.description}
              </p>
              
              {currentTab.ctaLink && (
                <div className="pt-2">
                  <a
                    href={currentTab.ctaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={triggerHaptic}
                    className="group inline-flex items-center gap-3 bg-primary text-white font-semibold px-7 py-3.5 rounded-lg transition-all duration-300 hover:bg-green-600 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-black"
                  >
                    <span>{currentTab.ctaText}</span>
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
              )}
              
              {/* Tab indicator dots /}
              <div className="flex gap-1.5 pt-4">
                {masterplanTabs.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTab(idx)}
                    className={`
                      w-2 h-2 rounded-full transition-all duration-300
                      ${activeTab === idx 
                        ? 'w-8 bg-primary dark:bg-primary-light' 
                        : 'bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600'
                      }
                    `}
                    aria-label={`Go to tab ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
            
            {/* Right Column - Items Grid (3/5) /}
            <div className="lg:col-span-3">
              {currentTab.items && currentTab.items.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
                  
                  {/* Featured Item - First item spans 2 columns /}
                  {featuredItem && (
                    <div className="sm:col-span-2">
                      <div className="group relative overflow-hidden rounded-xl p-6 md:p-8 bg-white dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                        {/* Gradient accent with primary color /}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-green-500/5 dark:from-primary/5 dark:to-green-500/5 pointer-events-none" />
                        
                        <div className="relative flex flex-col md:flex-row items-start gap-5 md:gap-6">
                          <div className="flex-shrink-0">
                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-gradient-to-br from-primary/10 to-green-500/10 dark:from-primary/20 dark:to-green-500/20 flex items-center justify-center">
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
                            <h4 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                              {featuredItem.title}
                            </h4>
                            <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                              {featuredItem.description}
                            </p>
                            {featuredItem.link && (
                              <a
                                href={featuredItem.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={triggerHaptic}
                                className="group/link inline-flex items-center gap-2 mt-1 text-sm font-semibold text-primary hover:text-green-600 dark:text-primary-light dark:hover:text-green-400 transition-colors duration-300"
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
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Regular Items /}
                  {regularItems.map((item: MasterplanItem, index: number) => {
                    const actualIndex = index + 1;
                    return (
                      <div key={actualIndex} className="col-span-1">
                        <div className="group h-full rounded-xl p-5 md:p-6 bg-white dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 dark:hover:border-primary/20">
                          <div className="flex flex-col items-start gap-4">
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-primary/10 to-green-500/10 dark:from-primary/20 dark:to-green-500/20 flex items-center justify-center flex-shrink-0">
                              <img
                                src={imageErrors[actualIndex] ? fallbackIcon : (item.icon || fallbackIcon)}
                                alt={item.title}
                                className="w-7 h-7 md:w-8 md:h-8 object-contain"
                                onError={() => handleImageError(actualIndex)}
                                loading="lazy"
                                decoding="async"
                              />
                            </div>
                            
                            <div className="space-y-1.5 flex-1">
                              <h4 className="text-base md:text-lg font-bold text-gray-900 dark:text-white">
                                {item.title}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                {item.description}
                              </p>
                            </div>
                            
                            {item.link && (
                              <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={triggerHaptic}
                                className="group/link inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-green-600 dark:text-primary-light dark:hover:text-green-400 transition-colors duration-300"
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
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                </div>
              ) : (
                /* Empty state - hidden when no items, no placeholder shown /
                <div className="hidden"></div>
              )}
            </div>
            
          </div>
        )}
      </div>
    </section>
  );
};

export default MasterplanSection;*/


/*import React, { useState } from 'react';
import { useContent } from '../content/useContext';

interface MasterplanItem {
  icon: string;
  title: string;
  description: string;
  link?: string;
}

interface MasterplanTab {
  id?: string;
  title: string;
  description: string;
  ctaLink: string;
  ctaText: string;
  items?: MasterplanItem[];
}

const MasterplanSection: React.FC = () => {
  const { content, isLoading } = useContent();
  const [activeTab, setActiveTab] = useState<number>(0);
  
  const masterplanTabs: MasterplanTab[] = content.masterplanTabs || [];
  const currentTab: MasterplanTab | undefined = masterplanTabs[activeTab] || masterplanTabs[0];
  
  const triggerHaptic = (): void => {
    try {
      if (window.navigator && typeof window.navigator.vibrate === "function") {
        window.navigator.vibrate(50);
      }
    } catch (e) {}
  };
  
  if (isLoading) {
    return (
      <section className="py-12 md:py-20 bg-gray-50 dark:bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="flex flex-wrap gap-2 mb-8 md:mb-12">
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-28"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
            </div>
            <div className="grid lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  if (masterplanTabs.length === 0 || !currentTab) return null;
  
  return (
    <section className="py-12 md:py-20 bg-gray-50 dark:bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-2 mb-8 md:mb-12 border-b border-gray-200 dark:border-gray-700 pb-4">
          {masterplanTabs.map((tab: MasterplanTab, idx: number) => (
            <button
              key={tab.id || idx}
              onClick={() => { triggerHaptic(); setActiveTab(idx); }}
              className={`px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold transition-all duration-300 text-sm md:text-base min-h-[44px] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-black ${
                activeTab === idx
                  ? 'bg-primary text-white shadow-lg hover:bg-green-600 hover:scale-105'
                  : 'text-gray-600 dark:text-gray-400 hover:text-primary hover:bg-primary/10'
              }`}
            >
              {tab.title}
            </button>
          ))}
        </div>
        {currentTab && (
          <div className="grid lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
            <div className="space-y-4 md:space-y-6">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                {currentTab.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm sm:text-base md:text-lg">
                {currentTab.description}
              </p>
              <a
                href={currentTab.ctaLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={triggerHaptic}
                className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 md:px-8 md:py-4 rounded-lg font-bold text-sm md:text-base transition-all duration-300 hover:bg-green-600 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-black group"
              >
                <span>{currentTab.ctaText}</span>
                <svg className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
            {currentTab.items && currentTab.items.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 lg:gap-10">
                {currentTab.items.map((item: MasterplanItem, index: number) => (
                  <div key={index} className="flex gap-3 md:gap-4 items-start">
                    <div className="flex-shrink-0">
                      <img
                        src={item.icon}
                        alt={item.title}
                        className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 object-contain"
                      />
                    </div>
                    <div className="flex-1 space-y-1 md:space-y-2">
                      <h3 className="text-base md:text-lg lg:text-xl font-bold text-gray-900 dark:text-white">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                        {item.description}
                      </p>
                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={triggerHaptic}
                          className="inline-flex items-center gap-1 text-primary hover:text-green-500 text-xs sm:text-sm md:text-base font-semibold transition-all duration-300 mt-1 md:mt-2 group focus:outline-none focus:ring-2 focus:ring-primary rounded min-h-[44px]"
                        >
                          Learn More
                          <svg className="w-3 h-3 md:w-4 md:h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default MasterplanSection;*/
