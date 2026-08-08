import { getSettingsModel } from '../../../database/models/settings.model.js';

export class SettingsRepository {
  constructor(settingsModel) {
    if (!settingsModel) {
      throw new Error('Settings model is required');
    }
    this.model = settingsModel;
  }

  async getSettings(tenantId) {
    try {
      let settings = await this.model.findOne({ tenantId }).lean();
      if (!settings) {
        const created = await this.model.create({ tenantId });
        settings = created.toObject();
      }
      return settings;
    } catch (err) {
      console.error('Error fetching settings:', err.message);
      throw err;
    }
  }

  async updateSettings(tenantId, updates, updatedBy) {
    const settings = await this.model.findOneAndUpdate(
      { tenantId },
      { ...updates, updatedBy, lastUpdated: new Date() },
      { upsert: true, new: true, runValidators: true }
    ).lean();
    return settings;
  }
}
