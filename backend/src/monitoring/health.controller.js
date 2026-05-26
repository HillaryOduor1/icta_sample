import mongoose from 'mongoose';
import { redisClient } from '../config/redis.js';

export const healthController = {
  liveness: (req, res) => res.status(200).json({ status: 'alive', timestamp: new Date().toISOString() }),

  readiness: async (req, res) => {
    const checks = {
      database: mongoose.connection.readyState === 1,
      redis: redisClient?.status === 'ready',
    };
    const allReady = Object.values(checks).every(Boolean);
    res.status(allReady ? 200 : 503).json({ ready: allReady, checks });
  },

  startup: (req, res) => res.status(200).json({ status: 'started' }),
};