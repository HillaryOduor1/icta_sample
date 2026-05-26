import mongoose from 'mongoose';

/**
 * Refresh Token Model
 * Stores hashed refresh tokens per user + device.
 * Supports token rotation, reuse detection, and device‑specific revocation.
 */
const refreshTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  tenantId: {
    type: String,
    required: true,
    index: true,
  },
  deviceId: {
    type: String,
    required: true,
    // e.g., SHA256(ip + userAgent)
  },
  tokenHash: {
    type: String,
    required: true,
    // bcrypt hash of the raw refresh token
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    index: { expires: 0 }, // TTL index – MongoDB will auto‑delete
  },
  isRevoked: {
    type: Boolean,
    default: false,
  },
  lastUsedAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index for fast lookup during token refresh
refreshTokenSchema.index({ userId: 1, deviceId: 1 });
refreshTokenSchema.index({ tokenHash: 1 }); // for reuse detection lookups

// Static method to revoke all tokens for a user (logout‑all)
refreshTokenSchema.statics.revokeAllForUser = async function(userId, tenantId) {
  return this.updateMany(
    { userId, tenantId, isRevoked: false },
    { isRevoked: true, lastUsedAt: new Date() }
  );
};

// Static method to revoke a specific device
refreshTokenSchema.statics.revokeForDevice = async function(userId, deviceId, tenantId) {
  return this.updateOne(
    { userId, deviceId, tenantId, isRevoked: false },
    { isRevoked: true, lastUsedAt: new Date() }
  );
};

// Instance method to mark as used (for rotation)
refreshTokenSchema.methods.markUsed = async function() {
  this.lastUsedAt = new Date();
  await this.save();
};

export const RefreshTokenModel = mongoose.model('RefreshToken', refreshTokenSchema);