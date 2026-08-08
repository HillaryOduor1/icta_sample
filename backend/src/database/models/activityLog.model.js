import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
  action: { type: String, required: true, index: true },
  label: { type: String, required: true },
  detail: { type: String },
  user: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tenantId: { type: String, required: true, index: true },
  ip: { type: String },
  userAgent: { type: String },
  timestamp: { type: Date, default: Date.now, index: true },
  metadata: mongoose.Schema.Types.Mixed,
});

//activityLogSchema.index({ tenantId: 1, timestamp: -1 });
//activityLogSchema.index({ action: 1, tenantId: 1 });
// Add indexes for better query performance
activityLogSchema.index({ tenantId: 1, timestamp: -1 });
activityLogSchema.index({ action: 1, tenantId: 1 });
activityLogSchema.index({ userId: 1, tenantId: 1 });

export const ActivityLogModel = mongoose.model('ActivityLog', activityLogSchema);
