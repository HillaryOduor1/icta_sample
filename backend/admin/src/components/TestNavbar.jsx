import React from 'react';

export default function TestNavbar({ activeTab, setActiveTab }) {
    return (
        <div style={{ 
            background: '#ff0000', 
            color: 'white', 
            padding: '20px',
            position: 'sticky',
            top: 0,
            zIndex: 1000
        }}>
            <h2>🔴 TEST NAVBAR - If you see this, the changes are working! 🔴</h2>
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                {['overview', 'content', 'settings', 'users', 'activity'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            padding: '8px 16px',
                            background: activeTab === tab ? 'white' : '#666',
                            color: activeTab === tab ? 'red' : 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        {tab.toUpperCase()}
                    </button>
                ))}
            </div>
        </div>
    );
}