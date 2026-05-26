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
/*import { asyncHandler } from '../../../shared/utils/asyncHandler.js';
import { successResponse } from '../../../shared/utils/response.util.js';

export const getAdminStats = asyncHandler(async (req, res) => {
  console.log('📈 [Stats] Fetching admin stats');

  try {
    if (!req.models) {
      console.error('❌ req.models missing');
      return res.status(500).json({ error: 'Models not attached' });
    }

    const { User, Content, Media, ActivityLog } = req.models;

    // Parallel queries (FAST)
    const [
      userCount,
      contentCount,
      mediaCount,
      activityCount,
      recentActivity
    ] = await Promise.all([
      User ? User.countDocuments() : Promise.resolve(0),
      Content ? Content.countDocuments() : Promise.resolve(0),
      Media ? Media.countDocuments() : Promise.resolve(0),
      ActivityLog ? ActivityLog.countDocuments() : Promise.resolve(0),
      ActivityLog ? ActivityLog.find().sort({ createdAt: -1 }).limit(5) : Promise.resolve([])
    ]);

    console.log('✅ Stats computed');

    return successResponse(res, 200, 'Stats retrieved', {
      sectionCount: contentCount,
      activeUsers: userCount,
      serverLoad: '24%',
      themeMode: 'light',
      recentActivity: recentActivity || []
    });

  } catch (error) {
    console.error('❌ getAdminStats ERROR:', error.stack);
    throw error;
  }
});*/
/*import { StatsService } from '../services/stats.service.js';
import { asyncHandler } from '../../../shared/utils/asyncHandler.js';
import { successResponse } from '../../../shared/utils/response.util.js';

const statsService = new StatsService();

export const getAdminStats = asyncHandler(async (req, res) => {
  const stats = await statsService.getAdminStats(req.tenantId);
  return successResponse(res, 200, 'Admin stats retrieved', stats);
});*/


/*last stable version
// backend/controllers/statsController.js
exports.getAdminStats = async (req, res) => {
  try {
    const User = req.models.User;
    const Content = req.models.Content;
    const ActivityLog = req.models.ActivityLog;

    const totalUsers = await User.countDocuments();
    const totalContent = await Content.countDocuments();
    const totalActivity = await ActivityLog.countDocuments();
    const recentActivity = await ActivityLog.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      sectionCount: totalContent,
      activeUsers: totalUsers,
      serverLoad: '24%',
      themeMode: 'light',
      recentActivity
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};*/


/*// controllers/statsController.js

exports.getAdminStats = async (req, res) => {
  console.log('📈 [Stats] Fetching admin stats');

  try {
    if (!req.models) {
      console.error('❌ req.models missing');
      return res.status(500).json({ error: 'Models not attached' });
    }

    const { User, Content, Media, ActivityLog } = req.models;

    // Parallel queries (FAST)
    const [
      userCount,
      contentCount,
      mediaCount,
      activityCount,
      recentActivity
    ] = await Promise.all([
      User.countDocuments(),
      Content.countDocuments(),
      Media.countDocuments(),
      ActivityLog.countDocuments(),
      ActivityLog.find()
        .sort({ createdAt: -1 })
        .limit(10)
    ]);

    console.log('✅ Stats computed');

    res.json({
      users: userCount,
      content: contentCount,
      media: mediaCount,
      activity: activityCount,
      recentActivity
    });

  } catch (error) {
    console.error('❌ getAdminStats ERROR:', error.stack);
    res.status(500).json({ error: error.message });
  }
};*/