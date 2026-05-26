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


/*import mongoose from 'mongoose';
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

userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

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

export const UserModel = mongoose.model('User', userSchema);*/
/*last stable version
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    trim: true,
    minlength: 3,
    index: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: /^\S+@\S+\.\S+$/,
    index: true
  },
  password: {
    type: String,
    // required only for local auth (non-google)
    required: function() {
      return this.authProvider !== 'google';
    },
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['admin', 'editor', 'viewer'],
    default: 'editor',
    index: true
  },
  active: {
    type: Boolean,
    default: true
  },
  avatar: {
    type: String,
    default: null
  },
  lastLogin: {
    type: Date,
    default: null
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date,
    default: null
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system'
    },
    notifications: {
      type: Boolean,
      default: true
    }
  },
  // OAuth fields
  googleId: {
    type: String,
    sparse: true,
    index: true
  },
  authProvider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local'
  }
}, {
  timestamps: true
});

// Hash password only if it exists and has been modified
userSchema.pre('save', async function() {
  if (!this.isModified('password') || !this.password) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password – always false for Google users (no password)
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (this.authProvider !== 'local') return false;
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.isAdmin = function() {
  return this.role === 'admin';
};

userSchema.methods.isEditor = function() {
  return ['admin', 'editor'].includes(this.role);
};

userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.loginAttempts;
  delete obj.lockUntil;
  return obj;
};

module.exports = userSchema;*/

/*const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    trim: true,
    minlength: 3,
    index: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: /^\S+@\S+\.\S+$/,
    index: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['admin', 'editor', 'viewer'],
    default: 'editor',
    index: true
  },
  active: {
    type: Boolean,
    default: true
  },
  avatar: {
    type: String,
    default: null
  },
  lastLogin: {
    type: Date,
    default: null
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date,
    default: null
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system'
    },
    notifications: {
      type: Boolean,
      default: true
    }
  },
  // 🔽 NEW fields for OAuth
  googleId: {
    type: String,
    sparse: true,
    index: true
  },
  authProvider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local'
  }
}, {
  timestamps: true
});

// Hash password only if modified and provider is local
userSchema.pre('save', async function() {
  if (!this.isModified('password') || this.authProvider !== 'local') return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  if (this.authProvider !== 'local') return false;
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.isAdmin = function() {
  return this.role === 'admin';
};

userSchema.methods.isEditor = function() {
  return ['admin', 'editor'].includes(this.role);
};

userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.loginAttempts;
  delete obj.lockUntil;
  return obj;
};

module.exports = userSchema;*/
/*const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    trim: true,
    minlength: 3,
    index: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: /^\S+@\S+\.\S+$/,
    index: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false // 🔐 NEVER return password by default
  },
  role: {
    type: String,
    enum: ['admin', 'editor', 'viewer'],
    default: 'editor',
    index: true
  },
  active: {
    type: Boolean,
    default: true
  },
  avatar: {
    type: String,
    default: null
  },
  lastLogin: {
    type: Date,
    default: null
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date,
    default: null
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system'
    },
    notifications: {
      type: Boolean,
      default: true
    }
  },
  googleId: {
  type: String,
  sparse: true,   // allows multiple nulls but enforces uniqueness when present
  index: true
},
authProvider: {
  type: String,
  enum: ['local', 'google'],
  default: 'local'
},


}, {
  timestamps: true
});

// 🔐 HASH PASSWORD – async, no `next` parameter
userSchema.pre('save', async function() {
  // Only hash if password is modified
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// 🔐 COMPARE PASSWORD
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// 🔐 ROLE CHECK HELPERS
userSchema.methods.isAdmin = function() {
  return this.role === 'admin';
};

userSchema.methods.isEditor = function() {
  return ['admin', 'editor'].includes(this.role);
};

userSchema.methods.isViewer = function() {
  return true; // all roles
};

// 🔐 SANITIZE OUTPUT
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.loginAttempts;
  delete obj.lockUntil;
  return obj;
};

module.exports = userSchema;*/