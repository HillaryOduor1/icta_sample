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
