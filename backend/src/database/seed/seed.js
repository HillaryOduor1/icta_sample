
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { config } from '../../config/env.js';
import connectDB, { getMasterConnection } from '../../config/database.js';
import { UserModel } from '../models/user.model.js';
import { TenantModel } from '../models/tenant.model.js';
import { SettingsModel } from '../models/settings.model.js';
import { ContentModel } from '../models/content.model.js';
import { logger } from '../../config/logger.js';

// Default content data (import from your existing scripts/defaultContent.js)
const DEFAULT_CONTENT = {
  home: {
    page: 'home',
    published: true,
    hero: { headline: 'Welcome', subtext: 'Your platform for sustainability' },
    // ... full content structure from your defaultContent.js
  },
  about: { page: 'about', published: true },
  research: { page: 'research', published: true },
  contact: { page: 'contact', published: true },
};

/**
 * Seed master database with default tenant and superadmin.
 */
const seedMaster = async () => {
  const masterConn = await getMasterConnection();
  const Tenant = masterConn.model('Tenant', TenantModel.schema);
  const MasterUser = masterConn.model('MasterUser', require('../models/masterUser.model.js').MasterUserModel.schema);

  // Create default tenant if not exists
  let tenant = await Tenant.findOne({ dbName: 'demo_tenant' });
  if (!tenant) {
    tenant = await Tenant.create({
      name: 'Demo Tenant',
      domain: 'demo.localhost',
      dbName: 'demo_tenant',
      siteId: 'demo-001',
      contactEmail: 'admin@demo.com',
    });
    logger.info('Created demo tenant');
  }

  // Create superadmin if not exists
  let superadmin = await MasterUser.findOne({ email: 'admin@example.com' });
  if (!superadmin) {
    superadmin = await MasterUser.create({
      email: 'admin@example.com',
      name: 'Super Admin',
      role: 'superadmin',
    });
    logger.info('Created superadmin user');
  }
};

/**
 * Seed a tenant database with default admin user, settings, and content.
 * @param {string} tenantId - The tenant database name
 */
const seedTenant = async (tenantId) => {
  const conn = await connectDB(tenantId);
  const User = conn.model('User', UserModel.schema);
  const Settings = conn.model('Settings', SettingsModel.schema);
  const Content = conn.model('Content', ContentModel.schema);

  // Create admin user
  const adminExists = await User.findOne({ role: 'admin' });
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('Admin123!', 12);
    await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
      active: true,
      tenantId,
    });
    logger.info(`Created admin user for tenant ${tenantId}`);
  }

  // Create default settings
  const settingsExist = await Settings.findOne();
  if (!settingsExist) {
    await Settings.create({ tenantId });
    logger.info(`Created default settings for tenant ${tenantId}`);
  }

  // Seed content pages
  for (const [page, data] of Object.entries(DEFAULT_CONTENT)) {
    const exists = await Content.findOne({ page });
    if (!exists) {
      await Content.create({ ...data, tenantId, updatedBy: 'system' });
      logger.info(`Seeded content page "${page}" for tenant ${tenantId}`);
    }
  }
};

/**
 * Main seed function – run only in development or via CLI.
 */
export const seedAll = async () => {
  try {
    await seedMaster();
    // Seed demo tenant
    await seedTenant('demo_tenant');
    logger.info('Seeding completed successfully');
    process.exit(0);
  } catch (err) {
    logger.error({ err }, 'Seeding failed');
    process.exit(1);
  }
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedAll();
}