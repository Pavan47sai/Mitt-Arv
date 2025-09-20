import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { createPost, getPostById, updatePost } from '../services/posts';

export default function PostEditor() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = useMemo(() => Boolean(id && id !== 'new'), [id]);

  const [form, setForm] = useState({ 
    title: '', 
    content: '', 
    tags: '', 
    status: 'draft',
    featured: false 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit) {
      loadPost();
    }
  }, [id, isEdit]);

  const loadPost = async () => {
    try {
      setLoading(true);
      setError('');
      const existing = await getPostById(id);
      if (!existing) {
        setError('Post not found');
        return;
      }
      
      setForm({
        title: existing.title || '',
        content: existing.content || '',
        tags: (existing.tags || []).join(', '),
        status: existing.status || 'draft',
        featured: existing.featured || false,
      });
    } catch (err) {
      setError(err.message || 'Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    
    try {
      const payload = {
        title: form.title.trim(),
        content: form.content.trim(),
        tags: form.tags
          .split(',')
          .map(t => t.trim())
          .filter(Boolean),
        status: form.status,
        featured: form.featured,
      };
      
      if (!payload.title || !payload.content) {
        setError('Title and content are required');
        return;
      }
      
      let result;
      if (isEdit) {
        result = await updatePost(id, payload);
      } else {
        result = await createPost(payload);
      }
      
      navigate(`/posts/${result._id}`);
    } catch (err) {
      setError(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="editor-container">
        <div className="loading-spinner"></div>
        <p>Loading post...</p>
      </div>
    );
  }

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
              placeholder="e.g. react, javascript, tutorial"
              className="form-input"
            />
            <small className="help-text">Comma-separated tags</small>
          </div>
          <div className="form-group">
            <label>Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="form-select"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="form-checkbox"
            />
            <span>Featured Post</span>
          </label>
          <small className="help-text">Featured posts appear prominently on the homepage</small>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={() => navigate(-1)}
            disabled={saving}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={saving}
          >
            {saving ? 'Saving...' : (isEdit ? 'Save Changes' : 'Publish Post')}
          </button>
        </div>
      </form>
    </div>
  );
}


