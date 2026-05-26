const express = require('express');
const router = express.Router();
const oauthController = require('../controllers/oauthController');
const tenantMiddleware = require('../middleware/tenant');

// Tenant user OAuth – requires tenant context
router.get('/google', tenantMiddleware, oauthController.googleAuth);
router.get('/google/callback', oauthController.googleCallback);

// Master user OAuth – no tenant needed
router.get('/master/google', oauthController.masterGoogleAuth);
router.get('/master/google/callback', oauthController.masterGoogleCallback);

module.exports = router;