export class ContentResponseDTO {
  constructor(content) {
    this.id = content._id?.toString();
    this.page = content.page;
    this.data = {
      navigation: content.navigation,
      hero: content.hero,
      about: content.about,
      areas: content.areas,
      partners: content.partners,
      research: content.research,
      advisory: content.advisory,
      contact: content.contact,
      cta: content.cta,
      footer: content.footer,
      privacyPolicy: content.privacyPolicy,
      termsOfUse: content.termsOfUse,
      accessibility: content.accessibility,
    };
    this.published = content.published;
    this.version = content.version;
    this.updatedBy = content.updatedBy;
    this.updatedAt = content.updatedAt?.toISOString();
  }
}