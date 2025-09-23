# Blog Authentication System Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git

### 1. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 2. Database Setup

#### Option A: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. The app will connect to `mongodb://localhost:27017/blog_auth`

#### Option B: MongoDB Atlas (Cloud)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Update the `MONGODB_URI` in `server/config.env`

### 3. Environment Configuration

Create a `.env` file in the `server` directory:

```env
PORT=4000
CLIENT_ORIGIN=http://localhost:3000
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
MONGODB_URI=mongodb://localhost:27017/blog_auth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
NODE_ENV=development
```

### 4. Google OAuth Setup (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:4000/api/auth/google/callback`
6. Copy Client ID and Secret to your `.env` file

### 5. Start the Application

#### Option A: Start Both Servers Together
```bash
npm run dev
```

#### Option B: Start Servers Separately
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run client
```

### 6. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **Health Check**: http://localhost:4000/api/health

## 📁 Project Structure

```
blog/
├── src/                    # React frontend
│   ├── components/         # Reusable components
│   │   ├── Navbar.js      # Navigation component
│   │   └── Navbar.css     # Navigation styles
│   ├── pages/             # Page components
│   │   ├── Login.js       # Login page
│   │   ├── Signup.js      # Signup page
│   │   ├── Profile.js     # User profile page
│   │   ├── Posts.js       # Blog posts page
│   │   ├── Auth.css       # Authentication styles
│   │   ├── Profile.css    # Profile page styles
│   │   └── Posts.css      # Posts page styles
│   ├── AuthContext.js     # Authentication context
│   ├── ProtectedRoute.js  # Route protection
│   ├── App.js            # Main app component
│   └── App.css           # Main app styles
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
└── start-dev.js          # Development startup script
```

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

## 🎨 Styling

- Modern gradient backgrounds
- Glassmorphism effects
- Responsive design
- Dark mode support
- Smooth animations
- Professional UI/UX

## 🚀 Deployment

### Frontend (Netlify/Vercel)
1. Build the project: `npm run build`
2. Deploy the `build` folder
3. Update `CLIENT_ORIGIN` in backend

### Backend (Heroku/Railway)
1. Set environment variables
2. Deploy the `server` folder
3. Update `CLIENT_ORIGIN` in frontend

## 🔧 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`

2. **Google OAuth Not Working**
   - Verify Client ID and Secret
   - Check redirect URI configuration

3. **CORS Errors**
   - Ensure `CLIENT_ORIGIN` is set correctly
   - Check if both servers are running

4. **JWT Token Issues**
   - Verify `JWT_SECRET` is set
   - Check token expiration settings

### Development Tips

- Use browser dev tools to debug API calls
- Check server logs for backend errors
- Use MongoDB Compass to view database
- Test authentication flow thoroughly

## 📝 Next Steps

1. Add email verification
2. Implement password reset
3. Add user roles and permissions
4. Create blog post CRUD operations
5. Add comments and likes system
6. Implement file uploads
7. Add search functionality
8. Create admin dashboard

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

