import { NotFoundError } from '../shared/errors/NotFoundError.js';

export const notFoundHandler = (req, res, next) => {
  next(new NotFoundError(`Route ${req.method} ${req.url} not found`));
};