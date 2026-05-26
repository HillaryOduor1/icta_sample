export class AnalyticsRepository {
  constructor(analyticsModel, heatmapModel, funnelModel, usageModel) {
    if (!analyticsModel || !heatmapModel || !funnelModel || !usageModel) {
      throw new Error('All analytics models are required');
    }
    this.analyticsModel = analyticsModel;
    this.heatmapModel = heatmapModel;
    this.funnelModel = funnelModel;
    this.usageModel = usageModel;
  }

  async trackEvent(data) {
    const event = new this.analyticsModel(data);
    return event.save();
  }

  async getStats(tenantId, startDate) {
    const match = tenantId ? { tenantId, timestamp: { $gte: startDate } } : { timestamp: { $gte: startDate } };
    const [visitors, sessions, pageViews, events, activeUsers] = await Promise.all([
      this.analyticsModel.distinct('visitorId', match),
      this.analyticsModel.distinct('sessionId', match),
      this.analyticsModel.countDocuments({ ...match, type: 'pageview' }),
      this.analyticsModel.countDocuments({ ...match, type: 'event' }),
      this.analyticsModel.distinct('sessionId', { timestamp: { $gte: new Date(Date.now() - 5 * 60 * 1000) }, ...(tenantId && { tenantId }) }),
    ]);
    return {
      visitors: visitors.length,
      sessions: sessions.length,
      pageViews,
      events,
      activeUsers: activeUsers.length,
    };
  }

  async trackHeatmapClicks(clicks) {
    if (clicks.length === 0) return;
    return this.heatmapModel.insertMany(clicks);
  }

  async getHeatmapClicks(tenantId, page, startDate) {
    const query = tenantId ? { tenantId, page, timestamp: { $gte: startDate } } : { page, timestamp: { $gte: startDate } };
    return this.heatmapModel.find(query).select('x y -_id').lean();
  }

  async getFunnels(tenantId) {
    return this.funnelModel.find({ tenantId }).lean();
  }

  async getFunnelById(id, tenantId) {
    return this.funnelModel.findOne({ _id: id, tenantId }).lean();
  }

  async createFunnel(tenantId, data) {
    const funnel = new this.funnelModel({ ...data, tenantId });
    return funnel.save();
  }

  async getFunnelStepCounts(funnelId, stepEvents, startDate, tenantId) {
    const counts = {};
    for (const step of stepEvents) {
      const sessions = await this.analyticsModel.distinct('sessionId', {
        ...(tenantId && { tenantId }),
        type: 'event',
        event: step,
        timestamp: { $gte: startDate },
      });
      counts[step] = sessions.length;
    }
    return counts;
  }

  async getRetention(tenantId, startDate) {
    return [];
  }

  async getUsage(tenantId, startDate) {
    const match = tenantId ? { tenantId, timestamp: { $gte: startDate } } : { timestamp: { $gte: startDate } };
    const usage = await this.usageModel.aggregate([
      { $match: match },
      { $group: { _id: '$metric', total: { $sum: '$quantity' } } },
    ]);
    const pricing = { pageview: 0.001, event: 0.0005, session: 0.01 };
    let totalCost = 0;
    usage.forEach(u => {
      totalCost += (u.total / 1000) * (pricing[u._id] || 0);
    });
    return { usage, totalCost };
  }
}
/*import { AnalyticsModel } from '../../../database/models/analytics.model.js';
import { HeatmapClickModel } from '../../../database/models/heatmapClick.model.js';
import { FunnelModel } from '../../../database/models/funnel.model.js';
import { UsageRecordModel } from '../../../database/models/usageRecord.model.js';
import { BaseRepository } from './base.repository.js';

export class AnalyticsRepository {
  constructor() {
    this.analyticsModel = AnalyticsModel;
    this.heatmapModel = HeatmapClickModel;
    this.funnelModel = FunnelModel;
    this.usageModel = UsageRecordModel;
  }

  // Analytics events
  async trackEvent(data) {
    const event = new this.analyticsModel(data);
    return event.save();
  }

  async getStats(tenantId, startDate) {
    const match = tenantId ? { tenantId, timestamp: { $gte: startDate } } : { timestamp: { $gte: startDate } };
    const [visitors, sessions, pageViews, events, activeUsers] = await Promise.all([
      this.analyticsModel.distinct('visitorId', match),
      this.analyticsModel.distinct('sessionId', match),
      this.analyticsModel.countDocuments({ ...match, type: 'pageview' }),
      this.analyticsModel.countDocuments({ ...match, type: 'event' }),
      this.analyticsModel.distinct('sessionId', { timestamp: { $gte: new Date(Date.now() - 5 * 60 * 1000) }, ...(tenantId && { tenantId }) }),
    ]);
    return {
      visitors: visitors.length,
      sessions: sessions.length,
      pageViews,
      events,
      activeUsers: activeUsers.length,
    };
  }

  // Heatmap
  async trackHeatmapClicks(clicks) {
    if (clicks.length === 0) return;
    return this.heatmapModel.insertMany(clicks);
  }

  async getHeatmapClicks(tenantId, page, startDate) {
    const query = tenantId ? { tenantId, page, timestamp: { $gte: startDate } } : { page, timestamp: { $gte: startDate } };
    return this.heatmapModel.find(query).select('x y -_id').lean();
  }

  // Funnels
  async getFunnels(tenantId) {
    return this.funnelModel.find({ tenantId }).lean();
  }

  async getFunnelById(id, tenantId) {
    return this.funnelModel.findOne({ _id: id, tenantId }).lean();
  }

  async createFunnel(tenantId, data) {
    const funnel = new this.funnelModel({ ...data, tenantId });
    return funnel.save();
  }

  async getFunnelStepCounts(funnelId, stepEvents, startDate, tenantId) {
    const counts = {};
    for (const step of stepEvents) {
      const sessions = await this.analyticsModel.distinct('sessionId', {
        ...(tenantId && { tenantId }),
        type: 'event',
        event: step,
        timestamp: { $gte: startDate },
      });
      counts[step] = sessions.length;
    }
    return counts;
  }

  // Retention (simplified – implement full cohort as needed)
  async getRetention(tenantId, startDate) {
    // Placeholder – return empty array or implement cohort analysis
    return [];
  }

  // Usage records
  async recordUsage(tenantId, metric, quantity = 1) {
    const record = new this.usageModel({ tenantId, metric, quantity, timestamp: new Date() });
    return record.save();
  }

  async getUsage(tenantId, startDate) {
    const match = tenantId ? { tenantId, timestamp: { $gte: startDate } } : { timestamp: { $gte: startDate } };
    const usage = await this.usageModel.aggregate([
      { $match: match },
      { $group: { _id: '$metric', total: { $sum: '$quantity' } } },
    ]);
    const pricing = { pageview: 0.001, event: 0.0005, session: 0.01 };
    let totalCost = 0;
    usage.forEach(u => {
      totalCost += (u.total / 1000) * (pricing[u._id] || 0);
    });
    return { usage, totalCost };
  }
}*/