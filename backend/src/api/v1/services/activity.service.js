import { ActivityRepository } from '../repositories/activity.repository.js';

export class ActivityService {
  constructor(activityModel) {
    if (!activityModel) {
      throw new Error('ActivityModel is required');
    }
    this.repository = new ActivityRepository(activityModel);
  }

  async getLogs(tenantId, filter, pagination) {
    return this.repository.findAllWithPagination(tenantId, { ...pagination, filter });
  }

  async getStats(tenantId) {
    return this.repository.getStats(tenantId);
  }

  async clearLogs(tenantId) {
    return this.repository.clearAll(tenantId);
  }
}
/*import { ActivityRepository } from '../repositories/activity.repository.js';
import { AppError } from '../../../shared/errors/AppError.js';

const activityRepo = new ActivityRepository();

export class ActivityService {
  async getLogs(tenantId, filter, pagination) {
    return activityRepo.findAllWithPagination(tenantId, { ...pagination, filter });
  }

  async getStats(tenantId) {
    return activityRepo.getStats(tenantId);
  }

  async clearLogs(tenantId) {
    return activityRepo.clearAll(tenantId);
  }
}*/