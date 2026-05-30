// frontend/src/sections/MasterPlanSection.tsx
import React, { useState } from 'react';
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

export default MasterplanSection;
/*// frontend/src/sections/MasterPlanSection.tsx
import React, { useState } from 'react';
import { useContent } from '../content/useContext';

var MasterplanSection: React.FC = function() {
  var { content, isLoading } = useContent();
  var _useState = useState(0);
  var activeTab = _useState[0];
  var setActiveTab = _useState[1];
  
  var masterplanTabs = content.masterplanTabs || [];
  var currentTab = masterplanTabs[activeTab] || masterplanTabs[0];
  
  var triggerHaptic = function() {
    try {
      if (window.navigator && typeof window.navigator.vibrate === "function") {
        window.navigator.vibrate(50);
      }
    } catch (e) {}
  };
  
  if (isLoading) {
    return React.createElement("section", { className: "py-12 md:py-20 bg-gray-50 dark:bg-surface" },
      React.createElement("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" },
        React.createElement("div", { className: "animate-pulse" },
          React.createElement("div", { className: "flex flex-wrap gap-2 mb-8 md:mb-12" },
            React.createElement("div", { className: "h-10 bg-gray-200 dark:bg-gray-700 rounded w-28" }),
            React.createElement("div", { className: "h-10 bg-gray-200 dark:bg-gray-700 rounded w-24" }),
            React.createElement("div", { className: "h-10 bg-gray-200 dark:bg-gray-700 rounded w-32" })),
          React.createElement("div", { className: "grid lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12" },
            React.createElement("div", { className: "h-64 bg-gray-200 dark:bg-gray-700 rounded" }),
            React.createElement("div", { className: "h-64 bg-gray-200 dark:bg-gray-700 rounded" })))));
  }
  
  if (masterplanTabs.length === 0 || !currentTab) return null;
  
  return React.createElement("section", { className: "py-12 md:py-20 bg-gray-50 dark:bg-surface" },
    React.createElement("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" },
      React.createElement("div", { className: "flex flex-wrap gap-2 mb-8 md:mb-12 border-b border-gray-200 dark:border-gray-700 pb-4" },
        masterplanTabs.map(function(tab: any, idx: number) {
          return React.createElement("button", {
            key: tab.id || idx,
            onClick: function() { triggerHaptic(); setActiveTab(idx); },
            className: "px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold transition-all duration-300 text-sm md:text-base min-h-[44px] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-black " + (activeTab === idx
              ? 'bg-primary text-white shadow-lg hover:bg-green-600 hover:scale-105'
              : 'text-gray-600 dark:text-gray-400 hover:text-primary hover:bg-primary/10')
          }, tab.title);
        })),
      currentTab && React.createElement("div", { className: "grid lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12" },
        React.createElement("div", { className: "space-y-4 md:space-y-6" },
          React.createElement("h1", { 
            className: "text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight" 
          }, currentTab.title),
          React.createElement("p", { 
            className: "text-gray-600 dark:text-gray-300 leading-relaxed text-sm sm:text-base md:text-lg" 
          }, currentTab.description),
          React.createElement("a", {
            href: currentTab.ctaLink,
            target: "_blank",
            rel: "noopener noreferrer",
            onClick: triggerHaptic,
            className: "inline-flex items-center gap-2 bg-primary text-white px-6 py-3 md:px-8 md:py-4 rounded-lg font-bold text-sm md:text-base transition-all duration-300 hover:bg-green-600 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-black group"
          }, React.createElement("span", null, currentTab.ctaText),
            React.createElement("svg", {
              className: "w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 group-hover:translate-x-1",
              fill: "none",
              stroke: "currentColor",
              viewBox: "0 0 24 24",
              xmlns: "http://www.w3.org/2000/svg"
            }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M9 5l7 7-7 7" })))
        ),
        currentTab.items && currentTab.items.length > 0 && React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 lg:gap-10" },
          currentTab.items.map(function(item: any, index: number) {
            return React.createElement("div", { 
              key: index, 
              className: "flex gap-3 md:gap-4 items-start"
            },
              React.createElement("div", { className: "flex-shrink-0" },
                React.createElement("img", {
                  src: item.icon,
                  alt: item.title,
                  className: "w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 object-contain"
                })),
              React.createElement("div", { className: "flex-1 space-y-1 md:space-y-2" },
                React.createElement("h3", { 
                  className: "text-base md:text-lg lg:text-xl font-bold text-gray-900 dark:text-white" 
                }, item.title),
                React.createElement("p", { 
                  className: "text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed" 
                }, item.description),
                item.link && React.createElement("a", {
                  href: item.link,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  onClick: triggerHaptic,
                  className: "inline-flex items-center gap-1 text-primary hover:text-green-500 text-xs sm:text-sm md:text-base font-semibold transition-all duration-300 mt-1 md:mt-2 group focus:outline-none focus:ring-2 focus:ring-primary rounded min-h-[44px]"
                }, "Learn More",
                  React.createElement("svg", {
                    className: "w-3 h-3 md:w-4 md:h-4 transition-transform duration-300 group-hover:translate-x-1",
                    fill: "none",
                    stroke: "currentColor",
                    viewBox: "0 0 24 24",
                    xmlns: "http://www.w3.org/2000/svg"
                  }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M9 5l7 7-7 7" }))
                )
              )
            );
          })
        )
      )
    )
  );
};

export default MasterplanSection;*/

