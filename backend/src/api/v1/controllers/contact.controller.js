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
/*import { ContactService } from '../services/contact.service.js';
import { ContactTransformer } from '../transformers/contact.transformer.js';
import { asyncHandler } from '../../../shared/utils/asyncHandler.js';
import { successResponse } from '../../../shared/utils/response.util.js';

const contactService = new ContactService();

// Public submit
export const submitContact = asyncHandler(async (req, res) => {
  const message = await contactService.submitMessage(req.body, req.tenantId, req.tenant);
  return successResponse(res, 201, 'Message sent', ContactTransformer.toResponse(message));
});

// Admin endpoints
export const getMessages = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;
  const pagination = { page: parseInt(page), limit: parseInt(limit) };
  const filter = {};
  if (status) filter.status = status;
  const result = await contactService.getMessages(req.tenantId, filter, pagination);
  const response = ContactTransformer.toPaginatedResponse(result.messages, pagination, result.total, req);
  return successResponse(res, 200, 'Messages retrieved', response.data, response.meta, response.links);
});

export const markAsRead = asyncHandler(async (req, res) => {
  const message = await contactService.markAsRead(req.params.id, req.tenantId);
  return successResponse(res, 200, 'Message marked as read', ContactTransformer.toResponse(message));
});

export const deleteMessage = asyncHandler(async (req, res) => {
  await contactService.deleteMessage(req.params.id, req.tenantId);
  return successResponse(res, 204, 'Message deleted');
});*/

/*last stable version
const { body, validationResult } = require('express-validator');
const Tenant = require('../../models/Tenant');
const { sendContactNotification, sendAutoReply } = require('../../utils/email');

// Validation rules
const validateContact = [
  body('name').trim().isLength({ min: 2, max: 100 }).escape(),
  body('email').isEmail().normalizeEmail(),
  body('message').trim().isLength({ min: 5, max: 2000 }).escape()
];

exports.submitContact = [
  validateContact,
  async (req, res) => {
    // 1. Validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, message } = req.body;
    const tenant = req.tenant;
    const ContactMessage = req.models.ContactMessage;

    // 2. Check if model is available
    if (!ContactMessage) {
      console.error('❌ ContactMessage model not found on req.models');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    try {
      // 3. Save message to tenant database (always done)
      const contact = new ContactMessage({
        tenantId: tenant._id,
        name,
        email,
        message
      });
      await contact.save();
      console.log(`✅ Contact message saved (id: ${contact._id}) for tenant ${tenant.dbName}`);

      // 4. Get tenant document (from master DB)
      const tenantDoc = await Tenant.findById(tenant._id);
      if (!tenantDoc) {
        console.warn(`⚠️ Tenant not found in master DB for id ${tenant._id}`);
      }

      // 5. Send email to tenant's contact person (non‑blocking)
      const contactEmail = tenantDoc?.contactEmail || process.env.FALLBACK_CONTACT_EMAIL;
      if (contactEmail) {
        sendContactNotification(contactEmail, tenantDoc?.name || tenant.name, { name, email, message })
          .then(() => console.log(`✅ Notification sent to ${contactEmail}`))
          .catch(err => console.error(`❌ Failed to send notification: ${err.message}`));
      } else {
        console.warn('⚠️ No contact email configured for tenant, notification skipped');
      }

      // 6. Send auto‑reply to the user (non‑blocking)
      sendAutoReply(email, name, tenantDoc?.name || tenant.name, message)
        .then(() => console.log(`✅ Auto‑reply sent to ${email}`))
        .catch(err => console.error(`❌ Failed to send auto‑reply to ${email}: ${err.message}`));

      // 7. Respond immediately (email sending continues in background)
      res.status(201).json({ success: true, message: 'Message sent successfully' });
    } catch (err) {
      console.error('❌ Contact submission critical error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
];*/


/*const { body, validationResult } = require('express-validator');
const Tenant = require('../../models/Tenant');
const { sendContactNotification, sendAutoReply } = require('../../utils/email');

// ✅ Define validation rules
const validateContact = [
  body('name').trim().isLength({ min: 2, max: 100 }).escape(),
  body('email').isEmail().normalizeEmail(),
  body('message').trim().isLength({ min: 5, max: 2000 }).escape()
];

exports.submitContact = [
  validateContact,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, message } = req.body;
    const tenant = req.tenant;
    const ContactMessage = req.models.ContactMessage;   // ✅ from tenant middleware
    if (!ContactMessage) {
      console.error('❌ ContactMessage model not found on req.models');
      return res.status(500).json({ error: 'Server configuration error' });
    }
    try {
      // Save message in tenant database
      const contact = new ContactMessage({
        tenantId: tenant._id,
        name,
        email,
        message
      });
      await contact.save();

      // Send email to tenant's contact person
      const tenantDoc = await Tenant.findById(tenant._id);
      const contactEmail = tenantDoc?.contactEmail || process.env.FALLBACK_CONTACT_EMAIL;
      if (contactEmail) {
        await sendContactNotification(contactEmail, tenantDoc.name, { name, email, message });
      }

      // Send auto-reply to the user
      await sendAutoReply(email, name, tenantDoc.name, message);

      res.status(201).json({ success: true, message: 'Message sent successfully' });
    } catch (err) {
      console.error('Contact submission error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
];*/
/*const { body, validationResult } = require('express-validator');
const ContactMessage = require('../../models/ContactMessage');
const Tenant = require('../../models/Tenant');
//const { sendContactNotification } = require('../../utils/email');
const { sendContactNotification,sendAutoReply  } = require('../../utils/email');

// Validation rules
const validateContact = [
  body('name').trim().isLength({ min: 2, max: 100 }).escape(),
  body('email').isEmail().normalizeEmail(),
  body('message').trim().isLength({ min: 5, max: 2000 }).escape()
];

exports.submitContact = [
  validateContact,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, message } = req.body;
    const tenant = req.tenant; // set by tenantMiddleware

    try {
      // Save message
      const contact = new ContactMessage({
        tenantId: tenant._id,
        name,
        email,
        message
      });
      await contact.save();

      // Send email to tenant's contact email
      const tenantDoc = await Tenant.findById(tenant._id);
      const contactEmail = tenantDoc?.contactEmail || process.env.FALLBACK_CONTACT_EMAIL;
      if (contactEmail) {
        await sendContactNotification(contactEmail, tenantDoc.name, { name, email, message });
      }

      res.status(201).json({ success: true, message: 'Message sent successfully' });
    } catch (err) {
      console.error('Contact submission error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
];*/