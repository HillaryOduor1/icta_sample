import { ContactRepository } from '../repositories/contact.repository.js';
import { ContactMessageDTO } from '../dtos/request/contactMessage.dto.js';
import { emailService } from '../../../infrastructure/email/email.service.js';
import { AppError } from '../../../shared/errors/AppError.js';

export class ContactService {
  constructor(contactModel) {
    if (!contactModel) {
      throw new Error('ContactModel is required');
    }
    this.repository = new ContactRepository(contactModel);
  }

  async submitMessage(data, tenantId, tenant) {
    const dto = new ContactMessageDTO(data);
    dto.validate();
    const message = await this.repository.create({ ...dto, tenantId, status: 'unread' });

    if (tenant.contactEmail) {
      emailService.sendContactNotification(tenant.contactEmail, tenant.name, dto).catch(console.error);
    }
    emailService.sendAutoReply(dto.email, dto.name, tenant.name, dto.message).catch(console.error);

    return message;
  }

  async getMessages(tenantId, filter, pagination) {
    return this.repository.findByTenantWithPagination(tenantId, { ...pagination, filter });
  }

  async markAsRead(id, tenantId) {
    const message = await this.repository.markAsRead(id, tenantId);
    if (!message) throw new AppError('Message not found', 404);
    return message;
  }

  async deleteMessage(id, tenantId) {
    const deleted = await this.repository.delete(id, tenantId);
    if (!deleted) throw new AppError('Message not found', 404);
  }
}
/*import { ContactRepository } from '../repositories/contact.repository.js';
import { ContactMessageDTO } from '../dtos/request/contactMessage.dto.js';
import { emailService } from '../../../infrastructure/email/email.service.js';
import { AppError } from '../../../shared/errors/AppError.js';

const contactRepo = new ContactRepository();

export class ContactService {
  async submitMessage(data, tenantId, tenant) {
    const dto = new ContactMessageDTO(data);
    dto.validate();
    const message = await contactRepo.create({ ...dto, tenantId, status: 'unread' });

    // Send notification emails asynchronously (use BullMQ in production)
    if (tenant.contactEmail) {
      emailService.sendContactNotification(tenant.contactEmail, tenant.name, dto).catch(console.error);
    }
    emailService.sendAutoReply(dto.email, dto.name, tenant.name, dto.message).catch(console.error);

    return message;
  }

  async getMessages(tenantId, filter, pagination) {
    return contactRepo.findByTenantWithPagination(tenantId, { ...pagination, filter });
  }

  async markAsRead(id, tenantId) {
    const message = await contactRepo.markAsRead(id, tenantId);
    if (!message) throw new AppError('Message not found', 404);
    return message;
  }

  async deleteMessage(id, tenantId) {
    const deleted = await contactRepo.delete(id, tenantId);
    if (!deleted) throw new AppError('Message not found', 404);
  }
}*/