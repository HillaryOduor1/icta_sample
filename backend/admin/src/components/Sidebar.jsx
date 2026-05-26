import React, { useState } from 'react';
import {
    LayoutDashboard, FileText, Settings, Users, Activity, MessageSquare,
    LogOut, Sun, Moon, ChevronLeft, ChevronRight,
    X
} from 'lucide-react';

const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'content', label: 'Content', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'contact-messages', label: 'Contact Messages', icon: MessageSquare },
];

export default function Sidebar({ 
    activeTab, 
    setActiveTab, 
    onLogout, 
    theme, 
    toggleTheme, 
    isMobileOpen, 
    setMobileOpen,
    isCollapsed,
    setIsCollapsed 
}) {
    return (
        <>
            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar - directly attached to left edge */}
            <aside
                className={`
                    fixed lg:static top-0 left-0 h-full z-50
                    bg-white dark:bg-gray-900
                    border-r border-gray-200 dark:border-gray-800
                    transition-all duration-300 ease-in-out
                    ${isCollapsed ? 'w-20' : 'w-64'}
                    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
            >
                {/* Logo - compact */}
                <div className="h-16 flex items-center px-4 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-2 w-full">
                        <div className="w-8 h-8 rounded-lg bg-accent-600 flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-sm">L</span>
                        </div>
                        {!isCollapsed && (
                            <>
                                <span className="font-semibold text-gray-900 dark:text-white text-sm flex-1">
                                    Admin CMS
                                </span>
                                <button
                                    onClick={() => setIsCollapsed(!isCollapsed)}
                                    className="hidden lg:block p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                                >
                                    <ChevronLeft size={16} className="text-gray-500" />
                                </button>
                            </>
                        )}
                        {isCollapsed && (
                            <button
                                onClick={() => setIsCollapsed(!isCollapsed)}
                                className="hidden lg:block p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 ml-auto"
                            >
                                <ChevronRight size={16} className="text-gray-500" />
                            </button>
                        )}
                        <button
                            onClick={() => setMobileOpen(false)}
                            className="lg:hidden p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            <X size={16} className="text-gray-500" />
                        </button>
                    </div>
                </div>

                {/* Navigation - compact spacing */}
                <nav className="p-2 space-y-0.5">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        
                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setActiveTab(item.id);
                                    setMobileOpen(false);
                                }}
                                className={`
                                    w-full flex items-center gap-3 px-3 py-2 rounded-lg
                                    transition-all duration-200
                                    ${isCollapsed ? 'justify-center' : ''}
                                    ${isActive 
                                        ? 'bg-accent-50 dark:bg-accent-900/20 text-accent-600 dark:text-accent-400' 
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }
                                `}
                            >
                                <Icon size={18} />
                                {!isCollapsed && (
                                    <span className="text-sm font-medium">{item.label}</span>
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* Footer - compact */}
                <div className="absolute bottom-0 left-0 right-0 p-2 border-t border-gray-200 dark:border-gray-800">
                    <button
                        onClick={toggleTheme}
                        className={`
                            w-full flex items-center gap-3 px-3 py-2 rounded-lg
                            text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800
                            transition-all mb-1
                            ${isCollapsed ? 'justify-center' : ''}
                        `}
                    >
                        {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                        {!isCollapsed && (
                            <span className="text-sm">{theme === 'light' ? 'Dark' : 'Light'}</span>
                        )}
                    </button>

                    <button
                        onClick={onLogout}
                        className={`
                            w-full flex items-center gap-3 px-3 py-2 rounded-lg
                            text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20
                            transition-all
                            ${isCollapsed ? 'justify-center' : ''}
                        `}
                    >
                        <LogOut size={18} />
                        {!isCollapsed && (
                            <span className="text-sm">Logout</span>
                        )}
                    </button>
                </div>
            </aside>
        </>
    );
}
