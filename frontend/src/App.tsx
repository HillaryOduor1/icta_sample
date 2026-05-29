// frontend/src/App.tsx
import * as React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider, useTheme } from "./components/theme-provider";
import { SettingsProvider } from "./stores/settings-store";
import { ContentProvider } from "./content/ContentProvider";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { trackPage } from './analytics';
import { restoreScrollPosition, saveScrollPosition } from './utils/scrollPersistence';
import BackToTop from "./components/BackToTop";
import ThemeManager from "./components/ThemeManager";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar/Sidebar"; // Make sure this path is correct
import LoadingFallback from "./components/LoadingFallback";

const HomePage = React.lazy(() => import("./pages/HomePage"));
const AboutPage = React.lazy(() => import("./pages/AboutPage"));
const PublicLayout = React.lazy(() => import("./Layout/PublicLayout"));

function AppContent() {
  // Initialize sidebar as CLOSED (false)
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const location = useLocation();
  const [showOfflineModal, setShowOfflineModal] = React.useState(!navigator.onLine);

  // Close sidebar when route changes (navigation)
  React.useEffect(() => {
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname]);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  React.useEffect(() => {
    const handleOnline = () => setShowOfflineModal(false);
    const handleOffline = () => setShowOfflineModal(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  React.useEffect(() => {
    const pageName = location.pathname === '/' ? 'Home' : 
                     location.pathname.slice(1).charAt(0).toUpperCase() + location.pathname.slice(2);
    document.title = `${pageName} | ICT Authority`;
  }, [location]);

  React.useEffect(() => {
    restoreScrollPosition();
    const beforeUnload = () => saveScrollPosition(window.scrollY);
    window.addEventListener('beforeunload', beforeUnload);
    return () => window.removeEventListener('beforeunload', beforeUnload);
  }, []);

  React.useEffect(() => {
    saveScrollPosition(window.scrollY);
  }, [location.pathname]);

  React.useEffect(() => {
    trackPage(location.pathname);
  }, [location]);

  React.useEffect(() => {
    let touchStartX = 0;
    const onTouchStart = (e: TouchEvent) => { touchStartX = e.changedTouches[0].screenX; };
    const onTouchEnd = (e: TouchEvent) => {
      const diff = e.changedTouches[0].screenX - touchStartX;
      if (diff > 100) window.history.back();
    };
    window.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchend', onTouchEnd);
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  return (
    <>
      {showOfflineModal && (
        <div className="fixed inset-0 bg-black/70 z-[200] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl">
            <span className="text-4xl mb-4 block">📡</span>
            <h3 className="text-xl font-bold mb-2">No Internet Connection</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              To use this app, please turn on mobile data or connect to Wi-Fi.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary text-white font-bold px-6 py-2 rounded-lg"
            >
              OK
            </button>
          </div>
        </div>
      )}
      
      <React.Suspense fallback={React.createElement(LoadingFallback, null)}>
        <div className="relative min-h-screen">
          <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
          <main id="main-content" tabIndex={-1}>
            <Routes>
              <Route element={<PublicLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/login" element={<HomePage />} />
                <Route path="/privacy" element={<HomePage />} />
                <Route path="/terms" element={<HomePage />} />
                <Route path="/accessibility" element={<HomePage />} />
              </Route>
              <Route path="/admin" element={
                <ProtectedRoute>
                  <div className="flex min-h-screen bg-background-light dark:bg-background-dark pt-16">
                    <div className="hidden md:block">
                      <Sidebar isOpen={true} toggleSidebar={() => {}} />
                    </div>
                    <div className="flex-1 md:ml-64 p-8"></div>
                  </div>
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <BackToTop />
        </div>
      </React.Suspense>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthProvider>
          <SettingsProvider>
            <ContentProvider>
              <ThemeManager>
                <AppContent />
              </ThemeManager>
            </ContentProvider>
          </SettingsProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
/*
// frontend/src/App.tsx - Update the import and usage
import * as React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider, useTheme } from "./components/theme-provider";
import { SettingsProvider } from "./stores/settings-store";
import { ContentProvider } from "./content/ContentProvider";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { trackPage } from './analytics';
import { restoreScrollPosition, saveScrollPosition } from './utils/scrollPersistence';
import BackToTop from "./components/BackToTop";
import ThemeManager from "./components/ThemeManager";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import LoadingFallback from "./components/LoadingFallback"; // Import the new component

const HomePage = React.lazy(() => import("./pages/HomePage"));
const AboutPage = React.lazy(() => import("./pages/AboutPage"));
const PublicLayout = React.lazy(() => import("./Layout/PublicLayout"));

function AppContent() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const location = useLocation();
  const [showOfflineModal, setShowOfflineModal] = React.useState(!navigator.onLine);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  React.useEffect(() => {
    const handleOnline = () => setShowOfflineModal(false);
    const handleOffline = () => setShowOfflineModal(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  React.useEffect(() => {
    const pageName = location.pathname === '/' ? 'Home' : 
                     location.pathname.slice(1).charAt(0).toUpperCase() + location.pathname.slice(2);
    document.title = `${pageName} | ICT Authority`;
  }, [location]);

  React.useEffect(() => {
    restoreScrollPosition();
    const beforeUnload = () => saveScrollPosition(window.scrollY);
    window.addEventListener('beforeunload', beforeUnload);
    return () => window.removeEventListener('beforeunload', beforeUnload);
  }, []);

  React.useEffect(() => {
    saveScrollPosition(window.scrollY);
  }, [location.pathname]);

  React.useEffect(() => {
    trackPage(location.pathname);
  }, [location]);

  React.useEffect(() => {
    let touchStartX = 0;
    const onTouchStart = (e: TouchEvent) => { touchStartX = e.changedTouches[0].screenX; };
    const onTouchEnd = (e: TouchEvent) => {
      const diff = e.changedTouches[0].screenX - touchStartX;
      if (diff > 100) window.history.back();
    };
    window.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchend', onTouchEnd);
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  return (
    <>
      {showOfflineModal && (
        <div className="fixed inset-0 bg-black/70 z-[200] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl">
            <span className="text-4xl mb-4 block">📡</span>
            <h3 className="text-xl font-bold mb-2">No Internet Connection</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              To use this app, please turn on mobile data or connect to Wi-Fi.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary text-white font-bold px-6 py-2 rounded-lg"
            >
              OK
            </button>
          </div>
        </div>
      )}
      
      <React.Suspense fallback={React.createElement(LoadingFallback, null)}>
        <div className="relative min-h-screen">
          <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
          <main id="main-content" tabIndex={-1}>
            <Routes>
              <Route element={<PublicLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/login" element={<HomePage />} />
                <Route path="/privacy" element={<HomePage />} />
                <Route path="/terms" element={<HomePage />} />
                <Route path="/accessibility" element={<HomePage />} />
              </Route>
              <Route path="/admin" element={
                <ProtectedRoute>
                  <div className="flex min-h-screen bg-background-light dark:bg-background-dark pt-16">
                    <div className="hidden md:block"><Sidebar isOpen={true} toggleSidebar={() => {}} /></div>
                    <div className="flex-1 md:ml-64 p-8"></div>
                  </div>
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <BackToTop />
        </div>
      </React.Suspense>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="system"> {/* Changed default theme to light /}
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthProvider>
          <SettingsProvider>
            <ContentProvider>
              <ThemeManager>
                <AppContent />
              </ThemeManager>
            </ContentProvider>
          </SettingsProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}*/


/*
// frontend/src/App.tsx - Updated LoadingFallback component
import * as React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider, useTheme } from "./components/theme-provider";
import { SettingsProvider } from "./stores/settings-store";
import { ContentProvider } from "./content/ContentProvider";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { trackPage } from './analytics';
import { restoreScrollPosition, saveScrollPosition } from './utils/scrollPersistence';
import BackToTop from "./components/BackToTop";
import ThemeManager from "./components/ThemeManager";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
//import Footer from "./components/Footer";

const HomePage = React.lazy(() => import("./pages/HomePage"));
const AboutPage = React.lazy(() => import("./pages/AboutPage"));
//const ContactPage = React.lazy(() => import("./pages/ContactPage"));
const PublicLayout = React.lazy(() => import("./Layout/PublicLayout"));

// Loading component that uses CSS variables for colors
const LoadingFallback = () => {
  // Get current theme mode from localStorage or default to dark
  const [isDark, setIsDark] = React.useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved === "light") return false;
      if (saved === "dark") return true;
      // Check system preference
      return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return true; // Default to dark
  });

  React.useEffect(() => {
    // Listen for theme changes
    const observer = new MutationObserver(() => {
      const isDarkMode = document.documentElement.classList.contains("dark");
      setIsDark(isDarkMode);
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"]
    });
    
    // Initial check
    setIsDark(document.documentElement.classList.contains("dark"));
    
    return () => observer.disconnect();
  }, []);

  // Get CSS variable values
  const getCSSVar = (varName: string) => {
    if (typeof window !== "undefined") {
      return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
    }
    return isDark ? "#0f0f0f" : "#f8f5f5";
  };

  const bgColor = getCSSVar("--bg");
  const primaryColor = getCSSVar("--primary") || "#f20d0d";
  const textColor = getCSSVar("--text") || (isDark ? "#ffffff" : "#1a1a1a");
  
  // Use white for outer arc in dark mode, primary in light mode
  const outerArcColor = isDark ? "#ffffff" : primaryColor;
  const innerArcColor = isDark ? primaryColor : "#c0a0a0";

  return (
    <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: bgColor || (isDark ? "#0f0f0f" : "#f8f5f5") }}>
      <svg width="280" height="280" viewBox="0 0 280 280" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="fadeArcOuter" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="280" y2="0">
            <stop offset="0%" stopColor={outerArcColor} stopOpacity="0"/>
            <stop offset="10%" stopColor={outerArcColor} stopOpacity="0.4"/>
            <stop offset="25%" stopColor={outerArcColor} stopOpacity="1"/>
            <stop offset="75%" stopColor={outerArcColor} stopOpacity="1"/>
            <stop offset="90%" stopColor={outerArcColor} stopOpacity="0.4"/>
            <stop offset="100%" stopColor={outerArcColor} stopOpacity="0"/>
          </linearGradient>
          <linearGradient id="fadeArcGreen" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="280" y2="0">
            <stop offset="0%" stopColor="#00a86b" stopOpacity="0"/>
            <stop offset="10%" stopColor="#00a86b" stopOpacity="0.4"/>
            <stop offset="25%" stopColor="#00a86b" stopOpacity="1"/>
            <stop offset="75%" stopColor="#00a86b" stopOpacity="1"/>
            <stop offset="90%" stopColor="#00a86b" stopOpacity="0.4"/>
            <stop offset="100%" stopColor="#00a86b" stopOpacity="0"/>
          </linearGradient>
          <linearGradient id="fadeArcInner" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="280" y2="0">
            <stop offset="0%" stopColor={innerArcColor} stopOpacity="0"/>
            <stop offset="10%" stopColor={innerArcColor} stopOpacity="0.4"/>
            <stop offset="25%" stopColor={innerArcColor} stopOpacity="1"/>
            <stop offset="75%" stopColor={innerArcColor} stopOpacity="1"/>
            <stop offset="90%" stopColor={innerArcColor} stopOpacity="0.4"/>
            <stop offset="100%" stopColor={innerArcColor} stopOpacity="0"/>
          </linearGradient>

          <mask id="maskOuter">
            <rect width="280" height="280" fill="url(#fadeArcOuter)"/>
          </mask>
          <mask id="maskGreen">
            <rect width="280" height="280" fill="url(#fadeArcGreen)" transform="rotate(90 140 140)"/>
          </mask>
          <mask id="maskInner">
            <rect width="280" height="280" fill="url(#fadeArcInner)" transform="rotate(180 140 140)"/>
          </mask>
        </defs>
        
        {/* Outer Arc /}
        <g transform="translate(140,140)">
          <circle cx="0" cy="0" r="100" fill="none" stroke={outerArcColor} strokeWidth="4" strokeLinecap="round" strokeDasharray="170 700" mask="url(#maskOuter)">
            <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="1.2s" repeatCount="indefinite"/>
          </circle>
        </g>
        
        {/* Green Arc /}
        <g transform="translate(140,140)">
          <circle cx="0" cy="0" r="91" fill="none" stroke="#00a86b" strokeWidth="4" strokeLinecap="round" strokeDasharray="160 650" mask="url(#maskGreen)">
            <animateTransform attributeName="transform" type="rotate" from="0" to="-360" dur="1.4s" repeatCount="indefinite"/>
          </circle>
        </g>
        
        {/* Inner Arc /}
        <g transform="translate(140,140)">
          <circle cx="0" cy="0" r="83" fill="none" stroke={innerArcColor} strokeWidth="4" strokeLinecap="round" strokeDasharray="150 640" mask="url(#maskInner)">
            <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="1.6s" repeatCount="indefinite"/>
          </circle>
        </g>
        
        <text x="140" y="140" textAnchor="middle" dominantBaseline="middle" fill={textColor} fontFamily="Space Grotesk, sans-serif" fontSize="14" fontWeight="700" letterSpacing="2">
          ICT AUTHORITY
        </text>
      </svg>
    </div>
  );
};

function AppContent() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const location = useLocation();
  const [showOfflineModal, setShowOfflineModal] = React.useState(!navigator.onLine);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  React.useEffect(() => {
    const handleOnline = () => setShowOfflineModal(false);
    const handleOffline = () => setShowOfflineModal(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  React.useEffect(() => {
    const pageName = location.pathname === '/' ? 'Home' : 
                     location.pathname.slice(1).charAt(0).toUpperCase() + location.pathname.slice(2);
    document.title = `${pageName} | ICT Authority`;
  }, [location]);

  React.useEffect(() => {
    restoreScrollPosition();
    const beforeUnload = () => saveScrollPosition(window.scrollY);
    window.addEventListener('beforeunload', beforeUnload);
    return () => window.removeEventListener('beforeunload', beforeUnload);
  }, []);

  React.useEffect(() => {
    saveScrollPosition(window.scrollY);
  }, [location.pathname]);

  React.useEffect(() => {
    trackPage(location.pathname);
  }, [location]);

  React.useEffect(() => {
    let touchStartX = 0;
    const onTouchStart = (e: TouchEvent) => { touchStartX = e.changedTouches[0].screenX; };
    const onTouchEnd = (e: TouchEvent) => {
      const diff = e.changedTouches[0].screenX - touchStartX;
      if (diff > 100) window.history.back();
    };
    window.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchend', onTouchEnd);
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  return (
    <>
      {showOfflineModal && (
        <div className="fixed inset-0 bg-black/70 z-[200] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl">
            <span className="text-4xl mb-4 block">📡</span>
            <h3 className="text-xl font-bold mb-2">No Internet Connection</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              To use this app, please turn on mobile data or connect to Wi-Fi.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary text-white font-bold px-6 py-2 rounded-lg"
            >
              OK
            </button>
          </div>
        </div>
      )}
      
      <React.Suspense fallback={<LoadingFallback />}>
        <div className="relative min-h-screen">
          <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
          <main id="main-content" tabIndex={-1}>
            <Routes>
              <Route element={<PublicLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                
                <Route path="/login" element={<HomePage />} />
                <Route path="/privacy" element={<HomePage />} />
                <Route path="/terms" element={<HomePage />} />
                <Route path="/accessibility" element={<HomePage />} />
              </Route>
              <Route path="/admin" element={
                <ProtectedRoute>
                  <div className="flex min-h-screen bg-background-light dark:bg-background-dark pt-16">
                    <div className="hidden md:block"><Sidebar isOpen={true} toggleSidebar={() => {}} /></div>
                    <div className="flex-1 md:ml-64 p-8"></div>
                  </div>
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          {/*<Footer />/}
          <BackToTop />
        </div>
      </React.Suspense>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthProvider>
          <SettingsProvider>
            <ContentProvider>
              <ThemeManager>
                <AppContent />
              </ThemeManager>
            </ContentProvider>
          </SettingsProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}*/