/*// frontend/src/sections/MasterPlanSection.tsx
import React, { useState } from 'react';
import { useContent } from '../content/useContext';

var MasterplanSection: React.FC = function() {
  var { content, isLoading } = useContent();
  var _useState = useState(0);
  var activeTab = _useState[0];
  var setActiveTab = _useState[1];
  
  var masterplanTabs = content.masterplanTabs || [];
  var currentTab = masterplanTabs[activeTab] || masterplanTabs[0];
  
  if (isLoading) {
    return React.createElement("section", { className: "py-12 md:py-20 bg-gray-50 dark:bg-surface" },
      React.createElement("div", { className: "max-w-7xl mx-auto px-4" },
        React.createElement("div", { className: "animate-pulse" },
          React.createElement("div", { className: "flex flex-wrap gap-2 mb-8 md:mb-12" },
            React.createElement("div", { className: "h-10 bg-gray-200 dark:bg-gray-700 rounded w-28" }),
            React.createElement("div", { className: "h-10 bg-gray-200 dark:bg-gray-700 rounded w-24" }),
            React.createElement("div", { className: "h-10 bg-gray-200 dark:bg-gray-700 rounded w-32" })),
          React.createElement("div", { className: "grid lg:grid-cols-2 gap-8" },
            React.createElement("div", { className: "h-64 bg-gray-200 dark:bg-gray-700 rounded" }),
            React.createElement("div", { className: "h-64 bg-gray-200 dark:bg-gray-700 rounded" })))));
  }
  
  if (masterplanTabs.length === 0 || !currentTab) return null;
  
  return React.createElement("section", { className: "py-12 md:py-20 bg-gray-50 dark:bg-surface" },
    React.createElement("div", { className: "max-w-7xl mx-auto px-4" },
      React.createElement("div", { className: "flex flex-wrap gap-2 mb-8 md:mb-12 border-b border-gray-200 dark:border-gray-700 pb-4" },
        masterplanTabs.map(function(tab: any, idx: number) {
          return React.createElement("button", {
            key: tab.id || idx,
            onClick: function() { setActiveTab(idx); },
            className: "px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold transition-all text-sm md:text-base " + (activeTab === idx
              ? 'bg-primary text-white shadow-lg'
              : 'text-gray-600 dark:text-gray-400 hover:text-primary hover:bg-primary/10')
          }, tab.title);
        })),
      currentTab && React.createElement("div", { className: "grid lg:grid-cols-2 gap-8 md:gap-12" },
        React.createElement("div", { className: "space-y-6" },
          React.createElement("h1", { className: "text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4" }, currentTab.title),
          React.createElement("p", { className: "text-gray-600 dark:text-gray-300 leading-relaxed text-sm md:text-base mb-6" }, currentTab.description),
          React.createElement("a", {
            href: currentTab.ctaLink,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "inline-flex items-center gap-2 text-primary hover:text-green-500 font-bold transition-colors group mt-2"
          }, React.createElement("span", null, currentTab.ctaText),
            React.createElement("img", {
              src: "https://icta.go.ke//assets/images/icons/arrowsmall.png",
              alt: "arrow",
              className: "w-4 h-4 group-hover:translate-x-1 transition-transform"
            }))),
        currentTab.items && currentTab.items.length > 0 && React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8" },
          currentTab.items.map(function(item: any, index: number) {
            return React.createElement("div", { key: index, className: "flex gap-4 items-start group" },
              React.createElement("div", { className: "flex-shrink-0 mt-1" },
                React.createElement("img", {
                  src: item.icon,
                  alt: item.title,
                  className: "w-12 h-12 md:w-16 md:h-16 object-contain"
                })),
              React.createElement("div", { className: "flex-1" },
                React.createElement("h3", { className: "text-base md:text-lg font-bold text-gray-900 dark:text-white mb-1 md:mb-2 group-hover:text-primary transition-colors" }, item.title),
                React.createElement("p", { className: "text-xs md:text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3" }, item.description)));
          })))));
};

export default MasterplanSection;*/


