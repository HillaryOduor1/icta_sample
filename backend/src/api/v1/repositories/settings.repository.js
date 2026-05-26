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
/*import { getSettingsModel } from '../../../database/models/settings.model.js';

export class SettingsRepository {

  constructor(connection) {
    if (!connection) {
      throw new Error('Tenant database connection is required');
    }

    this.connection = connection;
    this.model = getSettingsModel(connection);
  }

  async getSettings(tenantId) {
    try {

      let settings = await this.model
        .findOne({ tenantId })
        .lean();

      if (!settings) {

        const created = await this.model.create({
          tenantId
        });

        settings = created.toObject();
      }

      return settings;

    } catch (err) {

      console.error(
        'Error fetching settings:',
        err.message
      );

      throw err;
    }
  }

  async updateSettings(
    tenantId,
    updates,
    updatedBy
  ) {

    const settings = await this.model
      .findOneAndUpdate(
        { tenantId },

        {
          ...updates,
          updatedBy,
          lastUpdated: new Date()
        },

        {
          upsert: true,
          new: true,
          runValidators: true
        }
      )
      .lean();

    return settings;
  }
}*/
/*import { SettingsModel } from '../../../database/models/settings.model.js';
import { BaseRepository } from './base.repository.js';

export class SettingsRepository extends BaseRepository {
  constructor() {
    super(SettingsModel);
  }

  /*async getSettings(tenantId) {
    let settings = await this.model.findOne({ tenantId }).lean();
    if (!settings) {
      // Create default settings for tenant
      settings = await this.model.create({ tenantId });
    }
    return settings;
  }/
   async getSettings(tenantId) {
  try {
    let settings = await this.model.findOne({ tenantId }).lean();
    if (!settings) {
      settings = await this.model.create({ tenantId });
    }
    return settings;
  } catch (err) {
    console.error('Error fetching settings, attempting direct creation:', err.message);
    const settings = await this.model.create({ tenantId });
    return settings;
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
}*/