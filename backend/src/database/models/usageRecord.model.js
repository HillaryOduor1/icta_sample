import mongoose from 'mongoose';

const usageRecordSchema = new mongoose.Schema({
  tenantId: { type: String, required: true, index: true },
  metric: { type: String, enum: ['pageview', 'event', 'api_call', 'session'], required: true },
  quantity: { type: Number, default: 1 },
  timestamp: { type: Date, default: Date.now, index: true },
});

usageRecordSchema.index({ tenantId: 1, metric: 1, timestamp: -1 });

export const UsageRecordModel = mongoose.model('UsageRecord', usageRecordSchema);
/*last stable version
const mongoose = require('mongoose');

const usageRecordSchema = new mongoose.Schema({
  tenantId: { type: String,  index: true },
  metric: { type: String, enum: ['pageview', 'event', 'api_call', 'session'], required: true },
  quantity: { type: Number, default: 1 },
  timestamp: { type: Date, default: Date.now, index: true }
});

usageRecordSchema.index({ tenantId: 1, metric: 1, timestamp: 1 });

module.exports = mongoose.model('UsageRecord', usageRecordSchema);*/