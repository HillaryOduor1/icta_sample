import { Router } from 'express';
import { getActivityLogs, getActivityStats, clearLogs } from '../controllers/activity.controller.js';
import { authenticate } from '../../../middleware/auth.middleware.js';
import { authorize } from '../policies/rbac.policy.js';

const router = Router();

router.use(authenticate);
router.use(authorize('admin'));

router.get('/', getActivityLogs);
router.get('/stats', getActivityStats);
router.delete('/clear', clearLogs);

export default router;