/*// frontend/src/sections/MasterPlanSection.tsx
import React, { useState } from 'react';
import { useContent } from '../content/useContext';

var MasterplanSection: React.FC = function() {
  var { content, isLoading } = useContent();
  var _useState = useState(0);
  var activeTab = _useState[0];
  var setActiveTab = _useState[1];
  
  var masterplanTabs = content.masterplanTabs || [];
  var currentTab = masterplanTabs[activeTab] || masterplanTabs[0];
  
  if (isLoading) {
    return React.createElement("section", { className: "py-12 md:py-20 bg-gray-50 dark:bg-surface" },
      React.createElement("div", { className: "max-w-7xl mx-auto px-4" },
        React.createElement("div", { className: "animate-pulse" },
          React.createElement("div", { className: "flex flex-wrap gap-2 mb-8 md:mb-12" },
            React.createElement("div", { className: "h-10 bg-gray-200 dark:bg-gray-700 rounded w-28" }),
            React.createElement("div", { className: "h-10 bg-gray-200 dark:bg-gray-700 rounded w-24" }),
            React.createElement("div", { className: "h-10 bg-gray-200 dark:bg-gray-700 rounded w-32" })),
          React.createElement("div", { className: "grid lg:grid-cols-2 gap-8" },
            React.createElement("div", { className: "h-64 bg-gray-200 dark:bg-gray-700 rounded" }),
            React.createElement("div", { className: "h-64 bg-gray-200 dark:bg-gray-700 rounded" })))));
  }
  
  if (masterplanTabs.length === 0 || !currentTab) return null;
  
  return React.createElement("section", { className: "py-12 md:py-20 bg-gray-50 dark:bg-surface" },
    React.createElement("div", { className: "max-w-7xl mx-auto px-4" },
      React.createElement("div", { className: "flex flex-wrap gap-2 mb-8 md:mb-12 border-b border-gray-200 dark:border-gray-700 pb-4" },
        masterplanTabs.map(function(tab: any, idx: number) {
          return React.createElement("button", {
            key: tab.id || idx,
            onClick: function() { setActiveTab(idx); },
            className: "px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold transition-all text-sm md:text-base " + (activeTab === idx
              ? 'bg-primary text-white shadow-lg'
              : 'text-gray-600 dark:text-gray-400 hover:text-primary hover:bg-primary/10')
          }, tab.title);
        })),
      currentTab && React.createElement("div", { className: "grid lg:grid-cols-2 gap-8 md:gap-12" },
        React.createElement("div", { className: "space-y-4" },
          React.createElement("h1", { className: "text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white" }, currentTab.title),
          React.createElement("p", { className: "text-gray-600 dark:text-gray-300 leading-relaxed text-sm md:text-base" }, currentTab.description),
          React.createElement("a", {
            href: currentTab.ctaLink,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "inline-flex items-center gap-2 text-primary hover:text-green-500 font-bold transition-colors group"
          }, React.createElement("span", null, currentTab.ctaText),
            React.createElement("img", {
              src: "https://icta.go.ke//assets/images/icons/arrowsmall.png",
              alt: "arrow",
              className: "w-4 h-4 group-hover:translate-x-1 transition-transform"
            }))),/
        currentTab.items && currentTab.items.length > 0 && React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8" },
          currentTab.items.map(function(item: any, index: number) {
            return React.createElement("div", { key: index, className: "flex gap-4 items-start group" },
              React.createElement("div", { className: "flex-shrink-0 mt-1" },
                React.createElement("img", {
                  src: item.icon,
                  alt: item.title,
                  className: "w-12 h-12 md:w-16 md:h-16 object-contain"
                })),
              React.createElement("div", { className: "flex-1" },
                React.createElement("h3", { className: "text-base md:text-lg font-bold text-gray-900 dark:text-white mb-1 md:mb-2 group-hover:text-primary transition-colors" }, item.title),
                React.createElement("p", { className: "text-xs md:text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3" }, item.description)));
          })))));
};

export default MasterplanSection;*/


