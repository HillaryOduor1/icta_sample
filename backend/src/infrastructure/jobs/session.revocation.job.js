import { redisClient } from '../../config/redis.js';
import { RefreshTokenModel } from '../../database/models/refreshToken.model.js';
import { logger } from '../../config/logger.js';

/**
 * Background job: clean up expired or revoked refresh tokens from Redis and database.
 * Run every hour.
 */
export const sessionRevocationJob = async () => {
  try {
    // 1. Remove expired refresh tokens from Redis (TTL handles auto-deletion, but we can manually clean)
    const keys = await redisClient.keys('rt:*');
    for (const key of keys) {
      const ttl = await redisClient.ttl(key);
      if (ttl <= 0) {
        await redisClient.del(key);
        logger.debug(`Removed expired Redis key: ${key}`);
      }
    }

    // 2. Soft-revoke any refresh tokens in MongoDB that have expired
    const now = new Date();
    const result = await RefreshTokenModel.updateMany(
      { expiresAt: { $lt: now }, isRevoked: false },
      { isRevoked: true }
    );
    if (result.modifiedCount > 0) {
      logger.info(`Revoked ${result.modifiedCount} expired refresh tokens in MongoDB`);
    }
  } catch (err) {
    logger.error({ err }, 'Session revocation job failed');
  }
};

// Schedule: run every hour (use cron or bullmq – here just export function)