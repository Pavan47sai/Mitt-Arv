import React, { useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { deletePost, getPostById } from '../services/posts';

export default function PostDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const post = useMemo(() => getPostById(id), [id]);

  if (!post) {
    return (
      <div className="post-detail-container">
        <p>Post not found.</p>
        <Link className="btn btn-secondary" to="/posts">Back to Posts</Link>
      </div>
    );
  }

  const isOwner = () => {
    const actorId = user?.id || user?._id || user?.email || 'anonymous';
    return String(actorId) === String(post.authorId);
  };

  const onDelete = () => {
    if (!isOwner()) return;
    const confirmed = window.confirm('Are you sure you want to delete this post?');
    if (!confirmed) return;
    deletePost(post.id, user);
    navigate('/posts');
  };

  return (
    <div className="post-detail-container">
      <div className="post-detail-header">
        <h1>{post.title}</h1>
        <div className="post-meta">
          <span>By {post.authorName}</span>
          <span>•</span>
          <span>{new Date(post.createdAt).toLocaleString()}</span>
        </div>
      </div>

      {post.imageUrl && (
        <div className="post-detail-image">
          <img src={post.imageUrl} alt={post.title} />
        </div>
      )}

      <div className="post-detail-content">
        <p>{post.content}</p>
      </div>

      {post.tags?.length > 0 && (
        <div className="post-detail-tags">
          {post.tags.map(tag => (
            <span key={tag} className="tag">#{tag}</span>
          ))}
        </div>
      )}

      <div className="post-detail-actions">
        <Link to="/posts" className="btn btn-secondary">Back</Link>
        {isOwner() && (
          <>
            <Link to={`/editor/${post.id}`} className="btn btn-outline">Edit</Link>
            <button onClick={onDelete} className="btn btn-danger">Delete</button>
          </>
        )}
      </div>
    </div>
  );
}


