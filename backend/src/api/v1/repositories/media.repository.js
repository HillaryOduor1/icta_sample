import { MediaModel } from '../../../database/models/media.model.js';
import { BaseRepository } from './base.repository.js';

export class MediaRepository extends BaseRepository {
  constructor() {
    super(MediaModel);
  }

  async findAllByTenant(tenantId, { page, limit, sort = '-createdAt' }) {
    const skip = (page - 1) * limit;
    const query = { tenantId };
    const [media, total] = await Promise.all([
      this.model.find(query).sort(sort).skip(skip).limit(limit).lean(),
      this.model.countDocuments(query),
    ]);
    return { media, total };
  }

  async deleteByTenant(id, tenantId) {
    return this.delete(id, tenantId);
  }
}