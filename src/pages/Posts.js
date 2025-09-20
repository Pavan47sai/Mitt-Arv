import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { listPosts, seedDemoPosts } from '../services/posts';
import './Posts.css';

export default function Posts() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: ''
  });

  useEffect(() => {
    setLoading(true);
    seedDemoPosts(user);
    setPosts(listPosts());
    setLoading(false);
  }, [user]);

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.content.trim()) return;

    const post = {
      id: Date.now(),
      title: newPost.title,
      content: newPost.content,
      author: user?.name || 'Anonymous',
      createdAt: new Date().toISOString(),
      likes: 0
    };

    setPosts([post, ...posts]);
    setNewPost({ title: '', content: '' });
    setShowCreateForm(false);
  };

  const handleLike = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
  };

  if (loading) {
    return (
      <div className="posts-loading">
        <div className="loading-spinner"></div>
        <p>Loading posts...</p>
      </div>
    );
  }

  return (
    <div className="posts-container">
      <div className="posts-header">
        <h1>Blog Posts</h1>
        <p>Share your thoughts and connect with others</p>
        <Link to="/editor/new" className="create-post-btn">Create New Post</Link>
      </div>

      {false && showCreateForm && null}

      <div className="posts-list">
        {posts.length === 0 ? (
          <div className="no-posts">
            <div className="no-posts-icon">📝</div>
            <h3>No posts yet</h3>
            <p>Be the first to create a post and start the conversation!</p>
          </div>
        ) : (
          posts.map(post => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <h3 className="post-title"><Link to={`/posts/${post.id}`}>{post.title}</Link></h3>
                <div className="post-meta">
                  <span className="post-author">By {post.authorName}</span>
                  <span className="post-date">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className="post-content">
                <p>{post.content}</p>
              </div>
              
              <div className="post-actions">
                <Link to={`/posts/${post.id}`} className="btn btn-secondary">Read</Link>
                <Link to={`/editor/${post.id}`} className="btn btn-outline">Edit</Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}


