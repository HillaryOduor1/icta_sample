import React, { useState } from 'react';
import { useContent } from '../content/useContext';

interface NewsItem {
  id: string | number;
  title: string;
  description?: string;
  image: string;
  link: string;
}

var triggerHaptic = function(): void {
  try {
    if (window.navigator && typeof window.navigator.vibrate === "function") {
      window.navigator.vibrate(50);
    }
  } catch (e) {}
};

export default function NewsSection() {
  const { content, isLoading } = useContent();
  const [activeTab, setActiveTab] = useState<'news' | 'events'>('news');
  
  const news = content.news || {};
  const newsItems: NewsItem[] = news.items || [];
  
  // If still loading, return null
  if (isLoading) {
    return null;
  }
  
  var handleCardClick = function(link: string): void {
    triggerHaptic();
    window.open(link, '_blank', 'noopener noreferrer');
  };
  
  return (
    <section className="py-12 md:py-20 bg-gray-50 dark:bg-background-dark">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 text-primary">
            {news.title || 'Latest News & Events'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
            {news.description || 'Get the latest news & event briefs from the ICT industry'}
          </p>
        </div>
        <div className="flex justify-center gap-3 md:gap-4 mb-8 md:mb-12">
          <button
            onClick={() => { triggerHaptic(); setActiveTab('news'); }}
            className={`px-4 md:px-6 py-2 rounded-lg font-bold transition-all text-sm md:text-base ${
              activeTab === 'news'
                ? 'bg-primary text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-primary hover:bg-primary/10'
            }`}
          >
            News & Updates
          </button>
          <button
            onClick={() => { triggerHaptic(); setActiveTab('events'); }}
            className={`px-4 md:px-6 py-2 rounded-lg font-bold transition-all text-sm md:text-base ${
              activeTab === 'events'
                ? 'bg-primary text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-primary hover:bg-primary/10'
            }`}
          >
            Upcoming Events
          </button>
        </div>
        {activeTab === 'news' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
              {newsItems.map((item: NewsItem) => (
                <div
                  key={item.id}
                  onClick={() => handleCardClick(item.link)}
                  className="group cursor-pointer bg-white dark:bg-surface rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all hover:translate-y-[-4px] focus:outline-none focus:ring-2 focus:ring-primary"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e: React.KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { handleCardClick(item.link); } }}
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-5 md:p-6">
                    <h3 className="font-bold text-base md:text-lg mb-2 md:mb-3 group-hover:text-primary transition-colors line-clamp-2 text-gray-800 dark:text-white">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-3 md:mb-4 line-clamp-3">
                        {item.description}
                      </p>
                    )}
                    <span className="inline-flex items-center gap-2 text-primary text-xs md:text-sm font-medium group-hover:gap-3 transition-all">
                      Learn more
                      <span className="material-symbols-outlined text-xs">arrow_forward</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8 md:mt-12">
              <a
                href="https://icta.go.ke/news"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all text-sm md:text-base"
                onClick={triggerHaptic}
              >
                View all news
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </a>
            </div>
          </>
        )}
        {activeTab === 'events' && (
          <div className="text-center py-8 md:py-12">
            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">No upcoming events at this time.</p>
            <a
              href="https://icta.go.ke/events"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all mt-4 text-sm md:text-base"
              onClick={triggerHaptic}
            >
              View all events
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
/*import React, { useState } from 'react';
import { useContent } from '../content/useContext';

interface NewsItem {
  id: string | number;
  title: string;
  description?: string;
  image: string;
  link: string;
}

const triggerHaptic = (): void => {
  try {
    if (window.navigator && typeof window.navigator.vibrate === "function") {
      window.navigator.vibrate(50);
    }
  } catch (e) {}
};

const NewsSection: React.FC = () => {
  const { content, isLoading } = useContent();
  const [activeTab, setActiveTab] = useState<'news' | 'events'>('news');
  
  const news = content.news || {};
  const newsItems: NewsItem[] = news.items || [];
  
  if (isLoading) {
    return (
      <section className="py-12 md:py-20 bg-gray-50 dark:bg-background-dark">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 md:w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64 md:w-96 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
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
  
  const handleCardClick = (link: string): void => {
    triggerHaptic();
    window.open(link, '_blank', 'noopener noreferrer');
  };
  
  return (
    <section className="py-12 md:py-20 bg-gray-50 dark:bg-background-dark">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 text-primary">
            {news.title || 'Latest News & Events'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
            {news.description || 'Get the latest news & event briefs from the ICT industry'}
          </p>
        </div>
        <div className="flex justify-center gap-3 md:gap-4 mb-8 md:mb-12">
          <button
            onClick={() => { triggerHaptic(); setActiveTab('news'); }}
            className={`px-4 md:px-6 py-2 rounded-lg font-bold transition-all text-sm md:text-base ${
              activeTab === 'news'
                ? 'bg-primary text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-primary hover:bg-primary/10'
            }`}
          >
            News & Updates
          </button>
          <button
            onClick={() => { triggerHaptic(); setActiveTab('events'); }}
            className={`px-4 md:px-6 py-2 rounded-lg font-bold transition-all text-sm md:text-base ${
              activeTab === 'events'
                ? 'bg-primary text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-primary hover:bg-primary/10'
            }`}
          >
            Upcoming Events
          </button>
        </div>
        {activeTab === 'news' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
              {newsItems.map((item: NewsItem) => (
                <div
                  key={item.id}
                  onClick={() => handleCardClick(item.link)}
                  className="group cursor-pointer bg-white dark:bg-surface rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all hover:translate-y-[-4px] focus:outline-none focus:ring-2 focus:ring-primary"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e: React.KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { handleCardClick(item.link); } }}
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-5 md:p-6">
                    <h3 className="font-bold text-base md:text-lg mb-2 md:mb-3 group-hover:text-primary transition-colors line-clamp-2 text-gray-800 dark:text-white">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-3 md:mb-4 line-clamp-3">
                        {item.description}
                      </p>
                    )}
                    <span className="inline-flex items-center gap-2 text-primary text-xs md:text-sm font-medium group-hover:gap-3 transition-all">
                      Learn more
                      <span className="material-symbols-outlined text-xs">arrow_forward</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8 md:mt-12">
              <a
                href="https://icta.go.ke/news"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all text-sm md:text-base"
                onClick={triggerHaptic}
              >
                View all news
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </a>
            </div>
          </>
        )}
        {activeTab === 'events' && (
          <div className="text-center py-8 md:py-12">
            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">No upcoming events at this time.</p>
            <a
              href="https://icta.go.ke/events"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all mt-4 text-sm md:text-base"
              onClick={triggerHaptic}
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
