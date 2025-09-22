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
├── src/
│   ├── hooks/                # Custom React hooks (e.g., useAuth, useFetch)
│   ├── utils/                # Utility functions (e.g., validators, formatters)
│   ├── assets/               # Images, icons, fonts
│   ├── services/             # API service modules (e.g., authService.js, postService.js)
│   ├── context/              # Additional React contexts (e.g., ThemeContext)
│   ├── styles/               # Global styles, theme files
│   └── tests/                # Frontend unit/integration tests
├── server/
├── .github/                  # GitHub workflows, issue templates
├── docs/                     # Documentation, API specs
├── README.md                 # Project overview
├── start-app.bat             # Windows script
└── .gitignore                # Git ignore file

```
