import { BaseRepository } from './base.repository.js';

export class UserRepository extends BaseRepository {
  constructor(model) {
    super(model);
  }

  async findByEmail(email, tenantId, includePassword = true) {
    const query = tenantId ? { email, tenantId } : { email };
    let queryBuilder = this.model.findOne(query);
    if (includePassword) {
      queryBuilder = queryBuilder.select('+password');
    }
    return queryBuilder.lean();
  }

  async findByUsername(username, tenantId, includePassword = true) {
    const query = tenantId ? { username, tenantId } : { username };
    let queryBuilder = this.model.findOne(query);
    if (includePassword) {
      queryBuilder = queryBuilder.select('+password');
    }
    return queryBuilder.lean();
  }

  async findByUsernameOrEmail(identifier, tenantId, includePassword = true) {
    const query = tenantId 
      ? {
          $or: [
            { username: identifier },
            { email: identifier.toLowerCase() }
          ],
          tenantId
        }
      : {
          $or: [
            { username: identifier },
            { email: identifier.toLowerCase() }
          ]
        };
    
    let queryBuilder = this.model.findOne(query);
    if (includePassword) {
      queryBuilder = queryBuilder.select('+password');
    }
    return queryBuilder.lean();
  }

  async findById(id, tenantId, includePassword = false) {
    const query = tenantId ? { _id: id, tenantId } : { _id: id };
    let queryBuilder = this.model.findOne(query);
    if (includePassword) {
      queryBuilder = queryBuilder.select('+password');
    }
    return queryBuilder.lean();
  }

  async create(data) {
    const user = new this.model(data);
    const saved = await user.save();
    const { password, ...userWithoutPassword } = saved.toObject();
    return userWithoutPassword;
  }

  async update(id, tenantId, data) {
    const query = tenantId ? { _id: id, tenantId } : { _id: id };
    const updated = await this.model.findOneAndUpdate(
      query,
      data,
      { new: true, runValidators: true }
    ).lean();
    if (updated) {
      delete updated.password;
    }
    return updated;
  }

  async updateLoginAttempts(id, tenantId, attempts, lockUntil) {
    const update = { loginAttempts: attempts };
    if (lockUntil) update.lockUntil = lockUntil;
    const query = tenantId ? { _id: id, tenantId } : { _id: id };
    return this.model.updateOne(query, update);
  }

  async findAllWithPagination(tenantId, { page, limit, sort = '-createdAt', filter = {} }) {
    const skip = (page - 1) * limit;
    const query = { tenantId, ...filter };
    const [users, total] = await Promise.all([
      this.model.find(query).sort(sort).skip(skip).limit(limit).select('-password').lean(),
      this.model.countDocuments(query),
    ]);
    return { users, total };
  }

  async delete(id, tenantId) {
    const query = tenantId ? { _id: id, tenantId } : { _id: id };
    return this.model.findOneAndDelete(query);
  }
}

