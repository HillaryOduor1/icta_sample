import { ValidationError } from '../../../../shared/errors/ValidationError.js';

export class LoginRequestDTO {
  constructor(body) {
    this.email = body.email || body.username;
    this.password = body.password;
  }

  validate() {
    if (!this.email) throw new ValidationError('Email or username is required');
    if (!this.password) throw new ValidationError('Password is required');
  }
}