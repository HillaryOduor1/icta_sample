import { Router } from 'express';
import { submitContact, getMessages, markAsRead, deleteMessage } from '../controllers/contact.controller.js';
import { authenticate } from '../../../middleware/auth.middleware.js';
import { authorize } from '../policies/rbac.policy.js';
import { validate } from '../../../middleware/validation.middleware.js';
import { submitContactValidator } from '../validators/contact.validator.js';

const router = Router();

// Public submit
router.post('/', validate(submitContactValidator), submitContact);

// Admin routes
router.use(authenticate);
router.use(authorize('admin', 'editor'));

router.get('/', getMessages);
router.patch('/:id/read', markAsRead);
router.delete('/:id', deleteMessage);

export default router;
