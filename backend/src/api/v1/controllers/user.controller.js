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
/*import { UserService } from '../services/user.service.js';
import { asyncHandler } from '../../../shared/utils/asyncHandler.js';
import { successResponse } from '../../../shared/utils/response.util.js';
import { UserTransformer } from '../transformers/user.transformer.js';
import { AppError } from '../../../shared/errors/AppError.js';

// Helper function to get UserService instance
const getUserService = (req) => {
  return new UserService(
    req.models.User, 
    req.models.PendingUser,
    req.models.ActivityLog  // Pass ActivityLog model
  );
};

export const getUsers = asyncHandler(async (req, res) => {
  const userService = getUserService(req);
  const { page = 1, limit = 20, sort = '-createdAt', filter = {} } = req.query;
  const result = await userService.getUsers(req.tenantId, { page: parseInt(page), limit: parseInt(limit), sort, filter: JSON.parse(filter) });
  return successResponse(res, 200, 'Users retrieved', UserTransformer.toPaginatedResponse(result.users, { page, limit }, result.total, req));
});

export const getUserById = asyncHandler(async (req, res) => {
  const userService = getUserService(req);
  const user = await userService.getUserById(req.params.id, req.tenantId);
  return successResponse(res, 200, 'User retrieved', UserTransformer.toResponse(user));
});

// Public registration - no auth required
export const register = asyncHandler(async (req, res) => {
  const userService = getUserService(req);
  const result = await userService.register(req.body, req.tenantId, {
    ip: req.ip,
    userAgent: req.headers['user-agent']
  });
  return successResponse(res, 201, 'Registration request submitted', result);
});

// Admin only - get pending registrations
export const getPendingRegistrations = asyncHandler(async (req, res) => {
  const userService = getUserService(req);
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
  const userService = getUserService(req);
  const result = await userService.approveUser(req.params.id, req.tenantId, req.user.sub);
  return successResponse(res, 200, 'User approved', result);
});

// Admin only - reject user
export const rejectUser = asyncHandler(async (req, res) => {
  const userService = getUserService(req);
  const { reason } = req.body;
  if (!reason) {
    throw new AppError('Rejection reason is required', 400);
  }
  const result = await userService.rejectUser(req.params.id, req.tenantId, req.user.sub, reason);
  return successResponse(res, 200, 'User rejected', result);
});

export const createUser = asyncHandler(async (req, res) => {
  const userService = getUserService(req);
  const user = await userService.createUser({ ...req.body, tenantId: req.tenantId });
  return successResponse(res, 201, 'User created', UserTransformer.toResponse(user));
});

export const updateUser = asyncHandler(async (req, res) => {
  const userService = getUserService(req);
  const user = await userService.updateUser(req.params.id, req.tenantId, req.body);
  return successResponse(res, 200, 'User updated', UserTransformer.toResponse(user));
});

export const deleteUser = asyncHandler(async (req, res) => {
  const userService = getUserService(req);
  await userService.deleteUser(req.params.id, req.tenantId);
  return successResponse(res, 204, 'User deleted');
});

export const toggleUserStatus = asyncHandler(async (req, res) => {
  const userService = getUserService(req);
  const user = await userService.toggleStatus(req.params.id, req.tenantId);
  return successResponse(res, 200, 'User status toggled', UserTransformer.toResponse(user));
});*/


