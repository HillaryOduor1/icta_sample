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
/*import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { redisClient } from '../config/redis.js';
import { ipKeyGenerator } from 'express-rate-limit'; // <-- Import the helper

export const globalRateLimiter = rateLimit({
  store: new RedisStore({ sendCommand: (...args) => redisClient.call(...args) }),
  windowMs: 60 * 1000, // 1 minute
  max: 100,
  keyGenerator: (req) => {
    // If you have a tenant ID, use it as the primary key
    if (req.tenantId) {
      return `tenant:${req.tenantId}`;
    }
    // IMPORTANT: For IP fallbacks, use ipKeyGenerator(req.ip)
    // This applies a /56 subnet mask to IPv6 addresses to prevent bypasses.
    return ipKeyGenerator(req.ip);
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const authRateLimiter = rateLimit({
  store: new RedisStore({ sendCommand: (...args) => redisClient.call(...args) }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  keyGenerator: (req) => ipKeyGenerator(req.ip), // <-- Always use ipKeyGenerator when keying by IP
  skipSuccessfulRequests: true,
});*/

/*import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { redisClient } from '../config/redis.js';

export const globalRateLimiter = rateLimit({
  store: new RedisStore({ sendCommand: (...args) => redisClient.call(...args) }),
  windowMs: 60 * 1000,
  max: 100,
  keyGenerator: (req) => req.tenantId || req.ip,
  standardHeaders: true,
  legacyHeaders: false,
});

export const authRateLimiter = rateLimit({
  store: new RedisStore({ sendCommand: (...args) => redisClient.call(...args) }),
  windowMs: 15 * 60 * 1000,
  max: 5,
  keyGenerator: (req) => req.ip,
  skipSuccessfulRequests: true,
});*/