import { randomUUID } from 'crypto';

/**
 * Generate a unique ID (UUID v4)
 * @returns {string} UUID
 */
export const generateId = () => randomUUID();

/**
 * Generate a short numeric ID (for rate limiting keys, etc.)
 * @param {number} length - Number of digits (default 8)
 * @returns {string}
 */
export const generateNumericId = (length = 8) => {
  return Math.random().toString().slice(2, 2 + length);
};

/**
 * Generate a random alphanumeric string
 * @param {number} length
 * @returns {string}
 */
export const generateRandomString = (length = 32) => {
  return randomUUID().replace(/-/g, '').slice(0, length);
};