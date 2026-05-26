import jwt from 'jsonwebtoken';
import { randomBytes, createHash } from 'crypto';
import bcrypt from 'bcrypt';
import { redisClient } from '../../../config/redis.js';
import { UserRepository } from '../repositories/user.repository.js';
import { ActivityRepository } from '../repositories/activity.repository.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { getMasterConnection } from '../../../config/database.js';
import { MasterUserModel } from '../../../database/models/masterUser.model.js';

export class AuthService {
  /*constructor(userModel = null, activityModel = null) {
    if (userModel) {
      this.userRepo = new UserRepository(userModel);
    } else {
      this.userRepo = null;
    }
    
    // Only create activityRepo if activityModel is provided
    if (activityModel) {
      this.activityRepo = new ActivityRepository(activityModel);
    } else {
      this.activityRepo = null;
    }
  }*/
 constructor(userModel = null, activityModel = null) {
  if (userModel) {
    this.userRepo = new UserRepository(userModel);
  } else {
    this.userRepo = null;
  }
  
  // Only create activityRepo if activityModel is provided
  if (activityModel) {
    this.activityRepo = new ActivityRepository(activityModel);
  } else {
    this.activityRepo = null;
  }
}

  generateAccessToken(user) {
    const payload = { sub: user._id, role: user.role, tenantId: user.tenantId || null };
    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m', jwtid: randomBytes(16).toString('hex') });
  }

  async generateRefreshToken(userId, deviceId) {
    const token = randomBytes(64).toString('hex');
    const hashed = await bcrypt.hash(token, 10);
    await redisClient.hset(`rt:${userId}`, deviceId, hashed);
    await redisClient.expire(`rt:${userId}`, 7 * 86400);
    return token;
  }

  generateDeviceId(ip, userAgent) {
    return createHash('sha256').update(`${ip}|${userAgent}`).digest('hex');
  }

  /*async login(email, password, ip, userAgent) {
    if (!this.userRepo) throw new AppError('AuthService not configured for tenant operations', 500);
    const user = await this.userRepo.findByEmail(email, null);
    if (!user) throw new AppError('Invalid credentials', 401);

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new AppError('Invalid credentials', 401);

    if (user.lockUntil && user.lockUntil > new Date()) {
      throw new AppError('Account locked. Try again later.', 403);
    }

    await this.userRepo.updateLoginAttempts(user._id, user.tenantId, 0, null);

    const deviceId = this.generateDeviceId(ip, userAgent);
    const accessToken = this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user._id, deviceId);

    if (this.activityRepo) {
      await this.activityRepo.log(user.tenantId, 'user_login', `User ${user.username} logged in`, user._id, user.username, `IP: ${ip}`);
    }

    return { accessToken, refreshToken, user };
  }*/
 async login(email, password, ip, userAgent) {
  if (!this.userRepo) throw new AppError('AuthService not configured for tenant operations', 500);
  
  // For tenant login, we need to filter by tenantId
  // But the tenantId should come from the request context
  // Since AuthService doesn't have tenantId, we need to pass it or get it differently
  
  // First, try to find user by email without tenant restriction to get their tenant
  let user = await this.userRepo.findByEmail(email, null, true);
  
  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  // Now verify password
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    // Increment failed login attempts
    const attempts = (user.loginAttempts || 0) + 1;
    let lockUntil = null;
    if (attempts >= 5) {
      lockUntil = new Date(Date.now() + 15 * 60 * 1000); // Lock for 15 minutes
    }
    await this.userRepo.updateLoginAttempts(user._id, user.tenantId, attempts, lockUntil);
    throw new AppError('Invalid credentials', 401);
  }

  // Check if account is locked
  if (user.lockUntil && user.lockUntil > new Date()) {
    throw new AppError('Account locked. Too many failed attempts. Try again later.', 403);
  }

  // Check if user is active
  if (!user.active) {
    throw new AppError('Account is disabled. Please contact administrator.', 403);
  }

