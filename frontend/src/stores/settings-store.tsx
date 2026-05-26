
import * as React from "react";

// ================= TYPES =================
export type ThemeMode = "light" | "dark" | "system";
export type FontSize = "small" | "normal" | "large" | "xlarge";
export type ButtonStyle = "rounded" | "pill" | "square" | "filled" | "outline" | "ghost" | "link";
export type UIDensity = "compact" | "comfortable" | "spacious";
export type AnimationLevel = "full" | "reduced" | "none";
export type FontFamily = "system" | "serif" | "monospace" | "custom";

export interface ThemeConfig {
  mode: ThemeMode;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  borderRadius: "small" | "medium" | "large";
  shadows: boolean;
  animations?: boolean; // Add this for AppearanceTab
}

export interface TypographyConfig {
  fontFamily: FontFamily;
  customFont?: string;
  fontSize: FontSize;
  lineHeight: number;
  letterSpacing: "tight" | "normal" | "wide";
  bodyWeight: "normal" | "medium" | "semibold" | "bold";
  headingWeight: "normal" | "medium" | "semibold" | "bold" | "extrabold";
  headingScale: "compact" | "normal" | "relaxed";
  textAlign: "left" | "center" | "right" | "justify";
}

export interface UIConfig {
  density: UIDensity;
  buttonStyle: ButtonStyle;
  animations: AnimationLevel;
}

export interface DataConfig {
  autoSave: boolean;
  saveInterval: number; // minutes
  exportFormat: "json" | "csv";
  backupEnabled: boolean;
}

export interface NotificationConfig {
  enabled: boolean;
  sound: boolean;
  desktopNotifications: boolean;
  frequency: "instant" | "daily" | "weekly";
  emailNotifications: boolean;
  pushNotifications: boolean;
  categories: string[];
}

export interface AccessibilityConfig {
  reducedMotion: boolean;
  highContrast: boolean;
  focusVisible: boolean;
  textScale: number; // 0.8 - 2.0
  dyslexiaFriendly: boolean;
  // Add missing properties for AccessibilityTab
  largerText?: boolean;
  soundCues?: boolean;
  focusIndicators?: boolean;
  fontSize?: FontSize;
  colorVision?: "default" | "protanopia" | "deuteranopia" | "tritanopia" | "achromatopsia";
}

export interface AppSettings {
  version: number;
  theme: ThemeConfig;
  typography: TypographyConfig;
  ui: UIConfig;
  data: DataConfig;
  notifications: NotificationConfig;
  accessibility: AccessibilityConfig;
  lastUpdated: string;
}

// ================= DEFAULTS =================
const DEFAULT_SETTINGS: AppSettings = {
  version: 1,
  theme: {
    mode: "system",
    primaryColor: "#db2777",
    secondaryColor: "#ec4899",
    backgroundColor: "#ffffff",
    textColor: "#0f172a",
    borderRadius: "medium",
    shadows: true,
    animations: true, // Add default
  },
  typography: {
    fontFamily: "system",
    fontSize: "normal",
    lineHeight: 1.5,
    letterSpacing: "normal",
    bodyWeight: "normal", // Add default
    headingWeight: "bold", // Add default
    headingScale: "normal", // Add default
    textAlign: "left", // Add default
  },
  ui: {
    density: "comfortable",
    buttonStyle: "filled",
    animations: "full"
  },
  data: {
    autoSave: true,
    saveInterval: 5,
    exportFormat: "json",
    backupEnabled: true
  },
  notifications: {
    enabled: true,
    sound: true,
    desktopNotifications: false,
    frequency: "instant",
    emailNotifications: true,
    pushNotifications: false,
    categories: ["security", "updates"],
  },
  accessibility: {
    reducedMotion: false,
    highContrast: false,
    focusVisible: true,
    textScale: 1.0,
    dyslexiaFriendly: false,
    // Add defaults for new properties
    largerText: false,
    soundCues: false,
    focusIndicators: true,
    fontSize: "normal",
    colorVision: "default",
  },
  lastUpdated: new Date().toISOString()
};

// ================= STORAGE MANAGER =================
//const API_URL = 'http://localhost:5000/api/settings';
//const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const getApiUrl = () => {
  if (import.meta.env.PROD) {
    const baseUrl = import.meta.env.VITE_API_URL;
    return `${baseUrl}/api/v1/settings`;
  }
  return '/api/settings';
};

const API_URL = getApiUrl();

class StorageManager {
  private memoryCache: AppSettings | null = null;

  // ES5 compatible localStorage with fallback
  private getLocalStorage(): Storage | null {
    try {
      if (typeof window === "undefined") return null;
      if (!window.localStorage) return null;
      return localStorage;
    } catch (e) {
      return null;
    }
  }

