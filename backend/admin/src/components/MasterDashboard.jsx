import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, LogOut, RefreshCw, Users } from 'lucide-react';

export default function MasterDashboard() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const fetchTenants = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/master/tenants', { credentials: 'include' });
      if (!res.ok) throw new Error();
      const data = await res.json();
      // Extract tenants from data.data (the response is wrapped)
      setTenants(data.data || data);
    } catch (err) {
      console.error('Failed to fetch tenants', err);
    } finally {
      setLoading(false);
    }
};

  useEffect(() => {
    fetchTenants();
  }, []);

  const switchTenant = async (dbName) => {
    try {
      const res = await fetch(`/api/v1/master/switch-tenant/${dbName}`, {
        method: 'POST',
        credentials: 'include',
      });
      if (res.ok) {
        // Reload the page to apply new JWT (or navigate to /dashboard)
        window.location.href = '/dashboard';
      } else {
        alert('Failed to switch tenant');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/v1/auth/logout', { method: 'POST', credentials: 'include' });
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="animate-spin mr-2" /> Loading tenants...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Master Admin Panel</h1>
          <p className="text-muted mt-1">Select a tenant to manage</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tenants.map((tenant) => (
          <div
            key={tenant.dbName}
            className="border rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer bg-white dark:bg-gray-900"
            onClick={() => switchTenant(tenant.dbName)}
          >
            <div className="flex items-center justify-between mb-3">
              <Building2 size={24} className="text-accent" />
              <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                {tenant.dbName}
              </span>
            </div>
            <h3 className="text-xl font-semibold mb-1">{tenant.name}</h3>
            <p className="text-sm text-muted">{tenant.domain}</p>
            <div className="mt-4 text-xs text-accent flex items-center gap-1">
              <Users size={12} /> Click to manage users and content
            </div>
          </div>
        ))}
      </div>

      {tenants.length === 0 && (
        <div className="text-center text-muted py-12">
          No tenants found. Create one via the tenant creation API.
        </div>
      )}
    </div>
  );
}