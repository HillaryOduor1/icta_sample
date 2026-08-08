import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true, minlength: 3, index: true },
  email: { type: String, required: true, lowercase: true, trim: true, index: true },
  password: { type: String, select: false },
  role: { type: String, enum: ['admin', 'editor', 'viewer'], default: 'editor', index: true },
  active: { type: Boolean, default: true },
  tenantId: { type: String, required: true, index: true },
  googleId: { type: String, sparse: true, index: true },
  authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
  avatar: { type: String, default: null },
  lastLogin: { type: Date, default: null },
  loginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date, default: null },
  preferences: {
    theme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
    notifications: { type: Boolean, default: true },
  },
}, { timestamps: true });

// Completely remove the pre-save middleware for now
// We'll add password hashing back when we implement local login

userSchema.methods.comparePassword = async function(candidate) {
  if (!this.password) return false;
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.loginAttempts;
  delete obj.lockUntil;
  return obj;
};

export const UserModel = mongoose.model('User', userSchema);
