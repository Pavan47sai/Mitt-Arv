import React, { useEffect, useState } from 'react';
import './App.scss';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { fetchUser } from './store/slices/authSlice';
import { fetchPosts } from './store/slices/postsSlice';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import Posts from './pages/Posts';
import PostDetail from './pages/PostDetail';
import PostEditor from './pages/PostEditor';
import MyHistory from './pages/MyHistory';
import ProtectedRoute from './ProtectedRoute';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api'; // Backend URL

function Home() {
  const dispatch = useAppDispatch();
  const { user, loading: authLoading } = useAppSelector((state) => state.auth);
  const { posts, loading: postsLoading } = useAppSelector((state) => state.posts);
  const [returning, setReturning] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    if (!user) return;
    const userKey = String(user.id || user._id || user.email || 'anon');
    const key = `visited.${userKey}`;
    const hasVisited = localStorage.getItem(key);
    if (hasVisited) setReturning(true);
    else {
      setReturning(false);
      localStorage.setItem(key, '1');
    }
  }, [user]);

  useEffect(() => {
    if (!user && !authLoading) {
      dispatch(fetchUser());
    }
  }, [dispatch, user, authLoading]);

  useEffect(() => {
    dispatch(fetchPosts({ page: 1, limit: 3 }));
  }, [dispatch]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const welcome = urlParams.get('welcome');
    const newUser = urlParams.get('newUser');
    if (welcome === 'true') {
      if (newUser === 'true') {
        setWelcomeMessage('Welcome to our blog platform! Your account has been created successfully.');
        setIsNewUser(true);
      } else {
        setWelcomeMessage('Welcome back! You have successfully signed in.');
        setIsNewUser(false);
      }
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
      setTimeout(() => {
        setWelcomeMessage('');
        setIsNewUser(false);
      }, 5000);
    }
  }, []);

  const handleLogout = async () => {
    // Implement logout via Redux action
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-title">Welcome to Your Blog</h1>
        <p className="home-subtitle">Share your thoughts and connect with others</p>

        {/* Welcome Message */}
        {welcomeMessage && (
          <div className={`welcome-message ${isNewUser ? 'new-user' : 'returning-user'}`}>
            <div className="welcome-icon">{isNewUser ? '🎉' : '👋'}</div>
            <div className="welcome-text">
              <h3>{isNewUser ? 'Welcome to our platform!' : 'Welcome back!'}</h3>
              <p>{welcomeMessage}</p>
            </div>
          </div>
        )}

        {user ? (
          <div className="user-section">
            <div className="welcome-card">
              <h2>{returning ? 'Welcome back' : 'Welcome'}, {user.name || user.email}!</h2>
              <p>You're successfully logged in and ready to start blogging.</p>
              <div className="action-buttons">
                <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
                <Link to="/posts" className="btn btn-outline">View Posts</Link>
                <Link to="/profile" className="btn btn-outline">Profile</Link>
                <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
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

        {/* Recent Posts Section */}
        <div className="recent-posts-section">
          <h2>Recent Posts</h2>
          {postsLoading ? (
            <p>Loading recent posts...</p>
          ) : posts.length > 0 ? (
            <div className="recent-posts-grid">
              {posts.map(post => (
                <div key={post._id} className="recent-post-card">
                  <h3 className="recent-post-title">
                    <Link to={`/posts/${post._id}`}>{post.title}</Link>
                  </h3>
                  <p className="recent-post-excerpt">
                    {post.excerpt || post.content.substring(0, 150) + '...'}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p>No posts yet. <Link to="/editor/new">Create the first post</Link>!</p>
          )}
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const { user } = useAppSelector((state) => state.auth);
  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <p>Welcome, {user?.name || user?.email}</p>
    </div>
  );
}

function AppContent() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/posts" element={<ProtectedRoute><Posts /></ProtectedRoute>} />
        <Route path="/posts/:id" element={<ProtectedRoute><PostDetail /></ProtectedRoute>} />
        <Route path="/editor/:id" element={<ProtectedRoute><PostEditor /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><MyHistory /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
