import React, { useState } from 'react';
import TestNavbar from './TestNavbar';

export default function DashboardTest({ onLogout, theme, toggleTheme }) {
    const [activeTab, setActiveTab] = useState('overview');
    
    console.log('DashboardTest rendering with theme:', theme);
    
    return (
        <div style={{ minHeight: '100vh', background: theme === 'dark' ? '#1a1a1a' : '#f5f5f5' }}>
            {/* Test Navbar */}
            <TestNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
            
            {/* Content area */}
            <div style={{ padding: '20px' }}>
                <div style={{ 
                    background: 'white', 
                    padding: '20px', 
                    borderRadius: '8px',
                    marginBottom: '20px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                    <h2>Current Tab: {activeTab}</h2>
                    <p>This is a test to verify that React components are updating correctly.</p>
                </div>
                
                {/* Simple content based on active tab */}
                {activeTab === 'overview' && (
                    <div style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
                        <h3>Dashboard Overview</h3>
                        <p>This is the overview content</p>
                    </div>
                )}
                {activeTab === 'content' && (
                    <div style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
                        <h3>Content Manager</h3>
                        <p>This is the content manager</p>
                    </div>
                )}
                {activeTab === 'settings' && (
                    <div style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
                        <h3>Settings</h3>
                        <p>This is the settings panel</p>
                    </div>
                )}
                {activeTab === 'users' && (
                    <div style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
                        <h3>Users</h3>
                        <p>This is the users management</p>
                    </div>
                )}
                {activeTab === 'activity' && (
                    <div style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
                        <h3>Activity Log</h3>
                        <p>This is the activity log</p>
                    </div>
                )}
                
                {/* Theme toggle and logout buttons */}
                <div style={{ 
                    marginTop: '20px', 
                    display: 'flex', 
                    gap: '10px',
                    justifyContent: 'center'
                }}>
                    <button 
                        onClick={toggleTheme}
                        style={{
                            padding: '10px 20px',
                            background: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Toggle Theme (Current: {theme})
                    </button>
                    <button 
                        onClick={onLogout}
                        style={{
                            padding: '10px 20px',
                            background: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}