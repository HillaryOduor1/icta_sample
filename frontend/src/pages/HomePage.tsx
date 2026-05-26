// frontend/src/pages/HomePage.tsx
import React from 'react';
import HeroSection from '../sections/HeroSection';
import QuickLinksSection from '../sections/QuickLinksSection';
import AboutSection from '../sections/AboutSection';
import MasterplanSection from '../sections/MasterPlanSection';
import NewsSection from '../sections/NewsSection';
import TestimonialSection from '../sections/TestimonialSection';

const HomePage: React.FC = () => {
  return (
    <>
      <HeroSection />
      <QuickLinksSection />
      <AboutSection />
      <MasterplanSection />
      <NewsSection />
      <TestimonialSection />
    </>
  );
};

export default HomePage;
/*last stable lis version
// pages/HomePage.tsx
import { useEffect } from 'react';
import HeroSection from '../sections/HeroSection';
import AboutSection from '../sections/AboutSection';
import FeaturesSection from '../sections/FeaturesSection';
import PartnersSection from '../sections/PartnersSection';
import CTASection from '../sections/CTASection';

const HomePage = () => {
  useEffect(() => {
    // Update document title
    document.title = 'Landscapes Integrity Solutions (LIS) | Advancing Sustainable Policy';
  }, []);

  return (
    <>
      <HeroSection />
      <AboutSection />
      <FeaturesSection />
      <PartnersSection />
      <CTASection />
    </>
  );
};

export default HomePage;*/