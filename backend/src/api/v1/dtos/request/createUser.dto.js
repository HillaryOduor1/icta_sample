import { ValidationError } from '../../../../shared/errors/ValidationError.js';

export class CreateUserDTO {
  constructor(body) {
    this.username = body.username;
    this.email = body.email;
    this.password = body.password;
    this.role = body.role || 'viewer';
    this.active = body.active !== undefined ? body.active : true;
    this.tenantId = body.tenantId; // set by tenant middleware
  }

  validate() {
    if (!this.username || this.username.length < 3) {
      throw new ValidationError('Username must be at least 3 characters');
    }
    if (!this.email || !/^\S+@\S+\.\S+$/.test(this.email)) {
      throw new ValidationError('Invalid email address');
    }
    if (this.password && this.password.length < 12) {
      throw new ValidationError('Password must be at least 12 characters');
    }
    if (!this.tenantId) {
      throw new ValidationError('Tenant ID is required');
    }
  }
}