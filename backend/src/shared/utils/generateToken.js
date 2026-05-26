import jwt from 'jsonwebtoken';
import { config } from '../../config/env.js';

/**
 * Generate a JWT access token
 * @param {Object} payload - User payload (id, role, tenantId)
 * @returns {string}
 */
export const generateAccessToken = (payload) => {
  return jwt.sign(
    {
      sub: payload.id,
      role: payload.role,
      tenantId: payload.tenantId,
    },
    config.jwt.accessSecret,
    { expiresIn: config.jwt.accessExpiry, jwtid: generateId() }
  );
};

/**
 * Generate a refresh token (random string, not JWT)
 * @returns {string}
 */
export const generateRefreshTokenString = () => {
  return generateRandomString(64);
};

// Re-export generateId for convenience
import { generateId, generateRandomString } from './generateId.util.js';

/*last stable
const jwt = require('jsonwebtoken');

module.exports = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};*/