  // Save settings with backend-first strategy
  async save(settings: AppSettings): Promise<boolean> {
    try {
      this.memoryCache = {
        ...settings,
        lastUpdated: new Date().toISOString()
      };

      // 1. Try to save to Backend
      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.memoryCache),
        });
        if (!response.ok) throw new Error('Backend save failed');
      } catch (e) {
        console.warn("Backend save failed, falling back to localStorage", e);
      }

      // 2. Fallback/Sync with localStorage
      const ls = this.getLocalStorage();
      if (ls) {
        ls.setItem("app-settings", JSON.stringify(this.memoryCache));
      }

      return true;
    } catch (error) {
      console.error("Failed to save settings:", error);
      return false;
    }
  }

  // Load settings with backend-first strategy
  async load(): Promise<AppSettings> {
    if (this.memoryCache) return this.memoryCache;

    try {
      // 1. Try to load from Backend
      try {
        const response = await fetch(API_URL);
        if (response.ok) {
          const loadedSettings = await response.json();
          if (this.validateSettings(loadedSettings)) {
            const migrated = this.migrateSettings(loadedSettings);
            this.memoryCache = migrated;
            return migrated;
          }
        }
      } catch (e) {
        console.warn("Backend load failed, falling back to local storage", e);
      }

      // 2. Fallback to localStorage
      const ls = this.getLocalStorage();
      if (ls) {
        const saved = ls.getItem("app-settings");
        if (saved) {
          const loadedSettings = JSON.parse(saved);
          if (this.validateSettings(loadedSettings)) {
            const migrated = this.migrateSettings(loadedSettings);
            this.memoryCache = migrated;
            return migrated;
          }
        }
      }

      // 3. Return defaults
      this.memoryCache = DEFAULT_SETTINGS;
      return DEFAULT_SETTINGS;
    } catch (error) {
      console.error("Failed to load settings:", error);
      return DEFAULT_SETTINGS;
    }
  }

  // ES5 compatible validation
  private validateSettings(settings: any): settings is AppSettings {
    return (
      settings &&
      typeof settings === "object" &&
      typeof settings.version === "number" &&
      settings.theme &&
      settings.typography &&
      settings.ui &&
      settings.data &&
      settings.notifications &&
      settings.accessibility
    );
  }

  // Migration system for future updates
  private migrateSettings(settings: any): AppSettings {
    const currentVersion = 1;

    if (!settings.version || settings.version < currentVersion) {
      // Migrate from version 0 to 1
      const migrated = {
        ...DEFAULT_SETTINGS,
        ...settings,
        version: currentVersion,
        lastUpdated: new Date().toISOString()
      };

      // Ensure all new properties exist
      return {
        ...migrated,
        theme: {
          ...DEFAULT_SETTINGS.theme,
          ...migrated.theme,
          animations: migrated.theme.animations ?? DEFAULT_SETTINGS.theme.animations
        },
        typography: {
          ...DEFAULT_SETTINGS.typography,
          ...migrated.typography,
          bodyWeight: migrated.typography.bodyWeight ?? DEFAULT_SETTINGS.typography.bodyWeight,
          headingWeight: migrated.typography.headingWeight ?? DEFAULT_SETTINGS.typography.headingWeight,
          headingScale: migrated.typography.headingScale ?? DEFAULT_SETTINGS.typography.headingScale,
          textAlign: migrated.typography.textAlign ?? DEFAULT_SETTINGS.typography.textAlign
        },
        notifications: {
          ...DEFAULT_SETTINGS.notifications,
          ...migrated.notifications,
          emailNotifications: migrated.notifications.emailNotifications ?? DEFAULT_SETTINGS.notifications.emailNotifications,
          pushNotifications: migrated.notifications.pushNotifications ?? DEFAULT_SETTINGS.notifications.pushNotifications
        },
        accessibility: {
          ...DEFAULT_SETTINGS.accessibility,
          ...migrated.accessibility,
          largerText: migrated.accessibility.largerText ?? DEFAULT_SETTINGS.accessibility.largerText,
          soundCues: migrated.accessibility.soundCues ?? DEFAULT_SETTINGS.accessibility.soundCues,
          focusIndicators: migrated.accessibility.focusIndicators ?? DEFAULT_SETTINGS.accessibility.focusIndicators,
          fontSize: migrated.accessibility.fontSize ?? DEFAULT_SETTINGS.accessibility.fontSize,
          colorVision: migrated.accessibility.colorVision ?? DEFAULT_SETTINGS.accessibility.colorVision
        }
      };
    }

    return settings;
  }

  // Export settings
  export(settings: AppSettings): string {
    const exportData = {
      ...settings,
      exportDate: new Date().toISOString(),
      app: "Sample2 App",
      formatVersion: "1.0"
    };
    return JSON.stringify(exportData, null, 2);
  }

  // Import settings with validation
  import(jsonString: string): { success: boolean; settings?: AppSettings; error?: string } {
    try {
      const imported = JSON.parse(jsonString);

      // Basic validation
      if (!imported.theme || !imported.typography) {
        return { success: false, error: "Invalid settings format" };
      }

      // Merge with defaults and migrate
      const settings: AppSettings = this.migrateSettings({
        ...DEFAULT_SETTINGS,
        ...imported,
        version: imported.version || 1,
        lastUpdated: new Date().toISOString()
      });

      this.memoryCache = settings;
      return { success: true, settings };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Invalid JSON"
      };
    }
  }

  // Reset to defaults
  reset(): AppSettings {
    this.memoryCache = DEFAULT_SETTINGS;
    return DEFAULT_SETTINGS;
  }
}

