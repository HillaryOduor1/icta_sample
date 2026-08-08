import { Router } from 'express';
import { getAllMedia, uploadMedia, deleteMedia } from '../controllers/media.controller.js';
import { authenticate } from '../../../middleware/auth.middleware.js';
import { authorize } from '../policies/rbac.policy.js';
import { upload } from '../../../infrastructure/storage/upload.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', authorize('admin', 'editor'), getAllMedia);
router.post('/upload', authorize('admin', 'editor'), upload.single('file'), uploadMedia);
router.delete('/:id', authorize('admin'), deleteMedia);

export default router;

