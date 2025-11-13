
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { sendOTPEmail, sendPasswordResetEmail } = require('../utils/emailService');

const router = express.Router();

// Helper: Generate JWT
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Helper: Generate 6-digit OTP
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Store OTPs temporarily (in production, use Redis)
const otpStore = new Map();

// Register - Send OTP ONLY (Don't create user yet)
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists (even unverified ones)
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: 'User with this email or username already exists' 
      });
    }
    if (!username || username.trim() === "") {
  return res.status(400).json({
    success: false,
    message: "Username is required"
  });
}

  

    // Validate password
    if (password.length < 6) {
      return res.status(400).json({ 
        success: false,
        message: 'Password must be at least 6 characters long' 
      });
    }
console.log("SENDING OTP TO:", email, "USERNAME:", username);
    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store OTP temporarily with user data
    otpStore.set(email, {
      otp,
      expiry: otpExpiry,
      userData: { username, email, password }
    });

    // Send OTP email
    try {
      await sendOTPEmail(email, otp, username);
      res.json({ 
        success: true,
        message: 'OTP sent to your email address',
        email: email,
        requiresOTP: true // Important flag for frontend
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      return res.status(500).json({ 
        success: false,
        message: 'Failed to send OTP email' 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error during registration', 
      error: error.message 
    });
  }
});

// Verify OTP and Complete Registration (MANDATORY)
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ 
        success: false,
        message: 'Email and OTP are required' 
      });
    }

    const storedData = otpStore.get(email);
    
    if (!storedData) {
      return res.status(400).json({ 
        success: false,
        message: 'OTP expired or invalid. Please request a new OTP.' 
      });
    }

    if (Date.now() > storedData.expiry) {
      otpStore.delete(email);
      return res.status(400).json({ 
        success: false,
        message: 'OTP has expired. Please request a new OTP.' 
      });
    }

    if (storedData.otp !== otp) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid OTP' 
      });
    }

    // OTP verified, NOW create user
    const { username, email: userEmail, password } = storedData.userData;
    
    // Check again if user exists (race condition)
    const existingUser = await User.findOne({ $or: [{ email: userEmail }, { username }] });
    if (existingUser) {
      otpStore.delete(email);
      return res.status(400).json({ 
        success: false,
        message: 'User already exists. Please login instead.' 
      });
    }

    // Create user with verified status
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ 
      username, 
      email: userEmail, 
      password: hashedPassword,
      isVerified: true // Mark as verified
    });
    
    await user.save();

    // Clean up OTP store
    otpStore.delete(email);

    // Generate token ONLY after successful verification
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        preferences: user.preferences,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error verifying OTP', 
      error: error.message 
    });
  }
});

// Resend OTP
router.post('/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false,
        message: 'Email is required' 
      });
    }

    const storedData = otpStore.get(email);
    if (!storedData) {
      return res.status(400).json({ 
        success: false,
        message: 'No pending registration found for this email. Please start registration again.' 
      });
    }

    // Generate new OTP
    const newOTP = generateOTP();
    const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Update stored data
    storedData.otp = newOTP;
    storedData.expiry = otpExpiry;
    otpStore.set(email, storedData);

    // Send new OTP email
    try {
      await sendOTPEmail(email, newOTP, storedData.userData.username);
      res.json({ 
        success: true,
        message: 'New OTP sent to your email address',
        email: email
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      return res.status(500).json({ 
        success: false,
        message: 'Failed to send OTP email' 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error resending OTP', 
      error: error.message 
    });
  }
});

// Login - Check if user is verified
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Email and password are required' 
      });
    }

    // --- DEMO ACCOUNT AUTO-CREATION ---
    if (email === 'demo@example.com' && password === 'demo123') {
      let user = await User.findOne({ email });
      if (!user) {
        const hashedPassword = await bcrypt.hash('demo123', 10);
        user = new User({
          username: 'DemoUser',
          email: 'demo@example.com',
          password: hashedPassword,
          isVerified: true
        });
        await user.save();
      }

      const token = generateToken(user._id);
      return res.json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          preferences: user.preferences,
          isVerified: user.isVerified
        }
      });
    }
    // --- END DEMO ACCOUNT ---

    // Regular login
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid EmailId' 
      });
    }

    // ✅ IMPORTANT: Check if user is verified
    if (!user.isVerified) {
      return res.status(403).json({ 
        success: false,
        message: 'Please verify your email address before logging in',
        requiresVerification: true
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid Password' 
      });
    }

    const token = generateToken(user._id);
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        preferences: user.preferences,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error during login', 
      error: error.message 
    });
  }
});

// Update auth middleware to check verification
const requireAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'No token provided, authorization denied' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    // ✅ IMPORTANT: Check if user is verified
    if (!user.isVerified) {
      return res.status(403).json({ 
        success: false,
        message: 'Please verify your email to access this resource',
        requiresVerification: true
      });
    }

    req.userId = decoded.userId;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false,
      message: 'Token is not valid' 
    });
  }
};

// Get current user - protected route
router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error fetching user data', 
      error: error.message 
    });
  }
});



// Forgot Password - Send OTP
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // For security, don't reveal if email exists or not
      return res.json({ 
        message: 'If an account with that email exists, a password reset OTP has been sent' 
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store OTP for password reset
    otpStore.set(`reset_${email}`, {
      otp,
      expiry: otpExpiry,
      userId: user._id
    });

    // Send OTP email
    try {
      await sendPasswordResetEmail(email, otp, user.username);
      res.json({ 
        message: 'If an account with that email exists, a password reset OTP has been sent',
        // In development, return OTP for testing
        otp: process.env.NODE_ENV === 'development' ? otp : undefined
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      return res.status(500).json({ message: 'Failed to send reset OTP email' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error processing request', error: error.message });
  }
});

// Verify Reset OTP
router.post('/verify-reset-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    const storedData = otpStore.get(`reset_${email}`);
    
    if (!storedData) {
      return res.status(400).json({ message: 'OTP expired or invalid' });
    }

    if (Date.now() > storedData.expiry) {
      otpStore.delete(`reset_${email}`);
      return res.status(400).json({ message: 'OTP has expired' });
    }

    if (storedData.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { userId: storedData.userId }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    // Store reset token
    otpStore.set(`reset_token_${email}`, {
      resetToken,
      expiry: Date.now() + 60 * 60 * 1000 // 1 hour
    });

    res.json({ 
      message: 'OTP verified successfully',
      resetToken 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying OTP', error: error.message });
  }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
      return res.status(400).json({ message: 'Reset token and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Verify token
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Hash new password and update
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // Clean up
    otpStore.delete(`reset_token_${user.email}`);

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ message: 'Reset token has expired' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(400).json({ message: 'Invalid reset token' });
    }
    res.status(500).json({ message: 'Error resetting password', error: error.message });
  }
});


router.put('/preferences', auth, async (req, res) => {
  try {
    const { theme, defaultFont } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: { 'preferences.theme': theme, 'preferences.defaultFont': defaultFont } },
      { new: true }
    ).select('-password');

    res.json({ message: 'Preferences updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating preferences', error: error.message });
  }
});













// ... rest of your routes (forgot-password, etc.) remain the same
module.exports = router;
