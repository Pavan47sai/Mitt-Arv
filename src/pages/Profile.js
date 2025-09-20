import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import './Profile.css';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  useEffect(() => {
    if (user) {
      setProfile(user);
      setFormData({
        name: user.name || '',
        email: user.email || ''
      });
      setLoading(false);
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    
    try {
      await updateProfile(formData.name);
      setProfile({ ...profile, name: formData.name });
      setEditing(false);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Profile Settings</h1>
        <p>Manage your account information and preferences</p>
        {error && <div className="error-message">{error}</div>}
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-avatar">
            <div className="avatar-circle">
              {profile?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          </div>

          <div className="profile-info">
            <h2>{profile?.name || 'User'}</h2>
            <p className="profile-email">{profile?.email}</p>
            <div className="profile-badges">
              <span className="badge badge-primary">
                {profile?.provider === 'google' ? 'Google Account' : 'Local Account'}
              </span>
              <span className="badge badge-success">Active</span>
            </div>
          </div>

          <button 
            className="edit-btn"
            onClick={() => setEditing(!editing)}
          >
            {editing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        <div className="profile-details">
          <h3>Account Information</h3>
          
          {editing ? (
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                  disabled
                />
                <small>Email cannot be changed</small>
              </div>
              
              <div className="form-actions">
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setEditing(false)}
                  disabled={saving}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="info-grid">
              <div className="info-item">
                <label>Full Name</label>
                <span>{profile?.name || 'Not provided'}</span>
              </div>
              <div className="info-item">
                <label>Email Address</label>
                <span>{profile?.email}</span>
              </div>
              <div className="info-item">
                <label>Account Type</label>
                <span>{profile?.provider === 'google' ? 'Google OAuth' : 'Email/Password'}</span>
              </div>
              <div className="info-item">
                <label>Member Since</label>
                <span>{profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'Unknown'}</span>
              </div>
              <div className="info-item">
                <label>Last Login</label>
                <span>{profile?.lastLogin ? new Date(profile.lastLogin).toLocaleDateString() : 'Unknown'}</span>
              </div>
            </div>
          )}
        </div>

        <div className="profile-actions">
          <h3>Account Actions</h3>
          <div className="action-buttons">
            <button className="action-btn danger">
              <span className="btn-icon">🔒</span>
              Change Password
            </button>
            <button className="action-btn danger">
              <span className="btn-icon">🗑️</span>
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


