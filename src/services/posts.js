// LocalStorage-backed Post Service
// Shape: { id, title, content, tags: string[], imageUrl?: string, authorId, authorName, createdAt, updatedAt }

const STORAGE_KEY = 'blog.posts.v1';

function readAllPosts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (e) {
    return [];
  }
}

function writeAllPosts(posts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

export function listPosts() {
  return readAllPosts().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function getPostById(postId) {
  return readAllPosts().find(p => String(p.id) === String(postId)) || null;
}

export function listPostsByAuthor(authorId) {
  return readAllPosts()
    .filter(p => String(p.authorId) === String(authorId))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function createPost({ title, content, tags = [], imageUrl }, currentUser) {
  const now = new Date().toISOString();
  const post = {
    id: Date.now().toString(),
    title: String(title || '').trim(),
    content: String(content || '').trim(),
    tags: Array.isArray(tags) ? tags.map(t => String(t).trim()).filter(Boolean) : [],
    imageUrl: imageUrl || '',
    authorId: currentUser?.id || currentUser?._id || currentUser?.email || 'anonymous',
    authorName: currentUser?.name || currentUser?.email || 'Anonymous',
    createdAt: now,
    updatedAt: now,
  };
  const posts = readAllPosts();
  posts.unshift(post);
  writeAllPosts(posts);
  return post;
}

export function updatePost(postId, updates, currentUser) {
  const posts = readAllPosts();
  const idx = posts.findIndex(p => String(p.id) === String(postId));
  if (idx === -1) throw new Error('Post not found');
  const post = posts[idx];
  const ownerId = post.authorId;
  const actorId = currentUser?.id || currentUser?._id || currentUser?.email || 'anonymous';
  if (String(ownerId) !== String(actorId)) throw new Error('Forbidden');
  const now = new Date().toISOString();
  const next = {
    ...post,
    title: updates.title !== undefined ? String(updates.title) : post.title,
    content: updates.content !== undefined ? String(updates.content) : post.content,
    tags: updates.tags !== undefined ? (Array.isArray(updates.tags) ? updates.tags : post.tags) : post.tags,
    imageUrl: updates.imageUrl !== undefined ? updates.imageUrl : post.imageUrl,
    updatedAt: now,
  };
  posts[idx] = next;
  writeAllPosts(posts);
  return next;
}

export function deletePost(postId, currentUser) {
  const posts = readAllPosts();
  const idx = posts.findIndex(p => String(p.id) === String(postId));
  if (idx === -1) throw new Error('Post not found');
  const post = posts[idx];
  const ownerId = post.authorId;
  const actorId = currentUser?.id || currentUser?._id || currentUser?.email || 'anonymous';
  if (String(ownerId) !== String(actorId)) throw new Error('Forbidden');
  posts.splice(idx, 1);
  writeAllPosts(posts);
}

export function seedDemoPosts(currentUser) {
  const existing = readAllPosts();
  if (existing.length > 0) return existing;
  const demo = [
    createPost({
      title: 'Welcome to Your Blog!',
      content: 'Start writing amazing content and share your thoughts with the world.',
      tags: ['welcome'],
    }, currentUser || { email: 'system@demo', name: 'Demo' }),
  ];
  return demo;
}


