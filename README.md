# 📝 Blog Application

A full-stack **Blog Platform** built with **React + Redux (frontend)** and **Node.js + Express + MongoDB (backend)**.  
Supports **authentication, post management, likes, comments, search, profile management**, and more.  

---

## 📂 Project Presentation

You can download the full project demo video (Frontend + Backend) from Google Drive:

🔗 [BlogApp](https://drive.google.com/file/d/1ecmF-yxC9zB0fEvd8KVrzRuRbeXMyuE-/view?usp=sharing)

---

## 🚀 Features

- 🔐 **Authentication** (Signup, Login, Logout, Google OAuth, Profile update, Forgot/Reset password)
- 📝 **Posts Management** (Create, Edit, Delete, Search, Tags, Pagination)
- 💬 **Social Features** (Likes, Comments, Views tracking)
- 👤 **User Dashboard** (My history, Profile, Account actions, Last login)
- 📱 **Responsive UI** with SCSS styling
- ⚡ **Secure** with JWT, bcrypt, rate limiting, and CORS
- 📊 **Database Integration** with MongoDB (local/Atlas)

---

## 🛠️ Tech Stack

- **Frontend**: React, Redux Toolkit, SCSS  
- **Backend**: Node.js, Express, Passport, JWT  
- **Database**: MongoDB (Compass/Atlas)  
- **State Management**: Redux Toolkit  
- **Other**: Morgan, Cookie-parser, Rate-limiter  

---

## 📂 Project Structure

```
blog/
├── src/                    # React frontend
│   ├── components/         # Reusable components
│   │   ├── Navbar.js      # Navigation component
│   │   └── Navbar.scss     # Navigation styles
│   ├── pages/             # Page components
│   │   ├── Login.js       # Login page
│   │   ├── Signup.js      # Signup page
│   │   ├── Profile.js     # User profile page
│   │   ├── Posts.js       # Blog posts page
│   │   ├── Auth.scss       # Authentication styles
│   │   ├── Profile.scss    # Profile page styles
│   │   └── Posts.scss      # Posts page styles
│   ├── AuthContext.js     # Authentication context
│   ├── ProtectedRoute.js  # Route protection
│   ├── App.js            # Main app component
│   └── App.scss           # Main app styles
├── server/                # Express backend
│   ├── src/
│   │   ├── models/        # Database models
│   │   │   └── User.js    # User model
│   │   ├── routes/        # API routes
│   │   │   └── auth.js    # Authentication routes
│   │   ├── config/        # Configuration
│   │   │   └── database.js # Database connection
│   │   └── index.js       # Server entry point
│   ├── package.json       # Backend dependencies
│   └── config.env         # Environment variables
├── package.json           # Frontend dependencies
├── start-app.bat          # Windows Script
└── start-dev.js          # Development startup script
```
---

#### **User Model**
- Email, name, password (hashed)
- Provider (local/google)
- Google OAuth integration
- Account status and last login tracking

#### **Post Model**
- Title, content, excerpt (auto-generated)
- Author reference and name
- Tags array for categorization
- Status (draft/published/archived)
- Featured post flag
- Likes system with user references
- Comments system with nested structure
- View count tracking
- Full-text search indexing

### **Frontend Components**

#### **Pages**
- **Home**: Recent posts preview, user dashboard
- **Login/Signup**: Enhanced authentication with validation
- **Posts**: Full CRUD with search, pagination, likes
- **PostDetail**: Complete post view with comments
- **PostEditor**: Rich editor with status management
- **Profile**: User profile management
- **MyHistory**: User's post history


## ✅ Current Status

- ✔️ Authentication (local + Google OAuth)  
- ✔️ Post CRUD + Search + Tags + Pagination  
- ✔️ Likes + Comments working  
- ✔️ Profile update & Account actions  
- ✔️ Database connected (MongoDB Compass / Atlas)  
- ✔️ Responsive SCSS UI  

---

## 🎯 Next Steps

- 📱 Mobile app version (Flutter + GetX)  
- 📸 Post media upload (images, videos < 15s)  
- 🚀 Deployment (Render/Heroku + MongoDB Atlas)  


## 🔐 Authentication Features

### Local Authentication
- Email/password signup and login
- Password hashing with bcrypt
- JWT token-based sessions
- Secure httpOnly cookies

### Google OAuth
- Google account integration
- Automatic account linking
- Profile information sync

### Security Features
- Rate limiting on auth endpoints
- CORS protection
- Input validation
- Password strength requirements

## 📱 Pages and Features

### Public Pages
- **Home** (`/`) - Landing page with features
- **Login** (`/login`) - User authentication
- **Signup** (`/signup`) - User registration

### Protected Pages
- **Dashboard** (`/dashboard`) - User dashboard
- **Profile** (`/profile`) - User profile management
- **Posts** (`/posts`) - Blog posts management

### Navigation
- Responsive navbar with user menu
- Protected route handling
- Automatic redirects based on auth state

## 🛠️ API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/google/callback` - Google OAuth callback

### Health Check
- `GET /api/health` - Server health status


## 📖 Prompting Techniques & AI Tools

This project was enhanced using AI coding assistants such as **Cursor** and **ChatGPT**:

- **Prompt Engineering**: Clear step-by-step prompts for CRUD, API connection, Redux slice creation, SCSS styling.
- **Refactoring via AI**: Fixed runtime errors, optimized imports, and added authentication flows.
- **Rapid Prototyping**: AI helped scaffold pages like Login, Signup, Forgot Password, and Editor.
- **Troubleshooting**: Used AI to resolve MongoDB/Express issues, JWT bugs, and frontend state errors.

### Challenges Faced

- Handling runtime errors due to missing context providers (useAuth null issue).  
- MongoDB Compass vs Atlas migration.  
- Keeping Redux state synced with asynchronous APIs.  
- SCSS layout alignment across all pages.

---

## 📂 Project Structure
- for Backend
```
 server/                # Express backend
   ├── src/
   │   ├── models/        # Database models
   │   │   └── User.js    # User model
   │   ├── routes/        # API routes
   │   │   └── auth.js    # Authentication routes
   │   ├── config/        # Configuration
   │   │   └── database.js # Database connection
   │   └── index.js       # Server entry point
   ├── package.json       # Backend dependencies
   └── config.env         # Environment variables

```
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

# MongoDB Compass Setup Guide

## Prerequisites
1. Install MongoDB Community Server on your local machine
2. Install MongoDB Compass (GUI tool for MongoDB)

## Setup Steps

### 1. Install MongoDB Community Server
- Download from: https://www.mongodb.com/try/download/community
- Follow the installation wizard
- Make sure to install MongoDB as a Windows Service

### 2. Install MongoDB Compass
- Download from: https://www.mongodb.com/products/compass
- Install and launch MongoDB Compass

### 3. Connect to Local MongoDB
1. Open MongoDB Compass
2. Use the default connection string: `mongodb://localhost:27017`
3. Click "Connect"

### 4. Create Database
1. In MongoDB Compass, click "Create Database"
2. Database Name: `blog_auth`
3. Collection Name: `users`
4. Click "Create Database"

### 5. Verify Connection
- You should see the `blog_auth` database with a `users` collection
- The application will automatically create the necessary collections when you run it

## Running the Application

### Start MongoDB Service
```bash
# Start MongoDB service (if not already running)
net start MongoDB
```

### Start the Application
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend  
cd ..
npm start
```

### Access Points
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- MongoDB Compass: Connect to `mongodb://localhost:27017`

## Database Collections
The application will create these collections automatically:
- `users` - Stores user accounts and authentication data
- `sessions` - Stores user sessions (if using session-based auth)

## Troubleshooting
1. **MongoDB not starting**: Check if the service is running in Windows Services
2. **Connection refused**: Ensure MongoDB is running on port 27017
3. **Database not found**: The app will create the database automatically on first run
