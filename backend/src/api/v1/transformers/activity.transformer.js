export class ActivityTransformer {
  static toResponse(log) {
    if (!log) return null;
    return {
      id: log._id.toString(),
      action: log.action,
      label: log.label,
      detail: log.detail,
      user: log.user,
      userId: log.userId,
      timestamp: log.timestamp?.toISOString(),
      metadata: log.metadata,
      _links: {
        self: `/api/v1/activity/${log._id}`,
      },
    };
  }

  static toPaginatedResponse(logs, pagination, total, req) {
    const data = logs.map(l => this.toResponse(l));
    const baseUrl = `${req.baseUrl}${req.path}`;
    return {
      data,
      meta: {
        page: pagination.page,
        limit: pagination.limit,
        totalItems: total,
        totalPages: Math.ceil(total / pagination.limit),
        hasNextPage: pagination.page * pagination.limit < total,
        hasPrevPage: pagination.page > 1,
      },
      links: {
        self: `${baseUrl}?page=${pagination.page}&limit=${pagination.limit}`,
        next: pagination.page * pagination.limit < total ? `${baseUrl}?page=${pagination.page + 1}&limit=${pagination.limit}` : null,
        prev: pagination.page > 1 ? `${baseUrl}?page=${pagination.page - 1}&limit=${pagination.limit}` : null,
      },
    };
  }
}