import React, { useState } from 'react';
import { Lock, User, Mail, Key, ShieldCheck } from 'lucide-react';

const Login = ({ onLogin, onSwitchToSignup }) => {

  const [step, setStep] = useState(0);
  const [creds, setCreds] = useState({ username: '', password: '' });
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [psk, setPsk] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // STEP 1 — Submit Credentials
  const submitCredentials = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(creds)
      });

      const data = await response.json();

      if (response.ok && data.pending) {
        setIdentifier(data.identifier);
        setStep(1);
      } else {
        setError(data.error || 'Invalid credentials');
      }

    } catch {
      setError('Server connection failed');
    }

    setLoading(false);
  };

  // STEP 2 — Verify OTP + PSK
  const submitVerification = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:5000/api/login/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: identifier,
          otp: otp,
          psk: psk
        })
      });

      const data = await response.json();

      if (response.ok) {
        // 🔥 Store detector token
        localStorage.setItem("detector_token", data.detector_token);
        localStorage.setItem("user_role", data.role);

        onLogin(data.role);
      } else {
        setError(data.error || 'Verification failed');
      }

    } catch {
      setError('Server connection failed');
    }

    setLoading(false);
  };

  return (
    <div className="login-overlay">
      <div className="login-card">

        <div className="login-header">
          <ShieldCheck size={48} color="#007CC3" />
          <h2>PRD-SYS</h2>
          <p>Pre-Encryption Detection System</p>
        </div>

        {step === 0 && (
          <form onSubmit={submitCredentials}>
            <div className="input-group">
              <User size={16} />
              <input
                type="text"
                placeholder="Username or Email"
                value={creds.username}
                onChange={e => setCreds({ ...creds, username: e.target.value })}
                required
              />
            </div>

            <div className="input-group">
              <Lock size={16} />
              <input
                type="password"
                placeholder="Password"
                value={creds.password}
                onChange={e => setCreds({ ...creds, password: e.target.value })}
                required
              />
            </div>

            {error && <div className="login-error">{error}</div>}

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Processing...' : 'Send OTP & PSK'}
            </button>
          </form>
        )}

        {step === 1 && (
          <form onSubmit={submitVerification}>
            <p style={{ marginBottom: 15 }}>
              Enter the OTP and PSK sent to your email.
            </p>

            <div className="input-group">
              <Mail size={16} />
              <input
                type="text"
                placeholder="6-digit OTP"
                value={otp}
                maxLength={6}
                onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                required
              />
            </div>

            <div className="input-group">
              <Key size={16} />
              <input
                type="text"
                placeholder="PSK"
                value={psk}
                onChange={e => setPsk(e.target.value)}
                required
              />
            </div>

            {error && <div className="login-error">{error}</div>}

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Verifying...' : 'Complete Login'}
            </button>
          </form>
        )}

        <p style={{ textAlign: 'center', marginTop: 20 }}>
          New User?{' '}
          <span
            onClick={onSwitchToSignup}
            style={{ cursor: 'pointer', textDecoration: 'underline' }}
          >
            Create Account
          </span>
        </p>

      </div>
    </div>
  );
};

export default Login;