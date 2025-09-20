import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { listPostsByAuthor } from '../services/posts';

export default function MyHistory() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!user) return;
    const myPosts = listPostsByAuthor(user.id || user._id || user.email);
    setPosts(myPosts);
  }, [user]);

  return (
    <div className="history-container">
      <div className="history-header">
        <h1>My Posts</h1>
        <Link to="/editor/new" className="btn btn-primary">New Post</Link>
      </div>

      {posts.length === 0 ? (
        <div className="no-posts">
          <p>You have not created any posts yet.</p>
          <Link to="/editor/new" className="btn btn-outline">Create your first post</Link>
        </div>
      ) : (
        <div className="history-list">
          {posts.map(p => (
            <div key={p.id} className="history-item">
              <div className="history-main">
                <h3 className="post-title">
                  <Link to={`/posts/${p.id}`}>{p.title}</Link>
                </h3>
                <div className="post-meta">
                  <span>{new Date(p.createdAt).toLocaleString()}</span>
                  {p.tags?.length ? <span>• {p.tags.join(', ')}</span> : null}
                </div>
              </div>
              <div className="history-actions">
                <Link to={`/posts/${p.id}`} className="btn btn-secondary">View</Link>
                <Link to={`/editor/${p.id}`} className="btn btn-outline">Edit</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


