import { TenantRepository } from '../repositories/tenant.repository.js';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from '../../../shared/errors/AppError.js';
import connectDB from '../../../config/database.js'; // custom connection manager
import { UserModel } from '../../../database/models/user.model.js';
import { SettingsModel } from '../../../database/models/settings.model.js';
import { ContentModel } from '../../../database/models/content.model.js';

const tenantRepo = new TenantRepository();

export class TenantService {
  /**
   * Resolve tenant by domain or dbName.
   */
  async resolveTenant(identifier, type = 'domain') {
    let tenant;
    if (type === 'domain') {
      tenant = await tenantRepo.findByDomain(identifier);
    } else if (type === 'dbName') {
      tenant = await tenantRepo.findByDbName(identifier);
    }
    if (!tenant) throw new AppError('Tenant not found', 404);
    return tenant;
  }

  /**
   * Create a new tenant with its own database and default admin user.
   */
  async createTenant(data) {
    const { name, domain, adminEmail, adminPassword } = data;
    const siteId = uuidv4();
    const dbName = `tenant_${siteId}`;

    const tenant = await tenantRepo.createTenant({
      name,
      domain,
      dbName,
      siteId,
    });

    // Create tenant-specific database and collections
    const conn = await connectDB(dbName);
    const User = conn.model('User', UserModel.schema);
    const Settings = conn.model('Settings', SettingsModel.schema);
    const Content = conn.model('Content', ContentModel.schema);

    // Create admin user
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    await User.create({
      username: adminEmail.split('@')[0],
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      active: true,
      tenantId: dbName,
    });

    // Create default settings
    await Settings.create({ tenantId: dbName });

    // Seed default content (optional)
    // await Content.create({ page: 'home', ...defaultContent, tenantId: dbName });

    return tenant;
  }

  /**
   * List all tenants (for superadmin).
   */
  async listTenants() {
    return tenantRepo.findAll();
  }

  /**
   * Get tenant by ID.
   */
  async getTenantById(id) {
    const tenant = await tenantRepo.findById(id);
    if (!tenant) throw new AppError('Tenant not found', 404);
    return tenant;
  }

  /**
   * Update tenant details.
   */
  async updateTenant(id, updates) {
    const tenant = await tenantRepo.update(id, null, updates); // no tenantId filter for master
    if (!tenant) throw new AppError('Tenant not found', 404);
    return tenant;
  }

  /**
   * Delete tenant and its database (dangerous – use with care).
   */
  async deleteTenant(id) {
    const tenant = await tenantRepo.findById(id);
    if (!tenant) throw new AppError('Tenant not found', 404);
    // Drop tenant database
    const conn = await connectDB(tenant.dbName);
    await conn.dropDatabase();
    await tenantRepo.delete(id, null);
  }
}