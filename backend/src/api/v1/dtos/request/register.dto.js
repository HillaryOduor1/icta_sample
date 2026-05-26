import { ValidationError } from '../../../../shared/errors/ValidationError.js';

export class RegisterRequestDTO {
  constructor(data) {
    this.username = data.username;
    this.email = data.email;
    this.password = data.password;
    this.role = data.role || 'viewer';
  }

  validate() {
    if (!this.username || this.username.length < 3) {
      throw new ValidationError('Username must be at least 3 characters');
    }
    if (!this.email || !this.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      throw new ValidationError('Valid email is required');
    }
    if (!this.password || this.password.length < 8) {
      throw new ValidationError('Password must be at least 8 characters');
    }
    if (this.role && !['admin', 'editor', 'viewer'].includes(this.role)) {
      throw new ValidationError('Invalid role');
    }
    return true;
  }
}

export class ApproveUserDTO {
  constructor(data) {
    this.userId = data.userId;
    action = data.action; // 'approve' or 'reject'
    this.rejectionReason = data.rejectionReason;
  }

  validate() {
    if (!this.userId) {
      throw new ValidationError('User ID is required');
    }
    if (this.action === 'reject' && !this.rejectionReason) {
      throw new ValidationError('Rejection reason is required');
    }
    return true;
  }
}