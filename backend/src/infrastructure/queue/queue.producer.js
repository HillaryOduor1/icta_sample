import { Queue } from 'bullmq';
import { bullRedisClient } from '../../config/redis.js';

export const emailQueue = new Queue('email', { connection: bullRedisClient });
export const analyticsQueue = new Queue('analytics', { connection: bullRedisClient });

export const addEmailJob = async (to, subject, html, from = null) => {
  await emailQueue.add('send-email', { to, subject, html, from });
};

export const addAnalyticsJob = async (eventData) => {
  await analyticsQueue.add('process-event', eventData);
};