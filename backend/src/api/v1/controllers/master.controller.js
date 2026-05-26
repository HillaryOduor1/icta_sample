// src/api/v1/controllers/master.controller.js
import { TenantRepository } from '../repositories/tenant.repository.js';
import { AuthService } from '../services/auth.service.js';
import { asyncHandler } from '../../../shared/utils/asyncHandler.js';
import { successResponse } from '../../../shared/utils/response.util.js';
import { AppError } from '../../../shared/errors/AppError.js';
import connectDB from '../../../config/database.js';
import { UserModel } from '../../../database/models/user.model.js';

const tenantRepo = new TenantRepository();
// Create AuthService without any models (only needed for token generation)
const authService = new AuthService(); // No userModel or activityModel needed

export const listTenants = asyncHandler(async (req, res) => {
  console.log('📋 [Master] Fetching tenants list');
  const tenants = await tenantRepo.findAll();
  console.log(`✅ Found ${tenants.length} tenants`);
  return successResponse(res, 200, 'Tenants retrieved', tenants);
});


/*export const switchToTenant = asyncHandler(async (req, res) => {
  const { dbName } = req.params;
  console.log(`🔄 [Master] Switching to tenant: ${dbName}`);
  
  const tenant = await tenantRepo.findByDbName(dbName);
  if (!tenant) throw new AppError('Tenant not found', 404);

  const conn = await connectDB(dbName);
  const User = conn.model('User', UserModel.schema);
  let adminUser = await User.findOne({ role: 'admin' });
  if (!adminUser) adminUser = await User.findOne({});
  
  if (!adminUser) {
    throw new AppError('No users found in tenant database', 404);
  }

  console.log(`✅ Found admin user: ${adminUser.username} (${adminUser._id})`);

  // Use authService to generate tokens (only needs generateAccessToken and generateRefreshToken methods)
  const accessToken = authService.generateAccessToken({ 
    _id: adminUser._id, 
    role: adminUser.role, 
    tenantId: dbName 
  });
  const refreshToken = await authService.generateRefreshToken(adminUser._id, req.ip);

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  };
  res.cookie('refresh_token', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.cookie('access_token', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
  res.cookie('switched_from_master', 'true', { httpOnly: false, ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });

  return successResponse(res, 200, 'Switched to tenant', { tenant: tenant.name });
});*/
export const switchToTenant = asyncHandler(async (req, res) => {
  const { dbName } = req.params;
  console.log(`🔄 [Master] Switching to tenant: ${dbName}`);
  
  const tenant = await tenantRepo.findByDbName(dbName);
  if (!tenant) throw new AppError('Tenant not found', 404);

  const conn = await connectDB(dbName);
  const User = conn.model('User', UserModel.schema);
  let adminUser = await User.findOne({ role: 'admin' });
  if (!adminUser) adminUser = await User.findOne({});
  
  if (!adminUser) {
    throw new AppError('No users found in tenant database', 404);
  }

  console.log(`✅ Found admin user: ${adminUser.username} (${adminUser._id})`);

  // IMPORTANT: Set tenantId in the JWT payload
  const accessToken = authService.generateAccessToken({ 
    _id: adminUser._id, 
    role: adminUser.role, 
    tenantId: dbName  // This is critical
  });
  const refreshToken = await authService.generateRefreshToken(adminUser._id, req.ip);

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  };
  res.cookie('refresh_token', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.cookie('access_token', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
  res.cookie('switched_from_master', 'true', { httpOnly: false, ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });

  return successResponse(res, 200, 'Switched to tenant', { tenant: tenant.name });
});
/*
// src/api/v1/controllers/master.controller.js
import { TenantRepository } from '../repositories/tenant.repository.js';
import { AuthService } from '../services/auth.service.js';
import { asyncHandler } from '../../../shared/utils/asyncHandler.js';
import { successResponse } from '../../../shared/utils/response.util.js';
import { AppError } from '../../../shared/errors/AppError.js';
import connectDB from '../../../config/database.js';
import { UserModel } from '../../../database/models/user.model.js';

const tenantRepo = new TenantRepository();
const authService = new AuthService(); // No userModel needed for master operations

export const listTenants = asyncHandler(async (req, res) => {
  console.log('📋 [Master] Fetching tenants list');
  const tenants = await tenantRepo.findAll();
  console.log(`✅ Found ${tenants.length} tenants`);
  return successResponse(res, 200, 'Tenants retrieved', tenants);
});

export const switchToTenant = asyncHandler(async (req, res) => {
  const { dbName } = req.params;
  console.log(`🔄 [Master] Switching to tenant: ${dbName}`);
  
  const tenant = await tenantRepo.findByDbName(dbName);
  if (!tenant) throw new AppError('Tenant not found', 404);

  const conn = await connectDB(dbName);
  const User = conn.model('User', UserModel.schema);
  let adminUser = await User.findOne({ role: 'admin' });
  if (!adminUser) adminUser = await User.findOne({});
  
  if (!adminUser) {
    throw new AppError('No users found in tenant database', 404);
  }

  console.log(`✅ Found admin user: ${adminUser.username} (${adminUser._id})`);

  const accessToken = authService.generateAccessToken({ 
    _id: adminUser._id, 
    role: adminUser.role, 
    tenantId: dbName 
  });
  const refreshToken = await authService.generateRefreshToken(adminUser._id, req.ip);

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  };
  res.cookie('refresh_token', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.cookie('access_token', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
  res.cookie('switched_from_master', 'true', { httpOnly: false, ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });

  return successResponse(res, 200, 'Switched to tenant', { tenant: tenant.name });
});*/
/*// src/api/v1/controllers/master.controller.js
import { TenantRepository } from '../repositories/tenant.repository.js';
import { AuthService } from '../services/auth.service.js';
import { asyncHandler } from '../../../shared/utils/asyncHandler.js';
import { successResponse } from '../../../shared/utils/response.util.js';
import { AppError } from '../../../shared/errors/AppError.js';
import connectDB from '../../../config/database.js';
import { UserModel } from '../../../database/models/user.model.js';

const tenantRepo = new TenantRepository();
const authService = new AuthService(); // No userModel needed for master operations

export const listTenants = asyncHandler(async (req, res) => {
  const tenants = await tenantRepo.findAll();
  return successResponse(res, 200, 'Tenants retrieved', tenants);
});

export const switchToTenant = asyncHandler(async (req, res) => {
  const { dbName } = req.params;
  const tenant = await tenantRepo.findByDbName(dbName);
  if (!tenant) throw new AppError('Tenant not found', 404);

  const conn = await connectDB(dbName);
  const User = conn.model('User', UserModel.schema);
  let adminUser = await User.findOne({ role: 'admin' });
  if (!adminUser) adminUser = await User.findOne({});

  const accessToken = authService.generateAccessToken({ _id: adminUser._id, role: adminUser.role, tenantId: dbName });
  const refreshToken = await authService.generateRefreshToken(adminUser._id, req.ip);

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  };
  res.cookie('refresh_token', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.cookie('access_token', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
  res.cookie('switched_from_master', 'true', { httpOnly: false, ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });

  return successResponse(res, 200, 'Switched to tenant', { tenant: tenant.name });
});*/
/*// src/api/v1/controllers/master.controller.js
import { TenantRepository } from '../repositories/tenant.repository.js';
import { AuthService } from '../services/auth.service.js';
import { asyncHandler } from '../../../shared/utils/asyncHandler.js';
import { successResponse } from '../../../shared/utils/response.util.js';

const tenantRepo = new TenantRepository();
const authService = new AuthService();

export const listTenants = asyncHandler(async (req, res) => {
  const tenants = await tenantRepo.findAll();
  return successResponse(res, 200, 'Tenants retrieved', tenants);
});

export const switchToTenant = asyncHandler(async (req, res) => {
  const { dbName } = req.params;
  const tenant = await tenantRepo.findByDbName(dbName);
  if (!tenant) throw new AppError('Tenant not found', 404);

  // Find an admin user in that tenant (or first user)
  const { UserModel } = require('../../../database/models/user.model.js');
  const conn = await connectDB(dbName);
  const User = conn.model('User', UserModel.schema);
  let adminUser = await User.findOne({ role: 'admin' });
  if (!adminUser) adminUser = await User.findOne({});

  const accessToken = authService.generateAccessToken({ _id: adminUser._id, role: adminUser.role, tenantId: dbName });
  const refreshToken = await authService.generateRefreshToken(adminUser._id, req.ip);

  res.cookie('refresh_token', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 7*24*60*60*1000 });
  res.cookie('access_token', accessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 15*60*1000 });
  res.cookie('switched_from_master', 'true', { httpOnly: false, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 7*24*60*60*1000 });

  return successResponse(res, 200, 'Switched to tenant', { tenant: tenant.name });
});*/