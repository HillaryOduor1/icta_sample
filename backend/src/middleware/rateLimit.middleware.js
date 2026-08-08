import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { redisClient } from '../config/redis.js';
import { ipKeyGenerator } from 'express-rate-limit';

const isDev = process.env.NODE_ENV === 'development';

export const globalRateLimiter = rateLimit({
  store: new RedisStore({ sendCommand: (...args) => redisClient.call(...args) }),
  windowMs: 60 * 1000,
  max: isDev ? 1000 : 100, // much higher in dev
  keyGenerator: (req) => req.tenantId ? `tenant:${req.tenantId}` : ipKeyGenerator(req.ip),
  standardHeaders: true,
  legacyHeaders: false,
});

export const authRateLimiter = rateLimit({
  store: new RedisStore({ sendCommand: (...args) => redisClient.call(...args) }),
  windowMs: 15 * 60 * 1000,
  max: isDev ? 50 : 5,
  keyGenerator: (req) => ipKeyGenerator(req.ip),
  skipSuccessfulRequests: true,
});

