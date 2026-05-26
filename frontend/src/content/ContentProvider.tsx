// frontend/src/content/ContentProvider.tsx
import * as React from "react";
import { ContentContext } from "./ContentContext";
import { defaultContent as staticDefault } from "./defaultContent";
import type { SiteContent } from "./contentTypes";

// Get tenant from environment variable
const TENANT = import.meta.env.VITE_TENANT_NAME || "landscapes_integrity_solutions";

// Get API URL based on environment
const getApiUrl = () => {
  if (import.meta.env.PROD) {
    const baseUrl = import.meta.env.VITE_API_URL;
    return `${baseUrl}/api/v1/content?tenant=${TENANT}`;
  }
  // In development, use relative path for Vite proxy
  return `/api/content?tenant=${TENANT}`;
};

const API_URL = getApiUrl();
const VERSION_URL = API_URL.replace('/content', '/content/version'); // Add version endpoint

const CACHE_TTL = import.meta.env.PROD ? 60 * 1000 : 5 * 60 * 1000; // 1 min prod, 5 min dev
const CACHE_KEY = `site_content_cache_${TENANT}`;
const CONTENT_VERSION_KEY = `site_content_version_${TENANT}`;

interface CacheEntry {
  data: SiteContent;
  timestamp: number;
  version: number;
}

// Helper to extract content from various response formats
const extractContentFromResponse = (responseData: any): { content: SiteContent | null; version: number } => {
  console.log('Raw API response structure:', responseData);
  
  let extractedContent: SiteContent | null = null;
  let version = Date.now();
  
  // Case 1: Our backend success response format: { success: true, message: "...", data: {...} }
  if (responseData && responseData.data) {
    const dataContent = responseData.data;
    
    // If data is an array, find home page or take first item
    if (Array.isArray(dataContent)) {
      if (dataContent.length === 0) {
        console.warn('Empty data array received');
        return { content: null, version };
      }
      const homeContent = dataContent.find((item: any) => item.page === 'home') || dataContent[0];
      // Check if the content has a nested data property (from transformer)
      if (homeContent && homeContent.data && typeof homeContent.data === 'object') {
        extractedContent = homeContent.data as SiteContent;
        version = homeContent.updatedAt || homeContent.version || version;
      } else {
        extractedContent = homeContent as SiteContent;
        version = homeContent.updatedAt || homeContent.version || version;
      }
    }
    
    // If data is an object (single content)
    if (typeof dataContent === 'object' && !Array.isArray(dataContent)) {
      // Check if it has a nested data property (from transformer)
      if (dataContent.data && typeof dataContent.data === 'object') {
        extractedContent = dataContent.data as SiteContent;
        version = dataContent.updatedAt || dataContent.version || version;
      } else {
        extractedContent = dataContent as SiteContent;
        version = dataContent.updatedAt || dataContent.version || version;
      }
    }
  }
  
  // Case 2: Direct content object
  if (!extractedContent && responseData && responseData.page === 'home') {
    extractedContent = responseData as SiteContent;
    version = responseData.updatedAt || responseData.version || version;
  }
  
  // Case 3: Array of content items
  if (!extractedContent && Array.isArray(responseData) && responseData.length > 0) {
    const homeContent = responseData.find((item: any) => item.page === 'home') || responseData[0];
    if (homeContent && homeContent.data) {
      extractedContent = homeContent.data as SiteContent;
      version = homeContent.updatedAt || homeContent.version || version;
    } else if (homeContent) {
      extractedContent = homeContent as SiteContent;
      version = homeContent.updatedAt || homeContent.version || version;
    }
  }
  
  return { content: extractedContent, version };
};

