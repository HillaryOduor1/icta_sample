/*const express = require('express');
const router = express.Router();
const Analytics = require('../../models/Analytics');
const HeatmapClick = require('../../models/HeatmapClick');
const UsageRecord = require('../../models/UsageRecord');

// Track pageviews, events, funnel steps
router.post('/track', async (req, res) => {
  try {
    const { visitorId, sessionId, tenantId, page, event, type, metadata } = req.body;
    
    // Validate required fields
    if (!visitorId || !sessionId) {
      return res.status(400).json({ error: 'Missing visitorId or sessionId' });
    }

    // Create analytics entry
    await Analytics.create({
      visitorId,
      sessionId,
      tenantId: tenantId || null,
      page: page || null,
      event: event || null,
      type: type || 'pageview',
      metadata: metadata || {}
    });

    // Record usage for billing (only if tenantId exists, otherwise skip or use a default)
    if (tenantId) {
      const metric = type === 'pageview' ? 'pageview' : 'event';
      await UsageRecord.create({
        tenantId,
        metric,
        quantity: 1,
        timestamp: new Date()
      });
    }

    res.sendStatus(200);
  } catch (err) {
    console.error('❌ Analytics track error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Track heatmap click data
router.post('/heatmap', async (req, res) => {
  try {
    // Support both single object and batch array
    let events = Array.isArray(req.body) ? req.body : [req.body];
    
    for (const ev of events) {
      const { tenantId, page, x, y, element, sessionId } = ev;
      if (!page || x === undefined || y === undefined) continue;
      
      await HeatmapClick.create({
        tenantId: tenantId || null,
        page,
        x,
        y,
        element: element || null,
        sessionId: sessionId || null,
        timestamp: new Date()
      });
      
      if (tenantId) {
        await UsageRecord.create({
          tenantId,
          metric: 'event',
          quantity: 1
        });
      }
    }
    res.sendStatus(200);
  } catch (err) {
    console.error('❌ Heatmap track error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;*/