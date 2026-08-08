import { ContactService } from '../services/contact.service.js';
import { ContactTransformer } from '../transformers/contact.transformer.js';
import { asyncHandler } from '../../../shared/utils/asyncHandler.js';
import { successResponse } from '../../../shared/utils/response.util.js';

export const submitContact = asyncHandler(async (req, res) => {
  const contactService = new ContactService(req.models.ContactMessage);
  const message = await contactService.submitMessage(req.body, req.tenantId, req.tenant);
  return successResponse(res, 201, 'Message sent', ContactTransformer.toResponse(message));
});

export const getMessages = asyncHandler(async (req, res) => {
  const contactService = new ContactService(req.models.ContactMessage);
  const { page = 1, limit = 20, status } = req.query;
  const pagination = { page: parseInt(page), limit: parseInt(limit) };
  const filter = {};
  if (status) filter.status = status;
  const result = await contactService.getMessages(req.tenantId, filter, pagination);
  const response = ContactTransformer.toPaginatedResponse(result.messages, pagination, result.total, req);
  return successResponse(res, 200, 'Messages retrieved', response.data, response.meta, response.links);
});

export const markAsRead = asyncHandler(async (req, res) => {
  const contactService = new ContactService(req.models.ContactMessage);
  const message = await contactService.markAsRead(req.params.id, req.tenantId);
  return successResponse(res, 200, 'Message marked as read', ContactTransformer.toResponse(message));
});

export const deleteMessage = asyncHandler(async (req, res) => {
  const contactService = new ContactService(req.models.ContactMessage);
  await contactService.deleteMessage(req.params.id, req.tenantId);
  return successResponse(res, 204, 'Message deleted');
});
