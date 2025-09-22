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

## 📊 Database Schema

### Users
```json
{
  "email": "string",
  "name": "string",
  "password": "hashed string",
  "provider": "local|google",
  "lastLogin": "date"
}
