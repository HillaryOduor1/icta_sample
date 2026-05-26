import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import contentRoutes from './content.routes.js';
import settingsRoutes from './settings.routes.js';
import mediaRoutes from './media.routes.js';
import activityRoutes from './activity.routes.js';
import contactRoutes from './contact.routes.js';
import analyticsRoutes from './analytics.routes.js';
import statsRoutes from './stats.routes.js';
import masterRoutes from './master.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/content', contentRoutes);
router.use('/settings', settingsRoutes);
router.use('/media', mediaRoutes);
router.use('/activity', activityRoutes);
router.use('/contact', contactRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/stats', statsRoutes);
router.use('/master', masterRoutes);

export default router;