import { ActivityService } from '../services/activity.service.js';
import { ActivityTransformer } from '../transformers/activity.transformer.js';
import { asyncHandler } from '../../../shared/utils/asyncHandler.js';
import { successResponse } from '../../../shared/utils/response.util.js';

export const getActivityLogs = asyncHandler(async (req, res) => {
  const activityService = new ActivityService(req.models.ActivityLog);
  const { page = 1, limit = 50, action, user } = req.query;
  const pagination = { page: parseInt(page), limit: parseInt(limit) };
  const filter = {};
  if (action) filter.action = action;
  if (user) filter.user = user;
  const result = await activityService.getLogs(req.tenantId, filter, pagination);
  const response = ActivityTransformer.toPaginatedResponse(result.logs, pagination, result.total, req);
  return successResponse(res, 200, 'Activity logs retrieved', response.data, response.meta, response.links);
});

export const getActivityStats = asyncHandler(async (req, res) => {
  const activityService = new ActivityService(req.models.ActivityLog);
  const stats = await activityService.getStats(req.tenantId);
  return successResponse(res, 200, 'Activity stats', stats);
});

export const clearLogs = asyncHandler(async (req, res) => {
  const activityService = new ActivityService(req.models.ActivityLog);
  const deletedCount = await activityService.clearLogs(req.tenantId);
  return successResponse(res, 200, 'Logs cleared', { deletedCount });
});
/*import { ActivityService } from '../services/activity.service.js';
import { ActivityTransformer } from '../transformers/activity.transformer.js';
import { asyncHandler } from '../../../shared/utils/asyncHandler.js';
import { successResponse } from '../../../shared/utils/response.util.js';

const activityService = new ActivityService();

export const getActivityLogs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 50, action, user } = req.query;
  const pagination = { page: parseInt(page), limit: parseInt(limit) };
  const filter = {};
  if (action) filter.action = action;
  if (user) filter.user = user;
  const result = await activityService.getLogs(req.tenantId, filter, pagination);
  const response = ActivityTransformer.toPaginatedResponse(result.logs, pagination, result.total, req);
  return successResponse(res, 200, 'Activity logs retrieved', response.data, response.meta, response.links);
});

export const getActivityStats = asyncHandler(async (req, res) => {
  const stats = await activityService.getStats(req.tenantId);
  return successResponse(res, 200, 'Activity stats', stats);
});

export const clearLogs = asyncHandler(async (req, res) => {
  const deletedCount = await activityService.clearLogs(req.tenantId);
  return successResponse(res, 200, 'Logs cleared', { deletedCount });
});*/

/*last stable version
// controllers/activityController.js

exports.getActivityLogs = async (req, res) => {
  console.log('📊 [Activity] GET logs');

  try {
    const ActivityLog = req.models.ActivityLog;

    const { page = 1, limit = 50 } = req.query;

    const logs = await ActivityLog.find()
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    const total = await ActivityLog.countDocuments();

    res.json({
      logs,
      total
    });

  } catch (error) {
    console.error('❌ Activity error:', error.stack);
    res.status(500).json({ error: error.message });
  }
};

exports.getActivityStats = async (req, res) => {
  console.log('📊 [Activity] Stats');

  try {
    const ActivityLog = req.models.ActivityLog;

    const total = await ActivityLog.countDocuments();

    res.json({ total });

  } catch (error) {
    console.error('❌ Activity stats error:', error.stack);
    res.status(500).json({ error: error.message });
  }
};

exports.clearLogs = async (req, res) => {
  console.log('🗑️ [Activity] Clear logs');

  try {
    const ActivityLog = req.models.ActivityLog;

    // Delete all logs
    const result = await ActivityLog.deleteMany({});

    // Optional: log the clear action (it will be deleted, but that's okay)
    // If you want to keep a record of the clear event, you could log it to a separate system log.

    res.json({
      message: 'All activity logs cleared',
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('❌ Clear logs error:', error.stack);
    res.status(500).json({ error: error.message });
  }
};*/


/*exports.getActivityLogs = async (req, res) => {
  console.log('📊 [Activity] GET logs');

  try {
    const ActivityLog = req.models.ActivityLog;

    const { page = 1, limit = 50 } = req.query;

    const logs = await ActivityLog.find()
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    const total = await ActivityLog.countDocuments();

    res.json({
      logs,
      total
    });

  } catch (error) {
    console.error('❌ Activity error:', error.stack);
    res.status(500).json({ error: error.message });
  }
};

exports.getActivityStats = async (req, res) => {
  console.log('📊 [Activity] Stats');

  try {
    const ActivityLog = req.models.ActivityLog;

    const total = await ActivityLog.countDocuments();

    res.json({ total });

  } catch (error) {
    console.error('❌ Activity stats error:', error.stack);
    res.status(500).json({ error: error.message });
  }
};*/
/*const ActivityLog = require('../models/ActivityLog');

// Get activity logs with pagination
exports.getActivityLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50, action, user } = req.query;
    const skip = (page - 1) * limit;
    
    const query = {};
    if (action) query.action = action;
    if (user) query.user = user;
    
    const logs = await ActivityLog.find(query)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await ActivityLog.countDocuments(query);
    
    res.json({
      logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Clear activity logs
exports.clearLogs = async (req, res) => {
  try {
    await ActivityLog.deleteMany({});
    res.json({ message: 'Activity logs cleared' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get activity stats
exports.getActivityStats = async (req, res) => {
  try {
    const now = new Date();
    const today = new Date(now.setHours(0, 0, 0, 0));
    const weekAgo = new Date(now.setDate(now.getDate() - 7));
    
    const stats = {
      total: await ActivityLog.countDocuments(),
      today: await ActivityLog.countDocuments({ timestamp: { $gte: today } }),
      thisWeek: await ActivityLog.countDocuments({ timestamp: { $gte: weekAgo } }),
      byAction: await ActivityLog.aggregate([
        { $group: { _id: '$action', count: { $sum: 1 } } }
      ]),
      byUser: await ActivityLog.aggregate([
        { $group: { _id: '$user', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ])
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};*/