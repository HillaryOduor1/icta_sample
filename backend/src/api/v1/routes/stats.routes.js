import { Router } from 'express';
import { getAdminStats } from '../controllers/stats.controller.js';
import { authenticate } from '../../../middleware/auth.middleware.js';
import { authorize } from '../policies/rbac.policy.js';

const router = Router();

router.use(authenticate);
router.use(authorize('admin'));

router.get('/', getAdminStats);

export default router;
/*last stable
const express = require('express');
const router = express.Router();
const statsController = require('../../controllers/statsController');
const { protect, authorize } = require('../../middleware/auth');

router.get('/', protect, authorize('admin'), statsController.getAdminStats);

module.exports = router;*/
/*const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        // TEMP mock data (replace later)
        res.json({
            users: 10,
            content: 25,
            activity: 50
        });
    } catch (err) {
        console.error("Stats error:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;*/