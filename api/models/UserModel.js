const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  name: {
    type: String,
    trim: true
  },
  avatar: {
    type: String
  },
  authProvider: {
    type: String,
    enum: ['email', 'google'],
    default: 'email'
  },
  googleId: {
    type: String,
    sparse: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  subscription: {
    type: {
      type: String,
      enum: ['free', 'premium'],
      default: 'free'
    },
    expiresAt: Date
  },
  preferences: {
    language: {
      type: String,
      default: 'en'
    },
    notifications: {
      type: Boolean,
      default: true
    }
  }
}, {
  timestamps: true
});

// Hash password before saving (if we add password field later)
userSchema.pre('save', async function(next) {
  if (this.password && this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

userSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
