import { AppError } from './AppError.js';

export class ValidationError extends AppError {
  constructor(message, details = null) {
    super(message, 422, true, details);
  }
}