export class MediaTransformer {
  static toResponse(media) {
    if (!media) return null;
    return {
      id: media._id.toString(),
      filename: media.filename,
      originalName: media.originalName,
      mimeType: media.mimeType,
      size: media.size,
      url: media.url,
      metadata: media.metadata,
      uploadedBy: media.uploadedBy,
      createdAt: media.createdAt?.toISOString(),
      _links: {
        self: `/api/v1/media/${media._id}`,
        delete: { href: `/api/v1/media/${media._id}`, method: 'DELETE' },
      },
    };
  }

  static toPaginatedResponse(media, pagination, total, req) {
    const data = media.map(m => this.toResponse(m));
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