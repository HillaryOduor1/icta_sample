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
/*import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit2, Trash2, RefreshCw } from 'lucide-react';

const API_BASE = '/api/v1'; // changed

export default function UsersManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

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
        <button className="bg-accent text-white px-4 py-2 rounded-lg flex items-center gap-2"><Plus size={16} /> Add User</button>
      </div>
      {loading ? (
        <div className="text-center py-12"><RefreshCw className="animate-spin inline mr-2" /> Loading...</div>
      ) : (
        <div className="border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface border-b">
              <tr><th className="p-3 text-left">Username</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} className="border-b hover:bg-surface/50">
                  <td className="p-3">{u.username}</td>
                  <td>{u.email}</td>
                  <td><span className="capitalize">{u.role}</span></td>
                  <td><span className={`px-2 py-1 rounded-full text-xs ${u.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{u.active ? 'Active' : 'Disabled'}</span></td>
                  <td className="flex gap-2">
                    <button onClick={() => toggleStatus(u._id, u.active)} className="p-1 hover:bg-surface rounded"><Edit2 size={14} /></button>
                    <button onClick={() => deleteUser(u._id)} className="p-1 hover:bg-red-50 text-red-500 rounded"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}*/


/*
// src/components/Users.jsx
import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit2, Trash2, RefreshCw } from 'lucide-react';

const API_BASE = '/api/v1';

export default function UsersManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/users`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const toggleStatus = async (id, currentActive) => {
    try {
      await fetch(`${API_BASE}/users/${id}/toggle-status`, { method: 'PATCH' });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await fetch(`${API_BASE}/users/${id}`, { method: 'DELETE' });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };*/