// ================= REACT CONTEXT =================
interface SettingsContextValue {
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => Promise<void>;
  updateSetting: <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) => Promise<void>;
  resetToDefaults: () => Promise<void>;
  exportSettings: () => string;
  importSettings: (jsonString: string) => Promise<{ success: boolean; error?: string }>;
  isSaving: boolean;
  previewSettings: AppSettings | null;
  setPreviewSettings: (settings: AppSettings | null) => void;
  applyPreview: () => Promise<void>;
  discardPreview: () => void;
}

const SettingsContext = React.createContext<SettingsContextValue | undefined>(undefined);

// ================= PROVIDER COMPONENT =================
export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = React.useState<AppSettings>(DEFAULT_SETTINGS);
  const [isSaving, setIsSaving] = React.useState(false);
  const [previewSettings, setPreviewSettings] = React.useState<AppSettings | null>(null);

  const storageManager = React.useRef(new StorageManager());

  // Load settings on mount
  React.useEffect(() => {
    const loadSettings = async () => {
      const loaded = await storageManager.current.load();
      setSettings(loaded);
      applySettingsToDOM(loaded);
    };

    loadSettings();

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "app-settings" && event.newValue) {
        try {
          const newSettings = JSON.parse(event.newValue);
          setSettings(newSettings);
          applySettingsToDOM(newSettings);
        } catch (e) {
          console.error("Failed to parse settings from storage event:", e);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Reactive effect for applying settings (handles preview and updates)
  React.useEffect(() => {
    applySettingsToDOM(previewSettings || settings);
  }, [settings, previewSettings]);

  // Listen for system theme changes
  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const currentSettings = previewSettings || settings;
      if (currentSettings.theme.mode === "system") {
        applySettingsToDOM(currentSettings);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [settings, previewSettings]);

  // Apply settings to DOM (CSS variables, classes, etc.)
  const applySettingsToDOM = (appSettings: AppSettings) => {
    const root = document.documentElement;

    // 1. Theme Mode (Light/Dark/System)
    let isDark = appSettings.theme.mode === "dark";
    if (appSettings.theme.mode === "system") {
      isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    }

    if (isDark) {
      root.classList.add("dark");
      root.classList.remove("light");
      root.style.colorScheme = "dark";
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
      root.style.colorScheme = "light";
    }

    // 2. Theme Colors
    root.style.setProperty("--primary-color", appSettings.theme.primaryColor);
    root.style.setProperty("--secondary-color", appSettings.theme.secondaryColor);
    root.style.setProperty("--pink-600", appSettings.theme.primaryColor);
    root.style.setProperty("--accent", appSettings.theme.primaryColor);
    root.style.setProperty("--pink-500", appSettings.theme.secondaryColor);

    if (appSettings.theme.backgroundColor) {
      root.style.setProperty(isDark ? "--dark-bg" : "--light-bg", appSettings.theme.backgroundColor);
    }
    if (appSettings.theme.textColor) {
      root.style.setProperty(isDark ? "--dark-text" : "--light-text", appSettings.theme.textColor);
    }

    // 3. Border radius
    const borderRadius = ({
      small: "0.25rem",
      medium: "0.5rem",
      large: "1rem"
    } as const)[appSettings.theme.borderRadius];
    root.style.setProperty("--border-radius", borderRadius);

    // 4. Typography
    root.style.setProperty("--font-family", getFontFamily(appSettings.typography));
    root.style.setProperty("--font-size", getFontSize(appSettings.typography.fontSize));
    root.style.setProperty("--line-height", appSettings.typography.lineHeight.toString());

    // 5. Letter spacing
    const letterSpacing = ({
      tight: "-0.025em",
      normal: "0",
      wide: "0.025em"
    } as const)[appSettings.typography.letterSpacing];
    root.style.setProperty("--letter-spacing", letterSpacing);

    // 6. Spacing based on density
    const spacing = getSpacing(appSettings.ui.density);
    root.style.setProperty("--spacing-unit", spacing);

    // 7. Accessibility Classes
    root.classList.toggle("reduced-motion", !!appSettings.accessibility.reducedMotion);
    root.classList.toggle("high-contrast", !!appSettings.accessibility.highContrast);
    root.classList.toggle("dyslexia-friendly", !!appSettings.accessibility.dyslexiaFriendly);

    if (appSettings.accessibility.dyslexiaFriendly) {
      root.style.setProperty("--font-family", "'OpenDyslexic', sans-serif");
    }

    root.style.setProperty("--text-scale", appSettings.accessibility.textScale.toString());

    if (appSettings.typography.bodyWeight) {
      root.style.setProperty("--body-weight", getFontWeight(appSettings.typography.bodyWeight));
    }
    if (appSettings.typography.headingWeight) {
      root.style.setProperty("--heading-weight", getFontWeight(appSettings.typography.headingWeight));
    }

    // 8. Animations
    root.classList.toggle("no-animations", appSettings.theme.animations === false);
  };

  // Update settings
  const updateSettings = async (updates: Partial<AppSettings>) => {
    setIsSaving(true);
    try {
      const newSettings = {
        ...settings,
        ...updates,
        lastUpdated: new Date().toISOString()
      };

      setSettings(newSettings);
      await storageManager.current.save(newSettings);
      applySettingsToDOM(newSettings);
    } catch (error) {
      console.error("Failed to update settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Update single setting
  const updateSetting = async <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) => {
    await updateSettings({ [key]: value });
  };

  // Reset to defaults
  const resetToDefaults = async () => {
    const defaults = storageManager.current.reset();
    setSettings(defaults);
    await storageManager.current.save(defaults);
    applySettingsToDOM(defaults);
  };

  // Export settings
  const exportSettings = () => storageManager.current.export(settings);

  // Import settings
  const importSettings = async (jsonString: string) => {
    const result = storageManager.current.import(jsonString);
    if (result.success && result.settings) {
      setSettings(result.settings);
      await storageManager.current.save(result.settings);
      applySettingsToDOM(result.settings);
    }
    return result;
  };

  // Apply preview
  const applyPreview = async () => {
    if (previewSettings) {
      await updateSettings(previewSettings);
      setPreviewSettings(null);
    }
  };

  // Discard preview
  const discardPreview = () => {
    setPreviewSettings(null);
  };

  const value: SettingsContextValue = {
    settings,
    updateSettings,
    updateSetting,
    resetToDefaults,
    exportSettings,
    importSettings,
    isSaving,
    previewSettings,
    setPreviewSettings,
    applyPreview,
    discardPreview
  };

  return React.createElement(
    SettingsContext.Provider,
    { value },
    children
  );
};

// ================= HOOK =================
export const useSettings = function () {
  const context = React.useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

// ================= HELPER FUNCTIONS =================
function getFontFamily(typography: TypographyConfig): string {
  switch (typography.fontFamily) {
    case "system":
      return "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    case "serif":
      return "Georgia, 'Times New Roman', serif";
    case "monospace":
      return "Menlo, Monaco, 'Courier New', monospace";
    case "custom":
      return typography.customFont || "inherit";
    default:
      return "inherit";
  }
}

function getFontSize(size: FontSize): string {
  switch (size) {
    case "small": return "0.875rem";
    case "normal": return "1rem";
    case "large": return "1.125rem";
    case "xlarge": return "1.25rem";
    default: return "1rem";
  }
}

function getFontWeight(weight: string): string {
  switch (weight) {
    case "normal": return "400";
    case "medium": return "500";
    case "semibold": return "600";
    case "bold": return "700";
    case "extrabold": return "800";
    default: return "400";
  }
}

function getSpacing(density: UIDensity): string {
  switch (density) {
    case "compact": return "0.25rem";
    case "comfortable": return "0.5rem";
    case "spacious": return "1rem";
    default: return "0.5rem";
  }
}

// Helper to get CSS value for color vision modes
export function getColorVisionFilter(colorVision?: string): string {
  switch (colorVision) {
    case "protanopia":
      return "url('#protanopia-filter')";
    case "deuteranopia":
      return "url('#deuteranopia-filter')";
    case "tritanopia":
      return "url('#tritanopia-filter')";
    case "achromatopsia":
      return "grayscale(100%)";
    default:
      return "none";
  }
}