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
