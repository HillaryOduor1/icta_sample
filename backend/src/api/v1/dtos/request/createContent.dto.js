import { ValidationError } from '../../../../shared/errors/ValidationError.js';

export class CreateContentDTO {
  constructor(body) {
    this.page = body.page;
    this.data = { ...body }; // entire content object
    this.published = body.published !== undefined ? body.published : true;
  }

  validate() {
    if (!this.page) {
      throw new ValidationError('Page name is required');
    }
    if (!['home', 'about', 'research', 'contact'].includes(this.page)) {
      throw new ValidationError('Invalid page name');
    }
  }
}