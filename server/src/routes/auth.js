import express from 'express';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
import Post from '../models/Post.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
const JWT_EXPIRES = '7d';
const COOKIE_NAME = 'token';
const COOKIE_SECURE = process.env.NODE_ENV === 'production';

// Create JWT token
function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

// Set auth cookie
function setAuthCookie(res, token) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: COOKIE_SECURE,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });
}

// Clear auth cookie
function clearAuthCookie(res) {
  res.clearCookie(COOKIE_NAME, { httpOnly: true, sameSite: 'lax', secure: COOKIE_SECURE, path: '/' });
}

// Middleware to protect routes
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
        const avatar = profile.photos?.[0]?.value;

        console.log('Google OAuth - Profile received:', { googleId, email, name });

        if (!email) return done(new Error('No email found in Google profile'), null);

        let user = await User.findOne({ googleId });
        let isNewUser = false;

        if (!user) {
          // Check if user exists with this email
          user = await User.findOne({ email });
          if (user) {
            // Link Google account to existing user
            user.googleId = googleId;
            user.provider = 'google';
            if (avatar) user.avatar = avatar;
            await user.save();
            console.log('Google OAuth - Linked to existing user:', user.email);
          } else {
            // Create new user
            user = new User({
              email,
              name,
              googleId,
              provider: 'google',
              avatar: avatar,
            });
            await user.save();
            isNewUser = true;
            console.log('Google OAuth - Created new user:', user.email);
          }
        } else {
          // Update last login for existing user
          user.lastLogin = new Date();
          if (avatar) user.avatar = avatar;
          await user.save();
          console.log('Google OAuth - Updated existing user:', user.email);
        }

        // Add flag to indicate if this is a new user
        user.isNewUser = isNewUser;
        return done(null, user);
      } catch (error) {
        console.error('Google OAuth error:', error);
        return done(error, null);
      }
    }
  )
);

// Create router
const authRouter = express.Router();

// Rate limiting
const limiter = rateLimit({ windowMs: 60 * 1000, max: 20 });
authRouter.use(limiter);

// Signup
authRouter.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    if (!name || name.trim().length === 0) return res.status(400).json({ error: 'Name is required' });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ error: 'Email already registered' });

    const user = new User({ email, password, name: name.trim(), provider: 'local' });
    await user.save();

    const token = signToken({ id: user._id, email: user.email, name: user.name });
    setAuthCookie(res, token);

    res.status(201).json({ user: { id: user._id, email: user.email, name: user.name } });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login
authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const user = await User.findOne({ email, provider: 'local' });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    user.lastLogin = new Date();
    await user.save();

    const token = signToken({ id: user._id, email: user.email, name: user.name });
    setAuthCookie(res, token);

    res.json({ user: { id: user._id, email: user.email, name: user.name } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user
authRouter.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Logout
authRouter.post('/logout', (req, res) => {
  clearAuthCookie(res);
  res.json({ ok: true });
});

// Update profile
authRouter.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || name.trim().length === 0) return res.status(400).json({ error: 'Name is required' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.name = name.trim();
    await user.save();

    res.json({ user: { id: user._id, email: user.email, name: user.name } });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Google OAuth routes
authRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
authRouter.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login?error=google' }),
  (req, res) => {
    try {
    const user = req.user;
    const token = signToken({ id: user._id, email: user.email, name: user.name });
    setAuthCookie(res, token);
      
      // Redirect based on whether user is new or existing
      const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:3000';
      const redirectUrl = user.isNewUser 
        ? `${clientOrigin}/?welcome=true&newUser=true` 
        : `${clientOrigin}/?welcome=true`;
      
      console.log('Google OAuth - Redirecting to:', redirectUrl);
      res.redirect(redirectUrl);
    } catch (error) {
      console.error('Google OAuth callback error:', error);
      res.redirect((process.env.CLIENT_ORIGIN || 'http://localhost:3000') + '/login?error=google');
    }
  }
);

// Forgot Password - Check if email exists
authRouter.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const user = await User.findOne({ email, provider: 'local' });
    if (!user) {
      return res.status(404).json({ error: 'Account not found' });
    }

    // In a real application, you would:
    // 1. Generate a secure reset token
    // 2. Store it in the database with expiration
    // 3. Send an email with the reset link
    
    // For demo purposes, we'll just return success
    res.json({ 
      message: 'Password reset instructions have been sent to your email',
      // In production, don't return the token
      resetToken: 'demo-reset-token-' + Date.now()
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reset Password
authRouter.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ error: 'Token and password are required' });
    }

    // In a real application, you would:
    // 1. Verify the token and check expiration
    // 2. Find the user by token
    // 3. Update the password
    
    // For demo purposes, we'll just return success
    res.json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Change Password (for authenticated users)
authRouter.put('/change-password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.provider !== 'local') {
      return res.status(400).json({ error: 'Password change not available for OAuth accounts' });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete Account
authRouter.delete('/account', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Delete all user's posts
    await Post.deleteMany({ author: req.user.id });
    
    // Delete the user account
    await User.findByIdAndDelete(req.user.id);

    clearAuthCookie(res);
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Export router as default
export default authRouter;
