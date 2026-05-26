import { ValidationError } from '../../../../shared/errors/ValidationError.js';

export class ContactMessageDTO {
  constructor(body) {
    this.name = body.name?.trim();
    this.email = body.email?.trim().toLowerCase();
    this.message = body.message?.trim();
  }

  validate() {
    if (!this.name || this.name.length < 2 || this.name.length > 100) {
      throw new ValidationError('Name must be 2-100 characters');
    }
    if (!this.email || !/^\S+@\S+\.\S+$/.test(this.email)) {
      throw new ValidationError('Valid email is required');
    }
    if (!this.message || this.message.length < 5 || this.message.length > 2000) {
      throw new ValidationError('Message must be 5-2000 characters');
    }
  }
}