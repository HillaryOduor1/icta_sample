import { Router } from 'express';
import { trackEvent, trackHeatmap, getStats, getHeatmap, getFunnels, createFunnel, getFunnelStats, getRetention, getUsage } from '../controllers/analytics.controller.js';
import { authenticate } from '../../../middleware/auth.middleware.js';
import { authorize } from '../policies/rbac.policy.js';

const router = Router();

// Public tracking endpoints (no auth)
router.post('/track', trackEvent);
router.post('/heatmap', trackHeatmap);

// Admin analytics
router.use(authenticate);
router.use(authorize('admin', 'editor', 'viewer'));

router.get('/stats', getStats);
router.get('/heatmap', getHeatmap);
router.get('/funnels', getFunnels);
router.post('/funnels', authorize('admin'), createFunnel);
router.get('/funnels/:id/stats', getFunnelStats);
router.get('/retention', getRetention);
router.get('/usage', getUsage);

export default router;
/*last stable
const express = require('express');
const router = express.Router();
const Analytics = require('../../models/Analytics');
const Funnel = require('../../models/Funnel');
const HeatmapClick = require('../../models/HeatmapClick');
const UsageRecord = require('../../models/UsageRecord');
const { protect, authorize } = require('../../middleware/auth');

// Helper: parse date range
function getStartDate(range) {
  const now = new Date();
  if (range === '1d') return new Date(now.setDate(now.getDate() - 1));
  if (range === '7d') return new Date(now.setDate(now.getDate() - 7));
  if (range === '30d') return new Date(now.setDate(now.getDate() - 30));
  if (range === '90d') return new Date(now.setDate(now.getDate() - 90));
  return new Date(now.setDate(now.getDate() - 30));
}

// ---------- Overview Stats ----------
router.get('/stats', protect, authorize('admin', 'editor', 'viewer'), async (req, res) => {
  try {
    const tenantId = req.user.tenantId;   // from JWT (must be present for non-superadmin)
    const { range = '7d' } = req.query;
    const start = getStartDate(range);

    if (!tenantId && req.user.role !== 'superadmin') {
      return res.status(400).json({ error: 'Tenant context missing' });
    }

    const match = tenantId ? { tenantId, timestamp: { $gte: start } } : { timestamp: { $gte: start } };
    const totalVisitors = await Analytics.distinct('visitorId', match);
    const totalSessions = await Analytics.distinct('sessionId', match);
    const pageViews = await Analytics.countDocuments({ ...match, type: 'pageview' });
    const events = await Analytics.countDocuments({ ...match, type: 'event' });
    const activeUsers = (await Analytics.distinct('sessionId', { timestamp: { $gte: new Date(Date.now() - 5 * 60 * 1000) }, ...(tenantId && { tenantId }) })).length;

    res.json({
      visitors: totalVisitors.length,
      sessions: totalSessions.length,
      activeUsers,
      pageViews,
      events
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ---------- Heatmap Data ----------
router.get('/heatmap', protect, authorize('admin', 'editor', 'viewer'), async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const { page, range = '30d' } = req.query;
    if (!page) return res.status(400).json({ error: 'page required' });
    if (!tenantId && req.user.role !== 'superadmin') {
      return res.status(400).json({ error: 'Tenant context missing' });
    }

    const start = getStartDate(range);
    const query = tenantId ? { tenantId, page, timestamp: { $gte: start } } : { page, timestamp: { $gte: start } };
    const clicks = await HeatmapClick.find(query).select('x y -_id');
    res.json(clicks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ---------- Funnels ----------
router.get('/funnels', protect, authorize('admin', 'editor', 'viewer'), async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    if (!tenantId && req.user.role !== 'superadmin') {
      return res.status(400).json({ error: 'Tenant context missing' });
    }
    const funnels = await Funnel.find(tenantId ? { tenantId } : {});
    res.json(funnels);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/funnels', protect, authorize('admin'), async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    if (!tenantId && req.user.role !== 'superadmin') {
      return res.status(400).json({ error: 'Tenant context missing' });
    }
    const funnel = await Funnel.create({ ...req.body, tenantId });
    res.status(201).json(funnel);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/funnels/:id/stats', protect, authorize('admin', 'editor', 'viewer'), async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    if (!tenantId && req.user.role !== 'superadmin') {
      return res.status(400).json({ error: 'Tenant context missing' });
    }
    const funnel = await Funnel.findOne({ _id: req.params.id, ...(tenantId && { tenantId }) });
    if (!funnel) return res.status(404).json({ error: 'Not found' });

    const { range = '30d' } = req.query;
    const start = getStartDate(range);
    const sessionsWithSteps = {};

    for (let i = 0; i < funnel.steps.length; i++) {
      const step = funnel.steps[i];
      const sessions = await Analytics.distinct('sessionId', {
        ...(tenantId && { tenantId }),
        type: 'event',
        event: step.targetEvent,
        timestamp: { $gte: start }
      });
      sessionsWithSteps[step.name] = sessions.length;
    }

    const stepsData = funnel.steps.map((step, idx) => ({
      name: step.name,
      count: sessionsWithSteps[step.name] || 0,
      conversionRate: idx === 0 ? 100 : ((sessionsWithSteps[step.name] || 0) / (sessionsWithSteps[funnel.steps[idx-1].name] || 1)) * 100
    }));
    res.json(stepsData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ---------- Retention Analytics (Cohort) ----------
router.get('/retention', protect, authorize('admin', 'editor', 'viewer'), async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const { range = '90d' } = req.query;
    const start = getStartDate(range);

    // Placeholder – implement proper cohort analysis here
    res.json([]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ---------- Usage & Billing ----------
router.get('/usage', protect, authorize('admin', 'editor', 'viewer'), async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const { range = 'current_month' } = req.query;

    let start = new Date();
    if (range === 'current_month') {
      start = new Date(start.getFullYear(), start.getMonth(), 1);
    } else if (range === 'last_month') {
      start = new Date(start.getFullYear(), start.getMonth() - 1, 1);
    } else {
      start = getStartDate(range);
    }

    if (!tenantId && req.user.role !== 'superadmin') {
      return res.status(400).json({ error: 'Tenant context missing' });
    }

    const match = tenantId ? { tenantId, timestamp: { $gte: start } } : { timestamp: { $gte: start } };
    const usage = await UsageRecord.aggregate([
      { $match: match },
      { $group: { _id: '$metric', total: { $sum: '$quantity' } } }
    ]);

    const pricing = { pageview: 0.001, event: 0.0005, session: 0.01 };
    let totalCost = 0;
    usage.forEach(u => {
      totalCost += (u.total / 1000) * (pricing[u._id] || 0);
    });
    res.json({ usage, totalCost });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;*/