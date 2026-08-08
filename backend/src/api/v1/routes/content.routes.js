import { Router } from 'express';
import { getAllContent, getContentByPage, updateContent, updateSection, deleteContent, togglePublish } from '../controllers/content.controller.js';
import { authenticate } from '../../../middleware/auth.middleware.js';
import { authorize } from '../policies/rbac.policy.js';
import { validate } from '../../../middleware/validation.middleware.js';
import { updateContentValidator, pageParamValidator } from '../validators/content.validator.js';

const router = Router();

// Public routes (no auth)
router.get('/', getAllContent);
router.get('/:page', validate(pageParamValidator), getContentByPage);

// Protected routes
router.use(authenticate);

router.put('/', authorize('admin', 'editor'), validate(updateContentValidator), updateContent);
router.put('/:page/:section', authorize('admin', 'editor'), updateSection);
router.delete('/:id', authorize('admin'), deleteContent);
router.patch('/:id/publish', authorize('admin'), togglePublish);

export default router;

