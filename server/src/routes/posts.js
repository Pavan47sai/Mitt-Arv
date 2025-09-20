import express from 'express';
import Post from '../models/Post.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
const COOKIE_NAME = 'token';

// Rate limiting
const limiter = rateLimit({ windowMs: 60 * 1000, max: 30 });

// Auth middleware
function authMiddleware(req, res, next) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Create router
const postsRouter = express.Router();
postsRouter.use(limiter);

// ----------------------- Routes -----------------------

// GET /api/posts - list all published posts
postsRouter.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const tag = req.query.tag || '';

    let query = { status: 'published' };
    if (search) query.$text = { $search: search };
    if (tag) query.tags = { $in: [tag] };

    const posts = await Post.find(query)
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-content'); // exclude full content in list view

    const total = await Post.countDocuments(query);

    res.json({
      posts,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (err) {
    console.error('Get posts error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/posts/my - list current user's posts
postsRouter.get('/my', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status || 'all';

    let query = { author: req.user.id };
    if (status !== 'all') query.status = status;

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments(query);

    res.json({
      posts,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (err) {
    console.error('Get my posts error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/posts/:id - get a single post
postsRouter.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name email')
      .populate('comments.author', 'name');

    if (!post) return res.status(404).json({ error: 'Post not found' });

    post.views += 1;
    await post.save();

    res.json({ post });
  } catch (err) {
    console.error('Get post error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/posts - create new post
postsRouter.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, content, tags, status, featured } = req.body;
    if (!title || !content) return res.status(400).json({ error: 'Title and content are required' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const post = new Post({
      title,
      content,
      tags: tags || [],
      status: status || 'draft',
      featured: featured || false,
      author: req.user.id,
      authorName: user.name
    });

    await post.save();
    res.status(201).json({ post });
  } catch (err) {
    console.error('Create post error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/posts/:id - update post
postsRouter.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { title, content, tags, status, featured } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (post.author.toString() !== req.user.id) return res.status(403).json({ error: 'Not authorized to update this post' });

    if (title) post.title = title;
    if (content) post.content = content;
    if (tags) post.tags = tags;
    if (status) post.status = status;
    if (typeof featured === 'boolean') post.featured = featured;

    await post.save();
    res.json({ post });
  } catch (err) {
    console.error('Update post error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/posts/:id - delete post
postsRouter.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (post.author.toString() !== req.user.id) return res.status(403).json({ error: 'Not authorized to delete this post' });

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    console.error('Delete post error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/posts/:id/like - toggle like
postsRouter.post('/:id/like', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    await post.toggleLike(req.user.id);

    res.json({ likesCount: post.likesCount, isLiked: post.isLikedBy(req.user.id) });
  } catch (err) {
    console.error('Toggle like error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/posts/:id/comments - add comment
postsRouter.post('/:id/comments', authMiddleware, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) return res.status(400).json({ error: 'Comment content is required' });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await post.addComment(req.user.id, user.name, content.trim());

    const updatedPost = await Post.findById(req.params.id).populate('comments.author', 'name');
    res.status(201).json({ post: updatedPost });
  } catch (err) {
    console.error('Add comment error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/posts/tags/popular - get popular tags
postsRouter.get('/tags/popular', async (req, res) => {
  try {
    const tags = await Post.aggregate([
      { $match: { status: 'published' } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);

    res.json({ tags });
  } catch (err) {
    console.error('Get popular tags error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Default export
export default postsRouter;
