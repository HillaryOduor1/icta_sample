export const successResponse = (res, statusCode, message, data = null, meta = null, links = null) => {
  const response = {
    success: true,
    message,
    requestId: res.req?.id,   // use res.req to access request object
    timestamp: new Date().toISOString(),
  };
  if (data !== null) response.data = data;
  if (meta) response.meta = meta;
  if (links) response.links = links;
  return res.status(statusCode).json(response);
};

export const errorResponse = (res, statusCode, message, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
    requestId: res.req?.id,
    timestamp: new Date().toISOString(),
  });
};
/*export const successResponse = (res, statusCode, message, data = null, meta = null, links = null) => {
  const response = {
    success: true,
    message,
    requestId: req.id,
    timestamp: new Date().toISOString(),
  };
  if (data !== null) response.data = data;
  if (meta) response.meta = meta;
  if (links) response.links = links;
  return res.status(statusCode).json(response);
};

export const errorResponse = (res, statusCode, message, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
    requestId: req.id,
    timestamp: new Date().toISOString(),
  });
};*/