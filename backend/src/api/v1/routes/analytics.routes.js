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
