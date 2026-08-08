import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema({
  tenantId: { type: String, required: true, index: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  message: { type: String, required: true, trim: true },
  status: { type: String, enum: ['unread', 'read'], default: 'unread', index: true },
  createdAt: { type: Date, default: Date.now, index: true },
});

export const ContactMessageModel = mongoose.model('ContactMessage', contactMessageSchema);

