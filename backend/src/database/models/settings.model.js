/*const mongoose = require('mongoose');

// Theme configuration schema
const themeConfigSchema = new mongoose.Schema({
  mode: {
    type: String,
    enum: ['light', 'dark', 'system'],
    default: 'system'
  },
  primaryColor: {
    type: String,
    default: '#db2777'
  },
  secondaryColor: {
    type: String,
    default: '#ec4899'
  },
  backgroundColor: String,
  textColor: String,
  borderRadius: {
    type: String,
    enum: ['small', 'medium', 'large'],
    default: 'medium'
  },
  shadows: {
    type: Boolean,
    default: true
  },
  animations: {
    type: Boolean,
    default: true
  }
}, { _id: false });

// Typography configuration schema
const typographyConfigSchema = new mongoose.Schema({
  fontFamily: {
    type: String,
    enum: ['system', 'serif', 'monospace', 'inter'],
    default: 'system'
  },
  customFont: String,
  fontSize: {
    type: String,
    enum: ['small', 'normal', 'large', 'xlarge'],
    default: 'normal'
  },
  lineHeight: {
    type: Number,
    default: 1.5
  },
  letterSpacing: {
    type: String,
    enum: ['tight', 'normal', 'wide'],
    default: 'normal'
  },
  bodyWeight: {
    type: String,
    enum: ['normal', 'medium', 'semibold', 'bold'],
    default: 'normal'
  },
  headingWeight: {
    type: String,
    enum: ['normal', 'medium', 'semibold', 'bold', 'extrabold'],
    default: 'bold'
  },
  headingScale: {
    type: String,
    enum: ['compact', 'normal', 'relaxed'],
    default: 'normal'
  },
  textAlign: {
    type: String,
    enum: ['left', 'center', 'right', 'justify'],
    default: 'left'
  }
}, { _id: false });

// UI configuration schema
const uiConfigSchema = new mongoose.Schema({
  density: {
    type: String,
    enum: ['compact', 'comfortable', 'spacious'],
    default: 'comfortable'
  },
  buttonStyle: {
    type: String,
    enum: ['filled', 'outline', 'ghost', 'rounded', 'pill', 'square'],
    default: 'filled'
  },
  animations: {
    type: String,
    enum: ['full', 'reduced', 'none'],
    default: 'full'
  }
}, { _id: false });

// Data configuration schema
const dataConfigSchema = new mongoose.Schema({
  autoSave: {
    type: Boolean,
    default: true
  },
  saveInterval: {
    type: Number,
    default: 5
  },
  exportFormat: {
    type: String,
    enum: ['json', 'csv'],
    default: 'json'
  },
  backupEnabled: {
    type: Boolean,
    default: true
  }
}, { _id: false });

// Notification configuration schema
const notificationConfigSchema = new mongoose.Schema({
  enabled: {
    type: Boolean,
    default: true
  },
  sound: {
    type: Boolean,
    default: true
  },
  desktopNotifications: {
    type: Boolean,
    default: false
  },
  frequency: {
    type: String,
    enum: ['instant', 'daily', 'weekly'],
    default: 'instant'
  },
  emailNotifications: {
    type: Boolean,
    default: true
  },
  pushNotifications: {
    type: Boolean,
    default: false
  },
  categories: [String]
}, { _id: false });

// Accessibility configuration schema
const accessibilityConfigSchema = new mongoose.Schema({
  reducedMotion: {
    type: Boolean,
    default: false
  },
  highContrast: {
    type: Boolean,
    default: false
  },
  focusVisible: {
    type: Boolean,
    default: true
  },
  textScale: {
    type: Number,
    default: 1.0,
    min: 0.8,
    max: 2.0
  },
  dyslexiaFriendly: {
    type: Boolean,
    default: false
  },
  largerText: {
    type: Boolean,
    default: false
  },
  soundCues: {
    type: Boolean,
    default: false
  },
  focusIndicators: {
    type: Boolean,
    default: true
  },
  colorVision: {
    type: String,
    enum: ['default', 'protanopia', 'deuteranopia', 'tritanopia', 'achromatopsia'],
    default: 'default'
  }
}, { _id: false });

// Site configuration schema
const siteConfigSchema = new mongoose.Schema({
  title: {
    type: String,
    default: 'LIS - Landscape Integrity Solutions'
  },
  description: {
    type: String,
    default: 'Advancing Policy for Sustainable Landscapes'
  },
  logo: String,
  favicon: String
}, { _id: false });

// Main settings schema
const settingsSchema = new mongoose.Schema({
  version: {
    type: Number,
    default: 1
  },
  theme: themeConfigSchema,
  typography: typographyConfigSchema,
  ui: uiConfigSchema,
  data: dataConfigSchema,
  notifications: notificationConfigSchema,
  accessibility: accessibilityConfigSchema,
  site: siteConfigSchema,
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  updatedBy: String
}, {
  timestamps: true
});

// Singleton pattern - only one settings document
settingsSchema.statics.getSettings = async function() {
  const settings = await this.findOne();
  if (settings) return settings;
  return await this.create({});
};

module.exports = mongoose.model('Settings', settingsSchema);*/

