import { Router } from 'express';
import { 
  getUsers, 
  getUserById, 
  register,
  getPendingRegistrations,
  approveUser,
  rejectUser,
  createUser, 
  updateUser, 
  deleteUser, 
  toggleUserStatus 
} from '../controllers/user.controller.js';
import { authenticate } from '../../../middleware/auth.middleware.js';
import { authorize } from '../policies/rbac.policy.js';
import { validate } from '../../../middleware/validation.middleware.js';
import { 
  createUserValidator, 
  updateUserValidator, 
  userIdParamValidator,
  registerValidator 
} from '../validators/user.validator.js';

const router = Router();

// PUBLIC ROUTES - No authentication required (must be FIRST)
router.post('/register', validate(registerValidator), register);

// All routes below this require authentication
router.use(authenticate);

// Pending registrations (admin only)
router.get('/pending', 
  authorize('admin'), 
  getPendingRegistrations
);

router.post('/pending/:id/approve', 
  authorize('admin'), 
  validate(userIdParamValidator), 
  approveUser
);

router.post('/pending/:id/reject', 
  authorize('admin'), 
  validate(userIdParamValidator), 
  rejectUser
);

// CRUD operations (admin only)
router.get('/', authorize('admin'), getUsers);
router.get('/:id', authorize('admin'), validate(userIdParamValidator), getUserById);
router.post('/', authorize('admin'), validate(createUserValidator), createUser);
router.put('/:id', authorize('admin'), validate([...userIdParamValidator, ...updateUserValidator]), updateUser);
router.delete('/:id', authorize('admin'), validate(userIdParamValidator), deleteUser);
router.patch('/:id/toggle-status', authorize('admin'), validate(userIdParamValidator), toggleUserStatus);

export default router;
