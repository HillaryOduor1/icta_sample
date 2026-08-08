import { UserService } from '../services/user.service.js';
import { asyncHandler } from '../../../shared/utils/asyncHandler.js';
import { successResponse } from '../../../shared/utils/response.util.js';
import { UserTransformer } from '../transformers/user.transformer.js';
import { AppError } from '../../../shared/errors/AppError.js';

export const getUsers = asyncHandler(async (req, res) => {
  const userService = new UserService(req.models.User, req.models.PendingUser, req.models.ActivityLog);
  const { page = 1, limit = 20, sort = '-createdAt', filter = {} } = req.query;
  const result = await userService.getUsers(req.tenantId, { page: parseInt(page), limit: parseInt(limit), sort, filter: JSON.parse(filter) });
  return successResponse(res, 200, 'Users retrieved', UserTransformer.toPaginatedResponse(result.users, { page, limit }, result.total, req));
});

export const getUserById = asyncHandler(async (req, res) => {
  const userService = new UserService(req.models.User, req.models.PendingUser, req.models.ActivityLog);
  const user = await userService.getUserById(req.params.id, req.tenantId);
  return successResponse(res, 200, 'User retrieved', UserTransformer.toResponse(user));
});

// Public registration - no auth required
export const register = asyncHandler(async (req, res) => {
  // Pass ActivityLog model as third parameter (can be null for registration)
  const userService = new UserService(req.models.User, req.models.PendingUser, req.models.ActivityLog);
  const result = await userService.register(req.body, req.tenantId, {
    ip: req.ip,
    userAgent: req.headers['user-agent']
  });
  return successResponse(res, 201, 'Registration request submitted', result);
});

// Admin only - get pending registrations
export const getPendingRegistrations = asyncHandler(async (req, res) => {
  const userService = new UserService(req.models.User, req.models.PendingUser, req.models.ActivityLog);
  const { page = 1, limit = 20 } = req.query;
  const result = await userService.getPendingRegistrations(req.tenantId, parseInt(page), parseInt(limit));
  return successResponse(res, 200, 'Pending registrations retrieved', {
    users: result.users,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: result.total,
      pages: Math.ceil(result.total / limit)
    }
  });
});

// Admin only - approve user
export const approveUser = asyncHandler(async (req, res) => {
  const userService = new UserService(req.models.User, req.models.PendingUser, req.models.ActivityLog);
  const result = await userService.approveUser(req.params.id, req.tenantId, req.user.sub);
  return successResponse(res, 200, 'User approved', result);
});

// Admin only - reject user
export const rejectUser = asyncHandler(async (req, res) => {
  const userService = new UserService(req.models.User, req.models.PendingUser, req.models.ActivityLog);
  const { reason } = req.body;
  if (!reason) {
    throw new AppError('Rejection reason is required', 400);
  }
  const result = await userService.rejectUser(req.params.id, req.tenantId, req.user.sub, reason);
  return successResponse(res, 200, 'User rejected', result);
});

export const createUser = asyncHandler(async (req, res) => {
  const userService = new UserService(req.models.User, req.models.PendingUser, req.models.ActivityLog);
  const user = await userService.createUser({ ...req.body, tenantId: req.tenantId });
  return successResponse(res, 201, 'User created', UserTransformer.toResponse(user));
});

export const updateUser = asyncHandler(async (req, res) => {
  const userService = new UserService(req.models.User, req.models.PendingUser, req.models.ActivityLog);
  const user = await userService.updateUser(req.params.id, req.tenantId, req.body);
  return successResponse(res, 200, 'User updated', UserTransformer.toResponse(user));
});

export const deleteUser = asyncHandler(async (req, res) => {
  const userService = new UserService(req.models.User, req.models.PendingUser, req.models.ActivityLog);
  await userService.deleteUser(req.params.id, req.tenantId);
  return successResponse(res, 204, 'User deleted');
});

export const toggleUserStatus = asyncHandler(async (req, res) => {
  const userService = new UserService(req.models.User, req.models.PendingUser, req.models.ActivityLog);
  const user = await userService.toggleStatus(req.params.id, req.tenantId);
  return successResponse(res, 200, 'User status toggled', UserTransformer.toResponse(user));
});
