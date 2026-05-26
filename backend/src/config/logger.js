import pino from 'pino';
import { config } from './env.js';

const level = config.env === 'production' ? 'info' : 'debug';
const isProduction = config.env === 'production';

export const logger = pino({
  level,
  base: { service: 'saas-backend' },
  formatters: {
    bindings: (bindings) => ({ pid: bindings.pid, host: bindings.hostname }),
    level: (label) => ({ level: label }),
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  redact: ['req.headers.authorization', 'req.body.password', 'res.headers'],
  transport: isProduction ? undefined : { target: 'pino-pretty' },
});

export const requestSerializer = (req) => ({
  id: req.id,
  method: req.method,
  url: req.url,
  ip: req.ip,
  userAgent: req.headers['user-agent'],
  userId: req.user?.id,
  tenantId: req.tenantId,
});