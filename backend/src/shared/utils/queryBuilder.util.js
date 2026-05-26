/**
 * Build MongoDB filter object from query parameters
 * Supports: filter[field]=value, search, range[field][gte]=x, etc.
 */
export const buildFilter = (query, allowedFields = []) => {
  const filter = {};

  // Simple equality filters: filter[field]=value
  if (query.filter && typeof query.filter === 'object') {
    for (const [field, value] of Object.entries(query.filter)) {
      if (allowedFields.length === 0 || allowedFields.includes(field)) {
        filter[field] = value;
      }
    }
  }

  // Search across multiple fields (text search)
  if (query.search) {
    const searchRegex = new RegExp(query.search, 'i');
    filter.$or = [{ name: searchRegex }, { email: searchRegex }, { username: searchRegex }];
  }

  // Range filters: range[field][gte]=x, range[field][lte]=y
  if (query.range && typeof query.range === 'object') {
    for (const [field, operators] of Object.entries(query.range)) {
      if (allowedFields.length === 0 || allowedFields.includes(field)) {
        const fieldFilter = {};
        if (operators.gte) fieldFilter.$gte = new Date(operators.gte);
        if (operators.lte) fieldFilter.$lte = new Date(operators.lte);
        if (operators.gt) fieldFilter.$gt = new Date(operators.gt);
        if (operators.lt) fieldFilter.$lt = new Date(operators.lt);
        if (Object.keys(fieldFilter).length) filter[field] = fieldFilter;
      }
    }
  }

  return filter;
};

/**
 * Build sort object from query parameter `sort`
 * Example: sort=-createdAt,username
 * Returns { createdAt: -1, username: 1 }
 */
export const buildSort = (sortParam) => {
  if (!sortParam) return { createdAt: -1 };
  const sort = {};
  const fields = sortParam.split(',');
  for (const field of fields) {
    const order = field.startsWith('-') ? -1 : 1;
    const fieldName = field.replace(/^-/, '');
    sort[fieldName] = order;
  }
  return sort;
};

/**
 * Build pagination object (page, limit, skip)
 */
export const buildPagination = (page = 1, limit = 20, maxLimit = 100) => {
  const parsedPage = Math.max(1, parseInt(page) || 1);
  const parsedLimit = Math.min(maxLimit, Math.max(1, parseInt(limit) || 20));
  const skip = (parsedPage - 1) * parsedLimit;
  return { page: parsedPage, limit: parsedLimit, skip };
};

/**
 * Build field selection (projection) from `fields` query param
 * Example: fields=name,email,role
 */
export const buildProjection = (fieldsParam) => {
  if (!fieldsParam) return {};
  const projection = {};
  const fields = fieldsParam.split(',');
  for (const field of fields) {
    projection[field] = 1;
  }
  return projection;
};