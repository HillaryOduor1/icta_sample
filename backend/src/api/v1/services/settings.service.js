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
/*import { SettingsRepository } from '../repositories/settings.repository.js';
import { ActivityRepository } from '../repositories/activity.repository.js';
import { UpdateSettingsDTO } from '../dtos/request/updateSettings.dto.js';
import { AppError } from '../../../shared/errors/AppError.js';

const settingsRepo = new SettingsRepository();
const activityRepo = new ActivityRepository();

export class SettingsService {
  async getSettings(tenantId) {
    return settingsRepo.getSettings(tenantId);
  }

  async updateSettings(tenantId, updates, userId) {
    const dto = new UpdateSettingsDTO(updates);
    const updated = await settingsRepo.updateSettings(tenantId, dto, userId);
    await activityRepo.log(tenantId, 'settings_save', `Updated site settings`, userId, 'system');
    return updated;
  }

  async resetSettings(tenantId) {
    const defaultSettings = {
      theme: { mode: 'system', primaryColor: '#db2777', secondaryColor: '#ec4899' },
      typography: { fontFamily: 'system', fontSize: 'normal' },
      // ... other defaults as needed
    };
    const reset = await settingsRepo.updateSettings(tenantId, defaultSettings, 'system');
    return reset;
  }
}*/