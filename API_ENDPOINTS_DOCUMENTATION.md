# 📚 Blog Posts Management API Endpoints

## 🔐 **Authentication Required Endpoints**
*These endpoints require a valid JWT token in cookies*

---

## 📝 **Posts Management**

### **1. Get All Published Posts**
```http
GET /api/posts
```
**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Posts per page (default: 10)
- `search` (optional): Search term for full-text search
- `tag` (optional): Filter by specific tag

**Response:**
```json
{
  "posts": [
    {
      "_id": "post_id",
      "title": "Post Title",
      "excerpt": "Post excerpt...",
      "author": {
        "_id": "author_id",
        "name": "Author Name",
        "email": "author@email.com"
      },
      "authorName": "Author Name",
      "tags": ["tag1", "tag2"],
      "status": "published",
      "featured": false,
      "likesCount": 5,
      "views": 100,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

### **2. Get Current User's Posts** 🔐
```http
GET /api/posts/my
```
**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Posts per page (default: 10)
- `status` (optional): Filter by status (draft/published/archived/all)

**Response:** Same as above but only user's posts

### **3. Get Single Post by ID**
```http
GET /api/posts/:id
```
**Response:**
```json
{
  "post": {
    "_id": "post_id",
    "title": "Post Title",
    "content": "Full post content...",
    "excerpt": "Post excerpt...",
    "author": {
      "_id": "author_id",
      "name": "Author Name",
      "email": "author@email.com"
    },
    "authorName": "Author Name",
    "tags": ["tag1", "tag2"],
    "status": "published",
    "featured": false,
    "likes": ["user_id1", "user_id2"],
    "likesCount": 5,
    "views": 100,
    "comments": [
      {
        "_id": "comment_id",
        "author": "author_id",
        "authorName": "Commenter Name",
        "content": "Comment content...",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "commentsCount": 3,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### **4. Create New Post** 🔐
```http
POST /api/posts
```
**Request Body:**
```json
{
  "title": "Post Title",
  "content": "Post content...",
  "tags": ["tag1", "tag2"],
  "status": "draft",
  "featured": false
}
```

**Response:**
```json
{
  "post": {
    "_id": "new_post_id",
    "title": "Post Title",
    "content": "Post content...",
    "excerpt": "Auto-generated excerpt...",
    "author": "user_id",
    "authorName": "User Name",
    "tags": ["tag1", "tag2"],
    "status": "draft",
    "featured": false,
    "likes": [],
    "likesCount": 0,
    "views": 0,
    "comments": [],
    "commentsCount": 0,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### **5. Update Post** 🔐
```http
PUT /api/posts/:id
```
**Request Body:**
```json
{
  "title": "Updated Title",
  "content": "Updated content...",
  "tags": ["updated", "tags"],
  "status": "published",
  "featured": true
}
```

**Response:** Updated post object

### **6. Delete Post** 🔐
```http
DELETE /api/posts/:id
```
**Response:**
```json
{
  "message": "Post deleted successfully"
}
```

---

## ❤️ **Social Features**

### **7. Toggle Like on Post** 🔐
```http
POST /api/posts/:id/like
```
**Response:**
```json
{
  "likesCount": 6,
  "isLiked": true
}
```

### **8. Add Comment to Post** 🔐
```http
POST /api/posts/:id/comments
```
**Request Body:**
```json
{
  "content": "Comment content..."
}
```

**Response:** Updated post with new comment

---

## 🔍 **Search & Discovery**

### **9. Get Popular Tags**
```http
GET /api/posts/tags/popular
```
**Response:**
```json
{
  "tags": [
    {
      "_id": "javascript",
      "count": 15
    },
    {
      "_id": "react",
      "count": 12
    },
    {
      "_id": "tutorial",
      "count": 8
    }
  ]
}
```

---

## 🔐 **Authentication Endpoints**

### **10. User Registration**
```http
POST /api/auth/signup
```
**Request Body:**
```json
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "password123"
}
```

### **11. User Login**
```http
POST /api/auth/login
```
**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### **12. Get Current User** 🔐
```http
GET /api/auth/me
```
**Response:**
```json
{
  "user": {
    "_id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "provider": "local",
    "isActive": true,
    "lastLogin": "2024-01-01T00:00:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### **13. Update User Profile** 🔐
```http
PUT /api/auth/profile
```
**Request Body:**
```json
{
  "name": "Updated Name"
}
```

### **14. User Logout** 🔐
```http
POST /api/auth/logout
```
**Response:**
```json
{
  "ok": true
}
```

### **15. Google OAuth Login**
```http
GET /api/auth/google
```
Redirects to Google OAuth

### **16. Google OAuth Callback**
```http
GET /api/auth/google/callback
```
Handles Google OAuth callback

---

## 🏥 **Health Check**

### **17. Server Health**
```http
GET /api/health
```
**Response:**
```json
{
  "ok": true
}
```

---

## 📊 **Database Schema**

### **Post Model**
```javascript
{
  _id: ObjectId,
  title: String (required, max: 200),
  content: String (required, max: 10000),
  excerpt: String (auto-generated, max: 300),
  author: ObjectId (ref: User, required),
  authorName: String (required),
  tags: [String],
  status: String (enum: ['draft', 'published', 'archived'], default: 'draft'),
  featured: Boolean (default: false),
  likes: [ObjectId] (ref: User),
  likesCount: Number (default: 0),
  views: Number (default: 0),
  comments: [{
    author: ObjectId (ref: User),
    authorName: String,
    content: String (max: 1000),
    createdAt: Date,
    updatedAt: Date
  }],
  commentsCount: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

### **User Model**
```javascript
{
  _id: ObjectId,
  email: String (required, unique),
  name: String (required),
  password: String (hashed, required for local),
  provider: String (enum: ['local', 'google'], default: 'local'),
  googleId: String (unique, sparse),
  avatar: String (optional),
  isActive: Boolean (default: true),
  lastLogin: Date (default: now),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🛡️ **Security Features**

- **Rate Limiting**: 30 requests per minute per IP
- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: All inputs validated and sanitized
- **CORS Protection**: Configured for frontend origin
- **HTTP-Only Cookies**: Secure cookie storage

---

## 🚀 **Usage Examples**

### **Create a Post**
```javascript
const response = await fetch('/api/posts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    title: 'My First Post',
    content: 'This is the content of my first post!',
    tags: ['blog', 'first-post'],
    status: 'published',
    featured: false
  })
});
const data = await response.json();
```

### **Search Posts**
```javascript
const response = await fetch('/api/posts?search=javascript&tag=tutorial&page=1&limit=5');
const data = await response.json();
```

### **Like a Post**
```javascript
const response = await fetch(`/api/posts/${postId}/like`, {
  method: 'POST',
  credentials: 'include'
});
const data = await response.json();
```

---

## ✅ **All Endpoints Implemented and Working!**

The complete blog posts management API is fully implemented with:
- ✅ Full CRUD operations
- ✅ Authentication & authorization
- ✅ Social features (likes, comments)
- ✅ Search & filtering
- ✅ Pagination
- ✅ Rate limiting
- ✅ Input validation
- ✅ Error handling
- ✅ Database integration
