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
          {/* Left Column - Main About */}
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
          
          {/* Right Column - About Items Grid */}
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

export default AboutSection;
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
