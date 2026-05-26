import { BaseRepository } from './base.repository.js';

export class ActivityRepository extends BaseRepository {
  constructor(activityModel) {
    if (!activityModel) {
      throw new Error('ActivityModel is required');
    }
    // Call super with the model first
    super(activityModel);
    // No need to set this.model again - BaseRepository already did it
  }

  async log(tenantId, action, label, userId, username, detail = null, metadata = null) {
    return this.model.create({
      tenantId,
      action,
      label,
      userId,
      user: username,
      detail,
      metadata,
      timestamp: new Date(),
    });
    
  }

  async findAllWithPagination(tenantId, { page, limit, sort = '-timestamp', filter = {} }) {
    const skip = (page - 1) * limit;
    const query = { tenantId, ...filter };
    const [logs, total] = await Promise.all([
      this.model.find(query).sort(sort).skip(skip).limit(limit).lean(),
      this.model.countDocuments(query),
    ]);
    return { logs, total };
  }

  async getStats(tenantId) {
    const [total, byAction] = await Promise.all([
      this.model.countDocuments({ tenantId }),
      this.model.aggregate([
        { $match: { tenantId } },
        { $group: { _id: '$action', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);
    return { total, byAction };
  }

  async clearAll(tenantId) {
    const result = await this.model.deleteMany({ tenantId });
    return result.deletedCount;
  }
}
/*import { ActivityLogModel } from '../../../database/models/activityLog.model.js';
import { BaseRepository } from './base.repository.js';

export class ActivityRepository extends BaseRepository {
  constructor() {
    super(ActivityLogModel);
  }

  async log(tenantId, action, label, userId, username, detail = null, metadata = null) {
    return this.create({
      tenantId,
      action,
      label,
      userId,
      user: username,
      detail,
      metadata,
      timestamp: new Date(),
    });
  }

  async findAllWithPagination(tenantId, { page, limit, sort = '-timestamp', filter = {} }) {
    const skip = (page - 1) * limit;
    const query = { tenantId, ...filter };
    const [logs, total] = await Promise.all([
      this.model.find(query).sort(sort).skip(skip).limit(limit).lean(),
      this.model.countDocuments(query),
    ]);
    return { logs, total };
  }

  async getStats(tenantId) {
    const [total, byAction] = await Promise.all([
      this.model.countDocuments({ tenantId }),
      this.model.aggregate([
        { $match: { tenantId } },
        { $group: { _id: '$action', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);
    return { total, byAction };
  }

  async clearAll(tenantId) {
    const result = await this.model.deleteMany({ tenantId });
    return result.deletedCount;
  }
}*/