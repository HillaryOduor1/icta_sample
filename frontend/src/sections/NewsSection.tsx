// frontend/src/sections/NewsSection.tsx
import React, { useState } from 'react';
import { useContent } from '../content/useContext';

var triggerHaptic = function() {
  try {
    if (window.navigator && typeof window.navigator.vibrate === "function") {
      window.navigator.vibrate(50);
    }
  } catch (e) {}
};

var NewsSection: React.FC = function() {
  var { content, isLoading } = useContent();
  var _useState = useState('news');
  var activeTab = _useState[0];
  var setActiveTab = _useState[1];
  
  var news = content.news || {};
  var newsItems = news.items || [];
  
  if (isLoading) {
    return React.createElement("section", { className: "py-12 md:py-20 bg-gray-50 dark:bg-background-dark" },
      React.createElement("div", { className: "max-w-7xl mx-auto px-4" },
        React.createElement("div", { className: "text-center mb-8 md:mb-12" },
          React.createElement("div", { className: "h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 md:w-64 mx-auto mb-4" }),
          React.createElement("div", { className: "h-4 bg-gray-200 dark:bg-gray-700 rounded w-64 md:w-96 mx-auto" })),
        React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8" },
          [1, 2, 3].map(function(i) {
            return React.createElement("div", { key: i, className: "animate-pulse" },
              React.createElement("div", { className: "h-48 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4" }),
              React.createElement("div", { className: "h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" }),
              React.createElement("div", { className: "h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" }));
          }))));
  }
  
  var handleCardClick = function(link: string) {
    triggerHaptic();
    window.open(link, '_blank', 'noopener noreferrer');
  };
  
  return React.createElement("section", { className: "py-12 md:py-20 bg-gray-50 dark:bg-background-dark" },
    React.createElement("div", { className: "max-w-7xl mx-auto px-4" },
      React.createElement("div", { className: "text-center mb-8 md:mb-12" },
        React.createElement("h2", { className: "text-2xl md:text-3xl font-bold mb-3 md:mb-4 text-primary" }, news.title || 'Latest News & Events'),
        React.createElement("p", { className: "text-gray-600 dark:text-gray-400 text-sm md:text-base" }, news.description || 'Get the latest news & event briefs from the ICT industry')),
      React.createElement("div", { className: "flex justify-center gap-3 md:gap-4 mb-8 md:mb-12" },
        React.createElement("button", {
          onClick: function() { triggerHaptic(); setActiveTab('news'); },
          className: "px-4 md:px-6 py-2 rounded-lg font-bold transition-all text-sm md:text-base " + (activeTab === 'news'
            ? 'bg-primary text-white'
            : 'text-gray-600 dark:text-gray-400 hover:text-primary hover:bg-primary/10')
        }, "News & Updates"),
        React.createElement("button", {
          onClick: function() { triggerHaptic(); setActiveTab('events'); },
          className: "px-4 md:px-6 py-2 rounded-lg font-bold transition-all text-sm md:text-base " + (activeTab === 'events'
            ? 'bg-primary text-white'
            : 'text-gray-600 dark:text-gray-400 hover:text-primary hover:bg-primary/10')
        }, "Upcoming Events")),
      activeTab === 'news' && React.createElement(React.Fragment, null,
        React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10" },
          newsItems.map(function(item: any) {
            return React.createElement("div", {
              key: item.id,
              onClick: function() { handleCardClick(item.link); },
              className: "group cursor-pointer bg-white dark:bg-surface rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all hover:translate-y-[-4px] focus:outline-none focus:ring-2 focus:ring-primary",
              role: "button",
              tabIndex: 0,
              onKeyDown: function(e: React.KeyboardEvent) { if (e.key === 'Enter' || e.key === ' ') { handleCardClick(item.link); } }
            },
              React.createElement("div", { className: "aspect-video overflow-hidden" },
                React.createElement("img", {
                  src: item.image,
                  alt: item.title,
                  className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500",
                  loading: "lazy"
                })),
              React.createElement("div", { className: "p-5 md:p-6" },
                React.createElement("h3", { className: "font-bold text-base md:text-lg mb-2 md:mb-3 group-hover:text-primary transition-colors line-clamp-2 text-gray-800 dark:text-white" }, item.title),
                item.description && React.createElement("p", { className: "text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-3 md:mb-4 line-clamp-3" }, item.description),
                React.createElement("span", { className: "inline-flex items-center gap-2 text-primary text-xs md:text-sm font-medium group-hover:gap-3 transition-all" },
                  "Learn more",
                  React.createElement("span", { className: "material-symbols-outlined text-xs" }, "arrow_forward"))));
          })),
        React.createElement("div", { className: "text-center mt-8 md:mt-12" },
          React.createElement("a", {
            href: "https://icta.go.ke/news",
            target: "_blank",
            rel: "noopener noreferrer",
            className: "inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all text-sm md:text-base",
            onClick: triggerHaptic
          }, "View all news",
            React.createElement("span", { className: "material-symbols-outlined text-sm" }, "arrow_forward")))),
      activeTab === 'events' && React.createElement("div", { className: "text-center py-8 md:py-12" },
        React.createElement("p", { className: "text-gray-600 dark:text-gray-400 text-sm md:text-base" }, "No upcoming events at this time."),
        React.createElement("a", {
          href: "https://icta.go.ke/events",
          target: "_blank",
          rel: "noopener noreferrer",
          className: "inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all mt-4 text-sm md:text-base",
          onClick: triggerHaptic
        }, "View all events",
          React.createElement("span", { className: "material-symbols-outlined text-sm" }, "arrow_forward")))));
};

