import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { createPost, getPostById, updatePost } from '../services/posts';

export default function PostEditor() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = useMemo(() => Boolean(id && id !== 'new'), [id]);

  const [form, setForm] = useState({ title: '', content: '', tags: '', imageUrl: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      const existing = getPostById(id);
      if (!existing) {
        setError('Post not found');
      } else {
        setForm({
          title: existing.title || '',
          content: existing.content || '',
          tags: (existing.tags || []).join(', '),
          imageUrl: existing.imageUrl || '',
        });
      }
    }
  }, [id, isEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = {
        title: form.title.trim(),
        content: form.content.trim(),
        tags: form.tags
          .split(',')
          .map(t => t.trim())
          .filter(Boolean),
        imageUrl: form.imageUrl.trim(),
      };
      if (!payload.title || !payload.content) {
        setError('Title and content are required');
        return;
      }
      if (isEdit) {
        updatePost(id, payload, user);
      } else {
        const created = createPost(payload, user);
        navigate(`/posts/${created.id}`);
        return;
      }
      navigate(`/posts/${id}`);
    } catch (err) {
      setError(err.message || 'Failed to save');
    }
  };

  return (
    <div className="editor-container">
      <div className="editor-header">
        <h1>{isEdit ? 'Edit Post' : 'Create New Post'}</h1>
      </div>

      {error && <div className="editor-error">{error}</div>}

      <form className="editor-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Enter post title"
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label>Content</label>
          <textarea
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            placeholder="Write your content here..."
            className="form-textarea"
            rows="10"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Tags</label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="e.g. react, javascript"
              className="form-input"
            />
            <small className="help-text">Comma-separated</small>
          </div>
          <div className="form-group">
            <label>Image URL (optional)</label>
            <input
              type="url"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              placeholder="https://..."
              className="form-input"
            />
          </div>
        </div>

        {form.imageUrl && (
          <div className="image-preview">
            <img src={form.imageUrl} alt="Preview" />
          </div>
        )}

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {isEdit ? 'Save Changes' : 'Publish Post'}
          </button>
        </div>
      </form>
    </div>
  );
}


