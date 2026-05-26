import mongoose from 'mongoose';

const funnelStepSchema = new mongoose.Schema({
  name: String,
  order: Number,
  targetEvent: String,
}, { _id: false });

const funnelSchema = new mongoose.Schema({
  tenantId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  steps: [funnelStepSchema],
  createdAt: { type: Date, default: Date.now },
});

export const FunnelModel = mongoose.model('Funnel', funnelSchema);  
/*last stable version
const mongoose = require('mongoose');

const funnelStepSchema = new mongoose.Schema({
  name: String,
  order: Number,
  targetEvent: String
});

const funnelSchema = new mongoose.Schema({
  tenantId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  steps: [funnelStepSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Funnel', funnelSchema);*/