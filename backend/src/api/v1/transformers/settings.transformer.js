export class SettingsTransformer {
  static toResponse(settings) {
    // Define complete defaults
    const DEFAULT_THEME = {
      mode: 'light',
      primaryColor: '#db2777',
      secondaryColor: '#ec4899',
      backgroundColor: '#ffffff',
      textColor: '#0f172a',
      borderRadius: 'medium',
      shadows: true,
      animations: true,
    };
    const DEFAULT_TYPOGRAPHY = {
      fontFamily: 'system',
      customFont: '',
      fontSize: 'normal',
      lineHeight: 1.5,
      letterSpacing: 'normal',
      bodyWeight: 'normal',
      headingWeight: 'bold',
      headingScale: 'normal',
      textAlign: 'left',
    };
    const DEFAULT_UI = {
      density: 'comfortable',
      buttonStyle: 'filled',
      animations: 'full',
    };
    const DEFAULT_DATA = {
      autoSave: true,
      saveInterval: 5,
      exportFormat: 'json',
      backupEnabled: true,
    };
    const DEFAULT_NOTIFICATIONS = {
      enabled: true,
      sound: true,
      desktopNotifications: false,
      frequency: 'instant',
      emailNotifications: true,
      pushNotifications: false,
      categories: ['security', 'updates'],
    };
    const DEFAULT_ACCESSIBILITY = {
      reducedMotion: false,
      highContrast: false,
      focusVisible: true,
      textScale: 1.0,
      dyslexiaFriendly: false,
      largerText: false,
      soundCues: false,
      focusIndicators: true,
      colorVision: 'default',
    };
    const DEFAULT_SITE = {
      title: 'LIS - Landscape Integrity Solutions',
      description: 'Advancing Policy for Sustainable Landscapes',
      metaKeywords: '',
      logo: '',
      favicon: '',
    };

    // If settings is null/undefined, create an empty object
    const s = settings || {};
    
    return {
      id: s._id?.toString(),
      theme: { ...DEFAULT_THEME, ...(s.theme || {}) },
      typography: { ...DEFAULT_TYPOGRAPHY, ...(s.typography || {}) },
      ui: { ...DEFAULT_UI, ...(s.ui || {}) },
      data: { ...DEFAULT_DATA, ...(s.data || {}) },
      notifications: { ...DEFAULT_NOTIFICATIONS, ...(s.notifications || {}) },
      accessibility: { ...DEFAULT_ACCESSIBILITY, ...(s.accessibility || {}) },
      site: { ...DEFAULT_SITE, ...(s.site || {}) },
      version: s.version || 1,
      lastUpdated: s.lastUpdated?.toISOString(),
      updatedBy: s.updatedBy || 'system',
      _links: {
        self: '/api/v1/settings',
        update: { href: '/api/v1/settings', method: 'PUT' },
      },
    };
  }
}
/*export class SettingsTransformer {
  static toResponse(settings) {
    if (!settings) return null;

    // Default empty objects for missing sections
    const defaults = {
      theme: {
        mode: 'light',
        primaryColor: '#db2777',
        secondaryColor: '#ec4899',
        backgroundColor: '#ffffff',
        textColor: '#0f172a',
        borderRadius: 'medium',
        shadows: true,
        animations: true,
      },
      typography: {
        fontFamily: 'system',
        customFont: '',
        fontSize: 'normal',
        lineHeight: 1.5,
        letterSpacing: 'normal',
        bodyWeight: 'normal',
        headingWeight: 'bold',
        headingScale: 'normal',
        textAlign: 'left',
      },
      ui: {
        density: 'comfortable',
        buttonStyle: 'filled',
        animations: 'full',
      },
      data: {
        autoSave: true,
        saveInterval: 5,
        exportFormat: 'json',
        backupEnabled: true,
      },
      notifications: {
        enabled: true,
        sound: true,
        desktopNotifications: false,
        frequency: 'instant',
        emailNotifications: true,
        pushNotifications: false,
        categories: ['security', 'updates'],
      },
      accessibility: {
        reducedMotion: false,
        highContrast: false,
        focusVisible: true,
        textScale: 1.0,
        dyslexiaFriendly: false,
        largerText: false,
        soundCues: false,
        focusIndicators: true,
        colorVision: 'default',
      },
      site: {
        title: 'LIS - Landscape Integrity Solutions',
        description: 'Advancing Policy for Sustainable Landscapes',
        metaKeywords: '',
        logo: '',
        favicon: '',
      },
    };

    return {
      id: settings._id?.toString(),
      theme: { ...defaults.theme, ...(settings.theme || {}) },
      typography: { ...defaults.typography, ...(settings.typography || {}) },
      ui: { ...defaults.ui, ...(settings.ui || {}) },
      data: { ...defaults.data, ...(settings.data || {}) },
      notifications: { ...defaults.notifications, ...(settings.notifications || {}) },
      accessibility: { ...defaults.accessibility, ...(settings.accessibility || {}) },
      site: { ...defaults.site, ...(settings.site || {}) },
      version: settings.version || 1,
      lastUpdated: settings.lastUpdated?.toISOString(),
      updatedBy: settings.updatedBy || 'system',
      _links: {
        self: '/api/v1/settings',
        update: { href: '/api/v1/settings', method: 'PUT' },
      },
    };
  }
}*/
/*export class SettingsTransformer {
  static toResponse(settings) {
    if (!settings) return null;
    return {
      id: settings._id?.toString(),
      theme: settings.theme,
      typography: settings.typography,
      ui: settings.ui,
      data: settings.data,
      notifications: settings.notifications,
      accessibility: settings.accessibility,
      site: settings.site,
      version: settings.version,
      lastUpdated: settings.lastUpdated?.toISOString(),
      updatedBy: settings.updatedBy,
      _links: {
        self: `/api/v1/settings`,
        update: { href: `/api/v1/settings`, method: 'PUT' },
      },
    };
  }
}*/