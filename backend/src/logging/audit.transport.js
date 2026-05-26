// Example: send audit logs to external service (ELK, Datadog)
import { logger } from '../config/logger.js';

export const sendAuditToExternal = (logEntry) => {
  // Implement HTTP call to logging collector
  logger.debug({ logEntry }, 'Audit log sent to external');
};