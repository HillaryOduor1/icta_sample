import { redisClient } from '../../config/redis.js';

export class CacheService {
  async get(key) {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  }

  async set(key, value, ttlSeconds = 300) {
    await redisClient.setex(key, ttlSeconds, JSON.stringify(value));
  }

  async del(key) {
    await redisClient.del(key);
  }

  async delPattern(pattern) {
    const keys = await redisClient.keys(pattern);
    if (keys.length) await redisClient.del(...keys);
  }
}