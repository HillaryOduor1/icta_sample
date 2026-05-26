import { ValidationError } from '../../../../shared/errors/ValidationError.js';

export class UpdateUserDTO {
  constructor(body) {
    this.username = body.username;
    this.email = body.email;
    this.password = body.password;
    this.role = body.role;
    this.active = body.active;
  }

  validate() {
    if (this.username && this.username.length < 3) {
      throw new ValidationError('Username must be at least 3 characters');
    }
    if (this.email && !/^\S+@\S+\.\S+$/.test(this.email)) {
      throw new ValidationError('Invalid email address');
    }
    if (this.password && this.password.length < 12) {
      throw new ValidationError('Password must be at least 12 characters');
    }
    if (this.role && !['admin', 'editor', 'viewer'].includes(this.role)) {
      throw new ValidationError('Invalid role');
    }
  }
}