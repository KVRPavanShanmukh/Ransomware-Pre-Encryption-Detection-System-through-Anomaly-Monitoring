import React, { useState } from 'react';
import { Settings as SettingsIcon, Shield, Bell, Eye, Database, Lock, Download } from 'lucide-react';

const Settings = ({ detectorToken, apiBase = 'http://127.0.0.1:5000' }) => {
    const [telemetry, setTelemetry] = useState(false);
    const [remoteSupport, setRemoteSupport] = useState(false);
    const [autoUpdate, setAutoUpdate] = useState(true);
    const [emailAlerts, setEmailAlerts] = useState(true);
    const [dataRetention, setDataRetention] = useState('30');

    return (
        <div className="dashboard-wrapper">
            <div className="card" style={{ maxWidth: 800, margin: '0 auto' }}>
                <div className="header-flex" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 16, marginBottom: 24 }}>
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '1.2rem', color: '#f8fafc' }}>
                        <SettingsIcon size={24} color="#007CC3" />
                        System Preferences
                    </h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                    {/* Privacy & Permissions Section */}
                    <section>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.9rem', color: '#94a3b8', marginBottom: 16 }}>
                            <Eye size={18} />
                            Privacy & Permissions
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, background: 'rgba(0,0,0,0.2)', padding: 20, borderRadius: 8 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h4 style={{ fontSize: '0.95rem', color: '#e2e8f0', marginBottom: 4 }}>Telemetry Data Sharing</h4>
                                    <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Help us improve PRD-SYS by sending anonymous usage data.</p>
                                </div>
                                <button
                                    className={`toggle-btn ${telemetry ? 'on' : 'off'}`}
                                    onClick={() => setTelemetry(!telemetry)}
                                    style={{
                                        background: telemetry ? '#007CC3' : '#334155',
                                        border: 'none',
                                        borderRadius: 20,
                                        width: 44,
                                        height: 24,
                                        position: 'relative',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <span style={{
                                        position: 'absolute',
                                        top: 2,
                                        left: telemetry ? 22 : 2,
                                        width: 20,
                                        height: 20,
                                        background: '#fff',
                                        borderRadius: '50%',
                                        transition: 'all 0.3s ease'
                                    }} />
                                </button>
                            </div>

                            <div style={{ height: 1, background: 'rgba(255,255,255,0.05)' }} />

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h4 style={{ fontSize: '0.95rem', color: '#e2e8f0', marginBottom: 4 }}>Remote Support Access</h4>
                                    <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Allow trusted PRD-SYS technicians to access this console for troubleshooting.</p>
                                </div>
                                <button
                                    className={`toggle-btn ${remoteSupport ? 'on' : 'off'}`}
                                    onClick={() => setRemoteSupport(!remoteSupport)}
                                    style={{
                                        background: remoteSupport ? '#ef4444' : '#334155',
                                        border: 'none',
                                        borderRadius: 20,
                                        width: 44,
                                        height: 24,
                                        position: 'relative',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <span style={{
                                        position: 'absolute',
                                        top: 2,
                                        left: remoteSupport ? 22 : 2,
                                        width: 20,
                                        height: 20,
                                        background: '#fff',
                                        borderRadius: '50%',
                                        transition: 'all 0.3s ease'
                                    }} />
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Threat Intelligence Section */}
                    <section>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.9rem', color: '#94a3b8', marginBottom: 16 }}>
                            <Shield size={18} />
                            Threat Intelligence
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, background: 'rgba(0,0,0,0.2)', padding: 20, borderRadius: 8 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h4 style={{ fontSize: '0.95rem', color: '#e2e8f0', marginBottom: 4 }}>Auto-Update Signatures</h4>
                                    <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Automatically fetch and apply the latest ransomware threat signatures.</p>
                                </div>
                                <button
                                    className={`toggle-btn ${autoUpdate ? 'on' : 'off'}`}
                                    onClick={() => setAutoUpdate(!autoUpdate)}
                                    style={{
                                        background: autoUpdate ? '#10b981' : '#334155',
                                        border: 'none',
                                        borderRadius: 20,
                                        width: 44,
                                        height: 24,
                                        position: 'relative',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <span style={{
                                        position: 'absolute',
                                        top: 2,
                                        left: autoUpdate ? 22 : 2,
                                        width: 20,
                                        height: 20,
                                        background: '#fff',
                                        borderRadius: '50%',
                                        transition: 'all 0.3s ease'
                                    }} />
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Notifications Section */}
                    <section>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.9rem', color: '#94a3b8', marginBottom: 16 }}>
                            <Bell size={18} />
                            Alerts & Notifications
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, background: 'rgba(0,0,0,0.2)', padding: 20, borderRadius: 8 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h4 style={{ fontSize: '0.95rem', color: '#e2e8f0', marginBottom: 4 }}>Email Alerts</h4>
                                    <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Receive critical notifications and reports directly to your inbox.</p>
                                </div>
                                <button
                                    className={`toggle-btn ${emailAlerts ? 'on' : 'off'}`}
                                    onClick={() => setEmailAlerts(!emailAlerts)}
                                    style={{
                                        background: emailAlerts ? '#007CC3' : '#334155',
                                        border: 'none',
                                        borderRadius: 20,
                                        width: 44,
                                        height: 24,
                                        position: 'relative',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <span style={{
                                        position: 'absolute',
                                        top: 2,
                                        left: emailAlerts ? 22 : 2,
                                        width: 20,
                                        height: 20,
                                        background: '#fff',
                                        borderRadius: '50%',
                                        transition: 'all 0.3s ease'
                                    }} />
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* PRD-SYS Folder Guard — Download detector */}
                    <section>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.9rem', color: '#94a3b8', marginBottom: 16 }}>
                            <Shield size={18} />
                            PRD-SYS Folder Guard
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, background: 'rgba(0,0,0,0.2)', padding: 20, borderRadius: 8 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                                <div>
                                    <h4 style={{ fontSize: '0.95rem', color: '#e2e8f0', marginBottom: 4 }}>Download Detector</h4>
                                    <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Install the folder guard on your PC. Select a demo folder to monitor; detects ransomware via entropy, file renames, and mass processes (ML). Alerts are emailed to your registered address.</p>
                                </div>
                                <button
                                    disabled={!detectorToken}
                                    onClick={async () => {
                                        if (!detectorToken) return;
                                        const url = `${apiBase}/api/detector-download?token=${encodeURIComponent(detectorToken)}`;
                                        try {
                                            const res = await fetch(url);
                                            if (!res.ok) throw new Error('Download failed');
                                            const blob = await res.blob();
                                            const a = document.createElement('a');
                                            a.href = URL.createObjectURL(blob);
                                            a.download = 'PRD-SYS-FolderGuard.zip';
                                            a.click();
                                            URL.revokeObjectURL(a.href);
                                        } catch (e) {
                                            window.open(url, '_blank');
                                        }
                                    }}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 8,
                                        background: detectorToken ? '#007CC3' : '#334155',
                                        color: '#fff',
                                        border: 'none',
                                        padding: '8px 16px',
                                        borderRadius: 4,
                                        cursor: detectorToken ? 'pointer' : 'not-allowed',
                                        fontWeight: 600,
                                        fontSize: '0.85rem'
                                    }}
                                >
                                    <Download size={18} /> Download PRD-SYS Folder Guard
                                </button>
                            </div>
                            {!detectorToken && (
                                <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Log in with your account (credentials step) to get a download link. Security-question-only login does not include detector token.</p>
                            )}
                        </div>
                    </section>

                    {/* Data Section */}
                    <section>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.9rem', color: '#94a3b8', marginBottom: 16 }}>
                            <Database size={18} />
                            Data Management
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, background: 'rgba(0,0,0,0.2)', padding: 20, borderRadius: 8 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h4 style={{ fontSize: '0.95rem', color: '#e2e8f0', marginBottom: 4 }}>Log Retention Period</h4>
                                    <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Number of days to keep historical sysmon correlation logs.</p>
                                </div>
                                <select
                                    value={dataRetention}
                                    onChange={(e) => setDataRetention(e.target.value)}
                                    style={{
                                        background: '#1e293b',
                                        color: '#e2e8f0',
                                        border: '1px solid #334155',
                                        padding: '6px 12px',
                                        borderRadius: 4,
                                        outline: 'none',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <option value="7">7 Days</option>
                                    <option value="14">14 Days</option>
                                    <option value="30">30 Days</option>
                                    <option value="90">90 Days</option>
                                </select>
                            </div>

                            <div style={{ height: 1, background: 'rgba(255,255,255,0.05)' }} />

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h4 style={{ fontSize: '0.95rem', color: '#ef4444', marginBottom: 4 }}>Clear All Data</h4>
                                    <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Permanently erase all quarantined files and system logs. Cannot be undone.</p>
                                </div>
                                <button style={{
                                    background: 'none',
                                    border: '1px solid #ef4444',
                                    color: '#ef4444',
                                    padding: '6px 16px',
                                    borderRadius: 4,
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    fontSize: '0.85rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8
                                }}>
                                    <Lock size={14} /> PURGE
                                </button>
                            </div>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
};

export default Settings;
