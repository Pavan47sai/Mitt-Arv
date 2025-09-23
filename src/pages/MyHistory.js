import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchMyPosts } from '../store/slices/postsSlice';
import './MyHistory.scss';

export default function MyHistory() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { myPosts: posts, loading, error } = useAppSelector((state) => state.posts);

  useEffect(() => {
    if (user) {
      dispatch(fetchMyPosts({ page: 1, limit: 50 }));
    }
  }, [dispatch, user]);

  if (loading) {
    return (
      <div className="history-container">
        <div className="loading-spinner"></div>
        <p>Loading your posts...</p>
      </div>
    );
  }

  return (
    <div className="history-container">
      <div className="history-header">
        <h1>My Posts</h1>
        <Link to="/editor/new" className="btn btn-primary">New Post</Link>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {posts.length === 0 ? (
        <div className="no-posts">
          <p>You have not created any posts yet.</p>
          <Link to="/editor/new" className="btn btn-outline">Create your first post</Link>
        </div>
      ) : (
        <div className="history-list">
          {posts.map(p => (
            <div key={p._id} className="history-item">
              <div className="history-main">
                <h3 className="post-title">
                  <Link to={`/posts/${p._id}`}>{p.title}</Link>
                </h3>
                <div className="post-meta">
                  <span>{new Date(p.createdAt).toLocaleString()}</span>
                  <span>•</span>
                  <span className={`status-badge status-${p.status}`}>
                    {p.status}
                  </span>
                  {p.tags?.length ? <span>• {p.tags.join(', ')}</span> : null}
                </div>
                <p className="post-excerpt">
                  {p.excerpt || p.content.substring(0, 100) + '...'}
                </p>
              </div>
              <div className="history-actions">
                <Link to={`/posts/${p._id}`} className="btn btn-secondary">View</Link>
                <Link to={`/editor/${p._id}`} className="btn btn-outline">Edit</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


