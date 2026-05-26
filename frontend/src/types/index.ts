import type { ReactNode } from "react";

export interface SectionTitleProps {
    text1: string;
    text2: string;
    text3: string;
}

export interface TestimonialCardProps {
    testimonial: ITestimonial;
    index: number;
}

export interface ITestimonial {
    image: string;
    name: string;
    handle: string;
    date: string;
    quote: string;
}


export interface IFeature {
    icon?: React.ReactNode;
    title: string;
    description: string;
}

export interface IFooter {
    title: string;
    links: IFooterLink[];
}

export interface IFooterLink {
    name: string;
    href: string;
}

export interface NavbarProps {
    navlinks: INavLink[];
}

export interface INavLink {
    name: string;
    href: string;
    icon?: ReactNode;
}

export interface PricingCardProps {
    pricing: IPricing;
    index: number;
}

export interface IPricing {
    name: string;
    price: number;
    period: string;
    features: string[];
    mostPopular: boolean;
}

export interface SectionProps {
    title: string;
    description: string;
    buttonText: string;
    buttonHref: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  mostPopular?: boolean;
  features: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
}

export interface SiteContent {
  navigation: NavItem[];

  hero: {
    announcement: string;
    headline: string;
    highlight: string;
    subtext: string;
    primaryCTA: string;
    secondaryCTA: string;
    features: string[];
  };

  featuresSection: {
    title1: string;
    title2: string;
    title3: string;
    description: string;
    items: FeatureItem[];
  };

  pricingSection: {
    title1: string;
    title2: string;
    title3: string;
    plans: PricingPlan[];
  };

  testimonialsSection: {
    title1: string;
    title2: string;
    title3: string;
    items: Testimonial[];
  };

  contactSection: {
    title1: string;
    title2: string;
    title3: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    submitText: string;
  };

  ctaSection: {
    title: string;
    description: string;
    buttonText: string;
  };
}