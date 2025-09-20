// API-backed Post Service
const API_BASE = '/api/posts';

// Helper function to make API calls
async function apiCall(endpoint, options = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
}

// Get all published posts with pagination
export async function listPosts(page = 1, limit = 10, search = '', tag = '') {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search }),
    ...(tag && { tag }),
  });
  
  return apiCall(`/?${params}`);
}

// Get current user's posts
export async function listMyPosts(page = 1, limit = 10, status = 'all') {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(status !== 'all' && { status }),
  });
  
  return apiCall(`/my?${params}`);
}

// Get single post by ID
export async function getPostById(postId) {
  const data = await apiCall(`/${postId}`);
  return data.post;
}

// Create new post
export async function createPost({ title, content, tags = [], status = 'draft', featured = false }) {
  const data = await apiCall('/', {
    method: 'POST',
    body: JSON.stringify({
      title,
      content,
      tags,
      status,
      featured,
    }),
  });
  return data.post;
}

// Update existing post
export async function updatePost(postId, { title, content, tags, status, featured }) {
  const data = await apiCall(`/${postId}`, {
    method: 'PUT',
    body: JSON.stringify({
      title,
      content,
      tags,
      status,
      featured,
    }),
  });
  return data.post;
}

// Delete post
export async function deletePost(postId) {
  return apiCall(`/${postId}`, {
    method: 'DELETE',
  });
}

// Toggle like on post
export async function toggleLike(postId) {
  return apiCall(`/${postId}/like`, {
    method: 'POST',
  });
}

// Add comment to post
export async function addComment(postId, content) {
  const data = await apiCall(`/${postId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
  return data.post;
}

// Get popular tags
export async function getPopularTags() {
  const data = await apiCall('/tags/popular');
  return data.tags;
}

// Legacy functions for backward compatibility
export function seedDemoPosts(currentUser) {
  // No longer needed with real API
  return Promise.resolve([]);
}