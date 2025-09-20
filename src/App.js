import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Posts from './pages/Posts';
import PostDetail from './pages/PostDetail';
import PostEditor from './pages/PostEditor';
import MyHistory from './pages/MyHistory';
import ProtectedRoute from './ProtectedRoute';

function Home() {
  const { user, logout } = useAuth();
  const [returning, setReturning] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // If logged out on home, go to login
    if (!user) {
      // Delay to allow provider to resolve loading state
      const t = setTimeout(() => navigate('/login', { replace: true }), 0);
      return () => clearTimeout(t);
    }
    if (!user) return;
    const userKey = String(user.id || user._id || user.email || 'anon');
    const key = `visited.${userKey}`;
    const hasVisited = localStorage.getItem(key);
    if (hasVisited) {
      setReturning(true);
    } else {
      setReturning(false);
      localStorage.setItem(key, '1');
    }
  }, [user, navigate]);
  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-title">Welcome to Your Blog</h1>
        <p className="home-subtitle">Share your thoughts and connect with others</p>
        
        {user ? (
          <div className="user-section">
            <div className="welcome-card">
              <h2>{returning ? 'Welcome back' : 'Welcome'}, {user.name || user.email}!</h2>
              <p>You're successfully logged in and ready to start blogging.</p>
              <div className="action-buttons">
                <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
                <Link to="/posts" className="btn btn-outline">View Posts</Link>
                <Link to="/profile" className="btn btn-outline">Profile</Link>
                <button onClick={logout} className="btn btn-secondary">Logout</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="auth-section">
            <div className="auth-card-preview">
              <h3>Get Started</h3>
              <p>Sign in to access your dashboard and start creating content.</p>
              <div className="action-buttons">
                <Link to="/login" className="btn btn-primary">Sign In</Link>
                <Link to="/signup" className="btn btn-outline">Sign Up</Link>
              </div>
            </div>
          </div>
        )}
        
        <div className="features">
          <div className="feature">
            <div className="feature-icon">📝</div>
            <h3>Write Posts</h3>
            <p>Create and publish your blog posts with our intuitive editor.</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🔒</div>
            <h3>Secure</h3>
            <p>Your data is protected with industry-standard security measures.</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🚀</div>
            <h3>Fast</h3>
            <p>Lightning-fast performance for the best user experience.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function RefreshController() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (loading) return;
    const key = 'app.refresh.count';
    const current = Number(sessionStorage.getItem(key) || '0');
    // On first mount after a full reload: decide redirect behavior
    if (!user) {
      // Not logged in: always go to login
      if (location.pathname !== '/login') navigate('/login', { replace: true });
    } else {
      if (current >= 1 && location.pathname !== '/') {
        navigate('/', { replace: true });
      }
    }
    sessionStorage.setItem(key, String(current + 1));
    // Reset counter on navigation changes within SPA
    return () => {
      sessionStorage.setItem(key, '0');
    };
  }, [user, loading, location.pathname, navigate]);
  return null;
}

function Dashboard() {
  const { user } = useAuth();
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome to your personal dashboard, {user?.name || user?.email}</p>
      </div>
      
      <div className="dashboard-content">
        <div className="dashboard-card">
          <h3>Account Information</h3>
          <div className="info-item">
            <strong>Email:</strong> {user?.email}
          </div>
          <div className="info-item">
            <strong>Name:</strong> {user?.name || 'Not provided'}
          </div>
          <div className="info-item">
            <strong>Status:</strong> <span className="status-badge">Active</span>
          </div>
        </div>
        
        <div className="dashboard-card">
          <h3>Quick Actions</h3>
          <div className="action-grid">
            <Link to="/posts" className="action-btn">
              <span className="action-icon">✏️</span>
              <span>Write New Post</span>
            </Link>
            <Link to="/profile" className="action-btn">
              <span className="action-icon">👤</span>
              <span>Profile Settings</span>
            </Link>
            <Link to="/posts" className="action-btn">
              <span className="action-icon">📝</span>
              <span>View All Posts</span>
            </Link>
            <Link to="/dashboard" className="action-btn">
              <span className="action-icon">📊</span>
              <span>Analytics</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app">
          <Navbar />
          <RefreshController />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/posts"
              element={
                <ProtectedRoute>
                  <Posts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/posts/:id"
              element={
                <ProtectedRoute>
                  <PostDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/editor/:id"
              element={
                <ProtectedRoute>
                  <PostEditor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <MyHistory />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
