/*
/**
 * Base repository with common CRUD operations.
 * @template T
 */
export class BaseRepository {
  constructor(model) {
    if (!model) {
      throw new Error('Model is required for BaseRepository');
    }
    this.model = model;
  }

  async create(data) {
    const doc = new this.model(data);
    return doc.save();
  }

  /*async findById(id, tenantId, options = {}) {
    const query = { _id: id };
    if (tenantId) query.tenantId = tenantId;
    return this.model.findOne(query, null, options).lean();
  }*/
  async findById(id, tenantId, options = {}) {
    // Convert string ID to ObjectId if it's a valid ObjectId string
    let queryId = id;
    if (mongoose.Types.ObjectId.isValid(id)) {
      queryId = new mongoose.Types.ObjectId(id);
    }
    
    const query = { _id: queryId };
    //if (tenantId) query.tenantId = tenantId;
    return this.model.findOne(query, null, options).lean();
  }

  async findOne(filter, options = {}) {
    return this.model.findOne(filter, null, options).lean();
  }

  async find(filter = {}, options = {}) {
    const { sort = '-createdAt', limit, skip, select } = options;
    let query = this.model.find(filter);
    if (sort) query = query.sort(sort);
    if (skip) query = query.skip(skip);
    if (limit) query = query.limit(limit);
    if (select) query = query.select(select);
    return query.lean();
  }

  async update(id, tenantId, updates) {
    const query = { _id: id };
    if (tenantId) query.tenantId = tenantId;
    return this.model.findOneAndUpdate(query, updates, { new: true, runValidators: true }).lean();
  }

  async delete(id, tenantId) {
    const query = { _id: id };
    if (tenantId) query.tenantId = tenantId;
    const result = await this.model.deleteOne(query);
    return result.deletedCount > 0;
  }

  async count(filter = {}) {
    return this.model.countDocuments(filter);
  }

  async exists(filter) {
    const count = await this.model.countDocuments(filter).limit(1);
    return count > 0;
  }
}
/*
/**
 * Base repository with common CRUD operations.
 * @template T
 /
export class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    const doc = new this.model(data);
    return doc.save();
  }

  async findById(id, tenantId, options = {}) {
    const query = { _id: id };
    if (tenantId) query.tenantId = tenantId;
    return this.model.findOne(query, null, options).lean();
  }

  async findOne(filter, options = {}) {
    return this.model.findOne(filter, null, options).lean();
  }

  async find(filter = {}, options = {}) {
    const { sort = '-createdAt', limit, skip, select } = options;
    let query = this.model.find(filter);
    if (sort) query = query.sort(sort);
    if (skip) query = query.skip(skip);
    if (limit) query = query.limit(limit);
    if (select) query = query.select(select);
    return query.lean();
  }

  async update(id, tenantId, updates) {
    const query = { _id: id };
    if (tenantId) query.tenantId = tenantId;
    return this.model.findOneAndUpdate(query, updates, { new: true, runValidators: true }).lean();
  }

  async delete(id, tenantId) {
    const query = { _id: id };
    if (tenantId) query.tenantId = tenantId;
    const result = await this.model.deleteOne(query);
    return result.deletedCount > 0;
  }

  async count(filter = {}) {
    return this.model.countDocuments(filter);
  }

  async exists(filter) {
    const count = await this.model.countDocuments(filter).limit(1);
    return count > 0;
  }
}*/