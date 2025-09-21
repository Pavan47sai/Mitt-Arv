import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { forgotPassword, resetPassword } from '../store/slices/authSlice';
import './Auth.scss';

export default function ForgotPassword() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);
  
  const [step, setStep] = useState('email'); // 'email' or 'reset'
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState('');

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    const result = await dispatch(forgotPassword({ email }));
    if (forgotPassword.fulfilled.match(result)) {
      setSuccess('Password reset instructions have been sent to your email.');
      setToken(result.payload.resetToken); // In demo, we'll use this
      setStep('reset');
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (!password || password !== confirmPassword) return;
    
    const result = await dispatch(resetPassword({ token, password }));
    if (resetPassword.fulfilled.match(result)) {
      setSuccess('Password has been reset successfully. You can now login.');
      setTimeout(() => navigate('/login'), 2000);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>{step === 'email' ? 'Forgot Password' : 'Reset Password'}</h2>
          <p>
            {step === 'email' 
              ? 'Enter your email address and we\'ll send you reset instructions'
              : 'Enter your new password'
            }
          </p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        {step === 'email' ? (
          <form onSubmit={handleEmailSubmit} className="auth-form">
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
            
            <button type="submit" disabled={loading} className="auth-button primary">
              {loading ? 'Sending...' : 'Send Reset Instructions'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="password">New Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter new password"
                className="form-input"
                minLength="6"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm new password"
                className="form-input"
                minLength="6"
              />
            </div>
            
            <button type="submit" disabled={loading} className="auth-button primary">
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
        
        <div className="auth-footer">
          <Link to="/login" className="auth-link">Back to Sign In</Link>
        </div>
      </div>
    </div>
  );
}

