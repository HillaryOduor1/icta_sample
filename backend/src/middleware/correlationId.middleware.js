import { randomUUID } from 'crypto';

export const correlationIdMiddleware = (req, res, next) => {
  const id = req.headers['x-request-id'] || randomUUID();
  req.id = id;
  res.setHeader('X-Request-Id', id);
  next();
};