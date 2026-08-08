export class ContentTransformer {
  static toResponse(content) {
    if (!content) return null;
    
    // Return all fields including the new ICTA-specific ones
    const response = {
      id: content._id?.toString(),
      page: content.page,
      published: content.published,
      version: content.version,
      updatedBy: content.updatedBy,
      updatedAt: content.updatedAt?.toISOString(),
      createdAt: content.createdAt?.toISOString(),
      
      // Standard sections
      navigation: content.navigation,
      hero: content.hero,
      about: content.about,
      areas: content.areas,
      partners: content.partners,
      research: content.research,
      advisory: content.advisory,
      testimonials: content.testimonials,
      contact: content.contact,
      cta: content.cta,
      footer: content.footer,
      privacyPolicy: content.privacyPolicy,
      termsOfUse: content.termsOfUse,
      accessibility: content.accessibility,
      theme: content.theme,
      
      // ICT Authority specific sections
      aboutItems: content.aboutItems,
      masterplanTabs: content.masterplanTabs,
      news: content.news,
      quickLinks: content.quickLinks,
      topNavLinks: content.topNavLinks,
      mainNavItems: content.mainNavItems
    };
    
    // Remove undefined values
    Object.keys(response).forEach(key => {
      if (response[key] === undefined) {
        delete response[key];
      }
    });
    
    return response;
  }
}
