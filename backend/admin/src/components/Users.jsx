import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit2, Trash2, RefreshCw, Clock, CheckCircle } from 'lucide-react';
import PendingUsers from './PendingUsers';
import CreateUserModal from './CreateUserModal';

const API_BASE = '/api/v1';

export default function UsersManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active'); // 'active' or 'pending'
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/users`, { credentials: 'include' });
      const data = await res.json();
      setUsers(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const toggleStatus = async (id) => {
    try {
      await fetch(`${API_BASE}/users/${id}/toggle-status`, { method: 'PATCH', credentials: 'include' });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await fetch(`${API_BASE}/users/${id}`, { method: 'DELETE', credentials: 'include' });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Management</h2>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-accent text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={16} /> Add User
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={() => setActiveTab('active')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'active'
              ? 'text-accent-600 border-b-2 border-accent-600'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
          }`}
        >
          <Users size={16} className="inline mr-2" />
          Active Users ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'pending'
              ? 'text-accent-600 border-b-2 border-accent-600'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
          }`}
        >
          <Clock size={16} className="inline mr-2" />
          Pending Approvals
        </button>
      </div>

      {activeTab === 'active' ? (
        <>
          {loading ? (
            <div className="text-center py-12">
              <RefreshCw className="animate-spin inline mr-2" /> Loading...
            </div>
          ) : (
            <div className="border rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800 border-b">
                  <tr>
                    <th className="p-3 text-left">Username</th>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-left">Role</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="p-3">{u.username}</td>
                      <td className="p-3">{u.email}</td>
                      <td className="p-3">
                        <span className="capitalize px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-800">
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          u.active 
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {u.active ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td className="p-3 flex gap-2">
                        <button 
                          onClick={() => toggleStatus(u._id)} 
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                          title={u.active ? 'Disable' : 'Enable'}
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          onClick={() => deleteUser(u._id)} 
                          className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : (
        <PendingUsers />
      )}

      {/* Create User Modal */}
      <CreateUserModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          fetchUsers();
          setShowCreateModal(false);
        }}
      />
    </div>
  );
}
