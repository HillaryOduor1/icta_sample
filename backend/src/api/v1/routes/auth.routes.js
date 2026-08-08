import { Router } from 'express';
import { login, refresh, logout, logoutAll, getCurrentUser, changePassword, switchToMaster, getCurrentMasterUser } from '../controllers/auth.controller.js';
import { 
  googleAuth, 
  googleCallback, 
  masterGoogleAuth, 
  masterGoogleCallback 
} from '../controllers/oauth.controller.js';
import { authenticate } from '../../../middleware/auth.middleware.js';
import { validate } from '../../../middleware/validation.middleware.js';
import { loginValidator, changePasswordValidator } from '../validators/auth.validator.js';
import { tenantMiddleware } from '../../../middleware/tenant.middleware.js';

const router = Router();

// OAuth routes
// Tenant OAuth - Note: tenantMiddleware may not be needed if we get tenant from query
router.get('/google', googleAuth);  // Removed tenantMiddleware since we get tenant from query
router.get('/google/callback', googleCallback);

// Master OAuth (no tenant needed)
router.get('/master/google', masterGoogleAuth);
router.get('/master/google/callback', masterGoogleCallback);

// Regular auth routes
router.post('/login', validate(loginValidator), login);
router.post('/refresh', refresh);
router.post('/logout', authenticate, logout);
router.post('/logout-all', authenticate, logoutAll);
router.get('/me', authenticate, getCurrentUser);
router.get('/master/me', authenticate, getCurrentMasterUser);
router.post('/change-password', authenticate, validate(changePasswordValidator), changePassword);
router.post('/switch-to-master', authenticate, switchToMaster);

router.get('/debug/oauth-config', (req, res) => {
  res.json({
    googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL,
    hasClientId: !!process.env.GOOGLE_CLIENT_ID,
    hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
    frontendUrl: process.env.FRONTEND_URL,
  });
});
export default router;
