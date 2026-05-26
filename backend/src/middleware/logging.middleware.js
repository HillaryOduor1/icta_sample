import { logger, requestSerializer } from '../config/logger.js';

export const requestLogger = (req, res, next) => {
  const start = Date.now();
  req.log = logger.child({ req: requestSerializer(req) });
  req.log.info('Incoming request');
  res.on('finish', () => {
    const duration = Date.now() - start;
    req.log.info({ res: { statusCode: res.statusCode }, duration }, 'Request completed');
  });
  next();
};