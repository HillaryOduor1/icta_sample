import { SettingsRepository } from '../repositories/settings.repository.js';

export class SettingsService {
  constructor(settingsModel) {
    if (!settingsModel) {
      throw new Error('SettingsModel is required');
    }
    this.repository = new SettingsRepository(settingsModel);
  }

  async getSettings(tenantId) {
    return this.repository.getSettings(tenantId);
  }

  async updateSettings(tenantId, updates, updatedBy) {
    return this.repository.updateSettings(tenantId, updates, updatedBy);
  }

  async resetSettings(tenantId) {
    // Reset to default values (empty objects trigger schema defaults)
    const defaultSettings = {
      theme: {},
      typography: {},
      ui: {},
      data: {},
      notifications: {},
      accessibility: {},
      site: {},
    };
    return this.repository.updateSettings(tenantId, defaultSettings, 'system');
  }
}
