import React, { useEffect, useState } from 'react';
import { fetchFunnelStats } from '../AnalyticsDashboard/api';

export default function FunnelChart({ funnel }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFunnelStats(funnel._id)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [funnel]);

  if (loading) return <div className="h-40 flex items-center justify-center text-gray-500">Loading funnel...</div>;

  // Simple bar chart using flex (recharts dependency optional)
  const maxCount = Math.max(...data.map(d => d.count), 1);

  return (
    <div className="mb-8 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-4">{funnel.name}</h3>
      <div className="space-y-3">
        {data.map((step, idx) => (
          <div key={idx}>
            <div className="flex justify-between text-sm mb-1">
              <span>{step.name}</span>
              <span className="font-mono">{step.count.toLocaleString()} users</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-6 overflow-hidden">
              <div
                className="bg-accent-500 h-full flex items-center px-2 text-xs text-white font-medium"
                style={{ width: `${(step.count / maxCount) * 100}%` }}
              >
                {step.conversionRate ? `${step.conversionRate.toFixed(1)}%` : ''}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}