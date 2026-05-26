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
/*last stable
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../../middleware/auth'); // adjust path if needed
const { getMessages, markAsRead, deleteMessage } = require('../../controllers/admin/contactController');

// All routes require authentication and admin/editor role
router.use(protect);
router.use(authorize('admin', 'editor'));

router.get('/', getMessages);
router.patch('/:id/read', markAsRead);
router.delete('/:id', deleteMessage);

module.exports = router;*/

/*const express = require('express');
const router = express.Router();
const { getMessages, markAsRead, deleteMessage } = require('../../controllers/admin/contactController');
const { authenticate, authorize } = require('../../middleware/auth'); // adjust based on your auth middleware

router.use(authenticate);
router.use(authorize(['admin', 'editor'])); // only admins/editors can view messages

router.get('/', getMessages);
router.patch('/:id/read', markAsRead);
router.delete('/:id', deleteMessage);

module.exports = router;*/