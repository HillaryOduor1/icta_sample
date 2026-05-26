import { Worker } from 'bullmq';
import { bullRedisClient } from '../../config/redis.js';
import { emailService } from '../email/email.service.js';
import { logger } from '../../config/logger.js';

export const emailWorker = new Worker('email', async (job) => {
  const { to, subject, html, from } = job.data;
  await emailService.sendRaw(to, subject, html, from);
}, { connection: bullRedisClient });

emailWorker.on('completed', (job) => logger.info(`Email job ${job.id} completed`));
emailWorker.on('failed', (job, err) => logger.error({ err }, `Email job ${job.id} failed`));