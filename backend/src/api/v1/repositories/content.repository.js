import { BaseRepository } from './base.repository.js';

export class ContentRepository extends BaseRepository {
  constructor(contentModel) {
    if (!contentModel) {
      throw new Error('ContentModel is required');
    }
    super(contentModel);
  }

  async findByPage(page, tenantId) {
    return this.model.findOne({ page, tenantId }).lean();
  }

  async upsertByPage(page, tenantId, data, updatedBy) {
    return this.model.findOneAndUpdate(
      { page, tenantId },
      { 
        ...data, 
        tenantId, 
        updatedBy, 
        updatedAt: new Date(),
        $inc: { version: 1 }
      },
      { upsert: true, new: true, runValidators: true }
    ).lean();
  }

  async findAllByTenant(tenantId) {
    return this.model.find({ tenantId }).sort({ page: 1 }).lean();
  }

  async deleteByPage(page, tenantId) {
    const result = await this.model.deleteOne({ page, tenantId });
    return result.deletedCount > 0;
  }
}
/*import { BaseRepository } from './base.repository.js';

export class ContentRepository extends BaseRepository {
  constructor(contentModel) {
    if (!contentModel) {
      throw new Error('ContentModel is required');
    }
    super(contentModel);
  }

  async findByPage(page, tenantId) {
    return this.model.findOne({ page, tenantId }).lean();
  }

  async upsertByPage(page, tenantId, data, updatedBy) {
    return this.model.findOneAndUpdate(
      { page, tenantId },
      { ...data, tenantId, updatedBy, updatedAt: new Date() },
      { upsert: true, new: true, runValidators: true }
    ).lean();
  }

  async findAllByTenant(tenantId) {
    return this.model.find({ tenantId }).sort({ page: 1 }).lean();
  }

  async deleteByPage(page, tenantId) {
    const result = await this.model.deleteOne({ page, tenantId });
    return result.deletedCount > 0;
  }
}*/