/*import { UserService } from '../services/user.service.js';
import { asyncHandler } from '../../../shared/utils/asyncHandler.js';
import { successResponse } from '../../../shared/utils/response.util.js';
import { UserTransformer } from '../transformers/user.transformer.js';

export const getUsers = asyncHandler(async (req, res) => {
  const userService = new UserService(req.models.User, req.models.PendingUser);
  const { page = 1, limit = 20, sort = '-createdAt', filter = {} } = req.query;
  const result = await userService.getUsers(req.tenantId, { page: parseInt(page), limit: parseInt(limit), sort, filter: JSON.parse(filter) });
  return successResponse(res, 200, 'Users retrieved', UserTransformer.toPaginatedResponse(result.users, { page, limit }, result.total, req));
});

export const getUserById = asyncHandler(async (req, res) => {
  const userService = new UserService(req.models.User, req.models.PendingUser);
  const user = await userService.getUserById(req.params.id, req.tenantId);
  return successResponse(res, 200, 'User retrieved', UserTransformer.toResponse(user));
});

// Public registration - no auth required
export const register = asyncHandler(async (req, res) => {
  const userService = new UserService(req.models.User, req.models.PendingUser);
  const result = await userService.register(req.body, req.tenantId, {
    ip: req.ip,
    userAgent: req.headers['user-agent']
  });
  return successResponse(res, 201, 'Registration request submitted', result);
});

// Admin only - get pending registrations
export const getPendingRegistrations = asyncHandler(async (req, res) => {
  const userService = new UserService(req.models.User, req.models.PendingUser);
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
  const userService = new UserService(req.models.User, req.models.PendingUser);
  const result = await userService.approveUser(req.params.id, req.tenantId, req.user.sub);
  return successResponse(res, 200, 'User approved', result);
});

// Admin only - reject user
export const rejectUser = asyncHandler(async (req, res) => {
  const userService = new UserService(req.models.User, req.models.PendingUser);
  const { reason } = req.body;
  if (!reason) {
    throw new AppError('Rejection reason is required', 400);
  }
  const result = await userService.rejectUser(req.params.id, req.tenantId, req.user.sub, reason);
  return successResponse(res, 200, 'User rejected', result);
});

export const createUser = asyncHandler(async (req, res) => {
  const userService = new UserService(req.models.User, req.models.PendingUser);
  const user = await userService.createUser({ ...req.body, tenantId: req.tenantId });
  return successResponse(res, 201, 'User created', UserTransformer.toResponse(user));
});

export const updateUser = asyncHandler(async (req, res) => {
  const userService = new UserService(req.models.User, req.models.PendingUser);
  const user = await userService.updateUser(req.params.id, req.tenantId, req.body);
  return successResponse(res, 200, 'User updated', UserTransformer.toResponse(user));
});

export const deleteUser = asyncHandler(async (req, res) => {
  const userService = new UserService(req.models.User, req.models.PendingUser);
  await userService.deleteUser(req.params.id, req.tenantId);
  return successResponse(res, 204, 'User deleted');
});

export const toggleUserStatus = asyncHandler(async (req, res) => {
  const userService = new UserService(req.models.User, req.models.PendingUser);
  const user = await userService.toggleStatus(req.params.id, req.tenantId);
  return successResponse(res, 200, 'User status toggled', UserTransformer.toResponse(user));
});*/
/*import { UserService } from '../services/user.service.js';
import { UserTransformer } from '../transformers/user.transformer.js';
import { asyncHandler } from '../../../shared/utils/asyncHandler.js';
import { successResponse } from '../../../shared/utils/response.util.js';

export const getUsers = asyncHandler(async (req, res) => {
  const userService = new UserService(req.models.User);
  const { page = 1, limit = 20, sort = '-createdAt', ...filter } = req.query;
  const pagination = { page: parseInt(page), limit: parseInt(limit), sort, filter };
  const result = await userService.getUsers(req.tenantId, pagination);
  const response = UserTransformer.toPaginatedResponse(result.users, pagination, result.total, req);
  return successResponse(res, 200, 'Users retrieved successfully', response.data, response.meta, response.links);
});

export const getUserById = asyncHandler(async (req, res) => {
  const userService = new UserService(req.models.User);
  const user = await userService.getUserById(req.params.id, req.tenantId);
  return successResponse(res, 200, 'User retrieved', UserTransformer.toResponse(user));
});

export const createUser = asyncHandler(async (req, res) => {
  const userService = new UserService(req.models.User);
  const userData = { ...req.body, tenantId: req.tenantId };
  const user = await userService.createUser(userData);
  return successResponse(res, 201, 'User created', UserTransformer.toResponse(user));
});

export const updateUser = asyncHandler(async (req, res) => {
  const userService = new UserService(req.models.User);
  const updated = await userService.updateUser(req.params.id, req.tenantId, req.body);
  return successResponse(res, 200, 'User updated', UserTransformer.toResponse(updated));
});

export const deleteUser = asyncHandler(async (req, res) => {
  const userService = new UserService(req.models.User);
  await userService.deleteUser(req.params.id, req.tenantId);
  return successResponse(res, 204, 'User deleted');
});

export const toggleUserStatus = asyncHandler(async (req, res) => {
  const userService = new UserService(req.models.User);
  const user = await userService.toggleStatus(req.params.id, req.tenantId);
  return successResponse(res, 200, 'User status toggled', UserTransformer.toResponse(user));
});*/


