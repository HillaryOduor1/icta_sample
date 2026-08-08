import jwt from 'jsonwebtoken';
import { config } from '../../../config/env.js';
import { AuthenticationError } from '../../../shared/errors/AuthenticationError.js';
import { AuthorizationError } from '../../../shared/errors/AuthorizationError.js';
import { AuthService } from '../services/auth.service.js';
import { asyncHandler } from '../../../shared/utils/asyncHandler.js';
import { successResponse } from '../../../shared/utils/response.util.js';
import { LoginRequestDTO } from '../dtos/request/login.dto.js';
import { getMasterConnection } from '../../../config/database.js';
import { MasterUserModel } from '../../../database/models/masterUser.model.js';
import { AppError } from '../../../shared/errors/AppError.js';

export const login = asyncHandler(async (req, res) => {
  const authService = new AuthService(req.models.User, req.models.ActivityLog);
  const dto = new LoginRequestDTO(req.body);
  dto.validate();
  const { ip, headers } = req;
  const userAgent = headers['user-agent'];
  const { accessToken, refreshToken, user } = await authService.login(dto.email, dto.password, ip, userAgent);
  
  const cookieOptions = { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' };
  res.cookie('refresh_token', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.cookie('access_token', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
  res.cookie('token', accessToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
  
  return successResponse(res, 200, 'Login successful', { user });
});

export const refresh = asyncHandler(async (req, res) => {
  const authService = new AuthService(req.models.User, req.models.ActivityLog);
  const refreshToken = req.cookies.refresh_token;
  if (!refreshToken) throw new AppError('Refresh token missing', 401);
  const { ip, headers } = req;
  const userAgent = headers['user-agent'];
  const { accessToken, refreshToken: newRefreshToken } = await authService.refresh(refreshToken, ip, userAgent);
  
  const cookieOptions = { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' };
  res.cookie('refresh_token', newRefreshToken, { ...cookieOptions, maxAge: 7*24*60*60*1000 });
  res.cookie('access_token', accessToken, { ...cookieOptions, maxAge: 15*60*1000 });
  
  return successResponse(res, 200, 'Token refreshed', { accessToken });
});

export const switchToMaster = asyncHandler(async (req, res) => {
  const authService = new AuthService(req.models.User, req.models.ActivityLog);
  const masterToken = req.cookies.master_token;
  if (!masterToken) throw new AuthenticationError('No master session found');
  const decoded = jwt.verify(masterToken, config.jwt.accessSecret);
  if (decoded.role !== 'superadmin') throw new AuthorizationError('Not a master session');
  const accessToken = authService.generateAccessToken({ sub: decoded.sub, role: decoded.role, tenantId: null });
  const refreshToken = await authService.generateRefreshToken(decoded.sub, req.ip);
  const cookieOptions = { httpOnly: true, secure: config.env === 'production', sameSite: 'lax' };
  res.cookie('refresh_token', refreshToken, { ...cookieOptions, maxAge: 7*24*60*60*1000 });
  res.cookie('access_token', accessToken, { ...cookieOptions, maxAge: 15*60*1000 });
  res.clearCookie('switched_from_master');
  return successResponse(res, 200, 'Switched to master', {});
});

export const logout = asyncHandler(async (req, res) => {
  const authService = new AuthService(req.models.User, req.models.ActivityLog);
  const accessToken = req.cookies.access_token;
  const refreshToken = req.cookies.refresh_token;
  await authService.logout(accessToken, refreshToken, req.user?.sub);
  res.clearCookie('access_token');
  res.clearCookie('refresh_token');
  return successResponse(res, 200, 'Logged out successfully');
});

export const logoutAll = asyncHandler(async (req, res) => {
  const authService = new AuthService(req.models.User, req.models.ActivityLog);
  await authService.logoutAll(req.user.sub);
  res.clearCookie('access_token');
  res.clearCookie('refresh_token');
  return successResponse(res, 200, 'Logged out from all devices');
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  // Determine which tenantId to use - from the token or from the request
  const tenantId = req.user?.tenantId || req.tenantId;
  
  // Create AuthService with the tenant's models
  const authService = new AuthService(req.models.User, req.models.ActivityLog);
  
  if (!req.user) throw new AuthenticationError('Not authenticated');
  
  const user = await authService.getCurrentUser(req.user.sub, tenantId);
  return successResponse(res, 200, 'User retrieved', user);
});

export const getCurrentMasterUser = asyncHandler(async (req, res) => {
  if (!req.user) throw new AuthenticationError('Not authenticated');
  
  const masterConn = await getMasterConnection();
  const MasterUser = masterConn.model('MasterUser', MasterUserModel.schema);
  const masterUser = await MasterUser.findById(req.user.sub).lean();
  
  if (!masterUser) throw new AppError('Master user not found', 404);
  
  return successResponse(res, 200, 'Master user retrieved', {
    _id: masterUser._id,
    username: masterUser.email?.split('@')[0] || 'superadmin',
    email: masterUser.email,
    name: masterUser.name,
    role: 'superadmin',
    active: true,
  });
});

export const changePassword = asyncHandler(async (req, res) => {
  const authService = new AuthService(req.models.User, req.models.ActivityLog);
  const { currentPassword, newPassword } = req.body;
  await authService.changePassword(req.user.sub, req.tenantId, currentPassword, newPassword);
  return successResponse(res, 200, 'Password changed successfully');
});
