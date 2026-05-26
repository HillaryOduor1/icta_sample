import { AnalyticsRepository } from '../repositories/analytics.repository.js';
import { getStartDate } from '../../../shared/utils/date.utils.js';
import { AppError } from '../../../shared/errors/AppError.js';

export class AnalyticsService {
  constructor(analyticsModel, heatmapModel, funnelModel, usageModel) {
    if (!analyticsModel || !heatmapModel || !funnelModel || !usageModel) {
      throw new Error('All analytics models are required');
    }
    this.repository = new AnalyticsRepository(analyticsModel, heatmapModel, funnelModel, usageModel);
  }

  async trackEvent(data) {
    return this.repository.trackEvent(data);
  }

  async trackHeatmapClicks(events, tenantId) {
    const enriched = events.map(ev => ({ ...ev, tenantId, timestamp: new Date() }));
    return this.repository.trackHeatmapClicks(enriched);
  }

  async getStats(tenantId, range) {
    const startDate = getStartDate(range);
    return this.repository.getStats(tenantId, startDate);
  }

  async getHeatmapClicks(tenantId, page, range) {
    const startDate = getStartDate(range);
    return this.repository.getHeatmapClicks(tenantId, page, startDate);
  }

  async getFunnels(tenantId) {
    return this.repository.getFunnels(tenantId);
  }

  async createFunnel(tenantId, data) {
    return this.repository.createFunnel(tenantId, data);
  }

  async getFunnelStats(funnelId, tenantId, range) {
    const startDate = getStartDate(range);
    const funnel = await this.repository.getFunnelById(funnelId, tenantId);
    if (!funnel) throw new AppError('Funnel not found', 404);
    const stepEvents = funnel.steps.map(s => s.targetEvent);
    const counts = await this.repository.getFunnelStepCounts(funnelId, stepEvents, startDate, tenantId);
    const stepsData = funnel.steps.map((step, idx) => ({
      name: step.name,
      count: counts[step.targetEvent] || 0,
      conversionRate: idx === 0 ? 100 : ((counts[step.targetEvent] || 0) / (counts[funnel.steps[idx-1]?.targetEvent] || 1)) * 100,
    }));
    return stepsData;
  }

  async getRetention(tenantId, range) {
    const startDate = getStartDate(range);
    return this.repository.getRetention(tenantId, startDate);
  }

  async getUsage(tenantId, range) {
    let startDate;
    if (range === 'current_month') {
      startDate = new Date();
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
    } else {
      startDate = getStartDate(range);
    }
    return this.repository.getUsage(tenantId, startDate);
  }
}
/*import { AnalyticsRepository } from '../repositories/analytics.repository.js';
import { getStartDate } from '../../../shared/utils/date.utils.js';

const analyticsRepo = new AnalyticsRepository();

export class AnalyticsService {
  async trackEvent(data) {
    return analyticsRepo.trackEvent(data);
  }

  async trackHeatmapClicks(events, tenantId) {
    const enriched = events.map(ev => ({ ...ev, tenantId, timestamp: new Date() }));
    return analyticsRepo.trackHeatmapClicks(enriched);
  }

  async getStats(tenantId, range) {
    const startDate = getStartDate(range);
    return analyticsRepo.getStats(tenantId, startDate);
  }

  async getHeatmapClicks(tenantId, page, range) {
    const startDate = getStartDate(range);
    return analyticsRepo.getHeatmapClicks(tenantId, page, startDate);
  }

  async getFunnels(tenantId) {
    return analyticsRepo.getFunnels(tenantId);
  }

  async createFunnel(tenantId, data) {
    return analyticsRepo.createFunnel(tenantId, data);
  }

  async getFunnelStats(funnelId, tenantId, range) {
    const startDate = getStartDate(range);
    const funnel = await analyticsRepo.getFunnelById(funnelId, tenantId);
    if (!funnel) throw new AppError('Funnel not found', 404);
    const stepEvents = funnel.steps.map(s => s.targetEvent);
    const counts = await analyticsRepo.getFunnelStepCounts(funnelId, stepEvents, startDate, tenantId);
    const stepsData = funnel.steps.map((step, idx) => ({
      name: step.name,
      count: counts[step.targetEvent] || 0,
      conversionRate: idx === 0 ? 100 : ((counts[step.targetEvent] || 0) / (counts[funnel.steps[idx-1].targetEvent] || 1)) * 100,
    }));
    return stepsData;
  }

  async getRetention(tenantId, range) {
    const startDate = getStartDate(range);
    return analyticsRepo.getRetention(tenantId, startDate);
  }

  async getUsage(tenantId, range) {
    let startDate;
    if (range === 'current_month') {
      startDate = new Date();
      startDate.setDate(1);
      startDate.setHours(0,0,0,0);
    } else {
      startDate = getStartDate(range);
    }
    return analyticsRepo.getUsage(tenantId, startDate);
  }
}*/