/*import { UserService } from '../services/user.service.js';
import { UserTransformer } from '../transformers/user.transformer.js';
import { asyncHandler } from '../../../shared/utils/asyncHandler.js';
import { successResponse } from '../../../shared/utils/response.util.js';

const userService = new UserService();

export const getUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, sort = '-createdAt', ...filter } = req.query;
  const pagination = { page: parseInt(page), limit: parseInt(limit), sort, filter };
  const result = await userService.getUsers(req.tenantId, pagination);
  const response = UserTransformer.toPaginatedResponse(result.users, pagination, result.total, req);
  return successResponse(res, 200, 'Users retrieved successfully', response.data, response.meta, response.links);
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id, req.tenantId);
  return successResponse(res, 200, 'User retrieved', UserTransformer.toResponse(user));
});

export const createUser = asyncHandler(async (req, res) => {
  const userData = { ...req.body, tenantId: req.tenantId };
  const user = await userService.createUser(userData);
  return successResponse(res, 201, 'User created', UserTransformer.toResponse(user));
});

export const updateUser = asyncHandler(async (req, res) => {
  const updated = await userService.updateUser(req.params.id, req.tenantId, req.body);
  return successResponse(res, 200, 'User updated', UserTransformer.toResponse(updated));
});

export const deleteUser = asyncHandler(async (req, res) => {
  await userService.deleteUser(req.params.id, req.tenantId);
  return successResponse(res, 204, 'User deleted');
});

export const toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await userService.toggleStatus(req.params.id, req.tenantId);
  return successResponse(res, 200, 'User status toggled', UserTransformer.toResponse(user));
});*/
/*last stable version 
// controllers/userController.js
const bcrypt = require('bcryptjs');

exports.getAllUsers = async (req, res) => {
  console.log('👥 [Users] GET all');

  try {
    const User = req.models.User;
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error('❌ Users error:', error.stack);
    res.status(500).json({ error: error.message });
  }
};

exports.createUser = async (req, res) => {
  console.log('👥 [Users] CREATE');

  try {
    const User = req.models.User;
    const ActivityLog = req.models.ActivityLog;
    const { username, email, password, role, active = true } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
      active
    });

    // Log activity
    await ActivityLog.create({
      action: 'user_create',
      label: `Created user ${username}`,
      user: req.user?.username
    });

    // Return user without password
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error('❌ Create user error:', error.stack);
    res.status(500).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  console.log(`👥 [Users] UPDATE: ${req.params.id}`);

  try {
    const User = req.models.User;
    const ActivityLog = req.models.ActivityLog;
    const { id } = req.params;
    const { username, email, role, active, password } = req.body;

    // Find user
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update fields
    if (username) user.username = username;
    if (email) user.email = email;
    if (role) user.role = role;
    if (active !== undefined) user.active = active;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    // Log activity
    await ActivityLog.create({
      action: 'user_update',
      label: `Updated user ${user.username}`,
      user: req.user?.username
    });

    // Return user without password
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('❌ Update user error:', error.stack);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  console.log(`👥 [Users] DELETE: ${req.params.id}`);

  try {
    const User = req.models.User;
    const ActivityLog = req.models.ActivityLog;
    const { id } = req.params;

    // Prevent deleting yourself
    if (req.user && req.user.id === id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Log activity
    await ActivityLog.create({
      action: 'user_delete',
      label: `Deleted user ${user.username}`,
      user: req.user?.username
    });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('❌ Delete user error:', error.stack);
    res.status(500).json({ error: error.message });
  }
};

exports.toggleUserStatus = async (req, res) => {
  console.log(`👥 [Users] TOGGLE STATUS: ${req.params.id}`);

  try {
    const User = req.models.User;
    const ActivityLog = req.models.ActivityLog;
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Prevent disabling yourself
    if (req.user && req.user.id === id) {
      return res.status(400).json({ error: 'Cannot change your own status' });
    }

    user.active = !user.active;
    await user.save();

    // Log activity
    await ActivityLog.create({
      action: 'user_toggle_status',
      label: `${user.active ? 'Enabled' : 'Disabled'} user ${user.username}`,
      user: req.user?.username,
      userId: req.user?.id
    });

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('❌ Toggle user status error:', error.stack);
    res.status(500).json({ error: error.message });
  }
};*/
/*exports.getAllUsers = async (req, res) => {
  console.log('👥 [Users] GET');

  try {
    const User = req.models.User;

    const users = await User.find().select('-password');

    res.json(users);

  } catch (error) {
    console.error('❌ Users error:', error.stack);
    res.status(500).json({ error: error.message });
  }
};*/
/*const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create user
exports.createUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        error: 'User with this email or username already exists' 
      });
    }
    
    const user = await User.create({
      username,
      email,
      password,
      role: role || 'viewer',
      active: true
    });

    await ActivityLog.create({
      action: 'user_create',
      label: 'New user created',
      detail: `User ${username} created with role ${role}`,
      user: req.user?.username || 'system',
      userId: req.user?.id
    });
    
    res.status(201).json(user.toJSON());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Don't allow password update through this endpoint
    delete updates.password;
    
    const user = await User.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await ActivityLog.create({
      action: 'user_update',
      label: 'User updated',
      detail: `User ${user.username} updated`,
      user: req.user?.username || 'system',
      userId: req.user?.id
    });
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await ActivityLog.create({
      action: 'user_delete',
      label: 'User deleted',
      detail: `User ${user.username} deleted`,
      user: req.user?.username || 'system',
      userId: req.user?.id
    });
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Toggle user active status
exports.toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    user.active = !user.active;
    await user.save();

    await ActivityLog.create({
      action: 'user_update',
      label: `User ${user.active ? 'activated' : 'deactivated'}`,
      detail: `User ${user.username} ${user.active ? 'activated' : 'deactivated'}`,
      user: req.user?.username || 'system',
      userId: req.user?.id
    });
    
    res.json(user.toJSON());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};*/