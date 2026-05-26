export class ContactTransformer {
  static toResponse(message) {
    if (!message) return null;
    return {
      id: message._id.toString(),
      name: message.name,
      email: message.email,
      message: message.message,
      status: message.status,
      createdAt: message.createdAt?.toISOString(),
      _links: {
        self: `/api/v1/contact/${message._id}`,
        markRead: { href: `/api/v1/contact/${message._id}/read`, method: 'PATCH' },
        delete: { href: `/api/v1/contact/${message._id}`, method: 'DELETE' },
      },
    };
  }

  static toPaginatedResponse(messages, pagination, total, req) {
    const data = messages.map(m => this.toResponse(m));
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