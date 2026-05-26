// Auto-generated from backend API for tenant: icta_sample
// Generated at: 2026-05-26T18:08:34.307Z
// DO NOT EDIT MANUALLY – regenerate with `npm run generate:content`

export interface SiteContent {
  id: string;
  page: string;
  published: boolean;
  version: number;
  updatedBy: string;
  navigation: Array<{
    name: string;
    href: string;
    icon: string;
  }>;
  hero: {
    badge: string;
    headline: string;
    highlightedText: string;
    headlineEnd: string;
    description: string;
    primaryButtonText: string;
    secondaryButtonText: string;
    backgroundImage: string;
    announcementBadge: string;
    announcementText: string;
    subtext: string;
    features: any[];
  };
  about: {
    badge: string;
    title: string;
    description1: string;
    description2: string;
    stats: any[];
    features: any[];
    image: string;
  };
  areas: any[];
  partners: {
    badge: string;
    title: string;
    description: string;
    categories: any[];
    logos: any[];
  };
  research: any[];
  advisory: any[];
  testimonials: any[];
  contact: {
    sectionTitle: {
      text1: string;
      text2: string;
      text3: string;
    };
    form: {
      nameLabel: string;
      namePlaceholder: string;
      emailLabel: string;
      emailPlaceholder: string;
      messageLabel: string;
      messagePlaceholder: string;
      submitText: string;
    };
  };
  cta: {
    title: string;
    description: string;
    primaryButtonText: string;
    secondaryButtonText: string;
  };
  footer: {
    description: string;
    quickLinks: Array<{
      name: string;
      href: string;
    }>;
    socialLinks: Array<{
      icon: string;
      href: string;
    }>;
    copyright: string;
    legalLinks: Array<{
      name: string;
      href: string;
    }>;
    affiliatedSites: any[];
    resources: any[];
    ictaLinks: any[];
  };
  privacyPolicy: {
    title: string;
    lastUpdated: string;
    sections: any[];
    contactEmail: string;
    contactPhone: string;
    contactAddress: string;
  };
  termsOfUse: {
    title: string;
    effectiveDate: string;
    sections: any[];
    contactEmail: string;
  };
  accessibility: {
    title: string;
    lastUpdated: string;
    sections: any[];
    contactEmail: string;
    contactPhone: string;
    contactAddress: string;
  };
  aboutItems: Array<{
    icon: string;
    title: string;
    description: string;
    link: string;
  }>;
  masterplanTabs: Array<{
    id: string;
    title: string;
    description: string;
    ctaLink: string;
    ctaText: string;
    items: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
  }>;
  news: {
    badge: string;
    title: string;
    description: string;
    items: Array<{
      id: number;
      title: string;
      description: string;
      image: string;
      link: string;
      date: string;
    }>;
  };
  quickLinks: Array<{
    title: string;
    href: string;
    icon: string;
    alt: string;
  }>;
  topNavLinks: Array<{
    label: string;
    href: string;
    icon: string;
    external: boolean;
  }>;
  mainNavItems: Array<{
    label: string;
    href: string;
    external: boolean;
    dropdown: any[];
  }>;
}