export default NewsSection;


/*lastt working
// frontend/src/sections/NewsSection.tsx
import React, { useState } from 'react';
import { useContent } from '../content/useContext';

const NewsSection: React.FC = () => {
  const { content, isLoading } = useContent();
  const [activeTab, setActiveTab] = useState('news');
  
  const news = content.news || {};
  const newsItems = news.items || [];
  
  if (isLoading) {
    return (
      <section className="py-20 bg-gray-50 dark:bg-background-dark">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section className="py-20 bg-gray-50 dark:bg-background-dark">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header /}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-primary">{news.title || 'Latest News & Events'}</h2>
          <p className="text-gray-600 dark:text-gray-400">{news.description || 'Get the latest news & event briefs from the ICT industry'}</p>
        </div>
        
        {/* Tab Navigation /}
        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => setActiveTab('news')}
            className={`px-6 py-2 rounded-lg font-bold transition-all ${
              activeTab === 'news'
                ? 'bg-primary text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-primary hover:bg-primary/10'
            }`}
          >
            News &amp; Updates
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`px-6 py-2 rounded-lg font-bold transition-all ${
              activeTab === 'events'
                ? 'bg-primary text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-primary hover:bg-primary/10'
            }`}
          >
            Upcoming Events
          </button>
        </div>
        
        {/* News Content /}
        {activeTab === 'news' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {newsItems.map((item) => (
                <div key={item.id} className="group cursor-pointer bg-white dark:bg-surface rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all">
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-3 group-hover:text-primary transition-colors line-clamp-2 text-gray-800 dark:text-white">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">{item.description}</p>
                    )}
                    <a 
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary text-sm font-medium hover:gap-3 transition-all"
                    >
                      Learn more
                      <span className="material-symbols-outlined text-xs">arrow_forward</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
            
            {/* View All Link *}
            <div className="text-center mt-12">
              <a 
                href="https://icta.go.ke/news"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all"
              >
                View all news
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </a>
            </div>
          </>
        )}
        
        {/* Events Content /}
        {activeTab === 'events' && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">No upcoming events at this time.</p>
            <a 
              href="https://icta.go.ke/events"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all mt-4"
            >
              View all events
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsSection;*/


/*// frontend/src/sections/NewsSection.tsx
import React, { useState } from 'react';

interface NewsItem {
  id: number;
  title: string;
  description: string;
  image: string;
  link: string;
  date?: string;
}

const newsItems: NewsItem[] = [
  {
    id: 1,
    title: 'Notice of Early Market Engagement (EME) – Kenya Digital Economy Acceleration Project (KDEAP)',
    description: 'The Information and Communications Technology Authority, with financing from World Bank under the Kenya Digital Economy Acceleration Project (KDEAP), invites industry stakeholders to participate in...',
    image: 'https://cms.icta.go.ke//sites/default/files/2026-03/market.jpeg',
    link: 'https://icta.go.ke/news?node=823&type=news'
  },
  {
    id: 2,
    title: 'PDTP Cohort X Recruitment (2025-2026 intake)',
    description: '',
    image: 'https://cms.icta.go.ke//sites/default/files/2025-08/Newssectionn.png',
    link: 'https://icta.go.ke/news?node=785&type=news'
  },
  {
    id: 3,
    title: 'Dar-es-Salaam - Mombasa Terrestrial Fibre Link at the Lunga Lunga/Horohoro border',
    description: 'Kenya and Tanzania officially launched the Dar-es-Salaam to Mombasa Terrestrial Fibre Link at the Lunga Lunga/Horohoro border. This high-speed infrastructure connects Kenya\'s National ICT Broadband...',
    image: 'https://cms.icta.go.ke//sites/default/files/2025-07/TTCL.jpg',
    link: 'https://icta.go.ke/news?node=772&type=news'
  }
];

const NewsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('news');

  return (
    <section className="py-20 bg-gray-50 dark:bg-background-dark">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header /}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-primary">Latest News &amp; Events</h2>
          <p className="text-gray-600 dark:text-gray-400">Get the latest news &amp; event briefs from the ICT industry</p>
        </div>
        
        {/* Tab Navigation /}
        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => setActiveTab('news')}
            className={`px-6 py-2 rounded-lg font-bold transition-all ${
              activeTab === 'news'
                ? 'bg-primary text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-primary hover:bg-primary/10'
            }`}
          >
            News &amp; Updates
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`px-6 py-2 rounded-lg font-bold transition-all ${
              activeTab === 'events'
                ? 'bg-primary text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-primary hover:bg-primary/10'
            }`}
          >
            Upcoming Events
          </button>
        </div>
        
        {/* News Content /}
        {activeTab === 'news' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {newsItems.map((news) => (
                <div key={news.id} className="group cursor-pointer bg-white dark:bg-surface rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all">
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={news.image} 
                      alt={news.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-3 group-hover:text-primary transition-colors line-clamp-2 text-gray-800 dark:text-white">
                      {news.title}
                    </h3>
                    {news.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">{news.description}</p>
                    )}
                    <a 
                      href={news.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary text-sm font-medium hover:gap-3 transition-all"
                    >
                      Learn more
                      <span className="material-symbols-outlined text-xs">arrow_forward</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
            
            {/* View All Link /}
            <div className="text-center mt-12">
              <a 
                href="https://icta.go.ke/news"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all"
              >
                View all news
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </a>
            </div>
          </>
        )}
        
        {/* Events Content /}
        {activeTab === 'events' && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">No upcoming events at this time.</p>
            <a 
              href="https://icta.go.ke/events"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all mt-4"
            >
              View all events
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsSection;*/
