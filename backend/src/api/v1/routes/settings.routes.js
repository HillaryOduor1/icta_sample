import { Router } from 'express';
import { getSettings, updateSettings, resetSettings } from '../controllers/settings.controller.js';
import { authenticate } from '../../../middleware/auth.middleware.js';
import { authorize } from '../policies/rbac.policy.js';

const router = Router();

// Public read
router.get('/', getSettings);

// Protected write
router.use(authenticate);
router.put('/', authorize('admin'), updateSettings);
router.post('/reset', authorize('admin'), resetSettings);

export default router;
/*last stable
const express = require('express');
const router = express.Router();
const settingsController = require('../../controllers/settingsController');
const { protect, authorize } = require('../../middleware/auth');

// Protected routes
router.get('/', settingsController.getAllSettings);
router.put('/', protect, authorize('admin'), settingsController.updateSettings);
router.post('/reset', protect, authorize('admin'), settingsController.resetSettings);

module.exports = router;*/