import { SettingsService } from '../services/settings.service.js';
import { SettingsTransformer } from '../transformers/settings.transformer.js';
import { asyncHandler } from '../../../shared/utils/asyncHandler.js';
import { successResponse } from '../../../shared/utils/response.util.js';

export const getSettings = asyncHandler(async (req, res) => {
  const settingsService = new SettingsService(req.models.Settings);
  const settings = await settingsService.getSettings(req.tenantId);
  return successResponse(res, 200, 'Settings retrieved', SettingsTransformer.toResponse(settings));
});

export const updateSettings = asyncHandler(async (req, res) => {
  const settingsService = new SettingsService(req.models.Settings);
  const updated = await settingsService.updateSettings(req.tenantId, req.body, req.user.sub);
  return successResponse(res, 200, 'Settings updated', SettingsTransformer.toResponse(updated));
});

export const resetSettings = asyncHandler(async (req, res) => {
  const settingsService = new SettingsService(req.models.Settings);
  const reset = await settingsService.resetSettings(req.tenantId);
  return successResponse(res, 200, 'Settings reset to default', SettingsTransformer.toResponse(reset));
});
/*import { SettingsService } from '../services/settings.service.js';
import { SettingsTransformer } from '../transformers/settings.transformer.js';
import { asyncHandler } from '../../../shared/utils/asyncHandler.js';
import { successResponse } from '../../../shared/utils/response.util.js';

const settingsService = new SettingsService();

export const getSettings = asyncHandler(async (req, res) => {
  const settings = await settingsService.getSettings(req.tenantId);
  return successResponse(res, 200, 'Settings retrieved', SettingsTransformer.toResponse(settings));
});

export const updateSettings = asyncHandler(async (req, res) => {
  const updated = await settingsService.updateSettings(req.tenantId, req.body, req.user.sub);
  return successResponse(res, 200, 'Settings updated', SettingsTransformer.toResponse(updated));
});

export const resetSettings = asyncHandler(async (req, res) => {
  const reset = await settingsService.resetSettings(req.tenantId);
  return successResponse(res, 200, 'Settings reset to default', SettingsTransformer.toResponse(reset));
});*/
/*last stable version
// controllers/settingsController.js

exports.getAllSettings = async (req, res) => {
  console.log('⚙️ [Settings] GET');

  try {
    const Settings = req.models.Settings;
    const settings = await Settings.findOne();
    res.json(settings || {});
  } catch (error) {
    console.error('❌ Settings error:', error.stack);
    res.status(500).json({ error: error.message });
  }
};

// controllers/settingsController.js

exports.updateSettings = async (req, res) => {
  console.log('⚙️ [Settings] UPDATE');
  console.log('📦 Received body:', JSON.stringify(req.body, null, 2));

  try {
    const Settings = req.models.Settings;
    let settings = await Settings.findOne();

    if (!settings) {
      // Create new settings document if none exists
      settings = new Settings();
    }

    // Deep merge to ensure nested objects (like theme) are properly updated
    const deepMerge = (target, source) => {
      for (const key in source) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
          if (!target[key]) target[key] = {};
          deepMerge(target[key], source[key]);
        } else {
          target[key] = source[key];
        }
      }
      return target;
    };

    deepMerge(settings, req.body);
    settings.lastUpdated = new Date();

    console.log('🔄 After merge, theme.mode:', settings.theme?.mode);

    await settings.save();
    console.log('✅ Settings saved to DB');

    res.json(settings);
  } catch (error) {
    console.error('❌ Settings update error:', error.stack);
    res.status(500).json({ error: error.message });
  }
};
/*
exports.updateSettings = async (req, res) => {
  console.log('⚙️ [Settings] UPDATE');

  try {
    const Settings = req.models.Settings;
    let settings = await Settings.findOne();

    if (settings) {
      Object.assign(settings, req.body);
      await settings.save();
    } else {
      settings = await Settings.create(req.body);
    }

    res.json(settings);
  } catch (error) {
    console.error('❌ Settings update error:', error.stack);
    res.status(500).json({ error: error.message });
  }
};/

exports.resetSettings = async (req, res) => {
  console.log('⚙️ [Settings] RESET');

  try {
    const Settings = req.models.Settings;

    // Define your default settings structure – adjust to match your schema
    const defaultSettings = {
      siteName: 'My Website',
      siteDescription: 'A powerful CMS',
      contactEmail: 'admin@example.com',
      contactPhone: '+1234567890',
      address: '123 Main St, City, Country',
      socialMedia: {
        facebook: '',
        twitter: '',
        instagram: ''
      },
      features: {
        commentsEnabled: true,
        registrationEnabled: true
      },
      theme: {
        primaryColor: '#3b82f6',
        secondaryColor: '#10b981'
      }
      // Add any other fields your Settings model has
    };

    let settings = await Settings.findOne();
    if (settings) {
      // Reset existing settings to default
      Object.assign(settings, defaultSettings);
      await settings.save();
    } else {
      // Create new settings if none exist
      settings = await Settings.create(defaultSettings);
    }

    res.json(settings);
  } catch (error) {
    console.error('❌ Settings reset error:', error.stack);
    res.status(500).json({ error: error.message });
  }
};*/

/*exports.getAllSettings = async (req, res) => {
  console.log('⚙️ [Settings] GET');

  try {
    const Settings = req.models.Settings;

    const settings = await Settings.findOne();

    res.json(settings || {});

  } catch (error) {
    console.error('❌ Settings error:', error.stack);
    res.status(500).json({ error: error.message });
  }
};

exports.updateSettings = async (req, res) => {
  console.log('⚙️ [Settings] UPDATE');

  try {
    const Settings = req.models.Settings;

    let settings = await Settings.findOne();

    if (settings) {
      Object.assign(settings, req.body);
      await settings.save();
    } else {
      settings = await Settings.create(req.body);
    }

    res.json(settings);

  } catch (error) {
    console.error('❌ Settings update error:', error.stack);
    res.status(500).json({ error: error.message });
  }
};*/


/*const Settings = require('../models/Settings');
const ActivityLog = require('../models/ActivityLog');

// Get all settings
exports.getAllSettings = async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update settings
exports.updateSettings = async (req, res) => {
  try {
    const updates = req.body;
    updates.lastUpdated = new Date();
    updates.updatedBy = req.user?.username || 'system';

    let settings = await Settings.findOne();
    
    if (settings) {
      // Update existing settings
      Object.assign(settings, updates);
      await settings.save();
    } else {
      // Create new settings
      settings = await Settings.create(updates);
    }

    // Log activity
    await ActivityLog.create({
      action: 'settings_save',
      label: 'Settings updated',
      detail: 'Site settings were updated',
      user: req.user?.username || 'system',
      userId: req.user?.id
    });
    
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Reset settings to defaults
exports.resetSettings = async (req, res) => {
  try {
    await Settings.deleteMany({});
    const defaultSettings = await Settings.create({});

    await ActivityLog.create({
      action: 'settings_save',
      label: 'Settings reset',
      detail: 'Settings reset to defaults',
      user: req.user?.username || 'system',
      userId: req.user?.id
    });
    
    res.json(defaultSettings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};*/