  // Reset login attempts on successful login
  await this.userRepo.updateLoginAttempts(user._id, user.tenantId, 0, null);

  const deviceId = this.generateDeviceId(ip, userAgent);
  const accessToken = this.generateAccessToken(user);
  const refreshToken = await this.generateRefreshToken(user._id, deviceId);

  if (this.activityRepo) {
    await this.activityRepo.log(user.tenantId, 'user_login', `User ${user.username} logged in`, user._id, user.username, `IP: ${ip}`);
  }

  // Remove password from user object
  const { password: _, ...userWithoutPassword } = user;
  
  return { accessToken, refreshToken, user: userWithoutPassword };
}

  async refresh(refreshToken, ip, userAgent) {
    let userId = null;
    let deviceId = null;
    const keys = await redisClient.keys('rt:*');
    for (const key of keys) {
      const fields = await redisClient.hgetall(key);
      for (const [did, hash] of Object.entries(fields)) {
        if (await bcrypt.compare(refreshToken, hash)) {
          userId = key.split(':')[1];
          deviceId = did;
          break;
        }
      }
      if (userId) break;
    }
    if (!userId) throw new AppError('Invalid refresh token', 401);

    if (!this.userRepo) throw new AppError('AuthService not configured for tenant operations', 500);
    const user = await this.userRepo.findById(userId);
    if (!user) throw new AppError('User not found', 401);

    await redisClient.hdel(`rt:${userId}`, deviceId);
    const newDeviceId = this.generateDeviceId(ip, userAgent);
    const newAccessToken = this.generateAccessToken(user);
    const newRefreshToken = await this.generateRefreshToken(userId, newDeviceId);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async logout(accessToken, refreshToken, userId) {
    if (accessToken) {
      const decoded = jwt.decode(accessToken);
      if (decoded?.jti) {
        await redisClient.sadd(`bl:${decoded.jti}`, '1');
        await redisClient.expire(`bl:${decoded.jti}`, 900);
      }
    }
    if (refreshToken && userId) {
      const hash = await redisClient.hgetall(`rt:${userId}`);
      for (const [deviceId, storedHash] of Object.entries(hash)) {
        if (await bcrypt.compare(refreshToken, storedHash)) {
          await redisClient.hdel(`rt:${userId}`, deviceId);
          break;
        }
      }
    }
    if (userId && this.userRepo && this.activityRepo) {
      const user = await this.userRepo.findById(userId);
      if (user) await this.activityRepo.log(user.tenantId, 'user_logout', `User ${user.username} logged out`, userId, user.username);
    }
  }

  async logoutAll(userId) {
    await redisClient.del(`rt:${userId}`);
  }

  /*async getCurrentUser(userId, tenantId) {
    // If no tenantId, this is a master (superadmin) session
    if (!tenantId) {
      const masterConn = await getMasterConnection();
      const MasterUser = masterConn.model('MasterUser', MasterUserModel.schema);
      const user = await MasterUser.findById(userId).lean();
      if (!user) {
        throw new AppError('User not found', 404);
      }
      // Format the response to match what the frontend expects
      return {
        _id: user._id,
        username: user.email?.split('@')[0] || 'superadmin',
        email: user.email,
        role: 'superadmin',
        active: true,
        avatar: null,
        lastLogin: user.lastLogin,
        loginAttempts: 0,
        lockUntil: null,
        preferences: { theme: 'system', notifications: true },
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };
    }

    // Tenant user lookup
    if (!this.userRepo) {
      throw new AppError('AuthService not configured for tenant operations', 500);
    }
    const user = await this.userRepo.findById(userId, tenantId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }*/
 async getCurrentUser(userId, tenantId) {
  console.log(`[AuthService] getCurrentUser called with userId=${userId}, tenantId=${tenantId}`);
  
  // If tenantId is null or undefined, check master database
  if (!tenantId || tenantId === 'null' || tenantId === 'undefined') {
    console.log('[AuthService] No tenantId, checking master database');
    const masterConn = await getMasterConnection();
    const MasterUser = masterConn.model('MasterUser', MasterUserModel.schema);
    const user = await MasterUser.findById(userId).lean();
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return {
      _id: user._id,
      username: user.email?.split('@')[0] || 'superadmin',
      email: user.email,
      role: 'superadmin',
      active: true,
      avatar: null,
      lastLogin: user.lastLogin,
      loginAttempts: 0,
      lockUntil: null,
      preferences: { theme: 'system', notifications: true },
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }

  // Tenant user lookup
  if (!this.userRepo) {
    throw new AppError('AuthService not configured for tenant operations', 500);
  }
  
  //console.log(`[AuthService] Looking for tenant user with userId=${userId}, tenantId=${tenantId}`);
  //const user = await this.userRepo.findById(userId, tenantId);
   console.log(`[AuthService] Looking for tenant user with userId=${userId}`);
  // Pass null for tenantId to ignore it in the query
  const user = await this.userRepo.findById(userId, null);
  if (!user) {
    console.log(`[AuthService] User not found in tenant database`);
    throw new AppError('User not found', 404);
  }
  console.log(`[AuthService] Found user: ${user.email}`);
  return user;
}

  async changePassword(userId, tenantId, currentPassword, newPassword) {
    if (!this.userRepo) throw new AppError('AuthService not configured for tenant operations', 500);
    const user = await this.userRepo.findById(userId, tenantId);
    if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
      throw new AppError('Current password is incorrect', 401);
    }
    const hashed = await bcrypt.hash(newPassword, 12);
    await this.userRepo.update(userId, tenantId, { password: hashed });
    if (this.activityRepo) {
      await this.activityRepo.log(tenantId, 'user_update', `User ${user.username} changed password`, userId, user.username);
    }
  }
}
/*import jwt from 'jsonwebtoken';
import { randomBytes, createHash } from 'crypto';
import bcrypt from 'bcrypt';
import { redisClient } from '../../../config/redis.js';
import { UserRepository } from '../repositories/user.repository.js';
import { ActivityRepository } from '../repositories/activity.repository.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { getMasterConnection } from '../../../config/database.js';
import { MasterUserModel } from '../../../database/models/masterUser.model.js';

export class AuthService {
  constructor(userModel = null) {
    if (userModel) {
      this.userRepo = new UserRepository(userModel);
    } else {
      this.userRepo = null;
    }
    this.activityRepo = new ActivityRepository();
  }

  generateAccessToken(user) {
    const payload = { sub: user._id, role: user.role, tenantId: user.tenantId || null };
    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m', jwtid: randomBytes(16).toString('hex') });
  }

  async generateRefreshToken(userId, deviceId) {
    const token = randomBytes(64).toString('hex');
    const hashed = await bcrypt.hash(token, 10);
    await redisClient.hset(`rt:${userId}`, deviceId, hashed);
    await redisClient.expire(`rt:${userId}`, 7 * 86400);
    return token;
  }

  generateDeviceId(ip, userAgent) {
    return createHash('sha256').update(`${ip}|${userAgent}`).digest('hex');
  }

  async login(email, password, ip, userAgent) {
    if (!this.userRepo) throw new AppError('AuthService not configured for tenant operations', 500);
    const user = await this.userRepo.findByEmail(email, null);
    if (!user) throw new AppError('Invalid credentials', 401);

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new AppError('Invalid credentials', 401);

    if (user.lockUntil && user.lockUntil > new Date()) {
      throw new AppError('Account locked. Try again later.', 403);
    }

    await this.userRepo.updateLoginAttempts(user._id, user.tenantId, 0, null);

    const deviceId = this.generateDeviceId(ip, userAgent);
    const accessToken = this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user._id, deviceId);

    await this.activityRepo.log(user.tenantId, 'user_login', `User ${user.username} logged in`, user._id, user.username, `IP: ${ip}`);

    return { accessToken, refreshToken, user };
  }

  async refresh(refreshToken, ip, userAgent) {
    let userId = null;
    let deviceId = null;
    const keys = await redisClient.keys('rt:*');
    for (const key of keys) {
      const fields = await redisClient.hgetall(key);
      for (const [did, hash] of Object.entries(fields)) {
        if (await bcrypt.compare(refreshToken, hash)) {
          userId = key.split(':')[1];
          deviceId = did;
          break;
        }
      }
      if (userId) break;
    }
    if (!userId) throw new AppError('Invalid refresh token', 401);

    if (!this.userRepo) throw new AppError('AuthService not configured for tenant operations', 500);
    const user = await this.userRepo.findById(userId);
    if (!user) throw new AppError('User not found', 401);

    await redisClient.hdel(`rt:${userId}`, deviceId);
    const newDeviceId = this.generateDeviceId(ip, userAgent);
    const newAccessToken = this.generateAccessToken(user);
    const newRefreshToken = await this.generateRefreshToken(userId, newDeviceId);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async logout(accessToken, refreshToken, userId) {
    if (accessToken) {
      const decoded = jwt.decode(accessToken);
      if (decoded?.jti) {
        await redisClient.sadd(`bl:${decoded.jti}`, '1');
        await redisClient.expire(`bl:${decoded.jti}`, 900);
      }
    }
    if (refreshToken && userId) {
      const hash = await redisClient.hgetall(`rt:${userId}`);
      for (const [deviceId, storedHash] of Object.entries(hash)) {
        if (await bcrypt.compare(refreshToken, storedHash)) {
          await redisClient.hdel(`rt:${userId}`, deviceId);
          break;
        }
      }
    }
    if (userId && this.userRepo) {
      const user = await this.userRepo.findById(userId);
      if (user) await this.activityRepo.log(user.tenantId, 'user_logout', `User ${user.username} logged out`, userId, user.username);
    }
  }

  async logoutAll(userId) {
    await redisClient.del(`rt:${userId}`);
  }

  async getCurrentUser(userId, tenantId) {
    // If no tenantId, this is a master (superadmin) session
    if (!tenantId) {
      const masterConn = await getMasterConnection();
      const MasterUser = masterConn.model('MasterUser', MasterUserModel.schema);
      const user = await MasterUser.findById(userId).lean();
      if (!user) {
        throw new AppError('User not found', 404);
      }
      // Format the response to match what the frontend expects
      return {
        _id: user._id,
        username: user.email?.split('@')[0] || 'superadmin',
        email: user.email,
        role: 'superadmin',
        active: true,
        avatar: null,
        lastLogin: user.lastLogin,
        loginAttempts: 0,
        lockUntil: null,
        preferences: { theme: 'system', notifications: true },
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };
    }

    // Tenant user lookup
    if (!this.userRepo) {
      throw new AppError('AuthService not configured for tenant operations', 500);
    }
    const user = await this.userRepo.findById(userId, tenantId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }

  async changePassword(userId, tenantId, currentPassword, newPassword) {
    if (!this.userRepo) throw new AppError('AuthService not configured for tenant operations', 500);
    const user = await this.userRepo.findById(userId, tenantId);
    if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
      throw new AppError('Current password is incorrect', 401);
    }
    const hashed = await bcrypt.hash(newPassword, 12);
    await this.userRepo.update(userId, tenantId, { password: hashed });
    await this.activityRepo.log(tenantId, 'user_update', `User ${user.username} changed password`, userId, user.username);
  }
}*/
/*import jwt from 'jsonwebtoken';
import { randomBytes, createHash } from 'crypto';
import bcrypt from 'bcrypt';
import { redisClient } from '../../../config/redis.js';
import { UserRepository } from '../repositories/user.repository.js';
import { ActivityRepository } from '../repositories/activity.repository.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { getMasterConnection } from '../../../config/database.js';
import { MasterUserModel } from '../../../database/models/masterUser.model.js';


export class AuthService {
  constructor(userModel = null) {
    if (userModel) {
      this.userRepo = new UserRepository(userModel);
    } else {
      this.userRepo = null;
    }
    this.activityRepo = new ActivityRepository();
  }

  generateAccessToken(user) {
    const payload = { sub: user._id, role: user.role, tenantId: user.tenantId };
    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m', jwtid: randomBytes(16).toString('hex') });
  }

  async generateRefreshToken(userId, deviceId) {
    const token = randomBytes(64).toString('hex');
    const hashed = await bcrypt.hash(token, 10);
    await redisClient.hset(`rt:${userId}`, deviceId, hashed);
    await redisClient.expire(`rt:${userId}`, 7 * 86400);
    return token;
  }

  generateDeviceId(ip, userAgent) {
    return createHash('sha256').update(`${ip}|${userAgent}`).digest('hex');
  }

  async login(email, password, ip, userAgent) {
    if (!this.userRepo) throw new AppError('AuthService not configured for tenant operations', 500);
    const user = await this.userRepo.findByEmail(email, null);
    if (!user) throw new AppError('Invalid credentials', 401);

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new AppError('Invalid credentials', 401);

    if (user.lockUntil && user.lockUntil > new Date()) {
      throw new AppError('Account locked. Try again later.', 403);
    }

    await this.userRepo.updateLoginAttempts(user._id, user.tenantId, 0, null);

    const deviceId = this.generateDeviceId(ip, userAgent);
    const accessToken = this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user._id, deviceId);

    await this.activityRepo.log(user.tenantId, 'user_login', `User ${user.username} logged in`, user._id, user.username, `IP: ${ip}`);

    return { accessToken, refreshToken, user };
  }

  async refresh(refreshToken, ip, userAgent) {
    let userId = null;
    let deviceId = null;
    const keys = await redisClient.keys('rt:*');
    for (const key of keys) {
      const fields = await redisClient.hgetall(key);
      for (const [did, hash] of Object.entries(fields)) {
        if (await bcrypt.compare(refreshToken, hash)) {
          userId = key.split(':')[1];
          deviceId = did;
          break;
        }
      }
      if (userId) break;
    }
    if (!userId) throw new AppError('Invalid refresh token', 401);

    if (!this.userRepo) throw new AppError('AuthService not configured for tenant operations', 500);
    const user = await this.userRepo.findById(userId);
    if (!user) throw new AppError('User not found', 401);

    await redisClient.hdel(`rt:${userId}`, deviceId);
    const newDeviceId = this.generateDeviceId(ip, userAgent);
    const newAccessToken = this.generateAccessToken(user);
    const newRefreshToken = await this.generateRefreshToken(userId, newDeviceId);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async logout(accessToken, refreshToken, userId) {
    if (accessToken) {
      const decoded = jwt.decode(accessToken);
      if (decoded?.jti) {
        await redisClient.sadd(`bl:${decoded.jti}`, '1');
        await redisClient.expire(`bl:${decoded.jti}`, 900);
      }
    }
    if (refreshToken && userId) {
      const hash = await redisClient.hgetall(`rt:${userId}`);
      for (const [deviceId, storedHash] of Object.entries(hash)) {
        if (await bcrypt.compare(refreshToken, storedHash)) {
          await redisClient.hdel(`rt:${userId}`, deviceId);
          break;
        }
      }
    }
    if (userId && this.userRepo) {
      const user = await this.userRepo.findById(userId);
      if (user) await this.activityRepo.log(user.tenantId, 'user_logout', `User ${user.username} logged out`, userId, user.username);
    }
  }

  async logoutAll(userId) {
    await redisClient.del(`rt:${userId}`);
  }

  /* async getCurrentUser(userId, tenantId) {
    if (!this.userRepo) throw new AppError('AuthService not configured for tenant operations', 500);
    const user = await this.userRepo.findById(userId, tenantId);
    if (!user) throw new AppError('User not found', 404);
    return user; 
  }*/
 /*async getCurrentUser(userId, tenantId) {
  if (!this.userRepo) throw new AppError('AuthService not configured for tenant operations', 500);
  
  // Convert to ObjectId if needed (Mongoose will handle string)
  const user = await this.userRepo.findById(userId, tenantId);
  if (!user) {
    console.error(`User not found: userId=${userId}, tenantId=${tenantId}`);
    throw new AppError('User not found', 404);
  }
  return user;
}*/
/*async getCurrentUser(userId, tenantId) {
  if (!this.userRepo) throw new AppError('AuthService not configured for tenant operations', 500);

  console.log(`[AuthService] Looking for user: userId=${userId}, tenantId=${tenantId}`);

  const user = await this.userRepo.findById(userId, tenantId);
  if (!user) {
    console.error(`[AuthService] User not found for id=${userId} in tenant=${tenantId}`);
    // Optional: try to find by email if userId is invalid? Not recommended, but for debugging:
    throw new AppError('User not found', 404);
  }
  console.log(`[AuthService] Found user: ${user.email} (${user._id})`);
  return user;
}*/

