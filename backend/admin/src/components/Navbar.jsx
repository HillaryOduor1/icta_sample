import React from 'react';
import { LayoutDashboard, FileText, Settings, Users, Activity, LogOut, Search, Bell, MessageSquare, BarChart } from 'lucide-react';
import { ThemeToggle } from './themeToggle';
import { getNavItems } from '../config/navigation.config';
import { useAuth } from '../context/AuthContext';

const iconMap = {
  LayoutDashboard: LayoutDashboard,
  FileText: FileText,
  Settings: Settings,
  BarChart: BarChart,
  Users: Users,
  Activity: Activity,
  MessageSquare: MessageSquare,
};

export default function Navbar({ activeTab, setActiveTab, onLogout, showBackToMaster, onBackToMaster }) {
  const { user, role, loading } = useAuth();

  // Get navigation items based on role
  const navItems = role ? getNavItems(role) : [];

  // If current active tab is not accessible, switch to first available
  React.useEffect(() => {
    if (navItems.length > 0) {
      const hasAccess = navItems.some(item => item.id === activeTab);
      if (!hasAccess) {
        setActiveTab(navItems[0].id);
      }
    }
  }, [role, activeTab, setActiveTab, navItems]);

  if (loading) {
    return (
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30">
        <div className="px-4 lg:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            <div className="w-32 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </nav>
    );
  }

  const userDisplayName = user?.name || user?.email?.split('@')[0] || role || 'User';
  const userInitial = userDisplayName.charAt(0).toUpperCase();

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30">
      <div className="px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white hidden sm:inline">
                Admin CMS
              </span>
              {role && (
                <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 capitalize">
                  {role}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {(role === 'superadmin' || role === 'admin') && (
              <div className="relative hidden md:block">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-64 pl-9 pr-3 py-1.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                />
              </div>
            )}

            <ThemeToggle />

            {showBackToMaster && (
              <button
                onClick={onBackToMaster}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
              >
                ← Back to Master
              </button>
            )}

            {(role === 'superadmin' || role === 'admin') && (
              <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                <Bell size={18} className="text-gray-600 dark:text-gray-400" />
              </button>
            )}

            <div className="flex items-center gap-2 pl-1">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
                <span className="text-white text-sm font-medium">{userInitial}</span>
              </div>
              <span className="hidden lg:block text-sm font-medium text-gray-700 dark:text-gray-300">
                {userDisplayName}
              </span>
            </div>

            <button
              onClick={onLogout}
              className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 ml-1"
              title="Logout"
            >
              <LogOut size={18} className="text-red-500 dark:text-red-400" />
            </button>
          </div>
        </div>

        {navItems.length > 0 && (
          <div className="flex items-center gap-1 overflow-x-auto">
            {navItems.map((item) => {
              const IconComponent = iconMap[item.icon];
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`
                    flex items-center gap-2 px-4 py-2.5 text-sm font-medium
                    transition-all duration-200 border-b-2 whitespace-nowrap
                    ${isActive 
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
                      : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900'
                    }
                  `}
                >
                  {IconComponent && <IconComponent size={16} />}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}
