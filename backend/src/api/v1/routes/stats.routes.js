import { Router } from 'express';
import { getAdminStats } from '../controllers/stats.controller.js';
import { authenticate } from '../../../middleware/auth.middleware.js';
import { authorize } from '../policies/rbac.policy.js';

const router = Router();

router.use(authenticate);
router.use(authorize('admin'));

router.get('/', getAdminStats);

export default router;

