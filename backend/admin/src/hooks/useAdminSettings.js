import { useState, useEffect } from 'react';

export default function useAdminSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/v1/settings', { credentials: 'include' });
        if (response.ok) {
          const result = await response.json();
          // The data is nested under result.data
          if (result && result.data) {
            setSettings(result.data);
            // Apply settings to DOM if needed
            applySettingsToDOM(result.data);
          } else {
            setSettings(getDefaultSettings());
          }
        } else {
          setSettings(getDefaultSettings());
        }
      } catch (error) {
        console.error('Failed to load settings', error);
        setSettings(getDefaultSettings());
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, loading };
}

function getDefaultSettings() {
  return {
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
    // Add other default sections as needed
  };
}

function applySettingsToDOM(settings) {
  if (!settings || !settings.theme) return;
  
  const root = document.documentElement;
  root.style.setProperty('--accent-500', settings.theme.primaryColor || '#db2777');
  root.style.setProperty('--accent-600', settings.theme.secondaryColor || '#ec4899');
  root.style.setProperty('--bg-primary', settings.theme.backgroundColor || '#ffffff');
  root.style.setProperty('--text-primary', settings.theme.textColor || '#0f172a');
  
  // Apply theme mode
  const mode = settings.theme.mode === 'system' 
    ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    : settings.theme.mode;
  
  root.classList.remove('light', 'dark');
  root.classList.add(mode);
}

/*import { useEffect, useState } from 'react';

const API_BASE = '/api/v1';

// Default fallback values
const DEFAULT_SETTINGS = {
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
    fontSize: 'normal',
    lineHeight: 1.5,
    letterSpacing: 'normal',
    textAlign: 'left',
    headingWeight: 'bold',
  },
  ui: {
    density: 'comfortable',
    buttonStyle: 'filled',
  },
};

function applySettingsToDOM(settings) {
  if (!settings) return;

  const theme = settings.theme;
  const typo = settings.typography;
  const ui = settings.ui;

  // 1. Set CSS custom properties
  document.documentElement.style.setProperty('--accent-500', theme.primaryColor);
  document.documentElement.style.setProperty('--accent-600', theme.secondaryColor);
  document.documentElement.style.setProperty('--bg-primary', theme.backgroundColor);
  document.documentElement.style.setProperty('--text-primary', theme.textColor);
  document.documentElement.style.setProperty('--text-primary', theme.textColor || '#0f172a');

  // 2. Set theme mode (light/dark) on <html>
  const root = document.documentElement;
  const mode = theme.mode === 'system' 
    ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    : theme.mode;
  root.classList.remove('light', 'dark');
  root.classList.add(mode);

  // 3. Set border radius
  const radiusMap = { small: '0.25rem', medium: '0.5rem', large: '1rem' };
  root.style.setProperty('--radius-lg', radiusMap[theme.borderRadius] || '0.5rem');

  // 4. Set shadows on/off
  root.style.setProperty('--shadow-sm', theme.shadows ? '0 1px 2px 0 rgb(0 0 0 / 0.05)' : 'none');

  // 5. Typography
  const fontMap = {
    inter: "'Inter', system-ui, sans-serif",
    serif: 'Georgia, serif',
    monospace: 'monospace',
    system: 'system-ui, sans-serif',
  };
  root.style.setProperty('--font-sans', fontMap[typo.fontFamily] || fontMap.system);
  if (typo.fontFamily === 'custom' && settings.typography.customFont) {
    // Load custom font (if URL provided)
    const link = document.createElement('link');
    link.href = settings.typography.customFont;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }

  // 6. UI density – apply class to body or a wrapper
  root.classList.remove('density-compact', 'density-comfortable', 'density-spacious');
  root.classList.add(`density-${ui.density}`);
}
export default function useAdminSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${API_BASE}/settings`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
        applySettingsToDOM(data);
      } else {
        setSettings(DEFAULT_SETTINGS);
        applySettingsToDOM(DEFAULT_SETTINGS);
      }
    } catch (err) {
      console.error('Failed to load settings', err);
      setSettings(DEFAULT_SETTINGS);
      applySettingsToDOM(DEFAULT_SETTINGS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
    const handleUpdate = () => fetchSettings();
    window.addEventListener('settings-updated', handleUpdate);
    return () => window.removeEventListener('settings-updated', handleUpdate);
  }, []);

  return { settings, loading, refetch: fetchSettings };
}*/

/* export default function useAdminSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${API_BASE}/settings`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
        applySettingsToDOM(data);
      } else {
        setSettings(DEFAULT_SETTINGS);
        applySettingsToDOM(DEFAULT_SETTINGS);
      }
    } catch (err) {
      console.error('Failed to load settings', err);
      setSettings(DEFAULT_SETTINGS);
      applySettingsToDOM(DEFAULT_SETTINGS);
    } finally {
      setLoading(false);
    }
  };

  // Listen for "settings-updated" event (fired after save from Settings page)
  useEffect(() => {
    fetchSettings();
    const handleUpdate = () => fetchSettings();
    window.addEventListener('settings-updated', handleUpdate);
    return () => window.removeEventListener('settings-updated', handleUpdate);
  }, []);

  return { settings, loading, refetch: fetchSettings };
}*/