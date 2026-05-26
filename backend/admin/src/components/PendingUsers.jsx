import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, RefreshCw, Mail, User, Calendar } from 'lucide-react';

export default function PendingUsers() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(null);

  const fetchPendingUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/v1/users/pending', {
        credentials: 'include'
      });
      const data = await response.json();
      setPendingUsers(data.data?.users || []);
    } catch (error) {
      console.error('Failed to fetch pending users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const handleApprove = async (userId) => {
    setActionLoading(userId);
    try {
      const response = await fetch(`/api/v1/users/pending/${userId}/approve`, {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        await fetchPendingUsers();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to approve user');
      }
    } catch (error) {
      console.error('Error approving user:', error);
      alert('Failed to approve user');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (userId) => {
    if (!rejectReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    
    setActionLoading(userId);
    try {
      const response = await fetch(`/api/v1/users/pending/${userId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ reason: rejectReason })
      });
      
      if (response.ok) {
        setShowRejectModal(null);
        setRejectReason('');
        await fetchPendingUsers();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to reject user');
      }
    } catch (error) {
      console.error('Error rejecting user:', error);
      alert('Failed to reject user');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <RefreshCw className="animate-spin inline mr-2" />
        Loading pending registrations...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Pending Approvals</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Review and approve user registration requests
          </p>
        </div>
        <button
          onClick={fetchPendingUsers}
          className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <RefreshCw size={16} className="inline mr-2" />
          Refresh
        </button>
      </div>

      {pendingUsers.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
          <Clock size={48} className="mx-auto text-gray-400 mb-3" />
          <p className="text-gray-600 dark:text-gray-400">No pending registration requests</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {pendingUsers.map((user) => (
            <div
              key={user._id}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-accent-500" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      {user.username}
                    </span>
                    <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                      Pending
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                      <Mail size={14} />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                      <Clock size={14} />
                      <span>Requested Role: <span className="font-medium capitalize">{user.role}</span></span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      <span>Requested: {new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div>From IP: {user.requestedBy}</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(user._id)}
                    disabled={actionLoading === user._id}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <CheckCircle size={16} />
                    {actionLoading === user._id ? 'Processing...' : 'Approve'}
                  </button>
                  <button
                    onClick={() => setShowRejectModal(user._id)}
                    disabled={actionLoading === user._id}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <XCircle size={16} />
                    Reject
                  </button>
                </div>
              </div>

              {/* Reject Modal */}
              {showRejectModal === user._id && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                  <div className="bg-white dark:bg-gray-900 rounded-xl max-w-md w-full p-6">
                    <h3 className="text-lg font-semibold mb-4">Reject Registration</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Please provide a reason for rejecting {user.username}'s registration request:
                    </p>
                    <textarea
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg mb-4"
                      rows="3"
                      placeholder="Enter rejection reason..."
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleReject(user._id)}
                        className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                      >
                        Confirm Reject
                      </button>
                      <button
                        onClick={() => {
                          setShowRejectModal(null);
                          setRejectReason('');
                        }}
                        className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}