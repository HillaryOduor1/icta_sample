import { AuthorizationError } from '../../../shared/errors/AuthorizationError.js';

/**
 * Ensures the request has a valid tenant context.
 * Should be used after tenant middleware.
 */
export const requireTenant = (req, res, next) => {
  if (!req.tenantId) {
    throw new AuthorizationError('Tenant context is required for this operation');
  }
  next();
};

/**
 * Optional: restrict access to specific tenants based on user's allowed tenants list.
 * Useful for multi-tenant users who may have access to multiple tenants.
 */
export const restrictToTenants = (allowedTenantIds) => {
  return (req, res, next) => {
    if (!req.tenantId) {
      throw new AuthorizationError('Tenant context missing');
    }
    if (!allowedTenantIds.includes(req.tenantId) && req.user.role !== 'superadmin') {
      throw new AuthorizationError('Access denied to this tenant');
    }
    next();
  };
};