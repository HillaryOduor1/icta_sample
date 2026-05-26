const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface SiteContent {
  navigation: Array<{ name: string; href: string; icon?: string }>;
  hero: {
    badge: string;
    headline: string;
    highlightedText: string;
    headlineEnd: string;
    description: string;
    primaryButtonText: string;
    secondaryButtonText: string;
    backgroundImage: string;
  };
  about: {
    badge: string;
    title: string;
    description1: string;
    description2: string;
    stats: Array<{ number: string; label: string }>;
    features: Array<{ icon: string; title: string; description: string }>;
    image: string;
  };
  areas: Array<{
    icon: string;
    title: string;
    description: string;
    link: string;
  }>;
  partners: {
    badge: string;
    title: string;
    description: string;
    categories: string[];
    logos: Array<{ icon: string; name?: string }>;
  };
  research: Array<{
    category: string;
    date: string;
    title: string;
    description: string;
    image: string;
    isNew: boolean;
    link?: string;
  }>;
  advisory: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  cta: {
    title: string;
    description: string;
    primaryButtonText: string;
    secondaryButtonText: string;
  };
  footer: {
    description: string;
    quickLinks: Array<{ name: string; href: string }>;
    contact: {
      address: string;
      email: string;
      phone: string;
    };
    socialLinks: Array<{ icon: string; href: string }>;
    copyright: string;
    legalLinks: Array<{ name: string; href: string }>;
  };
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
}

class ContentService {
  private async fetchContent(): Promise<SiteContent | null> {
    try {
      const response = await fetch(`${API_BASE}/api/content/page/home`);
      if (!response.ok) throw new Error('Failed to fetch content');
      return await response.json();
    } catch (error) {
      console.error('Error fetching content:', error);
      return null;
    }
  }

  async getContent(): Promise<SiteContent> {
    const cached = localStorage.getItem('site-content');
    const cachedTime = localStorage.getItem('site-content-time');
    
    // Use cache if less than 5 minutes old
    if (cached && cachedTime) {
      const age = Date.now() - parseInt(cachedTime);
      if (age < 5 * 60 * 1000) {
        return JSON.parse(cached);
      }
    }

    const content = await this.fetchContent();
    if (content) {
      localStorage.setItem('site-content', JSON.stringify(content));
      localStorage.setItem('site-content-time', Date.now().toString());
      return content;
    }

    // Return cached if available, otherwise throw
    if (cached) return JSON.parse(cached);
    throw new Error('No content available');
  }
}

export const contentService = new ContentService();