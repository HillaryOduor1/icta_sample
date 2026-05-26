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


/*last stable
const express = require('express');
const router = express.Router();
const mediaController = require('../../controllers/mediaController');
const { protect, authorize } = require('../../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: function(req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|svg|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images and documents are allowed'));
    }
  }
});

router.use(protect);

router.post('/upload', authorize('admin', 'editor'), upload.single('file'), mediaController.uploadMedia);
router.get('/', authorize('admin', 'editor'), mediaController.getAllMedia);
router.delete('/:id', authorize('admin'), mediaController.deleteMedia);

module.exports = router;*/