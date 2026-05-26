// backend/src/api/v1/transformers/content.transformer.js
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
/*export class ContentTransformer {
  static toResponse(content) {
    if (!content) return null;
    
    // Return full content object without internal fields
    const response = {
      id: content._id?.toString(),
      page: content.page,
      published: content.published,
      version: content.version,
      updatedBy: content.updatedBy,
      updatedAt: content.updatedAt?.toISOString(),
      createdAt: content.createdAt?.toISOString(),
    };
    
    // Add all content sections
    const sections = [
      'navigation', 'hero', 'about', 'areas', 'partners', 'research', 
      'advisory', 'testimonials', 'contact', 'cta', 'footer', 
      'privacyPolicy', 'termsOfUse', 'accessibility', 'theme',
      'news', 'quickLinks', 'topNavLinks', 'mainNavItems'
    ];
    
    for (const section of sections) {
      if (content[section]) {
        response[section] = content[section];
      }
    }
    
    return response;
  }
  
  static toPaginatedResponse(contents, pagination, total, req) {
    const data = contents.map(c => this.toResponse(c));
    const baseUrl = `${req.baseUrl}${req.path}`;
    return {
      data,
      meta: {
        page: pagination.page,
        limit: pagination.limit,
        totalItems: total,
        totalPages: Math.ceil(total / pagination.limit),
        hasNextPage: pagination.page * pagination.limit < total,
        hasPrevPage: pagination.page > 1,
      },
      links: {
        self: `${baseUrl}?page=${pagination.page}&limit=${pagination.limit}`,
        next: pagination.page * pagination.limit < total ? `${baseUrl}?page=${pagination.page + 1}&limit=${pagination.limit}` : null,
        prev: pagination.page > 1 ? `${baseUrl}?page=${pagination.page - 1}&limit=${pagination.limit}` : null,
      },
    };
  }
}*/
/*export class ContentTransformer {
  static toResponse(content) {
    if (!content) return null;
    return {
      id: content._id?.toString(),
      page: content.page,
      data: {
        navigation: content.navigation,
        hero: content.hero,
        about: content.about,
        areas: content.areas,
        partners: content.partners,
        research: content.research,
        advisory: content.advisory,
        pricing: content.pricing,
        testimonials: content.testimonials,
        contact: content.contact,
        cta: content.cta,
        footer: content.footer,
        privacyPolicy: content.privacyPolicy,
        termsOfUse: content.termsOfUse,
        accessibility: content.accessibility,
        metadata: content.metadata,
      },
      published: content.published,
      version: content.version,
      updatedBy: content.updatedBy,
      updatedAt: content.updatedAt?.toISOString(),
      createdAt: content.createdAt?.toISOString(),
      _links: {
        self: `/api/v1/content/${content.page}`,
        update: { href: `/api/v1/content`, method: 'PUT' },
      },
    };
  }
}*/