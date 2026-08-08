import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  visitorId: { type: String, required: true, index: true },
  sessionId: { type: String, required: true, index: true },
  tenantId: { type: String, index: true },
  page: { type: String },
  event: { type: String },
  type: { type: String, enum: ['pageview', 'event', 'funnel_step', 'heatmap'], default: 'pageview' },
  metadata: mongoose.Schema.Types.Mixed,
  timestamp: { type: Date, default: Date.now, index: true },
});

analyticsSchema.index({ tenantId: 1, timestamp: -1 });
analyticsSchema.index({ sessionId: 1, type: 1 });

export const AnalyticsModel = mongoose.model('Analytics', analyticsSchema);

