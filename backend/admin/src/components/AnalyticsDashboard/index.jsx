/*import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { LineChart, BarChart, Heatmap, FunnelChart, RetentionMatrix } from './../Charts';
import DateRangePicker from './DateRangePicker';
import { fetchStats, fetchFunnels, fetchRetention, fetchUsage } from './api';

export default function AnalyticsDashboard() {
  const [range, setRange] = useState('30d');
  const [stats, setStats] = useState(null);
  const [funnels, setFunnels] = useState([]);
  const [retention, setRetention] = useState([]);
  const [usage, setUsage] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadData();
  }, [range]);

  async function loadData() {
    const statsData = await fetchStats(range);
    setStats(statsData);
    const funnelsData = await fetchFunnels();
    setFunnels(funnelsData);
    const retentionData = await fetchRetention(range);
    setRetention(retentionData);
    const usageData = await fetchUsage(range);
    setUsage(usageData);
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black">Analytics Dashboard</h1>
        <DateRangePicker value={range} onChange={setRange} />
      </div>

      {/* Tab Navigation /}
      <div className="flex gap-2 border-b">
        {['overview', 'funnels', 'retention', 'heatmaps', 'billing'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-2 font-semibold ${activeTab === tab ? 'border-b-2 border-primary text-primary' : ''}`}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Overview Tab /}
      {activeTab === 'overview' && stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard title="Visitors" value={stats.visitors} />
          <StatCard title="Sessions" value={stats.sessions} />
          <StatCard title="Page Views" value={stats.pageViews} />
          <StatCard title="Events" value={stats.events} />
        </div>
      )}

      {/* Funnels Tab /}
      {activeTab === 'funnels' && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Conversion Funnels</h2>
          {funnels.map(funnel => <FunnelChart key={funnel._id} funnel={funnel} />)}
          <button className="btn-primary mt-4" onClick={() => {/* open modal to create funnel /}}>+ New Funnel</button>
        </div>
      )}

      {/* Retention Tab /}
      {activeTab === 'retention' && (
        <RetentionMatrix data={retention} />
      )}

      {/* Heatmaps Tab /}
      {activeTab === 'heatmaps' && (
        <HeatmapView />
      )}

      {/* Billing Tab /}
      {activeTab === 'billing' && usage && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <h2 className="text-2xl font-bold mb-4">Current Usage & Billing</h2>
          <div className="space-y-3">
            {usage.usage.map(u => (
              <div key={u._id} className="flex justify-between border-b py-2">
                <span className="capitalize">{u._id}</span>
                <span>{u.total.toLocaleString()}</span>
              </div>
            ))}
            <div className="flex justify-between font-bold text-lg pt-4">
              <span>Estimated Cost</span>
              <span>${usage.totalCost.toFixed(2)}</span>
            </div>
          </div>
          <button className="btn-primary mt-6">View Invoices</button>
        </div>
      )}
    </div>
  );
}

const StatCard = ({ title, value }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-3xl font-bold">{value}</p>
  </div>
);*/