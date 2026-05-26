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
/*last stable
const express = require('express');
const router = express.Router();
const Tenant = require('../models/Tenant');
const { protect, authorize } = require('../middleware/auth');
const connectDB = require('../config/db');
const jwt = require('jsonwebtoken');

// List all tenants (superadmin only)
router.get('/tenants', protect, authorize('superadmin'), async (req, res) => {
  try {
    const tenants = await Tenant.find({}, 'name dbName domain');
    res.json(tenants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Switch to a tenant (impersonate admin)
router.post('/switch-tenant/:dbName', protect, authorize('superadmin'), async (req, res) => {
  try {
    const { dbName } = req.params;
    const tenant = await Tenant.findOne({ dbName });
    if (!tenant) return res.status(404).json({ error: 'Tenant not found' });

    const tenantConn = await connectDB(dbName);
    const User = tenantConn.model('User', require('../models/User'));
    let adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) adminUser = await User.findOne({});

    const token = jwt.sign(
      { id: adminUser._id, role: adminUser.role, tenantId: dbName },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' });
    // 👇 Set a cookie that signals this session came from master
    res.cookie('switched_from_master', 'true', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    res.json({ success: true, tenant: tenant.name });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});*/
/*router.post('/switch-tenant/:dbName', protect, authorize('superadmin'), async (req, res) => {
  try {
    const { dbName } = req.params;
    const tenant = await Tenant.findOne({ dbName });
    if (!tenant) return res.status(404).json({ error: 'Tenant not found' });

    const tenantConn = await connectDB(dbName);
    const User = tenantConn.model('User', require('../models/User'));
    let adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) adminUser = await User.findOne({});

    const token = jwt.sign(
      { id: adminUser._id, role: adminUser.role, tenantId: dbName },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' });
    res.json({ success: true, tenant: tenant.name });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});*

module.exports = router;*/