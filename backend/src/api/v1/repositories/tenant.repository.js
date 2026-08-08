import { getMasterConnection } from '../../../config/database.js';
import { TenantModel } from '../../../database/models/tenant.model.js';

export class TenantRepository {
  async getConnection() {
    return await getMasterConnection();
  }

  async getTenantModel() {
    const conn = await this.getConnection();
    return conn.model('Tenant', TenantModel.schema);
  }

  async findByDomain(domain) {
    const Tenant = await this.getTenantModel();
    return Tenant.findOne({ domain }).lean();
  }

  async findByDbName(dbName) {
    const Tenant = await this.getTenantModel();
    return Tenant.findOne({ dbName }).lean();
  }

  async findAll() {
    const Tenant = await this.getTenantModel();
    const tenants = await Tenant.find({}, 'name dbName domain siteId').lean();
    return tenants;
  }

  async findById(id) {
    const Tenant = await this.getTenantModel();
    return Tenant.findById(id).lean();
  }

  async createTenant(data) {
    const Tenant = await this.getTenantModel();
    const tenant = new Tenant(data);
    return tenant.save();
  }

  async update(id, tenantId, updates) {
    const Tenant = await this.getTenantModel();
    return Tenant.findByIdAndUpdate(id, updates, { new: true }).lean();
  }

  async delete(id, tenantId) {
    const Tenant = await this.getTenantModel();
    const result = await Tenant.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }
}
