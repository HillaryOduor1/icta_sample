import { Router } from 'express';
import { listTenants, switchToTenant } from '../controllers/master.controller.js';
import { authenticate } from '../../../middleware/auth.middleware.js';
import { authorize } from '../policies/rbac.policy.js';

const router = Router();
// Debug middleware to log requests
router.use((req, res, next) => {
  console.log(`[Master Route] ${req.method} ${req.url}`);
  console.log('User:', req.user);
  next();
});
router.use(authenticate);
router.use(authorize('superadmin'));

router.get('/tenants', listTenants);
router.post('/switch-tenant/:dbName', switchToTenant);

export default router;
