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

  var backgroundImage = useMemo(function () {
    return '/assets/bg_image.jpg';
  }, []);

  useEffect(function () {
    if (!backgroundImage) return;

    var preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.as = 'image';
    preloadLink.href = backgroundImage;
    preloadLink.setAttribute('fetchpriority', 'high');

    document.head.appendChild(preloadLink);

    return function () {
      if (preloadLink.parentNode) {
        document.head.removeChild(preloadLink);
      }
    };
  }, [backgroundImage]);

  var triggerHaptic = useCallback(function (): void {
    try {
      if (
        window.navigator &&
        typeof window.navigator.vibrate === 'function'
      ) {
        window.navigator.vibrate(50);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  var handleImageError = useCallback(function (index: number): void {
    setImageErrors(function (prev) {
      var newState = Object.assign({}, prev);
      newState[index] = true;
      return newState;
    });
  }, []);

  if (isLoading) {
    return null;
  }

  var about = content.about || {};
  var aboutItems: AboutItem[] = content.aboutItems || [];
  var featuredItem = aboutItems[0];
  var regularItems = aboutItems.slice(1);

  var aboutLink =
    'https://icta.go.ke/page?q=6&type=about_ict_authority';

  return (
    <section className="relative py-12 md:py-20 lg:py-28 overflow-hidden about-section">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(' + backgroundImage + ')' }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 z-1">
        {/* Keep the left section readable and visually consistent */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/85 to-black/90 dark-only" />

        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/80 to-black/90 light-only" />

        <div className="absolute inset-0 backdrop-blur-sm" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-6 md:gap-8 lg:gap-12">

         {/* LEFT COLUMN  Theme-independent presentation */}
<div className="lg:col-span-2 space-y-4 md:space-y-6 about-left-content">

  {/* Eyebrow */}
  <div className="flex items-center gap-3">
    <span className="text-xs md:text-sm font-semibold tracking-widest uppercase about-eyebrow">
      About ICT Authority
    </span>

    <span className="h-px flex-1 about-eyebrow-line" />
  </div>

  {/* Main Heading */}
  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight about-left-title">
    {about.title || "Building Kenya's Digital Future"}
  </h1>

  {/* Description */}
  <p className="text-base md:text-lg leading-relaxed max-w-lg about-left-description">
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
                className="group inline-flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black shadow-lg"
              >
                <span>Explore ICT Authority</span>

                <svg
                  className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-3">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5 lg:gap-6">

              {/* FEATURED CARD */}
              {featuredItem && (
                <div className="sm:col-span-2 mb-4 sm:mb-0">
                  <div
                    className="
                      group relative overflow-hidden rounded-2xl
                      p-5 md:p-7 lg:p-8
                      bg-white/95 dark:bg-black/40
                      backdrop-blur-xl
                      border border-gray-200/80 dark:border-white/10
                      shadow-lg shadow-gray-900/5 dark:shadow-xl
                      hover:shadow-2xl
                      transition-all duration-500
                      hover:-translate-y-1
                    "
                  >
                    {/* Subtle red accent */}
                    <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-transparent dark:from-red-400/5 pointer-events-none" />

                    <div className="relative">
                      {/* Content */}
                      <div className="space-y-2 md:space-y-3">

                        <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
                          {featuredItem.title}
                        </h3>

                        <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                          {featuredItem.description}
                        </p>

                        <a
                          href={aboutLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={triggerHaptic}
                          className="
                            group/link
                            inline-flex items-center gap-2
                            mt-1 md:mt-2
                            text-sm font-semibold
                            text-red-600 dark:text-red-400
                            hover:text-red-700 dark:hover:text-red-300
                            transition-colors duration-300
                          "
                        >
                          Learn More

                          <svg
                            className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
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
                </div>
              )}

              {/*  REGULAR CARDS */}
              {regularItems.map(function (
                item: AboutItem,
                index: number
              ) {
                var actualIndex = index + 1;

                return (
                  <div
                    key={actualIndex}
                    className="col-span-1 mb-4 sm:mb-0"
                  >
                    <div
                      className="
                        group h-full rounded-2xl
                        p-4 md:p-5 lg:p-6
                        bg-white/95 dark:bg-black/30
                        backdrop-blur-xl
                        border border-gray-200/80 dark:border-white/10
                        shadow-md shadow-gray-900/5 dark:shadow-lg
                        hover:shadow-xl
                        transition-all duration-300
                        hover:-translate-y-1
                        hover:border-red-600/30
                        dark:hover:border-red-400/20
                      "
                    >
                      <div className="flex flex-col h-full">

                        {/* Card Content */}
                        <div className="space-y-1 flex-1">

                          <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white">
                            {item.title}
                          </h3>

                          <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-400 leading-relaxed">
                            {item.description}
                          </p>
                        </div>

                        {/* Learn More */}
                        <a
                          href={aboutLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={triggerHaptic}
                          className="
                            group/link
                            inline-flex items-center gap-2
                            mt-4
                            text-sm font-semibold
                            text-red-600 dark:text-red-400
                            hover:text-red-700 dark:hover:text-red-300
                            transition-colors duration-300
                          "
                        >
                          Learn More

                          <svg
                            className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
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
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}