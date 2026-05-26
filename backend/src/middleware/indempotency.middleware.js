import { redisClient } from '../config/redis.js';

export const idempotencyMiddleware = async (req, res, next) => {
  const idempotencyKey = req.headers['idempotency-key'];
  if (!idempotencyKey || !['POST', 'PUT', 'PATCH'].includes(req.method)) {
    return next();
  }

  const key = `idem:${idempotencyKey}`;
  const cached = await redisClient.get(key);
  if (cached) {
    return res.status(200).json(JSON.parse(cached));
  }

  const originalJson = res.json;
  res.json = function(body) {
    redisClient.setex(key, 86400, JSON.stringify(body));
    originalJson.call(this, body);
  };
  next();
};