/*last working
// frontend/src/sections/MasterPlanSection.tsx
import React, { useState } from 'react';
import { useContent } from '../content/useContext';

const MasterplanSection: React.FC = () => {
  const { content, isLoading } = useContent();
  const [activeTab, setActiveTab] = useState(0);
  
  const masterplanTabs = content.masterplanTabs || [];
  const currentTab = masterplanTabs[activeTab] || masterplanTabs[0];
  
  if (isLoading) {
    return (
      <section className="py-20 bg-gray-50 dark:bg-surface">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="flex gap-2 mb-12">
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-28"></div>
            </div>
            <div className="grid lg:grid-cols-2 gap-8">
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
    <section className="py-20 bg-gray-50 dark:bg-surface">
      <div className="max-w-7xl mx-auto px-4">
        {/* Tab Navigation /}
        <div className="flex flex-wrap gap-2 mb-12 border-b border-gray-200 dark:border-gray-700 pb-4">
          {masterplanTabs.map((tab: any, idx: number) => (
            <button
              key={tab.id || idx}
              onClick={() => setActiveTab(idx)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === idx
                  ? 'bg-primary text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:text-primary hover:bg-primary/10'
              }`}
            >
              {tab.title}
            </button>
          ))}
        </div>
        
        {/* Tab Content /}
        {currentTab && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Intro /}
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                {currentTab.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {currentTab.description}
              </p>
              <a 
                href={currentTab.ctaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:text-green-500 font-bold transition-colors group"
              >
                <span>{currentTab.ctaText}</span>
                <img 
                  src="https://icta.go.ke//assets/images/icons/arrowsmall.png" 
                  alt="arrow" 
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                />
              </a>
            </div>
            
            {/* Right Column - Items Grid /}
            {currentTab.items && currentTab.items.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {currentTab.items.map((item: any, index: number) => (
                  <div key={index} className="flex gap-4 group">
                    <div className="flex-shrink-0">
                      <img 
                        src={item.icon} 
                        alt={item.title} 
                        className="w-16 h-16 object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {item.description}
                      </p>
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


/*
// frontend/src/sections/MasterplanSection.tsx
import React, { useState } from 'react';
import { useContent } from '../content/useContext';

const MasterplanSection: React.FC = () => {
  const { content, isLoading } = useContent();
  const [activeTab, setActiveTab] = useState(0);
  
  const masterplanTabs = content.masterplanTabs || [];
  const currentTab = masterplanTabs[activeTab] || masterplanTabs[0];
  
  if (isLoading) {
    return (
      <section className="py-20 bg-gray-50 dark:bg-surface">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="flex gap-2 mb-12">
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-28"></div>
            </div>
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  if (masterplanTabs.length === 0) return null;
  
  return (
    <section className="py-20 bg-gray-50 dark:bg-surface">
      <div className="max-w-7xl mx-auto px-4">
        {/* Tab Navigation /}
        <div className="flex flex-wrap gap-2 mb-12 border-b border-gray-200 dark:border-gray-700 pb-4">
          {masterplanTabs.map((tab, idx) => (
            <button
              key={tab.id || idx}
              onClick={() => setActiveTab(idx)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === idx
                  ? 'bg-primary text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:text-primary hover:bg-primary/10'
              }`}
            >
              {tab.title}
            </button>
          ))}
        </div>
        
        {/* Tab Content /}
        {currentTab && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Intro /}
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                {currentTab.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {currentTab.description}
              </p>
              <a 
                href={currentTab.ctaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:text-green-500 font-bold transition-colors group"
              >
                <span>{currentTab.ctaText}</span>
                <img 
                  src="https://icta.go.ke//assets/images/icons/arrowsmall.png" 
                  alt="arrow" 
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                />
              </a>
            </div>
            
            {/* Right Column - Items Grid /}
            {currentTab.items && currentTab.items.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {currentTab.items.map((item, index) => (
                  <div key={index} className="flex gap-4 group">
                    <div className="flex-shrink-0">
                      <img 
                        src={item.icon} 
                        alt={item.alt || item.title} 
                        className="w-16 h-16 object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {item.description}
                      </p>
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


/*// frontend/src/sections/MasterplanSection.tsx
import React, { useState } from 'react';

interface TabContent {
  id: string;
  title: string;
  description: string;
  ctaLink: string;
  ctaText: string;
  items: Array<{
    icon: string;
    title: string;
    description: string;
    alt?: string;
  }>;
}

