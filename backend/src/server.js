import './monitoring/tracing.js';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { createApp } from './app.js';
import { config } from './config/env.js';
import { logger } from './config/logger.js';
import { getMasterConnection } from './config/database.js';
import { emailWorker } from './infrastructure/queue/queue.consumer.js';
import { redisClient, bullRedisClient } from './config/redis.js';
import { notFoundHandler } from './middleware/notFound.middleware.js';
import * as oauthController from './api/v1/controllers/oauth.controller.js';
import { tenantMiddleware } from './middleware/tenant.middleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const startServer = async () => {
  try {
    await getMasterConnection();
    logger.info('Connected to master database');

    await redisClient.ping();
    await bullRedisClient.ping();
    logger.info('Redis connections ready');

    const app = createApp();

    // Backward compatibility OAuth routes
    //app.get('/api/auth/google', tenantMiddleware, oauthController.googleAuth);
    //app.get('/api/auth/google/callback', oauthController.googleCallback);
    //app.get('/api/auth/master/google', oauthController.masterGoogleAuth);
    //app.get('/api/auth/master/google/callback', oauthController.masterGoogleCallback);

    const adminBuildPath = path.resolve(__dirname, '../dist/admin');
    const fs = await import('fs');
    if (fs.existsSync(adminBuildPath)) {
      app.use(express.static(adminBuildPath));
      app.get('/', (req, res) => res.sendFile(path.join(adminBuildPath, 'index.html')));
      app.use((req, res, next) => {
        if (req.path.startsWith('/api')) return next();
        if (path.extname(req.path)) return next();
        res.sendFile(path.join(adminBuildPath, 'index.html'));
      });
      logger.info('Admin dashboard static files mounted');
    } else {
      logger.warn('Admin dashboard not found – run "npm run build-admin" first');
    }

    app.use(notFoundHandler);

    const server = app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port} in ${config.env} mode`);
    });

    const shutdown = async () => {
      logger.info('Received shutdown signal, closing gracefully...');
      server.close(async () => {
        logger.info('HTTP server closed');
        if (emailWorker) await emailWorker.close();
        await redisClient.quit();
        await bullRedisClient.quit();
        await mongoose.disconnect();
        process.exit(0);
      });
      setTimeout(() => {
        logger.error('Forced shutdown');
        process.exit(1);
      }, 10000);
    };
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (err) {
    logger.error({ err }, 'Failed to start server');
    process.exit(1);
  }
};

startServer();
