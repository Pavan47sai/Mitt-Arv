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
