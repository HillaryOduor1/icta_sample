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
