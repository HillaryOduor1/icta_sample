import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number },
  url: { type: String },
  path: { type: String },
  type: { type: String, enum: ['image', 'video', 'document', 'other'], default: 'image' },
  metadata: { width: Number, height: Number, alt: String, caption: String },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tenantId: { type: String, required: true, index: true },
  createdAt: { type: Date, default: Date.now },
  usedIn: [{ page: String, section: String }],
});

export const MediaModel = mongoose.model('Media', mediaSchema);

/*last stable version
const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  size: Number,
  path: String,
  url: String,
  type: {
    type: String,
    enum: ['image', 'video', 'document', 'other'],
    default: 'image'
  },
  metadata: {
    width: Number,
    height: Number,
    alt: String,
    caption: String
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  usedIn: [{
    page: String,
    section: String
  }]
});

//module.exports = mongoose.model('Media', mediaSchema);
module.exports = mediaSchema;*/