import { asyncHandler } from '../../../shared/utils/asyncHandler.js';
import { successResponse } from '../../../shared/utils/response.util.js';

export const getAdminStats = asyncHandler(async (req, res) => {
  if (!req.models) {
    return res.status(500).json({ error: 'Models not attached' });
  }

  const { User, Content, ActivityLog } = req.models;

  const [userCount, contentCount, activityCount, recentActivity] = await Promise.all([
    User ? User.countDocuments() : Promise.resolve(0),
    Content ? Content.countDocuments() : Promise.resolve(0),
    ActivityLog ? ActivityLog.countDocuments() : Promise.resolve(0),
    ActivityLog ? ActivityLog.find().sort({ createdAt: -1 }).limit(5) : Promise.resolve([])
  ]);

  return successResponse(res, 200, 'Stats retrieved', {
    sectionCount: contentCount,
    activeUsers: userCount,
    serverLoad: '24%',
    themeMode: 'light',
    recentActivity: recentActivity || []
  });
});
