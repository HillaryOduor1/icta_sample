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
