import mongoose from 'mongoose';

const masterUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  name: { type: String },
  googleId: { type: String, unique: true, sparse: true },
  role: { type: String, enum: ['superadmin'], default: 'superadmin' },
  avatar: { type: String },
}, { timestamps: true });

export const MasterUserModel = mongoose.model('MasterUser', masterUserSchema);
