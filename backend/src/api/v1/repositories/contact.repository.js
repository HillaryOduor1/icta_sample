import { BaseRepository } from './base.repository.js';

export class ContactRepository extends BaseRepository {
  constructor(contactModel) {
    if (!contactModel) {
      throw new Error('ContactModel is required');
    }
    this.model = contactModel;
  }

  async create(data) {
    const doc = new this.model(data);
    return doc.save();
  }

  async findById(id, tenantId) {
    return this.model.findOne({ _id: id, tenantId }).lean();
  }

  async findByTenantWithPagination(tenantId, { page, limit, sort = '-createdAt', filter = {} }) {
    const skip = (page - 1) * limit;
    const query = { tenantId, ...filter };
    const [messages, total] = await Promise.all([
      this.model.find(query).sort(sort).skip(skip).limit(limit).lean(),
      this.model.countDocuments(query),
    ]);
    return { messages, total };
  }

  async markAsRead(id, tenantId) {
    return this.model.findOneAndUpdate(
      { _id: id, tenantId },
      { status: 'read' },
      { new: true }
    ).lean();
  }

  async update(id, tenantId, updates) {
    return this.model.findOneAndUpdate(
      { _id: id, tenantId },
      updates,
      { new: true }
    ).lean();
  }

  async delete(id, tenantId) {
    const result = await this.model.deleteOne({ _id: id, tenantId });
    return result.deletedCount > 0;
  }
}
/*import { ContactMessageModel } from '../../../database/models/contactMessage.model.js';
import { BaseRepository } from './base.repository.js';

export class ContactRepository extends BaseRepository {
  constructor() {
    super(ContactMessageModel);
  }

  async findByTenantWithPagination(tenantId, { page, limit, sort = '-createdAt', filter = {} }) {
    const skip = (page - 1) * limit;
    const query = { tenantId, ...filter };
    const [messages, total] = await Promise.all([
      this.model.find(query).sort(sort).skip(skip).limit(limit).lean(),
      this.model.countDocuments(query),
    ]);
    return { messages, total };
  }

  async markAsRead(id, tenantId) {
    return this.update(id, tenantId, { status: 'read' });
  }
}*/