/*async getCurrentUser(userId, tenantId) {
  // If no tenantId, this is a master (superadmin) session
  if (!tenantId) {
    const masterConn = await getMasterConnection();
    const MasterUser = masterConn.model('MasterUser', MasterUserModel.schema);
    const user = await MasterUser.findById(userId).lean();
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }

  // Tenant user lookup
  if (!this.userRepo) {
    throw new AppError('AuthService not configured for tenant operations', 500);
  }
  const user = await this.userRepo.findById(userId, tenantId);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  return user;
}/
async getCurrentUser(userId, tenantId) {
  // If no tenantId, this is a master (superadmin) session
  if (!tenantId) {
    const masterConn = await getMasterConnection();
    const MasterUser = masterConn.model('MasterUser', MasterUserModel.schema);
    const user = await MasterUser.findById(userId).lean();
    if (!user) {
      throw new AppError('User not found', 404);
    }
    // Format the response to match what the frontend expects
    return {
      _id: user._id,
      username: user.email?.split('@')[0] || 'superadmin',
      email: user.email,
      role: 'superadmin',
      active: true,
      avatar: null,
      lastLogin: user.lastLogin,
      loginAttempts: 0,
      lockUntil: null,
      preferences: { theme: 'system', notifications: true }
    };
  }

  // Tenant user lookup
  if (!this.userRepo) {
    throw new AppError('AuthService not configured for tenant operations', 500);
  }
  const user = await this.userRepo.findById(userId, tenantId);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  return user;
}

  async changePassword(userId, tenantId, currentPassword, newPassword) {
    if (!this.userRepo) throw new AppError('AuthService not configured for tenant operations', 500);
    const user = await this.userRepo.findById(userId, tenantId);
    if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
      throw new AppError('Current password is incorrect', 401);
    }
    const hashed = await bcrypt.hash(newPassword, 12);
    await this.userRepo.update(userId, tenantId, { password: hashed });
    await this.activityRepo.log(tenantId, 'user_update', `User ${user.username} changed password`, userId, user.username);
  }
}*/