/*last stable version
const mongoose = require('mongoose');

// Theme configuration schema
const themeConfigSchema = new mongoose.Schema({
  mode: {
    type: String,
    enum: ['light', 'dark', 'system'],
    default: 'light'
  },
  primaryColor: {
    type: String,
    default: '#db2777'
  },
  secondaryColor: {
    type: String,
    default: '#ec4899'
  },
  backgroundColor: {
    type: String,
    default: '#ffffff'
  },
  textColor: {
    type: String,
    default: '#0f172a'
  },
  borderRadius: {
    type: String,
    enum: ['small', 'medium', 'large'],
    default: 'medium'
  },
  shadows: {
    type: Boolean,
    default: true
  },
  animations: {
    type: Boolean,
    default: true
  }
}, { _id: false });

// Typography configuration schema
const typographyConfigSchema = new mongoose.Schema({
  fontFamily: {
    type: String,
    enum: ['system', 'serif', 'monospace', 'inter'],
    default: 'system'
  },
  customFont: {
    type: String,
    default: ''
  },
  fontSize: {
    type: String,
    enum: ['small', 'normal', 'large', 'xlarge'],
    default: 'normal'
  },
  lineHeight: {
    type: Number,
    default: 1.5,
    min: 1,
    max: 3
  },
  letterSpacing: {
    type: String,
    enum: ['tight', 'normal', 'wide'],
    default: 'normal'
  },
  bodyWeight: {
    type: String,
    enum: ['normal', 'medium', 'semibold', 'bold'],
    default: 'normal'
  },
  headingWeight: {
    type: String,
    enum: ['normal', 'medium', 'semibold', 'bold', 'extrabold'],
    default: 'bold'
  },
  headingScale: {
    type: String,
    enum: ['compact', 'normal', 'relaxed'],
    default: 'normal'
  },
  textAlign: {
    type: String,
    enum: ['left', 'center', 'right', 'justify'],
    default: 'left'
  }
}, { _id: false });

// UI configuration schema
const uiConfigSchema = new mongoose.Schema({
  density: {
    type: String,
    enum: ['compact', 'comfortable', 'spacious'],
    default: 'comfortable'
  },
  buttonStyle: {
    type: String,
    enum: ['filled', 'outline', 'ghost', 'rounded', 'pill', 'square'],
    default: 'filled'
  },
  animations: {
    type: String,
    enum: ['full', 'reduced', 'none'],
    default: 'full'
  }
}, { _id: false });

// Data configuration schema
const dataConfigSchema = new mongoose.Schema({
  autoSave: {
    type: Boolean,
    default: true
  },
  saveInterval: {
    type: Number,
    default: 5,
    min: 1,
    max: 60
  },
  exportFormat: {
    type: String,
    enum: ['json', 'csv'],
    default: 'json'
  },
  backupEnabled: {
    type: Boolean,
    default: true
  }
}, { _id: false });

// Notification configuration schema
const notificationConfigSchema = new mongoose.Schema({
  enabled: Boolean,
  sound: Boolean,
  desktopNotifications: Boolean,
  frequency: {
    type: String,
    enum: ['instant', 'daily', 'weekly'],
    default: 'instant'
  },
  emailNotifications: Boolean,
  pushNotifications: Boolean,
  categories: {
    type: [String],
    default: ['security', 'updates']
  }
}, { _id: false });

// Accessibility configuration schema
const accessibilityConfigSchema = new mongoose.Schema({
  reducedMotion: Boolean,
  highContrast: Boolean,
  focusVisible: Boolean,
  textScale: {
    type: Number,
    default: 1.0,
    min: 0.8,
    max: 2.0
  },
  dyslexiaFriendly: Boolean,
  largerText: Boolean,
  soundCues: Boolean,
  focusIndicators: Boolean,
  colorVision: {
    type: String,
    enum: ['default', 'protanopia', 'deuteranopia', 'tritanopia', 'achromatopsia'],
    default: 'default'
  }
}, { _id: false });

// Site configuration schema
const siteConfigSchema = new mongoose.Schema({
  title: {
    type: String,
    default: 'LIS - Landscape Integrity Solutions'
  },
  description: {
    type: String,
    default: 'Advancing Policy for Sustainable Landscapes'
  },
  metaKeywords: {
    type: String,
    default: 'think tank, environmental policy, sustainability, research, governance'
  },
  logo: String,
  favicon: String
}, { _id: false });

// Main schema
const settingsSchema = new mongoose.Schema({
  version: {
    type: Number,
    default: 1
  },
  theme: { type: themeConfigSchema, default: () => ({}) },
  typography: { type: typographyConfigSchema, default: () => ({}) },
  ui: { type: uiConfigSchema, default: () => ({}) },
  data: { type: dataConfigSchema, default: () => ({}) },
  notifications: { type: notificationConfigSchema, default: () => ({}) },
  accessibility: { type: accessibilityConfigSchema, default: () => ({}) },
  site: { type: siteConfigSchema, default: () => ({}) },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: String,
    default: 'system'
  }
}, { timestamps: true });

// ✅ FIXED middleware (no next)
settingsSchema.pre('save', async function() {
  const count = await this.constructor.countDocuments();

  if (count > 0 && this.isNew) {
    throw new Error('Only one settings document can exist');
  }

  this.lastUpdated = new Date();
});

// Static methods
settingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

settingsSchema.statics.updateSettings = async function(updates) {
  let settings = await this.findOne();
  if (!settings) {
    settings = new this();
  }

  Object.keys(updates).forEach(key => {
    if (key !== '_id' && key !== '__v') {
      settings[key] = updates[key];
    }
  });

  settings.lastUpdated = new Date();
  await settings.save();
  return settings;
};

//module.exports = mongoose.model('Settings', settingsSchema);
module.exports = settingsSchema;*/

