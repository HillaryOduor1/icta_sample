import { Queue, Worker } from 'bullmq';
import { bullRedisClient } from './redis.js';

export const emailQueue = new Queue('email', { connection: bullRedisClient });
export const emailWorker = new Worker('email', async (job) => {
  // processing logic
}, { connection: bullRedisClient });