/*import jwt from 'jsonwebtoken';
import { randomBytes, createHash } from 'crypto';
import bcrypt from 'bcrypt';
import { redisClient } from '../../../config/redis.js';
import { UserRepository } from '../repositories/user.repository.js';
import { ActivityRepository } from '../repositories/activity.repository.js';
import { AppError } from '../../../shared/errors/AppError.js';

const userRepo = new UserRepository();
const activityRepo = new ActivityRepository();

export class AuthService {
  /*generateAccessToken(user) {
    const payload = { sub: user._id, role: user.role, tenantId: user.tenantId };
    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m', jwtid: randomBytes(16).toString('hex') });
  }/
  generateAccessToken(user) {
    const payload = { sub: user._id, role: user.role, tenantId: user.tenantId };
    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m', jwtid: randomBytes(16).toString('hex') });
  }

  async generateRefreshToken(userId, deviceId) {
    const token = randomBytes(64).toString('hex');
    const hashed = await bcrypt.hash(token, 10);
    await redisClient.hset(`rt:${userId}`, deviceId, hashed);
    await redisClient.expire(`rt:${userId}`, 7 * 86400);
    return token;
  }

  generateDeviceId(ip, userAgent) {
    return createHash('sha256').update(`${ip}|${userAgent}`).digest('hex');
  }

  async login(email, password, ip, userAgent) {
    const user = await userRepo.findByEmail(email, null); // tenantId not known yet, user has tenantId field
    if (!user) throw new AppError('Invalid credentials', 401);

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new AppError('Invalid credentials', 401);

    if (user.lockUntil && user.lockUntil > new Date()) {
      throw new AppError('Account locked. Try again later.', 403);
    }

    // Reset login attempts on success
    await userRepo.updateLoginAttempts(user._id, user.tenantId, 0, null);

    const deviceId = this.generateDeviceId(ip, userAgent);
    const accessToken = this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user._id, deviceId);

    // Log activity
    await activityRepo.log(user.tenantId, 'user_login', `User ${user.username} logged in`, user._id, user.username, `IP: ${ip}`);

    return { accessToken, refreshToken, user };
  }

  async refresh(refreshToken, ip, userAgent) {
    // Decode token to get userId and deviceId (stored in JWT or derive from token)
    // For simplicity, we assume refresh token is a random string stored in Redis with userId and deviceId as hash field.
    // Better: issue a JWT refresh token that contains userId and deviceId, and verify the hash.
    // Here we implement lookup by scanning – not ideal, but for brevity:
    let userId = null;
    let deviceId = null;
    const keys = await redisClient.keys('rt:*');
    for (const key of keys) {
      const fields = await redisClient.hgetall(key);
      for (const [did, hash] of Object.entries(fields)) {
        if (await bcrypt.compare(refreshToken, hash)) {
          userId = key.split(':')[1];
          deviceId = did;
          break;
        }
      }
      if (userId) break;
    }
    if (!userId) throw new AppError('Invalid refresh token', 401);

    const user = await userRepo.findById(userId);
    if (!user) throw new AppError('User not found', 401);

    // Rotate: delete old token, generate new pair
    await redisClient.hdel(`rt:${userId}`, deviceId);
    const newDeviceId = this.generateDeviceId(ip, userAgent);
    const newAccessToken = this.generateAccessToken(user);
    const newRefreshToken = await this.generateRefreshToken(userId, newDeviceId);

    // Blacklist old access token (if we had its JTI – here we don't, but can be added)
    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async logout(accessToken, refreshToken, userId) {
    if (accessToken) {
      const decoded = jwt.decode(accessToken);
      if (decoded?.jti) {
        await redisClient.sadd(`bl:${decoded.jti}`, '1');
        await redisClient.expire(`bl:${decoded.jti}`, 900);
      }
    }
    if (refreshToken && userId) {
      // Find and delete the specific device's refresh token
      const hash = await redisClient.hgetall(`rt:${userId}`);
      for (const [deviceId, storedHash] of Object.entries(hash)) {
        if (await bcrypt.compare(refreshToken, storedHash)) {
          await redisClient.hdel(`rt:${userId}`, deviceId);
          break;
        }
      }
    }
    // Log logout
    if (userId) {
      const user = await userRepo.findById(userId);
      if (user) await activityRepo.log(user.tenantId, 'user_logout', `User ${user.username} logged out`, userId, user.username);
    }
  }

  async logoutAll(userId) {
    await redisClient.del(`rt:${userId}`);
    // Also blacklist all active access tokens – would require storing JTIs per device
  }

  async getCurrentUser(userId, tenantId) {
    const user = await userRepo.findById(userId, tenantId);
    if (!user) throw new AppError('User not found', 404);
    return user;
  }

  async changePassword(userId, tenantId, currentPassword, newPassword) {
    const user = await userRepo.findById(userId, tenantId);
    if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
      throw new AppError('Current password is incorrect', 401);
    }
    const hashed = await bcrypt.hash(newPassword, 12);
    await userRepo.update(userId, tenantId, { password: hashed });
    await activityRepo.log(tenantId, 'user_update', `User ${user.username} changed password`, userId, user.username);
  }
}*/