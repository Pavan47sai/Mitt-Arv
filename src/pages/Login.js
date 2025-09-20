import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './Auth.css';

export default function Login() {
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [fpEmail, setFpEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Basic validation
    if (!email || !password) {
      setError('Please enter both email and password');
      setLoading(false);
      return;
    }
    
    try {
      await login(email, password);
      navigate('/'); // Redirect to home page on successful login
    } catch (e) {
      setError(e.message || 'Invalid email or password. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  const sendOtp = async (e) => {
    e.preventDefault();
    setError('');
    if (!fpEmail) {
      setError('Enter your registered email');
      return;
    }
    // Try backend first
    try {
      const res = await fetch('/api/auth/forgot/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: fpEmail })
      });
      if (res.status === 404) {
        setError('Account not found');
        return;
      }
      if (!res.ok) throw new Error('network');
    } catch (_) {
      // Demo mode: consider registered if matches locally stored user
      try {
        const raw = localStorage.getItem('auth.demo.user.v1');
        const demo = raw ? JSON.parse(raw) : null;
        if (!demo || demo.email !== fpEmail) {
          setError('Account not found');
          return;
        }
      } catch (_) {
        setError('Account not found');
        return;
      }
    }
    const code = String(Math.floor(100000 + Math.random() * 900000));
    setGeneratedOtp(code);
    setOtpSent(true);
    // For demo, show OTP inline. In real app, send via email.
  };

  const verifyOtpAndSetPassword = (e) => {
    e.preventDefault();
    setError('');
    if (otpInput !== generatedOtp) {
      setError('Invalid OTP');
      return;
    }
    if (!newPass || newPass !== confirmPass) {
      setError('Passwords do not match');
      return;
    }
    try {
      const raw = localStorage.getItem('auth.demo.user.v1');
      const demo = raw ? JSON.parse(raw) : null;
      if (!demo || demo.email !== fpEmail) {
        setError('Account not found');
        return;
      }
      demo.password = newPass;
      localStorage.setItem('auth.demo.user.v1', JSON.stringify(demo));
      // Reset flow and let user login
      setShowForgot(false);
      setOtpSent(false);
      setGeneratedOtp('');
      setOtpInput('');
      setNewPass('');
      setConfirmPass('');
      setEmail(fpEmail);
      setPassword('');
      setFpEmail('');
    } catch (_) {
      setError('Failed to update password');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Sign in to your account</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        {!showForgot && (
        <form onSubmit={onSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              className="form-input"
            />
          </div>
          
          <button type="submit" disabled={loading} className="auth-button primary">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        )}

        {showForgot && (
        <form onSubmit={otpSent ? verifyOtpAndSetPassword : sendOtp} className="auth-form">
          <div className="form-group">
            <label htmlFor="fpemail">Registered Email</label>
            <input
              id="fpemail"
              type="email"
              value={fpEmail}
              onChange={(e) => setFpEmail(e.target.value)}
              required
              placeholder="Enter your registered email"
              className="form-input"
              disabled={otpSent}
            />
          </div>

          {otpSent && (
            <>
              <div className="form-group">
                <label htmlFor="otp">OTP Code</label>
                <input
                  id="otp"
                  type="text"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  placeholder="Enter the 6-digit code"
                  className="form-input"
                />
                <small className="help-text">Demo OTP: {generatedOtp}</small>
              </div>
              <div className="form-group">
                <label htmlFor="newpass">New Password</label>
                <input
                  id="newpass"
                  type="password"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="Enter new password"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmpass">Confirm Password</label>
                <input
                  id="confirmpass"
                  type="password"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  placeholder="Re-enter new password"
                  className="form-input"
                />
              </div>
            </>
          )}

          <button type="submit" className="auth-button primary">
            {otpSent ? 'Set Password' : 'Send OTP'}
          </button>
        </form>
        )}
        
        <div className="divider">
          <span>or</span>
        </div>
        
        <button onClick={googleLogin} className="auth-button google">
          <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>
        
        <div className="auth-footer">
          {!showForgot ? (
            <>
              <span>
                <button className="auth-link" onClick={() => setShowForgot(true)}>
                  Forgot password?
                </button>
              </span>
              <span> · </span>
              <span>
                Don't have an account? <Link to="/signup" className="auth-link">Sign up</Link>
              </span>
            </>
          ) : (
            <>
              <button className="auth-link" onClick={() => setShowForgot(false)}>Back to Sign in</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}



