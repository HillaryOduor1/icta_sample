import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle, Trash2, RefreshCw } from 'lucide-react';

const API_BASE = '/api/v1/contact'; // changed

export default function ContactMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}?status=${filter === 'all' ? '' : filter}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setMessages(data.data || []);
    } catch (err) {
      console.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [filter]);

  const markAsRead = async (id) => {
    try {
      await fetch(`${API_BASE}/${id}/read`, { method: 'PATCH' });
      fetchMessages();
    } catch (err) {
      console.error('Failed to mark as read');
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
      fetchMessages();
    } catch (err) {
      console.error('Failed to delete');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Contact Messages</h2>
          <p className="text-sm text-muted">Messages from the public contact form</p>
        </div>
        <div className="flex gap-2">
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="input-base rounded-lg px-3">
            <option value="all">All</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
          <button onClick={fetchMessages} className="p-2 rounded-lg border hover:bg-surface">
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted">Loading...</div>
      ) : messages.length === 0 ? (
        <div className="text-center py-12 text-muted">No messages found</div>
      ) : (
        <div className="divide-y border rounded-xl overflow-hidden">
          {messages.map((msg) => (
            <div key={msg.id} className={`p-4 hover:bg-surface/50 ${msg.status === 'unread' ? 'bg-surface/30 border-l-4 border-l-accent' : ''}`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold">{msg.name}</span>
                    <span className="text-xs text-muted">({msg.email})</span>
                    {msg.status === 'unread' && (
                      <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full">New</span>
                    )}
                  </div>
                  <p className="mt-2 text-sm whitespace-pre-wrap">{msg.message}</p>
                  <p className="text-xs text-muted mt-2">{new Date(msg.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  {msg.status === 'unread' && (
                    <button onClick={() => markAsRead(msg.id)} className="p-1.5 rounded hover:bg-surface" title="Mark as read">
                      <CheckCircle size={16} />
                    </button>
                  )}
                  <button onClick={() => deleteMessage(msg.id)} className="p-1.5 rounded hover:bg-red-100 text-red-500">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
