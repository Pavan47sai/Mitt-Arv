import express from 'express';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
const JWT_EXPIRES = '7d';
const COOKIE_NAME = 'token';
const COOKIE_SECURE = process.env.NODE_ENV === 'production';

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

function setAuthCookie(res, token) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: COOKIE_SECURE,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });
}

function clearAuthCookie(res) {
  res.clearCookie(COOKIE_NAME, { httpOnly: true, sameSite: 'lax', secure: COOKIE_SECURE, path: '/' });
}

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

// Google OAuth setup
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || 'CHANGE_ME',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'CHANGE_ME',
      callbackURL: `${process.env.SERVER_ORIGIN || 'http://localhost:4000'}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleId = profile.id;
        const email = profile.emails?.[0]?.value;
        const name = profile.displayName || 'Google User';
        
        if (!email) {
          return done(new Error('No email found in Google profile'), null);
        }

        // Check if user exists
        let user = await User.findOne({ googleId });
        
        if (!user) {
          // Check if user exists with same email
          user = await User.findOne({ email });
          if (user) {
            // Link Google account to existing user
            user.googleId = googleId;
            user.provider = 'google';
            await user.save();
          } else {
            // Create new user
            user = new User({
              email,
              name,
              googleId,
              provider: 'google',
              avatar: profile.photos?.[0]?.value
            });
            await user.save();
          }
        } else {
          // Update last login
          user.lastLogin = new Date();
          await user.save();
        }
        
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

export const authRouter = express.Router();

const limiter = rateLimit({ windowMs: 60 * 1000, max: 20 });
authRouter.use(limiter);

authRouter.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body || {};
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: 'Name is required' });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    
    // Create new user
    const user = new User({
      email,
      password,
      name: name.trim(),
      provider: 'local'
    });
    
    await user.save();
    
    const token = signToken({ 
      id: user._id, 
      email: user.email, 
      name: user.name 
    });
    
    setAuthCookie(res, token);
    res.status(201).json({ 
      user: { 
        id: user._id, 
        email: user.email, 
        name: user.name 
      } 
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    
    // Find user by email
    const user = await User.findOne({ email, provider: 'local' });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Update last login
    user.lastLogin = new Date();
    await user.save();
    
    const token = signToken({ 
      id: user._id, 
      email: user.email, 
      name: user.name 
    });
    
    setAuthCookie(res, token);
    res.json({ 
      user: { 
        id: user._id, 
        email: user.email, 
        name: user.name 
      } 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

authRouter.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

authRouter.post('/logout', (req, res) => {
  clearAuthCookie(res);
  res.json({ ok: true });
});

// Google OAuth endpoints
authRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

authRouter.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login?error=google' }),
  (req, res) => {
    const user = req.user;
    const token = signToken({ id: user._id, email: user.email, name: user.name });
    setAuthCookie(res, token);
    const client = process.env.CLIENT_ORIGIN || 'http://localhost:3000';
    res.redirect(client + '/');
  }
);



