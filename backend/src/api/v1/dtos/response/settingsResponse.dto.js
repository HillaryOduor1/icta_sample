export class SettingsResponseDTO {
  constructor(settings) {
    this.id = settings._id?.toString();
    this.theme = settings.theme;
    this.typography = settings.typography;
    this.ui = settings.ui;
    this.data = settings.data;
    this.notifications = settings.notifications;
    this.accessibility = settings.accessibility;
    this.site = settings.site;
    this.lastUpdated = settings.lastUpdated?.toISOString();
    this.version = settings.version;
  }
}