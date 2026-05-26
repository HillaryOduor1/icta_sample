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
/*
const express = require('express');
const router = express.Router();
const activityController = require('../../controllers/activityController');
const { protect, authorize } = require('../../middleware/auth');

router.use(protect);

router.get('/', authorize('admin'), activityController.getActivityLogs);
router.get('/stats', authorize('admin'), activityController.getActivityStats);
router.delete('/clear', authorize('admin'), activityController.clearLogs);

module.exports = router;*/