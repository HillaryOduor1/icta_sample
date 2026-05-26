import { MediaService } from '../services/media.service.js';
import { MediaTransformer } from '../transformers/media.transformer.js';
import { asyncHandler } from '../../../shared/utils/asyncHandler.js';
import { successResponse } from '../../../shared/utils/response.util.js';
import { ValidationError } from '../../../shared/errors/ValidationError.js';

export const getAllMedia = asyncHandler(async (req, res) => {
  const mediaService = new MediaService(req.models.Media, req.models.ActivityLog);
  const media = await mediaService.getAllMedia(req.tenantId);
  const transformed = media.map(m => MediaTransformer.toResponse(m));
  return successResponse(res, 200, 'Media files retrieved', transformed);
});

export const uploadMedia = asyncHandler(async (req, res) => {
  const mediaService = new MediaService(req.models.Media, req.models.ActivityLog);
  if (!req.file) throw new ValidationError('No file uploaded');
  const media = await mediaService.uploadMedia(req.file, req.tenantId, req.user.sub, req.user.username);
  return successResponse(res, 201, 'File uploaded', MediaTransformer.toResponse(media));
});

export const deleteMedia = asyncHandler(async (req, res) => {
  const mediaService = new MediaService(req.models.Media, req.models.ActivityLog);
  await mediaService.deleteMedia(req.params.id, req.tenantId);
  return successResponse(res, 204, 'Media deleted');
});

/*import { MediaService } from '../services/media.service.js';
import { MediaTransformer } from '../transformers/media.transformer.js';
import { asyncHandler } from '../../../shared/utils/asyncHandler.js';
import { successResponse } from '../../../shared/utils/response.util.js';

const mediaService = new MediaService();

export const getAllMedia = asyncHandler(async (req, res) => {
  const media = await mediaService.getAllMedia(req.tenantId);
  const transformed = media.map(m => MediaTransformer.toResponse(m));
  return successResponse(res, 200, 'Media files retrieved', transformed);
});

export const uploadMedia = asyncHandler(async (req, res) => {
  if (!req.file) throw new ValidationError('No file uploaded');
  const media = await mediaService.uploadMedia(req.file, req.tenantId, req.user.sub, req.user.username);
  return successResponse(res, 201, 'File uploaded', MediaTransformer.toResponse(media));
});

export const deleteMedia = asyncHandler(async (req, res) => {
  await mediaService.deleteMedia(req.params.id, req.tenantId);
  return successResponse(res, 204, 'Media deleted');
});*/
/*last stable version
// controllers/mediaController.js
const path = require('path');
const fs = require('fs');

exports.getAllMedia = async (req, res) => {
  console.log('🖼️ [Media] GET');

  try {
    const Media = req.models.Media;

    const media = await Media.find().sort({ createdAt: -1 });

    res.json(media);
  } catch (error) {
    console.error('❌ Media error:', error.stack);
    res.status(500).json({ error: error.message });
  }
};

exports.uploadMedia = async (req, res) => {
  console.log('📤 [Media] UPLOAD');

  try {
    const Media = req.models.Media;
    const ActivityLog = req.models.ActivityLog;

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Create media record in database
    const media = await Media.create({
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      uploadedBy: req.user?.id,
      uploadedByUsername: req.user?.username
    });

    // Log activity
    await ActivityLog.create({
      action: 'media_upload',
      label: `Uploaded file: ${req.file.originalname}`,
      user: req.user?.username
    });

    res.status(201).json(media);
  } catch (error) {
    console.error('❌ Upload media error:', error.stack);
    // If there's an error, delete the uploaded file to avoid orphaned files
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Failed to delete uploaded file after error:', err);
      });
    }
    res.status(500).json({ error: error.message });
  }
};

exports.deleteMedia = async (req, res) => {
  console.log(`🗑️ [Media] DELETE: ${req.params.id}`);

  try {
    const Media = req.models.Media;
    const ActivityLog = req.models.ActivityLog;
    const { id } = req.params;

    const media = await Media.findById(id);
    if (!media) {
      return res.status(404).json({ error: 'Media not found' });
    }

    // Delete the physical file from disk
    const filePath = path.join(__dirname, '..', media.path);
    fs.unlink(filePath, (err) => {
      if (err) console.error('Failed to delete file from disk:', err);
    });

    // Delete database record
    await media.deleteOne();

    // Log activity
    await ActivityLog.create({
      action: 'media_delete',
      label: `Deleted file: ${media.originalName}`,
      user: req.user?.username
    });

    res.json({ message: 'Media deleted successfully' });
  } catch (error) {
    console.error('❌ Delete media error:', error.stack);
    res.status(500).json({ error: error.message });
  }
};*/


/*exports.getAllMedia = async (req, res) => {
  console.log('🖼️ [Media] GET');

  try {
    const Media = req.models.Media;

    const media = await Media.find().sort({ createdAt: -1 });

    res.json(media);

  } catch (error) {
    console.error('❌ Media error:', error.stack);
    res.status(500).json({ error: error.message });
  }
};*/
/*const Media = require('../models/Media');
const ActivityLog = require('../models/ActivityLog');
const path = require('path');
const fs = require('fs').promises;

// Upload media
exports.uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const { originalname, filename, mimetype, size, path: filePath } = req.file;
    
    const media = await Media.create({
      filename,
      originalName: originalname,
      mimeType: mimetype,
      size,
      path: filePath,
      url: `/uploads/${filename}`,
      type: mimetype.startsWith('image/') ? 'image' : 'document',
      uploadedBy: req.user.id,
      metadata: {
        alt: req.body.alt || '',
        caption: req.body.caption || ''
      }
    });

    await ActivityLog.create({
      action: 'media_upload',
      label: 'Media uploaded',
      detail: `File ${originalname} uploaded`,
      user: req.user.username,
      userId: req.user.id
    });
    
    res.status(201).json(media);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all media
exports.getAllMedia = async (req, res) => {
  try {
    const { type, page = 1, limit = 20 } = req.query;
    const query = {};
    if (type) query.type = type;
    
    const media = await Media.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('uploadedBy', 'username');
    
    const total = await Media.countDocuments(query);
    
    res.json({
      media,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete media
exports.deleteMedia = async (req, res) => {
  try {
    const { id } = req.params;
    const media = await Media.findById(id);
    
    if (!media) {
      return res.status(404).json({ error: 'Media not found' });
    }
    
    // Delete file from disk
    try {
      await fs.unlink(media.path);
    } catch (err) {
      console.error('Error deleting file:', err);
    }
    
    await media.remove();

    await ActivityLog.create({
      action: 'media_delete',
      label: 'Media deleted',
      detail: `File ${media.originalName} deleted`,
      user: req.user.username,
      userId: req.user.id
    });
    
    res.json({ message: 'Media deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};*/