/*
import mongoose from 'mongoose';

// Sub‑schemas from your original Settings.js (abbreviated here – include all)
const themeConfigSchema = new mongoose.Schema({
  mode: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
  primaryColor: { type: String, default: '#db2777' },
  secondaryColor: { type: String, default: '#ec4899' },
  backgroundColor: { type: String, default: '#ffffff' },
  textColor: { type: String, default: '#0f172a' },
  borderRadius: { type: String, enum: ['small', 'medium', 'large'], default: 'medium' },
  shadows: { type: Boolean, default: true },
  animations: { type: Boolean, default: true },
}, { _id: false });

const typographyConfigSchema = new mongoose.Schema({
  fontFamily: { type: String, default: 'system' },
  fontSize: { type: String, enum: ['small', 'normal', 'large', 'xlarge'], default: 'normal' },
  lineHeight: { type: Number, default: 1.5 },
}, { _id: false });

const uiConfigSchema = new mongoose.Schema({
  density: { type: String, enum: ['compact', 'comfortable', 'spacious'], default: 'comfortable' },
  buttonStyle: { type: String, default: 'filled' },
  animations: { type: String, enum: ['full', 'reduced', 'none'], default: 'full' },
}, { _id: false });

// ... add accessibility, notifications, site, data sub‑schemas similarly

const settingsSchema = new mongoose.Schema({
  tenantId: { type: String, required: true, unique: true, index: true },
  theme: { type: themeConfigSchema, default: () => ({}) },
  typography: { type: typographyConfigSchema, default: () => ({}) },
  ui: { type: uiConfigSchema, default: () => ({}) },
  data: { type: mongoose.Schema.Types.Mixed, default: {} },
  notifications: { type: mongoose.Schema.Types.Mixed, default: {} },
  accessibility: { type: mongoose.Schema.Types.Mixed, default: {} },
  site: { type: mongoose.Schema.Types.Mixed, default: {} },
  version: { type: Number, default: 1 },
  lastUpdated: { type: Date, default: Date.now },
  updatedBy: { type: String, default: 'system' },
}, { timestamps: true });

// FIXED: removed the faulty countDocuments pre‑save that prevented updates
settingsSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

settingsSchema.statics.getSettings = async function(tenantId) {
  let settings = await this.findOne({ tenantId });
  if (!settings) {
    settings = await this.create({ tenantId });
  }
  return settings;
};

export const SettingsModel = mongoose.model('Settings', settingsSchema);
*/
/*problematic
import mongoose from 'mongoose';

const themeConfigSchema = new mongoose.Schema({
  mode: { type: String, enum: ['light', 'dark', 'system'], default: 'light' },
  primaryColor: { type: String, default: '#db2777' },
  secondaryColor: { type: String, default: '#ec4899' },
  backgroundColor: { type: String, default: '#ffffff' },
  textColor: { type: String, default: '#0f172a' },
  borderRadius: { type: String, enum: ['small', 'medium', 'large'], default: 'medium' },
  shadows: { type: Boolean, default: true },
  animations: { type: Boolean, default: true },
}, { _id: false });

const typographyConfigSchema = new mongoose.Schema({
  fontFamily: { type: String, default: 'system' },
  customFont: { type: String, default: '' },
  fontSize: { type: String, enum: ['small', 'normal', 'large', 'xlarge'], default: 'normal' },
  lineHeight: { type: Number, default: 1.5 },
  letterSpacing: { type: String, enum: ['tight', 'normal', 'wide'], default: 'normal' },
  bodyWeight: { type: String, default: 'normal' },
  headingWeight: { type: String, default: 'bold' },
  headingScale: { type: String, enum: ['compact', 'normal', 'relaxed'], default: 'normal' },
  textAlign: { type: String, default: 'left' },
}, { _id: false });

const uiConfigSchema = new mongoose.Schema({
  density: { type: String, enum: ['compact', 'comfortable', 'spacious'], default: 'comfortable' },
  buttonStyle: { type: String, default: 'filled' },
  animations: { type: String, enum: ['full', 'reduced', 'none'], default: 'full' },
}, { _id: false });

const dataConfigSchema = new mongoose.Schema({
  autoSave: { type: Boolean, default: true },
  saveInterval: { type: Number, default: 5 },
  exportFormat: { type: String, enum: ['json', 'csv'], default: 'json' },
  backupEnabled: { type: Boolean, default: true },
}, { _id: false });

const notificationConfigSchema = new mongoose.Schema({
  enabled: { type: Boolean, default: true },
  sound: { type: Boolean, default: true },
  desktopNotifications: { type: Boolean, default: false },
  frequency: { type: String, enum: ['instant', 'daily', 'weekly'], default: 'instant' },
  emailNotifications: { type: Boolean, default: true },
  pushNotifications: { type: Boolean, default: false },
  categories: { type: [String], default: ['security', 'updates'] },
}, { _id: false });

const accessibilityConfigSchema = new mongoose.Schema({
  reducedMotion: { type: Boolean, default: false },
  highContrast: { type: Boolean, default: false },
  focusVisible: { type: Boolean, default: true },
  textScale: { type: Number, default: 1.0 },
  dyslexiaFriendly: { type: Boolean, default: false },
  largerText: { type: Boolean, default: false },
  soundCues: { type: Boolean, default: false },
  focusIndicators: { type: Boolean, default: true },
  colorVision: { type: String, default: 'default' },
}, { _id: false });

const siteConfigSchema = new mongoose.Schema({
  title: { type: String, default: 'LIS - Landscape Integrity Solutions' },
  description: { type: String, default: 'Advancing Policy for Sustainable Landscapes' },
  metaKeywords: { type: String, default: '' },
  logo: { type: String, default: '' },
  favicon: { type: String, default: '' },
}, { _id: false });

const settingsSchema = new mongoose.Schema({
  tenantId: { type: String, required: true, unique: true, index: true },
  version: { type: Number, default: 1 },
  theme: { type: themeConfigSchema, default: () => ({}) },
  typography: { type: typographyConfigSchema, default: () => ({}) },
  ui: { type: uiConfigSchema, default: () => ({}) },
  data: { type: dataConfigSchema, default: () => ({}) },
  notifications: { type: notificationConfigSchema, default: () => ({}) },
  accessibility: { type: accessibilityConfigSchema, default: () => ({}) },
  site: { type: siteConfigSchema, default: () => ({}) },
  lastUpdated: { type: Date, default: Date.now },
  updatedBy: { type: String, default: 'system' },
}, { timestamps: true });

// ✅ CORRECTED pre-save middleware
/*settingsSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});/
settingsSchema.pre('save', async function () {
  this.updatedAt = new Date();
});

settingsSchema.statics.getSettings = async function(tenantId) {
  let settings = await this.findOne({ tenantId });
  if (!settings) {
    settings = await this.create({ tenantId });
  }
  return settings;
};

export const SettingsModel = mongoose.model('Settings', settingsSchema);*/
import mongoose from 'mongoose';

