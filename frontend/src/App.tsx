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

