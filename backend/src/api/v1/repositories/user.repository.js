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
/*import { BaseRepository } from './base.repository.js';
import mongoose from 'mongoose';

export class UserRepository extends BaseRepository {
  constructor(userModel) {
    if (!userModel) {
      throw new Error('UserModel is required');
    }
    super(userModel);
  }

  async findById(id, tenantId, options = {}) {
    // Convert string ID to ObjectId if it's a valid ObjectId string
    let queryId = id;
    if (mongoose.Types.ObjectId.isValid(id)) {
      queryId = new mongoose.Types.ObjectId(id);
    }
    
    const query = { _id: queryId };
    //if (tenantId) query.tenantId = tenantId;
    
    console.log(`[UserRepository] findById query:`, JSON.stringify(query));
    const user = await this.model.findOne(query, null, options).lean();
    console.log(`[UserRepository] findById result:`, user ? user.email : 'not found');
    
    return user;
  }

  async findByEmail(email, /*tenantId/) {
    return this.model.findOne({ email, /*tenantId/ }).lean();
  }

  async findByUsername(username, /tenantId/) {
    return this.model.findOne({ username, /*tenantId/ }).lean();
  }

  async findByGoogleId(googleId, /*tenantId/) {
    return this.model.findOne({ googleId, /*tenantId/ }).lean();
  }

  async updateLoginAttempts(userId, tenantId, attempts, lockUntil = null) {
    const update = { loginAttempts: attempts };
    if (lockUntil) update.lockUntil = lockUntil;
    return this.update(userId, tenantId, update);
  }

  async findAllWithPagination(tenantId, { page, limit, sort = '-createdAt', filter = {} }) {
    const skip = (page - 1) * limit;
    const query = { tenantId, ...filter };
    const [users, total] = await Promise.all([
      this.model.find(query).sort(sort).skip(skip).limit(limit).lean(),
      this.model.countDocuments(query),
    ]);
    return { users, total };
  }
}*/


/*import { BaseRepository } from './base.repository.js';

export class UserRepository extends BaseRepository {
  constructor(userModel) {
    if (!userModel) {
      throw new Error('UserModel is required');
    }
    super(userModel);
  }

  async findByEmail(email, tenantId) {
    return this.model.findOne({ email, tenantId }).lean();
  }

  async findByUsername(username, tenantId) {
    return this.model.findOne({ username, tenantId }).lean();
  }

  async findByGoogleId(googleId, tenantId) {
    return this.model.findOne({ googleId, tenantId }).lean();
  }

  async updateLoginAttempts(userId, tenantId, attempts, lockUntil = null) {
    const update = { loginAttempts: attempts };
    if (lockUntil) update.lockUntil = lockUntil;
    return this.update(userId, tenantId, update);
  }

  async findAllWithPagination(tenantId, { page, limit, sort = '-createdAt', filter = {} }) {
    const skip = (page - 1) * limit;
    const query = { tenantId, ...filter };
    const [users, total] = await Promise.all([
      this.model.find(query).sort(sort).skip(skip).limit(limit).lean(),
      this.model.countDocuments(query),
    ]);
    return { users, total };
  }
}*/
/*import { BaseRepository } from './base.repository.js';

export class UserRepository extends BaseRepository {
  constructor(userModel) {
    super(userModel);
  }

  async findByEmail(email, tenantId) {
    return this.model.findOne({ email, tenantId }).lean();
  }

  async findByUsername(username, tenantId) {
    return this.model.findOne({ username, tenantId }).lean();
  }

  async findById(id, tenantId, options = {}) {
    const query = { _id: id };
    if (tenantId) query.tenantId = tenantId;
    const user = await this.model.findOne(query, null, options).lean();
    if (!user && tenantId) {
      // Fallback: try without tenantId (should not happen, but for debugging)
      console.warn(`User ${id} not found with tenant ${tenantId}, trying without tenant`);
      return this.model.findOne({ _id: id }, null, options).lean();
    }
    return user;
  }

  async findByGoogleId(googleId, tenantId) {
    return this.model.findOne({ googleId, tenantId }).lean();
  }

  async updateLoginAttempts(userId, tenantId, attempts, lockUntil = null) {
    const update = { loginAttempts: attempts };
    if (lockUntil) update.lockUntil = lockUntil;
    return this.update(userId, tenantId, update);
  }

  async findAllWithPagination(tenantId, { page, limit, sort = '-createdAt', filter = {} }) {
    const skip = (page - 1) * limit;
    const query = { tenantId, ...filter };
    const [users, total] = await Promise.all([
      this.model.find(query).sort(sort).skip(skip).limit(limit).lean(),
      this.model.countDocuments(query),
    ]);
    return { users, total };
  }
}*/
/*import { UserModel } from '../../../database/models/user.model.js';
import { BaseRepository } from './base.repository.js';

export class UserRepository extends BaseRepository {
  constructor() {
    super(UserModel);
  }

  async findByEmail(email, tenantId) {
    return this.model.findOne({ email, tenantId }).lean();
  }

  async findByUsername(username, tenantId) {
    return this.model.findOne({ username, tenantId }).lean();
  }

  async findByGoogleId(googleId, tenantId) {
    return this.model.findOne({ googleId, tenantId }).lean();
  }

  async updateLoginAttempts(userId, tenantId, attempts, lockUntil = null) {
    const update = { loginAttempts: attempts };
    if (lockUntil) update.lockUntil = lockUntil;
    return this.update(userId, tenantId, update);
  }

  async findAllWithPagination(tenantId, { page, limit, sort = '-createdAt', filter = {} }) {
    const skip = (page - 1) * limit;
    const query = { tenantId, ...filter };
    const [users, total] = await Promise.all([
      this.model.find(query).sort(sort).skip(skip).limit(limit).lean(),
      this.model.countDocuments(query),
    ]);
    return { users, total };
  }
}*/