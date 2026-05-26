import { AuthorizationError } from '../../../shared/errors/AuthorizationError.js';

// Role hierarchy: superadmin > admin > editor > viewer
const roleHierarchy = {
  superadmin: ['superadmin', 'admin', 'editor', 'viewer'],
  admin: ['admin', 'editor', 'viewer'],
  editor: ['editor', 'viewer'],
  viewer: ['viewer'],
};

/**
 * Middleware factory to check if current user has required role.
 * @param {...string} allowedRoles - List of roles allowed to access the route.
 * @returns {Function} Express middleware
 */
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new AuthorizationError('Authentication required');
    }

    const userRole = req.user.role;
    const hasAccess = allowedRoles.some(role => roleHierarchy[userRole]?.includes(role));

    if (!hasAccess) {
      throw new AuthorizationError(`Insufficient permissions. Required: ${allowedRoles.join(', ')}`);
    }

    next();
  };
};

/**
 * Check if user can access a specific tenant.
 * Superadmin can access any tenant; normal users only their own.
 */
export const authorizeTenantAccess = (req, res, next) => {
  if (!req.user) {
    throw new AuthorizationError('Authentication required');
  }

  if (req.user.role === 'superadmin') {
    return next(); // superadmin can bypass tenant check
  }

  if (!req.tenantId) {
    throw new AuthorizationError('Tenant context missing');
  }

  if (req.user.tenantId !== req.tenantId) {
    throw new AuthorizationError('Access denied to this tenant');
  }

  next();
};

/**
 * Check if user is the resource owner (e.g., updating own profile).
 * @param {Function} getResourceOwnerId - async function that returns owner ID from resource ID
 */
export const authorizeResourceOwner = (getResourceOwnerId) => {
  return async (req, res, next) => {
    if (!req.user) {
      throw new AuthorizationError('Authentication required');
    }

    // Admins and superadmins can bypass
    if (req.user.role === 'admin' || req.user.role === 'superadmin') {
      return next();
    }

    const ownerId = await getResourceOwnerId(req.params.id, req.tenantId);
    if (ownerId && ownerId.toString() !== req.user.sub) {
      throw new AuthorizationError('You do not own this resource');
    }

    next();
  };
};

/**
 * Simple permission check function (not middleware) for service layer.
 */
export const hasRole = (user, allowedRoles) => {
  if (!user) return false;
  const userRole = user.role;
  return allowedRoles.some(role => roleHierarchy[userRole]?.includes(role));
};

/**
 * Ensure user belongs to tenant (service layer).
 */
export const belongsToTenant = (user, tenantId) => {
  if (user.role === 'superadmin') return true;
  return user.tenantId === tenantId;
};