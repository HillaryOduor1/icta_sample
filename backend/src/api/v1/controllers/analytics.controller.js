import { AnalyticsService } from '../services/analyics.service.js';
import { asyncHandler } from '../../../shared/utils/asyncHandler.js';
import { successResponse } from '../../../shared/utils/response.util.js';
import { ValidationError } from '../../../shared/errors/ValidationError.js';

export const trackEvent = asyncHandler(async (req, res) => {
  const analyticsService = new AnalyticsService(
    req.models.Analytics,
    req.models.HeatmapClick,
    req.models.Funnel,
    req.models.UsageRecord
  );
  const { visitorId, sessionId, page, event, type, metadata } = req.body;
  await analyticsService.trackEvent({ visitorId, sessionId, tenantId: req.tenantId, page, event, type, metadata });
  return successResponse(res, 200, 'Event tracked');
});

export const trackHeatmap = asyncHandler(async (req, res) => {
  const analyticsService = new AnalyticsService(
    req.models.Analytics,
    req.models.HeatmapClick,
    req.models.Funnel,
    req.models.UsageRecord
  );
  const events = Array.isArray(req.body) ? req.body : [req.body];
  await analyticsService.trackHeatmapClicks(events, req.tenantId);
  return successResponse(res, 200, 'Heatmap data saved');
});

export const getStats = asyncHandler(async (req, res) => {
  const analyticsService = new AnalyticsService(
    req.models.Analytics,
    req.models.HeatmapClick,
    req.models.Funnel,
    req.models.UsageRecord
  );
  const { range = '7d' } = req.query;
  const stats = await analyticsService.getStats(req.tenantId, range);
  return successResponse(res, 200, 'Analytics stats', stats);
});

export const getHeatmap = asyncHandler(async (req, res) => {
  const analyticsService = new AnalyticsService(
    req.models.Analytics,
    req.models.HeatmapClick,
    req.models.Funnel,
    req.models.UsageRecord
  );
  const { page, range = '30d' } = req.query;
  if (!page) throw new ValidationError('Page parameter required');
  const clicks = await analyticsService.getHeatmapClicks(req.tenantId, page, range);
  return successResponse(res, 200, 'Heatmap data', clicks);
});

export const getFunnels = asyncHandler(async (req, res) => {
  const analyticsService = new AnalyticsService(
    req.models.Analytics,
    req.models.HeatmapClick,
    req.models.Funnel,
    req.models.UsageRecord
  );
  const funnels = await analyticsService.getFunnels(req.tenantId);
  return successResponse(res, 200, 'Funnels retrieved', funnels);
});

export const createFunnel = asyncHandler(async (req, res) => {
  const analyticsService = new AnalyticsService(
    req.models.Analytics,
    req.models.HeatmapClick,
    req.models.Funnel,
    req.models.UsageRecord
  );
  const funnel = await analyticsService.createFunnel(req.tenantId, req.body);
  return successResponse(res, 201, 'Funnel created', funnel);
});

export const getFunnelStats = asyncHandler(async (req, res) => {
  const analyticsService = new AnalyticsService(
    req.models.Analytics,
    req.models.HeatmapClick,
    req.models.Funnel,
    req.models.UsageRecord
  );
  const { range = '30d' } = req.query;
  const stats = await analyticsService.getFunnelStats(req.params.id, req.tenantId, range);
  return successResponse(res, 200, 'Funnel stats', stats);
});

export const getRetention = asyncHandler(async (req, res) => {
  const analyticsService = new AnalyticsService(
    req.models.Analytics,
    req.models.HeatmapClick,
    req.models.Funnel,
    req.models.UsageRecord
  );
  const { range = '90d' } = req.query;
  const retention = await analyticsService.getRetention(req.tenantId, range);
  return successResponse(res, 200, 'Retention data', retention);
});

export const getUsage = asyncHandler(async (req, res) => {
  const analyticsService = new AnalyticsService(
    req.models.Analytics,
    req.models.HeatmapClick,
    req.models.Funnel,
    req.models.UsageRecord
  );
  const { range = 'current_month' } = req.query;
  const usage = await analyticsService.getUsage(req.tenantId, range);
  return successResponse(res, 200, 'Usage data', usage);
});
/*import { AnalyticsService } from '../services/analyics.service.js';
import { asyncHandler } from '../../../shared/utils/asyncHandler.js';
import { successResponse } from '../../../shared/utils/response.util.js';

const analyticsService = new AnalyticsService();

// Public tracking
export const trackEvent = asyncHandler(async (req, res) => {
  const { visitorId, sessionId, page, event, type, metadata } = req.body;
  await analyticsService.trackEvent({ visitorId, sessionId, tenantId: req.tenantId, page, event, type, metadata });
  return successResponse(res, 200, 'Event tracked');
});

export const trackHeatmap = asyncHandler(async (req, res) => {
  const events = Array.isArray(req.body) ? req.body : [req.body];
  await analyticsService.trackHeatmapClicks(events, req.tenantId);
  return successResponse(res, 200, 'Heatmap data saved');
});

// Admin stats
export const getStats = asyncHandler(async (req, res) => {
  const { range = '7d' } = req.query;
  const stats = await analyticsService.getStats(req.tenantId, range);
  return successResponse(res, 200, 'Analytics stats', stats);
});

export const getHeatmap = asyncHandler(async (req, res) => {
  const { page, range = '30d' } = req.query;
  if (!page) throw new ValidationError('Page parameter required');
  const clicks = await analyticsService.getHeatmapClicks(req.tenantId, page, range);
  return successResponse(res, 200, 'Heatmap data', clicks);
});

export const getFunnels = asyncHandler(async (req, res) => {
  const funnels = await analyticsService.getFunnels(req.tenantId);
  return successResponse(res, 200, 'Funnels retrieved', funnels);
});

export const createFunnel = asyncHandler(async (req, res) => {
  const funnel = await analyticsService.createFunnel(req.tenantId, req.body);
  return successResponse(res, 201, 'Funnel created', funnel);
});

export const getFunnelStats = asyncHandler(async (req, res) => {
  const { range = '30d' } = req.query;
  const stats = await analyticsService.getFunnelStats(req.params.id, req.tenantId, range);
  return successResponse(res, 200, 'Funnel stats', stats);
});

export const getRetention = asyncHandler(async (req, res) => {
  const { range = '90d' } = req.query;
  const retention = await analyticsService.getRetention(req.tenantId, range);
  return successResponse(res, 200, 'Retention data', retention);
});

export const getUsage = asyncHandler(async (req, res) => {
  const { range = 'current_month' } = req.query;
  const usage = await analyticsService.getUsage(req.tenantId, range);
  return successResponse(res, 200, 'Usage data', usage);
});*/