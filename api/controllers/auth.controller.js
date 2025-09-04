const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');
const VerificationCode = require('../models/verification');
const { sendVerificationEmail } = require('../services/emailService');

// Generate random 6-digit code
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
}; 

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

exports.sendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Generate verification code
    const code = generateVerificationCode();
    
    // Delete any existing codes for this email
    await VerificationCode.deleteMany({ email });
    
    // Create new verification code
    await VerificationCode.create({
      email,
      code,
      type: 'email_verification'
    });

    // Send email
    await sendVerificationEmail(email, code);

    res.json({ message: 'Verification code sent successfully' });
  } catch (error) {
    console.error('Send verification error:', error);
    res.status(500).json({ error: 'Failed to send verification code' });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ error: 'Email and code are required' });
    }

    // Find valid verification code
    const verificationCode = await VerificationCode.findOne({
      email,
      code,
      isUsed: false,
      expiresAt: { $gt: new Date() }
    });

    if (!verificationCode) {
      return res.status(400).json({ error: 'Invalid or expired verification code' });
    }

    // Mark code as used
    verificationCode.isUsed = true;
    await verificationCode.save();

    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        isVerified: true,
        authProvider: 'email'
      });
    } else {
      user.isVerified = true;
      await user.save();
    }

    // Generate JWT token
    const token = generateToken(user._id);

    res.json({
      message: 'Email verified successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({ error: 'Failed to verify email' });
  }
};

exports.googleAuth = async (req, res) => {
  try {
    const { token, userInfo } = req.body;
    
    // Validate Google token (implement actual validation)
    // For now, we'll trust the frontend verification
    
    const { email, name, picture, sub: googleId } = userInfo;

    // Find or create user
    let user = await User.findOne({ 
      $or: [{ email }, { googleId }] 
    });

    if (!user) {
      user = await User.create({
        email,
        name,
        avatar: picture,
        googleId,
        authProvider: 'google',
        isVerified: true
      });
    } else {
      
      user.name = name;
      user.avatar = picture;
      user.isVerified = true;
      await user.save();
    }

    // Generate JWT token
    const jwtToken = generateToken(user._id);

    res.json({
      message: 'Google authentication successful',
      token: jwtToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ error: 'Failed to authenticate with Google' });
  }
};

