export class PaginatedResponseDTO {
  constructor(data, pagination, total, baseUrl) {
    this.data = data;
    this.meta = {
      page: pagination.page,
      limit: pagination.limit,
      totalItems: total,
      totalPages: Math.ceil(total / pagination.limit),
      hasNextPage: pagination.page * pagination.limit < total,
      hasPrevPage: pagination.page > 1,
    };
    this.links = {
      self: `${baseUrl}?page=${pagination.page}&limit=${pagination.limit}`,
      next: pagination.page * pagination.limit < total ? `${baseUrl}?page=${pagination.page + 1}&limit=${pagination.limit}` : null,
      prev: pagination.page > 1 ? `${baseUrl}?page=${pagination.page - 1}&limit=${pagination.limit}` : null,
    };
  }
}