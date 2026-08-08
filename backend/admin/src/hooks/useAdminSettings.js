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
