export class UpdateSettingsDTO {
  constructor(body) {
    this.theme = body.theme;
    this.typography = body.typography;
    this.ui = body.ui;
    this.data = body.data;
    this.notifications = body.notifications;
    this.accessibility = body.accessibility;
    this.site = body.site;
  }

  // No strict validation; any partial update allowed
}