/*import React, { useState, useEffect } from 'react';
import {
    Users as UsersIcon, UserPlus, Search, Edit2, Trash2,
    Shield, ShieldOff, ChevronDown, Check, X, RefreshCw, User
} from 'lucide-react';

var API_BASE = '/api/admin';

var MOCK_USERS = [
    { id: 1, username: 'admin', email: 'admin@example.com', role: 'admin', active: true, lastLogin: '2026-02-20T00:00:00Z', created: '2025-01-01T00:00:00Z' },
    { id: 2, username: 'editor', email: 'editor@example.com', role: 'editor', active: true, lastLogin: '2026-02-19T12:00:00Z', created: '2025-03-15T00:00:00Z' },
    { id: 3, username: 'viewer', email: 'viewer@example.com', role: 'viewer', active: false, lastLogin: '2026-01-10T10:00:00Z', created: '2025-06-01T00:00:00Z' },
];

var ROLE_COLORS = {
    admin: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20',
    editor: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
    viewer: 'text-slate-600 bg-slate-100 dark:bg-slate-700',
};

function Avatar({ username }) {
    return (
        <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
            style={{ background: 'var(--accent)' }}
        >
            {username ? username[0].toUpperCase() : '?'}
        </div>
    );
}

function UserModal({ user, onClose, onSave }) {
    var [form, setForm] = useState(
        user || { username: '', email: '', role: 'viewer', active: true, password: '' }
    );

    var handleSubmit = function (e) {
        e.preventDefault();
        onSave(form);
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-background border border-border rounded-2xl shadow-2xl p-6 animate-fade-in">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-bold text-foreground">
                        {user ? 'Edit User' : 'Add New User'}
                    </h3>
                    <button onClick={onClose} className="text-muted hover:text-foreground">
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-foreground block mb-1.5">Username</label>
                        <input
                            type="text"
                            required
                            value={form.username}
                            onChange={function (e) { setForm({ ...form, username: e.target.value }); }}
                            className="input-base w-full px-3 py-2 text-sm rounded-lg"
                            placeholder="username"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-foreground block mb-1.5">Email</label>
                        <input
                            type="email"
                            required
                            value={form.email}
                            onChange={function (e) { setForm({ ...form, email: e.target.value }); }}
                            className="input-base w-full px-3 py-2 text-sm rounded-lg"
                            placeholder="user@example.com"
                        />
                    </div>
                    {!user && (
                        <div>
                            <label className="text-sm font-medium text-foreground block mb-1.5">Password</label>
                            <input
                                type="password"
                                required
                                value={form.password}
                                onChange={function (e) { setForm({ ...form, password: e.target.value }); }}
                                className="input-base w-full px-3 py-2 text-sm rounded-lg"
                                placeholder="••••••••"
                            />
                        </div>
                    )}
                    <div>
                        <label className="text-sm font-medium text-foreground block mb-1.5">Role</label>
                        <select
                            value={form.role}
                            onChange={function (e) { setForm({ ...form, role: e.target.value }); }}
                            className="input-base w-full px-3 py-2 text-sm rounded-lg cursor-pointer"
                        >
                            <option value="viewer">Viewer — Read only</option>
                            <option value="editor">Editor — Edit content</option>
                            <option value="admin">Admin — Full access</option>
                        </select>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={form.active}
                            onChange={function (e) { setForm({ ...form, active: e.target.checked }); }}
                            className="accent-accent"
                        />
                        <span className="text-sm font-medium text-foreground">Active account</span>
                    </label>
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2 rounded-lg border border-border text-sm font-medium text-muted hover:bg-surface transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-2 rounded-lg text-sm font-bold text-white transition-all hover:opacity-90"
                            style={{ background: 'var(--accent)' }}
                        >
                            {user ? 'Save Changes' : 'Create User'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function formatDate(iso) {
    if (!iso) return '—';
    try {
        return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) { return iso; }
}

export default function UsersManager() {
    var [users, setUsers] = useState(MOCK_USERS);
    var [search, setSearch] = useState('');
    var [roleFilter, setRoleFilter] = useState('all');
    var [modalUser, setModalUser] = useState(null); // null=closed, false=new, object=edit
    var [loading, setLoading] = useState(false);

    useEffect(function () {
        // Try to load from backend, fall back to mock
        fetch(API_BASE + '/users')
            .then(function (r) { if (!r.ok) throw new Error(); return r.json(); })
            .then(function (data) { if (Array.isArray(data) && data.length) setUsers(data); })
            .catch(function () { /* use mock data / });
    }, []);

    var saveUsers = function (nextUsers) {
        setUsers(nextUsers);
        fetch(API_BASE + '/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nextUsers),
        }).catch(function () { });
    };

    var handleSave = function (form) {
        if (modalUser && modalUser.id) {
            // edit
            saveUsers(users.map(function (u) { return u.id === modalUser.id ? { ...u, ...form } : u; }));
        } else {
            // create
            var next = { ...form, id: Date.now(), lastLogin: null, created: new Date().toISOString() };
            saveUsers(users.concat(next));
        }
        setModalUser(null);
    };

    var handleDelete = function (id) {
        if (window.confirm('Delete this user?')) {
            saveUsers(users.filter(function (u) { return u.id !== id; }));
        }
    };

    var handleToggleActive = function (id) {
        saveUsers(users.map(function (u) { return u.id === id ? { ...u, active: !u.active } : u; }));
    };

    var filtered = users.filter(function (u) {
        var matchSearch = !search
            || u.username.toLowerCase().includes(search.toLowerCase())
            || u.email.toLowerCase().includes(search.toLowerCase());
        var matchRole = roleFilter === 'all' || u.role === roleFilter;
        return matchSearch && matchRole;
    });

    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
            {/* Header /}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Users</h2>
                    <p className="text-sm text-muted mt-0.5">Manage admin accounts and permissions</p>
                </div>
                <button
                    onClick={function () { setModalUser(false); }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
                    style={{ background: 'var(--accent)' }}
                >
                    <UserPlus size={16} />
                    Add User
                </button>
            </div>

            {/* Stats row /}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: 'Total Users', value: users.length, icon: UsersIcon },
                    { label: 'Active', value: users.filter(function (u) { return u.active; }).length, icon: Check },
                    { label: 'Admins', value: users.filter(function (u) { return u.role === 'admin'; }).length, icon: Shield },
                ].map(function (s, i) {
                    var Icon = s.icon;
                    return (
                        <div key={i} className="card p-4 flex items-center gap-3">
                            <div className="p-2 rounded-lg" style={{ background: 'rgba(var(--accent-rgb),0.1)', color: 'var(--accent)' }}>
                                <Icon size={18} />
                            </div>
                            <div>
                                <div className="text-xl font-bold text-foreground">{s.value}</div>
                                <div className="text-xs text-muted">{s.label}</div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Filters /}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                        type="text"
                        value={search}
                        onChange={function (e) { setSearch(e.target.value); }}
                        placeholder="Search users..."
                        className="input-base w-full pl-9 pr-4 py-2 text-sm rounded-lg"
                    />
                </div>
                <select
                    value={roleFilter}
                    onChange={function (e) { setRoleFilter(e.target.value); }}
                    className="input-base px-3 py-2 text-sm rounded-lg cursor-pointer"
                >
                    <option value="all">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="editor">Editor</option>
                    <option value="viewer">Viewer</option>
                </select>
            </div>

            {/* User table /}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="border-b border-border bg-surface">
                            <tr>
                                <th className="text-left px-4 py-3 font-semibold text-muted">User</th>
                                <th className="text-left px-4 py-3 font-semibold text-muted hidden sm:table-cell">Role</th>
                                <th className="text-left px-4 py-3 font-semibold text-muted hidden md:table-cell">Last Login</th>
                                <th className="text-left px-4 py-3 font-semibold text-muted hidden lg:table-cell">Created</th>
                                <th className="text-left px-4 py-3 font-semibold text-muted">Status</th>
                                <th className="text-right px-4 py-3 font-semibold text-muted">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filtered.length === 0 && (
                                <tr key="no-users">
                                    <td colSpan={6} className="text-center py-10 text-muted">
                                        <User size={32} className="mx-auto mb-2 opacity-30" />
                                        No users found
                                    </td>
                                </tr>
                            )}
                            {filtered.map(function (user) {
                                return (
                                    <tr key={user._id || user.id} className="hover:bg-surface/50 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <Avatar username={user.username} />
                                                <div>
                                                    <div className="font-semibold text-foreground">{user.username}</div>
                                                    <div className="text-xs text-muted">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 hidden sm:table-cell">
                                            <span className={'text-xs font-semibold px-2 py-1 rounded-full ' + (ROLE_COLORS[user.role] || '')}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-muted hidden md:table-cell">{formatDate(user.lastLogin)}</td>
                                        <td className="px-4 py-3 text-muted hidden lg:table-cell">{formatDate(user.created)}</td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={function () { handleToggleActive(user.id); }}
                                                className={'text-xs font-semibold px-2 py-1 rounded-full ' + (user.active ? 'text-green-600 bg-green-50 dark:bg-green-900/20' : 'text-red-500 bg-red-50 dark:bg-red-900/20')}
                                            >
                                                {user.active ? 'Active' : 'Inactive'}
                                            </button>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={function () { setModalUser(user); }}
                                                    className="p-1.5 rounded-lg text-muted hover:bg-surface hover:text-foreground transition-all"
                                                    title="Edit user"
                                                >
                                                    <Edit2 size={15} />
                                                </button>
                                                <button
                                                    onClick={function () { handleDelete(user.id); }}
                                                    className="p-1.5 rounded-lg text-muted hover:bg-red-50 hover:text-red-500 transition-all"
                                                    title="Delete user"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal /}
            {modalUser !== null && (
                <UserModal
                    user={modalUser || null}
                    onClose={function () { setModalUser(null); }}
                    onSave={handleSave}
                />
            )}
        </div>
    );
}*/
