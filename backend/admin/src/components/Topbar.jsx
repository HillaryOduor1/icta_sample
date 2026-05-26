import React from 'react';
import { Bell, Search } from 'lucide-react';

export default function Topbar({ title, onSearch }) {
    return (
        <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                {title}
            </h1>
            
            <div className="flex items-center gap-2">
                {/* Search */}
                <div className="relative">
                    <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search..."
                        onChange={(e) => onSearch?.(e.target.value)}
                        className="w-48 pl-8 pr-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-accent-500"
                    />
                </div>

                {/* Notifications */}
                <button className="relative p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                    <Bell size={16} className="text-gray-600 dark:text-gray-400" />
                    <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
                </button>

                {/* User Avatar */}
                <div className="w-7 h-7 rounded-full bg-gradient-to-r from-accent-500 to-accent-600 flex items-center justify-center">
                    <span className="text-white text-xs font-medium">A</span>
                </div>
            </div>
        </div>
    );
}
/*import React, { useState } from 'react';
import { Menu, Bell, Search } from 'lucide-react';

export default function Topbar({ onMenuClick, title, onSearch }) {
    const [showNotifications, setShowNotifications] = useState(false);

    return (
        <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center px-4 lg:px-5">
            <div className="flex items-center justify-between w-full">
                {/* Left section /}
                <div className="flex items-center gap-3">
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        <Menu size={18} className="text-gray-600 dark:text-gray-400" />
                    </button>
                    <h1 className="text-base font-semibold text-gray-900 dark:text-white">
                        {title}
                    </h1>
                </div>

                {/* Right section /}
                <div className="flex items-center gap-2">
                    {/* Search - compact /}
                    <div className="relative hidden md:block">
                        <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            onChange={(e) => onSearch?.(e.target.value)}
                            className="w-48 pl-8 pr-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-accent-500"
                        />
                    </div>

                    {/* Notifications /}
                    <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 relative">
                        <Bell size={16} className="text-gray-600 dark:text-gray-400" />
                        <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
                    </button>

                    {/* User avatar /}
                    <div className="w-7 h-7 rounded-full bg-accent-600 flex items-center justify-center">
                        <span className="text-white text-xs font-medium">A</span>
                    </div>
                </div>
            </div>
        </header>
    );
}*/