import { useState, useEffect, useMemo, useCallback } from 'react';
import { useContent } from '../content/useContext';

export default function HeroSection() {
  const { content, isLoading } = useContent();
  const [imageError, setImageError] = useState(false);

  // Memoize the final background image URL
  const fallbackImage = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2070&auto=format';
  const backgroundImage = useMemo(function() {
    if (imageError || !content.hero?.backgroundImage) return fallbackImage;
    return content.hero.backgroundImage;
  }, [content.hero?.backgroundImage, imageError, fallbackImage]);

  // Preload the background image
  useEffect(function() {
    if (!backgroundImage) return;
    try {
      var url = new URL(backgroundImage);
      var domain = url.origin;
      if (domain) {
        var preconnectLink = document.createElement('link');
        preconnectLink.rel = 'preconnect';
        preconnectLink.href = domain;
        document.head.appendChild(preconnectLink);
        return function() {
          if (preconnectLink.parentNode) {
            document.head.removeChild(preconnectLink);
          }
        };
      }
    } catch (_) {
      // ignore invalid URL
    }
  }, [backgroundImage]);

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

  var triggerHaptic = useCallback(function() {
    try {
      if (window.navigator && typeof window.navigator.vibrate === 'function') {
        window.navigator.vibrate(50);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  var handleImageError = useCallback(function() {
    setImageError(true);
  }, []);

  // If still loading, return null (LoadingFallback handles the loading state)
  if (isLoading) {
    return null;
  }

  return (
    <section className="relative overflow-hidden">
      <div className="relative min-h-[600px] flex flex-col justify-center px-6 md:px-12 overflow-hidden">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center opacity-30 dark:opacity-20"
          style={{
            backgroundImage: 'url(' + backgroundImage + ')',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
          }}
          onError={handleImageError}
        />
        <div className="absolute inset-0 z-1 bg-gradient-to-r from-white/95 via-white/80 to-white/60 dark:from-black/95 dark:via-black/80 dark:to-black/60" />
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-[2px] w-8 bg-primary"></div>
            <span className="text-primary font-bold tracking-widest text-xs uppercase">
              {content.hero?.badge || 'Vision 2030 Partner'}
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tighter mb-6 text-gray-900 dark:text-white">
            {content.hero?.headline || "Powering Kenya's"} <br />
            <span className="text-primary">
              {content.hero?.highlightedText || 'Digital Economy'}
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-10 max-w-xl leading-relaxed">
            {content.hero?.description ||
              "The National Digital Masterplan 2022-2032 is transforming Kenya into a regional ICT hub through innovation, infrastructure, and e-government."}
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://cms.icta.go.ke/sites/default/files/2022-09/Kenya_Digital_Master_Plan_2022-2023.pdf"
              target="_blank"
              rel="noopener noreferrer"
              onClick={triggerHaptic}
              className="bg-primary text-white px-8 py-4 rounded-lg font-bold text-base hover:bg-green-600 hover:scale-105 transition-all duration-300 shadow-lg shadow-primary/30 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-black"
            >
              {content.hero?.primaryButtonText || 'Download Masterplan'}
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
}
/*import { useState, useEffect, useMemo, useCallback } from 'react';
import { useContent } from '../content/useContext';

const HeroSection = () => {
  const { content, isLoading } = useContent();
  const [imageError, setImageError] = useState(false);

  // Memoize the final background image URL
  const fallbackImage = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2070&auto=format';
  const backgroundImage = useMemo(() => {
    if (imageError || !content.hero?.backgroundImage) return fallbackImage;
    return content.hero.backgroundImage;
  }, [content.hero?.backgroundImage, imageError, fallbackImage]);

  // Preload the background image as soon as we have a valid URL
  useEffect(() => {
    if (!backgroundImage) return;

    // Extract domain for preconnect (optional but improves performance)
    try {
      const url = new URL(backgroundImage);
      const domain = url.origin;
      if (domain) {
        const preconnectLink = document.createElement('link');
        preconnectLink.rel = 'preconnect';
        preconnectLink.href = domain;
        document.head.appendChild(preconnectLink);
        // Cleanup preconnect when URL changes
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

  // Preload the image
  useEffect(() => {
    if (!backgroundImage) return;

    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.as = 'image';
    preloadLink.href = backgroundImage;
    // Optional: set fetchpriority="high" to prioritize this resource
    preloadLink.setAttribute('fetchpriority', 'high');
    document.head.appendChild(preloadLink);

    // Cleanup on unmount or when URL changes
    return () => {
      if (preloadLink.parentNode) {
        document.head.removeChild(preloadLink);
      }
    };
  }, [backgroundImage]);

  const triggerHaptic = useCallback(() => {
    try {
      if (window.navigator && typeof window.navigator.vibrate === 'function') {
        window.navigator.vibrate(50);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

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

  return (
    <section className="relative overflow-hidden">
      <div className="relative min-h-[600px] flex flex-col justify-center px-6 md:px-12 overflow-hidden">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center opacity-30 dark:opacity-20"
          style={{
            backgroundImage: `url('${backgroundImage}')`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
          }}
          onError={handleImageError}
        />
        <div className="absolute inset-0 z-1 bg-gradient-to-r from-white/95 via-white/80 to-white/60 dark:from-black/95 dark:via-black/80 dark:to-black/60" />
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-[2px] w-8 bg-primary"></div>
            <span className="text-primary font-bold tracking-widest text-xs uppercase">
              {content.hero?.badge || 'Vision 2030 Partner'}
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tighter mb-6 text-gray-900 dark:text-white">
            {content.hero?.headline || "Powering Kenya's"} <br />
            <span className="text-primary">
              {content.hero?.highlightedText || 'Digital Economy'}
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-10 max-w-xl leading-relaxed">
            {content.hero?.description ||
              "The National Digital Masterplan 2022-2032 is transforming Kenya into a regional ICT hub through innovation, infrastructure, and e-government."}
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://cms.icta.go.ke/sites/default/files/2022-09/Kenya_Digital_Master_Plan_2022-2023.pdf"
              target="_blank"
              rel="noopener noreferrer"
              onClick={triggerHaptic}
              className="bg-primary text-white px-8 py-4 rounded-lg font-bold text-base hover:bg-green-600 hover:scale-105 transition-all duration-300 shadow-lg shadow-primary/30 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-black"
            >
              {content.hero?.primaryButtonText || 'Download Masterplan'}
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

export default HeroSection;*/

