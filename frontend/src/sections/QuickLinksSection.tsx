// frontend/src/sections/QuickLinksSection.tsx
import React from 'react';
import { useContent } from '../content/useContext';

const QuickLinksSection: React.FC = () => {
  const { content, isLoading } = useContent();
  const quickLinks = content.quickLinks || [];
  
  if (isLoading) {
    return (
      <section className="py-16 bg-white dark:bg-surface">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center animate-pulse">
                <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  
  if (quickLinks.length === 0) return null;
  
  return (
    <section className="py-16 bg-white dark:bg-surface">
      <div className="max-w-7xl mx-auto px-4">
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {quickLinks.map((link, index) => (
            <li key={index} className="group">
              <div className="mb-4">
                <a 
                  href={link.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <img 
                    src={link.icon} 
                    alt={link.alt} 
                    className="w-24 h-24 mx-auto transition-transform group-hover:scale-110"
                  />
                </a>
              </div>
              <div className="desc_stats">
                <h3 className="text-lg font-bold">
                  <a 
                    href={link.href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-800 dark:text-white hover:text-primary transition-colors"
                  >
                    {link.title}
                  </a>
                </h3>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default QuickLinksSection;

/*// frontend/src/sections/QuickLinksSection.tsx
import React from 'react';

const QuickLinksSection: React.FC = () => {
  const quickLinks = [
    {
      title: 'e-Government Services',
      href: 'https://www.ecitizen.go.ke/',
      icon: 'https://cms.icta.go.ke//sites/default/files/2022-05/icon-3.png',
      alt: 'e-Government Services'
    },
    {
      title: 'Digital infrastructure',
      href: 'https://icta.go.ke/page?q=205&type=projects',
      icon: 'https://cms.icta.go.ke//sites/default/files/2022-05/icon-2.png',
      alt: 'Digital infrastructure'
    },
    {
      title: 'Smart Academy',
      href: 'https://www.smartacademy.go.ke/',
      icon: 'https://cms.icta.go.ke//sites/default/files/2022-05/icon-1.png',
      alt: 'Smart Academy'
    },
    {
      title: 'Digital Innovation',
      href: 'https://icta.go.ke/page?q=17&type=citizens',
      icon: 'https://cms.icta.go.ke//sites/default/files/2022-06/Digital%20innovation_0.png',
      alt: 'Digital Innovation'
    }
  ];

  return (
    <section className="py-16 bg-white dark:bg-surface">
      <div className="max-w-7xl mx-auto px-4">
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {quickLinks.map((link, index) => (
            <li key={index} className="group">
              <div className="mb-4">
                <a 
                  href={link.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <img 
                    src={link.icon} 
                    alt={link.alt} 
                    className="w-24 h-24 mx-auto transition-transform group-hover:scale-110"
                  />
                </a>
              </div>
              <div className="desc_stats">
                <h3 className="text-lg font-bold">
                  <a 
                    href={link.href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-800 dark:text-white hover:text-primary transition-colors"
                  >
                    {link.title}
                  </a>
                </h3>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default QuickLinksSection;*/
