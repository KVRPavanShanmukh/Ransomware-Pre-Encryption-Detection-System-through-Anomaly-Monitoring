import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import FileUploader from './components/FileUploader';
import SysmonLogs from './components/SysmonLogs';
import ActiveShield from './components/ActiveShield';
import EncryptionLab from './components/EncryptionLab';
import Settings from './components/Settings';
import Login from './components/Login';
import Signup from './components/Signup';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [logsUploaded, setLogsUploaded] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => setIsAuthenticated(false);

  if (!isAuthenticated && !isSignup) {
    return <Login onLogin={() => setIsAuthenticated(true)} onSwitchToSignup={() => setIsSignup(true)} />;
  }

  if (!isAuthenticated && isSignup) {
    return <Signup onSignupSuccess={() => setIsSignup(false)} onSwitchToLogin={() => setIsSignup(false)} />;
  }

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />

      <main className="content-area">
        <header className="top-nav">
          <div className="search-bar">
            <input type="text" placeholder="Search logs, hashes, PIDs, paths..." />
          </div>
          <div className="user-profile" style={{ position: 'relative' }}>
            <span className="status-badge">Admin: Active</span>
            <div
              className="avatar"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              SOC-Admin
            </div>

            {showProfileMenu && (
              <div style={{
                position: 'absolute',
                top: '120%',
                right: 0,
                background: 'rgba(5, 10, 14, 0.95)',
                border: '1px solid var(--primary)',
                borderRadius: 4,
                width: 180,
                zIndex: 100,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 10px rgba(0, 255, 65, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}>
                <div
                  style={{ padding: '10px 14px', fontSize: '0.8rem', color: 'var(--text-secondary)', cursor: 'pointer', borderBottom: '1px solid rgba(0,255,65,0.1)' }}
                  onMouseEnter={(e) => { e.target.style.background = 'rgba(0,255,65,0.1)'; e.target.style.color = 'var(--primary-bright)'; }}
                  onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.color = 'var(--text-secondary)'; }}
                >
                  Profile Settings
                </div>
                <div
                  style={{ padding: '10px 14px', fontSize: '0.8rem', color: 'var(--text-secondary)', cursor: 'pointer', borderBottom: '1px solid rgba(0,255,65,0.1)' }}
                  onMouseEnter={(e) => { e.target.style.background = 'rgba(0,255,65,0.1)'; e.target.style.color = 'var(--primary-bright)'; }}
                  onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.color = 'var(--text-secondary)'; }}
                >
                  View Audit Log
                </div>
                <div
                  style={{ padding: '10px 14px', fontSize: '0.8rem', color: 'var(--text-secondary)', cursor: 'pointer' }}
                  onMouseEnter={(e) => { e.target.style.background = 'rgba(0,255,65,0.1)'; e.target.style.color = 'var(--primary-bright)'; }}
                  onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.color = 'var(--text-secondary)'; }}
                >
                  System Health
                </div>
              </div>
            )}
          </div>
        </header>

        <div className="main-view">
          {activeTab === 'dashboard' && <Dashboard logsUploaded={logsUploaded} />}
          {activeTab === 'upload' && <FileUploader onLogsUploaded={() => setLogsUploaded(true)} />}
          {activeTab === 'logs' && <SysmonLogs />}
          {activeTab === 'protection' && <ActiveShield />}
          {activeTab === 'encryption' && <EncryptionLab />}
          {activeTab === 'settings' && <Settings />}
        </div>
      </main>
    </div>
  );
}

export default App;