import Redis from 'ioredis';
import { config } from './env.js';

// Parse Redis URL
const redisUrl = config.redisUrl;
const isTls = redisUrl.startsWith('rediss://');

// Main Redis client for caching, rate limiting, sessions
export const redisClient = new Redis(redisUrl, {
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  lazyConnect: false,
  retryStrategy: (times) => Math.min(times * 50, 2000),
  // For Upstash (TLS), we must pass an empty tls object to enable it
  ...(isTls && { tls: {} }),
});

// BullMQ requires maxRetriesPerRequest = null for blocking commands
export const bullRedisClient = new Redis(redisUrl, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  lazyConnect: true,
  retryStrategy: (times) => Math.min(times * 50, 2000),
  ...(isTls && { tls: {} }),
});

redisClient.on('connect', () => console.log('✅ Redis connected (main)'));
bullRedisClient.on('connect', () => console.log('✅ Redis connected (BullMQ)'));
redisClient.on('error', (err) => console.error('❌ Redis error (main):', err));
bullRedisClient.on('error', (err) => console.error('❌ Redis error (BullMQ):', err));
/*
import Redis from 'ioredis';
import { config } from './env.js';

// Main Redis client for caching, rate limiting, sessions
export const redisClient = new Redis(config.redisUrl, {
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  lazyConnect: false,
  retryStrategy: (times) => Math.min(times * 50, 2000),
});

// BullMQ requires maxRetriesPerRequest = null for blocking commands
export const bullRedisClient = new Redis(config.redisUrl, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  lazyConnect: true,
  retryStrategy: (times) => Math.min(times * 50, 2000),
});

redisClient.on('connect', () => console.log('✅ Redis connected (main)'));
bullRedisClient.on('connect', () => console.log('✅ Redis connected (BullMQ)'));
redisClient.on('error', (err) => console.error('❌ Redis error (main):', err));
bullRedisClient.on('error', (err) => console.error('❌ Redis error (BullMQ):', err));*/