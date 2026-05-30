// frontend/src/sections/AboutSection.tsx
import React, { useState } from 'react';
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
  
  const triggerHaptic = (): void => {
    try {
      if (window.navigator && typeof window.navigator.vibrate === "function") {
        window.navigator.vibrate(50);
      }
    } catch (e) {}
  };
  
  if (isLoading) {
    return (
      <section className="relative py-12 md:py-20 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: "url('/assets/bg_image.jpg')" }} />
        <div className="absolute inset-0 z-1 bg-white/80 dark:bg-black/80" />
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          </div>
        </div>
      </section>
    );
  }
  
  const about = content.about || {};
  const aboutItems: AboutItem[] = content.aboutItems || [];
  const fallbackIcon = 'https://icta.go.ke//assets/images/icons/digi.png';
  
  const handleImageError = (index: number): void => {
    setImageErrors((prev) => ({ ...prev, [index]: true }));
  };
  
  return (
    <section className="relative py-12 md:py-20 overflow-hidden">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: "url('/assets/bg_image.jpg')",
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat'
        }}
      />
      <div className="absolute inset-0 z-1 bg-white/85 dark:bg-black/85 transition-colors duration-300" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
          <div className="space-y-4 md:space-y-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
              {about.title || 'About ICT Authority'}
            </h1>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base md:text-lg">
              {about.description1 || "The Authority's broad mandate entails enforcing ICT standards in Government, establishing, developing and maintaining secure ICT infrastructure systems, supervision of electronic communications, as well as promoting digital literacy, capacity, innovation and enterprise."}
            </p>
            <a
              href="https://icta.go.ke/page?q=6&type=about_ict_authority"
              target="_blank"
              rel="noopener noreferrer"
              onClick={triggerHaptic}
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 md:px-8 md:py-4 rounded-lg font-bold text-sm md:text-base transition-all duration-300 hover:bg-green-600 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-black group"
            >
              <span>Learn More</span>
              <svg className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            {aboutItems.map((item: AboutItem, index: number) => (
              <div key={index} className="group bg-white/10 dark:bg-black/20 backdrop-blur-sm rounded-xl p-4 md:p-6 transition-all duration-300 hover:bg-white/20 dark:hover:bg-black/30 hover:shadow-xl hover:scale-[1.02] border border-white/20 dark:border-white/10">
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
                    <h3 className="text-base md:text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-2 md:mb-3 transition-colors duration-300 group-hover:text-primary">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 mb-3 md:mb-4 leading-relaxed">
                      {item.description}
                    </p>
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={triggerHaptic}
                      className="inline-flex items-center gap-1 text-primary hover:text-green-500 text-xs sm:text-sm md:text-base font-semibold transition-all duration-300 group-hover:gap-2 focus:outline-none focus:ring-2 focus:ring-primary rounded"
                    >
                      Learn More
                      <svg className="w-3 h-3 md:w-4 md:h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
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

export default AboutSection;

/*// frontend/src/sections/AboutSection.tsx
import React, { useState } from 'react';
import { useContent } from '../content/useContext';

var AboutSection: React.FC = function() {
  var { content, isLoading } = useContent();
  var _useState = useState<Record<number, boolean>>({});
  var imageErrors = _useState[0];
  var setImageErrors = _useState[1];
  
  if (isLoading) {
    return React.createElement("section", { className: "relative py-12 md:py-20 overflow-hidden" },
      React.createElement("div", { className: "absolute inset-0 z-0 bg-cover bg-center", style: { backgroundImage: "url('/assets/bg_image.jpg')" } }),
      React.createElement("div", { className: "absolute inset-0 z-1 bg-white/80 dark:bg-black/80" }),
      React.createElement("div", { className: "relative z-10 max-w-7xl mx-auto px-4" },
        React.createElement("div", { className: "animate-pulse" },
          React.createElement("div", { className: "h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4" }),
          React.createElement("div", { className: "h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" }),
          React.createElement("div", { className: "h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" }))));
  }
  
  var about = content.about || {};
  var aboutItems = content.aboutItems || [];
  
  var handleImageError = function(index: number) {
    setImageErrors(function(prev) {
      var newState = Object.assign({}, prev);
      newState[index] = true;
      return newState;
    });
  };
  
  var fallbackIcon = 'https://icta.go.ke//assets/images/icons/digi.png';
  
  var triggerHaptic = function() {
    try {
      if (window.navigator && typeof window.navigator.vibrate === "function") {
        window.navigator.vibrate(50);
      }
    } catch (e) {}
  };
  
  return React.createElement("section", { className: "relative py-12 md:py-20 overflow-hidden" },
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
      className: "absolute inset-0 z-1 bg-white/85 dark:bg-black/85 transition-colors duration-300"
    }),
    React.createElement("div", { className: "relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" },
      React.createElement("div", { className: "grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16" },
        React.createElement("div", { className: "space-y-4 md:space-y-6" },
          React.createElement("h1", { 
            className: "text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight"
          }, about.title || 'About ICT Authority'),
          React.createElement("p", { 
            className: "text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base md:text-lg"
          }, about.description1 || "The Authority's broad mandate entails enforcing ICT standards in Government, establishing, developing and maintaining secure ICT infrastructure systems, supervision of electronic communications, as well as promoting digital literacy, capacity, innovation and enterprise."),
          React.createElement("a", {
            href: "https://icta.go.ke/page?q=6&type=about_ict_authority",
            target: "_blank",
            rel: "noopener noreferrer",
            onClick: triggerHaptic,
            className: "inline-flex items-center gap-2 bg-primary text-white px-6 py-3 md:px-8 md:py-4 rounded-lg font-bold text-sm md:text-base transition-all duration-300 hover:bg-green-600 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-black group"
          }, React.createElement("span", null, "Learn More"),
            React.createElement("svg", {
              className: "w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 group-hover:translate-x-1",
              fill: "none",
              stroke: "currentColor",
              viewBox: "0 0 24 24",
              xmlns: "http://www.w3.org/2000/svg"
            }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M9 5l7 7-7 7" })))
        ),
        React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8" },
          aboutItems.map(function(item: any, index: number) {
            return React.createElement("div", { 
              key: index, 
              className: "group bg-white/10 dark:bg-black/20 backdrop-blur-sm rounded-xl p-4 md:p-6 transition-all duration-300 hover:bg-white/20 dark:hover:bg-black/30 hover:shadow-xl hover:scale-[1.02] border border-white/20 dark:border-white/10"
            },
              React.createElement("div", { className: "flex gap-4 md:gap-5 items-start" },
                React.createElement("div", { className: "flex-shrink-0" },
                  React.createElement("img", {
                    src: imageErrors[index] ? fallbackIcon : (item.icon || fallbackIcon),
                    alt: item.title,
                    className: "w-12 h-12 md:w-16 md:h-16 object-contain transition-transform duration-300 group-hover:scale-110",
                    onError: function() { handleImageError(index); }
                  })
                ),
                React.createElement("div", { className: "flex-1" },
                  React.createElement("h3", { 
                    className: "text-base md:text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-2 md:mb-3 transition-colors duration-300 group-hover:text-primary"
                  }, item.title),
                  React.createElement("p", { 
                    className: "text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 mb-3 md:mb-4 leading-relaxed"
                  }, item.description),
                  React.createElement("a", {
                    href: item.link,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    onClick: triggerHaptic,
                    className: "inline-flex items-center gap-1 text-primary hover:text-green-500 text-xs sm:text-sm md:text-base font-semibold transition-all duration-300 group-hover:gap-2 focus:outline-none focus:ring-2 focus:ring-primary rounded"
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
              )
            );
          })
        )
      )
    )
  );
};

export default AboutSection;*/

/*// frontend/src/sections/AboutSection.tsx
import React, { useState } from 'react';
import { useContent } from '../content/useContext';

var AboutSection: React.FC = function() {
  var { content, isLoading } = useContent();
  var _useState = useState<Record<number, boolean>>({});
  var imageErrors = _useState[0];
  var setImageErrors = _useState[1];
  
  if (isLoading) {
    return React.createElement("section", { className: "py-12 md:py-20 bg-gray-50 dark:bg-surface" },
      React.createElement("div", { className: "max-w-7xl mx-auto px-4" },
        React.createElement("div", { className: "animate-pulse" },
          React.createElement("div", { className: "h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4" }),
          React.createElement("div", { className: "h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" }),
          React.createElement("div", { className: "h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" }))));
  }
  
  var about = content.about || {};
  var aboutItems = content.aboutItems || [];
  
  var handleImageError = function(index: number) {
    setImageErrors(function(prev) {
      var newState = Object.assign({}, prev);
      newState[index] = true;
      return newState;
    });
  };
  
  var fallbackIcon = 'https://icta.go.ke//assets/images/icons/digi.png';
  
  return React.createElement("section", { className: "py-12 md:py-20 bg-gray-50 dark:bg-surface" },
    React.createElement("div", { className: "max-w-7xl mx-auto px-4" },
      React.createElement("div", { className: "grid lg:grid-cols-2 gap-8 md:gap-12" },
        React.createElement("div", { className: "space-y-4" },
          React.createElement("h1", { className: "text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white" },
            about.title || 'About ICT Authority'),
          React.createElement("p", { className: "text-gray-600 dark:text-gray-300 leading-relaxed text-sm md:text-base" },
            about.description1 || "The Authority's broad mandate entails enforcing ICT standards in Government, establishing, developing and maintaining secure ICT infrastructure systems, supervision of electronic communications, as well as promoting digital literacy, capacity, innovation and enterprise."),
          React.createElement("a", {
            href: "https://icta.go.ke/page?q=6&type=about_ict_authority",
            target: "_blank",
            rel: "noopener noreferrer",
            className: "inline-flex items-center gap-2 text-primary hover:text-green-500 font-bold transition-colors group"
          }, React.createElement("span", null, "learn more"),
            React.createElement("img", {
              src: "https://icta.go.ke//assets/images/icons/arrowsmall.png",
              alt: "arrow",
              className: "w-4 h-4 group-hover:translate-x-1 transition-transform"
            }))),
        React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8" },
          aboutItems.map(function(item: any, index: number) {
            return React.createElement("div", { key: index, className: "flex gap-4 items-start" },
              React.createElement("div", { className: "flex-shrink-0 mt-1" },
                React.createElement("img", {
                  src: imageErrors[index] ? fallbackIcon : (item.icon || fallbackIcon),
                  alt: item.title,
                  className: "w-12 h-12 md:w-16 md:h-16 object-contain",
                  onError: function() { handleImageError(index); }
                })),
              React.createElement("div", { className: "flex-1" },
                React.createElement("h3", { className: "text-base md:text-lg font-bold text-gray-900 dark:text-white mb-1 md:mb-2" }, item.title),
                React.createElement("p", { className: "text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-3" }, item.description),
                React.createElement("a", {
                  href: item.link,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "text-primary hover:text-green-500 text-xs md:text-sm font-medium transition-colors inline-flex items-center gap-1"
                }, "learn more",
                  React.createElement("span", { className: "material-symbols-outlined text-sm" }, "arrow_forward"))));
          })))));
};

export default AboutSection;*/


/*last working
// frontend/src/sections/AboutSection.tsx
import React, { useState } from 'react';
import { useContent } from '../content/useContext';

const AboutSection: React.FC = () => {
  const { content, isLoading } = useContent();
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  
  if (isLoading) {
    return (
      <section className="py-20 bg-gray-50 dark:bg-surface">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          </div>
        </div>
      </section>
    );
  }
  
  const about = content.about || {};
  const aboutItems = content.aboutItems || [];
  
  const handleImageError = (index: number) => {
    setImageErrors(prev => ({ ...prev, [index]: true }));
  };
  
  // Fallback icon for images that fail to load
  const fallbackIcon = 'https://icta.go.ke//assets/images/icons/digi.png';
  
  return (
    <section className="py-20 bg-gray-50 dark:bg-surface">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Main About /}
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              {about.title || 'About ICT Authority'}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {about.description1 || "The Authority's broad mandate entails enforcing ICT standards in Government, establishing, developing and maintaining secure ICT infrastructure systems, supervision of electronic communications, as well as promoting digital literacy, capacity, innovation and enterprise."}
            </p>
            <a 
              href="https://icta.go.ke/page?q=6&type=about_ict_authority"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:text-green-500 font-bold transition-colors group"
            >
              <span>learn more</span>
              <img 
                src="https://icta.go.ke//assets/images/icons/arrowsmall.png" 
                alt="arrow" 
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              />
            </a>
          </div>
          
          {/* Right Column - About Items Grid *}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {aboutItems.map((item: any, index: number) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0">
                  <img 
                    src={imageErrors[index] ? fallbackIcon : (item.icon || fallbackIcon)} 
                    alt={item.title} 
                    className="w-16 h-16 object-contain"
                    onError={() => handleImageError(index)}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{item.description}</p>
                  <a 
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-green-500 text-sm font-medium transition-colors inline-flex items-center gap-1"
                  >
                    learn more
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </a>
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


/*
// frontend/src/sections/AboutSection.tsx
import React from 'react';
import { useContent } from '../content/useContext';

const AboutSection: React.FC = () => {
  const { content, isLoading } = useContent();
  
  if (isLoading) {
    return (
      <section className="py-20 bg-gray-50 dark:bg-surface">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          </div>
        </div>
      </section>
    );
  }
  
  const about = content.about || {};
  const aboutItems = content.aboutItems || [];
  
  return (
    <section className="py-20 bg-gray-50 dark:bg-surface">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Main About /}
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              {about.title || 'About ICT Authority'}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {about.description1 || "The Authority's broad mandate entails enforcing ICT standards in Government, establishing, developing and maintaining secure ICT infrastructure systems, supervision of electronic communications, as well as promoting digital literacy, capacity, innovation and enterprise."}
            </p>
            <a 
              href="https://icta.go.ke/page?q=6&type=about_ict_authority"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:text-green-500 font-bold transition-colors group"
            >
              <span>learn more</span>
              <img 
                src="https://icta.go.ke//assets/images/icons/arrowsmall.png" 
                alt="arrow" 
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              />
            </a>
          </div>
          
          {/* Right Column - About Items Grid /}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {aboutItems.map((item, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0">
                  <img 
                    src={item.icon} 
                    alt={item.title} 
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{item.description}</p>
                  <a 
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-green-500 text-sm font-medium transition-colors inline-flex items-center gap-1"
                  >
                    learn more
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </a>
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


/*// frontend/src/sections/AboutSection.tsx
import React from 'react';

const AboutSection: React.FC = () => {
  return (
    <section className="py-20 bg-gray-50 dark:bg-surface">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Main About /}
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">About ICT Authority</h1>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              The Authority's broad mandate entails enforcing ICT standards in Government, establishing, 
              developing and maintaining secure ICT infrastructure systems, supervision of electronic 
              communications, as well as promoting digital literacy, capacity, innovation and enterprise.
            </p>
            <a 
              href="https://icta.go.ke/page?q=6&type=about_ict_authority"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:text-green-500 font-bold transition-colors group"
            >
              <span>learn more</span>
              <img 
                src="https://icta.go.ke//assets/images/icons/arrowsmall.png" 
                alt="arrow" 
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              />
            </a>
          </div>
          
          {/* Right Column - About Items Grid /}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Enabling Connectivity /}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <img 
                  src="https://icta.go.ke//assets/images/icons/digi.png" 
                  alt="Enabling Connectivity" 
                  className="w-16 h-16 object-contain"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Enabling Connectivity</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Through NOFBI and County Connectivity Project we are enabling access to information.
                </p>
                <a 
                  href="https://icta.go.ke/page?q=6&type=about_ict_authority"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-green-500 text-sm font-medium transition-colors inline-flex items-center gap-1"
                >
                  learn more
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </a>
              </div>
            </div>
            
            {/* Partnering for Growth /}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <img 
                  src="https://icta.go.ke//assets/images/icons/stds.png" 
                  alt="Partnering for Growth" 
                  className="w-16 h-16 object-contain"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Partnering for Growth</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Collaborating with local and international stakeholders for ICT adoption and use.
                </p>
                <a 
                  href="https://icta.go.ke/page?q=6&type=about_ict_authority"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-green-500 text-sm font-medium transition-colors inline-flex items-center gap-1"
                >
                  learn more
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </a>
              </div>
            </div>
            
            {/* E-Government /}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <img 
                  src="https://icta.go.ke//assets/images/icons/jobs.png" 
                  alt="E-Government" 
                  className="w-16 h-16 object-contain"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">E-Government</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Easy, convenient and efficient access to government services by the citizenry.
                </p>
                <a 
                  href="https://icta.go.ke/page?q=6&type=about_ict_authority"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-green-500 text-sm font-medium transition-colors inline-flex items-center gap-1"
                >
                  learn more
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </a>
              </div>
            </div>
            
            {/* Enforcing Standards /}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <img 
                  src="https://icta.go.ke//assets/images/icons/conns.png" 
                  alt="Enforcing Standards" 
                  className="w-16 h-16 object-contain"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Enforcing Standards</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  To ensure alignment and consistency of government ICT plans and processes at all.
                </p>
                <a 
                  href="https://icta.go.ke/page?q=6&type=about_ict_authority"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-green-500 text-sm font-medium transition-colors inline-flex items-center gap-1"
                >
                  learn more
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;*/
