import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Overview from './Overview';
import ContentManager from './ContentManager';
import Settings from './Settings';
import UsersManager from './Users';
import ActivityLog from './ActivityLog';
import ContactMessages from './ContactMessage';
import { Menu } from 'lucide-react';
import { ThemeToggle } from './themeToggle';
import AnalyticsDashboard from './AnalyticsDashboard/AnalyticsDashboard';
import { useAuth } from '../context/AuthContext';
import { canAccessTab } from '../config/navigation.config';

const tabComponents = {
    overview: Overview,
    content: ContentManager,
    settings: Settings,
    users: UsersManager,
    analytics: AnalyticsDashboard,
    activity: ActivityLog,
    messages: ContactMessages,
};

const tabTitles = {
    overview: 'Dashboard',
    content: 'Content Manager',
    settings: 'Settings',
    users: 'Users',
    analytics: 'Analytics',
    activity: 'Activity Log',
    messages: 'Messages',
};

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

const handleLogout = async () => {
    try {
        await fetch('/api/v1/auth/logout', { method: 'POST', credentials: 'include' });
    } catch (err) {
        console.error('Logout failed', err);
    } finally {
        window.location.href = '/login';
    }
};

export default function Dashboard() {
    const { role, loading: authLoading } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showBackToMaster, setShowBackToMaster] = useState(false);

    // Check if coming from master dashboard
    useEffect(() => {
        const fromMaster = getCookie('switched_from_master') === 'true';
        setShowBackToMaster(fromMaster);
    }, []);

    // Validate tab access when role loads or tab changes
    useEffect(() => {
        if (!authLoading && role) {
            // Check if current tab is accessible for this role
            if (!canAccessTab(role, activeTab)) {
                // Find first accessible tab
                const accessibleTabs = Object.keys(tabComponents).filter(tab => 
                    canAccessTab(role, tab)
                );
                
                if (accessibleTabs.length > 0) {
                    console.log(`Tab "${activeTab}" not accessible for role "${role}", switching to "${accessibleTabs[0]}"`);
                    setActiveTab(accessibleTabs[0]);
                }
            }
        }
    }, [role, authLoading, activeTab]);

    const handleBackToMaster = async () => {
        try {
            const res = await fetch('/api/v1/auth/switch-to-master', {
                method: 'POST',
                credentials: 'include'
            });
            if (res.ok) {
                window.location.href = '/master/tenants';
            } else {
                alert('Unable to return to master dashboard');
            }
        } catch (err) {
            console.error(err);
            alert('Error returning to master');
        }
    };

    const navigate = (tab) => {
        setActiveTab(tab);
        setMobileMenuOpen(false);
    };

    // Show loading state while auth is being checked
    if (authLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-950">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    // Get the active component
    const ActiveComponent = tabComponents[activeTab];
    
    // If no component found or role is missing, show error
    if (!ActiveComponent || !role) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-950">
                <div className="text-center">
                    <p className="text-red-600 dark:text-red-400">Error loading dashboard</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600"
                    >
                        Reload Page
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Mobile Sidebar - only on mobile */}
            <aside
                className={`
                    fixed top-0 left-0 h-full w-72 z-50
                    bg-white dark:bg-gray-900
                    shadow-xl
                    transform transition-transform duration-300 ease-in-out
                    lg:hidden
                    ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-accent-600 flex items-center justify-center">
                            <span className="text-white font-bold text-sm">L</span>
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-white">
                            Admin CMS
                        </span>
                    </div>
                    <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        <Menu size={18} className="text-gray-500 dark:text-gray-400" />
                    </button>
                </div>

                <nav className="p-3 space-y-1">
                    {Object.keys(tabComponents).filter(tab => canAccessTab(role, tab)).map((tab) => {
                        const icons = {
                            overview: '📊',
                            content: '📄',
                            settings: '⚙️',
                            users: '👥',
                            activity: '📋',
                            messages: '✉️',
                            analytics: '📈',
                        };
                        const labels = {
                            overview: 'Overview',
                            content: 'Content',
                            settings: 'Settings',
                            users: 'Users',
                            activity: 'Activity',
                            messages: 'Messages',
                            analytics: 'Analytics',
                        };
                        const isActive = activeTab === tab;
                        return (
                            <button
                                key={tab}
                                onClick={() => navigate(tab)}
                                className={`
                                    w-full flex items-center gap-3 px-4 py-2.5 rounded-xl
                                    transition-all duration-200 text-left
                                    ${isActive 
                                        ? 'bg-accent-50 dark:bg-accent-900/20 text-accent-600 dark:text-accent-400' 
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                                    }
                                `}
                            >
                                <span className="text-lg">{icons[tab]}</span>
                                <span className="text-sm font-medium">{labels[tab]}</span>
                            </button>
                        );
                    })}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-200 dark:border-gray-800 space-y-1">
                    <div className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-600 dark:text-gray-400">
                        <ThemeToggle />
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                    >
                        <span className="text-lg">🚪</span>
                        <span className="text-sm">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex flex-col min-h-screen">
                {/* Mobile Menu Button - only visible on mobile */}
                <div className="lg:hidden fixed top-4 left-4 z-20">
                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="p-2 rounded-lg bg-white dark:bg-gray-900 shadow-md border border-gray-200 dark:border-gray-800"
                    >
                        <Menu size={20} className="text-gray-600 dark:text-gray-400" />
                    </button>
                </div>

                {/* Navbar - now receives props */}
                <Navbar 
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    onLogout={handleLogout}
                    showBackToMaster={showBackToMaster}
                    onBackToMaster={handleBackToMaster}
                />

                {/* Page Title - Mobile */}
                <div className="lg:hidden px-4 pt-4 pb-2">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                        {tabTitles[activeTab]}
                    </h1>
                </div>

                {/* Main Content Area */}
                <main className="flex-1 p-4 lg:p-6">
                    <div className="max-w-7xl mx-auto">
                        <ActiveComponent 
                            navigate={navigate} 
                            searchQuery={searchQuery}
                        />
                    </div>
                </main>
            </div>
        </div>
    );
}
