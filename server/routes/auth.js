import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { generateOTP, sendOTP } from '../utils/otp.js';
import { sendMagicLink } from '../utils/magicLink.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

// Register with password
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, authMethod = 'password' } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'User already exists with this email' 
      });
    }

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      phone,
      password,
      authMethod,
      isVerified: true // Auto-verify for demo purposes
    });

    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Registration failed', 
      error: error.message 
    });
  }
});

// Login with password
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Login failed', 
      error: error.message 
    });
  }
});

// Social auth (Google, GitHub)
router.post('/social', async (req, res) => {
  try {
    const { email, provider, providerId, firstName, lastName, avatar } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      // Create new user for social auth
      user = new User({
        email,
        firstName: firstName || '',
        lastName: lastName || '',
        authMethod: provider,
        isVerified: true,
        profile: {
          avatar: avatar || ''
        }
      });

      // Set provider-specific ID
      if (provider === 'google') user.googleId = providerId;
      if (provider === 'github') user.githubId = providerId;

      await user.save();
    } else {
      // Update existing user
      user.lastLogin = new Date();
      if (avatar && !user.profile.avatar) {
        user.profile.avatar = avatar;
      }
      await user.save();
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: `${provider} authentication successful`,
      token,
      user
    });
  } catch (error) {
    console.error('Social auth error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Social authentication failed', 
      error: error.message 
    });
  }
});

// Send OTP
router.post('/send-otp', async (req, res) => {
  try {
    const { phone } = req.body;

    const otp = generateOTP();
    
    // In a real app, you'd send SMS here
    // For demo, we'll just log it
    console.log(`📱 OTP for ${phone}: ${otp}`);

    // Store OTP in database (in production, use Redis or similar)
    // For demo, we'll return it in response
    res.json({
      success: true,
      message: 'OTP sent successfully',
      otp: otp // Remove this in production!
    });
  } catch (error) {
    console.error('OTP send error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send OTP', 
      error: error.message 
    });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { phone, otp } = req.body;

    // In production, verify against stored OTP
    // For demo, accept any 6-digit OTP
    if (otp.length === 6) {
      let user = await User.findOne({ phone });

      if (!user) {
        // Create new user with phone auth
        user = new User({
          email: `${phone}@phone.local`, // Temporary email
          phone,
          authMethod: 'otp',
          isVerified: true,
          otpVerified: true
        });
        await user.save();
      }

      const token = generateToken(user._id);

      res.json({
        success: true,
        message: 'OTP verified successfully',
        token,
        user
      });
    } else {
      res.status(400).json({ 
        success: false, 
        message: 'Invalid OTP' 
      });
    }
  } catch (error) {
    console.error('OTP verify error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'OTP verification failed', 
      error: error.message 
    });
  }
});

// Send Magic Link
router.post('/magic-link', async (req, res) => {
  try {
    const { email } = req.body;

    // Generate magic link token
    const magicToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: '15m' });
    const magicLink = `${req.protocol}://${req.get('host')}/api/auth/verify-magic?token=${magicToken}`;

    // In production, send email here
    console.log(`🔗 Magic link for ${email}: ${magicLink}`);

    res.json({
      success: true,
      message: 'Magic link sent to your email',
      magicLink: magicLink // Remove this in production!
    });
  } catch (error) {
    console.error('Magic link error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send magic link', 
      error: error.message 
    });
  }
});

// Verify Magic Link
router.get('/verify-magic', async (req, res) => {
  try {
    const { token } = req.query;

    const decoded = jwt.verify(token, JWT_SECRET);
    const { email } = decoded;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        email,
        authMethod: 'magic',
        isVerified: true
      });
      await user.save();
    }

    const authToken = generateToken(user._id);

    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}?token=${authToken}&success=true`);
  } catch (error) {
    console.error('Magic link verify error:', error);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}?error=invalid_token`);
  }
});

// Biometric registration/auth
router.post('/biometric', async (req, res) => {
  try {
    const { email, biometricData } = req.body;

    // In production, you'd process actual biometric data
    // For demo, we'll simulate it
    const biometricHash = Buffer.from(biometricData).toString('base64');

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        email,
        authMethod: 'biometric',
        biometricHash,
        isVerified: true
      });
      await user.save();
    } else {
      user.biometricHash = biometricHash;
      user.lastLogin = new Date();
      await user.save();
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Biometric authentication successful',
      token,
      user
    });
  } catch (error) {
    console.error('Biometric auth error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Biometric authentication failed', 
      error: error.message 
    });
  }
});

export default router;