// Helper to check content version from backend
const checkContentVersion = async (): Promise<number | null> => {
  try {
    const response = await fetch(VERSION_URL, {
      credentials: "include",
      headers: { 
        "Accept": "application/json",
        "Cache-Control": "no-cache"
      }
    });
    
    if (!response.ok) {
      console.warn('Version check failed:', response.status);
      return null;
    }
    
    const data = await response.json();
    // Extract version from response
    let version = null;
    if (data.data && data.data.version) {
      version = data.data.version;
    } else if (data.version) {
      version = data.version;
    } else if (data.updatedAt) {
      version = new Date(data.updatedAt).getTime();
    }
    
    return version;
  } catch (error) {
    console.error('Failed to check content version:', error);
    return null;
  }
};

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = React.useState<SiteContent>(staticDefault as SiteContent);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [currentVersion, setCurrentVersion] = React.useState<number>(() => {
    const savedVersion = localStorage.getItem(CONTENT_VERSION_KEY);
    return savedVersion ? parseInt(savedVersion, 10) : 0;
  });

  const loadContent = React.useCallback(async (force = false) => {
    // Check cache first (unless force refresh)
    if (!force) {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        try {
          const { data, timestamp, version }: CacheEntry = JSON.parse(cached);
          // Use cache if not expired
          if (Date.now() - timestamp < CACHE_TTL) {
            console.log('Using cached content for tenant:', TENANT, 'version:', version);
            setContent(data);
            setCurrentVersion(version);
            setIsLoading(false);
            return;
          }
        } catch (e) {
          console.warn('Failed to parse cache:', e);
        }
      }
    }

    setIsLoading(true);
    let response: Response | undefined;
    
    try {
      // Add cache-busting parameter for production
      const cacheBuster = import.meta.env.PROD ? `&_=${Date.now()}` : '';
      const url = `${API_URL}${cacheBuster}`;
      
      console.log('Fetching content for tenant:', TENANT);
      console.log('API URL:', url);
      
      response = await fetch(url, { 
        credentials: "include",
        headers: { 
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache"
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response:", text.slice(0, 200));
        throw new Error("Backend did not return JSON");
      }

      const responseData = await response.json();
      console.log('Response received:', responseData);
      
      // Extract content from response
      const { content: loadedContent, version: newVersion } = extractContentFromResponse(responseData);
      
      // Check if content has actually changed
      if (loadedContent && Object.keys(loadedContent).length > 0) {
        // Check version to avoid unnecessary updates
        if (newVersion > currentVersion || force) {
          console.log('✅ New content version detected:', newVersion, '(previous:', currentVersion, ')');
          
          // Merge with static default (but prefer loaded content)
          const mergedContent = { ...staticDefault, ...loadedContent };
          
          setContent(mergedContent);
          setCurrentVersion(newVersion);
          
          // Cache the content
          const cacheEntry: CacheEntry = { 
            data: mergedContent, 
            timestamp: Date.now(),
            version: newVersion
          };
          localStorage.setItem(CACHE_KEY, JSON.stringify(cacheEntry));
          localStorage.setItem(CONTENT_VERSION_KEY, newVersion.toString());
        } else {
          console.log('Content version unchanged, using cached version');
        }
      } else {
        console.warn('⚠️ No valid content received from backend, using static fallback');
        setContent(staticDefault as SiteContent);
      }
    } catch (error) {
      console.error("Failed to load content from backend:", error);
      if (response) {
        try {
          const text = await response.text();
          console.error("Raw backend response:", text.slice(0, 500));
        } catch (e) {
          console.error("Could not read response body");
        }
      }
      // Use static default as fallback
      setContent(staticDefault as SiteContent);
    } finally {
      setIsLoading(false);
    }
  }, [currentVersion]);

  // Check version and reload if needed (lightweight check)
  const checkVersionAndReload = React.useCallback(async () => {
    const serverVersion = await checkContentVersion();
    if (serverVersion && serverVersion > currentVersion) {
      console.log('New version detected, reloading content...');
      await loadContent(true);
    }
  }, [currentVersion, loadContent]);

  const refresh = React.useCallback(() => {
    console.log('Forcing content refresh...');
    // Clear cache before refresh
    localStorage.removeItem(CACHE_KEY);
    return loadContent(true);
  }, [loadContent]);

  // Poll for changes in production (every 30 seconds using version check)
  React.useEffect(() => {
    if (!import.meta.env.PROD) return;
    
    const interval = setInterval(() => {
      console.log('Polling for content updates...');
      checkVersionAndReload();
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, [checkVersionAndReload]);

  // Listen for content-updated events
  React.useEffect(() => {
    const handleContentUpdated = () => {
      console.log('Content updated event received, refreshing...');
      // Clear cache and force refresh
      localStorage.removeItem(CACHE_KEY);
      loadContent(true);
    };
    window.addEventListener("content-updated", handleContentUpdated);
    return () => window.removeEventListener("content-updated", handleContentUpdated);
  }, [loadContent]);

  // Listen for storage events (cross-tab synchronization)
  React.useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === CONTENT_VERSION_KEY && e.newValue) {
        const newVersion = parseInt(e.newValue, 10);
        if (newVersion > currentVersion) {
          console.log('Cross-tab version update detected, reloading...');
          loadContent(true);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [currentVersion, loadContent]);

  // Initial load
  React.useEffect(() => {
    loadContent();
  }, [loadContent]);

  const saveContent = async (newContent: SiteContent) => {
    setIsSaving(true);
    try {
      console.log('Saving content for tenant:', TENANT);
      
      const { page, ...contentWithoutPage } = newContent;
      const response = await fetch(API_URL, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          ...contentWithoutPage,
          page: "home",
          tenantId: TENANT,
          updatedAt: new Date().toISOString()
        }),
        credentials: "include",
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Save failed: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      const newVersion = Date.now();
      
      setContent(newContent);
      setCurrentVersion(newVersion);
      
      // Update cache with new content
      const cacheEntry: CacheEntry = { 
        data: newContent, 
        timestamp: Date.now(),
        version: newVersion
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheEntry));
      localStorage.setItem(CONTENT_VERSION_KEY, newVersion.toString());
      
      // Dispatch event for other tabs/windows
      window.dispatchEvent(new Event("content-updated"));
      
      console.log('✅ Content saved successfully');
      return true;
    } catch (error) {
      console.error("Save error:", error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const updateContent = async (updates: Partial<SiteContent>) => {
    const newContent = { ...content, ...updates };
    return await saveContent(newContent);
  };

  const resetContent = async () => {
    console.log('Resetting content to default for tenant:', TENANT);
    await saveContent(staticDefault as SiteContent);
    await refresh();
  };

  return (
    <ContentContext.Provider
      value={{
        content,
        setContent,
        resetContent,
        updateContent,
        isSaving,
        isLoading,
        refresh,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}

/*works but changes made dont get updated in the frontend
// frontend/src/content/ContentProvider.tsx
import * as React from "react";
import { ContentContext } from "./ContentContext";
import { defaultContent as staticDefault } from "./defaultContent";
import type { SiteContent } from "./contentTypes";

// Get tenant from environment variable
const TENANT = import.meta.env.VITE_TENANT_NAME || "landscapes_integrity_solutions";

// Get API URL based on environment
const getApiUrl = () => {
  if (import.meta.env.PROD) {
    const baseUrl = import.meta.env.VITE_API_URL;
    return `${baseUrl}/api/v1/content?tenant=${TENANT}`;
  }
  // In development, use relative path for Vite proxy
  return `/api/content?tenant=${TENANT}`;
};

const API_URL = getApiUrl();

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const CACHE_KEY = `site_content_cache_${TENANT}`; // Cache per tenant

interface CacheEntry {
  data: SiteContent;
  timestamp: number;
}

// Helper to extract content from various response formats
const extractContentFromResponse = (responseData: any): SiteContent | null => {
  console.log('Raw API response structure:', responseData);
  
  // Case 1: Our backend success response format: { success: true, message: "...", data: {...} }
  if (responseData && responseData.data) {
    const dataContent = responseData.data;
    
    // If data is an array, find home page or take first item
    if (Array.isArray(dataContent)) {
      if (dataContent.length === 0) {
        console.warn('Empty data array received');
        return null;
      }
      const homeContent = dataContent.find((item: any) => item.page === 'home') || dataContent[0];
      // Check if the content has a nested data property (from transformer)
      if (homeContent && homeContent.data && typeof homeContent.data === 'object') {
        return homeContent.data as SiteContent;
      }
      return homeContent as SiteContent;
    }
    
    // If data is an object (single content)
    if (typeof dataContent === 'object') {
      // Check if it has a nested data property (from transformer)
      if (dataContent.data && typeof dataContent.data === 'object') {
        return dataContent.data as SiteContent;
      }
      return dataContent as SiteContent;
    }
  }
  
  // Case 2: Direct content object
  if (responseData && responseData.page === 'home') {
    return responseData as SiteContent;
  }
  
  // Case 3: Array of content items
  if (Array.isArray(responseData) && responseData.length > 0) {
    const homeContent = responseData.find((item: any) => item.page === 'home') || responseData[0];
    if (homeContent && homeContent.data) {
      return homeContent.data as SiteContent;
    }
    return homeContent as SiteContent;
  }
  
  return null;
};

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = React.useState<SiteContent>(staticDefault as SiteContent);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);

  const loadContent = React.useCallback(async (force = false) => {
    // Check cache first (unless force refresh)
    if (!force) {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        try {
          const { data, timestamp }: CacheEntry = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_TTL) {
            console.log('Using cached content for tenant:', TENANT);
            setContent(data);
            setIsLoading(false);
            return;
          }
        } catch (e) {
          console.warn('Failed to parse cache:', e);
        }
      }
    }

    setIsLoading(true);
    let response: Response | undefined;
    
    try {
      console.log('Fetching content for tenant:', TENANT);
      console.log('API URL:', API_URL);
      
      response = await fetch(API_URL, { 
        credentials: "include",
        headers: { 
          "Accept": "application/json",
          "Content-Type": "application/json"
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response:", text.slice(0, 200));
        throw new Error("Backend did not return JSON");
      }

      const responseData = await response.json();
      console.log('Response received:', responseData);
      
      // Extract content from response
      const loadedContent = extractContentFromResponse(responseData);
      
      if (loadedContent && Object.keys(loadedContent).length > 0) {
        console.log('✅ Content loaded successfully for tenant:', TENANT);
        console.log('Content sections:', Object.keys(loadedContent));
        
        // Ensure we have all required sections by merging with static default
        // but prefer loaded content over defaults
        const mergedContent = { ...staticDefault, ...loadedContent };
        
        setContent(mergedContent);
        
        // Cache the content
        const cacheEntry: CacheEntry = { 
          data: mergedContent, 
          timestamp: Date.now() 
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheEntry));
      } else {
        console.warn('⚠️ No valid content received from backend, using static fallback');
        setContent(staticDefault as SiteContent);
      }
    } catch (error) {
      console.error("Failed to load content from backend:", error);
      if (response) {
        try {
          const text = await response.text();
          console.error("Raw backend response:", text.slice(0, 500));
        } catch (e) {
          console.error("Could not read response body");
        }
      }
      // Use static default as fallback
      setContent(staticDefault as SiteContent);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refresh = React.useCallback(() => loadContent(true), [loadContent]);

  React.useEffect(() => {
    const handleContentUpdated = () => {
      console.log('Content updated event received, refreshing...');
      refresh();
    };
    window.addEventListener("content-updated", handleContentUpdated);
    return () => window.removeEventListener("content-updated", handleContentUpdated);
  }, [refresh]);

  React.useEffect(() => {
    loadContent();
  }, [loadContent]);

  const saveContent = async (newContent: SiteContent) => {
    setIsSaving(true);
    try {
      console.log('Saving content for tenant:', TENANT);
      
      const response = await fetch(API_URL, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          page: "home",
          ...newContent,
          tenantId: TENANT,
          updatedAt: new Date().toISOString()
        }),
        credentials: "include",
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Save failed: ${response.status} - ${errorText}`);
      }
      
      setContent(newContent);
      const cacheEntry: CacheEntry = { data: newContent, timestamp: Date.now() };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheEntry));
      window.dispatchEvent(new Event("content-updated"));
      console.log('✅ Content saved successfully');
      return true;
    } catch (error) {
      console.error("Save error:", error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const updateContent = async (updates: Partial<SiteContent>) => {
    const newContent = { ...content, ...updates };
    return await saveContent(newContent);
  };

  const resetContent = async () => {
    console.log('Resetting content to default for tenant:', TENANT);
    await saveContent(staticDefault as SiteContent);
    await refresh();
  };

  return (
    <ContentContext.Provider
      value={{
        content,
        setContent,
        resetContent,
        updateContent,
        isSaving,
        isLoading,
        refresh,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}*/


/*
// frontend/src/content/ContentProvider.tsx
import * as React from "react";
import { ContentContext } from "./ContentContext";
import { defaultContent as staticDefault } from "./defaultContent";
import type { SiteContent } from "./contentTypes";

// ✅ Use full backend URL from environment, fallback to relative path for local dev
const getApiUrl = () => {
  const TENANT = import.meta.env.VITE_TENANT_NAME || "landscapes_integrity_solutions";
  if (import.meta.env.PROD) {
    const baseUrl = import.meta.env.VITE_API_URL;
    return `${baseUrl}/api/v1/content?tenant=${TENANT}`;
  }
  // In development, use relative path for Vite proxy
  return `/api/content?tenant=${TENANT}`;
};
//const API_BASE = import.meta.env.VITE_API_URL || "";
//const TENANT = import.meta.env.VITE_TENANT_NAME || "landscapes_integrity_solutions";
//const API_URL = `${API_BASE}/api/content?tenant=${TENANT}`;
const API_URL = getApiUrl();

const CACHE_TTL = 1 * 60 * 1000; // 5 minutes
const CACHE_KEY = "site_content_cache";

interface CacheEntry {
  data: SiteContent;
  timestamp: number;
}

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = React.useState<SiteContent>(staticDefault as SiteContent);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);

  const loadContent = React.useCallback(async (force = false) => {
    if (!force) {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        try {
          const { data, timestamp }: CacheEntry = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_TTL) {
            setContent(data);
            setIsLoading(false);
            return;
          }
        } catch (e) {
          // invalid JSON, ignore
        }
      }
    }

    setIsLoading(true);
    let response: Response | undefined;
    try {
      response = await fetch(API_URL, { credentials: "include" });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response:", text.slice(0, 200));
        throw new Error("Backend did not return JSON");
      }

      const data = await response.json();
      const loadedContent = (Array.isArray(data) ? data[0] : data) as SiteContent;
      if (loadedContent && Object.keys(loadedContent).length > 0) {
        setContent(loadedContent);
        const cacheEntry: CacheEntry = { data: loadedContent, timestamp: Date.now() };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheEntry));
      } else {
        setContent(staticDefault as SiteContent);
      }
    } catch (error) {
      console.error("Failed to load content, using static fallback", error);
      if (response) {
        try {
          const text = await response.text();
          console.error("Raw backend response:", text.slice(0, 500));
        } catch (e) {}
      }
      setContent(staticDefault as SiteContent);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refresh = React.useCallback(() => loadContent(true), [loadContent]);

  React.useEffect(() => {
    const handleContentUpdated = () => refresh();
    window.addEventListener("content-updated", handleContentUpdated);
    return () => window.removeEventListener("content-updated", handleContentUpdated);
  }, [refresh]);

  React.useEffect(() => {
    loadContent();
  }, [loadContent]);

  const saveContent = async (newContent: SiteContent) => {
    setIsSaving(true);
    try {
      const response = await fetch(API_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newContent),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Save failed");
      setContent(newContent);
      const cacheEntry: CacheEntry = { data: newContent, timestamp: Date.now() };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheEntry));
      window.dispatchEvent(new Event("content-updated"));
      return true;
    } catch (error) {
      console.error("Save error:", error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const updateContent = async (updates: Partial<SiteContent>) => {
    const newContent = { ...content, ...updates };
    return await saveContent(newContent);
  };

  const resetContent = async () => {
    await saveContent(staticDefault as SiteContent);
    await refresh();
  };

  return (
    <ContentContext.Provider
      value={{
        content,
        setContent,
        resetContent,
        updateContent,
        isSaving,
        isLoading,
        refresh,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}*/
