
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