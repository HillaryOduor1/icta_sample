import React, { useState, useEffect } from 'react';
import {
    BarChart2, Globe, Users, Server, ArrowUpRight, ArrowDownRight,
    Activity, Settings2, FileText, LogIn, RefreshCw, Zap, TrendingUp
} from 'lucide-react';

const API_BASE = '/api/v1';

const ACTION_ICONS = {
    settings_save: Settings2,
    content_update: FileText,
    user_login: LogIn,
    default: Activity,
};

// Helper: time ago
function timeAgo(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const intervals = [
        { label: 'y', seconds: 31536000 },
        { label: 'mo', seconds: 2592000 },
        { label: 'd', seconds: 86400 },
        { label: 'h', seconds: 3600 },
        { label: 'm', seconds: 60 },
    ];

    for (let i of intervals) {
        const count = Math.floor(seconds / i.seconds);
        if (count > 0) return `${count}${i.label} ago`;
    }
    return 'just now';
}

function StatCard({ label, value, icon: Icon, trend, up, subtitle }) {
    return (
        <div className="rounded-2xl bg-white dark:bg-gray-900 p-5 border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
                <div className="p-2 rounded-xl bg-accent-50 dark:bg-accent-900/20">
                    <Icon size={20} className="text-accent-600 dark:text-accent-400" />
                </div>
                {trend && (
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${up ? 'text-green-600 bg-green-50 dark:bg-green-900/20' : 'text-red-600 bg-red-50 dark:bg-red-900/20'}`}>
                        {up ? <ArrowUpRight size={12} className="inline mr-0.5" /> : <ArrowDownRight size={12} className="inline mr-0.5" />}
                        {trend}
                    </span>
                )}
            </div>
            <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{label}</div>
                {subtitle && <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">{subtitle}</div>}
            </div>
        </div>
    );
}

/* Activity Feed */
function ActivityFeed({ navigate }) {
    const [activity, setActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchActivity = () => {
        setLoading(true);
        fetch(`${API_BASE}/activity`)
            .then(res => res.json())
            .then(data => {
                setActivity(data.slice(0, 6));
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        //fetchActivity();
        const fetchStats = async () => {
  setLoading(true);
  try {
    const res = await fetch(`${API_BASE}/stats`);
    const data = await res.json();
    setStats(data);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};
    }, []);

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-accent-50 dark:bg-accent-900/20">
                        <Activity size={16} className="text-accent-600 dark:text-accent-400" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
                </div>
                <button onClick={fetchActivity} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <RefreshCw size={14} className="text-gray-500 dark:text-gray-400" />
                </button>
            </div>

            {loading ? (
                <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">Loading activity...</div>
            ) : activity.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">No recent activity</div>
            ) : (
                <div className="space-y-3">
                    {activity.map(a => {
                        const Icon = ACTION_ICONS[a.action] || ACTION_ICONS.default;
                        return (
                            <div key={a.id} className="flex gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                <div className="p-1.5 rounded-lg bg-accent-50 dark:bg-accent-900/20">
                                    <Icon size={14} className="text-accent-600 dark:text-accent-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">{a.label}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{a.detail}</div>
                                </div>
                                <div className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">
                                    {timeAgo(a.timestamp)}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

/* Quick Actions */
const quickActions = [
    { label: 'Edit Content', section: 'content', icon: FileText, color: 'blue' },
    { label: 'Settings', section: 'settings', icon: Settings2, color: 'purple' },
    { label: 'Users', section: 'users', icon: Users, color: 'green' },
    { label: 'Activity Log', section: 'activity', icon: Activity, color: 'orange' },
];

function QuickActions({ navigate }) {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-accent-50 dark:bg-accent-900/20">
                    <Zap size={16} className="text-accent-600 dark:text-accent-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
                {quickActions.map((a, i) => {
                    const Icon = a.icon;
                    return (
                        <button
                            key={i}
                            onClick={() => navigate(a.section)}
                            className="flex items-center gap-2 p-3 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-gray-700 transition-all text-left group"
                        >
                            <Icon size={16} className="text-gray-500 dark:text-gray-400 group-hover:text-accent-500 transition-colors" />
                            {a.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

/* System Status */
function SystemStatus() {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-accent-50 dark:bg-accent-900/20">
                    <TrendingUp size={16} className="text-accent-600 dark:text-accent-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">System Status</h3>
            </div>
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">API Response</span>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">124ms</span>
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Database</span>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">Connected</span>
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Cache</span>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">85% Used</span>
                        <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                    </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Uptime</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">99.9%</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* Main Overview Component */
export default function Overview({ navigate }) {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = () => {
        setLoading(true);
        fetch(`${API_BASE}/stats`)
            .then(r => r.json())
            .then(data => {
                setStats(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const cards = [
        { label: 'Content Sections', value: stats?.sectionCount || 8, icon: BarChart2, subtitle: 'Total managed sections' },
        { label: 'Theme Mode', value: stats?.themeMode || 'Dark', icon: Globe, subtitle: 'Current appearance' },
        { label: 'Active Users', value: stats?.activeUsers?.toLocaleString() || '1,284', icon: Users, subtitle: 'Last 30 days' },
        { label: 'Server Load', value: stats?.serverLoad || '24%', icon: Server, trend: '-5%', up: false, subtitle: 'Current utilization' },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">Real-time metrics and system status</p>
                </div>
                <button 
                    onClick={fetchStats}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all border border-gray-200 dark:border-gray-700"
                >
                    <RefreshCw size={12} />
                    Refresh
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                        <RefreshCw className="animate-spin" size={20} />
                        <span className="text-sm">Loading dashboard data...</span>
                    </div>
                </div>
            ) : (
                <>
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {cards.map((c, i) => <StatCard key={i} {...c} />)}
                    </div>

                    {/* Secondary Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <ActivityFeed navigate={navigate} />
                        </div>
                        <div className="space-y-6">
                            <QuickActions navigate={navigate} />
                            <SystemStatus />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
