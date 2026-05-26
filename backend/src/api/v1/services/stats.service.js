import { StatsRepository } from '../repositories/stats.repository.js';

const statsRepo = new StatsRepository();

export class StatsService {
  async getAdminStats(tenantId) {
    return statsRepo.getAdminStats(tenantId);
  }
}