import mongoose from 'mongoose';

const tenantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  domain: { type: String, unique: true, sparse: true },
  dbName: { type: String, required: true, unique: true },
  siteId: { type: String, required: true, unique: true },
  contactEmail: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export const TenantModel = mongoose.model('Tenant', tenantSchema);

