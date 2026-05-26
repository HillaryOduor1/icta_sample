import { logger } from '../config/logger.js';

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 && !err.isOperational ? 'Internal server error' : err.message;

  logger.error({
    err,
    requestId: req.id,
    userId: req.user?.id,
    tenantId: req.tenantId,
    method: req.method,
    url: req.url,
  }, err.message);

  const response = {
    success: false,
    message,
    requestId: req.id,
    timestamp: new Date().toISOString(),
  };
  if (err.details) response.errors = err.details;
  if (process.env.NODE_ENV !== 'production' && err.stack) response.stack = err.stack;

  res.status(statusCode).json(response);
};