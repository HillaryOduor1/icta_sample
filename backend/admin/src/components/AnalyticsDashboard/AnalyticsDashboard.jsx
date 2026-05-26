import React, { useState, useEffect } from 'react';
import DateRangePicker from './DateRangePicker';
import FunnelChart from '../Charts/FunnelChart';
import RetentionMatrix from '../Charts/RetentionMatrix';
import HeatmapView from '../Charts/HeatmapView';
import { fetchStats, fetchFunnels, fetchRetention, fetchUsage } from './api';

export default function AnalyticsDashboard() {
  const [range, setRange] = useState('30d');
  const [stats, setStats] = useState(null);
  const [funnels, setFunnels] = useState([]);
  const [retention, setRetention] = useState([]);
  const [usage, setUsage] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [range]);

  async function loadData() {
    setLoading(true);
    try {
      const [statsData, funnelsData, retentionData, usageData] = await Promise.all([
        fetchStats(range),
        fetchFunnels(),
        fetchRetention(range),
        fetchUsage(range)
      ]);
      setStats(statsData);
      setFunnels(funnelsData);
      setRetention(retentionData);
      setUsage(usageData);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  }

  const StatCard = ({ title, value }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      <p className="text-3xl font-bold text-gray-900 dark:text-white">{value?.toLocaleString() ?? 0}</p>
    </div>
  );

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading analytics data...</div>;
  }

  return (
    <div className="p-4 lg:p-6 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
        <DateRangePicker value={range} onChange={setRange} />
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-800">
        {['overview', 'funnels', 'retention', 'heatmaps', 'billing'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium transition-all capitalize ${
              activeTab === tab
                ? 'border-b-2 border-accent-500 text-accent-600 dark:text-accent-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Unique Visitors" value={stats.visitors} />
          <StatCard title="Sessions" value={stats.sessions} />
          <StatCard title="Page Views" value={stats.pageViews} />
          <StatCard title="Events" value={stats.events} />
        </div>
      )}

      {/* Funnels Tab */}
      {activeTab === 'funnels' && (
        <div>
          <h2 className="text-xl font-bold mb-4">Conversion Funnels</h2>
          {funnels.length === 0 && (
            <p className="text-gray-500">No funnels created yet. Use the "New Funnel" button to start tracking conversions.</p>
          )}
          {funnels.map(funnel => (
            <FunnelChart key={funnel._id} funnel={funnel} />
          ))}
          <button
            onClick={() => alert('Create funnel UI – implement as needed')}
            className="mt-4 px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors"
          >
            + New Funnel
          </button>
        </div>
      )}

      {/* Retention Tab */}
      {activeTab === 'retention' && <RetentionMatrix data={retention} />}

      {/* Heatmaps Tab */}
      {activeTab === 'heatmaps' && <HeatmapView />}

      {/* Billing Tab */}
      {activeTab === 'billing' && usage && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-4">Usage & Billing (current period)</h2>
          <div className="space-y-3">
            {usage.usage.map(u => (
              <div key={u._id} className="flex justify-between border-b border-gray-200 dark:border-gray-700 py-2">
                <span className="capitalize font-medium">{u._id}</span>
                <span>{u.total.toLocaleString()}</span>
              </div>
            ))}
            <div className="flex justify-between font-bold text-lg pt-4">
              <span>Estimated Cost (USD)</span>
              <span>${(usage.totalCost || 0).toFixed(2)}</span>
            </div>
          </div>
          <button className="mt-6 px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors">
            View Invoices
          </button>
        </div>
      )}
    </div>
  );
}