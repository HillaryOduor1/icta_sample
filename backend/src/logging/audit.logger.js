import { ActivityLogModel } from '../database/models/activityLog.model.js';
import { logger } from '../config/logger.js';

export const auditLogger = {
  async log(tenantId, action, label, userId, username, detail = null, metadata = null) {
    try {
      await ActivityLogModel.create({
        tenantId,
        action,
        label,
        userId,
        user: username,
        detail,
        metadata,
        timestamp: new Date(),
      });
    } catch (err) {
      logger.error({ err }, 'Failed to write audit log');
    }
  },
};