const themeConfigSchema = new mongoose.Schema({
  mode: { type: String, enum: ['light', 'dark', 'system'], default: 'light' },
  primaryColor: { type: String, default: '#db2777' },
  secondaryColor: { type: String, default: '#ec4899' },
  backgroundColor: { type: String, default: '#ffffff' },
  textColor: { type: String, default: '#0f172a' },
  borderRadius: { type: String, enum: ['small', 'medium', 'large'], default: 'medium' },
  shadows: { type: Boolean, default: true },
  animations: { type: Boolean, default: true },
}, { _id: false });

const typographyConfigSchema = new mongoose.Schema({
  fontFamily: { type: String, default: 'system' },
  customFont: { type: String, default: '' },
  fontSize: { type: String, enum: ['small', 'normal', 'large', 'xlarge'], default: 'normal' },
  lineHeight: { type: Number, default: 1.5 },
  letterSpacing: { type: String, enum: ['tight', 'normal', 'wide'], default: 'normal' },
  bodyWeight: { type: String, default: 'normal' },
  headingWeight: { type: String, default: 'bold' },
  headingScale: { type: String, enum: ['compact', 'normal', 'relaxed'], default: 'normal' },
  textAlign: { type: String, default: 'left' },
}, { _id: false });

const uiConfigSchema = new mongoose.Schema({
  density: { type: String, enum: ['compact', 'comfortable', 'spacious'], default: 'comfortable' },
  buttonStyle: { type: String, default: 'filled' },
  animations: { type: String, enum: ['full', 'reduced', 'none'], default: 'full' },
}, { _id: false });

