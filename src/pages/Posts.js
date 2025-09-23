import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchPosts, deletePost, toggleLike } from '../store/slices/postsSlice';
import './Posts.scss';

export default function Posts() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { posts, pagination, loading, error } = useAppSelector((state) => state.posts);
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchPosts({ page: 1, limit: 10, search:'', tag: '' }));
  }, [dispatch]);

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    dispatch(deletePost(postId));
  };

  const handleLike = async (postId) => {
    dispatch(toggleLike(postId));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(fetchPosts({ page: 1, limit: 10, search, tag: '' }));
  };

  const handlePageChange = (newPage) => {
    dispatch(fetchPosts({ page: newPage, limit: 10, search, tag: '' }));
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
      {/* Enhanced Header Section */}
      <div className="posts-header">
        <div className="header-content">
          <div className="header-text">
            <h1>Blog Posts</h1>
            <p>Share your thoughts and connect with others</p>
          </div>
          <div className="header-actions">
            <Link to="/editor/new" className="create-post-btn">
              <span className="btn-icon">✍️</span>
              Create New Post
            </Link>
          </div>
        </div>
      </div>

      {/* Enhanced Search and Filter Section */}
      <div className="posts-filters">
        <div className="search-container">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search posts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
              />
              {search && (
                <button 
                  type="button" 
                  onClick={() => setSearch('')}
                  className="clear-search"
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
            <button type="submit" className="search-btn">
              <span>Search</span>
            </button>
          </form>
          <div className="search-stats">
            {posts.length > 0 && (
              <span className="results-count">
                {pagination.total} {pagination.total === 1 ? 'post' : 'posts'} found
              </span>
            )}
          </div>
        </div>
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


