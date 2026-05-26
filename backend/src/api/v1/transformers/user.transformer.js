export class UserTransformer {
  static toResponse(user) {
    if (!user) return null;
    return {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
      active: user.active,
      avatar: user.avatar,
      preferences: user.preferences,
      lastLogin: user.lastLogin?.toISOString(),
      createdAt: user.createdAt?.toISOString(),
      updatedAt: user.updatedAt?.toISOString(),
      _links: {
        self: `/api/v1/users/${user._id}`,
        update: { href: `/api/v1/users/${user._id}`, method: 'PUT' },
        delete: { href: `/api/v1/users/${user._id}`, method: 'DELETE' },
      },
    };
  }

  static toPaginatedResponse(users, pagination, total, req) {
    const data = users.map(u => this.toResponse(u));
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