const dataConfigSchema = new mongoose.Schema({
  autoSave: { type: Boolean, default: true },
  saveInterval: { type: Number, default: 5 },
  exportFormat: { type: String, enum: ['json', 'csv'], default: 'json' },
  backupEnabled: { type: Boolean, default: true },
}, { _id: false });

const notificationConfigSchema = new mongoose.Schema({
  enabled: { type: Boolean, default: true },
  sound: { type: Boolean, default: true },
  desktopNotifications: { type: Boolean, default: false },
  frequency: { type: String, enum: ['instant', 'daily', 'weekly'], default: 'instant' },
  emailNotifications: { type: Boolean, default: true },
  pushNotifications: { type: Boolean, default: false },
  categories: { type: [String], default: ['security', 'updates'] },
}, { _id: false });

const accessibilityConfigSchema = new mongoose.Schema({
  reducedMotion: { type: Boolean, default: false },
  highContrast: { type: Boolean, default: false },
  focusVisible: { type: Boolean, default: true },
  textScale: { type: Number, default: 1.0 },
  dyslexiaFriendly: { type: Boolean, default: false },
  largerText: { type: Boolean, default: false },
  soundCues: { type: Boolean, default: false },
  focusIndicators: { type: Boolean, default: true },
  colorVision: { type: String, default: 'default' },
}, { _id: false });

const siteConfigSchema = new mongoose.Schema({
  title: { type: String, default: 'LIS - Landscape Integrity Solutions' },
  description: { type: String, default: 'Advancing Policy for Sustainable Landscapes' },
  metaKeywords: { type: String, default: '' },
  logo: { type: String, default: '' },
  favicon: { type: String, default: '' },
}, { _id: false });

const settingsSchema = new mongoose.Schema({
  tenantId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },

  version: {
    type: Number,
    default: 1
  },

  theme: {
    type: themeConfigSchema,
    default: () => ({})
  },

  typography: {
    type: typographyConfigSchema,
    default: () => ({})
  },

  ui: {
    type: uiConfigSchema,
    default: () => ({})
  },

  data: {
    type: dataConfigSchema,
    default: () => ({})
  },

  notifications: {
    type: notificationConfigSchema,
    default: () => ({})
  },

  accessibility: {
    type: accessibilityConfigSchema,
    default: () => ({})
  },

  site: {
    type: siteConfigSchema,
    default: () => ({})
  },

  lastUpdated: {
    type: Date,
    default: Date.now
  },

  updatedBy: {
    type: String,
    default: 'system'
  }

}, {
  timestamps: true
});

settingsSchema.pre('save', function () {
  this.lastUpdated = new Date();
});

settingsSchema.statics.getSettings = async function (tenantId) {
  let settings = await this.findOne({ tenantId });

  if (!settings) {
    settings = await this.create({ tenantId });
  }

  return settings;
};

/**
 * IMPORTANT:
 * Multi-tenant safe model factory
 */
export const getSettingsModel = (connection) => {
  if (!connection) {
    throw new Error('Database connection is required');
  }

  return connection.models.Settings ||
    connection.model('Settings', settingsSchema);
};