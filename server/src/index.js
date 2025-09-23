import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRouter from './routes/auth.js';    // default import (or use named if auth.js uses named export)
import postsRouter from './routes/posts.js';  // default import
import passport from 'passport';
import connectDB from './config/database.js';

dotenv.config();

// Connect to MongoDB
connectDB().then(() => console.log('✅ MongoDB connected')).catch(err => console.error('❌ MongoDB connection error:', err));

const app = express();

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:3000';

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  })
);
app.use(passport.initialize());

// Health check route
app.get('/api/health', (req, res) => res.json({ ok: true }));

// API routes
app.use('/api/auth', authRouter);
app.use('/api/posts', postsRouter);

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});

