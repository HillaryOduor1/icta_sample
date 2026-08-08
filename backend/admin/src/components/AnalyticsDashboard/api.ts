// All API calls now use /api/v1/analytics
export async function fetchStats(range: string) {
  const res = await fetch(`/api/v1/analytics/stats?range=${range}`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
}

export async function fetchFunnels() {
  const res = await fetch('/api/v1/analytics/funnels', { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch funnels');
  return res.json();
}

export async function fetchFunnelStats(funnelId: string) {
  const res = await fetch(`/api/v1/analytics/funnels/${funnelId}/stats`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch funnel stats');
  return res.json();
}

export async function fetchRetention(range: string) {
  const res = await fetch(`/api/v1/analytics/retention?range=${range}`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch retention data');
  return res.json();
}

export async function fetchUsage(range: string) {
  const res = await fetch(`/api/v1/analytics/usage?range=${range}`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch usage data');
  return res.json();
}

export async function fetchHeatmapData(page: string, range = '30d') {
  const res = await fetch(`/api/v1/analytics/heatmap?page=${encodeURIComponent(page)}&range=${range}`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch heatmap data');
  return res.json();
}
