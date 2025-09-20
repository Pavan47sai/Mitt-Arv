import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { listPosts, deletePost, toggleLike } from '../services/posts';
import './Posts.css';

export default function Posts() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  const [search, setSearch] = useState('');
  const [tag, setTag] = useState('');

  const loadPosts = async (page = 1, searchTerm = '', tagFilter = '') => {
    try {
      setLoading(true);
      setError('');
      const data = await listPosts(page, pagination.limit, searchTerm, tagFilter);
      setPosts(data.posts);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message || 'Failed to load posts');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts(1, search, tag);
  }, [user, search, tag]);

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    try {
      await deletePost(postId);
      setPosts(posts.filter(post => post._id !== postId));
    } catch (err) {
      setError(err.message || 'Failed to delete post');
    }
  };

  const handleLike = async (postId) => {
    try {
      const result = await toggleLike(postId);
      setPosts(posts.map(post => 
        post._id === postId 
          ? { ...post, likesCount: result.likesCount, isLiked: result.isLiked }
          : post
      ));
    } catch (err) {
      setError(err.message || 'Failed to like post');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadPosts(1, search, tag);
  };

  const handlePageChange = (newPage) => {
    loadPosts(newPage, search, tag);
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

      {/* Search and Filter */}
      <div className="posts-filters">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn">Search</button>
        </form>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="posts-list">
        {posts.length === 0 ? (
          <div className="no-posts">
            <div className="no-posts-icon">📝</div>
            <h3>No posts yet</h3>
            <p>Be the first to create a post and start the conversation!</p>
          </div>
        ) : (
          posts.map(post => (
            <div key={post._id} className="post-card">
              <div className="post-header">
                <h3 className="post-title"><Link to={`/posts/${post._id}`}>{post.title}</Link></h3>
                <div className="post-meta">
                  <span className="post-author">By {post.authorName}</span>
                  <span className="post-date">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className="post-content">
                <p>{post.excerpt || post.content}</p>
              </div>

              {post.tags && post.tags.length > 0 && (
                <div className="post-tags">
                  {post.tags.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                  ))}
                </div>
              )}
              
              <div className="post-actions">
                <Link to={`/posts/${post._id}`} className="btn btn-secondary">Read</Link>
                {user && user.id === post.author?._id && (
                  <>
                    <Link to={`/editor/${post._id}`} className="btn btn-outline">Edit</Link>
                    <button 
                      onClick={() => handleDeletePost(post._id)} 
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </>
                )}
                <button 
                  onClick={() => handleLike(post._id)} 
                  className={`btn btn-like ${post.isLiked ? 'liked' : ''}`}
                >
                  ❤️ {post.likesCount || 0}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page <= 1}
            className="pagination-btn"
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button 
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.pages}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}


