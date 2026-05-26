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

// ========== OAuth routes ==========
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

/*import { Router } from 'express';
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

// ========== OAuth routes (no authentication required) ==========
// Tenant OAuth
router.get('/google', tenantMiddleware, googleAuth);
router.get('/google/callback', googleCallback);

// Master OAuth (no tenant needed)
router.get('/master/google', masterGoogleAuth);
router.get('/master/google/callback', masterGoogleCallback);

router.post('/login', validate(loginValidator), login);
router.post('/refresh', refresh);
router.post('/logout', authenticate, logout);
router.post('/logout-all', authenticate, logoutAll);
router.get('/me', authenticate, getCurrentUser);
router.get('/master/me', authenticate, getCurrentMasterUser); // Add this line for master users
router.post('/change-password', authenticate, validate(changePasswordValidator), changePassword);
router.post('/switch-to-master', authenticate, switchToMaster);

export default router;*/


/*import { Router } from 'express';
import { login, refresh, logout, logoutAll, getCurrentUser, changePassword,switchToMaster, getCurrentMasterUser } from '../controllers/auth.controller.js';
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
import { getMasterConnection } from '../../../config/database.js';
import { MasterUserModel } from '../../../database/models/masterUser.model.js';

const router = Router();

// ========== OAuth routes (no authentication required) ==========
// Tenant OAuth
router.get('/google', tenantMiddleware, googleAuth);
router.get('/google/callback', googleCallback);

// Master OAuth (no tenant needed)
router.get('/master/google', masterGoogleAuth);
router.get('/master/google/callback', masterGoogleCallback);

router.post('/login', validate(loginValidator), login);
router.post('/refresh', refresh);
router.post('/logout', authenticate, logout);
router.post('/logout-all', authenticate, logoutAll);
router.get('/me', authenticate, getCurrentUser);
router.post('/change-password', authenticate, validate(changePasswordValidator), changePassword);
router.post('/switch-to-master', authenticate, switchToMaster);
// Inside the router, after the existing routes
router.get('/master/me', authenticate, getCurrentMasterUser);
export default router;*/

/*last stable version
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/login', authController.login);
router.post('/logout', protect, authController.logout);
router.get('/me', protect, authController.getCurrentUser);
router.post('/change-password', protect, authController.changePassword);
router.post('/switch-to-master', authController.switchToMaster);

module.exports = router;*/

/*const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/login', authController.login);
router.post('/logout', protect, authController.logout);
router.get('/me', protect, authController.getCurrentUser);
router.post('/change-password', protect, authController.changePassword);

module.exports = router;*/