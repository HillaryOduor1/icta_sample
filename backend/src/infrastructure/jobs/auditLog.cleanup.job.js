import { ActivityLogModel } from '../../database/models/activityLog.model.js';
import { logger } from '../../config/logger.js';

/**
 * Background job: delete old audit logs based on retention policy.
 * - Debug logs: 7 days
 * - Errors: 90 days
 * - Audit logs: 1 year
 */
export const auditLogCleanupJob = async () => {
  try {
    const now = new Date();

    // Delete debug/info logs older than 7 days (action not in ['error', 'security'])
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const debugResult = await ActivityLogModel.deleteMany({
      timestamp: { $lt: sevenDaysAgo },
      action: { $nin: ['error', 'security_alert', 'user_login', 'user_logout'] },
    });
    logger.info(`Deleted ${debugResult.deletedCount} debug logs older than 7 days`);

    // Delete error logs older than 90 days
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    const errorResult = await ActivityLogModel.deleteMany({
      timestamp: { $lt: ninetyDaysAgo },
      action: { $in: ['error', 'security_alert'] },
    });
    logger.info(`Deleted ${errorResult.deletedCount} error logs older than 90 days`);

    // Delete all other logs older than 1 year (audit logs)
    const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    const auditResult = await ActivityLogModel.deleteMany({
      timestamp: { $lt: oneYearAgo },
    });
    logger.info(`Deleted ${auditResult.deletedCount} audit logs older than 1 year`);
  } catch (err) {
    logger.error({ err }, 'Audit log cleanup job failed');
  }
};

// Schedule: run daily at 2 AM