const tabs: TabContent[] = [
  {
    id: 'masterplan',
    title: 'National Digital Masterplan',
    description: 'The Kenya National Digital Master Plan 2022-2032 is a blueprint for leveraging and deepening the contribution of ICT to accelerate economic growth.',
    ctaLink: 'https://cms.icta.go.ke/sites/default/files/2022-09/Kenya_Digital_Master_Plan_2022-2023.pdf',
    ctaText: 'explore more',
    items: [
      {
        icon: 'https://cms.icta.go.ke//sites/default/files/2022-01/Digitalent-1.png',
        title: 'Digital Infrastructure',
        description: 'Through this pillar we are delivering equitable accessible critical national ICT infrastructure such as NOFBI',
        alt: 'Digital Infrastructure'
      },
      {
        icon: 'https://cms.icta.go.ke//sites/default/files/2022-01/Digitalent-1.png',
        title: 'Digital Government Service, Product and Data Management',
        description: 'Through this pillar we are providing e-Government information and services for improved productivity, efficiency, effectiveness and governance in all sectors. They include domain hosting, website services and Email services.',
        alt: 'Digital Government Service'
      },
      {
        icon: 'https://cms.icta.go.ke//sites/default/files/2022-01/Digitalent-1.png',
        title: 'Digital Skills',
        description: 'Through this pillar we are training and increased the number of a digitally skilled workforce and citizens grounded on ethical practices and social cultural values',
        alt: 'Digital Skills'
      },
      {
        icon: 'https://cms.icta.go.ke//sites/default/files/2022-01/Digitalent-1.png',
        title: 'Digital Innovation, Enterprise and Digital Business',
        description: 'Through this pillar we seek to; enhance the innovation value chain in order to turn innovative ideas into sustainable businesses and operating models through programmes such as the Whitebox.',
        alt: 'Digital Innovation'
      }
    ]
  },
  {
    id: 'citizens',
    title: 'For Citizens',
    description: 'The Information and Communication Technology (ICT) Authority is a State Corporation under the Ministry of Information Communication and Technology. The corporation was established in August 2013.',
    ctaLink: 'https://icta.go.ke/page?q=17&type=citizens',
    ctaText: 'explore more',
    items: [
      {
        icon: 'https://cms.icta.go.ke//sites/default/files/2021-12/digi_2.png',
        title: 'E-Services',
        description: 'Through the e-Citizen web portal the public has online access to a number of public services offered by various Government Ministries',
        alt: 'E-Services'
      },
      {
        icon: 'https://cms.icta.go.ke//sites/default/files/2021-12/digi_2.png',
        title: 'DigiSchool',
        description: 'The Digital Literacy Programme (DLP) is targeted at learners in all public primary schools and is aimed at integrating the use of digital',
        alt: 'DigiSchool'
      },
      {
        icon: 'https://cms.icta.go.ke//sites/default/files/2021-12/digi_2.png',
        title: 'Talent and Workforce Building',
        description: 'The ICT Authority in collaboration with other ICT stakeholders has developed programmes to manage the challenge of the gap between',
        alt: 'Talent and Workforce Building'
      },
      {
        icon: 'https://cms.icta.go.ke//sites/default/files/2021-12/digi_2.png',
        title: 'Information Security',
        description: 'As many of the public services become digitised and available online, the government has increased its efforts to protect information',
        alt: 'Information Security'
      }
    ]
  },
  {
    id: 'partners',
    title: 'Huawei Technologies (Kenya) Co. Ltd',
    description: 'In partnership with Huawei Technologies, the ICT Authority seeks to promote ICT literacy and capacity; ICT infrastructure development; access to devices and the internet; and promote ICT research,...',
    ctaLink: 'https://icta.go.ke/page?q=28&type=investors',
    ctaText: 'explore more',
    items: []
  }
];

const MasterplanSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('masterplan');
  const currentTab = tabs.find(tab => tab.id === activeTab) || tabs[0];

  return (
    <section className="py-20 bg-gray-50 dark:bg-surface">
      <div className="max-w-7xl mx-auto px-4">
        {/* Tab Navigation /}
        <div className="flex flex-wrap gap-2 mb-12 border-b border-gray-200 dark:border-gray-700 pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:text-primary hover:bg-primary/10'
              }`}
            >
              {tab.title}
            </button>
          ))}
        </div>
        
        {/* Tab Content /}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Intro /}
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              {currentTab.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {currentTab.description}
            </p>
            <a 
              href={currentTab.ctaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:text-green-500 font-bold transition-colors group"
            >
              <span>{currentTab.ctaText}</span>
              <img 
                src="https://icta.go.ke//assets/images/icons/arrowsmall.png" 
                alt="arrow" 
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              />
            </a>
          </div>
          
          {/* Right Column - Items Grid /}
          {currentTab.items.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {currentTab.items.map((item, index) => (
                <div key={index} className="flex gap-4 group">
                  <div className="flex-shrink-0">
                    <img 
                      src={item.icon} 
                      alt={item.alt || item.title} 
                      className="w-16 h-16 object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MasterplanSection;*/
