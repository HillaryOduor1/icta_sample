import mongoose from 'mongoose';

const pendingUserSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true, minlength: 3 },
  email: { type: String, required: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['admin', 'editor', 'viewer'], default: 'viewer' },
  tenantId: { type: String, required: true, index: true },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  requestedBy: { type: String }, // IP or user info
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedAt: { type: Date },
  rejectionReason: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

// Compound index to prevent duplicate pending requests
pendingUserSchema.index({ email: 1, tenantId: 1, status: 1 }, { unique: true });

export const PendingUserModel = mongoose.model('PendingUser', pendingUserSchema);