import { UserModel } from '../../../database/models/user.model.js';
import { ContentModel } from '../../../database/models/content.model.js';
import { ActivityLogModel } from '../../../database/models/activityLog.model.js';

export class StatsRepository {
  async getAdminStats(tenantId) {
    const [totalUsers, totalContent, totalActivity, recentActivity] = await Promise.all([
      UserModel.countDocuments({ tenantId, active: true }),
      ContentModel.countDocuments({ tenantId }),
      ActivityLogModel.countDocuments({ tenantId }),
      ActivityLogModel.find({ tenantId }).sort({ timestamp: -1 }).limit(5).lean(),
    ]);
    return {
      sectionCount: totalContent,
      activeUsers: totalUsers,
      serverLoad: '24%', // simulated – replace with real metrics
      themeMode: 'light', // from settings or default
      recentActivity,
    };
  }
}