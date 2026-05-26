import React, { useState, useEffect } from 'react';
import { Activity, Search, RefreshCw, Trash2, Download } from 'lucide-react';

const API_BASE = '/api/v1'; // changed from /api/admin

export default function ActivityLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/activity`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      const logsArray = Array.isArray(data) ? data : (data.data || []);
      setLogs(logsArray);
    } catch (err) {
      console.error('Failed to load activity logs');
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleClear = async () => {
    if (!window.confirm('Delete all activity logs? This cannot be undone.')) return;
    try {
      const res = await fetch(`${API_BASE}/activity/clear`, { method: 'DELETE' });
      if (res.ok) fetchLogs();
    } catch (err) {
      console.error('Clear failed');
    }
  };

  const handleExport = () => {
    const filtered = logs.filter(log => {
      const matchSearch = !search || log.label?.toLowerCase().includes(search.toLowerCase()) || log.user?.toLowerCase().includes(search.toLowerCase());
      const matchAction = actionFilter === 'all' || log.action === actionFilter;
      return matchSearch && matchAction;
    });
    const csv = ['Timestamp,User,Action,Label,Detail', ...filtered.map(l => `${l.timestamp},${l.user},${l.action},${l.label},${l.detail || ''}`)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activity-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = logs.filter(log => {
    const matchSearch = !search || log.label?.toLowerCase().includes(search.toLowerCase()) || log.user?.toLowerCase().includes(search.toLowerCase());
    const matchAction = actionFilter === 'all' || log.action === actionFilter;
    return matchSearch && matchAction;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Activity Log</h2>
          <p className="text-sm text-muted">Track admin actions and system events</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchLogs} className="p-2 rounded-lg border hover:bg-surface"><RefreshCw size={16} /></button>
          <button onClick={handleExport} className="p-2 rounded-lg border hover:bg-surface"><Download size={16} /></button>
          <button onClick={handleClear} className="p-2 rounded-lg border text-red-500 hover:bg-red-50"><Trash2 size={16} /></button>
        </div>
      </div>
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search events..." className="input-base w-full pl-9 py-2 rounded-lg" />
        </div>
        <select value={actionFilter} onChange={e => setActionFilter(e.target.value)} className="input-base rounded-lg px-3">
          <option value="all">All Actions</option>
          <option value="settings_save">Settings</option>
          <option value="content_update">Content</option>
          <option value="user_login">Login</option>
          <option value="user_create">User Created</option>
        </select>
      </div>
      {loading ? (
        <div className="text-center py-12 text-muted">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-muted">No activity found</div>
      ) : (
        <div className="divide-y border rounded-xl overflow-hidden">
          {filtered.map(log => (
            <div key={log.id} className="flex items-start gap-4 p-4 hover:bg-surface/50">
              <div className="w-2 h-2 mt-2 rounded-full bg-accent"></div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">{log.label}</span>
                  <span className="text-xs text-muted bg-surface px-2 py-0.5 rounded-full">{log.user}</span>
                </div>
                {log.detail && <p className="text-xs text-muted mt-1">{log.detail}</p>}
              </div>
              <div className="text-xs text-muted whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
