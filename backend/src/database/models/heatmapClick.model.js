import mongoose from 'mongoose';

const heatmapClickSchema = new mongoose.Schema({
  tenantId: { type: String, index: true },
  page: { type: String, required: true, index: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  element: { type: String },
  sessionId: { type: String },
  timestamp: { type: Date, default: Date.now, expires: '90d' },
});

heatmapClickSchema.index({ page: 1, tenantId: 1, timestamp: -1 });

export const HeatmapClickModel = mongoose.model('HeatmapClick', heatmapClickSchema);

