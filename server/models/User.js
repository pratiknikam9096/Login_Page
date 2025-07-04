import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: function() {
      return this.authMethod === 'password';
    }
  },
  lastName: {
    type: String,
    required: function() {
      return this.authMethod === 'password';
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  phone: {
    type: String,
    sparse: true
  },
  password: {
    type: String,
    required: function() {
      return this.authMethod === 'password';
    }
  },
  authMethod: {
    type: String,
    enum: ['password', 'google', 'github', 'biometric', 'otp', 'magic', 'sso'],
    required: true
  },
  company: {
    type: String
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  lastLogin: {
    type: Date,
    default: Date.now
  },
  profile: {
    avatar: String,
    bio: String,
    location: String,
    website: String
  },
  // Social auth specific fields
  googleId: String,
  githubId: String,
  // Biometric data (hashed)
  biometricHash: String,
  // OTP related
  otpSecret: String,
  otpVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove sensitive data when converting to JSON
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.biometricHash;
  delete userObject.otpSecret;
  delete userObject.verificationToken;
  delete userObject.resetPasswordToken;
  return userObject;
};

export default mongoose.model('User', userSchema);