import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchPostById, deletePost, toggleLike, addComment } from '../store/slices/postsSlice';
import './PostDetail.scss';

export default function PostDetail() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { currentPost: post, loading, error } = useAppSelector((state) => state.posts);
  const navigate = useNavigate();
  
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchPostById(id));
    }
  }, [dispatch, id]);

  const isOwner = () => {
    if (!post || !user) return false;
    return String(user.id) === String(post.author?._id);
  };

  const handleDelete = async () => {
    if (!isOwner()) return;
    const confirmed = window.confirm('Are you sure you want to delete this post?');
    if (!confirmed) return;
    
    dispatch(deletePost(id));
    navigate('/posts');
  };

  const handleLike = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    dispatch(toggleLike(id));
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !user) return;
    
    setSubmittingComment(true);
    dispatch(addComment({ postId: id, content: commentText.trim() }));
    setCommentText('');
    setSubmittingComment(false);
  };

  if (loading) {
    return (
      <div className="post-detail-container">
        <div className="loading-spinner"></div>
        <p>Loading post...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="post-detail-container">
        <div className="error-message">
          {error || 'Post not found'}
        </div>
        <Link className="btn btn-secondary" to="/posts">Back to Posts</Link>
      </div>
    );
  }

  return (
    <div className="post-detail-container">
      <div className="post-detail-header">
        <h1>{post.title}</h1>
        <div className="post-meta">
          <span>By {post.authorName}</span>
          <span>•</span>
          <span>{new Date(post.createdAt).toLocaleString()}</span>
          <span>•</span>
          <span>{post.views || 0} views</span>
        </div>
      </div>

      <div className="post-detail-content">
        <div className="post-content-text">
          {post.content.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>

      {post.tags && post.tags.length > 0 && (
        <div className="post-detail-tags">
          {post.tags.map(tag => (
            <span key={tag} className="tag">#{tag}</span>
          ))}
        </div>
      )}

      <div className="post-detail-actions">
        <button 
          onClick={handleLike} 
          className={`btn btn-like ${post.isLiked ? 'liked' : ''}`}
        >
          ❤️ {post.likesCount || 0} likes
        </button>
        
        <Link to="/posts" className="btn btn-secondary">Back to Posts</Link>
        
        {isOwner() && (
          <>
            <Link to={`/editor/${post._id}`} className="btn btn-outline">Edit</Link>
            <button onClick={handleDelete} className="btn btn-danger">Delete</button>
          </>
        )}
      </div>

      {/* Comments Section */}
      <div className="comments-section">
        <h3>Comments ({post.commentsCount || 0})</h3>
        
        {user ? (
          <form onSubmit={handleComment} className="comment-form">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="comment-input"
              rows="3"
              required
            />
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={submittingComment}
            >
              {submittingComment ? 'Posting...' : 'Post Comment'}
            </button>
          </form>
        ) : (
          <p className="login-prompt">
            <Link to="/login">Sign in</Link> to leave a comment
          </p>
        )}

        <div className="comments-list">
          {post.comments && post.comments.length > 0 ? (
            post.comments.map((comment, index) => (
              <div key={index} className="comment">
                <div className="comment-header">
                  <strong>{comment.authorName}</strong>
                  <span className="comment-date">
                    {new Date(comment.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="comment-content">
                  {comment.content}
                </div>
              </div>
            ))
          ) : (
            <p className="no-comments">No comments yet. Be the first to comment!</p>
          )}
        </div>
      </div>
    </div>
  );
}


